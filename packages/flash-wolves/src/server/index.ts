import http from 'http'
// types
import {
  RuntimeErrorInterceptor,
  FWInterceptors,
  FWRequest, FWResponse, Middleware, MiddlewarePosition,
} from '../types'

// router
import Router from '../router'

// 自带中间件
import {
  defaultOperate, expandHttpRespPrototype, matchRoute, runRoute, printRequest, wrapperRequest,
} from './middleware'

const PORT = 3000
const HOSTNAME = 'localhost'

// 拓展httpResponse的原型
expandHttpRespPrototype(http)

function addInterceptor(interceptorFun: () => Middleware) {
  return async function interceptor(req: FWRequest, res: FWResponse) {
    const interceptor = interceptorFun()
    if (interceptor && typeof interceptor === 'function') {
      await interceptor(req, res)
    }
  }
}

export default class FW extends Router {
    private server: http.Server

    private middleWares: Middleware[]

    private beforeRuntimeErrorInterceptor: RuntimeErrorInterceptor | undefined

    private runtimeErrorInterceptor: RuntimeErrorInterceptor | undefined

    private async catchRuntimeErrorFn(req: FWRequest, res: FWResponse, error: Error) {
      if (!res.writableEnded && this.beforeRuntimeErrorInterceptor) {
        await this.beforeRuntimeErrorInterceptor(req, res, error)
      }
      if (!res.writableEnded && this.runtimeErrorInterceptor) {
        await this.runtimeErrorInterceptor(req, res, error)
      }

      // 兜底处理
      if (!res.writableEnded) {
        res.fail(500, error.toString())
      }
    }

    private async execMiddleware(req: FWRequest, res: FWResponse) {
      for (const middleware of this.middleWares) {
        // 已经执行request.end()
        if (res.writableEnded) {
          return
        }
        // 处理捕获运行时错误
        try {
          const p: any = middleware(req, res)
          if (p instanceof Promise) {
            await p
          }
        } catch (error) {
          await this.catchRuntimeErrorFn(req, res, error)
        }
      }
    }

    private _use(middleware: Middleware, position: MiddlewarePosition = 'last'): void {
      if (position === 'last') {
        this.middleWares.push(addInterceptor(() => middleware))
      }
      if (position === 'first') {
        this.middleWares.unshift(addInterceptor(() => middleware))
      }
    }

    constructor(afterRequestCallback?: Middleware, interceptors?: FWInterceptors) {
      super()
      // 初始化
      this.middleWares = []
      const {
        printReq, beforeMathRoute, beforeRunRoute, beforeReturnRuntimeError, catchRuntimeError,
      } = interceptors || {}
      if (beforeReturnRuntimeError) {
        this.beforeRuntimeErrorInterceptor = beforeReturnRuntimeError
      }
      if (catchRuntimeError) {
        this.runtimeErrorInterceptor = catchRuntimeError
      }
      // 打印请求信息
      this._use(printReq || printRequest)

      // 做一些默认操作
      this._use(defaultOperate)

      // 构造函数
      this._use(afterRequestCallback)

      // 包装request
      this._use(wrapperRequest)

      // 执行路由匹配前
      this._use(beforeMathRoute)
      // 路由匹配
      this._use(matchRoute.bind(this, this._routes))

      // 执行匹配的路由内部逻辑前
      this._use(beforeRunRoute)

      // 执行路由中的逻辑
      this._use(runRoute)

      this.server = http.createServer(this.callback() as any)
    }

    /**
     * 处理原生的httpRequest 与 httpResponse
     */
    public use(middleware: Middleware): void {
      this.middleWares.unshift(addInterceptor(() => middleware))
    }

    public listen(port = PORT, hostname = HOSTNAME, callback?: () => void): void {
      this.server.listen(port, hostname, callback)
      console.log('server start success', `http://${hostname}:${port}`)
    }

    public callback() {
      return async (req: FWRequest, res: FWResponse) => {
        // default config
        this.execMiddleware(req, res)
      }
    }
}

import http from 'http'
// types
import { join } from 'path'
import {
  RuntimeErrorInterceptor,
  FWRequest, FWResponse, Middleware, MiddlewarePosition, AppOptions, AppResponseCompressType,
} from '@/types'

// router
import Router from '@/router'

// 自带中间件
import {
  defaultOperate, expandHttpRespPrototype, matchRoute, runRoute, printRequest, wrapperRequest,
} from './middleware'
import { loadEnv } from '@/utils'

const PORT = 3000
const HOSTNAME = 'localhost'
// 加载环境变量
const MODE = process.env.NODE_ENV || 'development'
const ENV_DIR = process.cwd()
loadEnv({
  mode: MODE,
  envDir: ENV_DIR,
})

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

  private contentEncoding: AppResponseCompressType[]

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

  // 重载配置
  constructor();

  constructor(afterRequest?: Middleware);

  constructor(options?: AppOptions);

  constructor(afterRequest?: Middleware, options?: AppOptions);

  constructor(v1?: Middleware | AppOptions, v2?: AppOptions) {
    super()
    // 初始化
    this.middleWares = []
    const {
      printReq, beforeMathRoute, beforeRunRoute,
      beforeReturnRuntimeError, catchRuntimeError,
      afterRequest,
      compress,
    } = (typeof v1 !== 'function' ? v1 : v2) || {}

    if (typeof compress !== 'boolean') {
      this.contentEncoding = [compress || 'gzip'].flat()
    } else {
      this.contentEncoding = compress ? ['gzip'] : []
    }

    if (beforeReturnRuntimeError) {
      this.beforeRuntimeErrorInterceptor = beforeReturnRuntimeError
    }
    if (catchRuntimeError) {
      this.runtimeErrorInterceptor = catchRuntimeError
    }
    // 打印请求信息
    this._use(printReq || printRequest)

    // 做一些默认操作
    this._use(defaultOperate.bind(this, { contentEncoding: this.contentEncoding }))

    // 构造函数
    this._use(typeof v1 === 'function' ? v1 : afterRequest)

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

  public addController(controllers: any | any[]) {
    controllers = [controllers].flat()
    for (const controller of controllers) {
      const constructor = controller?.name ? controller : controller.__proto__.constructor
      const prefix = constructor._prefix
      const { routeMap } = constructor
      const name = constructor?.name || 'controller'

      if (!routeMap) {
        console.error(`${name} is not valid`)
        return
      }
      for (const [_, route] of routeMap) {
        route.path = join(prefix, route.path)
        this._routes.push(route)
      }
    }
  }

  /**
   * 处理原生的httpRequest 与 httpResponse
   */
  public use(middleware: Middleware): void {
    this.middleWares.unshift(addInterceptor(() => middleware))
  }

  public listen(port?: number, hostname?: string, callback?: () => void): void {
    port = port || PORT
    hostname = hostname || HOSTNAME
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

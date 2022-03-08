import nodeUrl from 'url'
import qs from 'querystring'
import { ServerOptions } from 'http'
import { brotliCompressSync, deflateSync, gzipSync } from 'zlib'
import {
  FWRequest, FWResponse, Route, CodeMsg, AppResponseCompressType,
} from '../../types'

enum ContentType {
  formData = 'application/x-www-form-urlencoded',
  jsonData = 'application/json',
  multipart = 'multipart/form-data'
}

/**
 * 打印请求信息
 */
export function printRequest(req: FWRequest): void {
  const { method, url } = req
  const urlInfo = nodeUrl.parse(url)
  console.log(`${method} ${urlInfo.pathname}`)
}

export async function wrapperRequest(req: FWRequest): Promise<void> {
  requestQuery(req)
  req.body = await getBodyContent(req)
}

/**
 * 回调模板
 */
function Result(code: number, errMsg: string, data?: unknown) {
  this.code = code
  this.data = data
  this.msg = errMsg
}

const compressFn = {
  br: brotliCompressSync,
  gzip: gzipSync,
  deflate: deflateSync,
}

export function expandHttpRespPrototype(http: ServerOptions): void {
  const resp: any = http.ServerResponse.prototype
  resp.notFound = function notFound() {
    const _this:FWResponse = this
    _this.statusCode = 404
    _this.end(JSON.stringify({
      code: 404,
      msg: 'not found',
    }))
  }

  resp.json = function json(data) {
    const _this:FWResponse = this
    if (!resp.writableEnded) {
      const v = JSON.stringify(data)
      // 压缩数据
      if (_this.contentEncoding) {
        _this.setHeader('Content-Encoding', _this.contentEncoding)
        _this.end(compressFn[_this.contentEncoding](Buffer.from(v)))
        return
      }

      _this.end(v)
    }
  }

  resp.success = function success(data?) {
    this.json(new Result(0, 'ok', data))
  }

  resp.fail = function success(code, msg, data) {
    this.json(new Result(code, msg, data))
  }

  resp.failWithError = function failWithError(err) {
    this.fail(err.code, err.msg)
  }
}

const methodMap = {
  'fw-404': 'notFound',
  'fw-json': 'json',
  'fw-success': 'success',
  'fw-fail': 'fail',
  'fw-failWithError': 'failWithError',
}

// TODO:实现返回数据预览
export class Response {
  static notFound(): unknown {
    return {
      'fw-type': methodMap['fw-404'],
      data: [],
    }
  }

  static json(data: unknown): unknown {
    return {
      type: methodMap['fw-json'],
      data: [data],
    }
  }

  static success(data: unknown): unknown {
    return {
      type: methodMap['fw-success'],
      data: [data],
    }
  }

  static fail(code: number, msg: string, data?: unknown): unknown {
    return {
      type: methodMap['fw-fail'],
      data: [code, msg, data],
    }
  }

  static failWithError(err: CodeMsg): unknown {
    return {
      type: methodMap['fw-failWithError'],
      data: [err],
    }
  }
}

export function matchRoute(routes: Route[], req: FWRequest, res: FWResponse): void {
  const route = _matchRoute(routes, req)
  // TODO: 改造成支持多路由next
  if (route) {
    req.route = route
    return
  }
  res.notFound()
}

export async function runRoute(req: FWRequest, res: FWResponse) {
  const { callback } = req.route || {}
  const result = await (callback && callback(req, res))
  if (!res.writableEnded) {
    if (typeof result === 'object' && result !== null && typeof res[result?.type] === 'function') {
      res[result?.type](...result.data)
      return result
    }
    res.success(result)
  }
  return result
}

interface DefaultOptions {
  contentEncoding: AppResponseCompressType[]
}

export function defaultOperate(options: DefaultOptions, req: FWRequest, res: FWResponse) {
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // 记录压缩内容
  const acceptEncoding = req.headers['accept-encoding'] as string
  const allowEncoding = acceptEncoding.match(/(br|deflate|gzip)/g) || []
  const compressType = options.contentEncoding.find((v) => allowEncoding.includes(v))
  if (compressType) {
    res.contentEncoding = compressType
  }
}

function _matchRoute(routes: Route[], req: FWRequest): Route {
  const { method: reqMethod, url: reqPath } = req
  const route = routes.find((route) => {
    const { path, method } = route
    // 方法不匹配
    if (reqMethod.toLowerCase() !== method) {
      return false
    }

    const { params, ok } = matchReqPath(path, nodeUrl.parse(reqPath).pathname)
    if (ok) {
      req.params = params
    }
    return ok
  })
  return route
}

/**
 * TODO: ddl 2020-1-10 待优化
 * 路由匹配
 */
function matchReqPath(path: string, reqPath: string) {
  const rParams = /\/:(\w+)/g
  // url参数组
  const paramsArr: string[] = []
  path = path.replace(rParams, (_all, p1) => {
    paramsArr.push(p1)
    return '/(\\w+)'
  })
  let params = {}
  let ok = false
  // 处理路由开头没有/的情况
  const r = new RegExp(`^${path.startsWith('/') ? '' : '\\/'}${path}$`)
  if (r.test(reqPath)) {
    reqPath.replace(r, (...rest) => {
      params = paramsArr.reduce((pre, cuur, cuurIndex) => {
        pre[cuur] = rest[cuurIndex + 1]
        return pre
      }, {})
      return rest[0]
    })
    ok = true
  }
  return {
    params,
    ok,
  }
}

/**
 * 获取url参数
 */
function requestQuery(req: FWRequest): void {
  const { query } = nodeUrl.parse(req.url)
  Object.assign(req, { query: qs.parse(query) })
}

/**
 * 获取请求体
 */
function getBodyContent(req: FWRequest) {
  return new Promise((resolve) => {
    let buffer = Buffer.alloc(0)

    req.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
    })

    req.on('end', () => {
      const contentType = req.headers['content-type'] || ''
      let data = {}
      try {
        switch (true) {
          case contentType.includes(ContentType.formData):
            data = qs.parse(buffer.toString('utf-8') || '{}')
            break
          case contentType.includes(ContentType.jsonData):
            data = JSON.parse(buffer.toString('utf-8') || '{}')
            break
          default:
            data = buffer
            break
        }
      } catch (error) {
        console.error(error)
        data = buffer
      } finally {
        req.buffer = buffer
        resolve(data)
      }
    })
  })
}

import { IncomingMessage, ServerResponse } from 'http'

interface CodeMsg {
    code: number
    msg: string
}

type reqJson = (data: unknown) => void
type reqNotFound = () => void
type reqSuccess = (data?: unknown) => void
type reqFail = (code: number, msg: string, data?: unknown) => void
type failWithError = (err: CodeMsg) => void

export interface SuperRequest {
    query?: any
    body?: any
    params?: any
    buffer: Buffer
    route?: Route
}
export interface SuperResponse {
    json: reqJson
    notFound: reqNotFound
    success: reqSuccess
    fail: reqFail
    failWithError: failWithError
}

export interface FWRequest extends IncomingMessage, SuperRequest { }

export interface FWResponse extends ServerResponse, SuperResponse { }

export type Middleware = (req: FWRequest, res?: FWResponse) => void
export type MiddlewarePosition = 'first' | 'last'
export type Callback = (req: FWRequest, res: FWResponse) => void

export type Method = 'get' | 'post' | 'put' | 'delete' | 'option'

export interface Route {
    method: Method
    path: string
    callback: Callback
    options?: any
}

export type Controller = (path: string, callback: Callback, options?: any) => void
export type RuntimeErrorInterceptor = (req: FWRequest, res: FWResponse, err:Error)=>void

export interface FWInterceptors{
    /**
     * 打印Request获取到的是原生的HttpRequest
     */
    printReq?:(req:FWRequest)=>void
    /**
     * 执行路由匹配前，获取到的是包装后的req与res
     */
    beforeMathRoute?:Middleware
    /**
     * 执行路由内部逻辑之前
     */
    beforeRunRoute?:Middleware
    /**
     * 捕获运行错误，返回错误信息之前
     */
    beforeReturnRuntimeError?:RuntimeErrorInterceptor
    /**
     * 处理运行时捕获的错误
     */
    catchRuntimeError?:RuntimeErrorInterceptor
}

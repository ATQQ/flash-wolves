import { MetaData } from '@/store'
import type { Method, FWRequest, FWResponse, RouteMeta } from '@/types'
import { IClassData } from './type'

export function RouterController(prefix?: string, routeMeta?: RouteMeta) {
  return function routerDecorators(target) {
    MetaData.set<IClassData>('class', target, {
      prefix,
      meta: routeMeta
    })
  }
}

/**
 * 获取HTTP Request 上的指定键的值
 * @param key 键名
 */
export function RequestValue(key: string) {
  return function requestParamDecorators(
    target,
    fnName: string,
    paramIdx: number
  ) {
    const { constructor } = target
    // 获取存储数据的Map
    const { requestParamsMap } = MetaData.get<IClassData>('class', constructor)

    // 初始化一个对象
    if (!requestParamsMap.has(key)) {
      requestParamsMap.set(key, {})
    }
    // 获取xx参数
    const fnNameWithParamIdxArr = requestParamsMap.get(key)

    if (!fnNameWithParamIdxArr[fnName]) {
      fnNameWithParamIdxArr[fnName] = []
    }

    // 存放取值参数位置
    fnNameWithParamIdxArr[fnName].push(paramIdx)
  }

  // 数据存储结构示例
  // {
  //   'body':{
  //     'sayHello':[0],
  //     'test2':[0,1]
  //   },
  //   'key':{fnName:[paramNumber]}
  // }
}
/**
 * 获取HTTP Request Query上指定键的值
 * @param key
 */
export function ReqQuery(key?: string) {
  const base = 'query'
  return RequestValue(key ? `${base}.${key}` : base)
}

/**
 * 获取HTTP Request Body上的指定键的值
 * @param key
 */
export function ReqBody(key?: string) {
  const base = 'body'
  return RequestValue(key ? `${base}.${key}` : base)
}

/**
 * 获取指定路由参数
 * @param key
 */
export function ReqParams(key?: string) {
  const base = 'params'
  return RequestValue(key ? `${base}.${key}` : base)
}

export function RouteMapping(method: Method, path: string, meta?: RouteMeta) {
  return function routeDecorators(target, key, descriptor) {
    if (typeof target[key] !== 'function') {
      throw new TypeError('not function')
    }

    // 原来的函数
    const fn = descriptor.value
    const { routeMap, requestParamsMap } = MetaData.get<IClassData>(
      'class',
      target.constructor
    )
    routeMap.set(`${method}-${path}`, {
      method,
      path,
      callback: (req: FWRequest, res: FWResponse) => {
        const argv = Array.from({ length: fn.length })
        // 修改参数
        for (const [param, fnNameWithIndx] of requestParamsMap.entries()) {
          const pPaths = param.split('.')
          const value = pPaths.reduce((pre, p) => pre?.[p], req) ?? null
          const pIdxArr = fnNameWithIndx[fn.name] || []
          for (const idx of pIdxArr) {
            argv[idx] = value
          }
        }

        // 最后两个 使用req,res 作为默认参数
        let lastUndefinedIdx = argv.length
        while (lastUndefinedIdx >= 1) {
          if (argv[lastUndefinedIdx - 1] !== undefined) {
            break
          }
          lastUndefinedIdx -= 1
        }
        argv[lastUndefinedIdx] = req
        argv[lastUndefinedIdx + 1] = res

        // 执行原来的调用
        // 将req于res绑定到函数额this上
        const _t = { _ctx: { req, res } }
        Object.setPrototypeOf(_t, target)
        return fn.apply(_t, argv)
      },
      meta
    })
  }
}

export function GetMapping(path, meta?: RouteMeta) {
  return RouteMapping('get', path, meta)
}

export function PostMapping(path, meta?: RouteMeta) {
  return RouteMapping('post', path, meta)
}

export function DeleteMapping(path, meta?: RouteMeta) {
  return RouteMapping('delete', path, meta)
}

export function PutMapping(path, meta?: RouteMeta) {
  return RouteMapping('put', path, meta)
}

export function Get(path, meta?: RouteMeta) {
  return RouteMapping('get', path, meta)
}

export function Post(path, meta?: RouteMeta) {
  return RouteMapping('post', path, meta)
}

export function Delete(path, meta?: RouteMeta) {
  return RouteMapping('delete', path, meta)
}

export function Put(path, meta?: RouteMeta) {
  return RouteMapping('put', path, meta)
}

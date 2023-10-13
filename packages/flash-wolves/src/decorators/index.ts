import { MetaData } from '@/store'
import type { Method, FWRequest, FWResponse, RouteMeta } from '@/types'
import { IClassData, IGlobalData } from './type'
import { reqCtxKey } from '@/utils'
import Logger from '@/utils/logger'

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

export const globalDataKey = Symbol('provideKey')

export function Provide(key?: any) {
  return function provideDecorators(Target: any) {
    MetaData.get<IGlobalData>('global', globalDataKey).provideValuesMap.set(
      key || Target,
      (values) => {
        const instance = new Target()

        return new Proxy(instance, {
          get(target, propKey) {
            const originalMethod = target[propKey]
            if (typeof originalMethod === 'function') {
              return function (...args) {
                return originalMethod.apply(
                  getInjectThis(instance, values),
                  args
                )
              }
            }
            return originalMethod
          }
        })
      }
    )
  }
}

const injectCtxKey = Symbol.for('injectCtxKey')
const inlineKey = [injectCtxKey]

export function InjectCtx() {
  return Inject(injectCtxKey)
}
export function Inject(key?: any) {
  if (key === undefined) {
    Logger.trace('Inject key is undefined')
  }
  return function injectDecorators(target, _key) {
    const { injectValuesMap } = MetaData.get<IClassData>(
      'class',
      target.constructor
    )
    key = key || _key

    if (!injectValuesMap.has(key)) {
      injectValuesMap.set(key, [])
    }
    injectValuesMap.get(key).push(_key)

    // 存储结构示例
    // injectKey => [field1,field2]
  }
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

        // provide 逻辑
        const provideValues = getProvideValues()
        provideValues.set(injectCtxKey, {
          req,
          res,
          // others
          ...req[reqCtxKey]
        })

        // TODO: provide里面的inject 怎么处理？
        // inject 逻辑
        const _t: any = getInjectThis(target, provideValues)

        // 执行原来的调用
        return fn.apply(_t, argv)
      },
      meta
    })
  }
}

function getProvideValues() {
  return new Map(
    MetaData.get<IGlobalData>(
      'global',
      globalDataKey
    ).provideValuesMap.entries()
  )
}
function getInjectThis(target, provideValues: Map<any, any>) {
  const { constructor } = target
  const { injectValuesMap } = MetaData.get<IClassData>('class', constructor)

  const _t: any = {}
  for (const [injectKey, targets] of injectValuesMap.entries()) {
    targets.forEach((targetKey) => {
      if (inlineKey.includes(injectKey)) {
        _t[targetKey] = provideValues.get(injectKey)
      } else {
        _t[targetKey] = provideValues.get(injectKey)?.(provideValues)
      }
    })
  }

  Object.setPrototypeOf(_t, target)
  return _t
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

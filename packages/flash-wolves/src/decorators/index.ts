import type { Method, FWRequest, FWResponse } from '../types'

export function RouterController(prefix = '') {
  return function routerDecorators(target) {
    target._prefix = prefix
  }
}

/**
 * 获取HTTP Request 上的指定键的值
 * @param key 键名
 */
export function RequestValue(key:keyof FWRequest) {
  return function requestParamDecorators(target, fnName:string, paramIdx:number) {
    // 初始化一个Map 存储映射数据 reqKey => fnNameWithParamIdxArr
    // 挂在构造函数上
    if (!target.constructor.requestParamsMap) {
      target.constructor.requestParamsMap = new Map()
    }

    // 获取存储数据的Map
    const { requestParamsMap } = target.constructor

    // 初始化一个对象
    if (!requestParamsMap.get(key)) {
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
  //   }
  // }
}

export function ReqQuery(target, name, idx) {
  return RequestValue('query')(target, name, idx)
}

export function ReqBody(target, name, idx) {
  return RequestValue('body')(target, name, idx)
}

export function ReqParams(target, name, idx) {
  return RequestValue('params')(target, name, idx)
}

export function RouteMapping(method: Method, path: string, options?: any) {
  return function routeDecorators(target, key, descriptor) {
    if (typeof target[key] !== 'function') {
      throw new TypeError('not function')
    }

    if (!target.constructor.routeMap) {
      target.constructor.routeMap = new Map()
    }
    if (!target.constructor.requestParamsMap) {
      target.constructor.requestParamsMap = new Map()
    }
    const { requestParamsMap } = target.constructor

    // 原来的函数
    const fn = descriptor.value

    target.constructor.routeMap.set(`${method}-${path}`, {
      method,
      path,
      callback: (req:FWRequest, res:FWResponse) => {
        const argv = Array.from({ length: fn.length })
        // 修改参数
        for (const [param, fnNameWithIndx] of requestParamsMap.entries()) {
          const value = req[param]
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
        return fn.apply(target, argv)
      },
      options,
    })
  }
}

export function GetMapping(path, options?: any) {
  return RouteMapping('get', path, options)
}

export function PostMapping(path, options?: any) {
  return RouteMapping('post', path, options)
}

export function DeleteMapping(path, options?: any) {
  return RouteMapping('delete', path, options)
}

export function PutMapping(path, options?: any) {
  return RouteMapping('put', path, options)
}

export function Get(path, options?: any) {
  return RouteMapping('get', path, options)
}

export function Post(path, options?: any) {
  return RouteMapping('post', path, options)
}

export function Delete(path, options?: any) {
  return RouteMapping('delete', path, options)
}

export function Put(path, options?: any) {
  return RouteMapping('put', path, options)
}

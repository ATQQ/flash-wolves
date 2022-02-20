import type { Method } from '../types'

export function RouterController(prefix = '') {
  return function routerDecorators(target) {
    target._prefix = prefix
  }
}

export function RouteMapping(method: Method, path: string, options?: any) {
  return function routeDecorators(target, key, descriptor) {
    if (typeof target[key] !== 'function') {
      throw new TypeError('not function')
    }

    if (!target.constructor.routeMap) {
      target.constructor.routeMap = new Map()
    }

    target.constructor.routeMap.set(`${method}-${path}`, {
      method,
      path,
      callback: descriptor.value.bind(target),
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

export function DelMapping(path, options?: any) {
  return RouteMapping('delete', path, options)
}

export function PutMapping(path, options?: any) {
  return RouteMapping('put', path, options)
}

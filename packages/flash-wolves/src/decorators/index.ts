import path from 'path'
import type { Method, Route } from '../types'

export function RouterController(prefix = '') {
  return function routerDecorators(target) {
    target.prototype._prefix = prefix
    target.prototype.getRoutes = function getRoutes() {
      const keys: string[] = Object.keys(this.__proto__)
      const prefix = this._prefix ?? ''
      const routes = keys.reduce<Route[]>((pre, k) => {
        const { _route } = this[k]
        if (_route) {
          _route.path = path.join(prefix, _route.path)
          pre.push(_route)
        }
        return pre
      }, [])
      return routes
    }
  }
}

export function RouteMapping(method: Method, path: string, options?: any) {
  return function routeDecorators(target, key, descriptor) {
    if (typeof target[key] !== 'function') {
      throw new TypeError('not function')
    }
    const fn = descriptor.value
    target[key]._route = {
      method,
      path,
      // 避免循环引用
      callback: fn.bind(this),
      options,
    }
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

export class FwController {
  _prefix?: string

  getRoutes:() => Route[]
}

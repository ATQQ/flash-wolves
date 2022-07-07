import type { Callback, Method, Route, Controller, RouteMeta } from '@/types'
import { pathJoin } from '@/utils'

class Router {
  private _prefix: string

  private _meta: RouteMeta

  private controller(method: Method): Controller {
    return this.registerRoute.bind(this, method)
  }

  protected _routes: Route[]

  constructor(prefix?: string, meta?: RouteMeta) {
    this._prefix = prefix || ''
    this._routes = []
    this._meta = meta
  }

  public registerRoute(
    method: Method,
    path: string,
    callback: Callback,
    meta?: RouteMeta
  ) {
    const routeMeta = {
      ...this._meta,
      ...meta
    }
    this.addRoute({
      method,
      path: pathJoin(this._prefix, path),
      callback,
      meta: routeMeta
    })
  }

  public addRoute(route: Route): void {
    this._routes.push(route)
  }

  public addRoutes(routes: Route[]): void {
    if (Array.isArray(routes)) {
      this._routes.push(...routes)
    }
  }

  public addRouter(router: Router | Router[]) {
    ;[router].flat().forEach((r) => {
      this.addRoutes(r.getRoutes())
    })
  }

  public get = this.controller('get')

  public post = this.controller('post')

  public delete = this.controller('delete')

  public put = this.controller('put')

  public patch = this.controller('patch')

  public head = this.controller('head')

  public options = this.controller('options')

  public getRoutes(): Route[] {
    return this._routes
  }

  get routes() {
    return this._routes.map((v) => [`${v.method.toUpperCase()}`, `${v.path}`])
  }
}

export default Router

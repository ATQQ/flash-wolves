// types
import nodePath from 'path'
import {
  Callback, Method, Route, Controller,
} from 'types'

class Router {
    private _prefix: string

    private controller(method: Method): Controller {
      return this.registerRouter.bind(this, method)
    }

    protected _routes: Route[]

    constructor(prefix = '') {
      this._prefix = prefix
      this._routes = []
    }

    public registerRouter(method: Method, path: string, callback: Callback, options?: unknown) {
      if (options) {
        this.addRoute({
          method, path: nodePath.join(this._prefix, path), callback, options,
        })
        return
      }
      this.addRoute({ method, path: nodePath.join(this._prefix, path), callback })
    }

    public addRoute(route: Route): void {
      this._routes.push(route)
    }

    public addRoutes(routes: Route[]): void {
      this._routes.push(...routes)
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
}

export default Router

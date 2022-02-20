/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { join } from 'path'
import type {
  Callback, Method, Route, Controller,
} from '../types'

class Router {
  private _prefix: string

  private controller(method: Method): Controller {
    return this.registerRoute.bind(this, method)
  }

  protected _routes: Route[]

  constructor(prefix = '') {
    this._prefix = prefix
    this._routes = []
  }

  public registerRoute(method: Method, path: string, callback: Callback, options?: unknown) {
    if (options) {
      this.addRoute({
        method, path: join(this._prefix, path), callback, options,
      })
      return
    }
    this.addRoute({ method, path: join(this._prefix, path), callback })
  }

  public addRoute(route: Route): void {
    this._routes.push(route)
  }

  public addRoutes(routes: Route[]): void {
    if (Array.isArray(routes)) {
      this._routes.push(...routes)
    }
  }

  public addRouter(router:Router|Router[]) {
    [router].flat().forEach((r) => {
      this.addRoutes(r.getRoutes())
    })
  }

  // public setControllerDir(dir:string|string[]) {
  //   const dirs = [dir].flat()
  //   for (const d of dirs) {
  //     const files = readdirSync(d, { withFileTypes: true })
  //     for (const file of files) {
  //       if (file.isFile()) {
  //         this.addController(require(join(d, file.name)))
  //       }
  //     }
  //   }
  // }

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

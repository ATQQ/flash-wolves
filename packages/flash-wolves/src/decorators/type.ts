import { FWRequest, FWResponse } from 'packages/flash-wolves/dist'
import { Method } from '@/types'

type RouteConfig = Record<string, any>

export interface IRoute {
  method: Method
  path: string
  callback: (req: FWRequest, res: FWResponse) => any
  routeConfig?: RouteConfig
}

export interface IClassData {
  prefix?: string
  routeConfig?: RouteConfig
  routeMap?: Map<string, IRoute>
}

import { Route, RouteMeta } from '@/types'

export type IRoute = Route

export interface IMetaParams {
  [fnName: string]: number[]
}
export interface IClassData {
  prefix?: string
  meta?: RouteMeta
  routeMap?: Map<string, IRoute>
  requestParamsMap?: Map<string, IMetaParams>
  injectValuesMap?: Map<any, string[]>
}

export interface IGlobalData {
  provideValuesMap?: Map<any, any>
}

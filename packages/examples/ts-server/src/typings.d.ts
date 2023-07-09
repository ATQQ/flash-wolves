import 'flash-wolves'

declare module 'flash-wolves' {
  interface RouteMeta {
    // 需要管理员权限
    isAdmin?: boolean
    // 需要鉴权
    requiresAuth?: boolean
  }
  interface Context {
    userInfo?: string
  }
}

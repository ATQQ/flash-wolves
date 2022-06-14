import { IClassData } from '@/decorators/type'

// TODO:待完善，剩余使用场景
type metaType = 'class' | 'Function' | 'param'

function getDefaultData(type: metaType) {
  const classData: IClassData = {
    routeMap: new Map(),
    requestParamsMap: new Map(),
    prefix: '',
    meta: {}
  }
  if (type === 'class') {
    return classData
  }
  return undefined
}
export default class MetaData {
  private static classMap = new WeakMap()

  static get<T = any>(type: metaType, target: any): Partial<T>

  static get<T = any>(type: metaType, target: any, key?: keyof T): T[keyof T]

  static get<T = any>(type: metaType, target: any, key?: keyof T) {
    if (type === 'class') {
      // 取数据的时候不存在直接初始化
      if (!MetaData.classMap.has(target)) {
        MetaData.init<IClassData>('class', target, getDefaultData('class'))
      }
      // 取数逻辑
      return key
        ? MetaData.classMap.get(target)[key]
        : MetaData.classMap.get(target)
    }
    return undefined
  }

  static set<T = any>(type: metaType, target: any, value: Partial<T>) {
    if (type === 'class') {
      MetaData.classMap.set(target, {
        ...MetaData.get('class', target),
        ...value
      })
    }
  }

  private static init<T = any>(type: metaType, target: any, value: T) {
    if (type === 'class') {
      MetaData.classMap.set(target, {
        ...value
      })
    }
  }
}

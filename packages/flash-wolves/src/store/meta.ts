import { IClassData, IGlobalData } from '@/decorators/type'

// TODO:待完善，剩余使用场景
type metaType = 'class' | 'Function' | 'param' | 'global'

function getDefaultData(type: metaType) {
  const classData: IClassData = {
    routeMap: new Map(),
    requestParamsMap: new Map(),
    injectValuesMap: new Map(),
    prefix: '',
    meta: {}
  }
  const globalData: IGlobalData = {
    provideValuesMap: new Map()
  }
  if (type === 'class') {
    return classData
  }
  if (type === 'global') {
    return globalData
  }
  return undefined
}
class MetaData {
  private classMap: Map<any, any>

  private globalMap: Map<any, any>

  static getInstance() {
    if (!global[Symbol.for('MetaData')]) {
      global[Symbol.for('MetaData')] = new MetaData()
    }
    return global[Symbol.for('MetaData')]
  }

  private constructor() {
    this.classMap = new Map()
    this.globalMap = new Map()
  }

  get<T = any>(type: metaType, target: any): Partial<T>

  get<T = any>(type: metaType, target: any, key?: keyof T): T[keyof T]

  get<T = any>(type: metaType, target: any, key?: keyof T) {
    if (type === 'class') {
      // 取数据的时候不存在直接初始化
      if (!this.classMap.has(target)) {
        this.init<T>(type, target, getDefaultData('class') as T)
      }
      // 取数逻辑
      return key ? this.classMap.get(target)[key] : this.classMap.get(target)
    }
    if (type === 'global') {
      if (!this.globalMap.has(target)) {
        this.init<T>(type, target, getDefaultData('global') as T)
      }
      return key ? this.globalMap.get(target)[key] : this.globalMap.get(target)
    }
    return undefined
  }

  set<T = any>(type: metaType, target: any, value: Partial<T>) {
    if (type === 'class') {
      this.classMap.set(target, {
        ...this.get('class', target),
        ...value
      })
    }
    if (type === 'global') {
      this.globalMap.set(target, {
        ...this.get('global', target),
        ...value
      })
    }
  }

  private init<T = any>(type: metaType, target: any, value: T) {
    if (type === 'class') {
      this.classMap.set(target, {
        ...value
      })
    }
    if (type === 'global') {
      this.globalMap.set(target, {
        ...value
      })
    }
  }
}

export default MetaData.getInstance()

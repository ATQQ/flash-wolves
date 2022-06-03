type metaType = 'class' | 'Function' | 'param'
export default class MetaData {
  private static classMap = new WeakMap()

  static get<T = any>(type: metaType, target: any): Partial<T> {
    if (type === 'class') {
      return MetaData.classMap.get(target)
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
}

import {
  RouterController, GetMapping,
} from 'flash-wolves'

import type { FWRequest, FWResponse } from 'flash-wolves'

@RouterController()
export default class User {
  @GetMapping('abc/abc/:a', { power: 'ok' })
  hello(req:FWRequest, res:FWResponse) {
    console.log(req.query)
    console.log(req.params)
    this.test()
    User.test2()
    res.success()
  }

  test() {
    console.log('test1')
  }

  static test2() {
    console.log('test2')
  }
}

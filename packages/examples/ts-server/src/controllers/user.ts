import {
  RouterController, GetMapping,
} from 'flash-wolves'

import type { FWRequest, FWResponse } from 'flash-wolves'

@RouterController('user')
export default class User {
  @GetMapping('info/:id', { power: 'ok' })
  hello(req:FWRequest, res:FWResponse) {
    console.log(req.params)
    res.success()
  }
}

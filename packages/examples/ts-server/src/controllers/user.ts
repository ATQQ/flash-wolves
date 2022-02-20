import {
  RouterController, Get, ReqQuery,
} from 'flash-wolves'

import type { FWRequest, FWResponse } from 'flash-wolves'

@RouterController('user')
export default class User {
  @Get('info/:id', { power: 'ok' })
  getUserInfo(@ReqQuery query, req:FWRequest, res:FWResponse) {
    console.log(query)
    return req.params
  }
}

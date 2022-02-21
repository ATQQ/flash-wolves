import {
  RouterController, Get, ReqQuery, ReqParams,
} from 'flash-wolves'

@RouterController('user')
export default class User {
  @Get('info/:id', { power: 'ok' })
  getUserInfo(@ReqQuery query, @ReqParams params) {
    console.log(query, params)
    return query
  }
}

import {
  RouterController, Get, ReqQuery, ReqParams, Post, ReqBody,
} from 'flash-wolves'

@RouterController('user')
export default class User {
  @Get('info/:id', { power: 'ok' })
  getUserInfo(@ReqQuery query, @ReqParams params) {
    console.log(query, params)
    return query
  }

  @Post('login')
  login(@ReqBody body) {
    console.log(body)
    return body
  }
}

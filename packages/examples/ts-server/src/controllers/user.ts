import {
  RouterController,
  Get,
  ReqQuery,
  ReqParams,
  Post,
  ReqBody
} from 'flash-wolves'

@RouterController('user', { power: 'ok' })
export default class User {
  @Get('info/:id', { user: '33' })
  getUserInfo(
    @ReqQuery() query,
    @ReqParams() params,
    @ReqParams('id') id,
    @ReqQuery('search') search: string
  ) {
    console.log(query, params, id, search)
    return query
  }

  @Post('login')
  login(
    @ReqBody() body,
    @ReqBody('search') search: string,
    @ReqBody('info.id') id: number
  ) {
    console.log(body, search, id, typeof id)
    return body
  }
}

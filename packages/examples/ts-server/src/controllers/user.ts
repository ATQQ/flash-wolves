import {
  RouterController,
  Get,
  ReqQuery,
  ReqParams,
  Post,
  ReqBody,
  FWResponse,
  FWRequest,
  Response
} from 'flash-wolves'

@RouterController('user', { power: 'ok' })
export default class User {
  @Get('info/:id', { user: '33' })
  getUserInfo(
    @ReqQuery() query,
    @ReqParams() params,
    @ReqParams('id') id,
    @ReqQuery('search') search: string
    // req: FWRequest,
    // res: FWResponse
  ) {
    console.log(query, params, id, search)
    // console.log(this.ctx)
    // res.plain('<h1>Hello World</h1>', 'text/html')
    // return Response.plain('123')
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

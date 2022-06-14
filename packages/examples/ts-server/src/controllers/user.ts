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

@RouterController('user', { requiresAuth: true })
export default class User {
  private hello() {
    console.log('hello')
  }

  @Get('info/:id', { isAdmin: true })
  getUserInfo(
    @ReqQuery() query,
    @ReqParams() params,
    @ReqParams('id') id,
    @ReqQuery('search') search: string
    // req: FWRequest,
    // res: FWResponse
  ) {
    this.hello()
    console.log(query, params, id, search)
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

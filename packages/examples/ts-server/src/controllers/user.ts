import {
  RouterController,
  Get,
  ReqQuery,
  ReqParams,
  Post,
  ReqBody,
  InjectCtx,
  Inject,
  Context
} from 'flash-wolves'
import TestService from '../services/Test'

@RouterController('user', { requiresAuth: true })
export default class User {
  private hello() {
    console.log('hello', this.ctx.req.url)
  }

  @Inject(TestService)
  private test: TestService

  @InjectCtx()
  private ctx: Context

  @Get('info/:id', { isAdmin: true })
  getUserInfo(
    @ReqQuery() query,
    @ReqParams() params,
    @ReqParams('id') id,
    @ReqQuery('search') search: string
    // req: FWRequest,
    // res: FWResponse
  ) {
    this.test.hello()
    this.hello()
    console.log('userInfo', this.ctx.userInfo)

    console.log(query, params, id, search)
    // res.plain('<h1>Hello World</h1>', 'text/html')
    // return Response.plain('123')
    return {
      query,
      params
    }
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

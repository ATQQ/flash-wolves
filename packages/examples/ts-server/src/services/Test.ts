import { Provide, Context } from 'flash-wolves'
import { Inject, InjectCtx } from 'packages/flash-wolves/dist'
import TestService2 from './Test2'

@Provide()
export default class TestService {
  @InjectCtx()
  context: Context

  @Inject(TestService2)
  testService2: TestService2

  hello() {
    this.sayHello()
    this.testService2.hello()
  }

  sayHello() {
    console.log('hello TestService', this.context.req.url)
  }
}

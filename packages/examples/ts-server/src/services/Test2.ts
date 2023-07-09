import { Provide } from 'flash-wolves'
import { InjectCtx } from 'packages/flash-wolves/dist'

@Provide()
export default class TestService2 {
  @InjectCtx()
  context

  hello() {
    this.sayHelle()
  }

  sayHelle() {
    console.log('hello TestService2', this.context.req.url)
  }
}

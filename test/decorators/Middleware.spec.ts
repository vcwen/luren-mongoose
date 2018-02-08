import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Middleware, Middlewares } from '../../src/decorators/Middleware'

describe('Middleware', () => {
  it('should return decorator function when schema options is set', () => {
    const middleware = async () => {
      console.log('ok')
    }
    @Middleware({
      phase: 'post',
      method: 'validate',
      fn: middleware
    })
    class Test {}
    const middlewares = Reflect.getMetadata(MetadataKey.MIDDLEWARES, Test) as List<any>
    expect(middlewares.toArray()).toContainEqual({ fn: middleware, method: 'validate', phase: 'post' })
  })
  it('should be able to set multiple middlewares', () => {
    const middleware1 = async () => {
      console.log('ok')
    }
    const middleware2 = async () => {
      console.log('middleware')
    }
    // tslint:disable-next-line:max-classes-per-file
    @Middlewares([
      {
        phase: 'post',
        method: 'validate',
        fn: middleware1
      },
      {
        phase: 'pre',
        method: 'save',
        fn: middleware2
      }
    ])
    class Test {}
    const middlewares = Reflect.getMetadata(MetadataKey.MIDDLEWARES, Test) as List<any>
    expect(middlewares.toArray()).toEqual([
      { fn: middleware1, method: 'validate', phase: 'post' },
      { fn: middleware2, phase: 'pre', method: 'save' }
    ])
  })
})

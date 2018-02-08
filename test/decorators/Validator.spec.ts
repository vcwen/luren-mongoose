import { Map } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Validator } from '../../src/decorators/Validator'

describe('Validate', () => {
  it('should return decorator function when schema options is set', () => {
    const validate = (value: number) => {
      return value > 0
    }
    class Test {
      @Validator({
        validate,
        msg: 'age should greater than 0'
      })
      public age: number
    }
    const validators = Reflect.getMetadata(MetadataKey.VALIDATORS, Test) as Map<string, any>
    expect(validators.get('age')).toEqual({
      msg: 'age should greater than 0',
      validate
    })
  })
})

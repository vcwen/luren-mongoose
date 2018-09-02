import { Map } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Field } from '../../src/decorators/Field'

describe('Field', () => {
  it('should use default options if options are not set.', () => {
    class Test {
      @Field()
      public name: string
    }
    const fields = Reflect.getMetadata(MetadataKey.FIELDS, Test) as Map<string, any>
    expect(fields.get('name')).toEqual({ type: String })
  })

  it('should use options that set.', () => {
    // tslint:disable-next-line:max-classes-per-file
    class Test {
      @Field()
      public name: string
      @Field({ type: Number })
      public age: number
    }
    const fields = Reflect.getMetadata(MetadataKey.FIELDS, Test) as Map<string, any>
    expect(fields.size).toBe(2)
    expect(fields.get('age')).toEqual({ type: Number })
  })
})

/* tslint:disable:max-classes-per-file */

import { Map } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Collection } from '../../src/decorators/Collection'
import { Embedded } from '../../src/decorators/Embedded'
import { Field } from '../../src/decorators/Field'
import { Validator } from '../../src/decorators/Validator'

describe('Embedded', () => {
  it('should be able to set type as embedded', () => {
    const validate = (value: number) => {
      return value > 0
    }
    @Embedded
    class Embed {}
    @Embedded({ versionKey: false })
    class AnotherEmbed {}
    @Collection
    class Test {
      @Validator({
        validate,
        msg: 'age should greater than 0'
      })
      public age: number
      @Field({ type: Embed })
      public embed: Embed
      @Field({ type: AnotherEmbed })
      public anotherEmbed: AnotherEmbed
    }
    const fields = Reflect.getMetadata(MetadataKey.FIELDS, Test) as Map<string, any>
    expect(fields.get('embed').type).toEqual(Embed)
    expect(fields.get('anotherEmbed').type).toEqual(AnotherEmbed)
  })
})

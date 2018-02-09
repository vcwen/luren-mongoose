import 'reflect-metadata'
import { Collection } from '../../src/decorators/Collection'
import { CompoundIndex } from '../../src/decorators/CompoundIndex'
import { Embedded } from '../../src/decorators/Embedded'
import { Field } from '../../src/decorators/Field'
import { Index } from '../../src/decorators/Index'
import { Middleware } from '../../src/decorators/Middleware'
import { Plugin } from '../../src/decorators/Plugin'
import { Validator } from '../../src/decorators/Validator'
import { Helper } from '../../src/helpers/Helper'
/* tslint:disable:max-classes-per-file */
jest.mock('mongoose')
describe('Helper', () => {
  it('should create schema from class', () => {
    const middleware = () => {
      return 'ok'
    }
    const plugin = (s) => {
      s.indexes()
    }
    @Embedded
    class Embed {
      @Field public thing: string
    }
    @Plugin(plugin)
    @Middleware({
      phase: 'pre',
      method: 'save',
      fn: middleware
    })
    @CompoundIndex({ name: 1, age: -1 })
    @Collection({ collection: 'test' })
    class Test {
      @Index({ unique: true })
      @Field
      public name: string
      @Field({ type: Number })
      @Validator({ validate: () => true, msg: 'Age should be greater than 0' })
      public age: number
      @Field({ type: Embed })
      public embed: Embed
    }
    const schema: any = Helper.createSchemaFrom(Test)
    expect(schema.collectionMetadata.collection).toBe('test')
    expect(schema.loadedClass).toBe(Test)
    expect(schema.hooks).toEqual([
      {
        fn: middleware,
        method: 'save',
        parallel: false,
        phase: 'pre'
      }
    ])
    expect(schema.indexes).toEqual([
      {
        fields: { name: 1 },
        options: { unique: true }
      },
      { fields: { name: 1, age: -1 }, options: {} }
    ])
    expect(schema.plugins).toEqual([plugin])
    expect(schema.schemaDef.age).toEqual({ type: Number })
    expect(schema.schemaDef.name).toEqual({ type: String })
    expect(schema.schemaDef.embed.type.loadedClass).toEqual(Embed)
    expect(schema.schemaDef.embed.type.schemaDef.thing).toEqual({ type: String })
  })
})

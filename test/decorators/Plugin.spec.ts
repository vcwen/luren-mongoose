import { List } from 'immutable'
import { Schema } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Plugin, Plugins } from '../../src/decorators/Plugin'

describe('Plugin', () => {
  it('should return decorator function when schema options is set', () => {
    const plugin = (schema: Schema) => {
      schema.index({ name: 1 })
    }
    @Plugin(plugin)
    class Test {}
    const plugins = Reflect.getMetadata(MetadataKey.PLUGINS, Test) as List<any>
    expect(plugins.toArray()).toContainEqual(plugin)
  })
  it('should able to set multiple plugins', () => {
    const plugin1 = (schema: Schema) => {
      schema.index({ name: 1 })
    }
    const plugin2 = (schema: Schema) => {
      schema.index({ age: 1 })
    }
    // tslint:disable-next-line:max-classes-per-file
    @Plugins([plugin1, plugin2])
    class Test {}
    const plugins = Reflect.getMetadata(MetadataKey.PLUGINS, Test) as List<any>
    expect(plugins.toArray()).toEqual([plugin1, plugin2])
  })
})

import { List } from 'immutable'
import { Schema } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

export function Plugin(plugin: (schema: Schema, options?: object) => void) {
  return (constructor: new () => any) => {
    let plugins: List<any> = Reflect.getMetadata(MetadataKey.PLUGINS, constructor) || List()
    plugins = plugins.push(plugin)
    Reflect.defineMetadata(MetadataKey.PLUGINS, plugins, constructor)
  }
}

export function Plugins(plugins: Array<(schema: Schema, options?: object) => void>) {
  return (constructor: new () => any) => {
    let pluginList: List<any> = Reflect.getMetadata(MetadataKey.PLUGINS, constructor) || List()
    pluginList = pluginList.concat(plugins)
    Reflect.defineMetadata(MetadataKey.PLUGINS, pluginList, constructor)
  }
}

import { SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { Constructor } from '../types/Constructor'

export function Embedded(options?: SchemaOptions) {
  return (constructor: Constructor) => {
    if (options) {
      options = Object.assign({ _id: false, id: false, collection: constructor.name }, options) as SchemaOptions
      Reflect.defineMetadata(MetadataKey.EMBEDDED, options, constructor)
    } else {
      const name = constructor.name
      const opts = { collection: name, _id: false, id: false } as SchemaOptions
      Reflect.defineMetadata(MetadataKey.EMBEDDED, opts, constructor)
    }
  }
}

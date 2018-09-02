import { SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { Constructor } from '../types/Constructor'

export function Collection(options?: SchemaOptions) {
  return (constructor: Constructor) => {
    if (options) {
      if (!options.collection) {
        options.collection = constructor.name
      }
      Reflect.defineMetadata(MetadataKey.COLLECTION, options, constructor)
    } else {
      const name = constructor.name
      const opts = { collection: name } as SchemaOptions
      Reflect.defineMetadata(MetadataKey.COLLECTION, opts, constructor)
    }
  }
}

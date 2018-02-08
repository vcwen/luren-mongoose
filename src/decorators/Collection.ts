import { SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { Constructor } from '../types/Constructor'

export function Collection(options: SchemaOptions): (Constructor) => void
export function Collection(constructor: Constructor): void
export function Collection(options: SchemaOptions | Constructor) {
  if (typeof options === 'object') {
    const opts = options as SchemaOptions
    return (constructor: Constructor) => {
      if (!opts.collection) {
        opts.collection = constructor.name
      }
      Reflect.defineMetadata(MetadataKey.COLLECTION, options, constructor)
    }
  } else {
    const constructor = options as Constructor
    const name = constructor.name
    const opts = { collection: name } as SchemaOptions
    Reflect.defineMetadata(MetadataKey.COLLECTION, opts, constructor)
  }
}

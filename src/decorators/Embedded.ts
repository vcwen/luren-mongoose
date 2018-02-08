import { SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { Constructor } from '../types/Constructor'

export function Embedded(options: SchemaOptions): (Construtor) => void
export function Embedded(constructor: Constructor): void
export function Embedded(options: SchemaOptions | Constructor) {
  if (typeof options === 'object') {
    const opts = Object.assign({ _id: false, id: false }, options) as SchemaOptions
    return (constructor: Constructor) => {
      if (!opts.collection) {
        opts.collection = constructor.name
      }
      Reflect.defineMetadata(MetadataKey.EMBEDDED, options, constructor)
    }
  } else {
    const constructor = options as Constructor
    const name = constructor.name
    const opts = { collection: name, _id: false, id: false } as SchemaOptions
    Reflect.defineMetadata(MetadataKey.EMBEDDED, opts, constructor)
  }
}

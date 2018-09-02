import { Map } from 'immutable'
import { SchemaTypeOpts } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

export function Field(options?: SchemaTypeOpts<any>) {
  return (target: object, propertyKey: string) => {
    if (options) {
      let fields: Map<string, SchemaTypeOpts<any>> =
        Reflect.getMetadata(MetadataKey.FIELDS, target.constructor) || Map()
      if (!options.type) {
        options.type = String
      }
      fields = fields.set(propertyKey, options)
      Reflect.defineMetadata(MetadataKey.FIELDS, fields, target.constructor)
    } else {
      let fields: Map<string, SchemaTypeOpts<any>> =
        Reflect.getMetadata(MetadataKey.FIELDS, target.constructor) || Map()
      fields = fields.set(propertyKey, { type: String })
      Reflect.defineMetadata(MetadataKey.FIELDS, fields, target.constructor)
    }
  }
}

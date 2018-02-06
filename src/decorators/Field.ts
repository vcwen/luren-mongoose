import { Map } from 'immutable'
import { SchemaTypeOpts } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

export function Field(target: object, propertyKey: string)
export function Field(options: SchemaTypeOpts<any>)
export function Field(value: any) {
  if (arguments.length === 1) {
    const options = value as SchemaTypeOpts<any>
    return (target: object, propertyKey: string) => {
      let fields: Map<string, object> = Reflect.getMetadata(MetadataKey.FIELDS, target.constructor) || Map()
      if (!options.type) {
        options.type = String
      }
      fields = fields.set(propertyKey, options)
      Reflect.defineMetadata(MetadataKey.FIELDS, fields, target.constructor)
    }
  } else {
    const [target, propertyKey] = arguments
    let fields: Map<string, object> = Reflect.getMetadata(MetadataKey.FIELDS, target.constructor) || Map()
    fields = fields.set(propertyKey, { type: String })
    Reflect.defineMetadata(MetadataKey.FIELDS, fields, target.constructor)
  }
}

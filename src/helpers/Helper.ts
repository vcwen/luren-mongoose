import { Map } from 'immutable'
import { Document, model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

import { IIndexOptions } from '../types/Index'

export class Helper {
  public static createSchemaFrom<T>(constructor: new () => T) {
    const schemaDef: SchemaDefinition = {} as SchemaDefinition
    const fields = Reflect.getMetadata(MetadataKey.FIELDS, constructor) as Map<string, any>
    fields.forEach((v, k) => {
      if (typeof v.type === 'function' && Reflect.getMetadata(MetadataKey.EMBEDDED, v.type)) {
        const subSchema = Helper.createSchemaFrom(v.type)
        v.type = subSchema
      }
      schemaDef[k] = v
    })
    const collectionMetadata = Reflect.getMetadata(MetadataKey.COLLECTION, constructor) as SchemaOptions
    const schema = new Schema(schemaDef, collectionMetadata)
    schema.loadClass(constructor)
    const indexes = (Reflect.getMetadata(MetadataKey.INDEXES, constructor) || []) as IIndexOptions[]
    indexes.forEach((index) => {
      const indexFields = index.fields
      Reflect.deleteProperty(index, 'fields')
      schema.index(indexFields, index)
    })
    const plugins = Reflect.getMetadata(MetadataKey.PLUGINS, constructor)
    plugins.forEach((plugin) => {
      schema.plugin(plugin)
    })
    return schema
  }
  public static createModelFrom<T>(constructor: new () => T) {
    const schema = Helper.createSchemaFrom(constructor)
    return model<T & Document>(constructor.name, schema)
  }
}
export default Helper

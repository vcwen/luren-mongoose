import { List, Map } from 'immutable'
import * as _ from 'lodash'
import { Document, model, Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { IMiddleware } from '../decorators/Middleware'
import { IIndexOptions } from '../types/Index'
export class Helper {
  public static createSchemaFrom<T>(constructor: new () => T) {
    const schemaDef: SchemaDefinition = {} as SchemaDefinition
    const fields = Reflect.getMetadata(MetadataKey.FIELDS, constructor) as Map<string, any>
    if (_.isEmpty(fields)) {
      throw new Error('Schema must contain at least one field.')
    }
    fields.forEach((v, k) => {
      const isArrayType = Array.isArray(v.type)
      const type = isArrayType ? _.head(v.type) : v.type
      if (typeof type === 'function' && Reflect.getMetadata(MetadataKey.EMBEDDED, v.type)) {
        const subSchema = Helper.createSchemaFrom(v.type)
        v.type = isArrayType ? [subSchema] : subSchema
      }
      schemaDef[k] = v
    })
    const collectionMetadata = Reflect.getMetadata(MetadataKey.COLLECTION, constructor) as SchemaOptions
    const schema = new Schema(schemaDef, collectionMetadata)
    schema.loadClass(constructor)
    const indexes = (Reflect.getMetadata(MetadataKey.INDEXES, constructor) || List()) as List<IIndexOptions>
    indexes.forEach((index) => {
      schema.index(index.fields, index.options)
    })
    const plugins = (Reflect.getMetadata(MetadataKey.PLUGINS, constructor) || List()) as List<any>
    plugins.forEach((plugin) => {
      schema.plugin(plugin)
    })
    const middlewares = (Reflect.getMetadata(MetadataKey.MIDDLEWARES, constructor) || List()) as List<IMiddleware>
    middlewares.forEach((middleware) => {
      switch (middleware.phase) {
        case 'pre':
          schema.pre(middleware.method, middleware.parallel ? true : false, middleware.fn)
          break
        case 'post':
          schema.post(middleware.method, middleware.fn)
          break
      }
    })
    return schema
  }
  public static createModelFrom<T>(constructor: new () => T): Model<T & Document> {
    const schema = Helper.createSchemaFrom(constructor)
    return model<T & Document>(constructor.name, schema)
  }
}
export default Helper

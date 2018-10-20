import { List, Map } from 'immutable'
import _ from 'lodash'
import { Document, model, Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { IMiddleware } from '../decorators/Middleware'
import { IIndexMetadata } from '../decorators/Indexes'

export function createSchema<T>(constructor: new () => T) {
  const schemaDef: SchemaDefinition = {} as SchemaDefinition
  const fields: Map<string, any> = Reflect.getMetadata(MetadataKey.FIELDS, constructor) || Map()
  if (fields.isEmpty()) {
    throw new Error('Schema must contain at least one field.')
  }
  fields.forEach((v, k) => {
    const isArrayType = Array.isArray(v.type)
    const type = isArrayType ? _.head(v.type) : v.type
    if (typeof type === 'function' && Reflect.getMetadata(MetadataKey.EMBEDDED, v.type)) {
      const subSchema = createSchema(v.type)
      v.type = isArrayType ? [subSchema] : subSchema
    }
    schemaDef[k] = v
  })
  const collectionMetadata = Reflect.getMetadata(MetadataKey.COLLECTION, constructor) as SchemaOptions
  const schema = new Schema(schemaDef, collectionMetadata)
  schema.loadClass(constructor)
  const indexes: List<IIndexMetadata> = Reflect.getMetadata(MetadataKey.INDEXES, constructor) || List()
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
export function createModel<T>(constructor: new () => T): Model<T & Document> {
  const schema = createSchema(constructor)
  return model<T & Document>(constructor.name, schema)
}

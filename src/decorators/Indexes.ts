import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import _ from 'lodash'
export interface IIndexMetadata {
  fields: { [key: string]: 1 | -1 | string }
  options: {
    name?: string
    unique?: boolean
    sparse?: boolean
    expires?: string
    expireAfterSeconds?: number
    [key: string]: any
  }
}

// tslint:disable-next-line:interface-over-type-literal
export type IndexOptions = {
  name?: string
  order?: 1 | -1
  type?: string
  unique?: boolean
  sparse?: boolean
  expires?: string
  expireAfterSeconds?: number
  [key: string]: any
}

export function Index(options?: IndexOptions) {
  return (target: any, propertyKey: string) => {
    if (options) {
      const indexMetadata = {} as IIndexMetadata
      if (options.type) {
        indexMetadata.fields = { [propertyKey]: options.type }
      } else {
        indexMetadata.fields = { [propertyKey]: options.order ? options.order : 1 }
      }
      Reflect.deleteProperty(options, 'type')
      Reflect.deleteProperty(options, 'order')
      if (!_.isEmpty(options)) {
        indexMetadata.options = options
      }
      let indexes: List<IIndexMetadata> = Reflect.getMetadata(MetadataKey.INDEXES, target.constructor) || List()
      indexes = indexes.push(indexMetadata)
      Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target.constructor)
    } else {
      const metadata = {} as IIndexMetadata
      metadata.fields = { [propertyKey]: 1 }
      let indexes: List<IIndexMetadata> = Reflect.getMetadata(MetadataKey.INDEXES, target.constructor) || List()
      indexes = indexes.push(metadata)
      Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target.constructor)
    }
  }
}

export interface ICompoundIndexOptions {
  name?: string
  unique?: boolean
  sparse?: boolean
  expires?: string
  expireAfterSeconds?: number
  [key: string]: any
}

export function CompoundIndex(
  fields: {
    [key: string]: -1 | 1 | string
  },
  options?: ICompoundIndexOptions
) {
  if (Object.keys(fields).length < 2) {
    throw new Error('There should be at least 2 fields for compound indexes.')
  }
  return (target: any) => {
    let indexes: List<IIndexMetadata> = Reflect.getMetadata(MetadataKey.INDEXES, target) || List()
    const indexMetadata: any = { fields }
    if (!_.isEmpty(options)) {
      indexMetadata.options = options
    }

    indexes = indexes.push(indexMetadata)
    Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target)
  }
}

import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'
import { IIndexOptions } from '../types/Index'

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

export function Index(options: IndexOptions)
export function Index(target: object, propertyKey: string)
export function Index(value: any) {
  if (arguments.length === 1) {
    return (target: any, propertyKey: string) => {
      const indexOptions = {} as any
      const options = Object.assign({}, value) as IndexOptions
      if (options.type) {
        indexOptions.fields = { [propertyKey]: options.type }
      } else {
        indexOptions.fields = { [propertyKey]: options.order ? options.order : 1 }
      }
      Reflect.deleteProperty(options, 'type')
      Reflect.deleteProperty(options, 'order')
      indexOptions.options = options
      let indexes: List<IIndexOptions> = Reflect.getMetadata(MetadataKey.INDEXES, target.constructor) || List()
      indexes = indexes.push(indexOptions)
      Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target.constructor)
    }
  } else {
    const [target, propertyKey] = arguments
    const options = {} as IIndexOptions
    options.fields = { [propertyKey]: 1 }
    let indexes: List<IIndexOptions> = Reflect.getMetadata(MetadataKey.INDEXES, target.constructor) || List()
    indexes = indexes.push(options)
    Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target.constructor)
  }
}

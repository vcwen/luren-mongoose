import { List } from 'immutable'
import { MetadataKey } from '../constants/MetadataKey'
import { IIndexOptions } from '../types/Index'

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
    let indexes: List<IIndexOptions> = Reflect.getMetadata(MetadataKey.INDEXES, target) || List()
    const indexOptions = { fields } as any
    if (options) {
      indexOptions.options = options
    }
    indexes = indexes.push(indexOptions)
    Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target)
  }
}

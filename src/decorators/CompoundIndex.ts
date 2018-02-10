import { List } from 'immutable'
import { MetadataKey } from '../constants/MetadataKey'
import { IIndexOptions } from '../types/Index'

export interface ICompoundIndexOptions {
  [key: string]: -1 | 1
}

export function CompoundIndex(options: ICompoundIndexOptions) {
  if (Object.keys(options).length < 2) {
    throw new Error('There should be at least 2 fields for compound indexes.')
  }
  return (target: any) => {
    let indexes: List<IIndexOptions> = Reflect.getMetadata(MetadataKey.INDEXES, target) || List()
    indexes = indexes.push({ fields: options })
    Reflect.defineMetadata(MetadataKey.INDEXES, indexes, target)
  }
}

export interface IIndexOptions {
  fields: { [key: string]: 1 | -1 | string }
  name?: string
  unique?: boolean
  sparse?: boolean
  expires?: string
  expireAfterSeconds?: number
  [key: string]: any
}

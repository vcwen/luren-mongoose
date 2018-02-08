import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

export interface IMiddleware {
  phase: 'pre' | 'post'
  method: string
  fn: ((next: any, done?: any) => void) | (() => Promise<void>)
  parallel?: boolean
}
export function Middleware(middleware: IMiddleware) {
  return (constructor: new () => any) => {
    let hooks: List<any> = Reflect.getMetadata(MetadataKey.MIDDLEWARES, constructor) || List()
    hooks = hooks.push(middleware)
    Reflect.defineMetadata(MetadataKey.MIDDLEWARES, hooks, constructor)
  }
}

export function Middlewares(middlewares: IMiddleware[]) {
  return (constructor: new () => any) => {
    let hooks: List<any> = Reflect.getMetadata(MetadataKey.MIDDLEWARES, constructor) || List()
    hooks = hooks.concat(middlewares)
    Reflect.defineMetadata(MetadataKey.MIDDLEWARES, hooks, constructor)
  }
}

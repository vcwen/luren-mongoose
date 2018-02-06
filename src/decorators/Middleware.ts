import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../constants/MetadataKey'

export function Middleware(middleware: {
  phase: 'pre' | 'post'
  method: string
  fn: ((next: any) => void) | (() => Promise<void>)
}) {
  return (constructor: new () => any) => {
    let hooks: List<any> = Reflect.getMetadata(MetadataKey.MIDDLEWARES, constructor) || List()
    hooks = hooks.push(middleware)
    Reflect.defineMetadata(MetadataKey.MIDDLEWARES, hooks, constructor)
  }
}

export function Middlewares(
  middlewares: Array<{
    phase: 'pre' | 'post'
    method: string
    fn: ((next: any) => void) | (() => Promise<void>)
  }>
) {
  return (constructor: new () => any) => {
    let hooks: List<any> = Reflect.getMetadata(MetadataKey.MIDDLEWARES, constructor) || List()
    hooks = hooks.concat(middlewares)
    Reflect.defineMetadata(MetadataKey.MIDDLEWARES, hooks, constructor)
  }
}

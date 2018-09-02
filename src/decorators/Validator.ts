import { Map } from 'immutable'
import { MetadataKey } from '../constants/MetadataKey'
export interface IValidatorOptions {
  validate: (value: any) => Promise<boolean> | boolean
  msg?: string
}

export interface IValidatorMetadata {
  validate: (value: any) => Promise<boolean> | boolean
  msg?: string
}

export function Validator(options: IValidatorOptions) {
  return (target: object, propertyKey: string) => {
    let validators: Map<string, IValidatorMetadata> = Reflect.getMetadata(MetadataKey.VALIDATORS, target) || Map()
    validators = validators.set(propertyKey, options)
    Reflect.defineMetadata(MetadataKey.VALIDATORS, validators, target.constructor)
  }
}

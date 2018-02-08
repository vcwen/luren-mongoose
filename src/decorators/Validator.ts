import { Map } from 'immutable'
import { MetadataKey } from '../constants/MetadataKey'
import { IValidatorOptions } from '../types/Validator'

export function Validator(options: IValidatorOptions) {
  return (target: object, propertyKey: string) => {
    let validators: Map<string, any> = Reflect.getMetadata(MetadataKey.VALIDATORS, target) || Map()
    validators = validators.set(propertyKey, options)
    Reflect.defineMetadata(MetadataKey.VALIDATORS, validators, target.constructor)
  }
}

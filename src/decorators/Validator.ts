import { Map } from 'immutable'
import { MetadataKey } from '../constants/MetadataKey'
import { IValidateOptions } from '../types/Validate'

export function Validate(options: IValidateOptions) {
  return (target: object, propertyKey: string) => {
    let validators: Map<string, any> = Reflect.getMetadata(MetadataKey.VALIDATES, target) || Map()
    validators = validators.set(propertyKey, options)
    Reflect.defineMetadata(MetadataKey.VALIDATES, validators, target)
  }
}

export interface IValidatorOptions {
  validate: (value: any) => Promise<boolean> | boolean
  msg?: string
}

export interface IValidateOptions {
  validator: (value: any) => Promise<boolean> | boolean
  msg?: string
}

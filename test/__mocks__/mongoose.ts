export class Schema {
  public loadedClass: new () => any
  public indexes: any[] = []
  public hooks: any[] = []
  public plugins: any[] = []

  public constructor(public schemaDef, public collectionMetadata) {}
  public loadClass(clazz: new () => any) {
    this.loadedClass = clazz
  }
  public index(fields: any, options: object) {
    this.indexes.push({ fields, options })
  }
  public plugin(plugin: any) {
    this.plugins.push(plugin)
  }
  public pre(method: string, parallel: boolean, fn: any) {
    this.hooks.push({ phase: 'pre', method, parallel, fn })
  }
  public post(method: string, fn: any) {
    this.hooks.push({ phase: 'post', method, fn })
  }
}

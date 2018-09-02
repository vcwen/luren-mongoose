import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Collection } from '../../src/decorators/Collection'
describe('Collection', () => {
  it('should return decorator function when schema options is set', () => {
    class Test {}
    Collection({ collection: 'CollectionName' })(Test)
    const collection = Reflect.getMetadata(MetadataKey.COLLECTION, Test)
    expect(collection).toEqual({ collection: 'CollectionName' })
  })

  it('should invoke directly when param is constructor', () => {
    // tslint:disable-next-line:max-classes-per-file
    @Collection()
    class Test {}

    const collection = Reflect.getMetadata(MetadataKey.COLLECTION, Test)
    expect(collection).toEqual({ collection: 'Test' })
  })
})

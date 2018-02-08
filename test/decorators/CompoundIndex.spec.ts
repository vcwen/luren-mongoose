import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { CompoundIndex } from '../../src/decorators/CompoundIndex'

describe('CompoundIndex', () => {
  it('should return decorator function when schema options is set', () => {
    @CompoundIndex({ name: 1, age: -1 })
    class Test {}
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { name: 1, age: -1 } })
  })

  it('should throw an error when only object property is set.', () => {
    // tslint:disable-next-line:max-classes-per-file
    class Test {}
    expect(() => {
      CompoundIndex({ name: 1 })(Test)
    }).toThrow()
  })
})

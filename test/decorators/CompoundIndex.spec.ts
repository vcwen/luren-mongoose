import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { CompoundIndex } from '../../src/decorators/Indexes'

describe('CompoundIndex', () => {
  it('should return decorator function when index fields is set', () => {
    @CompoundIndex({ name: 1, age: -1 })
    class Test {}
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { name: 1, age: -1 } })
  })

  it('should return decorator function when index type is set', () => {
    // tslint:disable-next-line:max-classes-per-file
    @CompoundIndex({ name: 'text', age: -1 })
    class Test {}
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { name: 'text', age: -1 } })
  })

  it('should return decorator function when index options is set', () => {
    // tslint:disable-next-line:max-classes-per-file
    @CompoundIndex({ name: 'text', age: -1 }, { unique: true })
    class Test {}
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { name: 'text', age: -1 }, options: { unique: true } })
  })

  it('should throw an error when only object property is set.', () => {
    // tslint:disable-next-line:max-classes-per-file
    class Test {}
    expect(() => {
      CompoundIndex({ name: 1 })(Test)
    }).toThrow()
  })
})

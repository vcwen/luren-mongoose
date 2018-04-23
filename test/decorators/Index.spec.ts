import { List } from 'immutable'
import 'reflect-metadata'
import { MetadataKey } from '../../src/constants/MetadataKey'
import { Index } from '../../src/decorators/Index'

describe('Index', () => {
  it('should be able to set options when create index', () => {
    class Test {
      @Index({ name: 'testIndex', unique: true })
      public username: string
    }
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { username: 1 }, options: { name: 'testIndex', unique: true } })
  })
  it('should use default options when options are not set', () => {
    // tslint:disable-next-line:max-classes-per-file
    class Test {
      @Index public username: string
    }
    const indexes = Reflect.getMetadata(MetadataKey.INDEXES, Test) as List<any>
    expect(indexes.toArray()).toContainEqual({ fields: { username: 1 } })
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CacheDataStorageManager } from "../../abstract/CacheDataStorageManager";
import { CacheDataStorageFactory } from "../../factories/CacheDataStorageFactory";
import { IEvictionManager } from "../../interfaces/IEvictionManager";
import { StorageRegistry } from "../../registeries/StorageTypeRegistry";
import { InMemoryStorage } from "../../storages/InMemoryStorage";
import { StorageType } from "../../types/StorageTypes";

// Mock Storage Implementation
class MockStorage<K, V> extends CacheDataStorageManager<K, V> {
  constructor(
    public capacity: number,
    public evictionManager: IEvictionManager<K>,
  ) {
    super(capacity, evictionManager);
  }
  add(key: K, value: V): void {}
  get(key: K): V | undefined {
    return undefined;
  }
  has(key: K): boolean {
    return false;
  }
  delete(key: K): boolean {
    return false;
  }
  clear(): void {}
}

describe("CacheDataStorageFactory", () => {
  let factory: CacheDataStorageFactory;
  let mockEvictionManager: IEvictionManager<string>;

  beforeEach(() => {
    factory = new CacheDataStorageFactory();
    mockEvictionManager = {
      recordAccess: vi.fn(),
      selectEvictionKey: vi.fn(),
      removeKey: vi.fn(),
    };

    // Reset StorageRegistry before each test
    StorageRegistry["storageRegistry"].clear();
  });

  it("should create a storage instance when the storage type is registered", () => {
    StorageRegistry.registerStorage(
      StorageType.NotImplementedStorage,
      MockStorage,
    );

    const storage = factory.create<string, number>(
      100,
      StorageType.NotImplementedStorage,
      mockEvictionManager,
    );

    expect(storage).toBeInstanceOf(MockStorage);
    expect(storage.getCapacity()).toBe(100);
    expect(storage.getEvictionManager()).toBe(mockEvictionManager);
  });

  it("should throw an error when requesting an unregistered storage type", () => {
    expect(() =>
      factory.create<string, number>(
        100,
        StorageType.InMemoryStorage,
        mockEvictionManager,
      ),
    ).toThrowError(
      `Storage type ${StorageType.InMemoryStorage} is not registered.`,
    );
  });

  it("should allow multiple storage types to be registered and retrieved", () => {
    StorageRegistry.registerStorage(
      StorageType.InMemoryStorage,
      InMemoryStorage,
    );
    StorageRegistry.registerStorage(
      StorageType.NotImplementedStorage,
      MockStorage,
    );

    const inMemoryStorage = factory.create<string, number>(
      100,
      StorageType.InMemoryStorage,
      mockEvictionManager,
    );
    expect(inMemoryStorage).toBeInstanceOf(InMemoryStorage);

    const distributedStorage = factory.create<string, number>(
      200,
      StorageType.NotImplementedStorage,
      mockEvictionManager,
    );
    expect(distributedStorage).toBeInstanceOf(MockStorage);
  });
});

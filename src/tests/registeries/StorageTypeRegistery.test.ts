import { describe, expect, it } from "vitest";
import { CacheDataStorageManager } from "../../abstract/CacheDataStorageManager";
import { IEvictionManager } from "../../interfaces/IEvictionManager";
import { StorageRegistry } from "../../registeries/StorageTypeRegistry";
import { InMemoryStorage } from "../../storages/InMemoryStorage";
import { PK } from "../../types/PrimitiveKey";
import { StorageType } from "../../types/StorageTypes";

// Mock EvictionManager for testing
class MockEvictionManager<K extends PK> implements IEvictionManager<K> {
  recordAccess(key: K): void {
    throw new Error("Method not implemented.");
  }
  selectEvictionKey(): K | undefined {
    throw new Error("Method not implemented.");
  }
  removeKey(key: K): void {
    throw new Error("Method not implemented.");
  }
  onItemAccessed(key: K): void {}
  onItemEvicted(key: K): void {}
}

// Mock storage class for testing
class MockStorage<K extends PK, V> extends CacheDataStorageManager<K, V> {
  add(key: K, value: V): void {
    throw new Error("Method not implemented.");
  }
  get(key: K): V | undefined {
    throw new Error("Method not implemented.");
  }
  has(key: K): boolean {
    throw new Error("Method not implemented.");
  }
  delete(key: K): boolean {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }
  constructor(capacity: number, evictionManager: IEvictionManager<K>) {
    super(capacity, evictionManager);
  }

  setItem(key: K, value: V): void {}
  getItem(key: K): V | undefined {
    return undefined;
  }
  removeItem(key: K): void {}
}

describe("StorageRegistry", () => {
  it("should register and retrieve a storage constructor", () => {
    StorageRegistry.registerStorage(
      StorageType.NotImplementedStorage,
      MockStorage,
    );
    const constructor = StorageRegistry.getStorage(
      StorageType.NotImplementedStorage,
    );
    expect(constructor).toBe(MockStorage);
  });

  it("should have InMemoryStorage registered by default", () => {
    const constructor = StorageRegistry.getStorage(StorageType.InMemoryStorage);
    expect(constructor).toBe(InMemoryStorage);
  });

  it("should return undefined for unregistered storage type", () => {
    StorageRegistry["storageRegistry"].clear();
    const constructor = StorageRegistry.getStorage(
      StorageType.NotImplementedStorage,
    );
    expect(constructor).toBeUndefined();
    StorageRegistry.registerStorage(
      StorageType.InMemoryStorage,
      InMemoryStorage,
    );
  });
});

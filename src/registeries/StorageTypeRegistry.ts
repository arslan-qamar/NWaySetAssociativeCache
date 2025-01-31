import { StorageType } from "../types/StorageTypes";
import { EvictionManager } from "../interfaces/EvictionManager";
import { InMemoryStorage } from "../storages/InMemoryStorage";
import { CacheDataStorageManager } from "../abstract/CacheDataStorageManager";

export interface StorageTypeConstructor<K, V> {
  new (
    capacity: number,
    evictionManager: EvictionManager<K>,
  ): CacheDataStorageManager<K, V>;
}

export class StorageRegistry<K, V> {
  private static storageRegistry = new Map<
    StorageType,
    StorageTypeConstructor<any, any>
  >();

  static registerStorage<K, V>(
    type: StorageType,
    constructor: StorageTypeConstructor<K, V>,
  ) {
    this.storageRegistry.set(type, constructor);
  }

  static getStorage<K, V>(
    type: StorageType,
  ): StorageTypeConstructor<K, V> | undefined {
    return this.storageRegistry.get(type);
  }

  static {
    StorageRegistry.registerStorage(
      StorageType.InMemoryStorage,
      InMemoryStorage,
    );
  }
}

import { IEvictionManager } from "../interfaces/IEvictionManager";
import { StorageRegistry } from "../registeries/StorageTypeRegistry";
import { PK } from "../types/PrimitiveKey";
import { StorageType } from "../types/StorageTypes";

export class CacheDataStorageFactory {
  create<K extends PK, V>(
    capacity: number,
    storageType: StorageType,
    evictionManager: IEvictionManager<K>,
  ) {
    const StorageClass = StorageRegistry.getStorage<K, V>(storageType);
    if (!StorageClass) {
      throw new Error(`Storage type ${storageType} is not registered.`);
    }
    return new StorageClass(capacity, evictionManager);
  }
}

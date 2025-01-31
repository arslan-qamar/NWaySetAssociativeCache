import { CacheDataStorageManager } from "../abstract/CacheDataStorageManager";
import { PK } from "../types/PrimitiveKey";

export class InMemoryStorage<K extends PK, V> extends CacheDataStorageManager<K, V> { 
  private storage: Map<K, V> = new Map();

  add(key: K, value: V): void {
    if (this.storage.size >= this.capacity) {
      const evictionKey = this.evictionManager.selectEvictionKey();
      if (evictionKey !== undefined) {
        this.storage.delete(evictionKey);
      }
    }
    this.storage.set(key, value);
    this.evictionManager.recordAccess(key);
  }

  get(key: K): V | undefined {
    if (this.storage.has(key)) {
      this.evictionManager.recordAccess(key);
    }
    return this.storage.get(key);
  }

  has(key: K): boolean {
    return this.storage.has(key);
  }

  delete(key: K): boolean {
    if (this.storage.delete(key)) {
      this.evictionManager.removeKey(key);
      return true;
    }
    return false;
  }

  listAll(): Array<{ key: K; value: V }> {
    return Array.from(this.storage.entries()).map(([key, value]) => ({ key, value }));
  }  

  clear(): void {
    this.storage.clear();
  }
}

import { EvictionManager } from "../interfaces/EvictionManager";
import { PK } from "../types/PrimitiveKey";

export abstract class CacheDataStorageManager<K extends PK, V> {
  protected capacity: number;
  protected evictionManager: EvictionManager<K>;

  constructor(capacity: number, evictionManager: EvictionManager<K>) {
    this.capacity = capacity;
    this.evictionManager = evictionManager;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getEvictionManager(): EvictionManager<K> {
    return this.evictionManager;
  }

  abstract add(key: K, value: V): void;
  abstract get(key: K): V | undefined;
  abstract has(key: K): boolean;
  abstract delete(key: K): boolean;
  abstract clear(): void;
  abstract listAll(): Array<{ key: K; value: V }>;
}

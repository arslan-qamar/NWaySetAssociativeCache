import { CacheDataStorageManager } from "./abstract/CacheDataStorageManager";
import { CacheDataStorageFactory } from "./factories/CacheDataStorageFactory";
import { EvictionManagerFactory } from "./factories/EvictionManagerFactory";
import { INWaySetAssociativeCache } from "./interfaces/INWaySetAssociativeCache";
import { Logger } from "./logging/Logger";
import { PK } from "./types/PrimitiveKey";
import { ReplacementPolicy } from "./types/ReplacementPolicy";
import { StorageType } from "./types/StorageTypes";

export class NWaySetAssociativeCache<K extends PK, V>
  implements INWaySetAssociativeCache<K, V>
{
  private cache: Map<number, CacheDataStorageManager<K, V>>;
  private capacity: number;
  private ways: number;
  private policy: ReplacementPolicy;
  private storageType: StorageType;
  private storageFactory: CacheDataStorageFactory;
  private evictionManagerFactory: EvictionManagerFactory;
  private logger: Logger;

  constructor(
    capacity: number,
    ways: number,
    policy: ReplacementPolicy = ReplacementPolicy.LRU,
    storageType: StorageType = StorageType.InMemoryStorage,
    storageFactory: CacheDataStorageFactory = new CacheDataStorageFactory(),
    evictionManagerFactory: EvictionManagerFactory = new EvictionManagerFactory(),
    logger?: Logger, // Optional logger
  ) {
    if (capacity % ways !== 0) {
      throw new Error("Capacity must be a multiple of the number of ways.");
    }
    this.capacity = capacity;
    this.ways = ways;
    this.policy = policy;
    this.storageType = storageType;
    this.storageFactory = storageFactory;
    this.evictionManagerFactory = evictionManagerFactory;
    this.cache = new Map<number, CacheDataStorageManager<K, V>>();

    // Use provided logger or default to console (just a concept not used anywhere since its a reuseable package)
    this.logger = logger || console;
  }
 

  private getSetIndex(key: K): number {
    const numSets = Math.floor(this.capacity / this.ways); // Ensure it's an integer
    const hashedKey = typeof key === "number" ? key : this.hashKey(key);
    return Math.abs(hashedKey) % numSets; // Ensures non-negative index
  }

  private hashKey(key: K): number {
    let hash = 0;
    const strKey = JSON.stringify(key);
    for (let i = 0; i < strKey.length; i++) {
      hash = (hash * 31 + strKey.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  put(key: K, value: V): void {
    const setIndex = this.getSetIndex(key);
    if (!this.cache.has(setIndex)) {
      const evictionManager = this.evictionManagerFactory.create<K>(
        this.policy,
      );
      const cacheDataStorage = this.storageFactory.create<K, V>(
        this.capacity,
        this.storageType,
        evictionManager,
      );
      this.cache.set(setIndex, cacheDataStorage);
    }
    this.cache.get(setIndex)!.add(key, value);
  }

  get(key: K): V | undefined {
    const setIndex = this.getSetIndex(key);
    return this.cache.get(setIndex)?.get(key);
  }

  has(key: K): boolean {
    const setIndex = this.getSetIndex(key);
    return this.cache.has(setIndex) && this.cache.get(setIndex)!.has(key);
  }

  delete(key: K): boolean {
    const setIndex = this.getSetIndex(key);
    return this.cache.get(setIndex)?.delete(key) ?? false;
  }

  clear(): void {
    this.cache.clear();
  }

  listAll(): { key: K; value: V; }[] {
    const entries: { key: K; value: V }[] = [];
    
    this.cache.forEach((storageManager) => {
      storageManager.listAll().forEach(entry => {
        entries.push(entry);
      });
    });  
    return entries;
  }
  
}

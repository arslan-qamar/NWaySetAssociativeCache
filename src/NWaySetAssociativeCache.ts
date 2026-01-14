import { EvictionManagerFactory } from "./factories/EvictionManagerFactory";
import { INWaySetAssociativeCache } from "./interfaces/INWaySetAssociativeCache";
import { Logger } from "./logging/Logger";
import { MyMap } from "./types/MyMap";
import { PK } from "./types/PrimitiveKey";
import { ReplacementPolicy } from "./types/ReplacementPolicy";

export class NWaySetAssociativeCache<K extends PK, V>
  implements INWaySetAssociativeCache<PK, V> {
  private cache: MyMap;
  private capacity: number;
  private ways: number;
  private policy: ReplacementPolicy;
  private evictionManagerFactory: EvictionManagerFactory;
  private logger: Logger;
  evictionManager: any;

  constructor(
    capacity: number,
    ways: number,
    policy: ReplacementPolicy = ReplacementPolicy.LRU,
    evictionManagerFactory: EvictionManagerFactory = new EvictionManagerFactory(),
    logger?: Logger, // Optional logger
  ) {
    if (capacity % ways !== 0) {
      throw new Error("Capacity must be a multiple of the number of ways.");
    }
    this.capacity = capacity;
    this.ways = ways;
    this.policy = policy;
    this.evictionManagerFactory = evictionManagerFactory;
    this.cache = new MyMap();

    this.evictionManager = this.evictionManagerFactory.create<K>(
      this.policy,
    );

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

    if (this.cache.size >= this.capacity) {
      const evictionKey = this.evictionManager.selectEvictionKey();
      if (evictionKey !== undefined) {
        this.cache.delete(evictionKey);
      }
    }
    this.cache.set(key, value);
    this.evictionManager.recordAccess(key);
  }

  get(key: K): V | undefined {
    const setIndex = this.getSetIndex(key);
    this.evictionManager.recordAccess(key);
    return this.cache.get(key);
  }

  has(key: K): boolean {
    const setIndex = this.getSetIndex(key);
    return this.cache.has(setIndex) && this.cache.has(key);
  }

  delete(key: K): boolean {
    const setIndex = this.getSetIndex(key);
    this.evictionManager.removeKey(key);
    return this.cache.delete(key) ?? false;
  }

  clear(): void {
    this.cache.clear();
    this.evictionManager.clear();
  }

  listAll(): { key: PK; value: V; }[] {
    const entries: { key: PK; value: V }[] = [];

    this.cache.entries().forEach((entry) => {
      entries.push({key: entry.key, value: entry.value});
    });
    return entries;
  }

}

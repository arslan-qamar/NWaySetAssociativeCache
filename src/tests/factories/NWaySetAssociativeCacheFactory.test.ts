import { describe, expect, it } from "vitest";
import { NWaySetAssociativeCacheFactory } from "../../factories/NWaySetAssociativeCacheFactory";
import { NWaySetAssociativeCache } from "../../NWaySetAssociativeCache";
import { ReplacementPolicy } from "../../types/ReplacementPolicy";
import { StorageType } from "../../types/StorageTypes";

describe("NWaySetAssociativeCacheFactory", () => {
  it("should create an instance of NWaySetAssociativeCache", () => {
    const cache = NWaySetAssociativeCacheFactory.create<number, string>(
      16,
      4,
      ReplacementPolicy.LRU,
      StorageType.InMemoryStorage,
    );

    expect(cache).toBeInstanceOf(NWaySetAssociativeCache);
  });

  it("should allow setting and getting values", () => {
    const cache = NWaySetAssociativeCacheFactory.create<number, string>(
      8,
      2,
      ReplacementPolicy.LRU,
      StorageType.InMemoryStorage,
    );

    cache.put(1, "one");
    cache.put(2, "two");

    expect(cache.get(1)).toBe("one");
    expect(cache.get(2)).toBe("two");
    expect(cache.get(3)).toBeUndefined(); // Key not in cache
  });

  it("should respect cache capacity and replacement policy", () => {
    const cache = NWaySetAssociativeCacheFactory.create<number, string>(
      2, // Small capacity for easy testing
      2,
      ReplacementPolicy.LRU, // Assuming LRU implementation
      StorageType.InMemoryStorage,
    );

    cache.put(1, "one");
    cache.put(2, "two");

    // Access key 1 to make it recently used
    cache.get(1);

    // Insert new key, should evict least recently used key (which is 2)
    cache.put(3, "three");

    expect(cache.get(1)).toBe("one"); // Still in cache
    expect(cache.get(3)).toBe("three"); // Newly added
    expect(cache.get(2)).toBeUndefined(); // Should have been evicted
  });
});

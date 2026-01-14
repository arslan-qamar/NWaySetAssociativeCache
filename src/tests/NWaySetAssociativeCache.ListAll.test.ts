import { describe, it, expect, beforeEach } from "vitest";
import { NWaySetAssociativeCache } from "../NWaySetAssociativeCache";
import { ReplacementPolicy } from "../types/ReplacementPolicy";
import { EvictionManagerFactory } from "../factories/EvictionManagerFactory";


describe("NWaySetAssociativeCache - listAll Method", () => {
  let cache: NWaySetAssociativeCache<number, string>;
  
  beforeEach(() => {
    cache = new NWaySetAssociativeCache<number, string>(
      4, // capacity
      2, // ways
      ReplacementPolicy.LRU, // replacement policy
      new EvictionManagerFactory() // eviction manager factory
    );
  });

  it("should return an empty array when the cache is empty", () => {
    expect(cache.listAll()).toEqual([]);
  });

  it("should return all stored key-value pairs", () => {
    cache.put(1, "one");
    cache.put(2, "two");
    cache.put(3, "three");
    
    const result = cache.listAll();
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({ key: 1, value: "one" });
    expect(result).toContainEqual({ key: 2, value: "two" });
    expect(result).toContainEqual({ key: 3, value: "three" });
  });

  it("should return an updated list after deleting a key", () => {
    cache.put(1, "one");
    cache.put(2, "two");
    cache.delete(1);
    
    const result = cache.listAll();
    expect(result).toHaveLength(1);
    expect(result).toContainEqual({ key: 2, value: "two" });
    expect(result).not.toContainEqual({ key: 1, value: "one" });
  });

  it("should return an empty array after clearing the cache", () => {
    cache.put(1, "one");
    cache.put(2, "two");
    cache.clear();
    
    expect(cache.listAll()).toEqual([]);
  });
});
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NWaySetAssociativeCache } from "../NWaySetAssociativeCache";
import { PK } from "../types/PrimitiveKey";
import { ReplacementPolicy } from "../types/ReplacementPolicy";
import { EvictionManagerFactory } from "../factories/EvictionManagerFactory";


describe("NWaySetAssociativeCache", () => {
  let cache: NWaySetAssociativeCache<PK, string>;
  let evictionManagerFactory;
  let mockEvictionManager : any;

  beforeEach(() => {

    mockEvictionManager = {
      recordAccess: vi.fn(),
      selectEvictionKey: vi.fn(),
      removeKey: vi.fn(),
      clear: vi.fn(),
    };

    evictionManagerFactory = {
      create: vi.fn().mockReturnValue(mockEvictionManager),
    } as unknown as EvictionManagerFactory;    
    
    cache = new NWaySetAssociativeCache(
      4,
      2,
      ReplacementPolicy.LRU,
      evictionManagerFactory
    );
  });

  it("should throw an error if capacity is not a multiple of ways", () => {
    expect(
      () => new NWaySetAssociativeCache(5, 2, ReplacementPolicy.LRU),
    ).toThrowError("Capacity must be a multiple of the number of ways.");
  });

  it("should store and retrieve values correctly", () => {
    cache.put(1, "value1");
    expect(cache.get(1)).toBe("value1");
  });

  it("should return undefined for missing keys", () => {
    expect(cache.get(2)).toBeUndefined();
  });

  it("should correctly determine if a key exists", () => {
    cache.put(1, "one");
    expect(cache.has(1)).toBe(true);
  });

  it("should correctly delete keys", () => {
    cache.put(1, "one");
    expect(cache.delete(1)).toBe(true);
  });

  it("should clear the cache and eviction manager", () => {
    // Add some entries
    cache.put(1, "one");
    cache.put(2, "two");

    // Ensure entries are in cache before clearing
    expect(cache.get(1)).toBe("one");
    expect(cache.get(2)).toBe("two");

    // Clear the cache
    cache.clear();

    // Assertions
    expect(cache.get(1)).toBeUndefined();
    expect(cache.get(2)).toBeUndefined();

    // Ensure clear was called on MyMap and eviction manager
    expect(mockEvictionManager.clear).toHaveBeenCalled();    
  });

  it("should always return a non-negative set index", () => {
    const largeKey = 99999999;
    const setIndex = cache["getSetIndex"](largeKey);
    expect(setIndex).toBeGreaterThanOrEqual(0);
  });

  it("should correctly handle very large keys", () => {
    const largeKey = Number.MAX_SAFE_INTEGER;
    const setIndex = cache["getSetIndex"](largeKey);
    expect(setIndex).toBeLessThan(Math.floor(4 / 2));
  });

  it("should correctly handle negative hash values", () => {
    cache["hashKey"] = vi.fn().mockReturnValue(-123456);
    const setIndex = cache["getSetIndex"]("negativeKey");
    expect(setIndex).toBeGreaterThanOrEqual(0);
  });

  it("should return a valid set index within the expected range", () => {
    const numSets = Math.floor(4 / 2);
    for (let i = 0; i < 100; i++) {
      const setIndex = cache["getSetIndex"](i);
      expect(setIndex).toBeGreaterThanOrEqual(0);
      expect(setIndex).toBeLessThan(numSets);
    }
  });

  it("should return an empty array when the cache is empty", () => {
    expect(cache.listAll()).toEqual([]);
  });  

});

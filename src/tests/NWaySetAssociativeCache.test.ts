import { beforeEach, describe, expect, it, vi } from "vitest";
import { CacheDataStorageFactory } from "../factories/CacheDataStorageFactory";
import { EvictionManagerFactory } from "../factories/EvictionManagerFactory";
import { NWaySetAssociativeCache } from "../NWaySetAssociativeCache";
import { PK } from "../types/PrimitiveKey";
import { ReplacementPolicy } from "../types/ReplacementPolicy";
import { StorageType } from "../types/StorageTypes";

vi.mock("../factories/CacheDataStorageFactory");
vi.mock("../factories/EvictionManagerFactory");
vi.mock("../abstract/CacheDataStorageManager");

describe("NWaySetAssociativeCache", () => {
  let cache: NWaySetAssociativeCache<PK, string>;
  let storageFactory;
  let evictionManagerFactory;
  let mockStorageInstance: { get: any; add: any; has: any; delete: any, listAll: any };
  let mockEvictionManager;

  beforeEach(() => {
    storageFactory = new CacheDataStorageFactory();
    evictionManagerFactory = new EvictionManagerFactory();
    mockStorageInstance = {
      add: vi.fn(),
      get: vi.fn(),
      has: vi.fn(),
      delete: vi.fn(),
      listAll: vi.fn(),
    };
    mockEvictionManager = {};

    storageFactory.create = vi.fn().mockReturnValue(mockStorageInstance);
    evictionManagerFactory.create = vi
      .fn()
      .mockReturnValue(mockEvictionManager);

    cache = new NWaySetAssociativeCache(
      4,
      2,
      ReplacementPolicy.LRU,
      StorageType.InMemoryStorage,
      storageFactory,
      evictionManagerFactory,
    );
  });

  it("should throw an error if capacity is not a multiple of ways", () => {
    expect(
      () => new NWaySetAssociativeCache(5, 2, ReplacementPolicy.LRU),
    ).toThrowError("Capacity must be a multiple of the number of ways.");
  });

  it("should store and retrieve values correctly", () => {
    mockStorageInstance.get.mockReturnValue("value1");
    cache.put(1, "value1");
    expect(mockStorageInstance.add).toHaveBeenCalledWith(1, "value1");
    expect(cache.get(1)).toBe("value1");
  });

  it("should return undefined for missing keys", () => {
    mockStorageInstance.get.mockReturnValue(undefined);
    expect(cache.get(2)).toBeUndefined();
  });

  it("should correctly determine if a key exists", () => {
    cache.put(1, "one");
    mockStorageInstance.has.mockReturnValue(true);
    expect(cache.has(1)).toBe(true);
  });

  it("should correctly delete keys", () => {
    cache.put(1, "one");
    mockStorageInstance.delete.mockReturnValue(true);
    expect(cache.delete(1)).toBe(true);
    expect(mockStorageInstance.delete).toHaveBeenCalledWith(1);
  });

  it("should clear the cache", () => {
    cache.clear();
    expect(cache.get(1)).toBeUndefined();
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

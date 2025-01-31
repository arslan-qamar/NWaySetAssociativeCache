import { describe, it, expect, vi, beforeEach } from "vitest";
import { InMemoryStorage } from "../../storages/InMemoryStorage";

describe("InMemoryStorage", () => {
  let evictionManager: {
    selectEvictionKey: ReturnType<typeof vi.fn>;
    recordAccess: ReturnType<typeof vi.fn>;
    removeKey: ReturnType<typeof vi.fn>;
  };

  let storage: InMemoryStorage<string, number>;

  beforeEach(() => {
    evictionManager = {
      selectEvictionKey: vi.fn(),
      recordAccess: vi.fn(),
      removeKey: vi.fn(),
    };
    storage = new InMemoryStorage<string, number>(3, evictionManager);
  });

  it("should add and retrieve a value", () => {
    storage.add("a", 1);
    expect(storage.get("a")).toBe(1);
    expect(evictionManager.recordAccess).toHaveBeenCalledWith("a");
  });

  it("should return undefined for non-existent keys", () => {
    expect(storage.get("b")).toBeUndefined();
  });

  it("should return true for existing keys in has()", () => {
    storage.add("a", 1);
    expect(storage.has("a")).toBe(true);
  });

  it("should return false for non-existent keys in has()", () => {
    expect(storage.has("b")).toBe(false);
  });

  it("should delete a key and return true", () => {
    storage.add("a", 1);
    expect(storage.delete("a")).toBe(true);
    expect(storage.has("a")).toBe(false);
    expect(evictionManager.removeKey).toHaveBeenCalledWith("a");
  });

  it("should return false when deleting a non-existent key", () => {
    expect(storage.delete("b")).toBe(false);
  });

  it("should clear all entries", () => {
    storage.add("a", 1);
    storage.add("b", 2);
    storage.clear();
    expect(storage.has("a")).toBe(false);
    expect(storage.has("b")).toBe(false);
  });

  it("should evict an entry when exceeding capacity", () => {
    evictionManager.selectEvictionKey.mockReturnValue("a");
    storage.add("a", 1);
    storage.add("b", 2);
    storage.add("c", 3);
    storage.add("d", 4); // Exceeds capacity, should evict "a"
    expect(storage.has("a")).toBe(false);
  });
  
  it("should return all stored key-value pairs", () => {
    storage.add("a", 1);
    storage.add("b", 2);
    storage.add("c", 3);

    expect(storage.listAll()).toEqual([
      { key: "a", value: 1 },
      { key: "b", value: 2 },
      { key: "c", value: 3 },
    ]);
  });

  it("should return an empty array when storage is empty", () => {
    expect(storage.listAll()).toEqual([]);
  });

  it("should reflect updated values in listAll", () => {
    storage.add("a", 1);
    storage.add("b", 2);
    storage.add("a", 3); // Update existing key

    expect(storage.listAll()).toEqual([
      { key: "a", value: 3 },
      { key: "b", value: 2 }      
    ]);
  });

  it("should not return deleted keys in listAll", () => {
    storage.add("a", 1);
    storage.add("b", 2);
    storage.delete("a");

    expect(storage.listAll()).toEqual([{ key: "b", value: 2 }]);
  });

});

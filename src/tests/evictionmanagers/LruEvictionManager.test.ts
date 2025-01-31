import { beforeEach, describe, expect, it } from "vitest";
import { LruEvictionManager } from "../../evictionmanagers/LruEvictionManager";

describe("LruEvictionManager", () => {
  let evictionManager: LruEvictionManager<string>;

  beforeEach(() => {
    evictionManager = new LruEvictionManager<string>();
  });

  it("should record key accesses in LRU order", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    expect(evictionManager.selectEvictionKey()).toBe("A");
  });

  it("should move accessed keys to the most recently used position", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    evictionManager.recordAccess("A"); // A should be moved to most recent

    expect(evictionManager.selectEvictionKey()).toBe("B");
  });

  it("should return undefined when selecting from an empty eviction list", () => {
    expect(evictionManager.selectEvictionKey()).toBeUndefined();
  });

  it("should remove a key from the eviction list", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    evictionManager.removeKey("B");

    expect(evictionManager.selectEvictionKey()).toBe("A");
    expect(evictionManager.selectEvictionKey()).toBe("C");
  });

  it("should do nothing when removing a non-existing key", () => {
    evictionManager.recordAccess("A");
    evictionManager.removeKey("B"); // B is not in the list

    expect(evictionManager.selectEvictionKey()).toBe("A");
  });

  it("should return keys in the correct LRU order", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    expect(evictionManager.selectEvictionKey()).toBe("A");
    expect(evictionManager.selectEvictionKey()).toBe("B");
    expect(evictionManager.selectEvictionKey()).toBe("C");
    expect(evictionManager.selectEvictionKey()).toBeUndefined();
  });
});

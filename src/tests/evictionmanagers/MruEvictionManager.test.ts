import { beforeEach, describe, expect, it } from "vitest";
import { MruEvictionManager } from "../../evictionmanagers/MruEvictionManager";

describe("MruEvictionManager", () => {
  let evictionManager: MruEvictionManager<string>;

  beforeEach(() => {
    evictionManager = new MruEvictionManager<string>();
  });

  it("should record key accesses in MRU order", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    expect(evictionManager.selectEvictionKey()).toBe("C");
  });

  it("should move accessed keys to the most recently used position", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    evictionManager.recordAccess("A"); // A becomes most recently used

    expect(evictionManager.selectEvictionKey()).toBe("A");
  });

  it("should return undefined when selecting from an empty eviction list", () => {
    expect(evictionManager.selectEvictionKey()).toBeUndefined();
  });

  it("should remove a key from the eviction list", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    evictionManager.removeKey("B");

    expect(evictionManager.selectEvictionKey()).toBe("C");
    expect(evictionManager.selectEvictionKey()).toBe("A");
    expect(evictionManager.selectEvictionKey()).toBeUndefined();
  });

  it("should do nothing when removing a non-existing key", () => {
    evictionManager.recordAccess("A");
    evictionManager.removeKey("B"); // B is not in the list

    expect(evictionManager.selectEvictionKey()).toBe("A");
  });

  it("should return keys in the correct MRU order", () => {
    evictionManager.recordAccess("A");
    evictionManager.recordAccess("B");
    evictionManager.recordAccess("C");

    expect(evictionManager.selectEvictionKey()).toBe("C");
    expect(evictionManager.selectEvictionKey()).toBe("B");
    expect(evictionManager.selectEvictionKey()).toBe("A");
    expect(evictionManager.selectEvictionKey()).toBeUndefined();
  });
});

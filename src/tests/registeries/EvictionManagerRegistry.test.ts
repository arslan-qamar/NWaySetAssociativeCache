import { beforeEach, describe, expect, it } from "vitest";
import { LruEvictionManager } from "../../evictionmanagers/LruEvictionManager";
import { MruEvictionManager } from "../../evictionmanagers/MruEvictionManager";
import { EvictionManagerRegistry } from "../../registeries/EvictionRegistry";
import { ReplacementPolicy } from "../../types/ReplacementPolicy";

describe("EvictionManagerRegistry", () => {
  beforeEach(() => {
    // Clear registry before each test
    (EvictionManagerRegistry as any).registry = new Map();
  });

  it("should register and retrieve LRU eviction manager", () => {
    EvictionManagerRegistry.register(ReplacementPolicy.LRU, LruEvictionManager);
    const Manager = EvictionManagerRegistry.get(ReplacementPolicy.LRU);
    expect(Manager).toBe(LruEvictionManager);
  });

  it("should register and retrieve MRU eviction manager", () => {
    EvictionManagerRegistry.register(ReplacementPolicy.MRU, MruEvictionManager);
    const Manager = EvictionManagerRegistry.get(ReplacementPolicy.MRU);
    expect(Manager).toBe(MruEvictionManager);
  });

  it("should return undefined for unregistered policy", () => {
    const Manager = EvictionManagerRegistry.get(555 as ReplacementPolicy);
    expect(Manager).toBeUndefined();
  });

  it("should override existing registration", () => {
    class CustomEvictionManager {}
    EvictionManagerRegistry.register(
      ReplacementPolicy.LRU,
      CustomEvictionManager as any,
    );
    const Manager = EvictionManagerRegistry.get(ReplacementPolicy.LRU);
    expect(Manager).toBe(CustomEvictionManager);
  });
});

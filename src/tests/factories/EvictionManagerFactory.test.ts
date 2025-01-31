import { beforeEach, describe, expect, it } from "vitest";
import { EvictionManagerFactory } from "../../factories/EvictionManagerFactory";
import { EvictionManagerRegistry } from "../../registeries/EvictionRegistry";
import { ReplacementPolicy } from "../../types/ReplacementPolicy";

class MockEvictionManager {}

describe("EvictionManagerFactory", () => {
  beforeEach(() => {
    // Clear registry before each test
    (EvictionManagerRegistry as any).registry = new Map();
  });

  it("should create an eviction manager if registered", () => {
    EvictionManagerRegistry.register(
      ReplacementPolicy.LRU,
      MockEvictionManager as any,
    );
    const factory = new EvictionManagerFactory();
    const manager = factory.create(ReplacementPolicy.LRU);
    expect(manager).toBeInstanceOf(MockEvictionManager);
  });

  it("should throw an error if policy is not registered", () => {
    EvictionManagerRegistry["registry"].clear();
    const factory = new EvictionManagerFactory();
    expect(() => factory.create(ReplacementPolicy.LRU)).toThrowError(
      "No eviction manager registered for policy: LRU",
    );
  });
});

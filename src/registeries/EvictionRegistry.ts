import { LruEvictionManager } from "../evictionmanagers/LruEvictionManager";
import { MruEvictionManager } from "../evictionmanagers/MruEvictionStrategy";
import { ReplacementPolicy } from "../types/ReplacementPolicy";

type EvictionManagerConstructor<K> = new () => any;

export class EvictionManagerRegistry {
  private static registry: Map<
    ReplacementPolicy,
    EvictionManagerConstructor<any>
  > = new Map();

  static register<K>(
    policy: ReplacementPolicy,
    manager: EvictionManagerConstructor<K>,
  ): void {
    this.registry.set(policy, manager);
  }

  static get<K>(
    policy: ReplacementPolicy,
  ): EvictionManagerConstructor<K> | undefined {
    return this.registry.get(policy);
  }

  static {
    EvictionManagerRegistry.register(ReplacementPolicy.LRU, LruEvictionManager);
    EvictionManagerRegistry.register(ReplacementPolicy.MRU, MruEvictionManager);
  }
}

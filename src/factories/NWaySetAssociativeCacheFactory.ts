import { NWaySetAssociativeCache } from "../NWaySetAssociativeCache";
import { PK } from "../types/PrimitiveKey";
import { ReplacementPolicy } from "../types/ReplacementPolicy";

export class NWaySetAssociativeCacheFactory {
  static create<K extends PK, V>(
    capacity: number,
    ways: number,
    policy: ReplacementPolicy
  ) {
    return new NWaySetAssociativeCache<K, V>(
      capacity,
      ways,
      policy
    );
  }
}

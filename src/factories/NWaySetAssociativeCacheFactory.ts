import { NWaySetAssociativeCache } from "../NWaySetAssociativeCache";
import { PK } from "../types/PrimitiveKey";
import { ReplacementPolicy } from "../types/ReplacementPolicy";
import { StorageType } from "../types/StorageTypes";

export class NWaySetAssociativeCacheFactory {
  static create<K extends PK, V>(
    capacity: number,
    ways: number,
    policy: ReplacementPolicy,
    storageType: StorageType,
  ) {
    return new NWaySetAssociativeCache<K, V>(
      capacity,
      ways,
      policy,
      storageType,
    );
  }
}

import { EvictionManagerRegistry } from "../registeries/EvictionRegistry";
import { PK } from "../types/PrimitiveKey";
import { ReplacementPolicy } from "../types/ReplacementPolicy";

export class EvictionManagerFactory {
  create<K extends PK>(policy: ReplacementPolicy): any {
    const ManagerClass = EvictionManagerRegistry.get<K>(policy);
    if (!ManagerClass) {
      throw new Error(
        `No eviction manager registered for policy: ${ReplacementPolicy[policy]}`,
      );
    }
    return new ManagerClass();
  }
}

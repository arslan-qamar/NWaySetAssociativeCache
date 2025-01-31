import { PK } from "../types/PrimitiveKey";

export interface EvictionManager<K extends PK> {
  recordAccess(key: PK): void;
  selectEvictionKey(): PK | undefined;
  removeKey(key: PK): void;
}

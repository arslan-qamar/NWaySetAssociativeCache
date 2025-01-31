import { PK } from "../types/PrimitiveKey";

export interface INWaySetAssociativeCache<K extends PK, V> {
  put(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  listAll(): Array<{ key: K; value: V }>;
}

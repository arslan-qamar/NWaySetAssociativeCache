import { EvictionManager } from "../interfaces/EvictionManager";
import { PK } from "../types/PrimitiveKey";

export class MruEvictionManager<K extends PK> implements EvictionManager<K> {
  private order: K[] = [];

  recordAccess(key: K): void {
    const index = this.order.indexOf(key);
    if (index !== -1) {
      this.order.splice(index, 1);
    }
    this.order.push(key);
  }

  selectEvictionKey(): K | undefined {
    return this.order.pop();
  }

  removeKey(key: K): void {
    const index = this.order.indexOf(key);
    if (index !== -1) {
      this.order.splice(index, 1);
    }
  }
}

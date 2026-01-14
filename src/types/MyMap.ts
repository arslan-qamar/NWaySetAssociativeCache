import { MapEntry } from "./MapEntry";
import { MapNode } from "./MapNode";
import { PK } from "./PrimitiveKey";

/**
 * A custom implementation of a hash map (dictionary).
 * Uses a hash table with linked list chaining for collision resolution.
 */
export class MyMap {
    /**
     * The array of buckets, where each bucket holds a linked list of `MapNode` instances.
     * Each bucket corresponds to a hash index.
     */
    private buckets: (MapNode | null)[] = [];

    private _size: number;
    private capacity: number;
    private loadFactorThreshold = 0.75;

    constructor(capacity = 16) {
        this.buckets = new Array(capacity).fill(null);
        this._size = 0;
        this.capacity = capacity;
    }

    private hash(key: PK): number {
        let hash = 0;
        const keyStr = typeof key === "string" ? key : JSON.stringify(key);
        for (let i = 0; i < keyStr.length; i++) {
            hash = (hash * 31 + keyStr.charCodeAt(i)) % this.capacity;
        }
        return hash;
    }

    set(key: PK, value: any): void {
        const index = this.hash(key);
        const newEntry = new MapEntry(key, value);

        if (this.buckets[index] === null) {
            this.buckets[index] = new MapNode(newEntry);
            this._size++;
        } else {
            let current = this.buckets[index]!;
            while (true) {
                if (current.entry.key === key) {
                    current.entry.value = value;
                    return;
                }
                if (current.next === null) break;
                current = current.next;
            }
            current.next = new MapNode(newEntry);
            this._size++;
        }

        if (this._size / this.capacity > this.loadFactorThreshold) {
            this.resize(this.capacity * 2);
        }
    }

    private resize(newCapacity: number): void {
        const oldBuckets = this.buckets;
        this.capacity = newCapacity;
        this.buckets = new Array(newCapacity).fill(null);
        this._size = 0;

        for (const node of oldBuckets) {
            let current = node;
            while (current !== null) {
                this.set(current.entry.key, current.entry.value);
                current = current.next;
            }
        }
    }

    has(key: PK): boolean {
        return this.get(key) !== undefined;
    }

    get(key: PK): any | undefined {
        const index = this.hash(key);
        let current = this.buckets[index];

        while (current !== null) {
            if (current.entry.key === key) {
                return current.entry.value;
            }
            current = current.next;
        }
        return undefined;
    }

    delete(key: PK): boolean {
        const index = this.hash(key);
        let current = this.buckets[index];
        let prev: MapNode | null = null;

        while (current !== null) {
            if (current.entry.key === key) {
                if (prev === null) {
                    this.buckets[index] = current.next;
                } else {
                    prev.next = current.next;
                }
                this._size--;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
    }

    get size(): number {
        return this._size;
    }

    entries(): Array<{ key: PK; value: any }> {
        const result: Array<{ key: PK; value: any }> = [];
        for (const bucket of this.buckets) {
            let current = bucket;
            while (current !== null) {
                result.push({ key: current.entry.key, value: current.entry.value });
                current = current.next;
            }
        }
        return result;
    }

    [Symbol.iterator](): Iterator<{ key: PK; value: any }> {
        let index = 0;
        const entries = this.entries();

        return {
            next: (): IteratorResult<{ key: PK; value: any }> => {
                if (index < entries.length) {
                    return { value: entries[index++], done: false };
                }
                return { value: undefined as any, done: true }; // `undefined as any` prevents type errors
            },
        };
    }

    clear(): void {
        this.buckets = new Array(this.capacity).fill(null);
        this._size = 0;
    }
}

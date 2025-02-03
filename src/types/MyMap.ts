import { MapNode } from "./MapNode";

/**
 * A custom implementation of a hash map (dictionary).
 * Uses a hash table with linked list chaining for collision resolution.
 */
class MyMap {
    /**
     * The array of buckets, where each bucket holds a linked list of `MapNode` instances.
     * Each bucket corresponds to a hash index.
     */
    private buckets: (MapNode | null)[] = [];
}

import { MapEntry } from "./MapEntry";

/**
 * Represents a node in the linked list for collision handling in the hash table.
 */
export class MapNode {
    constructor(
        /** The key-value pair stored in this node. */
        public entry: MapEntry,

        /** The reference to the next node in case of collisions (chaining). */
        public next: MapNode | null = null
    ) { }
}

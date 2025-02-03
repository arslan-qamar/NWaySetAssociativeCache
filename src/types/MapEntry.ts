import { PK } from "./PrimitiveKey";

/**
 * Represents a key-value pair in the map.
 * This stores the key as either a string or a number, and allows any value type.
 */
export class MapEntry {
    constructor(
        /** The key of the entry as PrimitiveKey PK (must be a string or number). */
        public key: PK,

        /** The associated value for the key (can be of any type). */
        public value: any 
    ) { }
}

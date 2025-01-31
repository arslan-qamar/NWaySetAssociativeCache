# N-Way Set Associative Cache

## Description

The **N-Way Set Associative Cache** is a high-performance caching library implemented in TypeScript. It provides efficient in-memory caching with customizable eviction policies, making it suitable for applications that require controlled cache behavior. The cache is designed to optimize lookups and store frequently accessed data while ensuring flexible eviction strategies.

## Installation

Install the package using npm or yarn:

```sh
# Using npm
npm install n-way-set-associative-cache

# Using yarn
yarn add n-way-set-associative-cache
```

## Usage

Below is an example of how to use the **N-Way Set Associative Cache** in a Node.js project:

```typescript
import { NWaySetAssociativeCache } from 'n-way-set-associative-cache';

// Create a cache with 4 sets and 2 items per set with LRU policy as default
const cache = new NWaySetAssociativeCache<string, number>(4, 2);

// Insert values into the cache
cache.set('key1', 100);
cache.set('key2', 200);

// Retrieve values from the cache
console.log(cache.get('key1')); // Output: 100

// Check if a key exists
console.log(cache.has('key2')); // Output: true

// Remove an entry
cache.delete('key1');
```

## API Documentation

### `NWaySetAssociativeCache<K, V>`

#### Constructor
```typescript
new NWaySetAssociativeCache<K, V>( capacity: number, ways: number)
```
- `capacity`: Total number of items cache can hold.
- `ways`: The number of items in each set. (Total sets  = capacity / ways, capacity must be a multiple of the number of ways) 

#### Methods

- **`set(key: K, value: V): void`** - Adds a key-value pair to the cache.
- **`get(key: K): V | undefined`** - Retrieves a value by key.
- **`has(key: K): boolean`** - Checks if the key exists in the cache.
- **`delete(key: K): boolean`** - Removes a key from the cache.
- **`clear(): void`** - Clears all entries from the cache.
- **`listAll(): { key: K; value: V; }[]`** - Lists all items in the cache in all sets

## How to Build

To build the project, ensure you have the latest versions of Node.js and npm installed.

```npm run build```

## How to Test

Run the test suite using the following command:

```npm run test```



## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with clear messages.
4. Submit a pull request for review.

Before submitting, please ensure your code adheres to the project's coding standards and includes relevant tests.

## Changelog

### v1.0.0
- Initial release of **N-Way Set Associative Cache**.
- Implemented core caching functionality with configurable eviction policies.
- Provided a flexible API for insertion, retrieval, and eviction.

For a complete list of changes, see the [CHANGELOG](https://github.com/arslan-qamar/NWaySetAssociativeCache/blob/master/CHANGELOG.md).

---

For more details, visit the project's [repository](https://github.com/arslan-qamar/NWaySetAssociativeCache/).


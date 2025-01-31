# N-Way Set Associative Cache - Design Documentation

## Overview

The **N-Way Set Associative Cache** is a high-performance caching library implemented in TypeScript. It is designed to provide efficient in-memory caching with customizable eviction policies, making it suitable for applications requiring controlled cache behavior with spatial locality. This package is structured for use in **Node.js** and browser-based environments.

## Internal Design

The cache is designed as an **N-Way Set Associative Cache**, which means:
- The cache is divided into multiple sets.
- Each set can hold up to **N** items.
- When a new item needs to be added to a full set, an eviction strategy determines which item to remove.

### Core Components

The package is modular and consists of several key components:

1. **NWaySetAssociativeCache.ts**
   - Implements the main cache logic.
   - Organizes items into sets.
   - Delegates eviction decisions to the configured policy.

2. **Eviction Policies**
   - **ReplacementPolicy.ts** (Abstract interface for eviction policies)
   - **LruEvictionManager.ts** (Least Recently Used)
   - **MruEvictionStrategy.ts** (Most Recently Used)   

3. **Factories**
   - **CacheDataStorageFactory.ts** (Creates storage solutions for cache entries)
   - **EvictionManagerFactory.ts** (Creates appropriate eviction strategies)
   - **NWaySetAssociativeCacheFactory.ts** (Builds instances of the cache with specified configurations)

4. **Storage Mechanisms**
   - **InMemoryStorage.ts** (Provides an in-memory storage backend)

5. **Utilities**
   - **PrimitiveKey.ts** (Ensures cache keys are handled in Type Safe Manner)

### Data Structure

Each cache set follows a simple map structure:
```
Map<K extends PK, V> = new Map()
```

Each **set** is implemented as a map of key value pairs, with an eviction manager determining removals when the map exceeds its size.

### Eviction Policies

Each eviction policy is implemented as a seperate class e.g: LruEvictionManager and MruEvictionManager are currently implemented. These classes keep track of the order of keys based on the eviction logic. 

All eviction policies need to implement the the **IEvictionManager** interface with following methods : 

```
recordAccess(key: PK): void;
selectEvictionKey(): PK | undefined;
removeKey(key: PK): void;
```
The above methods are called in the StorageManager (InMemoryStorage : default) layer in respective methods. 

### How Caching Works

1. **Insertion**: When adding an item, the cache determines the correct set based on the key.
2. **Eviction Handling**: If a set is full, the eviction policy removes an entry before adding the new one.
3. **Retrieval**: When retrieving an item, the storage manager records its access which calls the evicition manager to update the eviction tracking structure.
4. **Invalidation**: Entries can be removed manually using clear() method, otherwise currently they are retained indefinitely.

### Flow Diagram

```plaintext
 +----------------------+  Insert/Update   +-------------------------+
 |  User Request Data   | ---------------> | Determine Set Location  |
 +----------------------+                  +-------------------------+
                                                 |
                                                 v
                                        +---------------------+     Yes   +------------------------+
                                        |  Is Set Full?       | --------> | Evict Item             |
                                        +---------------------+           +------------------------+
                                            | No                                      |
                                            v                                         v
                                        +---------------------+           +---------------------+
                                        |  Add New Entry      |           |  Add New Entry      |
                                        +---------------------+           +---------------------+
                                        
```

## Use Cases

This cache is best suited for data with spatial locality in scenarios such as :
- **Web API Caching**: Speeding up API responses by caching frequent requests.
- **Database Query Optimization**: Reducing redundant queries.
- **Session Storage**: Maintaining session data in memory.
- **Machine Learning Models**: Storing model inferences to avoid recomputation.

## Strengths and Weaknesses

### Strengths:
- **Efficient Memory Usage**: Uses set-based partitioning to limit unbounded growth.
- **Customizable Eviction Strategies**: Supports multiple eviction policies.
- **Fast Lookup Times**: Optimized for quick access.
- **Flexible Storage Backends**: Can integrate with different storage mechanisms.

### Weaknesses:
- **Limited by Memory**: Since it is in-memory, it cannot persist beyond application restarts.
- **Not a Distributed Cache**: This implementation does not support multi-node deployments out-of-the-box.
- **Eviction Overhead**: Managing eviction strategies adds some computational overhead.

## Conclusion

This **N-Way Set Associative Cache** provides a highly efficient and customizable solution for caching needs where fine-tuned eviction control is required. Its modular design ensures extensibility and adaptability for various use cases.
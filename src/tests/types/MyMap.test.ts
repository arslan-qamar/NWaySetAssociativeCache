import { beforeEach, describe, expect, it } from "vitest";
import { MyMap } from "../../types/MyMap";
import { PK } from "../../types/PrimitiveKey";


describe("MyMap", () => {
    let map: MyMap<PK>;

    beforeEach(() => {
        map = new MyMap();
    });

    it("should set and get values correctly", () => {
        map.set("name", "Alice");
        map.set(42, 100);
        
        expect(map.get("name")).toBe("Alice");
        expect(map.get(42)).toBe(100);
    });

    it("should correctly check if a key exists", () => {
        map.set("age", 30);
        expect(map.has("age")).toBe(true);
        expect(map.has("unknown")).toBe(false);
    });

    it("should update an existing key's value", () => {
        map.set("name", "Alice");
        map.set("name", "Bob"); // Overwriting
        expect(map.get("name")).toBe("Bob");
    });

    it("should delete keys correctly", () => {
        map.set("city", "Sydney");
        expect(map.delete("city")).toBe(true);
        expect(map.get("city")).toBeUndefined();
        expect(map.delete("city")).toBe(false); // Already deleted
    });

    it("should track the size of the map", () => {
        expect(map.size).toBe(0);
        map.set("a", 1);
        map.set("b", 2);
        expect(map.size).toBe(2);
        map.delete("a");
        expect(map.size).toBe(1);
        map.clear();
        expect(map.size).toBe(0);
    });

    it("should support iteration using for...of", () => {
        map.set("one", 1);
        map.set("two", 2);

        const entries = [];
        for (const entry of map) {
            entries.push(entry);
        }

        expect(entries).toEqual([
            { key: "one", value: 1 },
            { key: "two", value: 2 }
        ]);
    });

    it("should return all entries correctly", () => {
        map.set(1, "one");
        map.set(2, "two");

        expect(map.entries()).toEqual([
            { key: 1, value: "one" },
            { key: 2, value: "two" }
        ]);
    });

    it("should clear the map correctly", () => {
        map.set("x", 50);
        map.set("y", 60);
        map.clear();
        expect(map.size).toBe(0);
        expect(map.get("x")).toBeUndefined();
    });

    it("should handle hash collisions correctly", () => {
        let singlemap = new MyMap<PK>(1);
        singlemap.set("abcd", "A");
        singlemap.set("badc", "B");

        expect(singlemap.get("abcd")).toBe("A");
        expect(singlemap.get("badc")).toBe("B");
    });
});

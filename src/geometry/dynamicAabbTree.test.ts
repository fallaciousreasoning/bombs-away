import { AABBTreeChild, AABBTree } from "./dynamicAabbTree";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";

interface Child extends AABBTreeChild<Child> {

}

test('can build and query basic tree', () => {
    const grid = [
        [1, 0, 0, 0, 1],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1],
    ];

    const children: Child[] = [];
    for (let y = 0; y < grid.length; ++y) {
        for (let x = 0; x < grid[y].length; ++x) {
            // Only insert solid things.
            if (!grid[y][x])
                continue;
            const min = new Vector2(x, y);
            const child = {
                bounds: AABB.fromMinMax(min, min.add(Vector2.one))
            };
            children.push(child);
        }
    }

    const tree = new AABBTree();

    for (const child of children) {
        tree.add(child);
    }
    
    // All children should be queryable by their own bounding box.
    for (const child of children) {
        const result = tree.query(child.bounds);
        expect(result).toContain(child);
        expect(result.length).toBe(1);
    }

    // Manual queries:
    const q1 = tree.query(AABB.fromMinMax(new Vector2(0.5), new Vector2(1.5)));
    expect(q1).toContain(children[0]);
    expect(q1).toContain(children[2]);
    expect(q1.length).toBe(2);

    const q2 = tree.query(AABB.fromMinMax(new Vector2(2.5, 3.5), new Vector2(4.5, 4.5)));
    expect(q2).toContain(children[5]);
    expect(q2).toContain(children[7]);
    expect(q2).toContain(children[8]);
    expect(q2.length).toBe(3);
})
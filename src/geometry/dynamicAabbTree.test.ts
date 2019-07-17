import { AABBTreeChild, AABBTree } from "./dynamicAabbTree";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";

interface Child extends AABBTreeChild<Child> {

}

test('root insertion', () => {
    const tree = new AABBTree<Child>();

    const c1 = {
        bounds: new AABB(Vector2.one, Vector2.one)
    };
    tree.add(c1);
    expect(tree.root.child).toBe(c1);

    const c2 = {
        bounds: new AABB(new Vector2(3), Vector2.one)
    };
    tree.add(c2);
    expect(tree.root.isLeaf()).toBeFalsy();
    expect(tree.root.nodes[1].child).toBe(c1);
    expect(tree.root.nodes[0].child).toBe(c2);
    expect(tree.root.bounds.contains(c1.bounds)).toBeTruthy();
    expect(tree.root.bounds.contains(c2.bounds)).toBeTruthy();

    const c3 = {
        bounds: new AABB(new Vector2(3, 1), Vector2.one)
    };
    tree.add(c3);
    expect(tree.root.isLeaf()).toBeFalsy();
    expect(tree.root.bounds.contains(c1.bounds)).toBeTruthy();
    expect(tree.root.bounds.contains(c2.bounds)).toBeTruthy();
    expect(tree.root.bounds.contains(c3.bounds)).toBeTruthy();
    expect(tree.root.nodes[1].child).toBe(c1);

    expect(tree.root.nodes[0].isLeaf()).toBeFalsy();
    expect(tree.root.nodes[0].bounds.contains(c2.bounds)).toBeTruthy();
    expect(tree.root.nodes[0].bounds.contains(c3.bounds)).toBeTruthy();

    const results = tree.query(AABB.fromMinMax(Vector2.one, new Vector2(3, 1)));
    expect(results).toContain(c1);
    expect(results).not.toContain(c2);
    expect(results).toContain(c3);
});
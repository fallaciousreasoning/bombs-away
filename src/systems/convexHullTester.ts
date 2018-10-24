import { Engine } from "../engine";
import { ConvexHull } from "../geometry/convexHull";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";
import { Vertices } from "../geometry/vertices";

export default function convexHullTester(input: Input, engine: Engine) {
    engine
    .makeSystem('transform', 'box')
    .onEach('tick', ({ transform, box }) => {
        const aabb = new AABB(transform.position, new Vector2(box.width, box.height));
        const verts =  new Vertices([
            aabb.topRight,
            aabb.min,
            aabb.bottomLeft,
            aabb.max
        ]);
        const hull = new ConvexHull(verts.vertices);

        const contains = hull.contains(input.mousePosition);
        box.color = contains ? 'green' : 'red';
    });
}
import { Engine } from "../engine";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";
import { Vertices } from "../geometry/vertices";
import { input } from "../game";

export default function convexHullTester(engine: Engine) {
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

        const contains = verts.contains(input.mousePosition);
        box.color = contains ? 'green' : 'red';
    });
}
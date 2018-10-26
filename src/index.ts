import Hull from "./components/hull";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addRenderer from './systems/addRenderer';
import convexHullTester from "./systems/convexHullTester";
import drawConvexHull from "./systems/drawConvexHull";
import { Vertices } from "./geometry/vertices";
import { makeCircle, makeBox } from "./geometry/createPolygon";
import { subtract } from "./geometry/subtract";
import { cut } from "./geometry/cut";
import { convexPartition } from "./geometry/bayazitDecomposer";

window['engine'] = engine;
window['debugPoints'] = [];

const canvas = document.getElementById('root') as HTMLCanvasElement;

const addShape = (shape: Vertices, color?: string) => {
    const s = new Entity();
    s.add(new Hull(shape, color));
    s.add(new Transform());
    engine.addEntity(s);
}
const boxPoly = makeBox(5, 2).translate(new Vector2(5));
const circlePoly = makeCircle(1, 10).translate(new Vector2(2.5, 5));
const cutPoly = makeBox(1, 2).translate(new Vector2(5, 4))

const joinedPoly = subtract(boxPoly, cutPoly);
const cutPolys = cut(boxPoly, new Vector2(5, -2), new Vector2(5, 8));
const decomposedPolys = convexPartition(joinedPoly);
console.log(decomposedPolys)

// addShape(boxPoly);
// addShape(cutPoly);
// addShape(circlePoly);
addShape(joinedPoly);
const colors = ['red', 'blue', 'yellow', 'gray', 'pink']

for (let i = 0; i < decomposedPolys.length; ++i)
    addShape(decomposedPolys[i], colors[i])

// addShape(cutPolys[0]);
// addShape(cutPolys[1]);

// const blob = new Entity();
// blob.add(new Hull(new Vertices([
//     new Vector2(0),
//     new Vector2(-1, 1),
//     new Vector2(-1.1, 2),
//     new Vector2(1, 3),
//     new Vector2(4, 3),
//     new Vector2(2, 0)
// ])));
// blob.add(new Transform(new Vector2(3.5)));

// const circle = new Entity();
// circle.add(new Hull(makeCircle(1)));
// circle.add(new Transform(new Vector2(7, 3)));

// engine.addEntity(blob);
// engine.addEntity(circle);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

drawConvexHull(canvas, engine);

convexHullTester(input, engine);



import Vector2 from '../core/vector2';
import { convexPartition } from './bayazitDecomposer';
import { makeBox, makeCircle } from './createPolygon';
import { subtract } from './subtract';
import { Vertices } from './vertices';

test('non concave polygon is not changed', () => {
    const circle = makeCircle(1, 50);
    const box = makeBox(1, 1);

    const decomposedCircle = convexPartition(circle);
    expect(decomposedCircle[0]).toBe(circle);

    const decomposedBox = convexPartition(box);
    expect(decomposedBox[0]).toBe(box);
});

test("bayazit makes no concave polygons", () => {
    const box = makeBox(5, 2);
    const circle = makeCircle(1, 8).translate(new Vector2(0, -1));

    const subtracted = subtract(box, circle);
    const decomposed = convexPartition(subtracted);

    for (const polygon of decomposed) {
        for (let i = 0; i < polygon.length; ++i) {
            expect(polygon.isReflexAt(i)).toBeFalsy();
        }
    }
});

test("polygon is correctly decomposed", () => {
    const input = `7.5 6
2.5 6
2.5 4
4.5 4
4.5 5
5.5 5
5.5 4
7.5 4`;

    const output = `5.5 5
5.5 4
7.5 4
7.5 6
=====
7.5 6
2.5 6
4.5 5
5.5 5
=====
2.5 6
2.5 4
4.5 4
4.5 5`;

    const points = input.trim().split('\n')
        .map(line => line.trim().split(' ').map(parseFloat))
        .map(parts => new Vector2(parts[0], parts[1]));

    const vertices = new Vertices(points);
    console.log(vertices.area)

    const decomposed = convexPartition(vertices);
    const result = decomposed.map(p => p.vertices.map(v => `${v.x} ${v.y}`).join('\n')).join('\n=====\n');

    expect(result).toBe(output);
});

test("polygon does not regress", () => {
    const input = `10 15.5
9.5 5.125
9.5 5.752777777777778
7.5 5.752777777777778
7.5 5.125
0 15.5`;

    const output = `9.5 5.752778
9.5 5.125
10 15.5
=======
10 15.5
0 15.5
7.5 5.752778
9.5 5.752778
=======
0 15.5
7.5 5.125
7.5 5.752778`;

    const points = input.trim().split('\n')
        .map(line => line.trim().split(' ').map(parseFloat))
        .map(parts => new Vector2(parts[0], parts[1]));

    const vertices = new Vertices(points);
    console.log(vertices.area);

    const decomposed = convexPartition(vertices);
    const result = decomposed.map(p => p.vertices.map(v => `${v.x} ${v.y}`).join('\n')).join('\n=====\n');

    expect(result).toBe(output);
});

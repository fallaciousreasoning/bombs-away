import Vector2 from '../core/vector2';
import { convexPartition } from './bayazitDecomposer';
import { makeBox, makeCircle } from './createPolygon';
import { polygonsToString, verticesFromString } from './serializer';
import { Vertices } from './vertices';

test('non concave polygon is not changed', () => {
    const circle = makeCircle(1, 50);
    const box = makeBox(1, 1);

    const decomposedCircle = convexPartition(circle);
    expect(decomposedCircle[0]).toBe(circle);

    const decomposedBox = convexPartition(box);
    expect(decomposedBox[0]).toBe(box);
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

    const decomposed = convexPartition(vertices);
    const result = decomposed.map(p => p.vertices.map(v => `${v.x} ${v.y}`).join('\n')).join('\n=====\n');

    expect(result).toBe(output);
});

test("1.polygon does not regress", () => {
    const input = `10 15.5
9.5 5.13
9.5 5.75
7.5 5.75
7.5 5.13
0 15.5`;

    const output = `9.5 5.75
9.5 5.13
10 15.5
=====
10 15.5
0 15.5
7.5 5.75
9.5 5.75
=====
0 15.5
7.5 5.13
7.5 5.75`;

    const vertices = verticesFromString(input);

    const decomposed = convexPartition(vertices);
    const result = polygonsToString(decomposed);

    expect(result).toBe(output);
});

test("2.polygon does not regress", () => {
    const input = `10 4.5
10 15.5
9.313884 6.266832
9.47 5.89
9.425981 5.782228
9.52 5.56`;

    const output = `9.47 5.89
9.43 5.78
9.52 5.56
10 4.5
10 5.9
=====
10 15.5
9.31 6.27
9.47 5.89
10 5.9`;

    const vertices = verticesFromString(input);

    const decomposed = convexPartition(vertices);
    const result = polygonsToString(decomposed);

    expect(result).toBe(output);
});
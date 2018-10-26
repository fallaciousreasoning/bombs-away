import { makeBox, makeCircle } from './createPolygon';
import { subtract } from './subtract';
import { convexPartition } from './bayazitDecomposer';
import Vector2 from '../core/vector2';

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
})
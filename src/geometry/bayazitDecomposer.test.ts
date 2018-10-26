import { makeBox, makeCircle } from './createPolygon';
import { subtract } from './subtract';
import { convexPartition } from './bayazitDecomposer';
import Vector2 from '../core/vector2';

test("bayazit makes no concave polygons", () => {
    const box = makeBox(5, 2);
    const circle = makeCircle(1).translate(new Vector2(0, -1));

    const subtracted = subtract(box, circle);
    const decomposed = convexPartition(subtracted);

    for (const polygon of decomposed) {
        for (let i = 0; i < polygon.length; ++i) {
            expect(polygon.isReflexAt(i)).toBeFalsy();
        }
    }
})
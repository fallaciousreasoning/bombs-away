import { makeBox } from "./createPolygon";
import Vector2 from "../core/vector2";
import { cut } from "./cut";

test('trivial cut works correctly', () => {
    const shape = makeBox(2, 1);
    const cutStart = new Vector2(0, -1);
    const cutEnd = new Vector2(0, 1);

    const parts = cut(shape, cutStart, cutEnd);

    expect(parts[0].length).toBe(4);
    expect(parts[1].length).toBe(4);
});
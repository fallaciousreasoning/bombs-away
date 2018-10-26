import Vector2 from "../core/vector2";
import { cross } from "./utils";

test('line point cross values are correct', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const left = new Vector2(1, -1);
    expect(cross(start, end, left)).toBeLessThan(0);

    const right = new Vector2(1, 1);
    expect(cross(start, end, right)).toBeGreaterThan(0);

    const on = Vector2.unitX;
    expect(cross(start, end, on)).toBe(0);
})
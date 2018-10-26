import Vector2 from "../core/vector2";
import { cross, isRight, isRightOn, isLeftOn } from "./lineUtils";

test('line point cross values are correct', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const left = new Vector2(1, -1);
    expect(cross(start, end, left)).toBeLessThan(0);

    const right = new Vector2(1, 1);
    expect(cross(start, end, right)).toBeGreaterThan(0);

    const on = Vector2.unitX;
    expect(cross(start, end, on)).toBe(0);
});

test('isLeft is sensible', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const left = new Vector2(1, -1);
    expect(cross(start, end, left)).toBeTruthy();

    const on = Vector2.unitX;
    expect(cross(start, end, on)).toBeFalsy();
});

test('isLeftOn is sensible', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const left = new Vector2(1, -1);
    expect(isLeftOn(start, end, left)).toBeTruthy();

    const on = Vector2.unitX;
    expect(isLeftOn(start, end, on)).toBeTruthy();
});

test('isRight is sensible', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const right = new Vector2(1, 1);
    expect(isRight(start, end, right)).toBeTruthy();

    const on = Vector2.unitX;
    expect(isRight(start, end, on)).toBeFalsy();
});

test('isRightOn is sensible', () => {
    const start = Vector2.zero;
    const end = Vector2.unitX;

    const right = new Vector2(1, 1);
    expect(isRightOn(start, end, right)).toBeTruthy();

    const on = Vector2.unitX;
    expect(isRightOn(start, end, on)).toBeTruthy();
});
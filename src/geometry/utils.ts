import Vector2 from "../core/vector2";

/**
 * Returns -1 if the point is left of the line, 1 if right, 0 if on.
 * @param start The start of the line
 * @param end The end of the line
 * @param point The point
 */
export const cross = (start: Vector2, end: Vector2, point: Vector2) => {
    return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x);
}

/**
 * Determine whether the point 'point' is to the left of the line from start to end.
 * @param start The start point of the line.
 * @param end The end point of the line.
 * @param point The point to determine the 'leftness' of.
 */
export const isLeft = (start: Vector2, end: Vector2, point: Vector2) => {
    return cross(start, end, point) < 0;
}

/**
 * Determine whether the point 'point' is to the right of the line from start to end.
 * @param start The start point of the line.
 * @param end The end point of the line.
 * @param point The point to determine the 'rightness' of.
 */
export const isRight = (start: Vector2, end: Vector2, point: Vector2) => {
    return cross(start, end, point) > 0;
}
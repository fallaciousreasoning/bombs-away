import Vector2 from "../core/vector2";

/**
 * Determine whether the point 'point' is to the left of the line from start to end.
 * @param start The start point of the line.
 * @param end The end point of the line.
 * @param point The point to determine the 'leftness' of.
 */
export const isLeft = (start: Vector2, end: Vector2, point: Vector2) => {
    return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x) <= 0;
}
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

/**
 * Finds the shortest distance from the line to the point.
 * Based on: https://stackoverflow.com/questions/3120357/get-closest-point-to-a-line#3122532
 * @param start The start of the line
 * @param end The end of the line
 * @param point The point
 */
export const shortestDistanceToLine = (start: Vector2, end: Vector2, point: Vector2) => {
    const t = ((end.x - start.x) * (point.x - start.x) + (end.y - start.y) * (point.y - start.y)) / start.distanceSquared(end);
    const dP = ((end.y - start.y) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x)) / start.distance(end);

    if (t >= 0 && t <= 1)
        return Math.abs(dP);
    else
        return Math.min(point.distance(start), point.distance(start));
}

/**
 * Finds the closest point on the line to the point.
 * Based on: https://stackoverflow.com/questions/3120357/get-closest-point-to-a-line#3122532
 * @param start The start of the line
 * @param end The end of the line
 * @param point The point
 */
export const closestPointOnLine = (start: Vector2, end: Vector2, point: Vector2) => {
    const sp = point.sub(start); // Vector start to point
    const se = end.sub(start); // Vector from start to end

    const magnitude = se.lengthSquared();
    const product = sp.dot(se); // The DOT product of start_to_p and start_to_end 
    const distance = product / magnitude; // The normalized "distance" from a to your closest point  

    // If the projection is not between start/end, return start/end
    if (distance < 0)    
        return start;

    else if (distance > 1)
        return end;

    return start.add(se.mul(distance));
}
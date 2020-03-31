import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";
import { Color } from "../core/color";

/**
 * Returns a random number between first and second, not inclusive of second. If second is omitted, 0 is used as the lower bound, first as the upper.
 */
export const random = (min?: number, max?: number) => {
    if (min === undefined)
        min = 1;
        
    if (max === undefined) {
        max = min;
        min = 0;
    }

    return min + Math.random() * (max - min);
}

/**
 * Same as random, except it returns a whole number.
 */
export const randomInt = (first: number, second?: number) => {
    return Math.floor(random(first, second));
}

/**
 * Selects a random value from an array.
 */
export const randomValue = <T>(fromArray: T[]) => {
    return fromArray[randomInt(fromArray.length)];
}

export const randomInBounds = (bounds: AABB) => {
    return randomVector2(bounds.min, bounds.max);
}

export const randomVector2 = (min: Vector2, max?: Vector2) => {
    if (!max) {
        max = min;
        min = Vector2.zero;
    }

    return new Vector2(random(min.x, max.x), random(min.y, max.y));
}

export const randomColor = (min?: Color, max?: Color) => {
    if (!min)
        min = Color.white;

    if (!max) {
        max = min;
        min = Color.black;
    }

    return new Color(
        randomInt(min.r, max.r),
        randomInt(min.g, max.g),
        randomInt(min.b, max.b));
}
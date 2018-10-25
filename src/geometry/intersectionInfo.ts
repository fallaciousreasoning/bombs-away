import Vector2 from "../core/vector2";

export interface IntersectionInfo {
    firstIndex: number;
    secondIndex?: number;

    startInside?: boolean;

    intercept: Vector2;
}
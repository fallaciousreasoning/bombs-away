import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";

const clipperEpsilonSquared = 1.192092896e-07;

/**
 * Calculates the intersections and adds them to the polygons.
 * @param subject The subject polygon
 * @param clip The clip polygon
 */
const calculateIntersections = (subject: Vertices, clip: Vertices): { subject: Vertices, clip: Vertices } => {

}

export const difference = (subject: Vertices, clip: Vertices) => {
    // Calculate the intersection and touch points
    const sliced = calculateIntersections(subject, clip);

    const lsBound = sliced.subject.bounds.min;
    const lcBound = sliced.subject.bounds.min;
    const translate = Vector2.one.sub(Vector2.min(lsBound, lcBound));

    // Translate polygons into the upper right quadrant, as the algorithm depends on it.
    if (translate.lengthSquared() != 0) {
        sliced.subject = sliced.subject.translate(translate);
        sliced.clip = sliced.clip.translate(translate);
    }

    const subjectSimplices = [];
    const subjectCoeff: number[] = [];
    const clipSimplices = [];
    const clipCoeff: number[] = [];
}
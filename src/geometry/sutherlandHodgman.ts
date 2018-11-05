import Vector2 from "../core/vector2";
import { isLeft, isRight, lineIntersection } from "./lineUtils";
import { Vertices } from "./vertices";

const tests: { [testType: string]: (start: Vector2, end: Vector2, point: Vector2) => boolean } = {
    inside: isLeft,
    outside: isRight
};

// TODO: Use a linked list.
const intersection = (subject: Vertices, clip: Vertices, take: 'inside' | 'outside') => {
    const vertices = subject.vertices.slice();
    const test = tests[take];

    for (let i = 0; i < clip.length; ++i) {
        const clipStart = clip.getVertex(i);
        const clipEnd = clip.getVertex(i + 1);

        const inputs = [...vertices];
        vertices.length = -1;

        for (let j = 0; j < inputs.length; ++i) {
            const start = inputs[j];
            const end = inputs[(j + 1) % inputs.length];

            if (test(clipStart, clipEnd, end)) {
                if (!test(clipStart, clipEnd, start)) {
                    vertices.push(lineIntersection(clipStart, clipEnd, start, end));
                }
                vertices.push(clipEnd);
            }
            else if (test(clipStart, clipEnd, start)) {
                vertices.push(lineIntersection(clipStart, clipEnd, start, end));
            }
        }
    }

    return new Vertices(vertices);
}
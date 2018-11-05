import Vector2 from "../core/vector2";
import { isLeft, isRight } from "./lineUtils";
import { Vertices } from "./vertices";

const lineIntersect = (p1: Vector2, p2: Vector2, q1: Vector2, q2: Vector2) => {
    let a1 = (p1.x * p2.y - p1.y * p2.x);
    let a2 = (q1.x * q2.y - q1.y * q2.x);

    let dX1 = p2.x - p1.x;
    let dX2 = q2.x - q1.x;
    let dY1 = p2.y - p1.y;
    let dY2 = q2.y - q1.y;

    let denominator = dX1 * dY2 - dY1 * dX2;

    let x = (a1 * dX2 - dX1 * a2) / denominator;
    let y = (a1 * dY2 - dY1 * a2) / denominator;

    return new Vector2(x, y);
}

const tests: { [testType: string]: (start: Vector2, end: Vector2, point: Vector2) => boolean } = {
    inside: isLeft,
    outside: isRight
};

// TODO: Use a linked list.
// export const intersection = (subject: Vertices, clip: Vertices, take: 'inside' | 'outside') => {
//     let vertices = subject.vertices.slice();
//     const test = tests[take||'inside'];

//     for (let i = 0; i < clip.length; ++i) {
//         const clipStart = clip.getVertex(i);
//         const clipEnd = clip.getVertex(i + 1);

//         const input = [...vertices];
//         vertices = [];

//         for (let j = 0; j < input.length; ++j) {
//             const start = input[j];
//             const end = input[(j + 1)%input.length];

//             if (test(clipStart, clipEnd, end)) {
//                 if (!test(clipStart, clipEnd, start)) {
//                     vertices.push(lineIntersect(clipStart, clipEnd, start, end));
//                 }
//                 vertices.push(clipEnd);
//             }
//             else if (test(clipStart, clipEnd, start)) {
//                 vertices.push(lineIntersect(clipStart, clipEnd, start, end));
//             }
//         }
//     }

//     return new Vertices(vertices);
// }

export const intersection = (subject: Vertices, clip: Vertices) => {
    const toPoints = (vs) => vs.vertices.map(v => [v.x, v.y]);
    const fromPoints = ps => ps.map(p => new Vector2(p[0], p[1]));
    return new Vertices(fromPoints(clipper(toPoints(subject), toPoints(clip))));
}

// TODO: Not this.
function clipper (subjectPolygon, clipPolygon) {
    var cp1, cp2, s, e;
    var inside = function (p) {
        return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
    };
    var intersection = function () {
        var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
            dp = [ s[0] - e[0], s[1] - e[1] ],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0], 
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
    };
    var outputList = subjectPolygon.slice();
    var inputList = [];
    cp1 = clipPolygon[clipPolygon.length-1];
    for (const j in clipPolygon) {
        var cp2 = clipPolygon[j];
        inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; //last on the input list
        for (const i in inputList) {
            var e = inputList[i];
            if (inside(e)) {
                if (!inside(s)) {
                    outputList.push(intersection());
                }
                outputList.push(e);
            }
            else if (inside(s)) {
                outputList.push(intersection());
            }
            s = e;
        }
        cp1 = cp2;
    }
    console.log(inputList)
    return outputList
}
import { polygonsFromString, polygonsToString } from "./serializer";
import { difference } from "./yuPengClipper";

test("Yu Peng Clips", () => {
    const input = `0 4.5
10 4.5
10 15.5
0 15.5
=====
8.5 3.13
9.21 3.42
9.5 4.13
9.21 4.83
8.5 5.125
7.79 4.83
7.5 4.13
7.79 3.42`;

    const output = `0 4.5
7.65 4.5
7.79 4.83
8.5 5.13
9.21 4.83
9.35 4.5
10 4.5
10 15.5
0 15.5`;

    const inputPolygons = polygonsFromString(input);

    const clipped = difference(inputPolygons[0], inputPolygons[1]);
    const result = polygonsToString(clipped);

    expect(result).toBe(output);
});
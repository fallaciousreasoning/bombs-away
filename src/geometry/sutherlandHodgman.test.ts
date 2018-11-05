import Vector2 from "../core/vector2";
import { makeBox } from "./createPolygon";
import { verticesToString } from "./serializer";
import { intersection } from "./sutherlandHodgman";
import { Vertices } from "./vertices";

test('intersection is correct for boxes', () => {
    const subject = makeBox(2, 2);
    const remove = makeBox(1, 1).translate(new Vector2(0, -0.5));

    const expected = verticesToString(remove);

    const intersected = intersection(subject, remove);
    const actual = verticesToString(intersected);
    expect(actual).toBe(expected);
});

test('thing from the internet works', () => {
   const subject = new Vertices([
       new Vector2(100,150),
       new Vector2(200,250), 
        new Vector2(300,200)
   ].reverse()); 

   const clip1 = new Vertices([
       new Vector2(150, 150),
       new Vector2(150, 200),
       new Vector2(200, 200),
       new Vector2(200, 150)
   ].reverse());

   const expected = new Vertices([
        new Vector2(150, 162.5),
        new Vector2(150, 200),
        new Vector2(200, 200),
        new Vector2(200, 175)
   ].reverse());

   const actual = intersection(subject, clip1);
   expect(verticesToString(actual)).toBe(verticesToString(expected))
});

test('other internet thing', () => {
    const fromPoints = (points: (number[])[]) => {
        const vertices = points.map(p => new Vector2(p[0], p[1]));
        return new Vertices(vertices);
    }
    const subject = new Vertices([new Vector2(50, 0), new Vector2(200, 50), new Vector2(350, 150), new Vector2(350, 300), new Vector2(250, 300), new Vector2(200, 250), new Vector2(150, 350), new Vector2(100, 250), new Vector2(100, 200)]);
    const clip = new Vertices([new Vector2(100, 100), new Vector2(300, 100), new Vector2(300, 300), new Vector2(100, 300)]);
    const expected = new Vertices([new Vector2(99.99999999999997,99.99999999999999),new Vector2(275,100),new Vector2(300,116.66666666666667),new Vector2(300,299.99999999999994),new Vector2(250,300),new Vector2(200,250),new Vector2(175,300),new Vector2(125,300),new Vector2(100,250)]);
    // const subject = [[50, 0], [200, 50], [350, 150], [350, 300], [250, 300], [200, 250], [150, 350], [100, 250], [100, 200]]
    // const clipPoly = [[100, 100], [300, 100], [300, 300], [100, 300]];
    const actual = intersection(subject, clip);
    // const expected = [[99.99999999999997,99.99999999999999],[275,100],[300,116.66666666666667],[300,299.99999999999994],[250,300],[200,250],[175,300],[125,300],[100,250]];
    expect(verticesToString(actual)).toBe(verticesToString(expected));
});
import { TextureConverter } from './textureConverter';

test('A square is parsed correctly', () => {
    const grid = [
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();
    expect(result.length).toBe(1);
    expect(result[0].length).toBe(16);

    const bounds = result[0].bounds;
    expect(bounds.min.x).toBe(0);
    expect(bounds.min.y).toBe(0);
    expect(bounds.max.x).toBe(4);
    expect(bounds.max.y).toBe(4);
});

test('Multiple shapes can be parsed correctly 1', () => {
    const grid = [
        [0,0,0,1,1],
        [0,0,0,0,0],
        [1,1,0,0,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();

    expect(result.length).toBe(2)
    expect(result[0].length).toBe(2);
    expect(result[1].length).toBe(11);
});

test('Multiple shapes can be parsed correctly 2', () => {
    const grid = [
        [0,0,0,1,1],
        [0,0,0,1,1],
        [1,1,0,0,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();

    expect(result.length).toBe(2);
    expect(result[0].length).toBe(4);
    expect(result[1].length).toBe(11);
});

test('Multiple shapes with no separating line', () => {
    const grid = [
        [1,0,0,1,1],
        [1,1,0,1,1],
        [1,1,0,0,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();

    expect(result.length).toBe(2);
    expect(result[0].length).toBe(14);
    expect(result[1].length).toBe(4);
});

test('Lines are valid', () => {
    const grid = [
        [0,0,0,0,0],
        [0,1,0,0,0],
        [0,1,0,0,0],
        [0,1,0,0,0],
        [0,0,0,0,0],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();

    expect(result.length).toBe(1);
    // TODO test length is correct...
    // TODO make length correct (remove consecutive duplicates).
});

test('Diagonals can join', () => {
    const grid = [
        [1,0,0,1,1],
        [1,1,0,1,1],
        [1,1,1,0,0],
        [1,1,1,1,0],
        [1,1,1,1,1],
    ];
    
    // TODO: Fix this test. There is a bug with self intersecting polygons.
    // Solution: 
    expect(true).toBeFalsy();

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();

    expect(result.length).toBe(2);
});
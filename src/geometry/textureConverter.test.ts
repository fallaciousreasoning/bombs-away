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

test('Multiple shapes can be parsed correctly', () => {
    const grid = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [1,1,0,0,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const converter = new TextureConverter(grid);
    const result = converter.getVertices();
    console.log(result[0].length)
    expect(result.length).toBe(2);

});
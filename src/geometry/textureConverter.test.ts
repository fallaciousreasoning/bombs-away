import { TextureConverter } from './textureConverter';

test('A square is parsed correctly', () => {
    const grid = [
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
    ];

    const conveter = new TextureConverter(grid);
    const result = conveter.getVertices();
    expect(result.length).toBe(1);
    expect(result[0].length).toBe(16);

    const bounds = result[0].bounds;
    expect(bounds.min.x).toBe(0);
    expect(bounds.min.y).toBe(0);
    expect(bounds.max.x).toBe(4);
    expect(bounds.max.y).toBe(4);
});
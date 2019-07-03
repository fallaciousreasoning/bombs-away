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

    console.log(result.map(r => r.length));
    expect(result.length).toBe(1);
});
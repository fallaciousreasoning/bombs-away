export class CollisionTexture {
    type: 'collisionTexture' = 'collisionTexture';

    grid: number[][] = [];

    constructor(width, height) {
        for (let i = 0; i < height; ++i) {
            const row = [];
            for (let j = 0; j < width; ++j) {
                row.push(1);
            }
            this.grid.push(row);
        }
    }
}
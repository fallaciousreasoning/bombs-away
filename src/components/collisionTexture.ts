export class CollisionTexture {
    type: 'collisionTexture' = 'collisionTexture';

    grid: number[][] = [];
    gridSize: number = 0.25;

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
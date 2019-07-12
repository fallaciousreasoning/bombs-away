export class CollisionTexture {
    type: 'collisionTexture' = 'collisionTexture';

    grid: (0|1)[][] = [];
    gridSize: number = 1;

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let i = 0; i < height; ++i) {
            const row = [];
            for (let j = 0; j < width; ++j) {
                row.push(1);
            }
            this.grid.push(row);
        }
    }
}
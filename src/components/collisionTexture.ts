export class CollisionTexture {
    type: 'collisionTexture' = 'collisionTexture';

    grid: (0 | 1)[][] = [];
    gridSize: number = 1;

    gridWidth: number;
    gridHeight: number;

    width: number;
    height: number;

    constructor(width: number, height: number, gridSize: number = undefined) {
        this.gridSize = gridSize === undefined ? 1 : gridSize;
        this.gridWidth = width/this.gridSize;
        this.gridHeight = height/this.gridSize;
        this.width = width;
        this.height = height;

        for (let i = 0; i < this.gridHeight; ++i) {
            const row = [];
            for (let j = 0; j < this.gridWidth; ++j) {
                row.push(1);
            }
            this.grid.push(row);
        }
    }
}
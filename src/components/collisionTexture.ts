import Vector2 from "../core/vector2";

export class CollisionTexture {
    type: 'collisionTexture' = 'collisionTexture';

    grid: (0 | 1)[][] = [];
    gridSize: number = 1;

    gridWidth: number;
    gridHeight: number;

    width: number;
    height: number;

    private _halfSize: Vector2;
    get halfSize() {
        if (!this._halfSize)
            this._halfSize = new Vector2(this.width, this.height).div(2);

        return this._halfSize;
    }

    constructor(width: number, height: number, gridSize: number = undefined) {
        this.gridSize = gridSize === undefined ? 1 : gridSize;
        this.gridWidth = width / this.gridSize;
        this.gridHeight = height / this.gridSize;
        this.width = width;
        this.height = height;

        const validSlop = 0.00001;
        if (Math.abs(this.gridWidth - Math.round(this.gridWidth)) >= validSlop) {
            console.warn(`Grid size ${gridSize} does not evenly divide width ${width}. (is ${this.gridWidth})`);
        }

        if (Math.abs(this.gridHeight - Math.round(this.gridHeight)) >= validSlop) {
            console.warn(`Grid size ${gridSize} does not evenly divide width ${height}. (is ${this.gridHeight})`);
        }

        // Use <= instead of < because we need a point on the far side of the grid.
        for (let i = 0; i <= this.gridHeight; ++i) {
            const row = [];
            for (let j = 0; j <= this.gridWidth; ++j) {
                row.push(1);
            }
            this.grid.push(row);
        }
    }
}
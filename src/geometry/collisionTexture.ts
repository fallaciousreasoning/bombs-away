import Vector2 from "../core/vector2";
import { TextureConverter } from "./textureConverter";

enum PointType {
    Solid,
    Empty,
};

export class CollisionTexture {
    width: number;
    height: number;
    gridSize: number = 0.1;

    private grid: PointType[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = [];

        // Initialize the grid to be completely solid.
        for (let i = 0; i < height; ++i) {
            const row = [];
            for (let j = 0; j < width; ++j) {
                row.push(PointType.Solid);
            }
            this.grid.push(row);
        }
    }

    removeCircle(centre: Vector2, radius: number) {
        this.forEachPoint(p => {
            if (centre.distance(p) > radius) return;

            this.grid[p.y][p.x] = PointType.Empty;
        })
    }

    forEachPoint = (action: (point: Vector2) => void) => {
        for (let i = 0; i < this.height; ++i)
          for (let j = 0; j < this.width; ++j)
            action(new Vector2(j, i));
    }

    getPolygons() {
        const converter = new TextureConverter(this.grid);
        return converter.getVertices();
    }
}
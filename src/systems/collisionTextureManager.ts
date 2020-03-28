import { Engine } from '../engine';
import { Entityish } from './system';
import Vector2 from '../core/vector2';
import { TextureConverter } from '../geometry/textureConverter';
import { convexPartition } from '../geometry/bayazitDecomposer';
import Input from '../core/input';
import { renderConfig } from './colliderRenderer';
import { Fixture } from '../collision/fixture';
import { input } from '../game';
import { tree } from './collisionDetector';
import { AABB } from '../core/aabb';

export const destroyCircle = (removeFrom: Entityish<['transform', 'collisionTexture', 'collider']>, centre: Vector2, radius: number) => {
    const halfSize = new Vector2(removeFrom.collisionTexture.width, removeFrom.collisionTexture.height).div(2);
    const radiusSquared = radius * radius;
    let removedPoints: Vector2[] = [];

    for (let i = 0; i < removeFrom.collisionTexture.grid.length; ++i)
        for (let j = 0; j < removeFrom.collisionTexture.grid[i].length; ++j) {
            const point = new Vector2(j, i);
            const position = point
                .mul(removeFrom.collisionTexture.gridSize)
                .add(removeFrom.transform.position)
                .sub(halfSize)

            if (removeFrom.collisionTexture.grid[point.y][point.x] === 0)
                continue;

            // Mark the point on the texture as empty.
            if (position.distanceSquared(centre) < radiusSquared) {
                removeFrom.collisionTexture.grid[point.y][point.x] = 0;
                removedPoints.push(position);
            }
        }

    if (!removedPoints.length) {
        return removedPoints;
    }

    const textureConverter = new TextureConverter(removeFrom.collisionTexture.grid);
    const vertices = textureConverter.getVertices();
    const decomposedVertices = vertices.map(v => convexPartition(v)).reduce((prev, next) => [...prev, ...next], []).map(v => v.scale(removeFrom.collisionTexture.gridSize));
    removeFrom.collider.fixtures = decomposedVertices
        .filter(v => v.area > 0.001)
        .map(v => new Fixture(v.translate(halfSize.negate()), removeFrom.transform, removeFrom.id));

    return removedPoints;
}
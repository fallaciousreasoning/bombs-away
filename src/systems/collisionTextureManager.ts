import { Fixture } from '../collision/fixture';
import { CollisionTexture } from '../components/collisionTexture';
import { AABB } from '../core/aabb';
import Vector2 from '../core/vector2';
import { convexPartition } from '../geometry/bayazitDecomposer';
import { TextureConverter } from '../geometry/textureConverter';
import { Entityish } from './system';

type Destroyable = Entityish<['transform', 'collisionTexture', 'collider']>;
export const destroyCircle = (removeFrom: Destroyable, centre: Vector2, radius: number) => {
    const radiusSquared = radius * radius;
    return destroyWithPredicate(removeFrom, point => point.distanceSquared(centre) < radiusSquared);
}

export const destroyBox = (removeFrom: Destroyable, box: AABB) => {
    return destroyWithPredicate(removeFrom, point => box.contains(point));
}

type DestroyPredicate = (point: Vector2) => boolean;
export const destroyWithPredicate = (removeFrom: Destroyable, predicate: DestroyPredicate) => {
    let removedPoints: Vector2[] = [];

    for (let i = 0; i < removeFrom.collisionTexture.grid.length; ++i)
        for (let j = 0; j < removeFrom.collisionTexture.grid[i].length; ++j) {
            const point = new Vector2(j, i);
            const position = point
                .mul(removeFrom.collisionTexture.gridSize)
                .add(removeFrom.transform.position)
                .sub(removeFrom.collisionTexture.halfSize);

            if (removeFrom.collisionTexture.grid[point.y][point.x] === 0)
                continue;

            // Mark the point on the texture as empty.
            if (predicate(position)) {
                removeFrom.collisionTexture.grid[point.y][point.x] = 0;
                removedPoints.push(position);
            }
        }

    if (!removedPoints.length) {
        return removedPoints;
    }

    const fixtures = getVerticesFromTexture(removeFrom.collisionTexture)
        .filter(v => v.area > 0.001)
        .map(v => new Fixture(v, removeFrom.transform, removeFrom.id));
    removeFrom.collider.fixtures = fixtures;

    return removedPoints;
}

export const getVerticesFromTexture = (collisionTexture: CollisionTexture) => {
    const textureConverter = new TextureConverter(collisionTexture.grid);
    const vertices = textureConverter.getVertices();
    const decomposedVertices = vertices
        .map(v => convexPartition(v))
        .reduce((prev, next) => [...prev, ...next], [])
        .map(v => v.scale(collisionTexture.gridSize));
        
    return decomposedVertices
        .filter(v => v.area > 0.001)
        .map(v => v.translate(collisionTexture.halfSize.negate()));
        // .map(v => new Fixture(v.translate(collisionTexture.halfSize.negate()), removeFrom.transform, removeFrom.id));
}
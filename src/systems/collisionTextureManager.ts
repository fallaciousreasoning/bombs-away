import { Engine } from '../engine';
import { Entityish } from './system';
import Vector2 from '../core/vector2';
import { TextureConverter } from '../geometry/textureConverter';
import { convexPartition } from '../geometry/bayazitDecomposer';
import Input from '../core/input';
import { config } from './colliderRenderer';
import { Fixture } from '../collision/fixture';

const destroyCircle = (removeFrom: Entityish<['transform', 'collisionTexture', 'collider']>, centre: Vector2, radius: number) => {
    const halfSize = new Vector2(removeFrom.collisionTexture.width, removeFrom.collisionTexture.height).div(2);
    const radiusSquared = radius*radius;
    let modified = false;

    for (let i = 0; i < removeFrom.collisionTexture.grid.length; ++i)
      for (let j = 0; j < removeFrom.collisionTexture.grid[i].length; ++j) {
        const point = new Vector2(j, i);
        const position = point
        .mul(removeFrom.collisionTexture.gridSize)
        .add(removeFrom.transform.position)
        .sub(halfSize)

        // Mark the point on the texture as empty.
        if (position.distanceSquared(centre) < radiusSquared) {
            removeFrom.collisionTexture.grid[point.y][point.x] = 0;
            modified = true;
        }
      }

    if (!modified) {
        return;
    }

    const textureConverter = new TextureConverter(removeFrom.collisionTexture.grid);
    const vertices = textureConverter.getVertices();
    const decomposedVertices = vertices.map(v => convexPartition(v)).reduce((prev, next) => [...prev, ...next], []).map(v => v.scale(removeFrom.collisionTexture.gridSize));
    removeFrom.collider.fixtures = decomposedVertices.map(v => new Fixture(v.translate(halfSize.negate()), removeFrom.transform, removeFrom.id));
}

export const addCollisionTextureManager = (engine: Engine, input: Input, cursor: Entityish<['transform']>) => {
    engine.makeSystem('transform', 'collisionTexture', 'collider')
        .onEach('tick', (entity) => {
            if (input.getAxis('shoot') === 0) return;

            destroyCircle(entity, cursor.transform.position, 0.5);
        });
}
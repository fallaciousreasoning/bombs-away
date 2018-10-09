import { Pool } from "../core/pool";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Collision } from "../messages/collision";
import { Entityish } from "./system";

type CollisionEntity = Entityish<['transform', 'body']>;

class CollisionManager {
    private islandPool: Pool<Collision> = new Pool<Collision>(() => ({
        type: 'collision',
        hit: undefined,
        moved: undefined,
        movedAmount: undefined,
        normal: undefined,
        penetration: 0
    }), () => { });

    private engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    collidesRectangleRectange(a: CollisionEntity, b: CollisionEntity, onlyIntersects: boolean): Collision {
        const aToB = b.transform.position.sub(a.transform.position);
        const xOverlap = (a.body.width + b.body.width) / 2 - Math.abs(aToB.x);

        if (xOverlap < 0) {
            return;
        }

        const yOverlap = (a.body.height + b.body.height) / 2 - Math.abs(aToB.y);

        if (yOverlap < 0) {
            return;
        }

        if (onlyIntersects) {
            return <any>true;
        }

        let normal: Vector2;
        let penetration: number;
        if (xOverlap < yOverlap) {
            normal = new Vector2(aToB.x < 0 ? -1 : 1, 0);
            penetration = xOverlap;
        } else {
            normal = new Vector2(0, aToB.y < 0 ? -1 : 1);
            penetration = yOverlap;
        }

        const message = this.islandPool.get();
        message.hit = b;
        message.moved = a;
        message.normal = normal;
        message.penetration = penetration;
        return message;
    }
}

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);

    engine
        .makeSystem('body', 'transform')
        .on('tick', (entities, message) => {
            // Outer loop over all dynamic bodies.
            for (let i = 0; i < entities.length; ++i) {
                const a = entities[i];

                // Move the entity.
                const movedAmount = a.body.velocity.mul(message.step);
                a.transform.position = a.transform.position.add(movedAmount);

                if (!a.body.isDynamic) continue;

                // Inner loop over all other bodies.
                for (let j = 0; j < entities.length; ++j) {
                    if (i == j) continue;

                    const b = entities[j];

                    const message = collisionManager.collidesRectangleRectange(a, b, false);
                    if (!message) {
                        continue;
                    }

                    message.movedAmount = movedAmount;

                    engine.broadcastMessage(message);
                }
            }
        });
}
import { Pool } from "./core/pool";
import { Engine } from "./engine";
import { Entity } from "./entity";

export class EntityPool extends Pool<Entity> {
    private engine: Engine;
    private ownedEntities = new Set<number>();

    constructor(engine: Engine, create: () => Entity, reset: (entity: Entity) => void) {
        super(create, reset);

        this.engine = engine;
        this.engine.getEntities().on('remove', (entity) => {
            if (!this.ownedEntities.has(entity.id)) return;

            this.release(entity);
        })
    }

    get() {
        const entity = super.get();
        this.ownedEntities.add(entity.id);
        return entity;
    }
}
import { Generated } from "./components/Generated";
import { Entity } from "./entity";
import { Names } from "./systems/system";

export class Family {
    private types: Names[];
    entities: Entity[] = [];

    constructor(types: Names[]) {
        this.types = types;
    }

    matches(entity: Entity) {
        return this.types.every(t => !!entity.has(t));
    }

    onEntityAdded(entity: Entity) {
        if (!this.matches(entity)) {
            return;
        }

        this.entities.push(entity);
    }

    onEntityRemoved(entity: Entity) {
        if (!this.matches(entity)) {
            return;
        }

        const index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
    }

    onComponentAdded(entity: Entity, component: Generated) {
        throw new Error('Component addition not supported');
    }

    onComponentRemoved(entity: Entity, component: Generated) {
        throw new Error('Component removal not supported')
    }

    getHashCode() {
        return this.types.join('|');
    }
}
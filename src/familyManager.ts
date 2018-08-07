import Component from "./components/component";
import { Entity } from "./entity";

class EntityNode {

}

export class Family {
    private types: string[];
    entities: Entity[] = [];

    constructor(types: string[]) {
        this.types = types;
    }

    matches(entity: Entity) {
        return this.types.every(t => !!entity.components[t]);
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

    onComponentAdded(entity: Entity, component: Component) {
        throw new Error('Component addition not supported');
    }

    onComponentRemoved(entity: Entity, component: Component) {
        throw new Error('Component removal not supported')
    }

    getHashCode() {
        return this.types.join('|');
    }
}
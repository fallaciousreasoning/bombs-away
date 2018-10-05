import { Component } from "./components/Component";
import { Entity } from "./entity";
import { ComponentType } from "./systems/system";

export class Family {
    private types: ComponentType[];
    entities: Entity[] = [];

    constructor(types: ComponentType[]) {
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
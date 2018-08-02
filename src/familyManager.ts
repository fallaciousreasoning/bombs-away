import Component from "./components/component";
import { Entity } from "./entity";

class EntityNode {

}

export class Family {
    private types: string[];

    constructor(types: string[]) {
        this.types = types;
    }

    onEntityAdded(entity: Entity) {

    }

    onEntityRemoved(entity: Entity) {

    }

    onComponentAdded(entity: Entity, component: Component) {

    }

    onComponentRemoved(entity: Entity, component: Component) {

    }

    getHashCode() {
        return this.types.join('|');
    }
}
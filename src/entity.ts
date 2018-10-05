import { Generated } from "./components/Generated";
import { Names, Narrow } from "./systems/system";

export class Entity {
    id: number;

    onComponentAdded: (entity: Entity, component: Generated) => void;
    onComponentRemoved: (entity: Entity, component: Generated) => void;

    get<Key extends Names>(name: Key) {
        return (<any>this)[name] as Narrow<Generated, Key>;
    }

    has(name: Names) {
        return !!this[name];
    }

    add(component: Generated) {
        this[component.name] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
    }

    remove(component: Generated | string) {
        const name = typeof component === "string" ? component : component.name;
        component = this[name];
        delete this[name];

        this.onComponentRemoved(this, component as Generated);
    }
}
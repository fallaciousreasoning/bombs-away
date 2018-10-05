import { Generated } from "./components/Generated";
import { Names, Narrow } from "./systems/system";

export class Entity {
    id: number;
    components: { [name: string]: Generated } = {};

    onComponentAdded: (entity: Entity, component: Generated) => void;
    onComponentRemoved: (entity: Entity, component: Generated) => void;

    get<Key extends Names>(name: Key) {
        return this.components[name] as Narrow<Generated, Key>;
    }

    has(name: Names) {
        return !!this.components[name];
    }

    add(component: Generated) {
        this.components[component.name] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
    }

    remove(component: Generated | string) {
        const name = typeof component === "string" ? component : component.name;
        component = this.components[name];
        delete this.components[name];

        this.onComponentRemoved(this, component);
    }
}
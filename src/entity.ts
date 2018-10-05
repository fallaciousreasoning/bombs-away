import { Component } from "./components/Component";
import { Names, Narrow } from "./systems/system";

export class Entity {
    id: number;

    onComponentAdded: (entity: Entity, component: Component) => void;
    onComponentRemoved: (entity: Entity, component: Component) => void;

    get<Key extends Names>(name: Key) {
        return (<any>this)[name] as Narrow<Component, Key>;
    }

    has(name: Names) {
        return !!this[name];
    }

    add(component: Component) {
        this[component.name] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
    }

    remove(component: Component | string) {
        const name = typeof component === "string" ? component : component.name;
        component = this[name];
        delete this[name];

        this.onComponentRemoved(this, component as Component);
    }
}
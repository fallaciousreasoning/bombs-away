import { Component } from "./components/Component";
import { ComponentType, Narrow, Entityish } from "./systems/system";

export class Entity {
    id: number;

    onComponentAdded: (entity: Entity, component: Component) => void;
    onComponentRemoved: (entity: Entity, component: Component) => void;

    get<Key extends ComponentType>(name: Key) {
        return (<any>this)[name] as Narrow<Component, Key>;
    }

    has<Key extends ComponentType>(name: Key): this is Entityish<[Key]> {
        return !!(<any>this)[name];
    }

    add(component: Component) {
        this[component.type] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
    }

    remove(component: Component | string) {
        const name = typeof component === "string" ? component : component.type;
        component = this[name];
        delete this[name];

        this.onComponentRemoved(this, component as Component);
    }
}
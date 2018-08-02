import Component from "./components/component";

export class Entity {
    id: number;
    components: { [name: string]: Component } = {};

    onComponentAdded: (entity: Entity, component: Component) => void;
    onComponentRemoved: (entity: Entity, component: Component) => void;

    get<T extends Component>(name: string) {
        return this.components[name] as T;
    }

    has(name: string) {
        return !!this.components[name];
    }

    add(component: Component) {
        this.components[component.name] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
    }

    remove(component: Component | string) {
        const name = typeof component === "string" ? component : component.name;
        component = this.components[name];
        delete this.components[name];

        this.onComponentRemoved(this, component);
    }
}
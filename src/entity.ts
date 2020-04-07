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

    add<ComponentType extends Component, This extends Entity>(this: This, component: ComponentType | ((entity: This) => ComponentType)): this & Entityish<[ComponentType['type']]> {
        if (typeof component === 'function')
            component = component(this);

        this[component.type] = component;
        this.onComponentAdded && this.onComponentAdded(this, component);
        return this as any;
    }

    remove<Type extends ComponentType, This extends Entity>(this: This, component: { type: Type } | Type): Omit<This, Type> {
        const name = typeof component === "string" ? component : component.type;
        component = this[name as ComponentType];
        delete this[name as ComponentType];

        this.onComponentRemoved(this, component as Component);
        return this as any;
    }
}
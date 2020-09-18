import { Component } from "./components/Component";
import { HashSet } from "./core/hashMap";
import { ObservableList } from "./core/observableList";
import { Entity } from "./entity";
import { Family } from "./familyManager";
import { Destroy } from "./messages/destroy";
import { Message } from "./messages/message";
import { ComponentType, System } from "./systems/system";
import { Instantiate } from "./messages/instantiate";

const destroyMessage: Destroy = { type: 'destroy' } as any;
const addMessage: Instantiate = { type: 'instantiate' } as any;

export class Engine {
    private entities: { [id: number]: Entity } = {};
    private families = new HashSet<Family>();
    private nextId = 0;

    private systems: any[] = [];

    broadcastMessage(event: Message) {
        for (const system of this.systems) {
            if (system[event.type]) {
                const entities = this.getFamily(...system.types).entities;
                system[event.type](entities, event);
            }
        }
    }

    makeSystem = <Components extends ComponentType[]>
        (...types: Components) => {
        const system = new System(...types);
        this.systems.push(system);
        return system;
    }

    getFamily(...types: ComponentType[]) {
        const newFamily = new Family(types);
        const existingFamily = this.families.has(newFamily);
        if (existingFamily) {
            return existingFamily;
        }

        Object.keys(this.entities)
            .map(k => this.entities[k])
            .forEach(e => newFamily.onEntityAdded(e));

        this.families.add(newFamily);
        return newFamily;
    }

    getEntity(id: number) {
        return this.entities[id];
    }

    assignId(entity: Entity) {
        entity.id = entity.id || ++this.nextId;
    }

    addEntity(entity: Entity) {
        this.assignId(entity);

        entity.onComponentAdded = this.onComponentAdded;
        entity.onComponentRemoved = this.onComponentRemoved;

        this.entities[entity.id] = entity;
        this.families.forEach(f => f.onEntityAdded(entity));

        addMessage.entity = entity;
        this.broadcastMessage(addMessage);
    }

    removeEntity(entityish: { id: number } | number) {
        entityish = typeof entityish === 'object' ? entityish.id : entityish;
        if (!entityish) {
            return;
        }

        const entity = this.entities[entityish];
        if (!entity) return;

        const id = entity.id;
        entity.id = undefined;

        destroyMessage.entity = entity;
        this.broadcastMessage(destroyMessage);

        this.families.forEach(f => f.onEntityRemoved(entity));
        delete this.entities[id];
    }

    clearEntities() {
        for (const id in this.entities) {
            this.removeEntity(this.entities[id]);
        }
    }

    private onComponentAdded(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentAdded(entity, component));
    }

    private onComponentRemoved(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentRemoved(entity, component));
    }
}
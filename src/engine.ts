import { Component } from "./components/Component";
import { HashSet } from "./core/hashMap";
import { ObservableList } from "./core/observableList";
import { Entity } from "./entity";
import { Family } from "./familyManager";
import { Destroy } from "./messages/destroy";
import { Message } from "./messages/message";
import { ComponentType, System } from "./systems/system";

const destroyMessage: Destroy = { type: 'destroy' } as any;

export class Engine {
    private entities = new ObservableList<Entity>();
    private families = new HashSet<Family>();
    private nextId = 0;

    private systems: any[] = [];

    broadcastMessage(event: Message) {
        for (const system of this.systems) {
            if (system[event.type]) {
                const entities = this.getFamily(system.types).entities;
                system[event.type](entities, event);
            }
        }
    }

    makeSystem = <T0 extends ComponentType=never,
        T1 extends ComponentType=never,
        T2 extends ComponentType=never,
        T3 extends ComponentType=never,
        T4 extends ComponentType=never,
        T5 extends ComponentType=never,
        T6 extends ComponentType=never,
        T7 extends ComponentType=never,
        T8 extends ComponentType=never,
        T9 extends ComponentType=never>
        (...types: [T0?, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?]) => {
        const system = new System(types);
        this.systems.push(system);
        return system;
    }

    getFamily(types: ComponentType[]) {
        const newFamily = new Family(types);
        const existingFamily = this.families.has(newFamily);
        if (existingFamily) {
            return existingFamily;
        }

        this.entities.items.forEach(e => {
            newFamily.onEntityAdded(e);
        });

        this.families.add(newFamily);
        return newFamily;
    }

    getEntities() {
        return this.entities;
    }

    assignId(entity: Entity) {
        entity.id = entity.id || ++this.nextId;
    }

    addEntity(entity: Entity) {
        this.assignId(entity);

        entity.onComponentAdded = this.onComponentAdded;
        entity.onComponentRemoved = this.onComponentRemoved;

        this.entities.push(entity);
        this.families.forEach(f => f.onEntityAdded(entity));
    }

    removeEntity(entityish: { id: number }) {
        let entity: Entity;
        let index: number;
        for (let i = 0; i < this.entities.items.length; ++i) {
            if (this.entities.items[i].id !== entityish.id) continue;

            entity = this.entities.items[i];
            index = i;
            break;
        }

        if (!entity) {
            return;
        }

        destroyMessage.entity = entity;
        this.broadcastMessage(destroyMessage);

        this.entities.removeAt(index);
        this.families.forEach(f => f.onEntityRemoved(entity));
    }

    private onComponentAdded(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentAdded(entity, component));
    }

    private onComponentRemoved(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentRemoved(entity, component));
    }
}
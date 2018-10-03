import { Generated } from "./components/Generated";
import { HashSet } from "./core/hashMap";
import { ObservableList } from "./core/observableList";
import { Entity } from "./entity";
import { Family } from "./familyManager";
import { Names, System } from "./systems/system";

interface Message {
    type: string;
}

export class Engine {
    private entities = new ObservableList<Entity>();
    private families = new HashSet<Family>();
    private nextId = 0;

    private systems: any[] = [];

    broadcastMessage<T extends { type: string }>(event: T) {
        for (const system of this.systems) {
            if (system[event.type]) {
                const family = this.getFamily(system.types).entities.map(c => c.components);
                system[event.type](family, event);
            }
        }
    }

    makeSystem = <T0 extends Names=never,
        T1 extends Names=never,
        T2 extends Names=never,
        T3 extends Names=never,
        T4 extends Names=never,
        T5 extends Names=never,
        T6 extends Names=never,
        T7 extends Names=never,
        T8 extends Names=never,
        T9 extends Names=never>
        (...types: [T0?, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?]) => {
        const system = new System(types);
        this.systems.push(system);
        return system;
    }

    getFamily(types: string[]) {
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

    addEntity(entity: Entity) {
        entity.id = this.nextId++;
        entity.onComponentAdded = this.onComponentAdded;
        entity.onComponentRemoved = this.onComponentRemoved;

        this.entities.push(entity);
        this.families.forEach(f => f.onEntityAdded(entity));
    }

    removeEntity(entity: Entity) {
        this.entities.pop(entity);
        this.families.forEach(f => f.onEntityRemoved(entity));
    }

    private onComponentAdded(entity: Entity, component: Generated) {
        this.families.forEach(f => f.onComponentAdded(entity, component));
    }

    private onComponentRemoved(entity: Entity, component: Generated) {
        this.families.forEach(f => f.onComponentRemoved(entity, component));
    }
}
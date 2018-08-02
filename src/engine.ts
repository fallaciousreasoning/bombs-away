import { HashSet } from "./core/hashMap";
import { ObservableList } from "./core/observableList";
import { Entity } from "./entity";
import { Family } from "./familyManager";
import { Subject } from "./iterators/subject";

export class Engine {
    private entities = new ObservableList<Entity>();
    private families: HashSet<Family>;
    private nextId = 0;

    private eventSubscriptions = new Map<string, Subject<Engine>>();
    private typeSubscriptions = new Map<string, Subject<Family>>();

    on(event: string) {
        if (!this.eventSubscriptions.has(event)) {
            this.eventSubscriptions.set(event, new Subject());
        }

        return this.eventSubscriptions.get(event);
    }

    broadcastMessage(event: string) {
        const subject = this.eventSubscriptions.get(event);
        if (!subject) {
            return;
        }

        subject.next(this);
    }

    with(types: string[]) {
        const newFamily = new Family(types);
        const existingFamily = this.families.has(newFamily);
        if (existingFamily) {
            return existingFamily;
        }
        
        this.entities.forEach(e => {
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

    private onComponentAdded(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentAdded(entity, component));
    }

    private onComponentRemoved(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentRemoved(entity, component));
    }
}
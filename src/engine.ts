import Component from "./components/component";
import { HashSet } from "./core/hashMap";
import { ObservableList } from "./core/observableList";
import { Entity } from "./entity";
import { Family } from "./familyManager";
import { Subject } from "./iterators/subject";

class EngineSubject<T> extends Subject<{ type: string }> {
    engine: Engine;

    constructor(engine: Engine) {
        super();

        this.engine = engine;
    }

    on(event: string) {
        const subscriber = new EngineSubject(this.engine);
        this.nextHandlers.push(e => {
            if (event !== e.type) {
                return;
            }

            subscriber.next(e);
        })

        return subscriber;
    }

    with<K extends {}>(...types: (keyof K & string)[]) {
        const family = this.engine.getFamily(types);
        const subscriber = new Subject<{ components: K }>();

        this.nextHandlers.push(() => {
            family.entities.forEach(e => subscriber.next(e as any));
        });

        return subscriber;
    }
}

export class Engine {
    private entities = new ObservableList<Entity>();
    private families = new HashSet<Family>();
    private nextId = 0;

    subscriber = new EngineSubject(this);

    broadcastMessage<T extends { type: string }>(event: T) {
        this.subscriber.next(event);
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

    private onComponentAdded(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentAdded(entity, component));
    }

    private onComponentRemoved(entity: Entity, component: Component) {
        this.families.forEach(f => f.onComponentRemoved(entity, component));
    }
}
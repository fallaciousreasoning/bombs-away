import { Engine } from '../engine';
import { Fixture } from '../collision/fixture';
import { Family } from '../familyManager';
import { Entityish } from './system';

let colliderFamily: Family;
let dynamicFamily: Family;

// Return all the fixtures in the world, except for ones from the same body as fixture.
export function* otherFixtures(fixture: Fixture): Iterable<Fixture> {
    if (!colliderFamily)
        return;

    for (const entity of colliderFamily.entities) {
        if (entity.id == fixture.bodyId) continue;

        const collider = entity.get('collider');
        if (!collider) continue;

        yield* collider.fixtures;
    }
}

export function* dynamicFixtures(): Iterable<Fixture> {
    if (!dynamicFamily)
        return;
    
    for (const entity of dynamicFamily.entities) {
        const body = entity.get('body');
        if (!body.isDynamic) continue;

        const collider = entity.get('collider');
        yield* collider.fixtures;
    }
}

export function* dynamicEntities(): Iterable<Entityish<['body', 'transform', 'collider']>> {
    yield* dynamicFamily.entities as any;
}

export const addFixtureManager = (engine: Engine) => {
    colliderFamily = engine.getFamily('collider');
    dynamicFamily = engine.getFamily('collider', 'body', 'transform');

    // When new colliders are added, make sure we correctly assign the bodyId.
    colliderFamily.addEventListener('added', e => {
        e.get('collider').fixtures.forEach(f => {
            f.bodyId = e.id;

            // Attempt to initialize transform.
            if (!f.transform)
                f.transform = e.get('transform');
        });
    });
}
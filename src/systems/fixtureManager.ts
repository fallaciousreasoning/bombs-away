import { Engine } from '../engine';
import { Fixture } from '../collision/fixture';
import { Family } from '../familyManager';

let colliderFamily: Family;
let dynamicFamily: Family;

// Return all the fixtures in the world, except potentially ones for a certain body.
export function* fixtures(notForBody: number = undefined): Iterable<Fixture> {
    if (!colliderFamily)
        return;

    for (const entity of colliderFamily.entities) {
        if (entity.id == notForBody) continue;

        const collider = entity.get('collider');
        if (!collider) continue;

        yield* collider.fixtures;
    }
}

export function* dynamicFixtures(): Iterable<Fixture> {
    if (!dynamicFamily)
        return;
    
    for (const entity of colliderFamily.entities) {
        const body = entity.get('body');
        if (body.isDynamic) return false;

        const collider = entity.get('collider');
        yield* collider.fixtures;
    }
}

export const addFixtureManager = (engine: Engine) => {
    colliderFamily = engine.getFamily('collider');
    dynamicFamily = engine.getFamily('collider', 'body');

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
import { Engine } from '../engine';
import { Fixture } from '../collision/fixture';
import { Family } from '../familyManager';

let family: Family;

// Return all the fixtures in the world.
export function* fixtures(): Iterable<Fixture> {
    if (!family)
        return;

    for (const entity of family.entities) {
        const collider = entity.get('collider');
        if (!collider) continue;

        yield* collider.fixtures;
    }
}

export const addFixtureManager = (engine: Engine) => {
    family = engine.getFamily('collider');

    // When new colliders are added, make sure we correctly assign the bodyId.
    family.addEventListener('added', e => {
        e.get('collider').fixtures.forEach(f => f.bodyId = e.id);
    });
}
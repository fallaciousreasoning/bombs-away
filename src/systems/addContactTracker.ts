import { Engine } from "../engine";

export default (engine: Engine) => {
    engine.makeSystem()
        .onMessage('trigger-enter', ({ moved, hit }) => {
            console.log('Enter');
            const contactTracker = moved.get('contactTracker');
            if (!contactTracker)
                return;

            const hitTag = hit.get('tag');

            if (!hitTag) {
                console.log(hit);
                return;
            }

            if (!contactTracker.tags.some(hitTag.hasTag))
                return;

            contactTracker.contactPoints++;

            const collider = moved.get('collider');
            collider.fillColor = contactTracker.hasContact ? 'red' : undefined;
        })
        .onMessage('trigger-exit', ({ moved, hit }) => {
            console.log('Exit');
            const contactTracker = moved.get('contactTracker');
            if (!contactTracker)
                return;

            const hitTag = hit.get('tag');

            if (!hitTag)
                return;

            if (!contactTracker.tags.some(hitTag.hasTag))
                return;

            contactTracker.contactPoints--;

            const collider = moved.get('collider');
            collider.fillColor = contactTracker.hasContact ? 'red' : undefined;
        });
}
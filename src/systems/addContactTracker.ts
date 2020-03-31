import { Engine } from "../engine";
import { Collision } from "../messages/collision";

export default (engine: Engine) => {
    const updateContact = (increment: number) => ({ entity, hit }: Collision) => {
        const contactTracker = entity.get('contactTracker');
        if (!contactTracker)
            return;

        const hitTag = hit.get('tag');
        const hasHitTag = hitTag && contactTracker.tags.some(hitTag.hasTag);

        const shouldIgnore = hasHitTag && contactTracker.ignoreTags || (!hasHitTag && !contactTracker.ignoreTags);
        if (shouldIgnore)
            return;

        contactTracker.contactPoints += increment;

        const collider = entity.get('collider');
        collider.fillColor = contactTracker.hasContact ? 'red' : undefined;
    };

    engine.makeSystem()
        .onMessage('trigger-enter', updateContact(1))
        .onMessage('trigger-exit', updateContact(-1));
}
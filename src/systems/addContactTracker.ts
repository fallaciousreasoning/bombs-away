import { Engine } from "../engine";
import { Entity } from "../entity";

export default (engine: Engine) => {
    const updateContact = (increment: number) => ({ moved, hit }: { moved: Entity, hit: Entity }) => {
        const contactTracker = moved.get('contactTracker');
        if (!contactTracker)
            return;

        const hitTag = hit.get('tag');
        const hasHitTag = hitTag && contactTracker.tags.some(hitTag.hasTag);

        const shouldIgnore = hasHitTag && contactTracker.ignoreTags || (!hasHitTag && !contactTracker.ignoreTags);
        if (shouldIgnore)
            return;

        contactTracker.contactPoints += increment;

        const collider = moved.get('collider');
        collider.fillColor = contactTracker.hasContact ? 'red' : undefined;
    };

    engine.makeSystem()
        .onMessage('trigger-enter', updateContact(1))
        .onMessage('trigger-exit', updateContact(-1));
}
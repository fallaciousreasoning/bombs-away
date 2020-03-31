import { Engine } from "../engine"

export default (engine: Engine) => {
    engine.makeSystem('replaceable')
        .onMessage('destroy', ({ entity }) => {
            const replaceable = entity.get('replaceable');
            if (!replaceable)
                return;
            const transform = entity.get('transform');

            const replacement = replaceable.makeReplacement();
            const replacementTransform = replacement.get('transform');
            if (replacementTransform && transform) {
                if (replaceable.copyTransform)
                    replacementTransform.position = transform.position;
                if (replaceable.copyRotation)
                    replacementTransform.rotation = transform.rotation;
                if (replaceable.copyScale)
                    replacementTransform.scale = transform.scale;
            }

            engine.addEntity(replacement);
        });
}
import { Engine } from "../engine"

export default (engine: Engine) => {
    engine.makeSystem('replaceable')
        .onTargetedMessage('destroy', ({ entity }) => {
            const transform = entity.get('transform');

            const replacement = entity.replaceable.makeReplacement();
            const replacementTransform = replacement.get('transform');
            if (replacementTransform && transform) {
                if (entity.replaceable.copyTransform)
                    replacementTransform.position = transform.position;
                if (entity.replaceable.copyRotation)
                    replacementTransform.rotation = transform.rotation;
                if (entity.replaceable.copyScale)
                    replacementTransform.scale = transform.scale;
            }

            engine.addEntity(replacement);
        });
}
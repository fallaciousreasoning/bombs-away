import { Engine } from "../engine";

export default (engine: Engine) => {
    engine.makeSystem('transform', 'animateSize')
        .onEach('tick', ({ transform, animateSize }, { step }) => {
            animateSize.timeTillEnd -= step;

            const delta = animateSize.end.sub(animateSize.start).mul(animateSize.percentage);
            transform.scale = animateSize.start.add(delta);
        })
}
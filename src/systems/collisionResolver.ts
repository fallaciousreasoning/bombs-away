import { Engine } from "../engine";

export default function naivePhysicsResolver(engine: Engine) {
    engine.makeSystem('transform', 'body')
        .onMessage("collision", (message) => {
            message.moved.body.velocity = message
                .moved
                .body
                .velocity
                .sub(message.normal
                    .mul(message.movedAmount.mul(1)));

            message.moved.transform.position = message
                .moved
                .transform
                .position
                .sub(message.normal
                    .mul(message.penetration));
            
        });
}
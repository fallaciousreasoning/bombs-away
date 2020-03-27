import { Engine } from "../engine";

export default (engine: Engine) => {
    engine.makeSystem('body', 'velocityClamp')
        .onEach('tick', ({ body, velocityClamp }) => {
            const bodySpeed = body.velocity.lengthSquared();

            if (bodySpeed > velocityClamp.maxVelocity**2)
                body.velocity = body.velocity.normalized().mul(velocityClamp.maxVelocity);

            if (body.angularVelocity > velocityClamp.maxAngularVelocity)
                body.angularVelocity = velocityClamp.maxAngularVelocity;

            if (body.angularVelocity < -velocityClamp.maxAngularVelocity)
                body.angularVelocity = -velocityClamp.maxAngularVelocity;
        })
}
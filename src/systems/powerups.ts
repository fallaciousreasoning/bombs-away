import Powerup from "../components/powerUp";
import { Engine } from "../engine";

export default (engine: Engine) => {
    engine.makeSystem()
        .onMessage('collision-enter', message => {
            const powerup = message.moved.get('powerup');
            const powerupable = message.hit.get('powerupable');

            if (!powerupable || !powerup)
                return;

            powerupable.powerups.push(powerup.power);
            engine.removeEntity(message.moved);
        });
}
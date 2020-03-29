import Powerup from "../components/powerUp";
import { Engine } from "../engine";
import { context, canvas } from "../game";

export type Powers = Powerup['power'];
export const powerupColors: { [P in Powerup['power']]: string } = {
    laser: 'limegreen',
    agility: 'purple',
    grenade: 'yellow',
    invulnerable: 'lightblue'
};
export const powers: Powers[] = Object.keys(powerupColors) as any;

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

    engine.makeSystem('powerupable')
        .onEach('tick', ({ powerupable }) => {
            context['resetTransform']();

            const padding = 10;
            const indicatorSize = 50;

            for (let i = 0; i < powerupable.powerups.length; ++i) {
                const power = powerupable.powerups[i];
                context.fillStyle = powerupColors[power];
                context.fillRect(canvas.width - (indicatorSize + padding) * (1 + i), padding, indicatorSize, indicatorSize);
            }
        });
}
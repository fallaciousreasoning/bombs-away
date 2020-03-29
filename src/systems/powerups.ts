import Powerup from "../components/powerup";
import { Engine } from "../engine";
import { context, canvas, input } from "../game";
import { Entity } from "../entity";

export type Powers = Powerup['power'];
export const powerupColors: { [P in Powerup['power']]: string } = {
    laser: 'limegreen',
    agility: 'purple',
    grenade: 'yellow',
    invulnerable: 'lightblue'
};
export const powers: Powers[] = Object.keys(powerupColors) as any;

export default (engine: Engine, makeGrenade: () => Entity) => {
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

    engine.makeSystem('powerupable', 'transform', 'collider')
        .onEach('tick', ({ powerupable, transform, collider }) => {
            if (!input.wasPressed('mousePrimary'))
                return;

            const tappedSelf = collider.fixtures.some(f => f.transformedVertices.contains(input.mousePosition));
            if (!tappedSelf)
                return;

            // if (!powerupable.powerups.length)
            //     return;

            // const power = powerupable.powerups.splice(0, 1)[0];
            let entity: Entity;
            entity = makeGrenade();
            // switch (power) {
            //     case "grenade":
            //         break;
            //     default:
            //         let never: never;
            // }

            if (entity) {
                const t = entity.get('transform');
                t.position = transform.position;
                t.rotation = transform.rotation;
                engine.addEntity(entity);
            }
        });
}
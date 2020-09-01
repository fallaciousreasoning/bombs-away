import Powerup from "../components/powerup";
import { Engine } from "../engine";
import { context, canvas, input } from "../game";
import { Entity } from "../entity";
import { Color } from "../core/color";

export type Powers = Powerup['power'];
export const powerupColors: { [P in Powerup['power']]: Color } = {
    laser: Color.limegreen,
    agility: Color.purple,
    grenade: Color.yellow,
    invulnerable: Color.lightblue
};

export const powers: Powers[] = Object.keys(powerupColors) as any;

export default (engine: Engine, makeGrenade: () => Entity, makeLaser: () => Entity) => {
    engine.makeSystem('powerupable', 'player')
        .onTargetedMessage('collision-enter', ({ entity, hit }) => {
            if (!hit.has('powerup'))
                return;

            const power = hit.powerup.power;
            if (power === "invulnerable") {
                entity.player.invulnerableFor = entity.player.invulnerableTime;
            } else if (power === "agility") {
                entity.player.fastFor = entity.player.fastTime;
            } else {
                entity.powerupable.powerups.push(hit.powerup.power);
            }
            engine.removeEntity(hit);
        });

    engine.makeSystem('powerupable')
        .onEach('tick', ({ powerupable }) => {
            context['resetTransform']();

            const padding = 10;
            const indicatorSize = 50;

            for (let i = 0; i < powerupable.powerups.length; ++i) {
                const power = powerupable.powerups[i];
                context.fillStyle = powerupColors[power].hex;
                context.fillRect(canvas.width - (indicatorSize + padding) * (1 + i), padding, indicatorSize, indicatorSize);
            }
        });

    engine.makeSystem('powerupable', 'transform', 'collider', 'player')
        .onEach('tick', ({ powerupable, transform, collider, player }) => {
            if (!input.wasPressed('mousePrimary'))
                return;

            const tappedSelf = collider.fixtures.some(f => f.transformedVertices.contains(input.mousePosition));
            if (!tappedSelf)
                return;

            if (!powerupable.powerups.length)
                return;

            const power: Powers = powerupable.powerups.splice(0, 1)[0];
            let entity: Entity;
            switch (power) {
                case "grenade":
                    entity = makeGrenade();
                    break;
                case "laser":
                    entity = makeLaser();
                    break;
            }

            if (entity) {
                const t = entity.get('transform');
                if (t) {
                    t.position = transform.position;
                }
                engine.addEntity(entity);
            }
        });
}
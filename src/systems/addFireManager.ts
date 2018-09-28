import { Transform } from "../components/transform";
import Weapon from "../components/weapon";
import Input from "../core/input";
import { Engine } from "../engine";

export default function addFireManager(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('transform', 'weapon')
    .map((entity) => {
        const transform: Transform = entity.components.transform;
        const weapon: Weapon = entity.components.weapon;

        weapon.nextShotIn -= entity.message['step'];

        if (weapon.nextShotIn < 0 && input.getAxis('jump')) {
            engine.addEntity(weapon.buildBullet(weapon, transform));
            weapon.nextShotIn = weapon.fireRate;
        }
    });
}
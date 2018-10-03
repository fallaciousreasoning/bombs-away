import Input from "../core/input";
import { Engine } from "../engine";

export default function addFireManager(input: Input, engine: Engine) {
    engine
        .makeSystem('transform', 'weapon')
        .onEach('tick', ({ transform, weapon }, message) => {
            weapon.nextShotIn -= message['step'];

            if (weapon.nextShotIn < 0 && input.getAxis('shoot')) {
                engine.addEntity(weapon.buildBullet(weapon, transform));
                weapon.nextShotIn = weapon.fireRate;
            }
        });
}
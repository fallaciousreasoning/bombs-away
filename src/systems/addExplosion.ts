import { Engine } from "../engine";

export default function explode(engine: Engine) {
    engine
    .makeSystem('transform')
    .onMessage('collision-enter', island => {
        // const explodes = island.moved.get('explodes');
        // if (!explodes) {
        //     return;
        // }

        // engine.addEntity(explodes.with(island.moved));
        // engine.removeEntity(island.moved);
    });
}
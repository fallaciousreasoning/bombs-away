import { Engine } from "./engine";
import { Tick } from "./messages/tick";

export const engine = new Engine();

const tickEvent: Tick = { type: 'tick', step: 0 };
let lastTick = 0;

const tick = (timestamp) => {
    const step = Math.min(timestamp - lastTick, 250);
    tickEvent.step = 1/60;//step/1000;
    engine.broadcastMessage(tickEvent);
    lastTick = timestamp;
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
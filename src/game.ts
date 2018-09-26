import { Engine } from "./engine";

export const engine = new Engine();

const tickEvent = { type: 'tick', step: 0 };
let lastTick = 0;

const tick = (timestamp) => {
    const step = Math.min(timestamp - lastTick, 250);
    tickEvent.step = step/1000;
    engine.broadcastMessage(tickEvent);
    lastTick = timestamp;
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
import { Engine } from "./engine";

export const engine = new Engine();

const tickEvent = { type: 'tick', step: 0 };
const tickRate = 1000/60;
let lastTick = 0;

const tick = (timestamp) => {
    const step = timestamp - lastTick;
    if (step > tickRate) {
        tickEvent.step = step;
        engine.broadcastMessage(tickEvent);
        lastTick = timestamp;
    }
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
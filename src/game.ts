import { Engine } from "./engine";

export const engine = new Engine();

const tickEvent = { type: 'tick' };
const tick = () => {
    engine.broadcastMessage(tickEvent);
    setTimeout(tick, 100/6);
};
tick();
import { Engine } from "./engine";
import { Tick } from "./messages/tick";
import Input from "./core/input";

export const engine = new Engine();
export const canvas = document.getElementById('root') as HTMLCanvasElement;
export const context = canvas.getContext('2d');
export const input = new Input(canvas);
window['input'] = input;

const tickEvent: Tick = { type: 'tick', step: 0 };
let lastTick = 0;

const tick = (timestamp) => {
    const step = Math.min(timestamp - lastTick, 60);
    tickEvent.step = step/1000;
    engine.broadcastMessage(tickEvent);
    lastTick = timestamp;
    requestAnimationFrame(tick);
    input.tick();
};

const updateCanvasSize = () => {
    const ratio = canvas.clientHeight / canvas.clientWidth;
    canvas.height = canvas.width*ratio;
}
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

requestAnimationFrame(tick);

if ('orientation' in screen) {
    screen.orientation
    .lock('landscape')
    .catch(() => console.error("Failed to lock orientation to landscape!"));
}

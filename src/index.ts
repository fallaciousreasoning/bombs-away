import { Engine } from "./engine";

const engine = new Engine();

engine.subscriber.on('tick').subscribe(console.log);
engine.broadcastMessage({ type: 'tick', data: 7 });
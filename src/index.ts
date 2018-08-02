import Box from "./components/box";
import { Transform } from "./components/transform";
import { Engine } from "./engine";
import { Entity } from "./entity";

const engine = new Engine();

const e1 = new Entity();
e1.add(new Box());
e1.add(new Transform());

const e2 = new Entity();

engine.addEntity(e1);
engine.addEntity(e2);

engine.subscriber.on('tick').subscribe(console.log);
engine.subscriber.on('tick').with(["Box", "Transform"]).subscribe(console.log);

engine.broadcastMessage({ type: 'tick', data: 7 });
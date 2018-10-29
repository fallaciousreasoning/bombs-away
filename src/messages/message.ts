import { Collision, CollisionEnter, CollisionExit, Trigger, TriggerEnter, TriggerExit } from "./collision";
import { Destroy } from "./destroy";
import { Tick } from "./tick";

export type Message = Destroy | Tick | Collision | CollisionEnter | CollisionExit | Trigger | TriggerEnter | TriggerExit;

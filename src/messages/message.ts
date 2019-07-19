import { Collision, CollisionEnter, CollisionExit, Trigger, TriggerEnter, TriggerExit } from "./collision";
import { Destroy } from "./destroy";
import { Instantiate } from "./instantiate";
import { Tick } from "./tick";

export type Message = Destroy | Instantiate | Tick | Collision | CollisionEnter | CollisionExit | Trigger | TriggerEnter | TriggerExit;

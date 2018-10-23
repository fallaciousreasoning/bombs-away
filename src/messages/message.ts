import { Collision, CollisionEnter, CollisionExit } from "./collision";
import { Destroy } from "./destroy";
import { Tick } from "./tick";

export type Message = Collision | CollisionEnter | CollisionExit | Destroy | Tick;

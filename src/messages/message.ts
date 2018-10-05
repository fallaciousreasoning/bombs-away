import { Collision } from "./collision";
import { Destroy } from "./destroy";
import { Tick } from "./tick";

export type Message = Collision | Destroy | Tick;

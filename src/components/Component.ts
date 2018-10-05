import AliveForTime from "./aliveForTime";
import Body from "./body";
import { Bounce } from "./bounce";
import Box from "./box";
import FlipWithMouse from "./flipWithMouse";
import Health from "./health";
import Line from "./line";
import LookAtMouse from "./lookAtMouse";
import Player from "./player";
import Spawn from "./spawn";
import { Transform } from "./transform";
import Weapon from "./weapon";

export type Component = AliveForTime | Body | Bounce | Box | FlipWithMouse | Health | Line | LookAtMouse | Player | Spawn | Transform | Weapon;

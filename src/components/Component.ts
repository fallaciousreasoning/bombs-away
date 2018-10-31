import AliveForTime from "./aliveForTime";
import Body from "./body";
import { Bounce } from "./bounce";
import Box from "./box";
import { Collider } from "./collider";
import Damage from "./damage";
import Explodes from "./explodes";
import FlipWithMouse from "./flipWithMouse";
import Health from "./health";
import Hull from "./hull";
import Line from "./line";
import LookAtMouse from "./lookAtMouse";
import Player from "./player";
import Spawn from "./spawn";
import { Tag } from "./tag";
import { Transform } from "./transform";
import Weapon from "./weapon";

export type Component = Collider | AliveForTime | Body | Bounce | Box | Damage | Explodes | FlipWithMouse | Health | Hull | Line | LookAtMouse | Player | Spawn | Tag | Transform | Weapon;

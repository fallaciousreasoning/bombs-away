import AliveForTime from "./aliveForTime";
import Body from "./body";
import { Bounce } from "./bounce";
import Box from "./box";
import { Camera } from "./camera";
import { Circle } from "./circle";
import { Collider } from "./collider";
import { CollisionTexture } from "./collisionTexture";
import ContactTracker from "./contactTracker";
import Damage from "./damage";
import Explodes from "./explodes";
import FlipWithMouse from "./flipWithMouse";
import { FollowTransform } from "./followTransform";
import GroundTiler from "./groundTiler";
import Health from "./health";
import Hull from "./hull";
import Line from "./line";
import LookAtMouse from "./lookAtMouse";
import ParticleEmitter from "./particleEmitter";
import Player from "./player";
import Powerup from "./powerup";
import RemoveWhenFar from "./removeWhenFar";
import Score from "./score";
import Spawn from "./spawn";
import { StayOnMouse } from "./stayOnMouse";
import { Tag } from "./tag";
import { Transform } from "./transform";
import VelocityClamp from "./velocityClamp";
import Weapon from "./weapon";

export type Component = AliveForTime | Body | Bounce | Box | Camera | Circle | Collider | CollisionTexture | ContactTracker | Damage | Explodes | FlipWithMouse | FollowTransform | GroundTiler | Health | Hull | Line | LookAtMouse | ParticleEmitter | Player | Powerup | RemoveWhenFar | Score | Spawn | StayOnMouse | Tag | Transform | VelocityClamp | Weapon;

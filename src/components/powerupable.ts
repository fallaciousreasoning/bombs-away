import ContactTracker from "./contactTracker";
import Powerup from "./powerUp";

export default class Powerupable {
    type: 'powerupable' = 'powerupable';
    powerups: Powerup['power'][] = [];
}
import ContactTracker from "./contactTracker";
import Powerup from "./powerup";

export default class Powerupable {
    type: 'powerupable' = 'powerupable';
    powerups: Powerup['power'][] = ['invulnerable', 'agility'];
}
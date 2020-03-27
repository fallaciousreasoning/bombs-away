import ContactTracker from "./contactTracker";

export default class Player {
    type: 'player' = 'player';
    speed = 25;
    jumpImpulse = 6;

    groundTracker: ContactTracker;
}
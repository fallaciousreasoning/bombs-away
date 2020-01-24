import ContactTracker from "./contactTracker";

export default class Player {
    type: 'player' = 'player';
    speed = 10;
    jumpImpulse = 5;

    groundTracker: ContactTracker;
}
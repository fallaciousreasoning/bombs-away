import ContactTracker from "./contactTracker";

export default class Player {
    type: 'player' = 'player';

    defaultSpeed = 25;
    get speed() {
        let result = this.defaultSpeed;
        if (this.isFast)
            result *= this.fastSpeedMultiplier;

        return result;
    }

    defaultJumpImpulse = 6;
    get jumpImpulse() {
        let result = this.defaultJumpImpulse;
        if (this.isFast)
            result *= this.fastJumpMultiplier;
        return result;
    }

    invulnerableTime = 30;
    invulnerableFor: number;
    get isInvulnerable() {
        return this.invulnerableFor > 0;
    }
    
    fastJumpMultiplier = 2.5;
    fastSpeedMultiplier = 5;
    fastTime = 30;
    fastFor: number;
    get isFast() {
        return this.fastFor > 0;
    }

    groundTracker: ContactTracker;
}
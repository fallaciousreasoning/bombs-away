import ContactTracker from "./contactTracker";
import { Color } from "../core/color";

interface ColorScheme {
    fill: Color;
    stroke: Color;
    thickness: number;
}

export const mergeIn = (current: ColorScheme, mergeIn: Partial<ColorScheme>, weighting: number): ColorScheme => {
    const copy = { ...current };
    for (const property in mergeIn) {
        const value = mergeIn[property];
        if (value instanceof Color)
            copy[property] = Color.lerp(current[property], value, weighting);
        else if (typeof value === 'number')
            copy[property] = current[property] + (value - current[property]) * weighting;
        else throw new Error(`Unknown property to merge in ${property}`);
    }
    return copy;
}

export default class Player {
    type: 'player' = 'player';

    normalColor: ColorScheme = {
        fill: Color.red,
        stroke: Color.black,
        thickness: 1
    };

    invulnerableColor: Partial<ColorScheme> = {
        stroke: Color.lightblue,
        thickness: 30
    };

    fastColor: Partial<ColorScheme> = {
        fill: Color.purple,
    };

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

    invulnerableTime = 10;
    invulnerableFor: number;
    get isInvulnerable() {
        return this.invulnerableFor > 0;
    }

    fastJumpMultiplier = 2.5;
    fastSpeedMultiplier = 5;
    fastTime = 10;
    fastFor: number;
    get isFast() {
        return this.fastFor > 0;
    }

    groundTracker: ContactTracker;
}
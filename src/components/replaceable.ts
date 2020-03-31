import { Entity } from "../entity";

export class Replaceable {
    type: 'replaceable' = 'replaceable';

    copyTransform = true;
    copyRotation = true;
    copyScale = true;
    
    makeReplacement: () => Entity;

    constructor(makeReplacement: () => Entity) {
        this.makeReplacement = makeReplacement;
    }
}
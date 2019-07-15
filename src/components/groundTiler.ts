import { Entity } from "../entity";
import { Entityish } from "../systems/system";

export default class GroundTiler {
    type: "groundTiler" = "groundTiler";
    tileFor: Entity;

    lastTiledHeight: number = 6;
    heightPadding: number = 8;

    constructor(tileFor: Entity) {
        this.tileFor = tileFor;
    }
}
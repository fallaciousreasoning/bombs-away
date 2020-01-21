import { Entity } from "../entity";
import { Entityish } from "../systems/system";

type MakeTile = () => Entityish<['transform', 'collider']>;
export default class GroundTiler {
    type: "groundTiler" = "groundTiler";
    tileFor: Entity;

    lastTiledHeight: number = 6;
    heightPadding: number = 8;

    makeTile: MakeTile;

    constructor(tileFor: Entity, makeTile: MakeTile) {
        this.tileFor = tileFor;
        this.makeTile = makeTile;
    }
}
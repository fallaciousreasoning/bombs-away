import { Entity } from "../entity";
import { Entityish } from "../systems/system";

type MakeTile = () => Entityish<['transform', 'collider']>;
type WidthInTiles = number | ((tileWidth?: number) => number);

export default class GroundTiler {
    type: "groundTiler" = "groundTiler";
    tileFor: Entity;

    tileHeight: number = 0;
    tileWidth: number = 0;

    lastTiledHeight: number = 6;
    heightPadding: number = 8;

    widthInTiles: WidthInTiles = 1; 

    makeTile: MakeTile;

    constructor(tileFor: Entity, makeTile: MakeTile, widthInTiles: WidthInTiles) {
        this.tileFor = tileFor;
        this.makeTile = makeTile;
        this.widthInTiles = widthInTiles;
    }
}
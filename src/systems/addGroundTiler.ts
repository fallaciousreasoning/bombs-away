import { Engine } from "../engine";
import { Entityish } from "./system";
import { METRES_A_PIXEL } from "./addRenderer";

export default (engine: Engine, canvas: HTMLCanvasElement, makeGroundTile: () => Entityish<['transform', 'collisionTexture']>) => {
    let width: number = canvas.width*METRES_A_PIXEL;
    let tileWidth: number;
    let tileHeight: number;

    engine.makeSystem('groundTiler', 'transform')
        .onEach('tick', ({ groundTiler, transform }) => {
            const tileForHeight = groundTiler.tileFor.get('transform').position.y;

            // We don't need to spawn another tile yet.
            let nextHeight = groundTiler.lastTiledHeight + tileHeight;
            if (isNaN(nextHeight)) nextHeight = transform.position.y;

            if (tileForHeight + groundTiler.heightPadding <= nextHeight)
              return;

            const tile = makeGroundTile();
            tile.transform.parent = transform;
            tile.transform.position = tile.transform.position.withY(nextHeight).withX(transform.position.x);


            tileWidth = tile.collisionTexture.width;
            tileHeight = tile.collisionTexture.height;
            engine.addEntity(tile);

            groundTiler.lastTiledHeight = nextHeight;
        })
}
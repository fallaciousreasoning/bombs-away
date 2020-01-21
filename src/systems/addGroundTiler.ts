import { Engine } from "../engine";
import { Entityish } from "./system";
import { METRES_A_PIXEL } from "./addRenderer";
import { canvas } from "../game";

export default (engine: Engine) => {
    let width: number = canvas.width * METRES_A_PIXEL;
    let tileWidth: number = 5;
    let tileHeight: number;

    engine.makeSystem('groundTiler', 'transform')
        .onEach('tick', ({ groundTiler, transform }) => {
            const tileForHeight = groundTiler.tileFor.get('transform').position.y;

            // We don't need to spawn another tile yet.
            let nextHeight = groundTiler.lastTiledHeight + tileHeight;
            if (isNaN(nextHeight)) nextHeight = transform.position.y;

            if (tileForHeight + groundTiler.heightPadding <= nextHeight)
                return;

            const widthInTiles = width / tileWidth;

            for (let i = 0; i < widthInTiles; ++i) {
                const tile = groundTiler.makeTile();
                tile.transform.parent = transform;
                tile.transform.position = tile.transform.position.withY(nextHeight).withX(transform.position.x + i * tileWidth);
                tileWidth = tile.collider.bounds.width;
                tileHeight = tile.collider.bounds.height;
                engine.addEntity(tile);
            }

            groundTiler.lastTiledHeight = nextHeight;
        })
}
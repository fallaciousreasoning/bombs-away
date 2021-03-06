import { Engine } from "../engine";
import { Entityish } from "./system";
import { METRES_A_PIXEL } from "./addRenderer";
import { canvas } from "../game";

export default (engine: Engine) => {
    engine.makeSystem('groundTiler', 'transform')
        .onEach('tick', ({ groundTiler, transform }) => {
            const tileForHeight = groundTiler.tileFor.get('transform').position.y;

            // We don't need to spawn another tile yet.
            let nextHeight = groundTiler.lastTiledHeight + groundTiler.tileHeight;
            if (isNaN(nextHeight)) nextHeight = transform.position.y;

            if (tileForHeight + groundTiler.heightPadding <= nextHeight)
                return;

            const getWidthInTiles = () => typeof groundTiler.widthInTiles === 'number'
                ? groundTiler.widthInTiles
                : groundTiler.widthInTiles(groundTiler.tileWidth);


            // Start with width in tiles as 1. It must be at least one, and we don't know the tile size yet.   
            let widthInTiles = 1;
            for (let i = 0; i < widthInTiles; ++i) {
                const tile = groundTiler.makeTile();
                tile.transform.parent = transform;
                groundTiler.tileWidth = tile.collider.bounds.width;
                groundTiler.tileHeight = tile.collider.bounds.height;

                // Update the width in tiles with our new tileWidth.
                widthInTiles = getWidthInTiles();

                tile.transform.position = tile.transform.position
                    .withY(nextHeight)
                    .withX(transform.position.x + i * groundTiler.tileWidth);
                engine.addEntity(tile);
            }

            groundTiler.lastTiledHeight = nextHeight;
        })
}
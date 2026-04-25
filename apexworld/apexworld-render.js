// =========================================================
// APEXWORLD — Renderer (v1.0)
// =========================================================
// Draws the world grid under the APEXSIM renderer.
// Integrates seamlessly with camera transforms.
// =========================================================

window.APEXWORLD = window.APEXWORLD || {};

APEXWORLD.Renderer = {

    tileSize: 16,

    draw(ctx) {
        const world = APEXWORLD.World;
        const tileSize = this.tileSize;

        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {

                const tile = world.getTile(x, y);
                const def = APEXWORLD.TileData.get(tile.type);

                ctx.fillStyle = def.color;
                ctx.fillRect(
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }
};

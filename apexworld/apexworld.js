// =========================================================
// APEXWORLD — Core (v1.0)
// =========================================================
// Responsibilities:
// - World size + bounds
// - Tile storage
// - Tile access helpers
// - Walkability checks
// - World initialization
// =========================================================

window.APEXWORLD = window.APEXWORLD || {};

APEXWORLD.World = {

    width: 80,     // tiles
    height: 45,    // tiles

    tiles: [],     // 2D array of tile objects

    init() {
        this.tiles = [];

        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push({
                    type: "grass",
                    walkable: true
                });
            }
            this.tiles.push(row);
        }

        console.log("APEXWORLD — World initialized (" + this.width + "×" + this.height + ")");
    },

    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    },

    getTile(x, y) {
        if (!this.inBounds(x, y)) return null;
        return this.tiles[y][x];
    },

    setTile(x, y, type, walkable = true) {
        if (!this.inBounds(x, y)) return;
        this.tiles[y][x] = { type, walkable };
    },

    isWalkable(x, y) {
        const t = this.getTile(x, y);
        return t ? t.walkable : false;
    }
};

// Auto-init
APEXWORLD.World.init();

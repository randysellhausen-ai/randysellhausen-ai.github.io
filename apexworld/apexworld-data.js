// =========================================================
// APEXWORLD — Tile Data (v1.0)
// =========================================================
// Defines tile types + colors for rendering.
// =========================================================

window.APEXWORLD = window.APEXWORLD || {};

APEXWORLD.TileData = {

    types: {
        grass: {
            color: "#0f3d0f",
            walkable: true
        },
        dirt: {
            color: "#5a3b1e",
            walkable: true
        },
        water: {
            color: "#003366",
            walkable: false
        },
        stone: {
            color: "#444444",
            walkable: true
        }
    },

    get(type) {
        return this.types[type] || this.types.grass;
    }
};

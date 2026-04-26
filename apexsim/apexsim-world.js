// =========================================================
// APEXSIM.World — Liminal Engine v8.2
// WORLD GENERATION (APEXWORLD v1)
// =========================================================
// Responsibilities:
// - Define a deterministic tile-based world
// - Generate a 2D grid of tiles using a seed
// - Provide helpers for querying tiles and properties
// - Integrate cleanly with Engine and Renderer
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.World = {

    // -----------------------------------------------------
    // CONFIG
    // -----------------------------------------------------
    seed: 12345,          // Change for different worlds
    width: 128,           // tiles
    height: 128,          // tiles
    tiles: null,          // 2D array [y][x]

    // Tile types (v1)
    TILE_GRASS: 0,
    TILE_WATER: 1,
    TILE_ROCK:  2,

    // -----------------------------------------------------
    // INIT / GENERATION
    // -----------------------------------------------------
    init(config = {}) {
        if (typeof config.seed === "number")  this.seed  = config.seed;
        if (typeof config.width === "number") this.width = config.width;
        if (typeof config.height === "number") this.height = config.height;

        this._initRNG(this.seed);
        this._generateTiles();

        console.log(
            `APEXSIM.World — Generated ${this.width}x${this.height} world with seed ${this.seed}.`
        );
    },

    _generateTiles() {
        const w = this.width;
        const h = this.height;

        this.tiles = new Array(h);
        for (let y = 0; y < h; y++) {
            this.tiles[y] = new Array(w);
            for (let x = 0; x < w; x++) {
                this.tiles[y][x] = this._generateTile(x, y);
            }
        }
    },

    _generateTile(x, y) {
        // Simple deterministic noise-ish pattern using seeded RNG
        const n = this._noise2D(x, y);

        let type;
        if (n < 0.25) {
            type = this.TILE_WATER;
        } else if (n < 0.35) {
            type = this.TILE_ROCK;
        } else {
            type = this.TILE_GRASS;
        }

        return {
            x,
            y,
            type,
            walkable: (type !== this.TILE_WATER && type !== this.TILE_ROCK),
            elevation: 0,   // reserved for v2
            biome: "default" // reserved for v2
        };
    },

    // -----------------------------------------------------
    // SEEDED RNG + NOISE
    // -----------------------------------------------------
    _rngState: 1,

    _initRNG(seed) {
        // Simple LCG
        this._rngState = seed >>> 0;
    },

    _rand() {
        // LCG parameters (Numerical Recipes)
        this._rngState = (1664525 * this._rngState + 1013904223) >>> 0;
        return this._rngState / 0xFFFFFFFF;
    },

    _noise2D(x, y) {
        // Hash coordinates into RNG state for local noise
        const prev = this._rngState;
        const h = (x * 374761393 + y * 668265263) ^ (x * y);
        this._rngState = (h ^ (h >>> 13)) >>> 0;
        const v = this._rand();
        this._rngState = prev;
        return v;
    },

    // -----------------------------------------------------
    // QUERY HELPERS
    // -----------------------------------------------------
    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    },

    getTile(x, y) {
        if (!this.inBounds(x, y)) return null;
        return this.tiles[y][x];
    },

    isWalkable(x, y) {
        const t = this.getTile(x, y);
        return !!(t && t.walkable);
    }
};

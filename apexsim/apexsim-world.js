// =========================================================
// APEXSIM.World — Liminal Engine v8.2
// Simple deterministic tile world for renderer testing
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.World = {

    width: 0,
    height: 0,
    seed: 0,

    tiles: null,

    // Tile types
    TILE_GRASS: 0,
    TILE_WATER: 1,
    TILE_ROCK: 2,

    // -----------------------------------------------------
    // INIT
    // -----------------------------------------------------
    init(config = {}) {
        this.width  = config.width  || 64;
        this.height = config.height || 64;
        this.seed   = config.seed   || 1;

        this._seedRandom(this.seed);
        this._generate();

        console.log(
            `%cAPEXSIM.World — Initialized (${this.width}×${this.height})`,
            "color:#00ff88;font-weight:bold;"
        );
    },

    // -----------------------------------------------------
    // WORLD GENERATION
    // -----------------------------------------------------
    _generate() {
        this.tiles = [];

        for (let y = 0; y < this.height; y++) {
            const row = [];

            for (let x = 0; x < this.width; x++) {
                const n = this._noise(x, y);

                let type;
                if (n < 0.35) type = this.TILE_WATER;
                else if (n < 0.55) type = this.TILE_GRASS;
                else type = this.TILE_ROCK;

                row.push({ type });
            }

            this.tiles.push(row);
        }
    },

    // -----------------------------------------------------
    // SIMPLE DETERMINISTIC NOISE
    // -----------------------------------------------------
    _seedRandom(seed) {
        this._rand = seed;
    },

    _random() {
        // Linear congruential generator
        this._rand = (this._rand * 1664525 + 1013904223) % 4294967296;
        return this._rand / 4294967296;
    },

    _noise(x, y) {
        // Combine coordinates into seed
        const s = x * 374761393 + y * 668265263;
        this._seedRandom(this.seed + s);
        return this._random();
    }
};

// =========================================================
// APEXSIM.Renderer — Liminal Engine v8.2 (World‑Centered)
// =========================================================
// Responsibilities:
// - Attach canvas + context
// - Render world centered on camera
// - Render units in world space
// - Render debug overlay
// - Integrate with Camera.state
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,
    camera: null,

    tileSize: 16, // world tile size in pixels

    // -----------------------------------------------------
    // INIT
    // -----------------------------------------------------
    init(canvas) {
        if (!canvas) {
            console.error("APEXSIM.Renderer.init — No canvas provided.");
            return;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // REQUIRED: camera must use .state
        if (APEXSIM.Camera && APEXSIM.Camera.state) {
            this.camera = APEXSIM.Camera.state;
        } else {
            console.error("APEXSIM.Renderer — Camera.state missing.");
            this.camera = { x: 0, y: 0, zoom: 1 };
        }

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    // -----------------------------------------------------
    // MAIN RENDER LOOP ENTRY
    // -----------------------------------------------------
    render() {
        if (!this.ctx || !this.camera) return;

        this._clear();
        this._applyCamera();

        this._drawWorldCentered();
        this._drawUnits();
        this._drawDebug();

        this._restoreCamera();
    },

    // -----------------------------------------------------
    // CLEAR SCREEN
    // -----------------------------------------------------
    _clear() {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // -----------------------------------------------------
    // CAMERA TRANSFORM
    // -----------------------------------------------------
    _applyCamera() {
        const ctx = this.ctx;
        const cam = this.camera;

        ctx.save();

        // Move origin to center of screen
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        // Apply zoom
        ctx.scale(cam.zoom, cam.zoom);

        // Move world so camera.x, camera.y is at screen center
        ctx.translate(-cam.x, -cam.y);
    },

    _restoreCamera() {
        this.ctx.restore();
    },

    // -----------------------------------------------------
    // WORLD RENDERING (CENTERED)
    // -----------------------------------------------------
    _drawWorldCentered() {
        const World = APEXSIM.World;
        if (!World || !World.tiles) return;

        const ctx = this.ctx;
        const size = this.tileSize;

        // Compute world pixel dimensions
        const worldPixelWidth  = World.width  * size;
        const worldPixelHeight = World.height * size;

        // Compute world origin so that world center is at (0,0)
        const originX = -worldPixelWidth  / 2;
        const originY = -worldPixelHeight / 2;

        for (let y = 0; y < World.height; y++) {
            for (let x = 0; x < World.width; x++) {
                const tile = World.tiles[y][x];

                let color;
                switch (tile.type) {
                    case World.TILE_WATER: color = "#103050"; break;
                    case World.TILE_ROCK:  color = "#555555"; break;
                    default:               color = "#203820"; break;
                }

                ctx.fillStyle = color;
                ctx.fillRect(
                    originX + x * size,
                    originY + y * size,
                    size,
                    size
                );
            }
        }
    },

    // -----------------------------------------------------
    // UNIT RENDERING (WORLD‑CENTERED)
    // -----------------------------------------------------
    _drawUnits() {
        const Engine = APEXSIM.Engine;
        if (!Engine || !Engine.units) return;

        const ctx = this.ctx;

        ctx.fillStyle = "#00eaff";

        for (let unit of Engine.units) {
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#00eaff";
            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(unit.x + unit.vx * 8, unit.y + unit.vy * 8);
            ctx.stroke();
        }
    },

    // -----------------------------------------------------
    // DEBUG OVERLAY
    // -----------------------------------------------------
    _drawDebug() {
        const Debug = APEXSIM.DebugControl;
        if (!Debug || !Debug.enabled) return;

        const Engine = APEXSIM.Engine;

        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "14px monospace";

        const lines = [
            `Units: ${Engine.units.length}`,
            `Running: ${Engine._running}`,
            `Speed: ${Engine._speed.toFixed(2)}x`,
            `Step Requested: ${Engine._stepRequested}`
        ];

        let y = 20;
        for (let line of lines) {
            this.ctx.fillText(line, 20, y);
            y += 18;
        }

        this.ctx.restore();
    }
};

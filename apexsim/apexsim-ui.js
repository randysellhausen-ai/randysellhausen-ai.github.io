APEXSIM.UI = {

    init(canvas) {
        this.canvas = canvas;
        this._bindInput();
        console.log("APEXSIM.UI — Canvas attached and UI subsystems initialized.");
    },

    _bindInput() {
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Convert screen → world → tile
            const cam = APEXSIM.Camera;
            const worldX = (x / cam.zoom) + cam.x;
            const worldY = (y / cam.zoom) + cam.y;

            const tileX = Math.floor(worldX);
            const tileY = Math.floor(worldY);

            const unit = APEXSIM.Test.unit;
            if (!unit) return;

            const path = APEXSIM.Path.findPath(unit.x, unit.y, tileX, tileY);
            unit.path = path;
        });
    }
};

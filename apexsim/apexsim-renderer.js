// =========================================================
// APEXSIM — RENDERER
// =========================================================
// Handles drawing the simulation: grid, units, overlays.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Renderer = (function () {

    const gridSize = 32;

    function drawGrid(ctx, width, height) {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    function drawUnits(ctx) {
        const units = window.APEXSIM.Core.getUnits();

        for (let unit of units) {
            if (!unit.x || !unit.y) continue;

            ctx.fillStyle = unit.color || "cyan";
            ctx.fillRect(unit.x - 10, unit.y - 10, 20, 20);

            // Optional: stance indicator
            if (unit.stance) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(unit.x - 3, unit.y - 20, 6, 6);
            }
        }
    }

    return {

        draw() {
            const ctx = window.APEXSIM.UI.getContext();
            if (!ctx) return;

            const canvas = ctx.canvas;

            // Clear
            window.APEXSIM.UI.clear();

            // Grid
            drawGrid(ctx, canvas.width, canvas.height);

            // Units
            drawUnits(ctx);
        }
    };

})();

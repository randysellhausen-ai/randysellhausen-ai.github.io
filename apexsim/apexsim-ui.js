// =========================================================
// APEXSIM — UI
// =========================================================
// UI hooks for rendering, debugging, and user interaction.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.UI = (function () {

    let canvas = null;
    let ctx = null;

    return {

        // Attach a canvas for rendering
        attachCanvas(canvasElement) {
            canvas = canvasElement;
            ctx = canvas.getContext("2d");
        },

        // Clear the canvas
        clear() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        // Draw a simple debug dot
        drawDot(x, y, color = "red") {
            if (!ctx) return;
            ctx.fillStyle = color;
            ctx.fillRect(x - 2, y - 2, 4, 4);
        },

        // Expose context for renderer
        getContext() {
            return ctx;
        }
    };

})();

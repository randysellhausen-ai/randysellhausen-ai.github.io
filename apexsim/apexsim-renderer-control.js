// =========================================================
// APEXSIM.RendererControl — Liminal Engine v8.2
// =========================================================
// Responsibilities:
// - Bind UI controls for renderer-related features
// - Toggle grid visibility
// - Toggle debug overlay (via DebugControl.enabled)
// - Connect camera zoom buttons
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.RendererControl = {

    init() {
        const Renderer = APEXSIM.Renderer;
        const DebugControl = APEXSIM.DebugControl;
        const Camera = APEXSIM.Camera;

        // -------------------------------------------------
        // GRID TOGGLE
        // -------------------------------------------------
        const gridCheckbox = document.getElementById("showGrid");
        if (gridCheckbox) {
            gridCheckbox.addEventListener("change", () => {
                Renderer.showGrid = gridCheckbox.checked;
            });
        }

        // -------------------------------------------------
        // DEBUG OVERLAY TOGGLE
        // -------------------------------------------------
        const debugCheckbox = document.getElementById("debugOverlay");
        if (debugCheckbox) {
            debugCheckbox.addEventListener("change", () => {
                DebugControl.enabled = debugCheckbox.checked;
            });
        }

        // -------------------------------------------------
        // CAMERA CONTROLS
        // -------------------------------------------------
        const zoomInBtn = document.getElementById("zoomIn");
        if (zoomInBtn) {
            zoomInBtn.addEventListener("click", () => {
                Camera.zoomIn();
            });
        }

        const zoomOutBtn = document.getElementById("zoomOut");
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener("click", () => {
                Camera.zoomOut();
            });
        }

        const resetBtn = document.getElementById("resetCamera");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                Camera.reset();
            });
        }

        console.log("APEXSIM.RendererControl — Ready.");
    }
};

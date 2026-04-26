// =========================================================
// APEXUI.Layout — Liminal Engine v8.2 (1.0 Minimal)
// =========================================================
// - Manages basic layout classes for the control panel
// - Safe stub: no hard dependencies, no auto-init
// - Can be expanded later without breaking 1.0
// =========================================================

window.APEXUI = window.APEXUI || {};

APEXUI.Layout = {

    init() {
        console.log("APEXUI.Layout — Ready.");

        const root = document.getElementById("vc-root");
        if (!root) return;

        // Ensure a base layout class exists
        root.classList.add("vc-root");

        // Optional: ensure panel has base class
        const panel = document.getElementById("apex-control-panel");
        if (panel) {
            panel.classList.add("vc-panel");
        }
    }
};

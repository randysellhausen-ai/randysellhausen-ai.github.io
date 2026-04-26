// =========================================================
// APEXUI.HUD — Liminal Engine v8.2 (1.0 Minimal)
// =========================================================
// - Safe stub for future HUD overlays
// - Prevents missing init() warnings
// - Does not draw anything yet
// - No auto-init (bootloader or UI core will call init())
// =========================================================

window.APEXUI = window.APEXUI || {};

APEXUI.HUD = {

    init() {
        console.log("APEXUI.HUD — Ready.");

        // Optional: ensure HUD container exists
        const hud = document.getElementById("vc-hud");
        if (!hud) return;

        // Add base class for future styling
        hud.classList.add("vc-hud");
    },

    // Placeholder for future HUD drawing logic
    update() {
        // Intentionally empty for 1.0
    }
};

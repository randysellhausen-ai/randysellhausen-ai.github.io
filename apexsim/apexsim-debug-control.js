// =========================================================
// APEXSIM.DebugControl — Liminal Engine v8.2
// =========================================================
// Responsibilities:
// - Maintain debug overlay state
// - Bind debug checkbox to DebugControl.enabled
// - No renderer calls (Renderer no longer manages debug state)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugControl = {

    enabled: false,

    init() {
        const checkbox = document.getElementById("debugOverlay");

        if (checkbox) {
            checkbox.addEventListener("change", () => {
                this.enabled = checkbox.checked;
            });
        }

        console.log("APEXSIM.DebugControl — Ready.");
    }
};

// =========================================================
// APEXSIM — UI RENDER HELPERS
// =========================================================
// This file provides visual overlays for debugging and
// tactical information. Stance overlay included.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.renderStanceOverlay = function (ctx, units) {
    if (!units || units.length === 0) return;

    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    units.forEach(unit => {
        const stance = window.APEXSIM.StanceSystem.getStance(unit.id);

        // Color coding for clarity
        let color = "white";
        if (stance === "aggressive") color = "red";
        if (stance === "defensive") color = "cyan";

        ctx.fillStyle = color;
        ctx.fillText(stance.toUpperCase(), unit.x, unit.y - 12);
    });
};

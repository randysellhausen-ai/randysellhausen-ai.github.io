// =========================================================
// APEXSIM — STANCE SYSTEM v1
// =========================================================
// Simple, deterministic stance manager for units.
// Provides: set/get stance, stance modifiers, auto-updates.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.StanceSystem = (function () {

    const STANCES = {
        neutral: {
            id: "neutral",
            accuracy: 1.0,
            defense: 1.0,
            speed: 1.0
        },
        aggressive: {
            id: "aggressive",
            accuracy: 1.1,
            defense: 0.9,
            speed: 1.1
        },
        defensive: {
            id: "defensive",
            accuracy: 0.9,
            defense: 1.2,
            speed: 0.9
        }
    };

    const unitStances = Object.create(null);

    return {

        // Set stance for a unit
        setStance(unitId, stance) {
            if (!STANCES[stance]) {
                console.warn("[STANCE] Invalid stance:", stance);
                return;
            }
            unitStances[unitId] = stance;
        },

        // Get stance for a unit
        getStance(unitId) {
            return unitStances[unitId] || "neutral";
        },

        // Get stance modifiers
        getModifiers(unitId) {
            const stance = this.getStance(unitId);
            return STANCES[stance];
        },

        // Auto-update stance based on morale/suppression
        updateFromMorale(unitId, morale, suppression) {
            if (suppression > 0.7) {
                this.setStance(unitId, "defensive");
            } else if (morale > 0.8) {
                this.setStance(unitId, "aggressive");
            }
        },

        // Clear stance for a unit
        clear(unitId) {
            delete unitStances[unitId];
        },

        // Reset all stances
        resetAll() {
            for (const id in unitStances) delete unitStances[id];
        }
    };

})();

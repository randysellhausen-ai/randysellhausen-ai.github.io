// =========================================================
// APEXSIM — DATA
// =========================================================
// Data helpers: IDs, RNG, tables, math utilities.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Data = (function () {

    let _idCounter = 1;

    return {

        // Generate unique IDs for units, effects, etc.
        nextId() {
            return _idCounter++;
        },

        // Random integer between min and max
        randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Random float
        randFloat(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Clamp a value
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
    };

})();

// =========================================================
// APEXSIM — PHYSICS
// =========================================================
// Basic physics helpers: movement, velocity, distance, collision.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Physics = (function () {

    return {

        // Move a unit by velocity
        applyVelocity(unit) {
            if (!unit.vx) unit.vx = 0;
            if (!unit.vy) unit.vy = 0;

            unit.x += unit.vx;
            unit.y += unit.vy;
        },

        // Distance between two points
        distance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        },

        // Simple AABB collision check
        collides(a, b, size = 20) {
            return (
                Math.abs(a.x - b.x) < size &&
                Math.abs(a.y - b.y) < size
            );
        }
    };

})();

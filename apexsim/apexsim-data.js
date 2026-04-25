// =========================================================
// APEXSIM.Data — Liminal Engine v8.2
// Clean, deterministic unit factory + shared data schema
// =========================================================
// - All units created through createUnit(x, y)
// - Guaranteed fields: id, x, y, vx, vy, maxSpeed, maxAccel
// - Pathfinding fields: path, pathIndex, aiTarget
// - Fully compatible with APEXSIM.Engine v8.2
// - Fully compatible with renderer + debug overlay
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Data = {

    _nextId: 1,

    // =====================================================
    // UNIT FACTORY
    // =====================================================
    createUnit(x, y) {
        const id = this._nextId++;

        return {
            id,

            // Position
            x: typeof x === "number" ? x : 10,
            y: typeof y === "number" ? y : 10,

            // Velocity
            vx: 0,
            vy: 0,

            // Movement stats
            maxSpeed: 10,     // world units per second
            maxAccel: 30,     // not used yet, reserved for physics v2

            // AI + Pathfinding
            aiTarget: null,   // { x, y }
            path: null,       // array of nodes
            pathIndex: 0,     // current node index

            // Metadata (reserved for future APEX modules)
            faction: "neutral",
            type: "generic",
            state: "idle"
        };
    },

    // =====================================================
    // OPTIONAL: UNIT ARCHETYPES (future expansion)
    // =====================================================
    createArchetype(name) {
        // Reserved for future APEX modules (APEXAI, APEXBEHAVIOR, etc.)
        return {
            name,
            maxSpeed: 10,
            maxAccel: 30
        };
    }
};

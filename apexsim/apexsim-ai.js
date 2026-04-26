// =========================================================
// APEXSIM.AI — State Machine (Threats Disabled)
// v1.2 — Stable, No Threat Processing, All States Preserved
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.AI = {

    init() {
        console.log("APEXSIM.AI — State Machine Ready.");
    },

    // -----------------------------------------------------
    // Main update loop
    // -----------------------------------------------------
    update(unit, dt) {
        if (!unit) return;

        // Threats disabled — skip threat processing entirely
        // this._updateThreats(unit);  <-- REMOVED

        this._updateState(unit, dt);
        this._applyMovement(unit, dt);
    },

    // -----------------------------------------------------
    // State Machine
    // -----------------------------------------------------
    _updateState(unit, dt) {

        switch (unit.state) {

            case "Idle":
                this._stateIdle(unit, dt);
                break;

            case "Wander":
                this._stateWander(unit, dt);
                break;

            case "Roam":
                this._stateRoam(unit, dt);
                break;

            case "Chase":
                this._stateChase(unit, dt);
                break;

            case "Flee":
                this._stateFlee(unit, dt);
                break;

            default:
                unit.state = "Idle";
                break;
        }
    },

    // -----------------------------------------------------
    // State Behaviors (Simplified)
    // -----------------------------------------------------
    _stateIdle(unit, dt) {
        unit.behaviorName = "Idle";
        unit.vx *= 0.9;
        unit.vy *= 0.9;
    },

    _stateWander(unit, dt) {
        unit.behaviorName = "Wander";
        this._randomDrift(unit, 0.2);
    },

    _stateRoam(unit, dt) {
        unit.behaviorName = "Roam";
        this._randomDrift(unit, 0.4);
    },

    _stateChase(unit, dt) {
        unit.behaviorName = "Chase";
        // No threats — no target — idle fallback
        unit.state = "Idle";
    },

    _stateFlee(unit, dt) {
        unit.behaviorName = "Flee";
        // No threats — no danger — idle fallback
        unit.state = "Idle";
    },

    // -----------------------------------------------------
    // Movement Helpers
    // -----------------------------------------------------
    _randomDrift(unit, force) {
        unit.vx += (Math.random() - 0.5) * force;
        unit.vy += (Math.random() - 0.5) * force;
    },

    _applyMovement(unit, dt) {
        unit.x += unit.vx * dt;
        unit.y += unit.vy * dt;
    }
};

APEXSIM.AI.init();

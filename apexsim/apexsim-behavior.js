// =========================================================
// APEXSIM.Behavior — Integration Layer (v1)
// Connects FSM → Behavior Trees → Movement
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Behavior = {

    init() {
        console.log("APEXSIM.Behavior — Ready.");
    },

    update(u, dt) {
        // Reset desire vector each tick
        u.desireVector = { x: 0, y: 0 };

        // Behavior selection based on FSM state
        switch (u.state) {

            case "Idle":
                this._runIdleBT(u, dt);
                break;

            case "Wander":
                this._runWanderBT(u, dt);
                break;

            case "Roam":
                this._runRoamBT(u, dt);
                break;

            case "Chase":
                this._runChaseBT(u, dt);
                break;

            case "Flee":
                this._runFleeBT(u, dt);
                break;
        }
    },

    // -----------------------------------------------------
    // Idle Behavior Tree
    // -----------------------------------------------------
    _runIdleBT(u, dt) {
        const B = APEXSIM.Behaviors;

        new APEXSIM.BT.Selector([
            B.InvestigateSound,
            B.InvestigateLastSeen,
            B.SocialDrift,
            B.Curiosity
        ]).tick(u, dt);
    },

    // -----------------------------------------------------
    // Wander Behavior Tree
    // -----------------------------------------------------
    _runWanderBT(u, dt) {
        const B = APEXSIM.Behaviors;

        new APEXSIM.BT.Selector([
            B.InvestigateSound,
            B.SocialDrift,
            B.Curiosity
        ]).tick(u, dt);
    },

    // -----------------------------------------------------
    // Roam Behavior Tree
    // -----------------------------------------------------
    _runRoamBT(u, dt) {
        const B = APEXSIM.Behaviors;

        new APEXSIM.BT.Selector([
            B.InvestigateSound,
            B.InvestigateLastSeen,
            B.Curiosity
        ]).tick(u, dt);
    },

    // -----------------------------------------------------
    // Chase Behavior Tree
    // -----------------------------------------------------
    _runChaseBT(u, dt) {
        u.behaviorName = "ChaseTarget";

        if (u.lastSeenTarget) {
            const t = u.lastSeenTarget;
            u.desireVector.x += (t.x - u.x) * 0.1;
            u.desireVector.y += (t.y - u.y) * 0.1;
        }
    },

    // -----------------------------------------------------
    // Flee Behavior Tree
    // -----------------------------------------------------
    _runFleeBT(u, dt) {
        u.behaviorName = "FleeThreat";

        const threat = u.threatMemory[0];
        if (!threat) return;

        u.desireVector.x += (u.x - threat.x) * 0.15;
        u.desireVector.y += (u.y - threat.y) * 0.15;
    }
};

APEXSIM.Behavior.init();

// =========================================================
// APEXSIM.AI — Simple State Machine for Units
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.AI = {

    init() {
        console.log("APEXSIM.AI — State Machine Ready.");
    },

    // Called once per frame by Engine
    update(units, dt) {
        for (let u of units) {
            if (!u.state) this._initUnit(u);
            this._updateUnit(u, dt);
        }
    },

    // -----------------------------------------------------
    // INITIALIZE UNIT AI
    // -----------------------------------------------------
    _initUnit(u) {
        u.state = "Idle";
        u.stateTimer = 0;
        u.target = null;
    },

    // -----------------------------------------------------
    // PER-UNIT AI UPDATE
    // -----------------------------------------------------
    _updateUnit(u, dt) {
        u.stateTimer += dt;

        switch (u.state) {

            case "Idle":
                this._stateIdle(u, dt);
                break;

            case "Wander":
                this._stateWander(u, dt);
                break;

            case "Roam":
                this._stateRoam(u, dt);
                break;

            case "Chase":
                this._stateChase(u, dt);
                break;

            case "Flee":
                this._stateFlee(u, dt);
                break;
        }
    },

    // -----------------------------------------------------
    // STATE: IDLE
    // -----------------------------------------------------
    _stateIdle(u, dt) {
        // Slow down
        u.vx *= 0.9;
        u.vy *= 0.9;

        // After 1–3 seconds, start wandering
        if (u.stateTimer > 1 + Math.random() * 2) {
            this._changeState(u, "Wander");
        }
    },

    // -----------------------------------------------------
    // STATE: WANDER
    // -----------------------------------------------------
    _stateWander(u, dt) {
        // Random drift
        u.vx += (Math.random() - 0.5) * 0.05;
        u.vy += (Math.random() - 0.5) * 0.05;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        if (speed > 1.2) {
            u.vx *= 0.95;
            u.vy *= 0.95;
        }

        // After 2–5 seconds, roam
        if (u.stateTimer > 2 + Math.random() * 3) {
            this._changeState(u, "Roam");
        }
    },

    // -----------------------------------------------------
    // STATE: ROAM
    // -----------------------------------------------------
    _stateRoam(u, dt) {
        // Stronger directional drift
        u.vx += (Math.random() - 0.5) * 0.1;
        u.vy += (Math.random() - 0.5) * 0.1;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        if (speed > 2.0) {
            u.vx *= 0.9;
            u.vy *= 0.9;
        }

        // Occasionally return to idle
        if (u.stateTimer > 3 + Math.random() * 4) {
            this._changeState(u, "Idle");
        }
    },

    // -----------------------------------------------------
    // STATE: CHASE (placeholder)
    // -----------------------------------------------------
    _stateChase(u, dt) {
        if (!u.target) {
            this._changeState(u, "Idle");
            return;
        }

        const dx = u.target.x - u.x;
        const dy = u.target.y - u.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 5) {
            this._changeState(u, "Idle");
            return;
        }

        u.vx += dx / dist * 0.2;
        u.vy += dy / dist * 0.2;
    },

    // -----------------------------------------------------
    // STATE: FLEE (placeholder)
    // -----------------------------------------------------
    _stateFlee(u, dt) {
        if (!u.target) {
            this._changeState(u, "Idle");
            return;
        }

        const dx = u.x - u.target.x;
        const dy = u.y - u.target.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        u.vx += dx / dist * 0.3;
        u.vy += dy / dist * 0.3;

        if (dist > 200) {
            this._changeState(u, "Idle");
        }
    },

    // -----------------------------------------------------
    // STATE TRANSITION
    // -----------------------------------------------------
    _changeState(u, newState) {
        u.state = newState;
        u.stateTimer = 0;
    }
};

APEXSIM.AI.init();

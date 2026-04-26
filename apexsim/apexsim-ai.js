// =========================================================
// APEXSIM.AI — Perception, Hearing, Threats, Movement, States
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.AI = {

    // -----------------------------------------------------
    // CONFIG
    // -----------------------------------------------------
    VISION_RADIUS: 160,
    HEARING_RADIUS: 220,
    VISION_FOV: 120 * Math.PI / 180,   // 120° FOV

    _soundEvents: [],

    init() {
        console.log("APEXSIM.AI — State Machine Ready.");
    },

    // -----------------------------------------------------
    // SOUND EMISSION
    // -----------------------------------------------------
    emitSound(x, y, radius, type = "generic") {
        this._soundEvents.push({
            x, y,
            radius,
            type,
            time: APEXSIM.Engine.time
        });
    },

    emitSoundAtUnit(unit, radius, type = "generic") {
        this.emitSound(unit.x, unit.y, radius, type);
    },

    emitFootstep(unit) {
        this.emitSoundAtUnit(unit, 120, "footstep");
    },

    emitImpact(x, y) {
        this.emitSound(x, y, 180, "impact");
    },

    emitThreatPing(x, y) {
        this.emitSound(x, y, 220, "threat");
    },

    // -----------------------------------------------------
    // MAIN UPDATE (called once per frame)
    // -----------------------------------------------------
    update(units, dt) {

        // Perception pass
        for (let u of units) {
            if (!u.state) this._initUnit(u);
            this._updatePerception(u, units);
            this._updateHearing(u);
            this._updateThreats(u);
        }

        // Behavior pass
        for (let u of units) {
            this._updateUnit(u, dt);
        }

        // Clear sound events
        this._soundEvents.length = 0;
    },

    // -----------------------------------------------------
    // INITIALIZE UNIT AI
    // -----------------------------------------------------
    _initUnit(u) {
        u.state = "Idle";
        u.stateTimer = 0;
        u.target = null;

        u.visionRadius = this.VISION_RADIUS;
        u.visionFOV = this.VISION_FOV;
        u.hearingRadius = this.HEARING_RADIUS;

        u.visibleUnits = [];
        u.heardEvents = [];
        u.threatMemory = [];
        u.lastSeenTarget = null;
        u.hasThreat = false;
    },

    // -----------------------------------------------------
    // PERCEPTION: VISION
    // -----------------------------------------------------
    _canSee(observer, target) {
        const dx = target.x - observer.x;
        const dy = target.y - observer.y;
        const distSq = dx*dx + dy*dy;

        if (distSq > observer.visionRadius * observer.visionRadius)
            return false;

        // Facing direction from velocity
        const facing = Math.atan2(observer.vy, observer.vx || 0.0001);

        const angleToTarget = Math.atan2(dy, dx);
        let delta = angleToTarget - facing;

        // Normalize to [-PI, PI]
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;

        return Math.abs(delta) <= observer.visionFOV * 0.5;
    },

    _updatePerception(u, units) {
        u.visibleUnits = [];

        for (let other of units) {
            if (other === u) continue;
            if (this._canSee(u, other)) {
                u.visibleUnits.push(other);
            }
        }
    },

    // -----------------------------------------------------
    // PERCEPTION: HEARING
    // -----------------------------------------------------
    _updateHearing(u) {
        u.heardEvents = [];

        for (const ev of this._soundEvents) {
            const dx = ev.x - u.x;
            const dy = ev.y - u.y;
            const distSq = dx*dx + dy*dy;

            const r = Math.min(ev.radius, u.hearingRadius);

            if (distSq <= r * r) {
                u.heardEvents.push(ev);
            }
        }
    },

    // -----------------------------------------------------
    // THREAT DETECTION + MEMORY
    // -----------------------------------------------------
    _updateThreats(u) {
        const now = APEXSIM.Engine.time;

        // Decay old threats
        u.threatMemory = u.threatMemory.filter(t => now - t.time < 3.0);

        // Vision-based threats
        for (const other of u.visibleUnits) {
            if (other.isEnemy) {
                u.threatMemory.push({
                    type: "enemy",
                    target: other,
                    x: other.x,
                    y: other.y,
                    time: now
                });
                u.lastSeenTarget = { x: other.x, y: other.y, time: now };
            }
        }

        // Sound-based threats
        for (const ev of u.heardEvents) {
            if (ev.type === "threat") {
                u.threatMemory.push({
                    type: "sound",
                    x: ev.x,
                    y: ev.y,
                    time: now
                });
                u.lastSeenTarget = { x: ev.x, y: ev.y, time: now };
            }
        }

        u.hasThreat = u.threatMemory.length > 0;
    },

    // -----------------------------------------------------
    // PER-UNIT AI UPDATE
    // -----------------------------------------------------
    _updateUnit(u, dt) {
        u.stateTimer += dt;

        // Threat-driven transitions
        if (u.hasThreat && u.state !== "Chase" && u.state !== "Flee") {
            this._changeState(u, "Chase");
        }

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
        // Smooth deceleration
        u.vx *= 0.85;
        u.vy *= 0.85;

        // Occasional footstep sound (very rare)
        if (Math.random() < 0.01) {
            this.emitFootstep(u);
        }

        // After 1–3 seconds, start wandering
        if (u.stateTimer > 1 + Math.random() * 2) {
            this._changeState(u, "Wander");
        }
    },

    // -----------------------------------------------------
    // STATE: WANDER (upgraded movement)
// -----------------------------------------------------
    _stateWander(u, dt) {
        // Stronger random drift
        u.vx += (Math.random() - 0.5) * 0.20;
        u.vy += (Math.random() - 0.5) * 0.20;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 2.5;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        // Occasional footstep
        if (Math.random() < 0.05) {
            this.emitFootstep(u);
        }

        // After 2–5 seconds, roam
        if (u.stateTimer > 2 + Math.random() * 3) {
            this._changeState(u, "Roam");
        }
    },

    // -----------------------------------------------------
    // STATE: ROAM (upgraded movement)
    // -----------------------------------------------------
    _stateRoam(u, dt) {
        // Stronger directional drift
        u.vx += (Math.random() - 0.5) * 0.40;
        u.vy += (Math.random() - 0.5) * 0.40;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 4.0;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        // Occasional footstep
        if (Math.random() < 0.08) {
            this.emitFootstep(u);
        }

        // Occasionally return to idle
        if (u.stateTimer > 3 + Math.random() * 4) {
            this._changeState(u, "Idle");
        }
    },

    // -----------------------------------------------------
    // STATE: CHASE (upgraded movement)
    // -----------------------------------------------------
    _stateChase(u, dt) {
        let target = null;

        // Prefer visible enemies
        for (const other of u.visibleUnits) {
            if (other.isEnemy) {
                target = other;
                break;
            }
        }

        // Fall back to last seen target
        if (!target && u.lastSeenTarget) {
            target = u.lastSeenTarget;
        }

        if (!target) {
            this._changeState(u, "Idle");
            return;
        }

        const tx = target.x ?? target.x;
        const ty = target.y ?? target.y;

        const dx = tx - u.x;
        const dy = ty - u.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 5) {
            this._changeState(u, "Idle");
            return;
        }

        // Stronger pursuit force
        const force = 0.6;
        u.vx += (dx / dist) * force;
        u.vy += (dy / dist) * force;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 5.0;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        // Occasional threat ping at target
        if (Math.random() < 0.05) {
            this.emitThreatPing(tx, ty);
        }
    },

    // -----------------------------------------------------
    // STATE: FLEE (upgraded movement)
    // -----------------------------------------------------
    _stateFlee(u, dt) {
        let threat = u.threatMemory[0];
        if (!threat) {
            this._changeState(u, "Idle");
            return;
        }

        const dx = u.x - threat.x;
        const dy = u.y - threat.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

        // Stronger escape force
        const force = 0.8;
        u.vx += (dx / dist) * force;
        u.vy += (dy / dist) * force;

        // Cap speed
        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 6.0;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

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

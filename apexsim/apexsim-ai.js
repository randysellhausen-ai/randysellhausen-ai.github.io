// =========================================================
// APEXSIM.AI — Perception, Hearing, Threats, Movement, States
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.AI = {

    VISION_RADIUS: 160,
    HEARING_RADIUS: 220,
    VISION_FOV: 120 * Math.PI / 180,

    _soundEvents: [],

    init() {
        console.log("APEXSIM.AI — State Machine Ready.");
    },

    emitSound(x, y, radius, type = "generic") {
        this._soundEvents.push({
            x, y,
            radius,
            type,
            time: APEXSIM.Engine.time || 0
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

    update(units, dt) {
        for (let u of units) {
            if (!u.state) this._initUnit(u);
            this._updatePerception(u, units);
            this._updateHearing(u);
            this._updateThreats(u);
        }

        for (let u of units) {
            this._updateUnit(u, dt);
        }

        this._soundEvents.length = 0;
    },

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

    _canSee(observer, target) {
        const dx = target.x - observer.x;
        const dy = target.y - observer.y;
        const distSq = dx*dx + dy*dy;

        if (distSq > observer.visionRadius * observer.visionRadius)
            return false;

        const facing = Math.atan2(observer.vy, observer.vx || 0.0001);

        const angleToTarget = Math.atan2(dy, dx);
        let delta = angleToTarget - facing;

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

    _updateThreats(u) {
        const now = APEXSIM.Engine.time || 0;

        u.threatMemory = u.threatMemory.filter(t => now - t.time < 3.0);

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

    _updateUnit(u, dt) {
        u.stateTimer += dt;

        if (u.hasThreat && u.state !== "Chase" && u.state !== "Flee") {
            this._changeState(u, "Chase");
        }

        switch (u.state) {
            case "Idle":   this._stateIdle(u, dt);   break;
            case "Wander": this._stateWander(u, dt); break;
            case "Roam":   this._stateRoam(u, dt);   break;
            case "Chase":  this._stateChase(u, dt);  break;
            case "Flee":   this._stateFlee(u, dt);   break;
        }
    },

    _stateIdle(u, dt) {
        u.vx *= 0.85;
        u.vy *= 0.85;

        if (Math.random() < 0.01) {
            this.emitFootstep(u);
        }

        if (u.stateTimer > 1 + Math.random() * 2) {
            this._changeState(u, "Wander");
        }
    },

    _stateWander(u, dt) {
        u.vx += (Math.random() - 0.5) * 0.20;
        u.vy += (Math.random() - 0.5) * 0.20;

        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 2.5;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        if (Math.random() < 0.05) {
            this.emitFootstep(u);
        }

        if (u.stateTimer > 2 + Math.random() * 3) {
            this._changeState(u, "Roam");
        }
    },

    _stateRoam(u, dt) {
        u.vx += (Math.random() - 0.5) * 0.40;
        u.vy += (Math.random() - 0.5) * 0.40;

        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 4.0;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        if (Math.random() < 0.08) {
            this.emitFootstep(u);
        }

        if (u.stateTimer > 3 + Math.random() * 4) {
            this._changeState(u, "Idle");
        }
    },

    _stateChase(u, dt) {
        let target = null;

        for (const other of u.visibleUnits) {
            if (other.isEnemy) {
                target = other;
                break;
            }
        }

        if (!target && u.lastSeenTarget) {
            target = u.lastSeenTarget;
        }

        if (!target) {
            this._changeState(u, "Idle");
            return;
        }

        const tx = target.x;
        const ty = target.y;

        const dx = tx - u.x;
        const dy = ty - u.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

        if (dist < 5) {
            this._changeState(u, "Idle");
            return;
        }

        const force = 0.6;
        u.vx += (dx / dist) * force;
        u.vy += (dy / dist) * force;

        const speed = Math.sqrt(u.vx*u.vx + u.vy*u.vy);
        const maxSpeed = 5.0;
        if (speed > maxSpeed) {
            u.vx = (u.vx / speed) * maxSpeed;
            u.vy = (u.vy / speed) * maxSpeed;
        }

        if (Math.random() < 0.05) {
            this.emitThreatPing(tx, ty);
        }
    },

    _stateFlee(u, dt) {
        let threat = u.threatMemory[0];
        if (!threat) {
            this._changeState(u, "Idle");
            return;
        }

        const dx = u.x - threat.x;
        const dy = u.y - threat.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

        const force = 0.8;
        u.vx += (dx / dist) * force;
        u.vy += (dy / dist) * force;

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

    _changeState(u, newState) {
        u.state = newState;
        u.stateTimer = 0;
    }
};

APEXSIM.AI.init();

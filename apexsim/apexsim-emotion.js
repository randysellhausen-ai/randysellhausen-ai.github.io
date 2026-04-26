// =========================================================
// APEXSIM.Emotion — v1.6 (Micro‑Motivations & Emotional Drift)
// Mode: Subtle influence
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Emotion = {

    init() {
        console.log("APEXSIM.Emotion — Ready (Subtle Mode).");
    },

    // Attach emotional state to a unit
    attach(unit) {
        if (!unit) return;

        unit.emotion = {
            curiosity: 0.5,
            tension: 0.2,
            sociability: 0.5,
            confidence: 0.5,
            fatigue: 0.2
        };

        unit._emotionMeta = {
            aloneTimer: 0,
            moveTimer: 0
        };
    },

    // Per-frame emotional drift and event responses
    update(unit, dt) {
        if (!unit || !unit.emotion) return;

        const e = unit.emotion;
        const meta = unit._emotionMeta;
        const clamp01 = (v) => Math.max(0, Math.min(1, v));

        // Baseline drift toward mid values (subtle)
        const driftRate = 0.02 * dt;
        e.curiosity += (0.5 - e.curiosity) * driftRate;
        e.tension += (0.2 - e.tension) * driftRate;
        e.sociability += (0.5 - e.sociability) * driftRate;
        e.confidence += (0.5 - e.confidence) * driftRate;
        e.fatigue += (0.3 - e.fatigue) * driftRate;

        // Movement-based adjustments
        const speed2 = (unit.vx || 0) * (unit.vx || 0) + (unit.vy || 0) * (unit.vy || 0);
        const moving = speed2 > 0.01;

        if (moving) {
            meta.moveTimer += dt;
            e.confidence += 0.03 * dt;
            e.fatigue += 0.01 * dt;
        } else {
            meta.moveTimer = 0;
            e.confidence -= 0.02 * dt;
        }

        // Alone vs near others
        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];
        let nearOthers = false;
        for (let other of units) {
            if (other === unit) continue;
            const dx = other.x - unit.x;
            const dy = other.y - unit.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 120 * 120) {
                nearOthers = true;
                break;
            }
        }

        if (nearOthers) {
            meta.aloneTimer = 0;
            e.sociability += 0.02 * dt;
            e.tension -= 0.01 * dt;
        } else {
            meta.aloneTimer += dt;
            if (meta.aloneTimer > 3) {
                e.sociability -= 0.01 * dt;
                e.curiosity += 0.01 * dt;
            }
        }

        // Simple tension events based on state
        if (unit.state === "InvestigateSound") {
            e.tension += 0.03 * dt;
        } else if (unit.state === "Idle") {
            e.tension -= 0.02 * dt;
        }

        // Clamp
        e.curiosity = clamp01(e.curiosity);
        e.tension = clamp01(e.tension);
        e.sociability = clamp01(e.sociability);
        e.confidence = clamp01(e.confidence);
        e.fatigue = clamp01(e.fatigue);
    }
};

APEXSIM.Emotion.init();

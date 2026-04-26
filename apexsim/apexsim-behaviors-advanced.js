// =========================================================
// APEXSIM.BehaviorsAdvanced — v1.6 (Option A + Emotion)
// Wanderers with Personality + Subtle Emotional Influence
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.BehaviorsAdvanced = {};

(function () {
    const BT = APEXSIM.BT;

    function pickRandom(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getEmotion(unit) {
        return unit && unit.emotion ? unit.emotion : null;
    }

    // -----------------------------------------------------
    // Curiosity: occasionally move toward a random point
    // Emotion:
    //  - Higher curiosity → shorter cooldown, more likely
    // -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.Curiosity = function CuriosityBehavior() {
        return new BT.Sequence([
            new BT.Condition((u) => {
                if (!u._curiosity) u._curiosity = { cooldown: 0, target: null };
                const e = getEmotion(u);
                u._curiosity.cooldown -= 1;

                let threshold = 0;
                if (e) {
                    // Higher curiosity → more frequent triggers
                    threshold = -60 - Math.floor(e.curiosity * 240); // between -60 and -300
                } else {
                    threshold = -180;
                }

                return u._curiosity.cooldown <= threshold;
            }),
            new BT.Action((u, dt) => {
                const e = getEmotion(u);
                const radius = 80;
                const angle = Math.random() * Math.PI * 2;
                const dist = 20 + Math.random() * radius;

                const tx = u.x + Math.cos(angle) * dist;
                const ty = u.y + Math.sin(angle) * dist;

                u._curiosity.target = { x: tx, y: ty };

                let baseCooldown = 300;
                if (e) {
                    // Higher curiosity → shorter cooldown
                    baseCooldown = 260 - Math.floor(e.curiosity * 160); // ~260 to ~100
                }
                u._curiosity.cooldown = baseCooldown + Math.floor(Math.random() * baseCooldown);

                u.state = "Curious";
                u.targetX = tx;
                u.targetY = ty;
                return BT.SUCCESS;
            })
        ]);
    };

    // -----------------------------------------------------
    // SocialDrift: drift gently toward nearby units
    // Emotion:
    //  - Higher sociability → stronger drift
    // -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.SocialDrift = function SocialDriftBehavior() {
        return new BT.Action((u, dt) => {
            if (!APEXSIM.Engine || !APEXSIM.Engine.units) return BT.FAILURE;

            const units = APEXSIM.Engine.units;
            let closest = null;
            let closestDist2 = 999999;

            for (let other of units) {
                if (other === u) continue;
                const dx = other.x - u.x;
                const dy = other.y - u.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < closestDist2) {
                    closestDist2 = d2;
                    closest = other;
                }
            }

            if (!closest) return BT.FAILURE;

            const maxDist2 = 200 * 200;
            if (closestDist2 > maxDist2) return BT.FAILURE;

            const dx = closest.x - u.x;
            const dy = closest.y - u.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;

            const e = getEmotion(u);
            let strength = 0.2;
            if (e) {
                // Sociability subtly scales drift
                strength = 0.1 + e.sociability * 0.25; // 0.1–0.35
            }

            u.vx += (dx / len) * strength * dt;
            u.vy += (dy / len) * strength * dt;

            return BT.SUCCESS;
        });
    };

    // -----------------------------------------------------
    // InvestigateSound: move toward a global "sound" point
    // Emotion:
    //  - Higher tension → more likely to react
    // -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.InvestigateSound = function InvestigateSoundBehavior() {
        return new BT.Sequence([
            new BT.Condition((u) => {
                const world = APEXSIM.World;
                if (!world || !world.lastSound) return false;
                if (!u._investigateSound) u._investigateSound = { active: false };

                const e = getEmotion(u);
                let chance = 0.3;
                if (e) {
                    // Tension biases reaction
                    chance = 0.15 + e.tension * 0.5; // 0.15–0.65
                }

                if (Math.random() < chance) {
                    u._investigateSound.active = true;
                    u._investigateSound.x = world.lastSound.x;
                    u._investigateSound.y = world.lastSound.y;
                    return true;
                }
                return false;
            }),
            new BT.Action((u, dt) => {
                const data = u._investigateSound;
                if (!data || !data.active) return BT.FAILURE;

                u.state = "InvestigateSound";
                u.targetX = data.x;
                u.targetY = data.y;
                return BT.SUCCESS;
            })
        ]);
    };

    // -----------------------------------------------------
    // InvestigatePoint: generic "move toward targetX/targetY"
    // Emotion:
    //  - Confidence slightly increases speed
    //  - Fatigue slightly decreases speed
    // -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.InvestigatePoint = function InvestigatePointBehavior() {
        return new BT.Action((u, dt) => {
            if (typeof u.targetX !== "number" || typeof u.targetY !== "number") {
                return BT.FAILURE;
            }

            const dx = u.targetX - u.x;
            const dy = u.targetY - u.y;
            const dist2 = dx * dx + dy * dy;

            if (dist2 < 4 * 4) {
                u.targetX = null;
                u.targetY = null;
                return BT.SUCCESS;
            }

            const dist = Math.sqrt(dist2) || 1;
            let speed = 1.2;

            const e = getEmotion(u);
            if (e) {
                const confBias = (e.confidence - 0.5) * 0.4; // -0.2–0.2
                const fatBias = (e.fatigue - 0.3) * -0.3;    // ~-0.21–0.09
                speed += confBias + fatBias;
                if (speed < 0.4) speed = 0.4;
            }

            u.vx = (dx / dist) * speed;
            u.vy = (dy / dist) * speed;

            return BT.RUNNING;
        });
    };

})();

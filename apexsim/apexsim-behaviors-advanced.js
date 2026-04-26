// =========================================================
// APEXSIM.BehaviorsAdvanced — v1.5 (Option A)
// Wanderers with Personality: Curiosity, Social Drift,
// InvestigateSound, InvestigatePoint
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.BehaviorsAdvanced = {};

(function () {
    const BT = APEXSIM.BT;

    // -----------------------------------------------------
    // Utility: pick random element
    // -----------------------------------------------------
    function pickRandom(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // -----------------------------------------------------
    // Curiosity: occasionally move toward a random point
    // -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.Curiosity = function CuriosityBehavior() {
        return new BT.Sequence([
            new BT.Condition((u) => {
                if (!u._curiosity) u._curiosity = { cooldown: 0, target: null };
                u._curiosity.cooldown -= 1;
                return u._curiosity.cooldown <= 0;
            }),
            new BT.Action((u, dt) => {
                const radius = 80;
                const angle = Math.random() * Math.PI * 2;
                const dist = 20 + Math.random() * radius;

                const tx = u.x + Math.cos(angle) * dist;
                const ty = u.y + Math.sin(angle) * dist;

                u._curiosity.target = { x: tx, y: ty };
                u._curiosity.cooldown = 300 + Math.floor(Math.random() * 300); // frames

                u.state = "Curious";
                u.targetX = tx;
                u.targetY = ty;
                return BT.SUCCESS;
            })
        ]);
    };

    // -----------------------------------------------------
    // SocialDrift: drift gently toward nearby units
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

            const strength = 0.2;
            u.vx += (dx / len) * strength * dt;
            u.vy += (dy / len) * strength * dt;

            return BT.SUCCESS;
        });
    };

    // -----------------------------------------------------
    // InvestigateSound: move toward a global "sound" point
    // (if your systems ever set APEXSIM.World.lastSound)
// -----------------------------------------------------
    APEXSIM.BehaviorsAdvanced.InvestigateSound = function InvestigateSoundBehavior() {
        return new BT.Sequence([
            new BT.Condition((u) => {
                const world = APEXSIM.World;
                if (!world || !world.lastSound) return false;
                if (!u._investigateSound) u._investigateSound = { active: false };

                // 30% chance to react when a sound exists
                if (Math.random() < 0.3) {
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
    // used by curiosity / sound / other triggers
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
                // Arrived
                u.targetX = null;
                u.targetY = null;
                return BT.SUCCESS;
            }

            const dist = Math.sqrt(dist2) || 1;
            const speed = 1.2; // slightly more purposeful than wander

            u.vx = (dx / dist) * speed;
            u.vy = (dy / dist) * speed;

            return BT.RUNNING;
        });
    };

})();

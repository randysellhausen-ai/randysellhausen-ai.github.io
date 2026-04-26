// =========================================================
// APEXSIM.Behaviors — Behavior Library (v1)
// Uses APEXSIM.BT Core
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Behaviors = {};

// Shortcuts
const BT = APEXSIM.BT;
const SUCCESS = BT.SUCCESS;
const FAILURE = BT.FAILURE;
const RUNNING = BT.RUNNING;

// ---------------------------------------------------------
// Utility: steer toward a point
// ---------------------------------------------------------
function steerToward(u, tx, ty, strength = 1.0) {
    const dx = tx - u.x;
    const dy = ty - u.y;
    const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

    u.desireVector.x += (dx / dist) * strength;
    u.desireVector.y += (dy / dist) * strength;

    return RUNNING;
}

// ---------------------------------------------------------
// Utility: steer away from a point
// ---------------------------------------------------------
function steerAway(u, tx, ty, strength = 1.0) {
    const dx = u.x - tx;
    const dy = u.y - ty;
    const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

    u.desireVector.x += (dx / dist) * strength;
    u.desireVector.y += (dy / dist) * strength;

    return RUNNING;
}

// ---------------------------------------------------------
// Behavior: Investigate Sound
// ---------------------------------------------------------
APEXSIM.Behaviors.InvestigateSound = new BT.Selector([
    new BT.Condition(u => u.heardEvents.length > 0),

    new BT.Sequence([
        new BT.Action((u, dt) => {
            const ev = u.heardEvents[0];
            u.behaviorName = "InvestigateSound";
            return steerToward(u, ev.x, ev.y, 1.5);
        })
    ])
]);

// ---------------------------------------------------------
// Behavior: Investigate Last Seen
// ---------------------------------------------------------
APEXSIM.Behaviors.InvestigateLastSeen = new BT.Selector([
    new BT.Condition(u => !!u.lastSeenTarget),

    new BT.Sequence([
        new BT.Action((u, dt) => {
            const t = u.lastSeenTarget;
            u.behaviorName = "InvestigateLastSeen";
            return steerToward(u, t.x, t.y, 1.2);
        })
    ])
]);

// ---------------------------------------------------------
// Behavior: Social Drift
// ---------------------------------------------------------
APEXSIM.Behaviors.SocialDrift = new BT.Action((u, dt) => {
    u.behaviorName = "SocialDrift";

    let avgX = 0;
    let avgY = 0;
    let count = 0;

    for (const other of APEXSIM.Engine.units) {
        if (other === u) continue;

        const dx = other.x - u.x;
        const dy = other.y - u.y;
        const distSq = dx*dx + dy*dy;

        if (distSq < 200 * 200) {
            avgX += other.x;
            avgY += other.y;
            count++;
        }
    }

    if (count > 0) {
        avgX /= count;
        avgY /= count;
        return steerToward(u, avgX, avgY, 0.4);
    }

    return FAILURE;
});

// ---------------------------------------------------------
// Behavior: Curiosity
// ---------------------------------------------------------
APEXSIM.Behaviors.Curiosity = new BT.Action((u, dt) => {
    u.behaviorName = "Curiosity";

    const angle = Math.random() * Math.PI * 2;
    const radius = 40;

    const tx = u.x + Math.cos(angle) * radius;
    const ty = u.y + Math.sin(angle) * radius;

    return steerToward(u, tx, ty, 0.3);
});

// ---------------------------------------------------------
// Behavior Stubs (future expansion)
// ---------------------------------------------------------
APEXSIM.Behaviors.Patrol = new BT.Action((u, dt) => {
    u.behaviorName = "Patrol";
    return FAILURE;
});

APEXSIM.Behaviors.Follow = new BT.Action((u, dt) => {
    u.behaviorName = "Follow";
    return FAILURE;
});

APEXSIM.Behaviors.Guard = new BT.Action((u, dt) => {
    u.behaviorName = "Guard";
    return FAILURE;
});

console.log("APEXSIM.Behaviors — Library Ready.");

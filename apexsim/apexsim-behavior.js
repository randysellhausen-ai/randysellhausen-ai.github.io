// =========================================================
// APEXSIM.Behavior — Behavior Tree Assignment Layer (v1.6)
// Option A: Wanderers with Personality + Subtle Emotion
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Behavior = {

    init() {
        console.log("APEXSIM.Behavior — Ready.");
    },

    // Called by APEXSIM.Engine when a unit is created
    attachBehavior(unit) {
        if (!unit) return;

        const BT = APEXSIM.BT;
        const Adv = APEXSIM.BehaviorsAdvanced;
        const Emotion = APEXSIM.Emotion;

        unit.state = unit.state || "Idle";
        unit.behaviorName = "None";
        unit.targetX = null;
        unit.targetY = null;

        if (Emotion && typeof Emotion.attach === "function") {
            Emotion.attach(unit);
        }

        // Base Behavior: simple state driver
        const baseBehavior = new BT.Selector([
            new BT.Sequence([
                new BT.Condition((u) => u.state === "Idle"),
                new BT.Action((u, dt) => {
                    u.state = "Wander";
                    return BT.SUCCESS;
                })
            ]),
            new BT.Action((u, dt) => {
                if (u.state !== "Curious" &&
                    u.state !== "InvestigateSound" &&
                    u.state !== "InvestigatePoint") {
                    u.state = "Roam";
                }
                return BT.SUCCESS;
            })
        ]);

        const curiosity = Adv.Curiosity();
        const socialDrift = Adv.SocialDrift();
        const investigateSound = Adv.InvestigateSound();
        const investigatePoint = Adv.InvestigatePoint();

        unit.bt = new BT.Selector([
            investigatePoint,
            investigateSound,
            curiosity,
            socialDrift,
            baseBehavior
        ]);
    },

    // Called every frame by APEXSIM.Engine
    update(unit, dt) {
        if (!unit || !unit.bt) return;

        const BT = APEXSIM.BT;
        const Emotion = APEXSIM.Emotion;

        if (Emotion && typeof Emotion.update === "function") {
            Emotion.update(unit, dt);
        }

        const result = unit.bt.tick(unit, dt);

        switch (unit.state) {
            case "Idle":
                unit.behaviorName = "Idle";
                break;
            case "Wander":
                unit.behaviorName = "Wander";
                break;
            case "Roam":
                unit.behaviorName = "Roam";
                break;
            case "Curious":
                unit.behaviorName = "Curious";
                break;
            case "InvestigateSound":
                unit.behaviorName = "InvestigateSound";
                break;
            default:
                unit.behaviorName = "None";
                break;
        }
    }
};

APEXSIM.Behavior.init();

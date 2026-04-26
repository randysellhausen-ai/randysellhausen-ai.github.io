// =========================================================
// APEXSIM.Behavior — Behavior Tree Assignment Layer (v1.4)
// Assigns a default BT to every unit on spawn.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Behavior = {

    init() {
        console.log("APEXSIM.Behavior — Ready.");
    },

    // -----------------------------------------------------
    // Called by APEXSIM.Engine when a unit is created
    // -----------------------------------------------------
    attachBehavior(unit) {
        if (!unit) return;

        // -------------------------------------------------
        // Default Behavior Tree (v1.4)
        // -------------------------------------------------
        // Selector:
        //   - If Idle → Wander
        //   - Else → Roam
        //
        // This ensures:
        //   - BT always fires
        //   - Visualizer always has activity
        //   - Units feel alive
        // -------------------------------------------------

        const BT = APEXSIM.BT;

        unit.bt = new BT.Selector([
            new BT.Sequence([
                new BT.Condition((u) => u.state === "Idle"),
                new BT.Action((u, dt) => {
                    u.state = "Wander";
                    return BT.SUCCESS;
                })
            ]),

            new BT.Action((u, dt) => {
                u.state = "Roam";
                return BT.SUCCESS;
            })
        ]);
    },

    // -----------------------------------------------------
    // Called every frame by APEXSIM.Engine
    // -----------------------------------------------------
    update(unit, dt) {
        if (!unit || !unit.bt) return;

        const result = unit.bt.tick(unit, dt);

        // Update behaviorName for debug overlay + visualizer
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
            default:
                unit.behaviorName = "None";
                break;
        }
    }
};

APEXSIM.Behavior.init();

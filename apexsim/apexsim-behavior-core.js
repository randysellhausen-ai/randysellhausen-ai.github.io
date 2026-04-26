// =========================================================
// APEXSIM.BT — Behavior Tree Core (v1)
// Classic BT Syntax
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.BT = {};

// ---------------------------------------------------------
// Node Status
// ---------------------------------------------------------
APEXSIM.BT.SUCCESS = 1;
APEXSIM.BT.FAILURE = 2;
APEXSIM.BT.RUNNING = 3;

// ---------------------------------------------------------
// Base Node
// ---------------------------------------------------------
class BTNode {
    tick(u, dt) {
        throw new Error("BTNode.tick() must be implemented.");
    }
}

// ---------------------------------------------------------
// Condition Node
// ---------------------------------------------------------
class Condition extends BTNode {
    constructor(fn) {
        super();
        this.fn = fn;
    }

    tick(u, dt) {
        return this.fn(u, dt)
            ? APEXSIM.BT.SUCCESS
            : APEXSIM.BT.FAILURE;
    }
}

// ---------------------------------------------------------
// Action Node
// ---------------------------------------------------------
class Action extends BTNode {
    constructor(fn) {
        super();
        this.fn = fn;
    }

    tick(u, dt) {
        return this.fn(u, dt);
    }
}

// ---------------------------------------------------------
// Sequence Node
// ---------------------------------------------------------
class Sequence extends BTNode {
    constructor(children) {
        super();
        this.children = children;
        this.index = 0;
    }

    tick(u, dt) {
        while (this.index < this.children.length) {
            const status = this.children[this.index].tick(u, dt);

            if (status === APEXSIM.BT.RUNNING) {
                return APEXSIM.BT.RUNNING;
            }

            if (status === APEXSIM.BT.FAILURE) {
                this.index = 0;
                return APEXSIM.BT.FAILURE;
            }

            this.index++;
        }

        this.index = 0;
        return APEXSIM.BT.SUCCESS;
    }
}

// ---------------------------------------------------------
// Selector Node
// ---------------------------------------------------------
class Selector extends BTNode {
    constructor(children) {
        super();
        this.children = children;
        this.index = 0;
    }

    tick(u, dt) {
        while (this.index < this.children.length) {
            const status = this.children[this.index].tick(u, dt);

            if (status === APEXSIM.BT.RUNNING) {
                return APEXSIM.BT.RUNNING;
            }

            if (status === APEXSIM.BT.SUCCESS) {
                this.index = 0;
                return APEXSIM.BT.SUCCESS;
            }

            this.index++;
        }

        this.index = 0;
        return APEXSIM.BT.FAILURE;
    }
}

// ---------------------------------------------------------
// Public API
// ---------------------------------------------------------
APEXSIM.BT.Condition = Condition;
APEXSIM.BT.Action = Action;
APEXSIM.BT.Sequence = Sequence;
APEXSIM.BT.Selector = Selector;

console.log("APEXSIM.BT — Behavior Tree Core Ready.");

// =========================================================
// APEXSIM.BT — Behavior Tree Core (v1.2)
// Classic BT Syntax + Live Node Firing Instrumentation
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.BT = {};
APEXSIM.BTDebug = APEXSIM.BTDebug || {};

// ---------------------------------------------------------
// Debug Hooks (No-Op Defaults)
// ---------------------------------------------------------
APEXSIM.BTDebug.onNodeEnter = APEXSIM.BTDebug.onNodeEnter || function (node, unit) {};
APEXSIM.BTDebug.onNodeExit  = APEXSIM.BTDebug.onNodeExit  || function (node, unit, result) {};

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

    _enter(u) {
        APEXSIM.BTDebug.onNodeEnter(this, u);
    }

    _exit(u, result) {
        APEXSIM.BTDebug.onNodeExit(this, u, result);
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
        this._enter(u);

        const result = this.fn(u, dt)
            ? APEXSIM.BT.SUCCESS
            : APEXSIM.BT.FAILURE;

        this._exit(u, result);
        return result;
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
        this._enter(u);

        const result = this.fn(u, dt);

        this._exit(u, result);
        return result;
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
        this._enter(u);

        while (this.index < this.children.length) {
            const status = this.children[this.index].tick(u, dt);

            if (status === APEXSIM.BT.RUNNING) {
                this._exit(u, APEXSIM.BT.RUNNING);
                return APEXSIM.BT.RUNNING;
            }

            if (status === APEXSIM.BT.FAILURE) {
                this.index = 0;
                this._exit(u, APEXSIM.BT.FAILURE);
                return APEXSIM.BT.FAILURE;
            }

            this.index++;
        }

        this.index = 0;
        this._exit(u, APEXSIM.BT.SUCCESS);
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
        this._enter(u);

        while (this.index < this.children.length) {
            const status = this.children[this.index].tick(u, dt);

            if (status === APEXSIM.BT.RUNNING) {
                this._exit(u, APEXSIM.BT.RUNNING);
                return APEXSIM.BT.RUNNING;
            }

            if (status === APEXSIM.BT.SUCCESS) {
                this.index = 0;
                this._exit(u, APEXSIM.BT.SUCCESS);
                return APEXSIM.BT.SUCCESS;
            }

            this.index++;
        }

        this.index = 0;
        this._exit(u, APEXSIM.BT.FAILURE);
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

console.log("APEXSIM.BT — Behavior Tree Core Ready (v1.2 Instrumented).");

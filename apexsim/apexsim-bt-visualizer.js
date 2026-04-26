// =========================================================
// APEXSIM.BTVisualizer — Floating Draggable BT Debug Window
// v1.3 — Minimalist Live Node Firing View
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.BTVisualizer = {

    _rootEl: null,
    _headerEl: null,
    _contentEl: null,

    _isDragging: false,
    _dragOffsetX: 0,
    _dragOffsetY: 0,

    _selectedIndex: 0,
    _maxEventsPerUnit: 32,

    // Map<unitObject, Array<{nodeType, result, time}>>
    _eventsByUnit: new Map(),

    init() {
        this._createDOM();
        this._attachEvents();
        this._wireBTDebug();
        this._startLoop();
        console.log("APEXSIM.BTVisualizer — Ready (v1.3 Minimalist Live Node Firing).");
    },

    // -----------------------------------------------------
    // Public API
    // -----------------------------------------------------
    selectUnitByIndex(index) {
        this._selectedIndex = Math.max(0, index | 0);
    },

    toggleVisible() {
        if (!this._rootEl) return;
        const visible = this._rootEl.style.display !== "none";
        this._rootEl.style.display = visible ? "none" : "block";
    },

    // -----------------------------------------------------
    // DOM Creation
    // -----------------------------------------------------
    _createDOM() {
        const root = document.createElement("div");
        root.id = "apex-bt-visualizer";
        root.style.position = "absolute";
        root.style.right = "20px";
        root.style.top = "20px";
        root.style.width = "360px";
        root.style.maxHeight = "60vh";
        root.style.background = "rgba(0,0,0,0.9)";
        root.style.border = "1px solid #00ffaa";
        root.style.color = "#fff";
        root.style.fontFamily = "monospace";
        root.style.fontSize = "11px";
        root.style.zIndex = "9999";
        root.style.display = "block";
        root.style.boxSizing = "border-box";

        const header = document.createElement("div");
        header.style.padding = "6px 8px";
        header.style.cursor = "move";
        header.style.background = "#001a12";
        header.style.borderBottom = "1px solid #00ffaa";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";

        const title = document.createElement("div");
        title.textContent = "APEXSIM — Behavior Tree (Live)";
        title.style.color = "#00ffaa";

        const controls = document.createElement("div");
        controls.style.display = "flex";
        controls.style.gap = "6px";

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "<";
        prevBtn.style.background = "#111";
        prevBtn.style.color = "#fff";
        prevBtn.style.border = "1px solid #333";
        prevBtn.style.cursor = "pointer";
        prevBtn.style.fontSize = "10px";
        prevBtn.style.padding = "2px 6px";

        const nextBtn = document.createElement("button");
        nextBtn.textContent = ">";
        nextBtn.style.background = "#111";
        nextBtn.style.color = "#fff";
        nextBtn.style.border = "1px solid #333";
        nextBtn.style.cursor = "pointer";
        nextBtn.style.fontSize = "10px";
        nextBtn.style.padding = "2px 6px";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.background = "#330000";
        closeBtn.style.color = "#fff";
        closeBtn.style.border = "1px solid #660000";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.fontSize = "10px";
        closeBtn.style.padding = "2px 6px";

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        controls.appendChild(closeBtn);

        header.appendChild(title);
        header.appendChild(controls);

        const content = document.createElement("div");
        content.style.padding = "8px";
        content.style.overflowY = "auto";
        content.style.maxHeight = "calc(60vh - 32px)";
        content.style.whiteSpace = "pre";

        root.appendChild(header);
        root.appendChild(content);
        document.body.appendChild(root);

        this._rootEl = root;
        this._headerEl = header;
        this._contentEl = content;

        // Wire buttons
        prevBtn.addEventListener("click", () => this._stepUnit(-1));
        nextBtn.addEventListener("click", () => this._stepUnit(1));
        closeBtn.addEventListener("click", () => {
            this._rootEl.style.display = "none";
        });
    },

    // -----------------------------------------------------
    // Events (Dragging + Keyboard)
    // -----------------------------------------------------
    _attachEvents() {
        if (!this._headerEl || !this._rootEl) return;

        this._headerEl.addEventListener("mousedown", (e) => {
            this._isDragging = true;
            const rect = this._rootEl.getBoundingClientRect();
            this._dragOffsetX = e.clientX - rect.left;
            this._dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
            if (!this._isDragging || !this._rootEl) return;
            const x = e.clientX - this._dragOffsetX;
            const y = e.clientY - this._dragOffsetY;
            this._rootEl.style.left = x + "px";
            this._rootEl.style.top = y + "px";
            this._rootEl.style.right = "auto";
        });

        window.addEventListener("mouseup", () => {
            this._isDragging = false;
        });

        // Keyboard toggle: B key to show/hide
        window.addEventListener("keydown", (e) => {
            if (e.key === "b" || e.key === "B") {
                this.toggleVisible();
            }
        });
    },

    // -----------------------------------------------------
    // Wire into BT Debug Instrumentation
    // -----------------------------------------------------
    _wireBTDebug() {
        window.APEXSIM = window.APEXSIM || {};
        APEXSIM.BTDebug = APEXSIM.BTDebug || {};

        const prevEnter = APEXSIM.BTDebug.onNodeEnter || function () {};
        const prevExit  = APEXSIM.BTDebug.onNodeExit  || function () {};

        APEXSIM.BTDebug.onNodeEnter = (node, unit) => {
            prevEnter(node, unit);
            // For minimalist mode we don't need to log enter separately,
            // but we could in the future. Keeping hook for expansion.
        };

        APEXSIM.BTDebug.onNodeExit = (node, unit, result) => {
            prevExit(node, unit, result);
            this._recordNodeEvent(node, unit, result);
        };
    },

    _recordNodeEvent(node, unit, result) {
        if (!unit) return;

        const key = unit; // object reference as key
        if (!this._eventsByUnit.has(key)) {
            this._eventsByUnit.set(key, []);
        }

        const list = this._eventsByUnit.get(key);
        const nodeType = node && node.constructor && node.constructor.name
            ? node.constructor.name
            : "Node";

        list.push({
            nodeType,
            result,
            time: performance.now()
        });

        if (list.length > this._maxEventsPerUnit) {
            list.shift();
        }
    },

    // -----------------------------------------------------
    // Unit stepping
    // -----------------------------------------------------
    _stepUnit(delta) {
        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];
        if (!units.length) return;

        this._selectedIndex = (this._selectedIndex + delta + units.length) % units.length;
    },

    // -----------------------------------------------------
    // Main loop
    // -----------------------------------------------------
    _startLoop() {
        const loop = () => {
            try {
                this._update();
            } catch (e) {
                // Silent fail to avoid breaking the sim
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    _update() {
        if (!this._contentEl) return;

        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];
        if (!units.length) {
            this._contentEl.textContent =
                "No units.\n\nSpawn units to inspect Behavior Trees.\n\n" +
                "Controls:\n" +
                "  < / > : Switch unit\n" +
                "  B     : Toggle window";
            return;
        }

        const index = Math.min(this._selectedIndex, units.length - 1);
        const u = units[index];

        const lines = [];

        // -------------------------------------------------
        // Unit header
        // -------------------------------------------------
        lines.push(`Unit Index: ${index}`);
        lines.push(`------------------------------`);
        lines.push(`Label:   ${u.label || u.id || "(unnamed)"}`);
        lines.push(`State:   ${u.state || "Unknown"}`);
        lines.push(`Behavior:${u.behaviorName || "None"}`);
        lines.push(`vx: ${u.vx != null ? u.vx.toFixed(2) : "?"}`);
        lines.push(`vy: ${u.vy != null ? u.vy.toFixed(2) : "?"}`);
        lines.push("");

        // -------------------------------------------------
        // Live BT Events (Minimalist)
        // -------------------------------------------------
        lines.push("Recent BT Events (Live)");
        lines.push("------------------------------");

        const events = this._eventsByUnit.get(u) || [];
        if (!events.length) {
            lines.push("No BT events yet.");
        } else {
            const now = performance.now();
            const lastIndex = events.length - 1;

            for (let i = 0; i < events.length; i++) {
                const ev = events[i];
                const ageMs = now - ev.time;
                const age = ageMs < 1000
                    ? `${ageMs.toFixed(0)}ms`
                    : `${(ageMs / 1000).toFixed(1)}s`;

                const resultLabel = this._formatResult(ev.result);
                const colorTag = this._resultColorTag(ev.result);

                const prefix = (i === lastIndex) ? ">" : " ";
                lines.push(
                    `${prefix} [${resultLabel}] ${ev.nodeType}  (${age} ago) ${colorTag}`
                );
            }
        }

        lines.push("");
        lines.push("Legend:");
        lines.push("  SUCCESS = green");
        lines.push("  FAILURE = red");
        lines.push("  RUNNING = yellow");
        lines.push("");
        lines.push("Controls:");
        lines.push("  < / > : Switch unit");
        lines.push("  B     : Toggle window");

        this._contentEl.textContent = lines.join("\n");
    },

    _formatResult(result) {
        const BT = APEXSIM.BT || {};
        switch (result) {
            case BT.SUCCESS: return "SUCCESS";
            case BT.FAILURE: return "FAILURE";
            case BT.RUNNING: return "RUNNING";
            default: return "UNKNOWN";
        }
    },

    _resultColorTag(result) {
        const BT = APEXSIM.BT || {};
        switch (result) {
            case BT.SUCCESS: return "[G]";
            case BT.FAILURE: return "[R]";
            case BT.RUNNING: return "[Y]";
            default: return "[?]";
        }
    }
};

APEXSIM.BTVisualizer.init();

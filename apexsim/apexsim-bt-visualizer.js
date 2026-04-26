// =========================================================
// APEXSIM.BTVisualizer — Floating Draggable BT Debug Window
// v1.1 — Non-invasive, read-only, auto-wired
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

    init() {
        this._createDOM();
        this._attachEvents();
        this._startLoop();
        console.log("APEXSIM.BTVisualizer — Ready (Floating Window).");
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
        root.style.width = "320px";
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
        title.textContent = "APEXSIM — Behavior Tree";
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
    // Events (Dragging)
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
            this._contentEl.textContent = "No units.\n\nSpawn units to inspect Behavior Trees.";
            return;
        }

        const index = Math.min(this._selectedIndex, units.length - 1);
        const u = units[index];

        const lines = [];

        lines.push(`Unit Index: ${index}`);
        lines.push(`------------------------------`);
        lines.push(`State:    ${u.state || "Unknown"}`);
        lines.push(`Behavior: ${u.behaviorName || "None"}`);
        lines.push(`vx: ${u.vx != null ? u.vx.toFixed(2) : "?"}`);
        lines.push(`vy: ${u.vy != null ? u.vy.toFixed(2) : "?"}`);
        lines.push("");

        // Show a static view of the BT structure per state
        lines.push("Behavior Tree (Current State)");
        lines.push("------------------------------");

        const treeLines = this._getTreeForState(u.state || "Idle");
        for (const l of treeLines) {
            lines.push(l);
        }

        lines.push("");
        lines.push("Controls:");
        lines.push("  < / > : Switch unit");
        lines.push("  B     : Toggle window");

        this._contentEl.textContent = lines.join("\n");
    },

    // -----------------------------------------------------
    // BT Structure Descriptions
    // -----------------------------------------------------
    _getTreeForState(state) {
        switch (state) {
            case "Idle":
                return [
                    "Selector",
                    " ├─ InvestigateSound",
                    " ├─ InvestigateLastSeen",
                    " ├─ SocialDrift",
                    " └─ Curiosity"
                ];

            case "Wander":
                return [
                    "Selector",
                    " ├─ InvestigateSound",
                    " ├─ SocialDrift",
                    " └─ Curiosity"
                ];

            case "Roam":
                return [
                    "Selector",
                    " ├─ InvestigateSound",
                    " ├─ InvestigateLastSeen",
                    " └─ Curiosity"
                ];

            case "Chase":
                return [
                    "Action",
                    " └─ ChaseTarget"
                ];

            case "Flee":
                return [
                    "Action",
                    " └─ FleeThreat"
                ];

            default:
                return [
                    "Unknown State",
                    "No BT structure available."
                ];
        }
    }
};

APEXSIM.BTVisualizer.init();

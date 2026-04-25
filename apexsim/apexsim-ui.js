// =========================================================
// APEXSIM.UI — Liminal Engine v8.2
// Core UI system: canvas attach, input, layout, HUD bootstrap
// =========================================================
// Responsibilities:
// - Attach the main canvas to the renderer
// - Initialize UI subsystems (input, layout, panels, HUD)
// - Provide a single, stable entry point: attachCanvas(canvas)
// - Future‑proof for additional UI modules
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.UI = {

    canvas: null,
    attached: false,

    // =====================================================
    // PUBLIC ENTRY POINT — called from index.html
    // =====================================================
    attachCanvas(canvas) {
        if (!canvas) {
            console.error("APEXSIM.UI.attachCanvas — No canvas provided.");
            return;
        }

        this.canvas = canvas;

        // 1) Initialize renderer with this canvas
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        if (!Renderer || typeof Renderer.init !== "function") {
            console.error("APEXSIM.UI.attachCanvas — Renderer.init is not available.");
            return;
        }

        Renderer.init(canvas);

        // 2) Initialize UI subsystems
        this._initInput();
        this._initLayout();
        this._initPanels();
        this._initHUD();

        this.attached = true;

        console.log("APEXSIM.UI — Canvas attached and UI subsystems initialized.");
    },

    // =====================================================
    // INPUT SYSTEM BOOTSTRAP
    // =====================================================
    _initInput() {
        const Input = window.APEXUI && APEXUI.Input;
        if (!Input || typeof Input.init !== "function") {
            // Optional — not fatal
            console.warn("APEXSIM.UI — APEXUI.Input not found or missing init().");
            return;
        }

        Input.init(this.canvas);
    },

    // =====================================================
    // LAYOUT SYSTEM BOOTSTRAP
    // =====================================================
    _initLayout() {
        const Layout = window.APEXUI && APEXUI.Layout;
        if (!Layout || typeof Layout.init !== "function") {
            // Optional — not fatal
            console.warn("APEXSIM.UI — APEXUI.Layout not found or missing init().");
            return;
        }

        Layout.init();
    },

    // =====================================================
    // PANELS SYSTEM BOOTSTRAP
    // =====================================================
    _initPanels() {
        const Panels = window.APEXUI && APEXUI.Panels;
        if (!Panels || typeof Panels.init !== "function") {
            // Optional — not fatal
            console.warn("APEXSIM.UI — APEXUI.Panels not found or missing init().");
            return;
        }

        Panels.init();
    },

    // =====================================================
    // HUD SYSTEM BOOTSTRAP
    // =====================================================
    _initHUD() {
        const HUD = window.APEXUI && APEXUI.HUD;
        if (!HUD || typeof HUD.init !== "function") {
            // Optional — not fatal
            console.warn("APEXSIM.UI — APEXUI.HUD not found or missing init().");
            return;
        }

        HUD.init();
    }
};

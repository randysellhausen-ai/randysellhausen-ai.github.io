// =========================================================
// APEXSIM Core — Liminal Engine v8.2
// Root namespace + global configuration + lifecycle hooks
// =========================================================
// This file establishes the APEXSIM global object and
// provides the foundational structure that all subsystems
// attach to (Engine, Renderer, Data, UI, World, etc).
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Core = {

    version: "8.2",
    build: "Liminal Engine",

    initialized: false,

    // =====================================================
    // INIT — called once by apexcore.js or index.html
    // =====================================================
    init() {
        if (this.initialized) return;

        this.initialized = true;

        console.log(
            `%cAPEXSIM Core Initialized — Liminal Engine v${this.version}`,
            "color:#00eaff;font-weight:bold;font-size:14px;"
        );
    },

    // =====================================================
    // GLOBAL UTILITIES
    // =====================================================

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    randRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // =====================================================
    // GLOBAL EVENT BUS (future expansion)
    // =====================================================
    events: {},

    on(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    },

    emit(eventName, data) {
        const list = this.events[eventName];
        if (!list) return;
        for (let fn of list) {
            try { fn(data); }
            catch (err) {
                console.error("APEXSIM.Core Event Error:", err);
            }
        }
    }
};

// Auto‑init
APEXSIM.Core.init();

// =========================================================
// APEXSIM — MODULES
// =========================================================
// Module loader and registry for optional simulation features.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Modules = (function () {

    const modules = {};

    return {

        // Register a module by name
        register(name, moduleObj) {
            if (!name || !moduleObj) return;
            modules[name] = moduleObj;

            // Auto‑init if module has init()
            if (typeof moduleObj.init === "function") {
                moduleObj.init();
            }
        },

        // Retrieve a module
        get(name) {
            return modules[name] || null;
        },

        // List all modules
        list() {
            return Object.keys(modules);
        }
    };

})();

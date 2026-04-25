// =========================================================
// APEXSIM — Input (v8.0)
// =========================================================
// Responsibilities:
// - Mouse drag panning (instant start, direct control)
// - WASD panning (with smooth stop = hybrid feel)
// - Shift = speed boost
// - Zoom-aware pan speed
// - Runs its own small RAF loop for camera inertia
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Input = (function () {

    let camVX = 0;
    let camVY = 0;

    const keyState = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false
    };

    let dragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let lastTime = null;

    function getCanvas() {
        return APEXSIM.Renderer && APEXSIM.Renderer.canvas
            ? APEXSIM.Renderer.canvas
            : null;
    }

    function onKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case "w": keyState.w = true; break;
            case "a": keyState.a = true; break;
            case "s": keyState.s = true; break;
            case "d": keyState.d = true; break;
            case "shift": keyState.shift = true; break;
        }
    }

    function onKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case "w": keyState.w = false; break;
            case "a": keyState.a = false; break;
            case "s": keyState.s = false; break;
            case "d": keyState.d = false; break;
            case "shift": keyState.shift = false; break;
        }
    }

    function onMouseDown(e) {
        const canvas = getCanvas();
        if (!canvas) return;

        // Start drag on left or middle button
        if (e.button === 0 || e.button === 1) {
            dragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    }

    function onMouseUp(e) {
        dragging = false;
    }

    function onMouseMove(e) {
        if (!dragging) return;
        const canvas = getCanvas();
        if (!canvas) return;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        // Direct panning (instant, no inertia) for drag
        const scale = 1 / (APEXSIM.Camera.zoom || 1);
        APEXSIM.Camera.translate(-dx * scale, -dy * scale);
    }

    function updateCamera(dt) {
        if (!APEXSIM.Camera) return;

        // Base speed in pixels per second
        let speed = 400;
        if (keyState.shift) speed *= 1.75;

        // Zoom-aware speed (slower when zoomed in)
        const zoom = APEXSIM.Camera.zoom || 1;
        const zoomFactor = 1 / Math.sqrt(zoom);
        speed *= zoomFactor;

        let targetVX = 0;
        let targetVY = 0;

        if (keyState.w) targetVY -= speed;
        if (keyState.s) targetVY += speed;
        if (keyState.a) targetVX -= speed;
        if (keyState.d) targetVX += speed;

        // Hybrid: instant start toward target, smooth stop via friction
        const accel = 10;      // how fast we match input
        const friction = 6;    // how fast we slow when no input

        // Move velocity toward target
        camVX += (targetVX - camVX) * Math.min(1, accel * dt);
        camVY += (targetVY - camVY) * Math.min(1, accel * dt);

        // Apply friction when no input
        if (targetVX === 0) camVX *= Math.max(0, 1 - friction * dt);
        if (targetVY === 0) camVY *= Math.max(0, 1 - friction * dt);

        // Integrate
        APEXSIM.Camera.translate(camVX * dt, camVY * dt);
    }

    function loop(timestamp) {
        const now = timestamp / 1000;
        if (lastTime === null) {
            lastTime = now;
        }
        const dt = now - lastTime;
        lastTime = now;

        updateCamera(dt);

        window.requestAnimationFrame(loop);
    }

    function init() {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);

        window.requestAnimationFrame(loop);

        console.log("APEXSIM.Input — Initialized (Hybrid Camera).");
    }

    // Auto-init on load
    init();

    return {
        // Expose nothing for now; everything is event-driven
    };

})();

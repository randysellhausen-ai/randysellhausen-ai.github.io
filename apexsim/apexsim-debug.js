// APEXSIM Debug — FPS + Unit Count + Overlay

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Debug = {
    _visible: false,
    _lastTime: null,
    _fps: 0,

    setDebugVisible(visible) {
        this._visible = !!visible;
    },

    _updateFPS() {
        const now = performance.now() / 1000;
        if (this._lastTime === null) {
            this._lastTime = now;
            return;
        }
        const dt = now - this._lastTime;
        this._lastTime = now;
        this._fps = this._fps * 0.9 + (1 / dt) * 0.1;
    },

    draw(ctx, w, h) {
        this._updateFPS();

        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "top";

        ctx.fillText("FPS: " + this._fps.toFixed(1), 10, 10);
        ctx.fillText("Units: " + units.length, 10, 26);
    }
};

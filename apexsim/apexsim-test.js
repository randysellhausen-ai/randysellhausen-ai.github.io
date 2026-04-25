// =========================================================
// APEXSIM — TEST SUITE (Unified A+B+C+D+E Upgrade)
// =========================================================
// Features included:
// A — Stance Hotkeys
// B — Auto‑spawn 20 units
// C — Debug Overlays
// D — Tactical Overlays
// E — Engine‑Level Enhancements
// =========================================================

window.APEXSIM = window.APEXSIM || {};
window.APEXSIM.Test = (function () {

    const units = [];
    let selectedUnit = null;

    // =========================================================
    // B — AUTO‑SPAWN 20 UNITS
    // =========================================================
    function spawnUnits(count = 20) {
        for (let i = 0; i < count; i++) {
            const unit = {
                id: "unit_" + i,
                x: 200 + Math.random() * 400,
                y: 150 + Math.random() * 300,
                vx: (Math.random() - 0.5) * 40,
                vy: (Math.random() - 0.5) * 40,
                stance: ["aggressive", "neutral", "defensive"][Math.floor(Math.random() * 3)],
                selected: false,
                color: "cyan"
            };

            units.push(unit);
            if (window.APEXSIM.Core && window.APEXSIM.Core.addUnit) {
                window.APEXSIM.Core.addUnit(unit);
            }
        }
    }

    // =========================================================
    // A — STANCE HOTKEYS
    // =========================================================
    function cycleStance(unit, dir) {
        const order = ["aggressive", "neutral", "defensive"];
        let idx = order.indexOf(unit.stance);
        if (idx === -1) idx = 1; // default to neutral
        idx = (idx + dir + order.length) % order.length;
        unit.stance = order[idx];
    }

    window.addEventListener("keydown", (e) => {
        if (!selectedUnit) return;

        if (e.key === "q") cycleStance(selectedUnit, -1);
        if (e.key === "e") cycleStance(selectedUnit, +1);

        if (e.key === "1") selectedUnit.stance = "aggressive";
        if (e.key === "2") selectedUnit.stance = "neutral";
        if (e.key === "3") selectedUnit.stance = "defensive";
    });

    // =========================================================
    // E — CLICK‑TO‑SELECT
    // =========================================================
    function attachSelection(canvas) {
        canvas.addEventListener("mousedown", (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            selectedUnit = null;

            for (const u of units) {
                const dx = mx - u.x;
                const dy = my - u.y;
                if (dx * dx + dy * dy < 20 * 20) {
                    selectedUnit = u;
                    break;
                }
            }
        });
    }

    // =========================================================
    // D — TACTICAL OVERLAYS
    // =========================================================
    function drawTactical(ctx) {
        if (!selectedUnit) return;

        ctx.save();
        ctx.strokeStyle = "rgba(0,255,0,0.4)";
        ctx.lineWidth = 2;

        // Movement radius
        ctx.beginPath();
        ctx.arc(selectedUnit.x, selectedUnit.y, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Facing cone (simple forward arc)
        ctx.fillStyle = "rgba(255,255,0,0.2)";
        ctx.beginPath();
        ctx.moveTo(selectedUnit.x, selectedUnit.y);
        ctx.arc(selectedUnit.x, selectedUnit.y, 100, -0.4, 0.4);
        ctx.closePath();
        ctx.fill();

        // Selection ring
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(selectedUnit.x, selectedUnit.y, 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    // =========================================================
    // C — DEBUG OVERLAY
    // =========================================================
    let lastTime = performance.now();
    let fps = 0;

    function drawDebug(ctx) {
        const now = performance.now();
        fps = 1000 / (now - lastTime);
        lastTime = now;

        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "14px monospace";

        ctx.fillText("FPS: " + fps.toFixed(1), 10, 20);
        ctx.fillText("Units: " + units.length, 10, 40);

        if (selectedUnit) {
            ctx.fillText("Selected: " + selectedUnit.id, 10, 60);
            ctx.fillText("Stance: " + selectedUnit.stance, 10, 80);
            ctx.fillText(
                "Pos: (" + selectedUnit.x.toFixed(1) + ", " + selectedUnit.y.toFixed(1) + ")",
                10,
                100
            );
        }

        ctx.restore();
    }

    // =========================================================
    // PUBLIC API
    // =========================================================
    return {

        // Called from index.html boot
        spawnTestUnit() {
            spawnUnits(20);
        },

        // Optional: if you want selection wired via UI
        attachCanvas(canvas) {
            attachSelection(canvas);
        },

        // Called from Renderer.draw()
        drawOverlays(ctx) {
            drawTactical(ctx);
            drawDebug(ctx);
        }
    };

})();

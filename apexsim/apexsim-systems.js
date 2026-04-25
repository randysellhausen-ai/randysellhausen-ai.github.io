// APEXSIM Systems — Movement + AI

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Systems = {
    update(units, dt) {
        this.updateAI(units, dt);
        this.updateMovement(units, dt);
    },

    updateAI(units, dt) {
        for (let i = 0; i < units.length; i++) {
            const u = units[i];

            // Simple wandering AI: pick a target and drift toward it
            if (!u.aiTarget || this._distanceSq(u.x, u.y, u.aiTarget.x, u.aiTarget.y) < 4) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 10;
                u.aiTarget = {
                    x: u.x + Math.cos(angle) * radius,
                    y: u.y + Math.sin(angle) * radius
                };
            }

            const dx = u.aiTarget.x - u.x;
            const dy = u.aiTarget.y - u.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;

            const desiredVx = (dx / len) * u.maxSpeed;
            const desiredVy = (dy / len) * u.maxSpeed;

            const steerX = desiredVx - u.vx;
            const steerY = desiredVy - u.vy;

            const steerLen = Math.sqrt(steerX * steerX + steerY * steerY) || 1;
            const maxSteer = u.maxAccel;

            u.vx += (steerX / steerLen) * maxSteer * dt;
            u.vy += (steerY / steerLen) * maxSteer * dt;
        }
    },

    updateMovement(units, dt) {
        for (let i = 0; i < units.length; i++) {
            const u = units[i];

            // Clamp speed
            const speed = Math.sqrt(u.vx * u.vx + u.vy * u.vy);
            if (speed > u.maxSpeed) {
                const s = u.maxSpeed / (speed || 1);
                u.vx *= s;
                u.vy *= s;
            }

            u.x += u.vx * dt;
            u.y += u.vy * dt;

            // Simple bounds
            if (u.x < 0) { u.x = 0; u.vx *= -0.5; }
            if (u.y < 0) { u.y = 0; u.vy *= -0.5; }
            if (u.x > 80) { u.x = 80; u.vx *= -0.5; }
            if (u.y > 45) { u.y = 45; u.vy *= -0.5; }
        }
    },

    _distanceSq(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }
};

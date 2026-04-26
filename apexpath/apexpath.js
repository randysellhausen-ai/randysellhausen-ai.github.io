// =========================================================
// APEXPATH 1.0 — Liminal Engine Core Pathfinding
// Simple deterministic A* for grid worlds
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Path = {

    // -----------------------------------------------------
    // PUBLIC API
    // -----------------------------------------------------
    findPath(startX, startY, endX, endY) {
        const world = APEXSIM.World;
        if (!world || !world.tiles) return [];

        const open = [];
        const closed = new Set();
        const start = this._node(startX, startY, null, 0, this._h(startX, startY, endX, endY));
        open.push(start);

        while (open.length > 0) {
            // Get lowest f-cost node
            open.sort((a, b) => a.f - b.f);
            const current = open.shift();
            const key = `${current.x},${current.y}`;
            closed.add(key);

            // Reached goal
            if (current.x === endX && current.y === endY) {
                return this._reconstruct(current);
            }

            // Explore neighbors
            const neighbors = this._neighbors(current.x, current.y);
            for (const n of neighbors) {
                const nKey = `${n.x},${n.y}`;
                if (closed.has(nKey)) continue;
                if (!this._walkable(n.x, n.y)) continue;

                const g = current.g + 1;
                const h = this._h(n.x, n.y, endX, endY);
                const f = g + h;

                const existing = open.find(o => o.x === n.x && o.y === n.y);
                if (existing) {
                    if (g < existing.g) {
                        existing.g = g;
                        existing.f = f;
                        existing.parent = current;
                    }
                } else {
                    open.push(this._node(n.x, n.y, current, g, h));
                }
            }
        }

        return []; // No path
    },

    // -----------------------------------------------------
    // INTERNAL HELPERS
    // -----------------------------------------------------
    _node(x, y, parent, g, h) {
        return { x, y, parent, g, h, f: g + h };
    },

    _h(x1, y1, x2, y2) {
        // Manhattan distance
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    _neighbors(x, y) {
        return [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
        ];
    },

    _walkable(x, y) {
        const world = APEXSIM.World;
        if (x < 0 || y < 0 || x >= world.width || y >= world.height) return false;

        const tile = world.tiles[y][x];
        if (!tile) return false;

        // Basic rule: water is blocked
        return tile.type !== world.TILE_WATER;
    },

    _reconstruct(node) {
        const path = [];
        let cur = node;
        while (cur) {
            path.push({ x: cur.x, y: cur.y });
            cur = cur.parent;
        }
        return path.reverse();
    }
};

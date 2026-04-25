// =========================================================
// APEXPATH — Core Pathfinding (v1.0)
// =========================================================
// Grid-based A* pathfinding on APEXWORLD.World
// - Uses tile coordinates (x, y) in world space
// - Respects APEXWORLD.World.isWalkable(x, y)
// - Returns an array of { x, y } tiles (inclusive)
// =========================================================

window.APEXPATH = window.APEXPATH || {};

APEXPATH.Pathfinder = {

    // Public API
    findPath(startX, startY, goalX, goalY) {
        const world = APEXWORLD && APEXWORLD.World;
        if (!world) return [];

        if (!world.inBounds(startX, startY) || !world.inBounds(goalX, goalY)) {
            return [];
        }

        if (!world.isWalkable(goalX, goalY)) {
            // Goal not walkable — no path
            return [];
        }

        const openSet = [];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const startKey = this._key(startX, startY);
        const goalKey = this._key(goalX, goalY);

        gScore.set(startKey, 0);
        fScore.set(startKey, this._heuristic(startX, startY, goalX, goalY));

        openSet.push({ x: startX, y: startY, key: startKey });

        while (openSet.length > 0) {
            // Get node with lowest fScore
            let bestIndex = 0;
            let bestNode = openSet[0];
            let bestF = fScore.get(bestNode.key) ?? Infinity;

            for (let i = 1; i < openSet.length; i++) {
                const node = openSet[i];
                const f = fScore.get(node.key) ?? Infinity;
                if (f < bestF) {
                    bestF = f;
                    bestNode = node;
                    bestIndex = i;
                }
            }

            const current = bestNode;
            if (current.key === goalKey) {
                return this._reconstructPath(cameFrom, current);
            }

            // Remove from open set
            openSet.splice(bestIndex, 1);

            // Explore neighbors (4-way)
            const neighbors = this._neighbors(world, current.x, current.y);
            for (let i = 0; i < neighbors.length; i++) {
                const n = neighbors[i];
                const nKey = this._key(n.x, n.y);

                const tentativeG = (gScore.get(current.key) ?? Infinity) + 1;

                if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
                    cameFrom.set(nKey, current);
                    gScore.set(nKey, tentativeG);
                    fScore.set(
                        nKey,
                        tentativeG + this._heuristic(n.x, n.y, goalX, goalY)
                    );

                    if (!openSet.some(o => o.key === nKey)) {
                        openSet.push({ x: n.x, y: n.y, key: nKey });
                    }
                }
            }
        }

        // No path
        return [];
    },

    // =====================================================
    // Helpers
    // =====================================================

    _key(x, y) {
        return x + "," + y;
    },

    _heuristic(x1, y1, x2, y2) {
        // Manhattan distance (grid)
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    _neighbors(world, x, y) {
        const out = [];

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        for (let i = 0; i < dirs.length; i++) {
            const nx = x + dirs[i].x;
            const ny = y + dirs[i].y;

            if (!world.inBounds(nx, ny)) continue;
            if (!world.isWalkable(nx, ny)) continue;

            out.push({ x: nx, y: ny });
        }

        return out;
    },

    _reconstructPath(cameFrom, current) {
        const path = [{ x: current.x, y: current.y }];

        let key = this._key(current.x, current.y);
        while (cameFrom.has(key)) {
            const prev = cameFrom.get(key);
            path.push({ x: prev.x, y: prev.y });
            key = this._key(prev.x, prev.y);
        }

        path.reverse();
        return path;
    }
};

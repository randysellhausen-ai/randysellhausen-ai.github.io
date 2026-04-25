// APEXSIM Data — Unit Templates

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Data = {
    nextId: 1,

    createUnit(x, y) {
        return {
            id: this.nextId++,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            maxSpeed: 10,
            maxAccel: 30,
            aiTarget: null
        };
    }
};

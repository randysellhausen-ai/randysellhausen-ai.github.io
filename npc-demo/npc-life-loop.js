class NPC {
  constructor(name) {
    this.name = name;
    this.hunger = 100;
    this.energy = 100;
    this.mood = 100;
    this.action = "Idle";
  }

  updateNeeds() {
    this.hunger -= 2;
    this.energy -= 1;
    this.mood = Math.round((this.hunger + this.energy) / 2);
  }

  chooseAction() {
    if (this.hunger < 40) this.action = "Eating";
    else if (this.energy < 40) this.action = "Resting";
    else this.action = "Wandering";
  }

  tick() {
    this.updateNeeds();
    this.chooseAction();
  }
}

const npcs = [
  new NPC("Ava"),
  new NPC("Jace"),
  new NPC("Mira"),
];

function render() {
  const container = document.getElementById("npc-container");
  container.innerHTML = "";

  npcs.forEach(npc => {
    const div = document.createElement("div");
    div.className = "npc";

    if (npc.action === "Wandering") div.classList.add("wandering");
    if (npc.action === "Eating") div.classList.add("eating");
    if (npc.action === "Resting") div.classList.add("resting");

    div.innerHTML = `
      <strong>${npc.name}</strong><br>
      Action: ${npc.action}<br>

      <div class="bar">
        <div class="bar-fill hunger-fill" style="width:${npc.hunger}%;"></div>
      </div>

      <div class="bar">
        <div class="bar-fill energy-fill" style="width:${npc.energy}%;"></div>
      </div>

      <div class="bar">
        <div class="bar-fill mood-fill" style="width:${npc.mood}%;"></div>
      </div>
    `;

    container.appendChild(div);
  });
}

function tickPulse() {
  const pulse = document.getElementById("tick-pulse");
  pulse.style.opacity = 1;
  setTimeout(() => pulse.style.opacity = 0, 200);
}

setInterval(() => {
  npcs.forEach(npc => npc.tick());
  render();
  tickPulse();
}, 1000);

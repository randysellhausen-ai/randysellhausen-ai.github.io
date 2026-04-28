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
    div.innerHTML = `
      <strong>${npc.name}</strong><br>
      Hunger: ${npc.hunger}<br>
      Energy: ${npc.energy}<br>
      Mood: ${npc.mood}<br>
      Action: ${npc.action}
    `;
    container.appendChild(div);
  });
}

setInterval(() => {
  npcs.forEach(npc => npc.tick());
  render();
}, 1000);

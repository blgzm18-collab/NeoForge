// script.js

document.addEventListener('DOMContentLoaded', () => {
  const sceneTree = document.getElementById('scene-tree');
  const inspector = document.getElementById('inspector');
  const addNodeBtn = document.getElementById('add-node-btn');
  const playBtn = document.getElementById('play-btn');

  // Sample Scene Tree Data
  const nodes = [
    { id: 1, name: "MainScene", type: "Node2D", icon: "fa-layer-group", children: [
      { id: 2, name: "Player", type: "Sprite", icon: "fa-image" },
      { id: 3, name: "MainCamera", type: "Camera", icon: "fa-video" },
      { id: 4, name: "Ground", type: "CollisionShape", icon: "fa-square" }
    ]}
  ];

  function renderTree() {
    sceneTree.innerHTML = '';
    nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';
      nodeEl.innerHTML = `
        <div class="tree-item" data-id="${node.id}">
          <i class="fas ${node.icon}"></i>
          <span>${node.name}</span>
          <span class="node-type">(${node.type})</span>
        </div>
      `;
      
      nodeEl.querySelector('.tree-item').addEventListener('click', () => {
        showInspector(node);
      });
      
      sceneTree.appendChild(nodeEl);
    });
  }

  function showInspector(node) {
    inspector.innerHTML = `
      <div class="inspector-section">
        <h3>${node.name}</h3>
        <p class="node-type-full">${node.type}</p>
      </div>

      <div class="section">
        <div class="section-header">Transform</div>
        <div class="property">
          <label>Position</label>
          <div class="vector3">X: 120 &nbsp; Y: 240</div>
        </div>
        <div class="property">
          <label>Rotation</label>
          <input type="number" value="0" /> °
        </div>
        <div class="property">
          <label>Scale</label>
          <div class="vector3">X: 1.0 &nbsp; Y: 1.0</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Sprite</div>
        <div class="property">
          <label>Texture</label>
          <button class="small-btn">Choose Texture...</button>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Script</div>
        <button class="attach-btn">Attach Script</button>
      </div>
    `;
  }

  // Add Node Button
  addNodeBtn.addEventListener('click', () => {
    const name = prompt("New node name:", "NewNode");
    if (name) {
      alert(`Node "${name}" added to scene! (Demo)`);
      // In real version: add to tree + re-render
    }
  });

  // Play Button Demo
  playBtn.addEventListener('click', () => {
    playBtn.innerHTML = `<i class="fas fa-square"></i>`;
    playBtn.style.background = '#ff2d55';
    setTimeout(() => {
      alert("Play mode started (demo)\n\nIn real engine this would launch the game preview.");
      playBtn.innerHTML = `<i class="fas fa-play"></i>`;
      playBtn.style.background = '';
    }, 800);
  });

  // Initialize
  renderTree();

  // Keyboard shortcuts demo
  document.addEventListener('keydown', (e) => {
    if (e.key === " " && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      playBtn.click();
    }
  });
});

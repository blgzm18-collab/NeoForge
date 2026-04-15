// script.js - Full Node Editor Functionality

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sceneTree = document.getElementById('scene-tree');
    const inspector = document.getElementById('inspector');
    const addNodeBtn = document.getElementById('add-node-btn');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const gridToggle = document.getElementById('grid-toggle');
    const resetCamera = document.getElementById('reset-camera');
    const viewport = document.getElementById('viewport');
    const searchInput = document.getElementById('scene-search');

    // State
    let nodes = [
        {
            id: 1,
            name: "MainScene",
            type: "Node2D",
            icon: "fa-layer-group",
            expanded: true,
            children: [
                {
                    id: 2,
                    name: "Player",
                    type: "Sprite2D",
                    icon: "fa-image",
                    selected: true
                },
                {
                    id: 3,
                    name: "MainCamera",
                    type: "Camera2D",
                    icon: "fa-video"
                },
                {
                    id: 4,
                    name: "Ground",
                    type: "StaticBody2D",
                    icon: "fa-square",
                    children: [
                        { id: 5, name: "CollisionShape2D", type: "CollisionShape2D", icon: "fa-vector-square" }
                    ]
                }
            ]
        }
    ];

    let selectedNodeId = 2; // Player selected by default
    let isPlaying = false;

    // Render Scene Tree
    function renderSceneTree(filteredNodes = null) {
        sceneTree.innerHTML = '';
        const data = filteredNodes || nodes;

        data.forEach(node => {
            const nodeElement = createTreeNodeElement(node);
            sceneTree.appendChild(nodeElement);
        });
    }

    function createTreeNodeElement(node) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tree-node-wrapper';

        const item = document.createElement('div');
        item.className = `tree-item ${node.selected ? 'selected' : ''}`;
        item.dataset.id = node.id;

        item.innerHTML = `
            ${node.children && node.children.length > 0 ? 
                `<span class="expand-icon ${node.expanded ? 'expanded' : ''}"><i class="fas fa-chevron-right"></i></span>` : 
                `<span class="expand-icon spacer"></span>`
            }
            <i class="fas ${node.icon} node-icon"></i>
            <span class="node-name">${node.name}</span>
            <span class="node-type">(${node.type})</span>
        `;

        // Click to select
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.expand-icon')) {
                selectNode(node.id);
            }
        });

        // Expand/Collapse
        const expandIcon = item.querySelector('.expand-icon');
        if (expandIcon && !expandIcon.classList.contains('spacer')) {
            expandIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                node.expanded = !node.expanded;
                renderSceneTree();
            });
        }

        wrapper.appendChild(item);

        // Render children if expanded
        if (node.children && node.children.length > 0 && node.expanded) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            node.children.forEach(child => {
                childrenContainer.appendChild(createTreeNodeElement(child));
            });
            wrapper.appendChild(childrenContainer);
        }

        return wrapper;
    }

    // Select a node and update inspector
    function selectNode(id) {
        // Deselect all
        function deselectAll(data) {
            data.forEach(node => {
                node.selected = false;
                if (node.children) deselectAll(node.children);
            });
        }
        deselectAll(nodes);

        // Find and select the node
        function findAndSelect(data) {
            for (let node of data) {
                if (node.id === id) {
                    node.selected = true;
                    selectedNodeId = id;
                    return node;
                }
                if (node.children) {
                    const found = findAndSelect(node.children);
                    if (found) return found;
                }
            }
            return null;
        }

        const selectedNode = findAndSelect(nodes);
        if (selectedNode) {
            renderSceneTree();
            showInspector(selectedNode);
        }
    }

    // Show Inspector Panel
    function showInspector(node) {
        inspector.innerHTML = `
            <div class="inspector-section">
                <h3>${node.name}</h3>
                <p class="node-type-full">${node.type}</p>
            </div>

            <!-- Transform Section -->
            <div class="section">
                <div class="section-header">Transform</div>
                <div class="property">
                    <label>Position</label>
                    <div class="vector3">X: <input type="number" value="120" style="width:60px"> Y: <input type="number" value="240" style="width:60px"></div>
                </div>
                <div class="property">
                    <label>Rotation</label>
                    <input type="number" value="0" style="width:80px"> °
                </div>
                <div class="property">
                    <label>Scale</label>
                    <div class="vector3">X: <input type="number" value="1" step="0.1" style="width:60px"> Y: <input type="number" value="1" step="0.1" style="width:60px"></div>
                </div>
            </div>

            <!-- Sprite / Visual Section -->
            <div class="section">
                <div class="section-header">Sprite2D</div>
                <div class="property">
                    <label>Texture</label>
                    <button class="small-btn">player.png</button>
                </div>
                <div class="property">
                    <label>Modulate</label>
                    <input type="color" value="#FFFFFF" style="width:80px">
                </div>
            </div>

            <!-- Script Section -->
            <div class="section">
                <div class="section-header">Script</div>
                <button class="attach-btn">Attach Script...</button>
                <div class="property" style="margin-top: 12px;">
                    <label>Attached</label>
                    <span style="color: #00B8FF; font-family: 'JetBrains Mono', monospace;">player.gd</span>
                </div>
            </div>

            <!-- Signals -->
            <div class="section">
                <div class="section-header">Signals</div>
                <button class="small-btn" style="width: 100%;">Add Signal</button>
            </div>
        `;
    }

    // Toolbar Buttons
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
            playBtn.style.background = '#FF5252';
            console.log("%c▶️ Play mode started (Demo)", "color: #00B8FF; font-weight: bold");
        } else {
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.style.background = '#00B8FF';
        }
    });

    pauseBtn.addEventListener('click', () => {
        alert("Pause functionality would go here.\n\nIn a full engine this would pause the running scene.");
    });

    stopBtn.addEventListener('click', () => {
        if (isPlaying) {
            isPlaying = false;
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.style.background = '#00B8FF';
        }
        alert("Scene stopped.");
    });

    gridToggle.addEventListener('click', () => {
        alert("Grid toggle would enable/disable background grid in viewport.");
    });

    resetCamera.addEventListener('click', () => {
        alert("Camera reset to default position and zoom.");
    });

    // Add Node Button
    addNodeBtn.addEventListener('click', () => {
        const nodeName = prompt("Enter new node name:", "NewNode");
        if (!nodeName) return;

        const newNode = {
            id: Date.now(),
            name: nodeName,
            type: "Node2D",
            icon: "fa-cube",
            selected: false
        };

        // Add as child of currently selected node or root
        const root = nodes[0];
        if (!root.children) root.children = [];
        root.children.push(newNode);
        root.expanded = true;

        renderSceneTree();
        selectNode(newNode.id);
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (!term) {
            renderSceneTree();
            return;
        }

        function filterNodes(data) {
            return data.map(node => {
                const match = node.name.toLowerCase().includes(term) || 
                             node.type.toLowerCase().includes(term);
                
                const filteredNode = { ...node };
                
                if (node.children) {
                    filteredNode.children = filterNodes(node.children);
                }
                
                return (match || (filteredNode.children && filteredNode.children.length > 0)) ? filteredNode : null;
            }).filter(Boolean);
        }

        const filtered = filterNodes(nodes);
        renderSceneTree(filtered);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === " " && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            e.preventDefault();
            playBtn.click();
        }
        
        if (e.key === "Delete" && selectedNodeId) {
            if (confirm("Delete selected node?")) {
                alert("Node deletion would be implemented here.");
                // In full version: remove node + re-render
            }
        }
    });

    // Demo: Make viewport nodes clickable too
    function makeDemoNodesInteractive() {
        const demoNodes = document.querySelectorAll('.demo-node');
        demoNodes.forEach((demo, index) => {
            demo.addEventListener('click', () => {
                const nodeIds = [2, 3, 4];
                selectNode(nodeIds[index] || 2);
            });
        });
    }

    // Initialize everything
    function init() {
        renderSceneTree();
        
        // Select default node
        const defaultNode = nodes[0].children[0];
        if (defaultNode) {
            showInspector(defaultNode);
        }

        makeDemoNodesInteractive();

        // Welcome message in console
        console.log("%cNeonForge Editor initialized successfully ✓", "color: #00B8FF; font-size: 14px;");
    }

    // Start the editor
    init();
});

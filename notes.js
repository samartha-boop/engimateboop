/*
  EngiMate Smart Notes Generator Controller
*/

import { addXP } from "../state.js";

const MOCK_FLASHCARDS = [
  { front: "What is LIFO?", back: "Last In First Out. A queueing or stack access mechanism where the newest item is processed first." },
  { front: "What is a Linked List?", back: "A linear collection of data elements called nodes, where each node points to the next node via pointers." },
  { front: "What is an AVL Tree?", back: "A self-balancing Binary Search Tree (BST) where the height difference of left and right subtrees is at most 1." }
];

const MOCK_MINDMAP_NODES = [
  { id: "root", text: "Data Structures", x: 50, y: 50, isRoot: true, desc: "Ways of organizing and storing data in computer systems." },
  { id: "n1", text: "Linear", x: 25, y: 30, isRoot: false, desc: "Elements arranged in sequential order (e.g., Stack, Queue, Array)." },
  { id: "n2", text: "Non-Linear", x: 75, y: 30, isRoot: false, desc: "Elements connected hierarchically or cyclically (e.g., Tree, Graph)." },
  { id: "n3", text: "Stack (LIFO)", x: 15, y: 75, isRoot: false, desc: "Operations: Push and Pop at a single end." },
  { id: "n4", text: "Queue (FIFO)", x: 35, y: 75, isRoot: false, desc: "Operations: Enqueue at Rear, Dequeue at Front." },
  { id: "n5", text: "BST Tree", x: 65, y: 75, isRoot: false, desc: "Left child is smaller, right child is larger." },
  { id: "n6", text: "Graph Nodes", x: 85, y: 75, isRoot: false, desc: "Nodes connected by edges representing networks." }
];

export function render(container) {
  let isUploaded = false;
  let activeCardIdx = 0;

  function renderNotesView() {
    if (!isUploaded) {
      // Show File Uploader
      container.innerHTML = `
        <div class="notes-container animated-slide-up">
          <div class="section-header">
            <h3 class="section-title">Smart Notes Generator</h3>
          </div>
          
          <div class="glass-card" style="text-align: center; padding: 20px;">
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Upload your lecture slides, syllabus PDFs, or textbook images, and our AI will extract summaries, flippable flashcards, and interactive mind maps instantly.</p>
            
            <div class="uploader-box" id="drop-zone">
              <i data-lucide="upload-cloud" class="uploader-icon"></i>
              <h4 style="font-size:13px; margin-bottom:4px;">Drag & drop your files here</h4>
              <p style="font-size:10px; color:var(--text-muted);">Supports PDF, DOCX, PNG, JPG (Max 15MB)</p>
              <input type="file" id="file-input" style="display: none;">
            </div>
            
            <button class="btn btn-primary" id="select-file-btn">Browse Files</button>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const dropZone = document.getElementById("drop-zone");
      const fileInput = document.getElementById("file-input");
      const browseBtn = document.getElementById("select-file-btn");

      browseBtn?.addEventListener("click", () => fileInput.click());
      
      fileInput?.addEventListener("change", () => handleUploadSimulation("Lecture_3_DataStructures.pdf"));
      
      dropZone?.addEventListener("click", () => fileInput.click());
      dropZone?.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
      });
      dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
      dropZone?.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        handleUploadSimulation("Syllabus_Module_2.docx");
      });

    } else {
      // RENDER EXTRACTED STUDY CONTENT
      container.innerHTML = `
        <div class="notes-container animated-slide-up" style="padding-bottom: 24px;">
          <div class="section-header">
            <h3 class="section-title">AI Extracted Assets</h3>
            <span class="section-action" id="reset-notes-btn">Upload New</span>
          </div>

          <!-- Tab selectors -->
          <div class="tab-group">
            <button class="tab-btn active" id="tab-summary">Summary</button>
            <button class="tab-btn" id="tab-flashcards">Flashcards</button>
            <button class="tab-btn" id="tab-mindmap">Mind Map</button>
          </div>

          <!-- SUB-VIEW 1: SUMMARY -->
          <div class="notes-subview" id="notes-view-summary">
            <div class="glass-card">
              <div class="glass-card-header">
                <h3 class="glass-card-title"><i data-lucide="file-text" style="color:var(--color-orange);"></i> Summary: DSA Overview</h3>
              </div>
              <div style="font-size: 12px; line-height: 1.5; color: var(--text-main);">
                <p>The uploaded document describes <strong>Data Structures</strong>: specialized formats for organizing, processing, and storing data. They are crucial for writing efficient algorithms.</p>
                
                <h4 style="font-size: 11px; margin-top:12px; color:var(--color-orange); text-transform:uppercase;">Key Points Extracted</h4>
                <ul style="margin-left: 16px; margin-top: 6px; display:flex; flex-direction:column; gap:6px;">
                  <li><strong>Linear Structures</strong>: Stacks, queues, and linked lists store elements sequentially in memory, where connections are contiguous.</li>
                  <li><strong>Hierarchical Structures</strong>: Trees and graphs store elements in parent-child relations or node-link associations.</li>
                  <li><strong>LIFO Property</strong>: Stacks function via Last-In First-Out, utilizing <code>push()</code> and <code>pop()</code> commands at the same memory pointer.</li>
                  <li><strong>FIFO Property</strong>: Queues operate via First-In First-Out, inserting elements at the <code>rear</code> and removing them at the <code>front</code>.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW 2: FLASHCARDS -->
          <div class="notes-subview" id="notes-view-flashcards" style="display: none;">
            <div class="flashcard-stack">
              <div class="flashcard" id="flashcard-card">
                <div class="flashcard-side flashcard-front">
                  <div class="flashcard-counter" id="card-counter-display">1 / 3</div>
                  <h4 style="font-size: 14px; font-weight:800; color:var(--color-orange);" id="card-front-text">Question Front</h4>
                  <p style="font-size: 9px; color:var(--text-muted); margin-top:14px;">(Tap card to flip)</p>
                </div>
                <div class="flashcard-side flashcard-back">
                  <h4 style="font-size: 12px; font-weight:700; line-height:1.4;" id="card-back-text">Answer Back</h4>
                </div>
              </div>
            </div>
            
            <div class="flashcard-stack-controls">
              <button class="btn btn-secondary btn-icon-only" id="prev-card-btn" style="width: 38px; height:38px;">
                <i data-lucide="arrow-left"></i>
              </button>
              <button class="btn btn-secondary btn-icon-only" id="next-card-btn" style="width: 38px; height:38px;">
                <i data-lucide="arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- SUB-VIEW 3: MIND MAP -->
          <div class="notes-subview" id="notes-view-mindmap" style="display: none;">
            <div class="glass-card" style="padding: 10px;">
              <p style="font-size: 10px; color: var(--text-muted); text-align: center;">Click any node to view its definition and properties.</p>
              
              <div class="mindmap-container" id="mindmap-box">
                <!-- SVG Connector lines -->
                <svg class="roadmap-connector-svg">
                  <!-- Connections (root to n1, root to n2, n1 to n3, n1 to n4, n2 to n5, n2 to n6) -->
                  <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
                  <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
                  <line x1="25%" y1="30%" x2="15%" y2="75%" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
                  <line x1="25%" y1="30%" x2="35%" y2="75%" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
                  <line x1="75%" y1="30%" x2="65%" y2="75%" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
                  <line x1="75%" y1="30%" x2="85%" y2="75%" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
                </svg>

                ${MOCK_MINDMAP_NODES.map(node => `
                  <div class="mindmap-node ${node.isRoot ? 'root' : ''}" 
                       style="left: ${node.x}%; top: ${node.y}%;" 
                       data-desc="${node.desc}" 
                       data-title="${node.text}">
                    ${node.text}
                  </div>
                `).join('')}
              </div>

              <!-- Node description panel -->
              <div id="mindmap-details-card" class="glass-card" style="margin-top: 10px; margin-bottom: 0; padding: 10px; background: rgba(0,0,0,0.3); border-color: rgba(255,159,28,0.2);">
                <h4 style="font-size:11px; color:var(--color-orange);" id="node-detail-title">Data Structures</h4>
                <p style="font-size:10px; color:var(--text-muted); margin-top:2px;" id="node-detail-desc">Ways of organizing and storing data in computer systems.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Bind Subview tabs toggles
      const subTabs = ["summary", "flashcards", "mindmap"];
      subTabs.forEach(st => {
        const btn = document.getElementById(`tab-${st}`);
        const view = document.getElementById(`notes-view-${st}`);
        btn?.addEventListener("click", () => {
          subTabs.forEach(o => {
            document.getElementById(`tab-${o}`).classList.remove("active");
            document.getElementById(`notes-view-${o}`).style.display = "none";
          });
          btn.classList.add("active");
          if (view) view.style.display = "block";
        });
      });

      // Bind Flashcard actions
      const card = document.getElementById("flashcard-card");
      card?.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });

      updateCardData();

      document.getElementById("prev-card-btn")?.addEventListener("click", () => {
        card.classList.remove("flipped");
        setTimeout(() => {
          activeCardIdx = (activeCardIdx - 1 + MOCK_FLASHCARDS.length) % MOCK_FLASHCARDS.length;
          updateCardData();
        }, 150);
      });

      document.getElementById("next-card-btn")?.addEventListener("click", () => {
        card.classList.remove("flipped");
        setTimeout(() => {
          activeCardIdx = (activeCardIdx + 1) % MOCK_FLASHCARDS.length;
          updateCardData();
        }, 150);
      });

      function updateCardData() {
        const frontText = document.getElementById("card-front-text");
        const backText = document.getElementById("card-back-text");
        const counter = document.getElementById("card-counter-display");
        
        if (frontText && backText && counter) {
          frontText.textContent = MOCK_FLASHCARDS[activeCardIdx].front;
          backText.textContent = MOCK_FLASHCARDS[activeCardIdx].back;
          counter.textContent = `${activeCardIdx + 1} / ${MOCK_FLASHCARDS.length}`;
        }
      }

      // Bind Mindmap Nodes hover/click action
      container.querySelectorAll(".mindmap-node").forEach(node => {
        node.addEventListener("click", () => {
          const title = node.getAttribute("data-title");
          const desc = node.getAttribute("data-desc");
          const dTitle = document.getElementById("node-detail-title");
          const dDesc = document.getElementById("node-detail-desc");

          if (dTitle && dDesc) {
            dTitle.textContent = title;
            dDesc.textContent = desc;
          }
        });
      });

      // Reset notes button
      document.getElementById("reset-notes-btn")?.addEventListener("click", () => {
        isUploaded = false;
        renderNotesView();
      });
    }
  }

  function handleUploadSimulation(fileName) {
    const mainScreen = container.querySelector(".notes-container");
    if (!mainScreen) return;

    // Replace uploader with loading progress screen
    mainScreen.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 40px 20px; margin-top: 50px;">
        <div class="loader-spinner" style="width: 48px; height: 48px; border-width: 4px; margin: 0 auto 16px auto; border-top-color: var(--color-orange);"></div>
        <h3 class="font-cyber" style="color:var(--color-orange); font-size:14px;">AI Extraction in Progress...</h3>
        <p style="font-size:11px; color:var(--text-muted); margin-top:8px;">Analyzing ${fileName}...</p>
        <div style="width: 140px; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; margin: 16px auto 0 auto; overflow:hidden;">
          <div style="height:100%; width: 0%; background: var(--grad-orange); animation: xp-grow 1.8s linear forwards;" id="scan-progress-bar"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      isUploaded = true;
      addXP(30, `Processed notes: ${fileName}`);
      renderNotesView();
    }, 1800);
  }

  renderNotesView();
}
export default render;

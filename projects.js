/*
  EngiMate Project Hub Controller
*/

import { PROJECT_IDEAS } from "../data.js";
import { addXP } from "../state.js";

// AI Simulated Project Ideas database
const GENERATED_AI_PROJECTS = {
  "CSE_Easy": {
    title: "Personal Portfolio and Resume Website",
    tech: "HTML5, CSS3, JavaScript",
    abstract: "A lightweight responsive responsive website for showcasing college achievements, GPA scores, programming projects, and certificates with dual theme support."
  },
  "CSE_Medium": {
    title: "AI-Powered Academic Schedule Planner",
    tech: "React, Node.js, Express, MongoDB",
    abstract: "A smart scheduling application that automatically distributes study hours for exams depending on syllabus modules complexity and student historical grades."
  },
  "CSE_Hard": {
    title: "Decentralized Peer-to-Peer Notes Sharing",
    tech: "Solidity, Ethereum, React, IPFS",
    abstract: "A blockchain platform that allows students to share vetted study guides and receive academic micro-tokens as compensation, ensuring secure document integrity."
  },
  "ECE_Medium": {
    title: "IoT Gesture-Controlled Smart Device",
    tech: "Arduino, MPU6050 Accelerometer, Bluetooth Module",
    abstract: "A hardware device that captures wrist angular velocity and translates it into Bluetooth commands to toggle home lights or system screens remotely."
  }
};

const DOCUMENT_TEMPLATES = {
  abstract: `# Project Abstract Template
  
  ## 1. Title of the Project
  [Insert Project Title Here]
  
  ## 2. Introduction
  Provide a brief description of the technical domain and the primary challenges addressed by this project (approx 100 words).
  
  ## 3. Objective
  Define the primary aim of the system and what improvements it introduces over existing methodologies.
  
  ## 4. Methodology
  Describe the programming stack, hardware modules, and flowchart architecture of the solution.
  
  ## 5. Expected Results
  Outline the test parameters and what metrics will be used to validate effectiveness.`,
  synopsis: `# Project Synopsis Outline
  
  - **Title**: [Project Title]
  - **Team Members**: [Names & IDs]
  - **Advisor**: [Professor Name]
  - **Proposed Architecture**: Block diagram of hardware components or database layout.
  - **Milestones**:
    1. Literature survey (Week 1-2)
    2. Interface modeling (Week 3-5)
    3. Core implementation (Week 6-10)
    4. Testing & documentation (Week 11-12)`
};

export function render(container) {
  let activeTab = "ideas";
  let genBranch = "CSE";
  let genDiff = "Medium";
  let generatedProject = null;
  let activeDocKey = "abstract";

  function buildProjectsUI() {
    container.innerHTML = `
      <div class="projects-container animated-slide-up" style="padding-bottom: 24px;">
        <!-- Hub tabs -->
        <div class="tab-group">
          <button class="tab-btn ${activeTab === 'ideas' ? 'active' : ''}" id="pr-tab-ideas">Catalog</button>
          <button class="tab-btn ${activeTab === 'ai' ? 'active' : ''}" id="pr-tab-ai">AI Generator</button>
          <button class="tab-btn ${activeTab === 'docs' ? 'active' : ''}" id="pr-tab-docs">Templates</button>
        </div>

        <!-- VIEW 1: IDEAS CATALOG -->
        <div class="projects-view" id="pr-view-ideas" style="display: ${activeTab === 'ideas' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">Project Ideas</h3>
          </div>
          
          <h4 style="font-size:11px; margin-bottom:8px; color:var(--text-muted); text-transform:uppercase;">Software Category</h4>
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
            ${PROJECT_IDEAS.software.map(p => `
              <div class="glass-card" style="margin-bottom:0; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h4 style="font-size:12px; font-weight:700;">${p.title}</h4>
                  <span style="font-size:8px; background:rgba(0, 240, 255, 0.1); color:var(--color-electric); padding:2px 6px; border-radius:4px;">${p.difficulty}</span>
                </div>
                <p style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.3;">${p.desc}</p>
              </div>
            `).join('')}
          </div>

          <h4 style="font-size:11px; margin-bottom:8px; color:var(--text-muted); text-transform:uppercase;">Hardware Category</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${PROJECT_IDEAS.hardware.map(p => `
              <div class="glass-card" style="margin-bottom:0; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h4 style="font-size:12px; font-weight:700;">${p.title}</h4>
                  <span style="font-size:8px; background:rgba(176, 0, 255, 0.1); color:var(--color-purple); padding:2px 6px; border-radius:4px;">${p.difficulty}</span>
                </div>
                <p style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.3;">${p.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- VIEW 2: AI GENERATOR -->
        <div class="projects-view" id="pr-view-ai" style="display: ${activeTab === 'ai' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">AI Project Suggester</h3>
          </div>
          
          <div class="glass-card">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;">
              <div class="glass-input-group" style="margin-bottom:0;">
                <label class="glass-input-label" style="font-size:9px;">Branch</label>
                <select id="gen-branch-select" class="glass-input glass-select" style="padding:6px 12px; font-size:11px;">
                  <option value="CSE" ${genBranch === 'CSE' ? 'selected' : ''}>CSE</option>
                  <option value="ECE" ${genBranch === 'ECE' ? 'selected' : ''}>ECE</option>
                </select>
              </div>
              
              <div class="glass-input-group" style="margin-bottom:0;">
                <label class="glass-input-label" style="font-size:9px;">Complexity</label>
                <select id="gen-diff-select" class="glass-input glass-select" style="padding:6px 12px; font-size:11px;">
                  <option value="Easy" ${genDiff === 'Easy' ? 'selected' : ''}>Easy</option>
                  <option value="Medium" ${genDiff === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="Hard" ${genDiff === 'Hard' ? 'selected' : ''}>Hard</option>
                </select>
              </div>
            </div>
            
            <button class="btn btn-primary" id="pr-generate-btn" style="padding:10px; font-size:11px;">
              <i data-lucide="sparkles"></i> Generate AI Project Idea
            </button>
          </div>

          <!-- Gen Output -->
          <div id="ai-project-output-box" class="glass-card" style="margin-top:14px; display: ${generatedProject ? 'block' : 'none'}; border-color:var(--border-glass-glow);">
            ${generatedProject ? `
              <h4 style="font-size:13px; color:var(--color-electric); font-weight:800;">${generatedProject.title}</h4>
              <div style="font-size:9px; color:var(--color-teal); margin-top:2px;">Tech Stack: ${generatedProject.tech}</div>
              <p style="font-size:11px; color:var(--text-muted); margin-top:8px; line-height:1.4;">${generatedProject.abstract}</p>
              <button class="btn btn-secondary" id="save-ai-idea-btn" style="margin-top:10px; font-size:10px; padding:6px 12px; width:120px;">Use Template</button>
            ` : ''}
          </div>
        </div>

        <!-- VIEW 3: TEMPLATES VIEW -->
        <div class="projects-view" id="pr-view-docs" style="display: ${activeTab === 'docs' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">Documentation Outlines</h3>
          </div>
          
          <div class="glass-card" style="padding:12px;">
            <div style="display:flex; gap:8px; margin-bottom:12px;">
              <button class="btn ${activeDocKey === 'abstract' ? 'btn-primary' : 'btn-secondary'}" id="doc-btn-abstract" style="padding:6px 10px; font-size:10px;">Abstract</button>
              <button class="btn ${activeDocKey === 'synopsis' ? 'btn-primary' : 'btn-secondary'}" id="doc-btn-synopsis" style="padding:6px 10px; font-size:10px;">Synopsis</button>
            </div>
            
            <pre class="font-code" style="background-color:rgba(0,0,0,0.3); border:1px solid var(--border-glass); padding:10px; border-radius:var(--border-radius-sm); font-size:10px; color:var(--text-main); white-space:pre-wrap; overflow-x:auto; max-height:220px;">${DOCUMENT_TEMPLATES[activeDocKey]}</pre>
            
            <button class="btn btn-teal" id="copy-template-btn" style="margin-top:10px; font-size:11px; padding:8px;">
              <i data-lucide="copy" style="width:12px; height:12px;"></i> Copy Markdown
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind Hub tabs
    const tabs = ["ideas", "ai", "docs"];
    tabs.forEach(t => {
      document.getElementById(`pr-tab-${t}`)?.addEventListener("click", () => {
        activeTab = t;
        buildProjectsUI();
      });
    });

    if (activeTab === "ai") {
      // Bind Branch & Diff Selects
      document.getElementById("gen-branch-select")?.addEventListener("change", (e) => genBranch = e.target.value);
      document.getElementById("gen-diff-select")?.addEventListener("change", (e) => genDiff = e.target.value);

      // AI Generate action
      const genBtn = document.getElementById("pr-generate-btn");
      genBtn?.addEventListener("click", () => {
        genBtn.disabled = true;
        genBtn.innerHTML = `<div class="loader-spinner" style="width:12px; height:12px; border-width:1.5px; display:inline-block; margin-right:4px;"></div> Simulating AI...`;
        
        setTimeout(() => {
          genBtn.disabled = false;
          genBtn.innerHTML = `<i data-lucide="sparkles"></i> Generate AI Project Idea`;
          if (window.lucide) window.lucide.createIcons({ node: genBtn });

          const key = `${genBranch}_${genDiff}`;
          generatedProject = GENERATED_AI_PROJECTS[key] || {
            title: `Custom IoT ${genBranch} Project`,
            tech: "Embedded Systems, Microcontrollers, Wi-Fi Sensor nodes",
            abstract: `A customized project for ${genBranch} syllabus covering hardware configurations and communication frameworks at ${genDiff} difficulty.`
          };
          
          addXP(20, `Generated project idea: ${generatedProject.title}`);
          buildProjectsUI();
        }, 1200);
      });

      // Save suggestion
      document.getElementById("save-ai-idea-btn")?.addEventListener("click", () => {
        alert(`Successfully imported "${generatedProject.title}" as your primary student project template!`);
        addXP(10, "Selected project template");
      });

    } else if (activeTab === "docs") {
      // Toggle Templates
      document.getElementById("doc-btn-abstract")?.addEventListener("click", () => {
        activeDocKey = "abstract";
        buildProjectsUI();
      });
      document.getElementById("doc-btn-synopsis")?.addEventListener("click", () => {
        activeDocKey = "synopsis";
        buildProjectsUI();
      });

      // Copy markdown
      document.getElementById("copy-template-btn")?.addEventListener("click", () => {
        navigator.clipboard.writeText(DOCUMENT_TEMPLATES[activeDocKey]);
        alert("Markdown template copied to clipboard!");
        addXP(10, "Copied Project Template");
      });
    }
  }

  buildProjectsUI();
}
export default render;

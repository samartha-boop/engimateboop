/*
  EngiMate AI Career Roadmap Generator Controller
*/

import { CAREER_ROADMAPS } from "../data.js";
import { addXP } from "../state.js";

export function render(container) {
  let selectedRoadmapKey = "software";

  function buildRoadmapUI() {
    const roadmap = CAREER_ROADMAPS[selectedRoadmapKey] || CAREER_ROADMAPS["software"];

    container.innerHTML = `
      <div class="roadmaps-container animated-slide-up" style="padding-bottom: 24px;">
        <!-- Selector -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 12px;">
          <div class="glass-input-group" style="margin-bottom:0;">
            <label class="glass-input-label" style="font-size:9px;">Target Career Roadmap</label>
            <select id="roadmap-path-select" class="glass-input glass-select" style="padding: 6px 12px; font-size:11px; font-weight:700;">
              <option value="software" ${selectedRoadmapKey === 'software' ? 'selected' : ''}>Software Engineer Pathway</option>
              <option value="ai" ${selectedRoadmapKey === 'ai' ? 'selected' : ''}>Artificial Intelligence Engineer Pathway</option>
            </select>
          </div>
        </div>

        <!-- Career Path Node Map -->
        <div class="section-header">
          <h3 class="section-title">${roadmap.title} Node Map</h3>
        </div>

        <div class="glass-card" style="padding: 16px 8px;">
          <div class="roadmap-canvas">
            <div class="roadmap-nodes-container" id="roadmap-nodes-box">
              ${roadmap.nodes.map(node => {
                let statusClass = "";
                if (node.status === "completed") statusClass = "completed";
                else if (node.status === "active") statusClass = "active";

                return `
                  <div class="roadmap-node-card ${statusClass}" 
                       data-title="${node.label}" 
                       data-desc="${node.desc}" 
                       data-status="${node.status}">
                    <div style="font-size: 8px; font-weight:800; text-transform:uppercase; margin-bottom: 2px; color: ${node.status === 'completed' ? 'var(--color-teal)' : node.status === 'active' ? 'var(--color-electric)' : 'var(--text-muted)'}">
                      ${node.status.toUpperCase()}
                    </div>
                    <h4>${node.label}</h4>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Selected Node Details Pane -->
          <div id="roadmap-node-details" class="glass-card" style="margin: 12px 8px 0 8px; background: rgba(0,0,0,0.3); border-color: var(--border-glass-glow);">
            <h4 style="font-size: 11px; color: var(--color-electric);" id="path-node-name">Click a Roadmap Node</h4>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;" id="path-node-desc">Select any milestone block above to analyze core subjects, resources, and cert targets.</p>
          </div>
        </div>

        <!-- Skill Gap Analysis Panel -->
        <div class="section-header">
          <h3 class="section-title">Skill Gap Analysis</h3>
        </div>
        <div class="glass-card">
          <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Based on your current profile (Sem 1 / Sem 3 records) and target pathway:</p>
          
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px; padding: 6px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
              <i data-lucide="check-circle-2" style="width: 16px; height: 16px; color: var(--color-green); flex-shrink:0;"></i>
              <div>
                <span style="font-size: 11px; font-weight:700; color:var(--text-main);">Acquired Skill:</span>
                <span style="font-size: 11px; color:var(--text-muted);">Programming Foundations (C/C++)</span>
              </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:10px; padding: 6px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
              <i data-lucide="help-circle" style="width: 16px; height: 16px; color: var(--color-electric); flex-shrink:0;"></i>
              <div>
                <span style="font-size: 11px; font-weight:700; color:var(--text-main);">In-Progress Skill:</span>
                <span style="font-size: 11px; color:var(--text-muted);">Data Structures & Algorithms (Current study focus)</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px; padding: 6px 0;">
              <i data-lucide="alert-circle" style="width: 16px; height: 16px; color: var(--color-orange); flex-shrink:0;"></i>
              <div>
                <span style="font-size: 11px; font-weight:700; color:var(--text-main);">Major Skill Gap:</span>
                <span style="font-size: 11px; color:var(--text-muted);">Web Development & Databases (Suggest enrolling in edX/Coursera tracks)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certification recommendations -->
        <div class="glass-card">
          <div class="glass-card-header">
            <h3 class="glass-card-title"><i data-lucide="shield-check" style="color:var(--color-purple);"></i> Recommended Certifications</h3>
          </div>
          <ul style="margin-left: 16px; font-size:11px; display:flex; flex-direction:column; gap:6px;">
            ${roadmap.certs.map(cert => `
              <li><strong>${cert}</strong> - Industry recognized milestone</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind event: Roadmap Select Change
    document.getElementById("roadmap-path-select")?.addEventListener("change", (e) => {
      selectedRoadmapKey = e.target.value;
      buildRoadmapUI();
    });

    // Bind event: Node Click detail display
    container.querySelectorAll(".roadmap-node-card").forEach(node => {
      node.addEventListener("click", () => {
        const title = node.getAttribute("data-title");
        const desc = node.getAttribute("data-desc");
        const status = node.getAttribute("data-status");

        const nameLabel = document.getElementById("path-node-name");
        const descLabel = document.getElementById("path-node-desc");

        if (nameLabel && descLabel) {
          nameLabel.textContent = title;
          descLabel.innerHTML = `
            <strong>Status:</strong> ${status.toUpperCase()}<br>
            <strong>Objective:</strong> ${desc}<br>
            <span style="display:inline-block; margin-top:6px; color:var(--color-teal); cursor:pointer;">
              Explore recommended study resources &rarr;
            </span>
          `;
          addXP(5, `Analyzed Roadmap Node: ${title}`);
        }
      });
    });
  }

  buildRoadmapUI();
}
export default render;

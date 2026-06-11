/*
  EngiMate Engineering Syllabus Hub Controller
*/

import { SYLLABUS_DATA } from "../data.js";
import { getState, saveState, addXP } from "../state.js";

export function render(container) {
  const state = getState();
  const studentBranch = state.userProfile.branch || "CSE";

  // Temporary local state for selected branch and sem
  let activeBranch = studentBranch;
  let activeSem = state.userProfile.semester || 1;

  function buildSyllabusUI() {
    const branchInfo = SYLLABUS_DATA[activeBranch];
    const semSubjects = branchInfo?.semesters[activeSem] || [];

    container.innerHTML = `
      <div class="syllabus-container animated-slide-up">
        <!-- Branch selection -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="glass-input-group" style="margin-bottom: 0;">
              <label class="glass-input-label" style="font-size: 9px;">Branch</label>
              <select id="syllabus-branch-select" class="glass-input glass-select" style="padding: 6px 12px; font-size: 11px;">
                ${Object.keys(SYLLABUS_DATA).map(b => `
                  <option value="${b}" ${b === activeBranch ? 'selected' : ''}>${SYLLABUS_DATA[b].name}</option>
                `).join('')}
              </select>
            </div>
            
            <div class="glass-input-group" style="margin-bottom: 0;">
              <label class="glass-input-label" style="font-size: 9px;">Semester</label>
              <select id="syllabus-sem-select" class="glass-input glass-select" style="padding: 6px 12px; font-size: 11px;">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => {
                  const hasSem = branchInfo?.semesters[s] !== undefined;
                  return `<option value="${s}" ${s == activeSem ? 'selected' : ''}>Semester ${s} ${hasSem ? '✓' : '(No data)'}</option>`;
                }).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Subjects List Accordion -->
        <div class="section-header">
          <h3 class="section-title">${activeBranch} Sem ${activeSem} Subjects</h3>
        </div>

        ${semSubjects.length === 0 ? `
          <div class="glass-card" style="text-align: center; padding: 24px;">
            <i data-lucide="book" style="width: 44px; height: 44px; color: var(--text-muted); margin-bottom: 8px;"></i>
            <p style="font-size: 12px; color: var(--text-muted);">No syllabus content configured for this semester yet.</p>
          </div>
        ` : `
          <div class="syllabus-list">
            ${semSubjects.map(sub => `
              <div class="subject-accordion" id="accordion-${sub.code}">
                <div class="accordion-header" data-code="${sub.code}">
                  <span>${sub.code} - ${sub.name}</span>
                  <i data-lucide="chevron-down" class="accordion-arrow"></i>
                </div>
                
                <div class="accordion-content" id="content-${sub.code}">
                  <!-- Syllabus Modules -->
                  <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Syllabus Modules</h4>
                  <div style="background-color: rgba(255, 255, 255, 0.02); padding: 10px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass);">
                    ${sub.modules.map(mod => `
                      <div class="syllabus-module-title">${mod.title}</div>
                      <p style="font-size: 11px; line-height: 1.4; color: var(--text-muted); margin-bottom: 10px;">${mod.content}</p>
                    `).join('')}
                  </div>

                  <!-- Reference Books -->
                  <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-top: 14px; margin-bottom: 6px;">Reference Books</h4>
                  <div style="background-color: rgba(255, 255, 255, 0.02); padding: 10px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass);">
                    ${sub.books.map(b => `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                        <div>
                          <div style="font-weight: 700; font-size: 11px;">${b.title}</div>
                          <div style="font-size: 9px; color: var(--text-muted);">${b.author}</div>
                        </div>
                        <span style="font-size: 8px; font-weight: 800; background: rgba(0, 240, 255, 0.1); color: var(--color-electric); padding: 2px 6px; border-radius: 4px;">${b.type}</span>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Quick Revision Notes -->
                  <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-top: 14px; margin-bottom: 6px;">Quick Revision Cards</h4>
                  <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    ${sub.revision.map(rev => `
                      <div class="glass-card" style="margin-bottom: 0; padding: 10px; border-left: 3px solid var(--color-purple);">
                        <div style="font-weight: 700; font-size: 11px; color: var(--color-purple);">${rev.topic}</div>
                        <p style="font-size: 10px; margin-top: 3px; color: var(--text-muted); line-height: 1.3;">${rev.summary}</p>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Question Papers Download Simulation -->
                  <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-top: 14px; margin-bottom: 6px;">Previous Year Question Papers</h4>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary download-paper-btn" data-sub="${sub.name}" data-year="2025" style="padding: 6px 10px; font-size: 10px; flex: 1;">
                      <i data-lucide="download" style="width: 12px; height: 12px; margin-right: 4px;"></i> 2025 Paper
                    </button>
                    <button class="btn btn-secondary download-paper-btn" data-sub="${sub.name}" data-year="2024" style="padding: 6px 10px; font-size: 10px; flex: 1;">
                      <i data-lucide="download" style="width: 12px; height: 12px; margin-right: 4px;"></i> 2024 Paper
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // Re-render Lucide Icons
    if (window.lucide) window.lucide.createIcons();

    // Bind event: Branch Select Change
    document.getElementById("syllabus-branch-select")?.addEventListener("change", (e) => {
      activeBranch = e.target.value;
      const semSelect = document.getElementById("syllabus-sem-select");
      // Pick first available semester for new branch if current sem not available
      const bInfo = SYLLABUS_DATA[activeBranch];
      if (bInfo && !bInfo.semesters[activeSem]) {
        activeSem = Object.keys(bInfo.semesters)[0] || 1;
      }
      buildSyllabusUI();
    });

    // Bind event: Sem Select Change
    document.getElementById("syllabus-sem-select")?.addEventListener("change", (e) => {
      activeSem = parseInt(e.target.value) || 1;
      buildSyllabusUI();
    });

    // Bind event: Accordion Headers click
    container.querySelectorAll(".accordion-header").forEach(header => {
      header.addEventListener("click", () => {
        const code = header.getAttribute("data-code");
        const content = document.getElementById(`content-${code}`);
        const arrow = header.querySelector(".accordion-arrow");
        
        const isOpen = content.classList.contains("open");

        // Close all accordions
        container.querySelectorAll(".accordion-content").forEach(c => c.classList.remove("open"));
        container.querySelectorAll(".accordion-header").forEach(h => h.classList.remove("active"));
        container.querySelectorAll(".accordion-arrow").forEach(a => a.style.transform = "rotate(0deg)");

        if (!isOpen) {
          content.classList.add("open");
          header.classList.add("active");
          if (arrow) arrow.style.transform = "rotate(180deg)";
        }
      });
    });

    // Bind event: Download Question Papers simulator
    container.querySelectorAll(".download-paper-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const subName = btn.getAttribute("data-sub");
        const year = btn.getAttribute("data-year");

        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.innerHTML = `<div class="loader-spinner" style="width: 10px; height: 10px; border-width: 1.5px; display:inline-block; margin-right: 4px;"></div> Downloading...`;

        setTimeout(() => {
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.innerHTML = `<i data-lucide="check" style="width: 12px; height: 12px; margin-right: 4px;"></i> Downloaded`;
          if (window.lucide) window.lucide.createIcons({ node: btn });
          
          alert(`Successfully downloaded PDF for ${subName} - ${year} Exam!`);
          addXP(10, `Downloaded ${year} Exam Paper`);
        }, 1500);
      });
    });
  }

  buildSyllabusUI();
}
export default render;

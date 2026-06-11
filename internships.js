/*
  EngiMate Internship & Hackathon Hub Controller
*/

import { OPPORTUNITIES } from "../data.js";
import { addXP } from "../state.js";

export function render(container) {
  let opportunities = { ...OPPORTUNITIES };

  function buildUI() {
    container.innerHTML = `
      <div class="internships-container animated-slide-up" style="padding-bottom: 24px;">
        <!-- Tab navigation -->
        <div class="tab-group">
          <button class="tab-btn active" id="int-tab-intern">Internships</button>
          <button class="tab-btn" id="int-tab-hack">Hackathons</button>
        </div>

        <!-- VIEW 1: INTERNSHIPS -->
        <div class="internships-view" id="int-view-intern">
          <div class="section-header">
            <h3 class="section-title">Internship Openings</h3>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${opportunities.internships.map((intern, idx) => `
              <div class="glass-card" style="margin-bottom:0; padding:14px; border-left:3px solid var(--color-teal);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div>
                    <h4 style="font-size:13px; font-weight:700;">${intern.title}</h4>
                    <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">${intern.company} • <strong>${intern.type}</strong></p>
                  </div>
                  <button class="btn btn-primary apply-intern-btn" data-idx="${idx}" style="padding:6px 12px; font-size:10px; width:80px;">Apply</button>
                </div>
                
                <div style="display:flex; gap:12px; margin-top:10px; font-size:9px; color:var(--text-muted);">
                  <span><i data-lucide="calendar" style="width:10px; height:10px; vertical-align:middle; margin-right:3px;"></i>${intern.duration}</span>
                  <span><i data-lucide="dollar-sign" style="width:10px; height:10px; vertical-align:middle; margin-right:3px;"></i>${intern.stipend}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- VIEW 2: HACKATHONS -->
        <div class="internships-view" id="int-view-hack" style="display: none;">
          <div class="section-header">
            <h3 class="section-title">Hackathons & events</h3>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${opportunities.hackathons.map((hack, idx) => `
              <div class="glass-card" style="margin-bottom:0; padding:14px; border-left:3px solid var(--color-orange);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div>
                    <h4 style="font-size:13px; font-weight:700;">${hack.title}</h4>
                    <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">Date: ${hack.date} • Prize: <strong>${hack.prize}</strong></p>
                  </div>
                  <button class="btn btn-orange register-hack-btn" data-idx="${idx}" style="padding:6px 12px; font-size:10px; width:90px;">Register</button>
                </div>
                
                <div style="margin-top:10px;">
                  <span style="font-size:8px; font-weight:800; background:rgba(255,159,28,0.1); color:var(--color-orange); padding:2px 6px; border-radius:4px; text-transform:uppercase;">
                    ${hack.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Toggle views
    const tabIntern = document.getElementById("int-tab-intern");
    const tabHack = document.getElementById("int-tab-hack");
    const viewIntern = document.getElementById("int-view-intern");
    const viewHack = document.getElementById("int-view-hack");

    tabIntern?.addEventListener("click", () => {
      tabIntern.classList.add("active");
      tabHack.classList.remove("active");
      viewIntern.style.display = "block";
      viewHack.style.display = "none";
    });

    tabHack?.addEventListener("click", () => {
      tabHack.classList.add("active");
      tabIntern.classList.remove("active");
      viewHack.style.display = "block";
      viewIntern.style.display = "none";
    });

    // Apply simulation
    container.querySelectorAll(".apply-intern-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-idx");
        const intern = opportunities.internships[idx];
        
        btn.disabled = true;
        btn.innerHTML = `<div class="loader-spinner" style="width:10px; height:10px; border-width:1.5px; display:inline-block; margin-right:4px;"></div> Sending...`;
        
        setTimeout(() => {
          btn.innerHTML = `<i data-lucide="check" style="width:12px; height:12px; margin-right:4px;"></i> Applied`;
          if (window.lucide) window.lucide.createIcons({ node: btn });
          addXP(30, `Applied for: ${intern.title} at ${intern.company}`);
          alert(`Application submitted to ${intern.company}! +30 XP`);
        }, 1200);
      });
    });

    // Register simulation
    container.querySelectorAll(".register-hack-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-idx");
        const hack = opportunities.hackathons[idx];
        
        btn.disabled = true;
        btn.innerHTML = `<div class="loader-spinner" style="width:10px; height:10px; border-width:1.5px; display:inline-block; margin-right:4px;"></div> Registering...`;
        
        setTimeout(() => {
          btn.innerHTML = `<i data-lucide="check" style="width:12px; height:12px; margin-right:4px;"></i> Registered`;
          if (window.lucide) window.lucide.createIcons({ node: btn });
          addXP(25, `Registered for: ${hack.title}`);
          alert(`Successfully registered for ${hack.title}! Check calendar details. +25 XP`);
        }, 1200);
      });
    });
  }

  buildUI();
}
export default render;

/*
  EngiMate User Profile & Skills Controller
*/

import { getState, saveState, addXP } from "../state.js";

export function render(container) {
  const state = getState();
  const profile = state.userProfile;
  const stats = state.userStats;

  container.innerHTML = `
    <div class="profile-container animated-slide-up" style="padding-bottom: 24px;">
      <div class="section-header">
        <h3 class="section-title">My Profile</h3>
      </div>

      <!-- Avatar & Streak -->
      <div class="glass-card" style="display:flex; align-items:center; gap:16px;">
        <div class="user-avatar" style="width:64px; height:64px; font-size:24px;">
          ${profile.name ? profile.name.substring(0,2).toUpperCase() : 'JD'}
        </div>
        <div>
          <h3 style="font-size:16px;">${profile.name || "Student"}</h3>
          <p style="font-size:11px; color:var(--text-muted);">${profile.branch} • Semester ${profile.semester}</p>
          <div style="display:flex; align-items:center; gap:6px; margin-top:6px; color:var(--color-orange); font-weight:700; font-size:12px;">
            <i data-lucide="flame" style="width:14px; height:14px;"></i>
            <span>${stats.streak} Day Learning Streak</span>
          </div>
        </div>
      </div>

      <!-- Edit Profile form -->
      <div class="glass-card">
        <div class="glass-card-header">
          <h3 class="glass-card-title"><i data-lucide="user-cog" style="color:var(--color-electric);"></i> Account Settings</h3>
        </div>
        <form id="edit-profile-form" style="display:flex; flex-direction:column; gap:10px;">
          <div class="glass-input-group">
            <label class="glass-input-label">Full Name</label>
            <input type="text" id="edit-name" class="glass-input" value="${profile.name}" required style="padding:8px;">
          </div>
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div class="glass-input-group">
              <label class="glass-input-label">Branch</label>
              <select id="edit-branch" class="glass-input glass-select" style="padding:8px;">
                <option value="CSE" ${profile.branch === 'CSE' ? 'selected' : ''}>CSE</option>
                <option value="ECE" ${profile.branch === 'ECE' ? 'selected' : ''}>ECE</option>
              </select>
            </div>
            
            <div class="glass-input-group">
              <label class="glass-input-label">Semester</label>
              <select id="edit-sem" class="glass-input glass-select" style="padding:8px;">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => `
                  <option value="${s}" ${profile.semester == s ? 'selected' : ''}>Semester ${s}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:10px; padding:8px; font-size:12px;">Save Profile Changes</button>
        </form>
      </div>

      <!-- Skills Tracker -->
      <div class="section-header" style="margin-top:14px;">
        <h3 class="section-title">Technical & Soft Skills</h3>
      </div>
      <div class="glass-card" style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span>Programming (C / Python / JS)</span>
            <span style="font-weight:700;">Level 4 (45%)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:45%; background:var(--grad-electric);"></div>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span>Data Structures & Algorithmic Logic</span>
            <span style="font-weight:700;">Level 6 (60%)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:60%; background:var(--grad-purple);"></div>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span>Core Hardware & Circuit Theory</span>
            <span style="font-weight:700;">Level 2 (20%)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:20%; background:var(--grad-teal);"></div>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span>Communication & Technical Interviewing</span>
            <span style="font-weight:700;">Level 3 (35%)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:35%; background:var(--grad-orange);"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Form submit
  document.getElementById("edit-profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("edit-name").value.trim();
    const branch = document.getElementById("edit-branch").value;
    const sem = parseInt(document.getElementById("edit-sem").value) || 1;

    profile.name = name;
    profile.branch = branch;
    profile.semester = sem;

    saveState();
    addXP(10, "Updated Profile Settings");
    alert("Profile changes successfully saved!");
    render(container);
  });
}
export default render;

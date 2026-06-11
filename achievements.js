/*
  EngiMate Achievements & Badges Controller
*/

import { getState, BADGES } from "../state.js";

export function render(container) {
  const state = getState();
  const unlocked = state.achievements.unlockedBadges;

  container.innerHTML = `
    <div class="achievements-container animated-slide-up" style="padding-bottom: 24px;">
      <div class="section-header">
        <h3 class="section-title">Achievements</h3>
      </div>

      <!-- Stats card -->
      <div class="glass-card" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; text-align:center; padding:16px;">
        <div>
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Badges Unlocked</div>
          <div class="font-cyber" style="font-size:28px; font-weight:900; color:var(--color-purple); margin-top:4px;">
            ${unlocked.length} / ${BADGES.length}
          </div>
        </div>
        <div>
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Global XP Total</div>
          <div class="font-cyber" style="font-size:28px; font-weight:900; color:var(--color-electric); margin-top:4px;">
            ${state.userStats.xp}
          </div>
        </div>
      </div>

      <div class="section-header" style="margin-top:14px;">
        <h3 class="section-title">Academic Milestones</h3>
      </div>

      <!-- Badges Grid -->
      <div class="badges-grid">
        ${BADGES.map(badge => {
          const isUnlocked = unlocked.includes(badge.id);
          
          return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : ''}">
              <div class="badge-icon-container">
                <i data-lucide="${badge.icon}" style="width:20px; height:20px;"></i>
              </div>
              <div class="badge-name">${badge.name}</div>
              <div class="badge-desc">${badge.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
export default render;

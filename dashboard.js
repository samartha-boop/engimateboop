/*
  EngiMate Dashboard (Home Screen) Controller
*/

import { getState, toggleDailyGoal } from "../state.js";

export function render(container) {
  const state = getState();
  const profile = state.userProfile;
  const stats = state.userStats;
  const academic = state.academicData;

  // Calculate overall attendance percentage
  let totalClasses = 0;
  let attendedClasses = 0;
  Object.values(academic.attendance).forEach(subj => {
    totalClasses += subj.total;
    attendedClasses += subj.attended;
  });
  const attendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Mock CGPA
  const cgpaVal = profile.semester > 1 ? "8.72" : "9.00";
  const cgpaPct = parseFloat(cgpaVal) * 10; // Out of 100 for SVG meter

  container.innerHTML = `
    <div class="dashboard-container animated-slide-up">
      <!-- Welcome Message & Buddy status -->
      <div class="dashboard-welcome">
        <div class="welcome-text">
          <h2>Hi, <span class="logo-highlight">${profile.name || "Engineer"}</span>!</h2>
          <p>Let's unlock your engineering goals today.</p>
        </div>
        <div class="buddy-mood-badge" id="dash-mood-badge">
          <i data-lucide="smile"></i>
          <span>Buddy: Happy</span>
        </div>
      </div>

      <!-- Quick Stats & Circular Dials -->
      <div class="progress-widgets">
        <div class="glass-card stat-widget">
          <div class="stat-dial">
            <svg width="50" height="50" viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"/>
              <path class="circle-fill" stroke-dasharray="${attendancePct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-electric)" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <div class="dial-center-val">${attendancePct}%</div>
          </div>
          <div class="stat-info">
            <h4>Attendance</h4>
            <p>${attendedClasses}/${totalClasses} Lcts</p>
          </div>
        </div>

        <div class="glass-card stat-widget">
          <div class="stat-dial">
            <svg width="50" height="50" viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"/>
              <path class="circle-fill" stroke-dasharray="${cgpaPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-teal)" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <div class="dial-center-val" style="font-size: 10px;">${cgpaVal}</div>
          </div>
          <div class="stat-info">
            <h4>CGPA Target</h4>
            <p>8.72 / 10</p>
          </div>
        </div>
      </div>

      <!-- Feature Hubs Grid (9 main hubs quick links) -->
      <div class="section-header">
        <h3 class="section-title">Core Feature Hubs</h3>
      </div>
      <div class="feature-grid">
        <a href="#academic" class="feature-grid-card">
          <div class="feature-card-icon icon-academic"><i data-lucide="layout-dashboard"></i></div>
          <div class="feature-card-title">Academic</div>
        </a>
        <a href="#syllabus" class="feature-grid-card">
          <div class="feature-card-icon icon-syllabus"><i data-lucide="book-marked"></i></div>
          <div class="feature-card-title">Syllabus</div>
        </a>
        <a href="#assistant" class="feature-grid-card">
          <div class="feature-card-icon icon-assistant"><i data-lucide="message-square-code"></i></div>
          <div class="feature-card-title">AI Tutor</div>
        </a>
        <a href="#notes" class="feature-grid-card">
          <div class="feature-card-icon icon-notes"><i data-lucide="pencil-ruler"></i></div>
          <div class="feature-card-title">Smart Notes</div>
        </a>
        <a href="#playground" class="feature-grid-card">
          <div class="feature-card-icon icon-playground"><i data-lucide="terminal"></i></div>
          <div class="feature-card-title">Playground</div>
        </a>
        <a href="#placement" class="feature-grid-card">
          <div class="feature-card-icon icon-placement"><i data-lucide="award"></i></div>
          <div class="feature-card-title">Placements</div>
        </a>
        <a href="#roadmaps" class="feature-grid-card">
          <div class="feature-card-icon icon-roadmaps"><i data-lucide="git-branch"></i></div>
          <div class="feature-card-title">Roadmaps</div>
        </a>
        <a href="#courses" class="feature-grid-card">
          <div class="feature-card-icon icon-courses"><i data-lucide="graduation-cap"></i></div>
          <div class="feature-card-title">Courses</div>
        </a>
        <a href="#projects" class="feature-grid-card">
          <div class="feature-card-icon icon-projects"><i data-lucide="rocket"></i></div>
          <div class="feature-card-title">Projects</div>
        </a>
      </div>

      <!-- Daily Learning Goals Checklist -->
      <div class="glass-card">
        <div class="glass-card-header">
          <h3 class="glass-card-title"><i data-lucide="check-square" style="color: var(--color-electric);"></i> Daily Learning Goals</h3>
          <span style="font-size: 9px; font-weight: 700; color: var(--color-teal); background: rgba(0, 245, 212, 0.1); padding: 2px 6px; border-radius: 8px;">+XP rewards</span>
        </div>
        <div class="checklist-container">
          ${academic.dailyGoals.map(goal => `
            <div class="checklist-item">
              <div class="checklist-checkbox ${goal.completed ? 'checked' : ''}" data-goal-id="${goal.id}">
                ${goal.completed ? '<i data-lucide="check"></i>' : ''}
              </div>
              <span class="checklist-text ${goal.completed ? 'checked' : ''}">${goal.title} (+${goal.xpReward} XP)</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Skill Progress Meter -->
      <div class="glass-card">
        <div class="glass-card-header">
          <h3 class="glass-card-title"><i data-lucide="bar-chart-3" style="color: var(--color-teal);"></i> Skill Development</h3>
        </div>
        <div class="skill-meter-container" style="display: flex; flex-direction: column; gap: 8px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
              <span>Coding & Algorithms</span>
              <span>45%</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow:hidden;">
              <div style="height: 100%; width: 45%; background: var(--grad-electric);"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
              <span>Core Engineering Concepts</span>
              <span>60%</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow:hidden;">
              <div style="height: 100%; width: 60%; background: var(--grad-purple);"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
              <span>Soft Skills & HR Prep</span>
              <span>35%</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow:hidden;">
              <div style="height: 100%; width: 35%; background: var(--grad-orange);"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Motivation Card -->
      <div class="glass-card motivation-card interactive" id="motivation-block">
        <div class="motivation-quote" id="motivation-text">"The human footprint in software is so heavy because computer science is a discipline that we created entirely from scratch."</div>
        <div class="motivation-author" id="motivation-author">Alan Kay</div>
      </div>
    </div>
  `;

  // Bind Events: Checklist Checkbox logic
  const checkboxes = container.querySelectorAll(".checklist-checkbox");
  checkboxes.forEach(box => {
    box.addEventListener("click", () => {
      const goalId = box.getAttribute("data-goal-id");
      toggleDailyGoal(goalId);
      // Re-render dashboard
      render(container);
    });
  });

  // Bind Events: Motivation Card click to rotate quote
  const motivationBlock = document.getElementById("motivation-block");
  const quotes = [
    { text: "Scientists study the world as it is; engineers create the world that has never been.", author: "Theodore von Kármán" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Strive for perfection in everything you do. Take the best that exists and make it better. When it does not exist, design it.", author: "Sir Henry Royce" },
    { text: "Software is a great combination of artistry and engineering.", author: "Bill Gates" }
  ];
  let quoteIdx = 0;
  
  motivationBlock?.addEventListener("click", () => {
    quoteIdx = (quoteIdx + 1) % quotes.length;
    const txt = document.getElementById("motivation-text");
    const aut = document.getElementById("motivation-author");
    if (txt && aut) {
      txt.style.opacity = "0";
      aut.style.opacity = "0";
      setTimeout(() => {
        txt.textContent = `"${quotes[quoteIdx].text}"`;
        aut.textContent = quotes[quoteIdx].author;
        txt.style.opacity = "1";
        aut.style.opacity = "0.8";
      }, 200);
    }
  });
}
export default render;

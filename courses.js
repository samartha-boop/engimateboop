/*
  EngiMate Course Recommendation System Controller
*/

import { RECOMMENDED_COURSES } from "../data.js";
import { addXP } from "../state.js";

export function render(container) {
  // Local state reference
  let courses = [...RECOMMENDED_COURSES];

  function buildCoursesUI() {
    container.innerHTML = `
      <div class="courses-container animated-slide-up" style="padding-bottom: 24px;">
        <div class="section-header">
          <h3 class="section-title">Course Recommendations</h3>
        </div>

        <p style="font-size:11px; color:var(--text-muted); margin-bottom:14px;">Personalized courses based on your branch and roadmaps. Complete lectures to earn XP.</p>

        <div class="courses-list" style="display:flex; flex-direction:column; gap:12px;">
          ${courses.map(course => `
            <div class="glass-card" style="margin-bottom:0; padding:14px; border-left: 3px solid ${course.progress > 0 ? 'var(--color-green)' : 'var(--color-electric)'}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <h4 style="font-size:13px; line-height:1.3;">${course.title}</h4>
                  <span style="font-size:9px; color:var(--text-muted);">${course.provider} • <strong>${course.price}</strong></span>
                </div>
                ${course.progress === 0 ? `
                  <button class="btn btn-primary enroll-btn" data-id="${course.id}" style="padding:6px 12px; font-size:10px; width:70px;">Enroll</button>
                ` : `
                  <span style="font-size:10px; font-weight:700; color:var(--color-green);">Enrolled</span>
                `}
              </div>

              <!-- Skills covered -->
              <div style="display:flex; gap:6px; flex-wrap:wrap; margin:10px 0 6px 0;">
                ${course.skills.map(s => `
                  <span style="font-size:8px; font-weight:800; background:rgba(255,255,255,0.05); color:var(--text-muted); padding:2px 6px; border-radius:4px;">${s}</span>
                `).join('')}
              </div>

              <!-- Progress bar if enrolled -->
              ${course.progress > 0 ? `
                <div style="margin-top:10px;">
                  <div style="display:flex; justify-content:space-between; font-size:9px; margin-bottom:3px;">
                    <span>Course Progress</span>
                    <span>${course.progress}%</span>
                  </div>
                  <div style="height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden; display:flex;">
                    <div style="height:100%; width:${course.progress}%; background:var(--grad-teal);"></div>
                  </div>
                  <button class="btn btn-secondary complete-lec-btn" data-id="${course.id}" style="padding:4px 8px; font-size:9px; margin-top:8px; width:120px;">
                    + Finish Lecture
                  </button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind Enroll buttons
    container.querySelectorAll(".enroll-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const course = courses.find(c => c.id === id);
        if (course) {
          course.progress = 5; // Start progress
          addXP(25, `Enrolled in ${course.title}`);
          buildCoursesUI();
        }
      });
    });

    // Bind Finish Lecture buttons
    container.querySelectorAll(".complete-lec-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const course = courses.find(c => c.id === id);
        if (course) {
          course.progress = Math.min(100, course.progress + 15);
          addXP(15, `Finished lecture in ${course.title}`);
          
          if (course.progress === 100) {
            alert(`Congratulations! You finished the entire course: ${course.title}! 🎉`);
            addXP(100, `Completed Course: ${course.title}`);
          }
          buildCoursesUI();
        }
      });
    });
  }

  buildCoursesUI();
}
export default render;

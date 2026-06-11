/*
  EngiMate Academic Dashboard Controller
*/

import { getState, saveState, updateAttendance, addXP } from "../state.js";

export function render(container) {
  const state = getState();
  const academic = state.academicData;

  container.innerHTML = `
    <div class="academic-container animated-slide-up">
      <!-- Section Selector Tabs -->
      <div class="tab-group">
        <button class="tab-btn active" id="tab-attendance">Attendance</button>
        <button class="tab-btn" id="tab-marks">Marks</button>
        <button class="tab-btn" id="tab-gpa">GPA Cal</button>
        <button class="tab-btn" id="tab-calendar">Calendar</button>
      </div>

      <!-- VIEW 1: ATTENDANCE TRACKER -->
      <div class="academic-view" id="view-attendance">
        <div class="section-header">
          <h3 class="section-title">Attendance Tracker</h3>
          <span class="section-action" id="reset-attendance-btn">Reset</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Minimum 75% attendance is required to qualify for exams.</p>
        
        <div class="attendance-grid">
          ${Object.entries(academic.attendance).map(([code, data]) => {
            const pct = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0;
            let statusClass = "status-safe";
            if (pct < 75) statusClass = "status-critical";
            else if (pct < 80) statusClass = "status-warning";

            return `
              <div class="attendance-card">
                <div class="subject-info">
                  <h4>${code} - Subject Details</h4>
                  <div class="subject-ratio">Attended: ${data.attended} / Total: ${data.total}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div class="attendance-pct-display">
                    <div class="attendance-pct ${statusClass}">${pct}%</div>
                  </div>
                  <div class="attendance-controls">
                    <button class="control-btn att-plus" data-code="${code}" title="Attended Class">+</button>
                    <button class="control-btn att-minus" data-code="${code}" title="Missed Class">-</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- VIEW 2: INTERNAL MARKS TRACKER -->
      <div class="academic-view" id="view-marks" style="display: none;">
        <div class="section-header">
          <h3 class="section-title">Internal Marks</h3>
        </div>
        <div class="glass-card" style="padding: 12px;">
          <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 4px; font-size: 10px; font-weight: 700; color: var(--text-muted); border-bottom: 1px solid var(--border-glass); padding-bottom: 6px; margin-bottom: 8px;">
            <span>Subject</span>
            <span>Test 1</span>
            <span>Test 2</span>
            <span>Total/60</span>
          </div>
          <div class="marks-list">
            ${Object.entries(academic.marks).map(([code, data]) => `
              <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 4px; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600;">${code}</span>
                <input type="number" class="glass-input mark-input" data-code="${code}" data-test="test1" value="${data.test1}" style="padding: 6px 8px; font-size: 11px;">
                <input type="number" class="glass-input mark-input" data-code="${code}" data-test="test2" value="${data.test2}" style="padding: 6px 8px; font-size: 11px;">
                <span class="mark-total font-code" id="total-${code}" style="font-size: 11px; text-align: center; color: var(--color-teal);">${data.test1 + data.test2}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-primary" id="save-marks-btn" style="margin-top: 10px; font-size: 11px; padding: 8px;">Save Marks</button>
        </div>
      </div>

      <!-- VIEW 3: GPA CALCULATOR -->
      <div class="academic-view" id="view-gpa" style="display: none;">
        <div class="section-header">
          <h3 class="section-title">GPA Calculator</h3>
        </div>
        <div class="glass-card">
          <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Add subjects credits and grade score to compute GPA.</p>
          <div class="gpa-rows-container" id="gpa-rows">
            <div class="gpa-row">
              <span class="glass-input-label" style="font-size: 10px;">Subject Name</span>
              <span class="glass-input-label" style="font-size: 10px;">Credits</span>
              <span class="glass-input-label" style="font-size: 10px;">Grade</span>
            </div>
            <div class="gpa-row gpa-item-row">
              <input type="text" class="glass-input" value="Subject 1" style="padding: 8px;">
              <input type="number" class="glass-input gpa-credits" value="4" style="padding: 8px;">
              <select class="glass-input gpa-grade" style="padding: 8px;">
                <option value="10">S (10)</option>
                <option value="9">A (9)</option>
                <option value="8">B (8)</option>
                <option value="7">C (7)</option>
                <option value="6">D (6)</option>
                <option value="0">F (0)</option>
              </select>
            </div>
            <div class="gpa-row gpa-item-row">
              <input type="text" class="glass-input" value="Subject 2" style="padding: 8px;">
              <input type="number" class="glass-input gpa-credits" value="3" style="padding: 8px;">
              <select class="glass-input gpa-grade" style="padding: 8px;">
                <option value="10">S (10)</option>
                <option value="9" selected>A (9)</option>
                <option value="8">B (8)</option>
                <option value="7">C (7)</option>
                <option value="0">F (0)</option>
              </select>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button class="btn btn-secondary" id="add-gpa-row-btn" style="font-size: 11px; padding: 8px;">+ Row</button>
            <button class="btn btn-teal" id="calculate-gpa-btn" style="font-size: 11px; padding: 8px;">Calculate</button>
          </div>

          <div id="gpa-result-box" style="margin-top: 14px; text-align: center; display: none;">
            <h3 style="font-size: 13px; color: var(--text-muted);">Calculated SGPA</h3>
            <div class="font-cyber" id="gpa-output-val" style="font-size: 32px; font-weight: 900; color: var(--color-teal); margin-top: 4px;">8.50</div>
          </div>
        </div>
      </div>

      <!-- VIEW 4: CALENDAR & DEADLINES -->
      <div class="academic-view" id="view-calendar" style="display: none;">
        <div class="section-header">
          <h3 class="section-title">Deadlines Calendar</h3>
        </div>
        
        <!-- Add Deadline Form -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 12px;">
          <h4 style="font-size: 11px; margin-bottom: 8px; text-transform: uppercase;">Add Upcoming Event</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <input type="text" id="event-title" class="glass-input" placeholder="Event Name (e.g. Maths Test)" style="padding: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <select id="event-type" class="glass-input" style="padding: 8px;">
                <option value="exam">Exam / Test</option>
                <option value="assignment">Assignment</option>
              </select>
              <input type="date" id="event-date" class="glass-input" style="padding: 8px;">
            </div>
            <button class="btn btn-primary" id="add-event-btn" style="padding: 8px; font-size: 11px;">Add Event</button>
          </div>
        </div>

        <div class="calendar-list" id="calendar-events-list">
          ${academic.calendar.map(event => `
            <div class="glass-card" style="margin-bottom: 8px; padding: 12px; border-left: 4px solid ${event.type === 'exam' ? 'var(--color-orange)' : 'var(--color-electric)'}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="font-size: 12px;">${event.title}</h4>
                  <span style="font-size: 9px; color: var(--text-muted);">${event.date} • ${event.type.toUpperCase()}</span>
                </div>
                <button class="btn btn-secondary btn-icon-only remove-event-btn" data-id="${event.id}" style="width: 28px; height: 28px;">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // --- TAB TOGGLE CONTROLS ---
  const tabs = ["attendance", "marks", "gpa", "calendar"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const view = document.getElementById(`view-${t}`);
    btn?.addEventListener("click", () => {
      tabs.forEach(otherT => {
        document.getElementById(`tab-${otherT}`).classList.remove("active");
        document.getElementById(`view-${otherT}`).style.display = "none";
      });
      btn.classList.add("active");
      if (view) view.style.display = "block";
    });
  });

  // --- ATTENDANCE BUTTON TRIGGERS ---
  const attCardGrid = container.querySelector(".attendance-grid");
  attCardGrid?.addEventListener("click", (e) => {
    const btnPlus = e.target.closest(".att-plus");
    const btnMinus = e.target.closest(".att-minus");

    if (btnPlus) {
      const code = btnPlus.getAttribute("data-code");
      updateAttendance(code, true);
      render(container);
    } else if (btnMinus) {
      const code = btnMinus.getAttribute("data-code");
      updateAttendance(code, false);
      render(container);
    }
  });

  // Reset Attendance
  document.getElementById("reset-attendance-btn")?.addEventListener("click", () => {
    if (confirm("Reset attendance counts for all subjects?")) {
      Object.keys(academic.attendance).forEach(key => {
        academic.attendance[key] = { attended: 0, total: 0 };
      });
      saveState();
      render(container);
    }
  });

  // --- INTERNAL MARKS CONTROLS ---
  // Save Marks Button
  document.getElementById("save-marks-btn")?.addEventListener("click", () => {
    const inputs = container.querySelectorAll(".mark-input");
    inputs.forEach(input => {
      const code = input.getAttribute("data-code");
      const test = input.getAttribute("data-test");
      const val = parseInt(input.value) || 0;
      
      if (academic.marks[code]) {
        academic.marks[code][test] = Math.min(30, Math.max(0, val));
      }
    });
    
    saveState();
    addXP(15, "Updated Internal Marks");
    alert("Internal marks saved successfully!");
    render(container);
    // Switch to marks tab view
    document.getElementById("tab-marks")?.click();
  });

  // Dynamic totals calc on input
  container.querySelectorAll(".mark-input").forEach(input => {
    input.addEventListener("input", () => {
      const code = input.getAttribute("data-code");
      const test1 = parseInt(container.querySelector(`.mark-input[data-code="${code}"][data-test="test1"]`).value) || 0;
      const test2 = parseInt(container.querySelector(`.mark-input[data-code="${code}"][data-test="test2"]`).value) || 0;
      const totalSpan = document.getElementById(`total-${code}`);
      if (totalSpan) totalSpan.textContent = test1 + test2;
    });
  });

  // --- GPA CALCULATOR CONTROLS ---
  // Add Row
  document.getElementById("add-gpa-row-btn")?.addEventListener("click", () => {
    const rows = document.getElementById("gpa-rows");
    const numRows = rows.querySelectorAll(".gpa-item-row").length + 1;
    const newRow = document.createElement("div");
    newRow.className = "gpa-row gpa-item-row";
    newRow.innerHTML = `
      <input type="text" class="glass-input" value="Subject ${numRows}" style="padding: 8px;">
      <input type="number" class="glass-input gpa-credits" value="3" style="padding: 8px;">
      <select class="glass-input gpa-grade" style="padding: 8px;">
        <option value="10">S (10)</option>
        <option value="9">A (9)</option>
        <option value="8">B (8)</option>
        <option value="7">C (7)</option>
        <option value="6">D (6)</option>
        <option value="0">F (0)</option>
      </select>
    `;
    rows.appendChild(newRow);
  });

  // Calculate GPA
  document.getElementById("calculate-gpa-btn")?.addEventListener("click", () => {
    const rows = container.querySelectorAll(".gpa-item-row");
    let totalCredits = 0;
    let weightedPoints = 0;

    rows.forEach(row => {
      const credit = parseFloat(row.querySelector(".gpa-credits").value) || 0;
      const gradeVal = parseFloat(row.querySelector(".gpa-grade").value) || 0;

      totalCredits += credit;
      weightedPoints += (credit * gradeVal);
    });

    const gpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : "0.00";
    const output = document.getElementById("gpa-output-val");
    const box = document.getElementById("gpa-result-box");

    if (output && box) {
      output.textContent = gpa;
      box.style.display = "block";
      addXP(20, "Computed SGPA Estimate");
    }
  });

  // --- CALENDAR EVENTS CONTROLS ---
  // Add Event
  document.getElementById("add-event-btn")?.addEventListener("click", () => {
    const title = document.getElementById("event-title").value.trim();
    const type = document.getElementById("event-type").value;
    const date = document.getElementById("event-date").value;

    if (!title || !date) {
      alert("Please enter event title and date!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      type,
      date,
      completed: false
    };

    academic.calendar.push(newEvent);
    saveState();
    addXP(10, `Scheduled: ${title}`);
    render(container);
    
    // Switch to calendar view tab
    document.getElementById("tab-calendar")?.click();
  });

  // Remove Event
  container.querySelectorAll(".remove-event-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const idx = academic.calendar.findIndex(e => e.id === id);
      if (idx !== -1) {
        academic.calendar.splice(idx, 1);
        saveState();
        render(container);
        document.getElementById("tab-calendar")?.click();
      }
    });
  });
}
export default render;

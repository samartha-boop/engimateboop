/*
  EngiMate Placement Hub Controller
*/

import { QUIZ_QUESTIONS, HR_QUESTIONS } from "../data.js";
import { addXP, unlockBadge } from "../state.js";

export function render(container) {
  let activeTab = "quiz";
  let activeQuizType = "technical";
  let activeQuestionIdx = 0;
  let quizScore = 0;
  let timerInterval = null;
  let timerPercent = 100;
  
  // Resume state
  let resumeName = "Samartha Boop";
  let resumeEmail = "samartha@engimate.edu";
  let resumeSkills = "JavaScript, Python, C++, Data Structures, Git";
  let resumeProj = "EngiMate App: A futuristic responsive study workspace for students built using HTML, CSS, and ES6 modules.";

  function buildPlacementUI() {
    container.innerHTML = `
      <div class="placement-container animated-slide-up" style="padding-bottom: 24px;">
        <!-- Hub tabs -->
        <div class="tab-group">
          <button class="tab-btn ${activeTab === 'quiz' ? 'active' : ''}" id="p-tab-quiz">MCQ Quiz</button>
          <button class="tab-btn ${activeTab === 'interview' ? 'active' : ''}" id="p-tab-interview">HR Interview</button>
          <button class="tab-btn ${activeTab === 'resume' ? 'active' : ''}" id="p-tab-resume">Resume Build</button>
        </div>

        <!-- VIEW 1: MCQ QUIZ -->
        <div class="placement-view" id="p-view-quiz" style="display: ${activeTab === 'quiz' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">Timed Quiz prep</h3>
            <select id="quiz-type-select" class="glass-input" style="padding: 4px 8px; font-size: 11px; width: 120px;">
              <option value="technical" ${activeQuizType === 'technical' ? 'selected' : ''}>Technical</option>
              <option value="aptitude" ${activeQuizType === 'aptitude' ? 'selected' : ''}>Aptitude</option>
            </select>
          </div>

          <div class="glass-card" id="quiz-card-box">
            <!-- Loading dynamic quiz -->
          </div>
        </div>

        <!-- VIEW 2: HR INTERVIEW SIMULATION -->
        <div class="placement-view" id="p-view-interview" style="display: ${activeTab === 'interview' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">HR Mock Simulator</h3>
          </div>
          
          <div class="glass-card" style="padding:14px; margin-bottom: 12px; border-left: 3px solid var(--color-purple);">
            <h4 style="font-size:11px; color:var(--color-purple);">HR Interview Prompt:</h4>
            <p id="hr-prompt-txt" style="font-size: 13px; font-weight:700; margin-top:4px;">"Tell me about yourself."</p>
          </div>
          
          <div class="glass-input-group">
            <label class="glass-input-label">Type your response below</label>
            <textarea id="hr-response-input" class="glass-input" rows="4" placeholder="Type answer..." style="font-size:12px; resize:none;"></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap: 8px;">
            <button class="btn btn-secondary" id="hr-next-btn">Next Question</button>
            <button class="btn btn-primary" id="hr-eval-btn">Evaluate Answer</button>
          </div>

          <div id="hr-evaluation-box" class="glass-card" style="margin-top: 14px; background: rgba(0,0,0,0.3); display: none;">
            <h4 style="font-size:11px; color:var(--color-teal);"><i data-lucide="sparkles"></i> AI Critique Feed</h4>
            <p id="hr-critique-txt" style="font-size:11px; color:var(--text-muted); margin-top:6px; line-height:1.4;">Feedback loading...</p>
          </div>
        </div>

        <!-- VIEW 3: RESUME BUILDER -->
        <div class="placement-view" id="p-view-resume" style="display: ${activeTab === 'resume' ? 'block' : 'none'};">
          <div class="section-header">
            <h3 class="section-title">Interactive CV Builder</h3>
          </div>
          <div class="glass-card">
            <div class="glass-input-group">
              <label class="glass-input-label">Full Name</label>
              <input type="text" id="cv-name-in" class="glass-input" value="${resumeName}" style="padding:8px;">
            </div>
            <div class="glass-input-group">
              <label class="glass-input-label">Contact Email</label>
              <input type="email" id="cv-email-in" class="glass-input" value="${resumeEmail}" style="padding:8px;">
            </div>
            <div class="glass-input-group">
              <label class="glass-input-label">Technical Skills</label>
              <input type="text" id="cv-skills-in" class="glass-input" value="${resumeSkills}" style="padding:8px;">
            </div>
            <div class="glass-input-group">
              <label class="glass-input-label">Core Project Details</label>
              <textarea id="cv-proj-in" class="glass-input" rows="2" style="padding:8px; font-size:11px; resize:none;">${resumeProj}</textarea>
            </div>
            
            <button class="btn btn-primary" id="cv-print-btn" style="padding: 10px; font-size:11px;">
              <i data-lucide="printer"></i> Print / Save Resume
            </button>
          </div>

          <div class="section-header" style="margin-top:14px;">
            <h3 class="section-title">Live Resume Sheet Preview</h3>
          </div>
          <div class="resume-preview-pane">
            <h2 id="preview-cv-name">Samartha Boop</h2>
            <div style="font-size:9px; color:#64748b; margin-top:2px;" id="preview-cv-email">samartha@engimate.edu</div>
            
            <div class="resume-preview-section" style="margin-top:12px;">
              <div class="resume-preview-section-title">Technical Skills</div>
              <p id="preview-cv-skills">JavaScript, Python, C++, Data Structures, Git</p>
            </div>
            
            <div class="resume-preview-section">
              <div class="resume-preview-section-title">Projects</div>
              <p id="preview-cv-proj">EngiMate App: A futuristic responsive study workspace for students built using HTML, CSS, and ES6 modules.</p>
            </div>

            <div class="resume-preview-section">
              <div class="resume-preview-section-title">Education</div>
              <p>Bachelor of Engineering (B.E.) • Semester 3 • CGPA: 8.72</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind Hub Tab Toggles
    const tabsList = ["quiz", "interview", "resume"];
    tabsList.forEach(t => {
      document.getElementById(`p-tab-${t}`)?.addEventListener("click", () => {
        clearInterval(timerInterval);
        activeTab = t;
        buildPlacementUI();
      });
    });

    if (activeTab === "quiz") {
      renderQuizQuestion();
      document.getElementById("quiz-type-select")?.addEventListener("change", (e) => {
        activeQuizType = e.target.value;
        activeQuestionIdx = 0;
        quizScore = 0;
        renderQuizQuestion();
      });
    } else if (activeTab === "interview") {
      initInterviewLogic();
    } else if (activeTab === "resume") {
      initResumeLogic();
    }
  }

  // --- MCQ TIMED QUIZ CONTROLLER ---
  function renderQuizQuestion() {
    const box = document.getElementById("quiz-card-box");
    if (!box) return;

    const questionsList = QUIZ_QUESTIONS[activeQuizType];
    
    if (activeQuestionIdx >= questionsList.length) {
      clearInterval(timerInterval);
      box.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
          <i data-lucide="check-circle" style="width: 48px; height: 48px; color: var(--color-green); margin-bottom: 8px;"></i>
          <h3 class="font-cyber">Quiz Completed</h3>
          <p style="font-size: 14px; margin-top: 6px;">Your Score: <strong>${quizScore} / ${questionsList.length}</strong></p>
          <button class="btn btn-primary" id="restart-quiz-btn" style="margin-top: 14px; font-size:11px; padding: 8px 12px;">Try Again</button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ node: box });
      
      // Award XP based on score
      if (quizScore > 0) {
        addXP(quizScore * 20, `Completed ${activeQuizType} Quiz`);
      }
      if (quizScore === questionsList.length) {
        unlockBadge("quiz_ace");
      }

      document.getElementById("restart-quiz-btn")?.addEventListener("click", () => {
        activeQuestionIdx = 0;
        quizScore = 0;
        renderQuizQuestion();
      });
      return;
    }

    const question = questionsList[activeQuestionIdx];
    box.innerHTML = `
      <div class="quiz-question-box">
        <div class="quiz-timer-bar">
          <div class="quiz-timer-fill" id="timer-bar-fill" style="width: 100%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 6px;">
          <span>QUESTION ${activeQuestionIdx + 1} OF ${questionsList.length}</span>
          <span id="timer-sec-txt">30s remaining</span>
        </div>
        <div class="quiz-question-text">${question.q}</div>
        <div class="quiz-options-list">
          ${question.options.map((opt, idx) => `
            <button class="quiz-option-btn" data-idx="${idx}">${opt}</button>
          `).join('')}
        </div>
      </div>
      <div id="quiz-explanation-box" class="glass-card" style="margin-top:14px; padding: 10px; background: rgba(0,0,0,0.3); display: none;">
        <h4 style="font-size: 11px; color: var(--color-orange);">Explanation</h4>
        <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">${question.explanation}</p>
        <button class="btn btn-primary" id="quiz-next-question-btn" style="margin-top: 10px; font-size: 10px; padding: 6px 12px; width: 100px;">Next &rarr;</button>
      </div>
    `;

    // Start Timer
    clearInterval(timerInterval);
    timerPercent = 100;
    let secondsLeft = 30;
    const timerBar = document.getElementById("timer-bar-fill");
    const timerText = document.getElementById("timer-sec-txt");

    timerInterval = setInterval(() => {
      secondsLeft -= 1;
      timerPercent = (secondsLeft / 30) * 100;
      
      if (timerBar) timerBar.style.width = `${timerPercent}%`;
      if (timerText) timerText.textContent = `${secondsLeft}s remaining`;

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        // Timeout action: show answer automatically
        revealQuizAnswer(-1);
      }
    }, 1000);

    // Bind option click
    const optionBtns = box.querySelectorAll(".quiz-option-btn");
    optionBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedIdx = parseInt(btn.getAttribute("data-idx"));
        clearInterval(timerInterval);
        revealQuizAnswer(selectedIdx);
      });
    });

    function revealQuizAnswer(selectedIdx) {
      const explainBox = document.getElementById("quiz-explanation-box");
      const nextBtn = document.getElementById("quiz-next-question-btn");
      
      optionBtns.forEach(btn => {
        btn.disabled = true; // Disable further clicks
        const idx = parseInt(btn.getAttribute("data-idx"));
        if (idx === question.correct) {
          btn.classList.add("correct");
        } else if (idx === selectedIdx) {
          btn.classList.add("incorrect");
        }
      });

      if (selectedIdx === question.correct) {
        quizScore += 1;
      }

      if (explainBox) explainBox.style.display = "block";
      
      nextBtn?.addEventListener("click", () => {
        activeQuestionIdx += 1;
        renderQuizQuestion();
      });
    }
  }

  // --- HR INTERVIEW CONTROLLER ---
  function initInterviewLogic() {
    let questionIdx = 0;
    const promptTxt = document.getElementById("hr-prompt-txt");
    const input = document.getElementById("hr-response-input");
    const evalBox = document.getElementById("hr-evaluation-box");
    const critiqueTxt = document.getElementById("hr-critique-txt");
    const evalBtn = document.getElementById("hr-eval-btn");
    const nextBtn = document.getElementById("hr-next-btn");

    if (window.lucide) window.lucide.createIcons({ node: evalBox });

    promptTxt.textContent = `"${HR_QUESTIONS[questionIdx]}"`;

    evalBtn?.addEventListener("click", () => {
      const ans = input.value.trim();
      if (!ans) {
        alert("Please type a response first!");
        return;
      }

      evalBtn.disabled = true;
      evalBtn.textContent = "Analyzing...";

      setTimeout(() => {
        evalBtn.disabled = false;
        evalBtn.textContent = "Evaluate Answer";
        
        let feedback = "";
        if (ans.length < 30) {
          feedback = "Your response is brief. For HR interviews, try to provide a structured explanation (e.g. using the STAR method: Situation, Task, Action, Result) lasting 1-2 minutes.";
        } else if (ans.toLowerCase().includes("project") || ans.toLowerCase().includes("team") || ans.toLowerCase().includes("code")) {
          feedback = "Excellent! You referenced technical project details. To elevate this response, ensure you mention the exact metrics of success (e.g., 'reduced runtime by 15%', or 'led a team of 4 to secure A grade').";
        } else {
          feedback = "Good response style. Make sure you align your strengths directly to the company requirements and provide concrete examples from college projects or clubs.";
        }

        if (critiqueTxt && evalBox) {
          critiqueTxt.innerHTML = feedback;
          evalBox.style.display = "block";
          addXP(20, "Completed Mock Interview Question");
        }
      }, 1200);
    });

    nextBtn?.addEventListener("click", () => {
      questionIdx = (questionIdx + 1) % HR_QUESTIONS.length;
      promptTxt.textContent = `"${HR_QUESTIONS[questionIdx]}"`;
      input.value = "";
      if (evalBox) evalBox.style.display = "none";
    });
  }

  // --- RESUME BUILDER CONTROLLER ---
  function initResumeLogic() {
    const inName = document.getElementById("cv-name-in");
    const inEmail = document.getElementById("cv-email-in");
    const inSkills = document.getElementById("cv-skills-in");
    const inProj = document.getElementById("cv-proj-in");

    const preName = document.getElementById("preview-cv-name");
    const preEmail = document.getElementById("preview-cv-email");
    const preSkills = document.getElementById("preview-cv-skills");
    const preProj = document.getElementById("preview-cv-proj");
    const printBtn = document.getElementById("cv-print-btn");

    const updatePreview = () => {
      resumeName = inName.value;
      resumeEmail = inEmail.value;
      resumeSkills = inSkills.value;
      resumeProj = inProj.value;

      if (preName) preName.textContent = resumeName || "Your Name";
      if (preEmail) preEmail.textContent = resumeEmail || "email@address.com";
      if (preSkills) preSkills.textContent = resumeSkills || "Skills here...";
      if (preProj) preProj.textContent = resumeProj || "Project details here...";
    };

    inName?.addEventListener("input", updatePreview);
    inEmail?.addEventListener("input", updatePreview);
    inSkills?.addEventListener("input", updatePreview);
    inProj?.addEventListener("input", updatePreview);

    printBtn?.addEventListener("click", () => {
      addXP(50, "Generated Professional CV Document");
      alert("Opening Print Dialog. (For best results, toggle background graphics on and save as PDF!)");
      window.print();
    });
  }

  buildPlacementUI();
}
export default render;

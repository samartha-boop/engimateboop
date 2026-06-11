/*
  EngiMate Auth Screen Controller
*/

import { signupStudent } from "../state.js";

export function render(container) {
  container.innerHTML = `
    <div class="auth-container animated-slide-up">
      <div class="auth-logo-section">
        <h1 class="auth-title font-cyber"><span class="logo-highlight">Engi</span>Mate</h1>
        <p class="auth-subtitle">The Ultimate Engineering Student Companion</p>
      </div>

      <div class="glass-card auth-card">
        <!-- Google Sign-In -->
        <button id="google-login-btn" class="google-signin-btn">
          <img src="https://lh3.googleusercontent.com/COxitPIgDG5s3rq5569O1QCn9XZYqEC1-zZ707qyTOJqfA5cUX51tyA6GgJOF81SFg" alt="Google Logo" onerror="this.src='https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'; this.style.width='50px';">
          <span>Sign in with Google</span>
        </button>

        <div class="divider">OR REGISTER WITH PROFILE</div>

        <!-- Signup Form -->
        <form id="signup-form">
          <div class="glass-input-group">
            <label class="glass-input-label" for="student-name">Full Name</label>
            <input type="text" id="student-name" class="glass-input" placeholder="e.g. Samartha" required>
          </div>

          <div class="glass-input-group">
            <label class="glass-input-label" for="student-branch">Engineering Branch</label>
            <select id="student-branch" class="glass-input glass-select" required>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
            </select>
          </div>

          <div class="glass-input-group">
            <label class="glass-input-label" for="student-sem">Current Semester</label>
            <select id="student-sem" class="glass-input glass-select" required>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 14px;">
            <span>Get Started</span>
            <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
          </button>
        </form>
      </div>
    </div>
  `;

  // Bind Events
  const form = document.getElementById("signup-form");
  const googleBtn = document.getElementById("google-login-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("student-name").value.trim();
    const branch = document.getElementById("student-branch").value;
    const sem = document.getElementById("student-sem").value;

    if (name) {
      signupStudent(name, branch, sem);
      window.location.hash = "#dashboard";
    }
  });

  googleBtn.addEventListener("click", () => {
    // Simulate Google Authentication flow
    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.7";
    googleBtn.innerHTML = `
      <div class="loader-spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>
      <span>Signing in...</span>
    `;

    setTimeout(() => {
      // Create user and log them in
      signupStudent("Samartha Boop", "CSE", "3");
      window.location.hash = "#dashboard";
    }, 1200);
  });
}
export default render;

/*
  EngiMate Sidebar Drawer Logic
*/

import { getState, logoutStudent } from "../state.js";

export function initSidebar() {
  const menuBtn = document.getElementById("menu-btn");
  const drawer = document.getElementById("sidebar-drawer");
  const overlay = document.getElementById("sidebar-overlay");
  const logoutBtn = document.getElementById("logout-btn");
  const sidebarLinks = drawer?.querySelectorAll(".sidebar-link");

  if (!menuBtn || !drawer || !overlay) return;

  // Toggle Drawer
  menuBtn.addEventListener("click", () => {
    updateSidebarProfile();
    drawer.classList.add("open");
  });

  overlay.addEventListener("click", () => {
    drawer.classList.remove("open");
  });

  // Close drawer on link click
  sidebarLinks?.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("open");
    });
  });

  // Logout action
  logoutBtn?.addEventListener("click", () => {
    logoutStudent();
    drawer.classList.remove("open");
    window.location.hash = "#auth";
  });

  // Listen to state changes to keep sidebar updated
  window.addEventListener("engimateStateChanged", () => {
    updateSidebarProfile();
  });

  updateSidebarProfile();
}

export function updateSidebarProfile() {
  const state = getState();
  
  const avatar = document.getElementById("sidebar-avatar");
  const levelBadge = document.getElementById("sidebar-level");
  const nameLabel = document.getElementById("sidebar-name");
  const branchSemLabel = document.getElementById("sidebar-branch-sem");
  const xpText = document.getElementById("sidebar-xp-text");
  const xpFill = document.getElementById("sidebar-xp-fill");
  const streakText = document.getElementById("sidebar-streak-text");

  if (!state.userStats.loggedIn) return;

  // Set avatar text to initials
  if (avatar && state.userProfile.name) {
    const initials = state.userProfile.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    avatar.textContent = initials || "U";
  }

  // Populate data
  if (nameLabel) nameLabel.textContent = state.userProfile.name || "Student";
  if (branchSemLabel) {
    branchSemLabel.textContent = `${state.userProfile.branch} • Semester ${state.userProfile.semester}`;
  }
  if (levelBadge) levelBadge.textContent = `Lvl ${state.userStats.level}`;
  
  // XP Progress Calculation
  if (xpText && xpFill) {
    const currentLevel = state.userStats.level;
    const currentXP = state.userStats.xp;
    
    // Simple level formula: Level L = Math.floor(XP / 200) + 1
    // The base XP for level L is (L - 1) * 200
    // The target XP to clear level L is L * 200
    const baseXP = (currentLevel - 1) * 200;
    const targetXP = currentLevel * 200;
    const levelProgressXP = currentXP - baseXP;
    const levelRequiredXP = targetXP - baseXP;
    
    xpText.textContent = `${levelProgressXP} / ${levelRequiredXP} XP`;
    const progressPct = Math.min(100, Math.max(0, (levelProgressXP / levelRequiredXP) * 100));
    xpFill.style.width = `${progressPct}%`;
  }

  // Streak update
  if (streakText) {
    streakText.textContent = `${state.userStats.streak} Day Streak`;
  }
}

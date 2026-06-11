/*
  EngiMate Main Orchestrator & Router
*/

import { loadState, getState } from "./state.js";
import { initSidebar } from "./components/sidebar.js";
import { initBuddy, speakPageContext } from "./components/buddy.js";

// Global navigation highlights update
function updateNavigationHighlights(pageId) {
  // Update bottom navigation bar
  const bottomNavItems = document.querySelectorAll(".bottom-nav .nav-item");
  bottomNavItems.forEach(item => {
    if (item.getAttribute("data-page") === pageId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update sidebar links
  const sidebarLinks = document.querySelectorAll(".sidebar-nav .sidebar-link");
  sidebarLinks.forEach(link => {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Router Logic
async function router() {
  const state = getState();
  let hash = window.location.hash.substring(1) || "dashboard";
  
  // Auth Check
  if (!state.userStats.loggedIn && hash !== "auth") {
    window.location.hash = "#auth";
    return;
  }
  
  if (state.userStats.loggedIn && hash === "auth") {
    window.location.hash = "#dashboard";
    return;
  }

  // Set navigation highlights
  updateNavigationHighlights(hash);

  const viewContainer = document.getElementById("app-view");
  if (!viewContainer) return;

  // Show page loading spinner
  viewContainer.innerHTML = `
    <div class="screen-loading">
      <div class="loader-spinner"></div>
      <p>Loading Hub...</p>
    </div>
  `;

  // Dynamic Page Renderer loading
  try {
    const modulePath = `./pages/${hash}.js`;
    const pageModule = await import(modulePath);
    
    // Clear viewport and render page content
    viewContainer.innerHTML = "";
    
    // Each page exports a default function or a 'render' function
    if (pageModule.render) {
      pageModule.render(viewContainer);
    } else if (pageModule.default) {
      pageModule.default(viewContainer);
    } else {
      throw new Error("Page module does not export render function");
    }

    // Bind theme highlights and speak context
    speakPageContext(hash);

    // Re-trigger Lucide Icons rendering on new page elements
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Smooth scroll page to top
    const screenContainer = document.getElementById("screen-container");
    if (screenContainer) screenContainer.scrollTop = 0;

  } catch (error) {
    console.error("Routing Error:", error);
    viewContainer.innerHTML = `
      <div class="glass-card" style="margin: 20px; text-align: center;">
        <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--color-red); margin-bottom: 12px;"></i>
        <h3 class="font-cyber" style="color: var(--color-red);">Screen Error</h3>
        <p style="font-size: 12px; margin-top: 8px; color: var(--text-muted);">
          Could not load the page <strong>"${hash}"</strong>. Keep coding!
        </p>
        <button class="btn btn-primary" style="margin-top: 14px; font-size: 11px;" onclick="window.location.hash='#dashboard'">Back to Home</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Running Digital Clock for Status Bar
function runClock() {
  const clockElement = document.getElementById("status-clock");
  if (!clockElement) return;

  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Format pad
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    
    clockElement.textContent = `${hours}:${minutes}`;
  };

  updateTime();
  setInterval(updateTime, 60000);
}

// Theme Toggle Listener
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
  });
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load local state
  loadState();

  // Initialize general UI
  runClock();
  initThemeToggle();
  initSidebar();
  initBuddy();

  // Router Listeners
  window.addEventListener("hashchange", router);
  
  // Initial Routing
  router();
});

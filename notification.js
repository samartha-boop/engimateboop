/*
  EngiMate Toast Notification Engine
*/

export function showXPToast(amount, reason) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-card xp";
  toast.innerHTML = `
    <div class="toast-icon xp">
      <i data-lucide="zap"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">+${amount} XP Gained!</div>
      <div class="toast-message">${reason}</div>
    </div>
  `;

  container.appendChild(toast);
  
  // Render Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons({ node: toast });
  }

  // Remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showBadgeToast(badgeId, message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-card badge-unlock";
  
  let iconName = "award";
  if (badgeId === "level_up") iconName = "trending-up";
  else if (badgeId === "streak_3") iconName = "flame";
  else if (badgeId === "first_code") iconName = "code-2";
  else if (badgeId === "perfect_attendance") iconName = "check-check";

  toast.innerHTML = `
    <div class="toast-icon badge-unlock">
      <i data-lucide="${iconName}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">Achievement!</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  
  // Render Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons({ node: toast });
  }

  // Play a minor sound or shake effect if needed (simulated via animation)
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/*
  EngiMate Global State & Progress Manager
*/

const STATE_KEY = "engimate_state";

const DEFAULT_STATE = {
  userProfile: {
    name: "",
    branch: "CSE",
    semester: 1,
    avatarColor: "#00f0ff"
  },
  userStats: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    loggedIn: false
  },
  academicData: {
    attendance: {
      CS101: { attended: 15, total: 20 },
      MA101: { attended: 12, total: 16 }
    },
    marks: {
      CS101: { test1: 18, test2: 22, max: 30 },
      MA101: { test1: 15, test2: 19, max: 30 }
    },
    calendar: [
      { id: 1, type: "exam", title: "DSA Mid-term Exam", date: "2026-06-18", completed: false },
      { id: 2, type: "assignment", title: "C Pointers Assignment", date: "2026-06-15", completed: false }
    ],
    dailyGoals: [
      { id: "g1", title: "Solve a coding challenge", completed: false, xpReward: 25 },
      { id: "g2", title: "Read 1 module of Syllabus", completed: false, xpReward: 15 },
      { id: "g3", title: "Chat with AI Study Buddy", completed: false, xpReward: 10 }
    ]
  },
  achievements: {
    unlockedBadges: [] // List of badge IDs
  },
  playgroundCode: {
    javascript: "",
    python: "",
    cpp: "",
    java: ""
  }
};

let appState = { ...DEFAULT_STATE };

// Badge Definitions
export const BADGES = [
  { id: "first_login", name: "Welcome Companion", desc: "Signed up for EngiMate", icon: "user-check" },
  { id: "streak_3", name: "Consistent Scholar", desc: "Maintained a 3-day streak", icon: "flame" },
  { id: "first_code", name: "Syntax Master", desc: "Compiled code in Playground", icon: "code" },
  { id: "perfect_attendance", name: "Attendance King", desc: "Maintained attendance > 85%", icon: "calendar" },
  { id: "quiz_ace", name: "Technical Ace", desc: "Scored 100% on a placement quiz", icon: "zap" },
  { id: "ai_chat", name: "Mentor Link", desc: "Consulted the AI Study Buddy", icon: "message-square" }
];

// Load state from LocalStorage
export function loadState() {
  const stored = localStorage.getItem(STATE_KEY);
  if (stored) {
    try {
      appState = JSON.parse(stored);
      // Clean structure for safety
      appState.academicData = appState.academicData || DEFAULT_STATE.academicData;
      appState.userStats = appState.userStats || DEFAULT_STATE.userStats;
      appState.userProfile = appState.userProfile || DEFAULT_STATE.userProfile;
      appState.achievements = appState.achievements || DEFAULT_STATE.achievements;
      appState.playgroundCode = appState.playgroundCode || DEFAULT_STATE.playgroundCode;
    } catch (e) {
      appState = { ...DEFAULT_STATE };
    }
  } else {
    appState = { ...DEFAULT_STATE };
  }
  return appState;
}

// Save state to LocalStorage
export function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  // Dispatch custom event to notify components of changes
  window.dispatchEvent(new CustomEvent("engimateStateChanged", { detail: appState }));
}

export function getState() {
  return appState;
}

// Update profile info during signup
export function signupStudent(name, branch, semester) {
  appState.userProfile.name = name;
  appState.userProfile.branch = branch;
  appState.userProfile.semester = parseInt(semester);
  appState.userStats.loggedIn = true;
  
  // Set branch specific default data
  if (branch === "ECE") {
    appState.academicData.attendance = {
      EC101: { attended: 10, total: 12 }
    };
    appState.academicData.marks = {
      EC101: { test1: 16, test2: 20, max: 30 }
    };
  } else {
    appState.academicData.attendance = {
      CS101: { attended: 15, total: 20 },
      MA101: { attended: 12, total: 16 }
    };
    appState.academicData.marks = {
      CS101: { test1: 18, test2: 22, max: 30 },
      MA101: { test1: 15, test2: 19, max: 30 }
    };
  }

  // Award signup badge
  unlockBadge("first_login");
  addXP(50, "EngiMate Account Creation");
  
  // Initialize streak
  checkStreak();
  
  saveState();
}

// Logout
export function logoutStudent() {
  localStorage.removeItem(STATE_KEY);
  appState = JSON.parse(JSON.stringify(DEFAULT_STATE)); // deep copy clone
  saveState();
}

// Add XP points and handle levels
export function addXP(amount, reason = "Study Task") {
  appState.userStats.xp += amount;
  
  // Levels: level 1 is 0-99 XP, level 2 is 100-299 XP, level 3 is 300-599 XP, level N = 100 * N * (N-1) / 2
  // Simple formula: XP needed for Level L = 100 * (L - 1)
  // Let's use simple scaling: Level up at each 200 XP
  const newLevel = Math.floor(appState.userStats.xp / 200) + 1;
  let leveledUp = false;
  
  if (newLevel > appState.userStats.level) {
    appState.userStats.level = newLevel;
    leveledUp = true;
  }
  
  saveState();

  // Create notifications
  import("./components/notification.js").then((module) => {
    module.showXPToast(amount, reason);
    if (leveledUp) {
      module.showBadgeToast("level_up", `Level Up! You reached Level ${newLevel}! 🎉`);
    }
  });

  return { leveledUp, level: appState.userStats.level };
}

// Check logins to maintain streak
export function checkStreak() {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = appState.userStats.lastActiveDate;
  
  if (!lastDate) {
    appState.userStats.streak = 1;
    appState.userStats.lastActiveDate = today;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (lastDate === yesterdayStr) {
      appState.userStats.streak += 1;
      appState.userStats.lastActiveDate = today;
      
      if (appState.userStats.streak >= 3) {
        unlockBadge("streak_3");
      }
    } else if (lastDate !== today) {
      // Streak broken
      appState.userStats.streak = 1;
      appState.userStats.lastActiveDate = today;
    }
  }
  saveState();
}

// Unlock milestones
export function unlockBadge(badgeId) {
  if (!appState.achievements.unlockedBadges.includes(badgeId)) {
    appState.achievements.unlockedBadges.push(badgeId);
    saveState();
    
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      import("./components/notification.js").then((module) => {
        module.showBadgeToast(badge.id, `Unlocked Badge: ${badge.name}! 🏆`);
      });
      addXP(100, `Badge Unlocked: ${badge.name}`);
    }
  }
}

// Attendance trackers
export function updateAttendance(subjectCode, isAdd) {
  const subj = appState.academicData.attendance[subjectCode];
  if (subj) {
    if (isAdd) {
      subj.attended += 1;
      subj.total += 1;
    } else {
      subj.total += 1;
    }
    
    // Check for high attendance badge
    const percent = (subj.attended / subj.total) * 100;
    if (percent >= 86 && subj.total >= 10) {
      unlockBadge("perfect_attendance");
    }
    
    saveState();
  }
}

// Daily Goals Toggle
export function toggleDailyGoal(goalId) {
  const goal = appState.academicData.dailyGoals.find(g => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    if (goal.completed) {
      addXP(goal.xpReward, `Completed: ${goal.title}`);
    } else {
      // Remove XP
      appState.userStats.xp = Math.max(0, appState.userStats.xp - goal.xpReward);
    }
    saveState();
  }
}

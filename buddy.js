/*
  EngiMate AI Study Buddy Controller
*/

import { getState, addXP, unlockBadge } from "../state.js";

const BUDDY_DIALOGUES = [
  "Hey! Ready to crush some engineering challenges today? 🚀",
  "Remember: coding is 10% writing code and 90% figuring out why it doesn't work! 💻",
  "Don't let your attendance slip below 75%! Keep an eye on the Academic Dashboard.",
  "Need help with a complex formula? Drag a PDF into the Notes Hub or type it in AI Chat!",
  "Take a deep breath. Even the longest compilation starts with a single line of code. 🧘‍♂️",
  "Hey, your daily streak is looking hot! Let's complete a learning goal to earn extra XP.",
  "Calculus getting you down? Ask me to 'Explain Fourier Transform' in the AI Tutor hub!",
  "Hydrate check! 💧 Grab a glass of water before you dive into that next debugging session."
];

let bubbleTimeout = null;

export function initBuddy() {
  const avatar = document.getElementById("study-buddy-avatar");
  const bubble = document.getElementById("buddy-bubble");
  const chatBtn = document.getElementById("buddy-bubble-chat");
  const dismissBtn = document.getElementById("buddy-bubble-dismiss");
  
  if (!avatar || !bubble) return;

  // Click Avatar to trigger random dialogue
  avatar.addEventListener("click", () => {
    setBuddyMood("happy");
    triggerRandomDialogue();
    addXP(5, "Chatting with Study Buddy");
    unlockBadge("ai_chat");
  });

  // Action Buttons
  dismissBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideBubble();
  });

  chatBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideBubble();
    // Redirect to AI Tutor
    window.location.hash = "#assistant";
  });

  // Automatically speak shortly after start
  setTimeout(() => {
    showBubble("Welcome to EngiMate! Tap me anytime for study tips, deadline reminders, or a quick laugh! ⚡", 6000);
  }, 2000);
}

export function showBubble(text, duration = 5000) {
  const bubble = document.getElementById("buddy-bubble");
  const textContainer = bubble?.querySelector(".bubble-text");
  
  if (!bubble || !textContainer) return;

  textContainer.textContent = text;
  bubble.classList.add("visible");

  if (bubbleTimeout) clearTimeout(bubbleTimeout);
  
  if (duration > 0) {
    bubbleTimeout = setTimeout(() => {
      hideBubble();
    }, duration);
  }
}

export function hideBubble() {
  const bubble = document.getElementById("buddy-bubble");
  if (bubble) {
    bubble.classList.remove("visible");
  }
  setBuddyMood("neutral");
}

export function setBuddyMood(mood) {
  const avatar = document.getElementById("study-buddy-avatar");
  if (!avatar) return;

  avatar.classList.remove("happy", "thinking", "neutral");
  avatar.classList.add(mood);
}

export function triggerRandomDialogue() {
  const randomIndex = Math.floor(Math.random() * BUDDY_DIALOGUES.length);
  showBubble(BUDDY_DIALOGUES[randomIndex], 6000);
}

// Speak contextually based on which page you are on
export function speakPageContext(pageId) {
  setBuddyMood("thinking");
  setTimeout(() => {
    let text = "";
    switch(pageId) {
      case "dashboard":
        text = "Welcome home! Here's your academic outline. Let's finish today's checklist!";
        setBuddyMood("happy");
        break;
      case "syllabus":
        text = "Syllabus Hub! Select your branch to browse books, modules, and download previous papers.";
        break;
      case "assistant":
        text = "AI Study Assistant! Ask me any doubt or try clicking one of the quick suggestions below.";
        setBuddyMood("happy");
        break;
      case "playground":
        text = "Welcome to the code editor. Write JavaScript or load boilerplate templates. Let's compile!";
        break;
      case "notes":
        text = "Drop a file here to generate quick revision summaries, flippable flashcards, and mind maps!";
        break;
      case "placement":
        text = "Ready for placements? Test your speed on timed Aptitude MCQs or try a mock HR interview!";
        break;
      case "roadmaps":
        text = "AI Roadmaps! Click on any node to view required certifications and analysis of your skill gaps.";
        break;
      default:
        text = "Let's learn something new and level up today! 📚";
        setBuddyMood("neutral");
    }
    showBubble(text, 6000);
  }, 800);
}

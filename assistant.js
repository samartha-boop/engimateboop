/*
  EngiMate AI Study Assistant Chatbot Controller
*/

import { getState, addXP, unlockBadge } from "../state.js";

// AI Simulated Knowledge Base
const KNOWLEDGE_RESPONSES = {
  "big_o": {
    text: "Big O notation is used in Computer Science to describe the performance or complexity of an algorithm, representing the worst-case scenario. Here is a quick reference table of common time complexities:",
    extra: `
      <div class="chat-bubble-formula">
        O(1) - Constant Time (e.g. Array indexing)<br>
        O(log n) - Logarithmic Time (e.g. Binary Search)<br>
        O(n) - Linear Time (e.g. Simple Loop search)<br>
        O(n log n) - Linearithmic Time (e.g. Merge Sort)<br>
        O(n²) - Quadratic Time (e.g. Bubble Sort)
      </div>
      <p style="margin-top: 6px;"><strong>Tip:</strong> Always aim to optimize nested loops to avoid O(n²) bottlenecks in production code.</p>
    `
  },
  "eigenvalues": {
    text: "To find the eigenvalues of matrix A = [[2, 1], [1, 2]], we solve the characteristic equation det(A - λI) = 0:",
    extra: `
      <div class="chat-bubble-formula">
        | 2-λ   1  |<br>
        |  1   2-λ | = 0<br><br>
        (2-λ)(2-λ) - (1)(1) = 0<br>
        4 - 4λ + λ² - 1 = 0<br>
        λ² - 4λ + 3 = 0<br>
        (λ - 3)(λ - 1) = 0
      </div>
      <p style="margin-top: 6px;">Solving this gives eigenvalues: <strong>λ = 1</strong> and <strong>λ = 3</strong>.</p>
    `
  },
  "euler": {
    text: "Euler's Identity is considered one of the most beautiful equations in mathematics. It connects five fundamental mathematical constants:",
    extra: `
      <div class="chat-bubble-formula">
        e^(i * π) + 1 = 0
      </div>
      <p style="margin-top: 6px;">Where:<br>
      • <strong>e</strong> is the base of natural logarithms.<br>
      • <strong>i</strong> is the imaginary unit (√-1).<br>
      • <strong>π</strong> is the ratio of circle circumference to diameter.<br>
      • <strong>1</strong> and <strong>0</strong> are basic arithmetic values.</p>
    `
  },
  "strategy": {
    text: "Here is your personalized Exam Prep Strategy for CS101 (Programming in C):",
    extra: `
      <p style="margin-top: 6px; font-size:11px;">
      1. <strong>Day 1-2: Pointers & Memory</strong>: Clear up syntax. Practice 'int *p = &a;' and understanding memory address mappings.<br>
      2. <strong>Day 3: Recursion vs Iteration</strong>: Trace stack executions on paper for factorial or fibonacci problems.<br>
      3. <strong>Day 4: Previous Papers</strong>: Download the 2025 question paper from the Syllabus Hub and solve it under a 2-hour timer.<br>
      4. <strong>Day 5: Mock Coding</strong>: Run 2 array-reversal challenges in our Code Playground.
      </p>
    `
  },
  "default": {
    text: "That is an excellent engineering inquiry! To help you best, you can ask me to solve a numerical problem, explain a programming module, outline exam strategies, or debug compilation logs.",
    extra: ""
  }
};

export function render(container) {
  container.innerHTML = `
    <div class="chat-container animated-slide-up">
      <!-- Chat Messages Scroll Pane -->
      <div class="chat-messages" id="chat-box">
        <div class="chat-bubble assistant">
          Hello! I'm your AI Academic Mentor. You can ask me to explain engineering concepts, walk through numerical equations, explain formulas, or recommend exam prep strategies.
        </div>
      </div>

      <!-- Quick Suggestion Prompts -->
      <div class="chat-suggestions">
        <div class="chat-suggestion-chip" data-key="big_o">Big O Complexity</div>
        <div class="chat-suggestion-chip" data-key="eigenvalues">Solve: Eigenvalues</div>
        <div class="chat-suggestion-chip" data-key="euler">Explain: Euler Formula</div>
        <div class="chat-suggestion-chip" data-key="strategy">CS101 Prep Plan</div>
      </div>

      <!-- Input Bar -->
      <div class="chat-input-bar">
        <input type="text" id="chat-input" class="glass-input" placeholder="Ask a doubt..." style="padding: 10px 14px; font-size:12px;">
        <button id="chat-send-btn" class="btn btn-primary btn-icon-only" style="width: 42px; height: 42px;">
          <i data-lucide="send" style="width: 18px; height: 18px;"></i>
        </button>
      </div>
    </div>
  `;

  // Bind Events
  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");

  if (window.lucide) window.lucide.createIcons();

  function appendMessage(text, isUser = false, extraHtml = "") {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isUser ? 'user' : 'assistant'}`;
    bubble.innerHTML = text + extraHtml;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function simulateTypingResponse(key) {
    // Show typing dots indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-bubble assistant typing-indicator";
    typingIndicator.innerHTML = `
      <span style="display:inline-block; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%; margin:0 2px; animation:buddy-float 1s infinite;"></span>
      <span style="display:inline-block; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%; margin:0 2px; animation:buddy-float 1s infinite 0.2s;"></span>
      <span style="display:inline-block; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%; margin:0 2px; animation:buddy-float 1s infinite 0.4s;"></span>
    `;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    const data = KNOWLEDGE_RESPONSES[key] || KNOWLEDGE_RESPONSES["default"];

    setTimeout(() => {
      // Remove typing indicator
      typingIndicator.remove();
      appendMessage(data.text, false, data.extra);
      addXP(15, "Consulted AI Doubt Solver");
      unlockBadge("ai_chat");
    }, 1500);
  }

  function handleSend() {
    const query = input.value.trim();
    if (!query) return;

    appendMessage(query, true);
    input.value = "";

    // Parse keywords for intelligence
    let key = "default";
    const qLower = query.toLowerCase();
    
    if (qLower.includes("big o") || qLower.includes("complexity") || qLower.includes("algorithm")) {
      key = "big_o";
    } else if (qLower.includes("eigenvalue") || qLower.includes("matrix") || qLower.includes("eigen")) {
      key = "eigenvalues";
    } else if (qLower.includes("euler") || qLower.includes("identity")) {
      key = "euler";
    } else if (qLower.includes("prep") || qLower.includes("strategy") || qLower.includes("exam")) {
      key = "strategy";
    }

    simulateTypingResponse(key);
  }

  sendBtn?.addEventListener("click", handleSend);
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  // Chip buttons click
  container.querySelectorAll(".chat-suggestion-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const key = chip.getAttribute("data-key");
      const text = chip.textContent;
      appendMessage(text, true);
      simulateTypingResponse(key);
    });
  });
}
export default render;

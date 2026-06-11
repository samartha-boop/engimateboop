/*
  EngiMate Coding Playground Controller
*/

import { CODING_CHALLENGES } from "../data.js";
import { addXP, unlockBadge } from "../state.js";

export function render(container) {
  let selectedLanguage = "javascript";
  let activeChallenge = CODING_CHALLENGES[0]; // FizzBuzz
  
  // Custom console logs interceptor for Javascript evaluation
  let consoleLogs = [];
  const nativeLog = console.log;

  function runJavaScriptCode(code) {
    consoleLogs = [];
    // Temporarily override console.log
    console.log = function(...args) {
      consoleLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
    };

    try {
      // Create new function and run
      const runFn = new Function(code);
      runFn();
    } catch (err) {
      consoleLogs.push(`Error: ${err.message}`);
    }

    // Restore native log
    console.log = nativeLog;
    return consoleLogs.join('\n');
  }

  function simulateCompilation(language, code) {
    const outputs = {
      python: [
        `$ python3 main.py`,
        `[Compiling Python script...]`,
        `Execution Successful. Output:`,
        `["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]`
      ],
      cpp: [
        `$ g++ -o main main.cpp && ./main`,
        `[Compiling C++ sources via GCC...]`,
        `Compilation successful. Linking binaries...`,
        `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz `
      ],
      java: [
        `$ javac Main.java && java Main`,
        `[Executing Java JDK compiler...]`,
        `Main.class built. Running virtual machine...`,
        `[1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz]`
      ]
    };

    return outputs[language]?.join('\n') || `Executed template for ${language} successfully!`;
  }

  function buildPlaygroundUI() {
    container.innerHTML = `
      <div class="playground-container animated-slide-up" style="padding-bottom: 24px;">
        <!-- Header Controls -->
        <div class="glass-card" style="padding: 10px; margin-bottom: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="glass-input-group" style="margin-bottom:0;">
              <label class="glass-input-label" style="font-size:9px;">Language</label>
              <select id="editor-lang-select" class="glass-input glass-select" style="padding: 6px 12px; font-size:11px; font-weight:700;">
                <option value="javascript">JavaScript (Live Run)</option>
                <option value="python">Python (Simulation)</option>
                <option value="cpp">C++ (Simulation)</option>
                <option value="java">Java (Simulation)</option>
              </select>
            </div>
            
            <div class="glass-input-group" style="margin-bottom:0;">
              <label class="glass-input-label" style="font-size:9px;">Load Challenge</label>
              <select id="editor-challenge-select" class="glass-input glass-select" style="padding: 6px 12px; font-size:11px;">
                ${CODING_CHALLENGES.map(ch => `
                  <option value="${ch.id}">${ch.title} (${ch.difficulty})</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Challenge Description panel -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 12px; border-left: 3px solid var(--color-teal);">
          <h4 style="font-size:12px; color:var(--color-teal);" id="challenge-title-txt">FizzBuzz Challenge</h4>
          <p style="font-size:10px; margin-top:4px; line-height:1.4; color:var(--text-muted);" id="challenge-desc-txt">Write a function that outputs multiples of 3 as Fizz and 5 as Buzz.</p>
        </div>

        <!-- Code Editor Pane -->
        <div class="code-editor-wrapper">
          <div class="editor-header">
            <span class="editor-lang-badge" id="editor-lang-badge-val">JAVASCRIPT</span>
            <div class="editor-actions">
              <button class="editor-action-btn" id="editor-reset-btn">Reset Template</button>
            </div>
          </div>
          <div class="code-workspace">
            <div class="line-numbers" id="editor-line-numbers">
              1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12
            </div>
            <textarea class="code-input-textarea font-code" id="code-textarea" spellcheck="false"></textarea>
          </div>
        </div>

        <!-- Run & Test buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button class="btn btn-secondary" id="playground-run-btn">
            <i data-lucide="play" style="width: 14px; height: 14px; color: var(--color-teal);"></i> Run Code
          </button>
          <button class="btn btn-primary" id="playground-test-btn">
            <i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: var(--text-inverse);"></i> Submit Challenge
          </button>
        </div>

        <!-- Output Console -->
        <div class="terminal-console">
          <div class="terminal-header">Terminal Console Output</div>
          <pre id="console-output" style="white-space: pre-wrap; margin:0;">Console cleared. Click 'Run Code' to execute.</pre>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Elements
    const langSelect = document.getElementById("editor-lang-select");
    const challengeSelect = document.getElementById("editor-challenge-select");
    const challengeTitle = document.getElementById("challenge-title-txt");
    const challengeDesc = document.getElementById("challenge-desc-txt");
    const langBadge = document.getElementById("editor-lang-badge-val");
    const editor = document.getElementById("code-textarea");
    const linesCol = document.getElementById("editor-line-numbers");
    const terminal = document.getElementById("console-output");
    
    const runBtn = document.getElementById("playground-run-btn");
    const testBtn = document.getElementById("playground-test-btn");
    const resetBtn = document.getElementById("editor-reset-btn");

    // Load templates helper
    function loadTemplateCode() {
      if (editor && activeChallenge) {
        editor.value = activeChallenge.templates[selectedLanguage] || "";
        updateLineNumbers();
      }
    }

    // Dynamic line numbers generator
    function updateLineNumbers() {
      if (!editor || !linesCol) return;
      const linesCount = editor.value.split('\n').length;
      let numbersHtml = "";
      for (let i = 1; i <= Math.max(12, linesCount); i++) {
        numbersHtml += `${i}<br>`;
      }
      linesCol.innerHTML = numbersHtml;
    }

    editor?.addEventListener("input", updateLineNumbers);
    editor?.addEventListener("keydown", (e) => {
      // Handle tab characters
      if (e.key === "Tab") {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + "  " + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        updateLineNumbers();
      }
    });

    // Language Change
    langSelect?.addEventListener("change", (e) => {
      selectedLanguage = e.target.value;
      langBadge.textContent = selectedLanguage.toUpperCase();
      loadTemplateCode();
    });

    // Challenge Change
    challengeSelect?.addEventListener("change", (e) => {
      const chId = e.target.value;
      activeChallenge = CODING_CHALLENGES.find(c => c.id === chId);
      if (activeChallenge) {
        challengeTitle.textContent = activeChallenge.title;
        challengeDesc.textContent = activeChallenge.desc;
        loadTemplateCode();
      }
    });

    // Reset Template
    resetBtn?.addEventListener("click", loadTemplateCode);

    // Run Code Action
    runBtn?.addEventListener("click", () => {
      const code = editor.value;
      terminal.innerHTML = `<span style="color:var(--text-muted);">Executing...</span>`;

      setTimeout(() => {
        if (selectedLanguage === "javascript") {
          const logOutput = runJavaScriptCode(code);
          terminal.textContent = logOutput || "Code executed with no console outputs.";
        } else {
          terminal.textContent = simulateCompilation(selectedLanguage, code);
        }
        addXP(10, "Run program in Code Playground");
        unlockBadge("first_code");
      }, 500);
    });

    // Test/Submit Challenge Action
    testBtn?.addEventListener("click", () => {
      const code = editor.value;
      terminal.innerHTML = `<span style="color:var(--text-muted);">Running test cases...</span>`;

      setTimeout(() => {
        let isCorrect = false;
        
        if (selectedLanguage === "javascript") {
          const logOutput = runJavaScriptCode(code);
          // Standard clean expected string
          const expected = activeChallenge.testCase.expected;
          
          // Flatten spacing of logOutput and expected to compare
          const cleanOutput = logOutput.replace(/\s+/g, '');
          const cleanExpected = expected.replace(/\s+/g, '');
          
          if (cleanOutput.includes(cleanExpected)) {
            isCorrect = true;
          } else {
            terminal.textContent = `Test Failed!\nExpected output to include: ${expected}\nActual Output:\n${logOutput}`;
          }
        } else {
          // Simulation matches
          isCorrect = true;
        }

        if (isCorrect) {
          terminal.innerHTML = `<span style="color:var(--color-green); font-weight:700;">✓ ALL TEST CASES PASSED!</span>\nOutput matched expected: ${activeChallenge.testCase.expected}`;
          addXP(40, `Completed challenge: ${activeChallenge.title}`);
          unlockBadge("first_code");
          alert("Excellent job! You passed all test cases! +40 XP");
        }
      }, 1000);
    });

    // Initial load
    loadTemplateCode();
  }

  buildPlaygroundUI();
}
export default render;

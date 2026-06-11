/*
  EngiMate Community Forums Controller
*/

import { addXP } from "../state.js";

const DEFAULT_POSTS = [
  { id: 1, title: "How do I reverse a binary search tree recursively?", tag: "cse", author: "Alex Mercer", likes: 12, comments: 4 },
  { id: 2, title: "Is attendance below 75% strictly penalized this semester?", tag: "doubt", author: "Sarah Connor", likes: 8, comments: 15 },
  { id: 3, title: "Best YouTube channels or books to study signals and systems?", tag: "general", author: "Bruce Wayne", likes: 15, comments: 6 }
];

export function render(container) {
  let forumPosts = [...DEFAULT_POSTS];

  function buildCommunityUI() {
    container.innerHTML = `
      <div class="community-container animated-slide-up" style="padding-bottom: 24px;">
        <div class="section-header">
          <h3 class="section-title">Discussion Forums</h3>
        </div>

        <!-- Add Thread Form -->
        <div class="glass-card" style="padding:12px; margin-bottom:12px;">
          <h4 style="font-size:11px; margin-bottom:8px; text-transform:uppercase;">Start a Discussion</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <input type="text" id="forum-input-title" class="glass-input" placeholder="Title of your question..." style="padding:8px; font-size:12px;">
            <div style="display:grid; grid-template-columns: 1fr 100px; gap:8px;">
              <select id="forum-input-tag" class="glass-input" style="padding:8px; font-size:12px;">
                <option value="general">General</option>
                <option value="cse">CSE</option>
                <option value="doubt">Doubt</option>
              </select>
              <button class="btn btn-primary" id="forum-submit-btn" style="padding:8px; font-size:11px;">Post</button>
            </div>
          </div>
        </div>

        <!-- Threads List -->
        <div class="glass-card" style="padding: 14px 16px;">
          <div class="threads-list" style="display:flex; flex-direction:column;">
            ${forumPosts.map(post => `
              <div class="forum-thread-card">
                <div class="thread-header">
                  <span class="thread-tag ${post.tag}">${post.tag}</span>
                  <span class="thread-author">by ${post.author}</span>
                </div>
                <h4 class="thread-title" data-id="${post.id}">${post.title}</h4>
                <div class="thread-stats">
                  <div class="thread-stat-item forum-like-btn" data-id="${post.id}" style="cursor:pointer;">
                    <i data-lucide="thumbs-up"></i>
                    <span>${post.likes} Likes</span>
                  </div>
                  <div class="thread-stat-item" style="cursor:pointer;" onclick="alert('Comment interface coming soon!')">
                    <i data-lucide="message-square"></i>
                    <span>${post.comments} Comments</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind Like actions
    container.querySelectorAll(".forum-like-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const post = forumPosts.find(p => p.id === id);
        if (post) {
          post.likes += 1;
          addXP(2, "Upvoted classmate discussion");
          buildCommunityUI();
        }
      });
    });

    // Bind Create Post
    document.getElementById("forum-submit-btn")?.addEventListener("click", () => {
      const title = document.getElementById("forum-input-title").value.trim();
      const tag = document.getElementById("forum-input-tag").value;

      if (!title) {
        alert("Please enter a discussion title!");
        return;
      }

      const newPost = {
        id: Date.now(),
        title,
        tag,
        author: "Me",
        likes: 0,
        comments: 0
      };

      forumPosts.unshift(newPost);
      addXP(15, "Started discussion thread");
      buildCommunityUI();
    });
  }

  buildCommunityUI();
}
export default render;

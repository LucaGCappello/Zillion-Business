/* =========================================================
   ZILLION BUSINESS — Chat assistente Nexus
   chat.js
   ========================================================= */
(function () {
  "use strict";
  const root = document.getElementById("nexusChat");
  if (!root) return;

  const fab = document.getElementById("nexusFab");
  const fabLabel = document.getElementById("nexusFabLabel");
  const panel = document.getElementById("nexusPanel");
  const closeBtn = document.getElementById("nexusClose");
  const body = document.getElementById("nexusBody");
  const quick = document.getElementById("nexusQuick");
  const input = document.getElementById("nexusInput");
  const sendBtn = document.getElementById("nexusSend");
  const titleEl = document.getElementById("nexusTitle");
  const subEl = document.getElementById("nexusSub");

  let opened = false;
  const C = () => ZB.I18N[ZB.lang].chat;

  /* ---------- History persistence ---------- */
  const STORAGE_KEY = 'zb_chat_history';
  const TTL = 24 * 60 * 60 * 1000;
  const MAX_MSGS = 50;

  function saveToHistory(role, text, cta) {
    let msgs = loadHistory();
    msgs.push({ role, text, cta: cta || null, ts: Date.now() });
    if (msgs.length > MAX_MSGS) msgs = msgs.slice(-MAX_MSGS);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch (_) {}
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const msgs = JSON.parse(raw);
      if (!Array.isArray(msgs) || !msgs.length) return [];
      if (Date.now() - msgs[msgs.length - 1].ts > TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      return msgs;
    } catch (_) { return []; }
  }

  function restoreHistory(msgs) {
    msgs.forEach(m => {
      if (m.role === 'user') addUser(m.text, true);
      else addBot(m.text, m.cta || undefined, true);
    });
  }

  /* ---------- UI labels ---------- */
  function syncLabels() {
    const c = C();
    if (fabLabel) fabLabel.textContent = c.fab;
    if (titleEl) titleEl.textContent = c.title;
    if (subEl) subEl.textContent = c.subtitle;
    if (input) input.placeholder = c.placeholder;
    buildQuick();
  }
  function buildQuick() {
    quick.innerHTML = "";
    C().quick.forEach(q => {
      const b = document.createElement("button");
      b.className = "nexus-chip";
      b.textContent = q;
      b.addEventListener("click", () => handleUser(q));
      quick.appendChild(b);
    });
  }

  /* ---------- Messages ---------- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function botAvatar() {
    return '<span class="nx-av"><svg viewBox="0 0 100 100" fill="none" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">' +
           '<path d="M83 27 L57 66" stroke="#9aa0b4"/><path d="M20 73 L48 27 L76 73" stroke="#fff"/></svg></span>';
  }

  function addUser(text, _restore = false) {
    const m = document.createElement("div");
    m.className = "nx-msg user";
    m.innerHTML = '<div class="nx-bubble">' + escapeHtml(text) + "</div>";
    body.appendChild(m);
    scrollDown();
    if (!_restore) saveToHistory('user', text);
  }

  function addBot(text, cta, _restore = false) {
    const m = document.createElement("div");
    m.className = "nx-msg bot";
    let inner = botAvatar() + '<div class="nx-bubble">' + escapeHtml(text);
    if (cta) {
      inner += '<a class="nx-cta" href="' + cta.href + '"' + (cta.href.charAt(0) === "#" ? ' data-anchor="1"' : "") + ">" +
               escapeHtml(cta.label) +
               ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
    }
    inner += "</div>";
    m.innerHTML = inner;
    body.appendChild(m);
    // anchor links inside chat: close + smooth scroll
    const link = m.querySelector(".nx-cta[data-anchor]");
    if (link) link.addEventListener("click", () => closePanel());
    scrollDown();
    if (!_restore) saveToHistory('bot', text, cta);
  }

  function typing() {
    const m = document.createElement("div");
    m.className = "nx-msg bot typing";
    m.innerHTML = botAvatar() + '<div class="nx-bubble"><span class="nx-dots"><i></i><i></i><i></i></span></div>';
    body.appendChild(m);
    scrollDown();
    return m;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- n8n webhook ---------- */
  const N8N_WEBHOOK = "https://n8nsinclair.scompany.com.pt/webhook/assistente-sdr";

  async function handleUser(text) {
    text = text.trim();
    if (!text) return;
    addUser(text);
    input.value = "";
    const t = typing();

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang: ZB.lang })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      t.remove();
      const d = Array.isArray(data) ? data[0] : data;
      if (!d) throw new Error("empty response");
      const botReply = d.output || d.response || d.messages || d.message || d.text || d.answer;
      if (!botReply) throw new Error("no reply field");
      addBot(String(botReply));
    } catch (_) {
      t.remove();
      addBot(C().fallback);
    }
  }

  /* ---------- Open / close ---------- */
  function openPanel() {
    panel.classList.add("open");
    fab.classList.add("hidden");
    if (!opened) {
      opened = true;
      const history = loadHistory();
      if (history.length) {
        restoreHistory(history);
      } else {
        const t = typing();
        setTimeout(() => { t.remove(); addBot(C().greeting); }, 600);
      }
    }
    setTimeout(() => input && input.focus(), 300);
  }
  function closePanel() {
    panel.classList.remove("open");
    fab.classList.remove("hidden");
  }

  /* ---------- Wire ---------- */
  fab.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", () => handleUser(input.value));
  input.addEventListener("keydown", e => { if (e.key === "Enter") handleUser(input.value); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("open")) closePanel(); });

  window.addEventListener("zb:langchange", syncLabels);
  document.addEventListener("DOMContentLoaded", syncLabels);
  syncLabels();
})();

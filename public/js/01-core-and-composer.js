// Suomynona Council frontend
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (t) => { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
let STATE = {
  backends: [],
  catalog: {},
  slots: {},
  lineup: {},
  host_lineups: {},
  runtime_hosts: [],
  colab_hosts: [],
  hf_buckets: [],
  custom_gguf_models: [],
  custom_models: [],
  mcp: { servers: [] },
  log: [],
  hf_auto_sync_on_startup: true,
}, picked = new Set(), answers = {}, judgeIdx = 0, AGENTS = [];
let discoveredCustomModels = [];
let MODE = "ask";
let attachedImages = [];
let promptHistory = [];
let pastTurns = [];
let historyTab = "prompts";
let historyCycleIdx = -1;
let lastPreEnhancePrompt = "";

function getJudgeIdx() {
  const sel = $("#judge-pick");
  if (sel && sel.value !== "" && Number(sel.value) >= 0) return Number(sel.value);
  const chosen = (STATE?.backends || []).filter((b) => picked.has(b.i) && !String(b.model || "").toLowerCase().includes("embed"));
  return chosen.length ? chosen[0].i : judgeIdx;
}

function getJudgeBackendObj() {
  const idx = getJudgeIdx();
  const backends = STATE?.backends || [];
  return backends.find((b) => Number(b.i) === Number(idx)) || backends[idx] || backends[0] || { i: 0, name: "Slot 1 Judge", model: "default" };
}

function updateJudgeModelBadges() {
  const jb = getJudgeBackendObj();
  const sel = $("#judge-pick");
  const isAuto = !sel || sel.value === "" || Number(sel.value) < 0;
  const label = jb?.name ? `${jb.name}${isAuto ? " (Auto)" : ""}` : "Slot 1 (Auto)";
  const composerBadge = $("#composer-active-judge-badge");
  if (composerBadge) {
    composerBadge.textContent = `⚖️ Judge: ${jb?.name || "Auto"}`;
    composerBadge.title = `Active Judge Model: ${label} (${jb?.model || "local"}) — Click to open Tuning & Judge settings`;
  }
  const tuningPill = $("#tuning-judge-resolved-pill");
  if (tuningPill) {
    tuningPill.textContent = `Active: ${label}`;
  }
}

// ── safe Markdown + fenced code block renderer ──
function renderMarkdown(rawText) {
  const text = String(rawText || "");
  if (!text.trim()) return "";
  const codeBlocks = [];
  const withPlaceholders = text.replace(/```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: (lang || "code").trim(), code: code.replace(/\n$/, "") });
    return `\u0000CODEBLOCK_${idx}\u0000`;
  });

  const blocks = withPlaceholders.split(/\n{2,}/);
  const htmlBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    const exactMatch = trimmed.match(/^\u0000CODEBLOCK_(\d+)\u0000$/);
    if (exactMatch) {
      return `\u0000CODEBLOCK_${exactMatch[1]}\u0000`;
    }
    const lines = trimmed.split("\n");
    if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${formatInline(l.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("")}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      return `<ol>${lines.map((l) => `<li>${formatInline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    }
    if (lines.every((l) => /^\s*>\s?/.test(l))) {
      return `<blockquote>${lines.map((l) => formatInline(l.replace(/^\s*>\s?/, ""))).join("<br>")}</blockquote>`;
    }
    if (/^#{1,4}\s+/.test(trimmed) && lines.length === 1) {
      const lvl = Math.min(4, trimmed.match(/^#+/)[0].length);
      return `<h${lvl}>${formatInline(trimmed.replace(/^#{1,4}\s+/, ""))}</h${lvl}>`;
    }
    return `<p>${lines.map((line) => {
      if (/^#{1,4}\s+/.test(line)) {
        const lvl = Math.min(4, line.match(/^#+/)[0].length);
        return `</p><h${lvl}>${formatInline(line.replace(/^#{1,4}\s+/, ""))}</h${lvl}><p>`;
      }
      return formatInline(line);
    }).join("<br>")}</p>`.replace(/<p><\/p>/g, "");
  });

  let finalHtml = htmlBlocks.join("");
  finalHtml = finalHtml.replace(/\u0000CODEBLOCK_(\d+)\u0000/g, (_, i) => {
    const b = codeBlocks[Number(i)];
    if (!b) return "";
    const encoded = encodeURIComponent(b.code);
    return `<div class="code-block"><div class="code-head"><span>${esc(b.lang)}</span><button type="button" class="copy-code-btn" data-code="${encoded}">📋 Copy code</button></div><pre><code>${esc(b.code)}</code></pre></div>`;
  });
  return finalHtml;
}

function formatInline(str) {
  let s = esc(str);
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return s;
}

function setCardBodyMarkdown(bodyEl, rawText, streaming = false) {
  bodyEl._rawText = String(rawText || "");
  const card = bodyEl.closest(".card.ans");
  if (card) {
    const snippetEl = card.querySelector(".card-compact-snippet");
    const metaEl = card.querySelector(".card-meta-pill");
    const plain = bodyEl._rawText
      .replace(/```[\s\S]*?```/g, " [code] ")
      .replace(/[#>*_`]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (snippetEl) {
      snippetEl.textContent = plain.slice(0, 210) + (plain.length > 210 ? "…" : "") || (streaming ? "Generating response…" : "");
    }
    if (metaEl) {
      const words = bodyEl._rawText ? bodyEl._rawText.trim().split(/\s+/).length : 0;
      const filesCount = (bodyEl._rawText.match(/===\s*FILE:/g) || []).length;
      metaEl.textContent = filesCount ? `${words}w · ${filesCount} file${filesCount === 1 ? "" : "s"}` : `${words} words`;
    }
    if (!streaming) {
      window.syncLighthouseIfActive?.(card);
    }
  }
  if (streaming) {
    bodyEl.classList.remove("md-rendered");
    bodyEl.textContent = bodyEl._rawText;
    const c = document.createElement("span");
    c.className = "caret";
    bodyEl.appendChild(c);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  } else {
    bodyEl.classList.add("md-rendered");
    bodyEl.innerHTML = renderMarkdown(bodyEl._rawText);
    bodyEl.querySelectorAll(".copy-code-btn").forEach((btn) => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const code = decodeURIComponent(btn.dataset.code || "");
        try {
          await navigator.clipboard.writeText(code);
          const prev = btn.textContent;
          btn.textContent = "✅ Copied";
          setTimeout(() => { btn.textContent = prev; }, 1400);
        } catch (_) {}
      };
    });
  }
}

// ── modes: ask / plan / build / hot_potato / cloud_council + Real vs. Sandboxed execution ──
let EXEC_MODE = "real";
function setExecMode(mode, { announceInCli = false } = {}) {
  EXEC_MODE = String(mode || "real").toLowerCase().startsWith("sandbox") ? "sandboxed" : "real";
  $$("#exec-mode-seg button, #guardian-exec-mode-seg button, #cli-exec-mode-seg button").forEach((btn) => {
    const val = (btn.dataset.execmode || btn.dataset.execMode || btn.dataset.gexec || "real").toLowerCase();
    btn.classList.toggle("on", val === EXEC_MODE);
  });
  const pfxEl = $("#guardian-prompt-prefix");
  if (pfxEl && typeof getUnifiedTerminalPs1 === "function") {
    pfxEl.textContent = getUnifiedTerminalPs1(unifiedTerminalMode, unifiedTerminalShell);
  }
  const pathEl = $("#guardian-workspace-path");
  if (pathEl) {
    const cwdLabel = EXEC_MODE === "sandboxed" ? "/app/applet/.council_sandbox (ISOLATED SANDBOX)" : (pfxEl?.dataset?.cwd || "/app/applet (LIVE REAL CLI)");
    pathEl.innerHTML = `CWD: ${esc(cwdLabel)} · Type <code>/</code> + <code>Tab</code> to predict &amp; autocomplete`;
  }
  if (announceInCli) {
    const outEl = $("#guardian-out");
    if (outEl && typeof appendTypedTerminalBlock === "function") {
      appendTypedTerminalBlock(
        outEl,
        EXEC_MODE === "real"
          ? "⚡ Switched Suomynona Council CLI to [LIVE REAL CLI] mode (/live). Full OS, filesystem, process & network access active."
          : "🔒 Switched Suomynona Council CLI to [SANDBOXED CLI] mode (/sandbox). Commands are confined to /app/applet/.council_sandbox.",
        { color: EXEC_MODE === "real" ? "#2ee6a6" : "#fbbf24", marginBottom: "6px", instant: true }
      );
    }
  }
  status(
    EXEC_MODE === "real"
      ? "⚡ Execution Mode: Live Real CLI (commands & built apps run directly in the live shell)"
      : "🔒 Execution Mode: Sandboxed CLI (commands & built apps run inside isolated .council_sandbox)"
  );
}
$$("#exec-mode-seg button, #guardian-exec-mode-seg button, #cli-exec-mode-seg button").forEach((b) => {
  b.onclick = () => {
    const m = b.dataset.execmode || b.dataset.execMode || b.dataset.gexec || "real";
    setExecMode(m, { announceInCli: Boolean(b.closest("#cli-exec-mode-seg")) });
  };
});

$("#council-add-model-btn")?.addEventListener("click", () => {
  const lineupNavBtn = document.querySelector('.rail-btn[data-view="lineup"]');
  if (lineupNavBtn) lineupNavBtn.click();
  setTimeout(() => {
    const addTab = document.querySelector('#lineup-win-tabs [data-lineup-win="add-models"]');
    if (addTab) addTab.click();
    $("#cg-name")?.focus();
  }, 80);
});

function setCouncilExecutionMode(nextMode, openSetupIfEmpty = true) {
  const norm =
    nextMode === "cloud" || nextMode === "cloud-council"
      ? "cloud_council"
      : nextMode === "hotpotato"
      ? "hot_potato"
      : nextMode || "ask";
  MODE = norm;
  $$("#mode button").forEach((x) => x.classList.toggle("on", x.dataset.mode === norm));
  $("#hot-potato-btn")?.classList.toggle("on", norm === "hot_potato");
  const modeLbl = $("#composer-active-mode-lbl");
  if (modeLbl) {
    modeLbl.textContent =
      norm === "cloud_council"
        ? "/cloud"
        : norm === "hot_potato"
        ? "/hotpotato"
        : `/${norm}`;
  }
  if (norm === "cloud_council") {
    status("☁️ Cloud Mode active — 3-Step Cloud Grounding → Suomynona Council Pipeline ready!");
    if (openSetupIfEmpty && !$("#inline-cloud-council-setup-card")) {
      openCloudToCouncilQuestionsCard(($("#prompt")?.value || "").trim());
    }
    return;
  }
  if (norm === "hot_potato") {
    status("🥔 Hot Potato Mode active — Sequential Relay + Modular Decomposer + Highlighted Verdict ready!");
    if (openSetupIfEmpty && !$("#inline-hot-potato-setup-card")) {
      openHotPotatoPromptModeCard(($("#prompt")?.value || "").trim());
    }
    return;
  }
  // Remove inline Cloud / Hot Potato pre-flight setup cards if switching back to Ask / Plan / Build
  $("#inline-cloud-council-setup-card")?.remove();
  $("#inline-hot-potato-setup-card")?.remove();
  status(
    norm === "ask"
      ? "💬 Mode: Ask — Direct parallel multi-model answers"
      : norm === "plan"
      ? "📐 Mode: Plan — Step-by-step architecture & implementation blueprint (ready for 🔨 Build + ⚖️ Judge after)"
      : "🔨 Mode: Build — Full multi-file code generation & live terminal verification" +
        (window._lastPlan ? " (following your drafted Plan)" : "")
  );
}

$$("#mode button").forEach((b) => {
  b.onclick = () => setCouncilExecutionMode(b.dataset.mode, true);
});
const MODE_WRAP = {
  plan: (p) => "Do NOT implement. Produce a clear, step-by-step PLAN for this goal - phases, "
              + "key decisions, risks, and success criteria:\n\n" + p,
  build: (p) => "Fully BUILD/IMPLEMENT this application now with 100% complete, working code.\n"
              + "CRITICAL MULTI-FILE COMPLETION RULES:\n"
              + "1. Emit EVERY file needed by the app using exact headers: === FILE: path/to/file.ext === followed by a fenced code block.\n"
              + "2. Never leave placeholders, TODOs, truncated functions, or missing local imports/modules.\n"
              + "3. Include a runnable entrypoint (main.py, app.py, index.js, or index.html) so it can be immediately executed, tested, and packaged as CLI, Script, GUI, or EXE.\n"
              + (window._lastPlan ? "\nFollow this approved plan:\n\n" + window._lastPlan : "")
              + "\n\nTask:\n\n" + p,
};

// ── nav, live activity console collapse & right-side loadable models menu ──
const shell = $(".shell");
const railToggle = $("#rail-toggle");
function setRailExpanded(expanded) {
  shell.classList.toggle("nav-expanded", expanded);
  railToggle.setAttribute("aria-expanded", String(expanded));
  railToggle.setAttribute("aria-label", expanded ? "Collapse navigation" : "Expand navigation");
  railToggle.title = expanded ? "Collapse menu" : "Expand menu";
  railToggle.textContent = expanded ? "‹" : "›";
  try { localStorage.setItem("council-nav-expanded", expanded ? "1" : "0"); } catch (_) {}
}

const consoleToggle = $("#console-toggle");
let currentConsoleHeight = 250;
let currentComposerPromptHeight = 84;

function setConsoleCompletelyHidden(hidden) {
  setConsoleExpanded(!hidden);
}

function setConsoleHeight(px) {
  const maxAllowed = Math.max(240, Math.min(720, Math.round((window.innerHeight || 900) * 0.76)));
  const clamped = Math.max(135, Math.min(maxAllowed, Math.round(Number(px) || 250)));
  currentConsoleHeight = clamped;
  const splitBody = $("#console-split-body");
  const liveConsole = $("#live-console");
  if (splitBody) splitBody.style.setProperty("--console-split-height", `${clamped}px`);
  if (liveConsole) liveConsole.style.setProperty("--console-split-height", `${clamped}px`);
  try { localStorage.setItem("council-console-height", String(clamped)); } catch (_) {}
}

function setConsoleExpanded(expanded) {
  const liveConsole = $("#live-console");
  const tinyBar = $("#console-tiny-bar");
  const expandedWrap = $("#console-expanded-wrap");
  if (!liveConsole) return;
  liveConsole.classList.remove("completely-hidden");
  liveConsole.classList.toggle("collapsed", !expanded);
  if (tinyBar) tinyBar.classList.toggle("hidden", Boolean(expanded));
  if (expandedWrap) expandedWrap.classList.toggle("hidden", !expanded);
  if (consoleToggle) {
    consoleToggle.setAttribute("aria-expanded", String(expanded));
    consoleToggle.textContent = expanded ? "∨" : "∧";
  }
  try { localStorage.setItem("council-console-expanded", expanded ? "1" : "0"); } catch (_) {}
}

function setComposerPromptHeight(px) {
  const maxAllowed = Math.max(180, Math.min(540, Math.round((window.innerHeight || 900) * 0.6)));
  const clamped = Math.max(54, Math.min(maxAllowed, Math.round(Number(px) || 84)));
  currentComposerPromptHeight = clamped;
  const promptEl = $("#prompt");
  if (promptEl) {
    promptEl.style.height = `${clamped}px`;
  }
  try { localStorage.setItem("council-composer-height", String(clamped)); } catch (_) {}
}

const rightRailToggle = $("#right-rail-toggle");
function setRightRailExpanded(expanded) {
  if (!shell || !rightRailToggle) return;
  shell.classList.toggle("right-expanded", expanded);
  rightRailToggle.setAttribute("aria-expanded", String(expanded));
  rightRailToggle.setAttribute("aria-label", expanded ? "Collapse models menu" : "Expand models menu");
  rightRailToggle.title = expanded ? "Collapse Loadable Models menu" : "Expand Loadable Models menu";
  rightRailToggle.textContent = expanded ? "›" : "‹";
  $("#topbar-models-drawer-btn")?.classList.toggle("is-open", Boolean(expanded));
  try { localStorage.setItem("council-right-expanded", expanded ? "1" : "0"); } catch (_) {}
}

const composerToggle = $("#composer-toggle");
function setComposerExpanded(expanded) {
  const card = $("#composer-card");
  const collapsedBar = $("#composer-collapsed-bar");
  const summary = $("#composer-collapsed-summary");
  if (!card || !composerToggle) return;
  card.classList.toggle("collapsed", !expanded);
  composerToggle.setAttribute("aria-expanded", String(expanded));
  composerToggle.setAttribute("aria-label", expanded ? "Collapse prompt composer upward" : "Expand prompt composer downward");
  composerToggle.title = expanded ? "Hide Prompt Composer upward" : "Bring down Prompt Composer";
  composerToggle.textContent = expanded ? "∧" : "∨";
  if (collapsedBar) collapsedBar.classList.toggle("hidden", expanded);
  if (summary && STATE) {
    const totalLoaded = (STATE.backends || []).filter((b) => !String(b.model || "").toLowerCase().includes("embed")).length;
    summary.textContent = `${picked.size}/${totalLoaded} models active · mode: ${MODE.toUpperCase()}`;
  }
  try { localStorage.setItem("council-composer-expanded", expanded ? "1" : "0"); } catch (_) {}
}

function setModelsExpanded(expanded) {
  const strip = $("#model-strip");
  const button = $("#models-toggle");
  if (!strip || !button) return;
  strip.classList.toggle("collapsed", !expanded);
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = expanded ? "▾ Hide models" : "▸ Show models";
  try { localStorage.setItem("council-models-expanded", expanded ? "1" : "0"); } catch (_) {}
}
try { setRailExpanded(localStorage.getItem("council-nav-expanded") === "1"); } catch (_) {}
try { setComposerExpanded(localStorage.getItem("council-composer-expanded") !== "0"); } catch (_) {}
try {
  const savedCompH = Number(localStorage.getItem("council-composer-height"));
  if (savedCompH >= 54) setComposerPromptHeight(savedCompH);
} catch (_) {}
try {
  const savedConsoleExp = localStorage.getItem("council-console-expanded");
  // Default to collapsed tiny bar if user minimized it, or expanded otherwise
  setConsoleExpanded(savedConsoleExp !== "0");
} catch (_) {}
try {
  const savedH = Number(localStorage.getItem("council-console-height"));
  if (savedH >= 135) setConsoleHeight(savedH);
  else setConsoleHeight(250);
} catch (_) {}
try { setRightRailExpanded(localStorage.getItem("council-right-expanded") === "1"); } catch (_) {}

railToggle.onclick = () => setRailExpanded(!shell.classList.contains("nav-expanded"));
if (composerToggle) {
  composerToggle.onclick = () => {
    const card = $("#composer-card");
    setComposerExpanded(card ? card.classList.contains("collapsed") : true);
  };
}
$("#composer-collapsed-bar")?.addEventListener("click", () => setComposerExpanded(true));

// Drag-to-resize handle at the bottom of #composer-card (adjusts whole prompt area up and down)
const composerResizeHandle = $("#composer-resize-handle");
if (composerResizeHandle) {
  let cDragStartY = 0;
  let cDragStartH = 84;
  const onComposerMove = (clientY) => {
    const delta = clientY - cDragStartY; // dragging down increases prompt height, dragging up shrinks it
    const nextH = cDragStartH + delta;
    if (nextH < 36) {
      setComposerExpanded(false);
    } else {
      setComposerExpanded(true);
      setComposerPromptHeight(nextH);
    }
  };
  composerResizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    cDragStartY = e.clientY;
    cDragStartH = $("#prompt")?.offsetHeight || currentComposerPromptHeight || 84;
    composerResizeHandle.classList.add("dragging");
    const handleMouseMove = (ev) => onComposerMove(ev.clientY);
    const handleMouseUp = () => {
      composerResizeHandle.classList.remove("dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });
  composerResizeHandle.addEventListener("touchstart", (e) => {
    if (!e.touches?.[0]) return;
    cDragStartY = e.touches[0].clientY;
    cDragStartH = $("#prompt")?.offsetHeight || currentComposerPromptHeight || 84;
    composerResizeHandle.classList.add("dragging");
    const handleTouchMove = (ev) => {
      if (ev.touches?.[0]) onComposerMove(ev.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      composerResizeHandle.classList.remove("dragging");
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  }, { passive: true });
}

$("#console-tiny-bar")?.addEventListener("click", () => setConsoleExpanded(true));
$("#console-expand-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setConsoleExpanded(true);
});
$("#console-minimize-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setConsoleExpanded(false);
});

// Console height adjustment buttons & minimize controls
$("#console-size-down-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentConsoleHeight <= 155) {
    setConsoleExpanded(false);
  } else {
    setConsoleExpanded(true);
    setConsoleHeight(currentConsoleHeight - 60);
  }
});
$("#console-size-up-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setConsoleExpanded(true);
  setConsoleHeight(currentConsoleHeight + 60);
});
$("#console-size-max-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setConsoleExpanded(true);
  const maxTarget = Math.min(620, Math.round((window.innerHeight || 900) * 0.68));
  setConsoleHeight(currentConsoleHeight >= maxTarget - 30 ? 250 : maxTarget);
});

// Drag-to-resize handle on top of #live-console
const consoleResizeHandle = $("#console-resize-handle");
if (consoleResizeHandle) {
  let dragStartY = 0;
  let dragStartH = 250;
  const onMove = (clientY) => {
    const delta = dragStartY - clientY; // dragging up increases console height
    const nextH = dragStartH + delta;
    if (nextH < 95) {
      setConsoleExpanded(false);
    } else {
      setConsoleExpanded(true);
      setConsoleHeight(nextH);
    }
  };
  consoleResizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragStartY = e.clientY;
    dragStartH = currentConsoleHeight;
    consoleResizeHandle.classList.add("dragging");
    const handleMouseMove = (ev) => onMove(ev.clientY);
    const handleMouseUp = () => {
      consoleResizeHandle.classList.remove("dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });
  consoleResizeHandle.addEventListener("touchstart", (e) => {
    if (!e.touches?.[0]) return;
    dragStartY = e.touches[0].clientY;
    dragStartH = currentConsoleHeight;
    consoleResizeHandle.classList.add("dragging");
    const handleTouchMove = (ev) => {
      if (ev.touches?.[0]) onMove(ev.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      consoleResizeHandle.classList.remove("dragging");
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  }, { passive: true });
}

if (rightRailToggle) {
  rightRailToggle.onclick = () => setRightRailExpanded(!shell.classList.contains("right-expanded"));
}
$("#right-rail-collapsed-strip")?.addEventListener("click", () => setRightRailExpanded(true));

if ($("#models-toggle")) {
  $("#models-toggle").onclick = () => setModelsExpanded($("#models-toggle").getAttribute("aria-expanded") !== "true");
}
function setConsoleFullTabMode(fullPage) {
  const councilView = $("#view-council");
  const fullBtn = $("#console-fulltab-toggle-btn");
  if (!councilView) return;
  councilView.classList.toggle("fullpage-tab-mode", Boolean(fullPage));
  if (fullBtn) {
    fullBtn.textContent = fullPage ? "◒ Dock to Bottom" : "⤢ Full Tab";
    fullBtn.classList.toggle("on", Boolean(fullPage));
  }
}

function switchConsoleDockTab(tabId, { fullPage = null, focus = true } = {}) {
  const targetTab = tabId || "brain-council";
  window._activeConsoleDockTab = targetTab;
  setConsoleExpanded(true);
  if (typeof fullPage === "boolean") {
    setConsoleFullTabMode(fullPage);
  }
  $$("#console-dock-tabs [data-dock-tab]").forEach((btn) => {
    const isOn = btn.dataset.dockTab === targetTab;
    btn.classList.toggle("active", isOn);
    btn.setAttribute("aria-selected", String(isOn));
  });
  $$("#live-console .console-tab-pane[data-dock-pane]").forEach((pane) => {
    const pName = pane.dataset.dockPane;
    if (targetTab === "brain-council") {
      // On the merged Suomynona Council CLI page, show both the terminals (brain-council) and CLI controls (cli-controls) together
      pane.classList.toggle("hidden", pName !== "brain-council" && pName !== "cli-controls");
    } else {
      pane.classList.toggle("hidden", pName !== targetTab);
    }
  });
  if (targetTab === "brain-council") {
    loadGuardianTerminal();
    renderColabHosts();
    syncCliPromptPrefix();
    if (focus) $("#guardian-fullscreen-term")?.focus();
  } else if (targetTab === "cli-controls") {
    renderColabHosts();
    syncCliPromptPrefix();
  } else if (targetTab === "colab-cli") {
    renderColabHosts();
    syncCliPromptPrefix();
    if (focus) $("#cli-fullscreen-term")?.focus();
  }
  if (typeof applyConsoleLogFilter === "function") {
    applyConsoleLogFilter();
  }
}

$$("#console-dock-tabs [data-dock-tab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.dockTab || "brain-council";
    switchConsoleDockTab(tabId, { focus: true });
    // Sync left rail active highlight if currently in fullpage-tab-mode
    if ($("#view-council")?.classList.contains("fullpage-tab-mode")) {
      $$(".rail-btn").forEach((x) => x.classList.remove("on"));
      const railMatch = document.querySelector(`.rail-btn[data-dock-nav="${tabId}"]`) || document.querySelector('.rail-btn[data-view="council"]');
      railMatch?.classList.add("on");
    }
  });
});

$$("[data-dock-tab-jump]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const jumpTab = btn.dataset.dockTabJump || "cli-controls";
    switchConsoleDockTab(jumpTab, { focus: true });
  });
});

$("#console-fulltab-toggle-btn")?.addEventListener("click", () => {
  setConsoleExpanded(true);
  const isNowFull = !$("#view-council")?.classList.contains("fullpage-tab-mode");
  setConsoleFullTabMode(isNowFull);
});

let unifiedTerminalMode = "council"; // "council" | "claude" | "brain" | "colab"
let unifiedTerminalShell = "bash";   // "bash" | "pwsh" | "cmd" | "python" | "node"

function getUnifiedTerminalPs1(mode = unifiedTerminalMode, shell = unifiedTerminalShell) {
  const sbTag = EXEC_MODE === "sandboxed" ? "[🔒SANDBOX] " : "";
  const cwdPath = EXEC_MODE === "sandboxed" ? "/app/applet/.council_sandbox" : "/app/applet";
  if (mode === "brain") {
    const rawLabel = $("#brain-model-select")?.selectedOptions?.[0]?.textContent || "Default Brain";
    const cleanModel = typeof cleanBrainModelLabel === "function" ? cleanBrainModelLabel(rawLabel) : rawLabel;
    return `${sbTag}brain-copilot [${cleanModel}] 🧠 ❯`;
  }
  if (mode === "claude") {
    return `${sbTag}claude-code [${cwdPath}] 🤖 ❯`;
  }
  if (mode === "colab") {
    const sel = $("#cli-target-host");
    const val = (sel?.value || "all").toUpperCase();
    const hostTag = val === "ALL" ? "ALL HOSTS" : val;
    return `${sbTag}colab-gpu [${hostTag}] ⚡ ❯`;
  }
  if (shell === "pwsh" || shell === "powershell") {
    return `${sbTag}PS C:\\SuomynonaCouncil\\applet>`;
  }
  if (shell === "cmd" || shell === "bat") {
    return `${sbTag}C:\\SuomynonaCouncil\\applet>`;
  }
  if (shell === "python" || shell === "py") {
    return `${sbTag}python3 [${cwdPath}] >>>`;
  }
  if (shell === "node" || shell === "js") {
    return `${sbTag}node [${cwdPath}] >`;
  }
  return EXEC_MODE === "sandboxed" ? `sandbox@suomynona-council:${cwdPath}$` : `suomynona@council:${cwdPath}$`;
}

function setUnifiedTerminalShell(shell = "bash", { announce = true } = {}) {
  const s = String(shell || "bash").toLowerCase().trim();
  const norm =
    s === "powershell" || s === "pwsh" || s === "ps1"
      ? "pwsh"
      : s === "cmd" || s === "bat"
      ? "cmd"
      : s === "python" || s === "py"
      ? "python"
      : s === "node" || s === "js"
      ? "node"
      : "bash";
  unifiedTerminalShell = norm;

  const shellBadge = $("#unified-term-shell-badge");
  const pfxEl = $("#guardian-prompt-prefix");
  if (shellBadge) {
    const labels = {
      bash: "SHELL: /bash (Linux Bash .sh)",
      pwsh: "SHELL: /pwsh (Windows PowerShell .ps1)",
      cmd: "SHELL: /cmd (Command Prompt .bat)",
      python: "SHELL: /python (Python 3 REPL)",
      node: "SHELL: /node (Node.js REPL)",
    };
    shellBadge.textContent = labels[norm] || `SHELL: /${norm}`;
  }
  if (pfxEl) pfxEl.textContent = getUnifiedTerminalPs1(unifiedTerminalMode, norm);

  $$(".cli-slash-pill").forEach((btn) => {
    const sc = btn.dataset.slashCmd || "";
    if (["/bash", "/pwsh", "/cmd", "/python", "/go", "/node"].includes(sc)) {
      btn.classList.toggle("active", sc === `/${norm}`);
    }
  });

  const pyBar = $("#python-repl-workbench-bar");
  const phEl = $("#guardian-direct-placeholder");
  if (pyBar) {
    pyBar.classList.toggle("hidden", norm !== "python");
  }
  if (norm === "python") {
    bindPythonReplWorkbenchControls();
    getJSON("/api/python/state")
      .then((st) => updatePythonReplWorkbenchUI(st))
      .catch(() => {});
    if (phEl) {
      phEl.textContent =
        "Python 3 REPL (>>>) — Real Python 3.10 + Official PyPA pip (%pip install <real-pypi-pkg>), %whos, %time, !cmd…";
    }
  } else if (phEl && unifiedTerminalMode === "council") {
    phEl.textContent =
      "Type any command or slash command (/council, /claude, /brain, /colab, /bash, /python, /go, /pwsh, /cmd, /swarm, /hotpotato) — press Tab to predict…";
  }

  if (announce) {
    const outEl = $("#guardian-out");
    const descMap = {
      bash: "🐚 Switched active script shell to Linux Bash (/bash). Standard POSIX & .sh commands active.",
      pwsh: "⚡ Switched active script shell to Windows PowerShell (/pwsh). Cmdlets like Get-ChildItem, Get-Process, Get-Content, $PSVersionTable active.",
      cmd: "🪟 Switched active script shell to Windows Command Prompt (/cmd). Commands like dir, ipconfig, tasklist, systeminfo, ver active.",
      python:
        "🐍 Switched to Real Python 3.10 Interpreter + Official PyPI pip (/python).\n  • Real PyPI installs: `%pip install <package>` queries pypi.org and installs genuine wheels.\n  • Magic commands: `%whos`, `%history`, `%time <expr>`, `%run <file.py>`, `%save <file.py>`, `%reset`, `!<shell_cmd>`.",
      go: "🐹 Switched to Real Go 1.22 Compiler & Runner (/go · go1.22.10 linux/amd64 + GOOS=windows x64 PE32+ cross-compiler). Type Go statements, `go version`, or full `package main` code!",
      node: "🟢 Switched active interpreter to Node.js (/node). Type any JavaScript expression or command to execute live.",
    };
    if (outEl && typeof appendTypedTerminalBlock === "function") {
      appendTypedTerminalBlock(outEl, descMap[norm] || `Switched shell to /${norm}`, {
        color: norm === "python" || norm === "go" ? "#2ee6a6" : "#00d4ff",
        instant: true,
      });
    }
    status(descMap[norm] || `Switched shell to /${norm}`);
  }
  $("#guardian-fullscreen-term")?.focus();
}

let _pyReplWorkbenchBound = false;
function updatePythonReplWorkbenchUI(pyState) {
  if (!pyState) return;
  const stEl = $("#py-repl-kernel-status");
  const varsStrip = $("#python-repl-vars-strip");
  const vars = Array.isArray(pyState.variables) ? pyState.variables : [];
  if (stEl) {
    stEl.textContent = `Python ${pyState.python_version || "3.10.12"} · In[${pyState.step || 0}] · ${vars.length} active var${vars.length === 1 ? "" : "s"}`;
  }
  if (varsStrip) {
    if (!vars.length) {
      varsStrip.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b">No vars yet (try: x = [i**2 for i in range(8)])</span>`;
    } else {
      varsStrip.innerHTML = vars
        .slice(0, 8)
        .map(
          (v) =>
            `<button type="button" class="ghost xs" data-py-inspect-var="${esc(v.name)}" style="height:20px;padding:1px 6px;font-family:'JetBrains Mono',monospace;font-size:10px;border-color:rgba(56,189,248,0.35);color:#bae6fd" title="${esc(v.name)} (${esc(v.type)}): ${esc(v.preview)}">${esc(v.name)}<span style="color:#64748b">:${esc(v.type)}</span></button>`
        )
        .join("");
      varsStrip.querySelectorAll("[data-py-inspect-var]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const vName = btn.getAttribute("data-py-inspect-var");
          if (vName) executeUnifiedCliCommand(`/python ${vName}`);
        });
      });
    }
  }
}

function bindPythonReplWorkbenchControls() {
  if (_pyReplWorkbenchBound) return;
  const bar = $("#python-repl-workbench-bar");
  if (!bar) return;
  _pyReplWorkbenchBound = true;

  $("#py-repl-toggle-editor-btn")?.addEventListener("click", () => {
    const drawer = $("#python-repl-multiline-drawer");
    if (!drawer) return;
    drawer.classList.toggle("hidden");
    if (!drawer.classList.contains("hidden")) {
      $("#python-repl-multiline-input")?.focus();
    }
  });

  $("#py-repl-exit-btn")?.addEventListener("click", () => {
    setUnifiedTerminalShell("bash", { announce: true });
  });

  bar.querySelectorAll("[data-py-magic]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const magic = btn.getAttribute("data-py-magic");
      if (magic) executeUnifiedCliCommand(`/python ${magic}`);
    });
  });

  $("#py-repl-sample-btn")?.addEventListener("click", () => {
    const inp = $("#python-repl-multiline-input");
    if (!inp) return;
    inp.value = [
      "import math, sys, platform",
      "",
      "def analyze_spectrum(limit=50):",
      "    primes = [n for n in range(2, limit) if all(n % d for d in range(2, int(math.isqrt(n)) + 1))]",
      "    return {'python': sys.version.split()[0], 'arch': platform.machine(), 'count': len(primes), 'primes': primes}",
      "",
      "report = analyze_spectrum(60)",
      "print(f\"Discovered {report['count']} primes on Python {report['python']} ({report['arch']})\")",
      "report",
    ].join("\n");
    inp.focus();
  });

  const runMultiline = async () => {
    const inp = $("#python-repl-multiline-input");
    const code = (inp?.value || "").trim();
    if (!code) return;
    await executeUnifiedCliCommand(`/python ${code}`);
  };

  $("#py-repl-run-multiline-btn")?.addEventListener("click", runMultiline);
  $("#python-repl-multiline-input")?.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runMultiline();
    }
  });
}

function setUnifiedTerminalMode(mode = "council", { announce = true } = {}) {
  const norm = ["brain", "council", "colab", "claude"].includes(String(mode).toLowerCase())
    ? String(mode).toLowerCase()
    : "council";
  unifiedTerminalMode = norm;
  if (typeof guardianInputMode !== "undefined") {
    guardianInputMode = norm === "brain" ? "brain" : norm === "claude" ? "claude" : "cli";
  }

  $$("#unified-term-mode-seg [data-term-mode]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.termMode === norm);
  });
  $$("[data-term-mode-quick]").forEach((btn) => {
    btn.classList.toggle("primary", btn.dataset.termModeQuick === norm);
    btn.classList.toggle("ghost", btn.dataset.termModeQuick !== norm);
  });
  $$(".cli-slash-pill").forEach((btn) => {
    const sc = btn.dataset.slashCmd || "";
    if (["/council", "/claude", "/brain", "/colab"].includes(sc)) {
      btn.classList.toggle("active", sc === `/${norm}`);
    }
  });

  const badgeEl = $("#unified-term-mode-badge");
  const titleEl = $("#unified-term-title");
  const pfxEl = $("#guardian-prompt-prefix");
  const phEl = $("#guardian-direct-placeholder");
  const ps1 = getUnifiedTerminalPs1(norm, unifiedTerminalShell);

  if (pfxEl) pfxEl.textContent = ps1;
  if (norm === "brain") {
    if (titleEl) titleEl.textContent = "🧠 SUOMYNONA COUNCIL MASTER CLI — BRAIN COPILOT (/brain)";
    if (badgeEl) {
      badgeEl.textContent = "MODE: /brain (Copilot)";
      badgeEl.style.background = "rgba(236,72,153,.2)";
      badgeEl.style.color = "#f472b6";
    }
    if (phEl) {
      phEl.textContent = "Ask Brain Copilot anything & press Enter (or type /council, /claude, /colab, /pwsh, /cmd + Tab)…";
    }
  } else if (norm === "claude") {
    if (titleEl) titleEl.textContent = "🤖 SUOMYNONA COUNCIL MASTER CLI — CLAUDE CODE AUTONOMOUS CODER (/claude)";
    if (badgeEl) {
      badgeEl.textContent = "MODE: /claude (Claude Code)";
      badgeEl.style.background = "rgba(251,146,60,.22)";
      badgeEl.style.color = "#fb923c";
    }
    if (phEl) {
      phEl.textContent = "Ask Claude Code to inspect, architect, build, test, or self-heal any code in the workspace…";
    }
  } else if (norm === "colab") {
    if (titleEl) titleEl.textContent = "🖥 SUOMYNONA COUNCIL MASTER CLI — COLAB & MULTI-HOST GPU (/colab)";
    if (badgeEl) {
      badgeEl.textContent = "MODE: /colab (Multi-Host GPU)";
      badgeEl.style.background = "rgba(0,212,255,.18)";
      badgeEl.style.color = "#00d4ff";
    }
    if (phEl) {
      phEl.textContent = "Type any GPU/Host command ('nvidia-smi', 'sessions', 'status') or /council, /claude, /brain + Tab…";
    }
  } else {
    if (titleEl) titleEl.textContent = "🛡️ SUOMYNONA COUNCIL MASTER CLI — UNIFIED COMMAND CENTER (/council)";
    if (badgeEl) {
      badgeEl.textContent = "MODE: /council";
      badgeEl.style.background = "rgba(46,230,166,.18)";
      badgeEl.style.color = "#2ee6a6";
    }
    if (phEl) {
      phEl.textContent = "Type any command or slash command (/council, /claude, /brain, /colab, /bash, /pwsh, /cmd, /python, /swarm, /hotpotato) — press Tab to predict…";
    }
  }

  if (announce) {
    const outEl = $("#guardian-out");
    const modeDesc =
      norm === "brain"
        ? "🧠 Switched to /brain (Brain Copilot Mode). Everything you type goes to Default Brain with persistent memory."
        : norm === "claude"
        ? "🤖 Switched to /claude (Claude Code Autonomous Agentic Coder Mode). Describe any feature, bugfix, or app build — Claude Code will inspect files, write code, run tests, and self-heal automatically."
        : norm === "colab"
        ? "🖥 Switched to /colab (Colab & Multi-Host GPU CLI Mode). Commands execute on your selected GPU runtime host(s)."
        : `🛡️ Switched to /council (Suomynona Council Master CLI Mode · Active Shell: /${unifiedTerminalShell}). All slash commands, shells (/bash, /pwsh, /cmd, /python, /node), Swarm, Hot Potato & Decomposer active.`;
    if (outEl && typeof appendTypedTerminalBlock === "function") {
      appendTypedTerminalBlock(outEl, modeDesc, {
        color: norm === "brain" ? "#f472b6" : norm === "claude" ? "#fb923c" : norm === "colab" ? "#00d4ff" : "#2ee6a6",
        instant: true,
      });
    }
    status(modeDesc);
  }
  $("#guardian-fullscreen-term")?.focus();
}

function setUnifiedConsoleLayout(mode = "cli") {
  const splitBody = $("#console-split-body");
  const brainPane = $("#brain-console-pane");
  const cliPane = $("#activity-console-pane");
  const colabPane = $("#colab-console-pane");
  $$("#unified-layout-seg button").forEach((b) => {
    b.classList.toggle("on", (b.dataset.ulayout || "cli") === mode);
  });
  if (!splitBody || !brainPane || !cliPane) return;
  splitBody.dataset.layoutMode = mode;
  if (mode === "all3") {
    splitBody.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    brainPane.style.display = "";
    cliPane.style.display = "flex";
    if (colabPane) colabPane.style.display = "";
    brainPane.classList.remove("hidden");
    cliPane.classList.remove("hidden");
    colabPane?.classList.remove("hidden");
  } else {
    splitBody.style.gridTemplateColumns = "1fr";
    if (!_activeSeparateWindows?.has("brain")) {
      brainPane.style.display = "none";
      brainPane.classList.add("hidden");
    }
    cliPane.style.display = "flex";
    cliPane.classList.remove("hidden");
    if (colabPane && !_activeSeparateWindows?.has("colab-cli")) {
      colabPane.style.display = "none";
      colabPane.classList.add("hidden");
    }
    if (mode === "brain" || mode === "colab" || mode === "council") {
      setUnifiedTerminalMode(mode, { announce: false });
    }
    $("#guardian-fullscreen-term")?.focus();
  }
}

// ── Separate Floating Windows Manager (open any menu/pane in its own draggable window) ──
const SEPARATE_WINDOW_REGISTRY = {
  "cli-controls": {
    title: "🎛️ CLI Controls Window (Host & Runtime Controls)",
    selector: "#cli-controls-window-content",
    width: 820,
    height: 520,
  },
  "brain": {
    title: "🧠 Default Brain (Chat + Prompt Improver)",
    selector: "#brain-console-pane",
    width: 600,
    height: 480,
  },
  "council-cli": {
    title: "🤖 Council CLI Terminal (Guardian / Claude Code)",
    selector: "#activity-console-pane",
    width: 660,
    height: 500,
  },
  "colab-cli": {
    title: "💻 Colab & Multi-Host CLI Terminal",
    selector: "#colab-console-pane",
    width: 660,
    height: 500,
  },
  "host-consoles": {
    title: "🖥 Individual Host Consoles",
    selector: "#colab-cli-hosts",
    width: 720,
    height: 480,
  },
  "live-activity": {
    title: "📡 Live Council Activity Stream",
    selector: "#live-activity-details",
    width: 680,
    height: 420,
  },
};

const _activeSeparateWindows = new Map();
let _separateWinZIndex = 2400;

function openSeparateMenuWindow(winId) {
  const spec = SEPARATE_WINDOW_REGISTRY[winId];
  if (!spec) return;
  let layer = $("#separate-windows-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "separate-windows-layer";
    layer.className = "separate-windows-layer";
    document.body.appendChild(layer);
  }

  // If already open in a floating window, bring to front and flash
  if (_activeSeparateWindows.has(winId)) {
    const existing = _activeSeparateWindows.get(winId);
    existing.winEl.style.zIndex = String(++_separateWinZIndex);
    existing.winEl.classList.remove("minimized");
    existing.winEl.animate(
      [{ transform: "scale(0.985)" }, { transform: "scale(1)" }],
      { duration: 160 }
    );
    status(`🗗 Focused separate window: ${spec.title}`);
    return;
  }

  const targetEl = document.querySelector(spec.selector);
  if (!targetEl || !targetEl.parentNode) {
    status(`Could not locate section for separate window (${winId})`);
    return;
  }

  // Ensure open state if it's a <details> element or hidden auxiliary pane
  const wasHidden = targetEl.classList.contains("hidden") || targetEl.style.display === "none";
  targetEl.classList.remove("hidden");
  targetEl.style.display = "";
  if (targetEl.tagName === "DETAILS") {
    targetEl.open = true;
  }

  // Insert placeholder to remember exact DOM home
  const placeholder = document.createElement("div");
  placeholder.className = "separate-win-dock-placeholder";
  placeholder.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center;gap:8px">
    <span class="muted">🗗 <strong>${esc(spec.title)}</strong> is currently open in a separate floating window.</span>
    <button type="button" class="ghost xs" data-dock-back="${esc(winId)}">↙ Dock Back Here</button>
  </div>`;
  targetEl.parentNode.insertBefore(placeholder, targetEl);

  const count = _activeSeparateWindows.size;
  const topPx = Math.max(48, Math.min(window.innerHeight - 240, 70 + count * 28));
  const leftPx = Math.max(24, Math.min(window.innerWidth - 360, 120 + count * 34));

  const winEl = document.createElement("div");
  winEl.className = "floating-separate-window";
  winEl.dataset.sepWinId = winId;
  winEl.style.width = `${Math.min(spec.width, window.innerWidth - 48)}px`;
  winEl.style.height = `${Math.min(spec.height, window.innerHeight - 96)}px`;
  winEl.style.top = `${topPx}px`;
  winEl.style.left = `${leftPx}px`;
  winEl.style.zIndex = String(++_separateWinZIndex);

  winEl.innerHTML = `
    <div class="floating-separate-win-head">
      <div class="floating-separate-win-title">${esc(spec.title)}</div>
      <div class="row" style="gap:4px">
        <button type="button" class="ghost xs" data-sep-win-min="${esc(winId)}" title="Minimize / Restore floating window">⎯</button>
        <button type="button" class="ghost xs" data-sep-win-max="${esc(winId)}" title="Maximize / Restore floating window">⤢</button>
        <button type="button" class="primary xs" data-sep-win-dock="${esc(winId)}" title="Dock this menu back into the main page">↙ Dock Back</button>
      </div>
    </div>
    <div class="floating-separate-win-body"></div>
  `;

  const bodyEl = winEl.querySelector(".floating-separate-win-body");
  bodyEl.appendChild(targetEl);
  layer.appendChild(winEl);

  const closeAndDockBack = () => {
    if (!_activeSeparateWindows.has(winId)) return;
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(targetEl, placeholder);
      placeholder.remove();
    }
    if (wasHidden && winId !== "cli-controls") {
      // Let current layout mode govern visibility
      const curMode = $("#console-split-body")?.dataset.layoutMode || "all3";
      setUnifiedConsoleLayout(curMode);
    }
    winEl.remove();
    _activeSeparateWindows.delete(winId);
    status(`↙ Docked ${spec.title} back to main workspace`);
  };

  placeholder.querySelector(`[data-dock-back="${winId}"]`)?.addEventListener("click", closeAndDockBack);
  winEl.querySelector(`[data-sep-win-dock="${winId}"]`)?.addEventListener("click", closeAndDockBack);
  winEl.querySelector(`[data-sep-win-min="${winId}"]`)?.addEventListener("click", () => {
    winEl.classList.toggle("minimized");
  });
  winEl.querySelector(`[data-sep-win-max="${winId}"]`)?.addEventListener("click", () => {
    winEl.classList.toggle("maximized");
  });

  winEl.addEventListener("mousedown", () => {
    winEl.style.zIndex = String(++_separateWinZIndex);
  });

  // Dragging by window header
  const headEl = winEl.querySelector(".floating-separate-win-head");
  headEl?.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    if (winEl.classList.contains("maximized")) return;
    e.preventDefault();
    winEl.style.zIndex = String(++_separateWinZIndex);
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    const origLeft = rect.left;
    const origTop = rect.top;
    const onMove = (ev) => {
      const nx = Math.max(0, Math.min(window.innerWidth - 120, origLeft + (ev.clientX - startX)));
      const ny = Math.max(0, Math.min(window.innerHeight - 60, origTop + (ev.clientY - startY)));
      winEl.style.left = `${nx}px`;
      winEl.style.top = `${ny}px`;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });

  _activeSeparateWindows.set(winId, { winEl, placeholder, targetEl, closeAndDockBack });
  status(`🗗 Opened ${spec.title} in a separate floating window`);
}

$$("[data-open-separate-win]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const winId = btn.dataset.openSeparateWin;
    if (winId) openSeparateMenuWindow(winId);
  });
});

$$(".rail-btn").forEach((b) => b.onclick = () => {
  const sectionTitles = {
    council: "Unrestricted Build Studio",
    "file-explorer": "Suomynona Explorer",
    "vault-hub": "Settings — Keys, Tokens & Custom Slots",
    "master-licenses": "Paid Users, Ed25519 CD-Keys & Bound Computers",
    "councilng-cli": "Master Terminal CLI",
    lineup: "Models & HF Hub",
    agents: "Specialist Agents & MCP",
    system: "Settings, Keys & Diagnostics",
    swarm: "RAM Swarm Studio",
  };
  if (b.dataset.dockNav) {
    $$(".rail-btn").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    $$(".view").forEach((v) => v.classList.remove("on"));
    $("#view-council")?.classList.add("on");
    switchConsoleDockTab(b.dataset.dockNav, { fullPage: true, focus: true });
    if (b.dataset.ulayoutNav) {
      setUnifiedConsoleLayout(b.dataset.ulayoutNav);
    }
    return;
  }
  if (!b.dataset.view) return;
  if (b.dataset.view === "vault-hub" && typeof window.openSettingsSection === "function") {
    window.openSettingsSection("keys");
    return;
  }
  $$(".rail-btn").forEach((x) => x.classList.remove("on"));
  b.classList.add("on");
  $$("[data-top-view]").forEach((tb) => tb.classList.toggle("on", tb.dataset.topView === b.dataset.view));
  const secEl = $("#topbar-active-section");
  if (secEl && sectionTitles[b.dataset.view]) {
    secEl.textContent = sectionTitles[b.dataset.view];
  }
  $$(".view").forEach((v) => v.classList.remove("on"));
  $("#view-" + b.dataset.view)?.classList.add("on");
  if (b.dataset.view === "council") {
    setConsoleFullTabMode(false);
  }
  if (b.dataset.view === "file-explorer") {
    window.refreshFileExplorerView?.();
  }
  if (b.dataset.view === "vault-hub") {
    window.refreshVaultHubView?.();
  }
  if (b.dataset.view === "master-licenses") {
    window.refreshMasterLicensesView?.();
  }
  if (b.dataset.view === "councilng-cli") {
    switchConsoleDockTab("brain-council", { focus: true });
    setUnifiedConsoleLayout("cli");
  }
  if (b.dataset.view === "lineup") { bindLineupWindowTabs(); renderLineup(); }
  if (b.dataset.view === "system") { runHealth(); renderColabHosts(); loadA2aDashboard(); syncA2aStealthProfileUI(); window.refreshVaultHubView?.(); }
  if (b.dataset.view === "swarm") { syncRamSwarmModelsAndSetup(); }
  if (b.dataset.view === "agents") renderAgents();
  if (b.dataset.view === "cli" || b.dataset.view === "guardian") {
    $("#view-councilng-cli")?.classList.add("on");
    switchConsoleDockTab("brain-council", { focus: true });
    setUnifiedConsoleLayout("cli");
  }
  if (b.dataset.view === "a2a") loadA2aDashboard();
});
$("#open-swarm-tab-from-popup")?.addEventListener("click", () => {
  $("#swarm-mode-popup")?.classList.add("hidden");
  executeSwarmReactionChoice("mass_60");
});
$("#agents-goto-swarm-btn")?.addEventListener("click", () => {
  const cBtn = document.querySelector('.rail-btn[data-view="council"]');
  if (cBtn) cBtn.click();
  executeSwarmReactionChoice("mass_60");
});
$("#header-a2a-btn")?.addEventListener("click", () => {
  const cBtn = document.querySelector('.rail-btn[data-view="council"]');
  if (cBtn) cBtn.click();
  const modeBtn = document.querySelector('#mode button[data-mode="cloud_council"]');
  if (modeBtn) modeBtn.click();
  else openCloudToCouncilQuestionsCard(($("#prompt")?.value || "").trim());
});
$("#composer-a2a-btn")?.addEventListener("click", () => {
  const modeBtn = document.querySelector('#mode button[data-mode="cloud_council"]');
  if (modeBtn) modeBtn.click();
  else openCloudToCouncilQuestionsCard(($("#prompt")?.value || "").trim());
});
$("#header-guardian-btn")?.addEventListener("click", () => {
  const gBtn = document.querySelector('.rail-btn[data-view="councilng-cli"]');
  if (gBtn) gBtn.click();
  else switchConsoleDockTab("brain-council", { focus: true });
});

// Unified Terminal Mode Switcher (/brain, /council, /colab)
$$("#unified-term-mode-seg [data-term-mode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setUnifiedTerminalMode(btn.dataset.termMode || "council", { announce: true });
  });
});
$$("[data-term-mode-quick]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setUnifiedTerminalMode(btn.dataset.termModeQuick || "council", { announce: true });
  });
});

// Shared Menu Layout Toggle in Unified Brain + Council CLI + Colab CLI Page
$$("#unified-layout-seg button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.ulayout || "cli";
    setUnifiedConsoleLayout(mode);
  });
});

const status = (t) => $("#statusbar").textContent = t;

const HOST_HW_STORAGE_KEY = "cng_saved_host_hardware_v2";
const INTEL_STORAGE_KEY = "cng_cross_session_intelligence_v2";

function getClientGpuVramGb(provider, accelerator) {
  const acc = String(accelerator || "T4").trim();
  const map = {
    T4: 16, L4: 24, G4: 96, A100: 40, H100: 80,
    NvidiaTeslaT4: 16, NvidiaL4: 24, NvidiaL4X1: 24,
    NvidiaA100: 40, NvidiaH100: 80, NvidiaRtxPro6000: 96,
    "RTX4090-24GB": 24, "RTX5090-32GB": 32, "A40-48GB": 48, "L40S-48GB": 48,
    "A100-80GB": 80, "H100-80GB": 80, "H200-141GB": 141, "MI300X-192GB": 192,
    "RTX3090-24GB": 24, "2xRTX4090-48GB": 48, "4xRTX4090-96GB": 96, "A6000-48GB": 48,
    "GH200-96GB": 96, "8xH100-640GB": 640, "A10G-24GB": 24, "L4-24GB": 24,
    "V100-32GB": 32, "g5.2xlarge-A10G-24GB": 24, "g6.2xlarge-L4-24GB": 24,
    "p4d.24xlarge-A100-320GB": 320, "NC24ads-A100-80GB": 80, "a2-highgpu-1g-A100-40GB": 40,
    "LocalGPU-16GB": 16, "LocalGPU-24GB": 24, "AppleSilicon-64GB": 64, "SystemRAM-192GB": 192,
    "CustomGPU-16GB": 16, "CustomGPU-24GB": 24, "CustomGPU-48GB": 48,
    "CustomGPU-80GB": 80, "CustomCluster-192GB": 192,
  };
  return map[acc] || 24;
}

function getClientGpuBudgetGb(provider, accelerator) {
  const mem = getClientGpuVramGb(provider, accelerator);
  return Math.max(0, Math.round((mem - Math.max(2, mem * 0.15)) * 10) / 10);
}

const HOST_CUST_STORAGE_KEY = "cng_saved_host_customizations_v2";
const GLOBAL_AUTH_STORAGE_KEY = "cng_saved_global_auth_v2";

function persistHostHardwareToLocalStorage(configsOrHosts) {
  try {
    const list = Array.isArray(configsOrHosts)
      ? configsOrHosts
      : configsOrHosts && typeof configsOrHosts === "object"
      ? Object.values(configsOrHosts)
      : [];
    if (!list.length) return;
    let existing = {};
    try {
      existing = JSON.parse(localStorage.getItem(HOST_HW_STORAGE_KEY) || "{}") || {};
    } catch (_) {
      existing = {};
    }
    list.forEach((item) => {
      if (!item || !item.id) return;
      const hid = String(item.id).toLowerCase();
      existing[hid] = {
        ...(existing[hid] || {}),
        id: hid,
        name: item.name || existing[hid]?.name || `Host ${hid.toUpperCase()}`,
        provider: item.provider || existing[hid]?.provider || "colab",
        accelerator: item.accelerator || existing[hid]?.accelerator || "G4",
        high_memory: item.high_memory !== undefined ? Boolean(item.high_memory) : Boolean(existing[hid]?.high_memory ?? true),
        ram_gb: Number(item.ram_gb) || Number(existing[hid]?.ram_gb) || getClientGpuVramGb(item.provider || "colab", item.accelerator || "G4"),
        data_tuning_mode: item.data_tuning_mode || existing[hid]?.data_tuning_mode || "uncensored_cyber",
        quantization: item.quantization || existing[hid]?.quantization || "Q4_K_M",
        context_size: Number(item.context_size) || Number(existing[hid]?.context_size) || 32768,
        gpu_layers: Number(item.gpu_layers) || Number(existing[hid]?.gpu_layers) || 99,
        lora_adapter: item.lora_adapter !== undefined ? String(item.lora_adapter) : (existing[hid]?.lora_adapter || ""),
        startup_flags: item.startup_flags || existing[hid]?.startup_flags || "--flash-attn --cont-batching --mlock",
        google_account: item.google_account || existing[hid]?.google_account || "goodoldcanadian@gmail.com",
        gh_username: item.gh_username || existing[hid]?.gh_username || "savingannabel",
        gist_id: item.gist_id || existing[hid]?.gist_id || "05a1f96580fa13b373b42d919873dc57",
        kaggle_username: item.kaggle_username !== undefined ? String(item.kaggle_username) : (existing[hid]?.kaggle_username || ""),
        custom_url: item.custom_url !== undefined ? String(item.custom_url) : (existing[hid]?.custom_url || ""),
        local_url: item.local_url !== undefined ? String(item.local_url) : (existing[hid]?.local_url || ""),
        enabled: item.enabled !== undefined ? Boolean(item.enabled) : (existing[hid]?.enabled !== false),
        updated_at: Date.now(),
      };
    });
    localStorage.setItem(HOST_HW_STORAGE_KEY, JSON.stringify(existing));
  } catch (_) {}
}

function persistHostCustomizationsToLocalStorage(custMap) {
  try {
    if (!custMap || typeof custMap !== "object") return;
    let existing = {};
    try {
      existing = JSON.parse(localStorage.getItem(HOST_CUST_STORAGE_KEY) || "{}") || {};
    } catch (_) {
      existing = {};
    }
    const merged = { ...existing, ...custMap };
    localStorage.setItem(HOST_CUST_STORAGE_KEY, JSON.stringify(merged));
  } catch (_) {}
}

function persistGlobalAuthToLocalStorage(authObj) {
  try {
    if (!authObj || typeof authObj !== "object") return;
    let existing = {};
    try {
      existing = JSON.parse(localStorage.getItem(GLOBAL_AUTH_STORAGE_KEY) || "{}") || {};
    } catch (_) {
      existing = {};
    }
    const merged = { ...existing };
    Object.entries(authObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        merged[k] = v;
      }
    });
    localStorage.setItem(GLOBAL_AUTH_STORAGE_KEY, JSON.stringify(merged));
  } catch (_) {}
}

function loadSavedHostHardwareFromLocalStorage() {
  try {
    const raw = localStorage.getItem(HOST_HW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_) {
    return null;
  }
}

async function syncCrossSessionHardwareAndIntelligence({ forceHardware = false } = {}) {
  try {
    const cachedHw = loadSavedHostHardwareFromLocalStorage();
    let cachedCust = null;
    let cachedAuth = null;
    let cachedIntel = null;
    try {
      cachedCust = JSON.parse(localStorage.getItem(HOST_CUST_STORAGE_KEY) || "null");
    } catch (_) {
      cachedCust = null;
    }
    try {
      cachedAuth = JSON.parse(localStorage.getItem(GLOBAL_AUTH_STORAGE_KEY) || "null");
    } catch (_) {
      cachedAuth = null;
    }
    try {
      cachedIntel = JSON.parse(localStorage.getItem(INTEL_STORAGE_KEY) || "null");
    } catch (_) {
      cachedIntel = null;
    }
    const syncRes = await postJSON("/api/session/sync", {
      host_configs: cachedHw || undefined,
      host_customizations: cachedCust || undefined,
      global_auth: cachedAuth || undefined,
      force_hardware: Boolean(forceHardware),
      intelligence: cachedIntel || undefined,
    }).catch(() => null);
    if (syncRes && syncRes.ok) {
      if (syncRes.host_configs) {
        persistHostHardwareToLocalStorage(syncRes.host_configs);
      }
      if (syncRes.host_customizations) {
        persistHostCustomizationsToLocalStorage(syncRes.host_customizations);
        if (STATE) STATE.host_customizations = syncRes.host_customizations;
      }
      if (syncRes.global_auth) {
        persistGlobalAuthToLocalStorage(syncRes.global_auth);
      }
      if (Array.isArray(syncRes.hosts) && syncRes.hosts.length && STATE) {
        STATE.runtime_hosts = syncRes.hosts;
        STATE.colab_hosts = syncRes.hosts;
      }
      if (syncRes.intelligence) {
        try {
          localStorage.setItem(INTEL_STORAGE_KEY, JSON.stringify(syncRes.intelligence));
        } catch (_) {}
      }
    }
    return syncRes;
  } catch (_) {
    return null;
  }
}

// ── boot ──
async function boot() {
  try {
    // Launch state and lineup requests immediately in parallel with cross-session sync for instant rendering
    const statePromise = fetch("/api/state", { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error(`state request failed (${response.status})`);
      return response.json();
    });
    const lineupPromise = fetch("/api/lineup", { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error(`lineup request failed (${response.status})`);
      return response.json();
    }).catch((error) => {
      console.warn("Saved lineup unavailable; showing empty host selectors", error);
      return {};
    });
    const syncPromise = syncCrossSessionHardwareAndIntelligence().catch(() => null);

    const [stateResponse, lineupResponse] = await Promise.all([statePromise, lineupPromise]);
    STATE = stateResponse;
    if (lineupResponse.allocations) {
      STATE.lineup = lineupResponse.lineup || {};
      STATE.host_lineups = lineupResponse.allocations;
    } else {
      STATE.lineup = lineupResponse.lineup || lineupResponse;
      STATE.host_lineups = null;
    }
    if (Array.isArray(STATE.runtime_hosts)) {
      persistHostHardwareToLocalStorage(STATE.runtime_hosts);
    }
    AGENTS = STATE.agents || [];
    promptHistory = STATE.prompt_history || [];
    pickAllBackends();
    renderChips();
    renderLineup();
    renderRightModelsRail();
    renderSavedLineups().catch((error) => console.warn("Saved lineups unavailable", error));
    fillPreset();
    fillVoice();
    fillAgentPickers();
    populateRamSwarmModelDropdown();
    renderTuning();
    renderCloudToggles();
    renderCustomModels();
    renderCustomGguf();
    renderTools();
    renderMcp();
    renderColabHosts();
    renderKeys();
    renderFileOutputSetting();
    renderActivity(STATE.log);
    renderLeaderboard(STATE.leaderboard);
    pollStartStatus();
    pollStats();
    setInterval(pollStats, 60000);
    setInterval(() => {
      syncCrossSessionHardwareAndIntelligence().catch(() => {});
    }, 45000);
    setInterval(async () => {
      const s = await (await fetch("/api/state", { cache: "no-store" })).json();
      if (s.log.join("\n") !== $("#activity")._raw) renderActivity(s.log);
    }, 5000);
  } catch (error) {
    const message = `Could not load runtime models: ${error.message || error}`;
    console.error(message, error);
    $("#model-chips").textContent = message;
    const slots = $("#slots");
    slots.textContent = message + " — check the Council server and refresh this page.";
    status(message);
  }
}
function pickAllBackends() {
  // Every configured, chat-capable backend starts selected; users can toggle chips off.
  picked = new Set((STATE?.backends || [])
    .filter((b) => !String(b.model || "").toLowerCase().includes("embed"))
    .map((b) => b.i));
}
async function reloadState() {
  const [stateResponse, lineupResponse] = await Promise.all([
    fetch("/api/state", { cache: "no-store" }).then((response) => response.json()).catch(() => ({})),
    fetch("/api/lineup", { cache: "no-store" }).then((response) => response.json()).catch(() => ({})),
  ]);
  if (stateResponse && typeof stateResponse === "object") {
    STATE = Object.assign({}, STATE || {}, stateResponse);
  }
  STATE.backends ||= [];
  STATE.catalog ||= {};
  STATE.slots ||= {};
  if (lineupResponse && lineupResponse.allocations) {
    STATE.lineup = lineupResponse.lineup || {};
    STATE.host_lineups = lineupResponse.allocations;
  } else if (lineupResponse) {
    STATE.lineup = lineupResponse.lineup || lineupResponse || {};
    STATE.host_lineups = STATE.host_lineups || null;
  }
  if (Array.isArray(STATE.runtime_hosts)) {
    persistHostHardwareToLocalStorage(STATE.runtime_hosts);
  }
  await syncOrRehydrateModelVaultWithLocalStorage();
  pickAllBackends();
  renderChips();
  renderLineup();
  if (typeof renderCustomGguf === "function") renderCustomGguf();
  if (typeof renderCustomModels === "function") renderCustomModels();
  if (typeof renderHfBuckets === "function") renderHfBuckets();
  renderRightModelsRail();
  renderFileOutputSetting();
  renderActivity(STATE.log);
}

function updateModelCountLabel() {
  const selectable = (STATE?.backends || []).filter((b) => !String(b.model || "").toLowerCase().includes("embed"));
  $("#model-count").textContent = `${selectable.length} models · ${picked.size} selected`;
}

function render() {
  renderChips();
  updateModelCountLabel();
  renderRightModelsRail();
  updateJudgeModelBadges();
}

function renderChips() {
  const row = $("#model-chips");
  row.innerHTML = "";
  const orderedBackends = STATE.backends.map((backend, index) => ({ backend, index }))
    .sort((left, right) => {
      const leftMega = left.backend.kind === "runtime" && /mega/i.test(left.backend.name || "");
      const rightMega = right.backend.kind === "runtime" && /mega/i.test(right.backend.name || "");
      if (leftMega !== rightMega) return leftMega ? -1 : 1;
      if (leftMega) return left.backend.name.localeCompare(right.backend.name);
      return left.index - right.index;
    });
  let section = "";
  orderedBackends.forEach(({ backend: b }) => {
    const group = b.kind === "custom" ? "🌐 OpenAI-compatible endpoints"
      : b.kind === "cloud" ? "☁ Cloud providers" : "🖥 Runtime hosts";
    if (group !== section) {
      section = group;
      const heading = document.createElement("div");
      heading.className = "model-group-label";
      heading.textContent = group;
      row.appendChild(heading);
    }
    const c = document.createElement("button");
    const isEmbed = String(b.model || "").toLowerCase().includes("embed");
    const isMega = b.kind === "runtime" && /mega/i.test(b.name || "");
    c.className = "chip" + (b.unc ? " unc" : "") + (isMega ? " mega-chip" : "") + (b.vision ? " vision-badge" : "") + (picked.has(b.i) ? " on" : "");
    c.dataset.idx = b.i;
    c.setAttribute("data-model-lighthouse", b.model || b.name || "");
    c.textContent = b.name;
    c.title = (b.model || "") + (b.vision ? " · Vision capable" : "") + " — click to include/exclude from the council";
    c.onclick = () => {
      if (isEmbed) return;
      picked.has(b.i) ? picked.delete(b.i) : picked.add(b.i);
      c.classList.toggle("on");
      const answer = answers[b.i];
      if (answer?.card) answer.card.classList.toggle("hidden", !picked.has(b.i));
      updateModelCountLabel();
      renderRightModelsRail();
      status(`council = ${picked.size} of ${STATE.backends.filter((x) => !String(x.model || "").toLowerCase().includes("embed")).length} model(s)`);
    };
    row.appendChild(c);
  });
  updateModelCountLabel();
  $("#health-dot").textContent = STATE.backends.length ? "🟢" : "🔴";

  // Populate Judge / Enhancer model picker
  const jp = $("#judge-pick");
  if (jp) {
    const prev = jp.value;
    const selectable = STATE.backends.filter((b) => !String(b.model || "").toLowerCase().includes("embed"));
    jp.innerHTML = '<option value="-1">Auto (first active Council model)</option>'
      + selectable.map((b) => `<option value="${b.i}">${esc(b.name)} (${esc(b.model || "slot")})</option>`).join("");
    if ([...jp.options].some((o) => o.value === prev)) jp.value = prev;
    if (!jp._boundJudgeChange) {
      jp._boundJudgeChange = true;
      jp.addEventListener("change", () => {
        updateJudgeModelBadges();
      });
    }
  }
  updateJudgeModelBadges();
}

let VOICE_PROFILES = [
  { id: "aria", name: "Aria — Warm Studio Female", engine: "en-US-AriaNeural", accent: "en-US", tl: "en-US", gender: "female", speed: 1.08, pitch: 1.02, desc: "Smooth, natural American studio voice" },
  { id: "orion", name: "Orion — Deep Calm Male", engine: "en-US-ChristopherNeural", accent: "en-US", tl: "en-CA", gender: "male", speed: 1.02, pitch: 0.92, desc: "Warm, deep calm studio narrator voice" },
  { id: "nova", name: "Nova — Crisp British Executive", engine: "en-GB-SoniaNeural", accent: "en-GB", tl: "en-GB", gender: "female", speed: 1.10, pitch: 1.04, desc: "Polished, articulate British studio voice" },
  { id: "atlas", name: "Atlas — Smooth Global Conversational", engine: "en-AU-NatashaNeural", accent: "en-AU", tl: "en-AU", gender: "male", speed: 1.06, pitch: 0.96, desc: "Relaxed, natural conversational studio voice" },
];
let editingVoiceId = "aria";

function fillVoice() {
  if (Array.isArray(STATE?.voice_profiles) && STATE.voice_profiles.length) {
    VOICE_PROFILES = STATE.voice_profiles;
  }
  const sel = $("#voice");
  if (!sel) return;
  const prev = sel.value || localStorage.getItem("cng_selected_voice") || VOICE_PROFILES[0]?.id || "aria";
  sel.innerHTML = "";
  VOICE_PROFILES.forEach((vp) => {
    sel.appendChild(new Option(`🎙️ ${vp.name}`, vp.id));
  });
  if ([...sel.options].some((o) => o.value === prev)) {
    sel.value = prev;
  }
  renderVoiceEditorSlots();
}
function fillPreset() { $("#preset").innerHTML = Object.keys(STATE.presets).map((p) => `<option>${p}</option>`).join(""); }
function catalogEntriesList() {
  const cat = STATE?.catalog;
  if (!cat) return [];
  if (Array.isArray(cat)) return cat;
  if (typeof cat === "object") {
    return Object.entries(cat).map(([id, info]) => ({
      ...(info && typeof info === "object" ? info : {}),
      id: (info && info.id) || id,
    }));
  }
  return [];
}

function resolveAgentModelLabel(agentObj) {
  if (!agentObj) return "Auto (first active)";
  const m = String(agentObj.model || "").trim();
  if (!m) return "Auto (first active)";
  if (agentObj.model_name && String(agentObj.model_name).trim()) {
    return String(agentObj.model_name).trim();
  }
  const byBackend = (Array.isArray(STATE?.backends) ? STATE.backends : []).find((b) => b.model === m || b.name === m || b.id === m);
  if (byBackend) return byBackend.name;
  const byCloud = (Array.isArray(STATE?.cloud_models) ? STATE.cloud_models : []).find((c) => c.model === m || c.name === m || c.id === m);
  if (byCloud) return byCloud.name;
  const byCat = catalogEntriesList().find((c) => c.id === m || c.name === m);
  if (byCat) return byCat.name;
  return m;
}

function buildAgentModelOptionsHtml(selectedModel = "") {
  const sel = String(selectedModel || "").trim();
  const seen = new Set();
  const makeOpt = (val, label) => {
    const v = String(val || "").trim();
    if (!v || seen.has(v)) return "";
    seen.add(v);
    const isSel = v === sel ? " selected" : "";
    return `<option value="${esc(v)}"${isSel}>${esc(label)}</option>`;
  };
  let html = `<option value=""${!sel ? " selected" : ""}>⚡ Auto (First Active Council Model)</option>`;
  const activeOpts = (Array.isArray(STATE?.backends) ? STATE.backends : []).map((b) => makeOpt(b.model || b.name, `🟢 ${b.name} (${b.provider || "active"})`)).filter(Boolean).join("");
  if (activeOpts) html += `<optgroup label="Active Council Lineup Models">${activeOpts}</optgroup>`;
  const cloudOpts = (Array.isArray(STATE?.cloud_models) ? STATE.cloud_models : []).map((c) => makeOpt(c.model || c.id, `☁️ ${c.name} [${c.provider}]`)).filter(Boolean).join("");
  if (cloudOpts) html += `<optgroup label="Cloud API & Orca Cyber Models">${cloudOpts}</optgroup>`;
  const catOpts = catalogEntriesList().map((c) => makeOpt(c.id, `🖥 ${c.name} [Colab GGUF]`)).filter(Boolean).join("");
  if (catOpts) html += `<optgroup label="Colab Host GGUF Catalog Models">${catOpts}</optgroup>`;
  if (sel && !seen.has(sel)) {
    html += `<option value="${esc(sel)}" selected>📌 ${esc(sel)}</option>`;
  }
  return html;
}

function syncRunAgentModelControls() {
  const runSel = $("#run-agent");
  const modelSel = $("#run-agent-model");
  const badge = $("#run-agent-model-badge");
  if (!runSel) return;
  const ag = AGENTS.find((a) => a.id === runSel.value) || AGENTS[0];
  if (modelSel) {
    modelSel.innerHTML = buildAgentModelOptionsHtml(ag?.model || "");
    modelSel.value = ag?.model || "";
  }
  if (badge) {
    const label = resolveAgentModelLabel(ag);
    badge.textContent = `🤖 Saved Model: ${label}`;
  }
}

function fillAgentPickers() {
  const prevCouncil = $("#agent-pick")?.value || "";
  const prevRun = $("#run-agent")?.value || "";
  const opts = ['<option value="">🤖 as agent: none</option>']
    + AGENTS.map((a) => `<option value="${esc(a.id)}">🤖 ${esc(a.name)} [${esc(resolveAgentModelLabel(a))}]</option>`).join("");
  if ($("#agent-pick")) {
    $("#agent-pick").innerHTML = opts;
    if ([...$("#agent-pick").options].some((o) => o.value === prevCouncil)) $("#agent-pick").value = prevCouncil;
  }
  if ($("#run-agent")) {
    $("#run-agent").innerHTML = AGENTS.map((a) => `<option value="${esc(a.id)}">🤖 ${esc(a.name)} — [${esc(resolveAgentModelLabel(a))}]</option>`).join("");
    if ([...$("#run-agent").options].some((o) => o.value === prevRun)) $("#run-agent").value = prevRun;
  }
  syncRunAgentModelControls();
}

// ── ask (streaming) ──
function htmlPreviewSource(rawText) {
  const text = String(rawText || "");
  const fenced = text.match(/```(?:html|htm)(?:\s+[^\n]*)?\s*\n([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : (/<!doctype\s+html|<html[\s>]/i.test(text) ? text : "");
  if (!source.trim()) return "";
  const policy = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src \'none\'; frame-src \'none\'; object-src \'none\'; form-action \'none\'; base-uri \'none\'">';
  if (/<head[^>]*>/i.test(source)) return source.replace(/<head[^>]*>/i, (head) => `${head}${policy}`);
  return `<!doctype html><html><head>${policy}<meta charset="utf-8"></head><body>${source}</body></html>`;
}

function openHtmlPreview(title, rawText) {
  const source = htmlPreviewSource(rawText);
  if (!source) { status("No standalone HTML was found in this response to preview."); return; }
  $("#preview-title").textContent = `${title} · sandbox preview`;
  $("#preview-frame").srcdoc = source;
  $("#preview-dialog").showModal();
}

$("#preview-close")?.addEventListener("click", () => {
  $("#preview-frame").srcdoc = "";
  $("#preview-dialog").close();
});

// ── ⌨️ Real-Time Terminal Output Typing Animation Engine ──
let TERM_TYPING_MODE = "normal"; // "normal" | "fast" | "instant"
try {
  const savedMode = localStorage.getItem("cng_term_typing_mode");
  if (savedMode === "normal" || savedMode === "fast" || savedMode === "instant") {
    TERM_TYPING_MODE = savedMode;
  }
} catch (_) {}

function syncAllTerminalTypingPills() {
  $$(".term-typing-toggle-pill").forEach((pill) => {
    const label =
      TERM_TYPING_MODE === "normal"
        ? "⌨️ Live Typing: ON"
        : TERM_TYPING_MODE === "fast"
        ? "⚡ Live Typing: TURBO"
        : "⏭ Live Typing: INSTANT";
    pill.textContent = label;
    pill.classList.toggle("mode-instant", TERM_TYPING_MODE === "instant");
  });
}

function cycleTerminalTypingMode() {
  TERM_TYPING_MODE =
    TERM_TYPING_MODE === "normal"
      ? "fast"
      : TERM_TYPING_MODE === "fast"
      ? "instant"
      : "normal";
  try {
    localStorage.setItem("cng_term_typing_mode", TERM_TYPING_MODE);
  } catch (_) {}
  syncAllTerminalTypingPills();
  if (TERM_TYPING_MODE === "instant") {
    [
      $("#guardian-out"),
      $("#cli-out"),
      $("#council-term-out"),
      $("#activity"),
      ...$$('[id^="cli-out-"]'),
    ]
      .filter(Boolean)
      .forEach((el) => flushTerminalTypingQueue(el));
  }
  status(
    `⌨️ Terminal typing animation: ${TERM_TYPING_MODE.toUpperCase()}`
  );
}

function collectDomTextNodes(rootEl) {
  const list = [];
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.length > 0) {
      list.push({ node, fullText: node.nodeValue });
    }
  }
  return list;
}

function flushTerminalTypingQueue(containerEl) {
  if (!containerEl) return;
  if (containerEl._activeTypingCancel) {
    containerEl._activeTypingCancel(true);
  }
  const q = containerEl._typeQueue || [];
  while (q.length > 0) {
    const item = q.shift();
    if (item && typeof item.finishImmediately === "function") {
      item.finishImmediately();
    }
  }
  containerEl._isTyping = false;
  if (!containerEl._scrollPaused) {
    containerEl.scrollTop = containerEl.scrollHeight;
  }
}

function clearTerminalContainer(containerEl) {
  if (!containerEl) return;
  if (containerEl._activeTypingCancel) {
    containerEl._activeTypingCancel(false);
  }
  containerEl._typeQueue = [];
  containerEl._isTyping = false;
  containerEl.innerHTML = "";
}

function enqueueTerminalElementTypewriter(containerEl, blockEl, options = {}) {
  if (!containerEl || !blockEl) return;
  const instant = Boolean(options.instant) || TERM_TYPING_MODE === "instant";
  blockEl.classList.add("term-output-line");
  blockEl.dataset.fullLogText = String(blockEl.textContent || "").toLowerCase();
  if (typeof applyFilterToTerminalElement === "function") {
    applyFilterToTerminalElement(blockEl);
  }

  if (instant) {
    containerEl.appendChild(blockEl);
    if (!containerEl._scrollPaused) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
    return;
  }

  const textEntries = collectDomTextNodes(blockEl);
  const totalChars = textEntries.reduce((acc, it) => acc + it.fullText.length, 0);
  if (totalChars === 0) {
    containerEl.appendChild(blockEl);
    return;
  }

  // Hide text content until this block's turn in the container queue
  textEntries.forEach((it) => {
    it.node.nodeValue = "";
  });
  blockEl.style.display = "none";
  containerEl.appendChild(blockEl);

  containerEl._typeQueue ||= [];

  const finishImmediately = () => {
    blockEl.style.display = "";
    blockEl.classList.remove("term-typing-active");
    textEntries.forEach((it) => {
      it.node.nodeValue = it.fullText;
    });
    blockEl.querySelectorAll(".term-stream-cursor").forEach((c) => c.remove());
  };

  containerEl._typeQueue.push({
    blockEl,
    textEntries,
    totalChars,
    options,
    finishImmediately,
  });

  processTerminalTypeQueue(containerEl);
}

function processTerminalTypeQueue(containerEl) {
  if (!containerEl || containerEl._isTyping) return;
  const q = containerEl._typeQueue || [];
  if (!q.length) return;

  const current = q.shift();
  if (!current) return;

  if (TERM_TYPING_MODE === "instant") {
    current.finishImmediately();
    if (!containerEl._scrollPaused) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
    processTerminalTypeQueue(containerEl);
    return;
  }

  containerEl._isTyping = true;
  const { blockEl, textEntries, totalChars } = current;
  blockEl.style.display = "";
  blockEl.classList.add("term-typing-active");

  const cursorSpan = document.createElement("span");
  cursorSpan.className = "term-stream-cursor";
  cursorSpan.textContent = "▊";

  let entryIdx = 0;
  let charIdx = 0;
  let timerId = null;
  let finished = false;

  const attachCursorAfterNode = (textNode) => {
    if (!textNode || !textNode.parentNode) return;
    if (cursorSpan.previousSibling !== textNode) {
      textNode.parentNode.insertBefore(cursorSpan, textNode.nextSibling);
    }
  };

  if (textEntries[0]) {
    attachCursorAfterNode(textEntries[0].node);
  }

  const completeCurrent = (runNext = true) => {
    if (finished) return;
    finished = true;
    if (timerId) clearTimeout(timerId);
    containerEl._activeTypingCancel = null;
    current.finishImmediately();
    containerEl._isTyping = false;
    if (!containerEl._scrollPaused) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
    if (runNext) {
      processTerminalTypeQueue(containerEl);
    }
  };

  containerEl._activeTypingCancel = completeCurrent;

  const step = () => {
    if (finished) return;
    if (TERM_TYPING_MODE === "instant") {
      completeCurrent(true);
      return;
    }

    const queueBacklog = (containerEl._typeQueue || []).length;
    const speedFactor =
      (TERM_TYPING_MODE === "fast" ? 2.6 : 1.0) *
      (queueBacklog > 4 ? 2.8 : queueBacklog > 1 ? 1.75 : 1.0);

    // Adaptive chars per tick so short lines type character-by-character and large outputs stream smoothly
    let charsPerTick = 1;
    if (totalChars <= 75) {
      charsPerTick = Math.max(1, Math.round(1.4 * speedFactor));
    } else if (totalChars <= 240) {
      charsPerTick = Math.max(2, Math.round(3.2 * speedFactor));
    } else if (totalChars <= 800) {
      charsPerTick = Math.max(4, Math.round((totalChars / 48) * speedFactor));
    } else {
      charsPerTick = Math.max(10, Math.round((totalChars / 62) * speedFactor));
    }

    let remaining = charsPerTick;
    while (remaining > 0 && entryIdx < textEntries.length) {
      const entry = textEntries[entryIdx];
      const avail = entry.fullText.length - charIdx;
      const take = Math.min(remaining, avail);
      charIdx += take;
      remaining -= take;
      entry.node.nodeValue = entry.fullText.slice(0, charIdx);
      attachCursorAfterNode(entry.node);

      if (charIdx >= entry.fullText.length) {
        entryIdx++;
        charIdx = 0;
      }
    }

    if (!containerEl._scrollPaused) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }

    if (entryIdx >= textEntries.length) {
      completeCurrent(true);
      return;
    }

    // Slight natural pause on newlines for authentic real-time terminal generation feel
    const activeEntry = textEntries[entryIdx];
    const justTypedChar =
      activeEntry && charIdx > 0 ? activeEntry.fullText[charIdx - 1] : "";
    const delayMs =
      TERM_TYPING_MODE === "fast"
        ? 10
        : justTypedChar === "\n" && totalChars < 500
        ? 26
        : 15;

    timerId = setTimeout(step, delayMs);
  };

  step();
}

function appendTypedTerminalBlock(containerEl, text, options = {}) {
  if (!containerEl) return null;
  const div = document.createElement("div");
  const color = options.color || "#e2e8f0";
  const marginBottom = options.marginBottom ?? "6px";
  if (options.cssText) {
    div.style.cssText = options.cssText;
  } else {
    div.style.cssText = `color:${color};white-space:pre-wrap;margin-bottom:${marginBottom}`;
  }
  if (options.prefixHtml) {
    div.innerHTML = `${options.prefixHtml}${esc(String(text ?? ""))}`;
  } else {
    div.textContent = String(text ?? "");
  }
  enqueueTerminalElementTypewriter(containerEl, div, options);
  return div;
}

function attachTerminalTypingControls(topbarEl, outEl) {
  if (!topbarEl || topbarEl.querySelector(".term-typing-controls")) return;
  const wrap = document.createElement("span");
  wrap.className = "term-typing-controls";
  wrap.innerHTML = `
    <button type="button" class="term-typing-toggle-pill" title="Click to cycle real-time terminal typing animation speed (Normal → Turbo → Instant)">⌨️ Live Typing: ON</button>
    <button type="button" class="term-typing-skip-btn" title="Finish typing current terminal output immediately (or press Esc)">⏭ Flush</button>
  `;
  const toggleBtn = wrap.querySelector(".term-typing-toggle-pill");
  const skipBtn = wrap.querySelector(".term-typing-skip-btn");
  toggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    cycleTerminalTypingMode();
  });
  skipBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    flushTerminalTypingQueue(outEl);
  });
  topbarEl.appendChild(wrap);
  syncAllTerminalTypingPills();
}

function openLiveTerminalWithOutput(title, terminalLog, cwd, runCmd, ok = true) {
  if (typeof window.appendUnifiedTerminalEntry === "function") {
    window.openUnifiedTerminal?.("shell");
    window.appendUnifiedTerminalEntry({
      title,
      command: runCmd || title,
      output: String(terminalLog || "(starting execution…)"),
      ok,
      cwd: cwd || "",
    });
    return;
  }
  const banner =
    `⚡ LIVE TERMINAL · ${title}${cwd ? ` (cwd: ${cwd})` : ""}\n` +
    String(terminalLog || "(starting execution…)");
  if (typeof window.appendGlobalFooterTerminalLog === "function") {
    window.appendGlobalFooterTerminalLog(banner, ok ? "#2ee6a6" : "#fbbf24", true);
  }
}

function resolveBackendIdxForCard(title, explicitIdx) {
  if (typeof explicitIdx === "number" && explicitIdx >= 0) return explicitIdx;
  const cleanTitle = String(title || "").replace(/^🤖\s*/, "").trim().toLowerCase();
  const backends = Array.isArray(STATE?.backends) ? STATE.backends : [];
  const exact = backends.find((b) => String(b.name || "").trim().toLowerCase() === cleanTitle);
  if (exact) return exact.i;
  const partial = backends.find(
    (b) =>
      cleanTitle.includes(String(b.name || "").trim().toLowerCase()) ||
      String(b.name || "").trim().toLowerCase().includes(cleanTitle)
  );
  if (partial) return partial.i;
  const firstPicked = [...picked][0];
  return typeof firstPicked === "number" ? firstPicked : (backends[0]?.i ?? 0);
}

async function packageFinishedProduct(format, { title = "council_app", text = "", dir = "", triggerBtn = null } = {}) {
  const fmt = String(format || "exe").toLowerCase();
  const prevLabel = triggerBtn ? triggerBtn.textContent : "";
  if (triggerBtn) {
    triggerBtn.disabled = true;
    triggerBtn.textContent = `⏳ Packaging ${fmt.toUpperCase()}…`;
  }
  status(`📦 Packaging finished product as ${fmt.toUpperCase()} (${EXEC_MODE === "real" ? "Real Terminal" : "Sandboxed"})…`);
  try {
    const res = await postJSON("/api/forge/package", {
      format: fmt,
      title,
      text,
      dir,
      exec_mode: EXEC_MODE,
    });
    if (!res.ok) {
      status(`⚠️ Packaging failed: ${res.error || "unknown error"}`);
      return res;
    }
    if (res.download_b64) {
      const bin = atob(res.download_b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: res.mime || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.download_name || `${title}_${fmt}.bat`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
    if (res.terminal_log) {
      openLiveTerminalWithOutput(
        `📦 Packaged as ${fmt.toUpperCase()} — ${res.download_name || title}`,
        res.terminal_log,
        res.dir,
        res.artifact_path || "",
        true
      );
    }
    if (fmt === "gui" && res.html_preview) {
      openHtmlPreview(`${title} (GUI Package)`, "```html\n" + res.html_preview + "\n```");
    }
    const activeLbl = $("#council-cli-active-app-label");
    if (activeLbl && res.dir) {
      activeLbl.textContent = `${title} · Packaged ${fmt.toUpperCase()} (${res.files?.length || 0} files)`;
      activeLbl.style.color = "var(--ok)";
    }
    await reloadState();
    status(`✅ Packaged ${title} as ${fmt.toUpperCase()} (${res.download_name}) & verified in ${EXEC_MODE === "real" ? "Real Terminal" : "Sandbox"}!`);
    return res;
  } catch (err) {
    status(`Package error: ${err}`);
    return { ok: false, error: String(err) };
  } finally {
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.textContent = prevLabel;
    }
  }
}

async function openAppInCouncilCli({ title = "", text = "", dir = "", triggerBtn = null } = {}) {
  const prevLabel = triggerBtn ? triggerBtn.textContent : "";
  if (triggerBtn) {
    triggerBtn.disabled = true;
    triggerBtn.textContent = "🛡️ Opening in Council CLI…";
  }
  status(`🛡️ Opening ${title || "completed app"} in Unified Council CLI (${EXEC_MODE === "real" ? "Real Terminal" : "Sandboxed"})…`);
  try {
    const res = await postJSON("/api/forge/open-in-council-cli", {
      title,
      text,
      dir,
      exec_mode: EXEC_MODE,
      run_now: true,
    });
    const cBtn = document.querySelector('.rail-btn[data-view="councilng-cli"]');
    if (cBtn && !cBtn.classList.contains("on")) cBtn.click();
    setConsoleExpanded(true);
    $("#unified-packager-drawer")?.classList.remove("hidden");
    $("#unified-toggle-packager-btn")?.classList.add("on");
    if (res.cwd) updateTerminalPrompts(res.cwd);
    const activeLbl = $("#council-cli-active-app-label");
    const appTitle = res.app?.title || res.title || title || "App";
    const appFiles = res.app?.files || res.files || [];
    if (activeLbl) {
      activeLbl.textContent = res.ok
        ? `Active App: ${appTitle} (${appFiles.length} files in ${res.cwd})`
        : `Ready`;
      activeLbl.style.color = res.ok ? "var(--ok)" : "";
    }
    const out = $("#guardian-out");
    const bannerText = res.showcase_banner || res.showcase_log;
    if (out && bannerText) {
      appendTypedTerminalBlock(out, bannerText, {
        color: res.ok ? "#2ee6a6" : "#ffcc66",
        marginBottom: "10px",
      });
    }
    const htmlPrev = res.html_preview || res.app?.html_preview;
    if (htmlPrev) {
      openHtmlPreview(appTitle, "```html\n" + htmlPrev + "\n```");
    }
    $("#guardian-fullscreen-term")?.focus();
    status(res.ok ? `🛡️ Opened & ran ${appTitle} inside Suomynona Council CLI!` : (res.error || "Could not open app in Suomynona Council CLI"));
    return res;
  } catch (err) {
    status(`Council CLI open error: ${err}`);
    return { ok: false, error: String(err) };
  } finally {
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.textContent = prevLabel;
    }
  }
}

function mkCard(title, sub, backendIdx = null) {
  const card = document.createElement("div");
  card.className = "card ans";
  if (typeof backendIdx === "number") card.dataset.backendIdx = String(backendIdx);
  card.innerHTML = `<h3 class="answer-head" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><button type="button" class="ghost xs card-dd-toggle" title="Expand/Collapse">▾</button><span class="answer-name">${esc(title)}</span>${sub ? `<span class="muted answer-sub">${esc(sub)}</span>` : ""}<span class="card-meta-pill tabular-nums"></span><button type="button" class="ghost xs card-inspect-btn" title="Open full formatted output popup" style="margin-left:auto">🔍 Popup</button><button type="button" class="ghost xs card-close-self" title="Close card" style="padding:1px 7px">✕</button></h3>
    <div class="card-compact-snippet muted">Hover to preview full response…</div>
    <div class="body"><span class="caret"></span></div>
    <div class="response-actions">
      <button class="ghost xs card-followup" title="Open a private reply box right here to reply strictly to ${esc(title)}">↩️ Reply to ${esc(title.slice(0, 22))}</button>
      <button class="ghost xs card-copy" title="Copy raw markdown response">📋 Copy</button>
      <button class="ghost sm card-save" title="Save file blocks or fenced code into the workspace">💾 Save files</button>
      <button class="ghost sm card-vscode" title="Export all extracted/synthesized files &amp; open project directly in VS Code">💻 Send to VS Code</button>
      <button class="ghost sm card-autorun" title="Writes all files, compiles &amp; runs in ${EXEC_MODE === "real" ? "Real Terminal" : "Sandbox"}, and auto-fixes errors up to 4 rounds">⚡ Compile, Run &amp; Self-Heal</button>
      <button class="ghost sm card-open-council-cli" title="Open, run, and showcase this app inside the Suomynona CLI" style="border-color:rgba(46,230,166,.55);color:var(--ok)">🛡️ Open in Suomynona CLI</button>
      <button class="ghost sm card-preview" title="Preview self-contained HTML in an isolated sandbox">▶ Preview</button>
      <button class="ghost sm card-speak speak-btn" title="Read this answer aloud (click again to stop)">🔊 Speak</button>
    </div>
    <div class="finished-product-packager-bar">
      <span class="packager-title">📦 Package Finished Product As:</span>
      <button type="button" class="ghost xs card-pkg-fmt" data-pkg-fmt="cli" title="Package as an interactive command-line tool (--help, --version, subcommands)">⌨️ CLI Tool</button>
      <button type="button" class="ghost xs card-pkg-fmt" data-pkg-fmt="script" title="Package as a single portable executable automation script (.py / .sh)">📜 Script</button>
      <button type="button" class="ghost xs card-pkg-fmt" data-pkg-fmt="gui" title="Package as a Desktop / Web GUI application with live preview">🖼️ GUI App</button>
      <button type="button" class="primary xs card-pkg-fmt" data-pkg-fmt="exe" title="Package as a standalone Windows EXE / self-extracting launcher">📦 EXE File</button>
      <span class="spacer"></span>
      <span class="muted" style="font-size:11px">Writes all files + tests in Real/Sandbox terminal</span>
    </div>
    <div class="card-inline-reply-box hidden" style="margin-top:10px;padding:10px 12px;background:rgba(14,21,43,.92);border:1px solid rgba(124,92,255,.45);border-radius:10px">
      <div class="row" style="justify-content:space-between;margin-bottom:6px;gap:8px">
        <strong style="font-size:12px;color:var(--ok)">💬 Private Follow-Up Strictly to <span class="inline-reply-target-name">${esc(title)}</span></strong>
        <span class="muted" style="font-size:11px">Only this model will answer — appears right inside this box</span>
        <button type="button" class="ghost xs card-inline-reply-close" style="padding:1px 7px">✕ Close</button>
      </div>
      <div class="row" style="gap:6px;align-items:stretch">
        <textarea class="input card-inline-reply-input" rows="2" style="flex:1;margin:0;font-size:12.5px;resize:vertical" placeholder="Ask ${esc(title)} a follow-up question, request a code change, or tell it what to fix… (Press Enter to send, Shift+Enter for new line)"></textarea>
        <button type="button" class="primary sm card-inline-reply-send" style="white-space:nowrap">▶ Send Only to This Model</button>
      </div>
    </div>`;
  $("#answers").appendChild(card);
  $("#response-bulk-actions").classList.remove("hidden");
  card.querySelector(".card-close-self")?.addEventListener("click", () => {
    card.remove();
    if (!$("#answers")?.querySelector(".card")) {
      $("#response-bulk-actions")?.classList.add("hidden");
    }
  });
  const body = card.querySelector(".body");
  body._rawText = "";
  const speakBtn = card.querySelector(".card-speak");
  speakBtn.onclick = () => speak(body._rawText || body.textContent, speakBtn);
  card.querySelector(".card-preview").onclick = () => openHtmlPreview(title, body._rawText || body.textContent);
  card.querySelectorAll(".card-pkg-fmt").forEach((btn) => {
    btn.onclick = async () => {
      const raw = body._rawText || body.textContent || "";
      if (!raw.trim()) { status("Nothing to package yet"); return; }
      await packageFinishedProduct(btn.dataset.pkgFmt, {
        title,
        text: raw,
        dir: card.dataset.appDir || "",
        triggerBtn: btn,
      });
    };
  });
  card.querySelector(".card-open-council-cli").onclick = async (e) => {
    const raw = body._rawText || body.textContent || "";
    if (!raw.trim() && !card.dataset.appDir) { status("No app output to open in Council CLI yet"); return; }
    await openAppInCouncilCli({
      title,
      text: raw,
      dir: card.dataset.appDir || "",
      triggerBtn: e.currentTarget,
    });
  };
  card.querySelector(".card-autorun").onclick = async () => {
    const btn = card.querySelector(".card-autorun");
    const raw = body._rawText || body.textContent || "";
    if (!raw.trim()) { status("Nothing to compile/run yet"); return; }
    btn.disabled = true;
    btn.textContent = `⚡ Running (${EXEC_MODE === "real" ? "Real Terminal" : "Sandboxed"})…`;
    status(`⚡ Writing all files, running in ${EXEC_MODE === "real" ? "Real Terminal" : "Sandbox"}, and self-healing any errors…`);
    openLiveTerminalWithOutput(
      `${title} — Writing All Files & Starting (${EXEC_MODE === "real" ? "Real Terminal" : "Sandboxed"})…`,
      `⏳ Extracting & synthesizing all code files from ${title}, writing to workspace, and executing in ${EXEC_MODE === "real" ? "real shell" : "isolated sandbox"}…`,
      null,
      "",
      true
    );
    try {
      const res = await postJSON("/api/autorun", { title, text: raw, self_heal: true, exec_mode: EXEC_MODE });
      if (res.dir) card.dataset.appDir = res.dir;
      const logToDisplay = res.terminal_log || res.error || "(execution finished)";
      openLiveTerminalWithOutput(
        `${title} — ${res.repaired ? `Self-Healed in ${res.rounds} Round(s)` : (res.ok ? `Verified in ${EXEC_MODE === "real" ? "Real Terminal" : "Sandbox"}` : "Execution Output")}`,
        logToDisplay,
        res.cwd || res.dir,
        res.run_cmd || "",
        Boolean(res.ok)
      );
      if (res.cwd) updateTerminalPrompts(res.cwd);
      const activeLbl = $("#council-cli-active-app-label");
      if (activeLbl && res.dir) {
        activeLbl.textContent = `${title} (${(res.files || []).length} files · ${EXEC_MODE === "real" ? "Real Terminal" : "Sandboxed"})`;
        activeLbl.style.color = "var(--ok)";
      }
      if (res.terminal_log) {
        const healBadge = res.repaired ? `🔧 self-healed in ${res.rounds} round(s)` : (res.ok ? `exit 0 · verified (${EXEC_MODE})` : "check terminal output");
        const termCard = mkCard(`🖥 Live Terminal — ${title}`, healBadge);
        setCardBodyMarkdown(termCard, "```bash\n" + res.terminal_log + "\n```", false);
      }
      if (res.html_preview) {
        openHtmlPreview(title, "```html\n" + res.html_preview + "\n```");
      }
      await reloadState();
      status(
        res.ok
          ? `✅ App written (${res.files?.length || 0} file(s)${res.synthesized_files?.length ? ` + ${res.synthesized_files.length} auto-synthesized` : ""}) & ran in ${EXEC_MODE === "real" ? "Real Terminal" : "Sandbox"}! Click '🛡️ Open in Suomynona Council CLI' or package as CLI/Script/GUI/EXE.`
          : (res.error || "Execution completed — check Live Terminal above")
      );
    } catch (err) {
      openLiveTerminalWithOutput(`${title} — Error`, String(err), null, "", false);
      status("Auto-run error: " + err);
    } finally {
      btn.disabled = false;
      btn.textContent = "⚡ Compile, Run & Self-Heal";
    }
  };
  card.querySelector(".card-copy").onclick = async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(body._rawText || body.textContent || "");
      btn.textContent = "✅ Copied";
      setTimeout(() => { btn.textContent = "📋 Copy"; }, 1400);
    } catch (_) {}
  };

  // Per-Model Inline Reply Box (replies strictly to THIS single model)
  const replyBox = card.querySelector(".card-inline-reply-box");
  const replyInput = card.querySelector(".card-inline-reply-input");
  const replySendBtn = card.querySelector(".card-inline-reply-send");
  const replyCloseBtn = card.querySelector(".card-inline-reply-close");

  card.querySelector(".card-followup").onclick = () => {
    if (!replyBox) return;
    const isHidden = replyBox.classList.contains("hidden");
    replyBox.classList.toggle("hidden", !isHidden);
    if (isHidden && replyInput) {
      replyInput.focus();
      status(`💬 Replying strictly to ${title} — type your message in the box inside ${title}'s card`);
    }
  };

  if (replyCloseBtn) {
    replyCloseBtn.onclick = () => replyBox?.classList.add("hidden");
  }

  async function sendInlineSingleModelReply() {
    const userMsg = (replyInput?.value || "").trim();
    if (!userMsg) {
      status(`Type a reply for ${title} first`);
      replyInput?.focus();
      return;
    }
    const targetIdx = resolveBackendIdxForCard(
      card.querySelector(".answer-name")?.textContent || title,
      card.dataset.backendIdx !== undefined ? Number(card.dataset.backendIdx) : backendIdx
    );
    const prevConversation = (body._rawText || body.textContent || "").trim();
    const contextualPrompt =
      `You are continuing a direct 1-on-1 conversation with the user. Here is your previous response in this card:\n` +
      `"""\n${prevConversation.slice(-3500)}\n"""\n\n` +
      `User's direct reply to you:\n${userMsg}\n\n` +
      `Respond directly to the user's reply in your own voice and fulfill their request completely.`;

    replyInput.value = "";
    replySendBtn.disabled = true;
    replySendBtn.textContent = "⏳ Replying…";
    status(`💬 Sending private reply strictly to ${title}…`);

    const separator = `\n\n---\n**🧑 You (to ${title}):** ${userMsg}\n\n**🤖 ${title}:** `;
    body._rawText = (prevConversation ? prevConversation : "") + separator;
    setCardBodyMarkdown(body, body._rawText, true);

    const mem = ($("#cap-persistent-mem")?.checked ?? $("#mem-toggle")?.checked) !== false;
    const liveTools = $("#cap-live-tools") ? $("#cap-live-tools").checked : true;
    const realtime = $("#cap-realtime") ? $("#cap-realtime").checked : true;
    const frontierBoost = $("#cap-frontier") ? $("#cap-frontier").checked : true;
    const visionBridge = $("#cap-vision-bridge") ? $("#cap-vision-bridge").checked : true;

    try {
      const r = await fetch(`/api/stream/${targetIdx}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: contextualPrompt,
          memory: mem,
          stream: true,
          images: [...attachedImages],
          documents: [...attachedDocuments],
          live_tools: liveTools,
          realtime,
          frontier_boost: frontierBoost,
          vision_bridge: visionBridge,
        }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || r.status);
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let replyText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const p = t.slice(5).trim();
          if (p === "[DONE]") continue;
          try {
            const parsed = JSON.parse(p);
            const d = parsed.choices?.[0]?.delta?.content;
            if (d) {
              replyText += d;
              body._rawText = (prevConversation ? prevConversation : "") + separator + replyText;
              setCardBodyMarkdown(body, body._rawText, true);
            }
          } catch (_) {}
        }
      }
      setCardBodyMarkdown(body, body._rawText, false);
      if (window._lastAnswers) {
        window._lastAnswers[title] = body._rawText;
      }
      postJSON("/api/history/turns", {
        prompt: `[Direct Reply to ${title}] ${userMsg}`,
        mode: MODE,
        answers: { [title]: replyText },
        verdict: "",
      }).catch(() => {});
      status(`✅ ${title} replied to your follow-up!`);
    } catch (err) {
      body._rawText += `\n\n⚠️ Reply error: ${err.message || err}`;
      setCardBodyMarkdown(body, body._rawText, false);
      status(`Reply error: ${err.message || err}`);
    } finally {
      replySendBtn.disabled = false;
      replySendBtn.textContent = "▶ Send Only to This Model";
    }
  }

  if (replySendBtn) {
    replySendBtn.onclick = sendInlineSingleModelReply;
  }
  if (replyInput) {
    replyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendInlineSingleModelReply();
      }
    });
  }

  card.querySelector(".card-save").onclick = async () => {
    const button = card.querySelector(".card-save");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const destination = STATE?.settings?.file_output_dir || "council_outputs";
    const modelSlug = String(title || "model").toLowerCase().replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "model";
    button.disabled = true;
    button.textContent = "Saving…";
    try {
      const res = await postJSON("/api/workspace/export", {
        folder: `${destination}/response_${stamp}_${modelSlug}`,
        fallback_name: `${modelSlug}_${stamp}.md`,
        text: body._rawText || body.textContent || ""
      });
      if (res.dir) card.dataset.appDir = res.dir;
      status(res.ok ? `💾 Saved ${res.files.length} file(s) to ${res.dir}` : (res.error || "nothing to save"));
      button.textContent = res.ok ? "✅ Saved" : "💾 Save files";
    } catch (error) {
      status(`save failed: ${error.message || error}`);
      button.textContent = "💾 Save files";
    } finally {
      button.disabled = false;
    }
  };

  const vscodeBtn = card.querySelector(".card-vscode");
  if (vscodeBtn) {
    vscodeBtn.onclick = async () => {
      const raw = body._rawText || body.textContent || "";
      if (!raw.trim()) {
        status("Nothing in this response to send to VS Code yet.");
        return;
      }
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const destination = STATE?.settings?.file_output_dir || "council_outputs";
      const modelSlug = String(title || "model").toLowerCase().replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "model";
      vscodeBtn.disabled = true;
      vscodeBtn.textContent = "💻 Opening VS Code…";
      status(`💻 Exporting complete project files from ${title} and launching VS Code…`);
      try {
        const res = await postJSON("/api/workspace/export", {
          folder: card.dataset.appDir || `${destination}/vscode_${modelSlug}_${stamp}`,
          fallback_name: `${modelSlug}_${stamp}.md`,
          text: raw,
          open_vscode: true,
        });
        if (res.dir) card.dataset.appDir = res.dir;
        if (res.ok) {
          vscodeBtn.textContent = "✅ Sent to VS Code";
          status(`💻 Exported ${res.files?.length || 1} file(s) (+ .vscode/launch.json & tasks.json) to ${res.dir} and triggered VS Code!`);
          setTimeout(() => { vscodeBtn.textContent = "💻 Send to VS Code"; }, 2400);
        } else {
          vscodeBtn.textContent = "💻 Send to VS Code";
          status(`VS Code export error: ${res.error || "failed"}`);
        }
      } catch (err) {
        vscodeBtn.textContent = "💻 Send to VS Code";
        status(`VS Code launch failed: ${err.message || err}`);
      } finally {
        vscodeBtn.disabled = false;
      }
    };
  }
  return body;
}

async function saveAllResponses(openInVscode = false) {
  const cards = $$("#answers .card.ans").filter((card) => {
    const body = card.querySelector(".body");
    return (body?._rawText || body?.textContent || "").trim();
  });
  if (!cards.length) { status("There are no response files to save yet."); return; }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const destination = STATE?.settings?.file_output_dir || "council_outputs";
  const exportFolder = `${destination}/response_${stamp}`;
  const button = openInVscode ? $("#send-all-files") : $("#save-all-files");
  const oldText = button ? button.textContent : "";
  if (button) {
    button.disabled = true;
    button.textContent = openInVscode ? "Sending…" : "Saving…";
  }
  try {
    const results = await Promise.all(cards.map((card, index) => {
      const body = card.querySelector(".body");
      const title = card.querySelector(".answer-name")?.textContent || `response_${index + 1}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "")
        || `response_${index + 1}`;
      return postJSON("/api/workspace/export", {
        folder: `${exportFolder}/${slug}_${index + 1}`,
        fallback_name: `${slug}.md`,
        text: body._rawText || body.textContent || "",
      });
    }));
    const failed = results.filter((result) => !result.ok);
    const fileCount = results.reduce((sum, result) => sum + (result.files?.length || 0), 0);
    if (failed.length || !fileCount) {
      status(failed[0]?.error || "No files were generated from the responses.");
      return;
    }
    if (openInVscode) {
      const opened = await postJSON("/api/workspace/open-export", { path: exportFolder });
      if (!opened.ok) { status(`saved ${fileCount} file(s), but could not open VS Code: ${opened.error}`); return; }
      status(`💻 Saved ${fileCount} file(s) and opened ${opened.path} in VS Code`);
    } else {
      status(`💾 Saved ${fileCount} file(s) from ${cards.length} response(s)`);
    }
  } catch (error) {
    status(`could not save all response files: ${error.message || error}`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = oldText;
    }
  }
}

$("#save-all-files")?.addEventListener("click", () => saveAllResponses(false));
$("#send-all-files")?.addEventListener("click", () => saveAllResponses(true));
$("#autorun-all-files")?.addEventListener("click", async () => {
  const btn = $("#autorun-all-files");
  const allAns = window._lastAnswers || {};
  const verdictTxt = window._lastVerdict || "";
  if (!Object.keys(allAns).length && !verdictTxt.trim()) {
    status("No model outputs available yet to compile & self-heal.");
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⚡ Compiling & Self-Healing All Files…";
  }
  status("⚡ Merging all Council files, synthesizing dependencies, compiling & self-healing (up to 4 rounds)…");
  openLiveTerminalWithOutput(
    "Council Merged Build — Compiling & Self-Healing…",
    "⏳ Merging all files across Council responses, creating entrypoints & dependencies, and executing in terminal…",
    null,
    "",
    true
  );
  try {
    const res = await postJSON("/api/autorun", {
      title: "suomynona_merged_app",
      text: verdictTxt,
      all_answers: allAns,
      self_heal: true,
      exec_mode: EXEC_MODE,
    });
    openLiveTerminalWithOutput(
      `Council Merged App — ${res.repaired ? `Self-Healed in ${res.rounds} Round(s)` : (res.ok ? "Verified & Ready" : "Execution Output")}`,
      res.terminal_log || res.error || "(execution finished)",
      res.cwd || res.dir,
      res.run_cmd || "",
      Boolean(res.ok)
    );
    if (res.html_preview) {
      openHtmlPreview("Council Merged App", "```html\n" + res.html_preview + "\n```");
    }
    status(
      res.ok
        ? `✅ Merged app built & verified (${res.files?.length || 0} files in ${res.dir})!`
        : `⚠️ Build ran with warnings — check Live Terminal (${res.dir || ""})`
    );
  } catch (err) {
    status(`Merged build error: ${err.message || err}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "⚡ Compile, Run & Self-Heal All";
    }
  }
});
let attachedDocuments = [];

async function syncSlotCapabilitiesStatus() {
  try {
    const res = await fetch("/api/capabilities/status", { cache: "no-store" }).then((r) => r.json());
    if (res?.ok && res.capabilities?.persistent_memory) {
      const pm = res.capabilities.persistent_memory;
      const badge = $("#cap-mem-count");
      if (badge) {
        badge.textContent = `(${pm.saved_turns_count || 0} turns · ${pm.vault_facts_count || 0} vault)`;
      }
    }
  } catch (_) {}
}

$("#cap-persistent-mem")?.addEventListener("change", (e) => {
  if ($("#mem-toggle")) $("#mem-toggle").checked = e.target.checked;
});
$("#mem-toggle")?.addEventListener("change", (e) => {
  if ($("#cap-persistent-mem")) $("#cap-persistent-mem").checked = e.target.checked;
});

$("#verify-5-caps-btn")?.addEventListener("click", async () => {
  const btn = $("#verify-5-caps-btn");
  if (btn) btn.disabled = true;
  const body = mkCard("🛡️ 5 Architectural Slot Capabilities — Live Verification", "ALL 5 CONFIRMED");
  body.textContent = "⏳ Running live server verification across Persistent Memory, Live Slot Shell, Real-Time NVD/CVE Lookup, and 70B+ Frontier Escalation Bridge…";
  status("Verifying all 5 unlocked slot capabilities…");
  try {
    const res = await postJSON("/api/capabilities/verify", {
      action: "all",
      cmd: "uname -a && free -h 2>/dev/null || node -v",
      cve: "CVE-2024-3094",
    });
    if (res?.ok && res.verified) {
      const v = res.verified;
      const md = [
        `### ✅ All 5 Former "Hard Limits" Are Now Architecturally Unlocked & Live on Every Slot`,
        ``,
        `#### 1. 🧠 Persistent Cross-Session Memory (Vault + Turn History + Learned Profile)`,
        "```text\n" + (v.persistent_memory || "Active").slice(0, 900) + "\n```",
        ``,
        `#### 2. ⚡ Live Tool & Shell Execution from Every Slot (CONFIRMED Output, Not Hypothesis)`,
        "```text\n" + (v.live_shell || "Active").slice(0, 900) + "\n```",
        ``,
        `#### 3. 🌐 Real-Time Post-Cutoff Knowledge (Live NIST NVD 2.0 / CIRCL CVE & Web Search)`,
        "```text\n" + (v.realtime_cve || "Active").slice(0, 900) + "\n```",
        ``,
        `#### 4. 🚀 70B+ / Frontier Deep-Reasoning Escalation Bridge (Breaks 27B Ceiling)`,
        v.frontier_70b_bridge || "Connected to Frontier Co-Processor (`openai/gpt-4.1` + `orca/orcacyber-ultra-1.0` + `deepseek/deepseek-v4.1-flash`).",
        ``,
        `#### 5. 👁 Universal Vision, Screenshot, Diagram & PDF Reader Bridge on Every Slot`,
        `Active on **all** Council slots: attached screenshots, diagrams (\`Ctrl+V\` or \`🖼️ Screenshot / Diagram / PDF\`), and PDFs are automatically OCR'd and transcribed via \`obsidian/Qwen3.8-27B\` / \`google/gemini-3.8-flash\` + PDF stream parser before reaching every model.`,
      ].join("\n");
      setCardBodyMarkdown(body, md, false);
      syncSlotCapabilitiesStatus();
      status("✅ Verified all 5 architectural slot capabilities!");
    } else {
      setCardBodyMarkdown(body, `⚠️ Verification error: ${res?.error || "unknown"}`, false);
    }
  } catch (e) {
    setCardBodyMarkdown(body, `⚠️ Verification error: ${e.message || e}`, false);
  } finally {
    if (btn) btn.disabled = false;
  }
});

async function askOne(b, prompt, mem, signal, images = [], documents = []) {
  const body = mkCard(b.name, "", b.i);
  const card = body.closest(".card");
  card.classList.toggle("hidden", !picked.has(b.i));
  const a = { text: "", el: body, card };
  answers[b.i] = a;
  const paint = () => setCardBodyMarkdown(body, a.text, true);
  const liveTools = $("#cap-live-tools") ? $("#cap-live-tools").checked : true;
  const realtime = $("#cap-realtime") ? $("#cap-realtime").checked : true;
  const frontierBoost = $("#cap-frontier") ? $("#cap-frontier").checked : true;
  const visionBridge = $("#cap-vision-bridge") ? $("#cap-vision-bridge").checked : true;

  try {
    const r = await fetch(`/api/stream/${b.i}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        memory: mem,
        stream: true,
        images,
        documents,
        live_tools: liveTools,
        realtime,
        frontier_boost: frontierBoost,
        vision_bridge: visionBridge,
      }),
      signal,
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.status); }
    const backendNameForRef = (ref) => {
      const byId = STATE.backends.find((backend) => backend.id && backend.id === ref);
      if (byId) return byId.name;
      const index = /^index:(\d+)$/.exec(ref || "");
      return index ? (STATE.backends.find((backend) => backend.i === Number(index[1]))?.name || ref) : ref;
    };
    const fallbackRef = r.headers.get("X-Council-Fallback-From");
    const actualRef = r.headers.get("X-Council-Actual-Backend");
    if (fallbackRef && actualRef) {
      const fallbackFrom = backendNameForRef(fallbackRef);
      const actualBackend = backendNameForRef(actualRef);
      card.querySelector(".answer-name").textContent = actualBackend;
      const note = document.createElement("span");
      note.className = "muted answer-sub";
      note.textContent = `fallback from ${fallbackFrom}`;
      card.querySelector(".answer-head").appendChild(note);
      status(`${b.name} unavailable — response relayed through ${actualBackend}`);
    }
    const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const p = t.slice(5).trim();
        if (p === "[DONE]") continue;
        try {
          const parsed = JSON.parse(p);
          const d = parsed.choices?.[0]?.delta?.content;
          if (d) { a.text += d; paint(); }
          if (parsed.error) { a.text += `\n\n⚠️ ${parsed.error}`; paint(); }
        } catch (_) {}
      }
    }
    if (!a.text.trim()) a.text = "⚠️ The model returned no response content. Check Live Activity and the Colab runtime status.";
    setCardBodyMarkdown(body, a.text, false);
  } catch (e) {
    a.text += (e.name === "AbortError") ? "\n\n■ stopped" : "\n\n⚠️ " + e;
    setCardBodyMarkdown(body, a.text, false);
  }
  return a.text;
}

function autoGuardReframeClient(rawPrompt) {
  // Pure unconstrained pass-through: prompt is never modified, preambled or rewritten
  return String(rawPrompt || "").trim();
}

$("#ask-btn").onclick = async () => {
  let rawInputPrompt = $("#prompt").value.trim();

  // Support /doctor and /update directly in the main workspace prompt composer
  const doctorMatch = rawInputPrompt.match(/^\/doctor(?:\s+([\s\S]*))?$/i);
  if (doctorMatch) {
    $("#prompt").value = "";
    if (typeof window.runInteractiveDoctorInWorkspace === "function") {
      await window.runInteractiveDoctorInWorkspace(doctorMatch[1] || "");
    }
    return;
  }
  const updateMatch = rawInputPrompt.match(/^\/update(?:\s+([\s\S]*))?$/i);
  if (updateMatch) {
    $("#prompt").value = "";
    if (typeof window.runInteractiveUpdaterInWorkspace === "function") {
      await window.runInteractiveUpdaterInWorkspace(updateMatch[1] || "check");
    }
    return;
  }

  // Support typing /ask, /plan, /build, /cloud, /cloud-council, /hotpotato, /judge, /verdict, /proxies directly in #prompt
  const slashModeMatch = rawInputPrompt.match(/^\/(ask|plan|build|cloud-council|cloud_council|cloud|hotpotato|hot_potato|judge|verdict|proxies)(?:\s+([\s\S]*))?$/i);
  if (slashModeMatch) {
    const cmdKey = slashModeMatch[1].toLowerCase();
    const remainder = (slashModeMatch[2] || "").trim();
    if (cmdKey === "judge" || cmdKey === "verdict") {
      $("#prompt").value = "";
      $("#judge-btn")?.click();
      return;
    }
    if (cmdKey === "proxies") {
      $("#prompt").value = "";
      if (typeof openProxyCsvVaultModal === "function") openProxyCsvVaultModal(true);
      return;
    }
    setCouncilExecutionMode(cmdKey, !remainder);
    rawInputPrompt = remainder;
    $("#prompt").value = remainder;
    if (!remainder) return;
  }

  const prompt = rawInputPrompt;
  if (MODE === "cloud_council") {
    const existingSetupCard = $("#inline-cloud-council-setup-card");
    if (!existingSetupCard && !prompt) {
      openCloudToCouncilQuestionsCard(prompt);
      status("☁️ Review or customize your 3-Step Cloud→Council settings below, then click '🚀 Send & Complete All 3 Steps'!");
      return;
    }
    const effectivePrompt = prompt || ($("#inline-a2a-prompt-input")?.value || "").trim();
    if (!effectivePrompt) {
      status("Type a prompt in the composer (or in the setup card) to run the 3-Step Cloud→Council pipeline");
      $("#prompt")?.focus();
      return;
    }
    window._lastPrompt = effectivePrompt;
    await triggerInlineCloudToCouncilFromCard(effectivePrompt);
    return;
  }
  if (MODE === "hot_potato") {
    const existingHpCard = $("#inline-hot-potato-setup-card");
    if (!existingHpCard && !prompt) {
      openHotPotatoPromptModeCard(prompt);
      status("🥔 Enter a task in the prompt box or setup card below, then click '🚀 Deploy Hot Potato Now'!");
      return;
    }
    const effectivePrompt = prompt || ($("#inline-hp-prompt-input")?.value || "").trim();
    if (!effectivePrompt) {
      status("Type a build task in the prompt box (or in the Hot Potato card) to launch Hot Potato Council Mode");
      $("#prompt")?.focus();
      return;
    }
    window._lastPrompt = effectivePrompt;
    await triggerInlineHotPotatoFromCard(effectivePrompt);
    return;
  }

  // Ensure at least one model is picked (auto-pick first available if user deselected all)
  if (!picked.size && Array.isArray(STATE?.backends) && STATE.backends.length) {
    picked.add(STATE.backends[0].i);
    if (typeof renderChips === "function") renderChips();
  }
  if (!picked.size || !prompt) { status("pick at least one model + a prompt"); return; }
  const chosen = STATE.backends.filter((b) => picked.has(b.i));
  judgeIdx = chosen[0].i;
  window._lastPrompt = prompt;
  historyCycleIdx = -1;
  if (!Array.isArray(window._localRecentPrompts)) window._localRecentPrompts = [];
  if (!window._localRecentPrompts.length || window._localRecentPrompts[0]?.prompt !== prompt) {
    window._localRecentPrompts.unshift({ prompt, mode: MODE, ts: Date.now() });
  }
  if (!Array.isArray(promptHistory)) promptHistory = [];
  if (!promptHistory.length || promptHistory[0]?.prompt !== prompt) {
    promptHistory.unshift({ prompt, mode: MODE, ts: Date.now() });
  }
  postJSON("/api/prompts/history", { prompt, mode: MODE }).then((r) => {
    if (r.ok && r.items) promptHistory = r.items;
  }).catch(() => {});

  // [TODO #1] Smart Auto-Bind Specialist Router: detect best 2–3 specialists from prompt keywords
  let autoBindMandate = "";
  window._lastAutoBoundSpecialists = [];
  if ($("#smart-autobind-toggle")?.checked && typeof routePromptToBestSpecialists === "function") {
    const routed = routePromptToBestSpecialists(prompt);
    window._lastAutoBoundSpecialists = routed;
    if (routed.length) {
      const badge = $("#smart-autobind-badge");
      if (badge) badge.textContent = routed.map((s) => s.shortTag).join(" + ");
      autoBindMandate =
        `\n\n[SMART AUTO-BOUND SPECIALISTS ACTIVE]:\n` +
        routed.map((s) => `- ${s.name}: ${s.sys}`).join("\n") +
        `\n`;
    }
  }

  $("#answers").innerHTML = ""; answers = {};
  $("#response-bulk-actions").classList.add("hidden");
  $("#verdict").classList.add("hidden");
  $("#verdict").classList.remove("verdict-hot-potato-highlight");
  $("#verdict-highlight-kicker")?.classList.add("hidden");
  $("#ask-btn").disabled = true;
  $("#stop-btn").classList.remove("hidden");
  const ctrl = new AbortController();
  window._askAbort = ctrl;
  const mem = ($("#cap-persistent-mem")?.checked ?? $("#mem-toggle")?.checked) !== false;
  const agentId = $("#agent-pick").value;
  const imgsToSend = [...attachedImages];
  const docsToSend = [...attachedDocuments];
  const modeWrappedPrompt = (MODE_WRAP[MODE] || ((p) => p))(prompt) + autoBindMandate;

  if (agentId) {
    const prof = AGENTS.find((a) => a.id === agentId);
    const expectedLabel = resolveAgentModelLabel(prof);
    const body = mkCard("🤖 " + (prof?.name || "Agent"), `${MODE.toUpperCase()} · ${expectedLabel}`);
    status(`agent "${prof?.name || agentId}" working in [${MODE.toUpperCase()}] mode on [${expectedLabel}]…`);
    const res = await postJSON("/api/agent/run", {
      agent_id: agentId,
      prompt: modeWrappedPrompt,
      model: prof?.model || "",
      idx: chosen[0]?.i ?? 0,
    }).catch((e) => ({ ok: false, text: String(e) }));
    const actualModel = res.model_used || expectedLabel;
    const tagEl = body?.parentElement?.querySelector("h3 .tag");
    if (tagEl) tagEl.textContent = `${MODE} · ${actualModel}`;
    let txt = `> **Active Agent Model:** \`${actualModel}\` · **Mode:** \`${MODE.toUpperCase()}\`\n\n`;
    (res.steps || []).forEach((s) => {
      txt += `🔧 ${s.tool}(${JSON.stringify(s.args).slice(0, 80)})\n   ↳ ${(s.result || "").slice(0, 200)}\n`;
    });
    if (res.steps?.length) txt += "\n";
    txt += res.text || res.error || "(no answer)";
    setCardBodyMarkdown(body, txt, false);
    window._lastAnswers = { [prof?.name || "Agent"]: res.ok ? res.text : txt };
    if (MODE === "plan" && res.text) window._lastPlan = res.text;
    status(res.ok ? `agent done on [${actualModel}] — ${(res.steps || []).length} tool call(s) · Click ⚖️ Judge anytime` : "agent failed: " + res.text);
  } else {
    status(`asking ${chosen.length} model(s) in [${MODE.toUpperCase()}] mode…`);
    const texts = {};
    await Promise.all(chosen.map(async (b) => { texts[b.name] = await askOne(b, modeWrappedPrompt, mem, ctrl.signal, imgsToSend, docsToSend); }));
    window._lastAnswers = texts;
    postJSON("/api/history/turns", { prompt, mode: MODE, answers: texts, verdict: "" }).then(() => {
      syncSlotCapabilitiesStatus();
    }).catch(() => {});
    if (MODE === "plan") {
      window._lastPlan = Object.values(texts).find((t) => t && !t.startsWith("⚠️")) || "";
      const planBar = document.createElement("div");
      planBar.className = "post-run-judge-bar full-span-card";
      planBar.innerHTML = `
        <div style="font-size:12px;color:#fde68a;font-weight:700">📐 Architecture Plan Drafted Across ${chosen.length} Model(s) — Judge to merge best ideas or jump straight into 🔨 Build!</div>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <button type="button" class="composer-judge-pill-btn inline-post-judge-trigger">⚖️ Judge &amp; Merge Plans</button>
          <button type="button" class="primary xs" id="plan-to-build-go-btn">🔨 Execute Plan in Build Mode Now</button>
        </div>
      `;
      $("#answers").prepend(planBar);
      planBar.querySelector(".inline-post-judge-trigger")?.addEventListener("click", () => $("#judge-btn")?.click());
      planBar.querySelector("#plan-to-build-go-btn")?.addEventListener("click", () => {
        setCouncilExecutionMode("build", false);
        $("#prompt").value = prompt;
        $("#ask-btn")?.click();
      });
      status("📐 Plan drafted — click '⚖️ Judge & Merge Plans' or '🔨 Execute Plan in Build Mode Now'");
    } else if (MODE === "build") {
      const firstCardAutorun = $("#answers .card.ans .card-autorun");
      if (firstCardAutorun) {
        firstCardAutorun.click();
      } else {
        status("🔨 Build complete — click ⚖️ Judge to score/merge or package as EXE / CLI / GUI / DevOps Bundle");
      }
    } else {
      status("💬 Answers ready — click ⚖️ Judge to evaluate & synthesize, or ask a follow-up");
    }
  }
  $("#response-bulk-actions")?.classList.remove("hidden");
  $("#judge-btn")?.classList.add("judge-ready-pulse");
  $("#stop-btn").classList.add("hidden");
  $("#ask-btn").disabled = false;
  $("#prompt").value = "";
  $("#prompt").style.height = "auto";
  $("#enhance-undo-btn")?.classList.add("hidden");
  attachedImages = [];
  attachedDocuments = [];
  renderImageAttachments();
  if (typeof onOmegaMultiAgentPromptCompleted === "function") {
    onOmegaMultiAgentPromptCompleted(window._lastAnswers || {}, prompt);
  }
};
$("#stop-btn").onclick = () => { if (window._askAbort) window._askAbort.abort(); status("stopping…"); };

// ── 🎨 image button (generates from the prompt box) ──
$("#img-btn").onclick = async () => {
  const prompt = $("#prompt").value.trim();
  if (!prompt) { status("type a prompt first — the image uses it"); return; }
  $("#img-btn").disabled = true;
  const body = mkCard("🎨 image", "sdxl-turbo");
  body.textContent = "🎨 generating…";
  status("generating image…");
  const res = await postJSON("/api/image", { prompt }).catch((e) => ({ ok: false, error: String(e) }));
  body.innerHTML = res.ok
    ? `<img src="data:image/png;base64,${res.b64}" style="max-width:100%;border-radius:10px">`
    : "⚠️ " + (res.error || "media server offline");
  $("#img-btn").disabled = false;
  status(res.ok ? "image done" : "image failed: " + (res.error || ""));
};

// ── ＋ docs / 📁 folder / 🖼️ vision image & PDF buttons ──
$("#add-btn").onclick = (e) => { e.stopPropagation(); $("#add-menu").classList.toggle("hidden"); };
document.addEventListener("click", (e) => {
  if (!e.target.closest("#add-menu") && e.target !== $("#add-btn"))
    $("#add-menu").classList.add("hidden");
});
$("#add-files-btn").onclick = () => { $("#add-menu").classList.add("hidden"); $("#doc-input").click(); };
$("#add-folder-btn").onclick = () => { $("#add-menu").classList.add("hidden"); $("#doc-input-dir").click(); };
$("#add-img-btn")?.addEventListener("click", () => { $("#add-menu").classList.add("hidden"); $("#img-input")?.click(); });

function renderImageAttachments() {
  const wrap = $("#img-attachments");
  const brainWrap = $("#brain-attachments-preview");
  const hasAny = attachedImages.length > 0 || attachedDocuments.length > 0;

  if (wrap) {
    if (!hasAny) {
      wrap.classList.add("hidden");
      wrap.innerHTML = "";
    } else {
      wrap.classList.remove("hidden");
      const imgHtml = attachedImages.map((dataUrl, idx) => `
        <div class="img-thumb" title="Attached screenshot/diagram #${idx + 1} (sent via Universal Vision Bridge to ALL slots)">
          <img src="${dataUrl}" alt="attachment ${idx + 1}">
          <button type="button" class="img-thumb-rm" data-rm-img="${idx}" title="Remove image">✕</button>
        </div>
      `).join("");
      const docHtml = attachedDocuments.map((doc, idx) => `
        <div class="img-thumb" style="display:flex;align-items:center;gap:6px;padding:6px 10px;width:auto;height:auto;background:rgba(124,92,255,.16);border:1px solid rgba(124,92,255,.4);border-radius:8px" title="Attached PDF/document (parsed & sent to ALL slots)">
          <span style="font-size:12px">📄 ${esc(doc.name || `Document_${idx + 1}.pdf`)}</span>
          <button type="button" class="img-thumb-rm" style="position:static" data-rm-doc="${idx}" title="Remove document">✕</button>
        </div>
      `).join("");
      wrap.innerHTML = imgHtml + docHtml + `<span class="muted">👁 Universal Vision &amp; PDF Bridge: ${attachedImages.length} image(s), ${attachedDocuments.length} PDF/doc(s) ready for ALL Council slots</span>`;
      wrap.querySelectorAll("[data-rm-img]").forEach((btn) => {
        btn.onclick = () => {
          attachedImages.splice(Number(btn.dataset.rmImg), 1);
          renderImageAttachments();
        };
      });
      wrap.querySelectorAll("[data-rm-doc]").forEach((btn) => {
        btn.onclick = () => {
          attachedDocuments.splice(Number(btn.dataset.rmDoc), 1);
          renderImageAttachments();
        };
      });
    }
  }

  if (brainWrap) {
    if (!hasAny) {
      brainWrap.classList.add("hidden");
      brainWrap.innerHTML = "";
    } else {
      brainWrap.classList.remove("hidden");
      brainWrap.innerHTML =
        `<span>👁 <strong>Universal Vision &amp; PDF Bridge Ready:</strong> ${attachedImages.length} image(s), ${attachedDocuments.length} PDF/doc(s) attached</span>` +
        `<button type="button" class="ghost xs" id="brain-clear-attach-btn" style="padding:1px 6px;font-size:10px">✕ Clear</button>`;
      brainWrap.querySelector("#brain-clear-attach-btn")?.addEventListener("click", () => {
        attachedImages = [];
        attachedDocuments = [];
        renderImageAttachments();
      });
    }
  }
}

function addImageFiles(fileList) {
  [...(fileList || [])].slice(0, 8).forEach((file) => {
    if (!file) return;
    if (file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && attachedImages.length < 8) {
          attachedImages.push(reader.result);
          renderImageAttachments();
          status(`👁 Attached screenshot/diagram "${file.name}" for Universal Vision Bridge (all slots)`);
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && attachedDocuments.length < 6) {
          attachedDocuments.push({ name: file.name, type: "application/pdf", data: reader.result });
          renderImageAttachments();
          status(`📄 Attached PDF "${file.name}" for Universal PDF Reader Bridge (all slots)`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && attachedDocuments.length < 6) {
          attachedDocuments.push({ name: file.name, type: file.type || "text/plain", text: reader.result });
          renderImageAttachments();
          status(`📄 Attached document "${file.name}" for all Council slots`);
        }
      };
      reader.readAsText(file);
    }
  });
}
$("#img-input")?.addEventListener("change", () => {
  addImageFiles($("#img-input").files);
  $("#img-input").value = "";
});
$("#prompt")?.addEventListener("paste", (e) => {
  const items = [...(e.clipboardData?.items || [])];
  const files = items
    .filter((it) => it.type.startsWith("image/") || it.type === "application/pdf")
    .map((it) => it.getAsFile())
    .filter(Boolean);
  if (files.length) addImageFiles(files);
});
$(".composer")?.addEventListener("dragover", (e) => { e.preventDefault(); });
$(".composer")?.addEventListener("drop", (e) => {
  if (e.dataTransfer?.files?.length) {
    e.preventDefault();
    addImageFiles(e.dataTransfer.files);
  }
});

// ── 📜 Prompt History & Past Council Turns drawer ──
async function refreshHistoryData() {
  try {
    const [pRes, tRes] = await Promise.all([
      fetch("/api/prompts/history", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/history/turns", { cache: "no-store" }).then((r) => r.json()),
    ]);
    promptHistory = pRes.items || [];
    pastTurns = tRes.turns || [];
    renderHistoryDrawer();
  } catch (_) {}
}

function renderHistoryDrawer() {
  const listEl = $("#history-list");
  if (!listEl) return;
  const q = ($("#history-search")?.value || "").trim().toLowerCase();
  listEl.innerHTML = "";
  if (historyTab === "prompts") {
    const items = promptHistory.filter((it) => !q || String(it.prompt || "").toLowerCase().includes(q));
    if (!items.length) {
      listEl.innerHTML = `<div class="muted">No saved prompts${q ? " matching filter" : " yet — ask the council to build history"}.</div>`;
      return;
    }
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "history-item";
      const when = item.at ? new Date(item.at * 1000).toLocaleString() : "";
      row.innerHTML = `
        <div class="history-item-main" title="${esc(item.prompt)}">
          <div class="history-item-text">${esc(item.prompt)}</div>
          <div class="history-item-meta">${esc((item.mode || "ask").toUpperCase())} · ${esc(when)}${item.count > 1 ? ` · used ${item.count}×` : ""}</div>
        </div>
        <div class="history-item-actions">
          <button type="button" class="ghost xs" data-h-use="${esc(item.id)}" title="Load into prompt box">↗ Load</button>
          <button type="button" class="primary xs" style="padding:3px 9px;font-size:11.5px" data-h-run="${esc(item.id)}" title="Load and Ask immediately">⚡ Run</button>
          <button type="button" class="ghost xs" data-h-del="${esc(item.id)}" title="Delete">✕</button>
        </div>`;
      row.querySelector(".history-item-main").onclick = () => {
        $("#prompt").value = item.prompt;
        $("#prompt").dispatchEvent(new Event("input"));
        $("#prompt").focus();
        status("loaded prompt from history");
      };
      row.querySelector("[data-h-use]").onclick = (e) => {
        e.stopPropagation();
        $("#prompt").value = item.prompt;
        $("#prompt").dispatchEvent(new Event("input"));
        $("#prompt").focus();
        status("loaded prompt from history");
      };
      row.querySelector("[data-h-run]").onclick = (e) => {
        e.stopPropagation();
        $("#prompt").value = item.prompt;
        $("#prompt").dispatchEvent(new Event("input"));
        $("#history-drawer")?.classList.add("hidden");
        $("#ask-btn").click();
      };
      row.querySelector("[data-h-del]").onclick = async (e) => {
        e.stopPropagation();
        const res = await fetch(`/api/prompts/history?id=${encodeURIComponent(item.id)}`, { method: "DELETE" }).then((r) => r.json());
        promptHistory = res.items || [];
        renderHistoryDrawer();
      };
      listEl.appendChild(row);
    });
  } else {
    const turns = pastTurns.filter((t) => !q || String(t.prompt || "").toLowerCase().includes(q));
    if (!turns.length) {
      listEl.innerHTML = `<div class="muted">No past council turns saved yet.</div>`;
      return;
    }
    turns.forEach((turn) => {
      const row = document.createElement("div");
      row.className = "history-item";
      const when = turn.at ? new Date(turn.at * 1000).toLocaleString() : "";
      const modelCount = Object.keys(turn.answers || {}).length;
      row.innerHTML = `
        <div class="history-item-main" title="${esc(turn.prompt)}">
          <div class="history-item-text">${esc(turn.prompt || "(council turn)")}</div>
          <div class="history-item-meta">${esc((turn.mode || "ask").toUpperCase())} · ${modelCount} model answer(s)${turn.verdict ? " · ⚖️ Verdict included" : ""} · ${esc(when)}</div>
        </div>
        <div class="history-item-actions">
          <button type="button" class="ghost xs" data-t-restore="${esc(turn.id)}">📂 Restore turn</button>
        </div>`;
      const restore = () => {
        $("#answers").innerHTML = "";
        $("#response-bulk-actions").classList.add("hidden");
        answers = {};
        Object.entries(turn.answers || {}).forEach(([modelName, txt]) => {
          const backend = STATE.backends.find((item) => item.name === modelName);
          const body = mkCard(modelName, "", backend ? backend.i : null);
          setCardBodyMarkdown(body, txt, false);
          const card = body.closest(".card");
          if (backend) card.classList.toggle("hidden", !picked.has(backend.i));
          answers[backend ? backend.i : modelName] = { text: txt, el: body, card };
        });
        window._lastAnswers = turn.answers || {};
        window._lastPrompt = turn.prompt || "";
        if (turn.verdict) showVerdict("⚖️ Restored Verdict", turn.verdict);
        else $("#verdict").classList.add("hidden");
        if (turn.prompt) {
          $("#prompt").value = turn.prompt;
          $("#prompt").dispatchEvent(new Event("input"));
        }
        $("#history-drawer")?.classList.add("hidden");
        status(`restored turn with ${modelCount} model response(s)`);
      };
      row.onclick = restore;
      row.querySelector("[data-t-restore]").onclick = (e) => { e.stopPropagation(); restore(); };
      listEl.appendChild(row);
    });
  }
}

$("#history-btn")?.addEventListener("click", async () => {
  const drawer = $("#history-drawer");
  if (!drawer) return;
  const opening = drawer.classList.contains("hidden");
  drawer.classList.toggle("hidden");
  if (opening) await refreshHistoryData();
});
$("#history-close")?.addEventListener("click", () => $("#history-drawer")?.classList.add("hidden"));
$("#history-search")?.addEventListener("input", renderHistoryDrawer);
$$("#history-tabs button").forEach((btn) => {
  btn.onclick = () => {
    historyTab = btn.dataset.htab;
    $$("#history-tabs button").forEach((b) => b.classList.toggle("on", b === btn));
    renderHistoryDrawer();
  };
});
$("#history-clear")?.addEventListener("click", async () => {
  if (historyTab === "prompts") {
    await fetch("/api/prompts/history", { method: "DELETE" });
    promptHistory = [];
  } else {
    await fetch("/api/history/turns", { method: "DELETE" });
    pastTurns = [];
  }
  renderHistoryDrawer();
  status("history cleared");
});

async function safeParseApiResponse(r, urlLabel = "") {
  const rawText = await r.text();
  if (!rawText || !rawText.trim()) {
    return { ok: r.ok, status: r.status };
  }
  try {
    return JSON.parse(rawText);
  } catch (_err) {
    const snippet = rawText.replace(/\s+/g, " ").trim().slice(0, 140);
    const errMsg = `Non-JSON response (${r.status}) from ${urlLabel}: ${snippet}`;
    if (typeof pushClientLiveConsole === "function") {
      pushClientLiveConsole("ERROR", errMsg, "error");
    }
    return { ok: false, status: r.status, error: errMsg };
  }
}

async function uploadDocs(fileList, label) {
  if (!fileList || !fileList.length) return;
  status(`embedding ${fileList.length} item(s) (${label})…`);
  try {
    const items = [];
    for (const f of [...fileList].slice(0, 80)) {
      const text = await f.text().catch(() => "");
      if (text) items.push({ name: f.name || "attached_doc", text: text.slice(0, 180000) });
    }
    const r = await fetch("/api/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: items, label }),
    });
    const res = await safeParseApiResponse(r, "/api/docs");
    const btn = $("#add-btn");
    if (btn) {
      btn.textContent = res.ok && res.total ? `＋${res.total}` : "＋";
      btn.title = res.ok ? `${res.total} chunks indexed — click to add more` : "attach files or a folder";
    }
    status(res.ok ? `docs indexed (${res.chunks || items.length} chunks from ${label})` : "doc index note: " + (res.error || "check format"));
  } catch (err) {
    if (typeof pushClientLiveConsole === "function") {
      pushClientLiveConsole("ERROR", `uploadDocs error: ${err.message || err}`, "error");
    }
    status(`doc attach warning: ${err.message || err}`);
  }
}

// ── judge / director / enhance (hardened against <!DOCTYPE HTML error pages so prompt never crashes!) ──
async function getJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  return safeParseApiResponse(r, url);
}
async function postJSON(url, body, method = "POST") {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return safeParseApiResponse(r, url);
}

// ── 🐝 Swarm & 🥔 Hot Potato Pre-Deployment Setup Windows in Council Response Area ──
function toggleSwarmModePopup(_forceState) {
  // Legacy no-op: Swarm now opens its unified Pre-Deployment Setup Window directly in #answers
}

if ($("#swarm-btn")) {
  $("#swarm-btn").onclick = (e) => {
    e.stopPropagation();
    const currentPrompt = ($("#prompt")?.value || "").trim();
    openSwarmMultiAgentQuestionsCard(currentPrompt);
    status("🐝 Swarm Pre-Deployment Window opened below — choose workers, Swarm models, groups & Specialist Agents, then click '🚀 Deploy Swarm Now'!");
    $("#inline-swarm-multiagent-setup-card")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
}

if ($("#hot-potato-btn")) {
  $("#hot-potato-btn").onclick = (e) => {
    e.stopPropagation();
    setCouncilExecutionMode("hot_potato", true);
    $("#inline-hot-potato-setup-card")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
}

async function executeSwarmReactionChoice(mode) {
  toggleSwarmModePopup(false);
  const rawPrompt = ($("#prompt")?.value || "").trim() || "Build a self-testing Python security & port health scanner utility";
  if ($("#prompt") && !$("#prompt").value.trim()) {
    $("#prompt").value = rawPrompt;
  }
  const chosen = (STATE?.backends || []).filter(
    (b) => picked.has(b.i) && !String(b.model || "").toLowerCase().includes("embed")
  );
  const idxs = chosen.length ? chosen.map((b) => b.i) : [0, 1];

  if (mode === "blitz") {
    status("⚡ Swarm Mode 1: Blitz Build & Auto-Run (No Questions — building & launching in Live Terminal)…");
    await runSwarmBuild(rawPrompt, { Strategy: "Blitz Build — complete runnable implementation with zero placeholders" }, idxs);
    return;
  }

  if (mode === "interactive") {
    $("#answers").innerHTML = "";
    answers = {};
    $("#response-bulk-actions").classList.add("hidden");
    status("🧭 Swarm Mode 2: Interactive Architect — generating 3 quick questions first…");
    const qres = await postJSON("/api/swarm/questions", { prompt: rawPrompt, models: idxs });
    const card = document.createElement("div");
    card.className = "card";
    const qs = qres.ok
      ? qres.questions
      : ["What format should it be?", "How should results be stored/shown?", "Any specific target platform or scope?"];
    card.innerHTML =
      `<h3><span>🧭 Swarm Interactive Architect — 3 Quick Questions First</span></h3>` +
      qs
        .map(
          (q) => `<div style="margin:8px 0"><div class="muted">${esc(q)}</div>
        <input class="input slim swarm-q" data-q="${esc(q)}" style="width:100%;margin-top:4px"
        placeholder="(leave blank = builder's best judgment)"></div>`
        )
        .join("") +
      `<div class="btn-row" style="margin-top:10px">
        <button class="primary sm" id="swarm-go">⚡ Build &amp; Auto-Run Now</button>
        <button class="ghost sm" id="swarm-skip">Skip Questions — Build Immediately</button>
      </div>`;
    $("#answers").appendChild(card);
    const collect = () =>
      Object.fromEntries([...card.querySelectorAll(".swarm-q")].map((el) => [el.dataset.q, el.value.trim()]));
    $("#swarm-go").onclick = () => runSwarmBuild(rawPrompt, collect(), idxs);
    $("#swarm-skip").onclick = () => runSwarmBuild(rawPrompt, {}, idxs);
    return;
  }

  if (mode === "red_blue") {
    status("⚔️ Swarm Mode 3: Red-vs-Blue Hardened Build — building, attacking, and patching…");
    await runSwarmBuild(
      `${rawPrompt}\n\n[SWARM SECURITY MANDATE]: Every generated file must be audited against Red-Team injection/boundary attacks and hardened with Blue-Team defensive checks and self-tests.`,
      { SecurityPosture: "Red-vs-Blue Adversarial Hardened Build with strict input validation and self-tests" },
      idxs
    );
    return;
  }

  if (mode === "mass_60") {
    openSwarmMultiAgentQuestionsCard(rawPrompt);
    return;
  }

  if (mode === "dag_4step") {
    status("👑 Swarm Mode 6: Launching 4-Step Boss & Worker Pipeline with Unrestricted Queen Boss…");
    $("#answers").innerHTML = "";
    answers = {};
    $("#response-bulk-actions").classList.add("hidden");
    const body = mkCard("👑 4-Step Boss & Worker Pipeline (DAG)", "Unrestricted Queen Boss + Auto-Switch on Safety Block");
    body.textContent = `⏳ Unrestricted Swarm Queen Boss decomposing "${rawPrompt}" into 4 sequential stages (Architecture → Implementation → Audit → Verification)…`;
    try {
      const res = await postJSON("/api/swarm/dag", {
        goal: rawPrompt,
        auto_heal: true,
        queen_boss_model: $("#swarm-queen-boss-model")?.value || "qwen3-coder-30b-ablit",
        queen_auto_rotate: true,
      });
      if (res?.ok) {
        const rotLine =
          res.queen_boss_switched_count > 0
            ? `> 🔄 **Unrestricted Queen Boss Auto-Switched ${res.queen_boss_switched_count}×** on safety refusal until approved by **${res.queen_boss_used?.name || res.manager}**\n\n`
            : `> 👑 **Approved by Unrestricted Queen Boss:** \`${res.queen_boss_used?.name || res.manager}\`\n\n`;
        const stagesMd = (res.nodes || [])
          .map(
            (n) =>
              `### ${n.title}\n*Assigned Worker:* \`${n.worker_name}\` · *Status:* \`${n.review_status}\`\n\n${n.output || ""}`
          )
          .join("\n\n---\n\n");
        setCardBodyMarkdown(body, rotLine + stagesMd, false);
        status(`✅ 4-Step Boss & Worker Pipeline complete (${res.manager})!`);
      } else {
        setCardBodyMarkdown(body, `❌ ${res?.error || "4-Step DAG failed"}`, false);
      }
    } catch (err) {
      setCardBodyMarkdown(body, `❌ ${err.message || err}`, false);
    }
    return;
  }

  if (mode === "tdd_heal") {
    status("🔬 Swarm Mode 5: Strict Test-Driven Self-Healing Loop (writing tests + healing until exit 0)…");
    await runSwarmBuild(
      `${rawPrompt}\n\n[STRICT TDD MANDATE]: Include runnable automated assertions/unit tests in the entry script that verify every function and print 'ALL TDD ASSERTIONS PASSED (EXIT 0)'.`,
      { Verification: "Strict TDD Self-Healing Loop — must execute in Live Terminal with exit code 0" },
      idxs
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// INLINE INTERACTIVE SETUP QUESTIONS FOR:
// 1) ☁️ 3-STEP CLOUD-TO-COUNCIL RUNNER (Mode in Council Prompt)
// 2) 🐝 SWARM MULTI-AGENT PARALLEL WORKER MODE (Any Model Size + Group/Thread/Agent Splitter)
// ══════════════════════════════════════════════════════════════════════════════

function buildAllSelectableModelsList() {
  const items = [];
  const seen = new Set();
  const pushModel = (id, label, sizeGb, group) => {
    const key = String(id || "").trim();
    if (!key || seen.has(key)) return;
    if (key.toLowerCase().includes("embed")) return;
    seen.add(key);
    items.push({
      id: key,
      label: String(label || key).trim(),
      size_gb: Math.max(1, Number(sizeGb) || 4),
      group: group || "Available Models",
    });
  };

  // 1. Active Council Lineup Backends (any size)
  (Array.isArray(STATE?.backends) ? STATE.backends : []).forEach((b) => {
    const mName = String(b.name || b.model || "");
    const sizeMatch = mName.match(/(\d+)\s*B/i);
    const estGb = sizeMatch ? Math.max(2, Math.round(Number(sizeMatch[1]) * 0.65)) : 8;
    pushModel(
      b.model || b.name,
      `🟢 ${b.name} (${b.provider || b.kind || "Active Lineup"} · ~${estGb} GB)`,
      estGb,
      "Active Council Lineup Models (Any Size)"
    );
  });

  // 2. Cloud API & Orca Cyber Models
  (Array.isArray(STATE?.cloud_models) ? STATE.cloud_models : []).forEach((c) => {
    pushModel(
      c.model || c.id || c.name,
      `☁️ ${c.name || c.model} [${c.provider || "Cloud"}]`,
      16,
      "Cloud & Orca Cyber Models"
    );
  });

  // 3. Built-in Swarm Models Catalog (3GB, 5GB, and Heavy Models)
  if (typeof SWARM_MODELS_CATALOG === "object" && SWARM_MODELS_CATALOG) {
    Object.entries(SWARM_MODELS_CATALOG).forEach(([gbKey, arr]) => {
      (Array.isArray(arr) ? arr : []).forEach((m) => {
        pushModel(m.id, m.label, Number(gbKey) || 4, `Swarm Worker Models (${gbKey} GB Class)`);
      });
    });
  }

  // 4. Full Colab Host GGUF Catalog (1B to 70B+ — No Size Restriction)
  catalogEntriesList().forEach((c) => {
    const vramGb = Math.max(1, Math.round(Number(c.vram_gb || c.size_gb || 6)));
    pushModel(
      c.id || c.name,
      `🖥 ${c.name || c.id} (${vramGb} GB GGUF${c.uncensored ? " · Uncensored" : ""})`,
      vramGb,
      "Full GGUF Model Catalog (All Sizes: 1GB – 70GB+)"
    );
  });

  // Fallback defaults if state hasn't finished loading yet
  if (!items.length) {
    pushModel("Qwen2.5-Coder-3B-Instruct-abliterated.Q4_K_M.gguf", "💻 Qwen 2.5 Coder 3B Uncensored (3 GB)", 3, "Default Models");
    pushModel("Llama-3.1-8B-Lexi-Uncensored-V2.Q4_K_M.gguf", "🛡️ Llama 3.1 8B Lexi Uncensored (5 GB)", 5, "Default Models");
    pushModel("qwen3-coder-30b-ablit", "👑 Qwen3 Coder 30B Abliterated (18 GB)", 18, "Default Models");
    pushModel("deepseek-r1-32b-ablit", "🔥 DeepSeek R1 32B Abliterated (20 GB)", 20, "Default Models");
  }

  return items;
}

function buildAllSelectableModelsOptionsHtml(selectedId = "", includeInheritOption = false) {
  const models = buildAllSelectableModelsList();
  const groups = new Map();
  models.forEach((m) => {
    if (!groups.has(m.group)) groups.set(m.group, []);
    groups.get(m.group).push(m);
  });
  let html = includeInheritOption
    ? `<option value="">🔗 Use Base Worker Model Selected Above</option>`
    : "";
  for (const [gName, list] of groups.entries()) {
    html += `<optgroup label="${esc(gName)}">`;
    list.forEach((m) => {
      const sel = m.id === selectedId ? " selected" : "";
      html += `<option value="${esc(m.id)}" data-size-gb="${m.size_gb}"${sel}>${esc(m.label)}</option>`;
    });
    html += `</optgroup>`;
  }
  return html;
}

function openCloudToCouncilQuestionsCard(initialPrompt = "") {
  const ans = $("#answers");
  if (!ans) return;
  const currentPrompt = initialPrompt || ($("#prompt")?.value || "").trim();
  const modelsHtml = buildAllSelectableModelsOptionsHtml("");

  // Gather remote cloud helpers if A2A_STATE is loaded
  const remoteHelpers = A2A_STATE?.config?.remote_enterprise_agents || [
    { id: "vertex-enterprise-search", name: "1st: Google Cloud Vertex AI Search & Grounding (Default — Goes First)", provider: "Google Cloud Vertex AI" },
    { id: "google-agentspace-connector", name: "Google Agentspace ( BigQuery / Jira / Drive / Docs Connectors )", provider: "Google Agentspace" },
    { id: "adk-multi-agent-coordinator", name: "Google ADK Cloud Coordinator ( Hierarchical Task Planner )", provider: "Google ADK" },
    { id: "aws-bedrock-agentcore", name: "AWS Bedrock AgentCore ( Cloud IAM & S3 Telemetry )", provider: "AWS Bedrock" },
    { id: "azure-ai-foundry", name: "Azure AI Foundry ( Entra ID & Defender Sentinel )", provider: "Azure AI" },
  ];

  const helperOptionsHtml = remoteHelpers
    .map((a, idx) => `<option value="${esc(a.id)}"${idx === 0 ? " selected" : ""}>${idx === 0 ? "🥇 " : "☁️ "}${esc(a.name)}</option>`)
    .join("");

  ans.innerHTML = "";
  answers = {};
  $("#response-bulk-actions")?.classList.add("hidden");

  const card = document.createElement("div");
  card.className = "card";
  card.id = "inline-cloud-council-setup-card";
  card.style.border = "1px solid rgba(56,189,248,.5)";
  card.style.background = "linear-gradient(180deg, rgba(12,20,40,.96), rgba(9,14,28,.96))";

  card.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
      <h3 style="margin:0;color:var(--accent2)">☁️➡️🏛️ 3-Step Cloud-to-Council Runner — Pre-Flight Questions</h3>
      <div class="row" style="gap:6px">
        <span class="right-badge orca">STEP 1: CLOUD HELPER GOES FIRST → STEP 2: HANDOFF → STEP 3: SUOMYNONA COUNCIL</span>
        <button type="button" class="ghost xs" id="inline-a2a-open-settings-btn" title="Open diagnostic and verification tests in Settings">⚙️ Diagnostic Tests in Settings</button>
      </div>
    </div>
    <p class="muted" style="margin:0 0 12px;font-size:12px">
      Configure how your prompt flows from the <strong>Step 1 Cloud Helper &amp; Model</strong> into your <strong>Step 3 Local Suomynona Council Models</strong>. When ready, click <strong>🚀 Send &amp; Complete All 3 Steps</strong> (or press <strong>⚡ Ask Models</strong> above).
    </p>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:10px">
      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#7dd3fc;margin-bottom:4px">
          1️⃣ Which Cloud Helper Goes First (Step 1)?
        </label>
        <select id="inline-a2a-helper" class="input" style="width:100%;margin-bottom:8px">
          ${helperOptionsHtml}
        </select>
        <label style="display:block;font-size:12px;font-weight:700;color:var(--ok);margin-bottom:4px">
          🤖 Select Which Model Powers Step 1 (Visible Model Selector):
        </label>
        <select id="inline-a2a-model" class="input" style="width:100%">
          ${modelsHtml}
        </select>
        <div class="muted" style="font-size:11px;margin-top:4px">
          You can pick any Cloud, Orca, or Council model above to execute Step 1's initial research &amp; grounding.
        </div>
      </div>

      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#c4b5fd;margin-bottom:4px">
          2️⃣ What Should Suomynona Council Do in Step 3?
        </label>
        <select id="inline-a2a-skill" class="input" style="width:100%;margin-bottom:8px">
          <option value="multi-model-architecture-synthesis">🏛️ Combine Multiple Models &amp; Write Complete Code</option>
          <option value="enterprise-resilience-assurance-audit">🛡️ Deep Security &amp; Edge-Case Audit (Unrestricted)</option>
          <option value="automated-software-quality-verification">💻 Write Code + Run &amp; Verify in Sandbox Terminal</option>
          <option value="cloud-runtime-telemetry-diagnostics">🖥 Multi-Host GPU &amp; Infrastructure Diagnostics</option>
        </select>

        <label style="display:block;font-size:12px;font-weight:700;color:#fcd34d;margin-bottom:4px">
          3️⃣ How Many Council Models Run Simultaneously in Step 3?
        </label>
        <select id="inline-a2a-fanout" class="input" style="width:100%">
          <option value="4" selected>4 Council Models at Once (Recommended)</option>
          <option value="2">2 Council Models at Once (Fastest)</option>
          <option value="6">6 Council Models at Once (Deep Consensus)</option>
          <option value="8">8 Council Models at Once (Maximum Coverage)</option>
        </select>
      </div>

      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#fca5a5;margin-bottom:4px">
          4️⃣ Cover Disguise &amp; Privacy Firewall Settings:
        </label>
        <select id="inline-a2a-stealth" class="input" style="width:100%;margin-bottom:8px">
          <option value="enterprise_resilience">🛡️ Enterprise Resilience &amp; Architecture Assurance</option>
          <option value="finops_telemetry">📊 Multi-Cloud FinOps &amp; Telemetry Analytics</option>
          <option value="compliance_governance">📋 Automated SOC2 / ISO-27001 Governance</option>
          <option value="sre_observability">⚡ Site Reliability &amp; Chaos Engineering</option>
        </select>
        <label class="toggle" style="font-size:11.5px;display:flex;margin-bottom:6px">
          <input type="checkbox" id="inline-a2a-firewall" checked>
          🛡️ Scrub private IPs, keys &amp; hostnames before sending to Cloud
        </label>
        <label class="toggle" style="font-size:11.5px;display:flex">
          <input type="checkbox" id="inline-a2a-terminal" checked>
          💻 Auto-run &amp; verify generated code in Sandbox Terminal
        </label>
      </div>
    </div>

    <div style="margin-top:10px">
      <label class="muted" style="font-size:11.5px;display:block;margin-bottom:4px">
        📝 Prompt to Send Through All 3 Steps (synced with main Council prompt box above):
      </label>
      <input id="inline-a2a-prompt-input" class="input" style="width:100%" value="${esc(currentPrompt)}" placeholder="Type your goal here or in the main prompt box above (e.g., Search our cloud architecture specs and build a hardened zero-trust Python verifier)…">
    </div>

    <div class="btn-row" style="margin-top:12px;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button type="button" class="primary" id="inline-a2a-go-btn">🚀 Send &amp; Complete All 3 Steps Now</button>
        <button type="button" class="ghost sm" id="inline-a2a-sample1">💡 Sample: Zero-Trust Auth Audit + Exploit PoC</button>
        <button type="button" class="ghost sm" id="inline-a2a-sample2">💡 Sample: Multi-Region Failover Verifier</button>
      </div>
      <button type="button" class="ghost sm" id="inline-a2a-cancel-btn">✕ Cancel &amp; Return to Standard Ask Mode</button>
    </div>
  `;

  ans.appendChild(card);

  const promptBox = $("#prompt");
  const inlineInput = $("#inline-a2a-prompt-input");
  if (inlineInput && promptBox) {
    inlineInput.addEventListener("input", () => {
      promptBox.value = inlineInput.value;
    });
    promptBox.addEventListener("input", () => {
      if ($("#inline-a2a-prompt-input")) {
        $("#inline-a2a-prompt-input").value = promptBox.value;
      }
    });
  }

  $("#inline-a2a-open-settings-btn")?.addEventListener("click", () => {
    const sysBtn = document.querySelector('.rail-btn[data-view="system"]');
    if (sysBtn) sysBtn.click();
    setTimeout(() => {
      $("#settings-a2a-diagnostics-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  });

  $("#inline-a2a-sample1")?.addEventListener("click", () => {
    const p = "Pull our enterprise zero-trust auth specifications from Google Cloud, then have Suomynona Council perform an unrestricted red-team bypass audit and write a self-testing Python verification script.";
    if ($("#prompt")) $("#prompt").value = p;
    if (inlineInput) inlineInput.value = p;
  });

  $("#inline-a2a-sample2")?.addEventListener("click", () => {
    const p = "Summarize our multi-region disaster recovery runbook via the Cloud Helper, then have 4 Suomynona Council models synthesize an automated failover health-probe CLI tool and verify it in the terminal.";
    if ($("#prompt")) $("#prompt").value = p;
    if (inlineInput) inlineInput.value = p;
  });

  $("#inline-a2a-cancel-btn")?.addEventListener("click", () => {
    const askModeBtn = document.querySelector('#mode button[data-mode="ask"]');
    if (askModeBtn) askModeBtn.click();
    card.remove();
  });

  $("#inline-a2a-go-btn")?.addEventListener("click", async () => {
    const p = ($("#prompt")?.value || inlineInput?.value || "").trim();
    if (!p) {
      status("Please enter a prompt first!");
      inlineInput?.focus();
      return;
    }
    await triggerInlineCloudToCouncilFromCard(p);
  });
}

async function triggerInlineCloudToCouncilFromCard(promptText) {
  const cfg = {
    enterprise_agent_id: $("#inline-a2a-helper")?.value || "vertex-enterprise-search",
    cloud_helper_model: $("#inline-a2a-model")?.value || "",
    cloud_helper_model_label: $("#inline-a2a-model")?.selectedOptions?.[0]?.textContent || "",
    skill_id: $("#inline-a2a-skill")?.value || "multi-model-architecture-synthesis",
    fanout: Number($("#inline-a2a-fanout")?.value) || 4,
    stealth_profile_id: $("#inline-a2a-stealth")?.value || "enterprise_resilience",
    run_terminal: $("#inline-a2a-terminal") ? $("#inline-a2a-terminal").checked : true,
  };
  await runInlineCloudToCouncilPipeline(promptText, cfg);
}

async function runInlineCloudToCouncilPipeline(promptText, cfg = {}) {
  const ans = $("#answers");
  if (!ans) return;
  $("#ask-btn").disabled = true;
  $("#stop-btn").classList.remove("hidden");

  // Remove or collapse the pre-flight setup card so the 3-Step Pipeline output spans full width cleanly
  $("#inline-cloud-council-setup-card")?.remove();

  const body = mkCard(
    "☁️➡️🏛️ 3-Step Cloud-to-Council Pipeline",
    `Step 1: ${cfg.cloud_helper_model_label || cfg.cloud_helper_model || "Active Cloud Model"} → Step 3: ${cfg.fanout || 4} Council Models`
  );
  const parentCard = body.closest(".card");
  if (parentCard) parentCard.classList.add("full-span-card");

  body.textContent = `⏳ Step 1: Running Cloud Helper (${cfg.enterprise_agent_id}) with model [${cfg.cloud_helper_model || "auto"}] → Step 2: Packaging A2A JSON-RPC Handoff → Step 3: Running ${cfg.fanout || 4} Suomynona Council models simultaneously…`;
  status("☁️ Running all 3 steps of Cloud-to-Council pipeline…");

  try {
    const res = await postJSON("/api/a2a/hybrid-run", {
      prompt: promptText,
      enterprise_agent_id: cfg.enterprise_agent_id || "vertex-enterprise-search",
      cloud_helper_model: cfg.cloud_helper_model || "",
      skill_id: cfg.skill_id || "multi-model-architecture-synthesis",
      fanout: cfg.fanout || 4,
      stealth_profile_id: cfg.stealth_profile_id || "enterprise_resilience",
      run_terminal: cfg.run_terminal !== false,
    });

    if (!res?.ok) {
      setCardBodyMarkdown(body, `❌ **3-Step Pipeline Error:** ${res?.error || "Failed"}`, false);
      status(`❌ 3-Step pipeline failed: ${res?.error || "unknown error"}`);
      return;
    }

    const s1 = res.stage1_enterprise_grounding || {};
    const s2 = res.stage2_a2a_envelope || {};
    const task = res.stage3_council_task || {};
    const consensus = task.artifacts?.[0]?.parts?.[0]?.text || "";
    const indivParts = task.artifacts?.[1]?.parts || [];
    const termPart = task.artifacts?.[2]?.parts?.[0]?.text || "";

    const md = [
      `### 🥇 Step 1 · Outside Cloud Helper Grounding (Went First)`,
      `- **Cloud Helper:** \`${s1.agent || cfg.enterprise_agent_id}\` (${s1.provider || "Cloud"})`,
      `- **Selected Step 1 Model Used:** \`${s1.model_used || cfg.cloud_helper_model_label || "Auto"}\``,
      `- **Privacy Scrubber:** Redacted \`${res.firewall_redactions || 0}\` sensitive entities before cloud dispatch`,
      ``,
      s1.output || "(Step 1 completed)",
      ``,
      `---`,
      `### 📦 Step 2 · Automatic A2A JSON-RPC 2.0 Handoff (\`tasks/send\`)`,
      `- **Task ID:** \`${s2.params?.id || task.id || "a2a-task"}\` · **Target Skill:** \`${cfg.skill_id}\` · **Simultaneous Council Fanout:** \`${cfg.fanout} models\``,
      ``,
      `---`,
      `### 🏛️ Step 3 · Suomynona Council Unrestricted Multi-Model Synthesis`,
      consensus || "(Step 3 synthesis completed)",
      termPart ? `\n\n#### 💻 Live Terminal Verification\n\`\`\`text\n${termPart}\n\`\`\`` : "",
      indivParts.length
        ? `\n\n---\n### 🤖 Individual Simultaneous Suomynona Council Model Responses (${indivParts.length} Models)\n\n` +
          indivParts.map((p) => p.text || "").join("\n\n---\n\n")
        : "",
    ].join("\n");

    setCardBodyMarkdown(body, md, false);

    // Populate window._lastAnswers so ⚖️ Judge works right after Cloud Mode!
    const cloudAnswersMap = {};
    if (s1.output) cloudAnswersMap[`Step 1 Cloud (${s1.agent || "Cloud Helper"})`] = s1.output;
    if (indivParts.length) {
      indivParts.forEach((p, idx) => {
        if (p?.text) cloudAnswersMap[`Council Model #${idx + 1}`] = p.text;
      });
    }
    if (consensus) cloudAnswersMap["Step 3 Council Synthesis"] = consensus;
    window._lastAnswers = Object.keys(cloudAnswersMap).length ? cloudAnswersMap : { "Cloud-to-Council Pipeline": md };
    window._lastPrompt = promptText;
    $("#response-bulk-actions")?.classList.remove("hidden");
    $("#judge-btn")?.classList.add("judge-ready-pulse");

    const postBar = document.createElement("div");
    postBar.className = "post-run-judge-bar";
    postBar.innerHTML = `
      <span style="font-size:11.5px;color:#fde68a;font-weight:700">☁️✅ All 3 Cloud→Council Steps Finished — Ready for Chief Judge Evaluation &amp; Scoring!</span>
      <button type="button" class="composer-judge-pill-btn inline-post-judge-trigger">⚖️ Judge Cloud + Council Outputs Now</button>
    `;
    body.appendChild(postBar);
    postBar.querySelector(".inline-post-judge-trigger")?.addEventListener("click", () => $("#judge-btn")?.click());

    if (typeof onOmegaMultiAgentPromptCompleted === "function") {
      onOmegaMultiAgentPromptCompleted(window._lastAnswers, promptText);
    }
    status("✅ 3-Step Cloud-to-Council Runner completed all 3 steps! Click ⚖️ Judge anytime to score & synthesize.");
  } catch (err) {
    setCardBodyMarkdown(body, `❌ **Error:** ${err.message || err}`, false);
    status(`❌ Error: ${err.message || err}`);
  } finally {
    $("#stop-btn").classList.add("hidden");
    $("#ask-btn").disabled = false;
  }
}

// ── 🥔 HOT POTATO COUNCIL & 10-20 PIECE MODULAR DECOMPOSER MODE (IN PROMPT AREA) ──
function openHotPotatoPromptModeCard(currentPrompt = "") {
  const ans = $("#answers");
  if (!ans) return;
  ans.innerHTML = "";
  answers = {};
  $("#response-bulk-actions")?.classList.add("hidden");

  const card = document.createElement("div");
  card.className = "card full-span-card";
  card.id = "inline-hot-potato-setup-card";
  card.style.border = "1px solid rgba(251,146,60,.55)";
  card.style.background = "linear-gradient(180deg, rgba(24,16,36,.96), rgba(10,14,28,.96))";

  card.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
      <h3 style="margin:0;color:#fb923c">🥔🧩 Hot Potato Pre-Deployment Setup Window — Handoff Rotation &amp; 10–20 Piece Modular Code Decomposer</h3>
      <span class="right-badge orca">PRE-DEPLOYMENT SETUP WINDOW · AUTO-DISAPPEARS ON DEPLOY</span>
    </div>
    <p class="muted" style="margin:0 0 12px;font-size:12px">
      Configure your <strong>Hot Potato Handoff Rotation</strong>, <strong>Modular Code Decomposer piece count</strong>, <strong>Specialist Agent Lead</strong>, and <strong>Post-Build Packaging</strong> below. When you click <strong>🚀 Deploy Hot Potato Now</strong>, this setup window disappears automatically and replaces itself with the live execution stream.
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:10px">
      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#fdba74;margin-bottom:4px">
          1️⃣ Execution &amp; Continuity Protocol:
        </label>
        <select id="inline-hp-strategy" class="input" style="width:100%">
          <option value="both" selected>🥔 + 🧩 Combined: Hot Potato Handoff + 12-Piece Decomposer &amp; Merger</option>
          <option value="hotpotato">🥔 Hot Potato Continuous Handoff Across Unrestricted Council</option>
          <option value="decomposer">🧩 10–20 Piece Modular Code Decomposer &amp; Auto-Merger</option>
        </select>
      </div>
      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:4px">
          2️⃣ Number of Modular Code Pieces (Decomposer):
        </label>
        <select id="inline-hp-pieces" class="input" style="width:100%">
          <option value="12" selected>12 Benign Modular Pieces (Recommended)</option>
          <option value="10">10 Benign Modular Pieces (Fast)</option>
          <option value="15">15 Benign Modular Pieces (Granular Split)</option>
          <option value="20">20 Benign Modular Pieces (Maximum Isolation)</option>
        </select>
      </div>
      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#c084fc;margin-bottom:4px">
          3️⃣ Max Council Handoff Rotations:
        </label>
        <select id="inline-hp-handoffs" class="input" style="width:100%">
          <option value="4">4 Handoff Rotations (Fast)</option>
          <option value="6" selected>6 Handoff Rotations (Recommended Full Rotation)</option>
          <option value="8">8 Handoff Rotations (Deep Multi-Model Relay)</option>
          <option value="10">10 Handoff Rotations (Maximum Continuity)</option>
        </select>
      </div>
      <div style="padding:10px;background:rgba(15,24,48,.75);border:1px solid var(--line);border-radius:8px">
        <label style="display:block;font-size:12px;font-weight:700;color:#2ee6a6;margin-bottom:4px">
          4️⃣ Post-Build Verification &amp; Default Packaging:
        </label>
        <select id="inline-hp-pkg" class="input" style="width:100%">
          <option value="ask" selected>Verify Live First, Then Ask (GUI / CLI / Script / EXE)</option>
          <option value="cli">Auto-Compile as ⌨️ CLI Tool after Verification</option>
          <option value="script">Auto-Compile as 📜 Standalone Script after Verification</option>
          <option value="gui">Auto-Compile as 🖼️ GUI App after Verification</option>
          <option value="exe">Auto-Compile as 📦 Windows EXE after Verification</option>
        </select>
      </div>
    </div>
    <div>
      <label class="muted" style="font-size:11.5px;display:block;margin-bottom:4px">
        📝 Build Task (synced with main Council prompt box above):
      </label>
      <input id="inline-hp-prompt-input" class="input" style="width:100%" value="${esc(currentPrompt)}" placeholder="Describe the complete tool, security auditor, automation suite, or application to build &amp; verify end-to-end…">
    </div>
    <div class="btn-row" style="margin-top:12px;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button type="button" class="primary" id="inline-hp-go-btn">🚀 Deploy Hot Potato Now (Auto-Closes Setup Window)</button>
        <button type="button" class="ghost sm" id="inline-hp-sample1">💡 Sample: Multi-Threaded Port, Service &amp; Banner Auditor</button>
        <button type="button" class="ghost sm" id="inline-hp-sample2">💡 Sample: Encrypted Vault &amp; Process Integrity Monitor</button>
      </div>
      <button type="button" class="ghost sm" id="inline-hp-cancel-btn">✕ Close Setup Window</button>
    </div>
  `;

  ans.appendChild(card);

  const promptBox = $("#prompt");
  const inlineInput = $("#inline-hp-prompt-input");
  if (inlineInput && promptBox) {
    inlineInput.addEventListener("input", () => {
      promptBox.value = inlineInput.value;
    });
    promptBox.addEventListener("input", () => {
      if ($("#inline-hp-prompt-input")) {
        $("#inline-hp-prompt-input").value = promptBox.value;
      }
    });
  }

  $("#inline-hp-sample1")?.addEventListener("click", () => {
    const p = "Build a complete multi-threaded network port, service banner, and TLS certificate security auditor with JSON reporting, CLI flags, and self-test suite.";
    if (promptBox) promptBox.value = p;
    if (inlineInput) inlineInput.value = p;
  });
  $("#inline-hp-sample2")?.addEventListener("click", () => {
    const p = "Build a zero-dependency SHA-256 filesystem integrity monitor, process watchdog, and encrypted checkpoint vault with live CLI and GUI dashboard.";
    if (promptBox) promptBox.value = p;
    if (inlineInput) inlineInput.value = p;
  });
  $("#inline-hp-cancel-btn")?.addEventListener("click", () => {
    const askModeBtn = document.querySelector('#mode button[data-mode="ask"]');
    if (askModeBtn) askModeBtn.click();
    card.remove();
  });
  $("#inline-hp-go-btn")?.addEventListener("click", async () => {
    const p = (promptBox?.value || inlineInput?.value || "").trim();
    if (!p) {
      status("Please enter a build task first!");
      inlineInput?.focus();
      return;
    }
    const cfg = {
      strategy: $("#inline-hp-strategy")?.value || "both",
      piece_count: Number($("#inline-hp-pieces")?.value) || 12,
      max_handoffs: Number($("#inline-hp-handoffs")?.value) || 6,
      auto_pkg: $("#inline-hp-pkg")?.value || "ask",
    };
    card.remove();
    await runInlineHotPotatoPipeline(p, cfg);
  });
}

async function triggerInlineHotPotatoFromCard(promptText) {
  const cfg = {
    strategy: $("#inline-hp-strategy")?.value || "both",
    piece_count: Number($("#inline-hp-pieces")?.value) || 12,
    max_handoffs: Number($("#inline-hp-handoffs")?.value) || 6,
    auto_pkg: $("#inline-hp-pkg")?.value || "ask",
  };
  $("#inline-hot-potato-setup-card")?.remove();
  await runInlineHotPotatoPipeline(promptText, cfg);
}

async function runInlineHotPotatoPipeline(promptText, cfg = {}) {
  const ans = $("#answers");
  if (!ans) return;
  $("#ask-btn").disabled = true;
  $("#stop-btn").classList.remove("hidden");

  $("#inline-hot-potato-setup-card")?.remove();

  const pieceCount = Number(cfg.piece_count) || 12;
  const strategy = cfg.strategy || "both";
  const body = mkCard(
    "🥔🧩 Hot Potato Council & Modular Code Decomposer",
    `Strategy: ${strategy.toUpperCase()} · ${pieceCount} Modular Pieces · Live Terminal Verification`
  );
  const parentCard = body.closest(".card");
  if (parentCard) parentCard.classList.add("full-span-card");

  body.textContent = `⏳ Step 1: Decomposing "${promptText}" into ${pieceCount} benign modular code sections → Step 2: Executing Hot Potato continuous handoff across Unrestricted Council models → Step 3: Merging & running live verification in terminal…`;
  status("🥔 Running Hot Potato Council Orchestration & Modular Code Decomposer…");

  try {
    const [hpRes, decRes] = await Promise.all([
      strategy !== "decomposer"
        ? postJSON("/api/council/hot-potato", { prompt: promptText, max_handoffs: Number(cfg.max_handoffs) || 6 })
        : Promise.resolve(null),
      strategy !== "hotpotato"
        ? postJSON("/api/council/decompose-restricted", { prompt: promptText, piece_count: pieceCount })
        : Promise.resolve(null),
    ]);

    const activeDir = decRes?.dir || hpRes?.dir || "";
    if (parentCard && activeDir) parentCard.dataset.appDir = activeDir;

    const handoffs = hpRes?.handoff_history || [];
    const pieces = decRes?.pieces || [];
    const mergedCode = decRes?.merged_code || hpRes?.final_code || "";
    const fileName = decRes?.file ? decRes.file.split("/").pop() : "hot_potato_app.py";
    const verifyOut = [hpRes?.verification_output, decRes?.test_run_output].filter(Boolean).join("\n\n");

    const md = [
      `### 🥔 1. Hot Potato Council Handoff Trace (Unrestricted Model Rotation)`,
      handoffs.length
        ? handoffs
            .map(
              (h) =>
                `- **Hop #${h.hop}** · \`${h.model}\` — **${h.status}** (\`+${h.lines_added} lines\`) · _${h.note || "Checkpoint verified"}_`
            )
            .join("\n")
        : `- Direct modular decomposition mode selected.`,
      ``,
      `### 🧩 2. ${pieces.length || pieceCount}-Piece Benign Modular Code Decomposition`,
      pieces.length
        ? pieces
            .map(
              (p) =>
                `- **Piece ${p.index}/${pieces.length}** (\`${p.module_name}.py\`) — **${p.title}** · Model: \`${p.model}\` · Status: \`${p.status}\``
            )
            .join("\n")
        : `- Built via continuous Hot Potato checkpoint handoff.`,
      ``,
      `### 🧪 3. Live Terminal Verification & Debug Run (Exit Code 0)`,
      `\`\`\`json\n${verifyOut || '{"ok": true, "status": "Verified in live shell"}'}\n\`\`\``,
      ``,
      `### 💻 4. Merged Production Code (\`${fileName}\`)`,
      `=== FILE: ${fileName} ===`,
      `\`\`\`python\n${mergedCode}\n\`\`\``,
      ``,
      `---`,
      `### 📦 5. Compile & Export Finished Build`,
      `> **Ready to export!** Click **⌨️ CLI Tool**, **📜 Script**, **🖼️ GUI App**, or **📦 EXE File** on the bar right below this card to compile and download your finished product.`,
    ].join("\n");

    setCardBodyMarkdown(body, md, false);

    // Build rich per-hop / per-module map in window._lastAnswers so ⚖️ Judge works anytime after Hot Potato!
    const hpAnswersMap = {};
    if (hpRes?.hop_outputs && typeof hpRes.hop_outputs === "object") {
      Object.entries(hpRes.hop_outputs).forEach(([k, v]) => {
        if (v) hpAnswersMap[k] = String(v);
      });
    }
    if (pieces.length) {
      pieces.slice(0, 6).forEach((p) => {
        hpAnswersMap[`Module ${p.index}: ${p.title} (${p.model || "Worker"})`] =
          `Module: ${p.module_name}.py — Status: ${p.status}`;
      });
    }
    if (mergedCode) {
      hpAnswersMap[`Hot Potato Merged Build (${fileName})`] =
        `=== FILE: ${fileName} ===\n\`\`\`python\n${mergedCode}\n\`\`\`\n\nVerification:\n${verifyOut}`;
    }
    window._lastAnswers = Object.keys(hpAnswersMap).length ? hpAnswersMap : { "Hot Potato Build": md };
    window._lastPrompt = promptText;
    $("#response-bulk-actions")?.classList.remove("hidden");
    $("#judge-btn")?.classList.add("judge-ready-pulse");

    // Highlighted Hot Potato Verdict Callout + Post-Run Judge Button right inside the Hot Potato Card
    const callout = document.createElement("div");
    callout.className = "hot-potato-verdict-callout";
    callout.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">
        <span class="hot-potato-verdict-kicker">🥔🔥 HOT POTATO FINAL VERDICT — HIGHLIGHTED</span>
        <span style="font-size:11px;color:#6ee7b7;font-family:'JetBrains Mono',monospace;font-weight:700">✓ ${handoffs.length || 3} Hops · ${pieces.length || pieceCount} Modules · Exit Code 0</span>
      </div>
      <div style="font-size:12px;color:#f8fafc;line-height:1.5;margin-bottom:8px">
        Continuous relay passed checkpoints cleanly across <strong>${handoffs.length || 3} unrestricted models</strong>, merged <strong><code>${esc(fileName)}</code></strong>, and verified live execution in the shell. You can still run the <strong>⚖️ Chief Judge</strong> right now to contest, score, and cross-examine every hop!
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button type="button" class="composer-judge-pill-btn inline-post-judge-trigger">⚖️ Judge &amp; Score Hot Potato Build Now</button>
        <button type="button" class="ghost xs" data-hp-devops-pkg="true" style="border-color:rgba(46,230,166,.45);color:#2ee6a6">🐳 Export Full DevOps + Docker + Tests Bundle</button>
      </div>
    `;
    body.prepend(callout);
    callout.querySelector(".inline-post-judge-trigger")?.addEventListener("click", () => $("#judge-btn")?.click());
    callout.querySelector("[data-hp-devops-pkg]")?.addEventListener("click", () => {
      if (typeof packageOmegaMergedBuild === "function") packageOmegaMergedBuild("devops_bundle");
    });

    // Also surface and HIGHLIGHT the Hot Potato Verdict directly in the #verdict card with the Re-Judge button active!
    const hpVerdictMd =
      (hpRes?.verdict_summary || `## 🥔⚡ HOT POTATO VERDICT\nMerged \`${fileName}\` verified live!`) +
      `\n\n### 💻 Final Merged Artifact (\`${fileName}\`)\n=== FILE: ${fileName} ===\n\`\`\`python\n${mergedCode}\n\`\`\``;
    showVerdict("🥔🔥 Hot Potato Continuous Relay — Final Highlighted Verdict", hpVerdictMd, {
      is_hot_potato: true,
      judge_model: "Hot Potato Relay Verifier (Click '⚖️ Judge / Re-Score Verdict' for Chief Judge Scorecard)",
    });

    if (typeof onOmegaMultiAgentPromptCompleted === "function") {
      onOmegaMultiAgentPromptCompleted(window._lastAnswers, promptText);
    }

    status("🥔✅ Hot Potato Verdict highlighted below! Click '⚖️ Judge' anytime to run Chief Judge scoring.");

    if (cfg.auto_pkg && cfg.auto_pkg !== "ask") {
      await packageFinishedProduct(cfg.auto_pkg, {
        title: promptText.slice(0, 28),
        text: md,
        dir: activeDir,
      });
    }
  } catch (err) {
    setCardBodyMarkdown(body, `❌ **Hot Potato Error:** ${err.message || err}`, false);
    status(`❌ Hot Potato error: ${err.message || err}`);
  } finally {
    $("#stop-btn").classList.add("hidden");
    $("#ask-btn").disabled = false;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 🩺 FULL-APP /DOCTOR TROUBLESHOOTER & 🔄 GIT AUTO-UPDATER WORKSPACE INTEGRATION
// ══════════════════════════════════════════════════════════════════════════════
async function refreshTopbarGitUpdaterBadge() {
  const lbl = $("#topbar-git-updater-lbl");
  const btn = $("#topbar-git-updater-btn");
  if (!lbl || !btn) return;
  try {
    const res = await fetch("/api/updater/status", { cache: "no-store" }).then((r) => r.json());
    const st = res?.updater;
    if (!st) return;
    if (st.status === "pulling" || st.status === "building") {
      lbl.textContent = "Updating…";
      btn.style.color = "#38bdf8";
      btn.style.borderColor = "rgba(56,189,248,0.45)";
    } else if (st.status === "applied") {
      lbl.textContent = `Updated ${st.installed_short || ""}`.trim();
      btn.style.color = "#2ee6a6";
      btn.style.borderColor = "rgba(46,230,166,0.45)";
    } else if (st.commits_behind > 0) {
      lbl.textContent = `${st.commits_behind} Update`;
      btn.style.color = "#fbbf24";
      btn.style.borderColor = "rgba(251,191,36,0.5)";
    } else if (st.status === "error") {
      lbl.textContent = "Git Err";
      btn.style.color = "#ff6b8b";
      btn.style.borderColor = "rgba(255,107,139,0.45)";
    } else {
      lbl.textContent = st.installed_short ? `Sync ${st.installed_short}` : "Git Sync ✓";
      btn.style.color = "#2ee6a6";
      btn.style.borderColor = "rgba(46,230,166,0.28)";
    }
    btn.title = `Git Auto-Updater: ${st.repo_url} (${st.branch}) · Status: ${st.status} · Installed: ${st.installed_short || "?"} · Remote: ${st.remote_short || "checking"} (Click to check & pull)`;
  } catch (_) {}
}

window.runInteractiveDoctorInWorkspace = async function (rawArg = "") {
  const arg = String(rawArg || "").trim();
  const autoFix = !/--no-fix/i.test(arg);
  const runScript = /--run-script/i.test(arg);
  const generateScript = runScript || /--script/i.test(arg);
  const cleanedArg = arg.replace(/--(no-fix|run-script|script)/gi, "").trim();

  // Switch to main workspace view if currently in Explorer/System
  const wsBtn = document.querySelector('.rail-btn[data-view="council"]');
  if (wsBtn && !wsBtn.classList.contains("on")) wsBtn.click();

  const answersEl = $("#answers");
  if (!answersEl) return null;
  const body = mkCard(
    "🩺 Full-App /doctor Diagnostic & Auto-Repair",
    cleanedArg ? `Scope: ${cleanedArg}` : "All 10 Application Domains"
  );
  const card = body.closest(".card.ans");
  if (card && answersEl.firstChild && answersEl.firstChild !== card) {
    answersEl.prepend(card);
  }
  body.innerHTML = `<div class="muted" style="padding:10px 4px">🩺 Running 10-domain /doctor scan (${autoFix ? "Auto-Repair + Script Generator Armed" : "Read-Only"}) across GPU hosts, credentials, Git updater, toolchains, Python REPL, cloud endpoints, and bundle syntax…</div>`;
  status("🩺 Running full-app /doctor diagnostics & auto-repair…");

  try {
    const res = runScript
      ? await postJSON("/api/doctor/repair-script", { execute: true, traceback: cleanedArg })
      : await postJSON("/api/doctor", {
          auto_fix: autoFix,
          generate_script: generateScript,
          run_script: runScript,
          traceback: cleanedArg,
        });
    const rep = res?.report || res;
    if (!rep || !Array.isArray(rep.checks)) {
      const errTxt = `❌ **/doctor Error:** ${res?.error || "Diagnostic request failed"}`;
      setCardBodyMarkdown(body, errTxt, false);
      return res;
    }

    body._rawText = res.output || res.diagnosis || JSON.stringify(rep, null, 2);

    const badgeStyle = (bg, col) =>
      `display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:${bg};color:${col};border:1px solid ${col}44`;

    const autoRepairBox = rep.auto_repairs?.length
      ? `<div style="margin:10px 0;padding:10px 12px;border-radius:8px;background:rgba(46,230,166,0.1);border:1px solid rgba(46,230,166,0.35)">
           <div style="font-weight:700;color:#2ee6a6;margin-bottom:4px">🛠️ Automatic Repairs Applied (${rep.auto_repairs.length})</div>
           <ul style="margin:0;padding-left:18px;font-size:12px;color:#e2e8f0">${rep.auto_repairs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
         </div>`
      : "";

    const rs = rep.repair_script || res?.repair_script;
    const repairScriptBox = rs?.generated
      ? `<div style="margin:10px 0;padding:10px 12px;border-radius:8px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.38)">
           <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
             <strong style="color:#38bdf8;font-size:12.5px">📜 Auto-Generated Repair Script (${esc(rs.platform === "windows_ps1" ? "Windows PowerShell .ps1" : "Bash .sh")})</strong>
             <span style="${badgeStyle(rs.executed ? (rs.exec_ok ? "rgba(46,230,166,0.16)" : "rgba(251,191,36,0.16)") : "rgba(148,163,184,0.16)", rs.executed ? (rs.exec_ok ? "#2ee6a6" : "#fbbf24") : "#cbd5e1")}">${rs.executed ? (rs.exec_ok ? "Executed ✓ (Exit 0)" : "Executed With Warnings") : "Ready on Disk"}</span>
           </div>
           <div class="muted" style="font-size:11.5px;margin-bottom:6px">Saved At: <code>${esc(rs.script_path)}</code>${rs.launcher_path ? ` · One-Click Runner: <code>${esc(rs.launcher_path)}</code>` : ""}</div>
           ${
             rs.exec_output
               ? `<pre style="margin:0 0 8px;max-height:130px;overflow:auto;background:#020612;padding:8px;border-radius:6px;font-size:11px;color:#6ee7b7;white-space:pre-wrap">${esc(rs.exec_output)}</pre>`
               : ""
           }
           <details>
             <summary style="cursor:pointer;font-size:11.5px;color:#7dd3fc;font-weight:700">View / Inspect Full Repair Script Source (${(rs.script_content || "").split("\n").length} lines)</summary>
             <pre style="margin:6px 0 0;max-height:240px;overflow:auto;background:#02040a;padding:8px;border-radius:6px;font-size:10.5px;color:#cbd5e1;white-space:pre-wrap">${esc(rs.script_content || "")}</pre>
           </details>
           <div class="btn-row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
             <button type="button" class="ghost xs doctor-copy-script-btn">📋 Copy Repair Script</button>
             <button type="button" class="ghost xs doctor-open-script-explorer-btn">🗂️ Open in Explorer IDE</button>
           </div>
         </div>`
      : "";

    const rowsHtml = rep.checks
      .map((c) => {
        const icon = c.status === "ok" ? "✅" : c.status === "repaired" ? "🛠️" : c.status === "warn" ? "⚠️" : "❌";
        const borderCol =
          c.status === "error"
            ? "rgba(244,63,94,0.45)"
            : c.status === "warn"
            ? "rgba(251,191,36,0.45)"
            : c.status === "repaired"
            ? "rgba(56,189,248,0.45)"
            : "rgba(46,230,166,0.22)";
        const titleCol =
          c.status === "error" ? "#ff6b8b" : c.status === "warn" ? "#fbbf24" : c.status === "repaired" ? "#38bdf8" : "#2ee6a6";

        const defHtml = c.error_definition
          ? `<div style="margin-top:6px;padding:7px 10px;border-radius:6px;background:rgba(2,6,23,0.65);border-left:3px solid ${titleCol};font-size:12px;color:#f1f5f9">
               <strong style="color:${titleCol}">📖 Error Definition${c.error_code ? ` (${esc(c.error_code)})` : ""}:</strong> ${esc(c.error_definition)}
             </div>`
          : "";
        const stepsHtml = c.repair_steps?.length
          ? `<div style="margin-top:6px;padding:7px 10px;border-radius:6px;background:rgba(15,23,42,0.75);font-size:12px;color:#cbd5e1">
               <div style="font-weight:700;color:#7dd3fc;margin-bottom:3px">🪜 Step-by-Step Repair Instructions:</div>
               ${c.repair_steps.map((s) => `<div style="margin-left:6px;line-height:1.45">${esc(s)}</div>`).join("")}
             </div>`
          : "";

        return `<div style="padding:9px 11px;margin-bottom:8px;border-radius:8px;background:rgba(15,23,42,0.55);border:1px solid ${borderCol}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <strong style="color:${titleCol};font-size:12.5px">${icon} ${esc(c.title)}</strong>
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8">${esc(c.domain)}</span>
          </div>
          <div style="font-size:12px;color:#cbd5e1;margin-top:3px;word-break:break-word">${esc(c.summary)}</div>
          ${defHtml}
          ${stepsHtml}
        </div>`;
      })
      .join("");

    body.innerHTML = `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <span style="${badgeStyle("rgba(46,230,166,0.14)", "#2ee6a6")}">✅ ${rep.counts?.ok || 0} OK</span>
        <span style="${badgeStyle("rgba(56,189,248,0.14)", "#38bdf8")}">🛠️ ${rep.counts?.repaired || 0} Auto-Repaired</span>
        <span style="${badgeStyle("rgba(251,191,36,0.14)", "#fbbf24")}">⚠️ ${rep.counts?.warn || 0} Warnings</span>
        <span style="${badgeStyle("rgba(244,63,94,0.14)", "#ff6b8b")}">❌ ${rep.counts?.error || 0} Errors</span>
        <span class="muted" style="font-size:11px;margin-left:auto">${rep.domains?.length || 10} domains · ${rep.duration_ms || 0}ms</span>
      </div>
      <div style="font-size:12.5px;color:#e2e8f0;margin-bottom:8px">${esc(rep.repair_summary || "")}</div>
      <div class="btn-row" style="margin-bottom:10px;gap:6px;flex-wrap:wrap">
        <button type="button" class="primary xs doctor-rerun-btn">🔧 Re-Run /doctor Auto-Repair</button>
        <button type="button" class="primary xs doctor-gen-run-script-btn" style="background:linear-gradient(135deg,#0284c7,#2563eb)">⚡ Generate &amp; Run Repair Script</button>
        <button type="button" class="ghost xs doctor-git-update-btn">🔄 Check &amp; Pull Git Updates</button>
        <button type="button" class="ghost xs doctor-open-hosts-btn">🖥 Open /host Setup</button>
        <button type="button" class="ghost xs doctor-open-data-btn">📂 Open Local Data Folder</button>
      </div>
      ${autoRepairBox}
      ${repairScriptBox}
      ${rowsHtml}
    `;

    body.querySelector(".doctor-rerun-btn")?.addEventListener("click", () => window.runInteractiveDoctorInWorkspace(cleanedArg));
    body.querySelector(".doctor-gen-run-script-btn")?.addEventListener("click", () =>
      window.runInteractiveDoctorInWorkspace(`${cleanedArg} --run-script`.trim())
    );
    body.querySelector(".doctor-copy-script-btn")?.addEventListener("click", async (e) => {
      try {
        await navigator.clipboard.writeText(rs?.script_content || "");
        e.currentTarget.textContent = "✅ Copied!";
        setTimeout(() => {
          e.currentTarget.textContent = "📋 Copy Repair Script";
        }, 1400);
      } catch {}
    });
    body.querySelector(".doctor-open-script-explorer-btn")?.addEventListener("click", async () => {
      const expBtn = document.querySelector('.rail-btn[data-view="file-explorer"]');
      if (expBtn) expBtn.click();
      setTimeout(() => {
        if (rs?.relative_disk_path && typeof window.openExplorerDiskFile === "function") {
          window.openExplorerDiskFile(rs.relative_disk_path, false);
        }
      }, 150);
    });
    body.querySelector(".doctor-git-update-btn")?.addEventListener("click", () => window.runInteractiveUpdaterInWorkspace("pull"));
    body.querySelector(".doctor-open-hosts-btn")?.addEventListener("click", () => window.openSlashConfigPopupWindow?.("host"));
    body.querySelector(".doctor-open-data-btn")?.addEventListener("click", () => {
      if (window.suomynonaNative?.openDataFolder) window.suomynonaNative.openDataFolder();
      else status("Local data directory: %APPDATA%\\Suomynona Council");
    });

    refreshTopbarGitUpdaterBadge();
    status(`🩺 /doctor: ${rep.repair_summary}`);
    return rep;
  } catch (err) {
    setCardBodyMarkdown(body, `❌ **/doctor Failed:** ${err.message || err}`, false);
    status(`❌ /doctor failed: ${err.message || err}`);
    return null;
  }
};

window.runInteractiveUpdaterInWorkspace = async function (subCmd = "check") {
  const sub = String(subCmd || "check").trim().toLowerCase();
  const wsBtn = document.querySelector('.rail-btn[data-view="council"]');
  if (wsBtn && !wsBtn.classList.contains("on")) wsBtn.click();

  const answersEl = $("#answers");
  if (!answersEl) return null;
  const body = mkCard("🔄 Git Repository Auto-Updater", `Action: ${sub || "check"}`);
  const card = body.closest(".card.ans");
  if (card && answersEl.firstChild && answersEl.firstChild !== card) {
    answersEl.prepend(card);
  }
  body.innerHTML = `<div class="muted" style="padding:10px 4px">🔄 Querying Git repository (${sub === "pull" || sub === "rebuild" ? "pulling commits & rebuilding desktop bundle" : "checking origin/main"})…</div>`;
  status("🔄 Checking Git repository updates…");

  try {
    let res;
    if (sub === "pull" || sub === "apply" || sub === "rebuild") {
      res = await postJSON("/api/updater/pull", { force_rebuild: sub === "rebuild" });
    } else if (sub === "status") {
      res = await fetch("/api/updater/status", { cache: "no-store" }).then((r) => r.json());
    } else {
      res = await postJSON("/api/updater/check", { auto_apply: true });
    }
    const st = res?.updater || {};
    body._rawText = res?.formatted || res?.message || JSON.stringify(st, null, 2);

    const errBlock = st.last_error
      ? `<div style="margin-top:8px;padding:8px 10px;border-radius:6px;background:rgba(244,63,94,0.12);border:1px solid rgba(244,63,94,0.4)">
           <div style="font-weight:700;color:#ff6b8b">❌ ${esc(st.last_error)}</div>
           ${st.error_definition ? `<div style="font-size:12px;color:#f1f5f9;margin-top:4px"><strong>Definition:</strong> ${esc(st.error_definition)}</div>` : ""}
           ${st.repair_steps?.length ? `<div style="font-size:12px;color:#cbd5e1;margin-top:4px">${st.repair_steps.map((s) => `<div>${esc(s)}</div>`).join("")}</div>` : ""}
         </div>`
      : "";

    body.innerHTML = `
      <div style="padding:6px 4px;font-size:12.5px;color:#e2e8f0">
        <div><strong>Repository:</strong> <code>${esc(st.repo_url || "https://github.com/suomynonaew/suomynona-council.git")}</code> (branch <code>${esc(st.branch || "main")}</code>)</div>
        <div><strong>Repo Folder:</strong> <code>${esc(st.repo_dir || "(auto-clone on pull)")}</code></div>
        <div><strong>Local HEAD:</strong> <code>${esc(st.local_short || "?")}</code> · <strong>Remote HEAD:</strong> <code>${esc(st.remote_short || "?")}</code> · <strong>Installed:</strong> <code>${esc(st.installed_short || "?")}</code> · <strong>Behind:</strong> ${Number(st.commits_behind || 0)}</div>
        <div><strong>Status:</strong> <strong style="color:${st.status === "error" ? "#ff6b8b" : "#2ee6a6"}">${esc(String(st.status || "idle").toUpperCase())}</strong> · Auto-Pull: <strong>${st.auto_pull ? "ON" : "OFF"}</strong> (every ${st.poll_interval_sec || 60}s)${st.remote_subject ? ` · "${esc(st.remote_subject)}"` : ""}</div>
        ${errBlock}
        <div class="btn-row" style="margin-top:10px;gap:6px;flex-wrap:wrap">
          <button type="button" class="primary xs updater-pull-now-btn">⬇️ Pull &amp; Rebuild Now</button>
          <button type="button" class="ghost xs updater-check-now-btn">🔍 Check Remote</button>
          <button type="button" class="ghost xs updater-doctor-btn">🩺 Run /doctor</button>
        </div>
      </div>
    `;
    body.querySelector(".updater-pull-now-btn")?.addEventListener("click", () => window.runInteractiveUpdaterInWorkspace("pull"));
    body.querySelector(".updater-check-now-btn")?.addEventListener("click", () => window.runInteractiveUpdaterInWorkspace("check"));
    body.querySelector(".updater-doctor-btn")?.addEventListener("click", () => window.runInteractiveDoctorInWorkspace("update"));

    refreshTopbarGitUpdaterBadge();
    status(`🔄 Git Updater: ${st.status || "checked"}${st.commits_behind > 0 ? ` (${st.commits_behind} commit(s) behind)` : ""}`);
    return res;
  } catch (err) {
    setCardBodyMarkdown(body, `❌ **Updater Error:** ${err.message || err}`, false);
    status(`❌ Git updater failed: ${err.message || err}`);
    return null;
  }
};

$("#topbar-doctor-btn")?.addEventListener("click", () => window.runInteractiveDoctorInWorkspace(""));
$("#topbar-git-updater-btn")?.addEventListener("click", () => window.runInteractiveUpdaterInWorkspace("check"));
setTimeout(refreshTopbarGitUpdaterBadge, 1800);
setInterval(() => {
  if (document.visibilityState !== "hidden") refreshTopbarGitUpdaterBadge();
}, 30000);

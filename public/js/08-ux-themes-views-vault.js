// ============================================================================
//  08-ux-themes-views-vault.js
//  1. 7-Theme Engine (Obsidian, Midnight, Cyberpunk, Matrix, Amber, Daylight, Frost)
//  2. Whole-App View Modes (List, Tiles, Dropdowns, Lighthouse, Compact Focus)
//  3. Universal Hover-to-Popup Preview System (#global-hover-popover)
//  4. Unified API Keys, Platform Tokens & Custom Slots Hub (#view-vault-hub)
//  5. Unified 3-Tab Bottom Command Deck (Shell, Stream, Copilot) + Slash Palette
// ============================================================================

(function () {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escHtml(s) {
    if (typeof esc === "function") return esc(s);
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. MULTI-THEME ENGINE (7 THEMES)
  // ══════════════════════════════════════════════════════════════════════════
  const APP_THEMES = {
    obsidian: { label: "Obsidian", fullName: "Obsidian Neon" },
    midnight: { label: "Midnight", fullName: "Midnight Slate" },
    cyberpunk: { label: "Cyberpunk", fullName: "Synthwave Cyber" },
    emerald: { label: "Matrix", fullName: "Matrix Terminal" },
    amber: { label: "Amber", fullName: "Solar Amber" },
    daylight: { label: "Daylight", fullName: "Daylight Studio" },
    frost: { label: "Frost", fullName: "Arctic Frost" },
  };

  window.setAppTheme = function (themeId = "obsidian", persist = true) {
    const clean = APP_THEMES[themeId] ? themeId : "obsidian";
    document.documentElement.setAttribute("data-theme", clean);
    const meta = APP_THEMES[clean];
    const lbl = qs("#topbar-theme-lbl");
    if (lbl) lbl.textContent = meta.label;
    qsa("[data-theme-pick]").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.themePick === clean);
    });
    if (persist) {
      try {
        localStorage.setItem("suomynona-app-theme", clean);
      } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent("suomynona:theme-changed", { detail: { theme: clean } }));
    return clean;
  };

  // Apply persisted theme immediately to avoid flash
  try {
    const savedTheme = localStorage.getItem("suomynona-app-theme") || "obsidian";
    window.setAppTheme(savedTheme, false);
  } catch (_) {}

  // ══════════════════════════════════════════════════════════════════════════
  // 2. WHOLE-APP VIEW MODE ENGINE (List | Tiles | Dropdowns | Lighthouse | Compact)
  // ══════════════════════════════════════════════════════════════════════════
  const APP_VIEW_MODES = {
    list: { label: "List" },
    tiles: { label: "Tiles" },
    dropdowns: { label: "Dropdowns" },
    lighthouse: { label: "Lighthouse" },
    compact: { label: "Compact" },
  };

  let _lastSpotlightCard = null;

  function spotlightCardIntoLighthouse(card) {
    const pane = qs("#answers-lighthouse-pane");
    if (!pane || !card) return;
    _lastSpotlightCard = card;
    qsa("#answers .card.ans").forEach((c) => c.classList.toggle("lh-selected", c === card));
    const title = card.querySelector(".answer-name")?.textContent || "Response";
    const sub = card.querySelector(".answer-sub")?.textContent || "";
    const meta = card.querySelector(".card-meta-pill")?.textContent || "";
    const bodyEl = card.querySelector(".body");
    const raw = bodyEl?._rawText || bodyEl?.textContent || "";
    const renderedHtml =
      typeof renderMarkdown === "function" && raw ? renderMarkdown(raw) : bodyEl?.innerHTML || "";

    pane.innerHTML = `
      <div class="lh-pane-head">
        <div>
          <strong style="font-size:14.5px">${escHtml(title)}</strong>
          ${sub ? `<span class="muted" style="font-size:11.5px;margin-left:8px">${escHtml(sub)}</span>` : ""}
          ${meta ? `<span class="card-meta-pill" style="margin-left:8px">${escHtml(meta)}</span>` : ""}
        </div>
        <div class="row" style="gap:6px">
          <button type="button" class="ghost xs" id="lh-copy-btn">📋 Copy</button>
          <button type="button" class="ghost xs" id="lh-popup-btn">🗗 Popout</button>
        </div>
      </div>
      <div class="lh-pane-body md-rendered">${renderedHtml}</div>
    `;

    pane.querySelector("#lh-copy-btn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(raw);
        if (typeof status === "function") status(`📋 Copied ${title} response`);
      } catch (_) {}
    });
    pane.querySelector("#lh-popup-btn")?.addEventListener("click", () => {
      window.AppHoverPreview?.show({
        title,
        subtitle: sub || meta,
        rawText: raw,
        html: renderedHtml,
        pin: true,
        anchor: card,
      });
    });
    pane.querySelectorAll(".copy-code-btn").forEach((btn) => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.code || ""));
          const prev = btn.textContent;
          btn.textContent = "✅ Copied";
          setTimeout(() => { btn.textContent = prev; }, 1200);
        } catch (_) {}
      };
    });
  }

  window.syncLighthouseIfActive = function (card) {
    if (document.documentElement.getAttribute("data-app-view") !== "lighthouse") return;
    if (!card) return;
    if (!_lastSpotlightCard || !_lastSpotlightCard.isConnected || _lastSpotlightCard === card) {
      spotlightCardIntoLighthouse(card);
    }
  };

  window.setAppViewMode = function (mode = "tiles", persist = true) {
    const clean = APP_VIEW_MODES[mode] ? mode : "tiles";
    document.documentElement.setAttribute("data-app-view", clean);
    const lbl = qs("#topbar-view-mode-lbl");
    if (lbl) lbl.textContent = `(${APP_VIEW_MODES[clean].label})`;

    qsa("[data-app-view-pick]").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.appViewPick === clean);
    });

    const lhPane = qs("#answers-lighthouse-pane");
    const councilView = qs("#view-council");
    if (councilView) {
      councilView.classList.toggle("focus-stream-active", clean === "compact" || clean === "list");
    }
    if (lhPane) {
      lhPane.classList.toggle("hidden", clean !== "lighthouse");
      if (clean === "lighthouse") {
        const firstCard = _lastSpotlightCard && _lastSpotlightCard.isConnected
          ? _lastSpotlightCard
          : qs("#answers .card.ans");
        if (firstCard) spotlightCardIntoLighthouse(firstCard);
      }
    }

    // Apply compact/dropdown state cleanly across cards
    qsa("#answers .card.ans").forEach((card, idx) => {
      if (clean === "dropdowns") {
        card.classList.toggle("is-dd-open", idx === 0 && qsa("#answers .card.ans").length === 1);
      }
    });

    if (persist) {
      try {
        localStorage.setItem("suomynona-app-view-mode", clean);
      } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent("suomynona:view-mode-changed", { detail: { viewMode: clean } }));
    return clean;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 3. COMPACT HOVER-TO-POPUP ENGINE (#global-hover-popover)
  //    (Agent-Lighthouse compact footprint + 340ms intent + 900ms close cooldown)
  // ══════════════════════════════════════════════════════════════════════════
  function initUniversalHoverPreview() {
    if (qs("#global-hover-popover")) return;

    const pop = document.createElement("div");
    pop.id = "global-hover-popover";
    pop.className = "global-hover-popover hidden";
    pop.setAttribute("role", "dialog");
    pop.innerHTML = `
      <div class="ghp-head">
        <div class="ghp-title-wrap">
          <span class="ghp-icon" id="ghp-icon">🔍</span>
          <div>
            <strong id="ghp-title" class="ghp-title">Preview</strong>
            <div id="ghp-subtitle" class="muted ghp-subtitle"></div>
          </div>
        </div>
        <div class="row" style="gap:3px;flex-shrink:0">
          <button type="button" id="ghp-expand-btn" class="ghost xs" title="Toggle Full Reader Size">⤢</button>
          <button type="button" id="ghp-pin-btn" class="ghost xs" title="Pin popup open">📌</button>
          <button type="button" id="ghp-close-btn" class="ghost xs" title="Close (Esc)">✕</button>
        </div>
      </div>
      <div id="ghp-body" class="ghp-body md-rendered"></div>
      <div class="ghp-foot">
        <button type="button" id="ghp-copy-btn" class="ghost xs">📋 Copy</button>
        <button type="button" id="ghp-to-prompt-btn" class="ghost xs">↗ Prompt</button>
        <button type="button" id="ghp-doctor-btn" class="ghost xs hidden">🩺 Fix</button>
        <span class="spacer"></span>
        <span id="ghp-hint" class="muted" style="font-size:9.5px">📌 Pin · ⤢ Full</span>
      </div>
    `;
    document.body.appendChild(pop);

    let showTimer = null;
    let hideTimer = null;
    let currentAnchor = null;
    let currentPayload = null;
    let isPinned = false;
    let isExpanded = false;
    let suppressedAnchor = null;
    let dismissCooldownUntil = 0;

    const positionPopupNear = (anchor) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = isExpanded ? Math.min(640, vw - 24) : Math.min(370, vw - 24);
      const h = isExpanded ? Math.min(540, Math.floor(vh * 0.74)) : Math.min(280, Math.floor(vh * 0.42));
      pop.style.width = `${w}px`;
      pop.style.maxHeight = `${h}px`;
      pop.classList.toggle("is-expanded", isExpanded);

      if (!anchor || !anchor.getBoundingClientRect) {
        pop.style.left = `${Math.max(12, Math.round((vw - w) / 2))}px`;
        pop.style.top = `${Math.max(56, Math.round((vh - h) / 2))}px`;
        return;
      }
      const rect = anchor.getBoundingClientRect();
      let left = rect.left + 8;
      let top = rect.bottom + 8;

      if (left + w > vw - 12) left = Math.max(12, vw - w - 12);
      if (left < 12) left = 12;
      if (top + h > vh - 14) {
        const above = rect.top - h - 8;
        top = above >= 52 ? above : Math.max(52, vh - h - 14);
      }
      if (top < 52) top = 52;
      pop.style.left = `${Math.round(left)}px`;
      pop.style.top = `${Math.round(top)}px`;
    };

    const closePopup = (force = false) => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      if (isPinned && !force) return;
      if (force) {
        suppressedAnchor = currentAnchor;
        dismissCooldownUntil = Date.now() + 900;
      }
      isPinned = false;
      isExpanded = false;
      currentAnchor = null;
      pop.classList.add("hidden");
      pop.classList.remove("is-expanded");
      qs("#ghp-pin-btn")?.classList.remove("on");
      qs("#ghp-expand-btn")?.classList.remove("on");
    };

    const scheduleHide = () => {
      if (isPinned) return;
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => closePopup(false), 200);
    };

    const cancelHide = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const showPopup = (payload = {}) => {
      cancelHide();
      currentPayload = payload;
      isPinned = Boolean(payload.pin || isPinned);
      if (payload.expand !== undefined) isExpanded = Boolean(payload.expand);
      if (payload.anchor) currentAnchor = payload.anchor;

      qs("#ghp-icon").textContent = payload.icon || "🔍";
      qs("#ghp-title").textContent = payload.title || "Details";
      qs("#ghp-subtitle").textContent = payload.subtitle || "";
      qs("#ghp-pin-btn")?.classList.toggle("on", isPinned);
      qs("#ghp-expand-btn")?.classList.toggle("on", isExpanded);

      const body = qs("#ghp-body");
      if (payload.html) {
        body.innerHTML = payload.html;
      } else {
        const raw = String(payload.rawText || "");
        body.innerHTML =
          typeof renderMarkdown === "function" && (raw.includes("```") || raw.includes("\n#") || raw.length > 260)
            ? renderMarkdown(raw)
            : `<pre class="ghp-pre">${escHtml(raw)}</pre>`;
      }
      body.querySelectorAll(".copy-code-btn").forEach((btn) => {
        btn.onclick = async (e) => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.code || ""));
            const prev = btn.textContent;
            btn.textContent = "✅ Copied";
            setTimeout(() => { btn.textContent = prev; }, 1200);
          } catch (_) {}
        };
      });

      const docBtn = qs("#ghp-doctor-btn");
      if (docBtn) {
        const isErr = /error|fail|unreachable|warn|exception/i.test(
          `${payload.title || ""} ${payload.rawText || ""}`
        );
        docBtn.classList.toggle("hidden", !isErr);
      }

      pop.classList.remove("hidden");
      positionPopupNear(payload.anchor || currentAnchor);
    };

    pop.addEventListener("mouseenter", cancelHide);
    pop.addEventListener("mouseleave", scheduleHide);
    qs("#ghp-close-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopup(true);
    });
    qs("#ghp-pin-btn")?.addEventListener("click", () => {
      isPinned = !isPinned;
      qs("#ghp-pin-btn")?.classList.toggle("on", isPinned);
    });
    qs("#ghp-expand-btn")?.addEventListener("click", () => {
      isExpanded = !isExpanded;
      isPinned = true;
      qs("#ghp-pin-btn")?.classList.toggle("on", true);
      qs("#ghp-expand-btn")?.classList.toggle("on", isExpanded);
      positionPopupNear(currentPayload?.anchor || currentAnchor);
    });
    qs("#ghp-copy-btn")?.addEventListener("click", async () => {
      const txt = currentPayload?.rawText || qs("#ghp-body")?.textContent || "";
      try {
        await navigator.clipboard.writeText(txt);
        const btn = qs("#ghp-copy-btn");
        if (btn) {
          btn.textContent = "✅ Copied";
          setTimeout(() => { btn.textContent = "📋 Copy"; }, 1200);
        }
      } catch (_) {}
    });
    qs("#ghp-to-prompt-btn")?.addEventListener("click", () => {
      const txt = currentPayload?.rawText || qs("#ghp-body")?.textContent || "";
      const promptEl = qs("#prompt");
      if (promptEl && txt) {
        promptEl.value = txt.slice(0, 6000);
        const cBtn = qs('.rail-btn[data-view="council"]');
        cBtn?.click();
        promptEl.focus();
        closePopup(true);
      }
    });
    qs("#ghp-doctor-btn")?.addEventListener("click", () => {
      const txt = currentPayload?.rawText || "";
      closePopup(true);
      window.openUnifiedTerminal?.("shell");
      window.runUnifiedTerminalCommand?.(`/doctor ${txt.slice(0, 140)}`);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !pop.classList.contains("hidden")) closePopup(true);
    });
    document.addEventListener("wheel", () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
    }, { passive: true });
    document.addEventListener("mousedown", (e) => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (!isPinned || pop.classList.contains("hidden")) return;
      if (!e.target.closest("#global-hover-popover") && e.target !== currentAnchor && !currentAnchor?.contains(e.target)) {
        closePopup(true);
      }
    });

    function extractHoverPayloadFromTarget(el) {
      if (!el) return null;

      // 1. Council answer card (#answers .card.ans) — ONLY trigger on compact title/header/snippet, NEVER the whole body!
      const ansCard = el.closest?.("#answers .card.ans");
      if (ansCard) {
        const viewMode = document.documentElement.getAttribute("data-app-view") || "tiles";
        if (viewMode === "lighthouse") {
          spotlightCardIntoLighthouse(ansCard);
          return null;
        }
        const headTrigger = el.closest?.(".answer-head, .answer-name, .card-compact-snippet, .card-pop-btn");
        if (!headTrigger || el.closest?.("button:not(.card-pop-btn)")) return null;
        const bodyEl = ansCard.querySelector(".body");
        const raw = bodyEl?._rawText || bodyEl?.textContent || "";
        if (!raw.trim() || raw.length < 30) return null;
        const title = ansCard.querySelector(".answer-name")?.textContent || "Model Output";
        const sub = ansCard.querySelector(".answer-sub")?.textContent || "";
        const meta = ansCard.querySelector(".card-meta-pill")?.textContent || "";
        return {
          anchor: headTrigger,
          icon: "🤖",
          title,
          subtitle: [sub, meta].filter(Boolean).join(" · "),
          rawText: raw,
          expand: false,
        };
      }

      // 2. Explicit [data-hover-detail] elements (Stream rows, Shell output blocks, Vault custom slots)
      const explicit = el.closest?.("[data-hover-detail]");
      if (explicit && !el.closest?.("button, input, select")) {
        return {
          anchor: explicit,
          icon: explicit.getAttribute("data-hover-icon") || "📄",
          title: explicit.getAttribute("data-hover-title") || "Output Details",
          subtitle: explicit.getAttribute("data-hover-sub") || "",
          rawText: explicit.getAttribute("data-hover-detail") || "",
          expand: false,
        };
      }

      return null;
    }

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest?.("#global-hover-popover") || isPinned) {
        cancelHide();
        return;
      }
      // Don't interfere with the existing Agent Lighthouse popover
      if (e.target.closest?.("[data-agent-lighthouse], #agent-lighthouse-popover")) return;

      // Cooldown prevents runaway popups immediately after user closes/dismisses one
      if (Date.now() < dismissCooldownUntil) return;

      if (suppressedAnchor) {
        if (suppressedAnchor.contains(e.target)) return;
        suppressedAnchor = null;
      }

      const payload = extractHoverPayloadFromTarget(e.target);
      if (!payload) {
        if (currentAnchor && !pop.classList.contains("hidden")) scheduleHide();
        return;
      }
      if (currentAnchor === payload.anchor && !pop.classList.contains("hidden")) {
        cancelHide();
        return;
      }
      if (showTimer) clearTimeout(showTimer);
      cancelHide();
      currentAnchor = payload.anchor;
      showTimer = setTimeout(() => {
        if (Date.now() < dismissCooldownUntil) return;
        showPopup(payload);
      }, 340);
    });

    window.AppHoverPreview = {
      show: (payload = {}) => {
        dismissCooldownUntil = 0;
        suppressedAnchor = null;
        showPopup(payload);
      },
      hide: () => closePopup(true),
    };
  }

  // Hover-grace bridge for topbar menus (fixes Hosts 4/4 flyout closing across vertical mouse gap)
  function initTopbarHoverFlyoutGrace() {
    qsa(".studio-topbar .hover-flyout-group").forEach((grp) => {
      if (grp._boundHoverGrace) return;
      grp._boundHoverGrace = true;
      let closeTimer = null;
      const open = () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        qsa(".studio-topbar .hover-flyout-group").forEach((other) => {
          if (other !== grp) other.classList.remove("is-hover-open");
        });
        grp.classList.add("is-hover-open");
      };
      const scheduleClose = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => grp.classList.remove("is-hover-open"), 220);
      };
      grp.addEventListener("mouseenter", open);
      grp.addEventListener("mouseleave", scheduleClose);
      grp.querySelector(".hover-flyout-menu")?.addEventListener("mouseenter", open);
    });
  }

  // Settings (#view-system) unified sub-tabs & /keys router
  function initSettingsSubTabs() {
    const activateTab = (tab = "keys") => {
      const clean = ["keys", "tools", "health"].includes(tab) ? tab : "keys";
      qsa("#settings-subtabs [data-settings-tab]").forEach((btn) => {
        const on = btn.dataset.settingsTab === clean;
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-selected", String(on));
      });
      qsa("#view-system .settings-tab-pane").forEach((pane) => {
        const on = pane.dataset.settingsPane === clean;
        pane.classList.toggle("on", on);
        pane.classList.toggle("hidden", !on);
      });
      if (clean === "keys") {
        window.refreshVaultHubView?.();
      }
    };

    qsa("#settings-subtabs [data-settings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.dataset.settingsTab));
    });

    window.openSettingsSection = function (tab = "keys") {
      const sysRail = qs('.rail-btn[data-view="system"]');
      if (sysRail) sysRail.click();
      activateTab(tab);
    };

    qsa("[data-open-settings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(() => activateTab(btn.getAttribute("data-open-settings-tab") || "keys"), 10);
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. UNIFIED KEYS, PLATFORM TOKENS & CUSTOM SLOTS VAULT (#view-vault-hub)
  // ══════════════════════════════════════════════════════════════════════════
  let _vaultOverviewCache = null;
  let _activeSlotFilter = "all";

  function syncVaultSlotFormFields() {
    const kind = qs("#vault-slot-kind")?.value || "api_key";
    const vis = {
      api_key: ["env_key", "value", "base_url", "default_model"],
      token: ["env_key", "value"],
      host: ["base_url", "value"],
      mcp: ["command", "args", "env_key"],
      tool: ["tool_type", "command", "base_url"],
    }[kind] || ["env_key", "value"];

    qsa("#vault-slot-builder [data-slot-field]").forEach((el) => {
      const f = el.getAttribute("data-slot-field");
      el.classList.toggle("hidden", !vis.includes(f));
    });
  }

  function renderVaultCustomSlots() {
    const wrap = qs("#vault-slots-list");
    if (!wrap) return;
    const slots = Array.isArray(_vaultOverviewCache?.custom_slots) ? _vaultOverviewCache.custom_slots : [];
    const filtered = _activeSlotFilter === "all" ? slots : slots.filter((s) => s.kind === _activeSlotFilter);

    if (!filtered.length) {
      wrap.innerHTML = `<div class="muted" style="padding:14px;text-align:center;border:1px dashed var(--border);border-radius:8px;grid-column:1 / -1">No custom slots in this filter yet. Add any OpenAI-compatible API provider, custom env token, GPU host URL, MCP server, or agent tool above.</div>`;
      return;
    }

    const kindBadge = {
      api_key: { icon: "🔑", label: "API Provider" },
      token: { icon: "🔐", label: "Env Token" },
      host: { icon: "🖥", label: "GPU Host" },
      mcp: { icon: "🔌", label: "MCP Server" },
      tool: { icon: "🧰", label: "Agent Tool" },
    };

    wrap.innerHTML = filtered
      .map((s) => {
        const meta = kindBadge[s.kind] || { icon: "🧩", label: s.kind };
        const summary = [
          s.env_key ? `ENV: ${s.env_key}` : "",
          s.base_url || "",
          s.default_model ? `Model: ${s.default_model}` : "",
          s.command ? `Cmd: ${s.command} ${(s.args || []).join(" ")}` : "",
        ]
          .filter(Boolean)
          .join(" · ");
        const fullDetail =
          `[${meta.label}] ${s.name}\n` +
          (s.env_key ? `Environment Variable: ${s.env_key}\n` : "") +
          (s.value_preview ? `Secret Preview: ${s.value_preview}\n` : "") +
          (s.base_url ? `Endpoint URL: ${s.base_url}\n` : "") +
          (s.default_model ? `Default Model: ${s.default_model}\n` : "") +
          (s.command ? `Command: ${s.command} ${(s.args || []).join(" ")}\n` : "") +
          (s.tool_type ? `Execution Type: ${s.tool_type}\n` : "") +
          (s.notes ? `Notes: ${s.notes}` : "");

        return `
          <div class="vault-slot-card" data-hover-icon="${meta.icon}" data-hover-title="${escHtml(s.name)}" data-hover-sub="${escHtml(meta.label)}" data-hover-detail="${escHtml(fullDetail)}">
            <div class="row" style="justify-content:space-between;gap:6px;align-items:center">
              <div class="row" style="gap:6px;min-width:0;flex:1">
                <span>${meta.icon}</span>
                <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(s.name)}</strong>
                <span class="right-badge">${escHtml(meta.label)}</span>
              </div>
              <div class="row" style="gap:4px">
                <button type="button" class="ghost xs" data-vslot-test="${escHtml(s.id)}" title="Test custom slot">⚡</button>
                <button type="button" class="ghost xs" data-vslot-del="${escHtml(s.id)}" style="color:var(--bad)" title="Delete custom slot">🗑</button>
              </div>
            </div>
            <div class="muted vault-slot-sub">${escHtml(summary || s.notes || "Configured")}</div>
          </div>`;
      })
      .join("");

    wrap.querySelectorAll("[data-vslot-test]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sid = btn.getAttribute("data-vslot-test");
        btn.textContent = "…";
        const r = await postJSON("/api/vault/test", { target: `slot:${sid}` });
        btn.textContent = r?.ok ? "✅" : "⚠️";
        btn.title = r?.detail || "";
        if (typeof status === "function") status(`Custom slot test: ${r?.detail || "done"}`);
        setTimeout(() => { btn.textContent = "⚡"; }, 2200);
      });
    });

    wrap.querySelectorAll("[data-vslot-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sid = btn.getAttribute("data-vslot-del");
        await fetch(`/api/vault/slots/${encodeURIComponent(sid)}`, { method: "DELETE" });
        await window.refreshVaultHubView();
        if (typeof reloadState === "function") reloadState().catch(() => {});
        if (typeof status === "function") status("Removed custom slot");
      });
    });
  }

  function renderVaultOverviewIntoUi(ov) {
    if (!ov || !ov.ok) return;
    _vaultOverviewCache = ov;

    // Runtime profile cards
    qsa("[data-runtime-profile]").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.runtimeProfile === (ov.runtime_profile || "auto"));
    });

    // Ready providers pills
    const readyStrip = qs("#vault-ready-modes-strip");
    if (readyStrip) {
      const modes = Array.isArray(ov.ready_modes) ? ov.ready_modes : [];
      readyStrip.innerHTML = modes.length
        ? modes.map((m) => `<span class="right-badge orca">● ${escHtml(m)}</span>`).join("")
        : `<span class="right-badge gated">No external/local provider detected yet — enter any 1 key OR start Ollama/LM Studio</span>`;
    }

    // Update Command Deck header context pill
    const ctxPill = qs("#gft-context-pill");
    if (ctxPill) {
      const readyCount = (ov.ready_modes || []).length;
      const profLbl = String(ov.runtime_profile || "auto").replace("_", " ").toUpperCase();
      ctxPill.textContent = `${profLbl} · ${readyCount} Provider${readyCount === 1 ? "" : "s"} Ready`;
    }

    // Standard keys status dots & placeholders
    qsa(".vault-key-row[data-vkey]").forEach((row) => {
      const keyName = row.getAttribute("data-vkey");
      const info = ov.keys?.[keyName];
      const dot = row.querySelector(".vault-dot");
      const inp = row.querySelector(".vault-key-input");
      if (dot) dot.classList.toggle("is-on", Boolean(info?.configured));
      if (inp && info?.configured && !inp.value.trim()) {
        inp.placeholder = info.preview ? `Saved (${info.preview})` : "Saved";
      }
    });

    // Local engines status
    if (ov.local_urls) {
      if (qs("#vault-local-ollama")) qs("#vault-local-ollama").value = ov.local_urls.ollama || "http://127.0.0.1:11434/v1";
      if (qs("#vault-local-lmstudio")) qs("#vault-local-lmstudio").value = ov.local_urls.lmstudio || "http://127.0.0.1:1234/v1";
      if (qs("#vault-local-llamacpp")) qs("#vault-local-llamacpp").value = ov.local_urls.llamacpp || "http://127.0.0.1:8080/v1";
    }
    const localMap = {
      ollama: { dot: "#vault-dot-ollama", lbl: "#vault-stat-ollama" },
      lmstudio: { dot: "#vault-dot-lmstudio", lbl: "#vault-stat-lmstudio" },
      llamacpp: { dot: "#vault-dot-llamacpp", lbl: "#vault-stat-llamacpp" },
    };
    for (const [k, sels] of Object.entries(localMap)) {
      const st = ov.local_status?.[k];
      const dot = qs(sels.dot);
      const lbl = qs(sels.lbl);
      if (dot) dot.classList.toggle("is-on", Boolean(st?.online));
      if (lbl) {
        lbl.textContent = st?.online
          ? `Online · ${(st.models || []).slice(0, 2).join(", ") || "ready"}`
          : "Standby (not running)";
      }
    }

    renderVaultCustomSlots();
  }

  window.refreshVaultHubView = async function () {
    try {
      const ov = await fetch("/api/vault/overview", { cache: "no-store" }).then((r) => r.json());
      renderVaultOverviewIntoUi(ov);
    } catch (e) {
      console.warn("Vault Hub load error:", e);
    }
  };

  function initVaultHubInteractions() {
    syncVaultSlotFormFields();
    qs("#vault-slot-kind")?.addEventListener("change", syncVaultSlotFormFields);

    qsa("#vault-slot-filter-seg [data-slot-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        _activeSlotFilter = btn.getAttribute("data-slot-filter") || "all";
        qsa("#vault-slot-filter-seg [data-slot-filter]").forEach((b) =>
          b.classList.toggle("on", b.getAttribute("data-slot-filter") === _activeSlotFilter)
        );
        renderVaultCustomSlots();
      });
    });

    qsa("[data-runtime-profile]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const profile = btn.dataset.runtimeProfile || "auto";
        const ov = await postJSON("/api/vault/keys", { runtime_profile: profile });
        renderVaultOverviewIntoUi(ov);
        if (typeof status === "function") status(`✅ Switched Runtime Profile to ${profile.toUpperCase()}`);
      });
    });

    qs("#vault-refresh-btn")?.addEventListener("click", () => window.refreshVaultHubView());

    qs("#vault-save-all-btn")?.addEventListener("click", async () => {
      const btn = qs("#vault-save-all-btn");
      const fb = qs("#vault-save-feedback");
      if (btn) btn.disabled = true;
      try {
        const keysPayload = {};
        qsa(".vault-key-row[data-vkey]").forEach((row) => {
          const k = row.getAttribute("data-vkey");
          const val = (row.querySelector(".vault-key-input")?.value || "").trim();
          if (k && val) keysPayload[k] = val;
        });
        const activeProf = qs("[data-runtime-profile].on")?.dataset.runtimeProfile || "auto";
        const ov = await postJSON("/api/vault/keys", {
          keys: keysPayload,
          runtime_profile: activeProf,
          local_urls: {
            ollama: qs("#vault-local-ollama")?.value || "",
            lmstudio: qs("#vault-local-lmstudio")?.value || "",
            llamacpp: qs("#vault-local-llamacpp")?.value || "",
          },
        });
        qsa(".vault-key-row[data-vkey] .vault-key-input").forEach((inp) => {
          inp.value = "";
        });
        renderVaultOverviewIntoUi(ov);
        if (typeof reloadState === "function") reloadState().catch(() => {});
        if (fb) fb.innerHTML = `<span style="color:var(--ok)">✅ Saved & synced into active runtime!</span>`;
        if (typeof status === "function") status("✅ Saved API keys & runtime profile to Vault");
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // Eye toggle, per-key live test, and clear button
    qs("#view-vault-hub")?.addEventListener("click", async (e) => {
      const eye = e.target.closest(".vault-eye-btn");
      if (eye) {
        const inp = eye.closest(".vault-key-row")?.querySelector(".vault-key-input");
        if (inp) inp.type = inp.type === "password" ? "text" : "password";
        return;
      }
      const clr = e.target.closest(".vault-clear-btn");
      if (clr) {
        const row = clr.closest(".vault-key-row");
        const k = row?.getAttribute("data-vkey");
        if (!k) return;
        const inp = row.querySelector(".vault-key-input");
        if (inp) {
          inp.value = "";
          inp.placeholder = "Cleared";
        }
        const ov = await postJSON("/api/vault/keys", { keys: { [k]: "__CLEAR__" } });
        renderVaultOverviewIntoUi(ov);
        if (typeof status === "function") status(`Cleared ${k}`);
        return;
      }
      const tst = e.target.closest(".vault-test-btn");
      if (tst) {
        const row = tst.closest(".vault-key-row");
        const target = row?.getAttribute("data-vtest");
        const rawVal = (row?.querySelector(".vault-key-input")?.value || "").trim();
        tst.textContent = "…";
        const r = await postJSON("/api/vault/test", { target, key: rawVal || undefined });
        tst.textContent = r?.ok ? "✅ OK" : "⚠️ Fail";
        tst.title = r?.detail || "";
        if (typeof status === "function") status(`${target?.toUpperCase()}: ${r?.detail || ""}`);
        setTimeout(() => { tst.textContent = "⚡ Test"; }, 2600);
        return;
      }
      const ltst = e.target.closest(".vault-test-local-btn");
      if (ltst) {
        const target = ltst.getAttribute("data-ltest");
        const urlInp = ltst.closest(".vault-key-controls")?.querySelector("input");
        ltst.textContent = "…";
        const r = await postJSON("/api/vault/test", { target, url: urlInp?.value || "" });
        ltst.textContent = r?.ok ? "✅ Live" : "Offline";
        ltst.title = r?.detail || "";
        if (typeof status === "function") status(`Local engine: ${r?.detail || ""}`);
        setTimeout(() => { ltst.textContent = "⚡ Probe"; }, 2600);
      }
    });

    qs("#vault-slot-add-btn")?.addEventListener("click", async () => {
      const name = (qs("#vault-slot-name")?.value || "").trim();
      if (!name) {
        if (typeof status === "function") status("Please enter a Custom Slot name");
        qs("#vault-slot-name")?.focus();
        return;
      }
      const res = await postJSON("/api/vault/slots", {
        kind: qs("#vault-slot-kind")?.value || "api_key",
        name,
        env_key: (qs("#vault-slot-env-key")?.value || "").trim(),
        value: (qs("#vault-slot-value")?.value || "").trim(),
        base_url: (qs("#vault-slot-base-url")?.value || "").trim(),
        default_model: (qs("#vault-slot-model")?.value || "").trim(),
        command: (qs("#vault-slot-command")?.value || "").trim(),
        args: (qs("#vault-slot-args")?.value || "").trim(),
        tool_type: qs("#vault-slot-tool-type")?.value || "shell_cmd",
        notes: (qs("#vault-slot-notes")?.value || "").trim(),
      });
      if (res?.ok) {
        ["#vault-slot-name", "#vault-slot-env-key", "#vault-slot-value", "#vault-slot-base-url", "#vault-slot-model", "#vault-slot-command", "#vault-slot-args", "#vault-slot-notes"].forEach((s) => {
          if (qs(s)) qs(s).value = "";
        });
        await window.refreshVaultHubView();
        if (typeof reloadState === "function") reloadState().catch(() => {});
        if (typeof status === "function") status(`✅ Added Custom Slot "${res.slot.name}"`);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. SPLIT 50/50 LIVE TERMINAL & STREAM FOOTER (Split Live + Shell + Stream + Copilot)
  // ══════════════════════════════════════════════════════════════════════════
  const SLASH_COMMANDS = [
    { cmd: "/ask ", desc: "Send prompt directly to active Council models" },
    { cmd: "/build ", desc: "Switch to Build mode & execute multi-file prompt" },
    { cmd: "/plan ", desc: "Generate step-by-step architecture plan in Workspace" },
    { cmd: "/keys", desc: "Open Keys, Platform Tokens & Custom Slots (Settings)" },
    { cmd: "/theme ", desc: "Switch app theme (obsidian, midnight, cyberpunk, emerald, amber, daylight, frost)" },
    { cmd: "/view ", desc: "Switch whole-app view mode (list, tiles, dropdowns, lighthouse, compact)" },
    { cmd: "/doctor", desc: "Run compact interactive /doctor diagnostics" },
    { cmd: "/doctor --run-script", desc: "Generate & execute PowerShell auto-repair script" },
    { cmd: "/hosts", desc: "Open Host Configurator (Hosts & Saved Board)" },
    { cmd: "/models", desc: "Open Host Configurator (Models & VRAM Tab)" },
    { cmd: "/explorer", desc: "Open Suomynona Explorer" },
    { cmd: "/agents", desc: "Open Specialist Agents & Tools configurator" },
    { cmd: "/system", desc: "Open Settings, Tools, MCP & Diagnostics" },
    { cmd: "/status", desc: "Show ready AI providers, hosts & hardware ID" },
    { cmd: "/update", desc: "Check Git repository updates" },
    { cmd: "/clear", desc: "Clear terminal output" },
    { cmd: "/help", desc: "List available terminal & app commands" },
  ];

  let _deckInitialized = false;
  let _deckTab = "split";
  let _deckExecMode = "real";
  let _lastTerminalError = "";
  let _slashActiveIdx = 0;
  let _shellHistory = [];
  let _shellHistCursor = 0;

  try {
    _shellHistory = JSON.parse(localStorage.getItem("suomynona-deck-history") || "[]");
    if (!Array.isArray(_shellHistory)) _shellHistory = [];
    _shellHistCursor = _shellHistory.length;
  } catch (_) {}

  function linkifyPathsHtml(text) {
    const escaped = escHtml(text);
    // Linkify relative paths like server/licensing.ts or public/styles.css for 1-click Explorer inspection
    return escaped.replace(
      /\b((?:server|public|src|scripts|council_outputs|docs)\/[A-Za-z0-9._\-\/]+\.[A-Za-z0-9]{1,8})\b/g,
      `<button type="button" class="gft-path-link" data-open-relpath="$1" title="Click to inspect in File Explorer">$1</button>`
    );
  }

  window.appendUnifiedTerminalEntry = function ({
    title = "",
    command = "",
    output = "",
    ok = true,
    cwd = "",
  } = {}) {
    const out = qs("#gft-term-out");
    if (!out) return;
    if (!ok && output) _lastTerminalError = output;
    if (cwd && qs("#gft-cli-ps1")) {
      const tail = cwd.split(/[\\/]/).filter(Boolean).pop() || ".";
      qs("#gft-cli-ps1").textContent = `${tail}❯`;
    }

    const fullText = String(output || "").trim();
    const lines = fullText.split(/\r?\n/);
    const isLong = lines.length > 10 || fullText.length > 680;
    const previewText = isLong ? lines.slice(0, 7).join("\n") + `\n… (${lines.length} lines — hover to inspect full output)` : fullText;

    const card = document.createElement("div");
    card.className = `gft-block ${ok ? "is-ok" : "is-err"}`;
    card.setAttribute("data-hover-icon", ok ? "❯_" : "⚠️");
    card.setAttribute("data-hover-title", command || title || "Terminal Output");
    card.setAttribute("data-hover-sub", cwd ? `CWD: ${cwd}` : ok ? "Exit 0" : "Command Failed");
    card.setAttribute("data-hover-detail", fullText || "(No output)");

    card.innerHTML = `
      <div class="gft-block-head">
        <span class="gft-block-cmd">${command ? `❯ ${escHtml(command)}` : escHtml(title || "Output")}</span>
        <div class="row" style="gap:4px">
          <span class="gft-block-badge ${ok ? "ok" : "err"}">${ok ? "OK" : "ERR"}</span>
          <button type="button" class="ghost xs gft-blk-copy" title="Copy full output">📋</button>
          <button type="button" class="ghost xs gft-blk-toprompt" title="Send output to Workspace Prompt">↗</button>
          ${!ok ? `<button type="button" class="ghost xs gft-blk-fix" title="Ask Copilot to fix this error">🩹 Fix</button>` : ""}
        </div>
      </div>
      <div class="gft-block-body">${linkifyPathsHtml(previewText || "(Done)")}</div>
    `;

    card.querySelector(".gft-blk-copy")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(fullText);
        e.currentTarget.textContent = "✅";
        setTimeout(() => { e.currentTarget.textContent = "📋"; }, 1000);
      } catch (_) {}
    });
    card.querySelector(".gft-blk-toprompt")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const promptEl = qs("#prompt");
      if (promptEl) {
        promptEl.value = `Analyze this terminal output:\n\n\`\`\`\n${fullText.slice(0, 4000)}\n\`\`\``;
        qs('.rail-btn[data-view="council"]')?.click();
        promptEl.focus();
      }
    });
    card.querySelector(".gft-blk-fix")?.addEventListener("click", (e) => {
      e.stopPropagation();
      window.openUnifiedTerminal("copilot", `Fix this error from "${command}":\n${fullText.slice(0, 1200)}`);
    });

    out.appendChild(card);
    while (out.children.length > 80) out.removeChild(out.firstChild);
    out.scrollTop = out.scrollHeight;
  };

  window.openUnifiedTerminal = function (tab = "split", prefill = "") {
    const footer = qs("#global-footer-terminal");
    const restorePill = qs("#gft-restore-pill");
    if (!footer) return;
    footer.classList.remove("hidden", "gft-minimized");
    footer.classList.add("gft-expanded");
    restorePill?.classList.add("hidden");
    const minExpBtn = qs("#gft-min-exp-btn");
    if (minExpBtn) minExpBtn.textContent = "▼ Collapse";
    try { localStorage.setItem("suomynona-live-footer-v2-state", "expanded"); } catch (_) {}

    _deckTab = ["split", "shell", "stream", "copilot"].includes(tab) ? tab : "split";
    footer.classList.toggle("gft-split-mode", _deckTab === "split");

    qsa("[data-gft-tab]").forEach((t) => {
      const on = t.dataset.gftTab === _deckTab;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", String(on));
    });
    qsa("[data-gft-pane]").forEach((p) => {
      const paneName = p.dataset.gftPane;
      const visible = _deckTab === "split"
        ? (paneName === "shell" || paneName === "stream")
        : paneName === _deckTab;
      p.classList.toggle("hidden", !visible);
    });

    if (_deckTab === "shell" || (_deckTab === "split" && prefill)) {
      const inp = qs("#gft-cli-input");
      if (inp) {
        if (prefill) inp.value = prefill;
        if (prefill || _deckTab === "shell") setTimeout(() => inp.focus(), 40);
      }
    } else if (_deckTab === "copilot") {
      const inp = qs("#gft-copilot-input");
      if (inp) {
        if (prefill) inp.value = prefill;
        setTimeout(() => inp.focus(), 40);
      }
    }
  };

  window.runUnifiedTerminalCommand = async function (overrideCmd = null) {
    const inp = qs("#gft-cli-input");
    const raw = String(overrideCmd !== null ? overrideCmd : inp?.value || "").trim();
    if (!raw) return;
    if (overrideCmd === null && inp) inp.value = "";
    qs("#gft-slash-menu")?.classList.add("hidden");

    if (_shellHistory[_shellHistory.length - 1] !== raw) {
      _shellHistory.push(raw);
      if (_shellHistory.length > 80) _shellHistory.shift();
      try { localStorage.setItem("suomynona-deck-history", JSON.stringify(_shellHistory)); } catch (_) {}
    }
    _shellHistCursor = _shellHistory.length;
    window.openUnifiedTerminal(_deckTab === "split" ? "split" : "shell");

    const lower = raw.toLowerCase();

    // 1. Direct App Navigation & Control Bridge Commands
    if (lower === "/clear" || lower === "clear" || lower === "cls") {
      qs("#gft-term-out").innerHTML = "";
      return;
    }
    if (lower === "/help" || lower === "/commands" || lower === "/cmd") {
      const helpTxt = SLASH_COMMANDS.map((c) => `${c.cmd.padEnd(22)} — ${c.desc}`).join("\n");
      window.appendUnifiedTerminalEntry({ command: raw, output: helpTxt, ok: true });
      return;
    }
    if (lower === "/keys" || lower === "/vault" || lower === "/api") {
      window.openSettingsSection?.("keys");
      window.appendUnifiedTerminalEntry({ command: raw, output: "Opened 🔑 Keys & Custom Slots inside Settings.", ok: true });
      return;
    }
    if (lower === "/explorer") {
      qs('.rail-btn[data-view="file-explorer"]')?.click();
      window.appendUnifiedTerminalEntry({ command: raw, output: "Switched to Suomynona Explorer.", ok: true });
      return;
    }
    if (lower === "/hosts" || lower === "/host") {
      if (typeof openSlashConfigPopupWindow === "function") openSlashConfigPopupWindow("host");
      window.appendUnifiedTerminalEntry({ command: raw, output: "Opened Host Configurator.", ok: true });
      return;
    }
    if (lower === "/models" || lower === "/lineup") {
      if (typeof openSlashConfigPopupWindow === "function") openSlashConfigPopupWindow("models");
      window.appendUnifiedTerminalEntry({ command: raw, output: "Opened Host Configurator (Models & VRAM Tab).", ok: true });
      return;
    }
    if (lower === "/agents") {
      if (typeof openSlashConfigPopupWindow === "function") openSlashConfigPopupWindow("agents");
      window.appendUnifiedTerminalEntry({ command: raw, output: "Opened Specialist Agents Configurator.", ok: true });
      return;
    }
    if (lower === "/system") {
      qs('.rail-btn[data-view="system"]')?.click();
      window.appendUnifiedTerminalEntry({ command: raw, output: "Switched to System & Diagnostics.", ok: true });
      return;
    }
    if (lower === "/theme" || lower.startsWith("/theme ")) {
      const arg = raw.slice(6).trim().toLowerCase();
      if (!arg) {
        window.appendUnifiedTerminalEntry({ command: raw, output: `Available themes: ${Object.keys(APP_THEMES).join(", ")}`, ok: true });
      } else {
        const applied = window.setAppTheme(arg);
        window.appendUnifiedTerminalEntry({ command: raw, output: `🎨 Theme set to "${APP_THEMES[applied].fullName}"`, ok: true });
      }
      return;
    }
    if (lower === "/view" || lower.startsWith("/view ")) {
      const arg = raw.slice(5).trim().toLowerCase();
      if (!arg) {
        window.appendUnifiedTerminalEntry({ command: raw, output: `Available global views: ${Object.keys(APP_VIEW_MODES).join(", ")}`, ok: true });
      } else {
        const applied = window.setAppViewMode(arg);
        window.appendUnifiedTerminalEntry({ command: raw, output: `🪟 App View Mode set to "${APP_VIEW_MODES[applied].label}"`, ok: true });
      }
      return;
    }
    if (lower.startsWith("/ask ") || lower.startsWith("/build ") || lower.startsWith("/plan ")) {
      const sp = raw.indexOf(" ");
      const mode = lower.slice(1, sp);
      const task = raw.slice(sp + 1).trim();
      qs('.rail-btn[data-view="council"]')?.click();
      if (typeof setCouncilExecutionMode === "function") setCouncilExecutionMode(mode, false);
      const promptEl = qs("#prompt");
      if (promptEl && task) promptEl.value = task;
      qs("#ask-btn")?.click();
      window.appendUnifiedTerminalEntry({ command: raw, output: `🚀 Dispatched Workspace [${mode.toUpperCase()}]: "${task}"`, ok: true });
      return;
    }
    if (lower.startsWith("@brain ") || lower.startsWith("/brain ")) {
      const q = raw.replace(/^(@brain|\/brain)\s+/i, "").trim();
      window.openUnifiedTerminal("copilot");
      await askDeckCopilot(q);
      return;
    }
    if (lower === "/status") {
      const [ov, lic] = await Promise.all([
        fetch("/api/vault/overview").then((r) => r.json()).catch(() => ({})),
        fetch("/api/license/status").then((r) => r.json()).catch(() => ({})),
      ]);
      const lines = [
        `Edition       : ${String(lic.edition || "master").toUpperCase()} (HWID: ${lic.machine_hwid || "n/a"})`,
        `Runtime Mode  : ${String(ov.runtime_profile || "auto").toUpperCase()}`,
        `Ready Engines : ${(ov.ready_modes || []).join(", ") || "None configured (open 🔑 Keys & Vault)"}`,
        `Custom Slots  : ${(ov.custom_slots || []).length}`,
      ];
      window.appendUnifiedTerminalEntry({ command: raw, output: lines.join("\n"), ok: true });
      return;
    }
    if (lower === "/doctor" || lower.startsWith("/doctor ")) {
      const runScript = /--run-script|--script/i.test(raw);
      const r = await postJSON(runScript ? "/api/doctor/repair-script" : "/api/doctor", {
        auto_fix: true,
        execute: runScript,
        traceback: raw.replace(/^\/doctor\s*/i, ""),
      });
      const checks = Array.isArray(r?.report?.checks) ? r.report.checks : [];
      const compactSummary = checks.length
        ? `${r.report.repair_summary}\n\n` +
          checks.map((c) => `${c.status === "ok" ? "✅" : c.status === "repaired" ? "🛠️" : c.status === "warn" ? "⚠️" : "❌"} [${c.domain}] ${c.title}: ${c.summary}`).join("\n")
        : r?.output || "Doctor completed.";
      window.appendUnifiedTerminalEntry({
        command: raw,
        output: compactSummary,
        ok: r?.report?.healthy !== false,
      });
      return;
    }
    if (lower === "/update" || lower.startsWith("/update ")) {
      const pull = /pull|apply/i.test(raw);
      const r = await postJSON(pull ? "/api/updater/pull" : "/api/updater/check", { auto_apply: pull });
      window.appendUnifiedTerminalEntry({
        command: raw,
        output: r?.output || r?.summary || JSON.stringify(r, null, 2),
        ok: r?.ok !== false,
      });
      return;
    }

    // 2. Real OS Shell / Python / Node Execution
    const selEngine = qs("#gft-cli-shell-select")?.value || "auto";
    const shell = selEngine === "auto" ? (navigator.platform?.toLowerCase().includes("win") ? "pwsh" : "bash") : selEngine;
    const runBtn = qs("#gft-cli-run-btn");
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = "…";
    }
    try {
      const res = await postJSON("/api/cli/shell-exec", {
        command: raw,
        shell,
        exec_mode: _deckExecMode,
      });
      window.appendUnifiedTerminalEntry({
        command: raw,
        output: res?.output || res?.error || "(Exit 0)",
        ok: res?.ok !== false,
        cwd: res?.cwd || "",
      });
    } catch (err) {
      window.appendUnifiedTerminalEntry({
        command: raw,
        output: `Terminal execution error: ${err?.message || err}`,
        ok: false,
      });
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "Run ↵";
      }
      qs("#gft-cli-input")?.focus();
    }
  };

  async function askDeckCopilot(questionText) {
    const q = String(questionText || "").trim();
    if (!q) return;
    const out = qs("#gft-copilot-out");
    if (!out) return;

    const userCard = document.createElement("div");
    userCard.className = "gft-block is-ok";
    userCard.innerHTML = `<div class="gft-block-cmd">🧑 ${escHtml(q)}</div>`;
    out.appendChild(userCard);

    const thinkCard = document.createElement("div");
    thinkCard.className = "gft-block";
    thinkCard.innerHTML = `<div class="gft-block-body muted">🧠 Thinking…</div>`;
    out.appendChild(thinkCard);
    out.scrollTop = out.scrollHeight;

    try {
      const res = await postJSON("/api/brain/chat", { message: q });
      const reply = res?.reply || res?.output || res?.error || "No response from Brain Copilot.";
      const lines = String(reply).split(/\r?\n/);
      const isLong = lines.length > 9 || reply.length > 620;
      const preview = isLong ? lines.slice(0, 6).join("\n") + `\n… (hover to read all ${lines.length} lines)` : reply;
      thinkCard.setAttribute("data-hover-icon", "🧠");
      thinkCard.setAttribute("data-hover-title", "Copilot Reply");
      thinkCard.setAttribute("data-hover-detail", reply);
      thinkCard.innerHTML = `
        <div class="gft-block-head">
          <span class="gft-block-cmd">🧠 Copilot</span>
          <div class="row" style="gap:4px">
            <button type="button" class="ghost xs gft-cp-run" title="Run first code/command line in Shell">▶ Run</button>
            <button type="button" class="ghost xs gft-cp-prompt" title="Copy to Workspace Prompt">↗ Prompt</button>
          </div>
        </div>
        <div class="gft-block-body">${linkifyPathsHtml(preview)}</div>
      `;
      thinkCard.querySelector(".gft-cp-run")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const m = reply.match(/```(?:bash|sh|powershell|pwsh|cmd)?\n([\s\S]*?)```/i);
        const cmdLine = (m?.[1] || reply).split(/\r?\n/).find((l) => l.trim() && !l.trim().startsWith("#")) || "";
        if (cmdLine.trim()) window.runUnifiedTerminalCommand(cmdLine.trim());
      });
      thinkCard.querySelector(".gft-cp-prompt")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const p = qs("#prompt");
        if (p) {
          p.value = reply.slice(0, 5000);
          qs('.rail-btn[data-view="council"]')?.click();
          p.focus();
        }
      });
      out.scrollTop = out.scrollHeight;
    } catch (err) {
      thinkCard.classList.add("is-err");
      thinkCard.innerHTML = `<div class="gft-block-body">❌ ${escHtml(err?.message || err)}</div>`;
    }
  }

  function renderCompactStreamRow(container, ev) {
    if (!container) return;
    const filter = qs("#gft-filter-bar .gft-filter-btn.on")?.dataset.gftFilter || "ALL";
    const cat = String(ev.category || "SYS").toUpperCase();
    const lvl = String(ev.level || "info").toLowerCase();
    const isErr = lvl === "error" || /ERR|FAIL|CRASH/i.test(cat);
    const bucket = isErr
      ? "ERROR"
      : /INF|MODEL|COUNCIL|SWARM|JUDGE|AGENT/i.test(cat)
      ? "INFERENCE"
      : /COMPIL|BUILD|EXE|FORGE|SHELL|PY|GO/i.test(cat)
      ? "COMPILER"
      : /INPUT|PROMPT|HTTP|API/i.test(cat)
      ? "INPUT"
      : "SYS";
    if (filter !== "ALL" && bucket !== filter) return;

    const fullMsg = String(ev.message || "");
    const oneLine = fullMsg.replace(/\s+/g, " ").trim();
    const ts = ev.ts ? String(ev.ts).slice(-12) : new Date().toISOString().slice(11, 23);

    const row = document.createElement("div");
    row.className = `gft-stream-row ${isErr ? "is-err" : ""}`;
    row.setAttribute("data-hover-icon", isErr ? "⚠️" : "📡");
    row.setAttribute("data-hover-title", `[${ev.category || bucket}] ${ts}`);
    row.setAttribute("data-hover-sub", isErr ? "Error / Alert" : "Backend Event");
    row.setAttribute("data-hover-detail", fullMsg);
    row.innerHTML = `<span class="gft-st-ts">${escHtml(ts)}</span><span class="gft-st-cat">[${escHtml(ev.category || bucket)}]</span><span class="gft-st-msg">${escHtml(oneLine.slice(0, 145))}${oneLine.length > 145 ? "…" : ""}</span>`;
    container.appendChild(row);
    while (container.children.length > 220) container.removeChild(container.firstChild);
    container.scrollTop = container.scrollHeight;
  }

  window.initUnifiedCommandDeck = function () {
    if (_deckInitialized) return;
    const footer = qs("#global-footer-terminal");
    if (!footer) return;
    _deckInitialized = true;

    const setStateMode = (mode) => {
      footer.classList.remove("hidden", "gft-minimized", "gft-expanded", "gft-fullscreen");
      qs("#gft-restore-pill")?.classList.add("hidden");
      if (mode === "hidden") {
        footer.classList.add("hidden");
        footer.classList.remove("gft-split-mode");
        qs("#gft-restore-pill")?.classList.remove("hidden");
      } else if (mode === "fullscreen") {
        footer.classList.add("gft-expanded", "gft-fullscreen");
        footer.classList.toggle("gft-split-mode", _deckTab === "split");
        if (qs("#gft-min-exp-btn")) qs("#gft-min-exp-btn").textContent = "▼ Collapse";
      } else if (mode === "expanded") {
        footer.classList.add("gft-expanded");
        footer.classList.toggle("gft-split-mode", _deckTab === "split");
        if (qs("#gft-min-exp-btn")) qs("#gft-min-exp-btn").textContent = "▼ Collapse";
      } else {
        footer.classList.add("gft-minimized");
        footer.classList.remove("gft-split-mode");
        if (qs("#gft-min-exp-btn")) qs("#gft-min-exp-btn").textContent = "▲ Expand";
      }
      try { localStorage.setItem("suomynona-live-footer-v2-state", mode); } catch (_) {}
    };

    try {
      const saved = localStorage.getItem("suomynona-live-footer-v2-state");
      if (saved === "hidden" || saved === "minimized") {
        setStateMode(saved);
      } else {
        setStateMode("expanded");
        window.openUnifiedTerminal(_deckTab);
      }
    } catch (_) {
      setStateMode("expanded");
      window.openUnifiedTerminal(_deckTab);
    }

    // Topbar / Left-rail toggles
    qsa("[data-gft-tab]").forEach((btn) => {
      btn.addEventListener("click", () => window.openUnifiedTerminal(btn.dataset.gftTab));
    });
    qs("#gft-toggle-title")?.addEventListener("click", () => {
      setStateMode(footer.classList.contains("gft-expanded") ? "minimized" : "expanded");
    });
    qs("#gft-min-exp-btn")?.addEventListener("click", () => {
      setStateMode(footer.classList.contains("gft-expanded") ? "minimized" : "expanded");
    });
    qs("#gft-full-btn")?.addEventListener("click", () => {
      setStateMode(footer.classList.contains("gft-fullscreen") ? "expanded" : "fullscreen");
    });
    qs("#gft-hide-btn")?.addEventListener("click", () => setStateMode("hidden"));
    qs("#gft-restore-pill")?.addEventListener("click", () => window.openUnifiedTerminal(_deckTab));
    qs("#gft-context-pill")?.addEventListener("click", () => window.openSettingsSection?.("keys"));
    qs("#gft-cli-doctor-btn")?.addEventListener("click", () => window.runUnifiedTerminalCommand("/doctor --run-script"));

    qs("#gft-exec-mode-btn")?.addEventListener("click", (e) => {
      _deckExecMode = _deckExecMode === "real" ? "sandboxed" : "real";
      e.currentTarget.textContent = _deckExecMode === "real" ? "⚡ Live" : "🔒 Sandbox";
      if (typeof setExecMode === "function") setExecMode(_deckExecMode);
    });

    qs("#gft-clear-btn")?.addEventListener("click", () => {
      if (_deckTab === "shell" || _deckTab === "split") {
        if (qs("#gft-term-out")) qs("#gft-term-out").innerHTML = "";
      }
      if (_deckTab === "copilot" && qs("#gft-copilot-out")) {
        qs("#gft-copilot-out").innerHTML = "";
      }
      if (_deckTab === "stream" || _deckTab === "split") {
        if (qs("#gft-stream-out")) qs("#gft-stream-out").innerHTML = "";
        if (qs("#gft-err-count")) qs("#gft-err-count").textContent = "0";
      }
    });

    // Clickable file paths inside Terminal & Copilot outputs -> open directly in Explorer IDE
    footer.addEventListener("click", (e) => {
      const pathBtn = e.target.closest("[data-open-relpath]");
      if (!pathBtn) return;
      const relPath = pathBtn.getAttribute("data-open-relpath");
      qs('.rail-btn[data-view="file-explorer"]')?.click();
      setTimeout(() => {
        if (typeof openDiskFileInExplorer === "function") openDiskFileInExplorer(relPath);
      }, 120);
    });

    // Floating slash autocomplete menu inside Shell tab
    const inp = qs("#gft-cli-input");
    const slashMenu = qs("#gft-slash-menu");
    const updateSlashMenu = () => {
      if (!inp || !slashMenu) return;
      const val = inp.value;
      if (!val.startsWith("/")) {
        slashMenu.classList.add("hidden");
        return;
      }
      const q = val.toLowerCase();
      const matches = SLASH_COMMANDS.filter((c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)).slice(0, 7);
      if (!matches.length) {
        slashMenu.classList.add("hidden");
        return;
      }
      _slashActiveIdx = Math.min(_slashActiveIdx, matches.length - 1);
      slashMenu.innerHTML = matches
        .map(
          (m, idx) =>
            `<button type="button" class="gft-slash-item ${idx === _slashActiveIdx ? "is-active" : ""}" data-scmd="${escHtml(m.cmd)}"><code>${escHtml(m.cmd)}</code><span class="muted">${escHtml(m.desc)}</span></button>`
        )
        .join("");
      slashMenu.classList.remove("hidden");
      slashMenu.querySelectorAll("[data-scmd]").forEach((btn) => {
        btn.addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          const chosen = btn.getAttribute("data-scmd") || "";
          inp.value = chosen;
          slashMenu.classList.add("hidden");
          if (!chosen.endsWith(" ")) window.runUnifiedTerminalCommand(chosen);
          else inp.focus();
        });
      });
    };

    inp?.addEventListener("input", () => {
      _slashActiveIdx = 0;
      updateSlashMenu();
    });
    inp?.addEventListener("keydown", (e) => {
      const menuOpen = slashMenu && !slashMenu.classList.contains("hidden");
      if (e.key === "Enter") {
        e.preventDefault();
        if (menuOpen) {
          const picked = slashMenu.querySelectorAll("[data-scmd]")[_slashActiveIdx]?.getAttribute("data-scmd");
          if (picked && inp.value.trim() !== picked.trim()) {
            inp.value = picked;
            slashMenu.classList.add("hidden");
            if (!picked.endsWith(" ")) window.runUnifiedTerminalCommand(picked);
            return;
          }
        }
        window.runUnifiedTerminalCommand();
      } else if (e.key === "Tab" && menuOpen) {
        e.preventDefault();
        const picked = slashMenu.querySelectorAll("[data-scmd]")[_slashActiveIdx]?.getAttribute("data-scmd");
        if (picked) {
          inp.value = picked;
          if (!picked.endsWith(" ")) slashMenu.classList.add("hidden");
        }
      } else if (e.key === "Escape") {
        slashMenu?.classList.add("hidden");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (menuOpen) {
          const items = slashMenu.querySelectorAll("[data-scmd]");
          _slashActiveIdx = (_slashActiveIdx - 1 + items.length) % Math.max(1, items.length);
          updateSlashMenu();
        } else if (_shellHistCursor > 0) {
          _shellHistCursor -= 1;
          inp.value = _shellHistory[_shellHistCursor] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (menuOpen) {
          const items = slashMenu.querySelectorAll("[data-scmd]");
          _slashActiveIdx = (_slashActiveIdx + 1) % Math.max(1, items.length);
          updateSlashMenu();
        } else if (_shellHistCursor < _shellHistory.length - 1) {
          _shellHistCursor += 1;
          inp.value = _shellHistory[_shellHistCursor] || "";
        } else {
          _shellHistCursor = _shellHistory.length;
          inp.value = "";
        }
      }
    });

    qs("#gft-cli-run-btn")?.addEventListener("click", () => window.runUnifiedTerminalCommand());

    // Stream filtering & pause
    const streamBuffer = [];
    let streamErrCount = 0;
    let streamPaused = false;

    const rerenderStream = () => {
      const out = qs("#gft-stream-out");
      if (!out) return;
      out.innerHTML = "";
      for (const ev of streamBuffer) renderCompactStreamRow(out, ev);
    };

    qsa("#gft-filter-bar [data-gft-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.gftFilter || "ALL";
        qsa("#gft-filter-bar [data-gft-filter]").forEach((b) => b.classList.toggle("on", b.dataset.gftFilter === val));
        rerenderStream();
      });
    });

    qs("#gft-pause-btn")?.addEventListener("click", (e) => {
      streamPaused = !streamPaused;
      e.currentTarget.textContent = streamPaused ? "▶ Resume" : "⏸ Pause";
      if (!streamPaused) rerenderStream();
    });

    window.mirrorEventToGlobalFooterStream = function (entry) {
      if (!entry || !entry.message) return;
      streamBuffer.push(entry);
      while (streamBuffer.length > 300) streamBuffer.shift();
      const lvl = String(entry.level || "").toLowerCase();
      const cat = String(entry.category || "SYS").toUpperCase();
      const isErr = lvl === "error" || /ERR|FAIL|CRASH/i.test(cat);
      if (isErr) {
        streamErrCount += 1;
        if (qs("#gft-err-count")) qs("#gft-err-count").textContent = String(streamErrCount);
      }
      const ticker = qs("#gft-latest-event-ticker");
      if (ticker && !streamPaused) {
        ticker.textContent = `[${entry.category || "SYS"}] ${String(entry.message).replace(/\s+/g, " ").slice(0, 110)}`;
        ticker.style.color = isErr ? "var(--bad)" : "var(--muted)";
      }
      if (!streamPaused) renderCompactStreamRow(qs("#gft-stream-out"), entry);
    };

    window.appendGlobalFooterTerminalLog = function (text, color = "", autoExpand = false) {
      const isErr = /error|fail|exception/i.test(String(text || "")) || String(color).includes("ff6b");
      window.mirrorEventToGlobalFooterStream({
        ts: new Date().toISOString().slice(11, 23),
        category: isErr ? "ERROR" : "BACKEND",
        level: isErr ? "error" : "info",
        message: String(text || ""),
      });
      if (autoExpand) window.openUnifiedTerminal(_deckTab);
    };

    // Capture browser runtime errors into Stream
    window.addEventListener("error", (ev) => {
      window.mirrorEventToGlobalFooterStream({
        ts: new Date().toISOString().slice(11, 23),
        category: "FRONTEND_ERR",
        level: "error",
        message: `${ev.message || "Error"} (${ev.filename ? ev.filename.split("/").pop() : "ui"}:${ev.lineno || 0})`,
      });
    });

    if (typeof pollLiveConsoleStream === "function" && !window._gftBackendPollTimer) {
      pollLiveConsoleStream();
      window._gftBackendPollTimer = setInterval(pollLiveConsoleStream, 2200);
    }

    // Copilot controls
    qs("#gft-copilot-send-btn")?.addEventListener("click", () => {
      const cInp = qs("#gft-copilot-input");
      const val = cInp?.value || "";
      if (cInp) cInp.value = "";
      askDeckCopilot(val);
    });
    qs("#gft-copilot-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = e.currentTarget.value || "";
        e.currentTarget.value = "";
        askDeckCopilot(val);
      }
    });
    qs("#gft-copilot-attach-err-btn")?.addEventListener("click", () => {
      const inpEl = qs("#gft-copilot-input");
      if (!inpEl) return;
      const errTxt = _lastTerminalError || streamBuffer.slice().reverse().find((x) => x.level === "error")?.message || "";
      inpEl.value = errTxt ? `Diagnose and fix this error:\n${errTxt.slice(0, 1200)}` : "Diagnose the latest system health issue.";
      inpEl.focus();
    });
    qs("#gft-copilot-attach-ans-btn")?.addEventListener("click", () => {
      const inpEl = qs("#gft-copilot-input");
      const latestBody = qs("#answers .card.ans .body");
      const txt = latestBody?._rawText || latestBody?.textContent || "";
      if (inpEl) {
        inpEl.value = txt ? `Review & improve this output:\n${txt.slice(0, 1200)}` : "Summarize the latest workspace output.";
        inpEl.focus();
      }
    });

    // Resize grip drag — resizes #gft-expanded-body height smoothly across split/single panes
    const grip = qs("#gft-resize-grip");
    grip?.addEventListener("mousedown", (e) => {
      if (!footer.classList.contains("gft-expanded")) return;
      const expBody = qs("#gft-expanded-body");
      if (!expBody) return;
      e.preventDefault();
      const startY = e.clientY;
      const startH = expBody.offsetHeight || 175;
      document.body.style.userSelect = "none";
      const onMove = (ev) => {
        const nextH = Math.max(115, Math.min(window.innerHeight * 0.72, startH + (startY - ev.clientY)));
        expBody.style.height = `${nextH}px`;
      };
      const onUp = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 6. TOPBAR THEME + VIEW PICKER BINDINGS & BOOTSTRAP
  // ══════════════════════════════════════════════════════════════════════════
  function initTopbarThemeAndViewBindings() {
    qsa("[data-theme-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = window.setAppTheme(btn.dataset.themePick);
        if (typeof status === "function") status(`🎨 Theme switched to ${APP_THEMES[chosen].fullName}`);
      });
    });

    qsa("[data-app-view-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = window.setAppViewMode(btn.dataset.appViewPick);
        if (typeof status === "function") status(`🪟 View switched to ${APP_VIEW_MODES[chosen].label} across the app`);
      });
    });

    // Delegated card dropdown accordion & Full Popup button clicks
    document.addEventListener("click", (e) => {
      const ddToggle = e.target.closest?.(".card-dd-toggle, #answers .card.ans h3.answer-head");
      if (ddToggle && !e.target.closest("button:not(.card-dd-toggle)")) {
        const card = ddToggle.closest(".card.ans");
        if (card) {
          if (document.documentElement.getAttribute("data-app-view") === "lighthouse") {
            spotlightCardIntoLighthouse(card);
          } else if (document.documentElement.getAttribute("data-app-view") === "dropdowns") {
            card.classList.toggle("is-dd-open");
          }
        }
      }
      const inspectBtn = e.target.closest?.(".card-inspect-btn");
      if (inspectBtn) {
        const card = inspectBtn.closest(".card.ans");
        const body = card?.querySelector(".body");
        const raw = body?._rawText || body?.textContent || "";
        window.AppHoverPreview?.show({
          anchor: card,
          icon: "🤖",
          title: card?.querySelector(".answer-name")?.textContent || "Response",
          subtitle: card?.querySelector(".answer-sub")?.textContent || "",
          rawText: raw,
          pin: true,
          expand: true,
        });
      }
    });

    // Restore persisted theme & view mode
    try {
      const savedView = localStorage.getItem("suomynona-app-view-mode") || "tiles";
      window.setAppViewMode(savedView, false);
    } catch (_) {}
  }

  function bootAllUxSystems() {
    initUniversalHoverPreview();
    initTopbarHoverFlyoutGrace();
    initSettingsSubTabs();
    initVaultHubInteractions();
    window.initUnifiedCommandDeck();
    initTopbarThemeAndViewBindings();
    window.refreshVaultHubView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAllUxSystems);
  } else {
    bootAllUxSystems();
  }
})();

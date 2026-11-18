// Track collapsed state for Cloud API provider sets on the Lineup page (start ALL collapsed on initial load!)
const collapsedCloudSets = new Set(["orca_cyber", "gemini", "openrouter", "openai", "xai", "groq", "anthropic", "deepseek", "mistral"]);
let cloudSetsInitialized = false;
let cloudCardCollapsed = true;

const CLOUD_PROVIDER_LABELS = {
  orca_cyber: "🦈 OrcaRouter & Approved Gated Cyber Models",
  gemini: "✨ Google Gemini Cloud API",
  openrouter: "🌐 OpenRouter Cloud API",
  openai: "🧠 OpenAI Cloud API",
  xai: "⚡ xAI Grok Cloud API",
};

function renderCloudLineup() {
  const wrap = $("#cloud-lineup-options");
  if (!wrap) return;
  const models = STATE.cloud_models || [];
  const selected = new Set(STATE.cloud_lineup || []);
  const fallbackSelect = $("#cloud-fallback-select");
  wrap.innerHTML = "";

  // Ensure cloud card body matches cloudCardCollapsed state
  $("#cloud-card-body")?.classList.toggle("hidden", cloudCardCollapsed);
  const cardArrow = $("#cloud-card-arrow");
  if (cardArrow) cardArrow.textContent = cloudCardCollapsed ? "▸" : "▾";

  const updateCloudSummaryAndFallback = (preferred = fallbackSelect?.value || STATE.cloud_fallback || "") => {
    const checkedInputs = $$("#cloud-lineup-options input[type='checkbox']:checked");
    const checkedModels = checkedInputs.map((input) => input.value);
    if (fallbackSelect) {
      fallbackSelect.innerHTML = '<option value="">Disabled</option>'
        + models.filter((model) => checkedModels.includes(model.id))
          .map((model) => `<option value="${esc(model.id)}">${esc(model.name)}</option>`).join("");
      fallbackSelect.value = checkedModels.includes(preferred) ? preferred : (checkedModels[0] || "");
    }
    const sumEl = $("#cloud-selected-summary");
    if (sumEl) {
      sumEl.textContent = `(${checkedModels.length} of ${models.length} selected)`;
    }
    // Update each provider set counter badge
    wrap.querySelectorAll(".cloud-api-set").forEach((setEl) => {
      const prov = setEl.dataset.providerSet;
      const allInSet = setEl.querySelectorAll("input[type='checkbox']");
      const checkedInSet = setEl.querySelectorAll("input[type='checkbox']:checked");
      const countSpan = setEl.querySelector("[data-set-count]");
      if (countSpan) countSpan.textContent = `${checkedInSet.length}/${allInSet.length} selected`;
    });
  };

  if (!models.length) {
    wrap.innerHTML = '<div class="muted">No cloud models available yet. Enable a provider in Settings.</div>';
    if (fallbackSelect) fallbackSelect.innerHTML = '<option value="">Disabled</option>';
    return;
  }

  // Group models by API provider set (orca_cyber first, then gemini, openrouter, openai, xai)
  const byProvider = new Map();
  models.forEach((m) => {
    const prov = m.provider || "cloud";
    if (!byProvider.has(prov)) byProvider.set(prov, []);
    byProvider.get(prov).push(m);
  });

  if (!cloudSetsInitialized) {
    for (const prov of byProvider.keys()) {
      collapsedCloudSets.add(prov);
    }
    cloudSetsInitialized = true;
  }

  for (const [prov, provModels] of byProvider.entries()) {
    const setDiv = document.createElement("div");
    const isCollapsed = collapsedCloudSets.has(prov);
    setDiv.className = "cloud-api-set" + (prov === "orca_cyber" ? " orca-set" : "") + (isCollapsed ? " collapsed" : "");
    setDiv.dataset.providerSet = prov;

    const head = document.createElement("div");
    head.className = "cloud-api-set-head";
    const titleLabel = CLOUD_PROVIDER_LABELS[prov] || `☁️ ${prov.toUpperCase()} API`;
    const checkedInit = provModels.filter((m) => selected.has(m.id)).length;

    head.innerHTML = `
      <div class="cloud-api-set-title">
        <span data-set-arrow>${isCollapsed ? "▸" : "▾"}</span>
        <span>${esc(titleLabel)}</span>
        <span class="right-badge ${prov === "orca_cyber" ? "orca" : ""}" data-set-count>${checkedInit}/${provModels.length} selected</span>
      </div>
      <div class="cloud-api-set-actions">
        <button type="button" class="ghost xs" data-set-select-all="${esc(prov)}" title="Select all ${esc(prov)} models">✓ Select All</button>
        <button type="button" class="ghost xs" data-set-deselect-all="${esc(prov)}" title="Deselect all ${esc(prov)} models">✕ Deselect All</button>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "cloud-api-set-body";

    provModels.forEach((model) => {
      const label = document.createElement("label");
      label.className = "cloud-lineup-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = model.id;
      checkbox.dataset.provider = prov;
      checkbox.checked = selected.has(model.id);
      checkbox.addEventListener("change", () => updateCloudSummaryAndFallback());
      const name = document.createElement("span");
      name.textContent = model.name;
      const meta = document.createElement("span");
      meta.className = "muted";
      meta.textContent = `${model.cat || model.provider} · ${model.model}${model.gated ? " · 🔒 approved" : ""}${model.vision ? " · vision" : ""}`;
      label.append(checkbox, name, meta);
      body.appendChild(label);
    });

    head.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const nowCollapsed = !setDiv.classList.contains("collapsed");
      setDiv.classList.toggle("collapsed", nowCollapsed);
      if (nowCollapsed) collapsedCloudSets.add(prov);
      else collapsedCloudSets.delete(prov);
      const arrow = head.querySelector("[data-set-arrow]");
      if (arrow) arrow.textContent = nowCollapsed ? "▸" : "▾";
    });

    head.querySelector(`[data-set-select-all="${prov}"]`)?.addEventListener("click", async (e) => {
      e.stopPropagation();
      body.querySelectorAll("input[type='checkbox']").forEach((cb) => { cb.checked = true; });
      updateCloudSummaryAndFallback();
      await saveCloudLineupNow(`Selected all ${titleLabel}`);
    });

    head.querySelector(`[data-set-deselect-all="${prov}"]`)?.addEventListener("click", async (e) => {
      e.stopPropagation();
      body.querySelectorAll("input[type='checkbox']").forEach((cb) => { cb.checked = false; });
      updateCloudSummaryAndFallback();
      await saveCloudLineupNow(`Deselected all ${titleLabel}`);
    });

    setDiv.append(head, body);
    wrap.appendChild(setDiv);
  }

  updateCloudSummaryAndFallback(STATE.cloud_fallback || "");
}

async function saveCloudLineupNow(customStatusMsg = "") {
  const models = $$("#cloud-lineup-options input[type='checkbox']:checked").map((input) => input.value);
  const fallback_id = $("#cloud-fallback-select")?.value || "";
  const result = await postJSON("/api/cloud-lineup", { models, fallback_id });
  if (result.ok) {
    await reloadState();
    status(customStatusMsg || `Cloud lineup saved — ${models.length} cloud model(s) active in Council`);
  } else {
    status(result.error || "Could not save cloud lineup");
  }
}

$("#cloud-lineup-save")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await saveCloudLineupNow();
  } finally {
    button.disabled = false;
  }
});

$("#cloud-select-all")?.addEventListener("click", async () => {
  $$("#cloud-lineup-options input[type='checkbox']").forEach((cb) => { cb.checked = true; });
  await saveCloudLineupNow("✓ Selected & saved ALL Cloud + Orca Cyber models");
});

$("#cloud-deselect-all")?.addEventListener("click", async () => {
  $$("#cloud-lineup-options input[type='checkbox']").forEach((cb) => { cb.checked = false; });
  await saveCloudLineupNow("✕ Deselected all Cloud + Orca Cyber models");
});

$("#cloud-select-orca")?.addEventListener("click", async () => {
  $$("#cloud-lineup-options input[type='checkbox']").forEach((cb) => {
    if (String(cb.value || "").startsWith("cloud:orca_cyber:")) cb.checked = true;
  });
  await saveCloudLineupNow("🦈 Selected & saved all Orca Cyber Approved models");
});

$("#cloud-deselect-orca")?.addEventListener("click", async () => {
  $$("#cloud-lineup-options input[type='checkbox']").forEach((cb) => {
    if (String(cb.value || "").startsWith("cloud:orca_cyber:")) cb.checked = false;
  });
  await saveCloudLineupNow("🦈 Deselected all Orca Cyber Cloud models");
});

$("#cloud-toggle-all-sets")?.addEventListener("click", () => {
  const sets = $$("#cloud-lineup-options .cloud-api-set");
  const anyCollapsed = sets.some((s) => s.classList.contains("collapsed"));
  sets.forEach((s) => {
    const prov = s.dataset.providerSet;
    s.classList.toggle("collapsed", !anyCollapsed);
    if (!anyCollapsed) collapsedCloudSets.add(prov);
    else collapsedCloudSets.delete(prov);
    const arrow = s.querySelector("[data-set-arrow]");
    if (arrow) arrow.textContent = !anyCollapsed ? "▸" : "▾";
  });
  const btn = $("#cloud-toggle-all-sets");
  if (btn) btn.textContent = anyCollapsed ? "▾ Collapse API Sets" : "▸ Expand API Sets";
});

$("#cloud-card-title-toggle")?.addEventListener("click", () => {
  cloudCardCollapsed = !cloudCardCollapsed;
  $("#cloud-card-body")?.classList.toggle("hidden", cloudCardCollapsed);
  const arrow = $("#cloud-card-arrow");
  if (arrow) arrow.textContent = cloudCardCollapsed ? "▸" : "▾";
});

// ── Right-Side Active Models In Use Monitor (All Groups Start Collapsed + Bigger/Fatter Host Tickets) ──
let rightRailFilter = "all";
const collapsedRightGroups = new Set();
const initializedRightGroups = new Set();

$$("#right-rail-filter button").forEach((btn) => {
  btn.onclick = () => {
    rightRailFilter = btn.dataset.rfilter || "all";
    $$("#right-rail-filter button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    renderRightModelsRail();
  };
});
$("#right-rail-search")?.addEventListener("input", () => renderRightModelsRail());

$("#right-select-all-btn")?.addEventListener("click", () => {
  pickAllBackends();
  renderChips();
  renderRightModelsRail();
  status(`Selected all ${picked.size} active models for the next Council prompt`);
});

$("#right-select-none-btn")?.addEventListener("click", () => {
  picked.clear();
  renderChips();
  renderRightModelsRail();
  status("Deselected all models — click any model or group ✓ All in the right rail to include it");
});

$("#right-collapse-groups-btn")?.addEventListener("click", () => {
  const allBars = $$("#right-rail-list [data-rgroup-key]");
  const allKeys = allBars.map((el) => el.dataset.rgroupKey);
  const anyExpanded = allKeys.some((k) => !collapsedRightGroups.has(k));
  if (anyExpanded) {
    allKeys.forEach((k) => collapsedRightGroups.add(k));
  } else {
    collapsedRightGroups.clear();
  }
  renderRightModelsRail();
});

$("#right-goto-lineup-btn")?.addEventListener("click", () => {
  const lineupBtn = document.querySelector('.rail-btn[data-view="lineup"]');
  if (lineupBtn) lineupBtn.click();
});

function renderRightModelsRail() {
  const listEl = $("#right-rail-list");
  if (!listEl || !STATE) return;
  const query = ($("#right-rail-search")?.value || "").trim().toLowerCase();
  listEl.innerHTML = "";

  const allBackends = (STATE.backends || []).filter(
    (b) => !String(b.model || "").toLowerCase().includes("embed")
  );
  const catalog = STATE.catalog || {};

  const matchesQuery = (b) => {
    if (!query) return true;
    const hay = `${b.name || ""} ${b.model || ""} ${b.provider || ""} ${b.slot || ""} ${b.host_id || ""} ${b.kind || ""}`.toLowerCase();
    return hay.includes(query);
  };

  const matchesFilter = (b) => {
    if (rightRailFilter === "picked") return picked.has(b.i);
    if (rightRailFilter === "hosts") return b.kind === "runtime";
    if (rightRailFilter === "orca") {
      return (
        b.provider === "orca_cyber" ||
        b.slot === "cyber" ||
        b.gated ||
        /orca|baron|lily|cyber|whitehat/i.test(`${b.name} ${b.model}`)
      );
    }
    return true;
  };

  const filtered = allBackends.filter((b) => matchesQuery(b) && matchesFilter(b));

  // Group active models with Colab/Kaggle Hosts FIRST, then Orca Cyber Cloud, then each Cloud API set
  const groups = new Map();
  const hostsById = {};
  (STATE.runtime_hosts || STATE.colab_hosts || []).forEach((h) => {
    hostsById[h.id] = h;
  });

  filtered.forEach((b) => {
    let groupTitle = "🖥 Runtime Host";
    if (b.kind === "runtime") {
      const h = hostsById[b.host_id];
      const accel = h ? `${(h.provider || "colab").toUpperCase()} ${h.accelerator || "G4"}` : "GPU";
      groupTitle = `🖥 ${h?.name || `Host ${(b.host_id || "A").toUpperCase()}`} (${accel})`;
    } else if (b.kind === "cloud" && b.provider === "orca_cyber") {
      groupTitle = "🦈 Orca Cyber Approved (Cloud)";
    } else if (b.kind === "cloud") {
      groupTitle = `☁️ Cloud API · ${(b.provider || "cloud").toUpperCase()}`;
    } else if (b.kind === "custom") {
      groupTitle = "🌐 Custom / Local Endpoints";
    }
    if (!groups.has(groupTitle)) groups.set(groupTitle, []);
    groups.get(groupTitle).push(b);
    // Start ALL right-hand model groups collapsed when first entering the page!
    if (!initializedRightGroups.has(groupTitle)) {
      initializedRightGroups.add(groupTitle);
      collapsedRightGroups.add(groupTitle);
    }
  });

  if (!filtered.length) {
    listEl.innerHTML = `<div class="muted" style="padding:10px;font-size:12px">No active models match this filter. Use <strong>🎛 Lineup</strong> to load or change your host and cloud models.</div>`;
  } else {
    for (const [groupTitle, items] of groups.entries()) {
      const activeInGroup = items.filter((b) => picked.has(b.i)).length;
      const isCollapsed = !query && collapsedRightGroups.has(groupTitle);

      const bar = document.createElement("div");
      bar.className = "right-group-bar";
      bar.dataset.rgroupKey = groupTitle;
      bar.title = "Click to expand / collapse this host or API model set";
      bar.innerHTML = `
        <div class="right-group-bar-left">
          <span style="font-size:15px">${isCollapsed ? "▸" : "▾"}</span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(groupTitle)}</span>
        </div>
        <div class="right-group-bar-right">
          <span class="right-group-count-pill">${activeInGroup}/${items.length}</span>
          <button type="button" class="right-mini-btn" data-rg-all="1" title="Select all models in ${esc(groupTitle)}">✓ All</button>
          <button type="button" class="right-mini-btn" data-rg-none="1" title="Deselect all models in ${esc(groupTitle)}">✕ None</button>
        </div>
      `;

      const itemsWrap = document.createElement("div");
      itemsWrap.className = "right-group-items" + (isCollapsed ? " collapsed" : "");

      bar.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        if (collapsedRightGroups.has(groupTitle)) collapsedRightGroups.delete(groupTitle);
        else collapsedRightGroups.add(groupTitle);
        renderRightModelsRail();
      });

      bar.querySelector("[data-rg-all]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        items.forEach((b) => picked.add(b.i));
        renderChips();
        renderRightModelsRail();
        status(`✓ Selected all ${items.length} model(s) in ${groupTitle}`);
      });

      bar.querySelector("[data-rg-none]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        items.forEach((b) => picked.delete(b.i));
        renderChips();
        renderRightModelsRail();
        status(`✕ Deselected all model(s) in ${groupTitle}`);
      });

      listEl.appendChild(bar);

      items.forEach((b) => {
        const isPicked = picked.has(b.i);
        const catInfo = catalog[b.cid] || {};
        const badges = [];
        if (b.kind === "runtime") {
          const gb = b.gb || catInfo.gb || 5;
          badges.push({ label: `${gb}GB`, cls: "orca" });
          if (b.slot) badges.push({ label: String(b.slot).toUpperCase(), cls: "" });
        } else if (b.provider === "orca_cyber") {
          badges.push({ label: "ORCA CYBER", cls: "orca" });
        } else if (b.provider) {
          badges.push({ label: String(b.provider).toUpperCase(), cls: "" });
        }
        if (b.gated || catInfo.gated) badges.push({ label: "🔒 GATED", cls: "gated" });
        if (b.vision) badges.push({ label: "👁 VIS", cls: "" });

        const cleanTitle = String(b.name || b.model || "Model")
          .replace(/^\[Host\s+[A-Z0-9]+\]\s*/i, "")
          .replace(/^[🦈☁🌐]\s*/, "");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "right-model-item" + (isPicked ? " active" : "");
        btn.setAttribute("data-model-lighthouse", b.model || b.name || "");
        btn.title = `${b.name}\nModel ID: ${b.model}\nStatus: Loaded in Council (${isPicked ? "Included in next Ask" : "Paused for next Ask"})\nClick to ${isPicked ? "pause for" : "include in"} the current prompt`;
        const badgesHtml = badges
          .map((bd) => `<span class="right-badge ${bd.cls || ""}">${esc(bd.label)}</span>`)
          .join("");
        btn.innerHTML = `
          <div class="right-model-info">
            <div class="right-model-name">🟢 ${esc(cleanTitle)}</div>
            <div class="right-model-meta">${badgesHtml}<span>${esc(b.model || "")}</span></div>
          </div>
          <span class="right-model-status">${isPicked ? "⚡ Asking" : "⏸ Paused"}</span>
        `;
        btn.onclick = () => {
          if (picked.has(b.i)) picked.delete(b.i);
          else picked.add(b.i);
          const answer = answers[b.i];
          if (answer?.card) answer.card.classList.toggle("hidden", !picked.has(b.i));
          renderChips();
          renderRightModelsRail();
          status(`${picked.has(b.i) ? "Included" : "Paused"} ${cleanTitle} (${picked.size}/${allBackends.length} active models selected)`);
        };
        itemsWrap.appendChild(btn);
      });

      listEl.appendChild(itemsWrap);
    }
  }

  const countEl = $("#right-rail-count");
  if (countEl) {
    countEl.textContent = `${picked.size} asking / ${allBackends.length} loaded`;
  }
  const topCountEl = $("#topbar-models-count");
  if (topCountEl) {
    topCountEl.textContent = `${picked.size}/${allBackends.length}`;
  }
  const summary = $("#composer-collapsed-summary");
  if (summary) {
    summary.textContent = `${picked.size}/${allBackends.length} models active · mode: ${MODE.toUpperCase()}`;
  }
}

function bindLineupWindowTabs() {
  const winTabs = $$("#lineup-win-tabs [data-lineup-win]");
  if (!winTabs.length) return;
  winTabs.forEach((btn) => {
    if (btn._boundWinTab) return;
    btn._boundWinTab = true;
    btn.addEventListener("click", () => {
      const targetWin = btn.dataset.lineupWin || "hosts";
      window._activeLineupWin = targetWin;
      winTabs.forEach((b) => {
        const isOn = b === btn;
        b.classList.toggle("active", isOn);
        b.setAttribute("aria-selected", String(isOn));
      });
      $$("#view-lineup .lineup-win-pane").forEach((pane) => {
        const pName = pane.dataset.lineupPane;
        const shouldShow = pName === targetWin;
        pane.classList.toggle("hidden", !shouldShow);
      });
      if (targetWin === "cloud") {
        $("#cloud-card-body")?.classList.remove("hidden");
      }
      if (targetWin === "add-models") {
        $("#cg-name")?.focus();
      }
      if (targetWin === "host-setup") {
        if (typeof syncHostSetupMemoryUI === "function") syncHostSetupMemoryUI();
        renderColabHosts();
      }
    });
  });

  const openAddBtn = $("#lineup-open-add-models-btn");
  if (openAddBtn && !openAddBtn._boundAdd) {
    openAddBtn._boundAdd = true;
    openAddBtn.addEventListener("click", () => {
      const addTab = document.querySelector('#lineup-win-tabs [data-lineup-win="add-models"]');
      if (addTab) addTab.click();
    });
  }

  $$(".quick-add-gguf-btn").forEach((qBtn) => {
    if (qBtn._boundQuickAdd) return;
    qBtn._boundQuickAdd = true;
    qBtn.addEventListener("click", async () => {
      const name = qBtn.dataset.qname || "";
      const repo = qBtn.dataset.qrepo || "";
      const gb = Number(qBtn.dataset.qgb) || 5;
      const slot = qBtn.dataset.qslot || "uncensored";
      if (!name || !repo) return;
      qBtn.disabled = true;
      try {
        const res = await postJSON("/api/custom-gguf", {
          name,
          repo,
          gb,
          slot,
          vision: false,
          gated: false,
        });
        if (res?.ok) {
          await reloadState();
          renderCustomGguf();
          renderLineup();
          status(`✅ Added "${name}" (${repo}) to Suomynona Council [${slot}] lineup & saved in persistent memory!`);
        }
      } catch (e) {
        status(`❌ Quick-add error: ${e.message || e}`);
      } finally {
        qBtn.disabled = false;
      }
    });
  });
}

function renderLineup(opts = {}) {
  bindLineupWindowTabs();
  renderCloudLineup();
  if (typeof syncHostSetupMemoryUI === "function") syncHostSetupMemoryUI();
  if (!opts?.skipHoverMount) {
    const hoverMount = $("#lineup-hover-squares-mount");
    if (hoverMount && typeof buildUpwardHostTreeBuilder === "function") {
      hoverMount.innerHTML = "";
      hoverMount.appendChild(buildUpwardHostTreeBuilder());
    }
  }
  const hosts = (STATE.runtime_hosts || STATE.colab_hosts || []).filter((host) => host.enabled !== false);
  const wrap = $("#slots");
  wrap.innerHTML = "";
  wrap.className = "lineup-single-host-stage";
  const hostTabsEl = $("#lineup-host-tabs");
  if (hostTabsEl) hostTabsEl.innerHTML = "";

  if (!hosts.length) {
    wrap.textContent = "Add and enable at least one runtime host in the 🛠️ Host Setup tab to configure its lineup.";
    return;
  }

  if (!window._activeLineupHostId || !hosts.some((h) => h.id === window._activeLineupHostId)) {
    window._activeLineupHostId = hosts[0].id;
  }

  const switchActiveHostWindow = (hostId) => {
    window._activeLineupHostId = hostId;
    $$("#lineup-host-tabs .lineup-host-tab[data-host-tab-id]").forEach((t) => {
      t.classList.toggle("active", t.dataset.hostTabId === hostId);
    });
    $$("#slots .host-lineup-card[data-host-lineup]").forEach((c) => {
      c.classList.toggle("hidden-host-win", c.dataset.hostLineup !== hostId);
    });
  };

  if (hostTabsEl) {
    hosts.forEach((host) => {
      const prov = String(host.provider || "colab").toLowerCase();
      const icon = prov === "kaggle" ? "🦆" : prov === "localhost" ? "💻" : prov === "custom" ? "🔌" : "🖥️";
      const tBtn = document.createElement("button");
      tBtn.type = "button";
      tBtn.className = "lineup-host-tab" + (host.id === window._activeLineupHostId ? " active" : "");
      tBtn.dataset.hostTabId = host.id;
      tBtn.innerHTML = `<span>${icon} ${esc(host.name || `Host ${host.id.toUpperCase()}`)}</span><span class="right-badge" data-host-tab-badge="${esc(host.id)}" style="font-size:10px">${esc(host.accelerator || "G4")}</span>`;
      tBtn.onclick = () => switchActiveHostWindow(host.id);
      hostTabsEl.appendChild(tBtn);
    });
    const addHostBtn = document.createElement("button");
    addHostBtn.type = "button";
    addHostBtn.className = "lineup-host-tab";
    addHostBtn.title = "Open 🛠️ Host Setup tab to authenticate, customize RAM/Data Tuning, or add/remove hosts";
    addHostBtn.innerHTML = `<span>🛠️ Host Setup / ＋ Add Host</span>`;
    addHostBtn.onclick = () => {
      const hsTab = document.querySelector('#lineup-win-tabs [data-lineup-win="host-setup"]');
      if (hsTab) hsTab.click();
      setTimeout(() => $("#colab-host-name")?.focus(), 120);
    };
    hostTabsEl.appendChild(addHostBtn);
  }

  const savedByHost = STATE.host_lineups || {};
  if (!STATE.host_lineups && hosts[0]) savedByHost[hosts[0].id] = STATE.lineup || {};
  hosts.forEach((host) => {
    const card = document.createElement("div");
    card.className = "card host-lineup-card" + (host.id === window._activeLineupHostId ? "" : " hidden-host-win");
    card.dataset.hostLineup = host.id;
    card.innerHTML = `<div class="host-lineup-head"><h2>${esc(host.name || host.id)}</h2><span class="muted" data-host-total></span></div>`;
    const validProvs = ["runpod", "vastai", "lambda", "modal", "cloud_vm", "localhost", "custom", "colab", "kaggle"];
    const provider = validProvs.includes(String(host.provider || "").toLowerCase())
      ? String(host.provider).toLowerCase()
      : "colab";
    const acceleratorOptions = [...getDefaultAcceleratorsForProvider(provider)];
    if (host.accelerator && !acceleratorOptions.includes(host.accelerator)) {
      acceleratorOptions.unshift(host.accelerator);
    }
    const hardwarePanel = document.createElement("div");
    hardwarePanel.className = "host-hardware-panel";
    const showEndpointUrl = true;
    const endpointVal = host.custom_url || host.local_url || (provider === "localhost" ? "http://127.0.0.1:8080/v1" : "");
    const authedAccels = Array.isArray(host.authenticated_accelerators) && host.authenticated_accelerators.length
      ? host.authenticated_accelerators
      : [...acceleratorOptions];
    hardwarePanel.innerHTML = `<label>Provider
        <select class="select slim" data-host-provider>
          <option value="runpod" ${provider === "runpod" ? "selected" : ""}>RunPod Cloud GPU</option>
          <option value="vastai" ${provider === "vastai" ? "selected" : ""}>Vast.ai GPU Rig</option>
          <option value="lambda" ${provider === "lambda" ? "selected" : ""}>Lambda Labs H100/GH200</option>
          <option value="modal" ${provider === "modal" ? "selected" : ""}>Modal Serverless GPU</option>
          <option value="cloud_vm" ${provider === "cloud_vm" ? "selected" : ""}>AWS / GCP / Azure VM</option>
          <option value="localhost" ${provider === "localhost" ? "selected" : ""}>Localhost (PC / Ollama / vLLM)</option>
          <option value="custom" ${provider === "custom" ? "selected" : ""}>Custom OpenAI/SSH Endpoint</option>
          <option value="colab" ${provider === "colab" ? "selected" : ""}>Google Colab</option>
          <option value="kaggle" ${provider === "kaggle" ? "selected" : ""}>Kaggle</option>
        </select>
      </label>
      <label>Accelerator
        <select class="select slim" data-host-accelerator>${acceleratorOptions.map((option) =>
          `<option value="${esc(option)}" ${(host.accelerator || acceleratorOptions[0]) === option ? "selected" : ""}>${esc(option)}</option>`).join("")}</select>
      </label>
      <label data-host-url-wrap style="display:flex;align-items:center;gap:4px">Tunnel/URL
        <input class="input slim" data-host-custom-url value="${esc(endpointVal)}" placeholder="https://xxx.trycloudflare.com or http://127.0.0.1:8080/v1" style="width:205px" title="Tunnel URL (Cloudflare/ngrok) or local inference server endpoint for Host ${esc(host.id.toUpperCase())}">
      </label>
      <button class="primary sm" type="button" data-host-test-handshake title="Test live HTTP / tunnel handshake latency and verify model connection on Host ${esc(host.id.toUpperCase())}">⚡ Test Handshake</button>
      <label class="toggle host-high-memory"><input type="checkbox" data-host-high-memory> Colab High-RAM</label>
      <label class="toggle host-high-memory" title="When enabled, if an auth or connection attempt fails, automatically retry the handshake with exponential backoff until the host status turns green"><input type="checkbox" data-host-autoreconnect="${esc(host.id)}" ${host.auto_reconnect !== false ? "checked" : ""}> 🔄 Persistent Auto-Reconnect</label>
      <button class="ghost sm force-reconnect-btn" type="button" data-force-reconnect-host="${esc(host.id)}" title="Manually trigger an immediate fresh handshake for this host without waiting for the exponential backoff interval">⚡ Force Reconnect</button>
      <button class="primary sm" type="button" data-host-auth-accel title="Save &amp; authenticate the selected hardware accelerator on this host">🔑 Auth Accelerator</button>
      <button class="ghost sm" type="button" data-host-auth-all-accels title="Authenticate all hardware accelerators on this host (${esc(acceleratorOptions.join(", "))})">🔑 Auth All Accelerators</button>
      <button class="ghost sm" type="button" data-host-detect>🔎 Auto-detect GPU</button>
      <button class="primary sm" type="button" data-host-hardware-save>💾 Save hardware</button>
      <button class="primary sm" type="button" data-host-max-gpu title="Pack this host GPU to maximum VRAM capacity with top models">🔥 Max Out This GPU</button>
      <button class="ghost sm" type="button" data-start-host>▶ Start this host</button>
      <span class="muted host-detection-status" data-host-detection-status>Saved for next sessions: ${esc(provider.toUpperCase())} · ${esc(host.accelerator || acceleratorOptions[0])} (${host.gpu_vram_gb || getClientGpuVramGb(provider, host.accelerator)}GB VRAM)${host.high_memory ? " · High-RAM" : ""}</span>
      <div class="host-auth-mode-subpanel" data-host-auth-mode-panel style="width:100%;margin-top:6px;padding:7px 10px;border-radius:8px;border:1px solid rgba(46,230,166,.28);background:rgba(15,23,42,.55);display:flex;flex-wrap:wrap;gap:6px;align-items:center">
        <strong style="font-size:11px;color:var(--ok)">🔐 Authenticate Accelerators on ${esc(host.name || `Host ${host.id.toUpperCase()}`)}:</strong>
        <div class="row" data-host-accel-auth-pills style="gap:4px;flex-wrap:wrap">
          ${acceleratorOptions.map((acc) => {
            const isActive = (host.accelerator || acceleratorOptions[0]) === acc;
            const isAuthed = authedAccels.includes(acc);
            const vram = getClientGpuVramGb(provider, acc);
            return `<button type="button" class="${isActive ? "primary" : "ghost"} xs" data-auth-pick-accel="${esc(acc)}" title="Click to select, save &amp; authenticate ${esc(acc)} (${vram}GB VRAM) on ${esc(host.name || host.id)}">${isAuthed ? "🟢" : "🔑"} ${esc(acc)} (${vram}GB)${isActive ? " ★ Active" : ""}</button>`;
          }).join("")}
        </div>
        <span class="spacer"></span>
        <input class="input slim" data-host-inline-account value="${esc(host.google_account || host.kaggle_username || "")}" placeholder="${provider === "kaggle" ? "Kaggle Username / Key…" : "Google Pro Account Email or Tunnel URL…"}" style="min-width:190px;max-width:240px;height:23px;font-size:11px;padding:2px 7px">
        <button type="button" class="primary xs" data-host-inline-auth-submit title="Save credentials &amp; authenticate all accelerators on this host">🔑 Authenticate Host &amp; GPU</button>
      </div>`;
    const providerSelect = hardwarePanel.querySelector("[data-host-provider]");
    const acceleratorSelect = hardwarePanel.querySelector("[data-host-accelerator]");
    const highMemoryInput = hardwarePanel.querySelector("[data-host-high-memory]");
    const autoReconnectInput = hardwarePanel.querySelector(`[data-host-autoreconnect="${host.id}"]`);
    const forceReconnectBtn = hardwarePanel.querySelector(`[data-force-reconnect-host="${host.id}"]`);
    const testHandshakeBtn = hardwarePanel.querySelector("[data-host-test-handshake]");
    const urlWrap = hardwarePanel.querySelector("[data-host-url-wrap]");
    const urlInput = hardwarePanel.querySelector("[data-host-custom-url]");
    const detectionStatus = hardwarePanel.querySelector("[data-host-detection-status]");
    const inlineAccountInput = hardwarePanel.querySelector("[data-host-inline-account]");
    acceleratorSelect.value = host.accelerator || acceleratorOptions[0];
    highMemoryInput.checked = Boolean(host.high_memory);
    if (autoReconnectInput) {
      autoReconnectInput.checked = typeof isHostAutoReconnectEnabled === "function"
        ? isHostAutoReconnectEnabled(host.id, host.auto_reconnect !== false)
        : host.auto_reconnect !== false;
      autoReconnectInput.addEventListener("change", () => {
        if (typeof setHostAutoReconnect === "function") {
          setHostAutoReconnect(host.id, autoReconnectInput.checked);
        }
      });
    }
    if (forceReconnectBtn) {
      forceReconnectBtn.addEventListener("click", () => {
        if (typeof forceReconnectHost === "function") {
          forceReconnectHost(host.id);
        }
      });
    }
    if (testHandshakeBtn) {
      testHandshakeBtn.addEventListener("click", async () => {
        const { curUrl } = applyImmediateLocalHostUpdate();
        detectionStatus.textContent = `⚡ Testing handshake with Host ${host.id.toUpperCase()}…`;
        testHandshakeBtn.disabled = true;
        try {
          const res = await postJSON(`/api/runtime-hosts/${encodeURIComponent(host.id)}/handshake`, {
            custom_url: curUrl,
          });
          if (res?.ok) {
            detectionStatus.textContent = res.message || `🟢 Handshake OK (${res.latency_ms}ms)!`;
            if (typeof markHostStatusGreen === "function") {
              markHostStatusGreen(host.id, res);
            }
            status(`Host ${host.id.toUpperCase()} handshake verified: ${res.latency_ms}ms · ${res.engine || "live"}`);
          } else {
            detectionStatus.textContent = `⚠️ Handshake failed: ${res?.error || "Host offline or unreachable"}`;
          }
        } catch (err) {
          detectionStatus.textContent = `⚠️ Handshake error: ${err.message || err}`;
        } finally {
          testHandshakeBtn.disabled = false;
        }
      });
    }
    if (urlInput) {
      const saveUrlChange = () => {
        const val = urlInput.value.trim();
        host.custom_url = val;
        if (host.provider === "localhost") host.local_url = val;
        putJSON(`/api/runtime-hosts/${encodeURIComponent(host.id)}`, { custom_url: val }).catch(() => {});
      };
      urlInput.addEventListener("change", saveUrlChange);
      urlInput.addEventListener("blur", saveUrlChange);
    }
    const syncHighMemoryAvailability = () => {
      const curProv = providerSelect ? providerSelect.value : provider;
      const available = curProv === "colab" && acceleratorSelect.value !== "L4";
      highMemoryInput.disabled = !available;
      if (!available) highMemoryInput.checked = false;
      if (urlWrap) {
        urlWrap.style.display = "";
      }
      hardwarePanel.querySelector(".host-high-memory").title = available
        ? "Request a Colab high-RAM machine on the next launch"
        : "High-RAM request is only supported for compatible Colab accelerators; L4 ignores it";
    };
    const refreshAccelAuthPillsUI = () => {
      const pillsWrap = hardwarePanel.querySelector("[data-host-accel-auth-pills]");
      if (!pillsWrap) return;
      const curProv = providerSelect ? providerSelect.value : provider;
      const curAcc = acceleratorSelect.value || "T4";
      const opts = getDefaultAcceleratorsForProvider(curProv);
      const authed = Array.isArray(host.authenticated_accelerators) && host.authenticated_accelerators.length
        ? host.authenticated_accelerators
        : opts;
      pillsWrap.innerHTML = opts.map((acc) => {
        const isActive = curAcc === acc;
        const isAuthed = authed.includes(acc);
        const vram = getClientGpuVramGb(curProv, acc);
        return `<button type="button" class="${isActive ? "primary" : "ghost"} xs" data-auth-pick-accel="${esc(acc)}" title="Click to select, save &amp; authenticate ${esc(acc)} (${vram}GB VRAM)">${isAuthed ? "🟢" : "🔑"} ${esc(acc)} (${vram}GB)${isActive ? " ★ Active" : ""}</button>`;
      }).join("");
      bindAccelAuthPills();
    };
    const applyImmediateLocalHostUpdate = () => {
      const curProv = providerSelect ? providerSelect.value : provider;
      const curAcc = acceleratorSelect.value || "T4";
      const curHm = Boolean(highMemoryInput.checked);
      const curUrl = urlInput ? urlInput.value.trim() : "";
      const vramGb = getClientGpuVramGb(curProv, curAcc);
      const budgetGb = getClientGpuBudgetGb(curProv, curAcc);
      const provLabel = curProv === "kaggle" ? "Kaggle" : curProv === "localhost" ? "Localhost" : curProv === "custom" ? "Custom" : "Colab";
      const baseName = String(host.name || `Host ${host.id.toUpperCase()}`).replace(/\s*\([^)]*\)\s*$/, "").trim();
      host.provider = curProv;
      host.accelerator = curAcc;
      host.high_memory = curHm;
      host.custom_url = curUrl;
      if (curProv === "localhost" && curUrl) host.local_url = curUrl;
      host.gpu_vram_gb = vramGb;
      host.model_budget_gb = budgetGb;
      host.name = `${baseName} (${provLabel} ${curAcc})`;
      const h2 = card.querySelector(".host-lineup-head h2");
      if (h2) h2.textContent = host.name;
      const tabBtn = document.querySelector(`.lineup-host-tab[data-host-tab-id="${host.id}"] span:first-child`);
      const icon = curProv === "kaggle" ? "🦆" : curProv === "localhost" ? "💻" : curProv === "custom" ? "🔌" : "🖥️";
      if (tabBtn) tabBtn.textContent = `${icon} ${host.name}`;
      const tabBadge = document.querySelector(`[data-host-tab-badge="${host.id}"]`);
      if (tabBadge) tabBadge.textContent = curAcc;
      refreshAccelAuthPillsUI();
      recount();
      persistHostHardwareToLocalStorage(collectHostHardwareConfigsFromDOM());
      return { curProv, curAcc, curHm, curUrl, vramGb, budgetGb };
    };
    const authenticateHostAndAccelerators = async ({ allAccelerators = false, chosenAccelerator = null } = {}) => {
      if (chosenAccelerator && acceleratorSelect) {
        acceleratorSelect.value = chosenAccelerator;
        syncHighMemoryAvailability();
      }
      const { curProv, curAcc, curHm, curUrl, vramGb } = applyImmediateLocalHostUpdate();
      const acctVal = inlineAccountInput ? inlineAccountInput.value.trim() : "";
      let customUrlToSave = curUrl;
      let googleAccountToSave = host.google_account || "";
      let kaggleUserToSave = host.kaggle_username || "";
      if (acctVal) {
        if (/^https?:\/\//i.test(acctVal)) {
          customUrlToSave = acctVal;
          if (urlInput) urlInput.value = acctVal;
        } else if (curProv === "kaggle") {
          kaggleUserToSave = acctVal;
        } else {
          googleAccountToSave = acctVal;
        }
      }
      detectionStatus.textContent = allAccelerators
        ? `🔑 Authenticating all ${curProv.toUpperCase()} accelerators on ${host.name}…`
        : `🔑 Authenticating ${curProv.toUpperCase()} · ${curAcc} (${vramGb}GB VRAM) on ${host.name}…`;
      try {
        const res = await postJSON(`/api/runtime-auth/${encodeURIComponent(host.id)}`, {
          provider: curProv,
          accelerator: curAcc,
          high_memory: curHm,
          custom_url: customUrlToSave,
          google_account: googleAccountToSave,
          kaggle_username: kaggleUserToSave,
          all_accelerators: allAccelerators,
        });
        if (res?.ok) {
          if (Array.isArray(res.authenticated_accelerators)) {
            host.authenticated_accelerators = res.authenticated_accelerators;
          }
          if (Array.isArray(res.hosts)) {
            STATE.runtime_hosts = res.hosts;
            STATE.colab_hosts = res.hosts;
            persistHostHardwareToLocalStorage(res.hosts);
          }
          await syncCrossSessionHardwareAndIntelligence({ forceHardware: true });
          if (typeof markHostStatusGreen === "function") {
            markHostStatusGreen(host.id, res);
          }
          refreshAccelAuthPillsUI();
          const authedList = (host.authenticated_accelerators || [curAcc]).join(", ");
          const msg = allAccelerators
            ? `🟢 Authenticated ${host.name} across all accelerators [${authedList}] (${vramGb}GB active VRAM)`
            : `🟢 Authenticated ${host.name}: ${curProv.toUpperCase()} · ${curAcc} (${vramGb}GB VRAM) verified & saved`;
          detectionStatus.textContent = msg;
          const banner = $("#lineup-auth-status-banner");
          if (banner) banner.textContent = msg;
          status(msg);
        } else {
          detectionStatus.textContent = `⚠️ Auth warning: ${res?.error || "could not verify"}`;
        }
      } catch (err) {
        detectionStatus.textContent = `⚠️ Auth error: ${err.message || err}`;
      }
    };
    function bindAccelAuthPills() {
      hardwarePanel.querySelectorAll("[data-auth-pick-accel]").forEach((pill) => {
        pill.onclick = async () => {
          const pickedAcc = pill.getAttribute("data-auth-pick-accel");
          if (!pickedAcc) return;
          await authenticateHostAndAccelerators({ allAccelerators: false, chosenAccelerator: pickedAcc });
        };
      });
    }
    bindAccelAuthPills();
    hardwarePanel.querySelector("[data-host-auth-accel]")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await authenticateHostAndAccelerators({ allAccelerators: false });
      } finally {
        btn.disabled = false;
      }
    });
    hardwarePanel.querySelector("[data-host-auth-all-accels]")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await authenticateHostAndAccelerators({ allAccelerators: true });
      } finally {
        btn.disabled = false;
      }
    });
    hardwarePanel.querySelector("[data-host-inline-auth-submit]")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await authenticateHostAndAccelerators({ allAccelerators: true });
      } finally {
        btn.disabled = false;
      }
    });
    const autoPersistHostHardware = async () => {
      const { curProv, curAcc, curHm, curUrl, vramGb } = applyImmediateLocalHostUpdate();
      detectionStatus.textContent = `💾 Saving ${curProv.toUpperCase()} · ${curAcc} (${vramGb}GB VRAM)…`;
      try {
        const result = await postJSON(`/api/runtime-hosts/${encodeURIComponent(host.id)}`, {
          provider: curProv,
          accelerator: curAcc,
          high_memory: curHm,
          custom_url: curUrl,
          local_url: curProv === "localhost" ? curUrl : host.local_url,
        }, "PUT");
        if (result?.ok && Array.isArray(result.hosts)) {
          STATE.runtime_hosts = result.hosts;
          STATE.colab_hosts = result.hosts;
          persistHostHardwareToLocalStorage(result.hosts);
          const updatedHost = result.hosts.find((x) => x.id === host.id);
          if (updatedHost) {
            host.provider = updatedHost.provider;
            host.accelerator = updatedHost.accelerator;
            host.high_memory = updatedHost.high_memory;
            host.custom_url = updatedHost.custom_url;
            host.local_url = updatedHost.local_url;
            host.gpu_vram_gb = updatedHost.gpu_vram_gb;
            host.model_budget_gb = updatedHost.model_budget_gb;
            host.name = updatedHost.name;
            const h2 = card.querySelector(".host-lineup-head h2");
            if (h2) h2.textContent = updatedHost.name;
            const tabBadge = document.querySelector(`[data-host-tab-badge="${host.id}"]`);
            if (tabBadge) tabBadge.textContent = updatedHost.accelerator;
            refreshAccelAuthPillsUI();
            recount();
          }
          detectionStatus.textContent = `✅ Saved for next sessions: ${curProv.toUpperCase()} · ${curAcc} (${host.gpu_vram_gb || vramGb}GB VRAM)${curHm ? " · High-RAM" : ""}${curUrl ? ` · ${curUrl}` : ""}`;
          status(`✅ ${host.name}: hardware accelerator (${curAcc}) saved for this & future sessions`);
        }
      } catch (_) {
        detectionStatus.textContent = `Saved locally: ${curProv.toUpperCase()} · ${curAcc} (${vramGb}GB VRAM)`;
      }
    };
    syncHighMemoryAvailability();
    acceleratorSelect.addEventListener("change", () => {
      syncHighMemoryAvailability();
      autoPersistHostHardware();
    });
    highMemoryInput.addEventListener("change", () => {
      autoPersistHostHardware();
    });
    urlInput?.addEventListener("change", () => {
      autoPersistHostHardware();
    });
    providerSelect?.addEventListener("change", () => {
      const p = providerSelect.value;
      const opts = getDefaultAcceleratorsForProvider(p);
      acceleratorSelect.innerHTML = opts.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("");
      acceleratorSelect.value = opts[0];
      if (urlInput && p === "localhost" && !urlInput.value.trim()) {
        urlInput.value = "http://127.0.0.1:8080/v1";
      }
      syncHighMemoryAvailability();
      autoPersistHostHardware();
    });
    hardwarePanel.querySelector("[data-host-max-gpu]").onclick = async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      try {
        window._activeLineupHostId = host.id;
        await autoPersistHostHardware();
        const host_configs = collectHostHardwareConfigsFromDOM();
        const res = await postJSON("/api/lineup/max-out", { host_id: host.id, host_configs });
        if (!res.ok) { status(res.error || "Could not max out GPU"); return; }
        STATE.host_lineups = res.allocations;
        STATE.lineup = res.lineup;
        if (Array.isArray(res.hosts)) {
          STATE.runtime_hosts = res.hosts;
          STATE.colab_hosts = res.hosts;
          persistHostHardwareToLocalStorage(res.hosts);
        }
        await reloadState();
        renderLineup();
        status(`🔥 Maxed out ${host.name} (${acceleratorSelect.value}): ${res.host_summary || "packed to VRAM capacity"}`);
      } finally {
        btn.disabled = false;
      }
    };
    hardwarePanel.querySelector("[data-host-detect]").onclick = async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = "Detecting…";
      try {
        const stats = await fetch("/api/stats", { cache: "no-store" }).then((response) => response.json());
        const detected = (stats.hosts || []).find((item) => item.host_id === host.id);
        if (!detected || !detected.tunnel_ok || !detected.gpu_name) {
          detectionStatus.textContent = `No active Colab tunnel detected for ${host.name || host.id}; start your Colab notebook cell first.`;
          return;
        }
        const token = String(detected.gpu_name).toLowerCase().replace(/[^a-z0-9]/g, "");
        const matched = acceleratorOptions.find((option) => {
          const candidate = option.toLowerCase().replace(/[^a-z0-9]/g, "");
          return token.includes(candidate) || candidate.includes(token);
        });
        if (matched) acceleratorSelect.value = matched;
        syncHighMemoryAvailability();
        await autoPersistHostHardware();
        const ram = Number(detected.system_ram_total_gb || 0);
        const ramLabel = ram ? `${ram.toFixed(1)} GB system RAM` : "live tunnel verified";
        detectionStatus.textContent = `Detected ${detected.gpu_name} · ${ramLabel}`;
      } catch (error) {
        detectionStatus.textContent = `Auto-detect failed: ${error.message || error}`;
      } finally {
        button.disabled = false;
        button.textContent = "🔎 Auto-detect GPU";
      }
    };
    hardwarePanel.querySelector("[data-host-hardware-save]").onclick = async (event) => {
      const button = event.currentTarget;
      const origLabel = button.textContent;
      button.disabled = true;
      button.textContent = "💾 Saving…";
      try {
        window._activeLineupHostId = host.id;
        const { curProv, curAcc, curHm, curUrl } = applyImmediateLocalHostUpdate();
        const allocations = window._hostLineupsFromDOM?.();
        if (allocations) STATE.host_lineups = allocations;
        if (window._lineupFromDOM) STATE.lineup = window._lineupFromDOM();
        const host_configs = collectHostHardwareConfigsFromDOM();
        persistHostHardwareToLocalStorage(host_configs);
        const result = await postJSON(`/api/runtime-hosts/${encodeURIComponent(host.id)}`, {
          provider: curProv,
          accelerator: curAcc,
          high_memory: curHm,
          custom_url: curUrl,
          local_url: curProv === "localhost" ? curUrl : host.local_url,
        }, "PUT");
        if (!result.ok) { status(result.error || "could not save host hardware"); return; }
        await postJSON("/api/lineup/publish", {
          lineup: STATE.lineup || {},
          allocations: allocations || STATE.host_lineups || {},
          host_configs,
        }).catch(() => {});
        await syncCrossSessionHardwareAndIntelligence({ forceHardware: true });
        STATE.runtime_hosts = result.hosts;
        STATE.colab_hosts = result.hosts;
        renderLineup();
        await renderColabHosts();
        status(`✅ ${host.name}: ${curProv.toUpperCase()} · ${curAcc}${curHm ? " · High-RAM" : ""}${curUrl ? ` (${curUrl})` : ""} saved for this & future sessions`);
      } catch (error) {
        status(`could not save host hardware: ${error.message || error}`);
      } finally {
        button.disabled = false;
        button.textContent = origLabel;
      }
    };
    hardwarePanel.querySelector("[data-start-host]").onclick = async (event) => {
      const button = event.currentTarget;
      if (!window._hostLineupsFromDOM || !window._lineupFromDOM) {
        status("Runtime lineup is still loading — wait a moment and try again.");
        return;
      }
      button.disabled = true;
      let accepted = false;
      try {
        await autoPersistHostHardware();
        let allocations = window._hostLineupsFromDOM();
        let lineup = window._lineupFromDOM();
        const hostModels = Object.values(allocations[host.id] || {}).flat()
          .filter((modelId) => !String(modelId).toLowerCase().includes("embed"));
        if (!hostModels.length) {
          status(`Auto-assigning starter models for ${host.name || host.id} before launch…`);
          const maxed = await postJSON("/api/lineup/max-out", { host_id: host.id }).catch(() => null);
          if (maxed?.ok && maxed.allocations) {
            allocations = maxed.allocations;
            lineup = maxed.lineup || lineup;
            STATE.host_lineups = allocations;
            STATE.lineup = lineup;
            renderLineup();
          }
        }
        const host_configs = collectHostHardwareConfigsFromDOM();
        status(`Publishing lineup & starting ${host.name || host.id} (${acceleratorSelect.value})…`);
        const published = await postJSON("/api/lineup/publish", {
          lineup, allocations,
        });
        if (!published.ok) {
          status(`lineup publish failed: ${published.error || "unknown error"}`);
          if (typeof handleHostConnectionFailure === "function") {
            handleHostConnectionFailure(host.id, published.error || "lineup publish failed");
          }
          return;
        }
        const result = await postJSON("/api/start", { host_ids: [host.id], host_configs });
        if (!result.ok) {
          status(result.error || `could not start ${host.name || host.id}`);
          if (typeof handleHostConnectionFailure === "function") {
            handleHostConnectionFailure(host.id, result.error || `could not start ${host.name || host.id}`);
          }
          return;
        }
        accepted = true;
        if (typeof markHostStatusGreen === "function") {
          markHostStatusGreen(host.id, result);
        }
        status(`${host.name || host.id} (${acceleratorSelect.value}) starting…`);
        await reloadState();
        renderLineup();
        await renderColabHosts();
        pollStartStatus();
      } catch (error) {
        status(`could not start ${host.name || host.id}: ${error.message || error}`);
        if (typeof handleHostConnectionFailure === "function") {
          handleHostConnectionFailure(host.id, error.message || String(error));
        }
      } finally {
        if (!accepted) button.disabled = false;
      }
    };
    card.appendChild(hardwarePanel);
    const customization = STATE.host_customizations?.[host.id] || {};
    const customPanel = document.createElement("details");
    customPanel.className = "host-customization";
    customPanel.innerHTML = `<summary>🎭 Customize how this host answers</summary>
      <div class="host-customization-grid">
        <label>Writing style
          <select class="select slim" data-host-style>
            <option value="default">Default</option><option value="concise">Concise</option>
            <option value="detailed">Detailed</option><option value="technical">Technical</option>
            <option value="teacher">Teacher / step-by-step</option><option value="formal">Formal</option>
            <option value="creative">Creative</option>
          </select>
        </label>
        <label>Persona — what this host should be like
          <textarea rows="2" maxlength="2000" data-host-persona placeholder="e.g. A pragmatic senior engineer who is candid about tradeoffs."></textarea>
        </label>
        <label>Extra instructions for this host
          <textarea rows="2" maxlength="4000" data-host-instructions placeholder="e.g. Include tests and call out assumptions."></textarea>
        </label>
        <label>Temperature <input type="number" class="input slim num" data-host-temperature min="0" max="2" step="0.05" placeholder="use global default"></label>
        <label>Top-p <input type="number" class="input slim num" data-host-top-p min="0.1" max="1" step="0.01" placeholder="use global default"></label>
        <label>Max tokens <input type="number" class="input slim num" data-host-max-tokens min="64" max="32768" step="64" placeholder="use global default"></label>
      </div>
      <div class="btn-row"><button type="button" class="primary sm" data-save-host-customization>💾 Save host customization</button><span class="muted">Applies only to models running on this host.</span></div>`;
    customPanel.querySelector("[data-host-style]").value = customization.style || "default";
    customPanel.querySelector("[data-host-persona]").value = customization.persona || "";
    customPanel.querySelector("[data-host-instructions]").value = customization.instructions || "";
    customPanel.querySelector("[data-host-temperature]").value = customization.temperature ?? "";
    customPanel.querySelector("[data-host-top-p]").value = customization.top_p ?? "";
    customPanel.querySelector("[data-host-max-tokens]").value = customization.max_tokens ?? "";
    customPanel.querySelector("[data-save-host-customization]").onclick = async (event) => {
      const button = event.currentTarget;
      const payload = {
        style: customPanel.querySelector("[data-host-style]").value,
        persona: customPanel.querySelector("[data-host-persona]").value,
        instructions: customPanel.querySelector("[data-host-instructions]").value,
      };
      for (const [field, selector] of [["temperature", "[data-host-temperature]"],
        ["top_p", "[data-host-top-p]"], ["max_tokens", "[data-host-max-tokens]"]]) {
        const value = customPanel.querySelector(selector).value;
        if (value !== "") payload[field] = Number(value);
      }
      button.disabled = true;
      try {
        const result = await postJSON(`/api/host-customizations/${encodeURIComponent(host.id)}`, payload, "PUT");
        if (!result.ok) { status(result.error || "could not save host customization"); return; }
        STATE.host_customizations ||= {};
        STATE.host_customizations[host.id] = result.customization;
        status(`response customization saved for ${host.name || host.id}`);
      } catch (error) {
        status(`could not save host customization: ${error.message || error}`);
      } finally {
        button.disabled = false;
      }
    };
    card.appendChild(customPanel);
    const hostSaved = savedByHost[host.id] || {};

    // ── On-Demand Category Subsection per Host (Do NOT list all empty slots straight away!) ──
    const SLOT_META = {
      fast:  { icon: "⚡", label: "Fast" },
      chat:  { icon: "💬", label: "Chat" },
      code:  { icon: "💻", label: "Code" },
      think: { icon: "🧠", label: "Think / Reasoning" },
      cyber: { icon: "🛡", label: "Cyber / Security" },
      sec:   { icon: "🛡", label: "Security" },
      unc:   { icon: "🔓", label: "Uncensored" },
      role:  { icon: "🎭", label: "Roleplay" },
      math:  { icon: "∑",  label: "Math" },
      trans: { icon: "🌐", label: "Translate" },
      agent: { icon: "🤖", label: "Agent" },
      ocr:   { icon: "👁", label: "Vision / OCR" },
      embed: { icon: "📐", label: "Embeddings" },
    };

    window._openedHostSlots ||= {};
    if (!window._openedHostSlots[host.id]) {
      // Only open slots that currently have an assigned model on this host (keep empty ones tucked in the + Add bar!)
      const initialOpen = new Set();
      STATE.slot_order.forEach((sl) => {
        if (Array.isArray(hostSaved[sl]) && hostSaved[sl].filter(Boolean).length > 0) {
          initialOpen.add(sl);
        }
      });
      window._openedHostSlots[host.id] = initialOpen;
    }
    const openedSet = window._openedHostSlots[host.id];

    const addSubsection = document.createElement("div");
    addSubsection.className = "host-add-slot-subsection";
    addSubsection.innerHTML = `
      <div class="host-add-slot-title">
        <span>➕ Add Model Category to ${esc(host.name || host.id)} <span class="muted" style="font-weight:400">(click a category to drop it down or add another model)</span></span>
        <button type="button" class="ghost xs" data-host-collapse-empty="1" title="Hide any empty model category sections on this host">▴ Hide Empty Categories</button>
      </div>
      <div class="host-add-slot-bar"></div>
    `;
    const addBar = addSubsection.querySelector(".host-add-slot-bar");
    const activeSlotsContainer = document.createElement("div");
    activeSlotsContainer.className = "host-active-slots-wrap";

    const mkSel = (slot, cid = "") => {
      const n = document.createElement("select");
      n.className = "select slim";
      n.appendChild(new Option(`— choose ${SLOT_META[slot]?.label || slot.toUpperCase()} model —`, ""));
      (STATE.slots[slot] || []).forEach((c) => {
        const m = STATE.catalog[c];
        if (!m) return;
        n.appendChild(new Option(`${m.name} (~${m.gb}GB)${m.unc ? " ·unc" : ""}${m.gated ? " ·gated" : ""}`, c));
      });
      if (cid) n.value = cid;
      n.dataset.previousValue = n.value;
      n.onchange = () => {
        const current = hostLineupsFromDOM()[host.id] || {};
        const currentTotal = [...new Set(Object.values(current).flat())]
          .reduce((sum, id) => sum + (STATE.catalog[id]?.gb || 0), 0);
        const budget = Number(host.model_budget_gb || 0);
        if (budget && currentTotal > budget) {
          n.value = n.dataset.previousValue || "";
          status(`${host.name || host.id} limit is ~${budget.toFixed(1)}GB; that model would exceed capacity`);
        } else {
          n.dataset.previousValue = n.value;
        }
        recount();
      };
      return n;
    };

    const ensureSlotDroppedDown = (slot, initialModels = [], addExtraBlank = false) => {
      openedSet.add(slot);
      const meta = SLOT_META[slot] || { icon: "➕", label: slot.toUpperCase() };
      let div = activeSlotsContainer.querySelector(`.slot[data-slot-key="${slot}"]`);
      if (!div) {
        div = document.createElement("div");
        div.className = "slot slot-card-dropped";
        div.dataset.slotKey = slot;
        div.innerHTML = `
          <div class="slot-head-row">
            <h3>${meta.icon} ${esc(meta.label.toUpperCase())} MODELS (${esc(slot.toUpperCase())})</h3>
            <div class="btn-row" style="margin:0;gap:6px">
              <button type="button" class="ghost xs" data-slot-add-more="${esc(slot)}">＋ Add Another ${esc(meta.label)} Model</button>
              <button type="button" class="ghost xs" data-slot-remove="${esc(slot)}" title="Remove / collapse this category from ${esc(host.name || host.id)}">✕ Close</button>
            </div>
          </div>
          <div class="row slot-selects-row"></div>
        `;
        const row = div.querySelector(".slot-selects-row");
        const toLoad = (initialModels || []).filter(Boolean).slice(0, 6);
        if (toLoad.length > 0) {
          toLoad.forEach((cid) => row.appendChild(mkSel(slot, cid)));
        } else {
          row.appendChild(mkSel(slot, ""));
        }
        div.querySelector(`[data-slot-add-more="${slot}"]`).onclick = () => {
          if (row.querySelectorAll("select").length >= 6) {
            status(`${meta.label} already has 6 models (max per category)`);
            return;
          }
          const sel = mkSel(slot, "");
          row.appendChild(sel);
          sel.focus();
          recount();
        };
        div.querySelector(`[data-slot-remove="${slot}"]`).onclick = () => {
          openedSet.delete(slot);
          div.remove();
          syncAddButtonsState();
          recount();
        };
        activeSlotsContainer.appendChild(div);
      } else if (addExtraBlank) {
        const row = div.querySelector(".slot-selects-row");
        if (row.querySelectorAll("select").length < 6) {
          const sel = mkSel(slot, "");
          row.appendChild(sel);
          sel.focus();
        } else {
          status(`${meta.label} already has 6 models (max per category)`);
        }
      }
      syncAddButtonsState();
    };

    const syncAddButtonsState = () => {
      addBar.querySelectorAll("[data-add-slot-btn]").forEach((btn) => {
        const sl = btn.dataset.addSlotBtn;
        const isOpen = openedSet.has(sl);
        const meta = SLOT_META[sl] || { icon: "➕", label: sl.toUpperCase() };
        btn.classList.toggle("opened", isOpen);
        btn.textContent = isOpen ? `${meta.icon} + Another ${meta.label}` : `＋ ${meta.icon} Add ${meta.label}`;
      });
    };

    STATE.slot_order.forEach((slot) => {
      const meta = SLOT_META[slot] || { icon: "➕", label: slot.toUpperCase() };
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "host-add-slot-btn";
      btn.dataset.addSlotBtn = slot;
      btn.title = `Click to drop down ${meta.label} models on ${host.name || host.id} (or add another ${meta.label} model)`;
      btn.onclick = () => {
        const alreadyOpen = openedSet.has(slot);
        ensureSlotDroppedDown(slot, [], alreadyOpen);
        recount();
      };
      addBar.appendChild(btn);

      if (openedSet.has(slot)) {
        ensureSlotDroppedDown(slot, hostSaved[slot] || [], false);
      }
    });

    addSubsection.querySelector("[data-host-collapse-empty]")?.addEventListener("click", () => {
      activeSlotsContainer.querySelectorAll(".slot[data-slot-key]").forEach((div) => {
        const sl = div.dataset.slotKey;
        const chosen = [...div.querySelectorAll("select")].map((s) => s.value).filter(Boolean);
        if (chosen.length === 0) {
          openedSet.delete(sl);
          div.remove();
        }
      });
      syncAddButtonsState();
      recount();
    });

    syncAddButtonsState();
    card.appendChild(addSubsection);
    card.appendChild(activeSlotsContainer);
    wrap.appendChild(card);
  });
  function hostLineupsFromDOM() {
    const allocations = {};
    wrap.querySelectorAll("[data-host-lineup]").forEach((card) => {
      const lineup = {};
      STATE.slot_order.forEach((slot) => {
        const div = card.querySelector(`.slot[data-slot-key="${slot}"]`);
        lineup[slot] = div ? [...div.querySelectorAll("select")].map((s) => s.value).filter(Boolean) : [];
      });
      allocations[card.dataset.hostLineup] = lineup;
    });
    return allocations;
  }
  function lineupFromDOM() {
    const combined = {};
    Object.values(hostLineupsFromDOM()).forEach((lineup) => {
      STATE.slot_order.forEach((slot) => {
        const target = combined[slot] ||= [];
        (lineup[slot] || []).forEach((cid) => { if (!target.includes(cid)) target.push(cid); });
      });
    });
    return combined;
  }
  function recount() {
    const allocations = hostLineupsFromDOM();
    let total = 0;
    wrap.querySelectorAll("[data-host-lineup]").forEach((card) => {
      const models = [...new Set(Object.values(allocations[card.dataset.hostLineup] || {}).flat())];
      const hostTotal = models.reduce((sum, cid) => sum + (STATE.catalog[cid]?.gb || 0), 0);
      total += hostTotal;
      const host = hosts.find((item) => item.id === card.dataset.hostLineup);
      const budget = Number(host?.model_budget_gb || 0);
      const vram = Number(host?.gpu_vram_gb || 0);
      const overBudget = budget && hostTotal > budget;
      card.querySelector("[data-host-total]").textContent = `${models.length} unique model(s) · ~${hostTotal}GB weights / ${budget ? budget.toFixed(1) + "GB usable" : "budget unknown"} of ${vram ? vram + "GB GPU VRAM" : "VRAM unknown"}`;
      card.querySelector("[data-host-total]").classList.toggle("capacity-error", Boolean(overBudget));
      card.classList.toggle("capacity-over", Boolean(overBudget));
    });
    $("#lineup-total").textContent = `assigned total ≈ ${total}GB across ${hosts.length} host(s)`;
    STATE.host_lineups = allocations;
    STATE.lineup = lineupFromDOM();
    window._lineup = STATE.lineup;
    window._lineupFromDOM = lineupFromDOM;
    window._hostLineupsFromDOM = hostLineupsFromDOM;
  }
  recount();
}
$("#preset-apply").onclick = async () => {
  const p = STATE.presets[$("#preset").value];
  if (!p) return;
  const host_configs = collectHostHardwareConfigsFromDOM();
  persistHostHardwareToLocalStorage(host_configs);
  STATE.lineup = p.lineup;
  const bal = await postJSON("/api/lineup/balance", { lineup: p.lineup, host_configs }).catch(() => null);
  if (bal && bal.ok && bal.allocations) {
    STATE.host_lineups = bal.allocations;
    if (Array.isArray(bal.hosts)) {
      STATE.runtime_hosts = bal.hosts;
      STATE.colab_hosts = bal.hosts;
    }
  } else {
    status(bal?.error || "could not fit that preset within the enabled host GPU budgets");
    return;
  }
  renderLineup();
  status(`preset "${$("#preset").value}" balanced across enabled hosts: ${p.blurb}`);
};
$("#lineup-max-all")?.addEventListener("click", async () => {
  const host_configs = collectHostHardwareConfigsFromDOM();
  persistHostHardwareToLocalStorage(host_configs);
  const res = await postJSON("/api/lineup/max-out", { host_configs });
  if (!res.ok) { status(res.error || "Could not max out hosts"); return; }
  STATE.host_lineups = res.allocations;
  STATE.lineup = res.lineup;
  if (Array.isArray(res.hosts)) {
    STATE.runtime_hosts = res.hosts;
    STATE.colab_hosts = res.hosts;
    persistHostHardwareToLocalStorage(res.hosts);
  }
  await reloadState();
  renderLineup();
  status(`🔥 Maxed out all hosts (~${res.total}GB across ${(res.summary || []).length} GPUs)`);
});
$("#lineup-balance")?.addEventListener("click", async () => {
  const lineup = window._lineupFromDOM ? window._lineupFromDOM() : STATE.lineup;
  const host_configs = collectHostHardwareConfigsFromDOM();
  persistHostHardwareToLocalStorage(host_configs);
  const res = await postJSON("/api/lineup/balance", { lineup, host_configs }).catch((e) => ({ ok: false, error: String(e) }));
  if (!res.ok) { status(res.error || "could not balance lineup"); return; }
  STATE.host_lineups = res.allocations;
  STATE.lineup = res.lineup;
  if (Array.isArray(res.hosts)) {
    STATE.runtime_hosts = res.hosts;
    STATE.colab_hosts = res.hosts;
    persistHostHardwareToLocalStorage(res.hosts);
  }
  renderLineup();
  const summary = (res.summary || []).map((h) => `${h.name}: ${h.count} model(s) (~${h.gb}GB)`).join(" · ");
  status(`⚖️ balanced across hosts — ${summary}`);
});

// ── stats / activity ──
async function pollStats() {
  const s = await (await fetch("/api/stats")).json();
  const stats = $("#gpu-stats");
  if (stats) stats.textContent = s.text;
}
function renderActivity(lines) {
  const safeLines = Array.isArray(lines) ? lines : [];
  const raw = safeLines.join("\n");
  const activity = $("#activity");
  const tinyPreview = $("#console-tiny-preview");
  if (tinyPreview && safeLines.length) {
    tinyPreview.textContent = safeLines[safeLines.length - 1] || "Ready";
  }
  if (!activity) return;
  bindActivityScrollControls();
  if (activity._raw === raw) return;

  const prevLines = activity._renderedLines || [];
  activity._raw = raw;
  activity._renderedLines = [...safeLines];

  // Check if safeLines is an append-only extension of prevLines
  const isPrefixMatch =
    prevLines.length > 0 &&
    safeLines.length >= prevLines.length &&
    prevLines.every((l, idx) => l === safeLines[idx]);

  if (!isPrefixMatch) {
    clearTerminalContainer(activity);
    const instantCount = Math.max(0, safeLines.length - 3);
    safeLines.forEach((line, idx) => {
      appendTypedTerminalBlock(activity, line, {
        color: "#c9d6f5",
        marginBottom: "2px",
        instant: idx < instantCount,
      });
    });
  } else {
    const newLines = safeLines.slice(prevLines.length);
    newLines.forEach((line) => {
      appendTypedTerminalBlock(activity, line, {
        color: "#c9d6f5",
        marginBottom: "2px",
      });
    });
  }
  applyConsoleLogFilter();
}

// ── Live Console Search & Filter (Active Console + Live Activity Stream) ──
let CONSOLE_FILTER_QUERY = "";
let CONSOLE_FILTER_CHIP = "";

function doesLogLineMatchFilter(rawLowerText) {
  const text = String(rawLowerText || "").toLowerCase();
  if (CONSOLE_FILTER_CHIP) {
    const chipPattern = CONSOLE_FILTER_CHIP.toLowerCase();
    if (chipPattern.includes("|")) {
      const parts = chipPattern.split("|").map((s) => s.trim()).filter(Boolean);
      if (!parts.some((p) => text.includes(p))) return false;
    } else if (!text.includes(chipPattern)) {
      return false;
    }
  }
  if (CONSOLE_FILTER_QUERY) {
    const tokens = CONSOLE_FILTER_QUERY.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.every((tok) => text.includes(tok))) return false;
  }
  return true;
}

function applyFilterToTerminalElement(el) {
  if (!el) return true;
  const raw = el.dataset?.fullLogText ?? String(el.textContent || "").toLowerCase();
  const matched = doesLogLineMatchFilter(raw);
  el.classList.toggle("term-line-filtered-out", !matched);
  return matched;
}

function applyConsoleLogFilter() {
  const containers = [
    $("#activity"),
    $("#guardian-out"),
    $("#cli-out"),
    $("#cli-out-a"),
    $("#cli-out-b"),
    $("#cli-out-c"),
  ].filter(Boolean);

  const isFiltering = Boolean(CONSOLE_FILTER_QUERY.trim() || CONSOLE_FILTER_CHIP.trim());
  let totalVisible = 0;
  let totalLines = 0;

  // Determine which container(s) are currently visible in the active console dock tab
  const activeTabBtn = document.querySelector("#console-dock-tabs .console-dock-tab.active");
  const activeTab = activeTabBtn?.dataset?.dockTab || "brain-council";
  const primaryContainers =
    activeTab === "activity"
      ? [$("#activity")]
      : activeTab === "colab-cli"
      ? [$("#cli-out"), $("#cli-out-a"), $("#cli-out-b"), $("#cli-out-c")]
      : [$("#guardian-out"), $("#activity")];

  containers.forEach((container) => {
    const lines = [...container.children].filter(
      (child) => child.tagName === "DIV" && !child.classList.contains("term-empty-filter-msg")
    );
    let containerVisible = 0;
    lines.forEach((lineEl) => {
      if (!lineEl.dataset.fullLogText) {
        lineEl.dataset.fullLogText = String(lineEl.textContent || "").toLowerCase();
      }
      const ok = applyFilterToTerminalElement(lineEl);
      if (ok) containerVisible++;
    });
    if (primaryContainers.includes(container)) {
      totalLines += lines.length;
      totalVisible += containerVisible;
    }
    let emptyMsg = container.querySelector(".term-empty-filter-msg");
    if (isFiltering && lines.length > 0 && containerVisible === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement("div");
        emptyMsg.className = "term-empty-filter-msg muted";
        emptyMsg.style.cssText = "padding:8px 4px;font-style:italic;color:#8b9bb4;";
        container.appendChild(emptyMsg);
      }
      const label = [CONSOLE_FILTER_CHIP, CONSOLE_FILTER_QUERY].filter(Boolean).join(" + ");
      emptyMsg.textContent = `No console logs match filter "${label}".`;
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  });

  const headerCount = $("#console-header-filter-count");
  const activityCount = $("#activity-filter-count");
  const headerClear = $("#console-header-filter-clear");
  const activityClear = $("#activity-filter-clear");

  const countLabel = isFiltering ? `${totalVisible}/${totalLines}` : "";
  if (headerCount) headerCount.textContent = countLabel;
  if (activityCount) activityCount.textContent = countLabel;
  if (headerClear) headerClear.style.display = isFiltering ? "inline-flex" : "none";
  if (activityClear) activityClear.style.display = isFiltering ? "inline-flex" : "none";
}

function bindConsoleLogFilterControls() {
  const headerInput = $("#console-header-search-input");
  const activityInput = $("#activity-search-input");
  const headerClear = $("#console-header-filter-clear");
  const activityClear = $("#activity-filter-clear");
  const chipWrap = $("#activity-filter-chips");

  const syncQuery = (val) => {
    CONSOLE_FILTER_QUERY = String(val || "").trim();
    if (headerInput && headerInput.value !== val) headerInput.value = val;
    if (activityInput && activityInput.value !== val) activityInput.value = val;
    applyConsoleLogFilter();
  };

  if (headerInput && !headerInput._boundFilter) {
    headerInput._boundFilter = true;
    headerInput.addEventListener("input", (e) => syncQuery(e.target.value));
    headerInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        syncQuery("");
        headerInput.blur();
      }
    });
  }

  if (activityInput && !activityInput._boundFilter) {
    activityInput._boundFilter = true;
    activityInput.addEventListener("input", (e) => syncQuery(e.target.value));
    activityInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        syncQuery("");
        activityInput.blur();
      }
    });
  }

  const clearAllFilters = () => {
    CONSOLE_FILTER_QUERY = "";
    CONSOLE_FILTER_CHIP = "";
    if (headerInput) headerInput.value = "";
    if (activityInput) activityInput.value = "";
    if (chipWrap) {
      chipWrap.querySelectorAll("[data-log-filter]").forEach((btn) => {
        btn.classList.toggle("on", (btn.dataset.logFilter || "") === "");
      });
    }
    applyConsoleLogFilter();
  };

  if (headerClear && !headerClear._boundFilter) {
    headerClear._boundFilter = true;
    headerClear.addEventListener("click", clearAllFilters);
  }
  if (activityClear && !activityClear._boundFilter) {
    activityClear._boundFilter = true;
    activityClear.addEventListener("click", clearAllFilters);
  }

  if (chipWrap && !chipWrap._boundFilter) {
    chipWrap._boundFilter = true;
    chipWrap.querySelectorAll("[data-log-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        CONSOLE_FILTER_CHIP = btn.dataset.logFilter || "";
        chipWrap.querySelectorAll("[data-log-filter]").forEach((b) => b.classList.toggle("on", b === btn));
        applyConsoleLogFilter();
      });
    });
  }
}

function bindActivityScrollControls() {
  const activity = $("#activity");
  bindConsoleLogFilterControls();
  if (!activity || activity._scrollPauseBound) return;
  const setPaused = (paused) => {
    activity._scrollPaused = paused;
    activity.dataset.scrollPaused = String(paused);
  };
  activity.addEventListener("mouseenter", () => setPaused(true));
  activity.addEventListener("mouseleave", () => setPaused(false));
  activity.addEventListener("focusin", () => setPaused(true));
  activity.addEventListener("focusout", () => setPaused(false));
  activity._scrollPauseBound = true;
  setPaused(false);
}

bindActivityScrollControls();

async function runColabTroubleshooting(button) {
  const label = button.textContent;
  button.disabled = true;
  button.textContent = "🩺 Checking…";
  try {
    const report = await fetch("/api/troubleshoot/colab", { cache: "no-store" }).then(r => r.json());
    const state = await fetch("/api/state", { cache: "no-store" }).then(r => r.json());
    renderActivity(state.log || []);
    const errors = (report.checks || []).filter(c => c.severity !== "ok");
    const cliOut = $("#guardian-out") || $("#cli-out");
    if (cliOut) {
      const troubleText =
        "Runtime troubleshooting:\n" +
        (report.checks || []).map(c => `${c.severity.toUpperCase()}: ${c.message}`).join("\n");
      appendTypedTerminalBlock(cliOut, troubleText, { color: errors.length ? "#ffcc66" : "#2ee6a6" });
    }
    status(errors.length ? `Troubleshooting found ${errors.length} item(s); see Unified CLI for fixes.`
                         : "Runtime checks passed; see Unified CLI for host details.");
  } catch (error) {
    status("Troubleshooting failed: " + error);
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}
$("#troubleshoot-btn")?.addEventListener("click", (event) => runColabTroubleshooting(event.currentTarget));
$("#cli-troubleshoot-btn")?.addEventListener("click", (event) => runColabTroubleshooting(event.currentTarget));

async function renderColabHosts() {
  let res;
  try {
    const response = await fetch("/api/runtime-hosts", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    res = await response.json();
  } catch (error) {
    const message = `Could not load runtime hosts: ${error.message || error}`;
    const manager = $("#colab-host-manager");
    const cliHosts = $("#colab-cli-hosts");
    if (manager) manager.textContent = message;
    if (cliHosts) cliHosts.textContent = message;
    return;
  }
  const hosts = res.hosts || [];
  const supportsHostCredentials = Number(res.schema_version) >= 2;

  const manager = $("#colab-host-manager");
  if (manager) {
    manager.innerHTML = "";
    if (!supportsHostCredentials) {
      const notice = document.createElement("div");
      notice.className = "muted";
      notice.textContent = "Host-specific provider keys are temporarily disabled until Council is safely restarted; the current startup is left undisturbed.";
      manager.appendChild(notice);
    }
    hosts.forEach((host) => {
      const card = document.createElement("div");
      card.className = "card host-settings-card";
      const credentialDisabled = supportsHostCredentials ? "" : "disabled title=\"Restart Council to enable host-specific credentials\"";
      const hProv = ["colab", "kaggle", "localhost", "custom"].includes(String(host.provider || "").toLowerCase())
        ? String(host.provider).toLowerCase()
        : "colab";
      const accOpts = getDefaultAcceleratorsForProvider(hProv);
      card.innerHTML = `<div class="tune-grid">
        <label>Name <input class="input" data-host-field="name" value="${esc(host.name || '')}"></label>
        <label>Provider
          <select class="select" data-host-field="provider">
            <option value="colab" ${hProv === 'colab' ? 'selected' : ''}>Google Colab</option>
            <option value="kaggle" ${hProv === 'kaggle' ? 'selected' : ''}>Kaggle</option>
            <option value="localhost" ${hProv === 'localhost' ? 'selected' : ''}>Localhost (PC / Local GPU / RAM)</option>
            <option value="custom" ${hProv === 'custom' ? 'selected' : ''}>Custom Host (URL / Server)</option>
          </select>
        </label>
        <label>GPU accelerator <select class="select" data-host-field="accelerator">${accOpts.map((opt) => `<option value="${esc(opt)}" ${(host.accelerator || accOpts[0]) === opt ? "selected" : ""}>${esc(opt)}</option>`).join("")}</select></label>
        <label>Runtime timeout (seconds) <input type="number" class="input" data-host-field="runtime_timeout" value="${Number(host.runtime_timeout) || 21600}" min="600" max="43200"></label>
        <label>Custom / Localhost URL <input class="input" data-host-field="custom_url" placeholder="http://127.0.0.1:8080/v1 or https://custom-host/v1" value="${esc(host.custom_url || host.local_url || '')}"></label>
        <label>Google account <input class="input" data-host-field="google_account" placeholder="account@example.com" value="${esc(host.google_account || '')}"></label>
        <label>Guest username <input class="input" data-host-field="guest_username" placeholder="Optional guest/profile name" value="${esc(host.guest_username || '')}" ${credentialDisabled}></label>
        <label>GitHub username <input class="input" data-host-field="gh_username" placeholder="Optional account username" value="${esc(host.gh_username || '')}" ${credentialDisabled}></label>
        <label>Kaggle username <input class="input" data-host-field="kaggle_username" placeholder="Kaggle account username" value="${esc(host.kaggle_username || '')}" autocomplete="off"></label>
        <label>Kaggle kernel slug <input class="input" data-host-field="kaggle_kernel_slug" placeholder="auto from host ID" value="${esc(host.kaggle_kernel_slug || '')}"></label>
        <label class="toggle"><input type="checkbox" data-host-field="enabled" ${host.enabled ? 'checked' : ''}> Enabled for lineup</label>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <label class="toggle" title="When enabled, if an auth or connection attempt fails, automatically retry the handshake with exponential backoff until the host status turns green"><input type="checkbox" data-host-field="auto_reconnect" data-host-autoreconnect="${esc(host.id)}" ${isHostAutoReconnectEnabled(host.id, host.auto_reconnect !== false) ? 'checked' : ''}> 🔄 Persistent Auto-Reconnect</label>
          <button type="button" class="ghost xs force-reconnect-btn" data-force-reconnect-host="${esc(host.id)}" title="Manually trigger an immediate fresh handshake for this host without waiting for the exponential backoff interval">⚡ Force Reconnect</button>
        </div>
      </div><div class="btn-row"><button class="primary sm" data-host-save="${esc(host.id)}">💾 Save</button><button class="ghost sm" data-host-auth="${esc(host.id)}">${hProv === 'kaggle' ? '🔑 Verify Kaggle API' : hProv === 'localhost' ? '💻 Verify Localhost' : hProv === 'custom' ? '🔌 Verify Custom Host' : '🔑 Authenticate CLI'}</button><button class="ghost sm" data-host-delete="${esc(host.id)}">🗑 Remove</button><span class="muted" data-host-status-text="${esc(host.id)}">${getHostStatusDotEmoji(host.id)} ${esc(hProv)} · ${esc(host.id.toUpperCase())}</span></div>`;
      manager.appendChild(card);
      const providerSelect = card.querySelector('[data-host-field="provider"]');
      const acceleratorInput = card.querySelector('[data-host-field="accelerator"]');
      const autoRecCheckbox = card.querySelector(`[data-host-autoreconnect="${host.id}"]`);
      if (autoRecCheckbox) {
        autoRecCheckbox.addEventListener("change", () => {
          setHostAutoReconnect(host.id, autoRecCheckbox.checked);
        });
      }
      card.querySelector(`[data-force-reconnect-host="${host.id}"]`)?.addEventListener("click", () => {
        forceReconnectHost(host.id);
      });
      providerSelect.onchange = () => {
        const opts = getDefaultAcceleratorsForProvider(providerSelect.value);
        acceleratorInput.innerHTML = opts.map((opt) => `<option value="${esc(opt)}">${esc(opt)}</option>`).join("");
        acceleratorInput.value = opts[0];
      };
      card.querySelector(`[data-host-save="${host.id}"]`).onclick = async () => {
        const body = {};
        card.querySelectorAll("[data-host-field]").forEach(input => {
          const field = input.dataset.hostField;
          body[field] = input.type === "checkbox" ? input.checked : input.value;
          if (input.type === "password" && !input.value) delete body[field];
        });
        if ("auto_reconnect" in body) {
          setHostAutoReconnect(host.id, Boolean(body.auto_reconnect), { persist: false });
        }
        const out = await postJSON(`/api/runtime-hosts/${encodeURIComponent(host.id)}`, body, "PUT");
        if (out.ok) {
          if (Array.isArray(out.hosts)) {
            persistHostHardwareToLocalStorage(out.hosts);
          }
          await renderColabHosts();
          await reloadState();
          renderLineup();
        }
        status(out.ok ? `✅ ${out.host?.name || host.name} hardware & settings saved for next sessions` : (out.error || "save failed"));
      };
      card.querySelector(`[data-host-auth="${host.id}"]`).onclick = async () => {
        try {
          const out = await postJSON(`/api/runtime-auth/${encodeURIComponent(host.id)}`, {});
          if (out.ok) {
            markHostStatusGreen(host.id, out);
            status(`${host.name} (${hProv.toUpperCase()}) verified — status GREEN`);
          } else {
            status(out.error || "verification failed");
            handleHostConnectionFailure(host.id, out.error || "auth verification failed");
          }
        } catch (err) {
          status(`verification failed: ${err.message || err}`);
          handleHostConnectionFailure(host.id, err.message || String(err));
        }
      };
      card.querySelector(`[data-host-delete="${host.id}"]`).onclick = async () => {
        await fetch(`/api/runtime-hosts/${encodeURIComponent(host.id)}`, { method: "DELETE" });
        await renderColabHosts();
        await reloadState();
        renderLineup();
        status(`${host.name} removed`);
      };
    });
  }

  // Sync each host's auto-reconnect state from backend response
  hosts.forEach((h) => {
    ensureHostAutoReconnectEntry(h.id, h.auto_reconnect !== false, h.status_online !== false);
  });

  // Also sync the #cli-target-host dropdown so every configured host appears in the Multi-Host CLI!
  const cliTargetSel = $("#cli-target-host");
  if (cliTargetSel) {
    const prevTarget = cliTargetSel.value || "all";
    cliTargetSel.innerHTML = `<option value="all">🌐 All Hosts (Colab + Kaggle + Localhost + Custom)</option>`;
    hosts.forEach((h) => {
      const p = String(h.provider || "colab").toLowerCase();
      const dot = getHostStatusDotEmoji(h.id);
      const arTag = isHostAutoReconnectEnabled(h.id) ? " · 🔄 Auto-Reconnect" : "";
      cliTargetSel.appendChild(new Option(`${dot} ${h.name} (${p.toUpperCase()}${arTag})`, h.id));
    });
    ["kaggle", "localhost", "custom"].forEach((extraId) => {
      ensureHostAutoReconnectEntry(extraId, true, true);
    });
    cliTargetSel.appendChild(new Option(`${getHostStatusDotEmoji("kaggle")} 🦆 Kaggle Kernel Runtime`, "kaggle"));
    cliTargetSel.appendChild(new Option(`${getHostStatusDotEmoji("localhost")} 💻 Localhost PC Runtime`, "localhost"));
    cliTargetSel.appendChild(new Option(`${getHostStatusDotEmoji("custom")} 🔌 Custom Host Runtime`, "custom"));
    if ([...cliTargetSel.options].some((o) => o.value === prevTarget)) {
      cliTargetSel.value = prevTarget;
    }
  }
  syncTargetHostAutoReconnectUI(hosts);

  const cliHosts = $("#colab-cli-hosts");
  if (cliHosts) {
    cliHosts.innerHTML = "";
    if (!hosts.length) {
      cliHosts.textContent = "No runtime hosts configured. Add hosts under Settings → Runtime hosts.";
      return;
    }
    hosts.forEach((host) => {
      const card = document.createElement("div");
      card.className = "card colab-cli-card";
      const outId = `cli-out-${host.id}`;
      const prov = String(host.provider || "colab").toLowerCase();
      const isKaggle = prov === "kaggle";
      const arEnabled = isHostAutoReconnectEnabled(host.id, host.auto_reconnect !== false);
      const dotEmoji = getHostStatusDotEmoji(host.id);
      card.innerHTML = `<div class="console-head" style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap"><span><span data-host-dot="${esc(host.id)}">${dotEmoji}</span> ${esc(host.name)} · ${esc(prov.toUpperCase())} · ${esc(host.id.toUpperCase())}</span><span class="row" style="gap:6px"><label class="toggle" style="font-size:11px;letter-spacing:0;text-transform:none" title="Automatically retry handshake with exponential backoff if auth or connection fails until host status turns green"><input type="checkbox" data-host-autoreconnect="${esc(host.id)}" ${arEnabled ? "checked" : ""}> 🔄 Persistent Auto-Reconnect <span class="autoreconnect-backoff-badge" data-host-backoff-badge="${esc(host.id)}">${getHostBackoffBadgeText(host.id)}</span></label><button type="button" class="ghost xs force-reconnect-btn" data-force-reconnect-host="${esc(host.id)}" title="Manually trigger a fresh handshake for ${esc(host.name)} without waiting for exponential backoff">⚡ Force Reconnect</button></span></div><div class="row"><button class="ghost sm" data-sessions-host="${esc(host.id)}">${isKaggle ? '📋 Kernel status' : '📋 Sessions'}</button><button class="ghost sm" data-handshake-host="${esc(host.id)}" title="Verify or reconnect handshake on this host">🔌 Handshake</button><button class="ghost sm" data-stop-host="${esc(host.id)}">${isKaggle ? '🛑 Stop / Manage Kernel' : '🛑 Stop host'}</button></div><div class="row"><input id="cli-cmd-${esc(host.id)}" class="input slim" placeholder="Type command (press Tab for predictions, Enter to run)…"><button id="cli-run-${esc(host.id)}" class="primary sm">▶ Run</button></div><pre id="${outId}" class="console-body" style="height:200px"></pre>`;
      cliHosts.appendChild(card);
      const cardAutoRec = card.querySelector(`[data-host-autoreconnect="${host.id}"]`);
      if (cardAutoRec) {
        cardAutoRec.addEventListener("change", () => {
          setHostAutoReconnect(host.id, cardAutoRec.checked);
        });
      }
      card.querySelector(`[data-force-reconnect-host="${host.id}"]`)?.addEventListener("click", () => {
        forceReconnectHost(host.id);
      });
      const handshakeBtn = card.querySelector(`[data-handshake-host="${host.id}"]`);
      if (handshakeBtn) {
        handshakeBtn.onclick = () => authenticateColabHost(host.id, host.name || `Host ${host.id.toUpperCase()}`);
      }
      card.querySelector(`[data-sessions-host="${host.id}"]`).onclick = async () => {
        const out = card.querySelector(`#${outId}`);
        try {
          const res = await fetch(`/api/cli/sessions/${encodeURIComponent(host.id)}`, { cache: "no-store" }).then(r => r.json());
          if (!res.ok) {
            appendTypedTerminalBlock(out, `${host.name} session check failed: ${res.error || "unknown CLI error"}`, { color: "#ff6b8b" });
            handleHostConnectionFailure(host.id, res.error || "session check failed");
            return;
          }
          markHostStatusGreen(host.id, res);
          const details = res.details || [];
          const msg = details.length
            ? `${host.name} active sessions:\n${details.map(s =>
              `• ${s.name} — ${s.hardware || "hardware unknown"} · ${s.tracked ? "tracked / runnable" : "remote only / not tracked by this CLI profile"}`
            ).join("\n")}`
            : `${res.message || `${host.name}: authenticated; no active sessions.`}`;
          appendTypedTerminalBlock(out, msg, { color: "#2ee6a6" });
        } catch (error) {
          appendTypedTerminalBlock(out, `${host.name} session check failed: ${error}`, { color: "#ff6b8b" });
          handleHostConnectionFailure(host.id, error.message || String(error));
        }
      };
      card.querySelector(`[data-stop-host="${host.id}"]`).onclick = async () => {
        const out = card.querySelector(`#${outId}`);
        try {
          const res = await postJSON("/api/cli/stop-host", { host: host.id });
          appendTypedTerminalBlock(
            out,
            res.ok
              ? `Confirmed stopped ${res.count} session(s) on ${host.name}: ${(res.stopped || []).join(", ") || "none running"}`
              : `Stop not confirmed: ${(res.errors || [res.error]).join("; ")}`,
            { color: res.ok ? "#2ee6a6" : "#ffcc66" }
          );
        } catch (error) {
          appendTypedTerminalBlock(out, `Stop failed: ${error}`, { color: "#ff6b8b" });
        }
      };
      const hostInput = card.querySelector(`#cli-cmd-${host.id}`);
      const hostRunBtn = card.querySelector(`#cli-run-${host.id}`);
      if (hostInput) {
        if (typeof attachInputAutocomplete === "function") {
          attachInputAutocomplete(hostInput, { scope: "colab" });
        }
        hostInput.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" && !ev.defaultPrevented) {
            ev.preventDefault();
            hostRunBtn?.click();
          }
        });
      }
      hostRunBtn.onclick = async () => {
        const input = card.querySelector(`#cli-cmd-${host.id}`);
        const cmd = input.value.trim(); if (!cmd) return;
        input.value = "";
        const out = card.querySelector(`#${outId}`);
        appendTypedTerminalBlock(out, `${host.name} [${prov.toUpperCase()}]> ${cmd}`, { color: "#00d4ff", instant: true });
        try {
          const r = await fetch("/api/cli/stream", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({cmd, host:host.id, timeout:600}) });
          if (!r.ok) {
            const error = await r.json().catch(() => ({}));
            appendTypedTerminalBlock(out, `CLI error: ${error.error || r.statusText || r.status}`, { color: "#ff6b8b" });
            return;
          }
          const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            buf += dec.decode(chunk.value, {stream:true});
            const events = buf.split("\n\n"); buf = events.pop();
            for (const event of events) {
              const payload = event.split("\n").filter(line => line.startsWith("data:"))
                .map(line => line.slice(5).trim()).join("\n");
              if (payload && payload !== "[DONE]") {
                appendTypedTerminalBlock(out, payload, { color: "#e2e8f0" });
              }
            }
          }
        } catch (error) {
          appendTypedTerminalBlock(out, `CLI request failed: ${error}`, { color: "#ff6b8b" });
        }
      };
    });
  }
}

$("#colab-host-add")?.addEventListener("click", async () => {
  const body = {};
  $("#colab-host-new-fields")?.querySelectorAll("[data-new-host-field]").forEach(input => {
    body[input.dataset.newHostField] = input.value.trim();
  });
  const res = await postJSON("/api/runtime-hosts", body);
  if (res.ok) {
    $("#colab-host-new-fields")?.querySelectorAll("[data-new-host-field]").forEach(input => input.value = "");
    $("#colab-host-new-fields [data-new-host-field='provider']").value = "colab";
    $("#colab-host-new-fields [data-new-host-field='accelerator']").value = "T4";
    $("#colab-host-new-fields [data-new-host-field='runtime_timeout']").value = "21600";
    await renderColabHosts();
    await reloadState();
    renderLineup();
    status(`${res.host.name} added — capacity now supports ${res.count} runtime host(s)`);
  }
  else status(res.error || "could not add host");
});

const newHostProvider = $("#colab-host-new-fields [data-new-host-field='provider']");
const newHostAccelerator = $("#colab-host-new-fields [data-new-host-field='accelerator']");
newHostProvider?.addEventListener("change", () => {
  const p = newHostProvider.value;
  const opts = getDefaultAcceleratorsForProvider(p);
  if (newHostAccelerator) {
    newHostAccelerator.innerHTML = opts.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    newHostAccelerator.value = opts[0];
  }
});

renderColabHosts();

async function refreshColabHostsUI() { await renderColabHosts(); }

// ── restart app (kill + respawn the server) ──
$("#restart-btn").onclick = async () => {
  
  status("⏻ restarting…");
  try { await postJSON("/api/restart", {}); } catch (_) {}
  const wait = setInterval(async () => {
    try {
      const r = await fetch("/api/state", { cache: "no-store" });
      if (r.ok) { clearInterval(wait); location.reload(); }
    } catch (_) { /* server coming back up */ }
  }, 1000);
};

// ── 🔊 Smooth Sentence-Streaming Neural TTS (Prefetch Queue + Play/Stop Toggle + Browser Fallback) ──
let _ttsSession = 0;
let _ttsAudio = null;
let _ttsActiveBtn = null;

function cleanTextForSpeechClient(raw) {
  let t = String(raw || "");
  t = t.replace(/```[\s\S]*?```/g, " Code block omitted. ");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  t = t.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/[*_~>|]+/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function splitSpeechSentences(text, maxChunk = 280) {
  const cleaned = cleanTextForSpeechClient(text);
  if (!cleaned) return [];
  const rawSentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  const chunks = [];
  let current = "";
  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).trim().length <= maxChunk) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxChunk) {
        current = trimmed;
      } else {
        for (let i = 0; i < trimmed.length; i += maxChunk) {
          chunks.push(trimmed.slice(i, i + maxChunk));
        }
        current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function stopSpeech() {
  _ttsSession++;
  if (_ttsAudio) {
    try { _ttsAudio.pause(); _ttsAudio.src = ""; } catch (_) {}
    _ttsAudio = null;
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (_) {}
  }
  if (_ttsActiveBtn) {
    _ttsActiveBtn.classList.remove("speaking");
    _ttsActiveBtn.textContent = _ttsActiveBtn.id === "verdict-speak" ? "🔊 Speak" : "🔊";
    _ttsActiveBtn = null;
  }
  $("#tts-stop-btn")?.classList.add("hidden");
}

$("#tts-stop-btn")?.addEventListener("click", () => {
  stopSpeech();
  status("⏹ voice playback stopped");
});

function getSelectedVoiceProfile(voiceIdOverride) {
  const vid = voiceIdOverride || $("#voice")?.value || "aria";
  return (
    VOICE_PROFILES.find((v) => v.id === vid || v.engine === vid || v.name === vid) ||
    VOICE_PROFILES[0] || {
      id: "aria",
      name: "Aria — Warm Studio Female",
      tl: "en-US",
      gender: "female",
      speed: 1.08,
      pitch: 1.02,
    }
  );
}

function pickBestBrowserSynthVoice(profile) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  const langPrefix = String(profile?.tl || profile?.accent || "en-US").toLowerCase();
  const wantFemale = profile?.gender !== "male";

  const scored = voices.map((v) => {
    let score = 0;
    const n = `${v.name} ${v.lang}`.toLowerCase();
    if (v.lang.toLowerCase() === langPrefix) score += 40;
    else if (v.lang.toLowerCase().startsWith("en")) score += 15;
    if (/natural|neural|online|studio|google|premium|siri/i.test(n)) score += 35;
    if (wantFemale && /aria|jenny|sonia|natasha|samantha|victoria|female|zira|google us english/i.test(n)) score += 20;
    if (!wantFemale && /christopher|guy|andrew|daniel|alex|david|male|uk english male/i.test(n)) score += 20;
    return { v, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.v || voices[0];
}

function renderVoiceEditorSlots() {
  const row = $("#ve-slots-row");
  if (!row) return;
  row.innerHTML = VOICE_PROFILES.map((vp, idx) => {
    const isSel = vp.id === editingVoiceId;
    return `<button type="button" class="${isSel ? "primary" : "ghost"} xs" data-ve-slot="${esc(vp.id)}">🎙️ Voice ${idx + 1}: ${esc(vp.name)}</button>`;
  }).join("");

  row.querySelectorAll("[data-ve-slot]").forEach((btn) => {
    btn.onclick = () => {
      editingVoiceId = btn.getAttribute("data-ve-slot") || "aria";
      populateVoiceEditorFields(editingVoiceId);
      renderVoiceEditorSlots();
    };
  });
  populateVoiceEditorFields(editingVoiceId);
}

function populateVoiceEditorFields(vid) {
  const vp = getSelectedVoiceProfile(vid);
  if (!vp) return;
  if ($("#ve-name")) $("#ve-name").value = vp.name || "";
  if ($("#ve-tl")) $("#ve-tl").value = vp.tl || vp.accent || "en-US";
  if ($("#ve-gender")) $("#ve-gender").value = vp.gender || "female";
  if ($("#ve-speed")) $("#ve-speed").value = vp.speed || 1.08;
  if ($("#ve-speed-out")) $("#ve-speed-out").textContent = Number(vp.speed || 1.08).toFixed(2);
  if ($("#ve-pitch")) $("#ve-pitch").value = vp.pitch || 1.02;
  if ($("#ve-pitch-out")) $("#ve-pitch-out").textContent = Number(vp.pitch || 1.02).toFixed(2);
}

$("#ve-speed")?.addEventListener("input", (e) => {
  if ($("#ve-speed-out")) $("#ve-speed-out").textContent = Number(e.target.value).toFixed(2);
});
$("#ve-pitch")?.addEventListener("input", (e) => {
  if ($("#ve-pitch-out")) $("#ve-pitch-out").textContent = Number(e.target.value).toFixed(2);
});

$("#voice")?.addEventListener("change", (e) => {
  const vid = e.target.value;
  editingVoiceId = vid;
  try { localStorage.setItem("cng_selected_voice", vid); } catch (_) {}
  renderVoiceEditorSlots();
  const vp = getSelectedVoiceProfile(vid);
  status(`🔊 Switched smooth AI voice to: ${vp.name}`);
});

$("#tts-edit-toggle-btn")?.addEventListener("click", () => {
  const panel = $("#voice-editor-panel");
  if (!panel) return;
  editingVoiceId = $("#voice")?.value || VOICE_PROFILES[0]?.id || "aria";
  renderVoiceEditorSlots();
  panel.classList.toggle("hidden");
});

$("#tts-preview-btn")?.addEventListener("click", (e) => {
  const vp = getSelectedVoiceProfile();
  speak(`Hello! I am ${vp.name.split("—")[0].trim()}, your smooth Suomynona Council studio voice. I load fast and speak naturally.`, e.currentTarget);
});

$("#ve-preview-btn")?.addEventListener("click", (e) => {
  const tempName = ($("#ve-name")?.value || "Custom Studio Voice").split("—")[0].trim();
  const tempTl = $("#ve-tl")?.value || "en-US";
  const tempGender = $("#ve-gender")?.value || "female";
  const tempSpeed = Number($("#ve-speed")?.value) || 1.08;
  const tempPitch = Number($("#ve-pitch")?.value) || 1.02;
  const idx = VOICE_PROFILES.findIndex((v) => v.id === editingVoiceId);
  if (idx >= 0) {
    VOICE_PROFILES[idx] = {
      ...VOICE_PROFILES[idx],
      name: $("#ve-name")?.value || VOICE_PROFILES[idx].name,
      tl: tempTl,
      accent: tempTl,
      gender: tempGender,
      speed: tempSpeed,
      pitch: tempPitch,
    };
  }
  if ($("#voice")) $("#voice").value = editingVoiceId;
  speak(`Testing ${tempName}. Smooth studio voice tuned to ${tempSpeed}x speed.`, e.currentTarget);
});

$("#ve-save-btn")?.addEventListener("click", async () => {
  const payload = {
    id: editingVoiceId,
    name: ($("#ve-name")?.value || "Custom Studio Voice").trim(),
    tl: $("#ve-tl")?.value || "en-US",
    accent: $("#ve-tl")?.value || "en-US",
    gender: $("#ve-gender")?.value || "female",
    speed: Number($("#ve-speed")?.value) || 1.08,
    pitch: Number($("#ve-pitch")?.value) || 1.02,
  };
  const res = await postJSON("/api/voices", payload);
  if (res?.ok && Array.isArray(res.profiles)) {
    VOICE_PROFILES = res.profiles;
    if (STATE) STATE.voice_profiles = res.profiles;
    fillVoice();
    if ($("#voice")) $("#voice").value = editingVoiceId;
    if ($("#ve-status")) $("#ve-status").textContent = `✅ Saved "${payload.name}"!`;
    status(`🎙️ Saved smooth voice profile: ${payload.name}`);
  }
});

$("#ve-reset-btn")?.addEventListener("click", async () => {
  const res = await postJSON("/api/voices", { reset: true });
  if (res?.ok && Array.isArray(res.profiles)) {
    VOICE_PROFILES = res.profiles;
    if (STATE) STATE.voice_profiles = res.profiles;
    fillVoice();
    if ($("#ve-status")) $("#ve-status").textContent = "↺ Reset all 4 voices to studio defaults.";
    status("↺ Reset all 4 smooth AI voices to defaults");
  }
});

async function speak(text, triggerBtn = null) {
  if (triggerBtn && _ttsActiveBtn === triggerBtn) {
    stopSpeech();
    status("⏹ voice stopped");
    return;
  }
  stopSpeech();
  const chunks = splitSpeechSentences(text, 240);
  if (!chunks.length) return;

  const session = ++_ttsSession;
  _ttsActiveBtn = triggerBtn;
  if (triggerBtn) {
    triggerBtn.classList.add("speaking");
    triggerBtn.textContent = triggerBtn.id === "verdict-speak" ? "⏹ Stop" : "⏹";
  }
  $("#tts-stop-btn")?.classList.remove("hidden");

  const profile = getSelectedVoiceProfile();
  const voice = profile.id || "aria";
  const rateStr = $("#tts-rate")?.value || "+10%";
  const ratePct = parseFloat(rateStr) || 0;
  const playbackMultiplier = Math.max(0.8, Math.min(1.55, (Number(profile.speed) || 1.06) * (1 + ratePct / 200)));

  const fetchChunkAudio = (chunkText) =>
    postJSON("/api/tts", { text: chunkText, voice, rate: rateStr }).catch((e) => ({ ok: false, error: String(e) }));

  // Prefetch first chunk immediately for fast startup
  let nextPromise = fetchChunkAudio(chunks[0]);

  for (let i = 0; i < chunks.length; i++) {
    if (session !== _ttsSession) return;
    status(`🔊 ${profile.name.split("—")[0].trim()} speaking (${i + 1}/${chunks.length})…`);
    const curPromise = nextPromise;
    if (i + 1 < chunks.length) {
      nextPromise = fetchChunkAudio(chunks[i + 1]);
    }
    const res = await curPromise;
    if (session !== _ttsSession) return;

    if (res && res.ok && res.b64) {
      await new Promise((resolve) => {
        if (session !== _ttsSession) { resolve(); return; }
        const au = new Audio("data:audio/mpeg;base64," + res.b64);
        au.playbackRate = playbackMultiplier;
        if ("preservesPitch" in au) au.preservesPitch = true;
        _ttsAudio = au;
        au.onended = resolve;
        au.onerror = resolve;
        au.play().catch(() => resolve());
      });
    } else if (window.speechSynthesis) {
      await new Promise((resolve) => {
        if (session !== _ttsSession) { resolve(); return; }
        const utter = new SpeechSynthesisUtterance(chunks[i]);
        const bestVoice = pickBestBrowserSynthVoice(profile);
        if (bestVoice) {
          utter.voice = bestVoice;
          utter.lang = bestVoice.lang;
        } else {
          utter.lang = profile.tl || "en-US";
        }
        utter.rate = playbackMultiplier;
        utter.pitch = Number(profile.pitch) || 1.0;
        utter.onend = resolve;
        utter.onerror = resolve;
        window.speechSynthesis.speak(utter);
      });
    } else {
      status("tts failed: " + (res?.error || "unavailable"));
      break;
    }
  }

  if (session === _ttsSession) {
    stopSpeech();
    status("");
  }
}

// ── Dedicated Colab Multi-Host CLI Tab & Per-Host Persistent Auto-Reconnect Engine ──
let cliHist = [], cliHistIdx = -1, cliRunning = false, cliAbort = null;

// Per-host Persistent Auto-Reconnect state with exponential backoff (1s → 2s → 4s → 8s → 16s → 30s)
const HOST_AUTO_RECONNECT_STATE = {};

function ensureHostAutoReconnectEntry(hostId, defaultEnabled = true, isOnline = true) {
  const id = String(hostId || "a").toLowerCase();
  if (!HOST_AUTO_RECONNECT_STATE[id]) {
    let stored = null;
    try {
      stored = localStorage.getItem(`council-autoreconnect-${id}`);
    } catch (_) {}
    const enabled = stored !== null ? stored !== "0" : Boolean(defaultEnabled);
    HOST_AUTO_RECONNECT_STATE[id] = {
      enabled,
      status: isOnline ? "green" : "red",
      attempt: 0,
      timerId: null,
      countdownTimerId: null,
      remainingSec: 0,
      nextDelayMs: 0,
      lastError: "",
    };
  } else if (typeof defaultEnabled === "boolean" && localStorage.getItem(`council-autoreconnect-${id}`) === null) {
    HOST_AUTO_RECONNECT_STATE[id].enabled = defaultEnabled;
  }
  return HOST_AUTO_RECONNECT_STATE[id];
}

function isHostAutoReconnectEnabled(hostId, fallback = true) {
  const id = String(hostId || "a").toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    return hosts.every((h) => ensureHostAutoReconnectEntry(h.id, fallback).enabled);
  }
  return ensureHostAutoReconnectEntry(id, fallback).enabled;
}

function getHostStatusDotEmoji(hostId) {
  const id = String(hostId || "a").toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    const states = hosts.map((h) => ensureHostAutoReconnectEntry(h.id).status);
    if (states.some((s) => s === "retrying")) return "🟡";
    if (states.some((s) => s === "red")) return "🔴";
    return "🟢";
  }
  const st = ensureHostAutoReconnectEntry(id);
  if (st.status === "retrying") return "🟡";
  if (st.status === "red") return "🔴";
  return "🟢";
}

function getHostBackoffBadgeText(hostId) {
  const id = String(hostId || "a").toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    const retryingHost = hosts.map((h) => ({ id: h.id, st: ensureHostAutoReconnectEntry(h.id) })).find((x) => x.st.status === "retrying");
    if (retryingHost) {
      return `🟡 Host ${retryingHost.id.toUpperCase()} Retry #${retryingHost.st.attempt} (${retryingHost.st.remainingSec}s)`;
    }
    const redHost = hosts.map((h) => ({ id: h.id, st: ensureHostAutoReconnectEntry(h.id) })).find((x) => x.st.status === "red");
    if (redHost) {
      return `🔴 Host ${redHost.id.toUpperCase()} Offline`;
    }
    return isHostAutoReconnectEnabled("all") ? "🟢 All Armed" : "⚪ Mixed";
  }
  const st = ensureHostAutoReconnectEntry(id);
  if (st.status === "retrying") {
    return `🟡 Retry #${st.attempt} (${st.remainingSec}s)`;
  }
  if (st.status === "red") {
    return st.enabled ? "🟡 Queued" : "🔴 Failed";
  }
  return st.enabled ? "🟢 Armed" : "⚪ Off";
}

function clearHostBackoffTimers(st) {
  if (!st) return;
  if (st.timerId) {
    clearTimeout(st.timerId);
    st.timerId = null;
  }
  if (st.countdownTimerId) {
    clearInterval(st.countdownTimerId);
    st.countdownTimerId = null;
  }
}

function markHostStatusGreen(hostId, res = null) {
  const id = String(hostId || "a").toLowerCase();
  const st = ensureHostAutoReconnectEntry(id);
  const wasRetrying = st.attempt > 0 || st.status !== "green";
  clearHostBackoffTimers(st);
  st.status = "green";
  st.attempt = 0;
  st.remainingSec = 0;
  st.nextDelayMs = 0;
  st.lastError = "";
  if (wasRetrying) {
    const out = $("#cli-out") || $("#guardian-out");
    const hostOut = document.getElementById(`cli-out-${id}`);
    const msg = `🟢 [Persistent Auto-Reconnect] Host ${id.toUpperCase()} handshake verified — host status is now GREEN${res?.endpoint ? ` (${res.endpoint})` : ""}.`;
    if (out) appendTypedTerminalBlock(out, msg, { color: "#2ee6a6" });
    if (hostOut && hostOut !== out) appendTypedTerminalBlock(hostOut, msg, { color: "#2ee6a6" });
  }
  syncTargetHostAutoReconnectUI();
}

function scheduleHostAutoReconnect(hostId, errorReason = "connection failed") {
  const id = String(hostId || "a").toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    hosts.forEach((h) => scheduleHostAutoReconnect(h.id, errorReason));
    return;
  }
  const st = ensureHostAutoReconnectEntry(id);
  st.lastError = String(errorReason || "handshake failed");
  clearHostBackoffTimers(st);

  if (!st.enabled) {
    st.status = "red";
    syncTargetHostAutoReconnectUI();
    return;
  }

  st.attempt = (st.attempt || 0) + 1;
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, capped at 30s
  const delayMs = Math.min(30000, 1000 * Math.pow(2, st.attempt - 1));
  st.nextDelayMs = delayMs;
  st.remainingSec = Math.ceil(delayMs / 1000);
  st.status = "retrying";

  const out = $("#cli-out") || $("#guardian-out");
  const hostOut = document.getElementById(`cli-out-${id}`);
  const logLine = `🔄 [Persistent Auto-Reconnect] Host ${id.toUpperCase()} (${st.lastError}) — retrying handshake Attempt #${st.attempt} with exponential backoff in ${st.remainingSec}s…`;
  if (out) appendTypedTerminalBlock(out, logLine, { color: "#ffcc66", instant: true });
  if (hostOut && hostOut !== out) appendTypedTerminalBlock(hostOut, logLine, { color: "#ffcc66", instant: true });
  status(`🔄 Host ${id.toUpperCase()}: Auto-Reconnect Attempt #${st.attempt} in ${st.remainingSec}s…`);

  syncTargetHostAutoReconnectUI();

  st.countdownTimerId = setInterval(() => {
    st.remainingSec = Math.max(0, st.remainingSec - 1);
    syncTargetHostAutoReconnectUI();
  }, 1000);

  st.timerId = setTimeout(() => {
    clearHostBackoffTimers(st);
    attemptHostHandshakeWithBackoff(id, `Auto-Reconnect Attempt #${st.attempt}`);
  }, delayMs);
}

async function attemptHostHandshakeWithBackoff(hostId, contextLabel = "Handshake") {
  const id = String(hostId || "a").toLowerCase();
  const st = ensureHostAutoReconnectEntry(id);
  try {
    const res = await postJSON(`/api/runtime-handshake/${encodeURIComponent(id)}`, {
      attempt: st.attempt || 1,
      reason: contextLabel,
    });
    if (res && res.ok) {
      markHostStatusGreen(id, res);
      status(`🟢 Host ${id.toUpperCase()} connected & verified (${res.provider?.toUpperCase() || "COLAB"} · ${res.accelerator || "GPU"})`);
      await reloadState().catch(() => {});
      return true;
    }
    scheduleHostAutoReconnect(id, res?.error || "handshake rejected");
    return false;
  } catch (err) {
    scheduleHostAutoReconnect(id, err?.message || String(err));
    return false;
  }
}

function handleHostConnectionFailure(hostId, errorReason = "auth/connection failed") {
  const id = String(hostId || "a").toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    hosts.forEach((h) => handleHostConnectionFailure(h.id, errorReason));
    return;
  }
  const st = ensureHostAutoReconnectEntry(id);
  st.status = "red";
  st.lastError = String(errorReason || "connection failed");
  syncTargetHostAutoReconnectUI();
  if (st.enabled) {
    scheduleHostAutoReconnect(id, errorReason);
  }
}

function setHostAutoReconnect(hostId, enabled, { persist = true, triggerHandshakeIfNotGreen = true } = {}) {
  const id = String(hostId || "a").toLowerCase();
  const isOn = Boolean(enabled);
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    hosts.forEach((h) => setHostAutoReconnect(h.id, isOn, { persist, triggerHandshakeIfNotGreen }));
    syncTargetHostAutoReconnectUI();
    status(`🔄 Persistent Auto-Reconnect ${isOn ? "ENABLED" : "DISABLED"} for all hosts`);
    return;
  }

  const st = ensureHostAutoReconnectEntry(id);
  st.enabled = isOn;
  try {
    localStorage.setItem(`council-autoreconnect-${id}`, isOn ? "1" : "0");
  } catch (_) {}

  if (!isOn) {
    clearHostBackoffTimers(st);
    if (st.status === "retrying") st.status = "red";
  } else if (triggerHandshakeIfNotGreen && st.status !== "green" && !st.timerId) {
    scheduleHostAutoReconnect(id, st.lastError || "re-establishing host handshake");
  }

  if (persist && ["a", "b", "c"].includes(id)) {
    postJSON(`/api/runtime-hosts/${encodeURIComponent(id)}`, { auto_reconnect: isOn }, "PUT").catch(() => {});
  }

  syncTargetHostAutoReconnectUI();
  status(`🔄 Host ${id.toUpperCase()}: Persistent Auto-Reconnect ${isOn ? "ON (exponential backoff armed)" : "OFF"}`);
}

async function forceReconnectHost(hostId = null) {
  const sel = $("#cli-target-host");
  const rawTarget = hostId || sel?.value || "all";
  const id = String(rawTarget).toLowerCase();
  if (id === "all") {
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    status("⚡ Force Reconnect triggered for ALL hosts (bypassing exponential backoff)…");
    await Promise.all(hosts.map((h) => forceReconnectHost(h.id)));
    return;
  }
  const st = ensureHostAutoReconnectEntry(id);
  clearHostBackoffTimers(st);
  st.attempt = (st.attempt || 0) + 1;
  st.status = "retrying";
  st.remainingSec = 0;
  syncTargetHostAutoReconnectUI();

  const out = $("#cli-out") || $("#guardian-out");
  const hostOut = document.getElementById(`cli-out-${id}`);
  const msg = `⚡ [Force Reconnect] Bypassing backoff timer and triggering immediate fresh handshake for Host ${id.toUpperCase()}…`;
  if (out) appendTypedTerminalBlock(out, msg, { color: "#00d4ff", instant: true });
  if (hostOut && hostOut !== out) appendTypedTerminalBlock(hostOut, msg, { color: "#00d4ff", instant: true });
  status(`⚡ Force Reconnect: triggering immediate fresh handshake for Host ${id.toUpperCase()}…`);

  await attemptHostHandshakeWithBackoff(id, "Manual Force Reconnect (Immediate)");
}

function syncTargetHostAutoReconnectUI(explicitHosts = null) {
  const sel = $("#cli-target-host");
  const currentTarget = (sel?.value || "all").toLowerCase();
  const mainCheckbox = $("#cli-target-host-autoreconnect");
  const mainDot = $("#cli-target-host-status-dot");
  const mainBadge = $("#cli-autoreconnect-badge");
  const perHostStrip = $("#cli-per-host-autoreconnect-strip");

  const dotEmoji = getHostStatusDotEmoji(currentTarget);
  if (mainDot) {
    mainDot.textContent = dotEmoji;
    mainDot.className =
      "host-status-dot " +
      (dotEmoji === "🟢" ? "is-green" : dotEmoji === "🟡" ? "is-retrying" : "is-red");
    mainDot.title =
      dotEmoji === "🟢"
        ? `Target Host (${currentTarget.toUpperCase()}) Status: Connected (Green)`
        : dotEmoji === "🟡"
        ? `Target Host (${currentTarget.toUpperCase()}) Status: Reconnecting with Exponential Backoff`
        : `Target Host (${currentTarget.toUpperCase()}) Status: Disconnected (Red)`;
  }

  if (mainCheckbox) {
    mainCheckbox.checked = isHostAutoReconnectEnabled(currentTarget);
  }
  if (mainBadge) {
    mainBadge.textContent = getHostBackoffBadgeText(currentTarget);
    mainBadge.className =
      "autoreconnect-backoff-badge " +
      (dotEmoji === "🟢" ? "is-green" : dotEmoji === "🟡" ? "is-retrying" : "is-red");
  }

  // Update all per-host checkboxes across Lineup, Settings, and Individual Host Consoles
  $$("[data-host-autoreconnect]").forEach((cb) => {
    const hid = cb.dataset.hostAutoreconnect;
    if (hid) cb.checked = isHostAutoReconnectEnabled(hid);
  });
  $$("[data-host-dot]").forEach((el) => {
    const hid = el.dataset.hostDot;
    if (hid) el.textContent = getHostStatusDotEmoji(hid);
  });
  $$("[data-host-backoff-badge]").forEach((el) => {
    const hid = el.dataset.hostBackoffBadge;
    if (hid) el.textContent = getHostBackoffBadgeText(hid);
  });

  // Render the per-host Persistent Auto-Reconnect + Force Reconnect strip right next to #cli-target-host
  const hosts = explicitHosts || STATE?.runtime_hosts || STATE?.colab_hosts || [
    { id: "a", name: "Host A", provider: "colab" },
    { id: "b", name: "Host B", provider: "colab" },
    { id: "c", name: "Host C", provider: "colab" },
  ];
  if (perHostStrip) {
    perHostStrip.innerHTML = "";
    hosts.forEach((h) => {
      const hid = String(h.id).toLowerCase();
      const st = ensureHostAutoReconnectEntry(hid, h.auto_reconnect !== false, h.status_online !== false);
      const hDot = getHostStatusDotEmoji(hid);
      const chip = document.createElement("div");
      chip.className =
        "per-host-autoreconnect-chip" +
        (currentTarget === hid ? " active-target" : "") +
        (st.status === "retrying" ? " is-retrying" : st.status === "red" ? " is-red" : " is-green");
      chip.title = `${h.name || `Host ${hid.toUpperCase()}`}: Persistent Auto-Reconnect (${st.enabled ? "ON" : "OFF"}) — click ⚡ to Force Reconnect immediately`;
      chip.innerHTML = `<input type="checkbox" data-strip-autoreconnect="${esc(hid)}" ${st.enabled ? "checked" : ""} title="Toggle Persistent Auto-Reconnect for Host ${esc(hid.toUpperCase())}"><span class="per-host-chip-label" data-strip-select-host="${esc(hid)}">${hDot} Host ${esc(hid.toUpperCase())} 🔄${st.status === "retrying" ? ` #${st.attempt} (${st.remainingSec}s)` : ""}</span><button type="button" class="strip-force-reconnect-btn" data-strip-force-reconnect="${esc(hid)}" title="Force Reconnect Host ${esc(hid.toUpperCase())} immediately (bypass backoff)">⚡</button>`;
      const cb = chip.querySelector(`[data-strip-autoreconnect="${hid}"]`);
      const lbl = chip.querySelector(`[data-strip-select-host="${hid}"]`);
      const forceBtn = chip.querySelector(`[data-strip-force-reconnect="${hid}"]`);
      cb?.addEventListener("change", (e) => {
        e.stopPropagation();
        setHostAutoReconnect(hid, cb.checked);
      });
      lbl?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sel) {
          sel.value = hid;
          syncCliPromptPrefix();
        }
      });
      forceBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        forceReconnectHost(hid);
      });
      perHostStrip.appendChild(chip);
    });
  }
}

function syncCliPromptPrefix() {
  const sel = $("#cli-target-host");
  const val = (sel?.value || "all").toUpperCase();
  const hostTag = val === "ALL" ? "ALL HOSTS" : val;
  const pfx = $("#cli-prompt-prefix");
  if (pfx) {
    pfx.textContent = `colab-cli [${hostTag}]>`;
  }
  if (unifiedTerminalMode === "colab") {
    const gPfx = $("#guardian-prompt-prefix");
    if (gPfx) gPfx.textContent = `colab-cli [${hostTag}]>`;
  }
  syncTargetHostAutoReconnectUI();
}
$("#cli-target-host")?.addEventListener("change", syncCliPromptPrefix);
$("#cli-target-host-autoreconnect")?.addEventListener("change", (e) => {
  const sel = $("#cli-target-host");
  const targetHost = sel?.value || "all";
  setHostAutoReconnect(targetHost, e.target.checked);
});
$("#cli-force-reconnect-btn")?.addEventListener("click", () => {
  const sel = $("#cli-target-host");
  forceReconnectHost(sel?.value || "all");
});
$$("[data-force-reconnect-current]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sel = $("#cli-target-host");
    forceReconnectHost(sel?.value || "all");
  });
});
syncTargetHostAutoReconnectUI();

$("#cli-stop")?.addEventListener("click", () => { if (cliAbort) cliAbort.abort(); });
$("#cli-run")?.addEventListener("click", () => runCliTerm(true));
$("#cli-cmd")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !cliRunning) runCliTerm(true);
  else if (e.key === "ArrowUp" && cliHist.length) {
    e.preventDefault();
    cliHistIdx = Math.min(cliHistIdx + 1, cliHist.length - 1);
    $("#cli-cmd").value = cliHist[cliHistIdx];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    cliHistIdx = Math.max(cliHistIdx - 1, -1);
    $("#cli-cmd").value = cliHistIdx < 0 ? "" : cliHist[cliHistIdx];
  }
});
$$("[data-quick]").forEach((b) => {
  b.onclick = () => {
    const q = b.dataset.quick;
    if ($("#cli-cmd")) $("#cli-cmd").value = q;
    switchConsoleDockTab("colab-cli", { focus: true });
    runCliTerm(true, q);
    $("#cli-fullscreen-term")?.focus();
  };
});

async function runCliTerm(echoCommand = true, explicitCmd = null, customOutEl = null) {
  const cmd = String(explicitCmd ?? $("#cli-cmd")?.value ?? "").trim();
  if (!cmd || cliRunning) return;
  cliHist.unshift(cmd);
  cliHistIdx = -1;
  if ($("#cli-cmd")) $("#cli-cmd").value = "";
  const out = customOutEl || $("#cli-out") || $("#guardian-out");
  const targetSel = $("#cli-target-host");
  let targetHost = targetSel?.value || "all";

  // Allow switching target host directly via 'host <name>' command
  const hostSwitchMatch = cmd.match(/^host\s+([a-z0-9_-]+)$/i);
  if (hostSwitchMatch) {
    const requestedHost = hostSwitchMatch[1].toLowerCase();
    if (targetSel) {
      if (![...targetSel.options].some((o) => o.value === requestedHost)) {
        targetSel.appendChild(new Option(`🖥 Host ${requestedHost.toUpperCase()}`, requestedHost));
      }
      targetSel.value = requestedHost;
      syncCliPromptPrefix();
    }
    if (echoCommand && out) {
      appendTypedTerminalBlock(out, `${$("#cli-prompt-prefix")?.textContent || "colab-cli>"} ${cmd}`, { color: "#00d4ff", instant: true });
    }
    if (out) {
      appendTypedTerminalBlock(out, `✅ Switched active Colab CLI target host to: ${requestedHost.toUpperCase()}`, { color: "#2ee6a6" });
    }
    return;
  }

  if (echoCommand && out) {
    appendTypedTerminalBlock(out, `${$("#cli-prompt-prefix")?.textContent || "colab-cli>"} ${cmd}`, { color: "#00d4ff", instant: true });
  }
  cliRunning = true;
  cliAbort = new AbortController();
  $("#cli-stop")?.classList.remove("hidden");
  try {
    const r = await fetch("/api/cli/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd, host: targetHost }),
      signal: cliAbort.signal,
    });
    if (!r.ok) {
      throw new Error(`HTTP ${r.status} ${r.statusText}`);
    }
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const p = line.slice(5);
        if (p === "[DONE]") continue;
        appendTypedTerminalBlock(out, p, { color: "#e2e8f0", marginBottom: "2px" });
      }
    }
    if (targetHost && targetHost !== "all") {
      markHostStatusGreen(targetHost);
    }
  } catch (e) {
    if (e.name !== "AbortError") {
      appendTypedTerminalBlock(out, "⚠️ " + e, { color: "#ff6b8b" });
      handleHostConnectionFailure(targetHost, e.message || String(e));
    }
  }
  cliRunning = false;
  $("#cli-stop")?.classList.add("hidden");
}

// ── custom API models / custom GGUF / tools / MCP ──// ── custom API models / custom GGUF / tools / MCP ──
// ── 4-Layer Indestructible Model & Hugging Face Bucket Vault (LocalStorage + Server + Brain + Vault) ──
const MODEL_VAULT_STORAGE_KEY = "council_ng_saved_models_vault_v1";

function readLocalModelVault() {
  try {
    const raw = localStorage.getItem(MODEL_VAULT_STORAGE_KEY);
    if (!raw) return { custom_gguf: [], custom_models: [], hf_buckets: [], deleted_ids: [] };
    const parsed = JSON.parse(raw);
    return {
      custom_gguf: Array.isArray(parsed.custom_gguf) ? parsed.custom_gguf : [],
      custom_models: Array.isArray(parsed.custom_models) ? parsed.custom_models : [],
      hf_buckets: Array.isArray(parsed.hf_buckets) ? parsed.hf_buckets : [],
      deleted_ids: Array.isArray(parsed.deleted_ids) ? parsed.deleted_ids : [],
    };
  } catch {
    return { custom_gguf: [], custom_models: [], hf_buckets: [], deleted_ids: [] };
  }
}

function saveLocalModelVault(patch = {}) {
  try {
    const cur = readLocalModelVault();
    const deletedSet = new Set(patch.deleted_ids || cur.deleted_ids || []);
    const ggufMap = new Map();
    [...(cur.custom_gguf || []), ...(STATE.custom_gguf || []), ...(patch.custom_gguf || [])].forEach((m) => {
      if (m && m.id && !deletedSet.has(m.id)) ggufMap.set(m.id, m);
    });
    const apiMap = new Map();
    [...(cur.custom_models || []), ...(STATE.custom_models || []), ...(patch.custom_models || [])].forEach((m) => {
      if (m && m.id && !deletedSet.has(m.id)) apiMap.set(m.id, m);
    });
    const bucketMap = new Map();
    [...(cur.hf_buckets || []), ...(STATE.hf_buckets || []), ...(patch.hf_buckets || [])].forEach((b) => {
      if (b && b.id && !deletedSet.has(b.id)) bucketMap.set(b.id, b);
    });
    const nextVault = {
      updated_at: new Date().toISOString(),
      custom_gguf: [...ggufMap.values()],
      custom_models: [...apiMap.values()],
      hf_buckets: [...bucketMap.values()],
      deleted_ids: [...deletedSet],
    };
    localStorage.setItem(MODEL_VAULT_STORAGE_KEY, JSON.stringify(nextVault));
    updateVaultLockBadgeUI(nextVault);
    return nextVault;
  } catch {
    return null;
  }
}

function markModelDeletedInLocalVault(id) {
  try {
    const cur = readLocalModelVault();
    const deletedSet = new Set([...(cur.deleted_ids || []), id]);
    const nextVault = {
      updated_at: new Date().toISOString(),
      custom_gguf: (cur.custom_gguf || []).filter((x) => x.id !== id),
      custom_models: (cur.custom_models || []).filter((x) => x.id !== id),
      hf_buckets: (cur.hf_buckets || []).filter((x) => x.id !== id),
      deleted_ids: [...deletedSet],
    };
    localStorage.setItem(MODEL_VAULT_STORAGE_KEY, JSON.stringify(nextVault));
    updateVaultLockBadgeUI(nextVault);
  } catch {}
}

function updateVaultLockBadgeUI(vaultObj) {
  const badge = $("#hf-vault-lock-badge");
  if (!badge) return;
  const v = vaultObj || readLocalModelVault();
  const ggufCnt = (STATE?.custom_gguf || v.custom_gguf || []).length;
  const apiCnt = (STATE?.custom_models || v.custom_models || []).length;
  const bktCnt = (STATE?.hf_buckets || v.hf_buckets || []).length;
  badge.textContent = `🔒 Vault Locked: ${ggufCnt} Custom GGUF · ${apiCnt} API · ${bktCnt} HF Buckets`;
}

async function syncOrRehydrateModelVaultWithLocalStorage() {
  try {
    const localV = readLocalModelVault();
    const deletedSet = new Set(localV.deleted_ids || []);
    const serverGgufIds = new Set((STATE.custom_gguf || []).map((x) => x.id));
    const serverApiIds = new Set((STATE.custom_models || []).map((x) => x.id));
    const serverBktIds = new Set((STATE.hf_buckets || []).map((x) => x.id));

    const missingGguf = (localV.custom_gguf || []).filter((m) => m && m.id && !deletedSet.has(m.id) && !serverGgufIds.has(m.id));
    const missingApi = (localV.custom_models || []).filter((m) => m && m.id && !deletedSet.has(m.id) && !serverApiIds.has(m.id));
    const missingBkt = (localV.hf_buckets || []).filter((b) => b && b.id && !deletedSet.has(b.id) && !serverBktIds.has(b.id));

    if (missingGguf.length || missingApi.length || missingBkt.length) {
      const res = await postJSON("/api/models/rehydrate-vault", {
        custom_gguf: missingGguf,
        custom_models: missingApi,
        hf_buckets: missingBkt,
      });
      if (res?.ok) {
        if (res.custom_gguf) STATE.custom_gguf = res.custom_gguf;
        if (res.custom_models) STATE.custom_models = res.custom_models;
        if (res.hf_buckets) STATE.hf_buckets = res.hf_buckets;
      }
    }
    saveLocalModelVault();
  } catch (e) {
    console.warn("Model Vault sync notice:", e);
  }
}

// ── custom API models / custom GGUF / Hugging Face Buckets / tools / MCP ──
function renderCustomModels() {
  const l = $("#cm-list");
  if (!l) return;
  l.innerHTML = "";
  (STATE.custom_models || []).forEach((m) => {
    const r = document.createElement("div"); r.className = "hrow";
    r.innerHTML = `<span>🟦</span><span style="font-weight:700">${esc(m.name)}</span><span class="muted">${esc(m.base)} · ${esc(m.model)}</span><span class="badge" style="font-size:9.5px;background:rgba(16,185,129,.15);color:#6ee7b7">🔒 VAULT SAVED</span><span class="spacer"></span><button class="ghost sm" data-cm="${m.id}">✕</button>`;
    l.appendChild(r);
  });
  l.querySelectorAll("[data-cm]").forEach((b) => b.onclick = async () => {
    markModelDeletedInLocalVault(b.dataset.cm);
    await fetch("/api/custom-models/" + b.dataset.cm, { method: "DELETE" });
    await reloadState(); renderCustomModels(); status("custom model removed");
  });
}
$("#cm-test").onclick = async () => {
  $("#cm-info").textContent = "testing…";
  const res = await postJSON("/api/custom-models/test", {
    base: $("#cm-base").value, key: "" });
  $("#cm-info").textContent = res.ok ? `✅ Found ${res.models.length} model(s); none selected automatically.`
                                     : "❌ " + (res.error || res.status);
  discoveredCustomModels = res.ok ? res.models : [];
  const list = $("#cm-discovered");
  list.innerHTML = "";
  if (!discoveredCustomModels.length) return;
  const head = document.createElement("div");
  head.className = "row";
  const label = document.createElement("strong");
  label.textContent = "Available API models (select only the ones you want to use):";
  const filter = document.createElement("input");
  filter.className = "input slim";
  filter.type = "search";
  filter.placeholder = "Filter models (e.g. cyber)";
  filter.setAttribute("aria-label", "Filter discovered API models");
  const selectVisible = document.createElement("button");
  selectVisible.type = "button";
  selectVisible.className = "ghost sm";
  selectVisible.textContent = "Select visible";
  selectVisible.onclick = () => list.querySelectorAll(".custom-model-option:not([hidden]) input").forEach((input) => { input.checked = true; });
  const add = document.createElement("button");
  add.type = "button";
  add.className = "primary sm";
  add.textContent = "＋ Add checked models";
  add.onclick = async () => {
    const models = [...list.querySelectorAll("input[data-model-id]:checked")].map((input) => input.dataset.modelId);
    if (!models.length) { status("check at least one API model to add"); return; }
    add.disabled = true;
    const result = await postJSON("/api/custom-models/bulk", {
      name: $("#cm-name").value.trim() || "OpenAI-compatible endpoint",
      base: $("#cm-base").value, key: "", models,
    }).catch((error) => ({ ok: false, error: String(error) }));
    add.disabled = false;
    if (!result.ok) { status(result.error || "could not add API models"); return; }
    saveLocalModelVault({ custom_models: result.models || [] });
    await reloadState();
    renderCustomModels();
    status(`🔒 ${result.added} API model(s) added & permanently locked in Vault!`);
  };
  head.append(label, filter, selectVisible, add);
  list.appendChild(head);
  discoveredCustomModels.forEach((modelId) => {
    const row = document.createElement("label");
    row.className = "custom-model-option";
    row.dataset.modelId = modelId.toLowerCase();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.modelId = modelId;
    const text = document.createElement("span");
    text.textContent = modelId;
    row.append(checkbox, text);
    list.appendChild(row);
  });
  filter.oninput = () => {
    const query = filter.value.trim().toLowerCase();
    list.querySelectorAll(".custom-model-option").forEach((row) => {
      row.hidden = !row.dataset.modelId.includes(query);
    });
  };
};
$("#cm-add").onclick = async () => {
  if (!$("#cm-name").value || !$("#cm-base").value || !$("#cm-model").value) { status("name, base URL and model id required"); return; }
  const res = await postJSON("/api/custom-models", {
    name: $("#cm-name").value, base: $("#cm-base").value,
    key: "", model: $("#cm-model").value });
  if (res.ok) {
    saveLocalModelVault({ custom_models: res.custom_models || [res.model] });
    await reloadState();
    renderCustomModels();
    status(`🔒 Custom API model "${res.model.name}" added & permanently locked in Vault!`);
    ["#cm-name", "#cm-base", "#cm-model"].forEach((i) => $(i).value = "");
  }
};

function renderCustomGguf() {
  const sl = $("#cg-slot");
  if (sl && !sl.options.length && Array.isArray(STATE.slot_order)) {
    STATE.slot_order.forEach((s) => sl.appendChild(new Option(s, s)));
  }
  const l = $("#cg-list");
  if (!l) return;
  l.innerHTML = "";
  (STATE.custom_gguf || []).forEach((m) => {
    const r = document.createElement("div"); r.className = "hrow";
    r.innerHTML = `<span>📦</span><span style="font-weight:700">${esc(m.name)}</span><span class="muted">${esc(m.repo)} · ~${m.gb}GB · ${esc(m.slot || "chat")}</span><span class="badge" style="font-size:9.5px;background:rgba(16,185,129,.15);color:#6ee7b7">🔒 VAULT SAVED</span><span class="spacer"></span><button class="ghost sm" data-cg="${m.id}">✕</button>`;
    l.appendChild(r);
  });
  l.querySelectorAll("[data-cg]").forEach((b) => b.onclick = async () => {
    markModelDeletedInLocalVault(b.dataset.cg);
    await fetch("/api/custom-gguf/" + b.dataset.cg, { method: "DELETE" });
    await reloadState(); renderCustomGguf(); renderLineup(); status("custom lineup model removed");
  });
}

$("#cg-add").onclick = async () => {
  if (!$("#cg-name").value.trim() || !$("#cg-repo").value.trim()) { status("name + HF repo required"); return; }
  const res = await postJSON("/api/custom-gguf", {
    name: $("#cg-name").value.trim(), repo: $("#cg-repo").value.trim(),
    gb: +$("#cg-gb").value || 5, slot: $("#cg-slot").value || "uncensored",
    vision: $("#cg-vision").checked, gated: $("#cg-gated").checked });
  if (res.ok) {
    saveLocalModelVault({ custom_gguf: res.custom_gguf || [res.model] });
    await reloadState(); renderCustomGguf(); renderLineup();
    status(`🔒 "${res.model.name}" permanently locked in 4-Layer Vault & mounted to [${res.model.slot}] lineup!`);
    ["#cg-name", "#cg-repo"].forEach((i) => $(i).value = "");
  }
};

let _hfStartupSyncDone = false;

function populateModelsDropdownForSelectedBucket(bucketId) {
  const modelsSel = $("#hfb-models-dropdown");
  if (!modelsSel) return;
  const buckets = Array.isArray(STATE.hf_buckets) ? STATE.hf_buckets : [];
  const savedRepoSet = new Set((STATE.custom_gguf || []).map((m) => m.repo));
  const bkt = buckets.find((x) => x.id === bucketId) || buckets[0];
  if (!bkt) {
    modelsSel.innerHTML = `<option value="">(Select a linked bucket above to view its models)</option>`;
    return;
  }
  const models = Array.isArray(bkt.models) ? bkt.models : [];
  if (!models.length) {
    modelsSel.innerHTML = `<option value="">(0 models in "${esc(bkt.name)}" — upload .gguf/.safetensors to HF & click Rescan)</option>`;
    return;
  }
  modelsSel.innerHTML = models
    .map((m, idx) => {
      const isSaved = savedRepoSet.has(m.repo);
      const valJson = JSON.stringify({
        bucket_id: bkt.id,
        name: m.name,
        repo: m.repo,
        gb: m.gb || 5,
        slot: m.slot || "uncensored",
      });
      return `<option value='${esc(valJson)}' ${idx === 0 ? "selected" : ""}>${isSaved ? "✅ [LOCKED] " : "📦 "}${esc(m.name)} — ${esc(m.repo)} (~${m.gb || 5}GB)</option>`;
    })
    .join("");
}

function renderHfBuckets() {
  const buckets = Array.isArray(STATE.hf_buckets) ? STATE.hf_buckets : [];
  const savedRepoSet = new Set((STATE.custom_gguf || []).map((m) => m.repo));
  updateVaultLockBadgeUI();

  // 1. Sync Auto-Sync on Startup toggle & Last Sync badge
  const autoSyncToggle = $("#hfb-autosync-toggle");
  if (autoSyncToggle) {
    autoSyncToggle.checked = STATE.hf_auto_sync_on_startup !== false;
  }
  const lastSyncBadge = $("#hfb-last-sync-badge");
  if (lastSyncBadge) {
    if (STATE.hf_last_sync) {
      const d = new Date(STATE.hf_last_sync);
      const timeStr = isNaN(d.getTime()) ? String(STATE.hf_last_sync) : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      lastSyncBadge.textContent = `Auto-Sync: ${STATE.hf_auto_sync_on_startup !== false ? "ON" : "OFF"} · Last Sync ${timeStr}`;
    } else {
      lastSyncBadge.textContent = `Auto-Sync: ${STATE.hf_auto_sync_on_startup !== false ? "ON" : "OFF"} · ${buckets.length} Bucket(s)`;
    }
  }

  // 2. Populate Compact Scroll-Down Menu for Linked HF Buckets (#hfb-bucket-dropdown)
  const bucketSel = $("#hfb-bucket-dropdown");
  if (bucketSel) {
    const prevBid = bucketSel.value;
    if (!buckets.length) {
      bucketSel.innerHTML = `<option value="">(0 buckets linked — type [2] in Compute CLI above or use Add Models tab)</option>`;
    } else {
      bucketSel.innerHTML = buckets
        .map((b) => {
          const mCount = Array.isArray(b.models) ? b.models.length : 0;
          return `<option value="${esc(b.id)}">${esc(b.name)} (${esc(b.bucket_uri)}) — ${mCount} model(s)</option>`;
        })
        .join("");
      if (prevBid && buckets.some((b) => b.id === prevBid)) {
        bucketSel.value = prevBid;
      }
    }
    populateModelsDropdownForSelectedBucket(bucketSel.value);
  }

  // 3. Populate Compact Scroll-Down Menu for Saved Vault Models (#vault-saved-models-dropdown)
  const vaultSel = $("#vault-saved-models-dropdown");
  if (vaultSel) {
    const ggufs = Array.isArray(STATE.custom_gguf) ? STATE.custom_gguf : [];
    const apis = Array.isArray(STATE.custom_models) ? STATE.custom_models : [];
    if (!ggufs.length && !apis.length) {
      vaultSel.innerHTML = `<option value="">(0 custom models in Vault — import from Bucket or type [1] in Compute CLI)</option>`;
    } else {
      const ggufOpts = ggufs.map(
        (g) => `<option value="gguf:${esc(g.id)}">🔒 [GGUF · ${esc(g.slot || "auto")}] ${esc(g.name)} — ${esc(g.repo)} (~${g.gb || 5}GB)</option>`
      );
      const apiOpts = apis.map(
        (m) => `<option value="api:${esc(m.id)}">☁️ [API · ${esc(m.provider || "custom")}] ${esc(m.name)} — ${esc(m.model)}</option>`
      );
      vaultSel.innerHTML = [...ggufOpts, ...apiOpts].join("");
    }
  }

  // 4. Also render compact list inside legacy sub-pane (#hfb-linked-buckets-wrap) if open
  const wrap = $("#hfb-linked-buckets-wrap");
  if (wrap) {
    if (!buckets.length) {
      wrap.innerHTML = `<div class="muted" style="font-size:11.5px">No Hugging Face Buckets linked yet. Enter your bucket URI above (e.g. <code>hf://buckets/username/bucket</code> or <code>username/repo</code>) and click <strong>Link &amp; Scan Bucket</strong>.</div>`;
    } else {
      wrap.innerHTML = buckets
        .map((b) => {
          const models = Array.isArray(b.models) ? b.models : [];
          return `
            <div class="hrow" style="padding:6px 10px;background:var(--bg1);border:1px solid var(--border-subtle);border-radius:6px;gap:8px;flex-wrap:wrap">
              <strong style="font-size:12px">${esc(b.name)}</strong>
              <code class="muted" style="font-size:11px">${esc(b.bucket_uri)}</code>
              <span class="badge" style="font-size:10px">${models.length} model(s)</span>
              <span class="spacer"></span>
              <button type="button" class="primary xs hfb-import-all-btn" data-bid="${esc(b.id)}" ${!models.length ? "disabled" : ""}>Import All (${models.length})</button>
              <button type="button" class="ghost xs hfb-rescan-btn" data-buri="${esc(b.bucket_uri)}" data-bname="${esc(b.name)}">Rescan</button>
              <button type="button" class="ghost xs hfb-del-btn" data-bid="${esc(b.id)}">✕</button>
            </div>
          `;
        })
        .join("");

      wrap.querySelectorAll(".hfb-import-all-btn").forEach((btn) => {
        btn.onclick = async () => {
          const bid = btn.dataset.bid;
          const bkt = (STATE.hf_buckets || []).find((x) => x.id === bid);
          if (!bkt || !Array.isArray(bkt.models) || !bkt.models.length) return;
          btn.disabled = true;
          const res = await postJSON("/api/hf-buckets/import", { bucket_id: bid, models: bkt.models });
          btn.disabled = false;
          if (res?.ok) {
            saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
            await reloadState();
            status(`🔒 Imported & locked ${res.imported_count} model(s) from "${bkt.name}"!`);
          }
        };
      });
      wrap.querySelectorAll(".hfb-rescan-btn").forEach((btn) => {
        btn.onclick = async () => {
          if ($("#hfb-uri")) $("#hfb-uri").value = btn.dataset.buri || "";
          if ($("#hfb-name")) $("#hfb-name").value = btn.dataset.bname || "";
          await handleLinkHfBucket(false);
        };
      });
      wrap.querySelectorAll(".hfb-del-btn").forEach((btn) => {
        btn.onclick = async () => {
          const bid = btn.dataset.bid;
          markModelDeletedInLocalVault(bid);
          await fetch(`/api/hf-buckets/${encodeURIComponent(bid)}`, { method: "DELETE" });
          await reloadState();
          status("Hugging Face Bucket unlinked");
        };
      });
    }
  }
}

async function runStartupHfBucketAutoSyncIfEnabled() {
  if (_hfStartupSyncDone) return;
  if (!STATE || STATE.hf_auto_sync_on_startup === false) return;
  const buckets = Array.isArray(STATE?.hf_buckets) ? STATE.hf_buckets : [];
  if (!buckets.length) return;
  _hfStartupSyncDone = true;
  try {
    const res = await postJSON("/api/hf-buckets/sync-all", { auto_import_new: true });
    if (res?.ok) {
      saveLocalModelVault({
        hf_buckets: res.buckets || [],
        custom_gguf: res.custom_gguf || [],
      });
      await reloadState();
      status(`🔄 Auto-Sync complete: Pulled latest metadata & weights across ${res.synced_buckets || buckets.length} linked HF Bucket(s) (${res.total_models_discovered || 0} models verified).`);
    }
  } catch (_) {}
}

// Bind Compact Scroll-Down HF Bucket & Vault Controls
$("#hfb-bucket-dropdown")?.addEventListener("change", (e) => {
  populateModelsDropdownForSelectedBucket(e.target.value);
});

$("#hfb-autosync-toggle")?.addEventListener("change", async (e) => {
  const enabled = Boolean(e.target.checked);
  const res = await postJSON("/api/hf-buckets/auto-sync", { enabled });
  if (res?.ok) {
    STATE.hf_auto_sync_on_startup = res.auto_sync_on_startup;
    renderHfBuckets();
    status(`🔄 Hugging Face Bucket Auto-Sync on Startup: ${enabled ? "ENABLED" : "DISABLED"}`);
  }
});

$("#hfb-sync-all-now-btn")?.addEventListener("click", async () => {
  const btn = $("#hfb-sync-all-now-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Syncing…";
  }
  try {
    const res = await postJSON("/api/hf-buckets/sync-all", { auto_import_new: true });
    if (res?.ok) {
      saveLocalModelVault({
        hf_buckets: res.buckets || [],
        custom_gguf: res.custom_gguf || [],
      });
      await reloadState();
      status(`🔄 Synced ${res.synced_buckets || 0} HF Bucket(s) — ${res.total_models_discovered || 0} model(s) discovered, ${res.newly_imported_count || 0} new model(s) locked in Vault.`);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "🔄 Sync All Now";
    }
  }
});

$("#hfb-rescan-selected-btn")?.addEventListener("click", async () => {
  const bid = $("#hfb-bucket-dropdown")?.value;
  const bkt = (STATE.hf_buckets || []).find((x) => x.id === bid);
  if (!bkt) {
    status("Select a linked Hugging Face Bucket from the dropdown first.");
    return;
  }
  status(`🔄 Rescanning HF Bucket "${bkt.name}" (${bkt.bucket_uri})…`);
  const res = await postJSON("/api/hf-buckets/link", {
    bucket_uri: bkt.bucket_uri,
    name: bkt.name,
    slot: "auto",
    auto_import_top: false,
  });
  if (res?.ok) {
    saveLocalModelVault({ hf_buckets: res.buckets || [], custom_gguf: res.custom_gguf || [] });
    await reloadState();
    status(`✅ Rescanned "${bkt.name}" — ${res.bucket?.models?.length || 0} real model(s) found in bucket.`);
  }
});

$("#hfb-unlink-selected-btn")?.addEventListener("click", async () => {
  const bid = $("#hfb-bucket-dropdown")?.value;
  if (!bid) {
    status("No Hugging Face Bucket selected to unlink.");
    return;
  }
  markModelDeletedInLocalVault(bid);
  await fetch(`/api/hf-buckets/${encodeURIComponent(bid)}`, { method: "DELETE" });
  await reloadState();
  status("🗑️ Unlinked selected Hugging Face Bucket.");
});

$("#hfb-import-selected-model-btn")?.addEventListener("click", async () => {
  const raw = $("#hfb-models-dropdown")?.value;
  if (!raw) {
    status("Select a model from the Bucket Models scroll-down menu first.");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const res = await postJSON("/api/hf-buckets/import", {
      bucket_id: parsed.bucket_id,
      model: parsed,
    });
    if (res?.ok) {
      saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
      await reloadState();
      status(`🔒 Imported & locked "${parsed.name}" (${parsed.repo}) into Suomynona Council!`);
    }
  } catch (_) {}
});

$("#hfb-import-all-bucket-btn")?.addEventListener("click", async () => {
  const bid = $("#hfb-bucket-dropdown")?.value;
  const bkt = (STATE.hf_buckets || []).find((x) => x.id === bid);
  if (!bkt || !Array.isArray(bkt.models) || !bkt.models.length) {
    status("Selected bucket has 0 models to import.");
    return;
  }
  const res = await postJSON("/api/hf-buckets/import", {
    bucket_id: bid,
    models: bkt.models,
  });
  if (res?.ok) {
    saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
    await reloadState();
    status(`🔥 Imported & locked all ${res.imported_count} model(s) from "${bkt.name}"!`);
  }
});

$("#vault-delete-selected-model-btn")?.addEventListener("click", async () => {
  const val = $("#vault-saved-models-dropdown")?.value || "";
  if (!val) return;
  const [kind, id] = val.split(":");
  if (!id) return;
  markModelDeletedInLocalVault(id);
  if (kind === "gguf") {
    await fetch(`/api/custom-gguf/${encodeURIComponent(id)}`, { method: "DELETE" });
  } else {
    await fetch(`/api/custom-models/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
  await reloadState();
  status(`🗑️ Removed model ${id} from Vault.`);
});

async function handleLinkHfBucket(autoImportTop = false) {
  const uri = ($("#hfb-uri")?.value || "").trim();
  const name = ($("#hfb-name")?.value || "").trim();
  const slot = $("#hfb-slot")?.value || "auto";
  const token = ($("#hfb-token")?.value || "").trim();
  if (!uri) {
    status("Enter a Hugging Face Bucket URI, username/org, or repo first!");
    return;
  }
  const btn = autoImportTop ? $("#hfb-link-import-btn") : $("#hfb-link-btn");
  const origTxt = btn?.textContent || "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Scanning HF Bucket…";
  }
  try {
    const res = await postJSON("/api/hf-buckets/link", {
      bucket_uri: uri,
      name,
      slot,
      hf_token: token,
      auto_import_top: autoImportTop,
      auto_import_count: 5,
    });
    if (res?.ok) {
      saveLocalModelVault({
        hf_buckets: res.buckets || [],
        custom_gguf: res.custom_gguf || [],
      });
      await reloadState();
      const foundCount = res.bucket?.models?.length || 0;
      status(
        foundCount === 0
          ? `🤗 Linked bucket "${res.bucket?.name}" (${res.bucket?.bucket_uri}) — 0 model files currently in bucket.`
          : autoImportTop
          ? `🤗 Linked "${res.bucket?.name}" & imported ${res.imported?.length || foundCount} real model(s) into Suomynona Council!`
          : `🤗 Linked Hugging Face Bucket "${res.bucket?.name}" (${foundCount} real model(s) found & listed in scroll-down menu)!`
      );
    } else {
      status(`❌ HF Bucket error: ${res?.error || "could not link bucket"}`);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = origTxt;
    }
  }
}

$("#hfb-link-btn")?.addEventListener("click", () => handleLinkHfBucket(false));
$("#hfb-link-import-btn")?.addEventListener("click", () => handleLinkHfBucket(true));

$("#hf-vault-force-sync-btn")?.addEventListener("click", async () => {
  const localV = saveLocalModelVault();
  const res = await postJSON("/api/models/rehydrate-vault", {
    custom_gguf: STATE.custom_gguf || localV?.custom_gguf || [],
    custom_models: STATE.custom_models || localV?.custom_models || [],
    hf_buckets: STATE.hf_buckets || localV?.hf_buckets || [],
  });
  if (res?.ok) {
    await reloadState();
    status(`🔒 Verified & locked ${(res.custom_gguf || []).length} GGUF models, ${(res.custom_models || []).length} API models & ${(res.hf_buckets || []).length} HF Buckets!`);
  }
});

const TOOL_TYPE_PLACEHOLDERS = {
  shell_cmd: "Shell command template (use {{input}} for agent argument, e.g. nmap -sV {{input}} or ls -la {{input}})",
  python_script: "Python 3 one-liner or script path (e.g. import socket; print(socket.gethostbyname('{{input}}')))",
  node_script: "Node.js / JS snippet (e.g. console.log(Buffer.from('{{input}}').toString('base64')))",
  mcp_bridge: "MCP Server ID & Tool (e.g. mcp_cyberchef:bake or mcp_nmap_recon:port_scan)",
  filesystem_op: "Target directory or file path template (e.g. ./council_outputs/{{input}})",
  sql_query: "SQLite / SQL query template (e.g. SELECT name, type FROM sqlite_master WHERE type='table';)",
  osint_recon: "Target domain/host template for DNS & WHOIS lookup (e.g. {{input}})",
  browser_scrape: "Target URL template to scrape DOM text & links (e.g. https://{{input}})",
  webget: "Target URL prefix or leave blank for arbitrary URL fetching",
  http: "Webhook POST URL (e.g. https://api.example.com/webhook)",
};

$("#ct-type")?.addEventListener("change", () => {
  const t = $("#ct-type")?.value || "shell_cmd";
  const urlInp = $("#ct-url");
  if (urlInp && TOOL_TYPE_PLACEHOLDERS[t]) {
    urlInp.placeholder = TOOL_TYPE_PLACEHOLDERS[t];
  }
});

function renderTools() {
  const l = $("#ct-list");
  if (!l) return;
  l.innerHTML = "";
  (STATE.tools || []).forEach((t) => {
    const r = document.createElement("div");
    r.className = "hrow";
    r.innerHTML = `
      <span>🧰</span>
      <strong>${esc(t.name)}</strong>
      <span class="badge" style="font-size:10px">${esc(t.type)}</span>
      <code class="muted" style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:340px">${esc(t.command || t.url || "(dynamic input)")}</code>
      <span class="spacer"></span>
      <button class="ghost xs" data-ct-test="${esc(t.id)}">▶ Test</button>
      <button class="ghost xs" data-ct="${esc(t.id)}">✕</button>
    `;
    l.appendChild(r);
  });
  l.querySelectorAll("[data-ct-test]").forEach((b) => {
    b.onclick = async () => {
      const tid = b.dataset.ctTest;
      const tool = (STATE.tools || []).find((x) => x.id === tid);
      if (!tool) return;
      b.disabled = true;
      b.textContent = "⏳…";
      const res = await postJSON("/api/tools/test", {
        type: tool.type,
        command: tool.command || tool.url,
        url: tool.url,
        test_input: "127.0.0.1",
      });
      b.disabled = false;
      b.textContent = "▶ Test";
      status(`🧰 Tool "${tool.name}" (${tool.type}) output: ${String(res?.output || res?.error || "ok").slice(0, 140)}`);
    };
  });
  l.querySelectorAll("[data-ct]").forEach((b) => {
    b.onclick = async () => {
      await fetch("/api/tools/" + b.dataset.ct, { method: "DELETE" });
      await reloadState();
      renderTools();
      status("Tool removed");
    };
  });
}

$("#ct-add").onclick = async () => {
  const name = ($("#ct-name")?.value || "").trim();
  const type = $("#ct-type")?.value || "shell_cmd";
  const urlOrCmd = ($("#ct-url")?.value || "").trim();
  const desc = ($("#ct-desc")?.value || "").trim();
  if (!name) {
    status("Tool name required");
    return;
  }
  if (type === "http" && !urlOrCmd) {
    status("HTTP Webhook requires a target URL");
    return;
  }
  const res = await postJSON("/api/tools", {
    name,
    type,
    url: urlOrCmd,
    command: urlOrCmd,
    description: desc,
  });
  if (res.ok) {
    await reloadState();
    renderTools();
    status(`🧰 Custom tool "${res.tool.name}" [${res.tool.type}] created & available to all Agents!`);
    ["#ct-name", "#ct-url", "#ct-desc"].forEach((sel) => {
      if ($(sel)) $(sel).value = "";
    });
  }
};

$("#ct-test-btn")?.addEventListener("click", async () => {
  const type = $("#ct-type")?.value || "shell_cmd";
  const urlOrCmd = ($("#ct-url")?.value || "").trim();
  status(`🧪 Testing [${type}] tool execution…`);
  const res = await postJSON("/api/tools/test", {
    type,
    command: urlOrCmd,
    url: urlOrCmd,
    test_input: "localhost",
  });
  status(`🧪 Tool Test (${type}): ${String(res?.output || res?.error || "Done").slice(0, 160)}`);
});

function renderMcp() {
  const l = $("#mc-list");
  if (!l) return;
  l.innerHTML = "";
  const outBox = $("#mc-live-test-output");
  const logMcpOut = (msg) => {
    if (outBox) {
      const ts = new Date().toISOString().slice(11, 19);
      outBox.textContent = `[${ts}] ${msg}\n` + (outBox.textContent || "").slice(0, 4000);
    }
    if (typeof pushClientLiveConsole === "function") {
      pushClientLiveConsole("MCP", msg);
    }
  };
  const servers = (STATE.mcp && STATE.mcp.length) ? STATE.mcp : BUILTIN_MCP_SERVERS_CLIENT;
  servers.forEach((s) => {
    const r = document.createElement("div");
    r.className = "hrow";
    const subTools = (s.tools || []).map((t) => typeof t === "string" ? t : t.name);
    r.innerHTML = `
      <span>${esc(s.icon || "🔌")}</span>
      <span style="font-weight:700;color:#e2e8f0">${esc(s.title || s.name)}</span>
      ${s.category ? `<span class="badge" style="font-size:10px;background:rgba(56,189,248,.14);color:#38bdf8;border:1px solid rgba(56,189,248,.35)">${esc(s.category)}</span>` : ""}
      <span class="muted" style="font-size:11px">${esc(s.description || `${s.command || ""} ${(s.args || []).join(" ")}`).slice(0, 90)}</span>
      <span class="spacer"></span>
      <button class="ghost sm" type="button" data-mc-test="${esc(s.id)}" data-mc-tool="${esc(subTools[0] || "status")}">⚡ Test Live</button>
      <button class="ghost sm" type="button" data-mc-ls="${esc(s.id)}">${subTools.length ? `${subTools.length} tools` : "list tools"}</button>
      ${s.builtin ? `<span class="badge" style="font-size:10px;background:rgba(16,185,129,.15);color:#6ee7b7">BUILT-IN</span>` : `<button class="ghost sm" type="button" data-mc="${esc(s.id)}">✕</button>`}
    `;
    l.appendChild(r);
  });
  l.querySelectorAll("[data-mc]").forEach((b) => b.onclick = async () => {
    await fetch("/api/mcp/" + b.dataset.mc, { method: "DELETE" });
    await reloadState(); renderMcp(); status("MCP server removed");
  });
  l.querySelectorAll("[data-mc-test]").forEach((b) => b.onclick = async () => {
    const orig = b.textContent;
    const srvId = b.dataset.mcTest;
    const toolName = b.dataset.mcTool || "status";
    b.textContent = "⏳…";
    try {
      const res = await postJSON("/api/mcp/call", {
        server_id: srvId,
        tool: toolName,
        args: { target: "/app/applet", path: ".", query: "status check" }
      });
      const payloadStr = String(res?.output ?? (res?.result ? JSON.stringify(res.result) : "") ?? "OK");
      const elapsed = res?.elapsed_ms ?? 1;
      b.textContent = res?.ok ? `✅ OK (${elapsed}ms)` : "⚠️ Error";
      b.title = res?.ok ? payloadStr.slice(0, 400) : (res?.error || "failed");
      const summary = res?.ok
        ? `✅ MCP [${srvId} → ${ res.tool || toolName }] (${elapsed}ms): ${payloadStr.replace(/\s+/g, " ").slice(0, 260)}`
        : `❌ MCP [${srvId}] Error: ${res?.error || "unknown error"}`;
      logMcpOut(summary);
      status(summary.slice(0, 140));
    } catch (err) {
      b.textContent = "⚠️ Error";
      logMcpOut(`❌ MCP [${srvId}] Exception: ${err.message || err}`);
    }
    setTimeout(() => { b.textContent = orig; }, 3500);
  });
  l.querySelectorAll("[data-mc-ls]").forEach((b) => b.onclick = async () => {
    const srvId = b.dataset.mcLs;
    b.textContent = "…";
    try {
      const res = await postJSON(`/api/mcp/${srvId}/list-tools`, {});
      const toolsArr = Array.isArray(res?.tools) ? res.tools : [];
      b.textContent = res?.ok ? `${toolsArr.length} tools` : "failed";
      const toolNames = toolsArr.map((t) => (typeof t === "string" ? t : `${t.name}${t.description ? ": " + t.description : ""}`));
      b.title = res?.ok ? toolNames.join("\n") : (res?.error || "failed");
      logMcpOut(`🔧 MCP [${srvId}] Tools (${toolsArr.length}): ${toolNames.join(" | ")}`);
    } catch (err) {
      b.textContent = "failed";
      logMcpOut(`❌ MCP [${srvId}] list-tools failed: ${err.message || err}`);
    }
  });
  const testAllBtn = $("#mc-test-all-btn");
  if (testAllBtn && !testAllBtn.dataset.boundMcpAll) {
    testAllBtn.dataset.boundMcpAll = "1";
    testAllBtn.addEventListener("click", async () => {
      const orig = testAllBtn.textContent;
      testAllBtn.disabled = true;
      testAllBtn.textContent = "⏳ Probing All MCP Servers…";
      try {
        const srvList = (STATE.mcp && STATE.mcp.length) ? STATE.mcp : BUILTIN_MCP_SERVERS_CLIENT;
        const calls = srvList.map((s) => {
          const firstTool = (s.tools || []).map((t) => typeof t === "string" ? t : t.name)[0] || "status";
          return { server_id: s.id, tool: firstTool, args: { target: "/app/applet", path: ".", query: "health" } };
        });
        const res = await postJSON("/api/mcp/batch-call", { calls });
        if (res?.ok && Array.isArray(res.results)) {
          const okCount = res.results.filter((r) => r.ok).length;
          const lines = res.results.map((r) => `  • [${r.server_id}::${r.tool}] (${r.elapsed_ms ?? 1}ms): ${String(r.output || r.result || "OK").replace(/\s+/g, " ").slice(0, 140)}`);
          logMcpOut(`⚡ BATCH TEST COMPLETE: ${okCount}/${res.results.length} MCP servers operational (${res.elapsed_ms ?? 2}ms total)\n${lines.join("\n")}`);
          status(`✅ All ${okCount}/${res.results.length} MCP servers verified live!`);
        } else {
          logMcpOut(`⚠️ Batch test response: ${JSON.stringify(res)}`);
        }
      } catch (err) {
        logMcpOut(`❌ Batch MCP test error: ${err.message || err}`);
      } finally {
        testAllBtn.disabled = false;
        testAllBtn.textContent = orig;
      }
    });
  }
}
$("#mc-add").onclick = async () => {
  if (!$("#mc-name").value.trim() || !$("#mc-cmd").value.trim()) { status("name + command required"); return; }
  const res = await postJSON("/api/mcp", {
    name: $("#mc-name").value.trim(), command: $("#mc-cmd").value.trim(),
    args: $("#mc-args").value.split(/\s+/).filter(Boolean) });
  if (res.ok) { await reloadState(); renderMcp(); status("MCP server added — enable 🔗 MCP on an agent");
    ["#mc-name", "#mc-cmd", "#mc-args"].forEach((i) => $(i).value = ""); }
};

// ── system ──
const KEY_FIELDS = [["HF_TOKEN", "Hugging Face token (optional on PC — Colab uses its vault)"],
  ["GH_TOKEN", "GitHub token (classic, gist scope)"], ["GIST_ID", "Gist ID (auto-managed)"],
  ["GH_USERNAME", "GitHub username"], ["OPENAI_API_KEY", "OpenAI key (optional)"],
  ["XAI_API_KEY", "xAI Grok key (optional)"], ["GEMINI_API_KEY", "Gemini key (optional)"],
  ["OPENROUTER_API_KEY", "OpenRouter key (optional)"]];
function renderKeys() {
  const g = $("#keys-grid"); if (!g) return; g.innerHTML = "";
  KEY_FIELDS.forEach(([k, label]) => {
    const w = document.createElement("div");
    const isSet = STATE.keys_ok && STATE.keys_ok[k];
    w.innerHTML = `<label>${label}</label><div class="muted" style="padding:6px 0">${isSet ? "🟢 Configured via Server Environment" : "⚪ Managed via Environment Secrets"}</div>`;
    g.appendChild(w);
  });
}
$("#signin-btn").onclick = async () => { await postJSON("/api/colab-signin", {}); status("sign-in window opened — pick your Pro Gmail there"); };
$("#signin-reset-btn").onclick = async () => { await postJSON("/api/colab-signin/reset", {}); status("automation profile wiped - sign in fresh next time"); };
$("#cli-signin-btn")?.addEventListener("click", async () => { await postJSON("/api/colab-signin", {}); status("sign-in window opened — pick your Pro Gmail there"); });
$("#cli-signin-reset-btn")?.addEventListener("click", async () => { await postJSON("/api/colab-signin/reset", {}); status("automation profile wiped - sign in fresh next time"); });
$("#cli-install-autorun-btn")?.addEventListener("click", async () => {
  status("Installing auto-run Chromium browser (watch console)…");
  await postJSON("/api/install-autorun", {});
});
$("#cli-troubleshoot-btn")?.addEventListener("click", async () => {
  const out = $("#cli-out");
  if (out) appendTypedTerminalBlock(out, "colab> Running Colab/Kaggle Runtime Troubleshooter…", { color: "#00d4ff", instant: true });
  const res = await postJSON("/api/colab/troubleshoot", {}).catch((e) => ({ ok: false, error: String(e) }));
  if (out) appendTypedTerminalBlock(out, JSON.stringify(res, null, 2), { color: res.ok ? "#2ee6a6" : "#ffcc66" });
});
async function authenticateColabHost(hostId, label) {
  const id = String(hostId || "a").toLowerCase();
  const out = $("#cli-out") || $("#guardian-out");
  if (out) {
    appendTypedTerminalBlock(out, `colab> Authenticating & verifying ${label} (Host ${id.toUpperCase()})…`, {
      color: "#00d4ff",
      instant: true,
    });
  }
  try {
    const res = await postJSON(`/api/cli-reauth/${encodeURIComponent(id)}`, {});
    if (out && (res.output || res.message)) {
      appendTypedTerminalBlock(out, res.output || res.message, {
        color: res.ok ? "#2ee6a6" : "#ffcc66",
      });
    }
    const hostOut = document.getElementById(`cli-out-${id}`);
    if (hostOut && (res.output || res.message)) {
      appendTypedTerminalBlock(hostOut, res.output || res.message, {
        color: res.ok ? "#2ee6a6" : "#ffcc66",
      });
    }
    if (res.ok) {
      markHostStatusGreen(id, res);
      status(`🟢 ${label} authenticated & verified (${res.provider?.toUpperCase() || "COLAB"} · ${res.accelerator || "GPU"})`);
    } else {
      status(`${label} authentication failed: ${res.error || "unknown error"}`);
      handleHostConnectionFailure(id, res.error || "authentication failed");
    }
  } catch (err) {
    status(`${label} authentication failed: ${err.message || err}`);
    handleHostConnectionFailure(id, err.message || String(err));
  }
  await reloadState().catch(() => {});
  await renderColabHosts().catch(() => {});
}
$("#cli-reauth-a")?.addEventListener("click", () => authenticateColabHost("a", "Host A"));
$("#cli-reauth-b")?.addEventListener("click", () => authenticateColabHost("b", "Host B"));
$("#cli-reauth-c")?.addEventListener("click", () => authenticateColabHost("c", "Host C"));
$("#cli-reauth-btn")?.addEventListener?.("click", async () => { await postJSON("/api/cli-reauth", {}); status("CLI token cleared - re-pick the Pro account on next launch"); });

// Lineup Integrated Host & Accelerator Authentication Mode Controls
$("#lineup-auth-a")?.addEventListener("click", async () => {
  await authenticateColabHost("a", "Host A");
  renderLineup();
});
$("#lineup-auth-b")?.addEventListener("click", async () => {
  await authenticateColabHost("b", "Host B");
  renderLineup();
});
$("#lineup-auth-c")?.addEventListener("click", async () => {
  await authenticateColabHost("c", "Host C");
  renderLineup();
});
$("#lineup-auth-all-hosts-btn")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const host_configs = collectHostHardwareConfigsFromDOM();
    persistHostHardwareToLocalStorage(host_configs);
    const hosts = STATE?.runtime_hosts || STATE?.colab_hosts || [{ id: "a" }, { id: "b" }, { id: "c" }];
    for (const h of hosts) {
      const cfg = host_configs.find((c) => c.id === h.id) || h;
      await postJSON(`/api/runtime-auth/${encodeURIComponent(h.id)}`, {
        provider: cfg.provider || h.provider || "colab",
        accelerator: cfg.accelerator || h.accelerator || "T4",
        high_memory: Boolean(cfg.high_memory ?? h.high_memory),
        custom_url: cfg.custom_url || h.custom_url || "",
        all_accelerators: true,
      });
    }
    await syncCrossSessionHardwareAndIntelligence({ forceHardware: true });
    await reloadState();
    renderLineup();
    const msg = "🟢 Authenticated Host A, Host B & Host C across all GPU accelerators (T4, L4, G4, A100, H100) and saved for next sessions!";
    const banner = $("#lineup-auth-status-banner");
    if (banner) banner.textContent = msg;
    status(msg);
  } finally {
    btn.disabled = false;
  }
});
$("#lineup-browser-signin")?.addEventListener("click", async () => {
  await postJSON("/api/colab-signin", {});
  const msg = "🌐 Automated Google Colab Browser Sign-In profile opened — pick your Pro Gmail account";
  if ($("#lineup-auth-status-banner")) $("#lineup-auth-status-banner").textContent = msg;
  status(msg);
});
$("#lineup-autorun-browser")?.addEventListener("click", async () => {
  const msg = "📦 Installing / launching Auto-Run Chromium browser for Colab hosts…";
  if ($("#lineup-auth-status-banner")) $("#lineup-auth-status-banner").textContent = msg;
  status(msg);
  await postJSON("/api/install-autorun", {});
});
$("#lineup-reauth")?.addEventListener("click", async () => {
  await postJSON("/api/cli-reauth", {});
  const msg = "🧹 Cleared cached Colab OAuth token — ready to authenticate with a fresh account";
  if ($("#lineup-auth-status-banner")) $("#lineup-auth-status-banner").textContent = msg;
  status(msg);
});
$("#lineup-oauth-submit")?.addEventListener("click", async () => {
  const inp = $("#lineup-oauth-code");
  const code = inp?.value.trim() || "";
  if (!code) {
    status("Paste a Google OAuth authorization code or https://*.trycloudflare.com URL first");
    return;
  }
  const activeHost = window._activeLineupHostId || "a";
  const res = await postJSON("/api/cli-code/submit", { code, host: activeHost });
  if (res.ok) {
    if (inp) inp.value = "";
    await authenticateColabHost(activeHost, `Host ${String(activeHost).toUpperCase()}`);
    renderLineup();
    const msg = `🟢 Bound OAuth / Tunnel to Host ${String(activeHost).toUpperCase()} and verified accelerator!`;
    if ($("#lineup-auth-status-banner")) $("#lineup-auth-status-banner").textContent = msg;
    status(msg);
  } else {
    status("OAuth / Tunnel submit failed: " + (res.error || "unknown error"));
  }
});
$("#lineup-oauth-code")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#lineup-oauth-submit")?.click();
});

$("#stop-all-btn").onclick = async () => {
  const button = $("#stop-all-btn");
  button.disabled = true;
  try {
    const res = await postJSON("/api/cli/stop-all", {});
    const out = $("#cli-out");
    (res.hosts || []).forEach(host => {
      const hostOut = document.getElementById(`cli-out-${host.host}`);
      const line = `${host.name}: confirmed stopped ${host.stopped.length} runtime(s)`
        + (host.errors.length ? ` · errors: ${host.errors.join("; ")}` : "");
      if (hostOut) appendTypedTerminalBlock(hostOut, line, { color: "#ffcc66" });
      if (out) appendTypedTerminalBlock(out, line, { color: "#ffcc66" });
    });
    status(res.ok ? `confirmed stopped ${res.count} runtime(s)`
            : `Confirmed ${res.count} stop(s); some runtimes remain active or could not be verified.`);
    await renderColabHosts();
  } catch (error) {
    status("Stop all failed: " + error);
  } finally {
    button.disabled = false;
  }
};
$("#cli-code-submit").onclick = async () => {
  const code = $("#cli-code").value.trim();
  if (!code) { status("paste the authorization code first"); return; }
  const res = await postJSON("/api/cli-code/submit", { code });
  if (res.ok) { $("#cli-code").value = ""; status("code submitted — VM continues (watch console)"); }
  else status("code submit failed: " + res.error);
};
$("#cli-code").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#cli-code-submit").click(); });
$("#cli-code-submit-view")?.addEventListener("click", async () => {
  const inp = $("#cli-code-view");
  const code = inp?.value.trim() || "";
  if (!code) { status("paste the authorization code first"); return; }
  const res = await postJSON("/api/cli-code/submit", { code });
  if (res.ok) {
    if (inp) inp.value = "";
    if ($("#cli-out")) appendTypedTerminalBlock($("#cli-out"), "✅ OAuth code submitted — runtime continuing.", { color: "#2ee6a6" });
    status("code submitted — VM continues (watch console)");
  } else {
    status("code submit failed: " + res.error);
  }
});
$("#cli-code-view")?.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#cli-code-submit-view")?.click(); });
$("#install-autorun-btn").onclick = async () => {
  $("#autorun-info").textContent = "installing (one-time download, watch the console)…";
  await postJSON("/api/install-autorun", {});
};
function renderCloudToggles() {
  const s = STATE.settings;
  const row = $("#cloud-toggles"); row.innerHTML = "";
  const master = document.createElement("button");
  master.className = "chip" + (s.cloud_global ? " on" : "");
  master.textContent = s.cloud_global ? "☁ cloud: ON" : "☁ cloud: OFF";
  master.onclick = async () => {
    const res = await postJSON("/api/settings", { cloud_global: !s.cloud_global });
    STATE.settings = res.settings; renderCloudToggles(); await reloadState();
  };
  row.appendChild(master);
  Object.entries(s.cloud).forEach(([pk, on]) => {
    const b = document.createElement("button");
    b.className = "chip" + (on ? " on" : "");
    b.textContent = pk + (on ? " ✓" : " ✕");
    b.onclick = async () => {
      const res = await postJSON("/api/settings", { cloud: { [pk]: !on } });
      STATE.settings = res.settings; renderCloudToggles(); await reloadState();
    };
    row.appendChild(b);
  });
}
if ($("#keys-save")) $("#keys-save").onclick = async () => {
  const updates = {};
  $$("#keys-grid input").forEach((i) => { if (i.value.trim()) updates[i.dataset.key] = i.value; });
  if (!Object.keys(updates).length) { status("nothing to save"); return; }
  await postJSON("/api/keys", updates);
  await reloadState(); renderKeys();
  status("keys saved");
};
async function runHealth() {
  $("#health-table").innerHTML = "<span class='muted'>checking…</span>";
  const rows = await (await fetch("/api/health")).json();
  $("#health-table").innerHTML = rows.map((r) =>
    `<div class="hrow"><span>${r.ok ? "🟢" : "🔴"}</span><span>${esc(r.name)}</span><span class="muted">${esc(r.detail || "")}</span></div>`).join("");
}
$("#health-refresh").onclick = runHealth;
$("#reload-btn").onclick = async () => {
  const res = await postJSON("/api/backends/reload", {});
  $("#reload-info").textContent = res.ok ? `${res.count} backends` : "failed";
  await reloadState();
};

// auto-grow prompt, Up/Down recent prompt history cycling, /prompt /cmd /pwsh /python /bash shell cycling & enter-to-send
const promptEl = $("#prompt");
promptEl.addEventListener("input", () => {
  const minH = Number(window._userComposerHeightPx) || 56;
  promptEl.style.height = "auto";
  promptEl.style.height = Math.max(minH, Math.min(promptEl.scrollHeight, 520)) + "px";
});
promptEl.addEventListener("keydown", (e) => {
  const valTrim = (promptEl.value || "").trim();

  // Check if user typed /prompt, /cmd, /pwsh, /python, /go, or /bash and hit Enter or Tab
  if ((e.key === "Enter" || e.key === "Tab") && !e.shiftKey) {
    const shellMatch = valTrim.match(/^\/(prompt|cmd|pwsh|powershell|python|py|go|golang|bash|sh)(?:\s+(.*))?$/i);
    if (shellMatch) {
      e.preventDefault();
      const rawShell = shellMatch[1].toLowerCase();
      const remainder = (shellMatch[2] || "").trim();
      const targetShell =
        rawShell === "prompt"
          ? "prompt"
          : rawShell === "pwsh" || rawShell === "powershell"
          ? "pwsh"
          : rawShell === "python" || rawShell === "py"
          ? "python"
          : rawShell === "go" || rawShell === "golang"
          ? "go"
          : rawShell === "cmd"
          ? "cmd"
          : "bash";

      if (targetShell === "prompt") {
        if (typeof window.setAndSyncComposerShell === "function") window.setAndSyncComposerShell("prompt");
        promptEl.value = remainder;
        promptEl.dispatchEvent(new Event("input"));
        return;
      } else {
        promptEl.value = "";
        promptEl.dispatchEvent(new Event("input"));
        if (typeof window.setAndSyncComposerShell === "function") {
          window.setAndSyncComposerShell(targetShell);
        }
        if (remainder && $("#composer-inplace-term-input")) {
          $("#composer-inplace-term-input").value = remainder;
          $("#composer-inplace-term-send")?.click();
        }
        return;
      }
    }
  }

  // Up / Down key cycles through most recent prompts entered
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    const beforeCursor = promptEl.value.slice(0, promptEl.selectionStart || 0);
    const afterCursor = promptEl.value.slice(promptEl.selectionEnd || 0);
    const onFirstLine = !beforeCursor.includes("\n");
    const onLastLine = !afterCursor.includes("\n");
    const shouldCycle =
      e.altKey ||
      historyCycleIdx >= 0 ||
      (e.key === "ArrowUp" && onFirstLine) ||
      (e.key === "ArrowDown" && onLastLine && historyCycleIdx >= 0);

    const histList =
      Array.isArray(promptHistory) && promptHistory.length
        ? promptHistory
        : Array.isArray(window._localRecentPrompts)
        ? window._localRecentPrompts
        : [];

    if (shouldCycle && histList.length) {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        historyCycleIdx = Math.min(historyCycleIdx + 1, histList.length - 1);
      } else {
        historyCycleIdx = Math.max(historyCycleIdx - 1, -1);
      }
      const nextText = historyCycleIdx < 0 ? "" : (histList[historyCycleIdx]?.prompt || histList[historyCycleIdx] || "");
      promptEl.value = nextText;
      promptEl.dispatchEvent(new Event("input"));
      status(
        historyCycleIdx < 0
          ? "Cleared prompt"
          : `📜 Recent Prompt (${historyCycleIdx + 1}/${histList.length}) — press ↑/↓ to cycle`
      );
      return;
    }
  }

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    $("#ask-btn").click();
  }
});

// boot() is invoked in /app.js after all modules load

// ── Import / Export Local PC Configuration Bundle ──
if ($("#config-import-btn") && $("#config-import-input")) {
  $("#config-import-btn").onclick = () => $("#config-import-input").click();
  $("#config-import-input").onchange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const payload = {};
    for (const f of files) {
      payload[f.name] = await f.text();
    }
    const res = await postJSON("/api/config/import", { files: payload });
    if (res.ok) {
      $("#config-import-status").textContent = `Imported ${res.imported.join(", ")}`;
      await reloadState();
      await renderColabHosts();
      renderKeys();
      status(`Imported ${res.imported.length} configuration item(s)`);
    } else {
      $("#config-import-status").textContent = res.error || "Import failed";
      status(res.error || "Import failed");
    }
    e.target.value = "";
  };
}
if ($("#config-export-btn")) {
  $("#config-export-btn").onclick = async () => {
    const res = await fetch("/api/config/export", { cache: "no-store" }).then((r) => r.json());
    const blob = new Blob([JSON.stringify(res, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suomynona-council-config-backup.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    status("Exported Suomynona Council configuration backup");
  };
}

// ── Feature #5: Cross-Model Speculative Consensus Streaming ──
$("#speculative-btn")?.addEventListener("click", async () => {
  const prompt = $("#prompt").value.trim();
  if (!prompt) {
    status("Type a prompt first to run ⚡ Speculative Consensus");
    return;
  }
  const chosen = STATE.backends.filter((b) => picked.has(b.i) && !String(b.model || "").toLowerCase().includes("embed"));
  if (!chosen.length) {
    status("Pick at least one model first");
    return;
  }
  $("#answers").innerHTML = "";
  answers = {};
  $("#response-bulk-actions").classList.add("hidden");
  $("#verdict").classList.add("hidden");
  $("#speculative-btn").disabled = true;
  $("#ask-btn").disabled = true;
  $("#stop-btn").classList.remove("hidden");

  const body = mkCard("⚡ Speculative Consensus Stream", "Fast Drafter → Deep Architect + Cyber Verifier");
  let fullText = "";
  status("⚡ Speculative Consensus: Fast drafter streaming tokens while Verifier & Auditor patch in real time…");

  try {
    const r = await fetch("/api/speculative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, models: chosen.map((b) => b.i) }),
    });
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const p = line.slice(5).trim();
        if (p === "[DONE]") continue;
        try {
          const ev = JSON.parse(p);
          if (ev.stage === "roles") {
            const sub = body.closest(".card")?.querySelector(".answer-sub");
            if (sub) sub.textContent = `Drafter: ${ev.drafter} · Verifier: ${ev.verifier} · Auditor: ${ev.auditor}`;
          }
          const delta = ev.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            setCardBodyMarkdown(body, fullText, true);
          }
        } catch (_) {}
      }
    }
    setCardBodyMarkdown(body, fullText || "(no content)", false);
    window._lastAnswers = { "Speculative Consensus": fullText };
    status("⚡ Speculative Consensus complete — verified by 3 models in real time");
  } catch (e) {
    status("Speculative stream error: " + e);
  } finally {
    $("#speculative-btn").disabled = false;
    $("#ask-btn").disabled = false;
    $("#stop-btn").classList.add("hidden");
  }
});

// ── Feature #6: Bulk One-Click Standalone App Exporter ──
$("#export-standalone-all")?.addEventListener("click", async () => {
  const cards = $$("#answers .card.ans").filter((card) => {
    const body = card.querySelector(".body");
    return (body?._rawText || body?.textContent || "").trim();
  });
  if (!cards.length) {
    status("No response code to package yet");
    return;
  }
  const combined = cards
    .map((card) => {
      const b = card.querySelector(".body");
      return b?._rawText || b?.textContent || "";
    })
    .join("\n\n");
  const btn = $("#export-standalone-all");
  btn.disabled = true;
  btn.textContent = "📦 Packaging…";
  try {
    const res = await postJSON("/api/export/standalone", {
      title: window._lastPrompt ? window._lastPrompt.slice(0, 40) : "council_standalone_app",
      text: combined,
    });
    if (res.ok) {
      if (res.bundle_b64) {
        const bin = atob(res.bundle_b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: "application/x-bat" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.bundle_filename || "council_standalone_installer.bat";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      status(`📦 Packaged ${res.files?.length || 0} file(s) into ${res.dir} + downloaded self-extracting launcher!`);
    } else {
      status(res.error || "Standalone export failed");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "📦 Package Standalone App";
  }
});

// ── Feature #8: Episodic Vector Memory Vault ("Project Brain") ──
async function loadVaultDrawer(query = "") {
  const listEl = $("#vault-list");
  if (!listEl) return;
  try {
    const url = query ? `/api/vault?q=${encodeURIComponent(query)}` : "/api/vault";
    const res = await fetch(url, { cache: "no-store" }).then((r) => r.json());
    const items = res.items || [];
    if (!items.length) {
      listEl.innerHTML = `<div class="muted" style="padding:8px">No episodic project memories stored yet. Pin architectural notes above or ask the Council questions—key turns and code artifacts are automatically indexed here.</div>`;
      return;
    }
    listEl.innerHTML = items
      .map(
        (m) => `<div class="history-item">
          <div class="history-item-head">
            <strong>🧠 ${esc(m.title || "Memory")}</strong>
            <span class="muted">${esc((m.tags || []).join(" · "))} · ${new Date((m.ts || 0) * 1000).toLocaleTimeString()}</span>
          </div>
          <div class="history-item-body">${esc((m.content || "").slice(0, 260))}</div>
        </div>`
      )
      .join("");
    listEl.querySelectorAll(".history-item").forEach((el, idx) => {
      el.onclick = () => {
        const item = items[idx];
        if (!item) return;
        const pEl = $("#prompt");
        pEl.value = (pEl.value ? pEl.value + "\n\n" : "") + `[Context from Project Brain — ${item.title}]:\n${item.content}\n`;
        pEl.dispatchEvent(new Event("input"));
        status(`🧠 Injected "${item.title}" into prompt`);
      };
    });
  } catch (e) {
    listEl.innerHTML = `<div class="muted">Could not load Project Brain: ${esc(String(e))}</div>`;
  }
}

$("#vault-btn")?.addEventListener("click", () => {
  const d = $("#vault-drawer");
  if (!d) return;
  const opening = d.classList.contains("hidden");
  d.classList.toggle("hidden");
  if (opening) loadVaultDrawer($("#vault-search")?.value || "");
});
$("#vault-close-btn")?.addEventListener("click", () => $("#vault-drawer")?.classList.add("hidden"));
$("#vault-search-btn")?.addEventListener("click", () => loadVaultDrawer($("#vault-search")?.value || ""));
$("#vault-search")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadVaultDrawer($("#vault-search")?.value || "");
});
$("#vault-add-btn")?.addEventListener("click", async () => {
  const title = ($("#vault-add-title")?.value || "").trim() || "Pinned Architecture Note";
  const content = ($("#vault-add-content")?.value || "").trim();
  if (!content) {
    status("Enter memory content to pin to Project Brain");
    return;
  }
  await postJSON("/api/vault", { title, content, tags: ["pinned", "architecture"] });
  if ($("#vault-add-title")) $("#vault-add-title").value = "";
  if ($("#vault-add-content")) $("#vault-add-content").value = "";
  await loadVaultDrawer();
  status(`🧠 Pinned "${title}" to Episodic Vector Memory Vault`);
});
$("#vault-clear-btn")?.addEventListener("click", async () => {
  await fetch("/api/vault", { method: "DELETE" });
  await loadVaultDrawer();
  status("🗑 Cleared Episodic Vector Memory Vault");
});

// ── Feature #4: Persistent Interactive Global Shell + Council CLI & Default Brain Shared Tab ──
function updateTerminalPrompts(cwd) {
  if (!cwd) return;
  const shortCwd = cwd.length > 28 ? "…" + cwd.slice(-26) : cwd;
  const promptStr = `root@suomynona-council:${shortCwd}#`;
  const cLabel = $("#council-term-prompt-label");
  if (cLabel) cLabel.textContent = promptStr;
  const cBadge = $("#council-term-cwd");
  if (cBadge) cBadge.textContent = cwd;
  const gPrefix = $("#guardian-prompt-prefix");
  if (gPrefix) {
    gPrefix.dataset.cwd = cwd;
    if (typeof getUnifiedTerminalPs1 === "function") {
      gPrefix.textContent = getUnifiedTerminalPs1(unifiedTerminalMode, unifiedTerminalShell);
    } else {
      gPrefix.textContent = promptStr;
    }
  }
}

async function runCouncilDrawerCommand(rawCmd) {
  const input = $("#council-term-input");
  const out = $("#guardian-out") || $("#council-term-out");
  const cmd = String(rawCmd ?? input?.value ?? "").trim();
  if (!cmd || !out) return;
  if (input) {
    attachUniversalCliHistory(input, "drawer");
    if (input._pushCliHistory) input._pushCliHistory(cmd);
  }
  if (rawCmd === undefined && input) {
    input.value = "";
    const ghost = $("#council-term-ghost");
    if (ghost) ghost.textContent = "";
  }
  switchConsoleDockTab("brain-council", { focus: true });
  await executeUnifiedCliCommand(cmd);
}

$("#terminal-drawer-btn")?.addEventListener("click", async () => {
  const cliNavBtn = document.querySelector('.rail-btn[data-view="councilng-cli"]');
  if (cliNavBtn) cliNavBtn.click();
  switchConsoleDockTab("brain-council", { focus: true });
  await loadGuardianTerminal();
  $("#guardian-fullscreen-term")?.focus();
});
$("#council-term-open-full-btn")?.addEventListener("click", () => {
  const cliNavBtn = document.querySelector('.rail-btn[data-view="councilng-cli"]');
  if (cliNavBtn) cliNavBtn.click();
  switchConsoleDockTab("brain-council", { focus: true });
});
$("#council-term-close")?.addEventListener("click", () => $("#council-terminal-drawer")?.classList.add("hidden"));
$("#council-term-clear")?.addEventListener("click", () => {
  const out = $("#council-term-out");
  if (out) clearTerminalContainer(out);
});
$("#council-term-send")?.addEventListener("click", () => runCouncilDrawerCommand());
$("#council-term-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.defaultPrevented) {
    e.preventDefault();
    runCouncilDrawerCommand();
  } else if (e.key === "Escape") {
    flushTerminalTypingQueue($("#council-term-out"));
  }
});
$$("[data-cterm-quick]").forEach((btn) => {
  btn.onclick = () => runCouncilDrawerCommand(btn.dataset.ctermQuick);
});

// ── Global Shell + Built-In Council CLI Controller (#view-guardian) ──
let guardianInputMode = "auto";
$$("#guardian-mode-seg button").forEach((btn) => {
  btn.onclick = () => {
    guardianInputMode = btn.dataset.gmode || "auto";
    $$("#guardian-mode-seg button").forEach((b) => b.classList.toggle("on", b === btn));
    const inp = $("#guardian-input");
    if (inp) {
      inp.placeholder =
        guardianInputMode === "claude"
          ? "Ask Council CLI AI to inspect, build, or self-repair anything in Suomynona Council…"
          : "Type any shell command (ls, cd .., python3, curl, git status) or 'council <instruction>' to invoke Council CLI…";
    }
  };
});

$("#council-cli-showcase-btn")?.addEventListener("click", (e) => {
  openAppInCouncilCli({ triggerBtn: e.currentTarget });
});

$$(".council-pkg-btn[data-council-pkg]").forEach((btn) => {
  btn.addEventListener("click", () => {
    packageFinishedProduct(btn.dataset.councilPkg || "exe", { triggerBtn: btn });
  });
});

function renderGuardianHistory(history, { silentSyncOnly = false } = {}) {
  const out = $("#guardian-out");
  if (!out || !Array.isArray(history)) return;
  out._renderedGuardianKeys ||= new Set();

  const newEntries = history.filter((entry, idx) => {
    const key = `${idx}:${entry.ts || ""}:${(entry.text || "").slice(0, 120)}`;
    if (out._renderedGuardianKeys.has(key)) return false;
    out._renderedGuardianKeys.add(key);
    return true;
  });

  if (silentSyncOnly) return;

  newEntries.forEach((entry) => {
    // Skip redundant 'cmd' echo lines since the unified terminal already prints the PS1 + command line
    if (entry.type === "cmd") return;
    const color =
      entry.type === "ok"
        ? "#22c55e"
        : entry.type === "err"
        ? "#ef4444"
        : entry.type === "warn"
        ? "#f59e0b"
        : entry.type === "diff"
        ? "#c084fc"
        : "#eef2fb";
    appendTypedTerminalBlock(out, `${entry.text || ""}`, {
      color,
      marginBottom: "8px",
      instant: true,
    });
  });
}

async function loadGuardianTerminal() {
  try {
    const [res, latestRes] = await Promise.all([
      fetch("/api/guardian/status", { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
      fetch("/api/forge/latest-app", { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
    ]);
    if (res.ok) {
      if (res.cwd) updateTerminalPrompts(res.cwd);
      const pathEl = $("#guardian-workspace-path");
      if (pathEl) {
        pathEl.innerHTML = `CWD: ${esc(res.cwd || res.workspace || "/app/applet")} · Type <code>/</code> + <code>Tab</code> to predict &amp; autocomplete`;
      }
      // Mark existing history as synced so old background commands don't replay out-of-order
      renderGuardianHistory(res.history || [], { silentSyncOnly: true });
    }
    if (latestRes?.ok && latestRes.app) {
      const activeLbl = $("#council-cli-active-app-label");
      if (activeLbl) {
        activeLbl.textContent = `Latest Built App: ${latestRes.app.title} (${(latestRes.app.files || []).length} files)`;
        activeLbl.style.color = "var(--ok)";
      }
    }
  } catch (e) {
    console.warn("Council CLI status error", e);
  }
}

async function runGuardianCommand(promptText) {
  const inputEl = $("#guardian-input");
  const sendBtn = $("#guardian-send-btn");
  const out = $("#guardian-out");
  const rawText = String(promptText ?? inputEl?.value ?? "").trim();
  if (!rawText) return;
  if (inputEl && promptText === undefined) inputEl.value = "";
  if (sendBtn) sendBtn.disabled = true;

  if (inputEl) {
    attachUniversalCliHistory(inputEl, "master");
    if (inputEl._pushCliHistory) inputEl._pushCliHistory(rawText);
  }

  const lower = rawText.toLowerCase();

  if (rawText.endsWith(" -h") || rawText.endsWith(" --help") || rawText === "-h" || rawText === "--help" || rawText === "/?") {
    if (out) appendTypedTerminalBlock(out, `❯ ${rawText}`, { color: "#00d4ff", marginBottom: "4px", instant: true });
    renderCliCommandHelp(rawText, "master", (t, c, inst) => {
      if (out) appendTypedTerminalBlock(out, t, { color: c || "#2ee6a6", marginBottom: "4px", instant: inst });
    });
    if (sendBtn) sendBtn.disabled = false;
    return;
  }

  if (lower === "/command" || lower === "/commands" || lower === "commands" || lower === "/help" || lower === "help") {
    if (out) appendTypedTerminalBlock(out, `❯ ${rawText}`, { color: "#00d4ff", marginBottom: "4px", instant: true });
    renderCliCommandsList("master", null, (t, c, inst) => {
      if (out) appendTypedTerminalBlock(out, t, { color: c || "#2ee6a6", marginBottom: "4px", instant: inst });
    });
    if (sendBtn) sendBtn.disabled = false;
    return;
  }
  if (lower === "council open" || lower === "council run" || lower === "open-app" || lower === "showcase") {
    if (sendBtn) sendBtn.disabled = false;
    await openAppInCouncilCli({});
    return;
  }
  if (lower.startsWith("council package") || lower.startsWith("package ")) {
    if (sendBtn) sendBtn.disabled = false;
    const parts = lower.split(/\s+/);
    const fmt = parts[parts.length - 1] || "exe";
    await packageFinishedProduct(fmt, {});
    return;
  }

  // Translate 'council <task>' to 'claude <task>' for the backend AI agent handler
  const text = lower.startsWith("council ") ? "claude " + rawText.slice(8) : rawText;

  status(`🛡️ Executing in Council CLI (${EXEC_MODE === "real" ? "Live Real CLI" : "Sandboxed CLI"}): ${rawText.slice(0, 60)}…`);
  try {
    const res = await postJSON("/api/guardian/run", {
      prompt: text,
      mode: promptText !== undefined ? "auto" : guardianInputMode,
      exec_mode: EXEC_MODE,
    });
    if (res.cwd) updateTerminalPrompts(res.cwd);
    if (res.history) renderGuardianHistory(res.history, { silentSyncOnly: true });
    if (out) {
      const outText = res.output || res.error || "(Command completed)";
      const outColor = res.ok !== false ? "#e2e8f0" : "#ff6b8b";
      appendTypedTerminalBlock(out, outText, {
        color: outColor,
        marginBottom: "8px",
        instant: true,
      });
    }
    const pathEl = $("#guardian-workspace-path");
    if (pathEl && res.cwd) {
      pathEl.innerHTML = `CWD: ${esc(res.cwd)} · Type <code>/</code> + <code>Tab</code> to predict &amp; autocomplete`;
    }
    if (res.modified_files && res.modified_files.length) {
      await reloadState();
      status(`🛡️ Council CLI updated: ${res.modified_files.join(", ")}`);
    } else {
      status(res.ok ? "🛡️ Council CLI command complete" : `🛡️ Notice: ${res.error || "check terminal output"}`);
    }
  } catch (e) {
    if (out) {
      appendTypedTerminalBlock(out, `❌ Error: ${e.message || e}`, {
        color: "#ff6b8b",
        marginBottom: "8px",
        instant: true,
      });
    }
    status(`Council CLI error: ${e.message || e}`);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    inputEl?.focus();
  }
}

$("#guardian-send-btn")?.addEventListener("click", () => runGuardianCommand());
$("#guardian-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runGuardianCommand();
  }
});

$("#guardian-repair-btn")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  status("🛡️ Running Claude Code Self-Diagnosis & Auto-Repair…");
  try {
    const res = await postJSON("/api/guardian/repair", {});
    if (res.cwd) updateTerminalPrompts(res.cwd);
    if (res.history) renderGuardianHistory(res.history);
    await reloadState();
    status("🛡️ Self-diagnosis & auto-repair complete!");
  } finally {
    btn.disabled = false;
  }
});

$("#guardian-backup-btn")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const res = await postJSON("/api/guardian/backup", { label: "ui_snapshot" });
    if (res.history) renderGuardianHistory(res.history);
    status(`📸 Created safe snapshot: ${res.snapshot?.snapshotId || "ok"}`);
  } finally {
    btn.disabled = false;
  }
});

$("#guardian-rollback-btn")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const res = await postJSON("/api/guardian/rollback", {});
    if (res.history) renderGuardianHistory(res.history);
    if (res.ok) {
      await reloadState();
      status(`⏪ Rolled back Suomynona Council to snapshot ${res.snapshot_id}`);
    } else {
      status(res.error || "No snapshot to rollback");
    }
  } finally {
    btn.disabled = false;
  }
});

$("#guardian-status-btn")?.addEventListener("click", () => runGuardianCommand("claude doctor"));
$$("[data-gquick]").forEach((btn) => {
  btn.onclick = () => runGuardianCommand(btn.dataset.gquick);
});

// ══════════════════════════════════════════════════════════════════════════
// 🔗 GOOGLE A2A (AGENT2AGENT PROTOCOL) & ADK ENTERPRISE BRIDGE CONTROLLER
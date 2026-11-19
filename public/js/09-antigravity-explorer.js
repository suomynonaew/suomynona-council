// ════════════════════════════════════════════════════════════════════════════
// SUOMYNONA EXPLORER WORKBENCH (public/js/09-antigravity-explorer.js)
// Normal Folder/File Explorer (By Model & Project View) + Compatibility Judge
// + Diff Comparator + Coding Merge Agent + Hugging Face / Ollama Coders
// ════════════════════════════════════════════════════════════════════════════

(function () {
  if (window.__AGX_EXPLORER_LOADED__) return;
  window.__AGX_EXPLORER_LOADED__ = true;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const safeEsc = (str) =>
    typeof window.esc === "function"
      ? window.esc(str)
      : String(str ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
  const safeStatus = (msg) => {
    if (typeof status === "function") status(msg);
    else if (typeof window.status === "function") window.status(msg);
  };
  const iconFor = (p) => (typeof window.getFileIconByExt === "function" ? window.getFileIconByExt(p) : "📄");
  const computeDiff = (a, b) =>
    typeof window.computeAntigravityLineDiff === "function"
      ? window.computeAntigravityLineDiff(a, b)
      : { added: 0, removed: 0, ops: [], hunks: [], identical: a === b };
  const renderMd = (md) =>
    typeof window.renderSimpleMarkdownForArtifact === "function"
      ? window.renderSimpleMarkdownForArtifact(md)
      : `<pre>${safeEsc(md)}</pre>`;

  const agxState = {
    initialized: false,
    mode: "models", // "models" | "project" | "judge" | "merge"
    projectScope: "merged", // "merged" | "combined" | "disk"
    viewStyle: "details", // "details" | "icons"
    flattenRuns: false,
    navPath: [], // array of path segments in current browse context
    history: [{ mode: "models", projectScope: "merged", navPath: [] }],
    histIdx: 0,
    runs: [],
    activeRunId: null,
    activeWorkspace: { outputDir: "", updatedAt: "", files: [] },
    diskFiles: [],
    diskContentCache: new Map(),
    checkedMap: new Map(), // checkKey -> file descriptor
    openTabs: [], // Array<{ tabKey, title, ref }>
    activeTabKey: "",
    dirtyBuffers: new Map(), // tabKey -> edited text
    savedBuffers: new Map(), // tabKey -> original text
    editorMode: "code", // "code" | "preview"
    editorExpanded: false,
    inlineCreateMode: null, // "file" | "folder" | "rename" | null
    diffStyle: "split", // "split" | "unified"
    diffCatalog: [], // Array<{ key, label, path, modelName, content, source, runId }>
    judgeResult: null,
    codingModelsInfo: null,
    mergeQueue: [], // Array<{ key, path, content, language, modelName, fromRunId }>
    mergeResult: null,
    mergeActiveFileIdx: 0,
    mergePreviewMode: "code", // "code" | "diff"
    dlPollTimer: null,
  };

  function normRel(p = "") {
    return String(p || "")
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/\/+/g, "/")
      .trim();
  }

  function formatBytes(n) {
    const b = Number(n || 0);
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  }

  function getTabKey(ref) {
    if (!ref) return "";
    if (ref.source === "workspace") return `ws::${normRel(ref.path)}`;
    if (ref.source === "disk") return `disk::${normRel(ref.path)}`;
    return `run::${ref.runId}::${ref.modelIdx}::${ref.type === "response" ? "resp" : normRel(ref.path)}`;
  }

  function pushOutputLog(text) {
    const drawer = qs("#agx-output-drawer");
    const pre = qs("#agx-output-pre");
    if (pre) pre.textContent = String(text || "");
    drawer?.classList.remove("hidden");
  }

  function navigateTo(nextState, recordHistory = true) {
    if (nextState.mode) agxState.mode = nextState.mode;
    if (nextState.projectScope) agxState.projectScope = nextState.projectScope;
    if (Array.isArray(nextState.navPath)) agxState.navPath = [...nextState.navPath];
    if (recordHistory) {
      agxState.history = agxState.history.slice(0, agxState.histIdx + 1);
      agxState.history.push({
        mode: agxState.mode,
        projectScope: agxState.projectScope,
        navPath: [...agxState.navPath],
      });
      if (agxState.history.length > 40) agxState.history.shift();
      agxState.histIdx = agxState.history.length - 1;
    }
    renderExplorerView();
  }

  function getActiveRun() {
    return agxState.runs.find((r) => r.id === agxState.activeRunId) || agxState.runs[0] || null;
  }

  function getRunDisplayTitle(run) {
    if (!run) return "Run";
    const modeTag = String(run.mode || "run").toUpperCase();
    const raw = (run.label || run.prompt || "Untitled Run").replace(/\s+/g, " ").trim();
    return `${run.pinned ? "📌 " : ""}[${modeTag}] ${raw.slice(0, 44)}`;
  }

  function getModelVirtualFiles(run, mIdx) {
    const m = run?.models?.[mIdx];
    if (!m) return [];
    const list = (m.files || []).map((f, fIdx) => ({
      checkKey: `${run.id}::${mIdx}::file::${fIdx}`,
      path: normRel(f.path || `file_${fIdx + 1}.txt`),
      content: String(f.content ?? ""),
      language: f.language || f.ext || "txt",
      size: f.size ?? String(f.content || "").length,
      modelName: m.modelName || `Model #${mIdx + 1}`,
      host: m.host || "Council",
      runId: run.id,
      modelIdx: mIdx,
      fileIdx: fIdx,
      source: "run",
      type: "file",
    }));
    if (String(m.responseText || "").trim()) {
      const slug = String(m.modelName || `model_${mIdx + 1}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .slice(0, 28);
      list.push({
        checkKey: `${run.id}::${mIdx}::resp`,
        path: `_response_${slug}.md`,
        content: String(m.responseText || ""),
        language: "md",
        size: String(m.responseText || "").length,
        modelName: m.modelName || `Model #${mIdx + 1}`,
        host: m.host || "Council",
        runId: run.id,
        modelIdx: mIdx,
        fileIdx: -1,
        source: "run",
        type: "response",
      });
    }
    return list;
  }

  function buildFolderListingFromFiles(fileEntries, subSegments, filterLower = "") {
    const prefix = subSegments.length ? `${subSegments.join("/")}/` : "";
    const dirsMap = new Map(); // dirName -> { name, fileCount, filesInside }
    const directFiles = [];

    for (const entry of fileEntries) {
      const p = normRel(entry.path);
      if (filterLower && !p.toLowerCase().includes(filterLower) && !String(entry.modelName || "").toLowerCase().includes(filterLower)) {
        continue;
      }
      if (prefix && !p.startsWith(prefix)) continue;
      const rest = prefix ? p.slice(prefix.length) : p;
      const slash = rest.indexOf("/");
      if (slash >= 0) {
        const dirName = rest.slice(0, slash);
        if (!dirName) continue;
        if (!dirsMap.has(dirName)) {
          dirsMap.set(dirName, { kind: "dir", name: dirName, subPath: [...subSegments, dirName], fileCount: 0, filesInside: [] });
        }
        const d = dirsMap.get(dirName);
        d.fileCount += 1;
        d.filesInside.push(entry);
      } else if (rest) {
        directFiles.push({
          ...entry,
          kind: "file",
          displayName: rest,
        });
      }
    }

    const dirs = Array.from(dirsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    const files = directFiles.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return { dirs, files };
  }

  // Computes items in the current Explorer directory depending on mode & navPath
  function computeCurrentListing() {
    const q = String(qs("#agx-search-input")?.value || "").trim().toLowerCase();
    const crumbs = [];

    if (agxState.mode === "models") {
      if (q && agxState.navPath.length === 0) {
        // When searching from top level, match across models & files directly!
        const matches = [];
        for (const run of agxState.runs) {
          (run.models || []).forEach((m, mIdx) => {
            for (const f of getModelVirtualFiles(run, mIdx)) {
              if (f.path.toLowerCase().includes(q) || (m.modelName || "").toLowerCase().includes(q) || (run.prompt || "").toLowerCase().includes(q)) {
                matches.push({ ...f, kind: "file", displayName: `${m.modelName} / ${f.path}` });
              }
            }
          });
        }
        crumbs.push({ label: `Search: "${q}"`, navPath: [] });
        return { crumbs, dirs: [], files: matches, flatModelList: [] };
      }

      if (agxState.flattenRuns) {
        // Level 0 = models across runs (run active first)
        if (agxState.navPath.length === 0) {
          crumbs.push({ label: "All Models (Flattened)", navPath: [] });
          const dirs = [];
          const runsOrdered = getActiveRun()
            ? [getActiveRun(), ...agxState.runs.filter((r) => r.id !== getActiveRun().id)]
            : agxState.runs;
          for (const r of runsOrdered.slice(0, 12)) {
            (r.models || []).forEach((m, mIdx) => {
              const vf = getModelVirtualFiles(r, mIdx);
              if (q && !`${m.modelName} ${r.prompt}`.toLowerCase().includes(q)) return;
              dirs.push({
                kind: "model-folder",
                name: `${m.modelName || `Model #${mIdx + 1}`}`,
                meta: `${vf.length} item(s) · ${r.pinned ? "📌 " : ""}${(r.label || r.prompt || "Run").slice(0, 32)}`,
                navPath: [`${r.id}::${mIdx}`],
                filesInside: vf,
              });
            });
          }
          return { crumbs, dirs, files: [] };
        }
        const [rId, mStr] = String(agxState.navPath[0] || "").split("::");
        const run = agxState.runs.find((r) => r.id === rId);
        const mIdx = Number(mStr);
        const m = run?.models?.[mIdx];
        if (!run || !m) {
          agxState.navPath = [];
          return computeCurrentListing();
        }
        crumbs.push({ label: "All Models", navPath: [] });
        crumbs.push({ label: m.modelName || `Model #${mIdx + 1}`, navPath: [agxState.navPath[0]] });
        const sub = agxState.navPath.slice(1);
        sub.forEach((seg, i) => crumbs.push({ label: seg, navPath: [agxState.navPath[0], ...sub.slice(0, i + 1)] }));
        const { dirs, files } = buildFolderListingFromFiles(getModelVirtualFiles(run, mIdx), sub, q);
        return { crumbs, dirs, files };
      }

      // Hierarchical: Runs -> Models -> Folders/Files
      if (agxState.navPath.length === 0) {
        crumbs.push({ label: "Prompt Runs", navPath: [] });
        const dirs = agxState.runs.map((r) => {
          const allF = (r.models || []).flatMap((_, mIdx) => getModelVirtualFiles(r, mIdx));
          return {
            kind: "run-folder",
            name: getRunDisplayTitle(r),
            meta: `${(r.models || []).length} models · ${r.totalFiles || 0} code files · ${String(r.createdAt || "").slice(11, 16)}`,
            navPath: [r.id],
            runId: r.id,
            pinned: Boolean(r.pinned),
            filesInside: allF,
          };
        });
        return { crumbs, dirs, files: [] };
      }

      const runId = agxState.navPath[0];
      const run = agxState.runs.find((r) => r.id === runId);
      if (!run) {
        agxState.navPath = [];
        return computeCurrentListing();
      }
      crumbs.push({ label: "Prompt Runs", navPath: [] });
      crumbs.push({ label: getRunDisplayTitle(run), navPath: [run.id] });

      if (agxState.navPath.length === 1) {
        const dirs = (run.models || []).map((m, mIdx) => {
          const vf = getModelVirtualFiles(run, mIdx);
          return {
            kind: "model-folder",
            name: m.modelName || `Model #${mIdx + 1}`,
            meta: `${(m.files || []).length} file(s) · Host: ${m.host || "Council"}`,
            navPath: [run.id, `m:${mIdx}`],
            filesInside: vf,
          };
        });
        return { crumbs, dirs, files: [] };
      }

      const mIdx = Number(String(agxState.navPath[1] || "").replace(/^m:/, ""));
      const mod = run.models?.[mIdx];
      if (!mod) {
        agxState.navPath = [run.id];
        return computeCurrentListing();
      }
      crumbs.push({ label: mod.modelName || `Model #${mIdx + 1}`, navPath: [run.id, `m:${mIdx}`] });
      const sub = agxState.navPath.slice(2);
      sub.forEach((seg, i) => crumbs.push({ label: seg, navPath: [run.id, `m:${mIdx}`, ...sub.slice(0, i + 1)] }));
      const { dirs, files } = buildFolderListingFromFiles(getModelVirtualFiles(run, mIdx), sub, q);
      return { crumbs, dirs, files };
    }

    // MODE === "project"
    const scope = agxState.projectScope;
    const scopeLabel =
      scope === "merged" ? "Merged Project" : scope === "combined" ? "All Models Combined" : "Workspace Disk";
    crumbs.push({ label: scopeLabel, navPath: [] });
    agxState.navPath.forEach((seg, i) => crumbs.push({ label: seg, navPath: agxState.navPath.slice(0, i + 1) }));

    let entries = [];
    if (scope === "merged") {
      entries = (agxState.activeWorkspace.files || []).map((f) => ({
        checkKey: `ws::${normRel(f.path)}`,
        path: normRel(f.path),
        content: String(f.content ?? ""),
        language: f.language || "txt",
        size: f.size ?? String(f.content || "").length,
        modelName: f.fromModelName || "Merged",
        source: "workspace",
        type: "file",
        hasHistory: Array.isArray(f.history) && f.history.length > 0,
      }));
    } else if (scope === "combined") {
      const activeRun = getActiveRun();
      const byPath = new Map();
      if (activeRun) {
        (activeRun.models || []).forEach((m, mIdx) => {
          (m.files || []).forEach((f, fIdx) => {
            const np = normRel(f.path);
            const arr = byPath.get(np) || [];
            arr.push({ m, mIdx, f, fIdx });
            byPath.set(np, arr);
          });
        });
      }
      for (const [np, cands] of byPath.entries()) {
        // Pick largest valid-looking version as representative, expose version count badge
        const best = [...cands].sort((a, b) => String(b.f.content || "").length - String(a.f.content || "").length)[0];
        entries.push({
          checkKey: `${activeRun.id}::${best.mIdx}::file::${best.fIdx}`,
          path: np,
          content: String(best.f.content ?? ""),
          language: best.f.language || best.f.ext || "txt",
          size: best.f.size ?? String(best.f.content || "").length,
          modelName: cands.length > 1 ? `${best.m.modelName} (+${cands.length - 1} alt)` : best.m.modelName,
          versionCount: cands.length,
          runId: activeRun.id,
          modelIdx: best.mIdx,
          fileIdx: best.fIdx,
          source: "run",
          type: "file",
        });
      }
    } else {
      entries = agxState.diskFiles.map((df) => ({
        checkKey: `disk::${normRel(df.path)}`,
        path: normRel(df.path),
        size: df.size || 0,
        language: df.ext || "txt",
        modelName: normRel(df.path).startsWith("council_outputs/") ? "Output Disk" : "Repo Disk",
        source: "disk",
        type: "file",
        mtime: df.mtime || "",
      }));
    }

    const { dirs, files } = buildFolderListingFromFiles(entries, agxState.navPath, q);
    return { crumbs, dirs, files };
  }

  function renderExplorerView() {
    // Sync top mode tabs & pane visibility
    const modes = ["models", "project", "judge", "merge"];
    modes.forEach((m) => {
      const tab = qs(`#agx-tab-${m}`);
      if (tab) {
        tab.classList.toggle("is-active", agxState.mode === m);
        tab.setAttribute("aria-selected", String(agxState.mode === m));
      }
    });

    const isBrowse = agxState.mode === "models" || agxState.mode === "project";
    qs("#agx-pane-browse")?.classList.toggle("hidden", !isBrowse);
    qs("#agx-pane-judge")?.classList.toggle("hidden", agxState.mode !== "judge");
    qs("#agx-pane-merge")?.classList.toggle("hidden", agxState.mode !== "merge");

    // Quick access badges & active highlight
    const wsCnt = (agxState.activeWorkspace.files || []).length;
    if (qs("#agx-qa-merged-cnt")) qs("#agx-qa-merged-cnt").textContent = String(wsCnt);
    if (qs("#agx-qa-disk-cnt")) qs("#agx-qa-disk-cnt").textContent = String(agxState.diskFiles.length);
    if (qs("#agx-runs-count")) qs("#agx-runs-count").textContent = String(agxState.runs.length);
    if (qs("#agx-sel-count")) qs("#agx-sel-count").textContent = String(agxState.checkedMap.size);

    qs("#agx-qa-models")?.classList.toggle("is-active", agxState.mode === "models");
    qs("#agx-qa-merged")?.classList.toggle("is-active", agxState.mode === "project" && agxState.projectScope === "merged");
    qs("#agx-qa-combined")?.classList.toggle("is-active", agxState.mode === "project" && agxState.projectScope === "combined");
    qs("#agx-qa-disk")?.classList.toggle("is-active", agxState.mode === "project" && agxState.projectScope === "disk");

    renderExplorerSidebarLists();

    if (isBrowse) {
      renderBrowsePane();
    } else if (agxState.mode === "judge") {
      populateJudgeAndDiffControls();
      renderJudgeResults();
      renderDiffComparator();
    } else if (agxState.mode === "merge") {
      renderMergeAgentPane();
    }
  }

  function renderExplorerSidebarLists() {
    const modelsBox = qs("#agx-sidebar-models");
    if (modelsBox) {
      const actRun = getActiveRun();
      const mods = actRun?.models || [];
      if (!mods.length) {
        modelsBox.innerHTML = `<div class="agx-side-empty">Run any prompt to list model folders here.</div>`;
      } else {
        modelsBox.innerHTML = mods
          .map((m, mIdx) => {
            const active =
              agxState.mode === "models" &&
              ((agxState.flattenRuns && agxState.navPath[0] === `${actRun.id}::${mIdx}`) ||
                (!agxState.flattenRuns && agxState.navPath[0] === actRun.id && agxState.navPath[1] === `m:${mIdx}`));
            return `
              <button type="button" class="agx-side-item ${active ? "is-active" : ""}" data-agx-jump-model="${safeEsc(actRun.id)}::${mIdx}" title="${safeEsc(m.modelName)} (${(m.files || []).length} files)">
                <span class="agx-side-txt">🤖 ${safeEsc(m.modelName || `Model #${mIdx + 1}`)}</span>
                <span class="agx-side-badge">${(m.files || []).length}</span>
              </button>
            `;
          })
          .join("");
        qsa("[data-agx-jump-model]", modelsBox).forEach((btn) => {
          btn.addEventListener("click", () => {
            const [rId, mStr] = String(btn.getAttribute("data-agx-jump-model") || "").split("::");
            agxState.activeRunId = rId;
            const nextNav = agxState.flattenRuns ? [`${rId}::${mStr}`] : [rId, `m:${mStr}`];
            navigateTo({ mode: "models", navPath: nextNav });
          });
        });
      }
    }

    const runsBox = qs("#agx-sidebar-runs");
    if (runsBox) {
      if (!agxState.runs.length) {
        runsBox.innerHTML = `<div class="agx-side-empty">No saved prompt runs yet.</div>`;
      } else {
        runsBox.innerHTML = agxState.runs
          .slice(0, 25)
          .map((r) => {
            const isSel = r.id === (getActiveRun()?.id || "");
            const title = (r.label || r.prompt || "Run").replace(/\s+/g, " ").slice(0, 32);
            return `
              <div class="agx-side-run-row ${isSel ? "is-selected" : ""}">
                <button type="button" class="agx-side-run-btn" data-agx-select-run="${safeEsc(r.id)}" title="${safeEsc(r.prompt || title)}">
                  ${r.pinned ? "📌 " : ""}${safeEsc(title)}
                </button>
                <button type="button" class="agx-mini-icon ${r.pinned ? "is-on" : ""}" data-agx-pin-run="${safeEsc(r.id)}" title="${r.pinned ? "Unpin Run" : "Pin Run"}">📌</button>
                <button type="button" class="agx-mini-icon danger" data-agx-del-run="${safeEsc(r.id)}" title="Delete Run">✕</button>
              </div>
            `;
          })
          .join("");

        qsa("[data-agx-select-run]", runsBox).forEach((btn) => {
          btn.addEventListener("click", () => {
            const rId = btn.getAttribute("data-agx-select-run");
            agxState.activeRunId = rId;
            if (agxState.mode === "models" && !agxState.flattenRuns) {
              navigateTo({ mode: "models", navPath: [rId] });
            } else {
              renderExplorerView();
            }
          });
        });

        qsa("[data-agx-pin-run]", runsBox).forEach((btn) => {
          btn.addEventListener("click", async () => {
            const rId = btn.getAttribute("data-agx-pin-run");
            const r = agxState.runs.find((x) => x.id === rId);
            if (!r) return;
            const res = await window.postJSON(`/api/explorer/runs/${encodeURIComponent(rId)}`, { pinned: !r.pinned }, "PATCH");
            if (res?.ok && Array.isArray(res.runs)) {
              agxState.runs = res.runs;
              renderExplorerView();
              safeStatus(!r.pinned ? "📌 Run pinned in Explorer." : "Run unpinned.");
            }
          });
        });

        qsa("[data-agx-del-run]", runsBox).forEach((btn) => {
          btn.addEventListener("click", async () => {
            const rId = btn.getAttribute("data-agx-del-run");
            const res = await window.postJSON(`/api/explorer/runs/${encodeURIComponent(rId)}`, {}, "DELETE");
            if (res?.ok && Array.isArray(res.runs)) {
              agxState.runs = res.runs;
              if (agxState.activeRunId === rId) agxState.activeRunId = agxState.runs[0]?.id || null;
              if (agxState.mode === "models" && agxState.navPath[0] === rId) agxState.navPath = [];
              renderExplorerView();
              safeStatus("Deleted run from Explorer history.");
            }
          });
        });
      }
    }
  }

  function renderBrowsePane() {
    qs("#agx-project-scope-group")?.classList.toggle("hidden", agxState.mode !== "project");
    qs("#agx-model-opts-group")?.classList.toggle("hidden", agxState.mode !== "models");
    qs("#agx-clear-project-btn")?.classList.toggle("hidden", !(agxState.mode === "project" && agxState.projectScope === "merged"));

    ["merged", "combined", "disk"].forEach((sc) => {
      qs(`#agx-scope-${sc}`)?.classList.toggle("is-active", agxState.projectScope === sc);
    });
    qs("#agx-view-details-btn")?.classList.toggle("is-active", agxState.viewStyle === "details");
    qs("#agx-view-icons-btn")?.classList.toggle("is-active", agxState.viewStyle === "icons");
    if (qs("#agx-flatten-runs-cb")) qs("#agx-flatten-runs-cb").checked = agxState.flattenRuns;

    const backBtn = qs("#agx-nav-back-btn");
    const fwdBtn = qs("#agx-nav-fwd-btn");
    const upBtn = qs("#agx-nav-up-btn");
    if (backBtn) backBtn.disabled = agxState.histIdx <= 0;
    if (fwdBtn) fwdBtn.disabled = agxState.histIdx >= agxState.history.length - 1;
    if (upBtn) upBtn.disabled = agxState.navPath.length === 0;

    const { crumbs, dirs, files } = computeCurrentListing();

    // Render Breadcrumbs
    const bcEl = qs("#agx-breadcrumbs");
    if (bcEl) {
      bcEl.innerHTML = crumbs
        .map(
          (c, i) => `
          ${i > 0 ? `<span class="agx-bc-sep">›</span>` : ""}
          <button type="button" class="agx-bc-btn ${i === crumbs.length - 1 ? "is-current" : ""}" data-agx-bc-idx="${i}">${safeEsc(c.label)}</button>
        `
        )
        .join("");
      qsa("[data-agx-bc-idx]", bcEl).forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-agx-bc-idx"));
          if (crumbs[idx]) navigateTo({ navPath: crumbs[idx].navPath });
        });
      });
    }

    // Store visible files for "Select All"
    agxState._visibleDirs = dirs;
    agxState._visibleFiles = files;

    const canvas = qs("#agx-browser-canvas");
    if (!canvas) return;

    if (!dirs.length && !files.length) {
      const emptyHint =
        agxState.mode === "project" && agxState.projectScope === "merged"
          ? `Merged Project is empty. Switch to <strong>🤖 By Model</strong> (or click <strong>All Models Combined</strong>), check files you want, and click <strong>📦 Add to Project</strong> — or create a file with <strong>＋ New File</strong>.`
          : agxState.runs.length === 0 && agxState.mode === "models"
          ? `No model outputs archived yet. Send a prompt in <strong>⌘ Council</strong> and outputs automatically appear here organized by Run and Model.`
          : `This folder is empty.`;
      canvas.innerHTML = `<div class="agx-empty">${emptyHint}</div>`;
      return;
    }

    const activeOpenTab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);

    if (agxState.viewStyle === "icons") {
      const dirCards = dirs
        .map(
          (d, idx) => `
          <div class="agx-icon-tile is-dir" data-agx-open-dir="${idx}" title="Open ${safeEsc(d.name)}">
            <div class="agx-tile-glyph">${d.kind === "model-folder" ? "🤖" : d.kind === "run-folder" ? "🗂️" : "📁"}</div>
            <div class="agx-tile-name">${safeEsc(d.name)}</div>
            <div class="agx-tile-meta">${safeEsc(d.meta || `${d.fileCount || 0} item(s)`)}</div>
          </div>
        `
        )
        .join("");

      const fileCards = files
        .map((f, idx) => {
          const checked = agxState.checkedMap.has(f.checkKey);
          const isOpen = activeOpenTab && activeOpenTab.tabKey === getTabKey(f);
          return `
            <div class="agx-icon-tile is-file ${isOpen ? "is-selected" : ""}" data-agx-open-file="${idx}" title="${safeEsc(f.path)}">
              <input type="checkbox" class="agx-tile-cb" data-agx-chk="${idx}" ${checked ? "checked" : ""}>
              <div class="agx-tile-glyph">${iconFor(f.path)}</div>
              <div class="agx-tile-name">${safeEsc(f.displayName || f.path)}</div>
              <div class="agx-tile-meta">${safeEsc(f.modelName || "")} · ${formatBytes(f.size)}</div>
            </div>
          `;
        })
        .join("");

      canvas.innerHTML = `<div class="agx-icons-grid">${dirCards}${fileCards}</div>`;
    } else {
      const dirRows = dirs
        .map((d, idx) => {
          const badge = d.meta || `${d.fileCount || 0} file(s)`;
          return `
            <tr class="agx-row is-dir" data-agx-open-dir="${idx}">
              <td class="agx-col-chk"></td>
              <td class="agx-col-name"><span class="agx-row-icon">${d.kind === "model-folder" ? "🤖" : d.kind === "run-folder" ? "🗂️" : "📁"}</span> <strong>${safeEsc(d.name)}</strong></td>
              <td class="agx-col-origin">${d.kind === "model-folder" ? "Model Folder" : d.kind === "run-folder" ? "Prompt Run" : "Folder"}</td>
              <td class="agx-col-size tabular-nums">${safeEsc(badge)}</td>
              <td class="agx-col-acts">
                <button type="button" class="ghost xs" data-agx-open-dir-btn="${idx}">Open</button>
                ${
                  Array.isArray(d.filesInside) && d.filesInside.length
                    ? `<button type="button" class="ghost xs" data-agx-stage-dir="${idx}" title="Add all files in this folder to Merged Project">+ Project</button>`
                    : ""
                }
              </td>
            </tr>
          `;
        })
        .join("");

      const fileRows = files
        .map((f, idx) => {
          const checked = agxState.checkedMap.has(f.checkKey);
          const isOpen = activeOpenTab && activeOpenTab.tabKey === getTabKey(f);
          const vBadge = f.versionCount > 1 ? ` <span class="agx-warn-pill">${f.versionCount} versions</span>` : "";
          return `
            <tr class="agx-row is-file ${isOpen ? "is-selected" : ""}" data-agx-open-file="${idx}">
              <td class="agx-col-chk"><input type="checkbox" data-agx-chk="${idx}" ${checked ? "checked" : ""}></td>
              <td class="agx-col-name"><span class="agx-row-icon">${iconFor(f.path)}</span> ${safeEsc(f.displayName || f.path)}${vBadge}</td>
              <td class="agx-col-origin">${safeEsc(f.modelName || f.source || "File")}</td>
              <td class="agx-col-size tabular-nums">${formatBytes(f.size)}</td>
              <td class="agx-col-acts">
                <button type="button" class="ghost xs" data-agx-open-file-btn="${idx}">Open</button>
                <button type="button" class="ghost xs" data-agx-stage-one="${idx}" title="Add to Merged Project">+ Project</button>
              </td>
            </tr>
          `;
        })
        .join("");

      canvas.innerHTML = `
        <table class="agx-table">
          <thead>
            <tr>
              <th class="agx-col-chk"></th>
              <th>Name</th>
              <th>Source / Model</th>
              <th>Size</th>
              <th class="agx-col-acts">Actions</th>
            </tr>
          </thead>
          <tbody>${dirRows}${fileRows}</tbody>
        </table>
      `;
    }

    const openDirEntry = (d) => {
      if (!d) return;
      if (d.navPath) {
        if (d.runId) agxState.activeRunId = d.runId;
        navigateTo({ navPath: d.navPath });
      } else if (d.subPath) {
        const basePrefix =
          agxState.mode === "models"
            ? agxState.navPath.slice(0, agxState.flattenRuns ? 1 : 2)
            : [];
        navigateTo({ navPath: [...basePrefix, ...d.subPath] });
      }
    };

    // Bind row & icon click events cleanly
    qsa("[data-agx-open-dir]", canvas).forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("input")) return;
        openDirEntry(dirs[Number(el.getAttribute("data-agx-open-dir"))]);
      });
    });

    qsa("[data-agx-open-dir-btn]", canvas).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openDirEntry(dirs[Number(btn.getAttribute("data-agx-open-dir-btn"))]);
      });
    });

    qsa("[data-agx-stage-dir]", canvas).forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const d = dirs[Number(btn.getAttribute("data-agx-stage-dir"))];
        if (d?.filesInside?.length) {
          await stageFilesIntoMergedProject(d.filesInside);
        }
      });
    });

    qsa("[data-agx-chk]", canvas).forEach((cb) => {
      cb.addEventListener("click", (e) => e.stopPropagation());
      cb.addEventListener("change", (e) => {
        const f = files[Number(cb.getAttribute("data-agx-chk"))];
        if (!f) return;
        if (e.target.checked) agxState.checkedMap.set(f.checkKey, f);
        else agxState.checkedMap.delete(f.checkKey);
        if (qs("#agx-sel-count")) qs("#agx-sel-count").textContent = String(agxState.checkedMap.size);
      });
    });

    qsa("[data-agx-open-file]", canvas).forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("input") || e.target.closest("button")) return;
        const f = files[Number(el.getAttribute("data-agx-open-file"))];
        if (f) openFileInViewer(f);
      });
    });

    qsa("[data-agx-open-file-btn]", canvas).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const f = files[Number(btn.getAttribute("data-agx-open-file-btn"))];
        if (f) openFileInViewer(f);
      });
    });

    qsa("[data-agx-stage-one]", canvas).forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const f = files[Number(btn.getAttribute("data-agx-stage-one"))];
        if (f) await stageFilesIntoMergedProject([f]);
      });
    });
  }

  async function ensureFileContentLoaded(entry) {
    if (!entry) return "";
    if (entry.content !== undefined && entry.source !== "disk") return String(entry.content);
    const p = normRel(entry.path);
    if (agxState.diskContentCache.has(p)) return agxState.diskContentCache.get(p);
    if (entry.source === "disk") {
      const res = await window.getJSON(`/api/explorer/disk-file?path=${encodeURIComponent(p)}`);
      if (!res?.ok) throw new Error(res?.error || "Could not read disk file.");
      const c = String(res.content || "");
      agxState.diskContentCache.set(p, c);
      entry.content = c;
      return c;
    }
    return String(entry.content || "");
  }

  async function openFileInViewer(entry) {
    try {
      const content = await ensureFileContentLoaded(entry);
      const tabKey = getTabKey(entry);
      const leaf = normRel(entry.path).split("/").pop() || "file.txt";
      const tabTitle = `${iconFor(entry.path)} ${leaf}`;

      if (!agxState.openTabs.some((t) => t.tabKey === tabKey)) {
        agxState.openTabs.push({ tabKey, title: tabTitle, ref: { ...entry, content } });
        if (agxState.openTabs.length > 8) agxState.openTabs.shift();
      } else {
        const existingTab = agxState.openTabs.find((t) => t.tabKey === tabKey);
        if (existingTab) existingTab.ref = { ...entry, content };
      }

      agxState.activeTabKey = tabKey;
      agxState.savedBuffers.set(tabKey, content);

      qs("#agx-editor-panel")?.classList.remove("hidden");
      const effectiveText = agxState.dirtyBuffers.has(tabKey) ? agxState.dirtyBuffers.get(tabKey) : content;

      if (qs("#agx-editor-path")) qs("#agx-editor-path").textContent = normRel(entry.path);
      if (qs("#agx-editor-meta")) {
        qs("#agx-editor-meta").textContent = `${entry.modelName || entry.source} · ${formatBytes(content.length)}`;
      }
      const ta = qs("#agx-editor-textarea");
      if (ta) ta.value = effectiveText;

      syncEditorGutter();
      renderOpenTabs();
      if (agxState.editorMode === "preview") renderEditorPreview();
      if (agxState.mode === "models" || agxState.mode === "project") renderBrowsePane();
    } catch (err) {
      safeStatus(`⚠️ ${err.message || err}`);
    }
  }

  function renderOpenTabs() {
    const bar = qs("#agx-open-tabs");
    if (!bar) return;
    if (!agxState.openTabs.length) {
      bar.innerHTML = `<span class="agx-tab-empty">No open files</span>`;
      return;
    }
    bar.innerHTML = agxState.openTabs
      .map((t) => {
        const dirty = agxState.dirtyBuffers.has(t.tabKey) && agxState.dirtyBuffers.get(t.tabKey) !== agxState.savedBuffers.get(t.tabKey);
        return `
          <div class="agx-tab ${t.tabKey === agxState.activeTabKey ? "is-active" : ""}" data-agx-tab="${safeEsc(t.tabKey)}">
            <span>${safeEsc(t.title)}${dirty ? " ●" : ""}</span>
            <button type="button" class="agx-tab-x" data-agx-close-tab="${safeEsc(t.tabKey)}" title="Close tab">✕</button>
          </div>
        `;
      })
      .join("");

    qsa("[data-agx-tab]", bar).forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-agx-close-tab]")) return;
        const k = el.getAttribute("data-agx-tab");
        const found = agxState.openTabs.find((t) => t.tabKey === k);
        if (found) openFileInViewer(found.ref);
      });
    });

    qsa("[data-agx-close-tab]", bar).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const k = btn.getAttribute("data-agx-close-tab");
        agxState.openTabs = agxState.openTabs.filter((t) => t.tabKey !== k);
        agxState.dirtyBuffers.delete(k);
        if (agxState.activeTabKey === k) {
          if (agxState.openTabs.length) {
            openFileInViewer(agxState.openTabs[agxState.openTabs.length - 1].ref);
          } else {
            agxState.activeTabKey = "";
            qs("#agx-editor-panel")?.classList.add("hidden");
          }
        } else {
          renderOpenTabs();
        }
      });
    });
  }

  function syncEditorGutter() {
    const ta = qs("#agx-editor-textarea");
    const gut = qs("#agx-editor-gutter");
    if (!ta || !gut) return;
    const count = Math.max(1, String(ta.value || "").split("\n").length);
    const nums = [];
    for (let i = 1; i <= count; i++) nums.push(i);
    gut.textContent = nums.join("\n");
    gut.scrollTop = ta.scrollTop;
  }

  function renderEditorPreview() {
    const mdBox = qs("#agx-editor-md-preview");
    const frame = qs("#agx-editor-html-preview");
    const ta = qs("#agx-editor-textarea");
    if (!mdBox || !frame || !ta) return;
    const activeTab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
    const p = String(activeTab?.ref?.path || "").toLowerCase();
    const val = ta.value || "";

    if (p.endsWith(".html") || p.endsWith(".htm") || /^\s*<!doctype html/i.test(val)) {
      mdBox.classList.add("hidden");
      frame.classList.remove("hidden");
      let html = val;
      for (const wf of agxState.activeWorkspace.files || []) {
        const leaf = String(wf.path || "").split("/").pop();
        if (wf.path.endsWith(".css")) {
          html = html.replace(new RegExp(`<link[^>]+href=["'][^"']*${leaf.replace(".", "\\.")}["'][^>]*>`, "i"), `<style>${wf.content}</style>`);
        } else if (wf.path.endsWith(".js")) {
          html = html.replace(new RegExp(`<script[^>]+src=["'][^"']*${leaf.replace(".", "\\.")}["'][^>]*>\\s*<\\/script>`, "i"), `<script>${wf.content}<\/script>`);
        }
      }
      frame.srcdoc = html;
    } else {
      frame.classList.add("hidden");
      mdBox.classList.remove("hidden");
      mdBox.innerHTML = p.endsWith(".md") ? renderMd(val) : `<pre>${safeEsc(val)}</pre>`;
    }
  }

  async function stageFilesIntoMergedProject(entries) {
    const resolved = [];
    for (const e of entries || []) {
      const content = await ensureFileContentLoaded(e);
      if (e.type === "response") continue;
      resolved.push({
        path: normRel(e.path),
        content,
        language: e.language || normRel(e.path).split(".").pop() || "txt",
        fromRunId: e.runId || "explorer",
        fromRunLabel: "Suomynona Explorer",
        fromModelName: e.modelName || "Model",
        fromHost: e.host || "Council",
      });
    }
    if (!resolved.length) {
      safeStatus("⚠️ Select at least one code/project file (narrative _response.md files are skipped when staging Project files).");
      return null;
    }
    const res = await window.postJSON("/api/explorer/workspace/swap", { files: resolved });
    if (res?.ok && res.workspace) {
      agxState.activeWorkspace = res.workspace;
      for (const p of res.swapped || []) agxState.dirtyBuffers.delete(`ws::${p}`);
      safeStatus(`📦 Added ${(res.swapped || []).length} file(s) to Merged Project.`);
      renderExplorerView();
      return res;
    }
    safeStatus(`❌ Could not stage files: ${res?.error || "Unknown error"}`);
    return null;
  }

  function openInlinePrompt(kind, defaultVal = "") {
    agxState.inlineCreateMode = kind;
    const bar = qs("#agx-inline-create-bar");
    const lbl = qs("#agx-inline-create-lbl");
    const inp = qs("#agx-inline-create-input");
    const btn = qs("#agx-inline-create-confirm");
    if (!bar || !inp) return;
    if (lbl) lbl.textContent = kind === "folder" ? "New Folder:" : kind === "rename" ? "Rename File To:" : "New File:";
    if (btn) btn.textContent = kind === "rename" ? "Rename" : "Create";
    inp.placeholder = kind === "folder" ? "src/utils" : "src/app.py or index.html";
    inp.value = defaultVal;
    bar.classList.remove("hidden");
    inp.focus();
    inp.select();
  }

  async function commitInlinePrompt() {
    const kind = agxState.inlineCreateMode;
    const inp = qs("#agx-inline-create-input");
    const val = normRel(inp?.value || "");
    if (!kind || !val) return;
    qs("#agx-inline-create-bar")?.classList.add("hidden");
    agxState.inlineCreateMode = null;

    if (kind === "folder") {
      if (agxState.mode === "project" && agxState.projectScope === "disk") {
        const res = await window.postJSON("/api/explorer/disk-mkdir", { path: val });
        if (res?.ok) {
          await loadDiskTree();
          navigateTo({ mode: "project", projectScope: "disk", navPath: val.split("/").filter(Boolean) });
          safeStatus(`📁 Created disk folder '${val}'.`);
        } else {
          safeStatus(`❌ ${res?.error || "Could not create folder."}`);
        }
      } else {
        // Create folder in Merged Project via .gitkeep starter and navigate into it
        await stageFilesIntoMergedProject([{ path: `${val}/.gitkeep`, content: "# folder\n", language: "txt", modelName: "User", source: "workspace" }]);
        navigateTo({ mode: "project", projectScope: "merged", navPath: val.split("/").filter(Boolean) });
        safeStatus(`📁 Created folder '${val}' inside Merged Project.`);
      }
      return;
    }

    if (kind === "rename") {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      const oldPath = normRel(tab.ref.path);
      if (!val || val === oldPath) return;
      if (tab.ref.source === "workspace") {
        const res = await window.postJSON("/api/explorer/workspace/rename", { oldPath, newPath: val });
        if (res?.ok && res.workspace) {
          agxState.activeWorkspace = res.workspace;
          agxState.openTabs = agxState.openTabs.filter((t) => t.tabKey !== tab.tabKey);
          openFileInViewer({ ...tab.ref, path: val });
          safeStatus(`✎ Renamed '${oldPath}' → '${val}'.`);
        } else {
          safeStatus(`❌ ${res?.error || "Rename failed"}`);
        }
      } else if (tab.ref.source === "disk") {
        const res = await window.postJSON("/api/explorer/disk-rename", { oldPath, newPath: val });
        if (res?.ok) {
          agxState.openTabs = agxState.openTabs.filter((t) => t.tabKey !== tab.tabKey);
          await loadDiskTree();
          openFileInViewer({ ...tab.ref, path: val });
          safeStatus(`✎ Renamed disk file '${oldPath}' → '${val}'.`);
        } else {
          safeStatus(`❌ ${res?.error || "Rename restricted to council_outputs/"}`);
        }
      } else if (tab.ref.source === "run" && tab.ref.type === "file") {
        const res = await window.postJSON(
          `/api/explorer/runs/${encodeURIComponent(tab.ref.runId)}`,
          { modelIdx: tab.ref.modelIdx, fileIdx: tab.ref.fileIdx, content: qs("#agx-editor-textarea")?.value || tab.ref.content, newPath: val },
          "PATCH"
        );
        if (res?.ok && Array.isArray(res.runs)) {
          agxState.runs = res.runs;
          agxState.openTabs = agxState.openTabs.filter((t) => t.tabKey !== tab.tabKey);
          openFileInViewer({ ...tab.ref, path: val });
          safeStatus(`✎ Renamed model file '${oldPath}' → '${val}'.`);
        }
      }
      return;
    }

    // kind === "file"
    const ext = val.split(".").pop()?.toLowerCase() || "txt";
    const starter =
      ext === "py"
        ? `#!/usr/bin/env python3\n\ndef main():\n    print("Hello from ${val}")\n\nif __name__ == "__main__":\n    main()\n`
        : ext === "html"
        ? `<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>${val}</title></head>\n<body>\n  <h1>${val}</h1>\n</body>\n</html>\n`
        : ext === "js" || ext === "mjs"
        ? `console.log("Ready: ${val}");\n`
        : ext === "json"
        ? `{\n  "name": "suomynona-module"\n}\n`
        : `// ${val}\n`;

    if (agxState.mode === "project" && agxState.projectScope === "disk") {
      const targetPath = val.startsWith("council_outputs/") ? val : `council_outputs/custom_project/${val}`;
      const res = await window.postJSON("/api/explorer/disk-save", { path: targetPath, content: starter });
      if (res?.ok) {
        agxState.diskContentCache.set(targetPath, starter);
        await loadDiskTree();
        openFileInViewer({ checkKey: `disk::${targetPath}`, path: targetPath, content: starter, source: "disk", modelName: "Disk" });
        safeStatus(`💾 Created '${targetPath}' on disk.`);
      } else {
        safeStatus(`❌ ${res?.error || "Could not create disk file."}`);
      }
    } else {
      await stageFilesIntoMergedProject([{ path: val, content: starter, language: ext, modelName: "User", source: "workspace" }]);
      agxState.mode = "project";
      agxState.projectScope = "merged";
      const segs = val.split("/").slice(0, -1);
      navigateTo({ mode: "project", projectScope: "merged", navPath: segs });
      openFileInViewer({ checkKey: `ws::${val}`, path: val, content: starter, language: ext, source: "workspace", modelName: "User" });
    }
  }

  async function resolveFilesForExecution(preferChecked = true) {
    if (preferChecked && agxState.checkedMap.size > 0) {
      const out = [];
      for (const item of agxState.checkedMap.values()) {
        if (item.type === "response") continue;
        out.push({ path: normRel(item.path), content: await ensureFileContentLoaded(item), language: item.language, modelName: item.modelName });
      }
      if (out.length) return out;
    }
    if ((agxState.activeWorkspace.files || []).length > 0) {
      return agxState.activeWorkspace.files.map((f) => ({
        path: normRel(f.path),
        content: String(f.content || ""),
        language: f.language || "txt",
        modelName: f.fromModelName || "Merged",
      }));
    }
    const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
    if (tab && tab.ref) {
      return [{ path: normRel(tab.ref.path), content: qs("#agx-editor-textarea")?.value || tab.ref.content || "", language: tab.ref.language, modelName: tab.ref.modelName }];
    }
    return [];
  }

  async function runCompileOrExe(format = "run", specificFiles = null, entryPath = "") {
    const files = specificFiles || (await resolveFilesForExecution(true));
    if (!files.length) {
      pushOutputLog("⚠️ No files to run yet. Check files, add files to Merged Project, or open a file first.");
      return;
    }
    pushOutputLog(`⏳ Running (${format === "exe" ? "Windows x64 PE32+ .EXE Build" : "Execute"}) on ${files.length} file(s)…`);
    const res = await window.postJSON("/api/explorer/compile", {
      title: (getActiveRun()?.prompt || "explorer_project").slice(0, 28),
      format,
      entry_path: entryPath,
      selected_files: files,
    });
    if (format === "exe" && res?.ok && res.exe_base64) {
      const bin = atob(res.exe_base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.microsoft.portable-executable" }));
      a.download = res.download_name || "suomynona_project.exe";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1500);
      pushOutputLog(`✅ BUILT & DOWNLOADED ${res.download_name} (${formatBytes(res.size_bytes)})\nSaved: ${res.exe_path}\n\n${res.output || ""}`);
      safeStatus(`🪟 Built ${res.download_name}`);
    } else if (res?.ok) {
      pushOutputLog(`${res.exec_ok === false ? "⚠️ EXITED NON-ZERO" : "✅ EXECUTION SUCCEEDED"} (${res.buildDir || ""})\n\n${res.output || "(No output)"}`);
    } else {
      pushOutputLog(`❌ ${res?.error || "Execution failed"}`);
    }
  }

  // ── JUDGE & COMPARE WORKBENCH ──
  async function getFilesForJudgeScope() {
    const scope = qs("#agx-judge-scope")?.value || "active_run";
    const out = [];
    if (scope === "checked" && agxState.checkedMap.size > 0) {
      for (const item of agxState.checkedMap.values()) {
        if (item.type === "response") continue;
        out.push({ path: normRel(item.path), content: await ensureFileContentLoaded(item), language: item.language, modelName: item.modelName, fromRunId: item.runId });
      }
      if (out.length) return out;
    }
    if (scope === "project" && (agxState.activeWorkspace.files || []).length > 0) {
      return agxState.activeWorkspace.files.map((f) => ({
        path: normRel(f.path),
        content: String(f.content || ""),
        language: f.language || "txt",
        modelName: f.fromModelName || "Merged Project",
        fromRunId: f.fromRunId,
      }));
    }
    const actRun = getActiveRun();
    if (actRun) {
      (actRun.models || []).forEach((m) => {
        (m.files || []).forEach((f) => {
          out.push({ path: normRel(f.path), content: String(f.content || ""), language: f.language || f.ext || "txt", modelName: m.modelName || "Model", fromRunId: actRun.id });
        });
      });
    }
    return out;
  }

  async function populateJudgeAndDiffControls(preferLeftKey = null, preferRightKey = null) {
    await loadCodingModelsInfo(false);
    const catalog = [];
    for (const f of agxState.activeWorkspace.files || []) {
      catalog.push({
        key: `ws::${normRel(f.path)}`,
        label: `[Merged Project] ${normRel(f.path)} (${f.fromModelName || "Merged"})`,
        path: normRel(f.path),
        modelName: f.fromModelName || "Merged Project",
        content: String(f.content || ""),
        language: f.language || "txt",
        source: "workspace",
      });
    }
    const actRun = getActiveRun();
    if (actRun) {
      (actRun.models || []).forEach((m, mIdx) => {
        (m.files || []).forEach((f, fIdx) => {
          catalog.push({
            key: `run::${actRun.id}::${mIdx}::${fIdx}`,
            label: `[${m.modelName || `Model #${mIdx + 1}`}] ${normRel(f.path)}`,
            path: normRel(f.path),
            modelName: m.modelName || `Model #${mIdx + 1}`,
            content: String(f.content || ""),
            language: f.language || f.ext || "txt",
            source: "run",
            runId: actRun.id,
          });
        });
      });
    }
    for (const item of agxState.checkedMap.values()) {
      if (item.type === "response") continue;
      if (!catalog.some((c) => c.path === normRel(item.path) && c.modelName === item.modelName)) {
        catalog.push({
          key: item.checkKey,
          label: `[Checked · ${item.modelName}] ${normRel(item.path)}`,
          path: normRel(item.path),
          modelName: item.modelName || "Checked",
          content: String(item.content || ""),
          language: item.language || "txt",
          source: item.source,
          runId: item.runId,
        });
      }
    }
    agxState.diffCatalog = catalog;

    const lSel = qs("#agx-diff-left-sel");
    const rSel = qs("#agx-diff-right-sel");
    if (lSel && rSel) {
      const prevL = preferLeftKey || lSel.value;
      const prevR = preferRightKey || rSel.value;
      const opts = catalog.length
        ? catalog.map((c) => `<option value="${safeEsc(c.key)}">${safeEsc(c.label)}</option>`).join("")
        : `<option value="">No files available to compare</option>`;
      lSel.innerHTML = opts;
      rSel.innerHTML = opts;
      if (prevL && catalog.some((c) => c.key === prevL)) lSel.value = prevL;
      else if (catalog[0]) lSel.value = catalog[0].key;
      if (prevR && catalog.some((c) => c.key === prevR)) rSel.value = prevR;
      else {
        const leftItem = catalog.find((c) => c.key === lSel.value);
        const samePathAlt = catalog.find((c) => c.path === leftItem?.path && c.key !== leftItem?.key);
        rSel.value = samePathAlt ? samePathAlt.key : (catalog[1] || catalog[0])?.key || "";
      }
    }
  }

  function renderJudgeResults() {
    const sumEl = qs("#agx-judge-summary");
    const matEl = qs("#agx-judge-matrix");
    const confEl = qs("#agx-judge-conflicts");
    if (!agxState.judgeResult) {
      if (matEl) matEl.innerHTML = `<div class="muted" style="font-size:12px">No audit run yet.</div>`;
      if (confEl) confEl.innerHTML = `<div class="muted" style="font-size:12px">No conflicts scanned yet.</div>`;
      return;
    }

    const r = agxState.judgeResult;
    const scoreCls = r.overall_compatibility_score >= 85 ? "ok" : r.overall_compatibility_score >= 60 ? "warn" : "bad";
    if (sumEl) {
      sumEl.innerHTML = `
        <div class="agx-score-banner">
          <span class="agx-score-pill ${scoreCls}">Compatibility: ${r.overall_compatibility_score}/100</span>
          <span class="agx-pill">${r.ai_judge_used ? `⚖️ AI Judge: ${safeEsc(r.used_model)}` : "🔍 Static Analyzer Only"}</span>
        </div>
        <p style="margin:8px 0 4px;font-size:12.5px">${safeEsc(r.summary || "")}</p>
        ${r.ai_note ? `<div class="agx-note-bar">${safeEsc(r.ai_note)}</div>` : ""}
        <pre class="agx-plan-pre">${safeEsc(r.merge_plan || "")}</pre>
      `;
    }

    if (matEl) {
      const rows = r.file_matrix || [];
      matEl.innerHTML = rows.length
        ? `
          <table class="agx-table compact">
            <thead><tr><th>File Path</th><th>Status</th><th>Winner / Versions</th><th>Compare</th></tr></thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                  <tr>
                    <td><code>${safeEsc(row.path)}</code><div class="muted" style="font-size:11px">${safeEsc(row.note || "")}</div></td>
                    <td><span class="agx-status-pill ${safeEsc(row.status)}">${row.status === "clean_merge" ? "✓ Clean" : row.status === "needs_ai_merge" ? "⚠ AI Merge" : "✕ Conflict"}</span></td>
                    <td><strong>${safeEsc(row.recommended_model)}</strong> <span class="muted">(${row.candidate_count} ver)</span></td>
                    <td><button type="button" class="ghost xs" data-agx-matrix-diff="${safeEsc(row.path)}">Diff</button></td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
        `
        : `<div class="muted" style="font-size:12px">No file entries in matrix.</div>`;

      qsa("[data-agx-matrix-diff]", matEl).forEach((btn) => {
        btn.addEventListener("click", () => {
          const p = btn.getAttribute("data-agx-matrix-diff");
          const matching = agxState.diffCatalog.filter((c) => c.path === p);
          if (matching.length >= 2) {
            qs("#agx-diff-left-sel").value = matching[0].key;
            qs("#agx-diff-right-sel").value = matching[1].key;
          } else if (matching.length === 1) {
            qs("#agx-diff-left-sel").value = matching[0].key;
          }
          renderDiffComparator();
        });
      });
    }

    if (confEl) {
      const conflicts = r.conflicts || [];
      confEl.innerHTML = conflicts.length
        ? conflicts
            .map(
              (c) => `
              <div class="agx-conflict-item ${safeEsc(c.severity)}">
                <div class="agx-conflict-head">
                  <span class="agx-sev">${safeEsc(c.severity.toUpperCase())}</span>
                  <code>${safeEsc(c.path)}</code>
                </div>
                <div class="agx-conflict-msg">${safeEsc(c.message)}</div>
                <div class="agx-conflict-sug">💡 ${safeEsc(c.suggestion)}</div>
              </div>`
            )
            .join("")
        : `<div class="agx-ok-banner">✓ Zero syntax errors, missing local imports, or symbol mismatches detected!</div>`;
    }
  }

  function renderDiffComparator() {
    const viewer = qs("#agx-diff-viewer");
    const statsEl = qs("#agx-diff-stats");
    if (!viewer) return;

    qs("#agx-diff-split-btn")?.classList.toggle("is-active", agxState.diffStyle === "split");
    qs("#agx-diff-unified-btn")?.classList.toggle("is-active", agxState.diffStyle === "unified");

    const lKey = qs("#agx-diff-left-sel")?.value;
    const rKey = qs("#agx-diff-right-sel")?.value;
    const leftItem = agxState.diffCatalog.find((c) => c.key === lKey);
    const rightItem = agxState.diffCatalog.find((c) => c.key === rKey);
    if (!leftItem || !rightItem) {
      viewer.innerHTML = `<div class="agx-empty">Select Left and Right files above to inspect line-by-line differences.</div>`;
      return;
    }

    const diff = computeDiff(leftItem.content || "", rightItem.content || "");
    if (statsEl) {
      statsEl.textContent = diff.identical
        ? `✓ Identical files (${leftItem.content.split("\n").length} lines)`
        : `+${diff.added} −${diff.removed} lines · ${leftItem.modelName} ↔ ${rightItem.modelName}`;
    }

    if (diff.identical || !diff.hunks.length) {
      viewer.innerHTML = `<div class="agx-ok-banner" style="margin:12px">✓ Exact match — zero differences between Left and Right.</div>`;
      return;
    }

    if (agxState.diffStyle === "split") {
      viewer.innerHTML = diff.hunks
        .map((hunk, hIdx) => {
          let rowsHtml = "";
          let i = 0;
          while (i < hunk.rows.length) {
            const row = hunk.rows[i];
            if (row.type === "ctx") {
              rowsHtml += `<div class="agx-d-split"><div class="agx-d-cell"><span>${row.oldNo ?? ""}</span><code>${safeEsc(row.line)}</code></div><div class="agx-d-cell"><span>${row.newNo ?? ""}</span><code>${safeEsc(row.line)}</code></div></div>`;
              i++;
            } else {
              const dels = [];
              const adds = [];
              while (i < hunk.rows.length && hunk.rows[i].type === "del") dels.push(hunk.rows[i++]);
              while (i < hunk.rows.length && hunk.rows[i].type === "add") adds.push(hunk.rows[i++]);
              const max = Math.max(dels.length, adds.length);
              for (let k = 0; k < max; k++) {
                const d = dels[k];
                const a = adds[k];
                rowsHtml += `<div class="agx-d-split">
                  <div class="agx-d-cell ${d ? "del" : "empty"}"><span>${d?.oldNo ?? ""}</span><code>${d ? safeEsc(d.line) : ""}</code></div>
                  <div class="agx-d-cell ${a ? "add" : "empty"}"><span>${a?.newNo ?? ""}</span><code>${a ? safeEsc(a.line) : ""}</code></div>
                </div>`;
              }
            }
          }
          return `<div class="agx-d-hunk">Hunk #${hIdx + 1}</div>${rowsHtml}`;
        })
        .join("");
    } else {
      viewer.innerHTML = diff.hunks
        .map(
          (hunk, hIdx) =>
            `<div class="agx-d-hunk">Hunk #${hIdx + 1}</div>` +
            hunk.rows
              .map(
                (r) =>
                  `<div class="agx-d-uni ${r.type}"><span>${r.oldNo ?? ""}</span><span>${r.newNo ?? ""}</span><span>${r.type === "add" ? "+" : r.type === "del" ? "−" : " "}</span><code>${safeEsc(r.line)}</code></div>`
              )
              .join("")
        )
        .join("");
    }
  }

  // ── CODING MERGE AGENT + HF/OLLAMA CODERS ──
  async function loadCodingModelsInfo(forceRender = true) {
    const res = await window.getJSON("/api/explorer/coding-models").catch(() => null);
    if (res?.ok) {
      agxState.codingModelsInfo = res;
      if (forceRender) renderCodingModelSelectors();
      else populateModelDropdownOnly();
    }
  }

  function populateModelDropdownOnly() {
    const info = agxState.codingModelsInfo;
    if (!info) return;
    const models = info.models || [];
    const optionsHtml =
      `<option value="auto">Auto-Select Strongest Coding Model (${models[0]?.name || "Checking..."})</option>` +
      models
        .map(
          (m) =>
            `<option value="${safeEsc(m.id)}">${safeEsc(m.name)} [${safeEsc(m.size_label)}${m.is_coding_specialist ? " · Coder" : ""}]</option>`
        )
        .join("");

    [qs("#agx-merge-model-select"), qs("#agx-judge-model-select")].forEach((sel) => {
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = optionsHtml;
      if (prev && (prev === "auto" || models.some((m) => m.id === prev))) sel.value = prev;
    });
  }

  function renderCodingModelSelectors() {
    populateModelDropdownOnly();
    const info = agxState.codingModelsInfo;
    if (!info) return;

    const adv = qs("#agx-coder-advisory");
    if (adv) {
      if (info.recommended_upgrade?.needed) {
        adv.classList.remove("hidden");
        adv.innerHTML = `<strong>⚠️ Stronger Coding Model Recommended:</strong> ${safeEsc(info.recommended_upgrade.reason)}`;
      } else if (info.recommended_upgrade?.reason) {
        adv.classList.remove("hidden");
        adv.innerHTML = `<strong>✅ Coding Model Status:</strong> ${safeEsc(info.recommended_upgrade.reason)}`;
      }
    }

    const curBox = qs("#agx-hf-curated-list");
    if (curBox) {
      curBox.innerHTML = (info.curated_downloads || [])
        .map(
          (c, idx) => `
          <div class="agx-hf-item">
            <div class="agx-hf-meta">
              <strong>${safeEsc(c.name)}</strong> <span class="agx-pill">${c.vram_gb} GB VRAM · ${safeEsc(c.role)}</span>
              <div class="muted" style="font-size:11px">${safeEsc(c.why)}</div>
              <code style="font-size:10.5px">${safeEsc(c.hf_repo)} · ollama: ${safeEsc(c.ollama_tag)}</code>
            </div>
            <div class="agx-hf-btns">
              <button type="button" class="ghost xs" data-agx-ollama-pull="${safeEsc(c.ollama_tag)}" data-agx-cur-idx="${idx}" title="Pull cleanly into local Ollama">🦙 Pull Ollama</button>
              <button type="button" class="ghost xs" data-agx-hf-vault="${safeEsc(c.hf_repo)}" data-agx-hf-name="${safeEsc(c.name)}" data-agx-hf-gb="${c.vram_gb}" title="Add to Council Coding Model Vault">＋ Add to Vault</button>
              <button type="button" class="primary xs" data-agx-hf-dl="${safeEsc(c.hf_repo)}" title="Download GGUF weight file to council_outputs/models/">⬇ Download GGUF</button>
            </div>
          </div>
        `
        )
        .join("");

      wireHfModelActionButtons(curBox);
    }
  }

  function wireHfModelActionButtons(container) {
    qsa("[data-agx-ollama-pull]", container).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tag = btn.getAttribute("data-agx-ollama-pull");
        btn.disabled = true;
        btn.textContent = "Pulling…";
        safeStatus(`🦙 Requesting Ollama to pull ${tag}…`);
        const res = await window.postJSON("/api/explorer/coding-models/ollama-pull", { tag });
        btn.disabled = false;
        btn.textContent = "🦙 Pull Ollama";
        if (res?.ok) {
          safeStatus(`✅ Pulled ${tag} into Ollama!`);
          await loadCodingModelsInfo(true);
        } else {
          safeStatus(`⚠️ ${res?.error || "Ollama pull failed"}`);
        }
      });
    });

    qsa("[data-agx-hf-vault]", container).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const repo = btn.getAttribute("data-agx-hf-vault");
        const name = btn.getAttribute("data-agx-hf-name") || "";
        const gb = Number(btn.getAttribute("data-agx-hf-gb") || 0);
        btn.disabled = true;
        btn.textContent = "Adding…";
        const res = await window.postJSON("/api/explorer/coding-models/add-hf", { repo, name, gb, slot: "code" });
        btn.disabled = false;
        btn.textContent = res?.ok ? "✓ In Vault" : "＋ Add to Vault";
        safeStatus(res?.ok ? `✅ Added ${res.model?.name || repo} to Council Model Vault!` : `⚠️ ${res?.error || "Failed"}`);
      });
    });

    qsa("[data-agx-hf-dl]", container).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const repo = btn.getAttribute("data-agx-hf-dl");
        btn.disabled = true;
        btn.textContent = "Starting…";
        const res = await window.postJSON("/api/explorer/coding-models/download-gguf", { repo });
        btn.disabled = false;
        btn.textContent = "⬇ Download GGUF";
        if (res?.ok) {
          safeStatus(`⬇ Started downloading ${res.job?.filename || repo} to council_outputs/models/`);
          refreshHfDownloadJobs();
        } else {
          safeStatus(`⚠️ ${res?.error || "Download could not start"}`);
        }
      });
    });
  }

  async function refreshHfDownloadJobs() {
    const res = await window.getJSON("/api/explorer/coding-models/download-status").catch(() => null);
    const box = qs("#agx-hf-downloads-list");
    if (!box || !res?.ok) return;
    const jobs = res.jobs || [];
    if (!jobs.length) {
      box.innerHTML = `<div class="muted" style="font-size:11px">No active GGUF downloads.</div>`;
      return;
    }
    box.innerHTML = jobs
      .map(
        (j) => `
        <div class="agx-hf-dl-row">
          <div style="flex:1">
            <strong>${safeEsc(j.filename)}</strong>
            <span class="agx-pill">${safeEsc(j.status)} · ${j.percent}% (${formatBytes(j.downloaded_bytes)}${j.total_bytes ? ` / ${formatBytes(j.total_bytes)}` : ""})</span>
            ${j.error ? `<div style="color:#f87171;font-size:11px">${safeEsc(j.error)}</div>` : ""}
          </div>
          ${j.status === "starting" || j.status === "downloading" ? `<button type="button" class="ghost xs danger" data-agx-cancel-dl="${safeEsc(j.id)}">Cancel</button>` : ""}
        </div>
      `
      )
      .join("");

    qsa("[data-agx-cancel-dl]", box).forEach((btn) => {
      btn.addEventListener("click", async () => {
        await window.postJSON("/api/explorer/coding-models/download-cancel", { id: btn.getAttribute("data-agx-cancel-dl") });
        refreshHfDownloadJobs();
      });
    });

    const stillRunning = jobs.some((j) => j.status === "starting" || j.status === "downloading");
    if (stillRunning && !agxState.dlPollTimer) {
      agxState.dlPollTimer = setInterval(refreshHfDownloadJobs, 2500);
    } else if (!stillRunning && agxState.dlPollTimer) {
      clearInterval(agxState.dlPollTimer);
      agxState.dlPollTimer = null;
    }
  }

  function addFilesToMergeQueue(entries) {
    for (const e of entries || []) {
      if (e.type === "response") continue;
      const p = normRel(e.path);
      const key = `${e.modelName || "Model"}::${p}`;
      if (!agxState.mergeQueue.some((q) => q.key === key)) {
        agxState.mergeQueue.push({
          key,
          path: p,
          content: String(e.content ?? ""),
          language: e.language || p.split(".").pop() || "txt",
          modelName: e.modelName || "Model",
          fromRunId: e.fromRunId || e.runId || "",
        });
      }
    }
  }

  function renderMergeAgentPane() {
    renderCodingModelSelectors();
    if (qs("#agx-merge-queue-cnt")) qs("#agx-merge-queue-cnt").textContent = String(agxState.mergeQueue.length);
    const qBox = qs("#agx-merge-queue-list");
    if (qBox) {
      qBox.innerHTML = agxState.mergeQueue.length
        ? agxState.mergeQueue
            .map(
              (item, idx) => `
              <div class="agx-q-row">
                <span class="agx-q-txt">${iconFor(item.path)} <strong>${safeEsc(item.path)}</strong> <span class="muted">(${safeEsc(item.modelName)})</span></span>
                <button type="button" class="agx-mini-icon danger" data-agx-rm-q="${idx}" title="Remove from queue">✕</button>
              </div>`
            )
            .join("")
        : `<div class="muted" style="font-size:11.5px;padding:6px">Queue is empty. Click <strong>+ Active Run</strong>, <strong>+ Checked</strong>, or <strong>+ Project</strong> above.</div>`;

      qsa("[data-agx-rm-q]", qBox).forEach((btn) => {
        btn.addEventListener("click", () => {
          agxState.mergeQueue.splice(Number(btn.getAttribute("data-agx-rm-q")), 1);
          renderMergeAgentPane();
        });
      });
    }

    renderMergeOutputWorkbench();
    refreshHfDownloadJobs();
  }

  function renderMergeOutputWorkbench() {
    const stEl = qs("#agx-merge-status");
    const tabsEl = qs("#agx-merge-result-tabs");
    const bodyEl = qs("#agx-merge-result-body");
    qs("#agx-merge-view-code-btn")?.classList.toggle("is-active", agxState.mergePreviewMode === "code");
    qs("#agx-merge-view-diff-btn")?.classList.toggle("is-active", agxState.mergePreviewMode === "diff");

    const r = agxState.mergeResult;
    if (!r) {
      if (tabsEl) tabsEl.innerHTML = "";
      if (bodyEl) bodyEl.innerHTML = `<div class="agx-empty">No merged files generated yet.</div>`;
      return;
    }
    if (!r.ok) {
      if (stEl) stEl.textContent = `⚠️ Merge paused: ${r.error || "No active coding model configured."}`;
      if (tabsEl) tabsEl.innerHTML = "";
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="agx-advisory" style="margin:14px">
            <strong>⚠️ Coding Model Needed:</strong> ${safeEsc(r.error || "Could not reach a coding model.")}
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="primary xs" data-agx-open-keys-btn="1">🔑 Configure API Keys (/keys)</button>
              <button type="button" class="ghost xs" data-agx-open-hf-btn="1">🤗 Get Hugging Face / Ollama Coders</button>
            </div>
          </div>`;
        qs("[data-agx-open-keys-btn]", bodyEl)?.addEventListener("click", () => {
          qs("#topbar-vault-hub-btn")?.click();
        });
        qs("[data-agx-open-hf-btn]", bodyEl)?.addEventListener("click", () => {
          qs("#agx-hf-drawer")?.classList.remove("hidden");
          qs("#agx-hf-search-input")?.focus();
        });
      }
      return;
    }

    const mf = r.merged_files || [];
    if (stEl) stEl.textContent = r.summary || `Merged ${mf.length} file(s) with ${r.used_model}.`;
    if (agxState.mergeActiveFileIdx >= mf.length) agxState.mergeActiveFileIdx = 0;

    if (tabsEl) {
      tabsEl.innerHTML = mf
        .map((f, idx) => {
          const valid = f.analysis ? f.analysis.valid : true;
          return `
            <button type="button" class="agx-tab ${idx === agxState.mergeActiveFileIdx ? "is-active" : ""}" data-agx-mtab="${idx}">
              ${valid ? "✓" : "⚠"} ${iconFor(f.path)} ${safeEsc(f.path)}
            </button>`;
        })
        .join("");
      qsa("[data-agx-mtab]", tabsEl).forEach((btn) => {
        btn.addEventListener("click", () => {
          agxState.mergeActiveFileIdx = Number(btn.getAttribute("data-agx-mtab"));
          renderMergeOutputWorkbench();
        });
      });
    }

    const activeFile = mf[agxState.mergeActiveFileIdx];
    if (!bodyEl) return;
    if (!activeFile) {
      bodyEl.innerHTML = `<pre class="agx-merge-code-pre">${safeEsc(r.raw_output || "(Empty output)")}</pre>`;
      return;
    }

    if (agxState.mergePreviewMode === "diff") {
      const wsMatch = (agxState.activeWorkspace.files || []).find((w) => normRel(w.path) === normRel(activeFile.path));
      const diff = computeDiff(wsMatch?.content || "", activeFile.content || "");
      if (diff.identical || !diff.hunks.length) {
        bodyEl.innerHTML = `<div class="agx-ok-banner" style="margin:12px">✓ Identical to current file in Merged Project.</div>`;
      } else {
        bodyEl.innerHTML =
          `<div class="agx-diff-viewer">` +
          diff.hunks
            .map(
              (h, hi) =>
                `<div class="agx-d-hunk">Hunk #${hi + 1} (${wsMatch ? "Merged Project" : "New File"} → Merge Agent)</div>` +
                h.rows
                  .map(
                    (row) =>
                      `<div class="agx-d-uni ${row.type}"><span>${row.oldNo ?? ""}</span><span>${row.newNo ?? ""}</span><span>${row.type === "add" ? "+" : row.type === "del" ? "−" : " "}</span><code>${safeEsc(row.line)}</code></div>`
                  )
                  .join("")
            )
            .join("") +
          `</div>`;
      }
    } else {
      const errs = activeFile.analysis?.errors || [];
      bodyEl.innerHTML = `
        ${errs.length ? `<div class="agx-conflict-item high" style="margin:8px"><strong>Syntax Check:</strong> ${safeEsc(errs.join("; "))}</div>` : ""}
        <pre class="agx-merge-code-pre">${safeEsc(activeFile.content || "")}</pre>
      `;
    }
  }

  async function loadDiskTree() {
    const res = await window.getJSON("/api/explorer/disk-tree").catch(() => null);
    if (res?.ok && Array.isArray(res.diskFiles)) {
      agxState.diskFiles = res.diskFiles;
      renderExplorerView();
    }
  }

  async function loadExplorerRunsFromServer(preferRunId = null) {
    const res = await window.getJSON("/api/explorer/runs").catch(() => null);
    if (res?.ok && Array.isArray(res.runs)) {
      agxState.runs = res.runs;
      if (res.workspace && Array.isArray(res.workspace.files)) {
        agxState.activeWorkspace = res.workspace;
      }
      if (preferRunId) {
        agxState.activeRunId = preferRunId;
      } else if (!agxState.activeRunId || !agxState.runs.some((r) => r.id === agxState.activeRunId)) {
        agxState.activeRunId = agxState.runs[0]?.id || null;
      }

      const badge = qs("#topbar-explorer-badge");
      if (badge) {
        const totalFilesAll = agxState.runs.reduce((s, r) => s + Number(r.totalFiles || 0), 0);
        badge.textContent = `${agxState.runs.length}R/${totalFilesAll}F`;
        badge.classList.remove("hidden");
      }
      renderExplorerView();
    }
  }

  async function openDiskFileInExplorer(relPath, openInPreview = false) {
    const cleanRel = normRel(relPath);
    if (!cleanRel) return;
    if (!agxState.diskFiles.length) await loadDiskTree();
    agxState.mode = "project";
    agxState.projectScope = "disk";
    const segs = cleanRel.split("/").slice(0, -1);
    navigateTo({ mode: "project", projectScope: "disk", navPath: segs });
    if (openInPreview) agxState.editorMode = "preview";
    else agxState.editorMode = "code";
    qs("#agx-ed-mode-code")?.classList.toggle("is-active", agxState.editorMode === "code");
    qs("#agx-ed-mode-preview")?.classList.toggle("is-active", agxState.editorMode === "preview");
    qs("#agx-ed-code-wrap")?.classList.toggle("hidden", agxState.editorMode !== "code");
    qs("#agx-ed-preview-wrap")?.classList.toggle("hidden", agxState.editorMode !== "preview");
    await openFileInViewer({
      checkKey: `disk::${cleanRel}`,
      path: cleanRel,
      source: "disk",
      type: "file",
      modelName: "Workspace Disk",
    });
  }

  function initDedicatedFileExplorerView() {
    if (agxState.initialized) return;
    const root = qs("#view-file-explorer");
    if (!root) return;
    agxState.initialized = true;

    // Fetch toolchains summary
    window.getJSON("/api/toolchains/status")
      .then((st) => {
        const pill = qs("#agx-toolchain-pill");
        if (pill && st?.ok) {
          pill.textContent = `${st.python || "Python 3"} · ${st.node || "Node"} · Windows PE32+`;
        }
      })
      .catch(() => {});

    // Primary mode tabs
    qs("#agx-tab-models")?.addEventListener("click", () => navigateTo({ mode: "models", navPath: [] }));
    qs("#agx-tab-project")?.addEventListener("click", () => navigateTo({ mode: "project", navPath: [] }));
    qs("#agx-tab-judge")?.addEventListener("click", () => navigateTo({ mode: "judge" }));
    qs("#agx-tab-merge")?.addEventListener("click", () => navigateTo({ mode: "merge" }));

    // Sync button
    qs("#agx-sync-btn")?.addEventListener("click", async () => {
      const curMode = typeof MODE !== "undefined" ? MODE : "ask";
      if (window._lastAnswers && Object.keys(window._lastAnswers).length && typeof window.recordPromptRunToFileExplorer === "function") {
        await window.recordPromptRunToFileExplorer(window._lastAnswers, window._lastPrompt || "Synced Workspace Run", curMode);
      }
      await Promise.all([loadExplorerRunsFromServer(), loadDiskTree(), loadCodingModelsInfo(false)]);
      safeStatus("↻ Synced Explorer runs, disk tree, and coding models.");
    });

    qs("#agx-open-pc-btn")?.addEventListener("click", async () => {
      const files = (agxState.activeWorkspace.files || []).map((f) => ({ path: f.path, content: f.content }));
      const targetDir = agxState.activeWorkspace.outputDir || "council_outputs/active_merged_workspace";
      const res = await window.postJSON("/api/workspace/open", { path: targetDir, files, reveal_in_explorer: true });
      pushOutputLog(
        res?.ok
          ? `📂 Staged ${res.files_written?.length || files.length} file(s) & opened ${res.path} (${res.opened_with || "explorer"})`
          : `⚠️ ${res?.error || "Could not open workspace folder."}`
      );
    });

    qs("#agx-back-council-btn")?.addEventListener("click", () => {
      qs('.rail-btn[data-view="council"]')?.click();
    });

    qs("#tools-open-file-explorer-btn")?.addEventListener("click", () => {
      qs('.rail-btn[data-view="file-explorer"]')?.click();
    });

    // Browser Navigation Toolbar
    qs("#agx-nav-back-btn")?.addEventListener("click", () => {
      if (agxState.histIdx <= 0) return;
      agxState.histIdx -= 1;
      navigateTo(agxState.history[agxState.histIdx], false);
    });
    qs("#agx-nav-fwd-btn")?.addEventListener("click", () => {
      if (agxState.histIdx >= agxState.history.length - 1) return;
      agxState.histIdx += 1;
      navigateTo(agxState.history[agxState.histIdx], false);
    });
    qs("#agx-nav-up-btn")?.addEventListener("click", () => {
      if (!agxState.navPath.length) return;
      navigateTo({ navPath: agxState.navPath.slice(0, -1) });
    });

    // Project sub-scopes
    qs("#agx-scope-merged")?.addEventListener("click", () => navigateTo({ mode: "project", projectScope: "merged", navPath: [] }));
    qs("#agx-scope-combined")?.addEventListener("click", () => navigateTo({ mode: "project", projectScope: "combined", navPath: [] }));
    qs("#agx-scope-disk")?.addEventListener("click", () => {
      loadDiskTree();
      navigateTo({ mode: "project", projectScope: "disk", navPath: [] });
    });

    // Quick access sidebar items
    qs("#agx-qa-models")?.addEventListener("click", () => navigateTo({ mode: "models", navPath: [] }));
    qs("#agx-qa-merged")?.addEventListener("click", () => navigateTo({ mode: "project", projectScope: "merged", navPath: [] }));
    qs("#agx-qa-combined")?.addEventListener("click", () => navigateTo({ mode: "project", projectScope: "combined", navPath: [] }));
    qs("#agx-qa-disk")?.addEventListener("click", () => {
      loadDiskTree();
      navigateTo({ mode: "project", projectScope: "disk", navPath: [] });
    });

    // Flatten toggle, Search, View Style
    qs("#agx-flatten-runs-cb")?.addEventListener("change", (e) => {
      agxState.flattenRuns = Boolean(e.target.checked);
      navigateTo({ mode: "models", navPath: [] });
    });
    qs("#agx-search-input")?.addEventListener("input", () => renderBrowsePane());
    qs("#agx-view-details-btn")?.addEventListener("click", () => {
      agxState.viewStyle = "details";
      renderBrowsePane();
    });
    qs("#agx-view-icons-btn")?.addEventListener("click", () => {
      agxState.viewStyle = "icons";
      renderBrowsePane();
    });

    // Action Ribbon
    qs("#agx-new-file-btn")?.addEventListener("click", () => openInlinePrompt("file", agxState.mode === "project" && agxState.navPath.length ? `${agxState.navPath.join("/")}/` : ""));
    qs("#agx-new-folder-btn")?.addEventListener("click", () => openInlinePrompt("folder", agxState.mode === "project" && agxState.navPath.length ? `${agxState.navPath.join("/")}/` : ""));
    qs("#agx-inline-create-confirm")?.addEventListener("click", commitInlinePrompt);
    qs("#agx-inline-create-cancel")?.addEventListener("click", () => {
      agxState.inlineCreateMode = null;
      qs("#agx-inline-create-bar")?.classList.add("hidden");
    });
    qs("#agx-inline-create-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commitInlinePrompt();
      else if (e.key === "Escape") qs("#agx-inline-create-cancel")?.click();
    });

    qs("#agx-select-all-btn")?.addEventListener("click", () => {
      for (const f of agxState._visibleFiles || []) {
        agxState.checkedMap.set(f.checkKey, f);
      }
      for (const d of agxState._visibleDirs || []) {
        for (const f of d.filesInside || []) {
          if (f.type !== "response") agxState.checkedMap.set(f.checkKey, f);
        }
      }
      renderExplorerView();
    });
    qs("#agx-clear-sel-btn")?.addEventListener("click", () => {
      agxState.checkedMap.clear();
      renderExplorerView();
    });
    qs("#agx-add-checked-proj-btn")?.addEventListener("click", async () => {
      let list = Array.from(agxState.checkedMap.values());
      if (!list.length) {
        list = [...(agxState._visibleFiles || []), ...(agxState._visibleDirs || []).flatMap((d) => d.filesInside || [])];
      }
      await stageFilesIntoMergedProject(list);
    });

    qs("#agx-compare-checked-btn")?.addEventListener("click", async () => {
      const checked = Array.from(agxState.checkedMap.values()).filter((f) => f.type !== "response");
      await populateJudgeAndDiffControls(checked[0]?.checkKey, checked[1]?.checkKey);
      if (qs("#agx-judge-scope") && checked.length) qs("#agx-judge-scope").value = "checked";
      navigateTo({ mode: "judge" });
      if (checked.length >= 1) qs("#agx-run-judge-btn")?.click();
    });

    qs("#agx-merge-checked-btn")?.addEventListener("click", async () => {
      let list = Array.from(agxState.checkedMap.values()).filter((f) => f.type !== "response");
      if (!list.length) {
        list = [...(agxState._visibleFiles || []), ...(agxState._visibleDirs || []).flatMap((d) => d.filesInside || [])].filter((f) => f.type !== "response");
      }
      for (const f of list) f.content = await ensureFileContentLoaded(f);
      addFilesToMergeQueue(list);
      navigateTo({ mode: "merge" });
    });

    qs("#agx-run-project-btn")?.addEventListener("click", () => runCompileOrExe("run"));
    qs("#agx-build-exe-btn")?.addEventListener("click", () => runCompileOrExe("exe"));
    qs("#agx-clear-project-btn")?.addEventListener("click", async () => {
      const res = await window.postJSON("/api/explorer/workspace/file?path=*", { path: "*" }, "DELETE");
      if (res?.ok && res.workspace) {
        agxState.activeWorkspace = res.workspace;
        renderExplorerView();
        safeStatus("Cleared all files from Merged Project.");
      }
    });

    // Editor Panel Events
    const ta = qs("#agx-editor-textarea");
    ta?.addEventListener("scroll", () => {
      if (qs("#agx-editor-gutter")) qs("#agx-editor-gutter").scrollTop = ta.scrollTop;
    });
    ta?.addEventListener("input", () => {
      syncEditorGutter();
      if (agxState.activeTabKey) {
        const val = ta.value;
        if (val === agxState.savedBuffers.get(agxState.activeTabKey)) agxState.dirtyBuffers.delete(agxState.activeTabKey);
        else agxState.dirtyBuffers.set(agxState.activeTabKey, val);
        renderOpenTabs();
      }
    });
    ta?.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        qs("#agx-ed-save-btn")?.click();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 2;
        ta.dispatchEvent(new Event("input"));
      }
    });

    const setEdMode = (m) => {
      agxState.editorMode = m;
      qs("#agx-ed-mode-code")?.classList.toggle("is-active", m === "code");
      qs("#agx-ed-mode-preview")?.classList.toggle("is-active", m === "preview");
      qs("#agx-ed-code-wrap")?.classList.toggle("hidden", m !== "code");
      qs("#agx-ed-preview-wrap")?.classList.toggle("hidden", m !== "preview");
      if (m === "preview") renderEditorPreview();
    };
    qs("#agx-ed-mode-code")?.addEventListener("click", () => setEdMode("code"));
    qs("#agx-ed-mode-preview")?.addEventListener("click", () => setEdMode("preview"));

    qs("#agx-ed-save-btn")?.addEventListener("click", async () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      const newVal = qs("#agx-editor-textarea")?.value ?? "";
      agxState.dirtyBuffers.delete(tab.tabKey);
      agxState.savedBuffers.set(tab.tabKey, newVal);
      tab.ref.content = newVal;

      if (tab.ref.source === "disk") {
        agxState.diskContentCache.set(normRel(tab.ref.path), newVal);
        const res = await window.postJSON("/api/explorer/disk-save", { path: tab.ref.path, content: newVal });
        safeStatus(res?.ok ? `💾 Saved '${tab.ref.path}' on disk.` : `⚠️ ${res?.error || "Read-only; use Add to Project"}`);
      } else if (tab.ref.source === "workspace") {
        await stageFilesIntoMergedProject([{ ...tab.ref, content: newVal }]);
      } else if (tab.ref.source === "run") {
        const body = tab.ref.type === "file"
          ? { modelIdx: tab.ref.modelIdx, fileIdx: tab.ref.fileIdx, content: newVal }
          : { modelIdx: tab.ref.modelIdx, responseText: newVal };
        const res = await window.postJSON(`/api/explorer/runs/${encodeURIComponent(tab.ref.runId)}`, body, "PATCH");
        if (res?.ok && Array.isArray(res.runs)) agxState.runs = res.runs;
        safeStatus(`💾 Saved edits to '${tab.ref.path}' in run memory.`);
      }
      renderOpenTabs();
    });

    qs("#agx-ed-add-proj-btn")?.addEventListener("click", async () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      await stageFilesIntoMergedProject([{ ...tab.ref, content: qs("#agx-editor-textarea")?.value ?? tab.ref.content, type: "file" }]);
    });

    qs("#agx-ed-rename-btn")?.addEventListener("click", () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (tab) openInlinePrompt("rename", normRel(tab.ref.path));
    });

    qs("#agx-ed-revert-btn")?.addEventListener("click", async () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      if (agxState.dirtyBuffers.has(tab.tabKey)) {
        agxState.dirtyBuffers.delete(tab.tabKey);
        openFileInViewer(tab.ref);
        safeStatus(`↺ Restored saved buffer for '${tab.ref.path}'.`);
        return;
      }
      if (tab.ref.source === "workspace") {
        const res = await window.postJSON("/api/explorer/workspace/revert", { path: tab.ref.path });
        if (res?.ok && res.workspace) {
          agxState.activeWorkspace = res.workspace;
          const wf = res.workspace.files.find((f) => normRel(f.path) === normRel(tab.ref.path));
          if (wf) openFileInViewer({ ...tab.ref, content: wf.content });
          safeStatus(`↺ Reverted '${tab.ref.path}' to previous version.`);
        } else {
          safeStatus(res?.error || "No prior history recorded for this file.");
        }
      }
    });

    qs("#agx-ed-compare-btn")?.addEventListener("click", async () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      await populateJudgeAndDiffControls();
      const targetKey = agxState.diffCatalog.find((c) => c.path === normRel(tab.ref.path) && c.modelName === tab.ref.modelName)?.key
        || agxState.diffCatalog.find((c) => c.path === normRel(tab.ref.path))?.key;
      const peerKey = agxState.diffCatalog.find((c) => c.path === normRel(tab.ref.path) && c.key !== targetKey)?.key;
      await populateJudgeAndDiffControls(targetKey, peerKey);
      navigateTo({ mode: "judge" });
    });

    qs("#agx-ed-run-btn")?.addEventListener("click", () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      const curPath = normRel(tab.ref.path);
      const val = qs("#agx-editor-textarea")?.value ?? tab.ref.content ?? "";
      const primary = { path: curPath, content: val, language: tab.ref.language, modelName: tab.ref.modelName };
      const siblings = (agxState.activeWorkspace.files || [])
        .filter((wf) => normRel(wf.path) !== curPath)
        .map((wf) => ({ path: normRel(wf.path), content: wf.content, language: wf.language, modelName: wf.fromModelName }));
      runCompileOrExe("run", [primary, ...siblings], curPath);
    });

    qs("#agx-ed-copy-btn")?.addEventListener("click", async () => {
      const val = qs("#agx-editor-textarea")?.value || "";
      try {
        await navigator.clipboard.writeText(val);
      } catch {
        qs("#agx-editor-textarea")?.select();
        document.execCommand("copy");
      }
      safeStatus("📋 Copied file content to clipboard.");
    });

    qs("#agx-ed-download-btn")?.addEventListener("click", () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      const val = qs("#agx-editor-textarea")?.value ?? tab.ref.content ?? "";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([val], { type: "text/plain;charset=utf-8" }));
      a.download = normRel(tab.ref.path).split("/").pop() || "file.txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1500);
    });

    qs("#agx-ed-delete-btn")?.addEventListener("click", async () => {
      const tab = agxState.openTabs.find((t) => t.tabKey === agxState.activeTabKey);
      if (!tab) return;
      const p = normRel(tab.ref.path);
      if (tab.ref.source === "workspace") {
        const res = await window.postJSON(`/api/explorer/workspace/file?path=${encodeURIComponent(p)}`, { path: p }, "DELETE");
        if (res?.ok && res.workspace) agxState.activeWorkspace = res.workspace;
      } else if (tab.ref.source === "disk") {
        const res = await window.postJSON(`/api/explorer/disk-file?path=${encodeURIComponent(p)}`, { path: p }, "DELETE");
        if (!res?.ok) {
          safeStatus(`⚠️ ${res?.error || "Cannot delete outside council_outputs/"}`);
          return;
        }
        await loadDiskTree();
      }
      agxState.openTabs = agxState.openTabs.filter((t) => t.tabKey !== tab.tabKey);
      agxState.activeTabKey = agxState.openTabs[agxState.openTabs.length - 1]?.tabKey || "";
      if (!agxState.activeTabKey) qs("#agx-editor-panel")?.classList.add("hidden");
      else openFileInViewer(agxState.openTabs[agxState.openTabs.length - 1].ref);
      renderExplorerView();
      safeStatus(`🗑 Removed '${p}'.`);
    });

    qs("#agx-ed-expand-btn")?.addEventListener("click", () => {
      agxState.editorExpanded = !agxState.editorExpanded;
      qs("#agx-editor-panel")?.classList.toggle("is-expanded", agxState.editorExpanded);
    });

    qs("#agx-ed-close-btn")?.addEventListener("click", () => {
      agxState.editorExpanded = false;
      qs("#agx-editor-panel")?.classList.remove("is-expanded");
      qs("#agx-editor-panel")?.classList.add("hidden");
    });

    qs("#agx-output-close-btn")?.addEventListener("click", () => {
      qs("#agx-output-drawer")?.classList.add("hidden");
    });

    // Judge & Compare Events
    qs("#agx-run-judge-btn")?.addEventListener("click", async () => {
      const btn = qs("#agx-run-judge-btn");
      const files = await getFilesForJudgeScope();
      if (!files.length) {
        safeStatus("⚠️ No files in the selected Judge scope. Generate a run or add files to Merged Project first.");
        return;
      }
      if (btn) {
        btn.disabled = true;
        btn.textContent = "⚖️ Judging…";
      }
      try {
        const res = await window.postJSON("/api/explorer/judge-compare", {
          files,
          judge_model: qs("#agx-judge-model-select")?.value || "auto",
          use_ai: Boolean(qs("#agx-judge-use-ai")?.checked),
        });
        if (res?.ok) {
          agxState.judgeResult = res;
          renderJudgeResults();
          safeStatus(`⚖️ Judge finished (${res.overall_compatibility_score}/100 compatibility).`);
        } else {
          safeStatus(`❌ Judge failed: ${res?.error || "Unknown error"}`);
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "⚖️ Run Compatibility Judge";
        }
      }
    });

    qs("#agx-judge-apply-clean-btn")?.addEventListener("click", async () => {
      const winners = agxState.judgeResult?.clean_winner_files || [];
      if (!winners.length) {
        safeStatus("Run Compatibility Judge first to compute winning files.");
        return;
      }
      await stageFilesIntoMergedProject(winners.map((f) => ({ ...f, source: "run", type: "file" })));
      navigateTo({ mode: "project", projectScope: "merged", navPath: [] });
    });

    qs("#agx-judge-send-merge-btn")?.addEventListener("click", async () => {
      const r = agxState.judgeResult;
      const scopeFiles = await getFilesForJudgeScope();
      if (!scopeFiles.length) {
        safeStatus("No files in scope to send to Merge Agent.");
        return;
      }
      const conflictPaths = new Set((r?.conflicts || []).map((c) => normRel(c.path)));
      const needAiPaths = new Set(
        (r?.file_matrix || []).filter((row) => row.status !== "clean_merge").map((row) => normRel(row.path))
      );
      const targeted = scopeFiles.filter((f) => conflictPaths.has(normRel(f.path)) || needAiPaths.has(normRel(f.path)));
      addFilesToMergeQueue(targeted.length ? targeted : scopeFiles);
      if (r?.merge_plan && qs("#agx-merge-instructions")) {
        qs("#agx-merge-instructions").value = r.merge_plan;
      }
      navigateTo({ mode: "merge" });
    });

    qs("#agx-diff-left-sel")?.addEventListener("change", renderDiffComparator);
    qs("#agx-diff-right-sel")?.addEventListener("change", renderDiffComparator);
    qs("#agx-diff-split-btn")?.addEventListener("click", () => {
      agxState.diffStyle = "split";
      renderDiffComparator();
    });
    qs("#agx-diff-unified-btn")?.addEventListener("click", () => {
      agxState.diffStyle = "unified";
      renderDiffComparator();
    });
    qs("#agx-diff-pick-left-btn")?.addEventListener("click", async () => {
      const item = agxState.diffCatalog.find((c) => c.key === qs("#agx-diff-left-sel")?.value);
      if (item) await stageFilesIntoMergedProject([item]);
    });
    qs("#agx-diff-pick-right-btn")?.addEventListener("click", async () => {
      const item = agxState.diffCatalog.find((c) => c.key === qs("#agx-diff-right-sel")?.value);
      if (item) await stageFilesIntoMergedProject([item]);
    });
    qs("#agx-diff-merge-pair-btn")?.addEventListener("click", () => {
      const l = agxState.diffCatalog.find((c) => c.key === qs("#agx-diff-left-sel")?.value);
      const r = agxState.diffCatalog.find((c) => c.key === qs("#agx-diff-right-sel")?.value);
      const pair = [l, r].filter(Boolean);
      if (!pair.length) return;
      addFilesToMergeQueue(pair);
      navigateTo({ mode: "merge" });
    });

    // Merge Agent Events
    qs("#agx-refresh-models-btn")?.addEventListener("click", async () => {
      await loadCodingModelsInfo(true);
      safeStatus("↻ Refreshed live coding & judge models.");
    });

    qs("#agx-merge-add-run-btn")?.addEventListener("click", () => {
      const actRun = getActiveRun();
      if (!actRun) return safeStatus("No active run available.");
      const files = [];
      (actRun.models || []).forEach((m) =>
        (m.files || []).forEach((f) => files.push({ ...f, modelName: m.modelName, fromRunId: actRun.id }))
      );
      addFilesToMergeQueue(files);
      renderMergeAgentPane();
    });

    qs("#agx-merge-add-checked-btn")?.addEventListener("click", async () => {
      const list = Array.from(agxState.checkedMap.values()).filter((f) => f.type !== "response");
      for (const f of list) f.content = await ensureFileContentLoaded(f);
      addFilesToMergeQueue(list);
      renderMergeAgentPane();
    });

    qs("#agx-merge-add-project-btn")?.addEventListener("click", () => {
      const list = (agxState.activeWorkspace.files || []).map((f) => ({
        path: f.path,
        content: f.content,
        language: f.language,
        modelName: f.fromModelName || "Merged Project",
      }));
      addFilesToMergeQueue(list);
      renderMergeAgentPane();
    });

    qs("#agx-merge-clear-queue-btn")?.addEventListener("click", () => {
      agxState.mergeQueue = [];
      renderMergeAgentPane();
    });

    qs("#agx-run-merge-agent-btn")?.addEventListener("click", async () => {
      if (!agxState.mergeQueue.length) {
        safeStatus("Queue at least 1 file first using + Active Run, + Checked, or + Project.");
        return;
      }
      const btn = qs("#agx-run-merge-agent-btn");
      btn.disabled = true;
      btn.textContent = "🔀 Merging Files…";
      if (qs("#agx-merge-status")) qs("#agx-merge-status").textContent = "⏳ Coding Merge Agent is reconciling files and checking syntax…";
      try {
        const res = await window.postJSON("/api/explorer/merge-agent", {
          files: agxState.mergeQueue,
          coding_model: qs("#agx-merge-model-select")?.value || "auto",
          strategy: qs("#agx-merge-strategy")?.value || "smart_merge",
          instructions: qs("#agx-merge-instructions")?.value || "",
          conflicts: agxState.judgeResult?.conflicts || [],
          merge_plan: agxState.judgeResult?.merge_plan || "",
          save_run: true,
        });
        agxState.mergeResult = res;
        agxState.mergeActiveFileIdx = 0;
        renderMergeOutputWorkbench();
        if (res?.ok && res.run_id) await loadExplorerRunsFromServer(res.run_id);
        safeStatus(res?.ok ? `✅ ${res.summary}` : `⚠️ ${res?.error || "Merge failed"}`);
      } finally {
        btn.disabled = false;
        btn.textContent = "🔀 Run Coding Merge Agent";
      }
    });

    qs("#agx-merge-apply-all-btn")?.addEventListener("click", async () => {
      const files = agxState.mergeResult?.merged_files || [];
      if (!files.length) return safeStatus("Run Merge Agent first.");
      await stageFilesIntoMergedProject(
        files.map((f) => ({ ...f, modelName: `Merge Agent (${agxState.mergeResult?.used_model || "Coder"})`, source: "run", type: "file" }))
      );
      navigateTo({ mode: "project", projectScope: "merged", navPath: [] });
    });

    qs("#agx-merge-apply-run-btn")?.addEventListener("click", async () => {
      const files = agxState.mergeResult?.merged_files || [];
      if (!files.length) return safeStatus("Run Merge Agent first.");
      await stageFilesIntoMergedProject(
        files.map((f) => ({ ...f, modelName: `Merge Agent (${agxState.mergeResult?.used_model || "Coder"})`, source: "run", type: "file" }))
      );
      navigateTo({ mode: "project", projectScope: "merged", navPath: [] });
      await runCompileOrExe("run", files);
    });

    qs("#agx-merge-apply-one-btn")?.addEventListener("click", async () => {
      const f = (agxState.mergeResult?.merged_files || [])[agxState.mergeActiveFileIdx];
      if (!f) return safeStatus("No merged file selected.");
      await stageFilesIntoMergedProject([{ ...f, modelName: `Merge Agent (${agxState.mergeResult?.used_model || "Coder"})`, source: "run", type: "file" }]);
    });

    qs("#agx-merge-view-code-btn")?.addEventListener("click", () => {
      agxState.mergePreviewMode = "code";
      renderMergeOutputWorkbench();
    });
    qs("#agx-merge-view-diff-btn")?.addEventListener("click", () => {
      agxState.mergePreviewMode = "diff";
      renderMergeOutputWorkbench();
    });

    // HF / Ollama Coders Drawer Events
    qs("#agx-hf-drawer-toggle-btn")?.addEventListener("click", () => {
      qs("#agx-hf-drawer")?.classList.toggle("hidden");
    });
    qs("#agx-hf-refresh-dl-btn")?.addEventListener("click", refreshHfDownloadJobs);
    qs("#agx-hf-search-btn")?.addEventListener("click", async () => {
      const q = (qs("#agx-hf-search-input")?.value || "").trim() || "qwen2.5-coder gguf";
      const out = qs("#agx-hf-search-results");
      if (out) out.innerHTML = `<div class="muted" style="font-size:11.5px">Searching Hugging Face for "${safeEsc(q)}"…</div>`;
      const res = await window.postJSON("/api/explorer/hf-search-coders", { query: q });
      if (!out) return;
      if (!res?.ok || !(res.models || []).length) {
        out.innerHTML = `<div class="muted" style="font-size:11.5px">${safeEsc(res?.error || "No matching Hugging Face models found.")}</div>`;
        return;
      }
      out.innerHTML = res.models
        .map(
          (m) => `
          <div class="agx-hf-item">
            <div class="agx-hf-meta">
              <strong>${safeEsc(m.repo)}</strong>
              <span class="agx-pill">⬇ ${(m.downloads || 0).toLocaleString()} · ❤ ${m.likes || 0}${m.gated ? " · Gated" : ""}</span>
            </div>
            <div class="agx-hf-btns">
              <button type="button" class="ghost xs" data-agx-hf-vault="${safeEsc(m.repo)}" data-agx-hf-name="${safeEsc(m.repo.split("/")[1] || m.repo)}" data-agx-hf-gb="10">＋ Add to Vault</button>
              ${m.is_gguf ? `<button type="button" class="primary xs" data-agx-hf-dl="${safeEsc(m.repo)}">⬇ Download GGUF</button>` : ""}
            </div>
          </div>`
        )
        .join("");
      wireHfModelActionButtons(out);
    });

    // Initial load
    loadExplorerRunsFromServer();
    loadDiskTree();
    loadCodingModelsInfo(false);
  }

  window.recordPromptRunToFileExplorer = async function (answersMap = {}, promptText = "", mode = "ask") {
    try {
      const entries = Object.entries(answersMap || {});
      if (!entries.length && !window._lastVerdict) return;

      const modelsPayload = [];
      for (const [k, ansObj] of entries) {
        const rawText = typeof ansObj === "string" ? ansObj : String(ansObj?.text || ansObj?.raw || ansObj?.content || "");
        if (!rawText.trim()) continue;
        const stRef = typeof STATE !== "undefined" ? STATE : window.STATE;
        const backendObj = stRef?.backends?.find((b) => String(b.i) === String(k));
        const modelName =
          ansObj?.name ||
          ansObj?.model ||
          backendObj?.name ||
          (isNaN(Number(k)) ? String(k) : `Model #${k}`);
        const hostId = backendObj?.host_id ? `Host ${String(backendObj.host_id).toUpperCase()}` : backendObj?.provider || "Council";
        const parsedFiles =
          typeof window.extractFilesFromMarkdownForExplorer === "function"
            ? window.extractFilesFromMarkdownForExplorer(rawText)
            : [];
        modelsPayload.push({
          modelId: backendObj?.model || String(k),
          modelName,
          host: hostId,
          responseText: rawText,
          files: parsedFiles,
        });
      }

      if (window._lastVerdict && String(window._lastVerdict).trim()) {
        modelsPayload.push({
          modelId: "verdict-synthesis",
          modelName: "⚖️ Verdict Synthesis",
          host: "Judge",
          responseText: String(window._lastVerdict),
          files:
            typeof window.extractFilesFromMarkdownForExplorer === "function"
              ? window.extractFilesFromMarkdownForExplorer(String(window._lastVerdict))
              : [],
        });
      }

      if (!modelsPayload.length) return;
      const saved = await window.postJSON("/api/explorer/runs", {
        prompt: promptText || window._lastPrompt || "Workspace Prompt Run",
        mode,
        models: modelsPayload,
      });
      if (saved?.ok && saved.run) {
        await loadExplorerRunsFromServer(saved.run.id);
      }
    } catch (err) {
      if (typeof window.pushClientLiveConsole === "function") {
        window.pushClientLiveConsole("ERROR", `File Explorer archive error: ${err.message || err}`, "error");
      }
    }
  };

  window.loadExplorerRunsFromServer = loadExplorerRunsFromServer;
  window.openExplorerDiskFile = openDiskFileInExplorer;
  window.openDiskFileInExplorer = openDiskFileInExplorer;
  window.initDedicatedFileExplorerView = initDedicatedFileExplorerView;
  window.refreshFileExplorerView = function () {
    initDedicatedFileExplorerView();
    loadExplorerRunsFromServer(agxState.activeRunId);
    loadDiskTree();
    loadCodingModelsInfo(false);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(initDedicatedFileExplorerView, 80));
  } else {
    setTimeout(initDedicatedFileExplorerView, 80);
  }
})();

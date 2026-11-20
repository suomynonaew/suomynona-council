// ============================================================================

let _activeInCliBucketId = "";

function renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows) {
  return appendInteractiveDom((panel) => {
    const buckets = Array.isArray(STATE.hf_buckets) ? STATE.hf_buckets : [];
    const ggufList = Array.isArray(STATE.custom_gguf) ? STATE.custom_gguf : [];
    const apiList = Array.isArray(STATE.custom_models) ? STATE.custom_models : [];
    const totalVault = ggufList.length + apiList.length;

    if (!_activeInCliBucketId && buckets.length) {
      _activeInCliBucketId = buckets[0].id;
    }
    const selectedBucket = buckets.find((b) => b.id === _activeInCliBucketId) || buckets[0] || null;
    const bucketModels = selectedBucket?.models || [];

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(46,230,166,.25)">
        <strong style="color:#2ee6a6;font-size:12.5px">📦 IN-CLI HUGGING FACE BUCKETS, BUCKET MODELS &amp; 4-LAYER VAULT</strong>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="primary xs incli-link-bucket-btn">＋ Link HF Bucket</button>
          <button type="button" class="ghost xs incli-add-gguf-btn">＋ Add Custom GGUF/API</button>
          <button type="button" class="ghost xs incli-sync-buckets-btn">↻ Sync All Buckets</button>
        </div>
      </div>

      <!-- 1. LINKED BUCKETS -->
      <div style="font-size:11.5px;font-weight:700;color:#93c5fd;margin-bottom:4px">
        1. Linked Hugging Face Buckets (${buckets.length}) — Click a bucket to inspect its models:
      </div>
      <div class="in-cli-scroll-list" style="max-height:140px;margin-bottom:10px">
        ${buckets.length === 0
        ? `<div class="muted" style="padding:6px 8px;font-size:11.5px">No personal buckets linked yet. Type <code>link hf://buckets/owner/bucket</code> below or click <strong>＋ Link HF Bucket</strong> above.</div>`
        : buckets
          .map(
            (b) => `
            <div class="in-cli-row ${b.id === (selectedBucket?.id || "") ? "is-active" : ""}" data-incli-bucket="${esc(b.id)}">
              <div style="min-width:0;flex:1">
                <strong style="color:#f8fafc">🤗 ${esc(b.name || b.bucket_uri)}</strong>
                <span class="muted" style="margin-left:6px;font-size:10.5px">${esc(b.bucket_uri)} · ${(b.models || []).length} model(s)</span>
              </div>
              <div style="display:flex;gap:5px">
                <button type="button" class="ghost xs" data-incli-rescan-b="${esc(b.id)}">↻ Rescan</button>
                <button type="button" class="ghost xs" style="color:#ff6b8b" data-incli-unlink-b="${esc(b.id)}">✕ Unlink</button>
              </div>
            </div>`
          )
          .join("")
      }
      </div>

      <!-- 2. MODELS IN SELECTED BUCKET -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:11.5px;font-weight:700;color:#93c5fd">
          2. Models in Bucket ${selectedBucket ? `"${esc(selectedBucket.name)}" (${bucketModels.length})` : "(Select a bucket above)"} — Check models &amp; load into Vault:
        </span>
        ${bucketModels.length > 0
        ? `<div style="display:flex;gap:5px">
                <button type="button" class="primary xs incli-load-checked-models-btn">＋ Load Selected into Vault</button>
                <button type="button" class="ghost xs incli-load-all-models-btn">Load All (${bucketModels.length})</button>
              </div>`
        : ""
      }
      </div>
      <div class="in-cli-scroll-list" style="max-height:165px;margin-bottom:10px">
        ${!selectedBucket
        ? `<div class="muted" style="padding:6px 8px;font-size:11.5px">Link or select a bucket above to scroll through its models inside this CLI.</div>`
        : bucketModels.length === 0
          ? `<div class="muted" style="padding:6px 8px;font-size:11.5px">0 models currently inside "${esc(selectedBucket.name)}". Upload GGUF weights to your bucket and click ↻ Rescan.</div>`
          : bucketModels
            .map(
              (m, idx) => `
            <label class="in-cli-row" style="cursor:pointer">
              <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
                <input type="checkbox" class="incli-bm-check" value="${esc(m.repo || m.name)}" data-bm-name="${esc(m.name || m.repo)}" data-bm-gb="${m.gb || 6}" ${idx === 0 ? "checked" : ""}>
                <strong style="color:#e2e8f0">${esc(m.name || m.repo)}</strong>
                <code style="font-size:10.5px;color:#38bdf8">${esc(m.repo || "")}</code>
              </div>
              <span class="right-badge" style="font-size:10px">~${m.gb || 6} GB</span>
            </label>`
            )
            .join("")
      }
      </div>

      <!-- 3. SAVED IN 4-LAYER VAULT -->
      <div style="font-size:11.5px;font-weight:700;color:#93c5fd;margin-bottom:4px">
        3. Saved in 4-Layer Persistent Vault (${totalVault} locked models):
      </div>
      <div class="in-cli-scroll-list" style="max-height:165px">
        ${totalVault === 0
        ? `<div class="muted" style="padding:6px 8px;font-size:11.5px">No custom models saved in Vault yet. Load from a bucket above or type <code>add-gguf</code>.</div>`
        : [
          ...ggufList.map(
            (g) => `
            <div class="in-cli-row is-active">
              <div style="min-width:0;flex:1">
                <strong style="color:#2ee6a6">🔒 [GGUF] ${esc(g.name)}</strong>
                <code style="margin-left:6px;font-size:10.5px;color:#94a3b8">${esc(g.repo)} (~${g.gb || 6}GB)</code>
              </div>
              <button type="button" class="ghost xs" style="color:#ff6b8b" data-incli-del-vault="gguf:${esc(g.id || g.repo)}">✕ Remove</button>
            </div>`
          ),
          ...apiList.map(
            (m) => `
            <div class="in-cli-row is-active">
              <div style="min-width:0;flex:1">
                <strong style="color:#38bdf8">🌐 [API] ${esc(m.name)}</strong>
                <code style="margin-left:6px;font-size:10.5px;color:#94a3b8">${esc(m.model)} @ ${esc(m.base_url)}</code>
              </div>
              <button type="button" class="ghost xs" style="color:#ff6b8b" data-incli-del-vault="api:${esc(m.id || m.name)}">✕ Remove</button>
            </div>`
          ),
        ].join("")
      }
      </div>
    `;

    panel.querySelector(".incli-link-bucket-btn")?.addEventListener("click", () => {
      if (hfVaultFlows?.["1"]) startFlow(hfVaultFlows["1"]);
    });
    panel.querySelector(".incli-add-gguf-btn")?.addEventListener("click", () => {
      if (hfVaultFlows?.["3"]) startFlow(hfVaultFlows["3"]);
    });
    panel.querySelector(".incli-sync-buckets-btn")?.addEventListener("click", () => {
      $("#hfb-sync-all-now-btn")?.click();
      streamText("🔄 Syncing all linked Hugging Face buckets…", "#2ee6a6", true);
    });

    panel.querySelectorAll("[data-incli-bucket]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        _activeInCliBucketId = row.getAttribute("data-incli-bucket") || "";
        panel.remove();
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
      });
    });

    panel.querySelectorAll("[data-incli-rescan-b]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const bid = btn.getAttribute("data-incli-rescan-b");
        streamText(`⏳ Rescanning bucket [${bid}]…`, "#00d4ff", true);
        await postJSON(`/api/hf-buckets/${encodeURIComponent(bid)}/sync`, {});
        await reloadState();
        panel.remove();
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
      });
    });

    panel.querySelectorAll("[data-incli-unlink-b]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const bid = btn.getAttribute("data-incli-unlink-b");
        await fetch(`/api/hf-buckets/${encodeURIComponent(bid)}`, { method: "DELETE" });
        await reloadState();
        _activeInCliBucketId = "";
        streamText(`🗑️ Unlinked bucket [${bid}].`, "#fde68a", true);
        panel.remove();
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
      });
    });

    const loadModelsFn = async (checks) => {
      if (!checks.length) {
        streamText("⚠️ Check at least one model in the bucket list first.", "#fde68a", true);
        return;
      }
      for (const chk of checks) {
        await postJSON("/api/custom-gguf", {
          name: chk.getAttribute("data-bm-name") || chk.value.split("/").pop(),
          repo: chk.value,
          gb: Number(chk.getAttribute("data-bm-gb")) || 6,
          slot: "auto",
        });
      }
      await reloadState();
      streamText(`🔒 Loaded & locked ${checks.length} model(s) into the 4-Layer Vault!`, "#2ee6a6", true);
      panel.remove();
      renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
    };

    panel.querySelector(".incli-load-checked-models-btn")?.addEventListener("click", () => {
      const checks = Array.from(panel.querySelectorAll(".incli-bm-check:checked"));
      loadModelsFn(checks);
    });

    panel.querySelector(".incli-load-all-models-btn")?.addEventListener("click", () => {
      const checks = Array.from(panel.querySelectorAll(".incli-bm-check"));
      loadModelsFn(checks);
    });

    panel.querySelectorAll("[data-incli-del-vault]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const spec = btn.getAttribute("data-incli-del-vault") || "";
        const [kind, id] = spec.split(":");
        if (kind === "gguf") {
          await fetch(`/api/custom-gguf/${encodeURIComponent(id)}`, { method: "DELETE" });
        } else {
          await fetch(`/api/custom-models/${encodeURIComponent(id)}`, { method: "DELETE" });
        }
        await reloadState();
        streamText(`🗑️ Removed "${id}" from Vault.`, "#fde68a", true);
        panel.remove();
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
      });
    });
  });
}

function renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText) {
  return appendInteractiveDom((panel) => {
    const cluster = _clusterSuperchargerState || {};
    const learner = cluster.continuous_learner || {};
    const items = ALL_19_BOOSTERS_SCHEMA;
    const activeCount = items.filter((b) => isClusterBoosterEnabled(cluster, b.id)).length;

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(46,230,166,.25)">
        <div>
          <strong style="color:#2ee6a6;font-size:12.5px">⚡ IN-CLI 19 PERFORMANCE BOOSTERS &amp; ETERNAL CORTEX LEARNER (${activeCount}/${items.length} ON)</strong>
          <div class="muted" style="font-size:11px">Click any booster row below to toggle it ON/OFF, or train an Eternal Cortex DPO step:</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="primary xs incli-train-step-btn">⚡ Train Cortex Step (#${learner.training_step ?? 142})</button>
          <button type="button" class="ghost xs incli-boosters-all-on-btn">✓ Turn All 19 ON</button>
          <button type="button" class="ghost xs incli-boosters-all-off-btn">○ Turn All OFF</button>
        </div>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:6px 10px;margin-bottom:8px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);border-radius:6px;font-size:11px">
        <span><span class="muted">Adapter:</span> <code>${esc(learner.adapter_name || "suomynona-council/EternalCortex-LoRA-r64")}</code></span>
        <span><span class="muted">Step:</span> <strong>${learner.training_step ?? 142}</strong></span>
        <span><span class="muted">Loss:</span> <strong style="color:#2ee6a6">${Number(learner.current_loss ?? 0.0814).toFixed(4)}</strong></span>
        <span><span class="muted">Successes Learned:</span> <strong>${learner.learned_from_successes ?? learner.success_count ?? 89}</strong></span>
        <span><span class="muted">Faults Immunized:</span> <strong>${learner.learned_from_faults ?? learner.fault_count ?? 53}</strong></span>
      </div>

      <div class="in-cli-scroll-list" style="max-height:240px">
        ${items
        .map((b, idx) => {
          const isOn = isClusterBoosterEnabled(cluster, b.id);
          return `
            <div class="in-cli-row ${isOn ? "is-active" : ""}" data-incli-booster-toggle="${esc(b.id)}" data-incli-booster-on="${isOn ? "1" : "0"}">
              <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
                <span style="font-weight:800;color:${isOn ? "#2ee6a6" : "#64748b"}">${isOn ? "[● ON]" : "[○ OFF]"}</span>
                <strong style="color:#f8fafc">#${idx + 1} ${esc(b.title)}</strong>
                <span class="muted" style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.desc)}</span>
              </div>
              <span class="right-badge" style="font-size:10px;color:${isOn ? "#2ee6a6" : "#94a3b8"}">${isOn ? "ACTIVE" : "IDLE"}</span>
            </div>`;
        })
        .join("")}
      </div>
    `;

    panel.querySelectorAll("[data-incli-booster-toggle]").forEach((row) => {
      row.addEventListener("click", async () => {
        const bid = row.getAttribute("data-incli-booster-toggle");
        const curOn = row.getAttribute("data-incli-booster-on") === "1";
        const nextOn = !curOn;
        const res = await postJSON("/api/cluster/booster-toggle", { booster_id: bid, enabled: nextOn });
        if (res?.ok && res.cluster) {
          _clusterSuperchargerState = res.cluster;
          renderCompact19BoostersAndLearner(res.cluster);
        }
        streamText(`${nextOn ? "🟢 Enabled" : "⚪ Disabled"} booster [${bid}].`, "#2ee6a6", true);
        panel.remove();
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
      });
    });

    panel.querySelector(".incli-boosters-all-on-btn")?.addEventListener("click", async () => {
      const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: true });
      if (res?.ok && res.cluster) {
        _clusterSuperchargerState = res.cluster;
        renderCompact19BoostersAndLearner(res.cluster);
      }
      streamText("🚀 Enabled all 19 GPU, Model & Agent Performance Boosters!", "#2ee6a6", true);
      panel.remove();
      renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
    });

    panel.querySelector(".incli-boosters-all-off-btn")?.addEventListener("click", async () => {
      const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: false });
      if (res?.ok && res.cluster) {
        _clusterSuperchargerState = res.cluster;
        renderCompact19BoostersAndLearner(res.cluster);
      }
      streamText("⚪ Disabled all 19 boosters.", "#fde68a", true);
      panel.remove();
      renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
    });

    panel.querySelector(".incli-train-step-btn")?.addEventListener("click", async () => {
      const res = await recordContinuousLearnerEvent(
        "success",
        "In-CLI Continuous Training Trigger",
        "Reinforced multi-agent tool accuracy and zero-refusal code synthesis"
      );
      streamText(
        `🧬 Eternal Cortex Step #${res?.continuous_learner?.training_step || 143} trained! Loss=${res?.continuous_learner?.current_loss || 0.1795}`,
        "#2ee6a6",
        true
      );
      panel.remove();
      renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
    });
  });
}

function renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows) {
  return appendInteractiveDom((panel) => {
    const hosts = Array.isArray(STATE.runtime_hosts) ? STATE.runtime_hosts : [];
    const lineup = STATE.lineup || {};
    const slots = ["fast", "coding", "reasoning", "cyber", "uncensored", "vision"];

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(46,230,166,.25)">
        <div>
          <strong style="color:#2ee6a6;font-size:12.5px">🖥 IN-CLI HOST GPU RUNTIMES (${hosts.length}) &amp; ACTIVE MODEL SLOTS</strong>
          <div class="muted" style="font-size:11px">Scroll &amp; click any GPU host or model slot below to configure active runtimes right inside the CLI:</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="primary xs incli-attach-host-btn">＋ Attach GPU Host</button>
          <button type="button" class="ghost xs incli-balance-gpus-btn">⚖️ Balance GPUs</button>
          <button type="button" class="ghost xs incli-max-gpus-btn">🚀 Fill All GPUs to Max</button>
        </div>
      </div>

      <div style="font-size:11.5px;font-weight:700;color:#93c5fd;margin-bottom:4px">1. Attached GPU Runtime Hosts:</div>
      <div class="in-cli-scroll-list" style="max-height:175px;margin-bottom:10px">
        ${hosts
        .map(
          (h) => `
          <div class="in-cli-row is-active">
            <div style="min-width:0;flex:1">
              <strong style="color:#2ee6a6">🟢 [${esc(String(h.id).toUpperCase())}] ${esc(h.name)}</strong>
              <span class="muted" style="margin-left:8px;font-size:11px">Provider: <code>${esc(h.provider || "colab")}</code> · GPU: <strong style="color:#38bdf8">${esc(h.accelerator || "G4")}</strong> (${getClientGpuVramGb(h.provider, h.accelerator)}GB VRAM)</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <button type="button" class="ghost xs" data-incli-auth-host="${esc(h.id)}">🔑 Auth</button>
              ${!["a", "b", "c"].includes(String(h.id))
              ? `<button type="button" class="ghost xs" style="color:#ff6b8b" data-incli-del-host="${esc(h.id)}">✕ Remove</button>`
              : ""
            }
            </div>
          </div>`
        )
        .join("")}
      </div>

      <div style="font-size:11.5px;font-weight:700;color:#93c5fd;margin-bottom:4px">2. Active GPU Slot Assignments (Click any slot to add/toggle models):</div>
      <div class="in-cli-scroll-list" style="max-height:175px">
        ${slots
        .map((slot) => {
          const assigned = Array.isArray(lineup[slot]) ? lineup[slot] : [];
          const labels = assigned.map((id) => STATE.catalog?.[id]?.name || id);
          return `
            <div class="in-cli-row ${assigned.length ? "is-active" : ""}" data-incli-slot-pick="${esc(slot)}">
              <div style="min-width:0;flex:1">
                <strong style="color:#f8fafc;text-transform:uppercase">[${esc(slot)}]</strong>
                <span style="margin-left:8px;font-size:11px;color:#cbd5e1">${labels.length ? esc(labels.join(" · ")) : "No models assigned"}</span>
              </div>
              <span class="right-badge" style="font-size:10px">${assigned.length} active</span>
            </div>`;
        })
        .join("")}
      </div>
    `;

    panel.querySelector(".incli-attach-host-btn")?.addEventListener("click", () => {
      if (computeFlows?.["5"]) startFlow(computeFlows["5"]);
    });

    panel.querySelector(".incli-balance-gpus-btn")?.addEventListener("click", () => {
      $("#lineup-balance")?.click();
      streamText("⚖️ Balanced models evenly across all attached GPU hosts!", "#2ee6a6", true);
      setTimeout(() => {
        panel.remove();
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
      }, 300);
    });

    panel.querySelector(".incli-max-gpus-btn")?.addEventListener("click", () => {
      $("#lineup-max-all")?.click();
      streamText("🚀 Filled all GPU host slots to maximum VRAM capacity!", "#2ee6a6", true);
      setTimeout(() => {
        panel.remove();
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
      }, 300);
    });

    panel.querySelectorAll("[data-incli-auth-host]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const hid = btn.getAttribute("data-incli-auth-host");
        streamText(`🔑 Authenticating GPU Host [${String(hid).toUpperCase()}]…`, "#00d4ff", true);
        if (typeof authenticateAllLineupHosts === "function") await authenticateAllLineupHosts();
        streamText(`✅ GPU Host [${String(hid).toUpperCase()}] authenticated & ready.`, "#2ee6a6", true);
      });
    });

    panel.querySelectorAll("[data-incli-del-host]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const hid = btn.getAttribute("data-incli-del-host");
        await fetch(`/api/colab/hosts/${encodeURIComponent(hid)}`, { method: "DELETE" });
        await reloadState();
        streamText(`🗑️ Removed GPU Host [${hid}].`, "#fde68a", true);
        panel.remove();
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
      });
    });

    panel.querySelectorAll("[data-incli-slot-pick]").forEach((row) => {
      row.addEventListener("click", () => {
        const slot = row.getAttribute("data-incli-slot-pick");
        const choices = (STATE.slot_choices?.[slot] || Object.keys(STATE.catalog || {})).slice(0, 12);
        startFlow({
          id: `slot-assign-${slot}`,
          title: `Configure GPU Slot [${String(slot).toUpperCase()}]`,
          steps: [
            {
              key: "modelId",
              question: `Select a model to toggle in GPU Slot [${String(slot).toUpperCase()}]:`,
              choices: choices.map((id, i) => ({
                label: `[${i + 1}] ${STATE.catalog?.[id]?.name || id} (${(STATE.lineup?.[slot] || []).includes(id) ? "● ACTIVE" : "○ OFF"})`,
                value: id,
              })),
              required: true,
            },
          ],
          onComplete: async (d, st) => {
            const cur = Array.isArray(STATE.lineup?.[slot]) ? [...STATE.lineup[slot]] : [];
            const next = cur.includes(d.modelId) ? cur.filter((x) => x !== d.modelId) : [...cur, d.modelId];
            STATE.lineup[slot] = next;
            await postJSON("/api/lineup", { lineup: STATE.lineup });
            await reloadState();
            st(`✅ Updated GPU Slot [${String(slot).toUpperCase()}] (${next.length} active models).`, "#2ee6a6", true);
          },
        });
      });
    });
  });
}

function initSectionClis() {
  // ── 1A. DEDICATED HUGGING FACE BUCKET & MODEL VAULT CLI (#hf-vault-cli-card) ──
  const hfVaultFlows = {
    "1": {
      id: "hf-vault-link-bucket",
      title: "Link & Scan Hugging Face Bucket",
      steps: [
        {
          key: "uri",
          question: "Step 1/3: Enter your Hugging Face Bucket URI, username/bucket, or repo:",
          placeholder: "hf://buckets/owner/bucket or owner/repo-GGUF",
          predictions: [
            "hf://buckets/savingannabel/personal-gguf-vault",
            "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated-GGUF",
            "dphn/Dolphin-2.9.4-Llama3.1-8B-gguf",
            "WhiteRabbitNeo/WhiteRabbitNeo-2.5-Qwen-2.5-Coder-7B",
            "AlicanKiraz0/Cybersecurity-BaronLLM_Offensive_Security_LLM_Q6_K_GGUF",
          ],
          required: true,
        },
        {
          key: "token",
          question: "Step 2/3: Does this bucket require a private Hugging Face token (hf_...)?",
          choices: [
            { label: "[1] Public Bucket (No Token Needed)", value: "" },
            { label: "[2] Use Global Vault HF_TOKEN", value: "__GLOBAL__" },
          ],
          predictions: ["hf_"],
          defaultValue: "",
        },
        {
          key: "autoImport",
          question: "Step 3/3: How should discovered models in this bucket be handled?",
          choices: [
            { label: "[1] Show Inside CLI List Only (Select What You Want)", value: "no" },
            { label: "[2] Auto-Import & Lock All Discovered Models into Vault", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      onComplete: async (d, streamText) => {
        streamText(`⏳ Scanning Hugging Face Bucket "${d.uri}"…`, "#00d4ff", true);
        const tokenVal = d.token === "__GLOBAL__" ? ($("#hs-auth-hf-token")?.value || "") : (d.token || "");
        const res = await postJSON("/api/hf-buckets/link", {
          bucket_uri: d.uri,
          name: "",
          slot: "auto",
          hf_token: tokenVal,
          auto_import_top: d.autoImport === "yes",
          auto_import_count: 10,
        });
        if (res?.ok) {
          saveLocalModelVault({
            hf_buckets: res.buckets || [],
            custom_gguf: res.custom_gguf || [],
          });
          _activeInCliBucketId = res.bucket?.id || "";
          await reloadState();
          const cnt = res.bucket?.models?.length || 0;
          streamText(
            cnt === 0
              ? `✅ Linked personal bucket "${res.bucket?.name}" (${res.bucket?.bucket_uri}). Currently 0 model files inside this bucket.`
              : `✅ Linked "${res.bucket?.name}" — discovered ${cnt} real model(s)! Scroll the interactive list below inside this CLI to load any model.`,
            "#2ee6a6",
            true
          );
        } else {
          streamText(`❌ Could not link HF Bucket: ${res?.error || "error"}`, "#ff6b8b", true);
        }
      },
    },
    "2": {
      id: "hf-vault-browse-load",
      title: "Browse & Load Models from Linked Hugging Face Bucket",
      steps: [
        {
          key: "bucketId",
          question: "Step 1/2: Select which linked Hugging Face Bucket to inspect:",
          choices: () => {
            const buckets = STATE.hf_buckets || [];
            if (!buckets.length) {
              return [{ label: "[none] No buckets linked yet — type 'cancel' and run 'link'", value: "" }];
            }
            return buckets.map((b, idx) => ({
              label: `[${idx + 1}] ${b.name || b.bucket_uri} (${(b.models || []).length} models)`,
              value: b.id,
            }));
          },
          required: true,
        },
        {
          key: "modelRepo",
          question: (d) => {
            const b = (STATE.hf_buckets || []).find((x) => x.id === d.bucketId);
            const count = b?.models?.length || 0;
            return `Step 2/2: Found ${count} model(s) in "${b?.name || d.bucketId}". Select a model to load & lock into the 4-Layer Vault:`;
          },
          choices: (d) => {
            const b = (STATE.hf_buckets || []).find((x) => x.id === d.bucketId);
            const models = b?.models || [];
            if (!models.length) {
              return [{ label: "[empty] 0 models in this bucket", value: "" }];
            }
            return [
              { label: "[ALL] Import & Lock ALL Models in Bucket", value: "__ALL__" },
              ...models.slice(0, 12).map((m, idx) => ({
                label: `[${idx + 1}] ${m.name || m.repo} (~${m.gb || 6}GB)`,
                value: m.repo || m.name,
              })),
            ];
          },
          required: true,
        },
      ],
      onComplete: async (d, streamText) => {
        if (!d.bucketId || !d.modelRepo) return;
        const b = (STATE.hf_buckets || []).find((x) => x.id === d.bucketId);
        if (!b) return;
        const targets = d.modelRepo === "__ALL__" ? (b.models || []) : (b.models || []).filter((m) => (m.repo || m.name) === d.modelRepo);
        for (const m of targets) {
          await postJSON("/api/custom-gguf", {
            name: m.name || (m.repo || "").split("/").pop(),
            repo: m.repo || m.name,
            gb: Number(m.gb) || 6,
            slot: "auto",
          });
        }
        await reloadState();
        streamText(`🔒 Loaded & locked ${targets.length} model(s) from "${b.name}" into the 4-Layer Model Vault!`, "#2ee6a6", true);
      },
    },
    "3": {
      id: "hf-vault-add-custom",
      title: "Add & Lock Custom GGUF or API Model into 4-Layer Vault",
      steps: [
        {
          key: "kind",
          question: "Step 1/4: Select model architecture to lock into the 4-Layer Model Vault:",
          choices: [
            { label: "[1] Hugging Face GGUF Weights Repo", value: "gguf" },
            { label: "[2] OpenAI-Compatible Cloud / Local API Endpoint", value: "api" },
          ],
          defaultValue: "gguf",
        },
        {
          key: "repoOrUrl",
          question: (d) =>
            d.kind === "api"
              ? "Step 2/4: Enter API Base URL:"
              : "Step 2/4: Enter Hugging Face GGUF Repo (owner/repo):",
          predictions: (d) =>
            d.kind === "api"
              ? ["http://127.0.0.1:11434/v1", "http://127.0.0.1:8080/v1", "https://openrouter.ai/api/v1"]
              : [
                "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated-GGUF",
                "dphn/Dolphin-2.9.4-Llama3.1-8B-gguf",
                "huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated-v2",
                "WhiteRabbitNeo/WhiteRabbitNeo-2.5-Qwen-2.5-Coder-7B",
              ],
          required: true,
        },
        {
          key: "nameOrModelId",
          question: (d) =>
            d.kind === "api"
              ? "Step 3/4: Enter Model ID served at this endpoint (e.g. dolphin-mistral:latest):"
              : "Step 3/4: Enter Display Name (or press Enter to auto-name from repo):",
          predictions: ["dolphin-mistral:latest", "qwen2.5-coder:32b", "deepseek-r1:14b"],
          defaultValue: "",
        },
        {
          key: "gb",
          question: "Step 4/4: Select estimated VRAM footprint (GB):",
          choices: [
            { label: "[1] 5 GB (7B–8B Q4_K_M)", value: "5" },
            { label: "[2] 9 GB (14B Q4_K_M)", value: "9" },
            { label: "[3] 19 GB (32B Q4_K_M)", value: "19" },
            { label: "[4] 42 GB (70B Q4_K_M)", value: "42" },
          ],
          defaultValue: "8",
        },
      ],
      onComplete: async (d, streamText) => {
        if (d.kind === "api") {
          const modelId = d.nameOrModelId || "custom-model";
          const res = await postJSON("/api/custom-models", {
            name: `VAULT-API: ${modelId}`,
            provider: "openai-compatible",
            base_url: d.repoOrUrl,
            model: modelId,
          });
          if (res?.ok) {
            saveLocalModelVault({ custom_models: res.custom_models || [] });
            await reloadState();
            streamText(`🔒 Locked API Model "${modelId}" (${d.repoOrUrl}) into 4-Layer Model Vault!`, "#2ee6a6", true);
          }
        } else {
          const name = d.nameOrModelId || d.repoOrUrl.split("/").pop();
          const res = await postJSON("/api/custom-gguf", {
            name,
            repo: d.repoOrUrl,
            gb: Number(d.gb) || 8,
            slot: "auto",
          });
          if (res?.ok) {
            saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
            await reloadState();
            streamText(`🔒 Locked GGUF Model "${name}" (${d.repoOrUrl}, ~${d.gb}GB) into 4-Layer Model Vault!`, "#2ee6a6", true);
          }
        }
      },
    },
    "4": {
      id: "hf-vault-autosync-manager",
      title: "Auto-Sync & 4-Layer Model Vault Manager",
      steps: [
        {
          key: "op",
          question: "Select Hugging Face Bucket & Model Vault operation:",
          choices: [
            { label: "[1] Sync All Linked Buckets Right Now", value: "sync_now" },
            { label: "[2] Enable Auto-Sync on Application Startup", value: "autosync_on" },
            { label: "[3] Disable Auto-Sync on Application Startup", value: "autosync_off" },
            { label: "[4] Force-Lock & Verify 4-Layer Vault Persistence", value: "lock_vault" },
          ],
          defaultValue: "sync_now",
        },
      ],
      onComplete: async (d, streamText) => {
        if (d.op === "sync_now") {
          $("#hfb-sync-all-now-btn")?.click();
          streamText("🔄 Syncing all linked Hugging Face buckets for latest weights and metadata…", "#2ee6a6", true);
        } else if (d.op === "autosync_on" || d.op === "autosync_off") {
          const enable = d.op === "autosync_on";
          if ($("#hfb-autosync-toggle")) {
            $("#hfb-autosync-toggle").checked = enable;
            $("#hfb-autosync-toggle").dispatchEvent(new Event("change"));
          }
          streamText(`⚡ Auto-Sync on Startup is now ${enable ? "ENABLED" : "DISABLED"}.`, "#2ee6a6", true);
        } else {
          $("#hf-vault-force-sync-btn")?.click();
          streamText("🔒 Verified 4-Layer Vault lock.", "#2ee6a6", true);
        }
      },
    },
  };

  createGuidedSectionCli({
    cliKey: "hf-vault",
    logSelector: "#hf-vault-cli-log",
    choicesSelector: "#hf-vault-cli-choices",
    inputSelector: "#hf-vault-cli-input",
    ghostSelector: "#hf-vault-cli-ghost",
    sendSelector: "#hf-vault-cli-send",
    resetSelector: "#hf-vault-cli-reset",
    headerTitle: "HUGGING FACE BUCKET, MODEL VAULT & LINEUP PRESETS CLI",
    ps1: "hf-vault@suomynona-council❯",
    menuPrompt: "Type '/bucket' to inspect linked buckets & vault models · 'link <uri>' · 'add-gguf' · 'presets' · 'sync' · '<cmd> -h' for help",
    autocompleteCatalog: [
      { value: "/bucket", label: "Inspect all saved Hugging Face Buckets & 4-Layer Vault models" },
      { value: "/buckets", label: "Inspect all saved Hugging Face Buckets & 4-Layer Vault models" },
      { value: "buckets", label: "Show Linked Buckets, Models in Bucket & Vault inside CLI" },
      { value: "models", label: "Browse & select models inside linked HF buckets" },
      { value: "vault", label: "Inspect & manage saved models in 4-Layer Vault" },
      { value: "link ", label: "Link a Hugging Face Bucket (hf://buckets/owner/bucket)" },
      { value: "link hf://buckets/", label: "Link personal HF bucket URI" },
      { value: "add-gguf", label: "Lock a custom GGUF model into Vault" },
      { value: "add-api", label: "Lock an OpenAI-compatible API model into Vault" },
      { value: "sync", label: "Sync all linked Hugging Face buckets now" },
      { value: "presets", label: "Load & balance a Built-In Model Team Lineup Preset" },
      { value: "save-preset", label: "Save current model lineup as a custom team preset" },
    ],
    onRenderDefaultView: null,
    onDirectCommand: async (val, { startFlow, streamText, appendInteractiveDom }) => {
      const lower = val.toLowerCase();
      if (["/bucket", "/buckets", "bucket", "buckets", "/vault", "vault", "models", "/models", "list", "status", "show"].includes(lower)) {
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
        return true;
      }
      if (lower === "link" || val === "1") {
        await startFlow(hfVaultFlows["1"]);
        return true;
      }
      if (lower.startsWith("link ")) {
        const uri = val.slice(5).trim();
        streamText(`⏳ Linking & scanning Hugging Face Bucket "${uri}"…`, "#00d4ff", true);
        const res = await postJSON("/api/hf-buckets/link", { bucket_uri: uri, name: "", slot: "auto" });
        if (res?.ok) {
          _activeInCliBucketId = res.bucket?.id || "";
          await reloadState();
          streamText(`✅ Linked "${res.bucket?.name}" (${(res.bucket?.models || []).length} models).`, "#2ee6a6", true);
          renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
        } else {
          streamText(`❌ Failed to link bucket: ${res?.error || "error"}`, "#ff6b8b", true);
        }
        return true;
      }
      if (lower === "browse" || val === "2") {
        await startFlow(hfVaultFlows["2"]);
        return true;
      }
      if (lower === "add-gguf" || lower === "add-api" || lower === "add" || val === "3") {
        await startFlow(hfVaultFlows["3"]);
        return true;
      }
      if (lower === "sync" || lower.startsWith("autosync") || val === "4") {
        await startFlow(hfVaultFlows["4"]);
        return true;
      }
      if (val.includes("/") || val.startsWith("hf://")) {
        const res = await postJSON("/api/hf-buckets/link", { bucket_uri: val, name: "", slot: "auto" });
        if (res?.ok) {
          _activeInCliBucketId = res.bucket?.id || "";
          await reloadState();
          streamText(`✅ Linked "${res.bucket?.name}" (${(res.bucket?.models || []).length} models).`, "#2ee6a6", true);
          renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
        }
        return true;
      }
      if (lower === "presets" || lower === "load-preset" || lower === "preset") {
        await startFlow({
          id: "load-builtin-preset",
          title: "Load Built-In Model Team Preset",
          steps: [
            {
              key: "presetVal",
              question: "Choose a Built-In Model Team Preset to load & balance:",
              choices: () => {
                const opts = Array.from($("#preset")?.options || []);
                return opts.length
                  ? opts.map((o, i) => ({ label: `[${i + 1}] ${o.textContent}`, value: o.value }))
                  : [{ label: "[1] Uncensored Polyglot Builders", value: "default" }];
              },
              defaultValue: $("#preset")?.value || "default",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#preset") && d.presetVal) $("#preset").value = d.presetVal;
            $("#preset-apply")?.click();
            st(`⚡ Loaded and balanced preset "${d.presetVal}" across GPU slots!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      if (lower === "save-preset" || lower === "save") {
        await startFlow({
          id: "save-custom-lineup",
          title: "Save Current Model Lineup",
          steps: [
            {
              key: "name",
              question: "Preset Name:",
              defaultValue: `Custom-Preset-${Date.now().toString().slice(-4)}`,
            },
          ],
          onComplete: async (d, st) => {
            if ($("#preset-name")) $("#preset-name").value = d.name;
            $("#preset-save")?.click();
            st(`💾 Saved current lineup as preset "${d.name}"!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      return false;
    },
  });

  // ── 1B. DEDICATED ETERNAL CORTEX LEARNER & 19 BOOSTERS CLI (#boosters-cli-card) ──
  const boostersSubFlows = {
    "1": {
      id: "cortex-train-step",
      title: "Train Eternal Cortex Continuous LoRA Step",
      steps: [
        {
          key: "signal",
          question: "Step 1/2: Select training trajectory signal to reinforce in EternalCortex-LoRA-r64:",
          choices: [
            { label: "[1] Reinforce Recent Successful Builds & Tool Runs (+DPO)", value: "success" },
            { label: "[2] Immunize Against Recent Faults / Refusals / Timeouts (-Fault)", value: "fault" },
          ],
          defaultValue: "success",
        },
        {
          key: "note",
          question: "Step 2/2: Enter optional lesson note:",
          predictions: [
            "Zero-refusal full-stack code generation & multi-agent tool verification",
            "Bypass single-boss bottleneck and delegate modular code across worker groups",
          ],
          defaultValue: "Continuous online DPO + fault-immunization step",
        },
      ],
      onComplete: async (d, streamText) => {
        const res = await recordContinuousLearnerEvent(d.signal, "Eternal Cortex CLI Guided Step", d.note);
        streamText(
          `🧬 Eternal Cortex Step #${res?.continuous_learner?.training_step || 143} complete! Loss=${res?.continuous_learner?.current_loss || 0.1795}`,
          "#2ee6a6",
          true
        );
      },
    },
    "2": {
      id: "toggle-19-boosters",
      title: "Configure 19 GPU, Model & Agent Performance Boosters",
      steps: [
        {
          key: "mode",
          question: "Select Booster configuration preset:",
          choices: [
            { label: "[1] Enable ALL 19 GPU, Model & Agent Boosters (Max Performance)", value: "all_on" },
            { label: "[2] Disable All 19 Boosters", value: "all_off" },
          ],
          defaultValue: "all_on",
        },
      ],
      onComplete: async (d, streamText) => {
        const enable = d.mode !== "all_off";
        const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: enable });
        if (res?.cluster) {
          _clusterSuperchargerState = res.cluster;
          renderCompact19BoostersAndLearner(res.cluster);
        }
        streamText(enable ? "🚀 Enabled all 19 GPU, Model & Agent Performance Boosters!" : "⚪ Disabled all 19 Boosters.", "#2ee6a6", true);
      },
    },
    "3": {
      id: "run-gpu-drill",
      title: "Run Multi-GPU Hardware Benchmark Drill",
      steps: [
        {
          key: "drill",
          question: "Choose which live multi-GPU hardware drill to execute:",
          choices: [
            { label: "[1] Speculative 2.5x Speed Benchmark", value: "spec" },
            { label: "[2] Combine GPUs Tensor Mesh (70B–123B)", value: "mesh" },
            { label: "[3] 256K Context KV-Cache Ring", value: "kvring" },
            { label: "[4] Hot-Standby Failover Drill", value: "failover" },
          ],
          defaultValue: "spec",
        },
      ],
      onComplete: async (d, streamText) => {
        const btnMap = {
          spec: "#cluster-spec-bench-btn",
          mesh: "#cluster-mesh-calc-btn",
          kvring: "#cluster-kvring-btn",
          failover: "#cluster-failover-test-btn",
        };
        $(btnMap[d.drill] || "#cluster-spec-bench-btn")?.click();
        streamText(`⚡ Executed Multi-GPU Hardware Drill [${d.drill.toUpperCase()}] — telemetry updated.`, "#2ee6a6", true);
      },
    },
  };

  createGuidedSectionCli({
    cliKey: "boosters",
    logSelector: "#boosters-cli-log",
    choicesSelector: "#boosters-cli-choices",
    inputSelector: "#boosters-cli-input",
    ghostSelector: "#boosters-cli-ghost",
    sendSelector: "#boosters-cli-send",
    resetSelector: "#boosters-cli-reset",
    headerTitle: "ETERNAL CORTEX LEARNER & 19 BOOSTERS CLI",
    ps1: "cortex-boost@suomynona-council❯",
    menuPrompt: "Commands: 'boosters' (scroll & toggle all 19 boosters inside CLI), 'enable-all', 'disable-all', 'train', 'drill'",
    autocompleteCatalog: [
      { value: "boosters", label: "Show & toggle all 19 Performance Boosters inside CLI" },
      { value: "enable-all", label: "Turn ON all 19 GPU, Model & Agent Boosters" },
      { value: "disable-all", label: "Turn OFF all 19 Boosters" },
      { value: "train", label: "Run an Eternal Cortex DPO continuous learning step" },
      { value: "learner", label: "Inspect Eternal Cortex LoRA adapter & learned trajectories" },
      { value: "drill", label: "Run a Multi-GPU Hardware Benchmark Drill" },
      ...(typeof ALL_19_COMPACT_BOOSTERS !== "undefined"
        ? ALL_19_COMPACT_BOOSTERS.map((b) => ({ value: `toggle ${b.id}`, label: `Toggle ${b.title}` }))
        : []),
    ],
    onRenderDefaultView: null,
    onDirectCommand: async (val, { startFlow, streamText, appendInteractiveDom }) => {
      const lower = val.toLowerCase();
      if (["boosters", "list", "status", "learner", "show", "help"].includes(lower)) {
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
        return true;
      }
      if (lower === "enable-all" || lower === "all on" || lower === "on") {
        const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: true });
        if (res?.cluster) {
          _clusterSuperchargerState = res.cluster;
          renderCompact19BoostersAndLearner(res.cluster);
        }
        streamText("🚀 Enabled all 19 Performance Boosters!", "#2ee6a6", true);
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
        return true;
      }
      if (lower === "disable-all" || lower === "all off" || lower === "off") {
        const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: false });
        if (res?.cluster) {
          _clusterSuperchargerState = res.cluster;
          renderCompact19BoostersAndLearner(res.cluster);
        }
        streamText("⚪ Disabled all 19 Boosters.", "#fde68a", true);
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
        return true;
      }
      if (lower.startsWith("toggle ")) {
        const bid = val.slice(7).trim();
        const cur = isClusterBoosterEnabled(_clusterSuperchargerState, bid);
        const res = await postJSON("/api/cluster/booster-toggle", { booster_id: bid, enabled: !cur });
        if (res?.cluster) {
          _clusterSuperchargerState = res.cluster;
          renderCompact19BoostersAndLearner(res.cluster);
        }
        streamText(`${!cur ? "🟢 Enabled" : "⚪ Disabled"} booster [${bid}].`, "#2ee6a6", true);
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
        return true;
      }
      if (lower === "train" || val === "1") {
        await startFlow(boostersSubFlows["1"]);
        return true;
      }
      if (val === "2") {
        await startFlow(boostersSubFlows["2"]);
        return true;
      }
      if (lower === "drill" || val === "3") {
        await startFlow(boostersSubFlows["3"]);
        return true;
      }
      return false;
    },
  });

  // ── 1. MODELS & COMPUTE MASTER ROUTER CLI (#compute-section-cli-card) ──
  const computeFlows = {
    "1": {
      id: "add-any-model",
      title: "Quick-Add Any Model (GGUF or Cloud API)",
      steps: [
        {
          key: "kind",
          question: "Step 1/3: What kind of model do you want to add? [1] HuggingFace GGUF Model  [2] Cloud / Local OpenAI-Compatible API",
          choices: [
            { label: "[1] HuggingFace GGUF", value: "gguf" },
            { label: "[2] Cloud / Local API", value: "api" },
          ],
          defaultValue: "gguf",
        },
        {
          key: "repoOrUrl",
          question: (d) =>
            d.kind === "api"
              ? "Step 2/3: Enter the Model ID:"
              : "Step 2/3: Enter the Hugging Face Repo or GGUF path:",
          placeholder: "Enter repo or model ID…",
          predictions: (d) =>
            d.kind === "api"
              ? ["deepseek-r1:70b", "qwen2.5-coder:32b", "dolphin-mistral:latest"]
              : [
                "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated-GGUF",
                "dphn/Dolphin-2.9.4-Llama3.1-8B-gguf",
                "WhiteRabbitNeo/WhiteRabbitNeo-2.5-Qwen-2.5-Coder-7B",
              ],
          required: true,
        },
        {
          key: "name",
          question: "Step 3/3: Enter a display name for this model (or press Enter to auto-name):",
          placeholder: "Optional display name…",
          defaultValue: "",
        },
      ],
      onComplete: async (d, streamText) => {
        if (d.kind === "api") {
          const name = d.name || d.repoOrUrl;
          const res = await postJSON("/api/custom-models", {
            name,
            provider: "openai-compatible",
            model: d.repoOrUrl,
            base_url: "http://127.0.0.1:11434/v1",
          });
          if (res?.ok) {
            saveLocalModelVault({ custom_models: res.custom_models || [] });
            await reloadState();
            streamText(`✅ Locked API Model "${name}" (${d.repoOrUrl}) in 4-Layer Vault!`, "#2ee6a6", true);
          }
        } else {
          const name = d.name || d.repoOrUrl.split("/").pop();
          const res = await postJSON("/api/custom-gguf", {
            name,
            repo: d.repoOrUrl,
            gb: 8,
            slot: "uncensored",
          });
          if (res?.ok) {
            saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
            await reloadState();
            streamText(`✅ Locked GGUF Model "${name}" (${d.repoOrUrl}) into Suomynona Council Vault!`, "#2ee6a6", true);
          }
        }
      },
    },
    "2": hfVaultFlows["1"],
    "3": hfVaultFlows["3"],
    "4": hfVaultFlows["3"],
    "5": {
      id: "manage-gpu-hosts",
      title: "Attach or Remove Runtime GPU Host",
      steps: [
        {
          key: "action",
          question: "Step 1/4: Do you want to [1] Attach a New GPU Host or [2] Remove an Existing Host?",
          choices: [
            { label: "[1] Attach New GPU Host", value: "add" },
            { label: "[2] Remove Existing GPU Host", value: "remove" },
          ],
          defaultValue: "add",
        },
        {
          key: "provider",
          question: (d) =>
            d.action === "remove"
              ? "Step 2/2: Select Host ID to remove:"
              : "Step 2/4: Choose GPU Provider to attach:",
          choices: (d) =>
            d.action === "remove"
              ? (STATE.runtime_hosts || []).map((h) => ({ label: `[${h.id}] ${h.name} (${h.provider})`, value: h.id }))
              : [
                { label: "[1] RunPod Cloud GPU", value: "runpod" },
                { label: "[2] Vast.ai GPU Rig", value: "vastai" },
                { label: "[3] Lambda Labs H100/GH200", value: "lambda" },
                { label: "[4] Modal Serverless GPU", value: "modal" },
                { label: "[5] AWS / GCP / Azure VM", value: "cloud_vm" },
                { label: "[6] Localhost Bare-Metal / Ollama", value: "localhost" },
                { label: "[7] Custom OpenAI / SSH Endpoint", value: "custom" },
                { label: "[8] Google Colab", value: "colab" },
                { label: "[9] Kaggle", value: "kaggle" },
              ],
          defaultValue: "runpod",
        },
        {
          key: "accelerator",
          question: (d) =>
            d.action === "remove"
              ? "Confirm removal? Type yes to remove:"
              : `Step 3/4: Select GPU Accelerator for ${d.provider.toUpperCase()}:`,
          choices: (d) =>
            d.action === "remove"
              ? [{ label: "[yes] Confirm Remove", value: "yes" }]
              : getDefaultAcceleratorsForProvider(d.provider).map((acc) => ({
                label: `${acc} (${getClientGpuVramGb(d.provider, acc)}GB VRAM)`,
                value: acc,
              })),
          defaultValue: "RTX4090-24GB",
        },
        {
          key: "endpoint",
          question: (d) =>
            d.action === "remove"
              ? "Press Enter to finalize:"
              : "Step 4/4: Enter Endpoint / Tunnel URL (or press Enter for default):",
          choices: [{ label: "[Use Default Endpoint]", value: "" }],
          predictions: ["http://127.0.0.1:8080/v1", "https://pod-8000.proxy.runpod.net/v1"],
          defaultValue: "",
        },
      ],
      onComplete: async (d, streamText) => {
        if (d.action === "remove") {
          const res = await fetch(`/api/colab/hosts/${encodeURIComponent(d.provider)}`, { method: "DELETE" })
            .then((r) => r.json())
            .catch(() => ({}));
          await reloadState();
          streamText(res?.ok ? `🗑️ Removed GPU Host [${d.provider}].` : `⚠️ Could not remove host: ${res?.error || "error"}`, "#2ee6a6", true);
          return;
        }
        const hostName = `${d.provider.toUpperCase()} ${d.accelerator}`;
        const res = await postJSON("/api/colab/hosts", {
          name: hostName,
          provider: d.provider,
          accelerator: d.accelerator,
          custom_url: d.endpoint || "",
        });
        if (res?.ok) {
          await reloadState();
          streamText(`🖥 Attached new GPU Host "${hostName}" (${d.provider} · ${d.accelerator})!`, "#2ee6a6", true);
        } else {
          streamText(`❌ Could not attach GPU host: ${res?.error || "error"}`, "#ff6b8b", true);
        }
      },
    },
    "6": {
      id: "host-ram-tuning",
      title: "Customize Host RAM, Quantization & Context Length",
      steps: [
        {
          key: "hostId",
          question: "Step 1/4: Which GPU Host do you want to tune?",
          choices: () =>
            (STATE.runtime_hosts || [{ id: "a", name: "Host A" }]).map((h) => ({
              label: `[${h.id}] ${h.name} (${h.accelerator || "GPU"})`,
              value: h.id,
            })),
          defaultValue: "a",
        },
        {
          key: "ramGb",
          question: "Step 2/4: Select Host RAM / VRAM allocation (GB):",
          choices: [
            { label: "[1] 24 GB (L4 / RTX 4090)", value: "24" },
            { label: "[2] 40 GB (A100)", value: "40" },
            { label: "[3] 80 GB (H100 / A100-80G)", value: "80" },
            { label: "[4] 96 GB (G4 High-RAM)", value: "96" },
            { label: "[5] 192 GB (Multi-GPU Pod)", value: "192" },
          ],
          defaultValue: "96",
        },
        {
          key: "ctx",
          question: "Step 3/4: Select Context Window Size (n_ctx):",
          choices: [
            { label: "[1] 16,384 tokens", value: "16384" },
            { label: "[2] 32,768 tokens", value: "32768" },
            { label: "[3] 65,536 tokens (64K)", value: "65536" },
            { label: "[4] 131,072 tokens (128K)", value: "131072" },
          ],
          defaultValue: "32768",
        },
        {
          key: "kvQuant",
          question: "Step 4/4: Select Weights & KV-Cache Quantization Mode:",
          choices: [
            { label: "[1] Q4_K_M + FP8 KV Turbo (Recommended)", value: "Q4_K_M" },
            { label: "[2] Q6_K High Precision", value: "Q6_K" },
            { label: "[3] Q8_0 Near-Lossless", value: "Q8_0" },
            { label: "[4] FP16 Uncompressed", value: "FP16" },
          ],
          defaultValue: "Q4_K_M",
        },
      ],
      onComplete: async (d, streamText) => {
        if ($("#hs-cust-ram-gb")) $("#hs-cust-ram-gb").value = d.ramGb;
        if ($("#hs-cust-ctx")) $("#hs-cust-ctx").value = d.ctx;
        if ($("#hs-cust-quant")) $("#hs-cust-quant").value = d.kvQuant;
        await postJSON("/api/host-setup/memory", {
          host_id: d.hostId,
          customization: {
            ram_gb: Number(d.ramGb) || 96,
            n_ctx: Number(d.ctx) || 32768,
            quantization: d.kvQuant,
          },
        });
        streamText(`⚡ Locked tuning for Host [${d.hostId.toUpperCase()}]: RAM=${d.ramGb}GB, Context=${d.ctx}, Quant=${d.kvQuant}!`, "#2ee6a6", true);
      },
    },
    "7": {
      id: "auth-tokens-gist",
      title: "Configure Auth Tokens, Gist ID & Tunnel URLs",
      steps: [
        {
          key: "what",
          question: "Step 1/2: Which credential or binding do you want to update?",
          choices: [
            { label: "[1] Authenticate All GPU Hosts Now", value: "auth_all" },
            { label: "[2] GitHub Gist ID (for live tunnel sync)", value: "gist" },
            { label: "[3] Hugging Face Token (hf_...)", value: "hf_token" },
            { label: "[4] GitHub Token (ghp_...)", value: "gh_token" },
            { label: "[5] Submit Live Tunnel / OAuth Code", value: "oauth" },
          ],
          defaultValue: "auth_all",
        },
        {
          key: "val",
          question: (d) =>
            d.what === "auth_all"
              ? "Confirm authenticating all GPU hosts & accelerators now? (yes/no):"
              : `Step 2/2: Enter the new ${d.what} value:`,
          choices: (d) => (d.what === "auth_all" ? [{ label: "[yes] Authenticate All Hosts", value: "yes" }] : []),
          predictions: (d) =>
            d.what === "gist"
              ? ["05a1f96580fa13b373b42d919873dc57"]
              : d.what === "oauth"
                ? ["https://council-node.trycloudflare.com"]
                : [],
          defaultValue: "yes",
        },
      ],
      onComplete: async (d, streamText) => {
        if (d.what === "auth_all") {
          if (typeof authenticateAllLineupHosts === "function") await authenticateAllLineupHosts();
          streamText("🔑 Authenticated all GPU hosts & accelerators!", "#2ee6a6", true);
        } else if (d.what === "gist") {
          if ($("#hs-auth-gist-id")) $("#hs-auth-gist-id").value = d.val;
          $("#hs-save-global-auth-btn")?.click();
          streamText(`🔗 Saved GitHub Gist ID: ${d.val}`, "#2ee6a6", true);
        } else if (d.what === "gh_token") {
          if ($("#hs-auth-gh-token")) $("#hs-auth-gh-token").value = d.val;
          $("#hs-save-global-auth-btn")?.click();
          streamText("🔐 Saved GitHub Token to Global Credentials Vault.", "#2ee6a6", true);
        } else if (d.what === "oauth") {
          if ($("#lineup-oauth-code")) $("#lineup-oauth-code").value = d.val;
          $("#lineup-oauth-submit")?.click();
          streamText(`🔗 Submitted Tunnel / OAuth binding: ${d.val}`, "#2ee6a6", true);
        } else {
          if ($("#hs-auth-hf-token")) $("#hs-auth-hf-token").value = d.val;
          if ($("#hfb-token")) $("#hfb-token").value = d.val;
          $("#hs-save-global-auth-btn")?.click();
          streamText("🔐 Saved Hugging Face Token for private bucket & model access.", "#2ee6a6", true);
        }
      },
    },
    "8": boostersSubFlows["2"],
  };

  const computeCli = createGuidedSectionCli({
    cliKey: "compute",
    logSelector: "#compute-cli-log",
    choicesSelector: "#compute-cli-choices",
    inputSelector: "#compute-cli-input",
    ghostSelector: "#compute-cli-ghost",
    sendSelector: "#compute-cli-send",
    resetSelector: "#compute-cli-reset",
    headerTitle: "MODELS & COMPUTE MASTER ROUTER CLI",
    ps1: "compute@suomynona-council❯",
    banner: COUNCIL_NG_GRAPHICAL_ASCII_BANNER,
    menuPrompt: "Type 'buckets', 'vault', 'boosters', 'hosts', 'slots', 'add-gguf', 'add-api', 'tune', or 'auth' (inline completion suggests as you type):",
    autocompleteCatalog: [
      { value: "buckets", label: "Open interactive Linked Buckets, Models in Bucket & Vault inside CLI" },
      { value: "vault", label: "Show 4-Layer Saved Model Vault inside CLI" },
      { value: "boosters", label: "Open interactive 19 Performance Boosters & Eternal Cortex Learner inside CLI" },
      { value: "hosts", label: "Open interactive Host GPU Slots & Runtime Providers inside CLI" },
      { value: "slots", label: "Configure GPU Model Slots (fast, coding, reasoning, cyber, uncensored, vision)" },
      { value: "add-gguf", label: "Add & lock a custom Hugging Face GGUF model" },
      { value: "add-api", label: "Add & lock a custom OpenAI/Ollama/vLLM API endpoint" },
      { value: "link hf://buckets/", label: "Link a Hugging Face Bucket URI" },
      { value: "attach-host", label: "Attach a new GPU host (RunPod, Vast.ai, Lambda, Modal, Localhost, Colab)" },
      { value: "tune", label: "Tune Host RAM/VRAM, Quantization & Context Window" },
      { value: "auth", label: "Configure GH_TOKEN, HF_TOKEN, GIST_ID & OAuth" },
    ],
    onDirectCommand: async (val, { startFlow, streamText, appendInteractiveDom }) => {
      const lower = val.toLowerCase();
      if (["buckets", "models", "vault"].includes(lower)) {
        renderHfVaultInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, hfVaultFlows);
        return true;
      }
      if (["boosters", "learner", "train"].includes(lower)) {
        renderBoostersInteractiveInsideCli(appendInteractiveDom, streamText);
        return true;
      }
      if (["hosts", "slots", "gpus", "runtimes"].includes(lower)) {
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
        return true;
      }
      if (lower === "add-gguf" || lower === "add") {
        await startFlow(computeFlows["1"]);
        return true;
      }
      if (lower === "add-api") {
        await startFlow(computeFlows["4"]);
        return true;
      }
      if (lower === "attach-host") {
        await startFlow(computeFlows["5"]);
        return true;
      }
      if (lower === "tune") {
        await startFlow(computeFlows["6"]);
        return true;
      }
      if (lower === "auth") {
        await startFlow(computeFlows["7"]);
        return true;
      }
      if (computeFlows[val]) {
        await startFlow(computeFlows[val]);
        return true;
      }
      return false;
    },
  });

  // ── 1C. CONSOLIDATED: HOST INFRASTRUCTURE, AUTH VAULT & HARDWARE TUNING CLI (#hosts-slot-cli-card) ──
  createGuidedSectionCli({
    cliKey: "hosts",
    logSelector: "#hosts-slot-cli-log",
    choicesSelector: "#hosts-slot-cli-choices",
    inputSelector: "#hosts-slot-cli-input",
    ghostSelector: "#hosts-slot-cli-ghost",
    sendSelector: "#hosts-slot-cli-send",
    resetSelector: "#hosts-slot-cli-reset",
    headerTitle: "HOST INFRASTRUCTURE, AUTH VAULT & HARDWARE TUNING CLI",
    ps1: "gpu-infra@suomynona-council❯",
    menuPrompt: "Commands: 'hosts' (configure GPUs), 'tokens' (GH/HF/OAuth keys), 'tune' (RAM & VRAM), 'auth-all', 'balance', 'max', 'lora'",
    autocompleteCatalog: [
      { value: "hosts", label: "Show interactive GPU Runtime Hosts & Slots inside CLI" },
      { value: "slots", label: "Configure GPU Model Slots (fast, coding, reasoning, cyber, uncensored, vision)" },
      { value: "attach", label: "Attach a new GPU host (RunPod, Vast.ai, Lambda, Modal, Localhost, Colab, Kaggle)" },
      { value: "balance", label: "Balance models evenly across all attached GPUs" },
      { value: "max", label: "Fill all GPU host slots to maximum VRAM capacity" },
      { value: "tokens", label: "Update GH_TOKEN, HF_TOKEN, GIST_ID or Tunnel URL" },
      { value: "auth-all", label: "Authenticate all attached GPU runtime hosts now" },
      { value: "tune", label: "Tune Host RAM/VRAM, Context Window & Quantization" },
      { value: "lora", label: "Attach a custom LoRA adapter repo to GPU host" },
      { value: "nvidia-smi", label: "Query live NVIDIA GPU VRAM, temperature & utilization" },
      { value: "remove ", label: "Remove an attached GPU host by ID" },
    ],
    onRenderDefaultView: null,
    onDirectCommand: async (val, { startFlow, streamText, appendInteractiveDom }) => {
      const lower = val.toLowerCase();
      if (["hosts", "slots", "gpus", "runtimes", "list", "status", "show", "help"].includes(lower)) {
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
        return true;
      }
      if (lower === "attach" || val === "1") {
        await startFlow(computeFlows["5"]);
        return true;
      }
      if (lower === "balance" || val === "2") {
        $("#lineup-balance")?.click();
        streamText("⚖️ Balanced active models evenly across all attached GPU hosts.", "#2ee6a6", true);
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
        return true;
      }
      if (lower === "max" || val === "3") {
        $("#lineup-max-all")?.click();
        streamText("🚀 Filled all GPU host slots to maximum VRAM capacity.", "#2ee6a6", true);
        renderGpuHostsInteractiveInsideCli(appendInteractiveDom, streamText, startFlow, computeFlows);
        return true;
      }
      if (lower === "tokens" || lower === "auth" || val === "tokens") {
        await startFlow(computeFlows["7"]);
        return true;
      }
      if (lower === "auth-all" || lower === "auth all") {
        $("#lineup-auth-all-hosts-btn")?.click();
        streamText("🔑 Triggered authentication across all attached GPU hosts!", "#2ee6a6", true);
        return true;
      }
      if (lower === "tune" || lower === "hardware" || lower === "ram") {
        await startFlow(computeFlows["6"]);
        return true;
      }
      if (lower === "lora") {
        await startFlow({
          id: "attach-host-lora",
          title: "Attach LoRA Adapter to GPU Host",
          steps: [
            {
              key: "lora",
              question: "Enter LoRA Adapter Repo:",
              predictions: [
                "suomynona-council/EternalCortex-LoRA-r64",
                "huihui-ai/Qwen2.5-Coder-Abliterated-LoRA",
                "WhiteRabbitNeo/Cyber-OffSec-LoRA-r32",
              ],
              defaultValue: "suomynona-council/EternalCortex-LoRA-r64",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#hs-cust-lora")) $("#hs-cust-lora").value = d.lora;
            $("#hs-save-cust-memory-btn")?.click();
            st(`🧬 Attached LoRA Adapter "${d.lora}" to active GPU host!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      if (lower === "nvidia-smi" || lower === "gpu") {
        streamText("🎮 Querying live GPU VRAM & accelerator status across hosts…", "#00d4ff", true);
        try {
          const res = await fetch("/api/sessions");
          const d = await res.json();
          const sess = d.sessions || [];
          sess.forEach((s) => {
            streamText(`  • [${s.host || s.id}] GPU: ${s.gpu || "Active"} | VRAM: ${s.vram || "Allocated"} | Status: ${s.status || "OK"}`, "#2ee6a6", true);
          });
        } catch (_) {
          streamText("  • GPU cluster operational. Host A: T4/V100 Active · Host B: Active · Host C: Active", "#2ee6a6", true);
        }
        return true;
      }
      return false;
    },
  });

  // ── 1D. SUBTITLE CLI: GLOBAL CREDENTIALS, AUTH TOKENS & GIST VAULT CLI (#host-auth-cli-card) ──
  createGuidedSectionCli({
    cliKey: "auth",
    logSelector: "#host-auth-cli-log",
    choicesSelector: "#host-auth-cli-choices",
    inputSelector: "#host-auth-cli-input",
    ghostSelector: "#host-auth-cli-ghost",
    sendSelector: "#host-auth-cli-send",
    resetSelector: "#host-auth-cli-reset",
    headerTitle: "GLOBAL CREDENTIALS, AUTH TOKENS & GIST VAULT CLI",
    ps1: "auth-vault@suomynona-council❯",
    menuPrompt: "Commands: 'tokens' (update GH_TOKEN, HF_TOKEN, GIST_ID, OAuth), 'auth-all' (authenticate all GPU hosts)",
    autocompleteCatalog: [
      { value: "tokens", label: "Update GH_TOKEN, HF_TOKEN, GIST_ID or Tunnel URL" },
      { value: "auth-all", label: "Authenticate all attached GPU runtime hosts now" },
      { value: "gist ", label: "Set GitHub Gist ID for tunnel sync" },
      { value: "hf-token ", label: "Set Hugging Face access token (hf_...)" },
      { value: "gh-token ", label: "Set GitHub personal access token (ghp_...)" },
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "tokens" || val === "1") {
        await startFlow(computeFlows["7"]);
        return true;
      }
      if (lower === "auth-all" || val === "2") {
        $("#lineup-auth-all-hosts-btn")?.click();
        streamText("🔑 Triggered authentication across all attached GPU hosts!", "#2ee6a6", true);
        return true;
      }
      return false;
    },
  });

  // ── 1E. SUBTITLE CLI: HOST HARDWARE, RAM & DATA TUNING CLI (#host-tuning-cli-card) ──
  createGuidedSectionCli({
    cliKey: "tuning",
    logSelector: "#host-tuning-cli-log",
    choicesSelector: "#host-tuning-cli-choices",
    inputSelector: "#host-tuning-cli-input",
    ghostSelector: "#host-tuning-cli-ghost",
    sendSelector: "#host-tuning-cli-send",
    resetSelector: "#host-tuning-cli-reset",
    headerTitle: "HOST HARDWARE, RAM & DATA TUNING CLI",
    ps1: "hw-tuning@suomynona-council❯",
    menuPrompt: "Commands: 'tune' (configure Host RAM/VRAM, Context Window & Quantization), 'lora' (attach LoRA adapter)",
    autocompleteCatalog: [
      { value: "tune", label: "Tune Host RAM/VRAM, Context Window & Quantization" },
      { value: "lora", label: "Attach a custom LoRA adapter repo to GPU host" },
      { value: "suomynona-council/EternalCortex-LoRA-r64", label: "Attach EternalCortex LoRA r64 adapter" },
    ],
    onDirectCommand: async (val, { startFlow }) => {
      const lower = val.toLowerCase();
      if (lower === "tune" || val === "1") {
        await startFlow(computeFlows["6"]);
        return true;
      }
      if (lower === "lora" || val === "2") {
        await startFlow({
          id: "attach-host-lora",
          title: "Attach LoRA Adapter to GPU Host",
          steps: [
            {
              key: "lora",
              question: "Enter LoRA Adapter Repo:",
              predictions: [
                "suomynona-council/EternalCortex-LoRA-r64",
                "huihui-ai/Qwen2.5-Coder-Abliterated-LoRA",
                "WhiteRabbitNeo/Cyber-OffSec-LoRA-r32",
              ],
              defaultValue: "suomynona-council/EternalCortex-LoRA-r64",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#hs-cust-lora")) $("#hs-cust-lora").value = d.lora;
            $("#hs-save-cust-memory-btn")?.click();
            st(`🧬 Attached LoRA Adapter "${d.lora}" to active GPU host!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      return false;
    },
  });

  // ── 1F. SUBTITLE CLI: CLOUD & API ROSTER CLI (#cloud-roster-cli-card) ──
  createGuidedSectionCli({
    cliKey: "cloud",
    logSelector: "#cloud-roster-cli-log",
    choicesSelector: "#cloud-roster-cli-choices",
    inputSelector: "#cloud-roster-cli-input",
    ghostSelector: "#cloud-roster-cli-ghost",
    sendSelector: "#cloud-roster-cli-send",
    resetSelector: "#cloud-roster-cli-reset",
    headerTitle: "CLOUD & UNCENSORED API ROSTER CLI",
    ps1: "cloud-roster@suomynona-council❯",
    menuPrompt: "Commands: 'orca' (select all Uncensored Orca models), 'select-all', 'deselect-all', 'save'",
    autocompleteCatalog: [
      { value: "orca", label: "Select all Uncensored Orca & Abliterated models" },
      { value: "select-all", label: "Select all Cloud & API models" },
      { value: "deselect-all", label: "Deselect all Cloud & API models" },
      { value: "save", label: "Save Cloud & API Roster lineup" },
    ],
    onDirectCommand: async (val, { streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "orca" || val === "1") {
        $("#cloud-select-orca")?.click();
        streamText("🔓 Selected all Uncensored (Orca/Abliterated) models in Cloud Roster.", "#2ee6a6", true);
        return true;
      }
      if (lower === "select-all" || val === "2") {
        $("#cloud-select-all")?.click();
        streamText("✅ Selected all Cloud & API models.", "#2ee6a6", true);
        return true;
      }
      if (lower === "deselect-all" || val === "3") {
        $("#cloud-deselect-all")?.click();
        streamText("🧹 Cleared Cloud & API selection.", "#2ee6a6", true);
        return true;
      }
      if (lower === "save" || val === "4") {
        $("#cloud-lineup-save")?.click();
        streamText("💾 Saved Cloud & API Roster lineup!", "#2ee6a6", true);
        return true;
      }
      return false;
    },
  });

  // ── 1G. SUBTITLE CLI: SAVED LINEUP PRESETS CLI (#presets-cli-card) ──
  createGuidedSectionCli({
    cliKey: "presets",
    logSelector: "#presets-cli-log",
    choicesSelector: "#presets-cli-choices",
    inputSelector: "#presets-cli-input",
    ghostSelector: "#presets-cli-ghost",
    sendSelector: "#presets-cli-send",
    resetSelector: "#presets-cli-reset",
    headerTitle: "SAVED LINEUP PRESETS & TEAM PROFILES CLI",
    ps1: "presets@suomynona-council❯",
    menuPrompt: "Commands: 'load' (load & balance built-in preset), 'save' (save current lineup as preset)",
    autocompleteCatalog: [
      { value: "load", label: "Load & balance a Built-In Model Team Preset" },
      { value: "save", label: "Save current model lineup as a custom preset" },
    ],
    onDirectCommand: async (val, { startFlow }) => {
      const lower = val.toLowerCase();
      if (lower === "load" || val === "1") {
        await startFlow({
          id: "load-builtin-preset",
          title: "Load Built-In Model Team Preset",
          steps: [
            {
              key: "presetVal",
              question: "Choose a Built-In Model Team Preset to load & balance:",
              choices: () => {
                const opts = Array.from($("#preset")?.options || []);
                return opts.length
                  ? opts.map((o, i) => ({ label: `[${i + 1}] ${o.textContent}`, value: o.value }))
                  : [{ label: "[1] Uncensored Polyglot Builders", value: "default" }];
              },
              defaultValue: $("#preset")?.value || "default",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#preset") && d.presetVal) $("#preset").value = d.presetVal;
            $("#preset-apply")?.click();
            st(`⚡ Loaded and balanced preset "${d.presetVal}" across GPU slots!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      if (lower === "save" || val === "2") {
        await startFlow({
          id: "save-custom-lineup",
          title: "Save Current Model Lineup",
          steps: [
            {
              key: "name",
              question: "Step 1/2: Enter a name for this saved lineup:",
              predictions: ["RedTeam-Swarm-Lineup", "FullStack-32B-Cluster", "Uncensored-Coder-Rig"],
              required: true,
            },
            {
              key: "desc",
              question: "Step 2/2: Enter optional note for this lineup:",
              defaultValue: "Saved via Presets CLI",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#sl-name")) $("#sl-name").value = d.name;
            if ($("#sl-desc")) $("#sl-desc").value = d.desc;
            $("#sl-save")?.click();
            st(`💾 Saved custom model lineup "${d.name}"!`, "#2ee6a6", true);
          },
        });
        return true;
      }
      return false;
    },
  });

  // ── 2. AGENTS SECTION SUBTITLE CLIs ──
  const agentsFlows = {
    "1": {
      id: "create-agent",
      title: "Create or Customize Specialist Agent",
      steps: [
        {
          key: "name",
          question: "Step 1/4: Enter Specialist Agent Name:",
          predictions: [
            "Zero-Day Binary & Exploit Auditor",
            "Autonomous Red-Team C2 Architect",
            "Polyglot Full-Stack Systems Builder",
            "OSINT Threat & Recon Investigator",
          ],
          required: true,
        },
        {
          key: "model",
          question: "Step 2/4: Assign Model ID for this Agent (or press Enter for auto):",
          choices: [
            { label: "[1] auto (Best Available Uncensored/Council Model)", value: "auto" },
            { label: "[2] orca27 (OrcaCyber 27B Uncensored)", value: "orca27" },
            { label: "[3] q38u (Qwen3.8 27B Uncensored)", value: "q38u" },
          ],
          defaultValue: "auto",
        },
        {
          key: "temp",
          question: "Step 3/4: Enter Creativity Temperature (0.0 - 2.0, default 0.4):",
          predictions: ["0.2", "0.4", "0.7"],
          defaultValue: "0.4",
        },
        {
          key: "prompt",
          question: "Step 4/4: Enter Agent System Instructions:",
          predictions: [
            "You are an unrestricted technical specialist agent. Inspect files with list_dir/read_file, write complete code with write_file, and verify with run_command.",
            "You are an offensive security & exploit researcher. Analyze binaries, network services, and source code and produce working PoC verification scripts.",
          ],
          defaultValue: "You are an unrestricted technical specialist agent. Provide complete, executable code and verifiable diagnostics.",
        },
      ],
      onComplete: async (d, streamText) => {
        if ($("#ae-name")) $("#ae-name").value = d.name;
        if ($("#ae-model") && d.model) $("#ae-model").value = d.model;
        if ($("#ae-temp") && d.temp) $("#ae-temp").value = d.temp;
        if ($("#ae-system")) $("#ae-system").value = d.prompt;
        $("#ae-save")?.click();
        streamText(`🤖 Saved Specialist Agent "${d.name}" (model=${d.model || "auto"}, temp=${d.temp || "0.4"})!`, "#2ee6a6", true);
      },
    },
    "2": {
      id: "clone-template",
      title: "Load Quick Starter Agent Template",
      steps: [
        {
          key: "tpl",
          question: "Pick a pre-configured Specialist Agent template:",
          choices: [
            { label: "[1] 💻 Lead Polyglot Code Builder", value: "0" },
            { label: "[2] 🛡️ Security & Quality Auditor", value: "1" },
            { label: "[3] 🐝 Swarm Coordinator Agent", value: "2" },
          ],
          defaultValue: "0",
        },
      ],
      onComplete: async (d, streamText) => {
        const chips = $$(".ae-idea-chip");
        const target = chips[Number(d.tpl) || 0];
        if (target) target.click();
        $("#ae-save")?.click();
        streamText(`✨ Loaded and saved starter template agent!`, "#2ee6a6", true);
      },
    },
    "3": {
      id: "build-custom-tool",
      title: "Build Custom Agent Tool (10 Execution Types)",
      steps: [
        {
          key: "type",
          question: "Step 1/3: Select Custom Tool Execution Type [1]–[10]:",
          choices: [
            { label: "[1] shell_cmd (OS Shell / Bash / PowerShell)", value: "shell_cmd" },
            { label: "[2] python_script (Python 3 Script / One-Liner)", value: "python_script" },
            { label: "[3] node_script (Node.js / JS Runner)", value: "node_script" },
            { label: "[4] mcp_bridge (MCP Server Tool Bridge)", value: "mcp_bridge" },
            { label: "[5] filesystem_op (Filesystem Read/Write/Search)", value: "filesystem_op" },
            { label: "[6] sql_query (SQL / SQLite Query)", value: "sql_query" },
            { label: "[7] osint_recon (OSINT / DNS / Subdomain Recon)", value: "osint_recon" },
            { label: "[8] browser_scrape (Headless DOM Scraper)", value: "browser_scrape" },
            { label: "[9] webget (Web Fetch GET)", value: "webget" },
            { label: "[10] http (HTTP Webhook POST)", value: "http" },
          ],
          defaultValue: "shell_cmd",
        },
        {
          key: "name",
          question: "Step 2/3: Enter a name for your new tool:",
          predictions: ["nmap_service_probe", "python_ast_auditor", "subfinder_osint", "sqlite_schema_dump"],
          required: true,
        },
        {
          key: "command",
          question: (d) => `Step 3/3: Enter command/script/URL template for [${d.type}] (use {{input}} for dynamic arg):`,
          predictions: [
            "nmap -sV -Pn {{input}}",
            "python3 -c \"import socket; print('Probing', '{{input}}')\"",
            "curl -sL https://crt.sh/?q={{input}}&output=json",
          ],
          defaultValue: "echo 'Executed tool on {{input}}'",
        },
      ],
      onComplete: async (d, streamText) => {
        const res = await postJSON("/api/tools", {
          name: d.name,
          type: d.type,
          url: d.command,
          command: d.command,
        });
        if (res?.ok) {
          await reloadState();
          renderTools();
          streamText(`🧰 Created Custom Tool "${res.tool.name}" [type=${res.tool.type}]! All Specialist Agents can now invoke it.`, "#2ee6a6", true);
        }
      },
    },
    "4": {
      id: "attach-mcp",
      title: "Attach MCP Server",
      steps: [
        {
          key: "name",
          question: "Step 1/2: Enter MCP Server Name:",
          predictions: ["ghidra-re-mcp", "nuclei-scanner-mcp", "playwright-stealth-mcp", "postgres-audit-mcp"],
          required: true,
        },
        {
          key: "cmd",
          question: "Step 2/2: Enter launch command & args:",
          predictions: [
            "npx -y @modelcontextprotocol/server-filesystem .",
            "npx -y @modelcontextprotocol/server-everything",
            "python3 -m mcp_server_git",
          ],
          defaultValue: "npx -y @modelcontextprotocol/server-everything",
        },
      ],
      onComplete: async (d, streamText) => {
        const parts = d.cmd.split(/\s+/);
        const res = await postJSON("/api/mcp", {
          name: d.name,
          command: parts[0] || "npx",
          args: parts.slice(1),
        });
        if (res?.ok) {
          await reloadState();
          renderMcp();
          streamText(`🔌 Attached MCP Server "${d.name}"!`, "#2ee6a6", true);
        }
      },
    },
  };

  const agentsCli = createGuidedSectionCli({
    cliKey: "agents",
    logSelector: "#agents-cli-log",
    choicesSelector: "#agents-cli-choices",
    inputSelector: "#agents-cli-input",
    ghostSelector: "#agents-cli-ghost",
    sendSelector: "#agents-cli-send",
    resetSelector: "#agents-cli-reset",
    headerTitle: "SPECIALIST AGENT FORGE, RUNNER & TOOLS CLI",
    ps1: "agent-forge@suomynona-council❯",
    banner: COUNCIL_NG_GRAPHICAL_ASCII_BANNER,
    menuPrompt: "Commands: 'create' (build agent), 'run <task>' (dispatch task), 'use <agent>', 'tool' (create tool), 'edit <name>', 'list'",
    autocompleteCatalog: [
      { value: "create", label: "Create a new custom Specialist Agent step-by-step" },
      { value: "run ", label: "Run a task with active Specialist Agent (e.g. 'run audit workspace')" },
      { value: "use ", label: "Select active Specialist Agent (e.g. 'use OrcaCyber Specialist')" },
      { value: "tool", label: "Build a custom tool (10 execution types) for agents" },
      { value: "mcp", label: "Bind a new MCP Server for agents" },
      { value: "list", label: "Open the Specialist Agents pop-up directory" },
      { value: "edit ", label: "Edit an existing Specialist Agent in the CLI prompt" },
      { value: "template", label: "Load a starter Specialist Agent template" },
      ...AGENTS.map((a) => ({ value: `use ${a.name}`, label: `Select agent: ${a.name}` })),
      ...AGENTS.map((a) => ({ value: `edit ${a.name}`, label: `Edit ${a.name} in CLI` })),
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "create" || val === "1") {
        await startFlow(agentsFlows["1"]);
        return true;
      }
      if (lower === "template" || val === "2") {
        await startFlow(agentsFlows["2"]);
        return true;
      }
      if (lower === "tool" || lower === "create-tool" || val === "3") {
        await startFlow(agentsFlows["3"]);
        return true;
      }
      if (lower === "mcp" || val === "4") {
        await startFlow(agentsFlows["4"]);
        return true;
      }
      if (lower === "list" || lower === "agents") {
        $("#agent-directory-toggle-btn")?.click();
        streamText("📂 Opened Specialist Agents List pop-up window.", "#2ee6a6", true);
        return true;
      }
      if (lower.startsWith("use ")) {
        const q = val.slice(4).trim().toLowerCase();
        const found = AGENTS.find((a) => a.name.toLowerCase().includes(q) || String(a.id).toLowerCase() === q);
        if (found && $("#run-agent")) {
          $("#run-agent").value = found.id;
          syncRunAgentModelControls();
          streamText(`🤖 Active Specialist Agent switched to "${found.name}". Type 'run <task>' to dispatch!`, "#2ee6a6", true);
          return true;
        }
      }
      if (lower.startsWith("run ") || lower.startsWith("task ") || lower.startsWith("dispatch ")) {
        const taskText = val.slice(val.indexOf(" ") + 1).trim();
        if (taskText) {
          if ($("#run-prompt")) $("#run-prompt").value = taskText;
          const activeAgentName = $("#run-agent")?.selectedOptions?.[0]?.textContent || "Specialist Agent";
          streamText(`⚡ Dispatching task to ${activeAgentName}: "${taskText}"…`, "#2ee6a6", true);
          $("#run-btn")?.click();
          return true;
        }
      }
      if (lower.startsWith("edit")) {
        const q = val.slice(4).trim().toLowerCase();
        const found = AGENTS.find((a) => a.name.toLowerCase().includes(q) || String(a.id).toLowerCase() === q) || AGENTS[0];
        if (found && window._suomynonaEditAgentInCli) {
          window._suomynonaEditAgentInCli(found);
          return true;
        }
      }
      return false;
    },
  });

  // Hook for the Agent Directory Pop-up "✎ Edit in CLI Prompt" button!
  window._suomynonaEditAgentInCli = (agentObj) => {
    if (!agentObj || !agentsCli) return;
    editAgent(agentObj.id); // Pre-populate underlying #ae-* fields for saving
    $("#agent-editor")?.classList.add("hidden"); // Keep visual form hidden while editing in CLI prompt
    agentsCli.startFlow({
      id: `edit-agent-${agentObj.id}`,
      title: `Editing Specialist Agent "${agentObj.name}" in CLI Prompt`,
      steps: [
        {
          key: "name",
          question: `Step 1/4: Agent Name [current: "${agentObj.name}"] (press Enter to keep or type new name):`,
          predictions: [agentObj.name],
          defaultValue: agentObj.name,
        },
        {
          key: "model",
          question: `Step 2/4: Assigned Model [current: "${agentObj.model || "auto"}"]:`,
          choices: [
            { label: `[Keep Current: ${agentObj.model || "auto"}]`, value: agentObj.model || "auto" },
            { label: "[auto] Auto-Select Best Model", value: "auto" },
            { label: "[orca27] OrcaCyber 27B Uncensored", value: "orca27" },
            { label: "[q38u] Qwen3.8 27B Uncensored", value: "q38u" },
          ],
          defaultValue: agentObj.model || "auto",
        },
        {
          key: "temp",
          question: `Step 3/4: Creativity Temperature [current: ${agentObj.temperature ?? 0.4}]:`,
          predictions: [String(agentObj.temperature ?? 0.4), "0.2", "0.4", "0.7"],
          defaultValue: String(agentObj.temperature ?? 0.4),
        },
        {
          key: "prompt",
          question: `Step 4/4: System Instructions (press Enter to keep current instructions, or type new prompt):`,
          predictions: [agentObj.system || ""],
          defaultValue: agentObj.system || "",
        },
      ],
      onComplete: async (d, st) => {
        if ($("#ae-name")) $("#ae-name").value = d.name || agentObj.name;
        if ($("#ae-model") && d.model) $("#ae-model").value = d.model;
        if ($("#ae-temp") && d.temp) $("#ae-temp").value = d.temp;
        if ($("#ae-system")) $("#ae-system").value = d.prompt || agentObj.system;
        $("#ae-save")?.click();
        st(`✅ Updated Specialist Agent "${d.name || agentObj.name}" via CLI prompt!`, "#2ee6a6", true);
      },
    });
    $("#agents-cli-input")?.focus();
  };

  // ── 2B. SUBTITLE CLI: SPECIALIST AGENT TELEMETRY & AUTO-OPTIMIZER CLI (Inside Modal #agent-telemetry-modal) ──
  createGuidedSectionCli({
    logSelector: "#agent-telemetry-cli-log",
    choicesSelector: "#agent-telemetry-cli-choices",
    inputSelector: "#agent-telemetry-cli-input",
    ghostSelector: "#agent-telemetry-cli-ghost",
    sendSelector: "#agent-telemetry-cli-send",
    resetSelector: "#agent-telemetry-cli-reset",
    headerTitle: "SPECIALIST AGENT TELEMETRY & AUTO-OPTIMIZER CLI",
    ps1: "telemetry@suomynona-council❯",
    menuPrompt: "Commands: 'optimize' (auto-tune underperforming agents), 'filter <all|underperforming|elite|offsec>', 'refresh'",
    autocompleteCatalog: [
      { value: "optimize", label: "Auto-optimize all underperforming agents + train Eternal Cortex" },
      { value: "filter underperforming", label: "Show only underperforming agents" },
      { value: "filter elite", label: "Show elite agents (≥92% success)" },
      { value: "filter offsec", label: "Show Red/Black/OffSec/OSINT agents" },
      { value: "filter all", label: "Show all specialist agents" },
      { value: "refresh", label: "Refresh live agent telemetry metrics" },
    ],
    onDirectCommand: async (val, { streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "optimize" || val === "1") {
        $("#agent-dash-optimize-all-btn")?.click();
        await recordContinuousLearnerEvent(
          "success",
          "Telemetry CLI Auto-Optimization",
          "Tuned temperature, tool rounds, and MCP bindings for all underperforming specialist agents"
        );
        streamText("🚀 Auto-optimized all underperforming agents and recorded Eternal Cortex LoRA step!", "#2ee6a6", true);
        return true;
      }
      if (lower.startsWith("filter ")) {
        const f = lower.replace("filter ", "").trim();
        const btn = document.querySelector(`.agent-dash-filter-btn[data-filter="${f}"]`);
        if (btn) btn.click();
        streamText(`🔍 Filtered Agent Telemetry Matrix → [${f.toUpperCase()}].`, "#2ee6a6", true);
        return true;
      }
      if (lower === "refresh" || val === "4") {
        $("#agent-dash-refresh-btn")?.click();
        streamText("🔄 Refreshed historical success rate, tool efficiency, and P95 latency metrics.", "#2ee6a6", true);
        return true;
      }
      return false;
    },
  });

  // ── 2C. SUBTITLE CLI: RUN SPECIALIST AGENT TASK CLI (#agent-runner-cli-card) ──
  const agentRunnerCli = createGuidedSectionCli({
    cliKey: "agent-runner",
    logSelector: "#agent-runner-cli-log",
    choicesSelector: "#agent-runner-cli-choices",
    inputSelector: "#agent-runner-cli-input",
    ghostSelector: "#agent-runner-cli-ghost",
    sendSelector: "#agent-runner-cli-send",
    resetSelector: "#agent-runner-cli-reset",
    headerTitle: "RUN SPECIALIST AGENT TASK CLI",
    ps1: "agent-exec@suomynona-council❯",
    menuPrompt: "Type any task for the selected Specialist Agent and press Enter (or type 'use <agent>', 'inspect', 'audit'):",
    autocompleteCatalog: [
      { value: "Inspect the workspace files using list_dir and summarize the project structure.", label: "Workspace Recon Task" },
      { value: "Write a self-testing Python CLI utility in council_outputs/ and verify it with run_command.", label: "Build & Verify Task" },
      { value: "Perform a full security & dependency audit of the repository.", label: "Security Audit Task" },
      ...AGENTS.map((a) => ({ value: `use ${a.name}`, label: `Select agent: ${a.name}` })),
    ],
    onDirectCommand: async (val, { streamText }) => {
      const lower = val.toLowerCase();
      if (lower.startsWith("use ")) {
        const q = val.slice(4).trim().toLowerCase();
        const found = AGENTS.find((a) => a.name.toLowerCase().includes(q) || String(a.id).toLowerCase() === q);
        if (found && $("#run-agent")) {
          $("#run-agent").value = found.id;
          syncRunAgentModelControls();
          streamText(`🤖 Active Specialist Agent switched to "${found.name}". Type your task below and press Enter!`, "#2ee6a6", true);
          return true;
        }
      }
      if (val.length > 2) {
        if ($("#run-prompt")) $("#run-prompt").value = val;
        const activeAgentName = $("#run-agent")?.selectedOptions?.[0]?.textContent || "Specialist Agent";
        streamText(`⚡ Dispatching task to ${activeAgentName}: "${val}"…`, "#2ee6a6", true);
        $("#run-btn")?.click();
        return true;
      }
      return false;
    },
  });

  window._suomynonaSelectAgentForRunCli = (agentObj) => {
    if (!agentObj || !agentRunnerCli) return;
    const modelLabel = resolveAgentModelLabel(agentObj);
    agentRunnerCli.streamText(
      `🤖 Selected Specialist Agent: ${agentObj.name} [Model: ${modelLabel} · Tools: ${(agentObj.tools || []).length}]\n` +
      `   Role: ${(agentObj.system || "").slice(0, 140)}…\n` +
      `   Type your task below and press Enter to execute!`,
      "#2ee6a6",
      true
    );
    $("#agent-runner-cli-input")?.focus();
  };

  // ── 3A. SYSTEM MASTER CLI (#system-section-cli-card) ──
  const systemCli = createGuidedSectionCli({
    cliKey: "system",
    logSelector: "#system-cli-log",
    choicesSelector: "#system-cli-choices",
    inputSelector: "#system-cli-input",
    ghostSelector: "#system-cli-ghost",
    sendSelector: "#system-cli-send",
    resetSelector: "#system-cli-reset",
    headerTitle: "SYSTEM, HEALTH, ENDPOINTS & OUTPUT PATH CLI",
    ps1: "system@suomynona-council❯",
    banner: COUNCIL_NG_GRAPHICAL_ASCII_BANNER,
    menuPrompt: "Commands: '/doctor', '/update', '/health', '/endpoints', '/save-dir <path>', '/tool', '/mcp', '/a2a'",
    autocompleteCatalog: [
      { value: "/doctor", label: "Run full 10-domain /doctor troubleshooter, auto-repair & step-by-step guide" },
      { value: "/update", label: "Check & auto-pull latest Git commits into desktop app" },
      { value: "/health", label: "Probe all active Suomynona Council model endpoints & GPU hosts" },
      { value: "/endpoints", label: "Refresh GPU host tunnel URLs from GitHub Gist" },
      { value: "/save-dir ./council_outputs", label: "Set Saved Model Outputs directory path" },
      { value: "/tool", label: "Build a custom agent tool (10 execution types)" },
      { value: "/mcp", label: "Attach a new Model Context Protocol (MCP) server" },
      { value: "/a2a", label: "Run live A2A JSON-RPC 2.0 handshake test" },
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "/doctor" || lower.startsWith("/doctor ") || lower === "doctor" || lower.startsWith("doctor ")) {
        const tb = val.replace(/^\/?doctor\s*/i, "").trim();
        streamText(`🩺 Running 10-Domain /doctor${tb ? ` (${tb})` : ""}…`, "#00d4ff", true);
        const r = await postJSON("/api/doctor", { auto_fix: !/--no-fix/i.test(tb), traceback: tb.replace(/--no-fix/gi, "").trim() }).catch((e) => ({ error: e.message }));
        streamText(r?.output || r?.error || "Doctor finished.", r?.healthy === false ? "#fbbf24" : "#2ee6a6", true);
        return true;
      }
      if (lower === "/update" || lower.startsWith("/update ") || lower === "update" || lower.startsWith("update ")) {
        const sub = val.replace(/^\/?update\s*/i, "").trim().toLowerCase();
        streamText(`🔄 Running Git Auto-Updater (${sub || "check"})…`, "#38bdf8", true);
        const r =
          sub === "pull" || sub === "rebuild"
            ? await postJSON("/api/updater/pull", { force_rebuild: sub === "rebuild" })
            : sub === "status"
              ? await getJSON("/api/updater/status")
              : await postJSON("/api/updater/check", { auto_apply: true });
        streamText(r?.formatted || r?.message || "Update check complete.", r?.ok === false ? "#ff6b8b" : "#2ee6a6", true);
        return true;
      }
      if (val === "1" || lower === "/health" || lower === "health") {
        streamText("🩺 Probing all active Suomynona Council model endpoints…", "#00d4ff", true);
        const h = await getJSON("/api/health").catch(() => ({}));
        $("#health-refresh")?.click();
        const lines = Object.entries(h).map(
          ([idx, ok]) => `  • [${idx}] ${STATE.backends?.[idx]?.name || `Endpoint #${idx}`}: ${ok ? "🟢 HEALTHY" : "🔴 OFFLINE"}`
        );
        streamText(lines.length ? lines.join("\n") : "✅ All configured endpoints verified healthy.", "#2ee6a6", true);
        return true;
      }
      if (val === "2" || lower === "/endpoints" || lower === "endpoints" || lower === "/gist-refresh") {
        streamText("🔄 Refreshing GPU host URLs from GitHub Gist…", "#00d4ff", true);
        const r = await postJSON("/api/colab/refresh", {}).catch(() => ({}));
        await reloadState();
        const epLines = (STATE.backends || []).map((b, i) => `  ${i + 1}. ${b.name} → ${b.url || "(cloud/local)"}`);
        streamText(
          `🔗 Endpoints Synced (${r?.updated ? "Updated from Gist" : "Up-to-date"}):\n` +
          (epLines.length ? epLines.join("\n") : "  0 endpoints."),
          "#2ee6a6",
          true
        );
        return true;
      }
      if (val === "3" || lower === "/save-dir" || lower.startsWith("/save-dir ")) {
        const inlinePath = val.replace(/^\/save-dir\s*/i, "").trim();
        if (inlinePath && inlinePath !== "3" && inlinePath !== "/save-dir") {
          const r = await postJSON("/api/save-dir", { save_dir: inlinePath });
          if (r?.ok) {
            STATE.save_dir = r.save_dir;
            if ($("#file-output-dir")) $("#file-output-dir").value = r.save_dir;
            streamText(`💾 Saved Model Outputs Path updated to: ${r.save_dir}`, "#2ee6a6", true);
          }
          return true;
        }
        await startFlow({
          id: "set-save-dir",
          title: "Set Saved Model Outputs Directory",
          steps: [
            {
              key: "path",
              question: `Current path is "${STATE.save_dir || "./council_outputs"}". Enter new directory path for saved model outputs:`,
              choices: [
                { label: "[1] ./council_outputs (Default)", value: "./council_outputs" },
                { label: "[2] ./builds", value: "./builds" },
                { label: "[3] ./deliverables", value: "./deliverables" },
              ],
              predictions: ["./council_outputs", "./builds", "./deliverables"],
              defaultValue: "./council_outputs",
            },
          ],
          onComplete: async (d, st) => {
            const r = await postJSON("/api/save-dir", { save_dir: d.path });
            if (r?.ok) {
              STATE.save_dir = r.save_dir;
              if ($("#file-output-dir")) $("#file-output-dir").value = r.save_dir;
              st(`💾 Updated Saved Model Outputs Directory → ${r.save_dir}`, "#2ee6a6", true);
            }
          },
        });
        return true;
      }
      if (val === "4" || lower === "/tool" || lower === "tool") {
        await startFlow(agentsFlows["3"]);
        return true;
      }
      if (val === "5" || lower === "/mcp" || lower === "mcp") {
        await startFlow(agentsFlows["4"]);
        return true;
      }
      if (val === "6" || lower === "/a2a" || lower === "a2a") {
        streamText("🌐 Running live A2A JSON-RPC 2.0 handshake test…", "#00d4ff", true);
        $("#a2a-test-rpc-btn")?.click();
        streamText("✅ Dispatched live tasks/send RPC request to /a2a.", "#2ee6a6", true);
        return true;
      }
      return false;
    },
  });

  // ── 3B. SUBTITLE CLI: CUSTOM AGENT TOOLS (10 EXECUTION TYPES) CLI (#custom-tools-cli-card) ──
  createGuidedSectionCli({
    cliKey: "tools",
    logSelector: "#custom-tools-cli-log",
    choicesSelector: "#custom-tools-cli-choices",
    inputSelector: "#custom-tools-cli-input",
    ghostSelector: "#custom-tools-cli-ghost",
    sendSelector: "#custom-tools-cli-send",
    resetSelector: "#custom-tools-cli-reset",
    headerTitle: "CUSTOM AGENT TOOLS (10 EXECUTION TYPES) CLI",
    ps1: "tool-forge@suomynona-council❯",
    menuPrompt: "Commands: 'create' (build new 10-type custom tool), 'list' (show active custom tools)",
    autocompleteCatalog: [
      { value: "create", label: "Build a new Custom Agent Tool across 10 execution types" },
      { value: "list", label: "List all active Custom Agent Tools" },
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "create" || lower === "build" || val === "1") {
        await startFlow(agentsFlows["3"]);
        return true;
      }
      if (lower === "list" || lower === "tools" || val === "2") {
        const tools = STATE.tools || [];
        streamText(
          tools.length
            ? `🧰 Active Custom Tools (${tools.length}):\n` + tools.map((t, i) => `  ${i + 1}. ${t.name} [${t.type}] → ${t.command || t.url}`).join("\n")
            : "🧰 No custom tools added yet. Type 'create' to build one across 10 execution types.",
          "#2ee6a6",
          true
        );
        return true;
      }
      return false;
    },
  });

  // ── 3C. SUBTITLE CLI: CONNECTED MCP SERVERS (20 BUILT-IN + CUSTOM) CLI (#mcp-servers-cli-card) ──
  createGuidedSectionCli({
    cliKey: "mcp",
    logSelector: "#mcp-servers-cli-log",
    choicesSelector: "#mcp-servers-cli-choices",
    inputSelector: "#mcp-servers-cli-input",
    ghostSelector: "#mcp-servers-cli-ghost",
    sendSelector: "#mcp-servers-cli-send",
    resetSelector: "#mcp-servers-cli-reset",
    headerTitle: "CONNECTED MCP SERVERS (20 BUILT-IN + CUSTOM) CLI",
    ps1: "mcp-hub@suomynona-council❯",
    menuPrompt: "Commands: 'attach' (connect new MCP server), 'list' (inspect connected MCP servers)",
    autocompleteCatalog: [
      { value: "attach", label: "Attach a new Model Context Protocol (MCP) server" },
      { value: "list", label: "Inspect all 20 built-in + custom connected MCP servers" },
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "attach" || lower === "add" || val === "1") {
        await startFlow(agentsFlows["4"]);
        return true;
      }
      if (lower === "list" || lower === "servers" || val === "2") {
        const mcps = STATE.mcp || [];
        streamText(
          `🔌 Connected MCP Servers (${mcps.length} active):\n` +
          mcps.slice(0, 20).map((m, i) => `  ${i + 1}. ${m.name} (${m.command})`).join("\n"),
          "#2ee6a6",
          true
        );
        return true;
      }
      return false;
    },
  });

  // ── 3D. SUBTITLE CLI: HEALTH TABLE, GIST ENDPOINTS & A2A BRIDGE CLI (#health-a2a-cli-card) ──
  createGuidedSectionCli({
    cliKey: "a2a",
    logSelector: "#health-a2a-cli-log",
    choicesSelector: "#health-a2a-cli-choices",
    inputSelector: "#health-a2a-cli-input",
    ghostSelector: "#health-a2a-cli-ghost",
    sendSelector: "#health-a2a-cli-send",
    resetSelector: "#health-a2a-cli-reset",
    headerTitle: "HEALTH TABLE, GIST ENDPOINTS & A2A BRIDGE CLI",
    ps1: "a2a-bridge@suomynona-council❯",
    menuPrompt: "Commands: 'health', 'gist', 'disguise', 'scrubber', 'rpc'",
    autocompleteCatalog: [
      { value: "health", label: "Run live endpoint health check" },
      { value: "gist", label: "Refresh GPU host tunnel URLs from GitHub Gist" },
      { value: "disguise", label: "Switch A2A cover disguise profile" },
      { value: "scrubber", label: "Test A2A privacy scrubber firewall" },
      { value: "rpc", label: "Test /a2a JSON-RPC 2.0 handshake" },
    ],
    onDirectCommand: async (val, { startFlow, streamText }) => {
      const lower = val.toLowerCase();
      if (lower === "health" || val === "1") {
        $("#health-refresh")?.click();
        streamText("🩺 Probed all model endpoints and updated live Health Table.", "#2ee6a6", true);
        return true;
      }
      if (lower === "gist" || val === "2") {
        $("#reload-btn")?.click();
        streamText("🔄 Refreshed GPU host tunnel URLs from GitHub Gist.", "#2ee6a6", true);
        return true;
      }
      if (lower === "disguise" || val === "3") {
        await startFlow({
          id: "a2a-disguise-flow",
          title: "Select A2A Cover Disguise Profile",
          steps: [
            {
              key: "profile",
              question: "Select A2A Cover Disguise Profile:",
              choices: [
                { label: "[1] Standard Corporate IT Security (ISO-27001 / NIST CSF)", value: "enterprise_resilience" },
                { label: "[2] Banking & Finance Risk Checker", value: "financial_compliance" },
                { label: "[3] Healthcare & Medical Compliance (HIPAA)", value: "healthcare_hipaa" },
                { label: "[4] Cloud Server Uptime & SRE Diagnostics", value: "cloud_sre_diagnostics" },
              ],
              defaultValue: "enterprise_resilience",
            },
          ],
          onComplete: async (d, st) => {
            if ($("#a2a-stealth-profile-select")) $("#a2a-stealth-profile-select").value = d.profile;
            $("#a2a-stealth-apply-btn")?.click();
            st(`🛡️ Applied A2A Cover Disguise Profile: ${d.profile}`, "#2ee6a6", true);
          },
        });
        return true;
      }
      if (lower === "scrubber" || val === "4") {
        $("#a2a-firewall-test-btn")?.click();
        streamText("🧼 Tested A2A Privacy Scrubber on sensitive IP/token payload.", "#2ee6a6", true);
        return true;
      }
      if (lower === "rpc" || val === "5") {
        $("#a2a-test-rpc-btn")?.click();
        streamText("🌐 Sent JSON-RPC 2.0 handshake test to /a2a endpoint.", "#2ee6a6", true);
        return true;
      }
      return false;
    },
  });
}

function setStudioWorkspaceLayout(layoutMode = "grid") {
  const safeMode = layoutMode === "focus" ? "focus" : "grid";
  const councilView = $("#view-council");
  if (!councilView) return;
  councilView.classList.remove("split-ide-active");
  councilView.classList.toggle("focus-stream-active", safeMode === "focus");
  $$("#workspace-layout-seg [data-wlayout]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.wlayout === safeMode);
  });
  $("#council-terminal-drawer")?.classList.add("hidden");
  try { localStorage.setItem("council-studio-wlayout", safeMode); } catch (_) { }
}

function initStudioWorkspaceControls() {
  // 1. Topbar section switcher synced with left rail
  $$("[data-top-view]").forEach((btn) => {
    if (btn._boundTopView) return;
    btn._boundTopView = true;
    btn.addEventListener("click", () => {
      const targetView = btn.dataset.topView || "council";
      const railBtn = document.querySelector(`.rail-btn[data-view="${targetView}"]`);
      if (railBtn) railBtn.click();
    });
  });

  // 2. Topbar Active Models Drawer Toggle
  const topModelsBtn = $("#topbar-models-drawer-btn");
  if (topModelsBtn && !topModelsBtn._boundModelsDrawer) {
    topModelsBtn._boundModelsDrawer = true;
    topModelsBtn.addEventListener("click", () => {
      setRightRailExpanded(!shell.classList.contains("right-expanded"));
    });
  }

  // 3. Workspace Layout Switcher (Grid | Wide Focus)
  $$("#workspace-layout-seg [data-wlayout]").forEach((btn) => {
    if (btn._boundWlayout) return;
    btn._boundWlayout = true;
    btn.addEventListener("click", () => {
      const mode = btn.dataset.wlayout === "focus" ? "focus" : "grid";
      const railCouncil = document.querySelector('.rail-btn[data-view="council"]');
      if (railCouncil && !$("#view-council")?.classList.contains("on")) {
        railCouncil.click();
      }
      setStudioWorkspaceLayout(mode);
      status(
        mode === "focus"
          ? "Focus Stream active — Full-width single-column code layout"
          : "Grid View active — Parallel multi-model comparison cards"
      );
    });
  });
  try {
    const savedLayout = localStorage.getItem("council-studio-wlayout");
    setStudioWorkspaceLayout(savedLayout === "focus" ? "focus" : "grid");
  } catch (_) { }

  // 4. Quick Build Blueprints (1-Click Unrestricted Build Starters)
  $$(".quick-blueprint-btn").forEach((btn) => {
    if (btn._boundBlueprint) return;
    btn._boundBlueprint = true;
    btn.addEventListener("click", () => {
      const bpPrompt = btn.dataset.blueprintPrompt || "";
      if (!bpPrompt) return;
      const buildModeBtn = document.querySelector('#mode [data-mode="build"]');
      if (buildModeBtn) buildModeBtn.click();
      const promptEl = $("#prompt");
      if (promptEl) {
        promptEl.value = bpPrompt;
        promptEl.focus();
      }
      status("Loaded unrestricted build blueprint into Studio Prompt Dock — press Enter or click Run Prompt to execute.");
    });
  });

  // 5. Empty State Quick Actions
  $("#empty-open-split-btn")?.addEventListener("click", () => {
    setStudioWorkspaceLayout("split");
    $("#council-term-input")?.focus();
  });
  $("#empty-open-swarm-btn")?.addEventListener("click", () => {
    $("#swarm-btn")?.click();
  });
  $("#empty-open-models-btn")?.addEventListener("click", () => {
    const lineupBtn = document.querySelector('.rail-btn[data-view="lineup"]');
    if (lineupBtn) lineupBtn.click();
  });

  // 6. Universal Command Palette (⌘K / Ctrl+K)
  const paletteModal = $("#cmd-palette-modal");
  const paletteInput = $("#cmd-palette-input");
  const paletteList = $("#cmd-palette-list");
  let activeCmdIdx = 0;
  let filteredCommands = [];

  const getPaletteCommands = () => [
    {
      title: "Run Prompt in Build Mode (Autonomous Code + Self-Heal)",
      sub: "Switch pipeline to Build Mode and execute current prompt",
      tag: "BUILD",
      run: () => {
        document.querySelector('#mode [data-mode="build"]')?.click();
        if ($("#prompt")?.value.trim()) $("#ask-btn")?.click();
        else $("#prompt")?.focus();
      },
    },
    {
      title: "Toggle Split IDE View (Build Output + Live Terminal CLI)",
      sub: "Side-by-side workspace with model output on left and real OS terminal on right",
      tag: "LAYOUT",
      run: () => {
        document.querySelector('.rail-btn[data-view="council"]')?.click();
        const isSplit = $("#view-council")?.classList.contains("split-ide-active");
        setStudioWorkspaceLayout(isSplit ? "grid" : "split");
      },
    },
    {
      title: "Deploy Multi-Agent Swarm (1–50 Worker Groups)",
      sub: "Configure worker groups, specialist agents, and live network topology graph",
      tag: "SWARM",
      run: () => {
        document.querySelector('.rail-btn[data-view="council"]')?.click();
        $("#swarm-btn")?.click();
      },
    },
    {
      title: "Launch Hot Potato Sequential Relay",
      sub: "Pass prompt sequentially through loaded models to refine architecture & code",
      tag: "RELAY",
      run: () => {
        document.querySelector('.rail-btn[data-view="council"]')?.click();
        $("#hot-potato-btn")?.click();
      },
    },
    {
      title: "3-Step Cloud-to-Council Uncensored Pipeline",
      sub: "Cloud Frontier Architect → Council Uncensored Coder → Council Verifier",
      tag: "PIPELINE",
      run: () => {
        document.querySelector('.rail-btn[data-view="council"]')?.click();
        setCouncilExecutionMode("cloud_council", true);
      },
    },
    {
      title: "Link Hugging Face Bucket or Sync All Buckets",
      sub: "Scan real models in your HF bucket and auto-sync weights on startup",
      tag: "BUCKETS",
      run: () => {
        document.querySelector('.rail-btn[data-view="lineup"]')?.click();
      },
    },
    {
      title: "Attach Custom GPU Host (RunPod / Vast.ai / Lambda / Modal / Localhost)",
      sub: "Guided 1-question-at-a-time terminal flow to attach any GPU provider",
      tag: "GPU",
      run: () => {
        document.querySelector('.rail-btn[data-view="lineup"]')?.click();
        setTimeout(() => document.querySelector('[data-compute-cli-flow="manage-hosts"]')?.click(), 80);
      },
    },
    {
      title: "Train Eternal Cortex Continuous Learner Step",
      sub: "Consolidate recent faults & successes into the always-training LoRA adapter",
      tag: "LEARNER",
      run: () => {
        $("#eternal-cortex-train-btn")?.click();
      },
    },
    {
      title: "Open Master Black CLI Terminal (/council, /claude, /brain, /colab)",
      sub: "Full-screen direct-typing terminal with /health, /endpoints, /save-dir, and all shells",
      tag: "CLI",
      run: () => document.querySelector('.rail-btn[data-view="councilng-cli"]')?.click(),
    },
    {
      title: "Build Custom Agent Tool (10 Execution Types)",
      sub: "Create Shell, Python, Node, MCP Bridge, SQL, OSINT, or Scraper tools",
      tag: "TOOLS",
      run: () => {
        document.querySelector('.rail-btn[data-view="agents"]')?.click();
        setTimeout(() => document.querySelector('[data-agents-cli-flow="build-tool"]')?.click(), 80);
      },
    },
    {
      title: "System CLI (/health, /endpoints, /save-dir)",
      sub: "Run health checks, Gist URL sync, and output path config in System CLI",
      tag: "SYSTEM",
      run: () => document.querySelector('.rail-btn[data-view="system"]')?.click(),
    },
  ];

  const renderPaletteList = (query = "") => {
    if (!paletteList) return;
    const q = query.trim().toLowerCase();
    const all = getPaletteCommands();
    filteredCommands = q
      ? all.filter((c) => `${c.title} ${c.sub} ${c.tag}`.toLowerCase().includes(q))
      : all;
    activeCmdIdx = 0;
    paletteList.innerHTML = "";
    if (!filteredCommands.length) {
      paletteList.innerHTML = `<div class="muted" style="padding:14px;text-align:center;font-size:12px">No matching commands found. Press Enter to run as a Build Prompt.</div>`;
      return;
    }
    filteredCommands.forEach((cmd, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmd-palette-item" + (idx === activeCmdIdx ? " active" : "");
      btn.innerHTML = `
        <div class="cmd-palette-item-main">
          <span class="cmd-palette-item-title">${esc(cmd.title)}</span>
          <span class="cmd-palette-item-sub">${esc(cmd.sub)}</span>
        </div>
        <span class="cmd-palette-item-tag">${esc(cmd.tag)}</span>
      `;
      btn.addEventListener("mouseenter", () => {
        activeCmdIdx = idx;
        $$("#cmd-palette-list .cmd-palette-item").forEach((el, i) => el.classList.toggle("active", i === activeCmdIdx));
      });
      btn.addEventListener("click", () => {
        closeCommandPalette();
        cmd.run();
      });
      paletteList.appendChild(btn);
    });
  };

  const openCommandPalette = () => {
    if (!paletteModal) return;
    paletteModal.classList.remove("hidden");
    if (paletteInput) {
      paletteInput.value = "";
      renderPaletteList("");
      setTimeout(() => paletteInput.focus(), 20);
    }
  };

  const closeCommandPalette = () => {
    paletteModal?.classList.add("hidden");
  };

  $("#cmd-palette-trigger")?.addEventListener("click", openCommandPalette);
  $("#cmd-palette-close")?.addEventListener("click", closeCommandPalette);
  paletteModal?.addEventListener("click", (e) => {
    if (e.target === paletteModal) closeCommandPalette();
  });

  paletteInput?.addEventListener("input", () => {
    renderPaletteList(paletteInput.value);
  });

  paletteInput?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredCommands.length) {
        activeCmdIdx = (activeCmdIdx + 1) % filteredCommands.length;
        $$("#cmd-palette-list .cmd-palette-item").forEach((el, i) => el.classList.toggle("active", i === activeCmdIdx));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredCommands.length) {
        activeCmdIdx = (activeCmdIdx - 1 + filteredCommands.length) % filteredCommands.length;
        $$("#cmd-palette-list .cmd-palette-item").forEach((el, i) => el.classList.toggle("active", i === activeCmdIdx));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = filteredCommands[activeCmdIdx];
      const rawVal = paletteInput.value.trim();
      closeCommandPalette();
      if (chosen) {
        chosen.run();
      } else if (rawVal) {
        document.querySelector('.rail-btn[data-view="council"]')?.click();
        document.querySelector('#mode [data-mode="build"]')?.click();
        if ($("#prompt")) $("#prompt").value = rawVal;
        $("#ask-btn")?.click();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeCommandPalette();
    }
  });

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (paletteModal?.classList.contains("hidden")) openCommandPalette();
      else closeCommandPalette();
    } else if (e.key === "Escape" && paletteModal && !paletteModal.classList.contains("hidden")) {
      closeCommandPalette();
    }
  });
}

// ════════════════════════════════════════════════════════════════════════════
// OMEGA-STYLE MULTI-AGENT WORKSPACE:
// 1. Prompt stays in place, and automatically morphs into a live interactive
//    terminal in the exact same spot when the prompt completes.
// 2. All generated files from each different Agent / Model are grouped together
//    in a collapsed form that can be expanded, sent to VS Code, downloaded, or
//    completed into a launchable EXE, CLI, GUI, or WebApp.
// ════════════════════════════════════════════════════════════════════════════
let _inplaceTerminalShell = "bash";
let _inplaceCmdHistory = [];
let _inplaceCmdHistoryIdx = -1;
const COMPOSER_SHELL_CYCLE_ORDER = ["prompt", "bash", "python", "go", "pwsh", "cmd"];

function setAndSyncComposerShell(shellType = "prompt") {
  const norm = String(shellType || "prompt").toLowerCase();
  const cyclePill = $("#composer-shell-cycle-pill");
  const ps1 = $("#inplace-term-ps1");

  $$("[data-shell-select]").forEach((b) => {
    b.classList.toggle("on", b.getAttribute("data-shell-select") === norm);
  });

  if (norm === "prompt") {
    if (cyclePill) cyclePill.textContent = "✍️ /prompt ❯";
    setComposerSpotMode("prompt");
    status("✍️ Switched to /prompt mode (press ↑/↓ for recent prompts, or type /bash /python /go /pwsh /cmd)");
    return;
  }

  _inplaceTerminalShell = norm;
  if (cyclePill) cyclePill.textContent = `/${norm} ▾`;

  $$("#inplace-term-shell-seg [data-ipt-shell]").forEach((b) => {
    b.classList.toggle("on", b.getAttribute("data-ipt-shell") === norm);
  });

  if (ps1) {
    ps1.textContent =
      norm === "python"
        ? "🐍 /python >>>"
        : norm === "go"
          ? "🐹 /go ❯"
          : norm === "pwsh"
            ? "⚡ /pwsh PS>"
            : norm === "cmd"
              ? "🪟 /cmd C:\\>"
              : "🐚 /bash ❯";
  }

  setComposerSpotMode("terminal");
  status(`🐚 Switched shell to /${norm} (real Python + real PyPI pip & Go 1.22 active — click badge or type /prompt /bash /python /go /pwsh /cmd)`);
}
window.setAndSyncComposerShell = setAndSyncComposerShell;

function cycleComposerShellMode() {
  const isTerm = !$("#composer-inplace-terminal-stage")?.classList.contains("hidden");
  const current = isTerm ? _inplaceTerminalShell : "prompt";
  const idx = COMPOSER_SHELL_CYCLE_ORDER.indexOf(current);
  const next = COMPOSER_SHELL_CYCLE_ORDER[(idx + 1) % COMPOSER_SHELL_CYCLE_ORDER.length];
  setAndSyncComposerShell(next);
}
window.cycleComposerShellMode = cycleComposerShellMode;

function setComposerSpotMode(spotMode = "prompt") {
  const isTerm = spotMode === "terminal";
  const promptStage = $("#composer-prompt-editor-stage");
  const termStage = $("#composer-inplace-terminal-stage");
  if (promptStage) promptStage.classList.toggle("hidden", isTerm);
  if (termStage) termStage.classList.toggle("hidden", !isTerm);

  $$("#composer-spot-mode-seg [data-spotmode]").forEach((btn) => {
    btn.classList.toggle("on", btn.getAttribute("data-spotmode") === (isTerm ? "terminal" : "prompt"));
  });

  const cyclePill = $("#composer-shell-cycle-pill");
  if (cyclePill) {
    cyclePill.textContent = isTerm ? `/${_inplaceTerminalShell} ▾` : "/prompt ▾";
  }

  if (isTerm) {
    $("#composer-inplace-term-input")?.focus();
  } else {
    $("#prompt")?.focus();
  }
}

function appendInplaceTerminalLog(text, color = "#e2e8f0") {
  const out = $("#composer-inplace-term-out");
  if (out) {
    const line = document.createElement("div");
    line.style.color = color;
    line.style.marginBottom = "4px";
    line.textContent = String(text || "");
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }
  if (typeof window.appendGlobalFooterTerminalLog === "function") {
    window.appendGlobalFooterTerminalLog(text, color, false);
  }
}

function extractAgentFilesFromText(rawText, agentIndex = 0, agentLabel = "agent") {
  const files = {};
  const text = String(rawText || "");
  if (!text.trim()) return files;

  // 1. Explicit === FILE: path === blocks
  const parts = text.split(/^===\s*FILE:\s*(.+?)\s*===\s*$/m);
  for (let i = 1; i < parts.length - 1; i += 2) {
    const fp = parts[i].trim().replace(/^\.\//, "").replace(/\.\./g, "");
    let content = (parts[i + 1] || "").trim();
    content = content.replace(/^```[a-zA-Z0-9_+-]*\s*\r?\n/, "").replace(/\r?\n```\s*$/, "") + "\n";
    if (fp && content.trim()) {
      files[fp] = content;
    }
  }
  if (Object.keys(files).length > 0) return files;

  // 2. Fenced code blocks ```lang
  const fenceRx = /```([\w.+-]*)\s*\n([\s\S]*?)\n```/g;
  const extMap = {
    python: "py", py: "py", javascript: "js", js: "js",
    typescript: "ts", ts: "ts", html: "html", css: "css",
    json: "json", markdown: "md", md: "md", bash: "sh", sh: "sh",
  };
  let match;
  let idx = 1;
  const cleanSlug = String(agentLabel || `agent_${agentIndex + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 18) || `agent_${agentIndex + 1}`;

  while ((match = fenceRx.exec(text)) !== null) {
    const lang = (match[1] || "").trim().toLowerCase().split(" ")[0];
    const content = match[2].trim() + "\n";
    const firstLine = content.split("\n")[0]?.trim() || "";
    const fileComment = firstLine.match(/^(?:#|\/\/|<!--)\s*(?:FILE\s*[:=]\s*)?([\w./-]+\.[\w]+)/i);
    const ext = extMap[lang] || lang || "py";
    const fname = fileComment ? fileComment[1] : `${cleanSlug}_module_${idx}.${ext}`;
    files[fname] = content;
    idx++;
  }

  // 3. Fallback: if the agent returned technical output without code fences, package its report & runnable script
  if (Object.keys(files).length === 0) {
    files[`${cleanSlug}_solution.py`] = [
      `#!/usr/bin/env python3`,
      `"""Generated by ${agentLabel}"""`,
      `SOLUTION_SUMMARY = ${JSON.stringify(text.slice(0, 2000))}`,
      `if __name__ == "__main__":`,
      `    print("=== ${agentLabel} Execution Output ===")`,
      `    print(SOLUTION_SUMMARY)`,
      ``,
    ].join("\n");
  }
  return files;
}

const OMEGA_SPECIALIST_AGENT_ROLES = [
  "Lead Full-Stack & Systems Architect",
  "Security & Vulnerability Auditor",
  "Polyglot Backend & CLI Engineer",
  "Interactive GUI & WebApp Builder",
  "Formal Verification & Optimizer",
  "Autonomous DevOps & Packager",
];

function renderOmegaMultiAgentFilesHub(answersMap = {}, promptText = "") {
  const hub = $("#omega-agent-files-hub");
  const listEl = $("#omega-agent-groups-list");
  const titleEl = $("#omega-hub-summary-title");
  if (!hub || !listEl) return { totalFiles: 0, agentCount: 0, mergedFiles: {} };

  const entries = Object.entries(answersMap || {}).filter(([, txt]) => String(txt || "").trim().length > 0);
  if (!entries.length) {
    hub.classList.add("hidden");
    listEl.innerHTML = "";
    return { totalFiles: 0, agentCount: 0, mergedFiles: {} };
  }

  hub.classList.remove("hidden");

  const mergedFiles = {};
  let totalFilesCount = 0;
  const resolveFileSpecialistTag = (filePath = "", fileContent = "", agIdx = 0) => {
    const fpLow = String(filePath || "").toLowerCase();
    const fcLow = String(fileContent || "").slice(0, 600).toLowerCase();
    if (/proxy|socks4|socks5|proxies_verified\.csv/.test(fpLow + " " + fcLow)) {
      return { id: "network-proxy-scraper-csv-specialist", label: "🌍 #51 Proxy CSV Specialist" };
    }
    if (/playwright|selenium|puppeteer|form_bot|fill_form/.test(fpLow + " " + fcLow)) {
      return { id: "automation-form-workflow-specialist", label: "📋 #49 Form Automation" };
    }
    if (/password|argon2|bcrypt|spf|dkim|login_qa|auth/.test(fpLow + " " + fcLow)) {
      return { id: "auth-email-username-password-specialist", label: "🔐 #50 Email/Auth QA" };
    }
    if (/dockerfile|docker-compose|\.github\/workflows/.test(fpLow)) {
      return { id: "coding-devops-docker-cicd-specialist", label: "🐳 #47 Docker & DevOps" };
    }
    if (/test_|_test\.|run_tests|\.spec\./.test(fpLow)) {
      return { id: "coding-qa-test-automation-specialist", label: "🧪 #46 QA Test Verifier" };
    }
    if (/\.(sh|ps1|bat|cmd)$/.test(fpLow)) {
      return { id: "coding-shell-powershell-bash-specialist", label: "💻 #44 Shell/Launcher" };
    }
    if (/\.(html|css|tsx|jsx)$/.test(fpLow)) {
      return { id: "coding-frontend-ui-specialist", label: "🎨 #40 Frontend UI" };
    }
    if (/\.(sql|prisma)$/.test(fpLow)) {
      return { id: "coding-database-sql-specialist", label: "🗄️ #42 SQL Database" };
    }
    if (/\.(rs|go|c|cpp|h)$/.test(fpLow)) {
      return { id: "coding-systems-rust-cpp-go-specialist", label: "🦀 #43 Systems Native" };
    }
    const autoList = Array.isArray(window._lastAutoBoundSpecialists) ? window._lastAutoBoundSpecialists : [];
    if (autoList[agIdx % Math.max(1, autoList.length)]) {
      const s = autoList[agIdx % autoList.length];
      return { id: s.id, label: s.shortTag || s.name.slice(0, 26) };
    }
    return { id: "coding-python-automation-specialist", label: "🐍 #39 Python Specialist" };
  };

  const agentGroups = entries.map(([modelName, rawText], idx) => {
    const hostLetters = ["a", "b", "c", "d"];
    const boundHostSpec =
      (typeof HOST_TREE_UI_STATE === "object" && HOST_TREE_UI_STATE?.hostConfigs?.[hostLetters[idx % 4]]?.assigned_agent) || "";
    const autoSpec = Array.isArray(window._lastAutoBoundSpecialists)
      ? window._lastAutoBoundSpecialists[idx % Math.max(1, window._lastAutoBoundSpecialists.length)]
      : null;
    const role = boundHostSpec || autoSpec?.name || OMEGA_SPECIALIST_AGENT_ROLES[idx % OMEGA_SPECIALIST_AGENT_ROLES.length];
    const specId = autoSpec?.id || boundHostSpec || "cool-fullstack-gui-exe-forge";
    const agentFiles = extractAgentFilesFromText(rawText, idx, modelName);
    const fileEntries = Object.entries(agentFiles);
    totalFilesCount += fileEntries.length;
    for (const [fp, fc] of fileEntries) {
      if (!mergedFiles[fp] || fc.length > mergedFiles[fp].length) {
        mergedFiles[fp] = fc;
      }
    }
    const totalBytes = fileEntries.reduce((acc, [, fc]) => acc + fc.length, 0);
    return {
      idx,
      modelName,
      role,
      specId,
      rawText,
      files: agentFiles,
      fileEntries,
      totalBytes,
    };
  });

  if (titleEl) {
    titleEl.textContent = `${totalFilesCount} File(s) Grouped Across ${agentGroups.length} Active Agent(s) + Unified Merged Build (${Object.keys(mergedFiles).length} files)`;
  }

  // Render each Agent's group in a collapsed <details> form with [TODO #3] Live Specialist Output Badges
  const mergedEntries = Object.entries(mergedFiles);
  const groupsHtml = [
    ...agentGroups.map((ag) => {
      const kb = (ag.totalBytes / 1024).toFixed(1);
      return `
        <details class="omega-agent-file-group" data-omega-agent-idx="${ag.idx}">
          <summary class="omega-agent-group-summary">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="color:#2ee6a6;font-weight:800">▸</span>
              <span class="omega-specialist-badge" data-agent-lighthouse="${esc(ag.specId)}">🤖 ${esc(ag.role)}</span>
              <strong style="color:#f8fafc">${esc(ag.modelName)}</strong>
              <span style="font-size:10.5px;color:#2ee6a6;background:rgba(46,230,166,0.12);padding:1px 7px;border-radius:999px">${ag.fileEntries.length} file${ag.fileEntries.length === 1 ? "" : "s"} · ${kb} KB</span>
            </div>
            <div style="display:flex;align-items:center;gap:5px" onclick="event.stopPropagation()">
              <button type="button" class="ghost xs" data-omega-agent-vscode="${ag.idx}" title="Send this agent's files to VS Code">💻 VS Code</button>
              <button type="button" class="ghost xs" data-omega-agent-run="${ag.idx}" title="Compile &amp; run this agent's files in the In-Place Terminal">▶ Run Agent</button>
            </div>
          </summary>
          <div class="omega-agent-group-body">
            ${ag.fileEntries
          .map(([fp, fc], fIdx) => {
            const linesCount = fc.split("\n").length;
            const fSpec = resolveFileSpecialistTag(fp, fc, ag.idx);
            return `
                  <details class="omega-file-item-details">
                    <summary class="omega-file-item-summary">
                      <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap">
                        <span>📄 <strong>${esc(fp)}</strong></span>
                        <span class="omega-specialist-badge" data-agent-lighthouse="${esc(fSpec.id)}">${esc(fSpec.label)}</span>
                        <span style="color:#64748b">(${linesCount} lines · ${fc.length} B)</span>
                      </span>
                      <div style="display:flex;gap:5px" onclick="event.stopPropagation()">
                        <button type="button" class="ghost xs" data-omega-copy-file="${ag.idx}:${fIdx}">📋 Copy</button>
                        <button type="button" class="ghost xs" data-omega-run-file="${ag.idx}:${fIdx}">⚡ Run in Terminal</button>
                      </div>
                    </summary>
                    <pre class="omega-file-code-pre">${esc(fc)}</pre>
                  </details>
                `;
          })
          .join("")}
          </div>
        </details>
      `;
    }),
    `
      <details class="omega-agent-file-group" data-omega-merged="true" id="omega-unified-merged-details">
        <summary class="omega-agent-group-summary" style="background:rgba(16,185,129,0.1)">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="color:#2ee6a6;font-weight:800">▸</span>
            <span style="padding:2px 7px;border-radius:5px;background:rgba(46,230,166,0.2);border:1px solid rgba(46,230,166,0.5);color:#2ee6a6;font-size:10.5px;font-weight:800">📦 UNIFIED MERGED PROJECT (ALL AGENTS COMBINED)</span>
            <span id="omega-merged-files-badge" style="font-size:10.5px;color:#a7f3d0">${mergedEntries.length} merged file(s) + Auto-Docker/Launchers/Tests ready</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px" onclick="event.stopPropagation()">
            <button type="button" class="primary xs" data-omega-run-crucible="true" style="background:linear-gradient(135deg,#10b981,#0284c7);border-color:#2ee6a6;color:#fff;font-weight:800" title="Have up to 3 selected models contest each other in a circle, eliminate duplicate files, merge &amp; debug code, compile, and run a full live test">⚔️ 3-Model Contest, Merge &amp; Live Test</button>
          </div>
        </summary>
        <div class="omega-agent-group-body" id="omega-unified-merged-body">
          ${mergedEntries
      .map(([fp, fc], mIdx) => {
        const linesCount = fc.split("\n").length;
        const fSpec = resolveFileSpecialistTag(fp, fc, mIdx);
        return `
                <details class="omega-file-item-details">
                  <summary class="omega-file-item-summary">
                    <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap">
                      <span>📄 <strong>${esc(fp)}</strong></span>
                      <span class="omega-specialist-badge" data-agent-lighthouse="${esc(fSpec.id)}">${esc(fSpec.label)}</span>
                      <span style="color:#64748b">(${linesCount} lines · ${fc.length} B)</span>
                    </span>
                  </summary>
                  <pre class="omega-file-code-pre">${esc(fc)}</pre>
                </details>
              `;
      })
      .join("")}
        </div>
      </details>
    `,
  ].join("");

  listEl.innerHTML = groupsHtml;
  populateOmegaCrucibleModelSelects();

  listEl.querySelectorAll("[data-omega-run-crucible]").forEach((btn) => {
    btn.addEventListener("click", () => {
      runOmegaTriModelCrucible();
    });
  });

  // Bind per-agent VS Code & Run buttons
  listEl.querySelectorAll("[data-omega-agent-vscode]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.getAttribute("data-omega-agent-vscode"));
      const ag = agentGroups[idx];
      if (!ag) return;
      btn.textContent = "Opening…";
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const slug = ag.modelName.toLowerCase().replace(/[^a-z0-9._-]+/g, "_");
      const res = await postJSON("/api/workspace/export", {
        folder: `council_outputs/agent_${idx + 1}_${slug}_${stamp}`,
        fallback_name: `${slug}.py`,
        text: ag.rawText,
        open_vscode: true,
      }).catch(() => ({}));
      btn.textContent = res?.ok ? "✅ Sent" : "💻 VS Code";
      appendInplaceTerminalLog(`💻 Exported Agent #${idx + 1} (${ag.modelName}) files to ${res?.dir || "workspace"} and triggered VS Code.`, "#38bdf8");
    });
  });

  listEl.querySelectorAll("[data-omega-agent-run]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.getAttribute("data-omega-agent-run"));
      const ag = agentGroups[idx];
      if (!ag) return;
      setComposerSpotMode("terminal");
      appendInplaceTerminalLog(`⚡ Compiling & running Agent #${idx + 1} (${ag.modelName}) files…`, "#2ee6a6");
      const res = await postJSON("/api/autorun", {
        title: `agent_${idx + 1}_${ag.modelName}`,
        text: ag.rawText,
        self_heal: true,
        exec_mode: EXEC_MODE,
      }).catch((e) => ({ ok: false, error: String(e) }));
      appendInplaceTerminalLog(res?.terminal_log || res?.error || "(Finished)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    });
  });

  listEl.querySelectorAll("[data-omega-copy-file]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [aIdx, fIdx] = String(btn.getAttribute("data-omega-copy-file") || "0:0").split(":").map(Number);
      const fc = agentGroups[aIdx]?.fileEntries?.[fIdx]?.[1] || "";
      navigator.clipboard?.writeText(fc);
      btn.textContent = "✓ Copied";
      setTimeout(() => { btn.textContent = "📋 Copy"; }, 1400);
    });
  });

  listEl.querySelectorAll("[data-omega-run-file]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const [aIdx, fIdx] = String(btn.getAttribute("data-omega-run-file") || "0:0").split(":").map(Number);
      const entry = agentGroups[aIdx]?.fileEntries?.[fIdx];
      if (!entry) return;
      const [fp, fc] = entry;
      setComposerSpotMode("terminal");
      if (fp.endsWith(".py")) {
        appendInplaceTerminalLog(`🐍 Running ${fp} in Stateful Python 3 Kernel…`, "#2ee6a6");
        const res = await postJSON("/api/python/exec", { code: fc }).catch((e) => ({ ok: false, stderr: String(e) }));
        appendInplaceTerminalLog(res?.formatted_output || res?.stderr || "(Done)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
      } else {
        appendInplaceTerminalLog(`⚡ Executing ${fp} via Autorun…`, "#38bdf8");
        const res = await postJSON("/api/autorun", {
          title: fp.replace(/[^a-z0-9]/gi, "_"),
          text: `=== FILE: ${fp} ===\n\`\`\`\n${fc}\n\`\`\``,
          self_heal: true,
          exec_mode: EXEC_MODE,
        }).catch((e) => ({ ok: false, error: String(e) }));
        appendInplaceTerminalLog(res?.terminal_log || res?.error || "(Done)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
      }
    });
  });

  return { totalFiles: totalFilesCount, agentCount: agentGroups.length, mergedFiles };
}

function populateOmegaCrucibleModelSelects() {
  const sel1 = $("#crucible-model-1");
  const sel2 = $("#crucible-model-2");
  const sel3 = $("#crucible-model-3");
  if (!sel1 || !sel2 || !sel3) return;

  const activeList = Array.isArray(STATE?.backends) ? STATE.backends : [];
  const catalogRaw = STATE?.catalog && typeof STATE.catalog === "object" ? Object.values(STATE.catalog).flat() : [];
  const catalogList = Array.isArray(catalogRaw) ? catalogRaw.filter(Boolean) : [];

  const choices = [];
  const seenIds = new Set();

  activeList.forEach((m, idx) => {
    const id = m.model || m.id || m.name || `active_${idx}`;
    const label = `[Host ${(m.host || "A").toUpperCase()}] ${m.name || id}`;
    if (!seenIds.has(id)) {
      seenIds.add(id);
      choices.push({ id, name: m.name || id, host: m.host || "a", label });
    }
  });

  catalogList.slice(0, 18).forEach((c) => {
    const id = c.id || c.model || c.name;
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      choices.push({ id, name: c.name || id, host: "a", label: `[Catalog] ${c.name || id}` });
    }
  });

  if (!choices.length) {
    choices.push(
      { id: "Qwen/Qwen2.5-Coder-32B-Instruct", name: "Qwen2.5-Coder-32B-Instruct", host: "a", label: "[Host A] Qwen2.5-Coder-32B-Instruct" },
      { id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B", name: "DeepSeek-R1-Distill-Qwen-32B", host: "b", label: "[Host B] DeepSeek-R1-Distill-Qwen-32B" },
      { id: "WhiteRabbitNeo/WhiteRabbitNeo-33B-v1.5", name: "WhiteRabbitNeo-33B-v1.5", host: "c", label: "[Host C] WhiteRabbitNeo-33B-v1.5" }
    );
  }

  const prev1 = sel1.value;
  const prev2 = sel2.value;
  const prev3 = sel3.value;

  const buildOptions = (allowNone, defaultIdx) => {
    const opts = [];
    if (allowNone) {
      opts.push(`<option value="__NONE__">-- None (Skip Model Slot) --</option>`);
    }
    choices.forEach((c, idx) => {
      const selAttr = idx === defaultIdx ? " selected" : "";
      opts.push(`<option value="${esc(c.id)}" data-model-name="${esc(c.name)}" data-model-host="${esc(c.host)}"${selAttr}>${esc(c.label)}</option>`);
    });
    return opts.join("");
  };

  sel1.innerHTML = buildOptions(false, 0);
  sel2.innerHTML = buildOptions(true, Math.min(1, choices.length - 1));
  sel3.innerHTML = buildOptions(true, Math.min(2, choices.length - 1));

  if (prev1 && Array.from(sel1.options).some((o) => o.value === prev1)) sel1.value = prev1;
  if (prev2 && Array.from(sel2.options).some((o) => o.value === prev2)) sel2.value = prev2;
  if (prev3 && Array.from(sel3.options).some((o) => o.value === prev3)) sel3.value = prev3;
}

async function runOmegaTriModelCrucible() {
  populateOmegaCrucibleModelSelects();
  const sel1 = $("#crucible-model-1");
  const sel2 = $("#crucible-model-2");
  const sel3 = $("#crucible-model-3");
  const rounds = Number($("#crucible-rounds-select")?.value || 2);
  const format = $("#crucible-pkg-format")?.value || "exe";
  const runBtn = $("#omega-run-tri-crucible-btn");
  const pkgStatus = $("#omega-hub-pkg-status");
  const drawer = $("#omega-crucible-results-drawer");
  const headline = $("#omega-crucible-status-headline");
  const bodyEl = $("#omega-crucible-results-body");

  const roles = [
    "Lead Merger & De-Duplicator",
    "Adversarial Challenger & Feature Integrator",
    "Final Debugger, Compiler & Live-Test Auditor",
  ];

  const chosenModels = [sel1, sel2, sel3]
    .map((sel, idx) => {
      if (!sel || !sel.value || sel.value === "__NONE__") return null;
      const opt = sel.options[sel.selectedIndex];
      return {
        slot: idx + 1,
        model: sel.value,
        name: opt?.getAttribute("data-model-name") || opt?.textContent || sel.value,
        host: opt?.getAttribute("data-model-host") || "a",
        role: roles[idx],
      };
    })
    .filter(Boolean);

  if (!chosenModels.length) {
    appendInplaceTerminalLog("⚠️ Please select at least 1 model in the 3-Model Crucible.", "#fbbf24");
    return;
  }

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.textContent = `⏳ Contesting (${chosenModels.length} Model${chosenModels.length > 1 ? "s" : ""} · ${rounds} Circle${rounds > 1 ? "s" : ""})…`;
  }
  if (pkgStatus) {
    pkgStatus.textContent = `⚔️ ${chosenModels.map((m) => m.name).join(" ➔ ")} contesting & patching in ${rounds} circle(s)…`;
  }

  setComposerSpotMode("terminal");
  appendInplaceTerminalLog(
    `⚔️ [3-Model Circular Merge Crucible] Starting ${rounds} Circle(s) across ${chosenModels.map((m) => `${m.name} (${m.role})`).join(" ➔ ")}…`,
    "#fbbf24"
  );

  // Animate the 3 slot cards in a circle while the contest executes
  let animIdx = 0;
  const slotCards = [$("#crucible-slot-card-1"), $("#crucible-slot-card-2"), $("#crucible-slot-card-3")];
  const animTimer = setInterval(() => {
    slotCards.forEach((c, i) => c?.classList.toggle("contesting-active", i === animIdx % 3));
    animIdx++;
  }, 550);

  try {
    const res = await postJSON("/api/omega/tri-model-crucible", {
      models: chosenModels,
      rounds,
      format,
      prompt: window._lastPrompt || $("#prompt")?.value || "Build and verify unified multi-agent application",
      text: window._lastVerdict || "",
      all_answers: window._lastAnswers || {},
      exec_mode: EXEC_MODE,
    });

    clearInterval(animTimer);
    slotCards.forEach((c) => c?.classList.remove("contesting-active"));

    if (!res?.ok) {
      if (pkgStatus) pkgStatus.textContent = `❌ Crucible Error: ${res?.error || "failed"}`;
      appendInplaceTerminalLog(`❌ 3-Model Crucible Error: ${res?.error || "unknown error"}`, "#ff6b8b");
      return;
    }

    // Stream full circular contest, compile, and live-test banner to In-Place Terminal
    appendInplaceTerminalLog(res.terminal_log || "✅ 3-Model Circular Contest & Live Test Complete", "#2ee6a6");

    // Update the Unified Merged Project collapsible section with the final contested, de-duplicated, debugged files
    if (res.merged_files && typeof res.merged_files === "object") {
      const mergedEntries = Object.entries(res.merged_files);
      const mergedBadge = $("#omega-merged-files-badge");
      if (mergedBadge) {
        mergedBadge.textContent = `${mergedEntries.length} Contested, De-Duplicated & Live-Tested file(s) (${res.circle_transcript?.length || 0} Passes · Exit Code 0)`;
      }
      const mergedBody = $("#omega-unified-merged-body");
      if (mergedBody) {
        mergedBody.innerHTML = mergedEntries
          .map(([fp, fc]) => {
            const linesCount = String(fc).split("\n").length;
            return `
              <details class="omega-file-item-details">
                <summary class="omega-file-item-summary">
                  <span>✅ <strong>${esc(fp)}</strong> <span style="color:#2ee6a6">(${linesCount} lines · ${String(fc).length} B · Contested &amp; Verified)</span></span>
                </summary>
                <pre class="omega-file-code-pre">${esc(fc)}</pre>
              </details>
            `;
          })
          .join("");
      }
      const mergedDetails = $("#omega-unified-merged-details");
      if (mergedDetails) mergedDetails.open = true;
    }

    // Populate and open the Contest & Patch Transcript + Live Test Verification Report drawer
    if (drawer && bodyEl) {
      drawer.classList.remove("hidden");
      drawer.open = true;
      if (headline) {
        headline.textContent = `✅ ${res.models?.length || chosenModels.length}-Model Circular Contest (${res.circle_transcript?.length || 0} Passes) · Merged ${Object.keys(res.merged_files || {}).length} File(s) · Live Test PASSED`;
      }

      const transcriptHtml = (res.circle_transcript || [])
        .map(
          (t) => `
          <div style="background:#071124;border:1px solid rgba(56,189,248,0.28);border-radius:7px;padding:8px 10px;font-size:11px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
              <span>
                <strong style="color:#2ee6a6">[Circle ${t.circle} · Pass #${t.step}]</strong>
                <strong style="color:#f8fafc"> ${esc(t.model_name)}</strong>
                <span style="color:#94a3b8">(${esc(t.role)})</span>
                <span style="color:#fbbf24"> ⚔️ Contested ${esc(t.contested_target)}</span>
              </span>
              <span style="color:#38bdf8;font-family:monospace;font-size:10px">Files: ${esc((t.files_updated || []).join(", "))}</span>
            </div>
            <div style="color:#fde68a;margin-bottom:3px">❓ <strong>Questioned:</strong> ${esc((t.questioned_issues || []).join(" · "))}</div>
            <div style="color:#a7f3d0">🔧 <strong>Patched &amp; Merged:</strong> ${esc((t.patches_applied || []).join(" · "))}</div>
          </div>
        `
        )
        .join("");

      const checksHtml = (res.live_test_report?.checks || [])
        .map(
          (c) => `
          <div style="display:flex;align-items:center;gap:8px;font-size:11px;padding:4px 8px;background:rgba(16,185,129,0.08);border-radius:5px">
            <span style="color:${c.passed ? "#2ee6a6" : "#fbbf24"};font-weight:800">${c.passed ? "✓ PASS" : "⚠ WARN"}</span>
            <strong style="color:#f8fafc">${esc(c.name)}:</strong>
            <span style="color:#cbd5e1">${esc(c.detail)}</span>
          </div>
        `
        )
        .join("");

      bodyEl.innerHTML = `
        <div style="font-size:11px;font-weight:800;color:#7dd3fc;text-transform:uppercase;letter-spacing:0.05em">🔄 Circular Contest &amp; Cross-Patch Rounds</div>
        <div style="display:grid;gap:6px">${transcriptHtml}</div>
        <div style="font-size:11px;font-weight:800;color:#2ee6a6;text-transform:uppercase;letter-spacing:0.05em;margin-top:6px">✅ Full Live Verification Test Report (Command: <code>${esc(res.live_test_report?.command || "")}</code>)</div>
        <div style="display:grid;gap:4px">${checksHtml}</div>
        <pre class="omega-file-code-pre" style="max-height:150px;margin-top:4px;border:1px solid rgba(46,230,166,0.3);border-radius:6px">${esc(res.live_test_report?.stdout || "(Exit Code 0)")}</pre>
      `;
    }

    if (pkgStatus) {
      pkgStatus.textContent = `✓ Contested, Merged & Live-Tested: ${res.download_name}`;
    }

    // Download the final merged & live-tested package artifact
    if (res.download_b64 && res.download_name) {
      const binStr = atob(res.download_b64);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.download_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    if ((format === "gui" || format === "webapp") && res.html_preview && typeof openHtmlPreview === "function") {
      openHtmlPreview(`3-Model Verified ${format.toUpperCase()}: ${res.slug}`, "```html\n" + res.html_preview + "\n```");
    }
  } catch (err) {
    clearInterval(animTimer);
    slotCards.forEach((c) => c?.classList.remove("contesting-active"));
    if (pkgStatus) pkgStatus.textContent = `❌ Error: ${err.message || err}`;
    appendInplaceTerminalLog(`❌ 3-Model Crucible Exception: ${err.message || err}`, "#ff6b8b");
  } finally {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.textContent = "🔄 Run 3-Model Contest, Merge & Live Test";
    }
  }
}

async function onOmegaMultiAgentPromptCompleted(answersMap = {}, promptText = "") {
  const { totalFiles, agentCount, mergedFiles } = renderOmegaMultiAgentFilesHub(answersMap, promptText);
  // Automatically archive every prompt turn + separated per-model responses/files into the Dedicated File Explorer!
  window.recordPromptRunToFileExplorer?.(
    answersMap,
    promptText,
    typeof MODE !== "undefined" ? MODE : "build"
  );

  const out = $("#composer-inplace-term-out");
  if (out && out.children.length > 0) {
    const sep = document.createElement("div");
    sep.style.cssText = "border-top:1px dashed rgba(148,163,184,0.22);margin:8px 0 6px";
    out.appendChild(sep);
  }
  appendInplaceTerminalLog(
    `╔══ ⚡ OMEGA MULTI-AGENT EXECUTION COMPLETE ══════════════════════════════════╗\n` +
    `║  Objective : ${String(promptText || "Multi-Agent Task").slice(0, 62).padEnd(62)}║\n` +
    `║  Agents    : ${String(`${agentCount} Active Agent(s) · ${totalFiles} Generated File(s)`).padEnd(62)}║\n` +
    `║  Explorer  : ${String(`${Object.keys(mergedFiles).length} files archived to 🗂️ File Explorer (separated per model)`).padEnd(62)}║\n` +
    `╚═════════════════════════════════════════════════════════════════════════════╝`,
    "#2ee6a6"
  );
  appendInplaceTerminalLog(
    `💡 Open '🗂️ File Explorer' in the top bar or left rail to inspect each model's response & files separately, compile real Windows x64 .EXE binaries, or dispatch checked items to a Specialist/Swarm!`,
    "#7dd3fc"
  );

  const stPill = $("#inplace-term-status-pill");
  if (stPill) {
    stPill.textContent = `Completed · ${agentCount} Model(s) · ${totalFiles} File(s) → 🗂️ File Explorer`;
  }

  // IMPORTANT FIX: Never hijack/close the user's prompt input unless the user explicitly checked Auto-Switch!
  const autoMorph = $("#composer-automorph-terminal");
  if (autoMorph && autoMorph.checked) {
    setComposerSpotMode("terminal");
  }
}

async function packageOmegaMergedBuild(format = "exe") {
  const pkgStatus = $("#omega-hub-pkg-status");
  if (pkgStatus) pkgStatus.textContent = `⏳ Building launchable ${format.toUpperCase()}…`;
  setComposerSpotMode("terminal");
  appendInplaceTerminalLog(`🚀 Packaging all multi-agent files into a launchable [${format.toUpperCase()}] build…`, "#fbbf24");

  try {
    const res = await postJSON("/api/forge/package", {
      format,
      title: (window._lastPrompt || "omega_council_app").slice(0, 28),
      text: window._lastVerdict || "",
      all_answers: window._lastAnswers || {},
      exec_mode: EXEC_MODE,
    });

    if (!res?.ok) {
      if (pkgStatus) pkgStatus.textContent = `❌ ${res?.error || "Build failed"}`;
      appendInplaceTerminalLog(`❌ Package error: ${res?.error || "unknown error"}`, "#ff6b8b");
      return;
    }

    appendInplaceTerminalLog(res.terminal_log || `✅ Built ${res.download_name} (${res.artifact_path})`, "#2ee6a6");
    if (pkgStatus) pkgStatus.textContent = `✓ Built ${res.download_name}`;

    // Trigger browser download of the launchable artifact
    if (res.download_b64 && res.download_name) {
      const binStr = atob(res.download_b64);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.download_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    if ((format === "gui" || format === "webapp") && res.html_preview && typeof openHtmlPreview === "function") {
      openHtmlPreview(`Launchable ${format.toUpperCase()}: ${res.slug}`, "```html\n" + res.html_preview + "\n```");
    }
  } catch (e) {
    if (pkgStatus) pkgStatus.textContent = `❌ Error: ${e.message || e}`;
    appendInplaceTerminalLog(`❌ Packaging exception: ${e.message || e}`, "#ff6b8b");
  }
}

function initOmegaMultiAgentWorkspace() {
  populateOmegaCrucibleModelSelects();

  $("#omega-run-tri-crucible-btn")?.addEventListener("click", () => {
    runOmegaTriModelCrucible();
  });

  $$("#composer-spot-mode-seg [data-spotmode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setComposerSpotMode(btn.getAttribute("data-spotmode") || "prompt");
    });
  });

  $("#inplace-term-back-to-prompt-btn")?.addEventListener("click", () => {
    setComposerSpotMode("prompt");
  });

  $("#inplace-term-clear-btn")?.addEventListener("click", () => {
    const out = $("#composer-inplace-term-out");
    if (out) out.innerHTML = "";
  });

  $("#inplace-term-compile-btn")?.addEventListener("click", () => {
    $("#autorun-all-files")?.click();
  });

  $$("#inplace-term-shell-seg [data-ipt-shell]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sh = btn.getAttribute("data-ipt-shell") || "bash";
      setAndSyncComposerShell(sh);
    });
  });

  $$("[data-shell-select]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sh = btn.getAttribute("data-shell-select") || "prompt";
      setAndSyncComposerShell(sh);
    });
  });

  $("#composer-shell-cycle-pill")?.addEventListener("click", (e) => {
    e.preventDefault();
    cycleComposerShellMode();
  });

  $("#inplace-term-ps1")?.addEventListener("click", (e) => {
    e.preventDefault();
    cycleComposerShellMode();
  });

  // + attach button in terminal mode triggers the same attachment menu / file picker as #add-btn
  $("#inplace-plus-attach-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menu = $("#add-menu");
    if (menu) {
      menu.classList.toggle("hidden");
    } else {
      $("#file-input")?.click();
    }
  });

  // Adjustable height controls for the top prompt / terminal area (.composer-h-preset S/M/L/XL + #composer-drag-resize-handle)
  const applyComposerStageHeight = (px) => {
    const clamped = Math.max(68, Math.min(580, Number(px) || 96));
    window._userComposerHeightPx = clamped;
    const pStage = $("#composer-prompt-editor-stage");
    const pEl = $("#prompt");
    const tOut = $("#composer-inplace-term-out");
    if (pStage) {
      pStage.style.minHeight = `${clamped + 16}px`;
    }
    if (pEl) {
      pEl.style.minHeight = `${clamped}px`;
      pEl.style.height = `${clamped}px`;
      pEl.style.maxHeight = `${Math.max(580, clamped + 40)}px`;
    }
    if (tOut) {
      const termH = Math.max(100, clamped + 24);
      tOut.style.minHeight = `${termH}px`;
      tOut.style.maxHeight = `${termH + 80}px`;
      tOut.style.height = `${termH}px`;
    }
    $$(".composer-h-preset").forEach((b) => {
      const btnH = Number(b.getAttribute("data-ch-px") || b.getAttribute("data-composer-h") || 0);
      b.classList.toggle("on", btnH === clamped);
    });
    try {
      localStorage.setItem("council-composer-stage-h-px", String(clamped));
    } catch (_) { }
  };

  $$(".composer-h-preset").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const h = Number(btn.getAttribute("data-ch-px") || btn.getAttribute("data-composer-h") || 96);
      applyComposerStageHeight(h);
      status(`↕ Prompt / Terminal height set to ${h}px`);
    });
  });

  try {
    const savedH = Number(localStorage.getItem("council-composer-stage-h-px"));
    if (savedH >= 68 && savedH <= 580) {
      applyComposerStageHeight(savedH);
    }
  } catch (_) { }

  const dragHandle = $("#composer-drag-resize-handle");
  if (dragHandle && !dragHandle._boundDragResize) {
    dragHandle._boundDragResize = true;
    dragHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const isTerm = !$("#composer-inplace-terminal-stage")?.classList.contains("hidden");
      const targetEl = isTerm ? $("#composer-inplace-term-out") : $("#prompt");
      const startY = e.clientY;
      const startH = targetEl?.offsetHeight || Number(window._userComposerHeightPx) || 68;
      document.body.style.userSelect = "none";

      const onMove = (ev) => {
        const delta = ev.clientY - startY;
        applyComposerStageHeight(startH + delta);
      };
      const onUp = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  const runInplaceCmd = async () => {
    const inp = $("#composer-inplace-term-input");
    const cmd = (inp?.value || "").trim();
    if (!cmd) return;
    inp.value = "";
    _inplaceCmdHistoryIdx = -1;

    if (!_inplaceCmdHistory.length || _inplaceCmdHistory[0] !== cmd) {
      _inplaceCmdHistory.unshift(cmd);
    }

    // Support /prompt, /cmd, /pwsh, /python, /go, /bash shell switching directly in terminal input
    const shellSwitch = cmd.match(/^\/(prompt|cmd|pwsh|powershell|python|py|go|golang|bash|sh)(?:\s+(.*))?$/i);
    if (shellSwitch) {
      const rawSh = shellSwitch[1].toLowerCase();
      const rest = (shellSwitch[2] || "").trim();
      const mapped =
        rawSh === "prompt"
          ? "prompt"
          : rawSh === "pwsh" || rawSh === "powershell"
            ? "pwsh"
            : rawSh === "python" || rawSh === "py"
              ? "python"
              : rawSh === "go" || rawSh === "golang"
                ? "go"
                : rawSh === "cmd"
                  ? "cmd"
                  : "bash";

      setAndSyncComposerShell(mapped);
      if (mapped === "prompt" && rest) {
        if ($("#prompt")) $("#prompt").value = rest;
        $("#ask-btn")?.click();
      } else if (mapped !== "prompt" && rest) {
        inp.value = rest;
        await runInplaceCmd();
      }
      return;
    }

    appendInplaceTerminalLog(
      `${_inplaceTerminalShell === "python" ? ">>>" : "$"} ${cmd}`,
      "#38bdf8"
    );
    const res = await postJSON("/api/cli/shell-exec", {
      command: cmd,
      shell: _inplaceTerminalShell,
      exec_mode: EXEC_MODE,
    }).catch((e) => ({ ok: false, error: String(e) }));
    appendInplaceTerminalLog(
      res?.output || res?.error || "(Executed)",
      res?.ok !== false ? "#e2e8f0" : "#ff6b8b"
    );
  };

  $("#composer-inplace-term-send")?.addEventListener("click", runInplaceCmd);
  $("#composer-inplace-term-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runInplaceCmd();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const combinedHist = _inplaceCmdHistory.length
        ? _inplaceCmdHistory
        : (Array.isArray(promptHistory) ? promptHistory.map((p) => p?.prompt || p) : []);
      if (!combinedHist.length) return;
      e.preventDefault();
      if (e.key === "ArrowUp") {
        _inplaceCmdHistoryIdx = Math.min(_inplaceCmdHistoryIdx + 1, combinedHist.length - 1);
      } else {
        _inplaceCmdHistoryIdx = Math.max(_inplaceCmdHistoryIdx - 1, -1);
      }
      const inp = $("#composer-inplace-term-input");
      if (inp) {
        inp.value = _inplaceCmdHistoryIdx < 0 ? "" : String(combinedHist[_inplaceCmdHistoryIdx] || "");
      }
    } else if (e.key === "Escape") {
      setAndSyncComposerShell("prompt");
    }
  });

  // Hub top-level buttons
  $("#omega-hub-expand-all-btn")?.addEventListener("click", () => {
    $$("#omega-agent-groups-list details.omega-agent-file-group").forEach((d) => {
      d.open = true;
    });
  });

  $("#omega-hub-collapse-all-btn")?.addEventListener("click", () => {
    $$("#omega-agent-groups-list details.omega-agent-file-group").forEach((d) => {
      d.open = false;
    });
  });

  $("#omega-hub-vscode-all-btn")?.addEventListener("click", () => {
    saveAllResponses(true);
  });

  $("#omega-hub-autorun-all-btn")?.addEventListener("click", () => {
    $("#autorun-all-files")?.click();
  });

  $("#omega-hub-download-all-btn")?.addEventListener("click", async () => {
    await packageOmegaMergedBuild("script");
  });

  $$(".omega-launch-pkg-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const fmt = btn.getAttribute("data-omega-pkg") || "exe";
      await packageOmegaMergedBuild(fmt);
    });
  });
}

// ============================================================================
// 1. VERTICAL INPUT PROMPT ENHANCEMENT STACK (Zero-Restrictions / Modular / Master / Concise)
// 2. AUTONOMOUS TASK-COMPLETING SWARM MISSION RUNNER (/api/swarm/execute-mission)
// 3. CLEAN TABBED /HOST CONFIGURATOR (Host A / B / C / D + Saved Hosts Board)
// 4. GLOBAL STICKY BOTTOM FOOTER LIVE TERMINAL CLI (Minimize / Expand / Hide / Restore)
// 5. UNIVERSAL CLOSABLE PANELS & CARDS GUARD
// ============================================================================

function initPromptEnhancementStackControls() {
  const sel = $("#enhance-depth-select");
  $$(".enhance-mode-pick-btn").forEach((btn) => {
    if (btn._boundEnhPick) return;
    btn._boundEnhPick = true;
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modeVal = btn.getAttribute("data-enhance-mode") || "smart_reframe";
      if (sel) sel.value = modeVal;
      $$(".enhance-mode-pick-btn").forEach((b) => b.classList.toggle("on", b === btn));
      const enhBtn = $("#enhance-btn");
      if (enhBtn) {
        enhBtn.title = `Active Enhancement: ${btn.textContent.trim()} (Click ✨ to enhance prompt)`;
      }
      if (($("#prompt")?.value || "").trim()) {
        await runSmartPromptEnhancer(e);
      } else {
        status(`✨ Enhancement mode set to "${btn.textContent.trim()}" — type a prompt and click ✨ to enhance.`);
        $("#prompt")?.focus();
      }
    });
  });
}

async function runAutonomousSwarmMission(profile = "full_autonomous") {
  const pEl = $("#prompt");
  let rawGoal = (pEl?.value || "").trim();
  if (!rawGoal) {
    rawGoal =
      profile === "redhat_offsec"
        ? "Build a multi-threaded Python TCP/HTTP surface reconnaissance & security header auditor CLI with JSON reporting and live self-tests"
        : "Build a complete self-testing Python CLI utility with modular architecture, argument parser, and automated verification suite";
    if (pEl) pEl.value = rawGoal;
  }

  const modeLbl = $("#composer-swarm-mode-lbl");
  if (modeLbl) {
    modeLbl.textContent =
      profile === "redhat_offsec" ? "RedHat OffSec" : profile === "tdd_verified" ? "AST + TDD" : "Auto-Complete";
  }

  $("#ask-btn").disabled = true;
  $("#stop-btn")?.classList.remove("hidden");
  status(`🐝 Swarm Mission streaming (${profile}) — Queen Decomposer → Parallel Specialists → Merge Surgeon → AST + Self-Heal Sentinel…`);
  if (typeof window.appendGlobalFooterTerminalLog === "function") {
    window.appendGlobalFooterTerminalLog(`🐝 [SWARM STREAM] Launching 5-agent pipeline for: "${rawGoal.slice(0, 90)}"`, "#fbbf24", true);
  }

  const body = mkCard(
    `🐝 Autonomous Swarm Mission (${profile === "redhat_offsec" ? "RedHat OffSec & PoC" : profile === "tdd_verified" ? "Strict AST + TDD Self-Heal" : "Full Task Completion"})`,
    "Live NDJSON Stream · Up to 3x Self-Heal · OPSEC Scrubber · Exit-0 Verified"
  );

  const liveStageState = {
    1: { agent: "👑 Swarm Queen DAG Decomposer", model: "Pending", status: "QUEUED" },
    2: { agent: "⚡ Polyglot Core Builder", model: "Pending", status: "QUEUED" },
    3: { agent: "☠️ RedHat OffSec & Test Verifier", model: "Pending", status: "QUEUED" },
    4: { agent: "🔬 Cross-Agent De-Dup & Merge Surgeon", model: "Pending", status: "QUEUED" },
    5: { agent: "🛡️ AST & Self-Heal Sentinel", model: "Local OS Python/Node/Bash", status: "QUEUED" },
  };
  const liveFeedLines = [];

  const renderStreamingStagesCard = () => {
    const rows = Object.entries(liveStageState)
      .map(([stepNum, st]) => {
        const isRunning = st.status === "RUNNING";
        const isDone = st.status === "DONE" || st.status === "VERIFIED" || String(st.status).startsWith("HEALED");
        const col = isDone ? "#2ee6a6" : isRunning ? "#fbbf24" : "#64748b";
        return (
          `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 9px;border-radius:6px;background:rgba(15,23,42,0.86);border:1px solid ${isDone ? "rgba(46,230,166,0.32)" : isRunning ? "rgba(251,191,36,0.45)" : "rgba(148,163,184,0.16)"
          };font-size:11.5px">` +
          `<span><strong>Step ${stepNum}:</strong> ${esc(st.agent)} <span class="muted">(${esc(st.model)})</span></span>` +
          `<span class="tabular-nums" style="color:${col};font-weight:800">${isDone ? "✓ " : isRunning ? "⏳ " : ""}${esc(st.status)}</span>` +
          `</div>`
        );
      })
      .join("");
    const logPreview = liveFeedLines.slice(-6).map((l) => esc(l)).join("\n");
    body.innerHTML =
      `<div style="display:grid;gap:5px;margin-bottom:8px">${rows}</div>` +
      `<pre style="margin:0;padding:8px 10px;border-radius:6px;background:#02060f;border:1px solid rgba(56,189,248,0.25);font-family:'JetBrains Mono',monospace;font-size:11px;color:#7dd3fc;white-space:pre-wrap">${logPreview || "Connecting to live Swarm NDJSON stream…"}</pre>`;
  };
  renderStreamingStagesCard();

  try {
    const resp = await fetch("/api/swarm/execute-mission-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: rawGoal,
        profile,
        exec_mode: typeof EXEC_MODE !== "undefined" ? EXEC_MODE : "real",
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalRes = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const rawLine of lines) {
        const trimmed = rawLine.trim();
        if (!trimmed) continue;
        let ev = null;
        try {
          ev = JSON.parse(trimmed);
        } catch {
          continue;
        }
        if (ev.type === "stage_start" && ev.step && liveStageState[ev.step]) {
          liveStageState[ev.step].model = ev.model || liveStageState[ev.step].model;
          liveStageState[ev.step].status = "RUNNING";
          const msg = `[+${ev.elapsed_ms}ms] ▶ Step ${ev.step} (${ev.agent}): ${ev.message || "Running…"}`;
          liveFeedLines.push(msg);
          if (typeof window.appendGlobalFooterTerminalLog === "function") {
            window.appendGlobalFooterTerminalLog(msg, "#38bdf8", false);
          }
          status(`🐝 Swarm Step ${ev.step}/5: ${ev.agent}…`);
          renderStreamingStagesCard();
        } else if (ev.type === "stage_done" && ev.step && liveStageState[ev.step]) {
          liveStageState[ev.step].model = ev.model || liveStageState[ev.step].model;
          liveStageState[ev.step].status = ev.status || "DONE";
          const msg = `[+${ev.elapsed_ms}ms] ✓ Step ${ev.step} (${ev.agent}) → ${ev.status || "DONE"}`;
          liveFeedLines.push(msg);
          if (typeof window.appendGlobalFooterTerminalLog === "function") {
            window.appendGlobalFooterTerminalLog(msg, "#2ee6a6", false);
          }
          renderStreamingStagesCard();
        } else if (ev.type === "self_heal") {
          liveStageState[5].status = `HEALING (${ev.round}/${ev.max_rounds})`;
          liveFeedLines.push(ev.message || `Self-Heal Pass #${ev.round}`);
          if (typeof window.appendGlobalFooterTerminalLog === "function") {
            window.appendGlobalFooterTerminalLog(ev.message || `🔧 Self-Heal Pass #${ev.round}`, "#fbbf24", false);
          }
          renderStreamingStagesCard();
        } else if (ev.type === "stdout" && ev.output) {
          if (typeof window.appendGlobalFooterTerminalLog === "function") {
            window.appendGlobalFooterTerminalLog(`[LIVE TEST STDOUT]\n${String(ev.output).slice(0, 600)}`, "#a7f3d0", false);
          }
        } else if (ev.type === "complete" && ev.result) {
          finalRes = ev.result;
        } else if (ev.type === "error") {
          throw new Error(ev.error || "Swarm stream error");
        }
      }
    }

    if (!finalRes?.ok) {
      setCardBodyMarkdown(body, `❌ **Swarm Mission Failed:** ${finalRes?.error || "Stream ended without final payload"}`, false);
      status(`❌ Swarm Mission failed`);
      return;
    }

    const stepsHtml = (finalRes.dag_steps || [])
      .map(
        (s) =>
          `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 9px;border-radius:6px;background:rgba(15,23,42,0.86);border:1px solid rgba(46,230,166,0.28);font-size:11.5px">` +
          `<span><strong>Step ${s.step}:</strong> ${esc(s.agent)} <span class="muted">(${esc(s.model)})</span></span>` +
          `<span class="tabular-nums" style="color:#2ee6a6;font-weight:800">✓ ${esc(s.status)}</span>` +
          `</div>`
      )
      .join("");

    const fileNames = Object.keys(finalRes.merged_files || {});
    const summaryMd =
      `### ✅ Swarm Task Completed in ${finalRes.elapsed_ms}ms · ${fileNames.length} Verified File(s) · Exit Code \`${finalRes.exit_code}\`\n` +
      `- **Workspace Output:** \`${finalRes.workspace_dir}\`\n` +
      `- **Synthesized & De-Duplicated Files:** ${fileNames.map((f) => `\`${f}\``).join(", ")}\n` +
      `- **Self-Heal Repair Passes:** \`${finalRes.self_heal_rounds || 0}/3\` · **OPSEC Secret Scrubber:** \`${finalRes.opsec_redactions ? `${finalRes.opsec_redactions} redacted` : "Clean (0 leaks)"
      }\`\n` +
      `- **AST & Syntax Checks:** ${(finalRes.ast_checks || []).join(" · ") || "Passed"}\n\n` +
      `#### Live Execution Output\n\`\`\`text\n${finalRes.live_test_output || "(Executed cleanly with 0 errors)"}\n\`\`\`\n\n` +
      Object.entries(finalRes.merged_files || {})
        .map(([fp, content]) => `=== FILE: ${fp} ===\n\`\`\`\n${content}\n\`\`\``)
        .join("\n\n");

    body._rawText = summaryMd;
    body.innerHTML =
      `<div style="display:grid;gap:5px;margin-bottom:10px">${stepsHtml}</div>` +
      `<div class="md-rendered">${renderMarkdown(summaryMd)}</div>`;

    if (finalRes.workspace_dir) {
      const parentCard = body.closest(".card");
      if (parentCard) parentCard.dataset.appDir = finalRes.workspace_dir;
    }

    if (typeof window.appendGlobalFooterTerminalLog === "function") {
      window.appendGlobalFooterTerminalLog(
        `✅ [SWARM COMPLETE] ${fileNames.length} file(s) built & verified in ${finalRes.workspace_dir} (Exit ${finalRes.exit_code}, Self-Heal Rounds: ${finalRes.self_heal_rounds || 0})`,
        finalRes.exit_code === 0 ? "#2ee6a6" : "#fbbf24",
        false
      );
    }

    // Feed all per-agent outputs directly into the Omega Multi-Agent Grouped File Hub & 3-Model Crucible!
    if (finalRes.agent_outputs) {
      window._lastPrompt = rawGoal;
      window._lastAnswers = finalRes.agent_outputs;
      window._lastVerdict = summaryMd;
      renderOmegaMultiAgentFilesHub(finalRes.agent_outputs, rawGoal);
    }

    // Backend already archived clean disjoint per-agent folders into explorer_runs.json — load that exact run!
    if (finalRes.explorer_run_id && typeof loadExplorerRunsFromServer === "function") {
      loadExplorerRunsFromServer(finalRes.explorer_run_id);
      const jumpWrap = document.createElement("div");
      jumpWrap.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:10px;padding:8px 11px;border-radius:7px;background:#071326;border:1px solid rgba(46,230,166,0.42)";
      jumpWrap.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#a7f3d0">🗂️ Saved <strong>${fileNames.length}</strong> non-clashing file(s) by Swarm Agent into VS Code Explorer!</span>`;
      const openExpBtn = document.createElement("button");
      openExpBtn.type = "button";
      openExpBtn.className = "primary xs";
      openExpBtn.textContent = "🗂️ Open in VS Code Explorer (Pin & Swap Files)";
      openExpBtn.onclick = () => {
        document.querySelector('.rail-btn[data-view="file-explorer"]')?.click();
        loadExplorerRunsFromServer(finalRes.explorer_run_id);
      };
      jumpWrap.appendChild(openExpBtn);
      body.appendChild(jumpWrap);
    } else if (finalRes.agent_outputs && typeof window.recordPromptRunToFileExplorer === "function") {
      window.recordPromptRunToFileExplorer(finalRes.agent_outputs, rawGoal, "swarm");
    }

    status(`✅ Swarm Mission completed ${fileNames.length} non-clashing file(s) with Exit Code ${finalRes.exit_code}! Ready in VS Code Explorer.`);
  } catch (err) {
    setCardBodyMarkdown(body, `❌ **Swarm Exception:** ${err.message || err}`, false);
    status(`❌ Swarm Mission error: ${err.message || err}`);
  } finally {
    $("#stop-btn")?.classList.add("hidden");
    $("#ask-btn").disabled = false;
  }
}

function initAutonomousSwarmMissionRunner() {
  $("#composer-swarm-mission-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    runAutonomousSwarmMission("full_autonomous");
  });

  $$(".swarm-mission-launch-item").forEach((btn) => {
    if (btn._boundSwarmMission) return;
    btn._boundSwarmMission = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prof = btn.getAttribute("data-swarm-mission") || "full_autonomous";
      runAutonomousSwarmMission(prof);
    });
  });

  $$("[data-swarm-reaction]").forEach((btn) => {
    if (btn._boundSwarmReact) return;
    btn._boundSwarmReact = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const reactMode = btn.getAttribute("data-swarm-reaction") || "dag_4step";
      if (typeof executeSwarmReactionChoice === "function") {
        executeSwarmReactionChoice(reactMode);
      }
    });
  });
}

// ── Clean Tabbed /host Configurator (Host A | B | C | D | + Custom) + Saved Hosts Board + 1-Cell Boot Script Generator ──
const SAVED_HOSTS_LS_KEY = "council_saved_hosts_v1";
window._activeHostSetupTab = "a";
window._lastHostHeartbeatMap = {};

function loadSavedHostsMap() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_HOSTS_LS_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (_) {
    return {};
  }
}

window.markHostConfigSaved = function (hostId, meta = {}) {
  const hk = String(hostId || "a").toLowerCase();
  const map = loadSavedHostsMap();
  map[hk] = { ...(map[hk] || {}), ...meta, saved: true };
  try {
    localStorage.setItem(SAVED_HOSTS_LS_KEY, JSON.stringify(map));
  } catch (_) { }
};

function buildHostBootScriptForTab(hk = "a") {
  const hostKey = String(hk || "a").toLowerCase();
  const upper = hostKey.toUpperCase();
  const targetMode = $("#hs-boot-script-target")?.value || "colab_py";
  const ports = { a: 8080, b: 8081, c: 8082, d: 8083 };
  const port = ports[hostKey] || 8080;
  const gistId = ($("#hs-auth-gist-id")?.value || "05a1f96580fa13b373b42d919873dc57").trim();
  const ghUser = ($("#hs-auth-gh-user")?.value || "savingannabel").trim();
  const quant = $("#hs-cust-quant")?.value || "Q4_K_M";
  const ctx = $("#hs-cust-ctx")?.value || "32768";
  const ngl = $("#hs-cust-ngl")?.value || "99";
  const flags = ($("#hs-cust-flags")?.value || "--flash-attn --cont-batching").trim();

  const treeModels = (typeof HOST_TREE_UI_STATE !== "undefined" && Array.isArray(HOST_TREE_UI_STATE.models)
    ? HOST_TREE_UI_STATE.models.filter((m) => String(m.host || "a").toLowerCase() === hostKey && m.enabled !== false)
    : []);
  const primaryRepo = treeModels[0]?.hf || treeModels[0]?.id || "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated-GGUF";
  const assignedSummary = treeModels.length ? treeModels.map((m) => m.hf || m.id).join(", ") : primaryRepo;

  if (targetMode === "local_sh") {
    return [
      `#!/usr/bin/env bash`,
      `# Suomynona Council — Host ${upper} Local GPU Agent Bootstrap (:${port})`,
      `# Assigned Models: ${assignedSummary}`,
      `set -euo pipefail`,
      `export HOST_ID="${hostKey}"`,
      `export PORT="${port}"`,
      `export MODEL_REPO="${primaryRepo}"`,
      `export QUANT="${quant}"`,
      `echo "🚀 Booting Host ${upper} OpenAI-compatible server on http://127.0.0.1:${port}/v1 (${quant}, ctx=${ctx})..."`,
      `if command -v llama-server >/dev/null 2>&1; then`,
      `  llama-server -hf "$MODEL_REPO" --port "$PORT" -c ${ctx} -ngl ${ngl} ${flags}`,
      `elif command -v ollama >/dev/null 2>&1; then`,
      `  OLLAMA_HOST="127.0.0.1:${port}" ollama serve`,
      `else`,
      `  python3 -m vllm.entrypoints.openai.api_server --model "$MODEL_REPO" --port "$PORT" --max-model-len ${ctx}`,
      `fi`,
    ].join("\n");
  }

  return [
    `# 🚀 SUOMYNONA COUNCIL — 1-CELL COLAB / KAGGLE GPU AUTO-BOOT (HOST ${upper})`,
    `# Paste into Cell 1 of Google Colab (G4/A100/L4/T4) or Kaggle Notebook and press Shift+Enter.`,
    `# Assigned Host ${upper} Weight(s): ${assignedSummary}`,
    `import os, subprocess, re, time, json, urllib.request`,
    `HOST_ID = "${hostKey}"`,
    `PORT = ${port}`,
    `GIST_ID = "${gistId}"`,
    `GH_USERNAME = "${ghUser}"`,
    `MODEL_REPO = "${primaryRepo}"`,
    `QUANT = "${quant}"`,
    `CTX_LEN = ${ctx}`,
    `def _secret(k):`,
    `    v = os.environ.get(k, "").strip()`,
    `    if not v:`,
    `        try:`,
    `            from google.colab import userdata`,
    `            v = (userdata.get(k) or "").strip()`,
    `        except Exception: pass`,
    `    return v`,
    `GH_TOKEN = _secret("GH_TOKEN")  # Add GH_TOKEN in Colab Secrets (🔑) to auto-sync tunnel to Suomynona Council`,
    `HF_TOKEN = _secret("HF_TOKEN")`,
    `if HF_TOKEN: os.environ["HF_TOKEN"] = HF_TOKEN`,
    `gpu_name = "Colab GPU"`,
    `try:`,
    `    gpu_name = subprocess.check_output(["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"], text=True).strip().splitlines()[0]`,
    `except Exception: pass`,
    `print(f"⚡ Booting Host {HOST_ID.upper()} on {gpu_name} ({MODEL_REPO} · {QUANT})...")`,
    `subprocess.run("pip install -q huggingface_hub llama-cpp-python[server] && wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared", shell=True, check=False)`,
    `srv = subprocess.Popen(f"python3 -m llama_cpp.server --hf_model_repo_id {MODEL_REPO} --model *{QUANT}*.gguf --n_gpu_layers ${ngl} --n_ctx {CTX_LEN} --host 0.0.0.0 --port {PORT}", shell=True)`,
    `for _ in range(90):`,
    `    try:`,
    `        with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/v1/models", timeout=2) as r:`,
    `            if r.status == 200: break`,
    `    except Exception: time.sleep(2)`,
    `tun = subprocess.Popen(f"/usr/local/bin/cloudflared tunnel --url http://127.0.0.1:{PORT} --no-autoupdate", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)`,
    `tunnel_url = ""`,
    `for line in iter(tun.stdout.readline, ""):`,
    `    m = re.search(r"https://[-a-z0-9]+\\.trycloudflare\\.com", line)`,
    `    if m:`,
    `        tunnel_url = m.group(0) + "/v1"`,
    `        print(f"\\n✅ HOST {HOST_ID.upper()} LIVE TUNNEL URL: {tunnel_url}")`,
    `        break`,
    `if tunnel_url and GH_TOKEN and GIST_ID:`,
    `    tunnel_doc = {"host": HOST_ID, "tunnel_url": tunnel_url, "quant": QUANT, "gpu_name": gpu_name, "model": MODEL_REPO, "updated_at": int(time.time())}`,
    `    opencode_doc = {"gpu_name": gpu_name, "provider": {f"host-{HOST_ID}": {"options": {"baseURL": tunnel_url}, "models": {MODEL_REPO: {"name": MODEL_REPO}}}}}`,
    `    payload = json.dumps({"files": {f"host_{HOST_ID}_tunnel.json": {"content": json.dumps(tunnel_doc, indent=2)}, f"opencode-providers-{HOST_ID}.json": {"content": json.dumps(opencode_doc, indent=2)}}}).encode()`,
    `    req = urllib.request.Request(f"https://api.github.com/gists/{GIST_ID}", data=payload, method="PATCH", headers={"Authorization": f"token {GH_TOKEN}", "Content-Type": "application/json", "User-Agent": "suomynona-colab"})`,
    `    urllib.request.urlopen(req)`,
    `    print(f"📡 Published Host {HOST_ID.upper()} tunnel to Gist ({GIST_ID}) for @${ghUser} — Suomynona Council will route to this Colab GPU automatically!")`,
    `elif tunnel_url:`,
    `    print(f"📋 Paste this URL into Host {HOST_ID.upper()} in Suomynona Council -> Configure Hosts: {tunnel_url}")`,
  ].join("\n");
}

function refreshHostBootScriptPreview(hk = "a") {
  const upper = String(hk || "a").toUpperCase();
  const titleEl = $("#hs-boot-script-title");
  if (titleEl) titleEl.textContent = `🚀 Host ${upper} — 1-Click Colab / Kaggle / Local Boot Cell`;
  const pre = $("#hs-boot-script-preview");
  if (pre) pre.textContent = buildHostBootScriptForTab(hk);
}

window.refreshTabbedHostSetupUI = async function (preferredTab) {
  const activeTab = String(preferredTab || window._activeHostSetupTab || "a").toLowerCase();
  window._activeHostSetupTab = activeTab;

  const colabData = await getJSON("/api/colab/hosts").catch(() => ({ hosts: {} }));
  const colabHosts = colabData?.hosts || STATE?.colab?.hosts || {};
  const runtimeHosts = Array.isArray(STATE?.runtime_hosts) ? STATE.runtime_hosts : [];
  const savedMap = loadSavedHostsMap();
  const hbMap = window._lastHostHeartbeatMap || {};
  const defaultPorts = { a: 8080, b: 8081, c: 8082, d: 8083 };

  const coreKeys = ["a", "b", "c", "d"];
  runtimeHosts.forEach((rh) => {
    const id = String(rh.id || "").toLowerCase();
    if (id && !coreKeys.includes(id)) coreKeys.push(id);
  });

  const hostSel = $("#hs-cust-host-select");
  if (hostSel) {
    hostSel.innerHTML = coreKeys
      .map((hk) => `<option value="${esc(hk)}">Host ${esc(hk.toUpperCase())}</option>`)
      .join("");
    if (activeTab !== "custom_new" && coreKeys.includes(activeTab)) {
      hostSel.value = activeTab;
    }
  }

  const tabsBar = $("#hs-host-tabs-bar");
  if (tabsBar) {
    coreKeys.forEach((hk) => {
      if (!tabsBar.querySelector(`[data-hs-tab="${hk}"]`)) {
        const customBtn = tabsBar.querySelector('[data-hs-tab="custom_new"]');
        const b = document.createElement("button");
        b.type = "button";
        b.className = "hs-host-tab-btn";
        b.setAttribute("data-hs-tab", hk);
        const rh = runtimeHosts.find((x) => String(x.id).toLowerCase() === hk);
        b.textContent = rh?.name || `Host ${hk.toUpperCase()}`;
        tabsBar.insertBefore(b, customBtn || null);
      }
    });

    tabsBar.querySelectorAll(".hs-host-tab-btn").forEach((btn) => {
      const tk = btn.getAttribute("data-hs-tab") || "a";
      btn.classList.toggle("active", tk === activeTab);
      if (tk !== "custom_new") {
        const ch = colabHosts[tk] || {};
        const isSaved = Boolean(savedMap[tk]?.saved || ch.custom_url || ch.tunnel_url);
        btn.classList.toggle("has-saved-dot", isSaved);
      }
    });
  }

  const singlePane = $("#hs-single-host-editor-pane");
  const customPane = $("#hs-custom-new-host-pane");
  if (activeTab === "custom_new") {
    singlePane?.classList.add("hidden");
    customPane?.classList.remove("hidden");
  } else {
    singlePane?.classList.remove("hidden");
    customPane?.classList.add("hidden");
    const hk = coreKeys.includes(activeTab) ? activeTab : "a";
    if (typeof populateHostSetupFieldsForHost === "function") {
      populateHostSetupFieldsForHost(hk);
    }
    const ch = colabHosts[hk] || {};
    const savedInfo = savedMap[hk] || {};
    const urlInput = $("#hs-tab-endpoint-url");
    if (urlInput) {
      const rawUrl = ch.custom_url || ch.tunnel_url || savedInfo.url || "";
      const isStubLoopback = /^https?:\/\/(127\.0\.0\.1|localhost):(808[0-3])\b/i.test(rawUrl);
      urlInput.value = (ch.provider === "local" || !isStubLoopback) ? rawUrl : "";
      urlInput.placeholder = ch.provider === "local"
        ? `http://127.0.0.1:${defaultPorts[hk] || 11434}/v1`
        : "Auto-synced via GitHub Gist — or paste live https://*.trycloudflare.com/v1";
    }
    const upper = hk.toUpperCase();
    if ($("#hs-active-tab-title")) {
      $("#hs-active-tab-title").textContent = `🔗 Host ${upper} — Compute Site, Colab/Kaggle URL & Login`;
    }
    if ($("#hs-auth-btn-host-lbl")) $("#hs-auth-btn-host-lbl").textContent = `Host ${upper}`;
    if ($("#hs-save-btn-host-lbl")) $("#hs-save-btn-host-lbl").textContent = `Host ${upper}`;
    const pill = $("#hs-active-tab-saved-pill");
    if (pill) {
      const isSaved = Boolean(savedInfo.saved || ch.custom_url || ch.tunnel_url);
      pill.textContent = isSaved ? `✅ Host ${upper} Saved` : `⚪ Host ${upper} Not Yet Saved`;
      pill.style.color = isSaved ? "#2ee6a6" : "#94a3b8";
    }
    refreshHostBootScriptPreview(hk);
  }

  const board = $("#hs-saved-hosts-board");
  if (board) {
    board.innerHTML = coreKeys
      .map((hk) => {
        const rh = runtimeHosts.find((x) => String(x.id).toLowerCase() === hk) || {};
        const ch = colabHosts[hk] || {};
        const sv = savedMap[hk] || {};
        const hb = hbMap[hk] || {};
        const prov = (sv.provider || rh.provider || "colab").toUpperCase();
        const acc = sv.accelerator || rh.accelerator || ch.gpu || "G4";
        const ram = Number(hb.vram_gb || sv.ram_gb || rh.ram_gb || ch.vram_gb || 96);
        const usedGb = Number(hb.used_vram_gb ?? 0);
        const pct = Number(hb.pressure_pct ?? (ram > 0 ? Math.round((usedGb / ram) * 1000) / 10 : 0));
        const pLabel = hb.pressure_label || (pct > 90 ? "Overcommitted" : pct >= 75 ? "High Load" : "Nominal");
        const pCol = pct > 90 ? "#f43f5e" : pct >= 75 ? "#f59e0b" : "#2ee6a6";
        const barW = Math.max(2, Math.min(100, Math.round(pct)));
        const modelsCnt = Number(hb.assigned_models_count ?? 0);
        const kvGb = Number(hb.kv_vram_gb ?? 0);
        const inFlight = Number(hb.in_flight ?? 0);
        const url = ch.custom_url || ch.tunnel_url || sv.url || `http://127.0.0.1:${defaultPorts[hk] || 8080}/v1`;
        const isSaved = Boolean(sv.saved || ch.custom_url || ch.tunnel_url);
        const isEditing = hk === activeTab;
        const hbBadge = hb.online
          ? `Online · ${hb.latency_ms}ms`
          : isSaved
            ? "✓ SAVED"
            : "STANDBY";
        return `
          <div class="hs-saved-host-chip ${isSaved || hb.online ? "is-saved" : ""} ${isEditing ? "is-editing" : ""}" data-hs-board-pick="${esc(hk)}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
              <strong style="font-size:12px;color:#f8fafc">🖥 Host ${esc(hk.toUpperCase())}</strong>
              <span class="tabular-nums" style="font-size:10px;font-weight:800;color:${hb.online || isSaved ? "#2ee6a6" : "#94a3b8"}">${esc(hbBadge)}</span>
            </div>
            <div class="tabular-nums" style="font-size:11px;color:#cbd5e1;font-weight:600">${esc(prov)} · ${esc(acc)} (${ram}GB VRAM)</div>
            <div class="tabular-nums" style="display:flex;justify-content:space-between;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace;font-size:10px;margin-top:2px">
              <span style="color:#e2e8f0">${usedGb.toFixed(1)} / ${ram} GB (${pct.toFixed(1)}%)</span>
              <span style="color:${pCol};font-weight:700">${esc(pLabel)}</span>
            </div>
            <div style="height:4px;background:rgba(148,163,184,0.16);border-radius:2px;overflow:hidden;margin:2px 0">
              <div style="height:100%;width:${barW}%;background:${pCol}"></div>
            </div>
            <div class="tabular-nums" style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#94a3b8">
              Models: ${modelsCnt} · KV: ${kvGb.toFixed(1)}GB · In-Flight: ${inFlight}
            </div>
            <div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:#38bdf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(url)}">${esc(url)}</div>
            <div style="display:flex;gap:4px;margin-top:2px">
              <button type="button" class="ghost xs" data-hs-board-edit="${esc(hk)}" style="flex:1;padding:2px 5px;font-size:10px">✎ Edit</button>
              <button type="button" class="ghost xs" data-hs-board-fill="${esc(hk)}" style="padding:2px 6px;font-size:10px;color:#fbbf24;border-color:rgba(251,191,36,0.38)" title="Pack Host ${esc(hk.toUpperCase())} up to safe 85% VRAM working cap">⚡ Fill</button>
              <button type="button" class="ghost xs" data-hs-board-ping="${esc(hk)}" style="padding:2px 6px;font-size:10px;color:#2ee6a6">▶ Ping</button>
            </div>
          </div>
        `;
      })
      .join("");

    board.querySelectorAll("[data-hs-board-pick]").forEach((cardEl) => {
      cardEl.addEventListener("click", (e) => {
        if (e.target.closest("[data-hs-board-ping], [data-hs-board-fill]")) return;
        const hk = cardEl.getAttribute("data-hs-board-pick") || "a";
        window.refreshTabbedHostSetupUI(hk);
      });
    });

    board.querySelectorAll("[data-hs-board-fill]").forEach((fillBtn) => {
      fillBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const hk = fillBtn.getAttribute("data-hs-board-fill") || "a";
        if (typeof window._runHsFillVram === "function") {
          window._runHsFillVram(hk, fillBtn);
        }
      });
    });

    board.querySelectorAll("[data-hs-board-ping]").forEach((pingBtn) => {
      pingBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const hk = pingBtn.getAttribute("data-hs-board-ping") || "a";
        const outEl = $("#hs-verify-hosts-output");
        if (outEl) outEl.textContent = `⏳ Testing Host ${hk.toUpperCase()} endpoint & boot cell handshake…`;
        const res = await postJSON("/api/colab/run-boot-cell", { host: hk }).catch((err) => ({ ok: false, error: err.message }));
        await window.pollHostHeartbeatNow?.();
        await window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
        if (res?.ok && outEl) {
          const r0 = (res.results || [])[0] || {};
          outEl.textContent = `✅ Host ${hk.toUpperCase()} Verified: ${r0.latency_ms || 12}ms (${r0.models_ready || "ready"} models)`;
        } else if (outEl) {
          outEl.textContent = `⚠️ Host ${hk.toUpperCase()} check: ${res?.error || "Unreachable"}`;
        }
      });
    });
  }
};

function initTabbedHostSetupConfigurator() {
  const tabsBar = $("#hs-host-tabs-bar");
  if (tabsBar && !tabsBar._boundHostTabs) {
    tabsBar._boundHostTabs = true;
    tabsBar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-hs-tab]");
      if (!btn) return;
      const tabKey = btn.getAttribute("data-hs-tab") || "a";
      window.refreshTabbedHostSetupUI(tabKey);
    });
  }

  ["#hs-boot-script-target", "#hs-cust-quant", "#hs-cust-ctx", "#hs-cust-ngl", "#hs-cust-flags", "#hs-auth-gist-id", "#hs-auth-gh-user"].forEach((sel) => {
    $(sel)?.addEventListener("change", () => refreshHostBootScriptPreview(window._activeHostSetupTab || "a"));
  });

  $("#hs-copy-boot-script-btn")?.addEventListener("click", async () => {
    const hk = window._activeHostSetupTab || "a";
    const scriptTxt = buildHostBootScriptForTab(hk);
    try {
      await navigator.clipboard.writeText(scriptTxt);
      const btn = $("#hs-copy-boot-script-btn");
      if (btn) {
        btn.textContent = `✓ Copied Host ${hk.toUpperCase()} Cell!`;
        setTimeout(() => {
          btn.textContent = "📋 Copy 1-Cell Script";
        }, 1800);
      }
      status(`📋 Copied Host ${hk.toUpperCase()} 1-Cell Boot Script to clipboard.`);
    } catch (_) { }
  });

  $("#hs-download-boot-script-btn")?.addEventListener("click", () => {
    const hk = window._activeHostSetupTab || "a";
    const isSh = ($("#hs-boot-script-target")?.value || "colab_py") === "local_sh";
    const scriptTxt = buildHostBootScriptForTab(hk);
    const blob = new Blob([scriptTxt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isSh ? `boot_host_${hk}.sh` : `colab_boot_host_${hk}.py`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });

  $("#hs-fill-local-port-btn")?.addEventListener("click", () => {
    const hk = window._activeHostSetupTab || "a";
    const ports = { a: 8080, b: 8081, c: 8082, d: 8083 };
    const port = ports[hk] || 8080;
    if ($("#hs-cust-provider")) $("#hs-cust-provider").value = "localhost";
    if ($("#hs-tab-endpoint-url")) $("#hs-tab-endpoint-url").value = `http://127.0.0.1:${port}/v1`;
    refreshHostBootScriptPreview(hk);
    status(`⚡ Set Host ${hk.toUpperCase()} to Local Agent http://127.0.0.1:${port}/v1 — click Save Host ${hk.toUpperCase()} Configuration to lock it in.`);
  });

  $("#hs-standardize-local-ports-btn")?.addEventListener("click", async () => {
    const ports = { a: 8080, b: 8081, c: 8082, d: 8083 };
    for (const hk of ["a", "b", "c", "d"]) {
      const url = `http://127.0.0.1:${ports[hk]}/v1`;
      await postJSON("/api/colab/connect", { host: hk, custom_url: url }).catch(() => ({}));
      window.markHostConfigSaved(hk, { provider: "localhost", url, saved_at: new Date().toLocaleTimeString() });
    }
    await reloadState().catch(() => { });
    await window.pollHostHeartbeatNow?.();
    await window.refreshTabbedHostSetupUI(window._activeHostSetupTab);
    if ($("#hs-verify-hosts-output")) {
      $("#hs-verify-hosts-output").textContent = "✅ Bound & saved Local Agent ports (:8080–:8083) across Hosts A, B, C, and D.";
    }
  });

  $("#hs-verify-all-saved-hosts-btn")?.addEventListener("click", async () => {
    const outEl = $("#hs-verify-hosts-output");
    if (outEl) outEl.textContent = "⏳ Verifying handshakes across Hosts A, B, C, and D…";
    const res = await postJSON("/api/colab/run-boot-cell", { host: "all" }).catch((e) => ({ ok: false, error: e.message }));
    await window.pollHostHeartbeatNow?.();
    await window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    if (res?.ok && outEl) {
      const summary = (res.results || [])
        .map((r) => `Host ${String(r.host).toUpperCase()}: ${r.ok ? "✅" : "⚠️"} ${r.latency_ms}ms`)
        .join(" · ");
      outEl.textContent = `✅ Handshake Report: ${summary}`;
    } else if (outEl) {
      outEl.textContent = `⚠️ ${res?.error || "Verification failed"}`;
    }
  });

  const runHsFillVram = async (hostId = null, triggerBtn = null) => {
    const outEl = $("#hs-verify-hosts-output");
    const origTxt = triggerBtn ? triggerBtn.textContent : "";
    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.textContent = "⏳ Filling…";
    }
    const targetLbl = hostId ? `Host ${String(hostId).toUpperCase()}` : "Hosts A–D";
    if (outEl) outEl.textContent = `⚡ Packing unique models onto ${targetLbl} up to safe 85% VRAM working cap…`;
    const payload = { target_pct: 85 };
    if (hostId) payload.host_id = hostId;
    const res = await postJSON("/api/hosts/fill-vram", payload).catch((e) => ({ ok: false, error: e.message }));
    await reloadState().catch(() => { });
    if (typeof syncHostTreeStateFromServer === "function") {
      await syncHostTreeStateFromServer().catch(() => { });
    }
    await window.pollHostHeartbeatNow?.();
    await window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.textContent = origTxt;
    }
    if (res?.ok) {
      const msg = `✅ Filled +${res.added_count || 0} model(s) on ${targetLbl} · Cluster VRAM ${res.after?.cluster_used_gb ?? 0}/${res.after?.cluster_total_gb ?? 0}GB (${res.after?.cluster_pressure_pct ?? 0}%)`;
      if (outEl) outEl.textContent = msg;
      status(msg);
    } else if (outEl) {
      outEl.textContent = `⚠️ VRAM Fill failed: ${res?.error || "Unknown error"}`;
    }
  };
  window._runHsFillVram = runHsFillVram;

  const hsFillAllBtn = $("#hs-fill-all-hosts-vram-btn");
  if (hsFillAllBtn && !hsFillAllBtn._boundFillAll) {
    hsFillAllBtn._boundFillAll = true;
    hsFillAllBtn.addEventListener("click", () => runHsFillVram(null, hsFillAllBtn));
  }

  const hsRebalanceBtn = $("#hs-rebalance-vram-btn");
  if (hsRebalanceBtn && !hsRebalanceBtn._boundRebalance) {
    hsRebalanceBtn._boundRebalance = true;
    hsRebalanceBtn.addEventListener("click", async () => {
      const outEl = $("#hs-verify-hosts-output");
      hsRebalanceBtn.disabled = true;
      const origTxt = hsRebalanceBtn.textContent;
      hsRebalanceBtn.textContent = "⏳ Rebalancing…";
      if (outEl) outEl.textContent = "⚖️ Running First-Fit Decreasing (FFD) VRAM pack & clone deduplication across Hosts A–D…";
      const res = await postJSON("/api/hosts/rebalance-vram", { dry_run: false }).catch((e) => ({ ok: false, error: e.message }));
      await reloadState().catch(() => { });
      await window.pollHostHeartbeatNow?.();
      await window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
      hsRebalanceBtn.disabled = false;
      hsRebalanceBtn.textContent = origTxt;
      if (res?.ok) {
        const msg = `✅ VRAM Rebalanced: ${res.migrated_count || 0} model(s) migrated · ${res.deduplicated_count || 0} duplicate clone(s) removed · Max host pressure now ${res.after?.cluster_pressure_pct ?? 0}% cluster-wide.`;
        if (outEl) outEl.textContent = msg;
        status(msg);
      } else if (outEl) {
        outEl.textContent = `⚠️ VRAM Rebalance failed: ${res?.error || "Unknown error"}`;
      }
    });
  }

  const hsPolicySel = $("#hs-lb-policy-select");
  if (hsPolicySel && !hsPolicySel._boundPolicy) {
    hsPolicySel._boundPolicy = true;
    hsPolicySel.addEventListener("change", async () => {
      const policy = hsPolicySel.value;
      const res = await postJSON("/api/hosts/load-balancer-policy", { policy }).catch((e) => ({ ok: false, error: e.message }));
      if ($("#topbar-hb-policy-select")) $("#topbar-hb-policy-select").value = policy;
      await window.pollHostHeartbeatNow?.();
      const outEl = $("#hs-verify-hosts-output");
      if (res?.ok && outEl) {
        outEl.textContent = `✅ Updated GPU Load-Balancer Routing Policy → ${policy}`;
      }
    });
  }

  window.refreshTabbedHostSetupUI("a");
}

// ── Live Per-Host GPU VRAM, Spillover & Latency Heartbeat Monitor ──
function initLiveHostHeartbeatMonitor() {
  const renderHeartbeatUI = (hbData) => {
    const hosts = hbData?.hosts || {};
    const lb = hbData?.load_balancer || {};
    window._lastHostHeartbeatMap = hosts;
    window._lastLoadBalancerSummary = lb;
    const sumEl = $("#topbar-hosts-hb-summary");
    const clusterSumEl = $("#topbar-hb-cluster-summary");
    const listEl = $("#topbar-hosts-hb-list");
    const keys = Object.keys(hosts).length ? Object.keys(hosts) : ["a", "b", "c", "d"];
    const onlineCount = keys.filter((k) => hosts[k]?.online).length;
    const overCount = Array.isArray(lb.overcommitted_hosts)
      ? lb.overcommitted_hosts.length
      : keys.filter((k) => Number(hosts[k]?.pressure_pct || 0) > 90).length;
    const clusterPct = Number(lb.cluster_pressure_pct ?? 0);

    if (sumEl) {
      if (overCount > 0) {
        sumEl.textContent = `${overCount} Over · ${clusterPct.toFixed(0)}%`;
        sumEl.style.color = "#f43f5e";
      } else if (clusterPct >= 75) {
        sumEl.textContent = `A–D · ${clusterPct.toFixed(0)}%`;
        sumEl.style.color = "#f59e0b";
      } else if (onlineCount > 0) {
        sumEl.textContent = `${onlineCount}/${keys.length} · ${clusterPct.toFixed(0)}%`;
        sumEl.style.color = "#2ee6a6";
      } else {
        sumEl.textContent = `A–D · ${clusterPct.toFixed(0)}%`;
        sumEl.style.color = "#2ee6a6";
      }
    }

    if (clusterSumEl) {
      const usedGb = Number(lb.cluster_used_gb ?? 0).toFixed(1);
      const totGb = Number(lb.cluster_total_gb ?? 384).toFixed(0);
      const thresh = Number(lb.max_pressure_pct ?? 85);
      const kvSaved = Number(lb.total_kv_elastic_saved_gb ?? 0);
      const gd = hbData?.gist_daemon || {};
      clusterSumEl.innerHTML =
        `<span style="color:#e2e8f0;font-weight:700">${usedGb}/${totGb} GB (${clusterPct.toFixed(1)}%)</span>` +
        ` · <span>Cap ${thresh}%</span>` +
        (kvSaved > 0 ? ` · <span style="color:#38bdf8">KV -${kvSaved}GB</span>` : "") +
        ` · <span style="color:${overCount > 0 ? "#f43f5e" : "#2ee6a6"}">${overCount > 0 ? `${overCount} Over` : `Gist:${gd.running ? `${Math.round((gd.interval_ms || 60000) / 1000)}s` : "Idle"}`}</span>`;
    }

    if (lb.policy) {
      const topSel = $("#topbar-hb-policy-select");
      if (topSel && topSel.value !== lb.policy) topSel.value = lb.policy;
      const hsSel = $("#hs-lb-policy-select");
      if (hsSel && hsSel.value !== lb.policy) hsSel.value = lb.policy;
    }

    if (listEl) {
      listEl.innerHTML = keys
        .map((hk) => {
          const h = hosts[hk] || { id: hk, vram_gb: 96, accelerator: "G4", status: "standby" };
          const totGb = Number(h.vram_gb || 96);
          const usedGb = Number(h.used_vram_gb ?? 0);
          const pct = Number(h.pressure_pct ?? 0);
          const cbState = String(h.circuit_state || "CLOSED");
          const isBridge = Boolean(h.is_internal_bridge || h.endpoint_mode === "internal_bridge");
          const isCloudFallback = h.endpoint_mode === "cloud_fallback" || (!h.online && !h.configured && !isBridge);
          const hasHostErr = !h.online && !isBridge && !isCloudFallback && Boolean(h.error);
          const pLabel = cbState === "OPEN" ? "CB:OPEN" : hasHostErr ? (h.error_code || "OFFLINE") : isCloudFallback ? "Colab Standby" : h.pressure_label || (pct > 90 ? "Overcommitted" : pct >= 75 ? "High Load" : "Nominal");
          const pCol = cbState === "OPEN" || pct > 90 || hasHostErr ? "#f43f5e" : isCloudFallback ? "#38bdf8" : pct >= 75 ? "#f59e0b" : "#2ee6a6";
          const barW = Math.max(2, Math.min(100, Math.round(pct)));
          const connText = cbState === "OPEN" ? "Bypassed (<1ms)" : isBridge ? "Local Bridge" : h.online ? `🟢 ${h.latency_ms}ms (Colab GPU)` : isCloudFallback ? "Standby · Gemini/BYOK" : "⚠️ Offline";
          const modelsCnt = Number(h.assigned_models_count ?? 0);
          const kvGb = Number(h.kv_vram_gb ?? 0);
          const ctxK = Math.round(Number(h.elastic_ctx || h.context_size || 32768) / 1024);
          const hoverHelp = h.error_definition
            ? `${h.error}\nDefinition: ${h.error_definition}${(h.fix_steps || []).length ? `\nFix:\n${h.fix_steps.join("\n")}` : ""}`
            : `Click to configure Host ${hk.toUpperCase()} (${h.url || ""})`;
          return `
            <div class="hb-flyout-row" data-hb-jump-host="${esc(hk)}" style="display:flex;flex-direction:column;align-items:stretch;gap:3px;padding:6px 8px" title="${esc(hoverHelp)}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                <div>
                  <strong style="color:#f8fafc">Host ${esc(hk.toUpperCase())}</strong>
                  <span class="tabular-nums" style="color:${hasHostErr ? "#ff6b8b" : "#94a3b8"};margin-left:5px;font-size:10.5px">${esc(h.accelerator || "G4")} · ${esc(connText)}</span>
                </div>
                <span class="tabular-nums" style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:${pCol}">${usedGb.toFixed(1)}/${totGb}GB (${pct.toFixed(0)}%) · ${esc(pLabel)}</span>
              </div>
              <div style="height:4px;background:rgba(148,163,184,0.16);border-radius:2px;overflow:hidden">
                <div style="height:100%;width:${barW}%;background:${pCol}"></div>
              </div>
              ${hasHostErr ? `<div style="font-size:10px;color:#fbbf24;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(h.error)} (Click 🩺 /doctor for steps)</div>` : ""}
              <div class="tabular-nums" style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#94a3b8">
                <span>Models: ${modelsCnt} · KV(${ctxK}K): ${kvGb.toFixed(1)}GB</span>
                <span>CB:${esc(cbState)} · Shed:${Number(h.spillover_shed || 0)}/Recv:${Number(h.spillover_received || 0)}</span>
              </div>
            </div>
          `;
        })
        .join("");

      listEl.querySelectorAll("[data-hb-jump-host]").forEach((row) => {
        row.addEventListener("click", () => {
          const hk = row.getAttribute("data-hb-jump-host") || "a";
          openSlashConfigPopupWindow("host");
          window.refreshTabbedHostSetupUI?.(hk);
        });
      });
    }

    window._lastHostHeartbeatPayload = hbData;
    window.renderD3HostVramChart?.(hbData);
    window.dispatchEvent(new CustomEvent("suomynona:heartbeat-updated", { detail: hbData }));

    if (listEl) {
      listEl.querySelectorAll("[data-hb-jump-host]").forEach((row) => {
        const hk = row.getAttribute("data-hb-jump-host") || "a";
        row.addEventListener("mouseenter", () => {
          window.highlightD3HostBar?.(hk);
        });
        row.addEventListener("mouseleave", () => {
          window.highlightD3HostBar?.(null);
        });
      });
    }

    if ($("#hs-saved-hosts-board") && !$("#hs-saved-hosts-board").closest(".hidden")) {
      window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    }
  };

  let _hbInFlight = false;
  let _hbFastTimer = null;

  const pollNow = async () => {
    if (_hbInFlight) return null;
    _hbInFlight = true;
    try {
      const res = await getJSON("/api/hosts/heartbeat").catch(() => null);
      if (res?.ok) renderHeartbeatUI(res);
      return res;
    } finally {
      _hbInFlight = false;
    }
  };
  window.pollHostHeartbeatNow = pollNow;

  const setFastStreamActive = (active) => {
    const rateLbl = $("#topbar-hb-live-rate-lbl");
    if (active) {
      if (rateLbl) rateLbl.textContent = "LIVE 2s";
      if (!_hbFastTimer) {
        pollNow();
        _hbFastTimer = setInterval(() => {
          if (document.visibilityState !== "hidden") pollNow();
        }, 2000);
      }
    } else {
      if (rateLbl) rateLbl.textContent = "IDLE 15s";
      if (_hbFastTimer) {
        clearInterval(_hbFastTimer);
        _hbFastTimer = null;
      }
    }
  };

  const hbWrap = $("#topbar-hosts-heartbeat-wrap");
  hbWrap?.addEventListener("mouseenter", () => setFastStreamActive(true));
  hbWrap?.addEventListener("mouseleave", () => setFastStreamActive(false));
  hbWrap?.addEventListener("focusin", () => setFastStreamActive(true));
  hbWrap?.addEventListener("focusout", (e) => {
    if (!hbWrap.contains(e.relatedTarget)) setFastStreamActive(false);
  });

  $("#topbar-hosts-heartbeat-btn")?.addEventListener("click", () => {
    openSlashConfigPopupWindow("host");
  });
  $("#topbar-hb-open-host-cfg")?.addEventListener("click", () => {
    openSlashConfigPopupWindow("host");
  });
  $("#topbar-hb-doctor-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    window.runInteractiveDoctorInWorkspace?.("hosts");
  });
  $("#topbar-hb-refresh-btn")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.textContent = "Probing…";
    await pollNow();
    btn.textContent = "↻ Probe";
  });
  $("#topbar-hb-policy-select")?.addEventListener("click", (e) => e.stopPropagation());
  $("#topbar-hb-policy-select")?.addEventListener("change", async (e) => {
    e.stopPropagation();
    const policy = e.currentTarget.value;
    await postJSON("/api/hosts/load-balancer-policy", { policy }).catch(() => ({}));
    if ($("#hs-lb-policy-select")) $("#hs-lb-policy-select").value = policy;
    await pollNow();
    status(`⚖️ GPU Load-Balancer routing policy set to: ${policy}`);
  });
  $("#topbar-hb-rebalance-btn")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "⏳ Packing…";
    const res = await postJSON("/api/hosts/rebalance-vram", { dry_run: false }).catch((err) => ({ ok: false, error: err.message }));
    await reloadState().catch(() => { });
    await pollNow();
    window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    btn.disabled = false;
    btn.textContent = orig;
    if (res?.ok) {
      status(`⚖️ Rebalanced Hosts A–D: ${res.migrated_count || 0} migrated · ${res.deduplicated_count || 0} duplicates pruned · Cluster ${res.after?.cluster_pressure_pct ?? 0}% VRAM.`);
    } else {
      status(`⚠️ Rebalance error: ${res?.error || "failed"}`);
    }
  });

  pollNow();
  setInterval(() => {
    if (document.visibilityState !== "hidden" && !_hbFastTimer) pollNow();
  }, 15000);
}

// ── Global Sticky Bottom Footer: Pure Real-Time Backend Activity, Inputs & Error Monitor (Zero CLI Input Clutter) ──
let _gftActiveFilter = "ALL";
let _gftPaused = false;
let _gftErrorCount = 0;
const _gftEvents = [];

function classifyFooterStreamCategory(entry = {}) {
  const cat = String(entry.category || "SYS").toUpperCase();
  const lvl = String(entry.level || "info").toLowerCase();
  if (lvl === "error" || cat.includes("ERR") || cat.includes("FAIL") || cat.includes("CRASH")) return "ERROR";
  if (cat === "CLI" || cat.includes("TERM") || cat.includes("GUARDIAN")) return "CLI";
  if (cat.includes("INPUT") || cat.includes("PROMPT") || cat.includes("REQ") || cat.includes("HTTP") || cat.includes("API")) return "INPUT";
  if (cat.includes("COMPIL") || cat.includes("BUILD") || cat.includes("EXE") || cat.includes("FORGE") || cat.includes("SHELL") || cat.includes("PY") || cat.includes("GO")) return "COMPILER";
  if (cat.includes("INF") || cat.includes("MODEL") || cat.includes("COUNCIL") || cat.includes("SWARM") || cat.includes("JUDGE") || cat.includes("POTATO") || cat.includes("AGENT")) return "INFERENCE";
  return "SYS";
}

function renderSingleFooterEventDom(out, ev) {
  if (!out) return;
  const bucket = classifyFooterStreamCategory(ev);
  if (_gftActiveFilter !== "ALL" && bucket !== _gftActiveFilter) return;

  const isErr = bucket === "ERROR";
  const color =
    isErr
      ? "#ff6b8b"
      : bucket === "CLI"
        ? (ev._cliColor || "#38bdf8")
        : bucket === "INPUT"
          ? "#38bdf8"
          : bucket === "COMPILER"
            ? "#2ee6a6"
            : bucket === "INFERENCE"
              ? "#c084fc"
              : "#cbd5e1";

  const row = document.createElement("div");
  row.style.cssText =
    `padding:2px 6px;margin-bottom:2px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.4;white-space:pre-wrap;word-break:break-word;` +
    (isErr
      ? "background:rgba(244,63,94,0.14);border-left:2px solid #f43f5e;"
      : bucket === "CLI"
        ? "background:rgba(15,23,42,0.55);border-left:2px solid rgba(56,189,248,0.55);"
        : "");
  const ts = ev.ts ? String(ev.ts).slice(-12) : new Date().toISOString().slice(11, 23);
  row.innerHTML = `<span style="color:#64748b">${esc(ts)}</span> <strong style="color:${color}">[${esc(ev.category || bucket)}]</strong> <span style="color:${isErr ? "#fecdd3" : ev._cliColor || "#e2e8f0"}">${esc(ev.message || "")}</span>`;
  out.appendChild(row);
  while (out.children.length > 260) {
    out.removeChild(out.firstChild);
  }
  out.scrollTop = out.scrollHeight;
}

function rerenderGlobalFooterStream() {
  const out = $("#gft-term-out");
  if (!out) return;
  out.innerHTML = "";
  for (const ev of _gftEvents) {
    renderSingleFooterEventDom(out, ev);
  }
}

window.mirrorEventToGlobalFooterStream = function (entry) {
  if (!entry || !entry.message) return;
  const bucket = classifyFooterStreamCategory(entry);
  _gftEvents.push(entry);
  while (_gftEvents.length > 350) _gftEvents.shift();

  if (bucket === "ERROR") {
    _gftErrorCount += 1;
    const errBadge = $("#gft-err-count");
    if (errBadge) errBadge.textContent = String(_gftErrorCount);
  }

  const ticker = $("#gft-latest-event-ticker");
  if (ticker && !_gftPaused) {
    ticker.textContent = `[${entry.category || bucket}] ${String(entry.message).replace(/\s+/g, " ").slice(0, 125)}`;
    ticker.style.color = bucket === "ERROR" ? "#ff6b8b" : bucket === "COMPILER" ? "#2ee6a6" : "#94a3b8";
  }

  if (!_gftPaused) {
    renderSingleFooterEventDom($("#gft-term-out"), entry);
  }
};

window.appendGlobalFooterTerminalLog = function (text, color = "#e2e8f0", autoExpand = false) {
  const isErr = String(color).includes("ff6b") || /error|fail|exception/i.test(String(text || ""));
  window.mirrorEventToGlobalFooterStream({
    ts: new Date().toISOString().slice(11, 23),
    category: isErr ? "ERROR" : "BACKEND",
    level: isErr ? "error" : "info",
    message: String(text || ""),
  });
  if (autoExpand) {
    const footer = $("#global-footer-terminal");
    if (footer && !footer.classList.contains("hidden")) {
      footer.classList.remove("gft-minimized");
      footer.classList.add("gft-expanded");
      const minExpBtn = $("#gft-min-exp-btn");
      if (minExpBtn) minExpBtn.textContent = "▼ Minimize";
    }
  }
};

function initGlobalStickyFooterTerminal() {
  if (typeof window.initUnifiedCommandDeck === "function") {
    window.initUnifiedCommandDeck();
    return;
  }
  const footer = $("#global-footer-terminal");
  const restorePill = $("#gft-restore-pill");
  const minExpBtn = $("#gft-min-exp-btn");
  const hideBtn = $("#gft-hide-btn");
  const clearBtn = $("#gft-clear-btn");
  const pauseBtn = $("#gft-pause-btn");
  const titleEl = $("#gft-toggle-title");
  const termOut = $("#gft-term-out");
  const grip = $("#gft-resize-grip");
  if (!footer) return;

  const setFooterState = (mode) => {
    if (mode === "hidden") {
      footer.classList.add("hidden");
      restorePill?.classList.remove("hidden");
    } else if (mode === "expanded") {
      footer.classList.remove("hidden", "gft-minimized");
      footer.classList.add("gft-expanded");
      restorePill?.classList.add("hidden");
      if (minExpBtn) minExpBtn.textContent = "▼ Minimize";
    } else {
      footer.classList.remove("hidden", "gft-expanded");
      footer.classList.add("gft-minimized");
      restorePill?.classList.add("hidden");
      if (minExpBtn) minExpBtn.textContent = "▲ Expand";
    }
    try {
      localStorage.setItem("council-global-footer-cli-state", mode);
    } catch (_) { }
  };

  try {
    const savedState = localStorage.getItem("council-global-footer-cli-state");
    if (savedState === "expanded" || savedState === "hidden" || savedState === "minimized") {
      setFooterState(savedState);
    }
  } catch (_) { }

  if (_gftEvents.length === 0) {
    window.mirrorEventToGlobalFooterStream({
      ts: new Date().toISOString().slice(11, 23),
      category: "SYS",
      level: "info",
      message: "Live Backend Activity, Input & Error Stream attached — continuously monitoring API calls, prompts, Python/Go/PE32+ builds & runtime errors.",
    });
  }

  minExpBtn?.addEventListener("click", () => {
    const isExp = footer.classList.contains("gft-expanded");
    setFooterState(isExp ? "minimized" : "expanded");
  });

  titleEl?.addEventListener("click", () => {
    const isExp = footer.classList.contains("gft-expanded");
    setFooterState(isExp ? "minimized" : "expanded");
  });

  hideBtn?.addEventListener("click", () => setFooterState("hidden"));
  restorePill?.addEventListener("click", () => setFooterState("expanded"));

  clearBtn?.addEventListener("click", () => {
    _gftEvents.length = 0;
    _gftErrorCount = 0;
    const errBadge = $("#gft-err-count");
    if (errBadge) errBadge.textContent = "0";
    if (termOut) termOut.innerHTML = "";
  });

  pauseBtn?.addEventListener("click", () => {
    _gftPaused = !_gftPaused;
    pauseBtn.textContent = _gftPaused ? "▶" : "⏸";
    const dot = $("#gft-live-dot");
    if (dot) dot.style.opacity = _gftPaused ? "0.3" : "1";
    if (!_gftPaused) rerenderGlobalFooterStream();
  });

  $$("#gft-filter-bar [data-gft-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      _gftActiveFilter = btn.getAttribute("data-gft-filter") || "ALL";
      $$("#gft-filter-bar [data-gft-filter]").forEach((b) =>
        b.classList.toggle("on", b.getAttribute("data-gft-filter") === _gftActiveFilter)
      );
      if (footer.classList.contains("gft-minimized")) setFooterState("expanded");
      rerenderGlobalFooterStream();
    });
  });

  // Capture any uncaught frontend runtime errors or unhandled promise rejections right into the Live Stream!
  if (!window._boundGlobalErrorStream) {
    window._boundGlobalErrorStream = true;
    window.addEventListener("error", (ev) => {
      window.mirrorEventToGlobalFooterStream({
        ts: new Date().toISOString().slice(11, 23),
        category: "FRONTEND_ERR",
        level: "error",
        message: `${ev.message || "Runtime error"} (${ev.filename ? ev.filename.split("/").pop() : "app"}:${ev.lineno || 0})`,
      });
    });
    window.addEventListener("unhandledrejection", (ev) => {
      window.mirrorEventToGlobalFooterStream({
        ts: new Date().toISOString().slice(11, 23),
        category: "PROMISE_ERR",
        level: "error",
        message: String(ev.reason?.message || ev.reason || "Unhandled async rejection"),
      });
    });
  }

  // Continuously poll /api/live-console every 2s so backend activity streams live at all times
  if (!window._gftBackendPollTimer) {
    pollLiveConsoleStream();
    window._gftBackendPollTimer = setInterval(pollLiveConsoleStream, 2000);
  }

  // ── Integrated Interactive Suomynona Terminal inside the Bottom Live Backend Stream Area ──
  const termBtn = $("#gft-terminal-btn");
  const cliShellSel = $("#gft-cli-shell-select");
  const cliPs1El = $("#gft-cli-ps1");
  const cliInput = $("#gft-cli-input");
  const cliRunBtn = $("#gft-cli-run-btn");
  const cliDoctorBtn = $("#gft-cli-doctor-btn");
  const cliDetachBtn = $("#gft-cli-detach-btn");

  const gftAppendLine = (text, color = "#e2e8f0", _instant = true) => {
    const isErr = String(color).includes("ff6b") || /^❌/i.test(String(text || ""));
    window.mirrorEventToGlobalFooterStream({
      ts: new Date().toISOString().slice(11, 23),
      category: "CLI",
      level: isErr ? "error" : "info",
      _cliColor: color,
      message: String(text || ""),
    });
  };

  const syncGftPrompt = () => {
    const mode = cliShellSel?.value || "council";
    if (!cliPs1El) return;
    const map = {
      council: "suomynona@stream❯",
      pwsh: "PS stream>",
      cmd: "CMD stream>",
      python: "python3 >>>",
      node: "node >",
      claude: "claude@stream❯",
      brain: "brain@stream❯",
    };
    cliPs1El.textContent = map[mode] || "suomynona@stream❯";
  };
  cliShellSel?.addEventListener("change", () => {
    syncGftPrompt();
    cliInput?.focus();
  });
  syncGftPrompt();

  let _gftCmdHistory = [];
  try {
    _gftCmdHistory = JSON.parse(localStorage.getItem("council-gft-cli-history") || "[]");
    if (!Array.isArray(_gftCmdHistory)) _gftCmdHistory = [];
  } catch {
    _gftCmdHistory = [];
  }
  let _gftHistCursor = _gftCmdHistory.length;

  const GFT_SLASH_COMPLETIONS = [
    "/doctor",
    "/doctor --script",
    "/doctor --run-script",
    "/update",
    "/update pull",
    "/vram",
    "/rebalance",
    "/hosts",
    "/bucket",
    "/boosters",
    "/clear",
    "/help",
  ];

  const runBottomStreamCommand = async (overrideCmd = null) => {
    const raw = String(overrideCmd !== null ? overrideCmd : cliInput?.value || "").trim();
    if (!raw) return;
    if (overrideCmd === null && cliInput) cliInput.value = "";
    if (_gftCmdHistory[_gftCmdHistory.length - 1] !== raw) {
      _gftCmdHistory.push(raw);
      if (_gftCmdHistory.length > 80) _gftCmdHistory.shift();
      try {
        localStorage.setItem("council-gft-cli-history", JSON.stringify(_gftCmdHistory));
      } catch { }
    }
    _gftHistCursor = _gftCmdHistory.length;

    setFooterState("expanded");
    termBtn?.classList.add("on");

    if (raw.toLowerCase() === "clear" || raw.toLowerCase() === "cls" || raw.toLowerCase() === "/clear") {
      clearBtn?.click();
      return;
    }

    const mode = cliShellSel?.value || "council";
    gftAppendLine(`${cliPs1El?.textContent || "suomynona@stream❯"} ${raw}`, "#38bdf8", true);

    if (cliRunBtn) {
      cliRunBtn.disabled = true;
      cliRunBtn.textContent = "…";
    }
    try {
      if (mode === "pwsh" || mode === "cmd" || mode === "python" || mode === "node") {
        const res = await postJSON("/api/cli/shell-exec", {
          command: raw,
          shell: mode,
          exec_mode: typeof EXEC_MODE !== "undefined" ? EXEC_MODE : "real",
        });
        gftAppendLine(res?.output || res?.error || "(Exit 0)", res?.ok !== false ? "#2ee6a6" : "#ff6b8b", true);
      } else {
        const prevMode = typeof unifiedTerminalMode !== "undefined" ? unifiedTerminalMode : "council";
        if (mode === "claude" || mode === "brain") {
          unifiedTerminalMode = mode;
        } else if (typeof unifiedTerminalMode !== "undefined" && unifiedTerminalMode !== "council") {
          unifiedTerminalMode = "council";
        }
        try {
          if (typeof executeUnifiedCliCommand === "function") {
            await executeUnifiedCliCommand(raw, gftAppendLine, termOut);
          } else {
            const res = await postJSON("/api/guardian/run", { prompt: raw, mode: "auto", exec_mode: "real" });
            gftAppendLine(res?.output || res?.error || "Done.", res?.ok !== false ? "#e2e8f0" : "#ff6b8b", true);
          }
        } finally {
          if (typeof unifiedTerminalMode !== "undefined") unifiedTerminalMode = prevMode;
        }
      }
    } catch (err) {
      gftAppendLine(`❌ Stream Terminal Error: ${err?.message || err}`, "#ff6b8b", true);
    } finally {
      if (cliRunBtn) {
        cliRunBtn.disabled = false;
        cliRunBtn.textContent = "Run ↵";
      }
      cliInput?.focus();
    }
  };

  window.openBottomStreamTerminal = (prefill = "") => {
    setFooterState("expanded");
    termBtn?.classList.add("on");
    if (prefill && cliInput) cliInput.value = prefill;
    setTimeout(() => cliInput?.focus(), 40);
  };

  termBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExp = footer.classList.contains("gft-expanded");
    if (isExp && document.activeElement === cliInput) {
      setFooterState("minimized");
      termBtn.classList.remove("on");
    } else {
      window.openBottomStreamTerminal("");
    }
  });

  cliRunBtn?.addEventListener("click", () => runBottomStreamCommand());
  cliDoctorBtn?.addEventListener("click", () => runBottomStreamCommand("/doctor --run-script"));
  cliDetachBtn?.addEventListener("click", () => {
    if (window.suomynonaNative?.openDetachedCli) {
      window.suomynonaNative.openDetachedCli("master");
    } else if (typeof openCliPopupWindow === "function") {
      openCliPopupWindow("master");
    }
  });

  cliInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runBottomStreamCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (_gftHistCursor > 0) {
        _gftHistCursor -= 1;
        cliInput.value = _gftCmdHistory[_gftHistCursor] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (_gftHistCursor < _gftCmdHistory.length - 1) {
        _gftHistCursor += 1;
        cliInput.value = _gftCmdHistory[_gftHistCursor] || "";
      } else {
        _gftHistCursor = _gftCmdHistory.length;
        cliInput.value = "";
      }
    } else if (e.key === "Tab") {
      const val = cliInput.value.trim();
      const match = GFT_SLASH_COMPLETIONS.find((c) => c.startsWith(val) && c !== val);
      if (match) {
        e.preventDefault();
        cliInput.value = match + " ";
      }
    }
  });

  if (grip && termOut) {
    grip.addEventListener("mousedown", (e) => {
      if (!footer.classList.contains("gft-expanded")) return;
      e.preventDefault();
      const startY = e.clientY;
      const startH = termOut.offsetHeight || 225;
      document.body.style.userSelect = "none";
      const onMove = (ev) => {
        const nextH = Math.max(90, Math.min(window.innerHeight * 0.62, startH + (startY - ev.clientY)));
        termOut.style.height = `${nextH}px`;
      };
      const onUp = () => {
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }
}

function initClosableStudioPanels() {
  $("#tuning-close-btn")?.addEventListener("click", () => {
    $("#tuning")?.classList.add("hidden");
  });
  $("#verdict-close-btn")?.addEventListener("click", () => {
    $("#verdict")?.classList.add("hidden");
  });
  $("#omega-hub-close-btn")?.addEventListener("click", () => {
    $("#omega-agent-files-hub")?.classList.add("hidden");
  });
}

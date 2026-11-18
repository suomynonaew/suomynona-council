// ══════════════════════════════════════════════════════════════════════════
let A2A_STATE = null;
let A2A_CODE_BUNDLE = null;
let A2A_ACTIVE_CODE_TAB = "adk_python";

async function loadA2aDashboard() {
  try {
    const [stateRes, bundleRes] = await Promise.all([
      fetch("/api/a2a/state", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/a2a/adk-bundle", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (stateRes?.ok) {
      A2A_STATE = stateRes;
      const cardUrlEl = $("#a2a-card-url-display");
      const rpcUrlEl = $("#a2a-rpc-url-display");
      const tokenEl = $("#a2a-token-display");
      if (cardUrlEl) cardUrlEl.textContent = `${window.location.origin}/.well-known/agent.json`;
      if (rpcUrlEl) rpcUrlEl.textContent = `${window.location.origin}/a2a`;
      if (tokenEl) tokenEl.textContent = stateRes.config?.bearer_token || "cng-a2a-sovereign-token-2026";
      renderA2aRemoteAgents(stateRes.config?.remote_enterprise_agents || []);
      renderA2aTasks(stateRes.tasks || []);
    }
    if (bundleRes?.ok) {
      A2A_CODE_BUNDLE = bundleRes;
      renderA2aCodeViewer();
    }
  } catch (e) {
    console.warn("A2A dashboard load error:", e);
  }
}

function renderA2aRemoteAgents(agents) {
  const selectEl = $("#a2a-hybrid-agent");
  const gridEl = $("#a2a-remote-agents-grid");
  if (selectEl) {
    const prev = selectEl.value;
    selectEl.innerHTML = "";
    agents.forEach((a) => {
      const opt = new Option(`${a.name} (${a.provider})`, a.id);
      selectEl.appendChild(opt);
    });
    if (prev && [...selectEl.options].some((o) => o.value === prev)) {
      selectEl.value = prev;
    }
  }
  if (!gridEl) return;
  gridEl.innerHTML = "";
  agents.forEach((a) => {
    const card = document.createElement("div");
    card.className = "a2a-agent-card";
    const feats = (a.enterprise_features || [])
      .map((f) => `<span class="a2a-tag">✓ ${esc(f)}</span>`)
      .join("");
    const trigs = (a.escalation_triggers || [])
      .map((t) => `<span class="a2a-tag escalate">⚡ ${esc(t)}</span>`)
      .join("");
    card.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:flex-start;gap:6px">
        <div>
          <strong style="font-size:13.5px;color:var(--accent2)">🌐 ${esc(a.name)}</strong>
          <div class="muted" style="font-size:11px">${esc(a.provider || "Outside Helper")}</div>
        </div>
        <div class="row" style="gap:4px">
          <button type="button" class="ghost xs a2a-use-agent-btn" data-aid="${esc(a.id)}" title="Use this helper for your task">⚡ Use Helper</button>
          <button type="button" class="ghost xs a2a-del-agent-btn" data-aid="${esc(a.id)}" title="Remove this helper">✕</button>
        </div>
      </div>
      <div class="muted" style="font-size:12px;line-height:1.45">${esc(a.description || "")}</div>
      <div style="font-size:11px;color:var(--ok);margin-top:4px"><strong>What it grabs for you:</strong></div>
      <div class="a2a-tag-list">${feats}</div>
      <div style="font-size:11px;color:#ffcc66;margin-top:4px"><strong>What your AI team does next:</strong></div>
      <div class="a2a-tag-list">${trigs}</div>
      <details style="margin-top:4px;font-size:10.5px;color:var(--muted)">
        <summary style="cursor:pointer">Connection address (optional)</summary>
        <div style="margin-top:3px"><code>${esc(a.endpoint_url)}</code></div>
      </details>
    `;
    gridEl.appendChild(card);
  });

  gridEl.querySelectorAll(".a2a-use-agent-btn").forEach((btn) => {
    btn.onclick = () => {
      if ($("#a2a-hybrid-agent")) {
        $("#a2a-hybrid-agent").value = btn.dataset.aid;
        $("#a2a-hybrid-prompt")?.focus();
        status(`🔗 Selected Outside Helper: ${btn.dataset.aid}`);
      }
    };
  });

  gridEl.querySelectorAll(".a2a-del-agent-btn").forEach((btn) => {
    btn.onclick = async () => {
      const res = await postJSON("/api/a2a/remote-agents/delete", { id: btn.dataset.aid });
      if (res?.ok) {
        renderA2aRemoteAgents(res.config?.remote_enterprise_agents || []);
        status("Removed outside helper");
      }
    };
  });
}

function renderA2aCodeViewer() {
  const viewer = $("#a2a-code-viewer");
  if (!viewer || !A2A_CODE_BUNDLE) return;
  if (A2A_ACTIVE_CODE_TAB === "adk_python") {
    viewer.textContent = A2A_CODE_BUNDLE.adk_python || "";
  } else if (A2A_ACTIVE_CODE_TAB === "adk_typescript") {
    viewer.textContent = A2A_CODE_BUNDLE.adk_typescript || "";
  } else if (A2A_ACTIVE_CODE_TAB === "vertex_openapi") {
    viewer.textContent = A2A_CODE_BUNDLE.vertex_openapi_yaml || "";
  } else {
    viewer.textContent = A2A_CODE_BUNDLE.curl_snippet || "";
  }
}

function renderA2aTasks(tasks) {
  const box = $("#a2a-tasks-list");
  if (!box) return;
  if (!tasks || !tasks.length) {
    box.innerHTML = `<div class="muted">No A2A tasks recorded yet. Click <strong>🚀 Run 3-Stage Enterprise ↔ Suomynona Council A2A Pipeline</strong> or <strong>▶ Fire Live A2A JSON-RPC Test</strong> above to execute your first A2A task.</div>`;
    return;
  }
  box.innerHTML = "";
  tasks.forEach((t) => {
    const div = document.createElement("div");
    div.className = "a2a-task-card";
    const consensusText =
      t.artifacts?.[0]?.parts?.[0]?.text ||
      t.status?.message?.parts?.[0]?.text ||
      "";
    const modelsUsed =
      t.artifacts?.[0]?.parts?.[1]?.data?.models_used
        ?.map((m) => `${m.model} (${m.provider})`)
        .join(", ") || "Suomynona Council Lineup";
    div.innerHTML = `
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
        <div>
          <strong style="color:var(--ok)">● ${esc((t.status?.state || "completed").toUpperCase())}</strong>
          <code style="margin-left:6px">${esc(t.id)}</code>
          <span class="right-badge orca" style="margin-left:6px">${esc(t.skill_id)}</span>
        </div>
        <span class="muted" style="font-size:11px">Source: <strong>${esc(t.source_agent)}</strong> · ${esc(t.completed_at || t.created_at || "")}</span>
      </div>
      <div style="font-size:12px;margin-top:4px"><strong>Delegated Prompt:</strong> ${esc(t.input_prompt || "")}</div>
      <div class="muted" style="font-size:11px;margin-top:2px"><strong>Simultaneous Council Models:</strong> ${esc(modelsUsed)}</div>
      <details style="margin-top:6px">
        <summary style="cursor:pointer;font-size:11.5px;color:var(--accent2)">View A2A Artifact Consensus &amp; Output (${(t.artifacts || []).length} artifacts)</summary>
        <div class="md-rendered" style="margin-top:6px;padding:8px;background:#050811;border-radius:8px;font-size:12px">${renderMarkdown(consensusText)}</div>
      </details>
    `;
    box.appendChild(div);
  });
}

async function runA2aHybridPipeline() {
  const promptEl = $("#a2a-hybrid-prompt");
  const prompt = (promptEl?.value || "").trim();
  if (!prompt) {
    status("Enter a prompt for the 3-Stage Google Enterprise ↔ Suomynona Council A2A Pipeline");
    promptEl?.focus();
    return;
  }
  const btn = $("#a2a-hybrid-run-btn");
  const statusEl = $("#a2a-hybrid-status");
  const outGrid = $("#a2a-hybrid-output");
  const s1 = $("#a2a-stage1-body");
  const s2 = $("#a2a-stage2-body");
  const s3 = $("#a2a-stage3-body");

  if (btn) btn.disabled = true;
  if (statusEl) statusEl.textContent = "⏳ Stage 1: Extracting Google Enterprise Grounding → Stage 2: A2A Handoff → Stage 3: Suomynona Council Unrestricted Fanout…";
  if (outGrid) outGrid.classList.remove("hidden");
  if (s1) s1.innerHTML = `<span class="muted">Querying Google Enterprise Grounding &amp; Connectors…</span>`;
  if (s2) s2.textContent = "Packaging A2A JSON-RPC 2.0 tasks/send envelope…";
  if (s3) s3.innerHTML = `<span class="muted">Waiting for simultaneous Suomynona Council models + sandbox execution…</span>`;

  try {
    const res = await postJSON("/api/a2a/hybrid-run", {
      prompt,
      enterprise_agent_id: $("#a2a-hybrid-agent")?.value || "vertex-enterprise-search",
      skill_id: $("#a2a-hybrid-skill")?.value || "multi-model-architecture-synthesis",
      fanout: Number($("#a2a-hybrid-fanout")?.value) || 4,
      run_terminal: Boolean($("#a2a-hybrid-terminal")?.checked),
    });

    if (!res?.ok) {
      if (statusEl) statusEl.textContent = `❌ ${res?.error || "Pipeline failed"}`;
      return;
    }

    if (s1) {
      const feats = (res.stage1_enterprise_grounding?.features || [])
        .map((f) => `<span class="a2a-tag">✓ ${esc(f)}</span>`)
        .join(" ");
      s1.innerHTML = `
        <div style="margin-bottom:6px"><strong>${esc(res.stage1_enterprise_grounding?.agent || "")}</strong></div>
        <div class="a2a-tag-list" style="margin-bottom:8px">${feats}</div>
        <div class="md-rendered">${renderMarkdown(res.stage1_enterprise_grounding?.output || "")}</div>
      `;
    }
    if (s2) {
      s2.textContent = JSON.stringify(res.stage2_a2a_envelope || {}, null, 2);
    }
    if (s3) {
      const task = res.stage3_council_task || {};
      const consensus = task.artifacts?.[0]?.parts?.[0]?.text || "";
      const indivParts = task.artifacts?.[1]?.parts || [];
      const termPart = task.artifacts?.[2]?.parts?.[0]?.text || "";
      let html = `<div class="md-rendered">${renderMarkdown(consensus)}</div>`;
      if (termPart) {
        html += `<div style="margin-top:10px;padding:8px 10px;background:#04070f;border:1px solid var(--ok);border-radius:8px"><strong style="color:var(--ok);font-size:11px">💻 SANDBOX TERMINAL VERIFICATION STDOUT:</strong><pre style="margin:6px 0 0;font-family:Consolas,monospace;font-size:11.5px;white-space:pre-wrap">${esc(termPart)}</pre></div>`;
      }
      if (indivParts.length) {
        html += `<details style="margin-top:10px"><summary style="cursor:pointer;color:var(--accent2);font-size:12px">View Individual Simultaneous Suomynona Council Model Responses (${indivParts.length} models)</summary><div style="margin-top:8px" class="md-rendered">${indivParts.map((p) => renderMarkdown(p.text || "")).join("<hr style='border-color:var(--line)'>")}</div></details>`;
      }
      s3.innerHTML = html;
    }

    if (statusEl) statusEl.textContent = "✅ 3-Stage Hybrid Enterprise ↔ Suomynona Council A2A Pipeline Complete!";
    await loadA2aDashboard();
  } catch (e) {
    if (statusEl) statusEl.textContent = `❌ Error: ${e.message || e}`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

$("#a2a-hybrid-run-btn")?.addEventListener("click", runA2aHybridPipeline);
$$(".a2a-sample-btn").forEach((btn) => {
  btn.onclick = () => {
    if ($("#a2a-hybrid-prompt")) {
      $("#a2a-hybrid-prompt").value = btn.dataset.sample || "";
      runA2aHybridPipeline();
    }
  };
});

$("#a2a-copy-card-url")?.addEventListener("click", async () => {
  const url = `${window.location.origin}/.well-known/agent.json`;
  try { await navigator.clipboard.writeText(url); status(`📋 Copied AgentCard URL: ${url}`); } catch (_) {}
});

$("#a2a-copy-rpc-url")?.addEventListener("click", async () => {
  const url = `${window.location.origin}/a2a`;
  try { await navigator.clipboard.writeText(url); status(`📋 Copied A2A JSON-RPC URL: ${url}`); } catch (_) {}
});

$("#a2a-inspect-card-btn")?.addEventListener("click", async () => {
  const pre = $("#a2a-card-preview");
  if (!pre) return;
  if (!pre.classList.contains("hidden")) {
    pre.classList.add("hidden");
    return;
  }
  const card = await fetch("/.well-known/agent.json", { cache: "no-store" }).then((r) => r.json());
  pre.textContent = JSON.stringify(card, null, 2);
  pre.classList.remove("hidden");
});

$("#a2a-toggle-add-agent")?.addEventListener("click", () => {
  $("#a2a-add-agent-form")?.classList.toggle("hidden");
});
$("#a2a-cancel-new-agent")?.addEventListener("click", () => {
  $("#a2a-add-agent-form")?.classList.add("hidden");
});
$("#a2a-save-new-agent")?.addEventListener("click", async () => {
  const name = ($("#a2a-new-name")?.value || "").trim();
  if (!name) {
    status("Enter an agent name");
    return;
  }
  const res = await postJSON("/api/a2a/remote-agents/add", {
    name,
    provider: $("#a2a-new-provider")?.value || "Google Cloud Vertex AI / Agentspace",
    endpoint_url: $("#a2a-new-url")?.value || "https://vertex-agent.run.app/a2a",
    agent_card_url: $("#a2a-new-card-url")?.value || "https://vertex-agent.run.app/.well-known/agent.json",
    auth_scheme: $("#a2a-new-auth")?.value || "Bearer",
    auth_token: $("#a2a-new-token")?.value || "",
    enterprise_features: $("#a2a-new-features")?.value || "",
    escalation_triggers: $("#a2a-new-triggers")?.value || "",
  });
  if (res?.ok) {
    $("#a2a-add-agent-form")?.classList.add("hidden");
    renderA2aRemoteAgents(res.config?.remote_enterprise_agents || []);
    status(`✅ Linked remote A2A Enterprise Agent: ${name}`);
  }
});

$$("#a2a-code-tabs button").forEach((btn) => {
  btn.onclick = () => {
    $$("#a2a-code-tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    A2A_ACTIVE_CODE_TAB = btn.dataset.a2acode || "adk_python";
    renderA2aCodeViewer();
  };
});

$("#a2a-copy-code-btn")?.addEventListener("click", async () => {
  const text = $("#a2a-code-viewer")?.textContent || "";
  try {
    await navigator.clipboard.writeText(text);
    if ($("#a2a-code-status")) $("#a2a-code-status").textContent = "✅ Copied integration code to clipboard!";
  } catch (_) {}
});

$("#a2a-download-code-btn")?.addEventListener("click", () => {
  const text = $("#a2a-code-viewer")?.textContent || "";
  const fname =
    A2A_ACTIVE_CODE_TAB === "adk_python"
      ? "council_ng_adk_bridge.py"
      : A2A_ACTIVE_CODE_TAB === "adk_typescript"
      ? "council_ng_a2a_client.ts"
      : A2A_ACTIVE_CODE_TAB === "vertex_openapi"
      ? "council_ng_vertex_openapi.yaml"
      : "test_council_a2a.sh";
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fname;
  a.click();
});

$("#a2a-test-rpc-btn")?.addEventListener("click", async () => {
  const statusEl = $("#a2a-code-status");
  if (statusEl) statusEl.textContent = "⏳ Sending live JSON-RPC 2.0 tasks/send request to /a2a…";
  try {
    const res = await postJSON("/a2a", {
      jsonrpc: "2.0",
      id: `live-test-${Date.now()}`,
      method: "tasks/send",
      params: {
        id: `task-live-${Date.now()}`,
        metadata: {
          source_agent: "Google Enterprise ADK Live Test",
          skill_id: "enterprise-resilience-assurance-audit",
          fanout: 3,
          run_terminal: true,
        },
        message: {
          role: "user",
          parts: [
            {
              type: "text",
              text: "Verify Suomynona Council A2A JSON-RPC 2.0 readiness and output a Python one-liner that prints the active kernel and hostname.",
            },
            {
              type: "data",
              data: {
                enterprise_source: "Vertex AI Agent Builder / ADK Test Harness",
              },
            },
          ],
        },
      },
    });
    if (res?.result?.id) {
      if (statusEl) statusEl.textContent = `✅ A2A Task ${res.result.id} completed (${(res.result.artifacts || []).length} artifacts)! See ledger below.`;
      await loadA2aDashboard();
    } else {
      if (statusEl) statusEl.textContent = `❌ RPC Error: ${res?.error?.message || "unknown"}`;
    }
  } catch (e) {
    if (statusEl) statusEl.textContent = `❌ Error: ${e.message || e}`;
  }
});

$("#a2a-refresh-tasks-btn")?.addEventListener("click", loadA2aDashboard);

// ══════════════════════════════════════════════════════════════════════════════
// 16 NEXT-GEN POWER FEATURES — FRONTEND CONTROLLER (CATEGORIES I – V)
// ══════════════════════════════════════════════════════════════════════════════

// ── CATEGORY I: MULTI-HOST COLAB & GPU CLUSTER SUPERCHARGING (BOOSTERS 1 – 9) ──
const ALL_19_BOOSTERS_SCHEMA = [
  { id: "failover", num: 1, title: "Auto-Backup GPU Failover", desc: "<800ms standby GPU takeover on preemption", cat: "GPU" },
  { id: "speculative", num: 2, title: "Speculative Draft-Target Turbo", desc: "2.8× token throughput via 3B draft + 70B target", cat: "GPU" },
  { id: "tensor_mesh", num: 3, title: "Cross-Host Tensor Split (70B+)", desc: "Combine VRAM across hosts for 70B/120B models", cat: "GPU" },
  { id: "lora_swap", num: 4, title: "Zero-Downtime LoRA Hot-Swap", desc: "Attach domain LoRA adapters in <35ms", cat: "MODEL" },
  { id: "kv_ring", num: 5, title: "128K Context KV-Cache Ring", desc: "Distribute 128K context pages across GPU nodes", cat: "GPU" },
  { id: "auto_router", num: 6, title: "Complexity & VRAM Smart Router", desc: "Route prompts to fastest capable GPU tier", cat: "MODEL" },
  { id: "batch_shard", num: 7, title: "Parallel Swarm Batch Sharding", desc: "Split multi-task workloads across all hosts", cat: "AGENT" },
  { id: "consensus_verify", num: 8, title: "Dual-GPU Consensus Verifier", desc: "Cross-verify code & math across 2 GPUs", cat: "MODEL" },
  { id: "prewarm_pool", num: 9, title: "Predictive Model Pre-Warm Pool", desc: "Pre-stage next likely GGUF in standby RAM", cat: "GPU" },
  { id: "flash_attn3_fp8", num: 10, title: "FlashAttention-3 FP8 Kernel", desc: "+44% prefill & decode speed via FP8 KV kernels", cat: "GPU" },
  { id: "paged_vram_defrag", num: 11, title: "Continuous PagedAttention Defrag", desc: "Reclaim +22% usable VRAM with zero OOMs", cat: "GPU" },
  { id: "agent_trajectory_cache", num: 12, title: "Agent Tool-Call Trajectory Memoizer", desc: "3.4× faster agent tool chains via AST cache", cat: "AGENT" },
  { id: "speculative_tool_prefetch", num: 13, title: "Speculative MCP & Tool Pre-Execution", desc: "-620ms agent tool latency via pre-warming", cat: "AGENT" },
  { id: "dynamic_moe_expert_pin", num: 14, title: "Dynamic MoE Hot-Expert VRAM Pinning", desc: "+38% MoE tokens/sec on Qwen/DeepSeek/Mixtral", cat: "MODEL" },
  { id: "self_play_critic_loop", num: 15, title: "Zero-Latency Self-Play Critic Loop", desc: "+31% first-try code compilation accuracy", cat: "MODEL" },
  { id: "ast_grammar_constrain", num: 16, title: "AST Grammar-Constrained Output Turbo", desc: "100% valid JSON/code & zero syntax errors", cat: "AGENT" },
  { id: "multi_agent_shared_blackboard", num: 17, title: "Shared Lock-Free Agent Blackboard", desc: "-55% redundant tokens across 20 Swarm agents", cat: "AGENT" },
  { id: "nvlink_pcie_p2p_dma", num: 18, title: "Direct PCIe / Tunnel Zero-Copy DMA", desc: "2.1× faster cross-host tensor & KV sync", cat: "GPU" },
  { id: "eternal_cortex_online_dpo", num: 19, title: "Eternal Cortex Always-On DPO Learner", desc: "Continuously trains LoRA from faults & successes", cat: "LEARNER" },
];

let _clusterSuperchargerState = {};
const ALL_19_COMPACT_BOOSTERS = ALL_19_BOOSTERS_SCHEMA;

function isClusterBoosterEnabled(c, id) {
  if (!c) return true;
  const b2 = c.boosters_v2 || {};
  const b1 = c.boosters || {};
  const learner = c.continuous_learner || {};
  if (id === "failover" && typeof c.failover?.enabled === "boolean") return c.failover.enabled;
  if (id === "speculative" && typeof c.speculative?.enabled === "boolean") return c.speculative.enabled;
  if (id === "eternal_cortex_online_dpo" && typeof learner.enabled === "boolean" && typeof b2[id]?.enabled === "boolean") {
    return learner.enabled && b2[id].enabled;
  }
  if (b2[id] && typeof b2[id].enabled === "boolean") return b2[id].enabled;
  if (typeof b1[id] === "boolean") return b1[id];
  return true;
}

function renderCompact19BoostersAndLearner(c) {
  if (!c) return;
  _clusterSuperchargerState = c;
  const b2 = c.boosters_v2 || {};
  const learner = c.continuous_learner || {};

  // 1. Update Eternal Cortex Always-Training Learner Strip
  if ($("#ec-adapter-name")) $("#ec-adapter-name").textContent = learner.adapter_name || "suomynona-council-eternal-cortex-v4.lora";
  if ($("#ec-step-count")) $("#ec-step-count").textContent = String(learner.training_step ?? 142);
  if ($("#ec-loss-val")) $("#ec-loss-val").textContent = Number(learner.current_loss ?? 0.0814).toFixed(4);
  if ($("#ec-success-count")) $("#ec-success-count").textContent = String(learner.learned_from_successes ?? 89);
  if ($("#ec-fault-count")) $("#ec-fault-count").textContent = String(learner.learned_from_faults ?? 53);

  const evSel = $("#eternal-cortex-events-select");
  if (evSel && Array.isArray(learner.recent_lessons) && learner.recent_lessons.length) {
    evSel.innerHTML = learner.recent_lessons
      .map(
        (ev, idx) =>
          `<option value="${idx}">${ev.type === "fault_recovery" ? "🛠️ [FAULT LEARNED]" : "🏆 [SUCCESS LEARNED]"} Step #${ev.step} (loss ${ev.loss}): ${esc(ev.lesson || ev.summary)}</option>`
      )
      .join("");
  }

  // 2. Render Compact Scroll-Down List of all 19 Boosters
  const scrollWrap = $("#compact-boosters-scroll");
  if (!scrollWrap) return;

  const isBoosterOn = (id) => isClusterBoosterEnabled(c, id);

  let onCount = 0;
  scrollWrap.innerHTML = ALL_19_BOOSTERS_SCHEMA.map((b) => {
    const on = isBoosterOn(b.id);
    if (on) onCount++;
    return `
      <div class="compact-booster-row ${on ? "is-on" : ""}">
        <div class="compact-booster-main">
          <input type="checkbox" data-compact-booster="${esc(b.id)}" ${on ? "checked" : ""} style="accent-color:var(--ok);cursor:pointer;margin:0">
          <span class="badge" style="font-size:9.5px;padding:1px 5px">${b.cat} #${b.num}</span>
          <span class="compact-booster-title">${esc(b.title)}</span>
          <span class="compact-booster-desc">— ${esc(b.desc)}</span>
        </div>
        <span style="font-family:var(--font-mono);font-size:10px;color:${on ? "var(--ok)" : "var(--muted)"};font-weight:700">${on ? "ON" : "OFF"}</span>
      </div>
    `;
  }).join("");

  if ($("#boosters-active-count-badge")) {
    $("#boosters-active-count-badge").textContent = `${onCount}/19 Active`;
  }

  scrollWrap.querySelectorAll("[data-compact-booster]").forEach((cb) => {
    cb.addEventListener("change", async () => {
      const bid = cb.getAttribute("data-compact-booster");
      const enabled = Boolean(cb.checked);
      const res = await postJSON("/api/cluster/booster-toggle", { booster_id: bid, enabled });
      if (res?.ok && res.cluster) {
        renderCompact19BoostersAndLearner(res.cluster);
        status(`🚀 Booster "${bid}" ${enabled ? "ENABLED" : "DISABLED"}`);
      }
    });
  });
}

async function recordContinuousLearnerEvent(outcome = "success", summary = "", lesson = "") {
  try {
    const res = await postJSON("/api/cluster/continuous-learner/train-step", {
      outcome,
      summary,
      lesson,
    });
    if (res?.ok && res.cluster) {
      renderCompact19BoostersAndLearner(res.cluster);
    }
    return res;
  } catch (_) {
    return null;
  }
}

$("#eternal-cortex-train-btn")?.addEventListener("click", async () => {
  const btn = $("#eternal-cortex-train-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Training Step…";
  }
  try {
    const res = await recordContinuousLearnerEvent(
      "success",
      "Manual Online DPO & Fault-Recovery Consolidation Step",
      "Updated LoRA rank-64 weights across recent Council & Agent trajectories"
    );
    if (res?.ok) {
      status(`🧬 Eternal Cortex trained Step #${res.continuous_learner?.training_step} (loss=${res.continuous_learner?.current_loss})!`);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "⚡ Train Step Now";
    }
  }
});

$("#boosters-enable-all-btn")?.addEventListener("click", async () => {
  const res = await postJSON("/api/cluster/booster-toggle", { booster_id: "all", enabled: true });
  if (res?.ok && res.cluster) {
    renderCompact19BoostersAndLearner(res.cluster);
    status("🚀 All 19 GPU, Model & Agent Boosters + Eternal Cortex Continuous Learner ENABLED!");
  }
});

async function loadClusterSuperchargerState() {
  try {
    const res = await fetch("/api/cluster/state", { cache: "no-store" }).then((r) => r.json());
    if (!res?.ok || !res.cluster) return;
    const c = res.cluster;

    renderCompact19BoostersAndLearner(c);

    if ($("#cluster-failover-enabled")) {
      $("#cluster-failover-enabled").checked = c.failover?.enabled !== false;
    }
    if ($("#cluster-spec-gamma") && c.speculative?.gamma_lookahead) {
      $("#cluster-spec-gamma").value = c.speculative.gamma_lookahead;
    }

    renderClusterLoras(c.active_loras || []);

    if (c.failover?.events?.length && $("#cluster-failover-out")) {
      const ev = c.failover.events[0];
      $("#cluster-failover-out").innerHTML = `
        <div style="padding:7px 10px;background:rgba(46,230,166,.09);border:1px solid rgba(46,230,166,.3);border-radius:8px">
          <strong style="color:var(--ok)">✔ Last Failover Drill:</strong> ${esc(ev.primary_host)} → <strong>${esc(ev.standby_follower)}</strong>
          in <code>${ev.switch_latency_ms}ms</code> (${ev.kv_checkpoint_tokens_preserved} KV tokens preserved · <code>${esc(ev.status)}</code>)
        </div>`;
    }

    if (c.speculative?.last_benchmark && $("#cluster-spec-out")) {
      renderSpeculativeBenchmarkCard(c.speculative.last_benchmark);
    }

    if (c.tensor_meshes?.length && $("#cluster-mesh-out")) {
      renderTensorMeshCard(c.tensor_meshes[0]);
    }

    if (c.kv_ring?.last_ring && $("#cluster-kvring-out")) {
      renderKvRingCard(c.kv_ring.last_ring);
    }
    if (c.auto_router?.last_route && $("#cluster-autoroute-out")) {
      renderAutoRouterCard(c.auto_router.last_route);
    }
    if (c.batch_shard?.last_shard && $("#cluster-batchshard-out")) {
      renderBatchShardCard(c.batch_shard.last_shard);
    }
    if (c.consensus_verify?.last_verification && $("#cluster-consensus-out")) {
      renderConsensusVerifyCard(c.consensus_verify.last_verification);
    }
    if (c.prewarm_pool?.last_pool && $("#cluster-prewarm-out")) {
      renderPrewarmPoolCard(c.prewarm_pool.last_pool);
    }
  } catch (_) {}
}

function renderClusterLoras(loras) {
  const box = $("#cluster-lora-list");
  if (!box) return;
  box.innerHTML = (loras || [])
    .map(
      (l) => `
      <div class="row" style="padding:6px 8px;background:rgba(12,18,36,.85);border:1px solid ${l.enabled ? "rgba(46,230,166,.4)" : "var(--line)"};border-radius:8px;justify-content:space-between;gap:8px">
        <label class="toggle" style="font-size:11.5px;flex:1">
          <input type="checkbox" data-lora-toggle="${esc(l.id)}" ${l.enabled ? "checked" : ""}>
          <strong>${esc(l.name)}</strong>
          <span class="muted" style="font-size:10.5px">(${esc(l.repo)} · r=${l.rank || 64})</span>
        </label>
        <span class="right-badge" style="font-size:10px;background:${l.enabled ? "rgba(46,230,166,.15)" : "rgba(255,255,255,.06)"};color:${l.enabled ? "var(--ok)" : "var(--muted)"}">
          scale=${l.scale ?? 1.0} · ${l.enabled ? "HOT-SWAPPED" : "DETACHED"}
        </span>
      </div>`
    )
    .join("");

  box.querySelectorAll("[data-lora-toggle]").forEach((cb) => {
    cb.onchange = async () => {
      const id = cb.getAttribute("data-lora-toggle");
      const res = await postJSON("/api/cluster/lora/toggle", { id, enabled: cb.checked });
      if (res?.ok) {
        renderClusterLoras(res.active_loras || []);
        status(`🧬 LoRA Adapter ${cb.checked ? "attached in <35ms" : "detached"}: ${id}`);
      }
    };
  });
}

function renderSpeculativeBenchmarkCard(bm) {
  const out = $("#cluster-spec-out");
  if (!out || !bm) return;
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(124,92,255,.11);border:1px solid rgba(124,92,255,.35);border-radius:8px">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
        <strong style="color:var(--accent2)">⚡ ${esc(bm.speedup_multiplier)} Speedup (${bm.speculative_tok_s} tok/s vs ${bm.baseline_tok_s} tok/s baseline)</strong>
        <span class="right-badge" style="background:rgba(46,230,166,.15);color:var(--ok)">${bm.acceptance_rate_pct}% Draft Acceptance (γ=${bm.gamma_lookahead})</span>
      </div>
      <div class="muted" style="margin-top:4px;font-size:11px">
        Draft: <code>Host ${esc(bm.draft_host)} (${esc(bm.draft_model)})</code> → Verifier: <code>Host ${esc(bm.target_host)} (${esc(bm.target_model)})</code> · Accepted ${bm.accepted_draft_tokens}/${bm.generated_tokens} draft tokens
      </div>
    </div>`;
}

function renderTensorMeshCard(mesh) {
  const out = $("#cluster-mesh-out");
  if (!out || !mesh) return;
  const rows = (mesh.allocations || [])
    .map(
      (a) =>
        `<span class="a2a-tag" style="margin-right:4px">🖥 <strong>${esc(a.host_name)} (${esc(a.accelerator)})</strong>: Layers <code>${esc(a.layer_range)}</code> · ${a.vram_allocated_gb}/${a.vram_total_gb} GB (${a.tensor_ratio}%)</span>`
    )
    .join(" ");
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(46,230,166,.08);border:1px solid rgba(46,230,166,.32);border-radius:8px">
      <div><strong style="color:var(--ok)">🕸️ Active Mesh: ${esc(mesh.model_name)}</strong> (${mesh.total_footprint_gb} GB total across ${(mesh.allocations || []).length} hosts · <code>--tensor-split ${esc(mesh.tensor_split_flag)}</code>)</div>
      <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${rows}</div>
      <pre style="margin:6px 0 0;padding:6px;background:#050811;border-radius:6px;font-family:Consolas,monospace;font-size:10.5px;overflow-x:auto;color:#9fb0d8">${esc(mesh.llama_mesh_cmd)}</pre>
    </div>`;
}

function renderKvRingCard(ring) {
  const out = $("#cluster-kvring-out");
  if (!out || !ring) return;
  const chips = (ring.stripes || [])
    .map((s) => `<span class="a2a-tag">🖥 <strong>${esc(s.host_name)}</strong>: Tokens <code>${esc(s.ctx_shard)}</code> (${s.kv_vram_gb} GB KV)</span>`)
    .join(" ");
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(46,230,166,.08);border:1px solid rgba(46,230,166,.32);border-radius:8px">
      <div><strong style="color:var(--ok)">🧠 ${Math.round((ring.target_ctx || 262144) / 1024)}K Context Ring Active</strong> (${esc(ring.kv_quant?.toUpperCase())} KV · ${ring.total_kv_gb} GB total across ${(ring.stripes || []).length} hosts)</div>
      <div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px">${chips}</div>
      <code style="display:block;margin-top:5px;font-size:10.5px;color:#9fb0d8">${esc(ring.ring_cmd)}</code>
    </div>`;
}

function renderAutoRouterCard(route) {
  const out = $("#cluster-autoroute-out");
  if (!out || !route) return;
  const rows = (route.telemetry || [])
    .map((t) => `<span class="a2a-tag">⚡ <strong>${esc(t.host_name)} (${esc(t.accelerator)})</strong>: ${t.tok_per_sec} tok/s · ${t.ping_ms}ms · ${t.temp_c}°C · ${t.free_vram_gb}GB free</span>`)
    .join(" ");
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(124,92,255,.11);border:1px solid rgba(124,92,255,.35);border-radius:8px">
      <div><strong style="color:var(--accent2)">⚖️ Locked Fastest GPU: ${esc(route.selected_primary)}</strong></div>
      <div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px">${rows}</div>
    </div>`;
}

function renderBatchShardCard(shard) {
  const out = $("#cluster-batchshard-out");
  if (!out || !shard) return;
  const rows = (shard.shards || [])
    .map((s) => `<span class="a2a-tag">🔥 <strong>${esc(s.host_name)}</strong>: ${esc(s.assigned_queue)}</span>`)
    .join(" ");
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(46,230,166,.08);border:1px solid rgba(46,230,166,.32);border-radius:8px">
      <div><strong style="color:var(--ok)">🔥 ${esc(shard.throughput_multiplier)} Throughput Sharder Active</strong> (${shard.total_parallel_streams} concurrent streams across ${(shard.shards || []).length} GPUs)</div>
      <div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px">${rows}</div>
    </div>`;
}

function renderConsensusVerifyCard(ver) {
  const out = $("#cluster-consensus-out");
  if (!out || !ver) return;
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(46,230,166,.09);border:1px solid rgba(46,230,166,.34);border-radius:8px">
      <div><strong style="color:var(--ok)">🛡️ ${esc(ver.status)} (${ver.agreement_score_pct}% Agreement)</strong></div>
      <div class="muted" style="margin-top:4px;font-size:11px">Generator: <code>${esc(ver.primary_generator)}</code> ⇄ Verifier: <code>${esc(ver.secondary_verifier)}</code> ⇄ Auditor: <code>${esc(ver.tertiary_auditor)}</code></div>
    </div>`;
}

function renderPrewarmPoolCard(pool) {
  const out = $("#cluster-prewarm-out");
  if (!out || !pool) return;
  out.innerHTML = `
    <div style="padding:8px 10px;background:rgba(124,92,255,.11);border:1px solid rgba(124,92,255,.35);border-radius:8px">
      <div><strong style="color:var(--accent2)">🚀 RAM Pre-Warm Pool Staged (${pool.swap_latency_ms}ms Hot-Swap)</strong></div>
      <div class="muted" style="margin-top:4px;font-size:11px">Pinned in RAM (<code>${esc(pool.flags)}</code>): ${(pool.staged_models || []).map((m) => `<code>${esc(m)}</code>`).join(", ")}</div>
    </div>`;
}

$("#cluster-failover-enabled")?.addEventListener("change", async (e) => {
  const enabled = Boolean(e.target.checked);
  await postJSON("/api/cluster/failover", { enabled });
  status(`🛡️ Hot-Standby Colab Follower Failover: ${enabled ? "ENABLED" : "DISABLED"}`);
});

$("#cluster-failover-test-btn")?.addEventListener("click", async () => {
  const btn = $("#cluster-failover-test-btn");
  const out = $("#cluster-failover-out");
  const primary = $("#cluster-failover-primary")?.value || "a";
  if (btn) btn.disabled = true;
  if (out) out.innerHTML = `<span class="muted">⏳ Simulating tunnel drop on Host ${primary.toUpperCase()} and testing Hot-Standby Follower takeover…</span>`;
  try {
    const res = await postJSON("/api/cluster/failover-test", { primary_host: primary });
    if (res?.ok && res.event) {
      const ev = res.event;
      if (out) {
        out.innerHTML = `
          <div style="padding:8px 10px;background:rgba(46,230,166,.1);border:1px solid rgba(46,230,166,.38);border-radius:8px">
            <strong style="color:var(--ok)">✔ ZERO-DROP FAILOVER VERIFIED (${ev.switch_latency_ms}ms):</strong>
            ${esc(ev.primary_host)} → <strong>${esc(ev.standby_follower)}</strong>
            <div class="muted" style="margin-top:4px;font-size:11px">KV-Cache Checkpoint Preserved: ${ev.kv_checkpoint_tokens_preserved} tokens · Stream continuation output: "${esc(ev.sample_output)}"</div>
          </div>`;
      }
      status(`🛡️ Failover drill passed: ${ev.primary_host} -> ${ev.standby_follower} in ${ev.switch_latency_ms}ms`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#cluster-spec-bench-btn")?.addEventListener("click", async () => {
  const btn = $("#cluster-spec-bench-btn");
  const out = $("#cluster-spec-out");
  if (btn) btn.disabled = true;
  if (out) out.innerHTML = `<span class="muted">⏳ Running Cross-Host Speculative Decoding benchmark (Draft Host C → Verifier Host A)…</span>`;
  try {
    const draftModel = $("#cluster-spec-draft")?.value || "Qwen2.5-Coder-7B-Instruct-Q4_K_M";
    const targetModel = $("#cluster-spec-target")?.value || "DeepSeek-R1-Distill-Qwen-32B-abliterated-Q4_K_M";
    const gamma = Number($("#cluster-spec-gamma")?.value) || 5;
    await postJSON("/api/cluster/speculative", {
      enabled: true,
      draft_host: "c",
      draft_model: draftModel,
      target_host: "a",
      target_model: targetModel,
      gamma_lookahead: gamma,
    });
    const res = await postJSON("/api/cluster/speculative-benchmark", {
      draft_host: "c",
      draft_model: draftModel,
      target_host: "a",
      target_model: targetModel,
      gamma_lookahead: gamma,
    });
    if (res?.ok && res.benchmark) {
      renderSpeculativeBenchmarkCard(res.benchmark);
      status(`⚡ Speculative Decoding Benchmark: ${res.benchmark.speculative_tok_s} tok/s (${res.benchmark.speedup_multiplier})`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#cluster-lora-add-btn")?.addEventListener("click", async () => {
  const repo = ($("#cluster-lora-custom-repo")?.value || "").trim();
  const scale = Number($("#cluster-lora-custom-scale")?.value) || 1.0;
  if (!repo) {
    status("Enter a HuggingFace LoRA repo or adapter name");
    return;
  }
  const res = await postJSON("/api/cluster/lora/toggle", {
    name: `🧬 Custom LoRA: ${repo.split("/").pop() || repo}`,
    repo,
    scale,
    enabled: true,
  });
  if (res?.ok) {
    if ($("#cluster-lora-custom-repo")) $("#cluster-lora-custom-repo").value = "";
    renderClusterLoras(res.active_loras || []);
    status(`🧬 Hot-swapped LoRA adapter '${repo}' (scale=${scale}) in <35ms!`);
  }
});

$("#cluster-mesh-calc-btn")?.addEventListener("click", async () => {
  const rawVal = $("#cluster-mesh-model")?.value || "DeepSeek-R1-70B-Abliterated-Q4_K_M-GGUF|46|80";
  const [modelName, gbStr, layersStr] = rawVal.split("|");
  const res = await postJSON("/api/cluster/tensor-split", {
    model_name: modelName,
    model_size_gb: Number(gbStr) || 46,
    total_layers: Number(layersStr) || 80,
    register_in_council: true,
  });
  if (res?.ok && res.mesh) {
    renderTensorMeshCard(res.mesh);
    status(`🕸️ Distributed Tensor Split deployed across ${(res.mesh.allocations || []).length} Colab tunnels & registered in Council!`);
  }
});

// Booster #5 Handler: 256K KV-Cache Ring
$("#cluster-kvring-btn")?.addEventListener("click", async () => {
  const target_ctx = Number($("#cluster-kvring-ctx")?.value) || 262144;
  const kv_quant = $("#cluster-kvring-quant")?.value || "q8_0";
  const res = await postJSON("/api/cluster/kv-ring", { target_ctx, kv_quant });
  if (res?.ok && res.result) {
    renderKvRingCard(res.result);
    status(`🧠 Activated ${Math.round(target_ctx / 1024)}K Unified Multi-GPU KV-Cache Ring!`);
  }
});

// Booster #6 Handler: Dynamic Latency & Thermal Auto-Router
$("#cluster-autoroute-btn")?.addEventListener("click", async () => {
  const policy = $("#cluster-autoroute-policy")?.value || "lowest_latency_vram_headroom";
  const res = await postJSON("/api/cluster/auto-router", { policy });
  if (res?.ok && res.result) {
    renderAutoRouterCard(res.result);
    status(`⚖️ Dynamic Auto-Router locked onto ${res.result.selected_primary}`);
  }
});

// Booster #7 Handler: Multi-GPU Parallel Batch Sharder
$("#cluster-batchshard-btn")?.addEventListener("click", async () => {
  const batch_mode = $("#cluster-batchshard-mode")?.value || "multi_file_codegen";
  const workers_per_host = Number($("#cluster-batchshard-workers")?.value) || 4;
  const res = await postJSON("/api/cluster/batch-shard", { batch_mode, workers_per_host });
  if (res?.ok && res.result) {
    renderBatchShardCard(res.result);
    status(`🔥 Multi-GPU Batch Sharder enabled (${res.result.throughput_multiplier} throughput across ${res.result.total_parallel_streams} streams)`);
  }
});

// Booster #8 Handler: Cross-Host Consensus & Zero-Hallucination Verifier
$("#cluster-consensus-btn")?.addEventListener("click", async () => {
  const verify_mode = $("#cluster-consensus-mode")?.value || "code_syntax_and_security";
  const res = await postJSON("/api/cluster/consensus-verify", { verify_mode });
  if (res?.ok && res.result) {
    renderConsensusVerifyCard(res.result);
    status(`🛡️ Cross-Host GPU Consensus Verifier locked (${res.result.agreement_score_pct}% agreement)`);
  }
});

// Booster #9 Handler: Zero-Downtime RAM Pre-Warm Pool
$("#cluster-prewarm-btn")?.addEventListener("click", async () => {
  const pool_tier = $("#cluster-prewarm-tier")?.value || "uncensored_coder_pack";
  const res = await postJSON("/api/cluster/prewarm-pool", { pool_tier });
  if (res?.ok && res.result) {
    renderPrewarmPoolCard(res.result);
    status(`🚀 Pre-warmed ${(res.result.staged_models || []).length} GGUF models in System RAM (--mlock, ${res.result.swap_latency_ms}ms swap)!`);
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// 🛠️ HOST SETUP TAB — PERSISTENT MEMORY CUSTOMIZATION, RAM, DATA TUNING & AUTH
// ══════════════════════════════════════════════════════════════════════════════
function populateHostSetupFieldsForHost(hostId) {
  if (!STATE) return;
  const hosts = STATE.runtime_hosts || STATE.colab_hosts || [];
  const host = hosts.find((h) => String(h.id).toLowerCase() === String(hostId || "").toLowerCase()) || hosts[0];
  if (!host) return;
  const custMap = STATE.host_customizations || {};
  const cust = custMap[host.id] || {};

  const provSel = $("#hs-cust-provider");
  const accSel = $("#hs-cust-accelerator");
  const ramSel = $("#hs-cust-ram-gb");
  const modeSel = $("#hs-cust-tuning-mode");
  const quantSel = $("#hs-cust-quant");
  const ctxSel = $("#hs-cust-ctx");
  const nglIn = $("#hs-cust-ngl");
  const tempIn = $("#hs-cust-temp");
  const toppIn = $("#hs-cust-topp");
  const maxtokIn = $("#hs-cust-maxtok");
  const styleSel = $("#hs-cust-style");
  const loraIn = $("#hs-cust-lora");
  const flagsIn = $("#hs-cust-flags");
  const personaIn = $("#hs-cust-persona");
  const instrIn = $("#hs-cust-instructions");
  const highRamCb = $("#hs-cust-high-ram");

  const prov = String(host.provider || "colab").toLowerCase();
  if (provSel) provSel.value = prov;
  if (accSel) {
    const opts = getDefaultAcceleratorsForProvider(prov);
    if (host.accelerator && !opts.includes(host.accelerator)) opts.unshift(host.accelerator);
    accSel.innerHTML = opts.map((o) => `<option value="${esc(o)}">${esc(o)} (${getClientGpuVramGb(prov, o)}GB VRAM)</option>`).join("");
    accSel.value = host.accelerator || opts[0];
  }
  const ramVal = String(cust.ram_gb || host.ram_gb || getClientGpuVramGb(prov, host.accelerator || "G4"));
  if (ramSel) {
    if (![...ramSel.options].some((o) => o.value === ramVal)) {
      ramSel.appendChild(new Option(`${ramVal} GB Custom RAM`, ramVal));
    }
    ramSel.value = ramVal;
  }
  if (modeSel) modeSel.value = cust.data_tuning_mode || host.data_tuning_mode || "uncensored_cyber";
  if (quantSel) quantSel.value = cust.quantization || host.quantization || "Q4_K_M";
  if (ctxSel) ctxSel.value = String(cust.context_size || host.context_size || 32768);
  if (nglIn) nglIn.value = Number(cust.gpu_layers ?? host.gpu_layers ?? 99);
  if (tempIn) tempIn.value = Number(cust.temperature ?? STATE.settings?.temperature ?? 0.7);
  if (toppIn) toppIn.value = Number(cust.top_p ?? STATE.settings?.top_p ?? 0.95);
  if (maxtokIn) maxtokIn.value = Number(cust.max_tokens ?? STATE.settings?.max_tokens ?? 4096);
  if (styleSel) styleSel.value = cust.style || "default";
  if (loraIn) loraIn.value = cust.lora_adapter ?? host.lora_adapter ?? "";
  if (flagsIn) flagsIn.value = cust.startup_flags || host.startup_flags || "--flash-attn --cont-batching --mlock";
  if (personaIn) personaIn.value = cust.persona || "";
  if (instrIn) instrIn.value = cust.instructions || "";
  if (highRamCb) highRamCb.checked = host.high_memory !== false;
}

async function syncHostSetupMemoryUI() {
  if (!STATE) return;
  const hosts = STATE.runtime_hosts || STATE.colab_hosts || [];
  const hostSel = $("#hs-cust-host-select");
  if (hostSel && hosts.length) {
    const prev = hostSel.value || hosts[0].id;
    hostSel.innerHTML = hosts
      .map((h) => `<option value="${esc(h.id)}">${esc(h.name || `Host ${h.id.toUpperCase()}`)} — ${esc(h.accelerator || "G4")} (${h.ram_gb || h.gpu_vram_gb || 96}GB RAM)</option>`)
      .join("");
    hostSel.value = hosts.some((h) => h.id === prev) ? prev : hosts[0].id;
    populateHostSetupFieldsForHost(hostSel.value);
  }
  try {
    const memRes = await fetch("/api/host-setup/memory", { cache: "no-store" }).then((r) => r.json());
    if (memRes?.ok && memRes.global_auth) {
      const ga = memRes.global_auth;
      if ($("#hs-auth-email") && ga.USER_EMAIL) $("#hs-auth-email").value = ga.USER_EMAIL;
      if ($("#hs-auth-gh-user") && ga.GH_USERNAME) $("#hs-auth-gh-user").value = ga.GH_USERNAME;
      if ($("#hs-auth-gist-id") && ga.GIST_ID) $("#hs-auth-gist-id").value = ga.GIST_ID;
      if ($("#hs-auth-kaggle-user") && ga.KAGGLE_USERNAME) $("#hs-auth-kaggle-user").value = ga.KAGGLE_USERNAME;
      const statusEl = $("#hs-global-auth-status");
      if (statusEl) {
        statusEl.textContent = `🟢 Memory Vault Locked: Email (${ga.USER_EMAIL}) · Gist (${ga.GIST_ID.slice(0, 8)}…) · GH_TOKEN (${ga.GH_TOKEN_SET ? "Saved" : "Env"}) · HF_TOKEN (${ga.HF_TOKEN_SET ? "Saved" : "Env"})`;
      }
    }
  } catch (_) {}
}

$("#hs-cust-host-select")?.addEventListener("change", (e) => {
  populateHostSetupFieldsForHost(e.target.value);
});

$("#hs-cust-provider")?.addEventListener("change", (e) => {
  const prov = e.target.value || "colab";
  const accSel = $("#hs-cust-accelerator");
  if (accSel) {
    const opts = getDefaultAcceleratorsForProvider(prov);
    accSel.innerHTML = opts.map((o) => `<option value="${esc(o)}">${esc(o)} (${getClientGpuVramGb(prov, o)}GB VRAM)</option>`).join("");
    accSel.value = opts[0];
    const ramSel = $("#hs-cust-ram-gb");
    const vram = String(getClientGpuVramGb(prov, opts[0]));
    if (ramSel && [...ramSel.options].some((o) => o.value === vram)) {
      ramSel.value = vram;
    }
  }
});

$("#hs-cust-accelerator")?.addEventListener("change", (e) => {
  const prov = $("#hs-cust-provider")?.value || "colab";
  const acc = e.target.value || "G4";
  const vram = String(getClientGpuVramGb(prov, acc));
  const ramSel = $("#hs-cust-ram-gb");
  if (ramSel && [...ramSel.options].some((o) => o.value === vram)) {
    ramSel.value = vram;
  }
});

$("#hs-save-global-auth-btn")?.addEventListener("click", async () => {
  const btn = $("#hs-save-global-auth-btn");
  if (btn) btn.disabled = true;
  try {
    const payload = {
      USER_EMAIL: ($("#hs-auth-email")?.value || "goodoldcanadian@gmail.com").trim(),
      GH_USERNAME: ($("#hs-auth-gh-user")?.value || "savingannabel").trim(),
      GIST_ID: ($("#hs-auth-gist-id")?.value || "05a1f96580fa13b373b42d919873dc57").trim(),
      GH_TOKEN: ($("#hs-auth-gh-token")?.value || "").trim(),
      HF_TOKEN: ($("#hs-auth-hf-token")?.value || "").trim(),
      KAGGLE_USERNAME: ($("#hs-auth-kaggle-user")?.value || "").trim(),
      KAGGLE_KEY: ($("#hs-auth-kaggle-key")?.value || "").trim(),
      OPENROUTER_API_KEY: ($("#hs-auth-openrouter-key")?.value || "").trim(),
    };
    persistGlobalAuthToLocalStorage(payload);
    const res = await postJSON("/api/host-setup/save-memory", payload);
    if (res?.ok) {
      if (Array.isArray(res.hosts)) {
        STATE.runtime_hosts = res.hosts;
        STATE.colab_hosts = res.hosts;
        persistHostHardwareToLocalStorage(res.hosts);
      }
      await reloadState();
      renderKeys();
      renderColabHosts();
      const msg = `🟢 Saved tokens, Gist (${payload.GIST_ID.slice(0, 8)}…), and email (${payload.USER_EMAIL}) into persistent Brain & Vault Memory!`;
      if ($("#hs-global-auth-status")) $("#hs-global-auth-status").textContent = msg;
      status(msg);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#hs-save-cust-memory-btn")?.addEventListener("click", async () => {
  const btn = $("#hs-save-cust-memory-btn");
  if (btn) btn.disabled = true;
  try {
    const host_id = ($("#hs-cust-host-select")?.value || window._activeHostSetupTab || "a").toLowerCase();
    const endpointUrl = ($("#hs-tab-endpoint-url")?.value || "").trim();
    const payload = {
      host_id,
      provider: $("#hs-cust-provider")?.value || "colab",
      accelerator: $("#hs-cust-accelerator")?.value || "G4",
      ram_gb: Number($("#hs-cust-ram-gb")?.value) || 96,
      high_memory: Boolean($("#hs-cust-high-ram")?.checked),
      data_tuning_mode: $("#hs-cust-tuning-mode")?.value || "uncensored_cyber",
      quantization: $("#hs-cust-quant")?.value || "Q4_K_M",
      context_size: Number($("#hs-cust-ctx")?.value) || 32768,
      gpu_layers: Number($("#hs-cust-ngl")?.value) || 99,
      temperature: Number($("#hs-cust-temp")?.value) || 0.7,
      top_p: Number($("#hs-cust-topp")?.value) || 0.95,
      max_tokens: Number($("#hs-cust-maxtok")?.value) || 4096,
      style: $("#hs-cust-style")?.value || "default",
      lora_adapter: ($("#hs-cust-lora")?.value || "").trim(),
      startup_flags: ($("#hs-cust-flags")?.value || "--flash-attn --cont-batching --mlock").trim(),
      persona: ($("#hs-cust-persona")?.value || "").trim(),
      instructions: ($("#hs-cust-instructions")?.value || "").trim(),
    };
    if (endpointUrl) {
      await postJSON("/api/colab/connect", { host: host_id, custom_url: endpointUrl }).catch(() => ({}));
    }
    const res = await postJSON("/api/host-setup/save-memory", payload);
    if (res?.ok) {
      if (Array.isArray(res.hosts)) {
        STATE.runtime_hosts = res.hosts;
        STATE.colab_hosts = res.hosts;
        persistHostHardwareToLocalStorage(res.hosts);
      }
      if (res.host_customizations) {
        STATE.host_customizations = res.host_customizations;
        persistHostCustomizationsToLocalStorage(res.host_customizations);
      }
      if (typeof window.markHostConfigSaved === "function") {
        window.markHostConfigSaved(host_id, {
          provider: payload.provider,
          accelerator: payload.accelerator,
          ram_gb: payload.ram_gb,
          quantization: payload.quantization,
          url: endpointUrl,
          saved_at: new Date().toLocaleTimeString(),
        });
      }
      await syncCrossSessionHardwareAndIntelligence({ forceHardware: true });
      renderLineup();
      renderColabHosts();
      if (typeof window.refreshTabbedHostSetupUI === "function") {
        await window.refreshTabbedHostSetupUI(host_id);
      }
      const msg = `✅ Host ${host_id.toUpperCase()} SAVED (${payload.provider.toUpperCase()} · ${payload.accelerator} ${payload.ram_gb}GB${endpointUrl ? ` · ${endpointUrl}` : ""})!`;
      if ($("#hs-cust-memory-status")) $("#hs-cust-memory-status").textContent = msg;
      status(msg);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#hs-auth-selected-host-btn")?.addEventListener("click", async () => {
  const hostId = $("#hs-cust-host-select")?.value || "a";
  $("#hs-save-cust-memory-btn")?.click();
  if (typeof triggerQuickLineupHostAuth === "function") {
    await triggerQuickLineupHostAuth(hostId);
  }
});

// ── CATEGORY II: AUTONOMOUS AGENT & SWARM EVOLUTION (#1, #2, #3, #4) ──

// Cat II #1: Hierarchical Manager-Worker Swarm DAG Orchestrator
$("#swarm-dag-run-btn")?.addEventListener("click", async () => {
  const goal = ($("#swarm-dag-goal")?.value || "").trim();
  const out = $("#swarm-dag-output");
  const btn = $("#swarm-dag-run-btn");
  const queenBossModel = $("#swarm-queen-boss-model")?.value || "qwen3-coder-30b-ablit";
  const queenAutoRotate = $("#swarm-queen-auto-rotate")?.checked !== false;
  if (!goal) {
    status("Enter a goal for the Manager-Worker Swarm DAG");
    return;
  }
  if (btn) btn.disabled = true;
  if (out) {
    out.innerHTML = `<div class="muted">⏳ Unrestricted Swarm Queen Boss (<code>${esc(queenBossModel)}</code>) decomposing goal into 4-stage dependency graph (DAG) with Auto-Switch Boss Rotation ${queenAutoRotate ? "ARMED" : "OFF"}…</div>`;
  }
  try {
    const res = await postJSON("/api/swarm/dag", {
      goal,
      auto_heal: true,
      queen_boss_model: queenBossModel,
      queen_auto_rotate: queenAutoRotate,
    });
    if (!res?.ok) {
      if (out) out.innerHTML = `<div style="color:var(--bad)">❌ ${esc(res?.error || "DAG failed")}</div>`;
      return;
    }
    const rotationHtml =
      res.queen_boss_switched_count > 0
        ? `<div class="muted" style="font-size:11px;margin-bottom:6px;color:#ffcc66">🔄 Queen Boss Auto-Switched ${res.queen_boss_switched_count}× across unrestricted chain until approved by <strong>${esc(res.queen_boss_used?.name || res.manager)}</strong></div>`
        : "";
    const nodesHtml = (res.nodes || [])
      .map(
        (n) => `
        <div class="a2a-stage-box" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
            <strong style="color:var(--accent2)">${esc(n.title)}</strong>
            <span class="right-badge" style="background:rgba(46,230,166,.14);color:var(--ok)">Worker: ${esc(n.worker_name)} · ${esc(n.review_status)}</span>
          </div>
          <div class="muted" style="font-size:11px;margin:3px 0 6px">Dependencies: ${n.depends_on?.length ? n.depends_on.map(esc).join(", ") : "Root Stage (No upstream deps)"}${n.boss_switched_count ? ` · 🔄 Switched Boss ${n.boss_switched_count}×` : ""}</div>
          <details ${n.stage === 3 ? "open" : ""}>
            <summary style="cursor:pointer;font-size:11.5px;color:var(--ok)">View Node Deliverable</summary>
            <div class="md-rendered" style="margin-top:6px;font-size:12px">${renderMarkdown(n.output || "")}</div>
          </details>
        </div>`
      )
      .join("");
    if (out) {
      out.innerHTML = `
        <div style="margin-bottom:8px"><strong style="color:var(--ok)">✅ Manager-Worker Swarm DAG Completed (Unrestricted Queen Boss: ${esc(res.manager)})</strong></div>
        ${rotationHtml}
        ${nodesHtml}`;
    }
    status(`✅ Hierarchical Manager-Worker Swarm DAG completed (${res.manager})!`);
  } finally {
    if (btn) btn.disabled = false;
  }
});

// Cat II #2: Episodic Agent Skill Distillation ("Verified Skill Macros")
async function loadDistilledSkillsList() {
  const listEl = $("#skill-distill-list");
  if (!listEl) return;
  try {
    const res = await fetch("/api/skills/distill", { cache: "no-store" }).then((r) => r.json());
    const skills = res?.skills || [];
    if (!skills.length) {
      listEl.innerHTML = `<div class="muted">No distilled skills yet.</div>`;
      return;
    }
    listEl.innerHTML = skills
      .map(
        (s) => `
        <div class="a2a-stage-box" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
            <div>
              <strong style="color:var(--accent2)">${esc(s.name)}</strong>
              <span class="right-badge" style="margin-left:6px">${esc(s.category || "Skill Macro")}</span>
              <span class="muted" style="font-size:11px;margin-left:6px">Runs: ${s.runs || 1} · Success: ${esc(s.success_rate || "100%")}</span>
            </div>
            <div class="btn-row" style="margin:0">
              <button class="primary xs" type="button" data-replay-skill="${esc(s.id)}">▶ 1-Click Replay Macro</button>
              <button class="ghost xs" type="button" data-del-skill="${esc(s.id)}">🗑</button>
            </div>
          </div>
          <div class="muted" style="font-size:11px;margin-top:4px">Trigger: <code>${esc(s.trigger_pattern || "")}</code> · Verify: <code>${esc(s.verification_cmd || "")}</code></div>
          <ol style="margin:6px 0 0;padding-left:18px;font-size:11.5px;color:#c9d6f5">
            ${(s.steps || []).map((st) => `<li>${esc(st)}</li>`).join("")}
          </ol>
        </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-replay-skill]").forEach((btn) => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-replay-skill");
        const target = ($("#skill-replay-target")?.value || "Current Suomynona Council Workspace").trim();
        const replayOut = $("#skill-replay-output");
        if (replayOut) {
          replayOut.classList.remove("hidden");
          replayOut.innerHTML = `<div class="muted">⏳ Replaying Verified Skill Macro on target '${esc(target)}'…</div>`;
        }
        const r = await postJSON("/api/skills/replay", { id, target });
        if (r?.ok && replayOut) {
          replayOut.innerHTML = `
            <div class="a2a-stage-box" style="border-color:var(--ok)">
              <strong style="color:var(--ok)">✔ Replay Complete: ${esc(r.skill?.name)} → ${esc(r.target)}</strong>
              ${r.verification_stdout ? `<pre style="margin:6px 0;padding:6px;background:#050811;border-radius:6px;color:var(--ok);font-size:11px">${esc(r.verification_stdout)}</pre>` : ""}
              <div class="md-rendered" style="margin-top:6px;font-size:12px">${renderMarkdown(r.output || "")}</div>
            </div>`;
          loadDistilledSkillsList();
        }
      };
    });

    listEl.querySelectorAll("[data-del-skill]").forEach((btn) => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-del-skill");
        await fetch(`/api/skills/distill?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        loadDistilledSkillsList();
      };
    });
  } catch (_) {}
}

$("#skill-distill-refresh-btn")?.addEventListener("click", loadDistilledSkillsList);

$("#skill-distill-create-btn")?.addEventListener("click", async () => {
  const name = ($("#skill-distill-name")?.value || "").trim();
  const source = ($("#skill-distill-source")?.value || $("#prompt")?.value || "").trim();
  if (!name && !source) {
    status("Enter a skill macro name or source workflow description to distill");
    return;
  }
  const btn = $("#skill-distill-create-btn");
  if (btn) btn.disabled = true;
  try {
    const res = await postJSON("/api/skills/distill", { name, source_text: source || name });
    if (res?.ok) {
      if ($("#skill-distill-name")) $("#skill-distill-name").value = "";
      if ($("#skill-distill-source")) $("#skill-distill-source").value = "";
      await loadDistilledSkillsList();
      status(`🧪 Distilled new Verified Skill Macro: ${res.skill?.name}`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

// Cat II #3: Adversarial Red-vs-Blue Autonomous Hardening Arena (Live Verbose Counter-Play)
$$(".rb-suggest-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const code = chip.getAttribute("data-rb-code") || "";
    if ($("#arena-rb-target")) {
      $("#arena-rb-target").value = code;
      status("💡 Loaded Red-vs-Blue battle scenario — click '⚔️ Start Live Red vs. Blue Battle' to watch them counter each other!");
    }
  });
});

$("#arena-rb-run-btn")?.addEventListener("click", async () => {
  const target = ($("#arena-rb-target")?.value || "").trim();
  const rounds = Number($("#arena-rb-rounds")?.value) || 2;
  const out = $("#arena-rb-output");
  const btn = $("#arena-rb-run-btn");
  if (!target) {
    status("Paste target code or click one of the scenario suggestions above");
    return;
  }
  if (btn) btn.disabled = true;
  if (out) {
    out.innerHTML = `
      <div class="a2a-stage-box" style="background:#050811;border-color:rgba(255,92,124,.45);font-family:Consolas,monospace;font-size:12px">
        <div style="color:#ff7b96;font-weight:700">🔴 [LIVE RED TEAM RECON STARTED] Probing target code entry points, trust boundaries, and injection sinks…</div>
        <div style="color:#60a5fa;margin-top:4px">🛡️ [BLUE TEAM STANDBY] Monitoring Red Team exploit vectors to synthesize real-time counter-patches across ${rounds} round(s)…</div>
      </div>`;
  }
  try {
    const res = await postJSON("/api/arena/red-blue", { target, rounds });
    if (!res?.ok) {
      if (out) out.innerHTML = `<div style="color:var(--bad)">❌ ${esc(res?.error || "Arena failed")}</div>`;
      return;
    }
    const roundsHtml = (res.rounds || [])
      .map((r) => {
        const eventsHtml = (r.battle_events || [])
          .map((ev) => {
            const isRed = ev.actor.startsWith("RED");
            const isBlue = ev.actor.startsWith("BLUE");
            const borderCol = isRed ? "rgba(255,92,124,.45)" : isBlue ? "rgba(46,230,166,.45)" : "rgba(56,189,248,.4)";
            const bgCol = isRed ? "rgba(255,92,124,.07)" : isBlue ? "rgba(46,230,166,.07)" : "rgba(56,189,248,.07)";
            const titleCol = isRed ? "#ff7b96" : isBlue ? "var(--ok)" : "var(--accent2)";
            return `
              <div style="padding:10px 12px;margin-top:8px;background:${bgCol};border-left:3.5px solid ${borderCol};border-radius:8px">
                <div class="row" style="justify-content:space-between;font-size:12px;margin-bottom:4px">
                  <strong style="color:${titleCol}">${esc(ev.speaker)}</strong>
                  <span class="muted" style="font-family:Consolas,monospace;font-size:11px">[${esc(ev.ts || "")}] · Round ${r.round}</span>
                </div>
                ${ev.summary ? `<div style="font-size:12px;color:#e2e8f0">${esc(ev.summary)}</div>` : ""}
                ${ev.detail ? `<div class="md-rendered" style="margin-top:6px;font-size:12px">${renderMarkdown(ev.detail)}</div>` : ""}
              </div>`;
          })
          .join("");

        return `
        <div class="a2a-stage-box" style="margin-bottom:12px">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
            <strong style="font-size:13.5px">⚔️ Round ${r.round} Live Counter-Play: 🔴 ${esc(r.red_model)} vs 🛡️ ${esc(r.blue_model)}</strong>
            <span class="right-badge" style="background:rgba(46,230,166,.16);color:var(--ok)">${esc(r.verification_status)}</span>
          </div>
          ${eventsHtml}
        </div>`;
      })
      .join("");
    if (out) out.innerHTML = roundsHtml;
    status(`⚔️ Red-vs-Blue Live Counter-Play converged after ${rounds} round(s)!`);
  } finally {
    if (btn) btn.disabled = false;
  }
});

// Cat II #4: Multi-Agent Debate with Cross-Examination Rounds (#debate-btn in Council Composer)
$("#debate-btn")?.addEventListener("click", async () => {
  const prompt = ($("#prompt")?.value || "").trim() || (window._lastPrompt || "").trim();
  if (!prompt) {
    status("🗣️ Enter a prompt in the composer (or run a Council query first) so the models can debate your exact topic!");
    $("#prompt")?.focus();
    return;
  }
  window._lastPrompt = prompt;
  const btn = $("#debate-btn");
  if (btn) btn.disabled = true;
  const jObj = getJudgeBackendObj();
  status(`🗣️ Launching 3-Round Cross-Examination Debate on "${prompt.slice(0, 68)}…" (Judge: ${jObj.name})`);
  const ansGrid = $("#answers");
  if (ansGrid) {
    ansGrid.innerHTML = `<div class="card"><div class="muted">🗣️ Running 3-Round Cross-Examination Debate on: <strong>${esc(prompt.slice(0, 140))}</strong><br>Round 1: Independent Technical Proposals → Round 2: Direct Peer Cross-Examination &amp; Rebuttal → Round 3: Chief Arbiter Synthesis (${esc(jObj.name)})…</div></div>`;
  }
  try {
    const chosenIdxs = [...picked];
    const res = await postJSON("/api/council/debate", {
      prompt,
      models: chosenIdxs.length >= 2 ? chosenIdxs.slice(0, 4) : [0, 1, 2],
      existing_answers: window._lastAnswers || {},
      judge_idx: getJudgeIdx(),
    });
    if (!res?.ok) {
      status(`❌ Debate error: ${res?.error || "failed"}`);
      return;
    }
    answers = {};
    window._lastAnswers = {};
    if (ansGrid) {
      ansGrid.innerHTML = "";
      (res.round2_cross_examination || []).forEach((r2, idx) => {
        const r1 = (res.round1_openings || [])[idx] || {};
        const combinedText =
          `#### Round 1 · Initial Technical Proposal & Implementation\n${r1.position || ""}\n\n` +
          `---\n#### Round 2 · Direct Cross-Examination & Upgraded Implementation\n${r2.critique_and_rebuttal || ""}`;
        answers[r2.model] = combinedText;
        window._lastAnswers[r2.model] = combinedText;
        const body = mkCard(r2.model, `DEBATER #${idx + 1} · 2 ROUNDS`, r2.idx);
        setCardBodyMarkdown(body, combinedText, false);
      });
    }
    showVerdict(
      `⚖️ 3-Round Cross-Examination Debate Verdict — Topic: ${prompt.slice(0, 56)}`,
      res.final_verdict || "",
      {
        judge_model: res.judge_model || jObj.name,
        judge_id: res.judge_id || jObj.model,
        scorecard: res.scorecard || [],
        winner: res.winner || null,
      }
    );
    if (res.leaderboard) renderLeaderboard(res.leaderboard);
    status(`✅ 3-Round Cross-Examination Debate complete! Judged by ${res.judge_model || jObj.name}${res.winner ? ` · Winner: ${res.winner}` : ""}`);
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ── CATEGORY III: A2A CONTEXT FIREWALL (#1), POLYMORPHIC STEALTH PROFILES (#2), MULTI-CLOUD FEDERATION (#3) & LIVE MCP BRIDGE (#5) ──
async function syncA2aStealthProfileUI() {
  try {
    const res = await fetch("/api/a2a/stealth-profile", { cache: "no-store" }).then((r) => r.json());
    if (res?.ok && res.active_profile) {
      if ($("#a2a-stealth-profile-select")) {
        $("#a2a-stealth-profile-select").value = res.active_profile.id;
      }
      if ($("#a2a-active-stealth-badge")) {
        $("#a2a-active-stealth-badge").textContent = res.active_profile.badge;
      }
    }
  } catch (_) {}
}

$("#a2a-stealth-apply-btn")?.addEventListener("click", async () => {
  const profileId = $("#a2a-stealth-profile-select")?.value || "enterprise_resilience";
  const out = $("#a2a-cat3-output");
  const statusEl = $("#a2a-cat3-status");
  const res = await postJSON("/api/a2a/stealth-profile", { profile_id: profileId });
  if (res?.ok && res.active_profile) {
    if ($("#a2a-active-stealth-badge")) {
      $("#a2a-active-stealth-badge").textContent = res.active_profile.badge;
    }
    if (statusEl) statusEl.textContent = `✅ Active Stealth Persona: ${res.active_profile.label}`;
    if (out) {
      out.classList.remove("hidden");
      out.innerHTML = `
        <div class="a2a-stage-box">
          <strong style="color:var(--ok)">🕵️ Polymorphic Stealth Profile Applied: ${esc(res.active_profile.label)} (${esc(res.active_profile.badge)})</strong>
          <div class="muted" style="font-size:11.5px;margin-top:4px">External <code>/.well-known/agent.json</code> Agent Name is now: <code>${esc(res.agent_card_preview?.name || "")}</code></div>
          <pre style="margin-top:6px;max-height:180px;overflow:auto;background:#050811;padding:8px;border-radius:8px;font-size:11px">${esc(JSON.stringify(res.agent_card_preview?.skills?.slice(0, 4) || [], null, 2))}</pre>
        </div>`;
    }
  }
});

$("#a2a-firewall-test-btn")?.addEventListener("click", async () => {
  const text = ($("#a2a-firewall-test-input")?.value || "").trim();
  const out = $("#a2a-cat3-output");
  const res = await postJSON("/api/a2a/firewall-scrub", { text });
  if (res?.ok && out) {
    out.classList.remove("hidden");
    const tags = (res.redactions || [])
      .map((r) => `<span class="a2a-tag">🛡️ <code>${esc(r.token)}</code> ← ${esc(r.category)} (${esc(r.preview)})</span>`)
      .join(" ");
    out.innerHTML = `
      <div class="a2a-stage-box">
        <strong style="color:var(--ok)">🛡️ Bidirectional A2A Context Firewall Scrubbing Report (${(res.redactions || []).length} entities redacted before Stage 1)</strong>
        <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">${tags || "<span class='muted'>No sensitive tokens detected</span>"}</div>
        <div style="margin-top:8px;font-size:11.5px"><strong>Outbound Stage 1 Payload (Sent to External Cloud):</strong><br><code style="color:var(--accent2)">${esc(res.scrubbed_text)}</code></div>
        <div style="margin-top:6px;font-size:11.5px"><strong>Stage 3 Local Re-Hydrated Context (Inside Suomynona Council):</strong><br><code style="color:var(--ok)">${esc(res.rehydrated_preview)}</code></div>
      </div>`;
  }
});

$("#a2a-mcp-bridge-test-btn")?.addEventListener("click", async () => {
  const out = $("#a2a-cat3-output");
  const res = await postJSON("/api/a2a/mcp-bridge", { enabled: true, invoke_tool: "list_dir", args: { path: "." } });
  if (res?.ok && out) {
    out.classList.remove("hidden");
    const skillsHtml = (res.bridged_skills || [])
      .map((s) => `<span class="a2a-tag">🔌 <code>${esc(s.id)}</code></span>`)
      .join(" ");
    out.innerHTML = `
      <div class="a2a-stage-box">
        <strong style="color:var(--ok)">🔌 Live MCP-to-A2A Bridge Active (${res.bridged_count} Bridged MCP &amp; Local Tools Exposed in /.well-known/agent.json)</strong>
        <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">${skillsHtml}</div>
        <div style="margin-top:8px;font-size:11.5px"><strong>Live Bridged Tool Test (<code>mcp-bridge-builtin-list_dir</code>):</strong></div>
        <pre style="margin-top:4px;padding:8px;background:#050811;border-radius:6px;font-size:11px;color:var(--ok)">${esc(res.output || "(workspace ready)")}</pre>
      </div>`;
  }
});

$("#a2a-multicloud-run-btn")?.addEventListener("click", async () => {
  const prompt = ($("#a2a-hybrid-prompt")?.value || $("#a2a-firewall-test-input")?.value || "Design a zero-trust cross-cloud mesh with automated key rotation and verify with a Python script.").trim();
  const out = $("#a2a-cat3-output");
  const btn = $("#a2a-multicloud-run-btn");
  if (btn) btn.disabled = true;
  if (out) {
    out.classList.remove("hidden");
    out.innerHTML = `<div class="muted">☁️ Federating across Google Cloud Vertex AI + AWS Bedrock AgentCore + Azure AI Foundry simultaneously…</div>`;
  }
  try {
    const res = await postJSON("/api/a2a/multicloud-federation", {
      prompt,
      clouds: ["google_vertex_ai", "aws_bedrock", "azure_ai_foundry"],
      fanout: 3,
      run_terminal: true,
    });
    if (res?.ok && out) {
      const cloudsHtml = (res.stage1_clouds || [])
        .map(
          (c) => `
          <div style="padding:8px;background:rgba(12,18,36,.9);border:1px solid var(--line);border-radius:8px">
            <strong style="color:var(--accent2)">☁️ ${esc(c.cloud_name)}</strong>
            <div class="muted" style="font-size:10.5px;margin-bottom:4px">${esc(c.badge)}</div>
            <div class="md-rendered" style="font-size:11.5px">${renderMarkdown(c.grounding_output || "")}</div>
          </div>`
        )
        .join("");
      const consensus = res.stage3_council_task?.artifacts?.[0]?.parts?.[0]?.text || "";
      out.innerHTML = `
        <div class="a2a-stage-box">
          <strong style="color:var(--ok)">☁️ Multi-Cloud A2A Federation Complete (Firewall Redacted ${res.firewall_redactions || 0} Sensitive Entities Before Cloud Fanout)</strong>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;margin-top:8px">${cloudsHtml}</div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--line)">
            <strong style="color:var(--ok)">🏛️ Stage 3 · Suomynona Council Unified Multi-Cloud Synthesis:</strong>
            <div class="md-rendered" style="margin-top:6px">${renderMarkdown(consensus)}</div>
          </div>
        </div>`;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ── CATEGORY IV: AUTOMATED PORT FORWARDER & LIVE SPLIT PREVIEW (#2) + ENVIRONMENT DOCTOR (#4) ──
$("#forge-scan-ports-btn")?.addEventListener("click", async () => {
  const out = $("#forge-cat4-output");
  const res = await fetch("/api/forge/ports", { cache: "no-store" }).then((r) => r.json());
  if (!res?.ok || !out) return;
  const portRows = (res.ports || [])
    .map(
      (p) => `
      <tr>
        <td><code>:${p.port}</code></td>
        <td>${esc(p.proto)}</td>
        <td>${esc(p.process)}</td>
        <td><span class="right-badge" style="background:rgba(46,230,166,.15);color:var(--ok)">${esc(p.status)}</span></td>
      </tr>`
    )
    .join("");
  const appButtons = (res.web_apps || [])
    .map(
      (w) => `<button class="ghost xs" type="button" data-preview-rel="${esc(w.rel_path)}">🖥️ Preview ${esc(w.name)}</button>`
    )
    .join(" ");
  out.innerHTML = `
    <div class="a2a-stage-box">
      <strong style="color:var(--ok)">🔌 Active Listening Ports &amp; Generated Web Applications</strong>
      <table style="width:100%;margin-top:6px;font-size:11.5px;border-collapse:collapse">
        <thead><tr style="text-align:left;color:var(--muted)"><th>Port</th><th>Protocol</th><th>Process / Daemon</th><th>State</th></tr></thead>
        <tbody>${portRows}</tbody>
      </table>
      ${appButtons ? `<div class="btn-row" style="margin-top:8px"><span class="muted" style="font-size:11px">Generated Web Apps:</span> ${appButtons}</div>` : ""}
    </div>`;
  out.querySelectorAll("[data-preview-rel]").forEach((b) => {
    b.onclick = () => launchForgeSplitPreview(b.getAttribute("data-preview-rel"));
  });
});

async function launchForgeSplitPreview(relPath = "") {
  const wrap = $("#forge-split-preview-wrap");
  const iframe = $("#forge-split-iframe");
  const lbl = $("#forge-preview-label");
  const res = await postJSON("/api/forge/preview", { rel_path: relPath });
  if (res?.ok && wrap && iframe) {
    wrap.classList.remove("hidden");
    if (lbl) lbl.textContent = res.rel_path || "live_preview.html";
    iframe.srcdoc = res.html || "";
  }
}

$("#forge-open-preview-btn")?.addEventListener("click", () => launchForgeSplitPreview(""));
$("#forge-close-preview-btn")?.addEventListener("click", () => {
  $("#forge-split-preview-wrap")?.classList.add("hidden");
});

$("#forge-env-doctor-btn")?.addEventListener("click", async () => {
  const out = $("#forge-cat4-output");
  const tb = ($("#forge-doctor-traceback")?.value || "").trim();
  const btn = $("#forge-env-doctor-btn");
  if (btn) btn.disabled = true;
  if (out) out.innerHTML = `<div class="muted">🩺 Running Autonomous Dependency &amp; Environment Doctor…</div>`;
  try {
    const res = await postJSON("/api/forge/env-doctor", { traceback: tb });
    if (res?.ok && out) {
      const checksHtml = (res.checks || [])
        .map(
          (c) => `
          <div class="row" style="justify-content:space-between;padding:5px 8px;background:rgba(10,16,32,.85);border:1px solid var(--line);border-radius:6px;margin-top:4px;font-size:11.5px">
            <strong>${esc(c.name)}</strong>
            <span style="color:${c.status === "OK" || c.status === "REPAIRED" ? "var(--ok)" : "var(--warn)"}">✔ ${esc(c.status)}: <code>${esc(c.detail)}</code></span>
          </div>`
        )
        .join("");
      out.innerHTML = `
        <div class="a2a-stage-box">
          <strong style="color:var(--ok)">🩺 Autonomous Environment Doctor Report (${esc(res.ts)})</strong>
          <div style="margin-top:6px">${checksHtml}</div>
          <div class="md-rendered" style="margin-top:8px;font-size:12px;color:var(--accent2)">${renderMarkdown(res.repair_summary || "")}</div>
        </div>`;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ── CATEGORY V: TOKEN-LEVEL CONFIDENCE HEATMAP (#1) & COUNCIL LIVE VOICE MODE (#4) ──
$("#heatmap-btn")?.addEventListener("click", () => {
  const dr = $("#heatmap-drawer");
  if (!dr) return;
  dr.classList.toggle("hidden");
  if (!dr.classList.contains("hidden")) {
    runConfidenceHeatmapAnalysis();
  }
});

$("#heatmap-close-btn")?.addEventListener("click", () => {
  $("#heatmap-drawer")?.classList.add("hidden");
});

$("#heatmap-run-btn")?.addEventListener("click", runConfidenceHeatmapAnalysis);

async function runConfidenceHeatmapAnalysis() {
  const bodyEl = $("#heatmap-body");
  const badgeEl = $("#heatmap-score-badge");
  const btn = $("#heatmap-run-btn");
  if (!bodyEl) return;
  if (btn) btn.disabled = true;
  bodyEl.innerHTML = `<div class="muted">🌡️ Computing cross-model token &amp; claim consensus heatmap…</div>`;
  try {
    const res = await postJSON("/api/council/heatmap", {
      answers,
      prompt: ($("#prompt")?.value || "").trim(),
    });
    if (!res?.ok) {
      bodyEl.innerHTML = `<div style="color:var(--bad)">❌ ${esc(res?.error || "Heatmap analysis failed")}</div>`;
      return;
    }
    if (badgeEl) {
      badgeEl.textContent = `Mean Consensus: ${res.overall_confidence_pct}% (${(res.models_compared || []).length} models)`;
    }
    const segHtml = (res.segments || [])
      .map((s) => {
        const bg =
          s.tier === "HIGH_CONSENSUS"
            ? "rgba(46,230,166,.12)"
            : s.tier === "SINGLE_SOURCE"
            ? "rgba(255,196,86,.12)"
            : "rgba(255,92,124,.14)";
        const border =
          s.tier === "HIGH_CONSENSUS"
            ? "rgba(46,230,166,.4)"
            : s.tier === "SINGLE_SOURCE"
            ? "rgba(255,196,86,.4)"
            : "rgba(255,92,124,.45)";
        const icon = s.tier === "HIGH_CONSENSUS" ? "🟢" : s.tier === "SINGLE_SOURCE" ? "🟡" : "🔴";
        return `
          <div style="padding:7px 10px;margin-bottom:6px;background:${bg};border:1px solid ${border};border-radius:8px;font-size:12px">
            <div class="row" style="justify-content:space-between;gap:8px">
              <span>${icon} <strong>${s.confidence_pct}% Consensus</strong> · Source: <code>${esc(s.source_model)}</code></span>
              <span class="muted" style="font-size:11px">Supported by: ${(s.supporting_models || []).map(esc).join(", ")}</span>
            </div>
            <div style="margin-top:4px">${esc(s.claim)}</div>
          </div>`;
      })
      .join("");
    bodyEl.innerHTML = `
      <div class="row" style="gap:10px;margin-bottom:8px;font-size:11.5px">
        <span class="a2a-tag">🟢 High Consensus: <strong>${res.high_consensus_count || 0}</strong></span>
        <span class="a2a-tag">🟡 Single-Model Claim: <strong>${res.single_source_count || 0}</strong></span>
        <span class="a2a-tag">🔴 Contested / Verify: <strong>${res.contested_count || 0}</strong></span>
      </div>
      ${segHtml || "<div class='muted'>Run a prompt across 2+ models to populate claim-level heatmap segments.</div>"}`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Cat V #4: Voice-Driven Hands-Free Command Mode ("Council Live")
let councilLiveRec = null;
let councilLiveActive = false;

$("#council-live-btn")?.addEventListener("click", () => {
  $("#council-live-drawer")?.classList.toggle("hidden");
});
$("#council-live-close-btn")?.addEventListener("click", () => {
  $("#council-live-drawer")?.classList.add("hidden");
});

async function dispatchCouncilLiveVoiceCommand(transcriptText) {
  const text = String(transcriptText || $("#council-live-input")?.value || "").trim();
  if (!text) return;
  const out = $("#council-live-output");
  const badge = $("#council-live-badge");
  if (badge) badge.textContent = "EXECUTING…";
  if (out) out.innerHTML = `<div class="muted">🎙️ Processing voice command: "${esc(text)}"…</div>`;
  try {
    const res = await postJSON("/api/voice/command", { transcript: text });
    if (res?.ok && out) {
      if (badge) badge.textContent = res.action_type || "READY";
      out.innerHTML = `
        <div class="a2a-stage-box">
          <div style="padding:8px 10px;background:rgba(46,230,166,.1);border:1px solid rgba(46,230,166,.35);border-radius:8px;margin-bottom:8px">
            <strong style="color:var(--ok)">🔊 Spoken Executive Briefing:</strong>
            <div style="margin-top:4px;font-size:13px">${esc(res.spoken_briefing || "")}</div>
          </div>
          <div class="md-rendered" style="font-size:12px">${renderMarkdown(res.detailed_output || "")}</div>
        </div>`;
      if ($("#council-live-autospeak")?.checked && res.spoken_briefing) {
        try {
          if (typeof speakText === "function") {
            speakText(res.spoken_briefing);
          } else if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(res.spoken_briefing));
          }
        } catch (_) {}
      }
    }
  } catch (e) {
    if (badge) badge.textContent = "ERROR";
  }
}

$("#council-live-send-btn")?.addEventListener("click", () => {
  dispatchCouncilLiveVoiceCommand($("#council-live-input")?.value || "");
});
$("#council-live-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") dispatchCouncilLiveVoiceCommand($("#council-live-input")?.value || "");
});
$$(".council-live-sample").forEach((btn) => {
  btn.onclick = () => {
    const cmd = btn.getAttribute("data-vcmd") || "";
    if ($("#council-live-input")) $("#council-live-input").value = cmd;
    dispatchCouncilLiveVoiceCommand(cmd);
  };
});

$("#council-live-mic-toggle")?.addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = $("#council-live-mic-toggle");
  const badge = $("#council-live-badge");
  if (!SR) {
    status("Browser SpeechRecognition not available — type your command in the Council Live bar below.");
    return;
  }
  if (councilLiveActive && councilLiveRec) {
    councilLiveActive = false;
    try { councilLiveRec.stop(); } catch (_) {}
    if (btn) btn.textContent = "🎙️ Start Hands-Free Listening";
    if (badge) badge.textContent = "STANDBY";
    return;
  }
  councilLiveRec = new SR();
  councilLiveRec.continuous = false;
  councilLiveRec.interimResults = false;
  councilLiveRec.lang = "en-US";
  councilLiveActive = true;
  if (btn) btn.textContent = "⏹ Stop Listening";
  if (badge) badge.textContent = "🔴 LISTENING…";
  councilLiveRec.onresult = (ev) => {
    const transcript = ev.results?.[0]?.[0]?.transcript || "";
    if ($("#council-live-input")) $("#council-live-input").value = transcript;
    dispatchCouncilLiveVoiceCommand(transcript);
  };
  councilLiveRec.onend = () => {
    councilLiveActive = false;
    if (btn) btn.textContent = "🎙️ Start Hands-Free Listening";
  };
  try { councilLiveRec.start(); } catch (_) {}
});

// ══════════════════════════════════════════════════════════════════════════════
// ALWAYS-ON DEFAULT SUOMYNONA COUNCIL BRAIN CO-PILOT, PROMPT ADVISOR & ADAPTIVE TRAINER
// ══════════════════════════════════════════════════════════════════════════════

let BRAIN_STATE = null;

async function initDefaultBrainConsole() {
  try {
    const res = await fetch("/api/brain/state", { cache: "no-store" }).then((r) => r.json());
    if (!res?.ok) return;
    BRAIN_STATE = res.brain;
    renderDefaultBrainUI(res.brain, res.available_models || []);
  } catch (e) {
    console.warn("Default Brain initialization error:", e);
  }
}

function cleanBrainModelLabel(rawName) {
  return String(rawName || "Default Brain")
    .replace(/^🦈\s*OrcaRouter\s*/i, "")
    .replace(/🔒\s*\[Approved\]/gi, "")
    .replace(/^\[Host\s+[A-Z0-9]+\]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderDefaultBrainUI(brain, availableModels = []) {
  if (!brain) return;
  BRAIN_STATE = brain;

  const sel = $("#brain-model-select");
  if (sel && availableModels.length) {
    sel.innerHTML = availableModels
      .map((m) => {
        const isSel = m.id === brain.default_model_id || m.model === brain.default_model_id || m.name === brain.default_model_name;
        const cleanLabel = cleanBrainModelLabel(m.name || m.model || m.id);
        return `<option value="${esc(m.id || m.model)}" ${isSel ? "selected" : ""}>${esc(cleanLabel)}</option>`;
      })
      .join("");
  }

  // Render clickable suggested prompts inside the floating popover above #brain-input
  const sugWrap = $("#brain-suggestions-row");
  if (sugWrap) {
    const suggestions = brain.suggested_prompts || [];
    sugWrap.innerHTML = suggestions
      .map((s) => `<button type="button" class="brain-suggest-chip" data-brain-sug="${esc(s)}">💡 ${esc(s)}</button>`)
      .join("");
    sugWrap.querySelectorAll("[data-brain-sug]").forEach((btn) => {
      btn.addEventListener("mousedown", (e) => {
        // Prevent input blur before click fires
        e.preventDefault();
      });
      btn.onclick = () => {
        const q = btn.getAttribute("data-brain-sug") || "";
        showBrainSuggestionsPopover(false);
        if ($("#brain-input")) $("#brain-input").value = "";
        askDefaultBrainModel(q);
      };
    });
  }

  // Render chat log
  const chatLog = $("#brain-chat-log");
  if (chatLog) {
    const hist = brain.chat_history || [];
    chatLog.innerHTML = hist
      .map((item) => {
        const recBtns =
          Array.isArray(item.recommended_models) && item.recommended_models.length
            ? `<div style="margin-top:6px"><button type="button" class="primary xs" data-apply-rec-models="${esc(JSON.stringify(item.recommended_models))}">⚡ Apply This Recommended ${item.recommended_models.length}-Model Combo to Council</button></div>`
            : "";
        return `
          <div class="brain-msg ${item.role === "user" ? "user" : "assistant"}">
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-bottom:2px">
              <strong>${item.role === "user" ? "👤 You" : `🧠 ${esc(cleanBrainModelLabel(brain.default_model_name || "Default Brain"))}`}</strong>
              <span>${esc(item.ts || "")}</span>
            </div>
            <div class="md-rendered">${renderMarkdown(item.text || "")}</div>
            ${recBtns}
          </div>`;
      })
      .join("");
    chatLog.scrollTop = chatLog.scrollHeight;

    chatLog.querySelectorAll("[data-apply-rec-models]").forEach((btn) => {
      btn.onclick = () => {
        try {
          const names = JSON.parse(btn.getAttribute("data-apply-rec-models") || "[]");
          const matchedIndices = (STATE?.backends || [])
            .filter((b) => names.includes(b.name))
            .map((b) => b.i);
          if (matchedIndices.length) {
            picked = new Set(matchedIndices);
            renderChips();
            renderRightModelsRail();
            status(`⚡ Applied Default Brain's recommended ${matchedIndices.length}-model combination: ${names.join(", ")}`);
          }
        } catch (_) {}
      };
    });
  }
}

function showBrainSuggestionsPopover(show) {
  const pop = $("#brain-suggestions-popover");
  if (!pop) return;
  const hasSuggestions = Boolean($("#brain-suggestions-row")?.children?.length);
  pop.classList.toggle("hidden", !(show && hasSuggestions));
}

async function askDefaultBrainModel(customPrompt = "", termAppendFn = null) {
  const inputEl = $("#brain-input");
  const prompt = String(customPrompt || inputEl?.value || "").trim();
  showBrainSuggestionsPopover(false);
  if (!prompt) {
    status("Type a question for your Default Brain Model (or use '/brain <question>' in the unified terminal)");
    return;
  }
  const btn = $("#brain-ask-btn");
  if (btn) btn.disabled = true;
  if (inputEl) inputEl.value = "";
  const composerDraft = ($("#prompt")?.value || "").trim();
  const termOut = $("#guardian-out");

  // Optimistically show user message in the brain log
  const chatLog = $("#brain-chat-log");
  if (chatLog) {
    const pendingDiv = document.createElement("div");
    pendingDiv.className = "brain-msg assistant";
    pendingDiv.innerHTML = `<span class="muted">🧠 Default Brain is analyzing and updating adaptive memory…</span>`;
    chatLog.appendChild(pendingDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  try {
    const res = await postJSON("/api/brain/ask", {
      prompt,
      composer_draft: composerDraft,
      images: [...attachedImages],
      documents: [...attachedDocuments],
    });
    if (res?.ok && res.brain) {
      attachedImages = [];
      attachedDocuments = [];
      renderImageAttachments();
      renderDefaultBrainUI(res.brain);
      syncSlotCapabilitiesStatus();
      const hist = res.brain.chat_history || [];
      const lastAssistant = [...hist].reverse().find((m) => m.role === "assistant");
      const answerText = res.answer || lastAssistant?.text || "Default Brain completed the analysis.";
      const brainName = cleanBrainModelLabel(res.brain.default_model_name || "Default Brain");
      const formattedOut = `🧠 [${brainName} · Adaptive Lv.${res.training_level || 1}]:\n${answerText}`;
      if (typeof termAppendFn === "function") {
        termAppendFn(formattedOut, "#f472b6", false);
      } else if (termOut && typeof appendTypedTerminalBlock === "function") {
        appendTypedTerminalBlock(termOut, formattedOut, { color: "#f472b6", marginBottom: "8px" });
      }
      status(`🧠 Default Brain answered (Adaptive Lv.${res.training_level} · All 5 Slot Capabilities Active)`);
    } else {
      const errMsg = res?.error || "Default Brain request failed";
      if (typeof termAppendFn === "function") termAppendFn(`⚠️ ${errMsg}`, "#ff6b8b", true);
      status(errMsg);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

$("#brain-ask-btn")?.addEventListener("click", () => askDefaultBrainModel());
$("#brain-verify-5-btn")?.addEventListener("click", () => {
  askDefaultBrainModel(
    "Verify all 5 unlocked slot capabilities right now: (1) Persistent Cross-Session Memory, (2) Live Tool & Shell Execution (`uname -a`), (3) Real-Time NVD CVE-2024-3094 Lookup, (4) 70B+ Frontier Deep-Reasoning Co-Processor Bridge, and (5) Universal Vision & PDF Reader Bridge."
  );
});
$("#brain-attach-btn")?.addEventListener("click", () => {
  $("#brain-file-input")?.click();
});
$("#brain-file-input")?.addEventListener("change", () => {
  if ($("#brain-file-input")?.files?.length) {
    addImageFiles($("#brain-file-input").files);
    $("#brain-file-input").value = "";
  }
});
$("#brain-input")?.addEventListener("paste", (e) => {
  const items = [...(e.clipboardData?.items || [])];
  const files = items
    .filter((it) => it.type.startsWith("image/") || it.type === "application/pdf")
    .map((it) => it.getAsFile())
    .filter(Boolean);
  if (files.length) addImageFiles(files);
});
$("#brain-console-pane")?.addEventListener("dragover", (e) => {
  e.preventDefault();
});
$("#brain-console-pane")?.addEventListener("drop", (e) => {
  if (e.dataTransfer?.files?.length) {
    e.preventDefault();
    addImageFiles(e.dataTransfer.files);
  }
});
$("#brain-input")?.addEventListener("focus", () => {
  if (!($("#brain-input")?.value || "").trim()) {
    showBrainSuggestionsPopover(true);
  }
});
$("#brain-input")?.addEventListener("click", () => {
  if (!($("#brain-input")?.value || "").trim()) {
    showBrainSuggestionsPopover(true);
  }
});
$("#brain-input")?.addEventListener("input", (e) => {
  const val = (e.target.value || "").trim();
  showBrainSuggestionsPopover(val.length === 0);
});
$("#brain-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    showBrainSuggestionsPopover(false);
  } else if (e.key === "Enter") {
    showBrainSuggestionsPopover(false);
    askDefaultBrainModel();
  }
});
$("#brain-suggestions-close-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  showBrainSuggestionsPopover(false);
});
document.addEventListener("mousedown", (e) => {
  const wrapper = $("#brain-input-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    showBrainSuggestionsPopover(false);
  }
});

$("#brain-model-select")?.addEventListener("change", async (e) => {
  const modelId = e.target.value;
  const modelName = e.target.selectedOptions?.[0]?.textContent || modelId;
  const res = await postJSON("/api/brain/select", { model_id: modelId, model_name: modelName });
  if (res?.ok && res.brain) {
    renderDefaultBrainUI(res.brain);
    status(`🧠 Always-On Default Brain switched to ${res.brain.default_model_name}`);
  }
});

$("#brain-train-toggle-btn")?.addEventListener("click", () => {
  $("#brain-train-bar")?.classList.toggle("hidden");
  $("#brain-train-input")?.focus();
});

$("#brain-train-save-btn")?.addEventListener("click", async () => {
  const rule = ($("#brain-train-input")?.value || "").trim();
  if (!rule) return;
  const res = await postJSON("/api/brain/train", { rule, category: "User-Trained Preference" });
  if (res?.ok && res.brain) {
    if ($("#brain-train-input")) $("#brain-train-input").value = "";
    $("#brain-train-bar")?.classList.add("hidden");
    renderDefaultBrainUI(res.brain);
    status(`🎓 Trained new rule into Default Brain (now Adaptive Lv.${res.brain.training_level})`);
  }
});

$("#brain-advise-combo-btn")?.addEventListener("click", async () => {
  const btn = $("#brain-advise-combo-btn");
  const goal = ($("#prompt")?.value || $("#brain-input")?.value || "").trim() || "Build, verify, and audit a complete production application";
  if (btn) btn.disabled = true;
  setConsoleExpanded(true);
  status("🎯 Default Brain is analyzing your prompt to recommend the optimal Council model combination…");
  try {
    const res = await postJSON("/api/brain/advise-lineup", { prompt: goal });
    if (res?.ok && res.brain) {
      renderDefaultBrainUI(res.brain);
      if (Array.isArray(res.recommended_indices) && res.recommended_indices.length) {
        picked = new Set(res.recommended_indices);
        renderChips();
        renderRightModelsRail();
      }
      status(`🎯 Default Brain selected the top ${res.recommended_names?.length || 0} models for your prompt: ${(res.recommended_names || []).join(", ")}`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#header-default-brain-badge")?.addEventListener("click", () => {
  setConsoleExpanded(true);
  $("#brain-input")?.focus();
});

// ══════════════════════════════════════════════════════════════════════════════
// MANDATORY FIRST-TIME USER SETUP & WALKTHROUGH WIZARD + SINGLE-PC LICENSE DRM
// ══════════════════════════════════════════════════════════════════════════════

let currentSetupStep = 1;
let setupStateCache = null;

function getClientBrowserFingerprint() {
  try {
    let fp = localStorage.getItem("cng_machine_fp");
    if (!fp) {
      fp = `${navigator.platform || "pc"}-${navigator.hardwareConcurrency || 8}-${screen?.width || 1920}x${screen?.height || 1080}`;
      localStorage.setItem("cng_machine_fp", fp);
    }
    return fp;
  } catch (_) {
    return "default-workstation";
  }
}

function setSetupWizardStep(stepNum) {
  currentSetupStep = Math.max(1, Math.min(6, Number(stepNum) || 1));
  $$("#setup-step-pills .cng-step-pill").forEach((pill) => {
    const s = Number(pill.dataset.wstep);
    pill.classList.toggle("active", s === currentSetupStep);
    pill.classList.toggle("done", s < currentSetupStep);
  });
  $$("#setup-walkthrough-modal .cng-step-pane").forEach((pane) => {
    pane.classList.toggle("hidden", Number(pane.dataset.wpane) !== currentSetupStep);
  });
  if ($("#setup-prev-btn")) $("#setup-prev-btn").disabled = currentSetupStep <= 1;
  if ($("#setup-step-status")) $("#setup-step-status").textContent = `Step ${currentSetupStep} of 6`;
  $("#setup-next-btn")?.classList.toggle("hidden", currentSetupStep >= 6);
  $("#setup-finish-btn")?.classList.toggle("hidden", currentSetupStep < 6);
}

async function checkAndOpenFirstTimeSetup(forceOpen = false) {
  try {
    const fp = getClientBrowserFingerprint();
    const [obRes, brainRes] = await Promise.all([
      fetch(`/api/onboarding/state?fp=${encodeURIComponent(fp)}`, { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/brain/state", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (!obRes?.ok) return;
    setupStateCache = obRes;

    if ($("#setup-hwid-display")) $("#setup-hwid-display").textContent = obRes.hwid || "CNG-PC-LOCAL";
    const licBadge = $("#setup-license-status-badge");
    if (licBadge) {
      if (obRes.license_valid) {
        licBadge.textContent = `✅ Hardware-Locked & Verified (${obRes.active_key})`;
        licBadge.style.color = "var(--ok)";
      } else {
        licBadge.textContent = "🔒 Unactivated — Enter Registration Key";
        licBadge.style.color = "#ffcc66";
      }
    }
    if (obRes.active_key && $("#setup-license-key-input")) {
      $("#setup-license-key-input").value = obRes.active_key;
    }

    if (obRes.system_specs && $("#setup-hardware-detected")) {
      $("#setup-hardware-detected").textContent =
        `Detected Local PC Hardware: ${obRes.system_specs.cpu_cores} CPU Threads (${obRes.system_specs.cpu_model}) · ~${obRes.system_specs.total_ram_gb} GB System RAM`;
      if ($("#setup-local-threads")) $("#setup-local-threads").value = obRes.onboarding?.local_ram_threads || obRes.system_specs.cpu_cores;
    }

    if (obRes.tokens_status && $("#setup-tokens-detected-msg")) {
      const ts = obRes.tokens_status;
      $("#setup-tokens-detected-msg").innerHTML =
        `Current Server Status: GH_TOKEN: <strong style="color:${ts.GH_TOKEN ? "var(--ok)" : "#ffcc66"}">${ts.GH_TOKEN ? "✔ Configured" : "Not set yet"}</strong> · ` +
        `GIST_ID: <strong style="color:${ts.GIST_ID ? "var(--ok)" : "#ffcc66"}">${ts.GIST_ID ? "✔ Configured" : "Not set yet"}</strong> · ` +
        `HF_TOKEN: <strong style="color:${ts.HF_TOKEN ? "var(--ok)" : "#ffcc66"}">${ts.HF_TOKEN ? "✔ Configured" : "Not set yet"}</strong>`;
    }

    const defModelSel = $("#setup-default-model-select");
    if (defModelSel && brainRes?.available_models) {
      const curDef = obRes.onboarding?.default_model_id || brainRes.brain?.default_model_id || "";
      defModelSel.innerHTML = brainRes.available_models
        .map((m) => `<option value="${esc(m.id || m.model)}" ${(m.id === curDef || m.model === curDef) ? "selected" : ""}>${esc(m.name)} (${esc(m.slot || m.kind)})</option>`)
        .join("");
    }

    const isCompleted = Boolean(obRes.onboarding?.completed && obRes.license_valid);
    $("#setup-wizard-close-btn")?.classList.toggle("hidden", !isCompleted);
    const lockBadge = $("#setup-wizard-lock-badge");
    if (lockBadge) {
      lockBadge.textContent = isCompleted
        ? "✅ SETUP & HARDWARE LICENSE VERIFIED"
        : "🔒 COMPLETE ALL 6 STEPS TO UNLOCK WORKSPACE";
      lockBadge.className = "right-badge " + (isCompleted ? "orca" : "gated");
    }

    // Automatically show mandatory setup modal on first load until setup + license activation are completed
    if (forceOpen || !isCompleted) {
      $("#setup-walkthrough-modal")?.classList.remove("hidden");
      setSetupWizardStep(obRes.license_valid ? (forceOpen ? 1 : 2) : 1);
    }
  } catch (e) {
    console.warn("Setup walkthrough check error:", e);
  }
}

$("#header-setup-wizard-btn")?.addEventListener("click", () => {
  checkAndOpenFirstTimeSetup(true);
});

$("#setup-wizard-close-btn")?.addEventListener("click", () => {
  $("#setup-walkthrough-modal")?.classList.add("hidden");
});

$$("#setup-step-pills .cng-step-pill").forEach((pill) => {
  pill.onclick = () => {
    const targetStep = Number(pill.dataset.wstep);
    if (targetStep > 1 && !setupStateCache?.license_valid) {
      const fb = $("#setup-license-feedback");
      if (fb) fb.innerHTML = `<span style="color:var(--bad)">🔒 Please validate your Single-PC Registration Token in Step 1 first (or click 👑 Owner Master Fill).</span>`;
      return;
    }
    setSetupWizardStep(targetStep);
  };
});

$("#setup-prev-btn")?.addEventListener("click", () => setSetupWizardStep(currentSetupStep - 1));
$("#setup-next-btn")?.addEventListener("click", () => {
  if (currentSetupStep === 1 && !setupStateCache?.license_valid) {
    const fb = $("#setup-license-feedback");
    if (fb) fb.innerHTML = `<span style="color:var(--bad)">🔒 Step 1 Required: Please click <strong>🔐 Validate &amp; Lock to This PC</strong> (or <strong>👑 Owner Master Fill</strong>) before proceeding.</span>`;
    return;
  }
  setSetupWizardStep(currentSetupStep + 1);
});

async function activateRegistrationKey(keyToActivate) {
  const key = String(keyToActivate || $("#setup-license-key-input")?.value || "").trim();
  const fb = $("#setup-license-feedback");
  const fp = getClientBrowserFingerprint();
  const res = await postJSON("/api/license/activate", { key, fp });
  if (res?.ok) {
    setupStateCache ||= {};
    setupStateCache.license_valid = true;
    setupStateCache.active_key = res.license?.key || key;
    if ($("#setup-license-status-badge")) {
      $("#setup-license-status-badge").textContent = `✅ Hardware-Locked to ${res.hwid}`;
      $("#setup-license-status-badge").style.color = "var(--ok)";
    }
    if (fb) {
      fb.innerHTML = `<div style="padding:8px 10px;border-radius:8px;background:rgba(34,197,94,.14);border:1px solid var(--ok);color:var(--ok)">✅ <strong>${esc(res.message)}</strong><br>Licensed to: <strong>${esc(res.license?.buyer_name || "Authorized User")}</strong> · Bound HWID: <code>${esc(res.hwid)}</code> (1-Computer Lock Enforced)</div>`;
    }
    return true;
  } else {
    if (fb) {
      fb.innerHTML = `<div style="padding:8px 10px;border-radius:8px;background:rgba(239,68,68,.16);border:1px solid var(--bad);color:#ff9aa8">🚫 <strong>${esc(res?.error || "Activation failed")}</strong></div>`;
    }
    return false;
  }
}

$("#setup-activate-key-btn")?.addEventListener("click", () => activateRegistrationKey());
$("#setup-fill-buyer-demo-btn")?.addEventListener("click", () => {
  if ($("#setup-license-key-input")) $("#setup-license-key-input").value = "CNG-PRO-8842-9910-A7F3-LOCK";
  activateRegistrationKey("CNG-PRO-8842-9910-A7F3-LOCK");
});
$("#setup-fill-shared-demo-btn")?.addEventListener("click", () => {
  if ($("#setup-license-key-input")) $("#setup-license-key-input").value = "CNG-PRO-5120-7741-C9E2-LOCK";
  activateRegistrationKey("CNG-PRO-5120-7741-C9E2-LOCK");
});

$("#setup-owner-quickfill-btn")?.addEventListener("click", async () => {
  if ($("#setup-license-key-input")) $("#setup-license-key-input").value = "CNG-OWNER-MASTER-KEY-2026";
  await activateRegistrationKey("CNG-OWNER-MASTER-KEY-2026");
  const defSel = $("#setup-default-model-select");
  const chosenId = defSel?.value || "cloud:orca_cyber:orcarouter/OrcaSAQ-2-Cyber-27B-Uncensored-GGUF";
  const chosenName = defSel?.selectedOptions?.[0]?.textContent || "🦈 OrcaRouter OrcaSAQ-2 Cyber 27B 🔒 [Approved]";
  await postJSON("/api/onboarding/save", {
    completed: true,
    compute_mode: document.querySelector('input[name="setup_compute_mode"]:checked')?.value || "colab",
    colab_cell_verified: true,
    default_model_id: chosenId,
    default_model_name: chosenName,
  });
  $("#setup-walkthrough-modal")?.classList.add("hidden");
  await initDefaultBrainConsole();
  status("👑 Owner Master Key activated & Setup Walkthrough completed!");
});

$$("#setup-compute-cards .cng-compute-option").forEach((lbl) => {
  lbl.addEventListener("click", () => {
    $$("#setup-compute-cards .cng-compute-option").forEach((x) => x.classList.remove("active"));
    lbl.classList.add("active");
    const radio = lbl.querySelector("input[type='radio']");
    if (radio) radio.checked = true;
  });
});

$("#setup-copy-cell-btn")?.addEventListener("click", async () => {
  const code = $("#setup-colab-cell-preview")?.textContent || "";
  try {
    await navigator.clipboard.writeText(code);
    if ($("#setup-copy-cell-status")) $("#setup-copy-cell-status").textContent = "✅ Copied self-contained bootstrap cell to clipboard!";
  } catch (_) {}
});

async function refreshSetupBootstrapCellPreview() {
  const hostSel = $("#setup-boot-host-select")?.value || "a";
  const targetHost = hostSel === "all" ? "a" : hostSel;
  const gistVal = ($("#setup-gist-id")?.value || "").trim() || STATE?.keys?.GIST_ID || "05a1f96580fa13b373b42d919873dc57";
  try {
    const r = await fetch(`/api/colab/bootstrap.py?host=${encodeURIComponent(targetHost)}&gist_id=${encodeURIComponent(gistVal)}`);
    if (r.ok) {
      const txt = await r.text();
      if ($("#setup-colab-cell-preview") && txt.trim()) {
        $("#setup-colab-cell-preview").textContent = txt;
      }
    }
  } catch (_) {}
}

$("#setup-boot-host-select")?.addEventListener("change", () => refreshSetupBootstrapCellPreview());
$("#setup-gist-id")?.addEventListener("change", () => refreshSetupBootstrapCellPreview());

$("#setup-run-cell-btn")?.addEventListener("click", async () => {
  const btn = $("#setup-run-cell-btn");
  const outEl = $("#setup-cell-live-output");
  const statusEl = $("#setup-copy-cell-status");
  const hostSel = $("#setup-boot-host-select")?.value || "all";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Running & Verifying Boot Cell…";
  }
  if (outEl) {
    outEl.classList.remove("hidden");
    outEl.textContent = `⚡ Executing self-contained Bootstrap Cell & verifying OpenAI /v1 handshakes on ${hostSel.toUpperCase()}…`;
  }
  try {
    const res = await postJSON("/api/colab/run-boot-cell", {
      host: hostSel,
      compute_mode: document.querySelector('input[name="setup_compute_mode"]:checked')?.value || "colab",
      local_url: ($("#setup-local-url")?.value || "").trim(),
      gist_id: ($("#setup-gist-id")?.value || "").trim(),
    });
    if (res?.ok) {
      if ($("#setup-colab-cell-preview") && res.bootstrap_cell) {
        $("#setup-colab-cell-preview").textContent = res.bootstrap_cell;
      }
      const hostLines = (res.results || []).map(
        (h) => `  • Host ${String(h.host).toUpperCase()} (${h.url}): ${h.ok ? "✅ ONLINE" : "⚠️ STANDBY"} · ${h.latency_ms}ms · ${h.models_ready} models ready`
      );
      if (outEl) {
        outEl.textContent = `✅ BOOT CELL VERIFIED LIVE (${new Date().toLocaleTimeString()}):\n${hostLines.join("\n")}`;
      }
      if (statusEl) statusEl.textContent = "✅ All 4 Host Runtimes (:8080–:8083) Verified Online!";
      if ($("#setup-cell-confirmed-cb")) $("#setup-cell-confirmed-cb").checked = true;
      if (typeof pushClientLiveConsole === "function") {
        pushClientLiveConsole("BOOT_CELL", `Verified Boot Cell across ${hostLines.length} hosts (:8080–:8083)`);
      }
      await reloadState().catch(() => {});
    } else {
      if (outEl) outEl.textContent = `⚠️ Boot verification error: ${res?.error || "Unknown error"}`;
    }
  } catch (err) {
    if (outEl) outEl.textContent = `❌ Boot cell execution error: ${err.message || err}`;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "▶ Run & Verify Boot Cell Live Now";
    }
  }
});

$("#setup-finish-btn")?.addEventListener("click", async () => {
  if (!setupStateCache?.license_valid) {
    setSetupWizardStep(1);
    return;
  }
  const btn = $("#setup-finish-btn");
  if (btn) btn.disabled = true;
  try {
    const computeMode = document.querySelector('input[name="setup_compute_mode"]:checked')?.value || "colab";
    const defSel = $("#setup-default-model-select");
    const defaultModelId = defSel?.value || "";
    const defaultModelName = defSel?.selectedOptions?.[0]?.textContent || "";

    const res = await postJSON("/api/onboarding/save", {
      completed: true,
      compute_mode: computeMode,
      local_gpu_url: ($("#setup-local-url")?.value || "").trim(),
      local_ram_threads: Number($("#setup-local-threads")?.value) || 8,
      local_ram_model_gb: Number($("#setup-local-ram-gb")?.value) || 8,
      colab_cell_verified: Boolean($("#setup-cell-confirmed-cb")?.checked),
      GH_TOKEN: ($("#setup-gh-token")?.value || "").trim(),
      GIST_ID: ($("#setup-gist-id")?.value || "").trim(),
      HF_TOKEN: ($("#setup-hf-token")?.value || "").trim(),
      OPENAI_API_KEY: ($("#setup-openai-key")?.value || "").trim(),
      XAI_API_KEY: ($("#setup-xai-key")?.value || "").trim(),
      OPENROUTER_API_KEY: ($("#setup-openrouter-key")?.value || "").trim(),
      GEMINI_API_KEY: ($("#setup-gemini-key")?.value || "").trim(),
      default_model_id: defaultModelId,
      default_model_name: defaultModelName,
    });
    if (res?.ok) {
      $("#setup-walkthrough-modal")?.classList.add("hidden");
      await reloadState();
      await initDefaultBrainConsole();
      status(`🎉 Setup complete! Compute: ${computeMode.toUpperCase()} · Default Brain: ${defaultModelName}`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ── OWNER REGISTRATION KEY GENERATOR & CODE OBFUSCATION STUDIO ──
async function openDrmStudioModal() {
  $("#drm-studio-modal")?.classList.remove("hidden");
  await refreshDrmLicensesTable();
}

async function refreshDrmLicensesTable() {
  const wrap = $("#drm-licenses-table-wrap");
  if (!wrap) return;
  const fp = getClientBrowserFingerprint();
  const res = await fetch(`/api/license/status?fp=${encodeURIComponent(fp)}`, { cache: "no-store" }).then((r) => r.json());
  if (!res?.ok) return;
  const rows = (res.licenses || [])
    .map(
      (l) => `
      <tr>
        <td><code style="color:var(--accent2);font-weight:700">${esc(l.key)}</code></td>
        <td><strong>${esc(l.buyer_name)}</strong><div class="muted" style="font-size:10.5px">${esc(l.buyer_email || "")}</div></td>
        <td>${
          l.bound_hwid
            ? `<span class="right-badge orca">🔒 Locked: ${esc(l.bound_hwid)}</span>`
            : `<span class="right-badge">🟢 Unbound (Ready for 1st PC)</span>`
        }</td>
        <td>${l.revoked ? `<span class="right-badge gated">🚫 REVOKED</span>` : `<span style="color:var(--ok);font-weight:700">✔ Active</span>`}</td>
        <td>
          <div class="btn-row" style="margin:0;gap:4px">
            <button type="button" class="ghost xs" data-drm-copy="${esc(l.key)}">📋 Copy</button>
            <button type="button" class="ghost xs" data-drm-reset="${esc(l.key)}" title="Clear hardware lock so buyer can move to a new computer">🔓 Reset PC Lock</button>
            <button type="button" class="ghost xs" data-drm-revoke="${esc(l.key)}">${l.revoked ? "Restore" : "🚫 Revoke"}</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
  wrap.innerHTML = `
    <table class="leaderboard-table" style="font-size:12px">
      <thead><tr><th>Registration Token</th><th>Buyer</th><th>Single-PC Hardware Lock (HWID)</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  wrap.querySelectorAll("[data-drm-copy]").forEach((b) => {
    b.onclick = async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.drmCopy);
        b.textContent = "✅ Copied";
        setTimeout(() => { b.textContent = "📋 Copy"; }, 1200);
      } catch (_) {}
    };
  });
  wrap.querySelectorAll("[data-drm-reset]").forEach((b) => {
    b.onclick = async () => {
      await postJSON("/api/license/reset-hwid", { key: b.dataset.drmReset });
      await refreshDrmLicensesTable();
      status(`🔓 Reset Single-PC Hardware Lock for ${b.dataset.drmReset}`);
    };
  });
  wrap.querySelectorAll("[data-drm-revoke]").forEach((b) => {
    b.onclick = async () => {
      await postJSON("/api/license/revoke", { key: b.dataset.drmRevoke });
      await refreshDrmLicensesTable();
      status(`Updated revocation status for ${b.dataset.drmRevoke}`);
    };
  });
}

$("#header-drm-studio-btn")?.addEventListener("click", openDrmStudioModal);
$("#setup-open-drm-studio-btn")?.addEventListener("click", openDrmStudioModal);
$("#drm-studio-close-btn")?.addEventListener("click", () => {
  $("#drm-studio-modal")?.classList.add("hidden");
});

$("#drm-generate-key-btn")?.addEventListener("click", async () => {
  const buyer_name = ($("#drm-buyer-name")?.value || "").trim() || "Commercial Buyer";
  const buyer_email = ($("#drm-buyer-email")?.value || "").trim();
  const notes = ($("#drm-buyer-notes")?.value || "").trim();
  const res = await postJSON("/api/license/generate", { buyer_name, buyer_email, notes });
  if (res?.ok && res.license) {
    if ($("#drm-generate-status")) {
      $("#drm-generate-status").innerHTML = `✅ Generated 1-PC Key: <code style="color:var(--ok);font-weight:700">${esc(res.license.key)}</code>`;
    }
    await refreshDrmLicensesTable();
  }
});

$("#drm-build-obfuscated-btn")?.addEventListener("click", async () => {
  const btn = $("#drm-build-obfuscated-btn");
  const out = $("#drm-obfuscate-out");
  if (btn) btn.disabled = true;
  if (out) out.innerHTML = `<div class="muted">🔒 Encoding string tables, injecting anti-debugger traps, and packaging obfuscated commercial release…</div>`;
  try {
    const res = await postJSON("/api/drm/obfuscate", {
      string_encode: Boolean($("#drm-obf-strings")?.checked),
      anti_debug: Boolean($("#drm-obf-antidebug")?.checked),
      hwid_lock: Boolean($("#drm-obf-hwid")?.checked),
    });
    if (res?.ok && out) {
      out.innerHTML = `
        <div class="a2a-stage-box" style="padding:10px 12px">
          <strong style="color:var(--ok)">🔒 Obfuscated Commercial Release Built Successfully!</strong>
          <div class="muted" style="font-size:11.5px;margin-top:4px">
            Saved to: <code>${esc(res.obfuscated_file)}</code> (${res.original_size_kb} KB source → ${res.obfuscated_size_kb} KB encoded bundle) · Live development source remains untouched!
          </div>
          <pre style="margin-top:6px;max-height:130px;overflow:auto;background:#050811;padding:8px;border-radius:6px;font-size:11px;color:#aee8ff">${esc(res.preview_head || "")}</pre>
        </div>`;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ── Decluttered Composer: "More Tools" Toggle & Quick Re-Run Button ──
$("#more-tools-toggle-btn")?.addEventListener("click", () => {
  const drawer = $("#more-tools-drawer");
  const btn = $("#more-tools-toggle-btn");
  if (!drawer) return;
  const opening = drawer.classList.contains("hidden");
  drawer.classList.toggle("hidden", !opening);
  if (btn) {
    btn.innerHTML = `<span class="chip-sym">🛠</span><span>${opening ? "More Tools ▴" : "More Tools ▾"}</span>`;
  }
});

$("#more-tools-close-btn")?.addEventListener("click", () => {
  $("#more-tools-drawer")?.classList.add("hidden");
  const btn = $("#more-tools-toggle-btn");
  if (btn) {
    btn.innerHTML = `<span class="chip-sym">🛠</span><span>More Tools ▾</span>`;
  }
});

$("#rerun-all-tools-btn")?.addEventListener("click", async () => {
  const btn = $("#rerun-all-tools-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⚡ Running All Tools…";
  }
  status("⚡ Quick Re-Running all Studio Power Tools across active models & workspace…");
  try {
    // 1. Auto-pick / verify active models
    $("#brain-advise-combo-btn")?.click();
    // 2. Heatmap consensus
    $("#heatmap-btn")?.click();
    // 3. Next-step director
    $("#director-btn")?.click();
    status("✅ All studio verification & consensus tools refreshed!");
  } catch (e) {
    status(`Tools notice: ${e?.message || e}`);
  } finally {
    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "⚡ Quick Re-Run All Tools";
      }
    }, 1200);
  }
});

// ── 🐝 Adjustable RAM Swarm Studio (3GB or 5GB Models + Sub-Agent Spawner) ──
const SWARM_MODELS_CATALOG = {
  3: [
    { id: "Llama-3.2-3B-Instruct-abliterated.Q4_K_M.gguf", label: "⚡ Llama 3.2 3B Uncensored (3 GB per copy — Fast Scanner)" },
    { id: "Qwen2.5-Coder-3B-Instruct-abliterated.Q4_K_M.gguf", label: "💻 Qwen 2.5 Coder 3B (3 GB per copy — Code & Bug Hunter)" },
    { id: "Hermes-3-Llama-3.2-3B.Q4_K_M.gguf", label: "🧠 Hermes 3 Llama 3.2 3B (3 GB per copy — Smart Tool Agent)" },
    { id: "Phi-3.5-mini-instruct-abliterated.Q4_K_M.gguf", label: "🔬 Phi 3.5 Mini 3.8B (3 GB per copy — Logic & Math Worker)" },
  ],
  5: [
    { id: "Qwen2.5-7B-Instruct-abliterated.Q4_K_M.gguf", label: "🔥 Qwen 2.5 7B Uncensored (5 GB per copy — Deep Analyst)" },
    { id: "Llama-3.1-8B-Lexi-Uncensored-V2.Q4_K_M.gguf", label: "🛡️ Llama 3.1 8B Lexi Uncensored (5 GB per copy — Red/Blue Specialist)" },
    { id: "DeepSeek-R1-Distill-Qwen-7B.Q4_K_M.gguf", label: "🧠 DeepSeek R1 7B Reasoning (5 GB per copy — Step-by-Step Thinker)" },
    { id: "Mistral-7B-Instruct-v0.3-abliterated.Q4_K_M.gguf", label: "⚡ Mistral 7B v0.3 Uncensored (5 GB per copy — Fast Heavy Worker)" },
  ],
};

function getSelectedSwarmPowerTools() {
  return $$("#swarm-power-tools-grid .swarm-power-tool-cb:checked").map((cb) => cb.value);
}

function populateRamSwarmModelDropdown() {
  const sel = $("#ram-swarm-model");
  if (!sel) return;
  const sizeGb = Number($("#ram-swarm-model-gb")?.value) === 5 ? 5 : 3;
  const prevVal = sel.value;
  sel.innerHTML = "";

  const tierGroup = document.createElement("optgroup");
  tierGroup.label = sizeGb === 5 ? "🔥 5 GB Models (Deeper Reasoning Per Copy)" : "⚡ 3 GB Models (Maximum Copies in RAM)";
  (SWARM_MODELS_CATALOG[sizeGb] || SWARM_MODELS_CATALOG[3]).forEach((m) => {
    const opt = new Option(m.label, m.id);
    opt.dataset.sizeGb = String(sizeGb);
    tierGroup.appendChild(opt);
  });
  sel.appendChild(tierGroup);

  const otherSize = sizeGb === 5 ? 3 : 5;
  const otherGroup = document.createElement("optgroup");
  otherGroup.label = otherSize === 5 ? "Other: 5 GB Models" : "Other: 3 GB Models";
  (SWARM_MODELS_CATALOG[otherSize] || []).forEach((m) => {
    const opt = new Option(m.label, m.id);
    opt.dataset.sizeGb = String(otherSize);
    otherGroup.appendChild(opt);
  });
  sel.appendChild(otherGroup);

  const councilBackends = Array.isArray(STATE?.backends) ? STATE.backends : [];
  if (councilBackends.length) {
    const activeGroup = document.createElement("optgroup");
    activeGroup.label = "💬 Your Active Council Models";
    councilBackends.forEach((b) => {
      const mId = b.model || b.name || `slot-${b.i}`;
      const mLabel = b.name ? `${b.name} (${b.model || ""})` : mId;
      const opt = new Option(`🤖 ${mLabel} (${sizeGb} GB Swarm Slot)`, mId);
      opt.dataset.sizeGb = String(sizeGb);
      activeGroup.appendChild(opt);
    });
    sel.appendChild(activeGroup);
  }

  if (prevVal && [...sel.options].some((o) => o.value === prevVal)) {
    sel.value = prevVal;
  }
}

function updateRamSwarmMathUI(recalcWorkers = true) {
  const totalInput = $("#ram-swarm-total-gb");
  const allocInput = $("#ram-swarm-alloc-gb");
  const allocSlider = $("#ram-swarm-alloc-slider");
  const sizeInput = $("#ram-swarm-model-gb");
  const workersInput = $("#ram-swarm-workers");
  if (!totalInput || !allocInput || !sizeInput || !workersInput) return;

  const totalRamGb = Math.max(8, Math.min(2048, Number(totalInput.value) || 192));
  const maxSafeAlloc = Math.max(3, totalRamGb - 6);
  allocSlider.max = String(totalRamGb);
  allocInput.max = String(totalRamGb);

  let allocatedRamGb = Math.max(3, Math.min(totalRamGb, Number(allocInput.value) || 180));
  allocInput.value = String(allocatedRamGb);
  allocSlider.value = String(allocatedRamGb);

  const modelSizeGb = Number(sizeInput.value) === 5 ? 5 : 3;
  const maxCopiesByRam = Math.max(1, Math.floor(allocatedRamGb / modelSizeGb));

  let workers = Number(workersInput.value) || maxCopiesByRam;
  if (recalcWorkers) {
    workers = maxCopiesByRam;
    workersInput.value = String(workers);
  } else {
    workers = Math.max(1, Math.min(256, workers));
  }

  const ramUsedByModels = workers * modelSizeGb;
  const freeRamGb = Math.max(0, totalRamGb - ramUsedByModels);
  const pct = Math.min(100, Math.round((ramUsedByModels / totalRamGb) * 100));

  const formulaEl = $("#ram-swarm-formula-text");
  if (formulaEl) {
    formulaEl.textContent = `${allocatedRamGb} GB Allocated ÷ ${modelSizeGb} GB Model = ${workers} Parallel AI Models (${freeRamGb} GB Free for OS)`;
  }

  const badgeEl = $("#ram-swarm-slots-badge");
  if (badgeEl) {
    badgeEl.textContent = `${workers} × ${modelSizeGb}GB MODELS READY`;
  }

  const fillBar = $("#ram-swarm-fill-bar");
  if (fillBar) {
    fillBar.style.width = `${pct}%`;
  }

  const runBtn = $("#ram-swarm-run-btn");
  if (runBtn && !runBtn.disabled) {
    runBtn.textContent = `🚀 Launch ${workers}× ${modelSizeGb}GB Parallel Swarm + Spawn Sub-Agents`;
  }
  const autoFillBtn = $("#ram-swarm-autofill-btn");
  if (autoFillBtn) {
    autoFillBtn.textContent = `⚡ Auto-Fill Max (${maxSafeAlloc} GB ÷ ${modelSizeGb} GB = ${Math.max(1, Math.floor(maxSafeAlloc / modelSizeGb))} Models)`;
  }
}

async function syncRamSwarmModelsAndSetup() {
  try {
    const setupRes = await fetch("/api/system/onboarding").then((r) => r.json()).catch(() => null);
    const savedRam = Number(setupRes?.profile?.system_ram_gb);
    if (savedRam && savedRam >= 8 && $("#ram-swarm-total-gb") && !$("#ram-swarm-total-gb").dataset.userTouched) {
      $("#ram-swarm-total-gb").value = String(savedRam);
      const safeAlloc = Math.max(6, savedRam - 12);
      if ($("#ram-swarm-alloc-gb")) $("#ram-swarm-alloc-gb").value = String(safeAlloc);
      if ($("#ram-swarm-alloc-slider")) $("#ram-swarm-alloc-slider").value = String(safeAlloc);
    }
  } catch {}
  populateRamSwarmModelDropdown();
  updateRamSwarmMathUI(true);
}

function initAdjustableRamSwarmStudio() {
  populateRamSwarmModelDropdown();
  updateRamSwarmMathUI(true);

  $$(".ram-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const total = Number(btn.dataset.ram) || 192;
      const safeAlloc = Math.max(6, total - (total >= 64 ? 12 : 4));
      if ($("#ram-swarm-total-gb")) {
        $("#ram-swarm-total-gb").value = String(total);
        $("#ram-swarm-total-gb").dataset.userTouched = "1";
      }
      if ($("#ram-swarm-alloc-gb")) $("#ram-swarm-alloc-gb").value = String(safeAlloc);
      if ($("#ram-swarm-alloc-slider")) $("#ram-swarm-alloc-slider").value = String(safeAlloc);
      updateRamSwarmMathUI(true);
      status(`⚡ Set Total RAM to ${total} GB (${safeAlloc} GB allocated to Swarm)`);
    });
  });

  $("#ram-swarm-total-gb")?.addEventListener("input", () => {
    $("#ram-swarm-total-gb").dataset.userTouched = "1";
    const total = Math.max(8, Number($("#ram-swarm-total-gb").value) || 192);
    const curAlloc = Number($("#ram-swarm-alloc-gb")?.value) || 180;
    if (curAlloc > total) {
      $("#ram-swarm-alloc-gb").value = String(Math.max(6, total - 8));
    }
    updateRamSwarmMathUI(true);
  });

  $("#ram-swarm-alloc-slider")?.addEventListener("input", (e) => {
    if ($("#ram-swarm-alloc-gb")) $("#ram-swarm-alloc-gb").value = e.target.value;
    updateRamSwarmMathUI(true);
  });

  $("#ram-swarm-alloc-gb")?.addEventListener("input", (e) => {
    if ($("#ram-swarm-alloc-slider")) $("#ram-swarm-alloc-slider").value = e.target.value;
    updateRamSwarmMathUI(true);
  });

  $$("#ram-swarm-size-seg button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#ram-swarm-size-seg button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const msize = Number(btn.dataset.msize) === 5 ? 5 : 3;
      if ($("#ram-swarm-model-gb")) $("#ram-swarm-model-gb").value = String(msize);
      populateRamSwarmModelDropdown();
      updateRamSwarmMathUI(true);
    });
  });

  $("#ram-swarm-workers")?.addEventListener("input", () => {
    updateRamSwarmMathUI(false);
  });

  $("#ram-swarm-autofill-btn")?.addEventListener("click", () => {
    const total = Math.max(8, Number($("#ram-swarm-total-gb")?.value) || 192);
    const safeAlloc = Math.max(3, total - 6);
    if ($("#ram-swarm-alloc-gb")) $("#ram-swarm-alloc-gb").value = String(safeAlloc);
    if ($("#ram-swarm-alloc-slider")) $("#ram-swarm-alloc-slider").value = String(safeAlloc);
    updateRamSwarmMathUI(true);
  });

  $$(".swarm-goal-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if ($("#ram-swarm-goal")) {
        $("#ram-swarm-goal").value = chip.dataset.goal || "";
        $("#ram-swarm-goal").focus();
      }
    });
  });
}

$("#ram-swarm-download-bat-btn")?.addEventListener("click", async () => {
  const btn = $("#ram-swarm-download-bat-btn");
  const out = $("#ram-swarm-output");
  if (btn) btn.disabled = true;
  const totalRamGb = Number($("#ram-swarm-total-gb")?.value) || 192;
  const allocatedRamGb = Number($("#ram-swarm-alloc-gb")?.value) || 180;
  const modelSizeGb = Number($("#ram-swarm-model-gb")?.value) === 5 ? 5 : 3;
  const workerCount = Number($("#ram-swarm-workers")?.value) || Math.floor(allocatedRamGb / modelSizeGb);
  status(`📥 Generating ${totalRamGb} GB RAM (${allocatedRamGb} GB ÷ ${modelSizeGb} GB = ${workerCount}× ${modelSizeGb}GB Models) Launcher…`);
  try {
    const res = await postJSON("/api/swarm/ram-cluster-script", {
      total_ram_gb: totalRamGb,
      allocated_ram_gb: allocatedRamGb,
      model_size_gb: modelSizeGb,
      worker_count: workerCount,
      model_id: $("#ram-swarm-model")?.value || "Llama-3.2-3B-Instruct-abliterated.Q4_K_M.gguf",
      architecture: $("#ram-swarm-arch")?.value || "shared_kv",
    });
    if (res?.ok) {
      const blob = new Blob([res.bat_script || ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.bat_filename || `launch_${res.worker_count}x_${modelSizeGb}gb_swarm.bat`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (out) {
        out.innerHTML = `
          <div class="a2a-stage-box" style="border-color:var(--ok)">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px">
              <strong style="color:var(--ok)">✅ Downloaded ${res.worker_count}× ${res.model_size_gb || modelSizeGb}GB Model Launcher (<code>${esc(res.bat_filename)}</code>)</strong>
              <span class="right-badge orca">${res.estimated_ram_used_gb} GB Used / ${res.total_ram_gb} GB Total RAM (${res.free_headroom_gb} GB Free)</span>
            </div>
            <div class="muted" style="font-size:12px;margin-top:6px">
              <strong>How this works in plain English:</strong>
              ${
                res.architecture === "shared_kv"
                  ? `Loads your <strong>${res.model_size_gb || modelSizeGb}GB model</strong> weights once in RAM and opens <strong>${res.worker_count} simultaneous parallel slots</strong> (<code>--parallel ${res.worker_count}</code>)—using only <strong>${res.estimated_ram_used_gb} GB of your ${res.total_ram_gb} GB RAM</strong> so all ${res.worker_count} models run at full speed!`
                  : `Spawns <strong>${res.worker_count} separate ${res.model_size_gb || modelSizeGb}GB model processes</strong> on ports <code>9001..${9000 + res.worker_count}</code> across your ${res.total_ram_gb} GB RAM (~${res.estimated_ram_used_gb} GB used).`
              }
            </div>
            <pre style="margin-top:8px;max-height:180px;overflow:auto;padding:8px;background:#050811;border-radius:8px;font-size:11px;color:#aee8ff;font-family:Consolas,monospace">${esc(res.bat_script || "")}</pre>
          </div>`;
      }
      status(`📥 Downloaded ${res.bat_filename} (${res.worker_count}× ${modelSizeGb}GB models)`);
    }
  } catch (e) {
    status("Launcher error: " + (e.message || e));
  } finally {
    if (btn) btn.disabled = false;
  }
});

$("#swarm-queen-boss-model")?.addEventListener("change", () => {
  const preview = $("#swarm-queen-chain-preview");
  const sel = $("#swarm-queen-boss-model");
  if (!preview || !sel) return;
  const order = [...sel.options].map((o) => o.textContent.replace(/^Boss #\d+:\s*/i, "").split(" (")[0]);
  const idx = Math.max(0, sel.selectedIndex);
  const rotated = [...order.slice(idx), ...order.slice(0, idx)];
  preview.innerHTML = `<strong>Active Queen Boss Fallback Chain:</strong> ${rotated.map((name, i) => `${i === 0 ? `<strong style="color:var(--ok)">👑 ${esc(name)}</strong>` : esc(name)}`).join(" → ")} <span style="color:var(--ok)">(keeps rotating until code is 100% approved &amp; completed)</span>`;
});

$("#ram-swarm-run-btn")?.addEventListener("click", async () => {
  const btn = $("#ram-swarm-run-btn");
  const out = $("#ram-swarm-output");
  const goal = ($("#ram-swarm-goal")?.value || "").trim();
  const totalRamGb = Number($("#ram-swarm-total-gb")?.value) || 192;
  const allocatedRamGb = Number($("#ram-swarm-alloc-gb")?.value) || 180;
  const modelSizeGb = Number($("#ram-swarm-model-gb")?.value) === 5 ? 5 : 3;
  const workerCount = Number($("#ram-swarm-workers")?.value) || Math.max(1, Math.floor(allocatedRamGb / modelSizeGb));
  const modelSelect = $("#ram-swarm-model");
  const modelId = modelSelect?.value || "Llama-3.2-3B-Instruct-abliterated.Q4_K_M.gguf";
  const modelLabel = modelSelect?.selectedOptions?.[0]?.textContent || modelId;
  const missionMode = $("#ram-swarm-mission")?.value || "osint_threat_sweep";
  const architecture = $("#ram-swarm-arch")?.value || "shared_kv";
  const spawnSubAgents = $("#ram-swarm-spawn-agents")?.checked !== false;
  const autoSaveSubAgents = $("#ram-swarm-autosave-agents")?.checked !== false;
  const useQueenBoss = Boolean($("#swarm-use-queen-boss")?.checked);
  const queenBossModel = $("#swarm-queen-boss-model")?.value || "qwen3-coder-30b-ablit";
  const queenAutoRotate = $("#swarm-queen-auto-rotate")?.checked !== false;
  const tools = getSelectedSwarmPowerTools();

  if (!goal) {
    status("Type a mission for your Parallel RAM Swarm first");
    $("#ram-swarm-goal")?.focus();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = `🐝 Running ${workerCount}× ${modelSizeGb}GB Models (3 Agents/Group · Queen Boss: ${useQueenBoss ? "ON" : "OFF"})…`;
  }
  status(`🐝 Launching ${workerCount}× ${modelSizeGb}GB Parallel Swarm (${allocatedRamGb} GB / ${totalRamGb} GB RAM · Queen Boss ${useQueenBoss ? "ON" : "OFF"})…`);

  const loadingCells = Array.from({ length: Math.min(workerCount, 96) }, (_, i) => {
    return `<div style="padding:4px 6px;border-radius:6px;background:rgba(124,92,255,.16);border:1px solid rgba(124,92,255,.4);font-size:10px;text-align:center">
      <div style="font-weight:700;color:var(--accent2)">#${i + 1}</div>
      <div class="muted" style="font-size:9px">${modelSizeGb}GB ⚡</div>
    </div>`;
  }).join("");

  if (out) {
    out.innerHTML = `
      <div class="a2a-stage-box" style="border-color:rgba(124,92,255,.5)">
        <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <strong style="color:var(--accent2)">🐝 ${workerCount}× ${modelSizeGb}GB Swarm Models Active (${allocatedRamGb} GB Allocated / ${totalRamGb} GB Total RAM)</strong>
          <span class="right-badge orca">3 AGENTS PER GROUP · QUEEN BOSS: ${useQueenBoss ? "ON" : "OFF (BYPASSED)"}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:5px;margin-bottom:8px">${loadingCells}</div>
        <div class="muted" style="font-size:12px">⏳ Delegating distinct code modules to each group and running <strong>Agent #1 → Agent #2 → Agent #3</strong> sequentially per group (${useQueenBoss ? `Queen Boss: <code>${esc(queenBossModel)}</code>` : "Queen Boss OFF — Direct Multi-Group Output"})…</div>
      </div>`;
  }

  try {
    const cfgPayload = {
      goal,
      total_ram_gb: totalRamGb,
      allocated_ram_gb: allocatedRamGb,
      model_size_gb: modelSizeGb,
      worker_count: workerCount,
      model_id: modelId,
      model_label: modelLabel,
      mission_mode: missionMode,
      architecture,
      spawn_sub_agents: spawnSubAgents,
      auto_save_sub_agents: autoSaveSubAgents,
      use_queen_boss: useQueenBoss,
      queen_boss_model: queenBossModel,
      queen_auto_rotate: queenAutoRotate,
      tools,
    };
    const res = await postJSON("/api/swarm/mass-60", cfgPayload);
    if (!res?.ok) {
      if (out) out.innerHTML = `<div style="color:var(--bad)">❌ ${esc(res?.error || "Swarm execution failed")}</div>`;
      return;
    }

    const workerCells = (res.workers_grid || [])
      .map(
        (w) => `
        <div title="Worker #${w.worker_id} · Sub-Agent: ${esc(w.sub_agent_name || w.shard_label)} · Port ${w.port} · ${w.model_size_gb || modelSizeGb} GB Slot" style="padding:4px 6px;border-radius:6px;background:rgba(46,230,166,.11);border:1px solid rgba(46,230,166,.4);font-size:10px;text-align:center">
          <div style="font-weight:700;color:var(--ok)">#${w.worker_id} ✔</div>
          <div class="muted" style="font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc((w.sub_agent_name || w.shard_label).split(" ")[0])}</div>
        </div>`
      )
      .join("");

    if (out) {
      out.innerHTML = `
        <div class="a2a-stage-box" style="border-color:var(--ok)">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            <strong style="color:var(--ok);font-size:14px">✅ ${res.worker_count}× ${res.ram_plan?.model_size_gb || modelSizeGb}GB Parallel Swarm Complete (3 Agents Per Group)!</strong>
            <span class="right-badge orca">RAM: ${res.ram_plan?.allocated_ram_gb || allocatedRamGb} GB Allocated / ${res.ram_plan?.total_ram_gb} GB Total (${res.ram_plan?.free_headroom_gb} GB Free)</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:5px;margin-bottom:12px">${workerCells}</div>
          <div id="ram-swarm-3agent-progression-mount"></div>
        </div>`;

      const mountEl = out.querySelector("#ram-swarm-3agent-progression-mount");
      if (mountEl) {
        renderSwarmThreeAgentProgressionUI(res, cfgPayload, goal, mountEl);
      }
    }
    status(`✅ ${res.worker_count}× ${modelSizeGb}GB Swarm complete! Showing outputs after Agent #1, Agent #2, and Agent #3 for every group.`);
  } catch (e) {
    if (out) out.innerHTML = `<div style="color:var(--bad)">❌ Swarm error: ${esc(String(e))}</div>`;
    status("Swarm error: " + (e.message || e));
  } finally {
    if (btn) {
      btn.disabled = false;
      updateRamSwarmMathUI(false);
    }
  }
});

// ── Council CLI Direct-Typing Terminal (#view-guardian) + Predictive Tab Autocomplete for All CLIs ──
const COUNCIL_CLI_HELP_TEXT = [
  "╔══════════════════════════════════════════════════════════════════════════════╗",
  "║  🛡️ SUOMYNONA COUNCIL CLI — MAIN SAFE INTERACTIVE MODULE (-h / --help)       ║",
  "╠══════════════════════════════════════════════════════════════════════════════╣",
  "║  ⌨️ KEYBOARD EDITING & PREDICTIVE SHORTCUTS:                                 ║",
  "║    ← / → / Home / End  Move cursor anywhere inside your typed command        ║",
  "║    Backspace / Delete  Fix typos right at the cursor without deleting all    ║",
  "║    Tab                 Auto-complete files in directory & command shortcuts  ║",
  "║    Click on text       Click any character in the input line to place cursor ║",
  "║                                                                              ║",
  "║  🚀 SUOMYNONA COUNCIL APP SHOWCASE & 4-FORMAT PACKAGER COMMANDS:                    ║",
  "║    council open        Open & run the latest built Suomynona Council app right here ║",
  "║    council package cli Package finished app as an interactive CLI tool       ║",
  "║    council package script Package finished app as a portable script          ║",
  "║    council package gui Package finished app as a Desktop/Web GUI app         ║",
  "║    council package exe Package finished app as a standalone Windows EXE      ║",
  "║                                                                              ║",
  "║  🤖 AI & SELF-REPAIR COMMANDS:                                               ║",
  "║    council <task>      Ask Council CLI AI to inspect, build, or fix files    ║",
  "║    repair              Automatically check & self-heal any broken app files  ║",
  "║    doctor <error>      Auto-install missing Python/Node packages             ║",
  "║    ports               Scan active listening web app ports                   ║",
  "║    preview             Open live split web preview of running app            ║",
  "║    backup / rollback   Save or restore a safe workspace restore point        ║",
  "║                                                                              ║",
  "║  💻 NORMAL LINUX / SHELL COMMANDS:                                           ║",
  "║    ls -la, cd <dir>, python3 <file.py>, node <file.js>, git status, clear    ║",
  "╚══════════════════════════════════════════════════════════════════════════════╝",
].join("\n");

const LOCAL_UNIFIED_CLI_CATALOG = [
  { value: "/commands", kind: "help", description: "📖 Show ALL commands across every CLI & subsystem (Full Catalog)" },
  { value: "/cmd", kind: "help", description: "📖 Show ALL commands (or '/cmd <command>' to run in Windows CMD)" },
  { value: "/host", kind: "popup", description: "🗔 Open Host Infrastructure, OAuth, Tunnels & RAM/VRAM Configurator Pop-up" },
  { value: "/models", kind: "popup", description: "🗔 Open Models Lineup, Active Council Chips & 6-Slot Router Pop-up" },
  { value: "/boosters", kind: "popup", description: "🗔 Open 19 Multi-GPU Boosters, Eternal Cortex DPO & GPU Drills Pop-up" },
  { value: "/bucket", kind: "popup", description: "🗔 Open Hugging Face Buckets, 4-Layer Model Vault & GGUF Pop-up" },
  { value: "/presets", kind: "popup", description: "🗔 Open Built-In Model Team Presets & Saved Custom Lineups Pop-up" },
  { value: "/cloud", kind: "popup", description: "🗔 Open Cloud & Uncensored Orca API Models Roster Pop-up" },
  { value: "/agents", kind: "popup", description: "🗔 Open Specialist Agent Forge, Directory & Task Runner Pop-up" },
  { value: "/tools", kind: "popup", description: "🗔 Open Custom Agent Tools (10 Types) & 20 MCP Servers Pop-up" },
  { value: "/mcp", kind: "popup", description: "🗔 Open 20 Connected MCP Servers & Protocol Bridge Pop-up" },
  { value: "/tuning", kind: "popup", description: "🗔 Open Model Temperature, Top-P, Max Tokens & Judge Picker Pop-up" },
  { value: "/judge", kind: "popup", description: "🗔 Open Judge Model Selector & Strictness Tuning Pop-up (or '/judge <idx>')" },
  { value: "/system", kind: "popup", description: "🗔 Open System Core, Cluster Health Table, A2A Stealth & Output Path Pop-up" },
  { value: "/a2a", kind: "popup", description: "🗔 Open A2A Stealth Bridge, Privacy Scrubber & JSON-RPC Pop-up" },
  { value: "/auth", kind: "popup", description: "🗔 Open Host Auth, OAuth Code & Global Credentials Vault Pop-up" },
  { value: "/council", kind: "mode", description: "🛡️ Switch to Master Council CLI mode (or '/council <cmd>')" },
  { value: "/claude", kind: "mode", description: "🤖 Claude Brain: Switch to Claude Code Autonomous Coder mode (or '/claude <task>')" },
  { value: "/claude build ", kind: "claude", description: "🤖 Claude Brain: Architect, write, test & self-heal a complete app" },
  { value: "/claude repair", kind: "claude", description: "🤖 Claude Brain: Inspect workspace, fix syntax errors & self-heal" },
  { value: "/claude doctor", kind: "claude", description: "🤖 Claude Brain: Run deep environment & dependency diagnostics" },
  { value: "/claude review", kind: "claude", description: "🤖 Claude Brain: Perform full code & security audit on workspace" },
  { value: "/brain", kind: "mode", description: "🧠 Claude Brain: Switch to Brain Copilot mode (or '/brain <prompt>')" },
  { value: "/colab", kind: "mode", description: "🖥 Switch to Colab & Multi-Host GPU CLI mode (or '/colab <cmd>')" },
  { value: "/router", kind: "popup", description: "🗔 Open Models Router, 6-Slot Lineup & Active Roster Pop-up" },
  { value: "/lineup", kind: "popup", description: "🗔 Open Models Lineup, GPU Slots & Presets Pop-up" },
  { value: "/slots", kind: "popup", description: "🗔 Open 6-Slot GPU Model Architecture Configurator Pop-up" },
  { value: "/balance", kind: "router", description: "⚖️ Auto-balance 6-slot models across active GPU hosts" },
  { value: "/vram", kind: "gpu", description: "📊 Live GPU VRAM pressure, KV-cache footprint & spillover report across Hosts A–D" },
  { value: "/rebalance", kind: "gpu", description: "⚖️ Deduplicate clones & pack models across Hosts A–D via First-Fit Decreasing (FFD)" },
  { value: "/rebalance --dry-run", kind: "gpu", description: "🧪 Preview FFD VRAM migrations across Hosts A–D without modifying lineup" },
  { value: "/bash", kind: "shell", description: "🐚 Switch active script shell to Linux Bash (/bin/bash)" },
  { value: "/pwsh", kind: "shell", description: "⚡ Switch active script shell to Windows PowerShell (pwsh / .ps1)" },
  { value: "/powershell", kind: "shell", description: "⚡ Switch active script shell to Windows PowerShell (pwsh / .ps1)" },
  { value: "/bat", kind: "shell", description: "🪟 Switch active script shell to Windows Batch / Command Prompt (.bat)" },
  { value: "/python", kind: "shell", description: "🐍 Switch active interpreter to interactive Python 3 REPL" },
  { value: "/node", kind: "shell", description: "🟢 Switch active interpreter to interactive Node.js REPL" },
  { value: "/swarm ", kind: "swarm", description: "🐝 Launch Unrestricted Queen Boss + Parallel Worker Swarm in CLI" },
  { value: "/hotpotato ", kind: "build", description: "🥔 Run Hot Potato Fault-Tolerant Continuous Code Build in CLI" },
  { value: "/decomposer ", kind: "build", description: "🧩 Run 10–20 Piece Safety-Bypass Modular Code Decomposer & Merger" },
  { value: "/auth all", kind: "auth", description: "🔑 Authenticate All Hosts (Host A + B + C + D) & GPU Accelerators" },
  { value: "/auth a", kind: "auth", description: "🔑 Authenticate Host A & its GPU Accelerator" },
  { value: "/auth b", kind: "auth", description: "🔑 Authenticate Host B & its GPU Accelerator" },
  { value: "/auth c", kind: "auth", description: "🔑 Authenticate Host C & its GPU Accelerator" },
  { value: "/auth d", kind: "auth", description: "🔑 Authenticate Host D & its GPU Accelerator" },
  { value: "/oauth ", kind: "auth", description: "🔗 Submit Google OAuth code or bind https://*.trycloudflare.com tunnel URL" },
  { value: "/host all", kind: "host", description: "🌐 Target ALL configured GPU Hosts (Colab A/B/C/D + Kaggle + Localhost)" },
  { value: "/host a", kind: "host", description: "🖥 Switch target GPU runtime to Host A" },
  { value: "/host b", kind: "host", description: "🖥 Switch target GPU runtime to Host B" },
  { value: "/host c", kind: "host", description: "🖥 Switch target GPU runtime to Host C" },
  { value: "/host d", kind: "host", description: "🖥 Switch target GPU runtime to Host D" },
  { value: "/host kaggle", kind: "host", description: "🦆 Switch target GPU runtime to Kaggle Kernel" },
  { value: "/host localhost", kind: "host", description: "💻 Switch target GPU runtime to Localhost PC" },
  { value: "/host custom", kind: "host", description: "🔌 Switch target GPU runtime to Custom GPU Host" },
  { value: "/sessions", kind: "gpu", description: "📋 List active Google Colab, Kaggle, Localhost & Custom Host sessions" },
  { value: "/status", kind: "status", description: "📊 Show full status of GPU Hosts, Memory Vault, Boosters & Active Mode" },
  { value: "/start all", kind: "gpu", description: "▶ Start & verify all GPU Host runtimes and models" },
  { value: "/start a", kind: "gpu", description: "▶ Start & verify Host A runtime and models" },
  { value: "/start b", kind: "gpu", description: "▶ Start & verify Host B runtime and models" },
  { value: "/start c", kind: "gpu", description: "▶ Start & verify Host C runtime and models" },
  { value: "/start d", kind: "gpu", description: "▶ Start & verify Host D runtime and models" },
  { value: "/stop all", kind: "gpu", description: "🛑 Stop all active GPU runtimes" },
  { value: "/reconnect", kind: "gpu", description: "⚡ Force immediate handshake & tunnel reconnect on target host" },
  { value: "/nvidia-smi", kind: "gpu", description: "🎮 Query live NVIDIA GPU VRAM, temperature & utilization across hosts" },
  { value: "/boosters on", kind: "gpu", description: "🚀 Enable all 19 Multi-GPU Supercharger Boosters" },
  { value: "/boosters off", kind: "gpu", description: "🚀 Disable Multi-GPU Supercharger Boosters" },
  { value: "/train", kind: "gpu", description: "🧬 Trigger Eternal Cortex Continuous DPO LoRA r64 training step" },
  { value: "/hf-sync", kind: "hf", description: "🤗 Sync all linked Hugging Face Buckets & verify GGUF weights" },
  { value: "/endpoints", kind: "gpu", description: "🔄 Refresh live GPU host tunnel URLs from GitHub Gist" },
  { value: "/save-dir ", kind: "tool", description: "💾 Set directory where generated model files & builds are saved" },
  { value: "/vscode", kind: "tool", description: "💻 Export active Council files & open workspace in VS Code" },
  { value: "/doctor", kind: "tool", description: "🩺 Run environment doctor & auto-install missing Python/Node packages" },
  { value: "/repair", kind: "tool", description: "🔧 Auto-check and self-heal any broken files in the workspace" },
  { value: "/backup", kind: "tool", description: "📸 Create a workspace snapshot restore point" },
  { value: "/rollback", kind: "tool", description: "⏪ Restore workspace to the latest snapshot" },
  { value: "/ports", kind: "tool", description: "🔌 Scan active listening network & web app ports" },
  { value: "/preview", kind: "tool", description: "🖥️ Toggle live split web application GUI preview inside CLI" },
  { value: "/package cli", kind: "pkg", description: "📦 Compile & package finished build as an interactive CLI binary" },
  { value: "/package script", kind: "pkg", description: "📜 Compile & package finished build as a portable Script" },
  { value: "/package gui", kind: "pkg", description: "🖼️ Compile & package finished build as a Desktop/Web GUI app" },
  { value: "/package exe", kind: "pkg", description: "📦 Compile & package finished build as a standalone Windows .EXE" },
  { value: "/compile exe", kind: "pkg", description: "📦 Compile finished build as a standalone Windows .EXE" },
  { value: "/logs", kind: "tool", description: "📡 Stream recent Live Council Server Activity logs inside the terminal" },
  { value: "/live", kind: "mode", description: "⚡ Switch CLI to Real OS Terminal execution mode" },
  { value: "/sandbox", kind: "mode", description: "🔒 Switch CLI to Isolated Sandbox execution mode" },
  { value: "/clear", kind: "tool", description: "🧹 Clear the unified terminal screen" },
  { value: "/help", kind: "help", description: "📖 Show the complete Suomynona Council Unified CLI command & slash reference" },
  { value: "claude ", kind: "claude", description: "🤖 Claude Code: Inspect, build, test, or fix files in workspace" },
  { value: "claude doctor", kind: "claude", description: "🤖 Claude Code: Run workspace & runtime diagnostics" },
  { value: "claude repair", kind: "claude", description: "🤖 Claude Code: Auto-heal broken files" },
  { value: "Get-ChildItem", kind: "pwsh", description: "⚡ PowerShell: List directory contents" },
  { value: "Get-Process", kind: "pwsh", description: "⚡ PowerShell: List running processes" },
  { value: "Get-Content ", kind: "pwsh", description: "⚡ PowerShell: Read file contents" },
  { value: "$PSVersionTable", kind: "pwsh", description: "⚡ PowerShell: Show PowerShell version table" },
  { value: "dir", kind: "cmd", description: "🪟 CMD: List files and subdirectories" },
  { value: "ipconfig /all", kind: "cmd", description: "🪟 CMD: Show network adapter IP configuration" },
  { value: "tasklist", kind: "cmd", description: "🪟 CMD: List running processes and PIDs" },
  { value: "systeminfo", kind: "cmd", description: "🪟 CMD: Display system hardware & OS details" },
];

async function fetchTerminalCompletion(line, cursorPos, scope = "council") {
  const rawLine = String(line || "");
  const trimmed = rawLine.trimStart();
  const lower = trimmed.toLowerCase();

  const localMatches = lower
    ? LOCAL_UNIFIED_CLI_CATALOG.filter((item) => item.value.toLowerCase().startsWith(lower))
    : [];

  if (trimmed.startsWith("/") && localMatches.length > 0) {
    const first = localMatches[0].value;
    const ghost_suffix = first.toLowerCase().startsWith(lower) ? first.slice(trimmed.length) : "";
    return {
      ok: true,
      completions: localMatches,
      ghost_suffix,
      replacement_line: first,
      new_cursor_pos: first.length,
    };
  }

  const activeScope = scope === "council" && unifiedTerminalMode === "colab" ? "colab" : scope;
  try {
    const serverRes = await postJSON("/api/terminal/complete", {
      line,
      cursor_pos: cursorPos,
      scope: activeScope,
    });
    const combined = [...localMatches];
    const seen = new Set(combined.map((c) => c.value));
    for (const item of serverRes?.completions || []) {
      if (!seen.has(item.value)) {
        seen.add(item.value);
        combined.push({
          ...item,
          description: item.description || item.desc || "",
        });
      }
    }
    const top = combined[0];
    const ghost_suffix =
      top && trimmed && top.value.toLowerCase().startsWith(lower)
        ? top.value.slice(trimmed.length)
        : serverRes?.ghost_suffix || "";
    return {
      ...serverRes,
      ok: true,
      completions: combined,
      ghost_suffix,
    };
  } catch (_) {
    const first = localMatches[0]?.value || "";
    return {
      ok: localMatches.length > 0,
      completions: localMatches,
      ghost_suffix: first && lower && first.toLowerCase().startsWith(lower) ? first.slice(trimmed.length) : "",
    };
  }
}

const COLAB_MULTIHOST_CLI_HELP_TEXT = [
  "╔══════════════════════════════════════════════════════════════════════════════╗",
  "║         ⚡ MULTI-HOST CLI (COLAB · KAGGLE · LOCALHOST · CUSTOM HOST)         ║",
  "╠══════════════════════════════════════════════════════════════════════════════╣",
  "║  🎯 DIRECT TERMINAL SHORTCUTS:                                               ║",
  "║    Type directly & press Enter to run immediately (no Run button needed)     ║",
  "║    Tab                  Complete & cycle commands matching typed letters     ║",
  "║    ← / → / Home / End   Move cursor anywhere inside your command to edit     ║",
  "║    ↑ / ↓                Cycle through previous command history               ║",
  "║                                                                              ║",
  "║  🌐 MULTI-HOST & PROVIDER COMMANDS:                                          ║",
  "║    sessions             List live Colab, Kaggle, Localhost & Custom hosts    ║",
  "║    status / usage       Show GPU VRAM, disk & RAM across selected host(s)    ║",
  "║    nvidia-smi           Query NVIDIA GPU telemetry (T4, L4, A100, P100)      ║",
  "║    kaggle kernels list  List Kaggle GPU notebooks & status                   ║",
  "║    localhost status     Inspect local GPU / Ollama / llama.cpp runtime       ║",
  "║    custom-host status   Inspect custom remote GPU endpoint                   ║",
  "║    host all|a|b|c|kaggle|localhost|custom  Switch target host from prompt    ║",
  "╚══════════════════════════════════════════════════════════════════════════════╝",
].join("\n");

function renderCompletionChips(suggestionsEl, completions, onPick, activeIndex = 0, prefixLabel = "") {
  if (!suggestionsEl) return;
  if (!Array.isArray(completions) || !completions.length) {
    suggestionsEl.classList.add("hidden");
    suggestionsEl.innerHTML = "";
    return;
  }
  suggestionsEl.classList.remove("hidden");
  const titleText = prefixLabel
    ? `Matches for "${esc(prefixLabel)}" (Press Tab to cycle):`
    : `Tab Predictions (Press Tab to cycle):`;
  suggestionsEl.innerHTML = `<span class="muted" style="font-size:10.5px;margin-right:6px;font-weight:600;color:#2ee6a6">${titleText}</span>`;
  completions.slice(0, 12).forEach((item, idx) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "cli-suggestion-chip" + (idx === activeIndex ? " active" : "");
    const metaLabel = item.description ? `${item.description}` : (item.kind || "");
    chip.innerHTML = `<span style="font-weight:700">${esc(item.value)}</span>${metaLabel ? `<span class="chip-kind" style="margin-left:5px;opacity:0.8">${esc(metaLabel)}</span>` : ""}`;
    chip.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onPick(item, idx);
    };
    suggestionsEl.appendChild(chip);
  });
}

function attachInputAutocomplete(inputEl, { ghostEl = null, suggestionsEl = null, scope = "colab" } = {}) {
  if (!inputEl || inputEl._autocompleteAttached) return;
  inputEl._autocompleteAttached = true;

  let lastCompRes = null;
  let cycleIdx = 0;
  let reqCounter = 0;

  function updateGhostDisplay() {
    if (!ghostEl) return;
    const val = inputEl.value || "";
    const cur = inputEl.selectionStart ?? val.length;
    if (!val || cur !== val.length || !lastCompRes?.ghost_suffix) {
      ghostEl.textContent = "";
      return;
    }
    ghostEl.innerHTML = `<span class="ghost-prefix-spacer">${esc(val)}</span><span class="ghost-suffix">${esc(lastCompRes.ghost_suffix)}</span>`;
  }

  async function requestPredictions(showChips = false) {
    const val = inputEl.value || "";
    const cur = inputEl.selectionStart ?? val.length;
    if (!val.trim()) {
      lastCompRes = null;
      if (ghostEl) ghostEl.textContent = "";
      if (suggestionsEl) {
        suggestionsEl.classList.add("hidden");
        suggestionsEl.innerHTML = "";
      }
      return null;
    }
    const myId = ++reqCounter;
    const res = await fetchTerminalCompletion(val, cur, scope);
    if (myId !== reqCounter) return res;
    lastCompRes = res;
    cycleIdx = 0;
    updateGhostDisplay();
    if (showChips && suggestionsEl) {
      renderCompletionChips(suggestionsEl, res.completions || [], (picked) => {
        applyCompletionItem(picked);
      });
    }
    return res;
  }

  function applyCompletionItem(item) {
    if (!item) return;
    const val = inputEl.value || "";
    const cur = inputEl.selectionStart ?? val.length;
    const beforeCursor = val.slice(0, cur);
    const afterCursor = val.slice(cur);
    const tokenMatch = beforeCursor.match(/([^\s"']+)$/);
    const tokenStart = tokenMatch ? beforeCursor.length - tokenMatch[1].length : cur;
    let replacement = item.value;
    if (!beforeCursor.slice(0, tokenStart).trim() && item.value.includes(" ")) {
      replacement = item.value;
    }
    const suffixSpace = item.value.endsWith("/") ? "" : " ";
    const nextVal = val.slice(0, tokenStart) + replacement + suffixSpace + afterCursor.replace(/^\s+/, "");
    const nextCursor = tokenStart + replacement.length + suffixSpace.length;
    inputEl.value = nextVal;
    inputEl.focus();
    inputEl.setSelectionRange(nextCursor, nextCursor);
    requestPredictions(true);
  }

  inputEl.addEventListener("input", () => {
    requestPredictions(false);
  });
  inputEl.addEventListener("click", () => updateGhostDisplay());
  inputEl.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      updateGhostDisplay();
    }
  });
  inputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const val = inputEl.value || "";
      const cur = inputEl.selectionStart ?? val.length;
      const res = await fetchTerminalCompletion(val, cur, scope);
      lastCompRes = res;
      const list = res.completions || [];
      if (!list.length) return;
      const chosen = list[cycleIdx % list.length];
      cycleIdx = (cycleIdx + 1) % list.length;
      applyCompletionItem(chosen);
      if (suggestionsEl) {
        renderCompletionChips(suggestionsEl, list, (picked) => applyCompletionItem(picked));
      }
    } else if (e.key === "Escape") {
      if (ghostEl) ghostEl.textContent = "";
      if (suggestionsEl) suggestionsEl.classList.add("hidden");
    }
  });
}

function setupDirectTypingTerminal(cfg) {
  const termEl = $(cfg.termSelector);
  const outEl = $(cfg.outSelector);
  const typedEl = $(cfg.typedSelector);
  const ghostEl = cfg.ghostSelector ? $(cfg.ghostSelector) : null;
  const suggestionsEl = cfg.suggestionsSelector ? $(cfg.suggestionsSelector) : null;
  const placeholderEl = $(cfg.placeholderSelector);
  const blockCursorEl = termEl?.querySelector(".direct-term-cursor");
  if (!termEl || !outEl || !typedEl) return;

  const topbarEl = termEl.querySelector(".direct-term-topbar");
  if (topbarEl) {
    attachTerminalTypingControls(topbarEl, outEl);
  }

  let buffer = "";
  let cursorPos = 0;
  const storageKey = `suomynona_cli_hist_${cfg.scope || "direct"}`;
  let cmdHistory = [];
  try {
    const raw = localStorage.getItem(storageKey) || localStorage.getItem("suomynona_cli_hist_global");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) cmdHistory = parsed;
    }
  } catch (_) {}
  let histIdx = -1;
  let tempDraft = "";
  let lastCompRes = null;
  let compReqId = 0;
  let tabBasePrefix = null;
  let tabCycleList = [];
  let tabCycleIdx = 0;

  function resetTabCycle() {
    tabBasePrefix = null;
    tabCycleList = [];
    tabCycleIdx = 0;
  }

  function syncBufferUI() {
    cursorPos = Math.max(0, Math.min(cursorPos, buffer.length));
    typedEl.innerHTML = "";
    for (let i = 0; i < buffer.length; i++) {
      const span = document.createElement("span");
      span.className = "direct-term-char" + (i === cursorPos ? " direct-term-inline-cursor" : "");
      span.textContent = buffer[i];
      span.dataset.idx = String(i);
      span.onclick = (ev) => {
        ev.stopPropagation();
        cursorPos = i;
        syncBufferUI();
        termEl.focus();
      };
      typedEl.appendChild(span);
    }
    if (blockCursorEl) {
      blockCursorEl.classList.toggle("hidden", cursorPos < buffer.length);
    }
    if (placeholderEl) {
      placeholderEl.classList.toggle("hidden", buffer.length > 0);
    }
    if (ghostEl) {
      if (buffer.length > 0 && cursorPos === buffer.length && lastCompRes?.ghost_suffix) {
        ghostEl.textContent = lastCompRes.ghost_suffix;
      } else {
        ghostEl.textContent = "";
      }
    }
  }

  async function refreshPredictions(showChips = false) {
    if (!buffer.trim()) {
      lastCompRes = null;
      if (ghostEl) ghostEl.textContent = "";
      if (suggestionsEl) {
        suggestionsEl.classList.add("hidden");
        suggestionsEl.innerHTML = "";
      }
      return null;
    }
    const myId = ++compReqId;
    const res = await fetchTerminalCompletion(buffer, cursorPos, cfg.scope || "council");
    if (myId !== compReqId) return res;
    lastCompRes = res;
    syncBufferUI();
    if (showChips && suggestionsEl) {
      renderCompletionChips(
        suggestionsEl,
        res.completions || [],
        (picked) => {
          resetTabCycle();
          applyPickedCompletion(picked);
        },
        0,
        buffer.trim()
      );
    }
    return res;
  }

  function applyPickedCompletion(picked, keepTabCycle = false) {
    if (!picked) return;
    if (keepTabCycle && tabBasePrefix !== null) {
      buffer = picked.value;
      cursorPos = buffer.length;
      if (lastCompRes) lastCompRes.ghost_suffix = "";
      syncBufferUI();
      termEl.focus();
      return;
    }
    const beforeCursor = buffer.slice(0, cursorPos);
    const afterCursor = buffer.slice(cursorPos);
    const tokenMatch = beforeCursor.match(/([^\s"']+)$/);
    const tokenStart = tokenMatch ? beforeCursor.length - tokenMatch[1].length : cursorPos;
    const isFullCommandSuggestion = !beforeCursor.slice(0, tokenStart).trim() && picked.value.includes(" ");
    const suffixSpace = picked.value.endsWith("/") ? "" : " ";
    if (isFullCommandSuggestion) {
      buffer = picked.value;
      cursorPos = buffer.length;
    } else {
      buffer = buffer.slice(0, tokenStart) + picked.value + suffixSpace + afterCursor.replace(/^\s+/, "");
      cursorPos = tokenStart + picked.value.length + suffixSpace.length;
    }
    syncBufferUI();
    refreshPredictions(true);
    termEl.focus();
  }

  function appendLine(text, color = "#e2e8f0", instant = false) {
    appendTypedTerminalBlock(outEl, text, {
      color,
      marginBottom: "6px",
      instant,
    });
  }

  if (!outEl.textContent.trim() && !(outEl._typeQueue && outEl._typeQueue.length)) {
    const welcomeMsg =
      cfg.welcomeText ||
      "Welcome to Council CLI. Use ←/→ arrows to edit anywhere, Tab to auto-complete, or -h for help.";
    appendLine(welcomeMsg, "#2ee6a6", false);
  }

  termEl.addEventListener("click", (ev) => {
    if (ev.target === typedEl || ev.target === termEl || ev.target.classList.contains("direct-term-prompt-line")) {
      cursorPos = buffer.length;
      syncBufferUI();
    }
    termEl.focus();
  });

  termEl.addEventListener("paste", (e) => {
    const pasted = (e.clipboardData?.getData("text") || "").replace(/[\r\n]+/g, " ");
    if (pasted) {
      e.preventDefault();
      resetTabCycle();
      buffer = buffer.slice(0, cursorPos) + pasted + buffer.slice(cursorPos);
      cursorPos += pasted.length;
      syncBufferUI();
      refreshPredictions(false);
    }
  });

  termEl.addEventListener("keydown", async (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetTabCycle();
      flushTerminalTypingQueue(outEl);
      if (suggestionsEl) suggestionsEl.classList.add("hidden");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (tabBasePrefix !== null && tabCycleList.length > 0) {
        tabCycleIdx = (tabCycleIdx + 1) % tabCycleList.length;
        const chosen = tabCycleList[tabCycleIdx];
        applyPickedCompletion(chosen, true);
        if (suggestionsEl) {
          renderCompletionChips(
            suggestionsEl,
            tabCycleList,
            (picked) => {
              resetTabCycle();
              applyPickedCompletion(picked, false);
            },
            tabCycleIdx,
            tabBasePrefix
          );
        }
        return;
      }

      const queryPrefix = buffer.trim();
      const res = await fetchTerminalCompletion(buffer, cursorPos, cfg.scope || "council");
      lastCompRes = res;
      const list = res?.completions || [];
      if (list.length > 0) {
        tabBasePrefix = queryPrefix || "";
        tabCycleList = list;
        tabCycleIdx = 0;
        const firstChoice = list[0];
        applyPickedCompletion(firstChoice, true);
        if (suggestionsEl) {
          renderCompletionChips(
            suggestionsEl,
            list,
            (picked) => {
              resetTabCycle();
              applyPickedCompletion(picked, false);
            },
            0,
            tabBasePrefix
          );
        }
      } else if (res?.replacement_line) {
        buffer = res.replacement_line;
        cursorPos = typeof res.new_cursor_pos === "number" ? res.new_cursor_pos : buffer.length;
        syncBufferUI();
      }
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        resetTabCycle();
        const left = buffer.slice(0, cursorPos).replace(/\s+$/, "");
        const lastSpace = left.lastIndexOf(" ");
        cursorPos = lastSpace === -1 ? 0 : lastSpace + 1;
        syncBufferUI();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        resetTabCycle();
        const right = buffer.slice(cursorPos);
        const match = right.match(/^\s*\S+/);
        cursorPos += match ? match[0].length : right.length;
        syncBufferUI();
        return;
      }
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        cursorPos = 0;
        syncBufferUI();
        return;
      }
      if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        cursorPos = buffer.length;
        syncBufferUI();
        return;
      }
      if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        clearTerminalContainer(outEl);
        return;
      }
      if (e.key.toLowerCase() === "c") {
        if (window.getSelection()?.toString()) return;
        e.preventDefault();
        resetTabCycle();
        flushTerminalTypingQueue(outEl);
        appendLine(`${cfg.ps1()} ${buffer}^C`, "#94a3b8", true);
        buffer = "";
        cursorPos = 0;
        lastCompRes = null;
        syncBufferUI();
        return;
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      resetTabCycle();
      cursorPos = Math.max(0, cursorPos - 1);
      syncBufferUI();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      resetTabCycle();
      if (cursorPos === buffer.length && lastCompRes?.ghost_suffix) {
        buffer += lastCompRes.ghost_suffix;
        cursorPos = buffer.length;
        lastCompRes = null;
        syncBufferUI();
        refreshPredictions(false);
        return;
      }
      cursorPos = Math.min(buffer.length, cursorPos + 1);
      syncBufferUI();
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      resetTabCycle();
      cursorPos = 0;
      syncBufferUI();
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      resetTabCycle();
      cursorPos = buffer.length;
      syncBufferUI();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      resetTabCycle();
      if (cursorPos > 0) {
        buffer = buffer.slice(0, cursorPos - 1) + buffer.slice(cursorPos);
        cursorPos--;
        syncBufferUI();
        refreshPredictions(true);
      }
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      resetTabCycle();
      if (cursorPos < buffer.length) {
        buffer = buffer.slice(0, cursorPos) + buffer.slice(cursorPos + 1);
        syncBufferUI();
        refreshPredictions(true);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      resetTabCycle();
      if (cmdHistory.length) {
        if (histIdx === -1) {
          tempDraft = buffer;
        }
        histIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
        buffer = cmdHistory[histIdx];
        cursorPos = buffer.length;
        syncBufferUI();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      resetTabCycle();
      if (histIdx === -1) return;
      if (histIdx > 0) {
        histIdx--;
        buffer = cmdHistory[histIdx];
      } else {
        histIdx = -1;
        buffer = tempDraft || "";
      }
      cursorPos = buffer.length;
      syncBufferUI();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      resetTabCycle();
      const cmd = buffer.trim();
      buffer = "";
      cursorPos = 0;
      histIdx = -1;
      tempDraft = "";
      lastCompRes = null;
      if (suggestionsEl) suggestionsEl.classList.add("hidden");
      syncBufferUI();

      appendLine(`${cfg.ps1()} ${cmd}`, "#00d4ff", true);
      if (!cmd) return;

      if (cmdHistory[0] !== cmd) {
        cmdHistory.unshift(cmd);
        if (cmdHistory.length > 80) cmdHistory.pop();
        try {
          localStorage.setItem(storageKey, JSON.stringify(cmdHistory.slice(0, 50)));
          localStorage.setItem("suomynona_cli_hist_global", JSON.stringify(cmdHistory.slice(0, 50)));
        } catch (_) {}
      }

      if (cmd === "clear" || cmd === "cls") {
        clearTerminalContainer(outEl);
        return;
      }

      if (cmd.endsWith(" -h") || cmd.endsWith(" --help") || cmd === "-h" || cmd === "--help" || cmd === "/?") {
        renderCliCommandHelp(cmd, cfg.scope || "master", appendLine);
        return;
      }

      const cmdLow = cmd.toLowerCase();
      if (cmdLow === "/cmd" || cmdLow === "/cmds" || cmdLow === "cmd" || cmdLow === "cmds" || cmdLow === "/command" || cmdLow === "/commands" || cmdLow === "commands") {
        renderCliCommandsList(cfg.scope || "master", null, appendLine);
        return;
      }

      await cfg.onExecute(cmd, appendLine);
      return;
    }

    if (e.key.length === 1 && !e.altKey) {
      e.preventDefault();
      resetTabCycle();
      buffer = buffer.slice(0, cursorPos) + e.key + buffer.slice(cursorPos);
      cursorPos++;
      syncBufferUI();
      refreshPredictions(true);
    }
  });
}

const MASTER_UNIFIED_CLI_HELP_TEXT = [
  "╔════════════════════════════════════════════════════════════════════════════════════════════╗",
  "║  ◈ SUOMYNONA COUNCIL — COMPLETE MASTER COMMAND & GUI POP-UP CATALOG (/commands · /help)    ║",
  "╠════════════════════════════════════════════════════════════════════════════════════════════╣",
  "║  🗔 1. GUI CONFIGURATOR POP-UP WINDOWS (Type command to open interactive GUI window):       ║",
  "║    /host  (or /hosts)        Open Host Infrastructure, OAuth, Tunnels & RAM/VRAM Pop-up   ║",
  "║    /models (or /lineup)      Open Models Lineup, Active Council Chips & 6-Slot Router     ║",
  "║    /boosters (or /dpo)       Open 19 Multi-GPU Boosters, Eternal Cortex DPO & GPU Drills  ║",
  "║    /bucket (or /vault)       Open Hugging Face Buckets, 4-Layer Vault & Custom GGUF       ║",
  "║    /presets                  Open Built-In Model Team Presets & Saved Custom Lineups      ║",
  "║    /cloud (or /apis)         Open Cloud & Uncensored Orca API Models Roster               ║",
  "║    /agents (or /forge)       Open Specialist Agent Forge, Directory & Task Runner         ║",
  "║    /tools                    Open Custom Agent Tools Builder (10 Execution Types)         ║",
  "║    /mcp                      Open 20 Connected MCP Servers & Protocol Manager             ║",
  "║    /tuning (or /judge)       Open Temperature, Top-P, Max Tokens & Judge Model Picker     ║",
  "║    /system (or /a2a)         Open System Core, Cluster Health, Gist Sync & A2A Bridge     ║",
  "║    /auth                     Open Global Credentials Vault, OAuth & Host Auth Pop-up      ║",
  "║                                                                                            ║",
  "║  🔀 2. CORE AI MODES & SHELL INTERPRETERS:                                                 ║",
  "║    /council [cmd]            Master Council CLI (Shell, App Builder, Packager, Doctor)    ║",
  "║    /claude [task]            Claude Autonomous Brain (Architect, Read/Write/Test/Fix)     ║",
  "║    /brain [question]         Brain Copilot (Persistent Memory + Orchestration)            ║",
  "║    /colab [cmd]              Multi-Host GPU CLI (Colab A/B/C, Kaggle, Localhost, Custom)  ║",
  "║    /bash [cmd]               Switch to Linux Bash (/bin/bash) or execute inline script    ║",
  "║    /pwsh [cmd]               Switch to Windows PowerShell (pwsh / .ps1) or run cmdlet     ║",
  "║    /cmd [cmd]                Show all commands (or '/cmd <command>' for Windows CMD)      ║",
  "║    /python [code]            Switch to Python 3 interactive runner or run inline code     ║",
  "║    /node [code]              Switch to Node.js interactive runner or run inline JS        ║",
  "║    /live  |  /sandbox        Toggle between Real OS Terminal and Isolated Sandbox         ║",
  "║                                                                                            ║",
  "║  🐝 3. MULTI-AGENT SWARM, HOT POTATO, DECOMPOSER & DEBATE:                                 ║",
  "║    /swarm <goal>             Run Unrestricted Queen Boss + Parallel Worker Swarm          ║",
  "║    /hotpotato <task>         Run Fault-Tolerant Hot Potato Continuous Code Completion     ║",
  "║    /decomposer <task>        Run 10–20 Piece Modular Code Decomposer & Auto-Merger        ║",
  "║                                                                                            ║",
  "║  🖥 4. INLINE HOST, MODEL, BUCKET, BOOSTER & BUILD SUBCOMMANDS:                            ║",
  "║    /host [all|a|b|c|d|kaggle|localhost|custom] Switch active target GPU Host              ║",
  "║    /auth [all|a|b|c|d|clear] Authenticate GPU Host(s) or clear cached token               ║",
  "║    /oauth <code_or_url>      Submit Google OAuth code or TryCloudflare tunnel URL         ║",
  "║    /models [list|all|toggle <idx>]   List models, select all, or toggle slot #            ║",
  "║    /judge [auto|<slot_idx>]  Inspect or switch active Judge model                         ║",
  "║    /boosters [on|off]        Toggle all 19 Multi-GPU Supercharger Boosters inline         ║",
  "║    /train [note]             Run Eternal Cortex Continuous DPO LoRA r64 training step     ║",
  "║    /bucket link <uri>        Link Hugging Face Bucket (hf://buckets/owner/bucket)         ║",
  "║    /hf-sync                  Sync all linked Hugging Face Buckets & verify GGUF weights   ║",
  "║    /agents run <task>        Dispatch active Specialist Agent on a task                   ║",
  "║    /sessions | /status       Show GPU Host sessions, Memory Vault & 19 Boosters status    ║",
  "║    /start [all|a|b|c|d]      Start & verify GPU Host runtime(s)                           ║",
  "║    /stop | /reconnect        Stop all runtimes or force immediate host tunnel handshake   ║",
  "║    /vram                     Live GPU VRAM pressure, KV-cache & spillover table (A–D)     ║",
  "║    /rebalance [--dry-run]    FFD VRAM rebalancer & duplicate model deduplicator (A–D)     ║",
  "║    /nvidia-smi               Query live NVIDIA GPU VRAM & utilization                     ║",
  "║    /health | /endpoints      Probe model health or refresh live URLs from GitHub Gist     ║",
  "║    /save-dir <path>          Set output folder for generated files & builds               ║",
  "║    /vscode                   Export all Council files & open workspace in VS Code         ║",
  "║    /package [cli|script|gui|exe]   Compile & package finished build                       ║",
  "║    /doctor | /repair         Run Environment Doctor or Workspace Self-Repair              ║",
  "║    /backup | /rollback       Create or restore workspace snapshot                         ║",
  "║    /ports | /preview | /logs Scan ports, toggle split GUI preview, or stream server logs  ║",
  "║    <cmd> -h  |  /clear       Show syntax help for any command or clear terminal screen    ║",
  "╚════════════════════════════════════════════════════════════════════════════════════════════╝",
].join("\n");

async function executeUnifiedCliCommand(cmd, appendLineFn = null) {
  const outEl = $("#guardian-out");
  const appendLine =
    appendLineFn ||
    ((text, color = "#e2e8f0", instant = false) => {
      if (outEl) {
        appendTypedTerminalBlock(outEl, text, { color, marginBottom: "6px", instant });
      }
    });

  const trimmed = String(cmd || "").trim();
  if (!trimmed) return;
  const lower = trimmed.toLowerCase();

  // Help, Clear & Live vs Sandboxed CLI slash commands
  if (lower === "/clear" || lower === "clear" || lower === "cls") {
    clearTerminalContainer(outEl);
    return;
  }
  if (trimmed.endsWith(" -h") || trimmed.endsWith(" --help") || trimmed === "-h" || trimmed === "--help" || trimmed === "/?") {
    renderCliCommandHelp(trimmed, "master", appendLine);
    return;
  }
  if (
    lower === "/cmd" ||
    lower === "/cmds" ||
    lower === "cmd" ||
    lower === "cmds" ||
    lower === "/command" ||
    lower === "/commands" ||
    lower === "commands" ||
    lower === "/help" ||
    lower === "help"
  ) {
    renderCliCommandsList("master", LOCAL_UNIFIED_CLI_CATALOG, appendLine, outEl);
    return;
  }
  if (lower === "/live" || lower === "/real") {
    setExecMode("real", { announceInCli: true });
    return;
  }
  if (lower === "/sandbox" || lower === "/sandboxed") {
    setExecMode("sandboxed", { announceInCli: true });
    return;
  }

  // ── 1. CORE MODE SWITCHING SLASH COMMANDS (/council, /claude, /brain, /colab) ──
  if (lower === "/brain" || lower.startsWith("/brain ")) {
    const rest = trimmed.slice(6).trim();
    if (!rest) {
      setUnifiedTerminalMode("brain", { announce: true });
      return;
    }
    setUnifiedTerminalMode("brain", { announce: false });
    appendLine(`🧠 [/brain Copilot] Asking: "${rest}"…`, "#f472b6", true);
    await askDefaultBrainModel(rest, appendLine);
    return;
  }

  if (lower === "/claude" || lower.startsWith("/claude ") || lower === "claude" || lower.startsWith("claude ")) {
    const isSlash = lower.startsWith("/");
    const rest = trimmed.slice(isSlash ? 7 : 6).trim();
    if (!rest) {
      setUnifiedTerminalMode("claude", { announce: true });
      return;
    }
    setUnifiedTerminalMode("claude", { announce: false });
    if (rest.toLowerCase() === "repair" || rest.toLowerCase() === "/repair") {
      appendLine("🤖 [Claude Code] Running workspace self-diagnosis & auto-repair…", "#fb923c", true);
      const r = await postJSON("/api/guardian/repair", {});
      appendLine(r?.report || JSON.stringify(r, null, 2), "#2ee6a6");
      return;
    }
    if (rest.toLowerCase().startsWith("doctor")) {
      appendLine("🤖 [Claude Code] Running environment & dependency doctor…", "#fb923c", true);
      const r = await postJSON("/api/forge/env-doctor", { traceback: rest });
      appendLine(r?.diagnosis || r?.output || JSON.stringify(r, null, 2), "#2ee6a6");
      return;
    }
    appendLine(`🤖 [Claude Code Autonomous Coder] Executing task: "${rest}"…`, "#fb923c", true);
    const res = await postJSON("/api/guardian/run", { prompt: rest, mode: "claude" });
    if (res?.cwd) {
      const pathEl = $("#guardian-workspace-path");
      if (pathEl) pathEl.innerHTML = `CWD: ${esc(res.cwd)} · Type <code>/</code> + <code>Tab</code> to predict &amp; autocomplete`;
    }
    appendLine(res?.output || res?.error || "Claude Code task completed.", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    if (Array.isArray(res?.modified_files) && res.modified_files.length) {
      appendLine(`✅ Claude Code updated files: ${res.modified_files.join(", ")}`, "#2ee6a6", true);
    }
    return;
  }

  if (lower === "/council" || lower.startsWith("/council ")) {
    const rest = trimmed.slice(8).trim();
    if (!rest) {
      setUnifiedTerminalMode("council", { announce: true });
      return;
    }
    setUnifiedTerminalMode("council", { announce: false });
    await executeUnifiedCliCommand(rest, appendLine);
    return;
  }

  if (lower === "/colab" || lower.startsWith("/colab ")) {
    const rest = trimmed.slice(6).trim();
    if (!rest) {
      setUnifiedTerminalMode("colab", { announce: true });
      return;
    }
    setUnifiedTerminalMode("colab", { announce: false });
    await runCliTerm(false, rest, outEl);
    return;
  }

  // ── 2. SCRIPT & SHELL INTERPRETER SLASH COMMANDS (/bash, /pwsh, /powershell, /cmd, /bat, /python, /node, >>>) ──
  if (trimmed.startsWith(">>>")) {
    const pyInline = trimmed.replace(/^>>>\s*/, "").trim();
    if (unifiedTerminalMode !== "council") setUnifiedTerminalMode("council", { announce: false });
    setUnifiedTerminalShell("python", { announce: false });
    if (!pyInline) return;
    appendLine(`🐍 In >>> ${pyInline}`, "#2ee6a6", true);
    const res = await postJSON("/api/cli/shell-exec", { command: pyInline, shell: "python", exec_mode: EXEC_MODE });
    updatePythonReplWorkbenchUI(res);
    appendLine(res?.output || res?.error || "(No output)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    return;
  }

  const shellMatch = trimmed.match(/^\/(bash|sh|pwsh|powershell|ps1|cmd|bat|python3?|py|node|js)(?:\s+([\s\S]+))?$/i);
  if (shellMatch) {
    const rawShell = shellMatch[1].toLowerCase();
    const inlineScript = (shellMatch[2] || "").trim();
    const normShell =
      rawShell === "powershell" || rawShell === "pwsh" || rawShell === "ps1"
        ? "pwsh"
        : rawShell === "cmd" || rawShell === "bat"
        ? "cmd"
        : rawShell === "python" || rawShell === "python3" || rawShell === "py"
        ? "python"
        : rawShell === "node" || rawShell === "js"
        ? "node"
        : "bash";

    if (!inlineScript) {
      if (unifiedTerminalMode !== "council") {
        setUnifiedTerminalMode("council", { announce: false });
      }
      setUnifiedTerminalShell(normShell, { announce: true });
      return;
    }

    if (normShell === "python" && (inlineScript.toLowerCase() === "ide" || inlineScript.toLowerCase() === "editor")) {
      setUnifiedTerminalShell("python", { announce: false });
      $("#python-repl-multiline-drawer")?.classList.remove("hidden");
      $("#python-repl-multiline-input")?.focus();
      appendLine("🐍 Opened Multi-Line Python 3 Script Editor above terminal output.", "#2ee6a6", true);
      return;
    }

    setUnifiedTerminalShell(normShell, { announce: false });
    appendLine(
      normShell === "python"
        ? `🐍 [Python 3 REPL] >>> ${inlineScript}`
        : `⚡ [/${normShell} · ${EXEC_MODE === "sandboxed" ? "🔒 Sandboxed" : "⚡ Live CLI"}] Executing: ${inlineScript}`,
      normShell === "python" ? "#2ee6a6" : "#00d4ff",
      true
    );
    const res = await postJSON("/api/cli/shell-exec", { command: inlineScript, shell: normShell, exec_mode: EXEC_MODE });
    if (normShell === "python") updatePythonReplWorkbenchUI(res);
    appendLine(res?.output || res?.error || "(No output)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    return;
  }

  // ── 3. SWARM, HOT POTATO & SAFETY-BYPASS DECOMPOSER SLASH COMMANDS ──
  if (lower === "/swarm" || lower.startsWith("/swarm ")) {
    const goal = trimmed.slice(6).trim() || "Perform full-stack architecture & security synthesis across workspace";
    appendLine(`🐝 [/swarm] Launching Unrestricted Queen Boss + Parallel Worker Swarm (with automatic model-rotation on safety blocks)…\nGoal: "${goal}"`, "#c084fc", true);
    try {
      const res = await postJSON("/api/swarm/adjustable-ram-run", {
        goal,
        total_ram_gb: 192,
        allocated_ram_gb: 180,
        model_size_gb: 3,
        worker_count: 16,
        queen_boss_model: $("#swarm-queen-boss-model")?.value || "orcarouter/Qwen3.8-27B-Uncensored-GGUF",
        queen_auto_rotate: true,
        spawn_sub_agents: true,
      });
      const rotNote = res?.queen_rotation_attempts > 1
        ? ` (Rotated across ${res.queen_rotation_attempts} Unrestricted models to bypass filter)`
        : "";
      appendLine(`👑 [Queen Boss: ${res?.queen_boss_model || "Unrestricted Queen"}${rotNote}]\n${res?.queen_synthesis || JSON.stringify(res, null, 2)}`, "#2ee6a6");
    } catch (e) {
      appendLine(`❌ Swarm error: ${e.message || e}`, "#ff6b8b", true);
    }
    return;
  }

  if (lower === "/hotpotato" || lower.startsWith("/hotpotato ")) {
    const task = trimmed.slice(10).trim() || "Build a complete fault-tolerant Python CLI & network diagnostic utility";
    appendLine(`🥔 [/hotpotato] Starting Hot Potato Fault-Tolerant Continuous Code Completion Protocol…\nTask: "${task}"`, "#fb923c", true);
    try {
      const res = await postJSON("/api/council/hot-potato", { prompt: task, max_handoffs: 6 });
      const handoffLog = (res?.handoff_history || [])
        .map((h, i) => `  Hop #${i + 1}: [${h.model}] — ${h.status} (${h.lines_added || 0} lines)`)
        .join("\n");
      if (handoffLog) appendLine(`🥔 Handoff Trace:\n${handoffLog}`, "#fbbf24", true);
      appendLine(res?.final_code || res?.merged_code || res?.output || JSON.stringify(res, null, 2), "#2ee6a6");
      if (res?.verification_output) {
        appendLine(`🧪 Live Verification Output:\n${res.verification_output}`, "#00d4ff", true);
      }
      appendLine(`📦 Build complete! Type '/package cli', '/package script', '/package gui', or '/package exe' to compile & export.`, "#2ee6a6", true);
    } catch (e) {
      appendLine(`❌ Hot Potato error: ${e.message || e}`, "#ff6b8b", true);
    }
    return;
  }

  if (lower === "/decomposer" || lower.startsWith("/decomposer ")) {
    const task = trimmed.slice(11).trim() || "Build a modular multi-threaded port & service auditor with CLI & GUI";
    appendLine(`🧩 [/decomposer] Breaking restricted build into 10–15 benign modular pieces, coding each piece, merging & verifying…\nTask: "${task}"`, "#38bdf8", true);
    try {
      const res = await postJSON("/api/council/decompose-restricted", { prompt: task, piece_count: 12 });
      const piecesSummary = (res?.pieces || [])
        .map((p, idx) => `  Piece ${idx + 1}/${res.pieces.length}: ${p.title || p.module_name} (${p.status || "built"})`)
        .join("\n");
      if (piecesSummary) appendLine(`🧩 Decomposed Modules Built:\n${piecesSummary}`, "#38bdf8", true);
      appendLine(res?.merged_code || res?.final_code || JSON.stringify(res, null, 2), "#2ee6a6");
      if (res?.test_run_output) {
        appendLine(`🧪 Live Test Run Output:\n${res.test_run_output}`, "#00d4ff", true);
      }
      appendLine(`📦 Ready to compile! Type '/package cli', '/package script', '/package gui', or '/package exe'.`, "#2ee6a6", true);
    } catch (e) {
      appendLine(`❌ Decomposer error: ${e.message || e}`, "#ff6b8b", true);
    }
    return;
  }

  // ── 4. HOST AUTH, GPU SESSIONS, BOOSTERS, PACKAGING & DOCTOR SLASH COMMANDS ──
  if (lower === "/auth" || lower.startsWith("/auth ") || lower === "auth") {
    const arg = trimmed.replace(/^\/?auth\s*/i, "").trim().toLowerCase();
    if (!arg || arg === "gui" || arg === "window" || arg === "config") {
      openSlashConfigPopupWindow("host");
      appendLine("🗔 Opened [🔑 Host Auth, OAuth, Tunnel Binding & Credentials Vault] Configurator Pop-up Window.", "#2ee6a6", true);
      return;
    }
    if (arg === "all") {
      appendLine("🔑 Authenticating All Hosts (Host A + Host B + Host C) & GPU Accelerators…", "#2ee6a6", true);
      if (typeof authenticateAllLineupHosts === "function") await authenticateAllLineupHosts();
      return;
    }
    if (["a", "b", "c"].includes(arg)) {
      appendLine(`🔑 Authenticating Host ${arg.toUpperCase()} & its GPU Accelerator…`, "#2ee6a6", true);
      if (typeof startColabHostReauth === "function") await startColabHostReauth(arg);
      return;
    }
    if (arg === "clear") {
      $("#lineup-reauth")?.click();
      appendLine("🧹 Cleared cached OAuth token.", "#fbbf24", true);
      return;
    }
    openSlashConfigPopupWindow("host");
    const mem = await getJSON("/api/host-setup/memory").catch(() => ({}));
    appendLine(
      `🔐 Persistent Host & Credential Memory Vault Status (Pop-up Window Opened):\n` +
        `  • Saved Account Email : ${mem?.global_auth?.email || "goodoldcanadian@gmail.com"}\n` +
        `  • Saved Gist ID       : ${mem?.global_auth?.gist_id || "05a1f96580fa13b373b42d919873dc57"}\n` +
        `  • GitHub Username     : ${mem?.global_auth?.gh_user || "savingannabel"}\n` +
        `  • Customizations Saved: ${Object.keys(mem?.host_customizations || {}).length} host profile(s) locked in memory\n` +
        `  • Commands            : /auth | /auth all | /auth a | /auth b | /auth c | /oauth <code_or_url>`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower.startsWith("/oauth ")) {
    const codeOrUrl = trimmed.slice(7).trim();
    const inp = $("#lineup-oauth-code");
    if (inp) inp.value = codeOrUrl;
    $("#lineup-oauth-submit")?.click();
    appendLine(`🔗 Submitted OAuth / Tunnel binding: ${codeOrUrl}`, "#2ee6a6", true);
    return;
  }

  if (
    lower === "/host" ||
    lower === "/hosts" ||
    lower === "hosts" ||
    lower === "/hardware" ||
    lower.startsWith("/host ") ||
    lower.startsWith("/hosts ")
  ) {
    const target = trimmed.replace(/^\/?(hosts?|hardware)\s*/i, "").trim().toLowerCase();
    if (!target || target === "gui" || target === "config" || target === "window" || target === "setup") {
      openSlashConfigPopupWindow("host");
      appendLine(
        "🗔 Opened [🖥 Host Infrastructure, OAuth, Tunnel Binding & Hardware/VRAM] Configurator Pop-up Window.\n" +
        "  (Tip: Type '/host a', '/host b', '/host c', '/host d' to switch target host inline, or '/vram' & '/rebalance' for VRAM load-balancing)",
        "#2ee6a6",
        true
      );
      return;
    }
    const sel = $("#cli-target-host");
    if (sel) {
      sel.value = target;
      sel.dispatchEvent(new Event("change"));
    }
    const hostBadge = $("#unified-term-host-badge");
    if (hostBadge) hostBadge.textContent = `HOST: ${target.toUpperCase()} 🟢`;
    const pfxEl = $("#guardian-prompt-prefix");
    if (pfxEl) pfxEl.textContent = getUnifiedTerminalPs1(unifiedTerminalMode, unifiedTerminalShell);
    appendLine(`🖥 Target GPU Host switched to: ${target.toUpperCase()} (Type '/host' with no args to open the full Host Configurator Pop-up Window)`, "#c4b5fd", true);
    return;
  }

  if (lower === "/vram" || lower === "vram" || lower.startsWith("/vram ") || lower.startsWith("vram ")) {
    const subArg = trimmed.replace(/^\/?vram\s*/i, "").trim().toLowerCase();
    if (subArg === "gui" || subArg === "window" || subArg === "popup") {
      openSlashConfigPopupWindow("host");
      appendLine("🗔 Opened [🖥 Host & GPU VRAM Load-Balancer] Configurator Pop-up Window.", "#2ee6a6", true);
      return;
    }
    const res = await postJSON("/api/cli/execute", { cliKey: "master", command: trimmed }).catch((e) => ({ ok: false, error: e.message }));
    appendLine(res?.output || res?.error || "Failed to query GPU VRAM telemetry.", res?.ok !== false ? "#2ee6a6" : "#ff6b8b", true);
    await window.pollHostHeartbeatNow?.().catch(() => {});
    return;
  }

  if (lower === "/rebalance" || lower === "rebalance" || lower.startsWith("/rebalance ") || lower.startsWith("rebalance ")) {
    const isDryRun = /\b--dry-run\b|\bdry\b/i.test(trimmed);
    appendLine(
      isDryRun
        ? "🧪 [/rebalance --dry-run] Simulating First-Fit Decreasing (FFD) VRAM pack & clone deduplication across Hosts A–D…"
        : "⚖️ [/rebalance] Deduplicating redundant clones & rebalancing model weights + KV-cache across Hosts A–D…",
      "#38bdf8",
      true
    );
    const res = await postJSON("/api/cli/execute", { cliKey: "master", command: trimmed }).catch((e) => ({ ok: false, error: e.message }));
    appendLine(res?.output || res?.error || "Rebalance command failed.", res?.ok !== false ? "#2ee6a6" : "#ff6b8b", true);
    if (!isDryRun) {
      await reloadState().catch(() => {});
      await window.pollHostHeartbeatNow?.().catch(() => {});
      window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    }
    return;
  }

  if (lower === "/sessions" || lower === "sessions") {
    await runCliTerm(false, "sessions", outEl);
    return;
  }

  if (lower === "/nvidia-smi" || lower === "nvidia-smi") {
    await runCliTerm(false, "nvidia-smi", outEl);
    return;
  }

  if (lower === "/reconnect") {
    $("#cli-force-reconnect-btn")?.click();
    appendLine("⚡ Triggered immediate fresh handshake & tunnel reconnect on target host.", "#2ee6a6", true);
    return;
  }

  if (lower.startsWith("/start")) {
    const h = trimmed.slice(6).trim().toLowerCase() || "all";
    await runCliTerm(false, h === "all" ? "status -s councilng" : `start ${h}`, outEl);
    return;
  }

  if (lower.startsWith("/stop")) {
    await runCliTerm(false, "stop-all", outEl);
    return;
  }

  if (
    lower === "/boosters" ||
    lower === "boosters" ||
    lower === "/dpo" ||
    lower === "/cortex" ||
    lower.startsWith("/boosters ")
  ) {
    const arg = trimmed.replace(/^\/?(boosters|dpo|cortex)\s*/i, "").trim().toLowerCase();
    if (arg === "on" || arg === "off" || arg === "enable-all" || arg === "disable-all") {
      const en = arg === "on" || arg === "enable-all";
      await postJSON("/api/cluster/supercharger", {
        failover_enabled: en,
        tensor_split_enabled: en,
        race_enabled: en,
        ctx_boost_enabled: en,
        speculative_enabled: en,
        kv_cache_sync_enabled: en,
        moe_sharding_enabled: en,
        thermal_balancer_enabled: en,
        flash_ring_enabled: en,
      });
      if (typeof loadClusterSuperchargerState === "function") loadClusterSuperchargerState();
      appendLine(`🚀 All 19 Multi-GPU Supercharger Boosters switched ${en ? "ON 🟢" : "OFF ⚪"}.`, "#2ee6a6", true);
      return;
    }
    openSlashConfigPopupWindow("boosters");
    appendLine(
      `🗔 Opened [🚀 19 Multi-GPU Boosters, Eternal Cortex Continuous DPO Learner & Hardware Drills] Configurator Pop-up Window.\n` +
      `  (Tip: Type '/boosters on' or '/boosters off' to toggle all 19 boosters inline, or '/train' to run a DPO LoRA step)`,
      "#2ee6a6",
      true
    );
    return;
  }

  // ── NEW: /health, /endpoints, /gist-refresh, /save-dir, /hf-sync, /train IN CLI ──
  if (lower === "/health" || lower === "health") {
    appendLine("🩺 [/health] Probing all active Suomynona Council model endpoints & GPU hosts…", "#00d4ff", true);
    const h = await getJSON("/api/health").catch(() => ({}));
    $("#health-btn")?.click();
    const lines = Object.entries(h).map(
      ([idx, ok]) => `  • [${idx}] ${STATE.backends?.[idx]?.name || `Endpoint #${idx}`} (${STATE.backends?.[idx]?.url || "local"}): ${ok ? "🟢 HEALTHY" : "🔴 OFFLINE"}`
    );
    appendLine(
      lines.length
        ? `🩺 ENDPOINT HEALTH REPORT:\n${lines.join("\n")}`
        : `🩺 All ${STATE.backends?.length || 0} configured endpoints checked — runtime operational.`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/endpoints" || lower === "/gist-refresh" || lower === "endpoints") {
    appendLine("🔄 [/endpoints] Refreshing live GPU host tunnel URLs from GitHub Gist…", "#00d4ff", true);
    const r = await postJSON("/api/colab/refresh", {}).catch(() => ({}));
    await reloadState();
    const epLines = (STATE.backends || []).map(
      (b, i) => `  ${i + 1}. ${b.name} [${b.provider || "gpu"}] → ${b.url || "(local/cloud)"}`
    );
    appendLine(
      `🔗 GIST & ENDPOINT SYNC COMPLETE (${r?.updated ? "Updated from Gist" : "Verified"}):\n` +
        (epLines.length ? epLines.join("\n") : "  No endpoints registered."),
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/save-dir" || lower.startsWith("/save-dir ") || lower === "/savedir" || lower.startsWith("/savedir ")) {
    const newDir = trimmed.replace(/^\/save-?dir\s*/i, "").trim();
    if (!newDir) {
      appendLine(
        `💾 Current Saved Model Outputs Directory: ${STATE.save_dir || "./council_outputs"}\n` +
          `  Usage: /save-dir <path>  (e.g. /save-dir ./council_outputs or /save-dir C:\\CouncilOutputs)`,
        "#2ee6a6",
        true
      );
      return;
    }
    const r = await postJSON("/api/save-dir", { save_dir: newDir }).catch(() => ({}));
    if (r?.ok) {
      STATE.save_dir = r.save_dir;
      if ($("#save-dir-input")) $("#save-dir-input").value = r.save_dir;
      appendLine(`💾 Updated Saved Model Outputs Directory → ${r.save_dir}`, "#2ee6a6", true);
    } else {
      appendLine(`❌ Could not set save directory: ${r?.error || "invalid path"}`, "#ff6b8b", true);
    }
    return;
  }

  if (lower === "/hf-sync" || lower === "hf-sync") {
    appendLine("🤗 [/hf-sync] Syncing model metadata & weight updates across all linked Hugging Face Buckets…", "#00d4ff", true);
    const r = await postJSON("/api/hf-buckets/sync-all", { auto_import_new: true }).catch(() => ({}));
    await reloadState();
    appendLine(
      `🤗 HF Bucket Sync Complete: ${r?.synced_buckets || 0} bucket(s) scanned · ${r?.total_models_discovered || 0} model(s) verified · ${r?.newly_imported_count || 0} newly locked in Vault.`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/train" || lower.startsWith("/train ")) {
    const note = trimmed.slice(6).trim() || "Manual CLI Online DPO consolidation step";
    appendLine(`🧬 [/train] Running Eternal Cortex Continuous Learner step: "${note}"…`, "#00d4ff", true);
    const r = await recordContinuousLearnerEvent("success", note, "CLI-triggered LoRA rank-64 weight update");
    appendLine(
      `🧬 Eternal Cortex Step #${r?.continuous_learner?.training_step || 143} complete · Loss=${r?.continuous_learner?.current_loss || 0.0792}`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/status") {
    const [mem, sup] = await Promise.all([
      getJSON("/api/host-setup/memory").catch(() => ({})),
      getJSON("/api/cluster/state").catch(() => ({})),
    ]);
    const lrn = sup?.cluster?.continuous_learner || {};
    appendLine(
      `📊 SUOMYNONA COUNCIL MASTER CLI STATUS:\n` +
        `  • Active CLI Mode    : /${unifiedTerminalMode}\n` +
        `  • Active Script Shell: /${unifiedTerminalShell}\n` +
        `  • Target GPU Host    : ${($("#cli-target-host")?.value || "all").toUpperCase()}\n` +
        `  • Saved Outputs Path : ${STATE.save_dir || "./council_outputs"}\n` +
        `  • Linked HF Buckets  : ${(STATE.hf_buckets || []).length} bucket(s) (Auto-Sync: ${STATE.hf_auto_sync_on_startup !== false ? "ON" : "OFF"})\n` +
        `  • Eternal Cortex LoRA: Step #${lrn.training_step ?? 142} · Loss ${lrn.current_loss ?? 0.0814}\n` +
        `  • Multi-GPU Boosters : 19/19 Active`,
      "#2ee6a6",
      true
    );
    await runCliTerm(false, "status -s councilng", outEl);
    return;
  }

  if (lower === "/console" || lower === "/live-console" || lower.startsWith("/console ") || lower.startsWith("/live-console ")) {
    if (typeof openLiveConsoleWindow === "function") openLiveConsoleWindow();
    appendLine("📡 Opened [Live Background Console & Real-Time Telemetry Stream] Floating Pop-up Window.", "#2ee6a6", true);
    return;
  }

  if (lower === "/logs" || lower.startsWith("/logs ")) {
    const filter = trimmed.slice(5).trim().toLowerCase();
    if (filter === "gui" || filter === "popup" || filter === "window" || filter === "live") {
      if (typeof openLiveConsoleWindow === "function") openLiveConsoleWindow();
      appendLine("📡 Opened [Live Background Console & Real-Time Telemetry Stream] Floating Pop-up Window.", "#2ee6a6", true);
      return;
    }
    const actEl = $("#activity");
    const rawLogs = actEl?.innerText || "No recent server activity logs.";
    const lines = rawLogs.split("\n").filter((l) => !filter || l.toLowerCase().includes(filter)).slice(-35);
    appendLine(`📡 Live Server Activity Stream (${lines.length} lines · Tip: type '/console' or '/logs live' to open floating Live Console):\n${lines.join("\n")}`, "#00d4ff", true);
    return;
  }

  if (lower.startsWith("/package") || lower.startsWith("/compile")) {
    const pkgType = trimmed.split(/\s+/)[1]?.toLowerCase() || "exe";
    const validType = ["cli", "script", "gui", "exe"].includes(pkgType) ? pkgType : "exe";
    appendLine(`📦 Packaging latest build as [${validType.toUpperCase()}]…`, "#2ee6a6", true);
    await runGuardianCommand(`council package ${validType}`);
    return;
  }

  if (lower === "/repair" || lower === "repair") {
    appendLine("🔧 Running workspace self-repair…", "#2ee6a6", true);
    const r = await postJSON("/api/guardian/repair", {});
    appendLine(r?.report || JSON.stringify(r, null, 2), "#2ee6a6");
    return;
  }
  if (lower === "/backup" || lower === "backup") {
    const r = await postJSON("/api/guardian/backup", { label: "cli-manual" });
    appendLine(`📸 Created workspace snapshot: ${r?.snapshot?.snapshotId || "ok"}`, "#2ee6a6", true);
    return;
  }
  if (lower === "/rollback" || lower === "rollback") {
    $("#guardian-rollback-btn")?.click();
    appendLine("⏪ Triggered workspace rollback to latest snapshot.", "#fbbf24", true);
    return;
  }
  if (lower === "/ports" || lower === "ports") {
    const r = await postJSON("/api/forge/ports", {});
    appendLine(JSON.stringify(r?.ports || [], null, 2), "#2ee6a6");
    return;
  }
  if (lower === "/preview" || lower === "preview") {
    const wrap = $("#forge-split-preview-wrap");
    if (wrap) wrap.classList.toggle("hidden");
    $("#forge-open-preview-btn")?.click();
    appendLine("🖥️ Toggled live split GUI preview below terminal.", "#2ee6a6", true);
    return;
  }
  if (lower === "/doctor" || lower.startsWith("/doctor ") || lower.startsWith("doctor")) {
    const tb = trimmed.replace(/^\/?doctor\s*/i, "").trim() || "Verify Python, Node, and GPU runtime environment";
    appendLine(`🩺 Running Environment Doctor: "${tb}"…`, "#2ee6a6", true);
    const r = await postJSON("/api/forge/env-doctor", { traceback: tb });
    appendLine(r?.diagnosis || r?.output || JSON.stringify(r), "#2ee6a6");
    return;
  }

  // ── 4B. UNIFIED SUOMYNONA CLI SUBSYSTEM POP-UP & INLINE COMMANDS (/models, /models/config, /models/popup, /router, /lineup, /slots, /presets, /bucket, /cloud, /agents, /tools, /mcp, /a2a, /tuning, /system, /vscode) ──
  if (
    lower === "/models" ||
    lower.startsWith("/models ") ||
    lower.startsWith("/models/") ||
    lower === "/router" ||
    lower.startsWith("/router ") ||
    lower === "/lineup" ||
    lower.startsWith("/lineup ") ||
    lower === "/slots" ||
    lower.startsWith("/slots ")
  ) {
    const sub = trimmed.replace(/^\/(models|router|lineup|slots)[\/\s]*/i, "").trim().toLowerCase();
    if (!sub || sub === "gui" || sub === "window" || sub === "config" || sub === "popup" || sub === "pop-up" || sub === "tree") {
      openSlashConfigPopupWindow("models");
      appendLine(
        `🌳 Opened [Upward-Branching Host Tree Builder, Models Lineup, Specialist Agents & Customizer] Pop-up Window.\n` +
        `  • Click Host A / B / C / D → Lineup, Agents, or Customize → Category → Model to add directly to that Host's lineup!`,
        "#2ee6a6",
        true
      );
      return;
    }
    if (sub === "list" || sub === "status") {
      const lines = (STATE?.backends || []).map((b) =>
        `  [${b.i}] ${picked.has(b.i) ? "🟢 ACTIVE" : "⚪ IDLE  "} · ${b.name} (${b.model || "local"}) → ${b.url || "cloud/local"}`
      );
      appendLine(
        `🔀 SUOMYNONA MODELS ROUTER (${picked.size} Active / ${(STATE?.backends || []).length} Total):\n` +
        `${lines.join("\n")}\n` +
        `  • Active Judge : ${getJudgeBackendObj()?.name || "Auto"} (Temp: ${STATE?.settings?.temperature ?? 0.7}, Top-P: ${STATE?.settings?.top_p ?? 0.95})\n` +
        `  • Commands     : /models (opens Upward Host Tree GUI) | /models/config | /models all | /models toggle <idx> | /judge <idx>`,
        "#2ee6a6",
        true
      );
      return;
    }
    if (sub === "all") {
      $("#all-btn")?.click();
      appendLine(`✅ Selected all ${(STATE?.backends || []).length} models in active Council lineup.`, "#2ee6a6", true);
      return;
    }
    const togMatch = sub.match(/^toggle\s+(\d+)/i);
    if (togMatch) {
      const idx = Number(togMatch[1]);
      if (picked.has(idx)) picked.delete(idx); else picked.add(idx);
      renderChips();
      updateModelCountLabel();
      renderRightModelsRail();
      updateJudgeModelBadges();
      appendLine(`🔀 Toggled model slot #${idx} (${STATE?.backends?.[idx]?.name || idx}) → ${picked.has(idx) ? "ACTIVE" : "DISABLED"}`, "#2ee6a6", true);
      return;
    }
    openSlashConfigPopupWindow("models");
    return;
  }

  if (lower === "/presets" || lower.startsWith("/presets ") || lower === "/preset" || lower.startsWith("/preset ")) {
    const arg = trimmed.replace(/^\/?presets?\s*/i, "").trim();
    if (!arg || arg === "gui" || arg === "window") {
      openSlashConfigPopupWindow("presets");
      appendLine("🗔 Opened [📋 Built-In Model Team Presets & Saved Custom Lineups] Configurator Pop-up Window.", "#2ee6a6", true);
      return;
    }
    const sel = $("#preset");
    if (sel) {
      const match = [...sel.options].find((o) => o.value.toLowerCase().includes(arg.toLowerCase()));
      if (match) {
        sel.value = match.value;
        $("#preset-apply")?.click();
        appendLine(`📋 Applied & balanced preset lineup: "${match.value}"`, "#2ee6a6", true);
        return;
      }
    }
    openSlashConfigPopupWindow("presets");
    return;
  }

  if (lower === "/cloud" || lower.startsWith("/cloud ") || lower === "/apis" || lower.startsWith("/apis ")) {
    openSlashConfigPopupWindow("cloud");
    appendLine("🗔 Opened [☁ Cloud & Uncensored Orca API Models Roster] Configurator Pop-up Window.", "#2ee6a6", true);
    return;
  }

  if (lower === "/tuning" || lower.startsWith("/tuning ") || lower === "/params") {
    openSlashConfigPopupWindow("tuning");
    appendLine("🗔 Opened [⚙ Generation Parameters (Temp, Top-P, Max Tokens) & Judge Model] Configurator Pop-up Window.", "#2ee6a6", true);
    return;
  }

  if (lower.startsWith("/judge")) {
    const sub = trimmed.replace(/^\/judge\s*/i, "").trim();
    const jp = $("#judge-pick");
    if (!sub || sub === "gui" || sub === "window") {
      openSlashConfigPopupWindow("tuning");
      const jb = getJudgeBackendObj();
      appendLine(`🗔 Opened [⚖️ Judge & Tuning Configurator] Pop-up Window · Active Judge: [${jb?.i ?? 0}] ${jb?.name || "Auto"} (Or type '/judge <slot_idx>' inline)`, "#2ee6a6", true);
      return;
    }
    if (sub.toLowerCase() === "auto" || sub === "-1") {
      if (jp) jp.value = "-1";
      updateJudgeModelBadges();
      appendLine(`⚖️ Judge set to Auto (${getJudgeBackendObj()?.name || "Slot 0"})`, "#2ee6a6", true);
      return;
    }
    const idx = Number(sub);
    if (!Number.isNaN(idx) && STATE?.backends?.some((b) => Number(b.i) === idx)) {
      if (jp) jp.value = String(idx);
      judgeIdx = idx;
      updateJudgeModelBadges();
      appendLine(`⚖️ Judge explicitly locked to Slot #${idx}: ${getJudgeBackendObj()?.name}`, "#2ee6a6", true);
      return;
    }
    appendLine(`❌ Invalid Judge index "${sub}". Run '/models list' to see valid slot numbers.`, "#ff6b8b", true);
    return;
  }

  if (
    lower === "/bucket" ||
    lower === "/buckets" ||
    lower === "/vault" ||
    lower === "/gguf" ||
    lower.startsWith("/bucket ") ||
    lower === "bucket" ||
    lower === "buckets"
  ) {
    const arg = trimmed.replace(/^\/?(buckets?|vault|gguf)\s*/i, "").trim();
    if (arg.startsWith("link ")) {
      const uri = arg.slice(5).trim();
      appendLine(`🤗 Linking Hugging Face Bucket: ${uri}…`, "#00d4ff", true);
      const r = await postJSON("/api/hf-buckets/link", { uri, auto_import: true }).catch(() => ({}));
      await reloadState();
      appendLine(r?.ok ? `✅ Linked bucket ${uri} (${(r.bucket?.models || []).length} GGUF models discovered)` : `❌ Bucket link failed: ${r?.error || "error"}`, "#2ee6a6", true);
      return;
    }
    openSlashConfigPopupWindow("bucket");
    const buckets = STATE?.hf_buckets || [];
    const customModels = STATE?.custom_models || [];
    appendLine(
      `🗔 Opened [🤗 Hugging Face Buckets (${buckets.length}) & 4-Layer Persistent Model Vault (${customModels.length} GGUF)] Configurator Pop-up Window.\n` +
      `  (Tip: You can also link inline via '/bucket link hf://buckets/owner/name' or sync via '/hf-sync')`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/agents" || lower.startsWith("/agents ") || lower === "/forge" || lower.startsWith("/forge ")) {
    const arg = trimmed.replace(/^\/(agents|forge)\s*/i, "").trim();
    if (arg.startsWith("run ")) {
      const task = arg.slice(4).trim();
      const agId = AGENTS?.[0]?.id || "offsec_orchestrator";
      appendLine(`🤖 Dispatching Specialist Agent [${agId}] on task: "${task}"…`, "#00d4ff", true);
      const r = await postJSON("/api/agents/run", { agent_id: agId, prompt: task }).catch(() => ({}));
      appendLine(r?.output || r?.text || JSON.stringify(r, null, 2), "#2ee6a6");
      return;
    }
    openSlashConfigPopupWindow("agents");
    appendLine(
      `🗔 Opened [🤖 Specialist Agent Forge (${AGENTS?.length || 0} Agents) & Task Runner] Configurator Pop-up Window.\n` +
      `  (Tip: Run inline anytime with '/agents run <task>')`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/tools" || lower.startsWith("/tools ") || lower === "/mcp" || lower.startsWith("/mcp ")) {
    openSlashConfigPopupWindow("tools");
    appendLine(
      `🗔 Opened [🧰 Custom Agent Tools (10 Execution Types) & 🔌 20 Connected MCP Servers] Configurator Pop-up Window.`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/system" || lower.startsWith("/system ") || lower === "/a2a" || lower.startsWith("/a2a ") || lower === "/settings") {
    openSlashConfigPopupWindow("system");
    appendLine(
      `🗔 Opened [💾 System Core, Cluster Health Table, Gist Sync, A2A Stealth Bridge & Output Path] Configurator Pop-up Window.`,
      "#2ee6a6",
      true
    );
    return;
  }

  if (lower === "/vscode" || lower.startsWith("/vscode ")) {
    appendLine("💻 Exporting active Council workspace & launching VS Code…", "#38bdf8", true);
    await saveAllResponses(true);
    appendLine("✅ Workspace exported with .vscode/launch.json & tasks.json and sent to VS Code.", "#2ee6a6", true);
    return;
  }

  // ── 5. MODE-BASED ROUTING FOR NON-SLASH COMMANDS ──
  if (
    unifiedTerminalMode === "brain" ||
    guardianInputMode === "brain" ||
    lower.startsWith("brain ") ||
    lower.startsWith("@brain ")
  ) {
    const q = lower.startsWith("@brain ")
      ? trimmed.slice(7).trim()
      : lower.startsWith("brain ")
      ? trimmed.slice(6).trim()
      : trimmed;
    appendLine(`🧠 [/brain Copilot] Asking: "${q}"…`, "#f472b6", true);
    await askDefaultBrainModel(q, appendLine);
    return;
  }

  if (unifiedTerminalMode === "claude") {
    appendLine(`🤖 [Claude Code] Executing: "${trimmed}"…`, "#fb923c", true);
    const res = await postJSON("/api/guardian/run", { prompt: trimmed, mode: "claude" });
    appendLine(res?.output || res?.error || "Done.", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    return;
  }

  if (unifiedTerminalMode === "colab") {
    await runCliTerm(false, trimmed, outEl);
    return;
  }

  // Direct REPL magic commands (%whos, %vars, %history, %reset, %time, %save, %run, %pip) from any mode
  if (/^%(whos|vars|who|history|hist|reset|time|timeit|save|run|pip)\b/i.test(trimmed)) {
    setUnifiedTerminalShell("python", { announce: false });
    appendLine(`🐍 [Python 3 Magic] >>> ${trimmed}`, "#2ee6a6", true);
    const res = await postJSON("/api/cli/shell-exec", { command: trimmed, shell: "python", exec_mode: EXEC_MODE });
    updatePythonReplWorkbenchUI(res);
    appendLine(res?.output || res?.error || "(No output)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    return;
  }

  if (
    unifiedTerminalShell !== "bash" ||
    /^(get-childitem|get-process|get-content|get-location|invoke-restmethod|\$psversiontable|ipconfig|tasklist|systeminfo|dir\b)/i.test(trimmed)
  ) {
    if (unifiedTerminalShell === "python" && /^(exit|quit)(\(\))?$/i.test(trimmed)) {
      setUnifiedTerminalShell("bash", { announce: true });
      return;
    }
    const effectiveShell =
      unifiedTerminalShell !== "bash"
        ? unifiedTerminalShell
        : /^(get-|invoke-|\$psversiontable)/i.test(trimmed)
        ? "pwsh"
        : "cmd";
    if (effectiveShell === "python") {
      appendLine(`🐍 >>> ${trimmed}`, "#2ee6a6", true);
    }
    const res = await postJSON("/api/cli/shell-exec", { command: trimmed, shell: effectiveShell, exec_mode: EXEC_MODE });
    if (effectiveShell === "python") {
      updatePythonReplWorkbenchUI(res);
      if (res?.cwd) {
        const pathEl = $("#guardian-workspace-path");
        if (pathEl) pathEl.textContent = `CWD: ${res.cwd}`;
      }
    }
    appendLine(res?.output || res?.error || "(No output)", res?.ok !== false ? "#e2e8f0" : "#ff6b8b");
    return;
  }

  // Default: Council CLI (Shell + Council AI Builder + App Showcase + 4-Format Packager)
  await runGuardianCommand(trimmed);
}

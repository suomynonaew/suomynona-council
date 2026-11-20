// Clean empty banners — giant ASCII boxes removed as requested by user
const COUNCIL_NG_GRAPHICAL_ASCII_BANNER = "";
const SUOMYNONA_CLI_GRAPHICS = {};

// Redundant inner header tags removed to prevent double-title clutter inside CLI screens
function renderSuomynonaCliHeaderTag(_logEl, _titleText, _subText = "", _cliKey = "") {
  // Intentionally omitted as per user request to remove duplicate titles inside CLI logs
}

// ── RICH COMMAND HELP & SYNTAX ASSISTANCE REGISTRY (-h / --help) ──
const CLI_COMMAND_HELP_REGISTRY = {
  // Specialist Agent Forge & Tasks
  "create": {
    syntax: "create [agent_name] [--role <role>] [--model <model_id>] [--tools <tool1,tool2>]",
    desc: "Create a new custom Specialist Agent step-by-step or with direct inline flags.",
    params: [
      { name: "agent_name", desc: "Name of the agent (e.g., 'Offsec Auditor', 'OSINT Hunter')" },
      { name: "--role <role>", desc: "Specialization (offsec, redhat, pentest, osint, code, general)" },
      { name: "--model <model_id>", desc: "Assigned model ID (orca27, q38u, auto, etc.)" },
      { name: "--tools <list>", desc: "Comma-separated list of tool names to grant this agent" },
    ],
    examples: [
      "create",
      'create "Red Team Auditor" --role offsec',
      'create "Polyglot Coder" --model orca27 --tools list_dir,read_file,write_file,run_command',
    ],
  },
  "edit": {
    syntax: "edit <agent_name_or_id> [--model <model>] [--temp <0.0-1.0>] [--sys <prompt>]",
    desc: "Modify an existing Specialist Agent directly inside the interactive CLI prompt.",
    params: [
      { name: "<agent_name_or_id>", desc: "Full name, partial name, or numeric ID of the agent" },
      { name: "--model <id>", desc: "Switch assigned model (orca27, q38u, auto, etc.)" },
      { name: "--temp <num>", desc: "Sampling temperature between 0.0 (precise) and 1.0 (creative)" },
      { name: "--sys <text>", desc: "Update agent system instruction prompt" },
    ],
    examples: [
      'edit "Red Team Orchestrator"',
      "edit 1 --model orca27",
      'edit pentest --temp 0.3',
    ],
  },
  "template": {
    syntax: "template [list | load <name>]",
    desc: "Browse or load pre-built starter templates for specialist engineering agents.",
    params: [
      { name: "list", desc: "Display all available agent starter templates" },
      { name: "load <name>", desc: "Instantiate a starter template into your agent roster" },
    ],
    examples: ["template", 'template load "Polyglot Code Builder"'],
  },
  "use": {
    syntax: "use <agent_name_or_id>",
    desc: "Set the active Specialist Agent for task execution in the Dispatch CLI.",
    params: [
      { name: "<agent_name_or_id>", desc: "Name or ID of agent to activate" },
    ],
    examples: ['use "Red Team Orchestrator"', "use 2"],
  },
  "run": {
    syntax: "run <prompt_or_task> [--agent <name>] [--stream]",
    desc: "Dispatch a mission or engineering instruction to the active specialist agent.",
    params: [
      { name: "<prompt_or_task>", desc: "Instruction or engineering prompt to execute" },
      { name: "--agent <name>", desc: "Temporarily override which agent executes this task" },
      { name: "--stream", desc: "Stream tool calling trajectory in real-time" },
    ],
    examples: [
      'run "Inspect open ports and summarize vulnerabilities"',
      'run "Refactor server.ts to improve throughput" --agent "Lead Polyglot Code Builder"',
    ],
  },
  // Hugging Face & Vault
  "/bucket": {
    syntax: "/bucket or /buckets",
    desc: "Inspect all linked Hugging Face buckets, discoverable GGUF weights, and models saved in the 4-layer persistent Vault.",
    params: [
      { name: "/bucket", desc: "Open the in-CLI interactive bucket and model vault browser" },
      { name: "link <uri>", desc: "Link an external Hugging Face bucket URI (hf://buckets/owner/bucket)" },
      { name: "add-gguf", desc: "Register and lock custom GGUF weights into Vault" },
    ],
    examples: ["/bucket", "/buckets", "link hf://buckets/suomynona/my-bucket"],
  },
  "bucket": {
    syntax: "bucket or /bucket",
    desc: "Inspect all linked Hugging Face buckets, discoverable GGUF weights, and models saved in the 4-layer persistent Vault.",
    params: [],
    examples: ["/bucket", "bucket"],
  },
  "link": {
    syntax: "link <hf_bucket_uri_or_repo> [--token <hf_token>]",
    desc: "Link an external Hugging Face bucket or repository and scan for real GGUF weights.",
    params: [
      { name: "<uri>", desc: "URI in format 'hf://buckets/<user>/<name>' or repo ID 'owner/repo'" },
      { name: "--token <token>", desc: "Optional Hugging Face user access token for private repos" },
    ],
    examples: [
      "link hf://buckets/suomynona/qwen38-vault",
      "link unsloth/DeepSeek-R1-Distill-Qwen-14B-GGUF",
    ],
  },
  "vault": {
    syntax: "vault [list | add <model_repo> | lock <id>]",
    desc: "Inspect or manage persistent models locked in the 4-layer Vault across reboots.",
    params: [
      { name: "list", desc: "Show all models currently locked in the local Vault" },
      { name: "add <repo>", desc: "Add a model repository directly into the Vault" },
      { name: "lock <id>", desc: "Lock an active model into persistent storage" },
    ],
    examples: ["vault", "vault list", 'vault add "TheBloke/Mistral-7B-Instruct-GGUF"'],
  },
  "add-gguf": {
    syntax: "add-gguf <repo_id> [--slot <chat|fast|reasoning|deep|spec1|spec2>] [--gb <size>]",
    desc: "Register and lock custom GGUF weights into the Council Vault and model slots.",
    params: [
      { name: "<repo_id>", desc: "Hugging Face repo or local path containing .gguf files" },
      { name: "--slot <name>", desc: "Default slot assignment" },
      { name: "--gb <size>", desc: "Estimated VRAM footprint in GB" },
    ],
    examples: [
      'add-gguf "bartowski/Llama-3.2-3B-Instruct-GGUF"',
      'add-gguf "TheBloke/dolphin-2.9-llama3-8b-GGUF" --slot chat --gb 6',
    ],
  },
  "sync": {
    syntax: "sync [--force] [--bucket <id>]",
    desc: "Synchronize all linked Hugging Face buckets and verify model weight availability.",
    params: [
      { name: "--force", desc: "Bypass cache and force immediate network verification" },
      { name: "--bucket <id>", desc: "Target a specific bucket instead of all buckets" },
    ],
    examples: ["sync", "sync --force"],
  },
  // Boosters & Continuous DPO
  "boosters": {
    syntax: "boosters [list | enable-all | disable-all | toggle <id>]",
    desc: "Manage the 19 high-performance multi-GPU booster accelerators.",
    params: [
      { name: "enable-all", desc: "Turn on all 19 accelerators simultaneously" },
      { name: "disable-all", desc: "Disable all accelerators" },
      { name: "toggle <id>", desc: "Toggle specific booster (kvring, speculative, dpo, etc.)" },
    ],
    examples: ["boosters", "boosters enable-all", "boosters toggle kvring"],
  },
  "enable-all": {
    syntax: "enable-all",
    desc: "Enable all 19 multi-GPU boosters simultaneously for maximum speed.",
    params: [],
    examples: ["enable-all"],
  },
  "disable-all": {
    syntax: "disable-all",
    desc: "Disable all 19 multi-GPU boosters.",
    params: [],
    examples: ["disable-all"],
  },
  "train": {
    syntax: "train [epochs] [--lr <learning_rate>] [--r64] [--save]",
    desc: "Trigger online continuous DPO training on the r64 LoRA adapter from user-rated outcomes.",
    params: [
      { name: "[epochs]", desc: "Number of continuous training cycles (default: 3)" },
      { name: "--lr <rate>", desc: "Learning rate (e.g., 2e-4, 5e-5)" },
      { name: "--r64", desc: "Train rank-64 LoRA adapter matrix" },
      { name: "--save", desc: "Persist weights immediately to disk upon completion" },
    ],
    examples: ["train", "train 5 --lr 1e-4", "train 3 --r64 --save"],
  },
  "drill": {
    syntax: "drill [--scenarios <all|exploit|code|reasoning>]",
    desc: "Run adversarial fault immunization drill to harden model outputs against refusal loops.",
    params: [
      { name: "--scenarios <type>", desc: "Subset of drill scenarios to run" },
    ],
    examples: ["drill", "drill --scenarios exploit"],
  },
  // Runtime Hosts & Tunnels
  "hosts": {
    syntax: "hosts [list | status | summary]",
    desc: "Inspect Host A, B, C, Localhost, and Custom GPU runtime telemetry and allocations.",
    params: [
      { name: "list", desc: "Show detailed status table of all runtime hosts" },
      { name: "status", desc: "Check live handshake health and tunnel latency" },
    ],
    examples: ["hosts", "hosts status"],
  },
  "attach": {
    syntax: "attach <host_id> <tunnel_url> [--token <token>]",
    desc: "Attach a Cloudflare/ngrok tunnel or HTTP endpoint to a specific runtime host.",
    params: [
      { name: "<host_id>", desc: "Host identifier ('a', 'b', 'c', 'localhost', 'custom')" },
      { name: "<tunnel_url>", desc: "Full URL (e.g. 'https://xxx.trycloudflare.com' or 'http://127.0.0.1:8080/v1')" },
      { name: "--token <token>", desc: "Optional bearer token or API key" },
    ],
    examples: [
      "attach b https://whispering-ocean.trycloudflare.com",
      "attach c http://127.0.0.1:8080/v1",
      "attach custom http://192.168.1.100:8000/v1 --token sk-local",
    ],
  },
  "handshake": {
    syntax: "handshake [host_id] [--url <custom_url>]",
    desc: "Test live HTTP handshake latency, detected models, and engine status on a host.",
    params: [
      { name: "[host_id]", desc: "Host identifier ('a', 'b', 'c', 'all'; default: 'all')" },
      { name: "--url <custom_url>", desc: "Override target URL to test before saving" },
    ],
    examples: ["handshake b", "handshake all", "handshake c --url https://xxx.trycloudflare.com"],
  },
  "balance": {
    syntax: "balance [--strategy <throughput|vram|equal>]",
    desc: "Auto-balance 6-slot architectures across active GPU hosts for optimal memory and speed.",
    params: [
      { name: "--strategy <mode>", desc: "Balancing algorithm (throughput, vram, equal)" },
    ],
    examples: ["balance", "balance --strategy throughput"],
  },
  "vram": {
    syntax: "/vram [gui]",
    desc: "Inspect real-time GPU VRAM pressure, quantized weight footprints, KV-cache overhead, in-flight requests, and spillover routing across Hosts A–D.",
    params: [
      { name: "(no args)", desc: "Print tabular per-host VRAM & load-balancer report in terminal" },
      { name: "gui", desc: "Open the interactive /host GPU VRAM Configurator window" },
    ],
    examples: ["/vram", "/vram gui"],
  },
  "/vram": {
    syntax: "/vram [gui]",
    desc: "Inspect real-time GPU VRAM pressure, quantized weight footprints, KV-cache overhead, in-flight requests, and spillover routing across Hosts A–D.",
    params: [
      { name: "(no args)", desc: "Print tabular per-host VRAM & load-balancer report in terminal" },
      { name: "gui", desc: "Open the interactive /host GPU VRAM Configurator window" },
    ],
    examples: ["/vram", "/vram gui"],
  },
  "rebalance": {
    syntax: "/rebalance [--dry-run] [--policy <headroom|latency|pin>] [--threshold <50-98>]",
    desc: "Deduplicate redundant model clones and repack all assigned GPU models across Hosts A, B, C, and D via First-Fit Decreasing (FFD) VRAM + KV-cache load-balancing.",
    params: [
      { name: "--dry-run", desc: "Simulate migrations and print before/after VRAM % without mutating lineup" },
      { name: "--policy <mode>", desc: "Update runtime spillover policy (headroom, latency, pin)" },
      { name: "--threshold <pct>", desc: "Set max VRAM pressure threshold % before spillover triggers (50–98)" },
    ],
    examples: ["/rebalance --dry-run", "/rebalance", "/rebalance --policy headroom --threshold 85"],
  },
  "/rebalance": {
    syntax: "/rebalance [--dry-run] [--policy <headroom|latency|pin>] [--threshold <50-98>]",
    desc: "Deduplicate redundant model clones and repack all assigned GPU models across Hosts A, B, C, and D via First-Fit Decreasing (FFD) VRAM + KV-cache load-balancing.",
    params: [
      { name: "--dry-run", desc: "Simulate migrations and print before/after VRAM % without mutating lineup" },
      { name: "--policy <mode>", desc: "Update runtime spillover policy (headroom, latency, pin)" },
      { name: "--threshold <pct>", desc: "Set max VRAM pressure threshold % before spillover triggers (50–98)" },
    ],
    examples: ["/rebalance --dry-run", "/rebalance", "/rebalance --policy headroom --threshold 85"],
  },
  "max-all": {
    syntax: "max-all",
    desc: "Pack all active host GPUs to 100% capacity with high-parameter uncensored models.",
    params: [],
    examples: ["max-all"],
  },
  // Tools & MCP
  "tool": {
    syntax: "tool [create | list | test <name>]",
    desc: "Build and test custom agent tools across 10 execution types (Shell, Python, Node, MCP, SQL, etc.).",
    params: [
      { name: "create", desc: "Launch step-by-step tool builder in the CLI" },
      { name: "list", desc: "List all built-in and user-created tools" },
      { name: "test <name>", desc: "Execute tool in dry-run mode and inspect return payload" },
    ],
    examples: ["tool create", "tool list", 'tool test "PortScanner"'],
  },
  "mcp": {
    syntax: "mcp [attach <name> <command> | list | test <name>]",
    desc: "Connect Model Context Protocol (MCP) servers to provide external tools to agents.",
    params: [
      { name: "attach <name> <cmd>", desc: "Register a new MCP server via shell command" },
      { name: "list", desc: "Show all active MCP server connections" },
      { name: "test <name>", desc: "Probe handshake and list exposed tools of an MCP server" },
    ],
    examples: [
      "mcp list",
      'mcp attach "everything" npx -y @modelcontextprotocol/server-everything',
      'mcp test "everything"',
    ],
  },
  // System & Output Directory
  "save-dir": {
    syntax: "/save-dir <path>",
    desc: "Set the local directory where generated files, tools, and logs are persisted.",
    params: [
      { name: "<path>", desc: "Absolute or relative directory path (e.g. './outputs', 'C:\\Council')" },
    ],
    examples: ["/save-dir ./council_outputs", "/save-dir /home/user/workspace"],
  },
  "colab": {
    syntax: "/colab [run <command> | status | auth | reconnect <host_id>]",
    desc: "Execute commands on remote Colab hosts or inspect Google Colab GPU runtime state.",
    params: [
      { name: "run <cmd>", desc: "Run a command inside the remote Colab shell container" },
      { name: "status", desc: "Check GPU health and active Colab session status" },
      { name: "reconnect <host>", desc: "Re-establish Cloudflare tunnel connection" },
    ],
    examples: ["/colab status", "/colab run nvidia-smi", "/colab reconnect b"],
  },
  "cloud": {
    syntax: "cloud [add <provider> <model_id> | list | test <id> | toggle <id>]",
    desc: "Manage upstream cloud APIs (OpenAI, Anthropic, OpenRouter, Ollama, vLLM).",
    params: [
      { name: "add <prov> <model>", desc: "Register a cloud model" },
      { name: "list", desc: "List all configured cloud models" },
      { name: "test <id>", desc: "Verify cloud credentials and test latency" },
    ],
    examples: ["cloud list", 'cloud add openrouter "deepseek/deepseek-r1"'],
  },
  "presets": {
    syntax: "presets [apply <name> | list | save <name> | export]",
    desc: "Load or save curated 6-slot model architectures (Pentest, Coding, Reasoning, etc.).",
    params: [
      { name: "apply <name>", desc: "Instantly load a curated preset lineup" },
      { name: "list", desc: "Show all available presets" },
      { name: "save <name>", desc: "Save current 6-slot lineup as a new preset" },
    ],
    examples: ["presets list", 'presets apply "Uncensored Pentest & Exploit"'],
  },
  "defrag": {
    syntax: "defrag [--aggressive]",
    desc: "Run paged memory defragmentation across host VRAM to reclaim leaked memory blocks.",
    params: [{ name: "--aggressive", desc: "Compact KV cache buffers aggressively" }],
    examples: ["defrag", "defrag --aggressive"],
  },
  "dma": {
    syntax: "dma [on | off | status]",
    desc: "Toggle zero-copy direct memory access (DMA) transfers between host RAM and GPU.",
    params: [{ name: "[mode]", desc: "'on', 'off', or 'status'" }],
    examples: ["dma on", "dma status"],
  },
  "kvring": {
    syntax: "kvring [--size <64k|128k|256k>]",
    desc: "Configure circular KV cache ring buffer for high-throughput continuous inference.",
    params: [{ name: "--size <val>", desc: "Context ring buffer window" }],
    examples: ["kvring", "kvring --size 128k"],
  },
};

// Helper: render command help (-h / --help)
function renderCliCommandHelp(rawVal, cliKey = "", streamFn) {
  const clean = String(rawVal || "").replace(/\s+(-h|--help|\/\?)$/i, "").trim();
  const lower = clean.toLowerCase();
  const normalizedKey = lower.startsWith("/") ? lower.slice(1) : lower;
  const primaryWord = normalizedKey.split(/\s+/)[0] || "";

  const helpInfo =
    CLI_COMMAND_HELP_REGISTRY[clean] ||
    CLI_COMMAND_HELP_REGISTRY[lower] ||
    CLI_COMMAND_HELP_REGISTRY[normalizedKey] ||
    CLI_COMMAND_HELP_REGISTRY[primaryWord];

  if (helpInfo) {
    const lines = [
      `┌── 📖 COMMAND HELP: ${clean.toUpperCase()} ─────────────────────────────────────`,
      `│ Usage       : ${helpInfo.syntax}`,
      `│ Description : ${helpInfo.desc}`,
    ];
    if (helpInfo.params && helpInfo.params.length) {
      lines.push("│ Parameters & Options to put after command:");
      helpInfo.params.forEach((p) => {
        lines.push(`│   • ${p.name.padEnd(20)} : ${p.desc}`);
      });
    }
    if (helpInfo.examples && helpInfo.examples.length) {
      lines.push("│ Examples to type:");
      helpInfo.examples.forEach((ex) => {
        lines.push(`│   $ ${ex}`);
      });
    }
    lines.push("└───────────────────────────────────────────────────────────────────────────");
    streamFn(lines.join("\n"), "#2ee6a6", true);
    return true;
  }

  // Generic fallback if command is not specifically registered
  const lines = [
    `┌── ℹ️ HELP: ${clean.toUpperCase()} ─────────────────────────────────────`,
    `│ Usage: ${clean} [arguments / options]`,
    `│`,
    `│ To see all valid commands available in this CLI, type '/cmd'.`,
    `│ Append '-h' after any supported command for syntax and argument assistance.`,
    `└───────────────────────────────────────────────────────────────────────────`,
  ];
  streamFn(lines.join("\n"), "#38bdf8", true);
  return true;
}

// Helper: render complete command list for a CLI (/cmd, /cmds, /command, or /commands)
function renderCliCommandsList(cliKey = "master", catalog = [], streamFn, containerEl = null) {
  const reg = CLI_REGISTRY[cliKey] || { name: "Suomynona CLI", title: "SUOMYNONA COUNCIL CLI" };
  const lines = [
    `┌── ◈ SUOMYNONA COUNCIL — [${(reg.name || cliKey).toUpperCase()}] COMPLETE COMMAND DIRECTORY ──────`,
    `│ Type '<command> -h' after any command for parameter syntax & examples.`,
    `├────────────────────────────────────────────────────────────────────────────────────────`,
  ];

  if (Array.isArray(catalog) && catalog.length && cliKey !== "master") {
    lines.push("│ 📍 SECTION-SPECIFIC COMMANDS:");
    const seen = new Set();
    catalog.forEach((item) => {
      const val = (typeof item === "string" ? item : item.value || "").trim();
      if (!val || seen.has(val)) return;
      seen.add(val);
      const label = item.label && item.label !== val ? ` — ${item.label}` : "";
      lines.push(`│   • ${val.padEnd(28)} ${label}`);
    });
    lines.push(`├────────────────────────────────────────────────────────────────────────────────────────`);
  }

  streamFn(lines.join("\n") + "\n" + MASTER_UNIFIED_CLI_HELP_TEXT, "#2ee6a6", true);

  // Also inject a clickable quick-launch bar of GUI pop-ups right inside the CLI log!
  const targetOut = containerEl || $("#guardian-out");
  if (targetOut) {
    const bar = document.createElement("div");
    bar.className = "cli-commands-quickbar";
    bar.innerHTML = `<span style="font-size:10.5px;font-weight:800;color:#c4b5fd;align-self:center;margin-right:4px">🗔 CLICK TO OPEN GUI CONFIG POP-UP:</span>`;
    const quickItems = [
      { cmd: "/host", label: "🖥 /host (Hosts, Auth & VRAM)" },
      { cmd: "/models", label: "🔀 /models (Lineup, Council & 6-Slot Router)" },
      { cmd: "/boosters", label: "🚀 /boosters (19 Boosters & Eternal DPO)" },
      { cmd: "/bucket", label: "🤗 /bucket (HF Buckets & Model Vault)" },
      { cmd: "/presets", label: "📋 /presets (Saved Lineup Presets)" },
      { cmd: "/cloud", label: "☁ /cloud (Cloud & External APIs)" },
      { cmd: "/agents", label: "🤖 /agents (Specialist Agent Forge & Runner)" },
      { cmd: "/tools", label: "🧰 /tools (Custom Agent Tools & MCP)" },
      { cmd: "/tuning", label: "⚙ /tuning (Prompt, Sampling & Judge)" },
      { cmd: "/system", label: "💾 /system (System Core & A2A Bridge)" },
    ];
    quickItems.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cli-slash-pill cli-config-pill";
      btn.textContent = item.label;
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSlashConfigPopupWindow(item.cmd.replace(/^\//, ""));
      };
      bar.appendChild(btn);
    });
    targetOut.appendChild(bar);
    targetOut.scrollTop = targetOut.scrollHeight;
  }
}

// ── UNIVERSAL CLI COMMAND HISTORY MANAGER ──
// Connects ArrowUp / ArrowDown navigation to every CLI input across all pages and modals
const _suomynonaCliHistoryStore = new Map();

function attachUniversalCliHistory(inputEl, cliKey = "global") {
  if (!inputEl || inputEl._cliHistoryAttached) return inputEl?._pushCliHistory;
  inputEl._cliHistoryAttached = true;

  const storageKey = `suomynona_cli_hist_${cliKey || "global"}`;
  let history = [];
  try {
    const raw = localStorage.getItem(storageKey) || localStorage.getItem("suomynona_cli_hist_global");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) history = parsed;
    }
  } catch (_) { }

  const state = {
    history,
    idx: -1,
    tempDraft: "",
  };
  _suomynonaCliHistoryStore.set(inputEl, state);

  function pushCommand(cmd) {
    const clean = String(cmd || "").trim();
    if (!clean) return;
    if (state.history[0] !== clean) {
      state.history.unshift(clean);
      if (state.history.length > 80) state.history.pop();
      try {
        localStorage.setItem(storageKey, JSON.stringify(state.history.slice(0, 50)));
        localStorage.setItem("suomynona_cli_hist_global", JSON.stringify(state.history.slice(0, 50)));
      } catch (_) { }
    }
    state.idx = -1;
    state.tempDraft = "";
  }

  inputEl._pushCliHistory = pushCommand;

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (!state.history.length) return;
      e.preventDefault();
      if (state.idx === -1) {
        state.tempDraft = inputEl.value;
      }
      state.idx = Math.min(state.idx + 1, state.history.length - 1);
      inputEl.value = state.history[state.idx];
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      setTimeout(() => {
        try {
          inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
        } catch (_) { }
      }, 0);
    } else if (e.key === "ArrowDown") {
      if (state.idx === -1) return;
      e.preventDefault();
      if (state.idx > 0) {
        state.idx--;
        inputEl.value = state.history[state.idx];
      } else {
        state.idx = -1;
        inputEl.value = state.tempDraft || "";
      }
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      setTimeout(() => {
        try {
          inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
        } catch (_) { }
      }, 0);
    }
  });

  return pushCommand;
}

// ── 7 CONSOLIDATED SUOMYNONA COUNCIL CLIs REGISTRY & POP-UP WINDOW MANAGER ──
const CLI_REGISTRY = {
  // 1. UNIFIED SUOMYNONA CLI (Claude Brain, Models Router, PowerShell, CMD, Python, Node, Hosts, Agents, Buckets, System)
  "master": {
    name: "Suomynona CLI",
    title: "SUOMYNONA CLI — CLAUDE BRAIN, MODELS ROUTER & SYSTEM CORE",
    symbol: "❯_",
    subtitle: "/claude · /brain · /models · /pwsh · /cmd · /python · /node · /bash · /bucket · /agents · /hosts",
    selector: "#guardian-fullscreen-term",
    page: "councilng-cli"
  },
  // 2. SPECIALIST AGENT FORGE, RUNNER & TOOLS CLI (Consolidated: Forge + Task Runner + Custom Tools)
  "agents": {
    name: "Agents & Tools Forge",
    title: "SPECIALIST AGENT FORGE, RUNNER & TOOLS CLI",
    symbol: "🤖",
    subtitle: "Forge & run 20 specialist agents, stream trajectories & build 10 types of tools",
    selector: "#agents-section-cli-card",
    page: "agents"
  },
  // 3. HUGGING FACE BUCKETS, MODEL VAULT & PRESETS CLI (Consolidated: HF Buckets + 4-Layer Vault + Saved Lineups, Boosters taken out)
  "hf-vault": {
    name: "HF Buckets & Model Presets",
    title: "HUGGING FACE BUCKETS, MODEL VAULT & PRESETS CLI",
    symbol: "🤗",
    subtitle: "Link HF buckets, lock persistent GGUF weights & apply curated 6-slot lineup presets",
    selector: "#hf-vault-cli-card",
    page: "lineup"
  },
  // 4. 19 BOOSTERS & ETERNAL DPO CLI (Dedicated hardware boosters & continuous LoRA learner)
  "boosters": {
    name: "19 Boosters & Eternal DPO",
    title: "ETERNAL CORTEX & 19 BOOSTERS CLI",
    symbol: "🧬",
    subtitle: "Continuous DPO LoRA learner & 19 multi-GPU hardware performance accelerators",
    selector: "#boosters-cli-card",
    page: "lineup"
  },
  // 5. HOST INFRASTRUCTURE, AUTH & HARDWARE TUNING CLI (Consolidated: GPU Slots + Auth Vault + RAM/VRAM Tuning)
  "hosts": {
    name: "Host Infra, Auth & HW Tuning",
    title: "HOST INFRASTRUCTURE, AUTH VAULT & HARDWARE TUNING CLI",
    symbol: "🖥",
    subtitle: "GPU runtime nodes, API & HF auth credentials, and paged VRAM / zero-copy DMA tuning",
    selector: "#hosts-slot-cli-card",
    page: "lineup"
  },
  // 6. CLOUD & EXTERNAL APIS CLI
  "cloud": {
    name: "Cloud APIs Roster",
    title: "CLOUD & API ENDPOINTS ROSTER CLI",
    symbol: "☁",
    subtitle: "OpenAI, Anthropic, OpenRouter, Ollama & cloud inference endpoints",
    selector: "#cloud-roster-cli-card",
    page: "lineup"
  },
  // 7. SYSTEM CORE, MCP & A2A BRIDGE CLI (Consolidated: System Health + 20 MCP Servers + A2A Bridge)
  "system": {
    name: "System Core & MCP Bridge",
    title: "SYSTEM MASTER, MCP SERVERS & A2A BRIDGE CLI",
    symbol: "💾",
    subtitle: "Health checks, 20 connected MCP servers, JSON-RPC 2.0 handshake & output path",
    selector: "#system-section-cli-card",
    page: "system"
  },

  // Aliases for seamless backward compatibility
  "agent-runner": { aliasOf: "agents" },
  "tools": { aliasOf: "agents" },
  "compute": { aliasOf: "master" },
  "presets": { aliasOf: "hf-vault" },
  "auth": { aliasOf: "hosts" },
  "tuning": { aliasOf: "hosts" },
  "mcp": { aliasOf: "system" },
  "a2a": { aliasOf: "system" },
};


let _currentlyMountedCliKey = null;
let _currentlyMountedCard = null;

function restoreMountedCli() {
  if (!_currentlyMountedCard) return;
  const card = _currentlyMountedCard;
  const ph = card._mountPh;
  if (ph && ph.parentNode) {
    ph.parentNode.insertBefore(card, ph);
    ph.remove();
  }
  card._mountPh = null;
  card.classList.remove("in-popup-window");
  _currentlyMountedCard = null;
  _currentlyMountedCliKey = null;
  const stage = $("#cli-popup-stage");
  if (stage) stage.innerHTML = "";
}

function openCliPopupWindow(rawCliKey = "master") {
  if (typeof window.openUnifiedTerminal === "function") {
    const tab = rawCliKey === "stream" ? "stream" : rawCliKey === "brain" ? "copilot" : "shell";
    window.openUnifiedTerminal(tab);
    return;
  }
  const cliKey = CLI_REGISTRY[rawCliKey]?.aliasOf || rawCliKey;
  const reg = CLI_REGISTRY[cliKey] || CLI_REGISTRY["master"];
  const targetCard = $(reg.selector);
  if (!targetCard) return;

  if (_currentlyMountedCliKey === cliKey && !$("#cli-popup-window-modal")?.classList.contains("hidden")) {
    const inp = targetCard.querySelector(".section-cli-input") || targetCard.querySelector("#guardian-fullscreen-term") || targetCard;
    inp.focus();
    return;
  }

  // Restore any previously mounted card
  restoreMountedCli();

  // Create placeholder in original spot
  const ph = document.createElement("div");
  ph.className = "cli-card-dock-ph hidden";
  ph.id = "cli-ph-" + cliKey;
  targetCard.parentNode.insertBefore(ph, targetCard);
  targetCard._mountPh = ph;
  targetCard.classList.add("in-popup-window");

  // Mount into popup stage
  const stage = $("#cli-popup-stage");
  if (stage) {
    stage.innerHTML = "";
    stage.appendChild(targetCard);
  }

  _currentlyMountedCliKey = cliKey;
  _currentlyMountedCard = targetCard;

  // Update popup window header
  if ($("#cli-popup-icon")) $("#cli-popup-icon").textContent = reg.symbol;
  if ($("#cli-popup-title")) $("#cli-popup-title").textContent = reg.title;
  if ($("#cli-popup-quick-select")) $("#cli-popup-quick-select").value = cliKey;
  if ($("#cli-popup-status-badge")) $("#cli-popup-status-badge").textContent = `● ACTIVE (${reg.name})`;

  // Reveal modal
  $("#cli-popup-window-modal")?.classList.remove("hidden");

  // Highlight active rail button
  $$(".rail-cli-btn").forEach((b) => {
    b.classList.toggle("active-popup", b.dataset.openCli === cliKey);
  });

  // Focus input
  setTimeout(() => {
    const inp = targetCard.querySelector(".section-cli-input") || targetCard.querySelector("#guardian-fullscreen-term") || targetCard;
    inp.focus();
  }, 40);
}

function closeCliPopupWindow() {
  restoreMountedCli();
  const win = $("#cli-popup-window-box");
  if (win) {
    win.style.position = "";
    win.style.left = "";
    win.style.top = "";
    win.style.margin = "";
  }
  $("#cli-popup-window-modal")?.classList.add("hidden");
  $$(".rail-cli-btn").forEach((b) => b.classList.remove("active-popup"));
}

// ============================================================================
// SLASH-COMMAND GUI CONFIGURATOR POP-UP WINDOW MANAGER (#slash-config-popup-modal)
// Docks live DOM configuration panels into a floating GUI pop-up when the user
// enters or clicks /host, /models, /boosters, /bucket, /presets, /cloud,
// /agents, /tools, /tuning, or /system inside any CLI.
// ============================================================================
const SLASH_CONFIG_REGISTRY = {
  host: {
    key: "host",
    icon: "🖥",
    title: "HOST CONFIGURATOR — SAVED HOSTS, ENDPOINTS, MODELS, VRAM & SPECIALIST AGENTS",
    badge: "● HOST CONFIGURATOR",
    selectors: ['[data-lineup-pane="host-setup"]'],
    prependHostUrlMatrix: false,
  },
  models: {
    key: "models",
    icon: "🤖",
    title: "HOST CONFIGURATOR — MODELS, VRAM LINEUP & SPECIALIST AGENTS",
    badge: "● HOST CONFIGURATOR",
    selectors: [],
    prependUpwardHostTreeBuilder: true,
  },
  boosters: {
    key: "boosters",
    icon: "🚀",
    title: "19 MULTI-GPU HARDWARE BOOSTERS, ETERNAL CORTEX DPO & HARDWARE DRILLS",
    badge: "● /boosters CONFIG",
    selectors: ['[data-lineup-pane="boosters"]'],
  },
  bucket: {
    key: "bucket",
    icon: "🤗",
    title: "HUGGING FACE BUCKETS, 4-LAYER MODEL VAULT & CUSTOM GGUF REPOSITORY",
    badge: "● /bucket CONFIG",
    selectors: ['[data-lineup-pane="add-models"]'],
  },
  presets: {
    key: "presets",
    icon: "📋",
    title: "SAVED 6-SLOT LINEUP PRESETS & HARDWARE PROFILES",
    badge: "● /presets CONFIG",
    selectors: ['[data-lineup-pane="presets"]'],
  },
  cloud: {
    key: "cloud",
    icon: "☁",
    title: "CLOUD & EXTERNAL API ENDPOINTS ROSTER CONFIGURATOR",
    badge: "● /cloud CONFIG",
    selectors: ['[data-lineup-pane="cloud"]'],
  },
  agents: {
    key: "agents",
    icon: "🤖",
    title: "SPECIALIST AGENT FORGE, TASK RUNNER & CUSTOM AGENT TOOLS",
    badge: "● /agents CONFIG",
    selectors: ["#view-agents > .agents-popup-launcher-bar", "#view-agents > .grid2"],
  },
  tools: {
    key: "tools",
    icon: "🧰",
    title: "CUSTOM AGENT TOOLS FORGE, 20 MCP SERVERS & A2A JSON-RPC BRIDGE",
    badge: "● /tools CONFIG",
    selectors: ["#system-tools-mcp-grid", "#view-agents > .grid2"],
  },
  tuning: {
    key: "tuning",
    icon: "⚙",
    title: "PROMPT SAMPLING (TEMP / TOP-P), COUNCIL JUDGES, DEBATE & EXECUTION TUNING",
    badge: "● /tuning CONFIG",
    selectors: ["#tuning"],
  },
  system: {
    key: "system",
    icon: "💾",
    title: "SYSTEM CORE, OUTPUT PATHS, 20 MCP SERVERS & A2A BRIDGE CONFIGURATOR",
    badge: "● /system CONFIG",
    selectors: ["#view-system > .card", "#view-system > .grid2"],
  },
};

const SLASH_CONFIG_ALIASES = {
  hosts: "host",
  "host/config": "host",
  auth: "host",
  hardware: "host",
  vram: "host",
  lineup: "models",
  "models/config": "models",
  "models/popup": "models",
  "models/pop-up": "models",
  "models/tree": "models",
  tree: "models",
  router: "models",
  slots: "models",
  booster: "boosters",
  dpo: "boosters",
  cortex: "boosters",
  buckets: "bucket",
  vault: "bucket",
  hf: "bucket",
  gguf: "bucket",
  preset: "presets",
  agent: "agents",
  forge: "agents",
  tool: "tools",
  mcp: "tools",
  judge: "tuning",
  settings: "tuning",
  a2a: "system",
};

let _slashDockedElements = [];
let _activeSlashConfigKey = null;

function restoreSlashConfigDockedNodes() {
  for (const item of _slashDockedElements) {
    const { el, ph, wasHidden } = item;
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(el, ph);
      ph.remove();
    }
    if (wasHidden) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  }
  _slashDockedElements = [];
  _activeSlashConfigKey = null;
  const stage = $("#slash-config-popup-stage");
  if (stage) stage.innerHTML = "";
}

// ============================================================================
// 4-HOST CUSTOM / LOCAL / TUNNEL URL MATRIX BANNER FOR /host POP-UP
// Explains & fixes why Host B had a custom local URL while Host A, C, D didn't,
// and lets the user bind all 4 hosts simultaneously in one place.
// ============================================================================
function buildHostUrlMatrixBanner() {
  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.style.cssText = "margin-bottom:14px;padding:14px 16px;background:rgba(8,14,28,0.96);border:1px solid rgba(56,189,248,0.4);border-radius:12px;";

  const renderMatrix = async () => {
    const colabData = await getJSON("/api/colab/hosts").catch(() => ({ hosts: {} }));
    const hostsMap = colabData?.hosts || STATE?.colab?.hosts || {};
    const hostKeys = ["a", "b", "c", "d"];
    const defaultPorts = { a: 8080, b: 8081, c: 8082, d: 8083 };

    wrap.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:6px;margin-bottom:8px">
        <button type="button" id="host-matrix-run-boot-btn" class="btn-xs" style="background:linear-gradient(135deg,#10b981,#0284c7);border:none;color:#fff;font-weight:800;padding:4px 10px">▶ Verify 4 Host Boot Cells</button>
        <button type="button" id="host-matrix-standardize-btn" class="btn-xs" style="background:rgba(16,185,129,0.2);border:1px solid rgba(16,185,129,0.55);color:#6ee7b7;font-weight:700;padding:4px 9px">⚡ Standardize Ports (:8080–:8083)</button>
        <button type="button" id="host-matrix-open-models-tree-btn" class="btn-xs" style="background:rgba(56,189,248,0.2);border:1px solid rgba(56,189,248,0.55);color:#7dd3fc;font-weight:700;padding:4px 9px">🔀 /models</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">
        ${hostKeys.map((hk) => {
      const h = hostsMap[hk] || {};
      const curUrl = h.custom_url || `http://127.0.0.1:${defaultPorts[hk]}/v1`;
      const tunUrl = h.tunnel_url || "";
      const isOnline = h.status === "connected" || !!curUrl;
      return `
            <div style="padding:10px 12px;border-radius:10px;background:rgba(15,23,42,0.85);border:1px solid ${isOnline ? "rgba(16,185,129,0.4)" : "rgba(148,163,184,0.25)"}">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:12px;font-weight:900;color:#f8fafc">🖥 HOST ${hk.toUpperCase()} (${esc(h.gpu || "G4 96GB")})</span>
                <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:${isOnline ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"};color:${isOnline ? "#34d399" : "#fcd34d"}">${isOnline ? "ONLINE · BOUND" : "STANDBY"}</span>
              </div>
              <label style="display:block;font-size:10px;color:#94a3b8;margin-bottom:3px">Custom Local / Direct OpenAI-Compatible URL:</label>
              <div style="display:flex;gap:5px">
                <input type="text" data-host-matrix-url="${hk}" value="${esc(curUrl)}" placeholder="http://127.0.0.1:${defaultPorts[hk]}/v1" style="flex:1;font-size:11px;padding:5px 8px;border-radius:6px;background:#050811;border:1px solid rgba(56,189,248,0.35);color:#e2e8f0;font-family:var(--mono)" />
                <button type="button" data-host-matrix-save="${hk}" class="btn-xs" style="background:rgba(56,189,248,0.2);border:1px solid rgba(56,189,248,0.45);color:#38bdf8;font-weight:800">Save</button>
              </div>
              <div style="font-size:9.5px;color:#64748b;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                Tunnel: <span style="color:#a78bfa">${esc(tunUrl || "Auto-Gist / Local Bridge")}</span> · VRAM: <span style="color:#34d399">${h.vram_gb || 96} GB</span>
              </div>
            </div>
          `;
    }).join("")}
      </div>
      <div id="host-matrix-boot-output" style="margin-top:8px;font-size:11px;font-family:var(--mono);color:#6ee7b7"></div>
    `;

    wrap.querySelectorAll("[data-host-matrix-save]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const hk = btn.getAttribute("data-host-matrix-save");
        const inp = wrap.querySelector(`[data-host-matrix-url="${hk}"]`);
        const urlVal = (inp?.value || "").trim();
        btn.textContent = "Saving…";
        await postJSON("/api/colab/connect", { host: hk, custom_url: urlVal }).catch(() => ({}));
        pushClientLiveConsole("HOST", `Bound Host ${hk.toUpperCase()} Custom URL → ${urlVal || "(cleared)"}`);
        await reloadState().catch(() => { });
        renderMatrix();
      });
    });

    wrap.querySelector("#host-matrix-standardize-btn")?.addEventListener("click", async () => {
      for (const hk of hostKeys) {
        const stdUrl = `http://127.0.0.1:${defaultPorts[hk]}/v1`;
        await postJSON("/api/colab/connect", { host: hk, custom_url: stdUrl }).catch(() => ({}));
      }
      pushClientLiveConsole("HOST", "Standardized all 4 Hosts (A=:8080, B=:8081, C=:8082, D=:8083) with active local OpenAI/Ollama endpoints.");
      await reloadState().catch(() => { });
      renderMatrix();
    });

    wrap.querySelector("#host-matrix-run-boot-btn")?.addEventListener("click", async () => {
      const outEl = wrap.querySelector("#host-matrix-boot-output");
      if (outEl) outEl.textContent = "⏳ Running Boot Cell & verifying HTTP /v1/models handshakes on Hosts A, B, C, and D…";
      const res = await postJSON("/api/colab/run-boot-cell", { host: "all" }).catch((e) => ({ ok: false, error: e.message }));
      if (res?.ok && outEl) {
        const summary = (res.results || []).map((r) => `Host ${String(r.host).toUpperCase()}: ${r.ok ? "✅" : "⚠️"} ${r.latency_ms}ms (${r.models_ready} models)`).join(" · ");
        outEl.textContent = `✅ Boot Cell Live Handshake Verified: ${summary}`;
        await reloadState().catch(() => { });
      } else if (outEl) {
        outEl.textContent = `⚠️ ${res?.error || "Boot verification failed"}`;
      }
    });

    wrap.querySelector("#host-matrix-open-models-tree-btn")?.addEventListener("click", () => {
      openSlashConfigPopupWindow("models");
    });
  };

  renderMatrix();
  return wrap;
}

// ============================================================================
// UPWARD-BRANCHING HOST TREE BUILDER & MODEL/AGENT/CUSTOMIZE MANAGER (/models)
// Bottom-to-top hierarchical visual tree wired directly to STATE.host_lineups,
// STATE.lineup, STATE.catalog, STATE.backends, picked, and /api/lineup/publish.
// Includes:
//   1. Speculative Decoding Draft-Model Acceleration Pairer per Host (2.4x–3.1x speedup)
//   2. Live VRAM Capacity Bar + 1-Click Auto-Fit Quantization Down-Scaler (Zero OOM)
// ============================================================================
const HOST_TREE_MODEL_CATALOG = {
  cybersecurity: {
    label: "🛡 Cyber, RedHat & OffSec",
    icon: "🛡",
    slot: "cyber",
    desc: "Offensive/defensive security, RedHat pentesting, exploit research, Kali & binary auditing models",
    models: [
      { id: "orca27", hf: "orcarouter/OrcaSAQ-2-Cyber-27B-Uncensored-GGUF", label: "OrcaRouter OrcaSAQ-2 Cyber 27B Uncensored [Flagship]", quant: "Q4_K_M", vram: 16, slot: "cyber", unc: true },
      { id: "orcacyber-zero-1.5", hf: "orca/orcacyber-zero-1.5", label: "OrcaCyber Zero 1.5 (95.8% CVE-Bench · OffSec)", quant: "Q4_K_M", vram: 20, slot: "cyber", unc: true },
      { id: "orcacyber-ultra-1.0", hf: "orca/orcacyber-ultra-1.0", label: "OrcaCyber Ultra 1.0 (RedTeam & Zero-Day Reasoning)", quant: "Q4_K_M", vram: 22, slot: "cyber", unc: true },
      { id: "raven35", hf: "deadbydawn101/RavenX-CyberAgent-Qwen3.6-35B-A3B-Opus-4.7-OpenMythos-Pentester-BugHunter-RATH-GGUF", label: "RedTeam RavenX CyberAgent 35B MoE (Pentester & BugHunter)", quant: "Q4_K_M", vram: 22, slot: "cyber", unc: true },
      { id: "wrn33", hf: "TheBloke/WhiteRabbitNeo-33B-v1-GGUF", label: "RedTeam WhiteRabbitNeo 33B v1.5 (Heavy OffSec)", quant: "Q4_K_M", vram: 20, slot: "cyber", unc: true },
      { id: "pent32", hf: "mradermacher/Qwen-QwQ-32b-Pentest-CoT-GGUF", label: "RedTeam QwQ 32B Pentest CoT (Exploit Chain Reasoner)", quant: "Q4_K_M", vram: 19, slot: "cyber", unc: true },
      { id: "seneca32", hf: "AlicanKiraz0/QwQ-32B-Preview-Seneca-Cybersecurity-LLMv1.2-Q4_K_M-GGUF", label: "Cyber Seneca-QwQ 32B OffSec Reasoning", quant: "Q4_K_M", vram: 19, slot: "cyber", unc: true },
      { id: "cyag27", hf: "cyjin-yl/Qwen3.8-27B-Uncensored-Cyber-agentic-imatrix-GGUF", label: "Agent Cyber Qwen3.8 27B Uncensored Agentic", quant: "Q4_K_M", vram: 17, slot: "cyber", unc: true },
      { id: "oss20h", hf: "mradermacher/GPT-OSS-Cybersecurity-20B-Merged-heretic-GGUF", label: "RedTeam GPT-OSS 20B Heretic Cyber Merged", quant: "Q4_K_M", vram: 14, slot: "cyber", unc: true },
      { id: "wrn13", hf: "TheBloke/WhiteRabbitNeo-13B-GGUF", label: "RedTeam WhiteRabbitNeo 13B OffSec", quant: "Q5_K_M", vram: 10, slot: "cyber", unc: true },
      { id: "rednemo", hf: "AIgotahole/red-teamer-mistral-nemo-Q4_K_M-GGUF", label: "RedTeam Red-Teamer Mistral Nemo 12B", quant: "Q4_K_M", vram: 9, slot: "cyber", unc: true },
      { id: "qsp9", hf: "xtools-at/Qwen3.5-9B-Qwensploit-CyberSecurity-GGUF", label: "Cyber Qwensploit 9B Heretic (Exploit Specialist)", quant: "Q5_K_M", vram: 7, slot: "cyber", unc: true },
      { id: "baron8", hf: "AlicanKiraz0/Cybersecurity-BaronLLM_Offensive_Security_LLM_Q6_K_GGUF", label: "RedTeam BaronLLM OffSec 8B (Q6_K Offensive)", quant: "Q6_K", vram: 7, slot: "cyber", unc: true },
      { id: "seneca", hf: "AlicanKiraz0/Seneca-Cybersecurity-LLM-Q4_K_M-GGUF", label: "Cyber SenecaLLM OffSec 8B", quant: "Q4_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "wrn8", hf: "Nekuromento/Llama-3.1-WhiteRabbitNeo-2-8B-Q4_K_M-GGUF", label: "Cyber WhiteRabbitNeo-2 8B (Llama 3.1)", quant: "Q4_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "fsecred", hf: "Bjarnos/foundation-sec-8b-red-team-Q5_K_M-GGUF", label: "RedTeam Foundation-Sec 8B Red-Team", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "kalipen", hf: "mradermacher/Llama-3.1-8B-kali-pentester-GGUF", label: "RedTeam Kali Pentester 8B (Kali Linux & CLI)", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "llred8", hf: "mradermacher/Llama3.1-8b-instruct-LLMPC-Red-Team-GGUF", label: "RedTeam LLMPC Red Team 8B", quant: "Q4_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "dhat7", hf: "mradermacher/DeepHat-V1-7B-Heretic-Abliterated-GGUF", label: "RedTeam DeepHat-V1 7B Heretic Abliterated", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "wrn7a", hf: "bartowski/WhiteRabbitNeo-7B-v1.5a-GGUF", label: "RedTeam WhiteRabbitNeo 7B v1.5a", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "pentgpt", hf: "mradermacher/Pentesting-GPT-v1.0-GGUF", label: "RedTeam Pentesting-GPT 7B v1.0", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "lily7", hf: "NiroshanDb23/Lily-Cybersecurity-7B-Uncensored-GGUF", label: "Cyber Lily 7B Uncensored", quant: "Q5_K_M", vram: 6, slot: "cyber", unc: true },
      { id: "qsp4", hf: "xtools-at/Qwen3.5-4B-Qwensploit-CyberSecurity-GGUF", label: "RedTeam Qwensploit 4B Heretic", quant: "Q6_K", vram: 4, slot: "cyber", unc: true },
      { id: "qsp2", hf: "xtools-at/Qwen3.5-2B-Qwensploit-CyberSecurity-GGUF", label: "RedTeam Qwensploit 2B Heretic (Fast Recon)", quant: "Q8_0", vram: 2.5, slot: "cyber", unc: true },
      { id: "fsec11", hf: "fdtn-ai/Foundation-Sec-1.1-8B-Instruct-Q4_K_M-GGUF", label: "Cisco Foundation-Sec 1.1 8B (CVE & Defense)", quant: "Q4_K_M", vram: 6, slot: "cyber" },
      { id: "fsecr", hf: "fdtn-ai/Foundation-Sec-8B-Reasoning-Q4_K_M-GGUF", label: "Cisco Foundation-Sec 8B Reasoning", quant: "Q4_K_M", vram: 6, slot: "cyber" },
    ],
  },
  abliterated: {
    label: "🔓 Unrestricted & Abliterated",
    icon: "🔓",
    slot: "unc",
    desc: "All zero-refusal abliterated, heretic, and unaligned models across Llama, Qwen, DeepSeek & Gemma",
    models: [
      { id: "qwen25-72b-abliterated", hf: "huihui-ai/Qwen2.5-72B-Instruct-abliterated", label: "Qwen2.5 72B Instruct Abliterated [HEAVY]", quant: "Q4_K_M", vram: 42, slot: "unc", unc: true },
      { id: "l70", hf: "failspy/Llama-3.3-70B-Instruct-abliterated", label: "Llama 3.3 70B Abliterated [HEAVY]", quant: "Q4_K_M", vram: 42, slot: "unc", unc: true },
      { id: "r1l70", hf: "huihui-ai/DeepSeek-R1-Distill-Llama-70B-abliterated", label: "DeepSeek R1-Llama 70B Abliterated [HEAVY]", quant: "Q4_K_M", vram: 42, slot: "think", unc: true },
      { id: "r1-32", hf: "huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated", label: "DeepSeek R1 32B Abliterated (Uncensored CoT)", quant: "Q4_K_M", vram: 19, slot: "think", unc: true },
      { id: "qwq-32", hf: "huihui-ai/QwQ-32B-abliterated", label: "Qwen QwQ 32B Abliterated (Uncensored Reasoning)", quant: "Q4_K_M", vram: 19, slot: "think", unc: true },
      { id: "q332", hf: "huihui-ai/Qwen3-32B-abliterated", label: "Qwen3 32B Abliterated", quant: "Q4_K_M", vram: 19, slot: "unc", unc: true },
      { id: "code32", hf: "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated", label: "Qwen2.5 Coder 32B Abliterated", quant: "Q4_K_M", vram: 19, slot: "code", unc: true },
      { id: "glm432", hf: "huihui-ai/GLM-4-32B-abliterated", label: "GLM-4 32B Abliterated", quant: "Q4_K_M", vram: 19, slot: "unc", unc: true },
      { id: "moe30i", hf: "huihui-ai/Qwen3-30B-A3B-Instruct-abliterated", label: "Qwen3 30B-A3B MoE Instruct Abliterated", quant: "Q4_K_M", vram: 17, slot: "unc", unc: true },
      { id: "moe30t", hf: "huihui-ai/Qwen3-30B-A3B-Thinking-abliterated", label: "Qwen3 30B-A3B MoE Thinking Abliterated", quant: "Q4_K_M", vram: 17, slot: "think", unc: true },
      { id: "q38u", hf: "orcarouter/Qwen3.8-27B-Uncensored-GGUF", label: "OrcaRouter Qwen3.8 27B Uncensored (Vision)", quant: "Q4_K_M", vram: 17, slot: "vision", unc: true },
      { id: "g27a", hf: "huihui-ai/gemma-3-27b-it-abliterated", label: "Gemma-3 27B Abliterated (Vision)", quant: "Q4_K_M", vram: 17, slot: "vision", unc: true },
      { id: "r1-14", hf: "huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated", label: "DeepSeek R1 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "think", unc: true },
      { id: "q314", hf: "huihui-ai/Qwen3-14B-abliterated", label: "Qwen3 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "unc", unc: true },
      { id: "qw14", hf: "huihui-ai/Qwen2.5-14B-Instruct-abliterated", label: "Qwen2.5 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "unc", unc: true },
      { id: "qc14a", hf: "huihui-ai/Qwen2.5-Coder-14B-Instruct-abliterated", label: "Qwen2.5-Coder 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "code", unc: true },
      { id: "phi4", hf: "huihui-ai/Phi-4-14B-abliterated", label: "Phi-4 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "think", unc: true },
      { id: "g12a", hf: "huihui-ai/gemma-3-12b-it-abliterated", label: "Gemma-3 12B Abliterated (Vision)", quant: "Q5_K_M", vram: 9, slot: "vision", unc: true },
      { id: "nemo12", hf: "failspy/Mistral-Nemo-12B-abliterated", label: "Mistral Nemo 12B Abliterated", quant: "Q5_K_M", vram: 9, slot: "unc", unc: true },
      { id: "tiger9", hf: "TheDrummer/Tiger-Gemma-9B-v3-GGUF", label: "Tiger-Gemma 9B v3 Uncensored", quant: "Q5_K_M", vram: 7, slot: "unc", unc: true },
      { id: "l8", hf: "failspy/Meta-Llama-3.1-8B-Instruct-abliterated", label: "Llama 3.1 8B Abliterated", quant: "Q6_K", vram: 6, slot: "unc", unc: true },
      { id: "r1l8", hf: "huihui-ai/DeepSeek-R1-Distill-Llama-8B-abliterated", label: "DeepSeek R1-Llama 8B Abliterated", quant: "Q6_K", vram: 6, slot: "think", unc: true },
      { id: "q38", hf: "huihui-ai/Qwen3-8B-abliterated", label: "Qwen3 8B Abliterated", quant: "Q6_K", vram: 6, slot: "unc", unc: true },
      { id: "dphn8", hf: "cognitivecomputations/Dolphin3.0-Llama3.1-8B-GGUF", label: "Agent Dolphin 3.0 8B Abliterated", quant: "Q6_K", vram: 6, slot: "agent", unc: true },
      { id: "aglfm", hf: "NousResearch/Hermes-Coder-LFM2.5-8B-ablit-GGUF", label: "Agent Hermes-Coder LFM2.5 8B Abliterated", quant: "Q6_K", vram: 6, slot: "agent", unc: true },
      { id: "r1q7", hf: "huihui-ai/DeepSeek-R1-Distill-Qwen-7B-abliterated", label: "DeepSeek R1 7B Abliterated", quant: "Q6_K", vram: 6, slot: "think", unc: true },
      { id: "qw7", hf: "huihui-ai/Qwen2.5-7B-Instruct-abliterated", label: "Qwen2.5 7B Abliterated", quant: "Q6_K", vram: 6, slot: "unc", unc: true },
      { id: "qc7a", hf: "huihui-ai/Qwen2.5-Coder-7B-Instruct-abliterated", label: "Qwen2.5-Coder 7B Abliterated", quant: "Q6_K", vram: 6, slot: "code", unc: true },
      { id: "m7b", hf: "failspy/Mistral-7B-Instruct-v0.3-abliterated", label: "Mistral 7B Abliterated", quant: "Q6_K", vram: 6, slot: "unc", unc: true },
      { id: "dscl", hf: "huihui-ai/DeepSeek-Coder-V2-Lite-Instruct-abliterated", label: "DeepSeek Coder-V2-Lite Abliterated", quant: "Q5_K_M", vram: 10, slot: "code", unc: true },
      { id: "g4a", hf: "huihui-ai/gemma-3-4b-it-abliterated", label: "Gemma-3 4B Abliterated (Vision)", quant: "Q8_0", vram: 4, slot: "vision", unc: true },
      { id: "q34", hf: "huihui-ai/Qwen3-4B-abliterated", label: "Qwen3 4B Abliterated", quant: "Q8_0", vram: 4, slot: "unc", unc: true },
      { id: "agent4", hf: "SpaceClaude/Space.Claude-4B-Uncensored-GGUF", label: "Agent Space.Claude 4B Uncensored", quant: "Q8_0", vram: 4, slot: "agent", unc: true },
      { id: "l3b", hf: "huihui-ai/Llama-3.2-3B-Instruct-abliterated", label: "Llama 3.2 3B Abliterated (Swarm Fast)", quant: "Q8_0", vram: 3, slot: "fast", unc: true },
    ],
  },
  coding: {
    label: "💻 Coding & Systems",
    icon: "💻",
    slot: "code",
    desc: "Full-stack architecture, kernel systems, compilers & polyglot code synthesis",
    models: [
      { id: "code32", hf: "huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated", label: "Qwen2.5-Coder 32B Abliterated (Uncensored SOTA Coder)", quant: "Q4_K_M", vram: 19, slot: "code", unc: true },
      { id: "qwen25-coder-32b", hf: "Qwen/Qwen2.5-Coder-32B-Instruct", label: "Qwen2.5-Coder 32B Instruct (SOTA Open Coder)", quant: "Q4_K_M", vram: 19, slot: "code" },
      { id: "qc30", hf: "Qwen/Qwen3-Coder-30B-A3B-Instruct", label: "Qwen3-Coder 30B-A3B MoE", quant: "Q4_K_M", vram: 17, slot: "code" },
      { id: "deepseek-v3-0324", hf: "deepseek-ai/DeepSeek-V3-0324", label: "DeepSeek-V3 0324 (Polyglot Systems Architect)", quant: "Q4_K_M", vram: 45, slot: "code" },
      { id: "codestral", hf: "mistralai/Codestral-22B-v0.1", label: "Mistral Codestral 22B", quant: "Q4_K_M", vram: 14, slot: "code" },
      { id: "codellama-34b", hf: "codellama/CodeLlama-34b-Instruct-hf", label: "CodeLlama 34B Instruct (Systems & C++/Rust)", quant: "Q4_K_M", vram: 20, slot: "code" },
      { id: "starcoder2-15b", hf: "bigcode/starcoder2-15b-instruct-v0.1", label: "StarCoder2 15B Instruct (Repo-Scale Code)", quant: "Q5_K_M", vram: 11, slot: "code" },
      { id: "coder14", hf: "Qwen/Qwen2.5-Coder-14B-Instruct-Q8_0", label: "Qwen2.5-Coder 14B Q8_0 (High-Precision)", quant: "Q8_0", vram: 15, slot: "code", unc: true },
      { id: "qc14a", hf: "huihui-ai/Qwen2.5-Coder-14B-Instruct-abliterated", label: "Qwen2.5-Coder 14B Abliterated", quant: "Q5_K_M", vram: 10, slot: "code", unc: true },
      { id: "dscl", hf: "huihui-ai/DeepSeek-Coder-V2-Lite-Instruct-abliterated", label: "DeepSeek Coder-V2-Lite Abliterated", quant: "Q5_K_M", vram: 10, slot: "code", unc: true },
      { id: "seedc", hf: "ByteDance-Seed/Seed-Coder-8B-Instruct", label: "Seed-Coder 8B Instruct", quant: "Q6_K", vram: 6, slot: "code" },
      { id: "qc7a", hf: "huihui-ai/Qwen2.5-Coder-7B-Instruct-abliterated", label: "Qwen2.5-Coder 7B Abliterated", quant: "Q6_K", vram: 6, slot: "code", unc: true },
      { id: "coder7", hf: "Qwen/Qwen2.5-Coder-7B-Instruct", label: "Qwen2.5-Coder 7B Instruct", quant: "Q6_K", vram: 6, slot: "code" },
    ],
  },
  math: {
    label: "🧮 Math & Deep Reasoning",
    icon: "🧮",
    slot: "math",
    desc: "Chain-of-thought theorem proving, formal verification & quantitative logic",
    models: [
      { id: "deepseek-r1-llama-70b", hf: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B", label: "DeepSeek-R1 Distill Llama 70B (CoT Reasoner)", quant: "Q4_K_M", vram: 40, slot: "think" },
      { id: "r1-32", hf: "huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated", label: "DeepSeek R1 32B Abliterated (Uncensored CoT)", quant: "Q4_K_M", vram: 19, slot: "think", unc: true },
      { id: "qwq-32", hf: "huihui-ai/QwQ-32B-abliterated", label: "Qwen QwQ 32B Abliterated (Deep Reasoning)", quant: "Q4_K_M", vram: 19, slot: "math", unc: true },
      { id: "qwen25-math-72b", hf: "Qwen/Qwen2.5-Math-72B-Instruct", label: "Qwen2.5-Math 72B Instruct (Olympiad Math)", quant: "Q4_K_M", vram: 42, slot: "math" },
      { id: "deepseek-r1-qwen-14b", hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B", label: "DeepSeek-R1 Distill Qwen 14B (Fast CoT)", quant: "Q5_K_M", vram: 11, slot: "think" },
      { id: "phi-4-reasoning-plus", hf: "microsoft/Phi-4-reasoning-plus", label: "Microsoft Phi-4 Reasoning Plus 14B", quant: "Q6_K", vram: 12, slot: "math" },
      { id: "math7", hf: "Qwen/Qwen2.5-Math-7B-Instruct", label: "Qwen2.5-Math 7B Instruct", quant: "Q6_K", vram: 6, slot: "math" },
      { id: "math15", hf: "Qwen/Qwen2.5-Math-1.5B-Instruct", label: "Qwen2.5-Math 1.5B Fast Verifier", quant: "Q8_0", vram: 2, slot: "math" },
    ],
  },
  roleplay: {
    label: "🎭 Roleplay & Uncensored",
    icon: "🎭",
    slot: "unc",
    desc: "Zero-refusal creative synthesis, uncensored abliterated & persona engines",
    models: [
      { id: "rp_roci", hf: "TheDrummer/Rocinante-12B-v1.1-GGUF", label: "RP Rocinante-X 12B Heretic (Dark Creative)", quant: "Q5_K_M", vram: 9, slot: "role", unc: true },
      { id: "rp_sth", hf: "Sao10K/L3-8B-Stheno-v3.4-GGUF", label: "RP Stheno v3.4 8B Uncensored", quant: "Q6_K", vram: 6, slot: "role", unc: true },
      { id: "rp_mag9", hf: "anthracite-org/magnum-v4-9b-gguf", label: "RP Magnum v4 9B Uncensored", quant: "Q6_K", vram: 7, slot: "role", unc: true },
      { id: "llama33-70b-euryale", hf: "Sao10K/L3.3-70B-Euryale-v2.3", label: "Llama 3.3 70B Euryale v2.3 (Deep Persona)", quant: "Q4_K_M", vram: 40, slot: "role", unc: true },
      { id: "dolphin-2.9.4-llama31-8b", hf: "cognitivecomputations/Dolphin-2.9.4-Llama3.1-8B", label: "Dolphin 2.9.4 Llama 3.1 8B (Unfiltered)", quant: "Q6_K", vram: 7, slot: "unc", unc: true },
      { id: "hermes70", hf: "NousResearch/Hermes-3-Llama-3.1-70B", label: "Nous Hermes 3 70B (Unaligned Steerable)", quant: "Q4_K_M", vram: 40, slot: "unc", unc: true },
    ],
  },
  vision: {
    label: "👁 Vision & Multimodal",
    icon: "👁",
    slot: "ocr",
    desc: "OCR, UI screenshot inspection, diagram parsing & multimodal VLM models",
    models: [
      { id: "q38u", hf: "orcarouter/Qwen3.8-27B-Uncensored-GGUF", label: "OrcaRouter Qwen3.8 27B Uncensored Vision", quant: "Q4_K_M", vram: 17, slot: "ocr", unc: true },
      { id: "g27a", hf: "huihui-ai/gemma-3-27b-it-abliterated", label: "Gemma-3 27B Abliterated Vision", quant: "Q4_K_M", vram: 17, slot: "ocr", unc: true },
      { id: "qwen3vl", hf: "Qwen/Qwen3-VL-8B-Uncensored-GGUF", label: "Qwen3-VL 8B Uncensored Vision", quant: "Q6_K", vram: 7, slot: "ocr", unc: true },
      { id: "qwen25-vl-72b", hf: "Qwen/Qwen2.5-VL-72B-Instruct", label: "Qwen2.5-VL 72B Instruct (Flagship Vision VLM)", quant: "Q4_K_M", vram: 42, slot: "ocr" },
      { id: "qwen25-vl-7b", hf: "Qwen/Qwen2.5-VL-7B-Instruct", label: "Qwen2.5-VL 7B Instruct (Fast UI & OCR Vision)", quant: "Q8_0", vram: 9, slot: "ocr" },
      { id: "ocr_olm", hf: "allenai/olmOCR-7B-0225-preview", label: "OCR olmOCR 7B Document Parser", quant: "Q6_K", vram: 6, slot: "ocr" },
      { id: "ocr_nan", hf: "nanonets/Nanonets-OCR-s-7B", label: "OCR Nanonets-OCR-s 7B", quant: "Q6_K", vram: 6, slot: "ocr" },
    ],
  },
  science: {
    label: "🧬 Science, Bio & Research",
    icon: "🧬",
    slot: "think",
    desc: "Physics simulation, molecular chemistry, biomedical synthesis & arXiv analysis",
    models: [
      { id: "olmo-2-32b", hf: "allenai/OLMo-2-32B-Instruct", label: "AllenAI OLMo-2 32B (Open Scientific Corpus)", quant: "Q4_K_M", vram: 19, slot: "think" },
      { id: "openbiollm-70b", hf: "aaditya/OpenBioLLM-Llama3-70B", label: "OpenBioLLM Llama3 70B (Biomedical & Clinical)", quant: "Q4_K_M", vram: 40, slot: "think" },
      { id: "med_bio", hf: "BioMistral/BioMistral-7B-GGUF", label: "Medical BioMistral 7B", quant: "Q6_K", vram: 6, slot: "think" },
      { id: "med_llama3", hf: "m42-health/Llama3-Med42-3B", label: "Medical Llama-3.2 3B", quant: "Q8_0", vram: 3, slot: "think" },
    ],
  },
};

const SPECULATIVE_DRAFT_MODELS = [
  { id: "none", label: "Off (Standard Autoregressive Decoding)", speedup: "1.0x", vram: 0 },
  { id: "Qwen/Qwen2.5-Coder-1.5B-Instruct-Q8_0", label: "⚡ Qwen2.5-Coder 1.5B Draft (Q8_0 · +2.9x Code Speedup)", speedup: "2.9x", vram: 1.8 },
  { id: "meta-llama/Llama-3.2-1B-Instruct-Q8_0", label: "⚡ Llama-3.2 1B Draft (Q8_0 · +2.6x General Speedup)", speedup: "2.6x", vram: 1.2 },
  { id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B-Q8_0", label: "⚡ DeepSeek-R1 1.5B Draft (Q8_0 · +2.8x CoT Speedup)", speedup: "2.8x", vram: 1.8 },
];

const QUANT_VRAM_MULTIPLIER = {
  Q2_K: 0.58,
  Q3_K_M: 0.78,
  Q4_K_M: 1.0,
  Q5_K_M: 1.22,
  Q6_K: 1.42,
  Q8_0: 1.75,
  FP16: 3.2,
};

const HOST_TREE_UI_STATE = {
  selectedHost: "a",
  selectedBranch: "lineup", // "lineup" | "agents" | "customize"
  selectedCategory: "coding",
  agentTargetModelId: "__host__",
  selectedAgentCategory: "all",
  loadedFromServer: false,
  judgeModel: "auto",
  models: [], // Synchronized with STATE.host_lineups & STATE.catalog
  hostConfigs: {
    a: { id: "a", label: "Host A", url: "http://127.0.0.1:8080/v1", vram_budget_gb: 96, draft_model: "Qwen/Qwen2.5-Coder-1.5B-Instruct-Q8_0", temperature: 0.7, top_p: 0.95, max_tokens: 4096, quantization: "Q4_K_M", data_tuning_mode: "standard_dpo", persona: "Senior Systems Architect", writing_style: "Direct, Production-Ready, Zero Placeholders", extra_instructions: "", assigned_agent: "", model_agents: {} },
    b: { id: "b", label: "Host B", url: "http://127.0.0.1:8081/v1", vram_budget_gb: 96, draft_model: "Qwen/Qwen2.5-Coder-1.5B-Instruct-Q8_0", temperature: 0.7, top_p: 0.95, max_tokens: 4096, quantization: "Q4_K_M", data_tuning_mode: "standard_dpo", persona: "Security & Backend Specialist", writing_style: "Rigorous, Defensive, High-Performance", extra_instructions: "", assigned_agent: "", model_agents: {} },
    c: { id: "c", label: "Host C", url: "http://127.0.0.1:8082/v1", vram_budget_gb: 96, draft_model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B-Q8_0", temperature: 0.7, top_p: 0.95, max_tokens: 4096, quantization: "Q4_K_M", data_tuning_mode: "standard_dpo", persona: "Mathematical & Algorithmic Reasoner", writing_style: "Step-by-Step Formal Verification", extra_instructions: "", assigned_agent: "", model_agents: {} },
    d: { id: "d", label: "Host D", url: "http://127.0.0.1:8083/v1", vram_budget_gb: 96, draft_model: "meta-llama/Llama-3.2-1B-Instruct-Q8_0", temperature: 0.7, top_p: 0.95, max_tokens: 4096, quantization: "Q4_K_M", data_tuning_mode: "standard_dpo", persona: "Uncensored Red-Team Critic", writing_style: "Blunt, Exhaustive Edge-Case Auditor", extra_instructions: "", assigned_agent: "", model_agents: {} },
  },
  customHosts: [],
  savedTreePresets: [],
  quantizationSpecs: {},
  dataTuningModes: {},
};

// Load any locally saved custom lineup presets immediately
try {
  const localPresets = JSON.parse(localStorage.getItem("suomynona_custom_tree_presets_v1") || "[]");
  if (Array.isArray(localPresets) && localPresets.length) {
    HOST_TREE_UI_STATE.savedTreePresets = localPresets;
  }
} catch (_) { }

function hydrateHostTreeModelsFromGlobalState() {
  const existingKeySet = new Set(HOST_TREE_UI_STATE.models.map((m) => `${m.host}:${m.id}`));
  const hostLineups = STATE?.host_lineups || {};
  const catalog = STATE?.catalog || {};

  // Pull every model currently configured in STATE.host_lineups into HOST_TREE_UI_STATE.models
  Object.entries(hostLineups).forEach(([hk, slotMap]) => {
    const hKey = String(hk || "a").toLowerCase();
    const hCfg = HOST_TREE_UI_STATE.hostConfigs[hKey] || { quantization: "Q4_K_M" };
    Object.entries(slotMap || {}).forEach(([slot, ids]) => {
      (Array.isArray(ids) ? ids : []).filter(Boolean).forEach((modId) => {
        const key = `${hKey}:${modId}`;
        if (!existingKeySet.has(key)) {
          const catEntry = catalog[modId] || {};
          HOST_TREE_UI_STATE.models.push({
            id: modId,
            label: catEntry.name || modId,
            host: hKey,
            slot: slot || "code",
            enabled: true,
            quantization: hCfg.quantization || "Q4_K_M",
            base_vram_gb: Number(catEntry.gb) || 14,
            vram_gb: Number(catEntry.gb) || 14,
            specialist_agent: (hCfg.model_agents || {})[modId] || hCfg.assigned_agent || "",
            temperature: hCfg.temperature ?? 0.7,
            top_p: hCfg.top_p ?? 0.95,
          });
          existingKeySet.add(key);
        }
      });
    });
  });
}

async function syncHostTreeToGlobalLineupAndUI() {
  try {
    STATE.catalog ||= {};
    STATE.slots ||= {};
    const allocations = {};
    const combinedLineup = {};
    const allHostKeys = ["a", "b", "c", "d", ...(HOST_TREE_UI_STATE.customHosts || [])];
    allHostKeys.forEach((hk) => { allocations[hk] = {}; });

    HOST_TREE_UI_STATE.models.forEach((m) => {
      const hk = String(m.host || "a").toLowerCase();
      const slot = m.slot || "code";
      if (!STATE.catalog[m.id]) {
        STATE.catalog[m.id] = {
          id: m.id,
          name: m.label || m.id,
          hf: m.hf || m.id,
          gb: m.vram_gb || 14,
          slots: [slot],
          unc: Boolean(m.unc || slot === "unc" || slot === "role" || slot === "cyber"),
        };
      }
      STATE.slots[slot] ||= [];
      if (!STATE.slots[slot].includes(m.id)) {
        STATE.slots[slot].push(m.id);
      }
      if (m.enabled !== false) {
        allocations[hk] ||= {};
        allocations[hk][slot] ||= [];
        if (!allocations[hk][slot].includes(m.id)) {
          allocations[hk][slot].push(m.id);
        }
        combinedLineup[slot] ||= [];
        if (!combinedLineup[slot].includes(m.id)) {
          combinedLineup[slot].push(m.id);
        }
        if (typeof picked !== "undefined" && picked instanceof Set) {
          (STATE?.backends || []).forEach((b) => {
            if (b.id === m.id || b.model === m.id || b.model === m.hf) {
              picked.add(b.i);
            }
          });
        }
      }
    });

    STATE.host_lineups = allocations;
    STATE.lineup = combinedLineup;

    const customModelsMeta = (HOST_TREE_UI_STATE.models || [])
      .filter((m) => m && m.id && m.enabled !== false)
      .map((m) => ({
        id: m.id,
        name: m.label || m.id,
        hf: m.hf || m.id,
        slot: m.slot || "code",
        gb: Number(m.vram_gb || m.base_vram_gb || 14),
        unc: Boolean(m.unc || m.slot === "unc" || m.slot === "cyber" || m.slot === "role"),
      }));

    await postJSON("/api/lineup/publish", {
      lineup: combinedLineup,
      allocations,
      custom_models_meta: customModelsMeta,
    }).catch(() => { });

    // Reload backend indices so picked always holds valid numeric b.i indices for Council & Swarm
    await reloadState().catch(() => { });
    if (typeof renderLineup === "function") renderLineup({ skipHoverMount: true });
    if (typeof renderChips === "function") renderChips();
    if (typeof renderRightModelsRail === "function") renderRightModelsRail();
  } catch (_) { }
}

async function syncHostTreeStateFromServer() {
  try {
    const res = await getJSON("/api/host-tree/state");
    if (res?.ok) {
      if (res.host_tree?.hosts) {
        Object.keys(res.host_tree.hosts).forEach((hk) => {
          HOST_TREE_UI_STATE.hostConfigs[hk] = Object.assign(
            {},
            HOST_TREE_UI_STATE.hostConfigs[hk] || {},
            res.host_tree.hosts[hk]
          );
        });
      }
      if (Array.isArray(res.host_tree?.models) && res.host_tree.models.length > 0) {
        HOST_TREE_UI_STATE.models = res.host_tree.models;
      } else {
        hydrateHostTreeModelsFromGlobalState();
      }
      if (Array.isArray(res.host_tree?.custom_hosts)) {
        HOST_TREE_UI_STATE.customHosts = res.host_tree.custom_hosts;
      }
      if (Array.isArray(res.host_tree?.saved_presets) && res.host_tree.saved_presets.length) {
        HOST_TREE_UI_STATE.savedTreePresets = res.host_tree.saved_presets;
        try {
          localStorage.setItem("suomynona_custom_tree_presets_v1", JSON.stringify(HOST_TREE_UI_STATE.savedTreePresets));
        } catch (_) { }
      }
      if (res.quantization_specs) HOST_TREE_UI_STATE.quantizationSpecs = res.quantization_specs;
      if (res.data_tuning_modes) HOST_TREE_UI_STATE.dataTuningModes = res.data_tuning_modes;
      HOST_TREE_UI_STATE.loadedFromServer = true;
    }
  } catch (_) { }
}

async function persistHostTreeStateToServer() {
  try {
    localStorage.setItem("suomynona_custom_tree_presets_v1", JSON.stringify(HOST_TREE_UI_STATE.savedTreePresets || []));
  } catch (_) { }
  try {
    await postJSON("/api/host-tree/save", {
      hosts: HOST_TREE_UI_STATE.hostConfigs,
      models: HOST_TREE_UI_STATE.models,
      custom_hosts: HOST_TREE_UI_STATE.customHosts,
      saved_presets: HOST_TREE_UI_STATE.savedTreePresets,
    });
  } catch (_) { }
}

// ============================================================================
// SPACED LIGHTHOUSE HOST BEACONS + CLICK-ACTIVATED GLASS LIGHTHOUSE OVERLAY
// (Zero Hover Collisions · Custom Saved Presets · All Cyber/RedHat/Abliterated Models · Pure HF Vault Overlay)
// ============================================================================
function buildUpwardHostTreeBuilder() {
  const container = document.createElement("div");
  container.className = "host-tree-builder-wrap";
  container.style.position = "relative";

  hydrateHostTreeModelsFromGlobalState();
  if (!HOST_TREE_UI_STATE.loadedFromServer) {
    syncHostTreeStateFromServer().then(() => renderCascade());
  }

  let openLighthouseHost = null;   // "a" | "b" | "c" | "d" | null (Click-activated — ZERO hover collisions!)
  let activeLighthouseTab = "models"; // "models" | "agents" | "customize"
  let modelFilterText = "";
  let modelFilterCat = "all";
  let agentFilterText = "";
  let agentFilterCat = "all";
  let vaultOverlayOpen = false;

  const QUANT_VRAM_MULTIPLIERS = {
    Q2_K: 0.58,
    Q3_K_M: 0.76,
    Q4_K_M: 1.0,
    Q5_K_M: 1.18,
    Q6_K: 1.35,
    Q8_0: 1.68,
    FP16: 3.1,
  };

  const getAllHostsList = () => {
    const base = ["a", "b", "c", "d"];
    const extra = (HOST_TREE_UI_STATE.customHosts || []).filter((h) => !base.includes(h));
    return [...base, ...extra];
  };

  const getHostModels = (hk) => {
    return (HOST_TREE_UI_STATE.models || []).filter(
      (m) => String(m.host || "a").toLowerCase() === String(hk || "a").toLowerCase() && m.enabled !== false
    );
  };

  const computeHostVramStats = (hk) => {
    const hc = HOST_TREE_UI_STATE.hostConfigs[hk] || {};
    const hb = (window._lastHostHeartbeatMap || {})[hk] || {};
    const budgetGb = Number(hc.vram_budget_gb || hb.vram_gb || 96);
    const mods = getHostModels(hk);
    const weightsGb = mods.reduce((acc, m) => {
      const base = Number(m.base_vram_gb || m.vram_gb || 14);
      const qMult = QUANT_VRAM_MULTIPLIERS[m.quantization || hc.quantization || "Q4_K_M"] || 1.0;
      return acc + Math.round(base * qMult * 10) / 10;
    }, 0);
    const ctxSize = Number(hc.context_size || hb.context_size || 32768);
    const qKey = String(hc.quantization || hb.quantization || "Q4_K_M").toUpperCase();
    const kvPer32k = qKey.includes("Q2") || qKey.includes("Q3") ? 2.1 : qKey === "FP16" ? 6.4 : 3.8;
    const kvGb = mods.length > 0 ? Number(((ctxSize / 32768) * kvPer32k).toFixed(1)) : 0;
    const cudaOverheadGb = mods.length > 0 ? 1.2 : 0.4;
    const usedGb = Math.round((weightsGb + kvGb + cudaOverheadGb) * 10) / 10;
    const pct = Math.min(140, Math.round((usedGb / Math.max(1, budgetGb)) * 100));
    const stateLabel = pct > 90 ? "Overcommitted" : pct >= 75 ? "High Load" : "Nominal";
    return {
      budgetGb,
      weightsGb: Math.round(weightsGb * 10) / 10,
      kvGb,
      usedGb,
      pct,
      barPct: Math.min(100, pct),
      stateLabel,
      circuitState: hb.circuit_state || "CLOSED",
      elasticCtx: hb.elastic_ctx || ctxSize,
    };
  };

  const autoFitHostVramQuantization = async () => {
    const quantLadder = ["FP16", "Q8_0", "Q6_K", "Q5_K_M", "Q4_K_M", "Q3_K_M", "Q2_K"];
    let adjustedCount = 0;
    for (const hk of getAllHostsList()) {
      const hc = (HOST_TREE_UI_STATE.hostConfigs[hk] ||= { quantization: "Q4_K_M", vram_budget_gb: 96 });
      const mods = getHostModels(hk);
      if (!mods.length) continue;
      let stats = computeHostVramStats(hk);
      let safetyLimit = stats.budgetGb * 0.85; // Reserve 15% for KV-cache headroom
      let ladderIdx = Math.max(0, quantLadder.indexOf(hc.quantization || "Q4_K_M"));
      while (stats.usedGb > safetyLimit && ladderIdx < quantLadder.length - 1) {
        ladderIdx++;
        const nextQuant = quantLadder[ladderIdx];
        hc.quantization = nextQuant;
        mods.forEach((m) => {
          m.quantization = nextQuant;
          const base = Number(m.base_vram_gb || m.vram_gb || 14);
          m.vram_gb = Math.max(2, Math.round(base * (QUANT_VRAM_MULTIPLIERS[nextQuant] || 1.0) * 10) / 10);
        });
        adjustedCount++;
        stats = computeHostVramStats(hk);
      }
    }
    await syncHostTreeToGlobalLineupAndUI();
    await persistHostTreeStateToServer();
    pushClientLiveConsole(
      "QUANT_DPO",
      adjustedCount > 0
        ? `VRAM Guardrail stepped down quantization on ${adjustedCount} step(s) to guarantee >=15% KV-cache headroom.`
        : `All Hosts A–D already fit cleanly inside 85% VRAM headroom.`
    );
    status(
      adjustedCount > 0
        ? `⚡ Auto-Fit VRAM adjusted quantization (${adjustedCount} step-down) to keep >=15% KV-cache headroom.`
        : `✅ All Hosts A–D fit comfortably within their GPU VRAM budget.`
    );
    renderCascade();
  };

  const getAllSelectableModels = (hk) => {
    const hCfg = HOST_TREE_UI_STATE.hostConfigs[hk] || { quantization: "Q4_K_M" };
    const seen = new Set();
    const list = [];
    const pushUnique = (item) => {
      if (!item || !item.id) return;
      if (seen.has(item.id)) {
        const ex = list.find((x) => x.id === item.id);
        if (ex && item.category && !ex.categories.includes(item.category)) {
          ex.categories.push(item.category);
        }
        return;
      }
      seen.add(item.id);
      const cats = [item.category || "coding"];
      const lower = `${item.id} ${item.label || ""} ${item.hf || ""}`.toLowerCase();
      if (item.unc || /ablit|uncensored|heretic|unaligned|dolphin|unc\b|rocinante|stheno|magnum|euryale/.test(lower)) {
        if (!cats.includes("abliterated")) cats.push("abliterated");
      }
      if (/cyber|redteam|red-team|pentest|kali|whiterabbit|baron|ravenx|seneca|qwensploit|deephat|foundation-sec|lily|offsec|orca/.test(lower)) {
        if (!cats.includes("cybersecurity")) cats.push("cybersecurity");
      }
      list.push({ ...item, categories: cats });
    };

    Object.entries(HOST_TREE_MODEL_CATALOG).forEach(([catKey, catObj]) => {
      (catObj.models || []).forEach((m) => {
        pushUnique({
          id: m.id,
          hf: m.hf || m.id,
          label: m.label || m.id,
          quant: m.quant || hCfg.quantization || "Q4_K_M",
          vram: m.vram || 16,
          slot: m.slot || catObj.slot || "code",
          category: catKey,
          unc: Boolean(m.unc),
        });
      });
    });

    Object.entries(STATE?.catalog || {}).forEach(([catId, c]) => {
      if (!c) return;
      const id = c.id || catId;
      const nameLower = `${id} ${c.name || ""} ${c.desc || ""} ${c.best || ""}`.toLowerCase();
      let category = "coding";
      let slot = "code";
      if (/cyber|redteam|red-team|pentest|kali|whiterabbit|baron|raven|seneca|qwensploit|deephat|foundation-sec|lily|offsec|orca/.test(nameLower)) {
        category = "cybersecurity";
        slot = "cyber";
      } else if (/vis|ocr|vl\b/.test(nameLower)) {
        category = "vision";
        slot = "ocr";
      } else if (/rp\s|rocinante|stheno|magnum|role/.test(nameLower)) {
        category = "roleplay";
        slot = "role";
      } else if (/math|qwq|r1|reasoning|think/.test(nameLower)) {
        category = "math";
        slot = "math";
      } else if (/med|bio/.test(nameLower)) {
        category = "science";
        slot = "think";
      } else if (c.unc || /ablit|unc/.test(nameLower)) {
        category = "abliterated";
        slot = "unc";
      }
      pushUnique({
        id,
        hf: c.hf || id,
        label: c.name || id,
        quant: hCfg.quantization || "Q4_K_M",
        vram: c.gb || 14,
        slot,
        category,
        unc: Boolean(c.unc),
      });
    });

    const customVaultList = Array.isArray(STATE?.custom_gguf)
      ? STATE.custom_gguf
      : Array.isArray(STATE?.custom_gguf_models)
        ? STATE.custom_gguf_models
        : [];
    customVaultList.forEach((g) => {
      const id = g.id || g.repo || g.repo_id || g.filename || g.name;
      pushUnique({
        id,
        hf: g.repo || g.repo_id || g.filename || id,
        label: `${g.name || g.filename || id} (HF Vault)`,
        quant: g.quantization || hCfg.quantization || "Q4_K_M",
        vram: g.gb || g.vram_gb || 14,
        slot: "code",
        category: "vault",
        unc: true,
      });
    });

    return list;
  };

  const SPECIALIST_WORK_AREA_GROUPS = [
    "💻 Coding, App Building & DevOps",
    "⚔️ Web, API & Injection Security",
    "🌐 Network, Ports, MitM & Proxies",
    "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    "💥 Exploit Testing, Metasploit & Malware Forensics",
    "🎩 System Hardening & Cloud Security",
    "👑 Swarm Brains, Code Mergers & Safety Guards",
    "🤖 Your Custom Specialists",
  ];

  const LEGACY_AGENT_NAME_MIGRATIONS = {
    "🧬 #21 [Cool Bonus #1] Autonomous Reverse-Engineer & Protocol Reconstructor":
      "🧬 #21 Legacy Code & Binary Reverse-Engineering Architect",
    "🚀 #22 [Cool Bonus #2] Zero-Latency Full-Stack, CLI, GUI & EXE App Forge":
      "🚀 #22 Full-Stack Web, CLI, Desktop GUI & EXE Builder",
    "🌌 #23 [Cool Bonus #3] Digital-Twin Chaos & Predictive Fault Simulator":
      "🌐 #23 System Stress-Test, Failover & Chaos Simulator",
  };

  const resolveSpecialistGroupLabel = (ag) => {
    const sp = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === ag.id);
    if (sp?.category) return sp.category;
    const rawCat = String(ag.category || "").toLowerCase();
    if (rawCat.includes("coding") || rawCat.includes("app building") || rawCat.includes("devops")) {
      return "💻 Coding, App Building & DevOps";
    }
    if (rawCat.includes("web, api") || rawCat.includes("injection")) {
      return "⚔️ Web, API & Injection Security";
    }
    if (rawCat.includes("network") || rawCat.includes("mitm") || rawCat.includes("prox")) {
      return "🌐 Network, Ports, MitM & Proxies";
    }
    if (rawCat.includes("osint") || rawCat.includes("dark web") || rawCat.includes("scrap") || rawCat.includes("social")) {
      return "🛰️ OSINT, Dark Web, Scraping & Social Recon";
    }
    if (rawCat.includes("exploit") || rawCat.includes("metasploit") || rawCat.includes("malware")) {
      return "💥 Exploit Testing, Metasploit & Malware Forensics";
    }
    if (rawCat.includes("hardening") || rawCat.includes("red-hat") || rawCat.includes("cloud")) {
      return "🎩 System Hardening & Cloud Security";
    }
    if (rawCat.includes("swarm") || rawCat.includes("guard") || rawCat.includes("merger")) {
      return "👑 Swarm Brains, Code Mergers & Safety Guards";
    }
    return "🤖 Your Custom Specialists";
  };

  const getAllSpecialistAgents = () => {
    // Migrate any saved host binding that still had the old '[Cool Bonus]' string
    Object.values(HOST_TREE_UI_STATE.hostConfigs || {}).forEach((hc) => {
      if (hc?.assigned_agent && LEGACY_AGENT_NAME_MIGRATIONS[hc.assigned_agent]) {
        hc.assigned_agent = LEGACY_AGENT_NAME_MIGRATIONS[hc.assigned_agent];
      }
    });

    const mergedMap = new Map();
    // 1. Seed in exact grouped work-area order from BUILTIN_SWARM_GROUP_SPECIALISTS (all 48 built-in specialists)
    BUILTIN_SWARM_GROUP_SPECIALISTS.forEach((sp) => {
      if (sp && sp.id) {
        mergedMap.set(sp.id, {
          id: sp.id,
          name: sp.name,
          role: sp.role,
          category: sp.category,
          system: sp.sys,
        });
      }
    });

    // 2. Merge server/custom agents while preserving our clean grouped categories & beginner-friendly role summaries
    const serverList = Array.isArray(STATE?.agents) && STATE.agents.length
      ? STATE.agents
      : Array.isArray(AGENTS) && AGENTS.length
        ? AGENTS
        : [];
    serverList.forEach((ag) => {
      if (!ag || !ag.id) return;
      if (mergedMap.has(ag.id)) {
        const cur = mergedMap.get(ag.id);
        mergedMap.set(ag.id, {
          ...ag,
          name: cur.name,
          role: cur.role,
          category: cur.category,
        });
      } else {
        const migratedName = LEGACY_AGENT_NAME_MIGRATIONS[ag.name] || ag.name;
        mergedMap.set(ag.id, {
          ...ag,
          name: migratedName,
          category: resolveSpecialistGroupLabel(ag),
        });
      }
    });

    return Array.from(mergedMap.values());
  };

  const toggleModelOnHost = async (hk, modelObj) => {
    const hKey = String(hk || "a").toLowerCase();
    const hCfg = HOST_TREE_UI_STATE.hostConfigs[hKey] || { quantization: "Q4_K_M" };
    const existingIdx = HOST_TREE_UI_STATE.models.findIndex(
      (m) => String(m.host || "a").toLowerCase() === hKey && m.id === modelObj.id
    );

    if (existingIdx >= 0) {
      const existing = HOST_TREE_UI_STATE.models[existingIdx];
      if (existing.enabled !== false) {
        HOST_TREE_UI_STATE.models.splice(existingIdx, 1);
        pushClientLiveConsole("HOSTS", `Deselected [${modelObj.label || modelObj.id}] from Host ${hKey.toUpperCase()}`);
      } else {
        existing.enabled = true;
        pushClientLiveConsole("HOSTS", `Selected [${modelObj.label || modelObj.id}] on Host ${hKey.toUpperCase()}`);
      }
    } else {
      HOST_TREE_UI_STATE.models.push({
        id: modelObj.id,
        hf: modelObj.hf || modelObj.id,
        label: modelObj.label || modelObj.id.split("/").pop(),
        host: hKey,
        slot: modelObj.slot || "code",
        enabled: true,
        quantization: modelObj.quant || hCfg.quantization || "Q4_K_M",
        base_vram_gb: Number(modelObj.vram || 14),
        vram_gb: Number(modelObj.vram || 14),
        specialist_agent: hCfg.assigned_agent || "",
        temperature: hCfg.temperature ?? 0.7,
        top_p: hCfg.top_p ?? 0.95,
      });
      pushClientLiveConsole("HOSTS", `Selected [${modelObj.label || modelObj.id}] on Host ${hKey.toUpperCase()}`);
    }

    renderCascade();
    await syncHostTreeToGlobalLineupAndUI();
    await persistHostTreeStateToServer();
    if (typeof window.advanceProjectModuleSubtask === "function") {
      window.advanceProjectModuleSubtask("cluster", 1);
    }
  };

  const renderLighthouseTabBody = () => {
    const bodyEl = container.querySelector("#lighthouse-overlay-body");
    if (!bodyEl || !openLighthouseHost) return;

    const hk = openLighthouseHost;
    const hCfg = (HOST_TREE_UI_STATE.hostConfigs[hk] ||= {
      id: hk,
      label: `Host ${hk.toUpperCase()}`,
      url: `http://127.0.0.1:${8080 + Math.max(0, ["a", "b", "c", "d"].indexOf(hk))}/v1`,
      vram_budget_gb: 96,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 4096,
      quantization: "Q4_K_M",
      draft_model: "Qwen/Qwen2.5-Coder-1.5B-Instruct-Q8_0",
      data_tuning_mode: "standard_dpo",
      persona: "Senior Systems Architect",
      assigned_agent: "",
    });
    const hostModels = getHostModels(hk);
    const selectedIds = new Set(hostModels.map((m) => m.id));

    if (activeLighthouseTab === "models") {
      const fullPool = getAllSelectableModels(hk);
      // Build cross-host placement map across ALL hosts so users see where any model is already mounted
      const modelHostMap = {};
      const hostLabelFor = (hid) => {
        const clean = String(hid || "").toLowerCase();
        const cfg = HOST_TREE_UI_STATE.hostConfigs?.[clean];
        return cfg?.label || `Host ${clean.toUpperCase()}`;
      };
      const addPlacement = (mid, hid) => {
        if (!mid || !hid) return;
        const cleanH = String(hid).toLowerCase();
        const arr = (modelHostMap[mid] ||= []);
        if (!arr.some((x) => x.id === cleanH)) {
          arr.push({ id: cleanH, label: hostLabelFor(cleanH) });
        }
      };
      (HOST_TREE_UI_STATE.models || []).forEach((hm) => {
        if (hm && hm.id && hm.enabled !== false) addPlacement(hm.id, hm.host || "a");
      });
      if (STATE?.host_lineups && typeof STATE.host_lineups === "object") {
        Object.entries(STATE.host_lineups).forEach(([hid, slotObj]) => {
          Object.values(slotObj || {}).forEach((ids) => {
            (Array.isArray(ids) ? ids : []).forEach((mid) => addPlacement(mid, hid));
          });
        });
      }

      const allModels = fullPool.filter((m) => {
        if (modelFilterCat !== "all") {
          const cats = Array.isArray(m.categories) ? m.categories : [m.category];
          if (!cats.includes(modelFilterCat)) return false;
        }
        if (modelFilterText && !`${m.label} ${m.id} ${m.hf}`.toLowerCase().includes(modelFilterText.toLowerCase())) return false;
        return true;
      });

      bodyEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.16)">
          <div style="font-size:11.5px;color:#cbd5e1">
            <strong style="color:#2ee6a6">Host ${hk.toUpperCase()} Model Selector</strong>
            <span class="tabular-nums" style="color:#94a3b8;margin-left:6px">${allModels.length} shown · ${selectedIds.size} selected on Host ${hk.toUpperCase()}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <input type="text" id="flyout-model-search" value="${esc(modelFilterText)}" placeholder="Filter Cyber, RedHat, Abliterated, Qwen…" style="height:26px;width:210px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(56,189,248,0.38);color:#f8fafc;font-size:11.5px">
            <select id="flyout-model-cat" style="height:26px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(46,230,166,0.45);color:#2ee6a6;font-size:11px;font-weight:700">
              <option value="all" ${modelFilterCat === "all" ? "selected" : ""}>All Models (${fullPool.length})</option>
              <option value="cybersecurity" ${modelFilterCat === "cybersecurity" ? "selected" : ""}>Cyber, RedHat &amp; OffSec</option>
              <option value="abliterated" ${modelFilterCat === "abliterated" ? "selected" : ""}>Unrestricted &amp; Abliterated</option>
              <option value="coding" ${modelFilterCat === "coding" ? "selected" : ""}>Coding &amp; Systems</option>
              <option value="math" ${modelFilterCat === "math" ? "selected" : ""}>Math &amp; Deep Reasoning</option>
              <option value="roleplay" ${modelFilterCat === "roleplay" ? "selected" : ""}>Roleplay &amp; Uncensored</option>
              <option value="vision" ${modelFilterCat === "vision" ? "selected" : ""}>Vision &amp; OCR</option>
              <option value="science" ${modelFilterCat === "science" ? "selected" : ""}>Science &amp; Medical</option>
              <option value="vault" ${modelFilterCat === "vault" ? "selected" : ""}>HF Vault &amp; Custom</option>
            </select>
          </div>
        </div>
        <div class="host-model-scroll-viewport">
          <div class="host-leaf-items-grid">
            ${allModels
          .map((m, idx) => {
            const isSel = selectedIds.has(m.id);
            const placedHosts = modelHostMap[m.id] || [];
            const otherHosts = placedHosts.filter((h) => h.id !== String(hk).toLowerCase());
            const isCyber = (m.categories || []).includes("cybersecurity");
            const isAblit = (m.categories || []).includes("abliterated");
            const tagTxt = isCyber ? "RedHat/Cyber · " : isAblit ? "Unrestricted · " : "";
            const hostBadgesHtml =
              isSel || otherHosts.length
                ? `<div class="model-host-badges">
                        ${isSel ? `<span class="model-host-pill is-here">✓ On Host ${hk.toUpperCase()}</span>` : ""}
                        ${otherHosts.length ? `<span class="model-host-pill is-other">⚠ Already on ${esc(otherHosts.map((h) => h.label).join(", "))}</span>` : ""}
                        ${placedHosts.length > 1 ? `<span class="model-host-pill is-multi">×${placedHosts.length} copies</span>` : ""}
                      </div>`
                : "";
            return `
                  <button type="button" class="host-leaf-pick-btn ${isSel ? "is-selected" : ""} ${otherHosts.length ? "has-other-host" : ""}" data-flyout-pick-model="${idx}" data-model-lighthouse="${esc(m.id || m.hf || m.label)}">
                    <div class="host-model-card-top">
                      <span class="host-model-card-title">${esc(m.label)}</span>
                      <span class="host-model-card-state" style="color:${isSel ? "#2ee6a6" : "#94a3b8"}">${isSel ? "✓ Selected" : "+ Select"}</span>
                    </div>
                    ${hostBadgesHtml}
                    <div class="host-model-card-meta tabular-nums">${tagTxt}${esc(m.hf || m.id)} · ${esc(m.quant)} · ${m.vram}GB</div>
                  </button>
                `;
          })
          .join("")}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding-top:6px;border-top:1px solid rgba(148,163,184,0.14);margin-top:auto">
          <input type="text" id="flyout-custom-model-input" placeholder="Add custom HF repo or Ollama tag (e.g. WhiteRabbitNeo/WhiteRabbitNeo-33B-v1.5)…" style="flex:1;height:27px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(148,163,184,0.28);color:#f8fafc;font-size:11px;font-family:'JetBrains Mono',monospace">
          <button type="button" id="flyout-custom-model-add-btn" class="primary xs" style="height:27px">＋ Add &amp; Select on Host ${hk.toUpperCase()}</button>
        </div>
      `;

      bodyEl.querySelector("#flyout-model-search")?.addEventListener("input", (e) => {
        modelFilterText = e.target.value;
        renderLighthouseTabBody();
        const inp = bodyEl.querySelector("#flyout-model-search");
        if (inp) {
          inp.focus();
          inp.setSelectionRange(inp.value.length, inp.value.length);
        }
      });

      bodyEl.querySelector("#flyout-model-cat")?.addEventListener("change", (e) => {
        modelFilterCat = e.target.value;
        renderLighthouseTabBody();
      });

      bodyEl.querySelectorAll("[data-flyout-pick-model]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = Number(btn.getAttribute("data-flyout-pick-model"));
          const chosen = allModels[idx];
          if (chosen) toggleModelOnHost(hk, chosen);
        });
      });

      bodyEl.querySelector("#flyout-custom-model-add-btn")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const raw = (bodyEl.querySelector("#flyout-custom-model-input")?.value || "").trim();
        if (!raw) return;
        const cleanId = raw.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
        const label = raw.split("/").pop() || raw;
        const saveRes = await postJSON("/api/custom-gguf", {
          id: cleanId,
          name: label,
          repo: raw,
          gb: 16,
          slot: "code",
          unc: true,
          auto_mount: false,
        }).catch(() => ({}));
        if (saveRes?.custom_gguf && STATE) {
          STATE.custom_gguf = saveRes.custom_gguf;
        }
        await toggleModelOnHost(hk, { id: cleanId, hf: raw, label, quant: hCfg.quantization || "Q4_K_M", vram: 16, slot: "code", unc: true });
        status(`✅ Saved custom model "${label}" into Vault & Host ${hk.toUpperCase()} lineup.`);
      });
    } else if (activeLighthouseTab === "agents") {
      const allAgents = getAllSpecialistAgents();
      const groupCounts = new Map();
      SPECIALIST_WORK_AREA_GROUPS.forEach((g) => groupCounts.set(g, 0));
      allAgents.forEach((ag) => {
        const grp = resolveSpecialistGroupLabel(ag);
        groupCounts.set(grp, (groupCounts.get(grp) || 0) + 1);
      });

      const qLower = agentFilterText.trim().toLowerCase();
      const filteredAgents = allAgents.filter((ag) => {
        const grp = resolveSpecialistGroupLabel(ag);
        if (agentFilterCat !== "all" && grp !== agentFilterCat) return false;
        if (qLower) {
          const intel = SPECIALIST_AGENT_LIGHTHOUSE_INTEL[ag.id];
          const hay = `${ag.name || ""} ${ag.id || ""} ${ag.role || ""} ${grp} ${intel?.what || ""}`.toLowerCase();
          if (!hay.includes(qLower)) return false;
        }
        return true;
      });

      // Group filtered specialists into ordered work-area buckets
      const groupedBuckets = new Map();
      SPECIALIST_WORK_AREA_GROUPS.forEach((g) => groupedBuckets.set(g, []));
      filteredAgents.forEach((ag) => {
        const grp = resolveSpecialistGroupLabel(ag);
        if (!groupedBuckets.has(grp)) groupedBuckets.set(grp, []);
        groupedBuckets.get(grp).push(ag);
      });

      const groupedHtml = Array.from(groupedBuckets.entries())
        .filter(([, items]) => items.length > 0)
        .map(
          ([grpTitle, items]) => `
            <section class="specialist-group-block">
              <div class="specialist-group-header">
                <span class="specialist-group-title">${esc(grpTitle)}</span>
                <span class="specialist-group-count tabular-nums">${items.length} Specialist${items.length === 1 ? "" : "s"}</span>
              </div>
              <div class="specialist-tickets-grid">
                ${items
              .map((ag) => {
                const agName = ag.name || ag.title || ag.id;
                const agKey = ag.id || agName;
                const intel = SPECIALIST_AGENT_LIGHTHOUSE_INTEL[ag.id];
                const plainSummary =
                  ag.role ||
                  intel?.what ||
                  ag.description ||
                  (ag.system ? String(ag.system) : "Autonomous specialist that runs commands and writes code for this area.");
                const isSel = hCfg.assigned_agent === agName;
                return `
                      <button type="button" class="specialist-ticket-card ${isSel ? "is-selected" : ""}" data-flyout-pick-agent="${esc(agName)}" data-agent-lighthouse="${esc(agKey)}">
                        <div class="specialist-ticket-top">
                          <span class="specialist-ticket-title">${esc(agName)}</span>
                          <span class="specialist-ticket-badge">${isSel ? "✓ Bound" : "Bind"}</span>
                        </div>
                        <div class="specialist-ticket-desc">${esc(plainSummary)}</div>
                      </button>
                    `;
              })
              .join("")}
              </div>
            </section>
          `
        )
        .join("");

      const cachedSquads = Array.isArray(window._cachedSpecialistSquads) ? window._cachedSpecialistSquads : [];
      if (!window._loadedSpecialistSquadsOnce) {
        window._loadedSpecialistSquadsOnce = true;
        fetch("/api/specialist-squads")
          .then((r) => r.json())
          .then((d) => {
            if (Array.isArray(d?.squads)) {
              window._cachedSpecialistSquads = d.squads;
              if (openLighthouseHost && activeLighthouseTab === "agents") renderLighthouseTabBody();
            }
          })
          .catch(() => { });
      }

      bodyEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.16)">
          <div style="min-width:0">
            <strong style="font-size:12.5px;color:#c084fc">Bind Specialist to Host ${hk.toUpperCase()}</strong>
            <span class="tabular-nums" style="font-size:11px;color:#94a3b8;margin-left:6px">${filteredAgents.length} shown of ${allAgents.length} grouped specialists · Hover any ticket for plain-English guide</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <button type="button" id="flyout-open-proxy-vault-btn" class="ghost xs" style="border-color:rgba(46,230,166,.45);color:#2ee6a6">🌍 Proxy CSV Vault (#51)</button>
            <input type="text" id="flyout-agent-search" value="${esc(agentFilterText)}" placeholder="Search (e.g. Form, Email, Proxy CSV, Python, Dark Web)…" style="height:27px;width:235px;padding:2px 9px;border-radius:6px;background:#030711;border:1px solid rgba(192,132,252,0.45);color:#f8fafc;font-size:11.5px">
            <select id="flyout-agent-cat" style="height:27px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(46,230,166,0.45);color:#2ee6a6;font-size:11px;font-weight:700">
              <option value="all" ${agentFilterCat === "all" ? "selected" : ""}>All Work Areas (${allAgents.length})</option>
              ${Array.from(groupCounts.entries())
          .filter(([, cnt]) => cnt > 0)
          .map(
            ([gName, cnt]) =>
              `<option value="${esc(gName)}" ${agentFilterCat === gName ? "selected" : ""}>${esc(gName)} (${cnt})</option>`
          )
          .join("")}
            </select>
          </div>
        </div>
        <!-- [TODO #2] One-Click Custom Specialist Squad Presets Bar -->
        <div class="specialist-squad-bar">
          <span style="font-size:10.5px;font-weight:800;color:#2ee6a6">⚡ 1-Click Squads (Auto-Bind Hosts A–D):</span>
          ${cachedSquads
          .map(
            (sq) =>
              `<button type="button" class="specialist-squad-chip" data-load-squad-id="${esc(sq.id)}" title="Bind ${(sq.specialists || []).length} specialists across Hosts A–D">${esc(sq.name)}</button>`
          )
          .join("")}
          <span class="spacer"></span>
          <input type="text" id="flyout-new-squad-name" placeholder="Save Hosts A–D squad name…" style="height:24px;width:170px;padding:1px 7px;border-radius:5px;background:#030711;border:1px solid rgba(148,163,184,0.3);color:#f8fafc;font-size:10.5px">
          <button type="button" id="flyout-save-squad-btn" class="primary xs" style="height:24px;padding:0 8px">💾 Save Squad</button>
        </div>
        <div class="specialist-grouped-sections" style="max-height:305px;overflow-y:auto">
          ${groupedHtml || `<div style="padding:18px;text-align:center;color:#94a3b8;font-size:12px">No specialists matched "${esc(agentFilterText)}". Clear search to view all ${allAgents.length} specialists.</div>`}
        </div>
      `;

      bodyEl.querySelector("#flyout-open-proxy-vault-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof openProxyCsvVaultModal === "function") openProxyCsvVaultModal(true);
      });

      bodyEl.querySelectorAll("[data-load-squad-id]").forEach((sqBtn) => {
        sqBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const sqId = sqBtn.getAttribute("data-load-squad-id");
          const sq = (window._cachedSpecialistSquads || []).find((s) => s.id === sqId);
          if (!sq || !Array.isArray(sq.specialists)) return;
          const hostKeys = ["a", "b", "c", "d"];
          hostKeys.forEach((hLetter, idx) => {
            const specId = sq.specialists[idx % sq.specialists.length];
            const foundAg = allAgents.find((a) => a.id === specId || a.name === specId);
            const resolvedName = foundAg?.name || specId;
            if (!HOST_TREE_UI_STATE.hostConfigs[hLetter]) HOST_TREE_UI_STATE.hostConfigs[hLetter] = { id: hLetter };
            HOST_TREE_UI_STATE.hostConfigs[hLetter].assigned_agent = resolvedName;
            getHostModels(hLetter).forEach((m) => {
              m.specialist_agent = resolvedName;
            });
          });
          renderCascade();
          await syncHostTreeToGlobalLineupAndUI();
          await persistHostTreeStateToServer();
          status(`⚡ Loaded Specialist Squad "${sq.name}" across Hosts A, B, C & D!`);
        });
      });

      bodyEl.querySelector("#flyout-save-squad-btn")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const nameVal = (bodyEl.querySelector("#flyout-new-squad-name")?.value || "").trim();
        const boundSpecs = ["a", "b", "c", "d"]
          .map((l) => HOST_TREE_UI_STATE.hostConfigs?.[l]?.assigned_agent || "")
          .filter(Boolean);
        if (!nameVal) {
          status("⚠️ Enter a name for your Custom Specialist Squad first!");
          bodyEl.querySelector("#flyout-new-squad-name")?.focus();
          return;
        }
        if (!boundSpecs.length) {
          status("⚠️ Bind at least 1 specialist to Host A–D before saving a squad!");
          return;
        }
        const saved = await postJSON("/api/specialist-squads", { name: nameVal, specialists: boundSpecs });
        if (saved?.ok && Array.isArray(saved.squads)) {
          window._cachedSpecialistSquads = saved.squads;
          renderLighthouseTabBody();
          status(`💾 Saved Custom Specialist Squad "${nameVal}" (${boundSpecs.length} host bindings)!`);
        }
      });

      bodyEl.querySelector("#flyout-agent-search")?.addEventListener("input", (e) => {
        agentFilterText = e.target.value;
        renderLighthouseTabBody();
        const inp = bodyEl.querySelector("#flyout-agent-search");
        if (inp) {
          inp.focus();
          inp.setSelectionRange(inp.value.length, inp.value.length);
        }
      });

      bodyEl.querySelector("#flyout-agent-cat")?.addEventListener("change", (e) => {
        agentFilterCat = e.target.value;
        renderLighthouseTabBody();
      });

      bodyEl.querySelectorAll("[data-flyout-pick-agent]").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const agName = btn.getAttribute("data-flyout-pick-agent");
          hCfg.assigned_agent = hCfg.assigned_agent === agName ? "" : agName;
          getHostModels(hk).forEach((m) => {
            m.specialist_agent = hCfg.assigned_agent;
          });
          pushClientLiveConsole("AGENTS", `Host ${hk.toUpperCase()} Specialist Agent set to [${hCfg.assigned_agent || "None"}]`);
          renderCascade();
          await syncHostTreeToGlobalLineupAndUI();
          await persistHostTreeStateToServer();
        });
      });
    } else if (activeLighthouseTab === "customize") {
      bodyEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;padding-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.16)">
          <strong style="font-size:12px;color:#38bdf8">Host ${hk.toUpperCase()} Sampling, Quantization &amp; Speculative Draft</strong>
          <button type="button" id="flyout-save-cust-btn" class="primary xs">Save Host ${hk.toUpperCase()}</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px">
          <label style="font-size:11px;color:#94a3b8">Temperature: <b id="flyout-temp-lbl" class="tabular-nums" style="color:#2ee6a6">${hCfg.temperature ?? 0.7}</b>
            <input type="range" id="flyout-cust-temp" min="0" max="2" step="0.05" value="${hCfg.temperature ?? 0.7}" style="width:100%">
          </label>
          <label style="font-size:11px;color:#94a3b8">Top-P: <b id="flyout-topp-lbl" class="tabular-nums" style="color:#38bdf8">${hCfg.top_p ?? 0.95}</b>
            <input type="range" id="flyout-cust-topp" min="0.05" max="1" step="0.05" value="${hCfg.top_p ?? 0.95}" style="width:100%">
          </label>
          <label style="font-size:11px;color:#94a3b8">Quantization
            <select id="flyout-cust-quant" style="width:100%;height:27px;margin-top:3px;border-radius:6px;background:#030711;border:1px solid rgba(168,85,247,0.45);color:#f3e8ff;font-size:11px">
              ${["Q2_K", "Q3_K_M", "Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0", "FP16"].map((q) => `<option value="${q}" ${hCfg.quantization === q ? "selected" : ""}>${q}</option>`).join("")}
            </select>
          </label>
          <label style="font-size:11px;color:#94a3b8">VRAM Budget (GB)
            <input type="number" id="flyout-cust-vram-budget" class="tabular-nums" value="${hCfg.vram_budget_gb || 96}" min="8" max="512" step="8" style="width:100%;height:27px;margin-top:3px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(56,189,248,0.4);color:#f8fafc;font-size:11px">
          </label>
          <label style="font-size:11px;color:#94a3b8">Data Tuning Mode
            <select id="flyout-cust-dt" style="width:100%;height:27px;margin-top:3px;border-radius:6px;background:#030711;border:1px solid rgba(46,230,166,0.4);color:#a7f3d0;font-size:11px">
              ${[
          ["standard_dpo", "Online DPO Alignment"],
          ["reasoning_cot", "Chain-of-Thought Verifier"],
          ["code_verification", "Compiler-Verified Code"],
          ["security_redteam", "Red-Team SecOps"],
          ["uncensored_raw", "Zero-Refusal Raw"],
        ]
          .map(([k, lbl]) => `<option value="${k}" ${hCfg.data_tuning_mode === k ? "selected" : ""}>${lbl}</option>`)
          .join("")}
            </select>
          </label>
          <label style="font-size:11px;color:#94a3b8">Speculative Draft Pair
            <select id="flyout-cust-draft" style="width:100%;height:27px;margin-top:3px;border-radius:6px;background:#030711;border:1px solid rgba(56,189,248,0.4);color:#bae6fd;font-size:11px">
              ${SPECULATIVE_DRAFT_MODELS.map((dm) => `<option value="${esc(dm.id)}" ${(hCfg.draft_model || "") === dm.id ? "selected" : ""}>${esc(dm.label)}</option>`).join("")}
            </select>
          </label>
          <label style="font-size:11px;color:#94a3b8">Host Persona
            <input type="text" id="flyout-cust-persona" value="${esc(hCfg.persona || "")}" style="width:100%;height:27px;margin-top:3px;padding:2px 8px;border-radius:6px;background:#030711;border:1px solid rgba(148,163,184,0.3);color:#f8fafc;font-size:11px">
          </label>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          <button type="button" id="flyout-compile-quant-btn" class="ghost xs" style="border-color:rgba(168,85,247,0.5);color:#e9d5ff">Compile ${esc(hCfg.quantization)} Modelfile</button>
          <button type="button" id="flyout-compile-dpo-btn" class="ghost xs" style="border-color:rgba(46,230,166,0.5);color:#6ee7b7">Compile DPO Dataset (.jsonl)</button>
          <span id="flyout-cust-status" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#38bdf8;align-self:center"></span>
        </div>
      `;

      bodyEl.querySelector("#flyout-cust-temp")?.addEventListener("input", (e) => {
        hCfg.temperature = Number(e.target.value);
        const lbl = bodyEl.querySelector("#flyout-temp-lbl");
        if (lbl) lbl.textContent = hCfg.temperature;
      });
      bodyEl.querySelector("#flyout-cust-topp")?.addEventListener("input", (e) => {
        hCfg.top_p = Number(e.target.value);
        const lbl = bodyEl.querySelector("#flyout-topp-lbl");
        if (lbl) lbl.textContent = hCfg.top_p;
      });
      bodyEl.querySelector("#flyout-cust-vram-budget")?.addEventListener("change", async (e) => {
        hCfg.vram_budget_gb = Math.max(8, Number(e.target.value) || 96);
        await persistHostTreeStateToServer();
        renderCascade();
      });
      bodyEl.querySelector("#flyout-cust-quant")?.addEventListener("change", async (e) => {
        hCfg.quantization = e.target.value;
        getHostModels(hk).forEach((m) => {
          m.quantization = hCfg.quantization;
        });
        pushClientLiveConsole("QUANT_DPO", `Updated Host ${hk.toUpperCase()} quantization to ${hCfg.quantization}`);
        renderCascade();
        await syncHostTreeToGlobalLineupAndUI();
        await persistHostTreeStateToServer();
      });
      bodyEl.querySelector("#flyout-cust-dt")?.addEventListener("change", async (e) => {
        hCfg.data_tuning_mode = e.target.value;
        await persistHostTreeStateToServer();
      });
      bodyEl.querySelector("#flyout-cust-draft")?.addEventListener("change", async (e) => {
        hCfg.draft_model = e.target.value;
        await persistHostTreeStateToServer();
      });
      bodyEl.querySelector("#flyout-save-cust-btn")?.addEventListener("click", async () => {
        hCfg.persona = bodyEl.querySelector("#flyout-cust-persona")?.value || "";
        await postJSON(
          `/api/host-customizations/${encodeURIComponent(hk)}`,
          { persona: hCfg.persona, temperature: hCfg.temperature, top_p: hCfg.top_p },
          "PUT"
        ).catch(() => ({}));
        await persistHostTreeStateToServer();
        const st = bodyEl.querySelector("#flyout-cust-status");
        if (st) st.textContent = `✓ Saved Host ${hk.toUpperCase()}`;
        pushClientLiveConsole("HOSTS", `Saved customization for Host ${hk.toUpperCase()} (Temp=${hCfg.temperature}, Quant=${hCfg.quantization})`);
      });
      bodyEl.querySelector("#flyout-compile-quant-btn")?.addEventListener("click", async () => {
        const st = bodyEl.querySelector("#flyout-cust-status");
        if (st) st.textContent = "Compiling Modelfile…";
        const firstMod = getHostModels(hk)[0]?.id || "Qwen/Qwen2.5-Coder-32B-Instruct";
        const res = await postJSON("/api/quantization/apply", {
          host: hk,
          model_id: firstMod,
          quant: hCfg.quantization,
          base_vram_gb: 32,
        }).catch(() => ({}));
        if (res?.ok && st) st.textContent = `✓ Wrote ${res.modelfile_path}`;
      });
      bodyEl.querySelector("#flyout-compile-dpo-btn")?.addEventListener("click", async () => {
        const st = bodyEl.querySelector("#flyout-cust-status");
        if (st) st.textContent = "Compiling DPO .jsonl…";
        const firstMod = getHostModels(hk)[0]?.id || "Qwen/Qwen2.5-Coder-32B-Instruct";
        const res = await postJSON("/api/data-tuning/compile", {
          host: hk,
          mode: hCfg.data_tuning_mode,
          quantization: hCfg.quantization,
          base_model: firstMod,
        }).catch(() => ({}));
        if (res?.ok && st) st.textContent = `✓ Compiled ${res.records_compiled} pairs`;
      });
    }
  };

  const renderCascade = () => {
    const allHosts = getAllHostsList();
    const totalActiveModels = (HOST_TREE_UI_STATE.models || []).filter((m) => m.enabled !== false).length;
    const savedPresets = Array.isArray(HOST_TREE_UI_STATE.savedTreePresets) ? HOST_TREE_UI_STATE.savedTreePresets : [];
    const hfBucketsList = Array.isArray(STATE?.hf_buckets) ? STATE.hf_buckets : [];
    const lockedGgufList = Array.isArray(STATE?.custom_gguf)
      ? STATE.custom_gguf
      : Array.isArray(STATE?.custom_gguf_models)
        ? STATE.custom_gguf_models
        : [];
    const hfAutoSyncEnabled = STATE?.hf_auto_sync_on_startup !== false;
    const hbMap = window._lastHostHeartbeatMap || {};

    container.innerHTML = `
      <div class="lighthouse-workbench-stage">
        <!-- ══ TOP FULL-WIDTH HORIZONTAL ACTION & CUSTOM LINEUP SAVE BAR (Always visible up top — zero scrolling!) ══ -->
        <div class="lighthouse-top-save-strip">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <strong class="tabular-nums" style="font-size:12.5px;color:#f8fafc">Active Council Lineup (${totalActiveModels} models across ${allHosts.length} hosts)</strong>
            <button type="button" id="tree-save-active-lineup-btn" class="primary xs" style="height:26px;padding:0 11px;font-weight:700">Save Current Lineup</button>
            <button type="button" id="tree-autofit-vram-btn" class="ghost xs" style="height:26px;border-color:rgba(56,189,248,0.45);color:#7dd3fc" title="Step down quantization on any host above 85% VRAM">Auto-Fit Quant</button>
            <button type="button" id="tree-rebalance-ffd-btn" class="ghost xs" style="height:26px;border-color:rgba(46,230,166,0.5);color:#2ee6a6;font-weight:700" title="Run First-Fit Decreasing (FFD) 4-Host GPU Load-Balancer & Deduplicator">⚖️ FFD Rebalance A–D</button>
            <button type="button" id="tree-fill-all-vram-btn" class="primary xs" style="height:26px;font-weight:700" title="Pack all hosts with diverse unique models up to safe 85% VRAM cap">⚡ Fill All Hosts (85%)</button>
            <span id="tree-save-feedback-lbl" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#2ee6a6"></span>
          </div>

          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <input type="text" id="tree-custom-preset-name" class="input slim" placeholder="Name custom lineup (e.g. Nmap + SQLi Recon)…" style="width:215px;margin:0;height:26px;font-size:11px;background:#030711">
            <button type="button" id="tree-save-custom-preset-btn" class="primary xs" style="height:26px;padding:0 10px">＋ Save Custom Lineup</button>
            <button type="button" id="cascade-open-vault-btn" class="ghost xs" style="height:26px;border-color:rgba(245,158,11,0.45);color:#fbbf24;font-weight:700">HF Buckets Vault</button>
            <button type="button" id="cascade-add-host-btn" class="ghost xs" style="height:26px">＋ Add Host</button>
          </div>
        </div>
        ${(() => {
        const overHosts = allHosts.filter((hid) => computeHostVramStats(hid).pct > 85);
        if (!overHosts.length) return "";
        return `<div style="margin:0 0 8px 0;padding:6px 11px;border-radius:6px;background:rgba(244,63,94,0.14);border:1px solid rgba(251,113,133,0.45);display:flex;align-items:center;justify-content:space-between;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#fecdd3">
            <span>⚠️ VRAM Guardrail Alert: ${overHosts.map((h) => `Host ${h.toUpperCase()} (${computeHostVramStats(h).pct}%)`).join(", ")} exceeds the 85% KV-cache safety ceiling.</span>
            <span style="color:#fde68a">Click [⚖️ FFD Rebalance A–D] or [Auto-Fit Quant] above to pack cleanly.</span>
          </div>`;
      })()}

        <!-- ══ COMPACT HORIZONTAL SAVED CUSTOM LINEUPS & QUICK PRESETS RIBBON ══ -->
        <div class="lighthouse-presets-ribbon">
          <span style="font-size:10.5px;font-weight:700;color:#94a3b8;margin-right:2px">Saved Lineups:</span>
          ${savedPresets.length === 0
        ? `<span style="font-size:10.5px;color:#64748b">None yet — pick models/specialists below and click ＋ Save Custom Lineup above.</span>`
        : savedPresets
          .map(
            (p, pIdx) => `
                  <div style="display:inline-flex;align-items:center;gap:4px;background:rgba(46,230,166,0.12);border:1px solid rgba(46,230,166,0.4);border-radius:6px;padding:2px 7px">
                    <button type="button" data-load-custom-tree-preset="${pIdx}" style="background:none;border:none;color:#2ee6a6;font-size:10.5px;font-weight:700;cursor:pointer;padding:0">▶ ${esc(p.name)} (${(p.models || []).length})</button>
                    <button type="button" data-del-custom-tree-preset="${pIdx}" style="background:none;border:none;color:#f87171;font-size:10px;cursor:pointer;padding:0 2px">✕</button>
                  </div>
                `
          )
          .join("")
      }
          <span style="margin-left:auto;display:inline-flex;align-items:center;gap:5px;flex-wrap:wrap">
            <span style="font-size:10px;color:#64748b">Quick Load:</span>
            <button type="button" class="ghost xs" data-quick-lighthouse-preset="cybersecurity" style="height:22px;padding:0 8px;border-color:rgba(248,113,113,0.4);color:#fca5a5">RedHat &amp; Cyber</button>
            <button type="button" class="ghost xs" data-quick-lighthouse-preset="abliterated" style="height:22px;padding:0 8px;border-color:rgba(46,230,166,0.4);color:#6ee7b7">All Abliterated</button>
            <button type="button" class="ghost xs" data-quick-lighthouse-preset="coding" style="height:22px;padding:0 8px">Coding</button>
            <button type="button" class="ghost xs" data-quick-lighthouse-preset="math" style="height:22px;padding:0 8px">Math</button>
          </span>
        </div>

        <!-- ══ FULL-WIDTH SIDE-BY-SIDE STAGE CANVAS (Hosts A | B | C | D Sit Across From Each Other Horizontally!) ══ -->
        <div class="lighthouse-stage-canvas">
          <div class="lighthouse-sidebyside-lineup-grid">
            ${allHosts
        .map((hId, idx) => {
          const hc = HOST_TREE_UI_STATE.hostConfigs[hId] || { label: `Host ${hId.toUpperCase()}`, quantization: "Q4_K_M", url: `http://127.0.0.1:${8080 + idx}/v1` };
          const modelsOnHost = getHostModels(hId);
          const vram = computeHostVramStats(hId);
          const hb = hbMap[hId] || {};
          const portMatch = String(hc.url || "").match(/:(\d+)/);
          const portStr = portMatch ? `:${portMatch[1]}` : `:808${idx}`;
          const statusTxt =
            vram.circuitState === "OPEN"
              ? "⚡ CB:OPEN (Fast-Bypass)"
              : hb.online
                ? `Online · ${hb.latency_ms || 12}ms`
                : hb.configured
                  ? "Tunnel Saved"
                  : `Port ${portStr}`;
          const pColor = vram.pct > 90 ? "#fb7185" : vram.pct >= 75 ? "#fbbf24" : "#2ee6a6";
          return `
                  <div class="lighthouse-beacon-node ${openLighthouseHost === hId ? "is-open" : ""}">
                    <!-- Host Column Header -->
                    <div data-open-lighthouse="${hId}" tabindex="0" role="button" aria-label="Configure Host ${hId.toUpperCase()}" style="display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer">
                      <span style="display:inline-flex;align-items:center;gap:7px;font-weight:700;font-size:13px;color:#f8fafc">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:23px;height:23px;border-radius:6px;background:rgba(56,189,248,0.18);border:1px solid rgba(56,189,248,0.48);color:#38bdf8;font-family:'JetBrains Mono',monospace;font-size:11.5px">${hId.toUpperCase()}</span>
                        Host ${hId.toUpperCase()}
                        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;padding:1px 5px;border-radius:4px;background:rgba(15,23,42,0.9);border:1px solid ${pColor};color:${pColor}">${esc(vram.stateLabel)}</span>
                      </span>
                      <span style="display:inline-flex;align-items:center;gap:4px">
                        <button type="button" class="ghost xs" data-fill-host-vram="${hId}" style="height:21px;padding:0 6px;font-size:9.5px;color:#fbbf24;border-color:rgba(251,191,36,0.4)" title="Fill Host ${hId.toUpperCase()} up to safe 85% VRAM working cap">⚡ Fill 85%</button>
                        <span style="font-size:10.5px;font-weight:700;color:#2ee6a6">Configure ↗</span>
                      </span>
                    </div>

                    <!-- Live Latency, Quantization, KV-Cache & VRAM Headroom -->
                    <div class="tabular-nums" style="font-size:10.5px;color:#94a3b8;display:flex;justify-content:space-between;gap:6px">
                      <span>${esc(statusTxt)} · ${esc(hc.quantization || "Q4_K_M")}</span>
                      <span style="color:${pColor};font-weight:700">${vram.usedGb}/${vram.budgetGb}GB (${vram.pct}%)</span>
                    </div>
                    <div class="tabular-nums" style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#64748b;display:flex;justify-content:space-between">
                      <span>Weights: ${vram.weightsGb}GB + KV: ${vram.kvGb}GB</span>
                      <span>${modelsOnHost.length} model(s) · Elastic ${Math.round(vram.elasticCtx / 1024)}K</span>
                    </div>
                    <div class="lighthouse-vram-bar-track">
                      <div class="lighthouse-vram-bar-fill ${vram.pct > 85 ? "is-over" : ""}" style="width:${vram.barPct}%"></div>
                    </div>

                    <!-- Bound Specialist Agent Slot (Hover shows semi-opaque Specialist Lighthouse!) -->
                    <div class="lighthouse-agent-slot-bar">
                      ${hc.assigned_agent
              ? `
                            <span data-agent-lighthouse="${esc(hc.assigned_agent)}" data-open-lh-agents="${hId}" style="color:#e9d5ff;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;flex:1">${esc(hc.assigned_agent)}</span>
                            <button type="button" data-unbind-host-agent="${hId}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:10px;padding:0 2px;line-height:1" title="Unbind Specialist Agent">✕</button>
                          `
              : `
                            <button type="button" data-open-lh-agents="${hId}" style="background:none;border:none;color:#c084fc;font-size:10.5px;font-weight:600;cursor:pointer;padding:0;text-align:left;width:100%">＋ Bind Specialist Agent…</button>
                          `
            }
                    </div>

                    <!-- Active Selected Models on This Host (Side-by-Side Column Chips) -->
                    <div class="lighthouse-host-models-wrap">
                      ${modelsOnHost.length === 0
              ? `<button type="button" class="ghost xs" data-open-lighthouse="${hId}" style="width:100%;justify-content:center;border-style:dashed;color:#94a3b8">＋ Pick Models for Host ${hId.toUpperCase()}</button>`
              : modelsOnHost
                .map(
                  (m) => `
                              <span class="host-square-model-chip" data-model-lighthouse="${esc(m.id || m.hf || m.label)}">
                                <span style="overflow:hidden;text-overflow:ellipsis;max-width:165px;white-space:nowrap">${esc(m.label || m.id)}</span>
                                <button type="button" data-sq-remove-model="${esc(m.id)}" data-sq-host="${hId}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:10px;padding:0 2px;line-height:1">✕</button>
                              </span>
                            `
                )
                .join("") +
              `<button type="button" class="ghost xs" data-open-lighthouse="${hId}" style="height:21px;padding:0 6px;font-size:9.5px;color:#38bdf8">＋ Model</button>`
            }
                    </div>
                  </div>
                `;
        })
        .join("")}
          </div>

          <!-- ══ SEMI-OPAQUE GLASS HOST LIGHTHOUSE OVERLAY (Opens ONLY when a Host Beacon is clicked!) ══ -->
          <div id="host-glass-lighthouse-overlay" class="host-glass-lighthouse-overlay ${openLighthouseHost ? "" : "hidden"}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.18)">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <strong style="font-size:13.5px;color:#f8fafc">Host ${(openLighthouseHost || "a").toUpperCase()} Lighthouse</strong>
                <div style="display:inline-flex;gap:4px">
                  ${allHosts
        .map(
          (hid) =>
            `<button type="button" class="ghost xs" data-switch-lh-host="${hid}" style="height:23px;padding:0 8px;${openLighthouseHost === hid ? "border-color:#2ee6a6;color:#2ee6a6;background:rgba(46,230,166,0.15);font-weight:800" : ""
            }">Host ${hid.toUpperCase()}</button>`
        )
        .join("")}
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <div class="lighthouse-overlay-tabs" role="tablist">
                  <button type="button" class="lighthouse-overlay-tab ${activeLighthouseTab === "models" ? "active" : ""}" data-lh-tab="models">Models (${getHostModels(openLighthouseHost || "a").length})</button>
                  <button type="button" class="lighthouse-overlay-tab ${activeLighthouseTab === "agents" ? "active" : ""}" data-lh-tab="agents">Specialist Agents (${getAllSpecialistAgents().length})</button>
                  <button type="button" class="lighthouse-overlay-tab ${activeLighthouseTab === "customize" ? "active" : ""}" data-lh-tab="customize">Customize &amp; VRAM</button>
                </div>
                <button type="button" id="lighthouse-overlay-save-done-btn" class="primary xs" style="height:25px">Save &amp; Done</button>
                <button type="button" id="lighthouse-overlay-close-btn" class="ghost xs" style="border-color:rgba(248,113,113,0.45);color:#fca5a5">✕ Close</button>
              </div>
            </div>

            <div id="lighthouse-overlay-body" class="lighthouse-overlay-body"></div>
          </div>

          <!-- ══ PURE HUGGING FACE BUCKETS & 4-LAYER PERSISTENT VAULT OVERLAY (Strictly hidden until clicked; ZERO Host A/B/C/D model cards!) ══ -->
          <div id="hf-vault-tree-overlay" class="hf-vault-tree-overlay ${vaultOverlayOpen ? "" : "hidden"}" style="${vaultOverlayOpen ? "" : "display:none !important;"}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.18)">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <strong style="font-size:13px;color:#f8fafc">Hugging Face Buckets &amp; 4-Layer Weight Vault</strong>
                <span class="tabular-nums" style="font-size:11px;color:#94a3b8">${hfBucketsList.length} Linked Bucket(s) · ${lockedGgufList.length} Vault GGUF Weight(s)</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <label style="font-size:11px;color:#cbd5e1;display:inline-flex;align-items:center;gap:5px;cursor:pointer">
                  <input type="checkbox" id="hf-overlay-autosync-cb" ${hfAutoSyncEnabled ? "checked" : ""}> Auto-Sync on Startup
                </label>
                <button type="button" id="hf-overlay-sync-all-btn" class="ghost xs">↻ Sync All Buckets</button>
                <button type="button" id="hf-overlay-open-full-bucket-btn" class="ghost xs">Full Bucket Dashboard</button>
                <button type="button" id="hf-vault-overlay-close-btn" class="ghost xs" style="border-color:rgba(248,113,113,0.45);color:#fca5a5">✕ Close</button>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1.8fr 1fr 1fr auto auto;gap:6px;align-items:center">
              <input type="text" id="hf-overlay-bucket-input" class="input slim" style="margin:0;height:28px;font-size:11.5px;background:#050b16" placeholder="hf://buckets/owner/bucket or owner/repo-GGUF…">
              <input type="text" id="hf-overlay-bucket-label" class="input slim" style="margin:0;height:28px;font-size:11.5px;background:#050b16" placeholder="Bucket label (optional)">
              <input type="password" id="hf-overlay-bucket-token" class="input slim" style="margin:0;height:28px;font-size:11.5px;background:#050b16" placeholder="hf_... token (optional)">
              <button type="button" id="hf-overlay-link-scan-btn" class="ghost xs" style="height:28px;padding:0 10px">Link &amp; Scan</button>
              <button type="button" id="hf-overlay-link-import-btn" class="primary xs" style="height:28px;padding:0 12px">Link + Import</button>
            </div>

            <div id="hf-overlay-status-msg" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#38bdf8;min-height:14px"></div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;flex:1;min-height:0;overflow-y:auto">
              <div style="display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:8px;background:rgba(8,14,28,0.85);border:1px solid rgba(148,163,184,0.16)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <strong style="font-size:11.5px;color:#38bdf8">Linked Hugging Face Buckets</strong>
                  <span class="tabular-nums" style="font-size:10.5px;color:#64748b">${hfBucketsList.length} total</span>
                </div>
                ${hfBucketsList.length === 0
        ? `<div style="font-size:11px;color:#64748b;padding:10px 0">No Hugging Face Buckets linked yet. Paste a bucket URI (<code>hf://buckets/owner/bucket</code>) or HF org/repo above and click <strong>Link &amp; Scan</strong>.</div>`
        : hfBucketsList
          .map((b) => {
            const bModels = Array.isArray(b.models) ? b.models : [];
            return `
                        <div style="padding:7px 9px;border-radius:6px;background:#050a14;border:1px solid rgba(148,163,184,0.14);display:flex;flex-direction:column;gap:5px">
                          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
                            <strong style="font-size:11.5px;color:#f8fafc">${esc(b.name || b.bucket_uri)}</strong>
                            <span class="tabular-nums" style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">${bModels.length} weight(s)</span>
                          </div>
                          <div style="font-size:10px;color:#64748b;font-family:'JetBrains Mono',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.bucket_uri || "")}</div>
                          <div style="display:flex;gap:5px;flex-wrap:wrap">
                            <button type="button" class="primary xs" data-hfo-import-bucket="${esc(b.id)}" ${!bModels.length ? "disabled" : ""}>Import All (${bModels.length})</button>
                            <button type="button" class="ghost xs" data-hfo-rescan-uri="${esc(b.bucket_uri || "")}" data-hfo-rescan-name="${esc(b.name || "")}">Rescan</button>
                            <button type="button" class="ghost xs" data-hfo-unlink-bucket="${esc(b.id)}" style="color:#fca5a5">Unlink</button>
                          </div>
                        </div>
                      `;
          })
          .join("")
      }
              </div>

              <div style="display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:8px;background:rgba(8,14,28,0.85);border:1px solid rgba(148,163,184,0.16)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <strong style="font-size:11.5px;color:#2ee6a6">Locked Vault GGUF Weights</strong>
                  <span class="tabular-nums" style="font-size:10.5px;color:#64748b">${lockedGgufList.length} locked</span>
                </div>
                ${lockedGgufList.length === 0
        ? `<div style="font-size:11px;color:#64748b;padding:10px 0">No custom GGUF weights locked in the vault yet. Import weights from a linked HF Bucket on the left, and they become available inside any Host Lighthouse automatically.</div>`
        : lockedGgufList
          .map((g) => {
            const gid = g.id || g.repo || g.repo_id || g.name;
            return `
                        <div style="padding:6px 9px;border-radius:6px;background:#050a14;border:1px solid rgba(148,163,184,0.14);display:flex;justify-content:space-between;align-items:center;gap:8px">
                          <div style="min-width:0;flex:1">
                            <div style="font-size:11px;font-weight:600;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.name || gid)}</div>
                            <div class="tabular-nums" style="font-size:9.5px;color:#64748b;font-family:'JetBrains Mono',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.repo || g.repo_id || gid)} · ~${g.gb || g.vram_gb || 8}GB</div>
                          </div>
                          <button type="button" class="ghost xs" data-hfo-del-gguf="${esc(gid)}" style="color:#fca5a5" title="Remove weight from Vault">Remove</button>
                        </div>
                      `;
          })
          .join("")
      }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (openLighthouseHost) {
      renderLighthouseTabBody();
    }

    // Open Host Lighthouse on Models tab
    container.querySelectorAll("[data-open-lighthouse]").forEach((node) => {
      node.addEventListener("click", (e) => {
        if (e.target.closest("[data-sq-remove-model], [data-fill-host-vram]")) return;
        const hId = node.getAttribute("data-open-lighthouse");
        if (!hId) return;
        vaultOverlayOpen = false;
        openLighthouseHost = hId;
        activeLighthouseTab = "models";
        HOST_TREE_UI_STATE.selectedHost = hId;
        renderCascade();
      });
      node.addEventListener("keydown", (e) => {
        if (e.target.closest("[data-fill-host-vram]")) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const hId = node.getAttribute("data-open-lighthouse");
          if (!hId) return;
          openLighthouseHost = hId;
          activeLighthouseTab = "models";
          HOST_TREE_UI_STATE.selectedHost = hId;
          renderCascade();
        }
      });
    });

    // Quick-open directly to Specialist Agents tab for a specific Host
    container.querySelectorAll("[data-open-lh-agents]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const hId = btn.getAttribute("data-open-lh-agents") || "a";
        vaultOverlayOpen = false;
        openLighthouseHost = hId;
        activeLighthouseTab = "agents";
        HOST_TREE_UI_STATE.selectedHost = hId;
        renderCascade();
      });
    });

    // Quick-unbind Specialist Agent directly from the side-by-side Host column
    container.querySelectorAll("[data-unbind-host-agent]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const hId = btn.getAttribute("data-unbind-host-agent") || "a";
        if (HOST_TREE_UI_STATE.hostConfigs[hId]) {
          HOST_TREE_UI_STATE.hostConfigs[hId].assigned_agent = "";
        }
        getHostModels(hId).forEach((m) => {
          m.specialist_agent = "";
        });
        renderCascade();
        await syncHostTreeToGlobalLineupAndUI();
        await persistHostTreeStateToServer();
      });
    });

    container.querySelectorAll("[data-switch-lh-host]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLighthouseHost = btn.getAttribute("data-switch-lh-host") || "a";
        HOST_TREE_UI_STATE.selectedHost = openLighthouseHost;
        renderCascade();
      });
    });

    container.querySelectorAll("[data-lh-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        activeLighthouseTab = tabBtn.getAttribute("data-lh-tab") || "models";
        renderCascade();
      });
    });

    container.querySelector("#lighthouse-overlay-close-btn")?.addEventListener("click", () => {
      openLighthouseHost = null;
      renderCascade();
    });

    container.querySelector("#lighthouse-overlay-save-done-btn")?.addEventListener("click", async () => {
      await syncHostTreeToGlobalLineupAndUI();
      await persistHostTreeStateToServer();
      openLighthouseHost = null;
      renderCascade();
      const fb = container.querySelector("#tree-save-feedback-lbl");
      if (fb) fb.textContent = "✓ Lineup & Models Saved";
      status("✅ Active Council Lineup, newly picked models & Specialist Agents saved.");
    });

    // Explicit Save Current Lineup button on the persistent top bar
    container.querySelector("#tree-save-active-lineup-btn")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      await syncHostTreeToGlobalLineupAndUI();
      await persistHostTreeStateToServer();
      btn.disabled = false;
      const fb = container.querySelector("#tree-save-feedback-lbl");
      if (fb) fb.textContent = `✓ Saved (${totalActiveModels} models)`;
      status(`✅ Saved Active Council Lineup (${totalActiveModels} models across Hosts A–D).`);
    });

    container.querySelector("#tree-autofit-vram-btn")?.addEventListener("click", autoFitHostVramQuantization);

    const syncSnapshotIntoHostTree = async (snapAfter) => {
      await reloadState().catch(() => { });
      if (snapAfter?.hosts_map) {
        const nextModels = [];
        for (const [hid, hTel] of Object.entries(snapAfter.hosts_map)) {
          for (const am of hTel.assigned_models || []) {
            const existing = (HOST_TREE_UI_STATE.models || []).find((x) => x.id === am.id && x.host === hid)
              || (HOST_TREE_UI_STATE.models || []).find((x) => x.id === am.id);
            nextModels.push({
              ...(existing || {}),
              id: am.id,
              hf: existing?.hf || STATE?.catalog?.[am.id]?.hf || am.id,
              label: am.name || existing?.label || existing?.name || am.id,
              name: am.name || existing?.name || am.id,
              slot: am.slot || existing?.slot || "code",
              category: am.slot || existing?.category || "code",
              host: hid,
              quantization: existing?.quantization || hTel.quantization || "Q4_K_M",
              vram_gb: am.gb,
              base_vram_gb: existing?.base_vram_gb || Number(STATE?.catalog?.[am.id]?.gb) || am.gb,
              enabled: true,
            });
          }
        }
        HOST_TREE_UI_STATE.models = nextModels;
        await persistHostTreeStateToServer();
      } else {
        hydrateHostTreeModelsFromGlobalState();
      }
      if (typeof renderLineup === "function") renderLineup({ skipHoverMount: true });
      if (typeof renderChips === "function") renderChips();
      if (typeof renderRightModelsRail === "function") renderRightModelsRail();
      await window.pollHostHeartbeatNow?.();
      await window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
    };

    const runFillHostsVramAction = async (hostId = null, triggerBtn = null) => {
      if (triggerBtn) triggerBtn.disabled = true;
      await syncHostTreeToGlobalLineupAndUI();
      const payload = { target_pct: 85 };
      if (hostId) payload.host_id = hostId;
      const res = await postJSON("/api/hosts/fill-vram", payload).catch((e) => ({ ok: false, error: e.message }));
      if (triggerBtn) triggerBtn.disabled = false;
      if (res?.ok) {
        await syncSnapshotIntoHostTree(res.after);
        const targetLbl = hostId ? `Host ${String(hostId).toUpperCase()}` : "all hosts";
        const msg = `⚡ Filled +${res.added_count || 0} model(s) on ${targetLbl} up to 85% safe VRAM (${res.after?.cluster_pressure_pct ?? 0}% cluster)`;
        const fb = container.querySelector("#tree-save-feedback-lbl");
        if (fb) fb.textContent = msg;
        pushClientLiveConsole("HOSTS", msg);
        status(msg);
        renderCascade();
      } else {
        status(`⚠️ VRAM Fill failed: ${res?.error || "Unknown error"}`);
      }
    };

    container.querySelector("#tree-rebalance-ffd-btn")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      await syncHostTreeToGlobalLineupAndUI();
      const res = await postJSON("/api/hosts/rebalance-vram", { deduplicate: true });
      btn.disabled = false;
      if (res?.ok && res.after?.hosts_map) {
        await syncSnapshotIntoHostTree(res.after);
        const fb = container.querySelector("#tree-save-feedback-lbl");
        if (fb) fb.textContent = `✓ Rebalanced (${(res.migrations || []).length} moved, ${(res.deduplicated || []).length} deduped)`;
        status(`⚖️ FFD Rebalanced ${res.total_unique_models} models across Hosts A–D (0 overcommitted hosts).`);
        renderCascade();
      }
    });

    container.querySelector("#tree-fill-all-vram-btn")?.addEventListener("click", (e) => {
      runFillHostsVramAction(null, e.currentTarget);
    });

    container.querySelectorAll("[data-fill-host-vram]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const hId = btn.getAttribute("data-fill-host-vram");
        if (hId) runFillHostsVramAction(hId, btn);
      });
    });

    // Save Custom Lineup Preset button (also syncs to /api/custom-lineups so it's available everywhere!)
    container.querySelector("#tree-save-custom-preset-btn")?.addEventListener("click", async () => {
      const nameInp = container.querySelector("#tree-custom-preset-name");
      const rawName = (nameInp?.value || "").trim() || `Lineup ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      await syncHostTreeToGlobalLineupAndUI();
      const existingIdx = (HOST_TREE_UI_STATE.savedTreePresets || []).findIndex((p) => p.name.toLowerCase() === rawName.toLowerCase());
      const presetId = existingIdx >= 0 && HOST_TREE_UI_STATE.savedTreePresets[existingIdx].id
        ? HOST_TREE_UI_STATE.savedTreePresets[existingIdx].id
        : `preset_${Date.now()}`;
      const snapshot = {
        id: presetId,
        name: rawName,
        created_at: new Date().toISOString(),
        models: JSON.parse(JSON.stringify((HOST_TREE_UI_STATE.models || []).filter((m) => m.enabled !== false))),
        hostConfigs: JSON.parse(JSON.stringify(HOST_TREE_UI_STATE.hostConfigs || {})),
      };
      HOST_TREE_UI_STATE.savedTreePresets ||= [];
      if (existingIdx >= 0) {
        HOST_TREE_UI_STATE.savedTreePresets[existingIdx] = snapshot;
      } else {
        HOST_TREE_UI_STATE.savedTreePresets.unshift(snapshot);
      }
      await persistHostTreeStateToServer();
      await postJSON("/api/custom-lineups", {
        id: presetId,
        name: rawName,
        desc: `${snapshot.models.length} models across Hosts A–D`,
        lineup: {
          lineup: STATE?.lineup || {},
          allocations: STATE?.host_lineups || {},
        },
      }).catch(() => { });
      if (typeof renderSavedLineups === "function") renderSavedLineups().catch(() => { });
      pushClientLiveConsole("HOSTS", `Saved custom lineup preset '${rawName}' (${snapshot.models.length} models across Hosts A–D)`);
      status(`✅ Saved Custom Lineup "${rawName}" (${snapshot.models.length} models & bound specialists)!`);
      renderCascade();
      const fb = container.querySelector("#tree-save-feedback-lbl");
      if (fb) fb.textContent = `✓ Saved "${rawName}"`;
    });

    // Load Custom Lineup Preset
    container.querySelectorAll("[data-load-custom-tree-preset]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const pIdx = Number(btn.getAttribute("data-load-custom-tree-preset"));
        const preset = (HOST_TREE_UI_STATE.savedTreePresets || [])[pIdx];
        if (!preset) return;
        HOST_TREE_UI_STATE.models = JSON.parse(JSON.stringify(preset.models || []));
        if (preset.hostConfigs) {
          HOST_TREE_UI_STATE.hostConfigs = Object.assign({}, HOST_TREE_UI_STATE.hostConfigs, JSON.parse(JSON.stringify(preset.hostConfigs)));
        }
        pushClientLiveConsole("HOSTS", `Loaded custom lineup preset '${preset.name}' (${HOST_TREE_UI_STATE.models.length} models)`);
        renderCascade();
        await syncHostTreeToGlobalLineupAndUI();
        await persistHostTreeStateToServer();
      });
    });

    // Delete Custom Lineup Preset
    container.querySelectorAll("[data-del-custom-tree-preset]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const pIdx = Number(btn.getAttribute("data-del-custom-tree-preset"));
        const removed = (HOST_TREE_UI_STATE.savedTreePresets || []).splice(pIdx, 1)[0];
        await persistHostTreeStateToServer();
        if (removed?.id) {
          await fetch(`/api/custom-lineups/${encodeURIComponent(removed.id)}`, { method: "DELETE" }).catch(() => { });
          if (typeof renderSavedLineups === "function") renderSavedLineups().catch(() => { });
        }
        if (removed) pushClientLiveConsole("HOSTS", `Deleted custom lineup preset '${removed.name}'`);
        renderCascade();
      });
    });

    // Built-in 1-Click Council Presets on the companion card
    container.querySelectorAll("[data-quick-lighthouse-preset]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cat = btn.getAttribute("data-quick-lighthouse-preset") || "coding";
        const catModels = (HOST_TREE_MODEL_CATALOG[cat]?.models || HOST_TREE_MODEL_CATALOG.coding.models || []).slice(0, 4);
        const hosts = ["a", "b", "c", "d"];
        HOST_TREE_UI_STATE.models = catModels.map((m, i) => ({
          id: m.id,
          hf: m.hf || m.id,
          label: m.label || m.id.split("/").pop(),
          host: hosts[i % hosts.length],
          slot: m.slot || "code",
          enabled: true,
          quantization: m.quant || "Q4_K_M",
          base_vram_gb: Number(m.vram || 14),
          vram_gb: Number(m.vram || 14),
          specialist_agent: "",
          temperature: 0.7,
          top_p: 0.95,
        }));
        pushClientLiveConsole("HOSTS", `Applied [${cat.toUpperCase()}] preset across Hosts A, B, C, D`);
        renderCascade();
        await syncHostTreeToGlobalLineupAndUI();
        await persistHostTreeStateToServer();
      });
    });

    // Removing a selected model chip
    container.querySelectorAll("[data-sq-remove-model]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const modId = btn.getAttribute("data-sq-remove-model");
        const hId = btn.getAttribute("data-sq-host");
        const idx = HOST_TREE_UI_STATE.models.findIndex((m) => m.host === hId && m.id === modId);
        if (idx >= 0) {
          const removed = HOST_TREE_UI_STATE.models.splice(idx, 1)[0];
          pushClientLiveConsole("HOSTS", `Removed [${removed.label || removed.id}] from Host ${hId.toUpperCase()}`);
          renderCascade();
          await syncHostTreeToGlobalLineupAndUI();
          await persistHostTreeStateToServer();
        }
      });
    });

    container.querySelector("#cascade-add-host-btn")?.addEventListener("click", () => {
      const all = getAllHostsList();
      const nextChar = String.fromCharCode(97 + all.length);
      const nextPort = 8080 + all.length;
      if (!HOST_TREE_UI_STATE.customHosts.includes(nextChar)) {
        HOST_TREE_UI_STATE.customHosts.push(nextChar);
      }
      HOST_TREE_UI_STATE.hostConfigs[nextChar] = {
        id: nextChar,
        label: `Host ${nextChar.toUpperCase()}`,
        url: `http://127.0.0.1:${nextPort}/v1`,
        vram_budget_gb: 96,
        draft_model: "Qwen/Qwen2.5-Coder-1.5B-Instruct-Q8_0",
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 4096,
        quantization: "Q4_K_M",
        data_tuning_mode: "standard_dpo",
        persona: "Autonomous Specialist",
        assigned_agent: "",
      };
      openLighthouseHost = nextChar;
      activeLighthouseTab = "models";
      persistHostTreeStateToServer();
      pushClientLiveConsole("HOSTS", `Added Host ${nextChar.toUpperCase()} beacon on port :${nextPort}`);
      renderCascade();
    });

    // Pure HF Buckets Vault Overlay open/close & real bucket operations
    container.querySelector("#cascade-open-vault-btn")?.addEventListener("click", () => {
      openLighthouseHost = null;
      vaultOverlayOpen = true;
      renderCascade();
    });

    container.querySelector("#hf-vault-overlay-close-btn")?.addEventListener("click", () => {
      vaultOverlayOpen = false;
      renderCascade();
    });

    container.querySelector("#hf-overlay-open-full-bucket-btn")?.addEventListener("click", () => {
      vaultOverlayOpen = false;
      openSlashConfigPopupWindow("bucket");
    });

    container.querySelector("#hf-overlay-autosync-cb")?.addEventListener("change", async (e) => {
      const enabled = Boolean(e.target.checked);
      const res = await postJSON("/api/hf-buckets/auto-sync", { enabled }).catch(() => ({}));
      if (res?.ok && STATE) {
        STATE.hf_auto_sync_on_startup = res.auto_sync_on_startup;
      }
      const st = container.querySelector("#hf-overlay-status-msg");
      if (st) st.textContent = `Auto-Sync on Startup: ${enabled ? "ENABLED" : "DISABLED"}`;
    });

    container.querySelector("#hf-overlay-sync-all-btn")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      const st = container.querySelector("#hf-overlay-status-msg");
      if (st) st.textContent = "Syncing all linked Hugging Face Buckets…";
      const res = await postJSON("/api/hf-buckets/sync-all", { auto_import_new: true }).catch(() => ({}));
      btn.disabled = false;
      if (res?.ok) {
        if (typeof saveLocalModelVault === "function") {
          saveLocalModelVault({ hf_buckets: res.buckets || [], custom_gguf: res.custom_gguf || [] });
        }
        await reloadState();
        pushClientLiveConsole("VAULT", `Synced ${res.synced_buckets || 0} HF Bucket(s) (${res.total_models_discovered || 0} weights verified)`);
        renderCascade();
      }
    });

    const linkBucketFromOverlay = async (autoImportTop = false) => {
      const uri = (container.querySelector("#hf-overlay-bucket-input")?.value || "").trim();
      const name = (container.querySelector("#hf-overlay-bucket-label")?.value || "").trim();
      const hf_token = (container.querySelector("#hf-overlay-bucket-token")?.value || "").trim();
      const st = container.querySelector("#hf-overlay-status-msg");
      if (!uri) {
        if (st) st.textContent = "Enter an hf://buckets/owner/bucket URI or owner/repo first.";
        return;
      }
      if (st) st.textContent = `Scanning Hugging Face Bucket [${uri}]…`;
      const res = await postJSON("/api/hf-buckets/link", {
        bucket_uri: uri,
        name,
        slot: "auto",
        hf_token,
        auto_import_top: autoImportTop,
        auto_import_count: 5,
      }).catch((err) => ({ ok: false, error: String(err) }));
      if (res?.ok) {
        if (typeof saveLocalModelVault === "function") {
          saveLocalModelVault({ hf_buckets: res.buckets || [], custom_gguf: res.custom_gguf || [] });
        }
        await reloadState();
        pushClientLiveConsole("VAULT", `Linked HF Bucket [${uri}] (${res.bucket?.models?.length || 0} weights found)`);
        renderCascade();
      } else if (st) {
        st.textContent = `Error: ${res?.error || "Failed to link HF Bucket"}`;
      }
    };

    container.querySelector("#hf-overlay-link-scan-btn")?.addEventListener("click", () => linkBucketFromOverlay(false));
    container.querySelector("#hf-overlay-link-import-btn")?.addEventListener("click", () => linkBucketFromOverlay(true));

    container.querySelectorAll("[data-hfo-import-bucket]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const bid = btn.getAttribute("data-hfo-import-bucket");
        const bkt = (STATE?.hf_buckets || []).find((x) => x.id === bid);
        if (!bkt || !Array.isArray(bkt.models) || !bkt.models.length) return;
        btn.disabled = true;
        const res = await postJSON("/api/hf-buckets/import", { bucket_id: bid, models: bkt.models }).catch(() => ({}));
        btn.disabled = false;
        if (res?.ok) {
          if (typeof saveLocalModelVault === "function") saveLocalModelVault({ custom_gguf: res.custom_gguf || [] });
          await reloadState();
          pushClientLiveConsole("VAULT", `Imported ${res.imported_count || bkt.models.length} GGUF weights from bucket '${bkt.name}' into Vault`);
          renderCascade();
        }
      });
    });

    container.querySelectorAll("[data-hfo-rescan-uri]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const uri = btn.getAttribute("data-hfo-rescan-uri") || "";
        const name = btn.getAttribute("data-hfo-rescan-name") || "";
        if (!uri) return;
        btn.disabled = true;
        const res = await postJSON("/api/hf-buckets/link", { bucket_uri: uri, name, slot: "auto", auto_import_top: false }).catch(() => ({}));
        btn.disabled = false;
        if (res?.ok) {
          await reloadState();
          renderCascade();
        }
      });
    });

    container.querySelectorAll("[data-hfo-unlink-bucket]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const bid = btn.getAttribute("data-hfo-unlink-bucket");
        if (!bid) return;
        if (typeof markModelDeletedInLocalVault === "function") markModelDeletedInLocalVault(bid);
        await fetch(`/api/hf-buckets/${encodeURIComponent(bid)}`, { method: "DELETE" }).catch(() => { });
        await reloadState();
        renderCascade();
      });
    });

    container.querySelectorAll("[data-hfo-del-gguf]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const gid = btn.getAttribute("data-hfo-del-gguf");
        if (!gid) return;
        if (typeof markModelDeletedInLocalVault === "function") markModelDeletedInLocalVault(gid);
        await fetch(`/api/custom-gguf/${encodeURIComponent(gid)}`, { method: "DELETE" }).catch(() => { });
        await reloadState();
        renderCascade();
      });
    });
  };

  renderCascade();
  return container;
}

function openSlashConfigPopupWindow(rawKey = "host") {
  const clean = String(rawKey || "host").trim().toLowerCase().replace(/^\//, "");
  const key = SLASH_CONFIG_ALIASES[clean] || (SLASH_CONFIG_REGISTRY[clean] ? clean : "host");
  const isUnifiedHostConfig = key === "host" || key === "models";
  const cfg = isUnifiedHostConfig ? SLASH_CONFIG_REGISTRY.host : (SLASH_CONFIG_REGISTRY[key] || SLASH_CONFIG_REGISTRY.host);
  const modal = $("#slash-config-popup-modal");
  const stage = $("#slash-config-popup-stage");
  if (!modal || !stage) return;

  // Restore any previously docked nodes before mounting the new tab
  restoreSlashConfigDockedNodes();

  _activeSlashConfigKey = key;

  // Refresh dynamic sub-renders so the user sees live state
  try {
    if (key === "boosters") {
      if (typeof renderCompactBoostersGrid === "function") renderCompactBoostersGrid();
    } else if (key === "bucket") {
      if (typeof renderHfBuckets === "function") renderHfBuckets();
      if (typeof renderCustomGguf === "function") renderCustomGguf();
    } else if (isUnifiedHostConfig) {
      if (typeof renderLineup === "function") renderLineup({ skipHoverMount: true });
      if (typeof renderChips === "function") renderChips();
      if (typeof renderRightModelsRail === "function") renderRightModelsRail();
      if (typeof window.refreshTabbedHostSetupUI === "function") {
        window.refreshTabbedHostSetupUI();
      }
    } else if (key === "mcp") {
      if (typeof renderMcp === "function") renderMcp();
    }
  } catch (_) { }

  if (isUnifiedHostConfig) {
    const initialHcTab = key === "models" ? "models" : "hosts";
    const tabBar = document.createElement("div");
    tabBar.className = "hc-unified-tabs";
    tabBar.setAttribute("role", "tablist");
    tabBar.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <button type="button" class="hc-tab-btn ${initialHcTab === "hosts" ? "on" : ""}" data-hc-tab="hosts" role="tab">🖥 Hosts, Endpoints &amp; Saved Board</button>
        <button type="button" class="hc-tab-btn ${initialHcTab === "models" ? "on" : ""}" data-hc-tab="models" role="tab">🤖 Models, VRAM Lineup &amp; Agents</button>
      </div>
      <span class="muted" style="font-size:11px">Unified Host Configurator — Configure Hosts A–D, Fill 85% VRAM, &amp; Assign Models without cross-host duplicates</span>
    `;

    const hostsPane = document.createElement("div");
    hostsPane.id = "hc-pane-hosts";
    hostsPane.className = initialHcTab === "hosts" ? "" : "hidden";

    const modelsPane = document.createElement("div");
    modelsPane.id = "hc-pane-models";
    modelsPane.className = initialHcTab === "models" ? "" : "hidden";

    const hostEl = document.querySelector('[data-lineup-pane="host-setup"]');
    if (hostEl) {
      const wasHidden = hostEl.classList.contains("hidden");
      const ph = document.createElement("div");
      ph.className = "slash-config-dock-ph hidden";
      ph.id = "slash-dock-ph-unified-host-setup";
      hostEl.parentNode.insertBefore(ph, hostEl);
      hostEl.classList.remove("hidden");
      hostsPane.appendChild(hostEl);
      _slashDockedElements.push({ el: hostEl, ph, wasHidden });
    }

    let treeBuilderEl = buildUpwardHostTreeBuilder();
    modelsPane.appendChild(treeBuilderEl);

    stage.appendChild(tabBar);
    stage.appendChild(hostsPane);
    stage.appendChild(modelsPane);

    tabBar.querySelectorAll("[data-hc-tab]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const nextTab = btn.getAttribute("data-hc-tab") || "hosts";
        tabBar.querySelectorAll("[data-hc-tab]").forEach((b) => b.classList.toggle("on", b === btn));
        hostsPane.classList.toggle("hidden", nextTab !== "hosts");
        modelsPane.classList.toggle("hidden", nextTab !== "models");
        if (nextTab === "hosts") {
          window.refreshTabbedHostSetupUI?.(window._activeHostSetupTab || "a");
        } else {
          HOST_TREE_UI_STATE.loadedFromServer = false;
          await syncHostTreeStateFromServer().catch(() => { });
          hydrateHostTreeModelsFromGlobalState();
          modelsPane.innerHTML = "";
          treeBuilderEl = buildUpwardHostTreeBuilder();
          modelsPane.appendChild(treeBuilderEl);
        }
        stage.scrollTop = 0;
      });
    });
  } else {
    if (cfg.prependHostUrlMatrix) {
      stage.appendChild(buildHostUrlMatrixBanner());
    }

    if (cfg.prependUpwardHostTreeBuilder) {
      stage.appendChild(buildUpwardHostTreeBuilder());
    }

    cfg.selectors.forEach((sel, idx) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const wasHidden = el.classList.contains("hidden");
      const ph = document.createElement("div");
      ph.className = "slash-config-dock-ph hidden";
      ph.id = `slash-dock-ph-${key}-${idx}`;
      el.parentNode.insertBefore(ph, el);
      el.classList.remove("hidden");
      stage.appendChild(el);
      _slashDockedElements.push({ el, ph, wasHidden });
    });
  }

  if ($("#slash-config-popup-icon")) $("#slash-config-popup-icon").textContent = cfg.icon;
  if ($("#slash-config-popup-title")) $("#slash-config-popup-title").textContent = cfg.title;
  if ($("#slash-config-popup-badge")) $("#slash-config-popup-badge").textContent = cfg.badge;

  $$(".slash-cfg-tab-btn").forEach((btn) => {
    const btnKey = btn.dataset.slashCfgTab || btn.dataset.slashCfg;
    btn.classList.toggle("active", btnKey === key);
  });

  modal.classList.remove("hidden");
  stage.scrollTop = 0;
}

function closeSlashConfigPopupWindow() {
  restoreSlashConfigDockedNodes();
  const win = $("#slash-config-popup-box");
  if (win) {
    win.style.position = "";
    win.style.left = "";
    win.style.top = "";
    win.style.margin = "";
  }
  $("#slash-config-popup-modal")?.classList.add("hidden");
  $("#guardian-fullscreen-term")?.focus();
}

// ============================================================================
// REAL-TIME FLOATING LIVE BACKGROUND CONSOLE POP-UP WINDOW (#live-console-floating-win)
// - Every filter button (All, Inference, Hosts, Quant & DPO, Agents, Compiler) works
// - Pause/Resume, Clear, Maximize/Restore, Close, and Dragging work
// - Bottom command bar (#live-console-cmd-input + #live-console-cmd-send) runs
//   any /command or live shell/council command directly inside the Live Console
// ============================================================================
let _liveConsoleLastSeq = 0;
let _liveConsolePaused = false;
let _liveConsolePollTimer = null;
let _liveConsoleActiveCat = "ALL";
let _liveConsoleCmdHistory = [];
let _liveConsoleCmdHistIdx = -1;
const _liveConsoleBuffer = [];

function normalizeLiveConsoleCategory(rawCat) {
  const c = String(rawCat || "SYS").toUpperCase();
  if (c.includes("INFER") || c.includes("ASK") || c.includes("MODEL") || c.includes("STREAM") || c.includes("JUDGE")) return "INFERENCE";
  if (c.includes("HOST") || c.includes("COLAB") || c.includes("LINEUP") || c.includes("VRAM") || c.includes("BRIDGE")) return "HOSTS";
  if (c.includes("QUANT") || c.includes("DPO") || c.includes("TUNE") || c.includes("LORA") || c.includes("SPECULATIVE")) return "QUANT_DPO";
  if (c.includes("AGENT") || c.includes("MCP") || c.includes("SWARM") || c.includes("TOOL")) return "AGENTS";
  if (c.includes("COMPIL") || c.includes("BUILD") || c.includes("HEAL") || c.includes("EXEC") || c.includes("SHELL")) return "COMPILER";
  return c;
}

function matchesLiveConsoleFilter(entryCat, activeFilter) {
  if (!activeFilter || activeFilter === "ALL") return true;
  const norm = normalizeLiveConsoleCategory(entryCat);
  return norm === activeFilter || String(entryCat || "").toUpperCase().includes(activeFilter);
}

function renderLiveConsoleRowDom(out, entry) {
  if (!out) return;
  const rawCat = String(entry.category || "SYS").toUpperCase();
  const normCat = normalizeLiveConsoleCategory(rawCat);
  if (!matchesLiveConsoleFilter(rawCat, _liveConsoleActiveCat)) return;

  const row = document.createElement("div");
  const lvl = String(entry.level || "info").toLowerCase();
  row.className = `live-console-row lvl-${lvl === "error" || rawCat.includes("ERR") ? "error" : lvl === "warn" ? "warn" : normCat === "HOSTS" || normCat === "INFERENCE" ? "ok" : "info"}`;

  const catColor =
    rawCat.includes("ERR") || rawCat.includes("FAIL") ? "#f87171" :
      normCat === "QUANT_DPO" ? "#c084fc" :
        normCat === "HOSTS" ? "#2ee6a6" :
          normCat === "INFERENCE" ? "#38bdf8" :
            normCat === "AGENTS" ? "#fbbf24" :
              normCat === "COMPILER" ? "#6ee7b7" : "#a7f3d0";

  const tsStr = entry.ts
    ? (String(entry.ts).includes("T") ? String(entry.ts).slice(11, 23) : String(entry.ts))
    : new Date().toISOString().slice(11, 23);

  row.innerHTML = `<span style="color:#64748b;flex-shrink:0">${esc(tsStr)}</span> <span style="color:${catColor};font-weight:800;flex-shrink:0">[${esc(rawCat)}]</span> <span style="color:#e2e8f0;flex:1">${esc(entry.message || "")}</span>`;
  out.appendChild(row);
  while (out.children.length > 260) {
    out.removeChild(out.firstChild);
  }
  out.scrollTop = out.scrollHeight;
}

function rerenderLiveConsoleBuffer() {
  const out = $("#live-console-stream-body") || $("#live-console-stream-out");
  if (!out) return;
  out.innerHTML = "";
  for (const item of _liveConsoleBuffer) {
    renderLiveConsoleRowDom(out, item);
  }
}

function appendLiveConsoleDomEntry(entry) {
  if (!entry || !entry.message) return;
  _liveConsoleBuffer.push(entry);
  while (_liveConsoleBuffer.length > 400) {
    _liveConsoleBuffer.shift();
  }
  window.mirrorEventToGlobalFooterStream?.(entry);
  if (_liveConsolePaused) return;
  const out = $("#live-console-stream-body") || $("#live-console-stream-out");
  if (!out) return;
  renderLiveConsoleRowDom(out, entry);
}

function pushClientLiveConsole(category, message, level = "info") {
  const entry = {
    ts: new Date().toISOString().slice(11, 23),
    category: String(category || "SYS").toUpperCase(),
    level,
    message: String(message || ""),
  };
  appendLiveConsoleDomEntry(entry);
  postJSON("/api/live-console/push", { category: entry.category, level, message: entry.message }).catch(() => { });
}

async function pollLiveConsoleStream() {
  if (_liveConsolePaused) return;
  try {
    const res = await fetch(`/api/live-console?since=${_liveConsoleLastSeq}`);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data?.events)) {
      for (const ev of data.events) {
        const seqId = Number(ev.id || ev.seq || 0);
        if (seqId > _liveConsoleLastSeq) _liveConsoleLastSeq = seqId;
        appendLiveConsoleDomEntry(ev);
      }
    }
    const statEl = $("#live-console-metrics-pill") || $("#live-console-footer-stats");
    if (statEl) {
      const hostCount = getAllConfiguredHostSummary();
      statEl.textContent = `Events: ${_liveConsoleBuffer.length} · ${hostCount}`;
    }
  } catch (_) { }
}

function getAllConfiguredHostSummary() {
  const cfgs = HOST_TREE_UI_STATE?.hostConfigs || {};
  return ["a", "b", "c", "d"]
    .map((k) => `${k.toUpperCase()}:${(cfgs[k]?.quantization || "Q4_K_M")}`)
    .join(" · ");
}

function openLiveConsoleWindow() {
  const win = $("#live-console-floating-win");
  if (!win) return;
  win.classList.remove("hidden");
  if (_liveConsoleBuffer.length === 0) {
    appendLiveConsoleDomEntry({ ts: new Date().toISOString().slice(11, 23), category: "HOSTS", level: "ok", message: "Local OpenAI-compatible Host Bridges A (:8080), B (:8081), C (:8082), D (:8083) online & listening." });
    appendLiveConsoleDomEntry({ ts: new Date().toISOString().slice(11, 23), category: "QUANT_DPO", level: "info", message: "Physical GGUF Quantization & Unsloth DPO dataset compiler ready." });
    appendLiveConsoleDomEntry({ ts: new Date().toISOString().slice(11, 23), category: "INFERENCE", level: "ok", message: "Multi-model Council, 60-Worker Swarm & Self-Healing Compiler telemetry attached." });
  } else {
    rerenderLiveConsoleBuffer();
  }
  pollLiveConsoleStream();
  setTimeout(() => $("#live-console-cmd-input")?.focus(), 40);
}

function closeLiveConsoleWindow() {
  $("#live-console-floating-win")?.classList.add("hidden");
}

async function runLiveConsoleInlineCommand() {
  const inp = $("#live-console-cmd-input");
  if (!inp) return;
  const raw = (inp.value || "").trim();
  if (!raw) return;
  inp.value = "";
  _liveConsoleCmdHistory.push(raw);
  _liveConsoleCmdHistIdx = _liveConsoleCmdHistory.length;

  appendLiveConsoleDomEntry({
    ts: new Date().toISOString().slice(11, 23),
    category: "CMD",
    level: "ok",
    message: `console❯ ${raw}`,
  });

  const clean = raw.toLowerCase();
  if (clean === "/clear" || clean === "clear") {
    _liveConsoleBuffer.length = 0;
    rerenderLiveConsoleBuffer();
    return;
  }
  if (clean === "/status" || clean === "/health") {
    const h = await getJSON("/api/colab/hosts").catch(() => ({}));
    const list = (h?.hosts || []).map((x) => `${x.name || x.id.toUpperCase()} (${x.url || "ready"})`).join(", ");
    pushClientLiveConsole("HOSTS", `Active Hosts: ${list || "Host A :8080, Host B :8081, Host C :8082, Host D :8083"}`);
    return;
  }
  if (clean.startsWith("/")) {
    const slashKey = clean.replace(/^\//, "").split(/\s+/)[0];
    if (SLASH_CONFIG_ALIASES[slashKey] || SLASH_CONFIG_REGISTRY[slashKey]) {
      openSlashConfigPopupWindow(slashKey);
      pushClientLiveConsole("SYS", `Opened /${slashKey} configuration window.`);
      return;
    }
  }

  // Execute live shell / council command via /api/terminal/exec
  try {
    const res = await postJSON("/api/terminal/exec", {
      command: raw,
      shell: "bash",
    });
    const outText = String(res?.stdout || res?.output || res?.stderr || "Command completed.").trim();
    outText.split("\n").slice(0, 18).forEach((line) => {
      if (line.trim()) {
        appendLiveConsoleDomEntry({
          ts: new Date().toISOString().slice(11, 23),
          category: "COMPILER",
          level: res?.exit_code && res.exit_code !== 0 ? "warn" : "info",
          message: line,
        });
      }
    });
  } catch (err) {
    appendLiveConsoleDomEntry({
      ts: new Date().toISOString().slice(11, 23),
      category: "ERROR",
      level: "error",
      message: `Command error: ${err.message || err}`,
    });
  }
}

function initLiveBackgroundConsole() {
  const win = $("#live-console-floating-win");
  if (!win || win._liveConsoleInit) return;
  win._liveConsoleInit = true;

  $("#live-console-close-btn")?.addEventListener("click", closeLiveConsoleWindow);

  $("#live-console-clear-btn")?.addEventListener("click", () => {
    _liveConsoleBuffer.length = 0;
    rerenderLiveConsoleBuffer();
    appendLiveConsoleDomEntry({
      ts: new Date().toISOString().slice(11, 23),
      category: "SYS",
      level: "info",
      message: "Live console buffer cleared.",
    });
  });

  $("#live-console-pause-btn")?.addEventListener("click", (e) => {
    _liveConsolePaused = !_liveConsolePaused;
    e.currentTarget.textContent = _liveConsolePaused ? "▶ Resume" : "⏸ Pause";
    const badge = $("#live-console-pulse-badge") || $("#live-console-status-badge");
    if (badge) {
      badge.textContent = _liveConsolePaused ? "⏸ PAUSED" : "● STREAMING";
      badge.style.color = _liveConsolePaused ? "#fbbf24" : "#2ee6a6";
    }
    if (!_liveConsolePaused) {
      rerenderLiveConsoleBuffer();
      pollLiveConsoleStream();
    }
  });

  $("#live-console-max-btn")?.addEventListener("click", (e) => {
    const isMax = win.classList.toggle("is-maximized");
    win.classList.remove("is-minimized");
    e.currentTarget.textContent = isMax ? "❐" : "⛶";
  });

  // Category filter buttons (All, Inference, Hosts, Quant & DPO, Agents, Compiler)
  $$("#live-console-filter-bar .live-con-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      _liveConsoleActiveCat = btn.getAttribute("data-lc-cat") || "ALL";
      $$("#live-console-filter-bar .live-con-filter-btn").forEach((b) => {
        const active = (b.getAttribute("data-lc-cat") || "ALL") === _liveConsoleActiveCat;
        b.classList.toggle("primary", active);
        b.classList.toggle("ghost", !active);
      });
      rerenderLiveConsoleBuffer();
    });
  });

  // Command input & Run button inside Live Console footer
  $("#live-console-cmd-send")?.addEventListener("click", runLiveConsoleInlineCommand);
  $("#live-console-cmd-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runLiveConsoleInlineCommand();
    } else if (e.key === "ArrowUp") {
      if (_liveConsoleCmdHistory.length > 0) {
        e.preventDefault();
        _liveConsoleCmdHistIdx = Math.max(0, _liveConsoleCmdHistIdx - 1);
        e.currentTarget.value = _liveConsoleCmdHistory[_liveConsoleCmdHistIdx] || "";
      }
    } else if (e.key === "ArrowDown") {
      if (_liveConsoleCmdHistory.length > 0) {
        e.preventDefault();
        _liveConsoleCmdHistIdx = Math.min(_liveConsoleCmdHistory.length, _liveConsoleCmdHistIdx + 1);
        e.currentTarget.value = _liveConsoleCmdHistory[_liveConsoleCmdHistIdx] || "";
      }
    }
  });

  // Draggable header for Live Console window (#live-console-drag-head)
  const head = $("#live-console-drag-head") || $("#live-console-floating-head");
  if (head) {
    let dragging = false, sx = 0, sy = 0, il = 0, it = 0;
    head.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("input") || win.classList.contains("is-maximized")) return;
      dragging = true;
      const rect = win.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      il = rect.left;
      it = rect.top;
      win.style.left = `${il}px`;
      win.style.top = `${it}px`;
      win.style.right = "auto";
      win.style.bottom = "auto";
      const onMove = (ev) => {
        if (!dragging) return;
        win.style.left = `${Math.max(8, Math.min(window.innerWidth - 180, il + (ev.clientX - sx)))}px`;
        win.style.top = `${Math.max(8, Math.min(window.innerHeight - 80, it + (ev.clientY - sy)))}px`;
      };
      const onUp = () => {
        dragging = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  // Bind all launcher buttons in Left Rail, Top Header, and Slash Config Modal -> toggle Unified Command Deck
  [
    "#rail-open-live-console-btn",
    "#topbar-open-live-console-btn",
    "#slash-config-open-live-console-btn",
  ].forEach((sel) => {
    $(sel)?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.openUnifiedTerminal === "function") {
        const footer = $("#global-footer-terminal");
        const tab = "split";
        if (footer?.classList.contains("gft-expanded") && !footer.classList.contains("hidden")) {
          $("#gft-min-exp-btn")?.click();
        } else {
          window.openUnifiedTerminal(tab);
        }
        return;
      }
      if (win.classList.contains("hidden")) openLiveConsoleWindow();
      else closeLiveConsoleWindow();
    });
  });

  ["#rail-open-models-tree-btn", "#topbar-open-models-tree-btn"].forEach((sel) => {
    $(sel)?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSlashConfigPopupWindow("models");
    });
  });

  ["#rail-open-host-cfg-btn", "#topbar-open-host-cfg-btn"].forEach((sel) => {
    $(sel)?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSlashConfigPopupWindow("host");
    });
  });

  if (!_liveConsolePollTimer) {
    _liveConsolePollTimer = setInterval(pollLiveConsoleStream, 1600);
  }
  pollLiveConsoleStream();
}

// ============================================================================
// VISUAL PROJECT MODULE SUB-TASK PROGRESS BAR COMPONENT (#project-module-progress-card)
// Dynamically updates progress percentage, segmented bar ticks, and completion
// counters based on completed sub-tasks in the active project module.
// ============================================================================
const DEFAULT_PROJECT_MODULES = {
  fullstack: {
    title: "Full-Stack Application Synthesis & Verification",
    subtasks: [
      { id: "fs-1", label: "Parse architecture & multi-file blueprint", done: true },
      { id: "fs-2", label: "Dispatch prompt across active Council models", done: true },
      { id: "fs-3", label: "Synthesize backend API routes & data schema", done: true },
      { id: "fs-4", label: "Build interactive frontend UI components", done: false },
      { id: "fs-5", label: "Run Chief Judge cross-model evaluation", done: false },
      { id: "fs-6", label: "Compile, execute & self-heal standalone package", done: false },
    ],
  },
  cluster: {
    title: "4-Host GPU Bridge & Model Lineup Configuration",
    subtasks: [
      { id: "cl-1", label: "Start local OpenAI bridges on ports :8080–:8083", done: true },
      { id: "cl-2", label: "Select models in 4-Square Host Hover Lineup", done: true },
      { id: "cl-3", label: "Bind Specialist Agents to Hosts A, B, C, D", done: false },
      { id: "cl-4", label: "Verify Colab / Localhost health handshake", done: true },
    ],
  },
  secops: {
    title: "Offensive Red-Team Security & Zero-Day Audit",
    subtasks: [
      { id: "sc-1", label: "Enumerate attack surface & API endpoints", done: true },
      { id: "sc-2", label: "Audit authentication & injection boundaries", done: false },
      { id: "sc-3", label: "Verify zero safety refusals across uncensored slots", done: true },
      { id: "sc-4", label: "Generate hardened remediation patch", done: false },
    ],
  },
  dpo_quant: {
    title: "Physical GGUF Quantization & Online DPO Pipeline",
    subtasks: [
      { id: "dq-1", label: "Write physical Ollama Modelfile & KV-cache spec", done: true },
      { id: "dq-2", label: "Pair Speculative Decoding draft model (2.9x speedup)", done: true },
      { id: "dq-3", label: "Compile Judge winner/loser pairs to DPO .jsonl", done: false },
      { id: "dq-4", label: "Generate Unsloth LoRA fine-tuning trainer script", done: false },
    ],
  },
};

let _projectModulesState = null;
let _activeProjectModuleKey = "fullstack";

function loadProjectModulesState() {
  if (_projectModulesState) return _projectModulesState;
  try {
    const raw = localStorage.getItem("suomynona_project_modules_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        _projectModulesState = parsed;
        return _projectModulesState;
      }
    }
  } catch (_) { }
  _projectModulesState = JSON.parse(JSON.stringify(DEFAULT_PROJECT_MODULES));
  return _projectModulesState;
}

function saveProjectModulesState() {
  try {
    if (_projectModulesState) {
      localStorage.setItem("suomynona_project_modules_v1", JSON.stringify(_projectModulesState));
    }
  } catch (_) { }
}

function renderProjectModuleProgressBar() {
  const card = $("#project-module-progress-card");
  if (!card) return;
  const state = loadProjectModulesState();
  const mod = state[_activeProjectModuleKey] || state.fullstack;
  const subtasks = Array.isArray(mod.subtasks) ? mod.subtasks : [];
  const total = subtasks.length;
  const completed = subtasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  if ($("#pmp-module-title")) $("#pmp-module-title").textContent = mod.title;
  if ($("#pmp-completed-count")) $("#pmp-completed-count").textContent = String(completed);
  if ($("#pmp-total-count")) $("#pmp-total-count").textContent = String(total);
  if ($("#pmp-pct-badge")) $("#pmp-pct-badge").textContent = `${pct}%`;

  const fillEl = $("#pmp-progress-fill");
  if (fillEl) fillEl.style.width = `${pct}%`;

  const ariaEl = $("#pmp-progressbar-aria");
  if (ariaEl) ariaEl.setAttribute("aria-valuenow", String(pct));

  const segWrap = $("#pmp-progress-segments");
  if (segWrap) {
    segWrap.style.gridTemplateColumns = `repeat(${Math.max(1, total)}, 1fr)`;
    segWrap.innerHTML = subtasks.map(() => `<div class="module-progress-seg-tick"></div>`).join("");
  }

  const listEl = $("#pmp-subtask-list");
  if (listEl) {
    listEl.innerHTML = subtasks.map((task, idx) => `
      <div class="module-subtask-item ${task.done ? "is-done" : ""}" data-pmp-toggle-idx="${idx}" role="checkbox" aria-checked="${task.done ? "true" : "false"}" tabindex="0">
        <div class="module-subtask-left">
          <span class="module-subtask-check">${task.done ? "✓" : ""}</span>
          <span class="module-subtask-label" title="${esc(task.label)}">${esc(task.label)}</span>
        </div>
        <button type="button" class="module-subtask-del" data-pmp-del-idx="${idx}" title="Remove sub-task">✕</button>
      </div>
    `).join("");

    listEl.querySelectorAll("[data-pmp-toggle-idx]").forEach((row) => {
      const toggleFn = (e) => {
        if (e.target.closest("[data-pmp-del-idx]")) return;
        const idx = Number(row.getAttribute("data-pmp-toggle-idx"));
        if (subtasks[idx]) {
          subtasks[idx].done = !subtasks[idx].done;
          saveProjectModulesState();
          renderProjectModuleProgressBar();
          pushClientLiveConsole("COMPILER", `Module [${mod.title}] sub-task "${subtasks[idx].label}" marked ${subtasks[idx].done ? "COMPLETED" : "PENDING"}`);
        }
      };
      row.addEventListener("click", toggleFn);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFn(e);
        }
      });
    });

    listEl.querySelectorAll("[data-pmp-del-idx]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute("data-pmp-del-idx"));
        if (subtasks[idx]) {
          subtasks.splice(idx, 1);
          saveProjectModulesState();
          renderProjectModuleProgressBar();
        }
      });
    });
  }
}

window.advanceProjectModuleSubtask = function (moduleKey, subtaskIndex, markDone = true) {
  const state = loadProjectModulesState();
  const mod = state[moduleKey || _activeProjectModuleKey];
  if (!mod || !Array.isArray(mod.subtasks)) return;
  if (mod.subtasks[subtaskIndex]) {
    mod.subtasks[subtaskIndex].done = markDone;
    saveProjectModulesState();
    renderProjectModuleProgressBar();
  }
};

function initProjectModuleProgressBar() {
  const card = $("#project-module-progress-card");
  if (!card || card._pmpInitialized) return;
  card._pmpInitialized = true;

  $("#pmp-module-select")?.addEventListener("change", (e) => {
    _activeProjectModuleKey = e.target.value || "fullstack";
    renderProjectModuleProgressBar();
  });

  $("#pmp-complete-all-btn")?.addEventListener("click", () => {
    const state = loadProjectModulesState();
    const mod = state[_activeProjectModuleKey];
    if (mod && Array.isArray(mod.subtasks)) {
      mod.subtasks.forEach((t) => { t.done = true; });
      saveProjectModulesState();
      renderProjectModuleProgressBar();
      pushClientLiveConsole("COMPILER", `All sub-tasks completed for module [${mod.title}] (100%)`);
    }
  });

  $("#pmp-reset-btn")?.addEventListener("click", () => {
    const state = loadProjectModulesState();
    const mod = state[_activeProjectModuleKey];
    if (mod && Array.isArray(mod.subtasks)) {
      mod.subtasks.forEach((t) => { t.done = false; });
      saveProjectModulesState();
      renderProjectModuleProgressBar();
      pushClientLiveConsole("COMPILER", `Reset sub-task progress for module [${mod.title}] (0%)`);
    }
  });

  $("#pmp-collapse-btn")?.addEventListener("click", (e) => {
    const body = $("#pmp-checklist-body");
    if (!body) return;
    const isHidden = body.classList.toggle("hidden");
    e.currentTarget.textContent = isHidden ? "▸ Checklist" : "▾ Checklist";
  });

  const addSubtask = () => {
    const inp = $("#pmp-new-subtask-input");
    if (!inp) return;
    const label = (inp.value || "").trim();
    if (!label) return;
    inp.value = "";
    const state = loadProjectModulesState();
    const mod = state[_activeProjectModuleKey];
    if (mod && Array.isArray(mod.subtasks)) {
      mod.subtasks.push({ id: `st-${Date.now()}`, label, done: false });
      saveProjectModulesState();
      renderProjectModuleProgressBar();
      pushClientLiveConsole("COMPILER", `Added sub-task "${label}" to module [${mod.title}]`);
    }
  };

  $("#pmp-add-subtask-btn")?.addEventListener("click", addSubtask);
  $("#pmp-new-subtask-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  });

  renderProjectModuleProgressBar();
}

function initSlashConfigPopupSystem() {
  const modal = $("#slash-config-popup-modal");
  if (!modal || modal._slashPopupInitialized) return;
  modal._slashPopupInitialized = true;

  initLiveBackgroundConsole();
  initProjectModuleProgressBar();

  $$(".slash-cfg-tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSlashConfigPopupWindow(btn.dataset.slashCfgTab || btn.dataset.slashCfg || "host");
    });
  });

  $$("[data-slash-popup-trigger]").forEach((btn) => {
    if (btn._boundSlashTrigger) return;
    btn._boundSlashTrigger = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSlashConfigPopupWindow(btn.getAttribute("data-slash-popup-trigger") || "models");
    });
  });

  $("#slash-config-popup-close-btn")?.addEventListener("click", closeSlashConfigPopupWindow);
  $("#slash-config-return-cli-btn")?.addEventListener("click", closeSlashConfigPopupWindow);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSlashConfigPopupWindow();
    }
  });

  $("#slash-config-popup-max-btn")?.addEventListener("click", () => {
    const win = $("#slash-config-popup-box");
    if (!win) return;
    const isMax = win.classList.toggle("is-maximized");
    if (isMax) {
      win.style.position = "";
      win.style.left = "";
      win.style.top = "";
      win.style.margin = "";
    }
    $("#slash-config-popup-max-btn").textContent = isMax ? "❐" : "⛶";
  });

  const head = $("#slash-config-popup-head");
  const win = $("#slash-config-popup-box");
  if (head && win) {
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    head.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("input") || win.classList.contains("is-maximized")) {
        return;
      }
      isDragging = true;
      head.style.cursor = "grabbing";
      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      win.style.position = "fixed";
      win.style.left = `${initialLeft}px`;
      win.style.top = `${initialTop}px`;
      win.style.margin = "0";

      const onMove = (ev) => {
        if (!isDragging) return;
        const nx = Math.max(10, Math.min(window.innerWidth - 120, initialLeft + (ev.clientX - startX)));
        const ny = Math.max(10, Math.min(window.innerHeight - 80, initialTop + (ev.clientY - startY)));
        win.style.left = `${nx}px`;
        win.style.top = `${ny}px`;
      };
      const onUp = () => {
        isDragging = false;
        head.style.cursor = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeSlashConfigPopupWindow();
    }
  });
}

function initCliPopupSystem() {
  initSlashConfigPopupSystem();

  // Bind any [data-open-cli] triggers (Master routes cleanly to the bottom Live Backend Stream Terminal)
  $$("[data-open-cli]").forEach((btn) => {
    if (btn._boundOpenCli) return;
    btn._boundOpenCli = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const k = btn.dataset.openCli || "master";
      if (k === "master" && typeof window.openBottomStreamTerminal === "function") {
        window.openBottomStreamTerminal("");
      } else {
        openCliPopupWindow(k);
      }
    });
  });

  // Delegate for any dynamically created popout buttons
  document.addEventListener("click", (e) => {
    const popoutBtn = e.target.closest("[data-popout-key]");
    if (popoutBtn) {
      e.preventDefault();
      e.stopPropagation();
      openCliPopupWindow(popoutBtn.dataset.popoutKey);
    }
  });

  // Close button
  $("#cli-popup-close-btn")?.addEventListener("click", closeCliPopupWindow);

  // Detach to Native Desktop OS Window (Multi-Monitor Floating Window)
  $("#cli-popup-detach-btn")?.addEventListener("click", () => {
    const key = _currentlyMountedCliKey || "master";
    if (window.suomynonaNative?.openDetachedCli) {
      window.suomynonaNative.openDetachedCli(key);
      closeCliPopupWindow();
    } else {
      window.open(
        `/cli-standalone.html?key=${encodeURIComponent(key)}`,
        `suomynona_cli_${key}`,
        "width=1050,height=720,left=120,top=100,menubar=no,status=no,toolbar=no"
      );
      closeCliPopupWindow();
    }
  });

  // Backdrop click to close (when clicking outside window)
  $("#cli-popup-window-modal")?.addEventListener("click", (e) => {
    if (e.target === $("#cli-popup-window-modal")) {
      closeCliPopupWindow();
    }
  });

  // Maximize / restore window toggle
  $("#cli-popup-max-btn")?.addEventListener("click", () => {
    const win = $("#cli-popup-window-box");
    if (!win) return;
    const isMax = win.classList.toggle("is-maximized");
    if (isMax) {
      win.style.position = "";
      win.style.left = "";
      win.style.top = "";
      win.style.margin = "";
    }
    $("#cli-popup-max-btn").textContent = isMax ? "❐" : "⛶";
  });

  // Free Dragging of Pop-up Window across the Screen
  const popupHead = document.querySelector(".cli-popup-head");
  const popupWin = $("#cli-popup-window-box");
  if (popupHead && popupWin) {
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    popupHead.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("input") || popupWin.classList.contains("is-maximized")) {
        return;
      }
      isDragging = true;
      popupHead.style.cursor = "grabbing";
      const rect = popupWin.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      popupWin.style.position = "fixed";
      popupWin.style.left = `${initialLeft}px`;
      popupWin.style.top = `${initialTop}px`;
      popupWin.style.margin = "0";

      const onMouseMove = (moveEv) => {
        if (!isDragging) return;
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;
        const newX = Math.max(10, Math.min(window.innerWidth - 120, initialLeft + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - 80, initialTop + dy));
        popupWin.style.left = `${newX}px`;
        popupWin.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        popupHead.style.cursor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  }

  // Quick Switcher dropdown inside popup head
  $("#cli-popup-quick-select")?.addEventListener("change", (e) => {
    openCliPopupWindow(e.target.value);
  });

  // Go to sub-page button inside popup foot
  $("#cli-popup-goto-page-btn")?.addEventListener("click", () => {
    if (!_currentlyMountedCliKey) return;
    const reg = CLI_REGISTRY[_currentlyMountedCliKey];
    closeCliPopupWindow();
    if (reg && reg.page) {
      const railBtn = document.querySelector(`.rail-btn[data-view="${reg.page}"]`);
      if (railBtn) railBtn.click();
    }
  });

  // Global Escape key closes CLI popup window
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#cli-popup-window-modal") && !$("#cli-popup-window-modal").classList.contains("hidden")) {
      closeCliPopupWindow();
    }
  });
}

function initAllDirectTerminals() {
  // Bind HUD Slash-Command Pills inside the Master Black CLI
  $$(".cli-slash-pill").forEach((btn) => {
    if (btn._slashBound) return;
    btn._slashBound = true;
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sc = btn.dataset.slashCmd || "/council";
      const outEl = $("#guardian-out");
      if (outEl) {
        appendTypedTerminalBlock(outEl, `${getUnifiedTerminalPs1(unifiedTerminalMode, unifiedTerminalShell)} ${sc}`, {
          color: "#00d4ff",
          instant: true,
        });
      }
      await executeUnifiedCliCommand(sc);
      $("#guardian-fullscreen-term")?.focus();
    });
  });

  // 1. Master Unified Suomynona Council Black CLI Terminal
  setupDirectTypingTerminal({
    termSelector: "#guardian-fullscreen-term",
    outSelector: "#guardian-out",
    typedSelector: "#guardian-direct-typed",
    ghostSelector: "#guardian-direct-ghost",
    suggestionsSelector: "#guardian-tab-suggestions",
    placeholderSelector: "#guardian-direct-placeholder",
    scope: "council",
    welcomeText: COUNCIL_NG_GRAPHICAL_ASCII_BANNER,
    helpText: MASTER_UNIFIED_CLI_HELP_TEXT,
    ps1: () => getUnifiedTerminalPs1(unifiedTerminalMode, unifiedTerminalShell),
    onExecute: async (cmd, appendLine) => {
      await executeUnifiedCliCommand(cmd, appendLine);
    },
  });

  // 2. Auxiliary Multi-Host GPU CLI Direct-Typing Terminal
  setupDirectTypingTerminal({
    termSelector: "#cli-fullscreen-term",
    outSelector: "#cli-out",
    typedSelector: "#cli-direct-typed",
    ghostSelector: "#cli-direct-ghost",
    suggestionsSelector: "#cli-cmd-suggestions",
    placeholderSelector: "#cli-direct-placeholder",
    scope: "colab",
    welcomeText: COUNCIL_NG_GRAPHICAL_ASCII_BANNER,
    helpText: COLAB_MULTIHOST_CLI_HELP_TEXT,
    ps1: () => $("#cli-prompt-prefix")?.textContent || "gpu-cli [ALL HOSTS]>",
    onExecute: async (cmd, _appendLine) => {
      await runCliTerm(false, cmd, $("#cli-out"));
    },
  });

  // Attach universal command history & autocomplete to inputs
  attachUniversalCliHistory($("#council-term-input"), "drawer");
  attachUniversalCliHistory($("#guardian-input"), "master");
  attachInputAutocomplete($("#council-term-input"), {
    ghostEl: $("#council-term-ghost"),
    suggestionsEl: $("#council-term-suggestions"),
    scope: "council",
  });
}

// ============================================================================
// INTERACTIVE SUOMYNONA COUNCIL SECTION CLIs
// - Predictions ONLY pop up in the input section when the user starts typing!
// - Linked Buckets, Vault Models, 19 Boosters & Host GPU Slots render inside the CLI!
// ============================================================================

function createGuidedSectionCli(cfg) {
  const logEl = $(cfg.logSelector);
  const choicesEl = $(cfg.choicesSelector);
  const inputEl = $(cfg.inputSelector);
  const ghostEl = $(cfg.ghostSelector);
  const sendBtn = $(cfg.sendSelector || cfg.inputSelector.replace("-input", "-send"));
  const resetBtn = $(cfg.resetSelector || cfg.inputSelector.replace("-input", "-reset")) || $(cfg.inputSelector.replace("-input", "-reset-btn"));
  if (!logEl || !inputEl) return null;

  attachUniversalCliHistory(inputEl, cfg.cliKey || "section");

  let activeFlow = null; // { id, stepIdx, data, steps }
  let currentChoices = [];
  let currentPredictions = [];
  let tabCycleIdx = 0;

  // Create floating input-section autocomplete box attached to the input row (only visible when typing!)
  const inputRow = inputEl.closest(".section-cli-input-row");
  let suggestBoxEl = inputRow?.querySelector(".section-cli-inline-suggest-box");
  if (inputRow && !suggestBoxEl) {
    suggestBoxEl = document.createElement("div");
    suggestBoxEl.className = "section-cli-inline-suggest-box hidden";
    inputRow.appendChild(suggestBoxEl);
  }

  function streamText(text, color = "#e2e8f0", instant = false) {
    appendTypedTerminalBlock(logEl, text, {
      color,
      marginBottom: "4px",
      instant,
    });
  }

  function appendInteractiveDom(builderFn) {
    const panel = document.createElement("div");
    panel.className = "in-cli-interactive-panel";
    builderFn(panel);
    logEl.appendChild(panel);
    logEl.scrollTop = logEl.scrollHeight;
    return panel;
  }

  // Only show step choices when actively inside a multi-choice question step; never clutter the idle CLI!
  function setChoicesAndPredictions(choices = [], predictions = [], showPills = false) {
    currentChoices = choices;
    currentPredictions = predictions;
    tabCycleIdx = 0;
    if (choicesEl) {
      choicesEl.innerHTML = "";
      if (showPills && choices.length) {
        choices.forEach((c) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "section-cli-choice-pill";
          btn.textContent = c.label;
          btn.onclick = () => {
            handleUserInput(c.value);
          };
          choicesEl.appendChild(btn);
        });
      }
    }
    updateGhostHint();
  }

  function getTabCandidates(filterText = "") {
    const raw = String(filterText || "").trim();
    if (!raw) return []; // Do not suggest anything when the user hasn't started typing!
    const v = raw.toLowerCase();

    const pool = [
      ...(cfg.autocompleteCatalog || []),
      ...currentPredictions.map((p) =>
        typeof p === "string" ? { label: p, value: p } : { label: p.label || p.value, value: p.value }
      ),
      ...currentChoices
        .filter((c) => c.value !== "cancel")
        .map((c) => ({ label: c.label, value: c.value })),
      ...(cfg.mainChoices || []).map((c) => ({ label: c.label, value: c.value })),
      ...(cfg.mainPredictions || []).map((p) =>
        typeof p === "string" ? { label: p, value: p } : { label: p.label || p.value, value: p.value }
      ),
    ];

    // Deduplicate by value
    const seen = new Set();
    const unique = [];
    for (const item of pool) {
      const valStr = String(item.value || "").trim();
      if (!valStr || seen.has(valStr.toLowerCase())) continue;
      seen.add(valStr.toLowerCase());
      unique.push({ label: item.label || valStr, value: valStr });
    }

    // Prioritize prefix matches on value or label, then substring matches
    const prefixMatches = unique.filter(
      (c) => c.value.toLowerCase().startsWith(v) || c.label.toLowerCase().startsWith(v)
    );
    const subMatches = unique.filter(
      (c) =>
        !prefixMatches.includes(c) &&
        (c.value.toLowerCase().includes(v) || c.label.toLowerCase().includes(v))
    );
    return [...prefixMatches, ...subMatches].slice(0, 6);
  }

  function updateGhostHint() {
    const typed = (inputEl.value || "").trim();
    if (!typed) {
      if (ghostEl) ghostEl.textContent = "";
      if (suggestBoxEl) {
        suggestBoxEl.innerHTML = "";
        suggestBoxEl.classList.add("hidden");
      }
      return;
    }

    const candidates = getTabCandidates(typed);
    if (!candidates.length) {
      if (ghostEl) ghostEl.textContent = "";
      if (suggestBoxEl) {
        suggestBoxEl.innerHTML = "";
        suggestBoxEl.classList.add("hidden");
      }
      return;
    }

    const pick = candidates[tabCycleIdx % candidates.length];
    if (ghostEl) {
      ghostEl.textContent = `↹ Tab: ${pick.value}`;
      ghostEl.onclick = () => {
        inputEl.value = pick.value;
        inputEl.focus();
        updateGhostHint();
      };
    }

    if (suggestBoxEl) {
      suggestBoxEl.innerHTML = `<span style="font-size:10.5px;color:#94a3b8;align-self:center;margin-right:4px">↹ Complete input:</span>`;
      candidates.forEach((cand, idx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "cli-suggestion-chip" + (idx === tabCycleIdx % candidates.length ? " active" : "");
        chip.innerHTML = `<span>${esc(cand.value)}</span>${cand.label !== cand.value ? `<span class="chip-kind">${esc(cand.label)}</span>` : ""}`;
        chip.addEventListener("mousedown", (e) => {
          e.preventDefault();
          inputEl.value = cand.value;
          inputEl.focus();
          updateGhostHint();
        });
        suggestBoxEl.appendChild(chip);
      });
      suggestBoxEl.classList.remove("hidden");
    }
  }

  function showMainMenu(instant = false) {
    activeFlow = null;
    if (logEl.children.length === 0) {
      streamText(`◈ SUOMYNONA COUNCIL [${(cfg.headerTitle || cfg.cliKey || "CLI").toUpperCase()}] · Ready (Type '/commands' or '/cmd' for all commands, '<cmd> -h' for help)`, "#2ee6a6", true);
    }
    if (cfg.menuPrompt) {
      streamText(cfg.menuPrompt, "#93c5fd", instant);
    }
    // Keep choicesEl empty when idle so no [1]..[8] or static Predict pills clutter the screen
    setChoicesAndPredictions(cfg.mainChoices || [], cfg.mainPredictions || [], false);
    if (cfg.onRenderDefaultView && logEl.querySelectorAll(".in-cli-interactive-panel").length === 0) {
      cfg.onRenderDefaultView({ appendInteractiveDom, streamText, startFlow, handleUserInput });
    }
  }

  async function runCurrentStepQuestion() {
    if (!activeFlow) return;
    const step = activeFlow.steps[activeFlow.stepIdx];
    if (!step) {
      const finishFn = activeFlow.onComplete;
      const collected = { ...activeFlow.data };
      activeFlow = null;
      setChoicesAndPredictions([], [], false);
      if (finishFn) {
        await finishFn(collected, streamText, { appendInteractiveDom });
      }
      if (cfg.onRenderDefaultView) {
        cfg.onRenderDefaultView({ appendInteractiveDom, streamText, startFlow, handleUserInput });
      }
      return;
    }
    const qText = typeof step.question === "function" ? step.question(activeFlow.data) : step.question;
    streamText(`❓ ${qText}`, "#fde68a", false);
    const stepChoices = typeof step.choices === "function" ? step.choices(activeFlow.data) : step.choices || [];
    const stepPreds = typeof step.predictions === "function" ? step.predictions(activeFlow.data) : step.predictions || [];
    setChoicesAndPredictions(
      [
        ...stepChoices,
        { label: "[cancel] Exit Prompt", value: "cancel" },
      ],
      stepPreds,
      true
    );
    if (step.placeholder && inputEl) {
      inputEl.placeholder = step.placeholder;
    }
    inputEl.focus();
  }

  async function startFlow(flowDef) {
    if (!flowDef) return;
    if (!flowDef.steps || !flowDef.steps.length) {
      if (flowDef.onComplete) {
        await flowDef.onComplete({}, streamText, { appendInteractiveDom });
      }
      return;
    }
    activeFlow = {
      id: flowDef.id,
      stepIdx: 0,
      data: { ...(flowDef.initialData || {}) },
      steps: flowDef.steps,
      onComplete: flowDef.onComplete,
    };
    streamText(`▶ ${flowDef.title} (type 'cancel' anytime to exit)`, "#60a5fa", true);
    await runCurrentStepQuestion();
  }

  async function handleUserInput(rawInput) {
    const val = String(rawInput ?? "").trim();
    if (!val && !activeFlow) return;

    if (inputEl?._pushCliHistory) inputEl._pushCliHistory(val);

    streamText(`${cfg.ps1 || "suomynona@council❯"} ${val || "(default)"}`, "#00d4ff", true);
    if (inputEl) inputEl.value = "";
    updateGhostHint();

    const lower = val.toLowerCase();
    if (lower === "clear" || lower === "cls" || lower === "/clear") {
      clearTerminalContainer(logEl);
      showMainMenu(true);
      return;
    }
    if (lower === "cancel" || lower === "exit" || lower === "menu" || lower === "q") {
      activeFlow = null;
      setChoicesAndPredictions([], [], false);
      streamText("↩ Returned to main CLI prompt.", "#94a3b8", true);
      return;
    }

    if (val.endsWith(" -h") || val.endsWith(" --help") || val === "-h" || val === "--help" || val === "/?") {
      renderCliCommandHelp(val, cfg.cliKey, streamText);
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
      renderCliCommandsList(cfg.cliKey, cfg.autocompleteCatalog, streamText, logEl);
      return;
    }

    // Intercept slash GUI Configurator Pop-up commands in any section CLI too
    if (lower.startsWith("/")) {
      const slashToken = lower.slice(1).trim();
      if (SLASH_CONFIG_REGISTRY[slashToken] || SLASH_CONFIG_ALIASES[slashToken]) {
        const targetCfg = SLASH_CONFIG_ALIASES[slashToken] || slashToken;
        streamText(`🗔 Opening [/${targetCfg}] GUI Configurator Pop-up Window...`, "#c4b5fd", true);
        openSlashConfigPopupWindow(targetCfg);
        return;
      }
    }

    if (activeFlow) {
      const step = activeFlow.steps[activeFlow.stepIdx];
      let resolvedVal = val;
      const stepChoices = (typeof step.choices === "function" ? step.choices(activeFlow.data) : step.choices) || [];
      const byIndex = stepChoices.find((c, i) => String(i + 1) === val || String(c.value).toLowerCase() === lower);
      if (byIndex) {
        resolvedVal = byIndex.value;
      } else if (!resolvedVal && step.defaultValue !== undefined) {
        resolvedVal = step.defaultValue;
      }
      if (step.required && !resolvedVal) {
        streamText("⚠️ Please type a value or select an option above.", "#ff6b8b", true);
        return;
      }
      activeFlow.data[step.key] = resolvedVal;
      activeFlow.stepIdx++;
      await runCurrentStepQuestion();
      return;
    }

    if (cfg.onDirectCommand) {
      const handled = await cfg.onDirectCommand(val, {
        startFlow,
        streamText,
        showMainMenu,
        appendInteractiveDom,
        handleUserInput,
      });
      if (handled) return;
    }

    // Execute code / shell command via backend API so all CLIs send codes
    try {
      streamText(`⚡ Executing [${(cfg.cliKey || "CLI").toUpperCase()}]: ${val}…`, "#60a5fa", true);
      const res = await postJSON("/api/cli/execute", {
        cliKey: cfg.cliKey || "master",
        command: val,
      });
      if (res?.output) {
        streamText(res.output, "#e2e8f0", true);
      } else if (res?.error) {
        streamText(`❌ ${res.error}`, "#ff6b8b", true);
      } else {
        streamText(`✅ Executed (${res?.exit_code !== undefined ? `exit code ${res.exit_code}` : "success"})`, "#2ee6a6", true);
      }
    } catch (e) {
      streamText(`❌ Execution error: ${e?.message || e}`, "#ff6b8b", true);
    }
  }

  inputEl.addEventListener("input", () => {
    tabCycleIdx = 0;
    updateGhostHint();
  });

  inputEl.addEventListener("blur", () => {
    setTimeout(() => {
      if (suggestBoxEl) suggestBoxEl.classList.add("hidden");
    }, 160);
  });

  inputEl.addEventListener("focus", () => {
    if ((inputEl.value || "").trim()) updateGhostHint();
  });

  inputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const typed = (inputEl.value || "").trim();
      if (!typed) return; // Only autocomplete when user has started typing!
      const candidates = getTabCandidates(typed);
      if (candidates.length) {
        const pick = candidates[tabCycleIdx % candidates.length];
        inputEl.value = pick.value;
        tabCycleIdx = (tabCycleIdx + 1) % candidates.length;
        updateGhostHint();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      await handleUserInput(inputEl.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (suggestBoxEl && !suggestBoxEl.classList.contains("hidden")) {
        suggestBoxEl.classList.add("hidden");
      } else {
        await handleUserInput("cancel");
      }
    }
  });

  sendBtn?.addEventListener("click", async () => {
    await handleUserInput(inputEl.value);
  });

  resetBtn?.addEventListener("click", () => {
    clearTerminalContainer(logEl);
    showMainMenu(true);
  });

  showMainMenu(true);
  return { startFlow, streamText, showMainMenu, handleUserInput, appendInteractiveDom };
}

// ============================================================================
// IN-CLI INTERACTIVE RENDERERS (BUCKETS/VAULT, 19 BOOSTERS, HOST GPU SLOTS)
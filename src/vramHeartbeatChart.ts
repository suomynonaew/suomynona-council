import * as d3 from "d3";

export type VramChartMode = "stacked" | "pct";

export interface HostHeartbeatEntry {
  id: string;
  name?: string;
  online?: boolean;
  configured?: boolean;
  status?: string;
  latency_ms?: number | null;
  provider?: string;
  accelerator?: string;
  quantization?: string;
  context_size?: number;
  elastic_ctx?: number;
  circuit_state?: string;
  vram_gb?: number;
  model_budget_gb?: number;
  used_vram_gb?: number;
  free_vram_gb?: number;
  weights_vram_gb?: number;
  kv_vram_gb?: number;
  runtime_overhead_gb?: number;
  pressure_pct?: number;
  pressure_state?: string;
  in_flight?: number;
  assigned_models_count?: number;
  tok_per_sec_est?: number;
  url?: string;
}

export interface LoadBalancerTelemetry {
  enabled?: boolean;
  policy?: string;
  max_pressure_pct?: number;
  cluster_total_gb?: number;
  cluster_used_gb?: number;
  cluster_free_gb?: number;
  cluster_pressure_pct?: number;
  optimal_host?: string;
}

export interface HeartbeatPayload {
  ok?: boolean;
  checked_at?: string;
  hosts?: Record<string, HostHeartbeatEntry>;
  load_balancer?: LoadBalancerTelemetry;
}

interface NormalizedHostDatum {
  key: string;
  label: string;
  accelerator: string;
  quantization: string;
  online: boolean;
  configured: boolean;
  circuitState: string;
  totalGb: number;
  usedGb: number;
  freeGb: number;
  weightsGb: number;
  kvGb: number;
  overheadGb: number;
  pressurePct: number;
  capPct: number;
  capGb: number;
  isOptimal: boolean;
  inFlight: number;
  modelsCount: number;
  latencyMs: number | null;
  tokPerSec: number;
  statusColor: string;
}

interface SegmentRect {
  hostKey: string;
  segmentKey: "weights" | "kv" | "overhead";
  y0: number;
  y1: number;
  color: string;
  datum: NormalizedHostDatum;
}

declare global {
  interface Window {
    _lastHostHeartbeatPayload?: HeartbeatPayload;
    _lastHostHeartbeatMap?: Record<string, HostHeartbeatEntry>;
    _lastLoadBalancerSummary?: LoadBalancerTelemetry;
    renderD3HostVramChart?: (payload?: HeartbeatPayload) => void;
    highlightD3HostBar?: (hostKey: string | null) => void;
    openSlashConfigPopupWindow?: (tab: string) => void;
    refreshTabbedHostSetupUI?: (hostKey: string) => void;
  }
}

const HOST_KEYS = ["a", "b", "c", "d"] as const;
const SVG_WIDTH = 376;
const SVG_HEIGHT = 154;
const MARGIN = { top: 20, right: 12, bottom: 28, left: 36 };
const INNER_W = SVG_WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

const SEGMENT_COLORS = {
  weights: "#2ee6a6",
  kv: "#38bdf8",
  overhead: "#c084fc",
} as const;

let activeMode: VramChartMode = "stacked";
let hoveredHostKey: string | null = null;
let latestPayload: HeartbeatPayload | null = null;

function resolveStatusColor(pressurePct: number, circuitState: string): string {
  if (circuitState === "OPEN" || pressurePct > 90) return "#f43f5e";
  if (pressurePct >= 75) return "#f59e0b";
  return "#2ee6a6";
}

function normalizeHeartbeatData(payload: HeartbeatPayload | null): {
  rows: NormalizedHostDatum[];
  capPct: number;
  maxCapacityGb: number;
} {
  const hosts = payload?.hosts || window._lastHostHeartbeatMap || {};
  const lb = payload?.load_balancer || window._lastLoadBalancerSummary || {};
  const capPct = Math.max(50, Math.min(98, Number(lb.max_pressure_pct ?? 85)));
  const optimalHost = String(lb.optimal_host || "a").toLowerCase();

  const rows: NormalizedHostDatum[] = HOST_KEYS.map((hk) => {
    const raw = hosts[hk] || ({ id: hk } as HostHeartbeatEntry);
    const totalGb = Math.max(1, Number(raw.vram_gb ?? 96));
    const weightsGb = Math.max(0, Number(raw.weights_vram_gb ?? 0));
    const kvGb = Math.max(0, Number(raw.kv_vram_gb ?? 0));
    const overheadGb = Math.max(0, Number(raw.runtime_overhead_gb ?? 0.4));
    const sumSegs = Number((weightsGb + kvGb + overheadGb).toFixed(1));
    const usedGb = Math.max(sumSegs, Number(raw.used_vram_gb ?? sumSegs));
    const freeGb = Math.max(0, Number((raw.free_vram_gb ?? totalGb - usedGb).toFixed(1)));
    const pressurePct = Math.max(
      0,
      Number(
        (
          raw.pressure_pct ??
          Math.round((usedGb / Math.max(1, totalGb)) * 100)
        ).toFixed(1)
      )
    );
    const circuitState = String(raw.circuit_state || "CLOSED").toUpperCase();

    // If hardware-reported usedGb exceeds computed segments, attribute delta to runtime overhead
    const extraHwGb = Math.max(0, Number((usedGb - sumSegs).toFixed(1)));

    return {
      key: hk,
      label: `Host ${hk.toUpperCase()}`,
      accelerator: String(raw.accelerator || "G4"),
      quantization: String(raw.quantization || "Q4_K_M"),
      online: Boolean(raw.online),
      configured: Boolean(raw.configured || raw.online),
      circuitState,
      totalGb,
      usedGb: Number(usedGb.toFixed(1)),
      freeGb,
      weightsGb,
      kvGb,
      overheadGb: Number((overheadGb + extraHwGb).toFixed(1)),
      pressurePct,
      capPct,
      capGb: Number(((totalGb * capPct) / 100).toFixed(1)),
      isOptimal: hk === optimalHost && circuitState !== "OPEN",
      inFlight: Math.max(0, Number(raw.in_flight ?? 0)),
      modelsCount: Math.max(0, Number(raw.assigned_models_count ?? 0)),
      latencyMs: typeof raw.latency_ms === "number" ? raw.latency_ms : null,
      tokPerSec: Math.max(0, Number(raw.tok_per_sec_est ?? 0)),
      statusColor: resolveStatusColor(pressurePct, circuitState),
    };
  });

  const maxCapacityGb = Math.max(
    16,
    d3.max(rows, (d) => Math.max(d.totalGb, d.usedGb)) ?? 96
  );

  return { rows, capPct, maxCapacityGb };
}

function updateReadoutBar(datum: NormalizedHostDatum | null, rows: NormalizedHostDatum[]): void {
  const readoutEl = document.getElementById("topbar-hb-d3-readout");
  if (!readoutEl) return;

  const target =
    datum ||
    (hoveredHostKey ? rows.find((r) => r.key === hoveredHostKey) || null : null);

  if (!target) {
    const totalUsed = d3.sum(rows, (r) => r.usedGb).toFixed(1);
    const totalCap = d3.sum(rows, (r) => r.totalGb).toFixed(0);
    const opt = rows.find((r) => r.isOptimal);
    readoutEl.textContent =
      `Cluster A–D: ${totalUsed}/${totalCap} GB occupied` +
      (opt ? ` · Optimal target: ${opt.label} (${opt.freeGb.toFixed(1)}GB free)` : "") +
      ` · Hover bar for breakdown`;
    return;
  }

  const pingTxt = target.latencyMs !== null ? `${target.latencyMs}ms` : "standby";
  const tpsTxt = target.tokPerSec > 0 ? ` · ~${target.tokPerSec.toFixed(0)} tok/s` : "";
  readoutEl.textContent =
    `${target.label} (${target.accelerator} ${target.quantization}): ` +
    `W ${target.weightsGb.toFixed(1)}G + KV ${target.kvGb.toFixed(1)}G + Sys ${target.overheadGb.toFixed(1)}G ` +
    `= ${target.usedGb.toFixed(1)}/${target.totalGb}GB (${target.pressurePct.toFixed(0)}%) · ` +
    `Free ${target.freeGb.toFixed(1)}G · ${pingTxt}${tpsTxt}`;
}

function syncRowHighlight(hostKey: string | null): void {
  const listEl = document.getElementById("topbar-hosts-hb-list");
  if (!listEl) return;
  listEl.querySelectorAll<HTMLElement>("[data-hb-jump-host]").forEach((row) => {
    const rk = row.getAttribute("data-hb-jump-host");
    row.classList.toggle("is-chart-hovered", Boolean(hostKey && rk === hostKey));
  });
}

function ensureSvgScaffold(
  wrap: HTMLElement
): d3.Selection<SVGGElement, unknown, null, undefined> {
  let svg = d3.select(wrap).select<SVGSVGElement>("svg.hb-d3-svg");
  if (svg.empty()) {
    svg = d3
      .select(wrap)
      .append("svg")
      .attr("class", "hb-d3-svg")
      .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img")
      .attr("aria-label", "Real-time GPU VRAM occupancy across Hosts A through D");

    const defs = svg.append("defs");

    const optGlow = defs
      .append("filter")
      .attr("id", "hb-d3-opt-glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    optGlow
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("stdDeviation", 2.4)
      .attr("flood-color", "#2ee6a6")
      .attr("flood-opacity", 0.55);

    const rootG = svg
      .append("g")
      .attr("class", "hb-d3-root")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    rootG.append("g").attr("class", "hb-d3-grid");
    rootG.append("g").attr("class", "hb-d3-capacity-layer");
    rootG.append("g").attr("class", "hb-d3-bars-layer");
    rootG.append("g").attr("class", "hb-d3-cap-layer");
    rootG.append("g").attr("class", "hb-d3-labels-layer");
    rootG.append("g").attr("class", "hb-d3-hit-layer");
    rootG
      .append("g")
      .attr("class", "hb-d3-x-axis")
      .attr("transform", `translate(0,${INNER_H})`);
    rootG.append("g").attr("class", "hb-d3-y-axis");
  }

  return svg.select<SVGGElement>("g.hb-d3-root");
}

export function renderD3HostVramChart(payload?: HeartbeatPayload): void {
  if (payload) {
    latestPayload = payload;
    window._lastHostHeartbeatPayload = payload;
  }
  const wrap = document.getElementById("topbar-hb-d3-svg-wrap");
  if (!wrap) return;

  const { rows, capPct, maxCapacityGb } = normalizeHeartbeatData(latestPayload);
  const rootG = ensureSvgScaffold(wrap);

  const xScale = d3
    .scaleBand<string>()
    .domain(rows.map((d) => d.key))
    .range([0, INNER_W])
    .paddingInner(0.32)
    .paddingOuter(0.16);

  const yMax = activeMode === "pct" ? 100 : maxCapacityGb;
  const yScale = d3.scaleLinear().domain([0, yMax]).nice(4).range([INNER_H, 0]);
  const domainTop = yScale.domain()[1] || yMax;
  const clampVal = (v: number) => Math.max(0, Math.min(domainTop, v));

  const t = d3.transition().duration(320).ease(d3.easeCubicOut);

  // 1. Horizontal gridlines
  const yTicks = yScale.ticks(4);
  rootG
    .select<SVGGElement>("g.hb-d3-grid")
    .selectAll<SVGLineElement, number>("line.hb-grid-line")
    .data(yTicks, (d) => String(d))
    .join(
      (enter) =>
        enter
          .append("line")
          .attr("class", "hb-grid-line")
          .attr("x1", 0)
          .attr("x2", INNER_W)
          .attr("y1", (d) => yScale(d))
          .attr("y2", (d) => yScale(d))
          .attr("stroke", "rgba(148, 163, 184, 0.13)")
          .attr("stroke-dasharray", (d) => (d === 0 ? "none" : "2,3")),
      (update) =>
        update.call((u) =>
          u
            .transition(t)
            .attr("y1", (d) => yScale(d))
            .attr("y2", (d) => yScale(d))
        ),
      (exit) => exit.remove()
    );

  // 2. Axes
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(4)
    .tickSize(0)
    .tickPadding(6)
    .tickFormat((v) => (activeMode === "pct" ? `${Number(v)}%` : `${Number(v)}G`));

  const yAxisG = rootG.select<SVGGElement>("g.hb-d3-y-axis");
  yAxisG.transition(t).call(yAxis);
  yAxisG.select(".domain").remove();
  yAxisG
    .selectAll("text")
    .attr("fill", "#94a3b8")
    .attr("font-family", "'JetBrains Mono', monospace")
    .attr("font-size", "9px");

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickPadding(7)
    .tickFormat((hk) => {
      const item = rows.find((r) => r.key === hk);
      if (!item) return hk.toUpperCase();
      return `${hk.toUpperCase()} · ${item.accelerator}`;
    });

  const xAxisG = rootG.select<SVGGElement>("g.hb-d3-x-axis");
  xAxisG.call(xAxis);
  xAxisG.select(".domain").attr("stroke", "rgba(148, 163, 184, 0.28)");
  xAxisG
    .selectAll<SVGTextElement, string>("text")
    .attr("fill", (hk) => {
      const item = rows.find((r) => r.key === hk);
      if (hoveredHostKey === hk) return "#f8fafc";
      if (item?.isOptimal) return "#2ee6a6";
      return "#cbd5e1";
    })
    .attr("font-family", "'JetBrains Mono', monospace")
    .attr("font-size", "9.5px")
    .attr("font-weight", (hk) => {
      const item = rows.find((r) => r.key === hk);
      return hoveredHostKey === hk || item?.isOptimal ? "700" : "600";
    });

  const barW = xScale.bandwidth();

  // 3. Total VRAM capacity background track per host
  rootG
    .select<SVGGElement>("g.hb-d3-capacity-layer")
    .selectAll<SVGRectElement, NormalizedHostDatum>("rect.hb-cap-track")
    .data(rows, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "hb-cap-track")
          .attr("x", (d) => xScale(d.key) ?? 0)
          .attr("width", barW)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("y", INNER_H)
          .attr("height", 0)
          .call((e) =>
            e
              .transition(t)
              .attr("y", (d) =>
                yScale(clampVal(activeMode === "pct" ? 100 : d.totalGb))
              )
              .attr("height", (d) =>
                Math.max(
                  2,
                  INNER_H -
                    yScale(clampVal(activeMode === "pct" ? 100 : d.totalGb))
                )
              )
          ),
      (update) =>
        update.call((u) =>
          u
            .transition(t)
            .attr("x", (d) => xScale(d.key) ?? 0)
            .attr("width", barW)
            .attr("y", (d) =>
              yScale(clampVal(activeMode === "pct" ? 100 : d.totalGb))
            )
            .attr("height", (d) =>
              Math.max(
                2,
                INNER_H -
                  yScale(clampVal(activeMode === "pct" ? 100 : d.totalGb))
              )
            )
        ),
      (exit) => exit.remove()
    )
    .attr("fill", (d) =>
      hoveredHostKey === d.key
        ? "rgba(56, 189, 248, 0.13)"
        : "rgba(15, 23, 42, 0.82)"
    )
    .attr("stroke", (d) =>
      hoveredHostKey === d.key
        ? "rgba(56, 189, 248, 0.62)"
        : d.isOptimal
        ? "rgba(46, 230, 166, 0.42)"
        : "rgba(148, 163, 184, 0.2)"
    )
    .attr("stroke-width", (d) => (hoveredHostKey === d.key ? 1.3 : 1));

  // 4. Data-joined VRAM occupancy segments (Stacked GB vs Normalized %)
  const segments: SegmentRect[] = [];
  if (activeMode === "stacked") {
    for (const d of rows) {
      let cursor = 0;
      const parts: Array<{ key: "weights" | "kv" | "overhead"; val: number; color: string }> = [
        {
          key: "weights",
          val: d.weightsGb,
          color: d.pressurePct > 90 || d.circuitState === "OPEN" ? "#f43f5e" : SEGMENT_COLORS.weights,
        },
        { key: "kv", val: d.kvGb, color: SEGMENT_COLORS.kv },
        { key: "overhead", val: d.overheadGb, color: SEGMENT_COLORS.overhead },
      ];
      for (const p of parts) {
        if (p.val <= 0) continue;
        const next = cursor + p.val;
        segments.push({
          hostKey: d.key,
          segmentKey: p.key,
          y0: clampVal(cursor),
          y1: clampVal(next),
          color: p.color,
          datum: d,
        });
        cursor = next;
      }
    }
  } else {
    for (const d of rows) {
      segments.push({
        hostKey: d.key,
        segmentKey: "weights",
        y0: 0,
        y1: clampVal(d.pressurePct),
        color: d.statusColor,
        datum: d,
      });
    }
  }

  rootG
    .select<SVGGElement>("g.hb-d3-bars-layer")
    .selectAll<SVGRectElement, SegmentRect>("rect.hb-vram-seg")
    .data(segments, (s) => `${s.hostKey}:${s.segmentKey}`)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "hb-vram-seg")
          .attr("x", (s) => (xScale(s.hostKey) ?? 0) + 2)
          .attr("width", Math.max(4, barW - 4))
          .attr("rx", 2.5)
          .attr("ry", 2.5)
          .attr("y", INNER_H)
          .attr("height", 0)
          .attr("fill", (s) => s.color)
          .call((e) =>
            e
              .transition(t)
              .attr("y", (s) => yScale(s.y1))
              .attr("height", (s) =>
                Math.max(1.5, yScale(s.y0) - yScale(s.y1))
              )
          ),
      (update) =>
        update.call((u) =>
          u
            .transition(t)
            .attr("x", (s) => (xScale(s.hostKey) ?? 0) + 2)
            .attr("width", Math.max(4, barW - 4))
            .attr("y", (s) => yScale(s.y1))
            .attr("height", (s) =>
              Math.max(1.5, yScale(s.y0) - yScale(s.y1))
            )
            .attr("fill", (s) => s.color)
        ),
      (exit) =>
        exit.call((x) =>
          x
            .transition(t)
            .attr("y", INNER_H)
            .attr("height", 0)
            .remove()
        )
    )
    .attr("filter", (s) =>
      s.datum.isOptimal && s.segmentKey === "weights"
        ? "url(#hb-d3-opt-glow)"
        : null
    );

  // 5. Spillover Cap Threshold (Global horizontal rule in % mode, per-host cap ticks in GB mode)
  const capLayer = rootG.select<SVGGElement>("g.hb-d3-cap-layer");
  if (activeMode === "pct") {
    capLayer.selectAll("line.hb-host-cap-tick").remove();
    const capY = yScale(clampVal(capPct));
    capLayer
      .selectAll<SVGLineElement, number>("line.hb-global-cap-line")
      .data([capPct])
      .join("line")
      .attr("class", "hb-global-cap-line")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 1.15)
      .attr("stroke-dasharray", "4,3")
      .transition(t)
      .attr("y1", capY)
      .attr("y2", capY);

    capLayer
      .selectAll<SVGTextElement, number>("text.hb-cap-lbl")
      .data([capPct])
      .join("text")
      .attr("class", "hb-cap-lbl")
      .attr("x", INNER_W - 2)
      .attr("text-anchor", "end")
      .attr("fill", "#fbbf24")
      .attr("font-family", "'JetBrains Mono', monospace")
      .attr("font-size", "8.5px")
      .attr("font-weight", "700")
      .text(`CAP ${capPct}%`)
      .transition(t)
      .attr("y", Math.max(8, capY - 3));
  } else {
    capLayer.selectAll("line.hb-global-cap-line, text.hb-cap-lbl").remove();
    capLayer
      .selectAll<SVGLineElement, NormalizedHostDatum>("line.hb-host-cap-tick")
      .data(rows, (d) => d.key)
      .join("line")
      .attr("class", "hb-host-cap-tick")
      .attr("stroke", "rgba(251, 191, 36, 0.82)")
      .attr("stroke-width", 1.2)
      .attr("stroke-dasharray", "3,2")
      .transition(t)
      .attr("x1", (d) => (xScale(d.key) ?? 0) + 1)
      .attr("x2", (d) => (xScale(d.key) ?? 0) + barW - 1)
      .attr("y1", (d) => yScale(clampVal(d.capGb)))
      .attr("y2", (d) => yScale(clampVal(d.capGb)));
  }

  // 6. Top bar telemetry labels (Used GB / % + OPT star)
  rootG
    .select<SVGGElement>("g.hb-d3-labels-layer")
    .selectAll<SVGTextElement, NormalizedHostDatum>("text.hb-bar-val")
    .data(rows, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "hb-bar-val")
          .attr("text-anchor", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", "9px")
          .attr("font-weight", "700")
          .attr("x", (d) => (xScale(d.key) ?? 0) + barW / 2)
          .attr("y", INNER_H - 4),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("fill", (d) => d.statusColor)
    .text((d) => {
      const prefix = d.isOptimal ? "★" : "";
      return activeMode === "pct"
        ? `${prefix}${d.pressurePct.toFixed(0)}%`
        : `${prefix}${d.usedGb.toFixed(1)}G`;
    })
    .transition(t)
    .attr("x", (d) => (xScale(d.key) ?? 0) + barW / 2)
    .attr("y", (d) => {
      const topVal =
        activeMode === "pct"
          ? clampVal(d.pressurePct)
          : clampVal(Math.max(d.usedGb, d.totalGb));
      return Math.max(-6, yScale(topVal) - 5);
    });

  // 7. Transparent hit targets for crisp hover + click-to-configure Host A-D
  rootG
    .select<SVGGElement>("g.hb-d3-hit-layer")
    .selectAll<SVGRectElement, NormalizedHostDatum>("rect.hb-hit-col")
    .data(rows, (d) => d.key)
    .join("rect")
    .attr("class", "hb-hit-col")
    .attr("x", (d) => (xScale(d.key) ?? 0) - 3)
    .attr("y", -12)
    .attr("width", barW + 6)
    .attr("height", INNER_H + 34)
    .attr("fill", "transparent")
    .style("cursor", "pointer")
    .on("mouseenter", (_event, d) => {
      hoveredHostKey = d.key;
      syncRowHighlight(d.key);
      updateReadoutBar(d, rows);
      renderD3HostVramChart();
    })
    .on("mouseleave", () => {
      hoveredHostKey = null;
      syncRowHighlight(null);
      updateReadoutBar(null, rows);
      renderD3HostVramChart();
    })
    .on("click", (event, d) => {
      event.stopPropagation();
      window.openSlashConfigPopupWindow?.("host");
      window.refreshTabbedHostSetupUI?.(d.key);
    });

  updateReadoutBar(null, rows);
}

export function highlightD3HostBar(hostKey: string | null): void {
  const normalized = hostKey ? hostKey.toLowerCase() : null;
  if (hoveredHostKey === normalized) return;
  hoveredHostKey = normalized;
  renderD3HostVramChart();
}

function bindToolbarControls(): void {
  const panel = document.getElementById("topbar-hb-d3-panel");
  if (!panel || panel.dataset.d3Bound === "1") return;
  panel.dataset.d3Bound = "1";

  panel.querySelectorAll<HTMLButtonElement>("[data-hb-d3-mode]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nextMode = (btn.getAttribute("data-hb-d3-mode") || "stacked") as VramChartMode;
      activeMode = nextMode;
      panel.querySelectorAll<HTMLButtonElement>("[data-hb-d3-mode]").forEach((b) => {
        b.classList.toggle("on", b.getAttribute("data-hb-d3-mode") === activeMode);
      });
      const legendEl = document.getElementById("topbar-hb-d3-legend");
      if (legendEl) {
        legendEl.dataset.mode = activeMode;
      }
      renderD3HostVramChart();
    });
  });
}

function initVramChartModule(): void {
  window.renderD3HostVramChart = renderD3HostVramChart;
  window.highlightD3HostBar = highlightD3HostBar;

  bindToolbarControls();

  window.addEventListener("suomynona:heartbeat-updated", (ev: Event) => {
    bindToolbarControls();
    const customEv = ev as CustomEvent<HeartbeatPayload>;
    renderD3HostVramChart(customEv.detail);
  });

  if (window._lastHostHeartbeatPayload || window._lastHostHeartbeatMap) {
    renderD3HostVramChart(
      window._lastHostHeartbeatPayload || {
        ok: true,
        hosts: window._lastHostHeartbeatMap,
        load_balancer: window._lastLoadBalancerSummary,
      }
    );
  } else {
    renderD3HostVramChart();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVramChartModule);
} else {
  initVramChartModule();
}

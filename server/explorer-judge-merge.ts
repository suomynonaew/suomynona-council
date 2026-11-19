import fs from "fs";
import path from "path";
import os from "os";
import vm from "vm";
import crypto from "crypto";
import { execFileSync } from "child_process";
import { getEffectivePythonBin } from "./platform.ts";
import {
  WORKSPACE_OUTPUT_ROOT,
  readConf,
  getValidGeminiApiKey,
  loadCustomCatalog,
  loadCustomSlots,
  sanitizeParsedRelativeFilePath,
  pushLiveConsole,
} from "./state-and-hosts.ts";
import {
  callOpenAiCompatibleProvider,
  callAnthropicProvider,
  callOrcaRouterModel,
  callGeminiServerEngine,
} from "./vram-and-inference.ts";

export interface CuratedCodingModel {
  id: string;
  name: string;
  hf_repo: string;
  quant_hint: string;
  ollama_tag: string;
  vram_gb: number;
  role: "coder" | "judge";
  why: string;
}

export const CURATED_CODING_MODELS: CuratedCodingModel[] = [
  {
    id: "qwen25-coder-32b",
    name: "Qwen 2.5 Coder 32B Instruct",
    hf_repo: "Qwen/Qwen2.5-Coder-32B-Instruct-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "qwen2.5-coder:32b",
    vram_gb: 20,
    role: "coder",
    why: "Flagship local multi-file code merger & full-stack refactorer (~20 GB VRAM Q4_K_M).",
  },
  {
    id: "qwen3-coder-30b-a3b",
    name: "Qwen3 Coder 30B-A3B Instruct (MoE)",
    hf_repo: "unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "qwen3-coder:30b",
    vram_gb: 19,
    role: "coder",
    why: "Mixture-of-Experts coding model (30B total, ~3B active per token) for fast cross-file merging.",
  },
  {
    id: "qwen25-coder-14b",
    name: "Qwen 2.5 Coder 14B Instruct",
    hf_repo: "Qwen/Qwen2.5-Coder-14B-Instruct-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "qwen2.5-coder:14b",
    vram_gb: 10,
    role: "coder",
    why: "Best mid-VRAM local coder for 12–16 GB GPUs; strong TypeScript, Python & diff reconciliation.",
  },
  {
    id: "qwen25-coder-7b",
    name: "Qwen 2.5 Coder 7B Instruct",
    hf_repo: "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "qwen2.5-coder:7b",
    vram_gb: 5,
    role: "coder",
    why: "Fast lightweight local coder for 6–8 GB GPUs or CPU offloading.",
  },
  {
    id: "deepseek-r1-32b",
    name: "DeepSeek R1 Distill Qwen 32B (Judge)",
    hf_repo: "unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "deepseek-r1:32b",
    vram_gb: 20,
    role: "judge",
    why: "High-accuracy local reasoning Judge for finding subtle API, import, and logic conflicts.",
  },
  {
    id: "codestral-22b",
    name: "Codestral 22B v0.1",
    hf_repo: "bartowski/Codestral-22B-v0.1-GGUF",
    quant_hint: "q4_k_m",
    ollama_tag: "codestral:22b",
    vram_gb: 14,
    role: "coder",
    why: "Mistral's dedicated code synthesis & fill-in-the-middle specialist (~14 GB VRAM).",
  },
];

export interface ExplorerFileInput {
  path: string;
  content: string;
  language?: string;
  modelName?: string;
  fromRunId?: string;
  source?: string;
}

export interface ImportedSymbolGroup {
  from: string;
  names: string[];
}

export interface StaticFileAnalysis {
  path: string;
  ext: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  lineCount: number;
  byteSize: number;
  imports: string[];
  importedSymbols: ImportedSymbolGroup[];
  exports: string[];
  hasWildcardExport: boolean;
  routes: string[];
  htmlIds: string[];
  referencedIds: string[];
  hasPlaceholders: boolean;
}

export interface CompatibilityConflict {
  severity: "high" | "medium" | "low";
  path: string;
  relatedPath?: string;
  message: string;
  suggestion: string;
}

export interface FileMatrixEntry {
  path: string;
  status: "clean_merge" | "needs_ai_merge" | "conflict";
  score: number;
  recommended_model: string;
  candidate_count: number;
  candidates: Array<{
    modelName: string;
    fromRunId?: string;
    lineCount: number;
    byteSize: number;
    valid: boolean;
    hasPlaceholders: boolean;
    errors: string[];
    warnings: string[];
    exportsCount: number;
    importsCount: number;
    score: number;
  }>;
  note: string;
}

export interface AvailableCodingModel {
  id: string;
  name: string;
  provider: string;
  strength: "high" | "medium" | "light";
  is_coding_specialist: boolean;
  size_label: string;
  available: boolean;
  note: string;
}

export interface HfDownloadJob {
  id: string;
  repo: string;
  filename: string;
  dest_path: string;
  status: "starting" | "downloading" | "completed" | "failed" | "cancelled";
  downloaded_bytes: number;
  total_bytes: number;
  percent: number;
  error?: string;
  started_at: string;
  updated_at: string;
}

const _activeDownloads = new Map<string, HfDownloadJob>();
const _downloadAborts = new Map<string, AbortController>();

function normalizeRelPath(raw: string): string {
  return sanitizeParsedRelativeFilePath(raw) || String(raw || "").replace(/\\/g, "/").replace(/^\/+/, "").trim();
}

function checkDelimitersLight(text: string): string[] {
  const warnings: string[] = [];
  let braces = 0;
  let parens = 0;
  let brackets = 0;
  let inSingle = false;
  let inDouble = false;
  let inTick = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    const prev = i > 0 ? text[i - 1] : "";

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inSingle) {
      if (ch === "'" && prev !== "\\") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === '"' && prev !== "\\") inDouble = false;
      continue;
    }
    if (inTick) {
      if (ch === "`" && prev !== "\\") inTick = false;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === "'") inSingle = true;
    else if (ch === '"') inDouble = true;
    else if (ch === "`") inTick = true;
    else if (ch === "{") braces++;
    else if (ch === "}") braces--;
    else if (ch === "(") parens++;
    else if (ch === ")") parens--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
  }

  if (Math.abs(braces) > 1) warnings.push(`Unbalanced curly braces (delta ${braces > 0 ? "+" : ""}${braces})`);
  if (Math.abs(parens) > 2) warnings.push(`Unbalanced parentheses (delta ${parens > 0 ? "+" : ""}${parens})`);
  if (Math.abs(brackets) > 2) warnings.push(`Unbalanced square brackets (delta ${brackets > 0 ? "+" : ""}${brackets})`);
  return warnings;
}

export function analyzeFileStatic(file: ExplorerFileInput): StaticFileAnalysis {
  const normPath = normalizeRelPath(file.path || "untitled.txt");
  const ext = path.extname(normPath).toLowerCase().replace(/^\./, "") || String(file.language || "txt").toLowerCase();
  const content = String(file.content ?? "");
  const lines = content.split(/\r?\n/);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content.trim()) {
    errors.push("File is empty.");
  }

  // 1. Real Syntax Checks
  if (content.trim()) {
    if (ext === "json") {
      try {
        JSON.parse(content);
      } catch (e: any) {
        errors.push(`JSON syntax error: ${e?.message || "Invalid JSON"}`);
      }
    } else if (ext === "js" || ext === "cjs" || ext === "mjs") {
      const looksEsm = ext === "mjs" || /^\s*(import\s+|export\s+)/m.test(content);
      if (!looksEsm) {
        try {
          new vm.Script(content, { filename: normPath });
        } catch (e: any) {
          errors.push(`JS syntax error: ${e?.message || String(e)}`);
        }
      } else {
        const tmpFile = path.join(os.tmpdir(), `agx_chk_${Date.now()}_${crypto.randomBytes(3).toString("hex")}.mjs`);
        try {
          fs.writeFileSync(tmpFile, content, "utf-8");
          execFileSync(process.execPath, ["--check", tmpFile], { timeout: 4000, stdio: "pipe" });
        } catch (e: any) {
          const stderr = String(e?.stderr || e?.message || "").split(/\r?\n/).slice(0, 3).join(" ").trim();
          errors.push(`ESM syntax error: ${stderr || "Failed node --check"}`);
        } finally {
          try {
            if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
          } catch {}
        }
      }
    } else if (ext === "py") {
      const tmpPy = path.join(os.tmpdir(), `agx_py_${Date.now()}_${crypto.randomBytes(3).toString("hex")}.py`);
      const pyCacheDir = path.join(os.tmpdir(), "__pycache__");
      try {
        fs.writeFileSync(tmpPy, content, "utf-8");
        execFileSync(getEffectivePythonBin(), ["-m", "py_compile", tmpPy], { timeout: 4000, stdio: "pipe" });
      } catch (e: any) {
        if (e?.code !== "ENOENT") {
          const stderr = String(e?.stderr || e?.message || "").trim();
          if (stderr) errors.push(`Python compile error: ${stderr.slice(0, 220)}`);
        }
      } finally {
        try {
          if (fs.existsSync(tmpPy)) fs.unlinkSync(tmpPy);
        } catch {}
        try {
          if (fs.existsSync(pyCacheDir)) {
            const base = path.basename(tmpPy, ".py");
            for (const f of fs.readdirSync(pyCacheDir)) {
              if (f.startsWith(base)) fs.unlinkSync(path.join(pyCacheDir, f));
            }
          }
        } catch {}
      }
    } else if (["ts", "tsx", "jsx", "go", "css", "java", "rs"].includes(ext)) {
      warnings.push(...checkDelimitersLight(content));
    }
  }

  // 2. Placeholder / Truncation Detection
  const hasPlaceholders =
    /\b(?:TODO|FIXME)\b|implement\s+(?:this\s+)?here|\.\.\.\s*(?:rest of|existing code|remaining)|\/\/\s*\.\.\.\s*$|#\s*\.\.\.\s*$/im.test(
      content
    );
  if (hasPlaceholders) {
    warnings.push("Contains placeholder or ellipsis comments (TODO/FIXME/...).");
  }

  // 3. Symbol, Import, Route & DOM ID Extraction
  const imports = new Set<string>();
  const importedSymbols: ImportedSymbolGroup[] = [];
  const exports = new Set<string>();
  let hasWildcardExport = false;
  const routes = new Set<string>();
  const htmlIds = new Set<string>();
  const referencedIds = new Set<string>();

  if (["js", "cjs", "mjs", "ts", "tsx", "jsx"].includes(ext)) {
    const namedImportRe = /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
    for (const m of content.matchAll(namedImportRe)) {
      const modPath = m[2].trim();
      imports.add(modPath);
      const names = m[1]
        .split(",")
        .map((s) => s.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0]?.trim())
        .filter(Boolean);
      if (modPath.startsWith(".") && names.length) {
        importedSymbols.push({ from: modPath, names });
      }
    }
    for (const m of content.matchAll(/import\s+(?!type\b)[^;\n]*?from\s+["']([^"']+)["']/g)) {
      imports.add(m[1].trim());
    }
    for (const m of content.matchAll(/import\s+["']([^"']+)["']/g)) {
      imports.add(m[1].trim());
    }
    for (const m of content.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)) {
      imports.add(m[1].trim());
    }

    for (const m of content.matchAll(
      /export\s+(?:async\s+)?(?:function\*?|const|let|var|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g
    )) {
      exports.add(m[1]);
    }
    for (const m of content.matchAll(/export\s*\{([^}]+)\}(?!\s*from)/g)) {
      m[1]
        .split(",")
        .map((s) => s.trim().split(/\s+as\s+/).pop()?.trim())
        .filter(Boolean)
        .forEach((n) => exports.add(n as string));
    }
    if (/export\s+default\b/.test(content)) {
      exports.add("default");
      hasWildcardExport = true;
    }
    if (/module\.exports\b|exports\.[A-Za-z_$]/.test(content)) {
      hasWildcardExport = true;
      for (const m of content.matchAll(/exports\.([A-Za-z_$][\w$]*)\s*=/g)) {
        exports.add(m[1]);
      }
    }
    for (const m of content.matchAll(/(?:app|router)\.(get|post|put|patch|delete)\(\s*["']([^"']+)["']/g)) {
      routes.add(`${m[1].toUpperCase()} ${m[2]}`);
    }
    for (const m of content.matchAll(/(?:getElementById\(\s*["']([^"']+)["']\s*\)|querySelector\(\s*["']#([A-Za-z0-9_-]+)["']\s*\))/g)) {
      const id = m[1] || m[2];
      if (id) referencedIds.add(id);
    }
  } else if (ext === "py") {
    for (const m of content.matchAll(/^\s*from\s+([.\w]+)\s+import\s+([^\r\n]+)/gm)) {
      const modPath = m[1].trim();
      imports.add(modPath);
      const names = m[2]
        .split(",")
        .map((s) => s.trim().split(/\s+as\s+/)[0]?.trim())
        .filter((s) => s && s !== "*");
      if (modPath.startsWith(".") && names.length) {
        importedSymbols.push({ from: modPath, names });
      }
    }
    for (const m of content.matchAll(/^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)|^\s*class\s+([A-Za-z_]\w*)/gm)) {
      const sym = m[1] || m[2];
      if (sym && !sym.startsWith("_")) exports.add(sym);
    }
    for (const m of content.matchAll(/@(?:app|router|bp)\.(get|post|put|patch|delete|route)\(\s*["']([^"']+)["']/g)) {
      routes.add(`${m[1].toUpperCase()} ${m[2]}`);
    }
  } else if (ext === "go") {
    for (const m of content.matchAll(/^func\s+([A-Z][\w]*)\s*\(/gm)) {
      exports.add(m[1]);
    }
  } else if (ext === "html" || ext === "htm") {
    for (const m of content.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
      imports.add(m[1].trim());
    }
    for (const m of content.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) {
      const href = m[1].trim();
      if (!/^#|mailto:|javascript:/i.test(href)) imports.add(href);
    }
    for (const m of content.matchAll(/\sid=["']([A-Za-z0-9_:-]+)["']/gi)) {
      htmlIds.add(m[1]);
    }
  }

  return {
    path: normPath,
    ext,
    valid: errors.length === 0,
    errors,
    warnings,
    lineCount: lines.length,
    byteSize: Buffer.byteLength(content, "utf-8"),
    imports: Array.from(imports),
    importedSymbols,
    exports: Array.from(exports),
    hasWildcardExport,
    routes: Array.from(routes),
    htmlIds: Array.from(htmlIds),
    referencedIds: Array.from(referencedIds),
    hasPlaceholders,
  };
}

function resolveRelativeTarget(fromPath: string, spec: string, knownPaths: Set<string>): string | null {
  if (!spec || /^(https?:|data:|\/\/)/i.test(spec)) return null;
  const fromDir = path.posix.dirname(normalizeRelPath(fromPath));
  const rawJoin = spec.startsWith(".") ? path.posix.normalize(path.posix.join(fromDir === "." ? "" : fromDir, spec)) : normalizeRelPath(spec);

  const candidates = [
    rawJoin,
    `${rawJoin}.ts`,
    `${rawJoin}.tsx`,
    `${rawJoin}.js`,
    `${rawJoin}.mjs`,
    `${rawJoin}.cjs`,
    `${rawJoin}.py`,
    `${rawJoin}/index.ts`,
    `${rawJoin}/index.js`,
  ];
  const baseStripped = rawJoin.replace(/\.(js|mjs|cjs|ts|tsx|jsx)$/i, "");
  if (baseStripped !== rawJoin) {
    candidates.push(`${baseStripped}.ts`, `${baseStripped}.tsx`, `${baseStripped}.js`);
  }

  for (const c of candidates) {
    if (knownPaths.has(c)) return c;
  }
  return null;
}

function lineOverlapRatio(a: string, b: string): number {
  if (a === b) return 1;
  const linesA = new Set(a.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  const linesB = new Set(b.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  if (!linesA.size && !linesB.size) return 1;
  if (!linesA.size || !linesB.size) return 0;
  let shared = 0;
  for (const l of linesA) if (linesB.has(l)) shared++;
  return (2 * shared) / (linesA.size + linesB.size);
}

export function buildCompatibilityReport(
  files: ExplorerFileInput[],
  existingWorkspaceFiles: ExplorerFileInput[] = []
): {
  overall_compatibility_score: number;
  conflicts: CompatibilityConflict[];
  file_matrix: FileMatrixEntry[];
  clean_winner_files: ExplorerFileInput[];
} {
  const byPath = new Map<string, Array<{ raw: ExplorerFileInput; analysis: StaticFileAnalysis }>>();

  for (const f of files || []) {
    const normP = normalizeRelPath(f.path || "main.txt");
    const analysis = analyzeFileStatic({ ...f, path: normP });
    const list = byPath.get(normP) || [];
    list.push({ raw: { ...f, path: normP }, analysis });
    byPath.set(normP, list);
  }

  const wsAnalyses = new Map<string, { raw: ExplorerFileInput; analysis: StaticFileAnalysis }>();
  for (const wf of existingWorkspaceFiles || []) {
    const normP = normalizeRelPath(wf.path || "");
    if (!normP) continue;
    wsAnalyses.set(normP, { raw: { ...wf, path: normP }, analysis: analyzeFileStatic({ ...wf, path: normP }) });
  }

  const allKnownPaths = new Set<string>([...byPath.keys(), ...wsAnalyses.keys()]);
  const conflicts: CompatibilityConflict[] = [];
  const file_matrix: FileMatrixEntry[] = [];
  const clean_winner_files: ExplorerFileInput[] = [];
  const pickedByPath = new Map<string, { raw: ExplorerFileInput; analysis: StaticFileAnalysis }>();

  const scoreCandidate = (a: StaticFileAnalysis) => {
    let s = 60;
    if (a.valid) s += 25;
    else s -= 35;
    if (!a.hasPlaceholders) s += 10;
    else s -= 15;
    s -= Math.min(15, a.warnings.length * 4);
    if (a.lineCount >= 12) s += 5;
    return Math.max(5, Math.min(100, s));
  };

  for (const [normP, cands] of byPath.entries()) {
    const scored = cands
      .map((c) => ({ ...c, candScore: scoreCandidate(c.analysis) }))
      .sort((a, b) => b.candScore - a.candScore || b.analysis.lineCount - a.analysis.lineCount);

    const winner = scored[0];
    pickedByPath.set(normP, { raw: winner.raw, analysis: winner.analysis });

    for (const c of scored) {
      for (const err of c.analysis.errors) {
        conflicts.push({
          severity: "high",
          path: normP,
          message: `[${c.raw.modelName || "Model"}] ${err}`,
          suggestion: "Run Merge Agent to fix syntax errors or pick a passing candidate.",
        });
      }
      if (c.analysis.hasPlaceholders) {
        conflicts.push({
          severity: "medium",
          path: normP,
          message: `[${c.raw.modelName || "Model"}] Contains TODO/FIXME or truncation markers.`,
          suggestion: "Use Merge Agent to fill in incomplete sections before running.",
        });
      }
    }

    let status: "clean_merge" | "needs_ai_merge" | "conflict" = "clean_merge";
    let note = "Single valid file ready to stage.";

    if (!winner.analysis.valid) {
      status = "conflict";
      note = winner.analysis.errors[0] || "Syntax error detected.";
    } else if (scored.length > 1) {
      const contents = scored.map((c) => c.raw.content);
      const allIdentical = contents.every((t) => t === contents[0]);
      if (allIdentical) {
        status = "clean_merge";
        note = `${scored.length} models produced identical implementations.`;
      } else {
        const sim = lineOverlapRatio(scored[0].raw.content, scored[1].raw.content);
        const pct = Math.round(sim * 100);
        if (sim >= 0.72 && !scored[0].analysis.hasPlaceholders) {
          status = "needs_ai_merge";
          note = `${scored.length} implementations (~${pct}% line overlap). Winner leads cleanly; Merge Agent can unify minor differences.`;
          conflicts.push({
            severity: "low",
            path: normP,
            message: `${scored.length} models generated differing versions of \`${normP}\` (~${pct}% similar).`,
            suggestion: `Best single version is from ${winner.raw.modelName || "Model"}, or merge both with Merge Agent.`,
          });
        } else {
          status = "conflict";
          note = `${scored.length} divergent implementations (~${pct}% overlap) — compare side-by-side or run Merge Agent.`;
          conflicts.push({
            severity: "medium",
            path: normP,
            message: `${scored.length} divergent versions of \`${normP}\` (${scored.map((s) => `${s.raw.modelName || "Model"} (${s.analysis.lineCount}L)`).join(" vs ")}).`,
            suggestion: "Compare in Judge & Compare or combine features with the Coding Merge Agent.",
          });
        }
      }
    } else if (wsAnalyses.has(normP)) {
      const wsCand = wsAnalyses.get(normP)!;
      if (wsCand.raw.content !== winner.raw.content) {
        status = "needs_ai_merge";
        note = `Differs from existing Active Project version (${wsCand.analysis.lineCount}L vs ${winner.analysis.lineCount}L).`;
      } else {
        note = "Matches existing Active Project file cleanly.";
      }
    }

    const rowScore = Math.max(
      10,
      winner.candScore - (status === "conflict" ? 18 : status === "needs_ai_merge" ? 6 : 0)
    );

    file_matrix.push({
      path: normP,
      status,
      score: rowScore,
      recommended_model: winner.raw.modelName || "Model",
      candidate_count: scored.length,
      candidates: scored.map((c) => ({
        modelName: c.raw.modelName || "Model",
        fromRunId: c.raw.fromRunId,
        lineCount: c.analysis.lineCount,
        byteSize: c.analysis.byteSize,
        valid: c.analysis.valid,
        hasPlaceholders: c.analysis.hasPlaceholders,
        errors: c.analysis.errors,
        warnings: c.analysis.warnings,
        exportsCount: c.analysis.exports.length,
        importsCount: c.analysis.imports.length,
        score: c.candScore,
      })),
      note,
    });

    clean_winner_files.push(winner.raw);
  }

  // Cross-file import & export checks on winning set (+ workspace fallback)
  const combinedAnalysisMap = new Map<string, StaticFileAnalysis>();
  for (const [p, v] of wsAnalyses.entries()) combinedAnalysisMap.set(p, v.analysis);
  for (const [p, v] of pickedByPath.entries()) combinedAnalysisMap.set(p, v.analysis);

  const combinedHtmlIds = new Set<string>();
  for (const a of combinedAnalysisMap.values()) {
    a.htmlIds.forEach((id) => combinedHtmlIds.add(id));
  }

  for (const [normP, { analysis }] of pickedByPath.entries()) {
    for (const imp of analysis.imports) {
      if (!imp.startsWith(".") && analysis.ext !== "html" && analysis.ext !== "htm") continue;
      if (/^(https?:|data:|\/\/|#|mailto:)/i.test(imp)) continue;
      const targetPath = resolveRelativeTarget(normP, imp, allKnownPaths);
      if (!targetPath) {
        conflicts.push({
          severity: "high",
          path: normP,
          message: `Missing local dependency: \`${normP}\` references \`${imp}\`, which was not found in the selected files or Active Project.`,
          suggestion: "Include the missing file or ask Merge Agent to fix the import or create the module.",
        });
      }
    }

    for (const grp of analysis.importedSymbols) {
      const targetPath = resolveRelativeTarget(normP, grp.from, allKnownPaths);
      if (!targetPath) continue;
      const targetAnalysis = combinedAnalysisMap.get(targetPath);
      if (!targetAnalysis || targetAnalysis.hasWildcardExport) continue;
      for (const sym of grp.names) {
        if (!targetAnalysis.exports.includes(sym)) {
          conflicts.push({
            severity: "high",
            path: normP,
            relatedPath: targetPath,
            message: `Symbol mismatch: \`${normP}\` imports \`${sym}\` from \`${targetPath}\`, but \`${targetPath}\` only exports [${targetAnalysis.exports.join(", ") || "none"}].`,
            suggestion: `Ask Merge Agent to reconcile exports/imports between \`${normP}\` and \`${targetPath}\`.`,
          });
        }
      }
    }

    if (combinedHtmlIds.size > 0 && analysis.referencedIds.length > 0) {
      const missingIds = analysis.referencedIds.filter((id) => !combinedHtmlIds.has(id));
      if (missingIds.length > 0) {
        conflicts.push({
          severity: "medium",
          path: normP,
          message: `DOM ID mismatch: \`${normP}\` queries #${missingIds.slice(0, 4).join(", #")} which do not exist in the HTML files.`,
          suggestion: "Align element IDs between HTML and JS using Merge Agent.",
        });
      }
    }
  }

  const avgRow = file_matrix.length
    ? file_matrix.reduce((s, r) => s + r.score, 0) / file_matrix.length
    : 100;
  const penalty = Math.min(
    60,
    conflicts.reduce((s, c) => s + (c.severity === "high" ? 12 : c.severity === "medium" ? 6 : 2), 0)
  );
  const overall_compatibility_score = Math.max(5, Math.min(100, Math.round(avgRow - penalty * 0.4)));

  return {
    overall_compatibility_score,
    conflicts,
    file_matrix,
    clean_winner_files,
  };
}

export async function listAvailableCodingAndJudgeModels(): Promise<{
  models: AvailableCodingModel[];
  curated_downloads: CuratedCodingModel[];
  recommended_upgrade: { needed: boolean; reason: string };
}> {
  const conf = readConf();
  const models: AvailableCodingModel[] = [];

  const ollamaBase = String(conf.LOCAL_OLLAMA_URL || "http://127.0.0.1:11434/v1")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/v1$/, "");
  const lmBase = String(conf.LOCAL_LMSTUDIO_URL || "http://127.0.0.1:1234/v1").trim().replace(/\/+$/, "");

  const [ollamaRes, lmRes] = await Promise.all([
    fetch(`${ollamaBase}/api/tags`, { signal: AbortSignal.timeout(1200) })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`${lmBase}/models`, { signal: AbortSignal.timeout(1200) })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
  ]);

  if (Array.isArray(ollamaRes?.models)) {
    for (const m of ollamaRes.models) {
      const mName = String(m.name || m.model || "").trim();
      if (!mName) continue;
      const low = mName.toLowerCase();
      const isCoder = /coder|codestral|starcoder|deepseek|qwen2\.5|qwen3|devstral|r1/i.test(low);
      const isHeavy = /(32b|34b|70b|72b|22b|27b|30b)/i.test(low);
      const isMed = /(14b|16b|12b)/i.test(low);
      models.push({
        id: `ollama:${mName}`,
        name: `Ollama Local: ${mName}`,
        provider: "ollama",
        strength: isHeavy ? "high" : isMed ? "medium" : "light",
        is_coding_specialist: isCoder,
        size_label: m.details?.parameter_size || (isHeavy ? "22B–70B" : isMed ? "14B" : "Local"),
        available: true,
        note: "Free local Ollama engine",
      });
    }
  }

  if (Array.isArray(lmRes?.data)) {
    for (const m of lmRes.data) {
      const mId = String(m.id || "").trim();
      if (!mId) continue;
      const low = mId.toLowerCase();
      const isCoder = /coder|codestral|deepseek|qwen|devstral/i.test(low);
      models.push({
        id: `lmstudio:${mId}`,
        name: `LM Studio: ${mId}`,
        provider: "lmstudio",
        strength: /(32b|30b|70b|22b|14b)/i.test(low) ? "high" : "medium",
        is_coding_specialist: isCoder,
        size_label: "Local GGUF",
        available: true,
        note: "Local LM Studio OpenAI endpoint",
      });
    }
  }

  if (conf.ANTHROPIC_API_KEY) {
    models.push({
      id: "anthropic:claude-sonnet-4-20250514",
      name: "Anthropic Claude Sonnet 4 (Cloud Coder)",
      provider: "anthropic",
      strength: "high",
      is_coding_specialist: true,
      size_label: "Cloud Frontier",
      available: true,
      note: "Top-tier multi-file refactoring & diff resolution",
    });
  }

  if (conf.DEEPSEEK_API_KEY) {
    models.push({
      id: "deepseek:deepseek-chat",
      name: "DeepSeek V3 / Coder (Cloud)",
      provider: "deepseek",
      strength: "high",
      is_coding_specialist: true,
      size_label: "Cloud Frontier",
      available: true,
      note: "Strong code architecture & merge engine",
    });
  }

  if (conf.OPENAI_API_KEY && !conf.OPENAI_API_KEY.startsWith("sk-orca-") && !conf.OPENAI_API_KEY.startsWith("sk-or-v1-")) {
    models.push({
      id: "openai:gpt-4.1",
      name: "OpenAI GPT-4.1 (Cloud Coder)",
      provider: "openai",
      strength: "high",
      is_coding_specialist: true,
      size_label: "Cloud Frontier",
      available: true,
      note: "Strong structured code synthesis",
    });
  }

  if (conf.OPENROUTER_API_KEY) {
    models.push(
      {
        id: "openrouter:qwen/qwen-2.5-coder-32b-instruct",
        name: "OpenRouter: Qwen 2.5 Coder 32B Instruct",
        provider: "openrouter",
        strength: "high",
        is_coding_specialist: true,
        size_label: "32B Coder",
        available: true,
        note: "Dedicated open-weights coder via OpenRouter",
      },
      {
        id: "openrouter:deepseek/deepseek-chat-v3-0324",
        name: "OpenRouter: DeepSeek V3 Coder",
        provider: "openrouter",
        strength: "high",
        is_coding_specialist: true,
        size_label: "MoE Frontier",
        available: true,
        note: "Fast code merging & conflict resolution via OpenRouter",
      }
    );
  }

  if (
    conf.ORCAROUTER_API_KEY ||
    conf.ORCA_CYBER_API_KEY ||
    (conf.OPENAI_API_KEY && (conf.OPENAI_API_KEY.startsWith("sk-orca-") || conf.OPENAI_API_KEY.startsWith("orca_")))
  ) {
    models.push(
      {
        id: "orcarouter:orca/orcacyber-zero-1.5",
        name: "OrcaRouter: OrcaCyber Zero 1.5",
        provider: "orcarouter",
        strength: "high",
        is_coding_specialist: true,
        size_label: "Uncensored Cloud",
        available: true,
        note: "Configured OrcaRouter key active",
      },
      {
        id: "orcarouter:deepseek/deepseek-chat",
        name: "OrcaRouter: DeepSeek Chat / Coder",
        provider: "orcarouter",
        strength: "high",
        is_coding_specialist: true,
        size_label: "Uncensored Cloud",
        available: true,
        note: "Dedicated code synthesis route on OrcaRouter",
      }
    );
  }

  if (getValidGeminiApiKey()) {
    models.push({
      id: "gemini:gemini-2.5-flash",
      name: "Google Gemini 2.5 Flash (1M Context)",
      provider: "gemini",
      strength: "high",
      is_coding_specialist: true,
      size_label: "1M Context",
      available: true,
      note: "Ideal for large multi-file project reviews",
    });
  }

  if (conf.MISTRAL_API_KEY) {
    models.push({
      id: "mistral:codestral-latest",
      name: "Mistral Codestral Latest",
      provider: "mistral",
      strength: "high",
      is_coding_specialist: true,
      size_label: "Cloud Coder",
      available: true,
      note: "Mistral specialized code model",
    });
  }

  if (conf.GROQ_API_KEY) {
    models.push({
      id: "groq:llama-3.3-70b-versatile",
      name: "Groq: Llama 3.3 70B Versatile",
      provider: "groq",
      strength: "medium",
      is_coding_specialist: false,
      size_label: "70B Fast",
      available: true,
      note: "Ultra-fast inference on Groq",
    });
  }

  if (conf.TOGETHER_API_KEY) {
    models.push({
      id: "together:Qwen/Qwen2.5-Coder-32B-Instruct",
      name: "Together: Qwen 2.5 Coder 32B Instruct",
      provider: "together",
      strength: "high",
      is_coding_specialist: true,
      size_label: "32B Coder",
      available: true,
      note: "Dedicated Qwen2.5-Coder-32B cloud host",
    });
  }

  for (const slot of loadCustomSlots()) {
    if (!slot.enabled || slot.kind !== "api_key" || !slot.base_url || !slot.default_model) continue;
    models.push({
      id: `slot:${slot.id}`,
      name: `Custom API Slot: ${slot.name} (${slot.default_model})`,
      provider: "custom_slot",
      strength: "high",
      is_coding_specialist: true,
      size_label: "Custom Slot",
      available: true,
      note: slot.base_url,
    });
  }

  const customVault = loadCustomCatalog().filter((c) => /coder|codestral|deepseek|starcoder|qwen2\.5/i.test(`${c.name} ${c.repo}`));
  const strongReady = models.some((m) => m.strength === "high" || (m.strength === "medium" && m.is_coding_specialist));

  let recommended_upgrade = {
    needed: false,
    reason: models[0]
      ? `Ready: ${models[0].name} is active and capable of multi-file judging & merging.`
      : "",
  };

  if (models.length === 0) {
    recommended_upgrade = {
      needed: true,
      reason:
        "No live cloud API key or local Ollama/LM Studio coding model is active yet. Pull `qwen2.5-coder:14b` (or `qwen2.5-coder:32b`) via Ollama / download GGUF from Hugging Face below, OR add a key in 🔑 Keys.",
    };
  } else if (!strongReady) {
    recommended_upgrade = {
      needed: true,
      reason: `Only lightweight local models (${models.map((m) => m.name).join(", ")}) are currently online. For multi-file merges, pull Qwen2.5-Coder-14B/32B or add a DeepSeek/Anthropic/OpenRouter/OrcaRouter key.${customVault.length ? ` (${customVault.length} coding GGUF saved in HF Vault)` : ""}`,
    };
  }

  return {
    models,
    curated_downloads: CURATED_CODING_MODELS,
    recommended_upgrade,
  };
}

export async function invokeSpecificExplorerModel(
  requestedModelId: string,
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.15
): Promise<{ ok: boolean; text: string; usedModel: string; provider: string; error?: string }> {
  const conf = readConf();
  let modelId = String(requestedModelId || "auto").trim();

  if (!modelId || modelId === "auto") {
    const avail = await listAvailableCodingAndJudgeModels();
    const sorted = [...avail.models].sort((a, b) => {
      const rank = (m: AvailableCodingModel) => (m.strength === "high" ? 30 : m.strength === "medium" ? 20 : 10) + (m.is_coding_specialist ? 8 : 0);
      return rank(b) - rank(a);
    });
    if (!sorted.length) {
      return {
        ok: false,
        text: "",
        usedModel: "none",
        provider: "none",
        error: "No live coding model or API key is available. Add an API key in 🔑 Keys or start Ollama/LM Studio with a coding model.",
      };
    }
    modelId = sorted[0].id;
  }

  const colonIdx = modelId.indexOf(":");
  const prefix = colonIdx > 0 ? modelId.slice(0, colonIdx).toLowerCase() : "openai";
  const targetModel = colonIdx > 0 ? modelId.slice(colonIdx + 1) : modelId;
  const msgs = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const opts = { temperature, maxTokens: 4096, timeoutMs: 75000 };

  if (prefix === "ollama") {
    const base = String(conf.LOCAL_OLLAMA_URL || "http://127.0.0.1:11434/v1").trim();
    const r = await callOpenAiCompatibleProvider(base, "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "ollama" };
  }
  if (prefix === "lmstudio") {
    const base = String(conf.LOCAL_LMSTUDIO_URL || "http://127.0.0.1:1234/v1").trim();
    const r = await callOpenAiCompatibleProvider(base, "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "lmstudio" };
  }
  if (prefix === "anthropic") {
    const r = await callAnthropicProvider(conf.ANTHROPIC_API_KEY || "", targetModel, systemPrompt, userPrompt, opts);
    return { ...r, usedModel: targetModel, provider: "anthropic" };
  }
  if (prefix === "deepseek") {
    const r = await callOpenAiCompatibleProvider("https://api.deepseek.com/v1", conf.DEEPSEEK_API_KEY || "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "deepseek" };
  }
  if (prefix === "openrouter") {
    const r = await callOpenAiCompatibleProvider("https://openrouter.ai/api/v1", conf.OPENROUTER_API_KEY || "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "openrouter" };
  }
  if (prefix === "orcarouter") {
    const txt = await callOrcaRouterModel(targetModel, msgs, temperature, 70000, 4096);
    if (txt) return { ok: true, text: txt, usedModel: targetModel, provider: "orcarouter" };
    return { ok: false, text: "", usedModel: targetModel, provider: "orcarouter", error: "OrcaRouter returned empty or error response." };
  }
  if (prefix === "gemini") {
    const txt = await callGeminiServerEngine(systemPrompt, userPrompt, [], targetModel, 60000);
    if (txt) return { ok: true, text: txt, usedModel: targetModel, provider: "gemini" };
    return { ok: false, text: "", usedModel: targetModel, provider: "gemini", error: "Gemini returned empty or error response." };
  }
  if (prefix === "groq") {
    const r = await callOpenAiCompatibleProvider("https://api.groq.com/openai/v1", conf.GROQ_API_KEY || "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "groq" };
  }
  if (prefix === "mistral") {
    const r = await callOpenAiCompatibleProvider("https://api.mistral.ai/v1", conf.MISTRAL_API_KEY || "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "mistral" };
  }
  if (prefix === "together") {
    const r = await callOpenAiCompatibleProvider("https://api.together.xyz/v1", conf.TOGETHER_API_KEY || "", targetModel, msgs, opts);
    return { ...r, usedModel: targetModel, provider: "together" };
  }
  if (prefix === "slot") {
    const slot = loadCustomSlots().find((s) => s.id === targetModel);
    if (!slot || !slot.base_url) {
      return { ok: false, text: "", usedModel: targetModel, provider: "custom_slot", error: "Custom slot not found or missing base URL." };
    }
    const r = await callOpenAiCompatibleProvider(slot.base_url, slot.value || "", slot.default_model || "gpt-4o-mini", msgs, opts);
    return { ...r, usedModel: slot.default_model || slot.name, provider: "custom_slot" };
  }

  const r = await callOpenAiCompatibleProvider("https://api.openai.com/v1", conf.OPENAI_API_KEY || "", targetModel, msgs, opts);
  return { ...r, usedModel: targetModel, provider: "openai" };
}

export async function startHfGgufDownload(
  repoInput: string,
  requestedFilename = ""
): Promise<{ ok: boolean; job?: HfDownloadJob; error?: string }> {
  const repo = String(repoInput || "")
    .replace(/^https?:\/\/huggingface\.co\//i, "")
    .replace(/\/+$/, "")
    .trim();
  if (!repo || !repo.includes("/")) {
    return { ok: false, error: "Valid Hugging Face repo (owner/model) is required." };
  }

  const conf = readConf();
  const hfToken = conf.HF_TOKEN || "";
  const headers: Record<string, string> = { Accept: "application/json" };
  if (hfToken) headers.Authorization = `Bearer ${hfToken}`;

  let filename = String(requestedFilename || "").trim();
  let expectedSize = 0;

  if (!filename) {
    const infoResp = await fetch(`https://huggingface.co/api/models/${repo}`, {
      headers,
      signal: AbortSignal.timeout(12000),
    }).catch(() => null);
    if (!infoResp || !infoResp.ok) {
      return { ok: false, error: `Hugging Face repo "${repo}" could not be queried (HTTP ${infoResp?.status || "network"}).` };
    }
    const meta: any = await infoResp.json().catch(() => ({}));
    const siblings: any[] = Array.isArray(meta.siblings) ? meta.siblings : [];
    const ggufs = siblings.filter((s) => /\.gguf$/i.test(String(s.rfilename || "")) && !/mmproj/i.test(String(s.rfilename || "")));
    if (!ggufs.length) {
      return { ok: false, error: `No .gguf weight files found inside "${repo}".` };
    }
    const preferred =
      ggufs.find((s) => /q4_k_m/i.test(s.rfilename)) ||
      ggufs.find((s) => /q4_k_s|q5_k_m/i.test(s.rfilename)) ||
      ggufs[0];
    filename = String(preferred.rfilename);
    expectedSize = Number(preferred.size || preferred.lfs?.size || 0);
  }

  const modelsDir = path.join(WORKSPACE_OUTPUT_ROOT, "models");
  fs.mkdirSync(modelsDir, { recursive: true });
  const safeLeaf = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const destPath = path.join(modelsDir, safeLeaf);
  const jobId = `dl_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`;

  const job: HfDownloadJob = {
    id: jobId,
    repo,
    filename,
    dest_path: destPath,
    status: "starting",
    downloaded_bytes: 0,
    total_bytes: expectedSize,
    percent: 0,
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  _activeDownloads.set(jobId, job);

  const ac = new AbortController();
  _downloadAborts.set(jobId, ac);

  (async () => {
    try {
      const dlHeaders: Record<string, string> = {};
      if (hfToken) dlHeaders.Authorization = `Bearer ${hfToken}`;
      const url = `https://huggingface.co/${repo}/resolve/main/${encodeURIComponent(filename).replace(/%2F/g, "/")}`;
      const resp = await fetch(url, { headers: dlHeaders, redirect: "follow", signal: ac.signal });
      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP ${resp.status} downloading ${filename}`);
      }
      const cl = Number(resp.headers.get("content-length") || 0);
      if (cl > 0) job.total_bytes = cl;
      job.status = "downloading";
      job.updated_at = new Date().toISOString();

      const out = fs.createWriteStream(destPath);
      const reader = resp.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value && value.length) {
            out.write(Buffer.from(value));
            job.downloaded_bytes += value.length;
            job.percent = job.total_bytes > 0 ? Math.min(100, Math.round((job.downloaded_bytes / job.total_bytes) * 100)) : 0;
            job.updated_at = new Date().toISOString();
          }
        }
      } finally {
        out.end();
      }
      job.status = "completed";
      job.percent = 100;
      job.updated_at = new Date().toISOString();
      pushLiveConsole(`🤗 [HF GGUF Downloaded] ${safeLeaf} saved to ${destPath}`, { category: "MODELS", level: "ok" });
    } catch (e: any) {
      if (job.status !== "cancelled") {
        job.status = "failed";
        job.error = e?.message || String(e);
      }
      job.updated_at = new Date().toISOString();
    } finally {
      _downloadAborts.delete(jobId);
    }
  })();

  return { ok: true, job };
}

export function getHfDownloadJobs(): HfDownloadJob[] {
  return Array.from(_activeDownloads.values()).sort((a, b) => b.started_at.localeCompare(a.started_at));
}

export function cancelHfDownloadJob(jobId: string): boolean {
  const job = _activeDownloads.get(jobId);
  const ac = _downloadAborts.get(jobId);
  if (ac) ac.abort();
  if (job) {
    job.status = "cancelled";
    job.updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

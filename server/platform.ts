import fs from "fs";
import os from "os";
import path from "path";
import { exec } from "child_process";
import {
  COUNCIL_ROOT,
  COUNCIL_DATA_ROOT,
  RUNTIME_TMP_ROOT,
  ensureRealCliEnvironmentBinaries,
  resolveHostPythonBin,
} from "../guardian_claude_code.ts";

export {
  COUNCIL_ROOT as PROJECT_ROOT,
  COUNCIL_DATA_ROOT as DATA_ROOT,
  RUNTIME_TMP_ROOT,
  resolveHostPythonBin as resolvePythonBin,
};

export const IS_WIN = process.platform === "win32";
export const TOOLCHAINS_ROOT = path.join(RUNTIME_TMP_ROOT, "toolchains");
export const REAL_GO_BIN = IS_WIN ? "go" : path.join(TOOLCHAINS_ROOT, "go", "bin", "go");
export const REAL_PY_VENV_DIR = path.join(TOOLCHAINS_ROOT, "py_venv");
export const REAL_PYTHON_BIN = IS_WIN
  ? path.join(REAL_PY_VENV_DIR, "Scripts", "python.exe")
  : path.join(REAL_PY_VENV_DIR, "bin", "python3");
export const REAL_PIP_BIN = IS_WIN
  ? path.join(REAL_PY_VENV_DIR, "Scripts", "pip.exe")
  : path.join(REAL_PY_VENV_DIR, "bin", "pip");

export function getEffectivePythonBin(): string {
  return fs.existsSync(REAL_PYTHON_BIN) ? REAL_PYTHON_BIN : resolveHostPythonBin();
}

export function getEffectiveGoBin(): string {
  return !IS_WIN && fs.existsSync(REAL_GO_BIN) ? REAL_GO_BIN : "go";
}

export function prependPathDirs(dirs: string[], currentPath?: string): string {
  const base =
    currentPath ??
    process.env.PATH ??
    process.env.Path ??
    (IS_WIN ? "" : "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin");
  const parts = String(base).split(path.delimiter).filter(Boolean);
  for (const dir of [...dirs].reverse()) {
    if (!dir) continue;
    const exists = parts.some((p) => (IS_WIN ? p.toLowerCase() === dir.toLowerCase() : p === dir));
    if (!exists) parts.unshift(dir);
  }
  return parts.join(path.delimiter);
}

/** Ensure runtime CLI bin shims remain executable (on POSIX) and on PATH using native path.delimiter. */
export function ensureCliBinReady(): void {
  try {
    const { cliBinDir } = ensureRealCliEnvironmentBinaries();
    if (!IS_WIN && fs.existsSync(cliBinDir)) {
      for (const entry of fs.readdirSync(cliBinDir)) {
        const fullPath = path.join(cliBinDir, entry);
        try {
          fs.chmodSync(fullPath, 0o755);
        } catch {}
      }
    }
    if (fs.existsSync(cliBinDir)) {
      process.env.PATH = prependPathDirs([cliBinDir]);
    }
  } catch {}
}

export function syncRealToolchainWrappersIntoCliBin(): void {
  try {
    const { cliBinDir, localPkgDir } = ensureRealCliEnvironmentBinaries();
    fs.mkdirSync(cliBinDir, { recursive: true });
    if (IS_WIN) {
      process.env.PATH = prependPathDirs([cliBinDir]);
      return;
    }

    const goDir = path.join(TOOLCHAINS_ROOT, "go", "bin");
    const pyBinDir = path.join(REAL_PY_VENV_DIR, "bin");
    const extraPaths = [pyBinDir, goDir].filter((d) => fs.existsSync(d));
    process.env.PATH = prependPathDirs([cliBinDir, ...extraPaths]);

    if (fs.existsSync(REAL_PIP_BIN)) {
      const realPipWrapper = `#!/bin/bash\nexec "${REAL_PIP_BIN}" --disable-pip-version-check "$@"\n`;
      fs.writeFileSync(path.join(cliBinDir, "pip"), realPipWrapper, { mode: 0o755 });
      fs.writeFileSync(path.join(cliBinDir, "pip3"), realPipWrapper, { mode: 0o755 });
    }

    const hostPy = resolveHostPythonBin();
    const safePyWrapper = `#!/bin/bash\nexport PYTHONPATH="${localPkgDir}:\${PYTHONPATH:-}"\nif [ -x "${REAL_PYTHON_BIN}" ]; then\n  exec "${REAL_PYTHON_BIN}" "$@"\nelse\n  exec "${hostPy}" "$@"\nfi\n`;
    fs.writeFileSync(path.join(cliBinDir, "python"), safePyWrapper, { mode: 0o755 });
    fs.writeFileSync(path.join(cliBinDir, "python3"), safePyWrapper, { mode: 0o755 });

    if (fs.existsSync(REAL_GO_BIN)) {
      const goRoot = path.join(TOOLCHAINS_ROOT, "go");
      const goPath = path.join(TOOLCHAINS_ROOT, "gopath");
      fs.mkdirSync(goPath, { recursive: true });
      const realGoWrapper = `#!/bin/bash\nexport GOROOT="${goRoot}"\nexport GOPATH="${goPath}"\nexport PATH="${goRoot}/bin:\${PATH:-}"\nexec "${REAL_GO_BIN}" "$@"\n`;
      fs.writeFileSync(path.join(cliBinDir, "go"), realGoWrapper, { mode: 0o755 });
      fs.writeFileSync(
        path.join(cliBinDir, "gofmt"),
        `#!/bin/bash\nexec "${goRoot}/bin/gofmt" "$@"\n`,
        { mode: 0o755 }
      );
    }
  } catch {}
}

let _bootstrapStarted = false;

/** On Linux, lazily provision PyPA pip + Python venv + Go into os.tmpdir() only when requested or EAGER_TOOLCHAIN_BOOTSTRAP=1. */
export function bootstrapRealPythonAndGoIfMissing(
  forceProvision = false,
  onProvisioned?: (msg: string) => void
): void {
  syncRealToolchainWrappersIntoCliBin();
  if (IS_WIN) return;
  if (!forceProvision && process.env.EAGER_TOOLCHAIN_BOOTSTRAP !== "1") return;
  if (_bootstrapStarted || (fs.existsSync(REAL_GO_BIN) && fs.existsSync(REAL_PIP_BIN))) {
    return;
  }
  _bootstrapStarted = true;
  fs.mkdirSync(TOOLCHAINS_ROOT, { recursive: true });
  const goTgz = path.join(RUNTIME_TMP_ROOT, "go_tc.tgz");
  const getPipPy = path.join(RUNTIME_TMP_ROOT, "get-pip-tc.py");
  const setupCmd = [
    `if [ ! -x "${REAL_GO_BIN}" ]; then curl -fsSL https://dl.google.com/go/go1.22.10.linux-amd64.tar.gz -o "${goTgz}" && tar -xzf "${goTgz}" -C "${TOOLCHAINS_ROOT}" && rm -f "${goTgz}"; fi`,
    `if [ ! -x "${REAL_PIP_BIN}" ]; then /usr/bin/python3 -m venv "${REAL_PY_VENV_DIR}" --without-pip && curl -fsSL https://bootstrap.pypa.io/get-pip.py -o "${getPipPy}" && "${REAL_PYTHON_BIN}" "${getPipPy}" --quiet && rm -f "${getPipPy}"; fi`,
  ].join(" && ");
  exec(setupCmd, { timeout: 180000 }, (err) => {
    syncRealToolchainWrappersIntoCliBin();
    if (!err && onProvisioned) {
      onProvisioned("✅ [Toolchains] Real PyPA pip + Python 3 venv + Go 1.22.10 compiler provisioned in temp runtime.");
    }
  });
}

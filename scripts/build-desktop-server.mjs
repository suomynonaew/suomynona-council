import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const editionArg = process.argv.find((a) => a.startsWith("--edition="));
const edition =
  editionArg?.split("=")[1]?.trim().toLowerCase() === "client" ||
  String(process.env.COUNCIL_EDITION || "").trim().toLowerCase() === "client"
    ? "client"
    : "master";

function ensureMasterKeypairOnDisk() {
  const vaultDir = path.resolve(".master_vault");
  const vaultPath = path.join(vaultDir, "master_ed25519.json");
  const dataDir = path.resolve(".council_data");
  const dataVaultPath = path.join(dataDir, "master_ed25519.json");

  for (const p of [vaultPath, dataVaultPath]) {
    try {
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
        if (parsed?.privateKeyPem && parsed?.publicKeyPem) {
          fs.mkdirSync(vaultDir, { recursive: true });
          fs.mkdirSync(dataDir, { recursive: true });
          fs.writeFileSync(vaultPath, JSON.stringify(parsed, null, 2), "utf-8");
          fs.writeFileSync(dataVaultPath, JSON.stringify(parsed, null, 2), "utf-8");
          return parsed;
        }
      }
    } catch {}
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const h = crypto.createHash("sha256").update(publicKey.trim()).digest("hex").toUpperCase();
  const fingerprint = `ED25519-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`;
  const vault = {
    algorithm: "ed25519",
    createdAt: new Date().toISOString(),
    publicKeyPem: publicKey,
    privateKeyPem: privateKey,
    fingerprint,
  };
  fs.mkdirSync(vaultDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2), "utf-8");
  fs.writeFileSync(dataVaultPath, JSON.stringify(vault, null, 2), "utf-8");
  return vault;
}

const masterVault = ensureMasterKeypairOnDisk();

const outFile = path.resolve("dist-server", "server.cjs");
fs.mkdirSync(path.dirname(outFile), { recursive: true });

await esbuild.build({
  entryPoints: [path.resolve("server.ts")],
  outfile: outFile,
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node22",
  external: ["vite", "bufferutil", "utf-8-validate"],
  minify: true,
  legalComments: "none",
  drop: ["debugger"],
  banner: {
    js: "const __importMetaUrl = require('url').pathToFileURL(__filename).href;",
  },
  define: {
    "import.meta.url": "__importMetaUrl",
  },
  logLevel: "info",
});

// Minify frontend JS assets inside dist/ and strip any source maps
const distDir = path.resolve("dist");
if (fs.existsSync(distDir)) {
  const minifyJsFile = (filePath) => {
    try {
      if (!fs.existsSync(filePath) || !filePath.endsWith(".js")) return;
      const src = fs.readFileSync(filePath, "utf-8");
      const out = esbuild.transformSync(src, {
        loader: "js",
        minifyWhitespace: true,
        minifySyntax: true,
        legalComments: "none",
        drop: ["debugger"],
      });
      fs.writeFileSync(filePath, out.code, "utf-8");
    } catch {}
  };

  minifyJsFile(path.join(distDir, "app.js"));
  const distJsDir = path.join(distDir, "js");
  if (fs.existsSync(distJsDir)) {
    for (const f of fs.readdirSync(distJsDir)) {
      if (f.endsWith(".js")) minifyJsFile(path.join(distJsDir, f));
      if (f.endsWith(".map")) fs.rmSync(path.join(distJsDir, f), { force: true });
    }
  }
  const distAssetsDir = path.join(distDir, "assets");
  if (fs.existsSync(distAssetsDir)) {
    for (const f of fs.readdirSync(distAssetsDir)) {
      if (f.endsWith(".map")) fs.rmSync(path.join(distAssetsDir, f), { force: true });
    }
  }
}

const serverBytes = fs.readFileSync(outFile);
const serverBundleSha256 = crypto.createHash("sha256").update(serverBytes).digest("hex");
console.log(
  `Built [${edition.toUpperCase()}] ${outFile} (${Math.round(serverBytes.length / 1024)} KB · SHA-256: ${serverBundleSha256.slice(0, 16)}…)`
);

// Write desktop-edition.json (contains ONLY the Ed25519 public key — never the private key!)
const editionConfig = {
  edition,
  ed25519PublicKeyPem: masterVault.publicKeyPem,
  publicKeyFingerprint: masterVault.fingerprint,
  serverBundleSha256,
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(path.resolve("desktop-edition.json"), JSON.stringify(editionConfig, null, 2), "utf-8");
fs.writeFileSync(path.resolve("dist-server", "desktop-edition.json"), JSON.stringify(editionConfig, null, 2), "utf-8");

// Manage seed_data/master_ed25519.json: included ONLY in Master Edition, stripped from Client Edition
const seedDir = path.resolve("seed_data");
const seedKeyPath = path.join(seedDir, "master_ed25519.json");
if (edition === "master") {
  fs.mkdirSync(seedDir, { recursive: true });
  fs.writeFileSync(seedKeyPath, JSON.stringify(masterVault, null, 2), "utf-8");
} else {
  if (fs.existsSync(seedKeyPath)) {
    fs.rmSync(seedKeyPath, { force: true });
  }
}

function readGitSafe(cmd, fallback = "") {
  try {
    return (
      execSync(cmd, {
        cwd: path.resolve("."),
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 4000,
      }).trim() || fallback
    );
  } catch {
    return fallback;
  }
}

const repoUrl = readGitSafe("git remote get-url origin", "https://github.com/suomynonaew/suomynona-council.git");
const rawBranch = readGitSafe("git rev-parse --abbrev-ref HEAD", "main");
const branch = rawBranch === "HEAD" ? "main" : rawBranch;
const commitSha = readGitSafe("git rev-parse HEAD", "");
const builtTimestamp = Date.now();
const repoConfig = {
  repoUrl,
  branch,
  commitSha,
  commitShort: commitSha ? commitSha.slice(0, 7) : "",
  sourceRepoDir: edition === "master" ? path.resolve(".") : "",
  builtTimestamp,
  builtAt: new Date(builtTimestamp).toISOString(),
};

const rootCfgPath = path.resolve("desktop-repo-config.json");
const distServerCfgPath = path.resolve("dist-server", "desktop-repo-config.json");
fs.writeFileSync(rootCfgPath, JSON.stringify(repoConfig, null, 2), "utf-8");
fs.writeFileSync(distServerCfgPath, JSON.stringify(repoConfig, null, 2), "utf-8");
console.log(
  `Wrote [${edition.toUpperCase()}] edition metadata (PubKey: ${masterVault.fingerprint}) & Git config (${repoConfig.branch} @ ${repoConfig.commitShort || "unknown"})`
);

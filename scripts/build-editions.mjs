import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const arg = (process.argv[2] || "both").toLowerCase();
const editions = arg === "master" ? ["master"] : arg === "client" ? ["client"] : ["master", "client"];

function run(cmd) {
  console.log(`\n❯ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: path.resolve(".") });
}

// 1. Build frontend assets once via Vite
run("npx vite build");

for (const edition of editions) {
  console.log(`\n════════════════════════════════════════════════════════════════════════`);
  console.log(`  📦 PACKAGING SUOMYNONA COUNCIL — ${edition.toUpperCase()} EDITION (.EXE)`);
  console.log(`════════════════════════════════════════════════════════════════════════`);

  // 2. Compile & minify server bundle + write edition config
  run(`node scripts/build-desktop-server.mjs --edition=${edition}`);

  const isClient = edition === "client";
  const artifactName = isClient
    ? "Suomynona-Council-Client-Portable.exe"
    : "Suomynona-Council-Master-Portable.exe";
  const outDir = isClient ? "dist-native/client-win" : "dist-native/master-win";
  let effectiveOutDir = outDir;
  const existingExe = path.resolve(effectiveOutDir, artifactName);
  if (fs.existsSync(existingExe)) {
    try {
      fs.rmSync(existingExe, { force: true });
    } catch (err) {
      if (err && (err.code === "EBUSY" || err.code === "EPERM")) {
        effectiveOutDir = `${outDir}-fresh`;
        console.warn(`⚠️ ${existingExe} is locked by Windows (${err.code}); packaging into ${effectiveOutDir} instead.`);
      } else {
        throw err;
      }
    }
  }

  const filesList = [
    "electron-main.cjs",
    "preload.cjs",
    "index.js",
    "desktop-repo-config.json",
    "desktop-edition.json",
    "dist/**/*",
    "dist-server/**/*",
    "src/council_catalog.json",
    "src/data/**/*",
    ".env.example",
    "package.json",
    "!node_modules/**/*",
    "!**/*.map",
    "!**/*.ts",
    "!server/**/*",
    "!public/**/*",
    "!.master_vault/**/*",
    "!.council_data/**/*",
    ...(isClient ? ["!seed_data/**/*"] : ["seed_data/**/*"]),
  ];

  const builderConfig = {
    appId: isClient ? "com.suomynona.council.client" : "com.suomynona.council.master",
    productName: isClient ? "Suomynona Council" : "Suomynona Council Master",
    asar: true,
    directories: {
      output: effectiveOutDir,
    },
    win: {
      target: ["portable", "dir"],
      signAndEditExecutable: false,
      requestedExecutionLevel: "asInvoker",
    },
    portable: {
      artifactName,
    },
    files: filesList,
  };

  const tmpConfigPath = path.resolve(`electron-builder.${edition}.tmp.json`);
  fs.writeFileSync(tmpConfigPath, JSON.stringify(builderConfig, null, 2), "utf-8");

  try {
    run(`npx electron-builder --win portable dir --config "${tmpConfigPath}"`);
    const builtExe = path.resolve(effectiveOutDir, artifactName);
    const rootCopyExe = path.resolve("dist-native", artifactName);
    if (fs.existsSync(builtExe)) {
      fs.mkdirSync(path.dirname(rootCopyExe), { recursive: true });
      const builtSizeMb = Math.round((fs.statSync(builtExe).size / (1024 * 1024)) * 10) / 10;
      try {
        fs.copyFileSync(builtExe, rootCopyExe);
        console.log(`✅ Built ${edition.toUpperCase()} Edition Portable EXE: ${rootCopyExe} (${builtSizeMb} MB)`);
      } catch (err) {
        if (err && (err.code === "EBUSY" || err.code === "EPERM")) {
          console.warn(
            `⚠️ ${rootCopyExe} is currently open/locked by Windows (${err.code}). Newly built ${edition.toUpperCase()} Portable EXE is ready at: ${builtExe} (${builtSizeMb} MB)`
          );
        } else {
          throw err;
        }
      }
    }
  } finally {
    if (fs.existsSync(tmpConfigPath)) {
      fs.rmSync(tmpConfigPath, { force: true });
    }
  }
}

// Always restore workspace to Master Edition after packaging so local dev/admin work stays unlocked
run("node scripts/build-desktop-server.mjs --edition=master");

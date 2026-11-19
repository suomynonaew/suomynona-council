import { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import { PROJECT_ROOT, DATA_ROOT, IS_WIN } from "./platform.ts";
import { DATA_DIR, readConf, saveConf, log, pushLiveConsole } from "./state-and-hosts.ts";

export type AppEdition = "master" | "client";

export interface EditionBuildConfig {
  edition: AppEdition;
  ed25519PublicKeyPem: string;
  remoteLedgerUrl?: string;
  serverBundleSha256?: string;
  builtAt?: string;
}

export interface RegisteredLicenseUser {
  id: string;
  key_id: string;
  cd_key: string;
  user_name: string;
  user_email: string;
  plan_tier: string;
  amount_paid: string;
  paid_status: "paid" | "trial" | "comped" | "refunded";
  registered_at: string;
  expires_at: string | null;
  duration_label: string;
  bound_hwid: string | null;
  bound_hostname: string | null;
  bound_os: string | null;
  bound_at: string | null;
  unlink_count: number;
  max_computers: number;
  revoked: boolean;
  revoked_reason?: string;
  activations_count: number;
  last_verified_at: string | null;
  notes: string;
}

interface SignedKeyPayload {
  v: 1;
  kid: string;
  uid: string;
  name: string;
  email: string;
  tier: string;
  iat: number;
  exp: number; // 0 = Lifetime, >0 = epoch ms
  hwid: string; // "" = bind on 1st PC, "SMN-PC-..." = hard-locked to specific PC
  max: number;
}

interface MasterKeypairVault {
  algorithm: "ed25519";
  createdAt: string;
  publicKeyPem: string;
  privateKeyPem: string;
  fingerprint: string;
}

interface MasterRegistryStore {
  updated_at: string;
  remote_ledger_url: string;
  remote_gist_id: string;
  last_synced_at: string | null;
  users: RegisteredLicenseUser[];
}

interface ClientLicenseSeal {
  cd_key: string;
  key_id: string;
  user_name: string;
  user_email: string;
  plan_tier: string;
  bound_hwid: string;
  bound_hostname: string;
  bound_os: string;
  bound_at: string;
  expires_at: string | null;
  activations_count: number;
  seen_unlink_count: number;
  max_seen_utc_ms: number;
  remote_ledger_url?: string;
  seal_hmac: string;
}

interface SignedRemoteLedger {
  payload_b64: string;
  sig_b64: string;
}

interface RemoteLedgerPayload {
  ts: number;
  entries: Array<{
    kid: string;
    revoked: boolean;
    exp: number; // 0 = lifetime, >0 = epoch ms
    bound_hwid: string | null;
    unlink_count: number;
  }>;
}

let _cachedMachineGuid: string | null = null;
let _cachedHwid: string | null = null;
let _cachedRemoteLedger: { fetchedAt: number; data: RemoteLedgerPayload | null } = { fetchedAt: 0, data: null };

function b64UrlEncode(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64UrlDecode(str: string): Buffer {
  const norm = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
  return Buffer.from(norm + pad, "base64");
}

function readRawMachineGuid(): string {
  if (_cachedMachineGuid) return _cachedMachineGuid;
  if (IS_WIN) {
    try {
      const out = execSync('reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid', {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 3000,
        windowsHide: true,
      });
      const m = out.match(/MachineGuid\s+REG_SZ\s+([^\r\n]+)/i);
      if (m?.[1]?.trim()) {
        _cachedMachineGuid = m[1].trim();
        return _cachedMachineGuid;
      }
    } catch {
      // fallback below
    }
  }
  _cachedMachineGuid = `${os.hostname() || "host"}-${os.platform()}-${os.arch()}`;
  return _cachedMachineGuid;
}

export function computeStrongMachineHwid(): string {
  if (process.env.COUNCIL_SIMULATE_HWID) {
    return String(process.env.COUNCIL_SIMULATE_HWID).trim().toUpperCase();
  }
  if (_cachedHwid) return _cachedHwid;
  const raw = [
    readRawMachineGuid(),
    os.platform(),
    os.arch(),
    os.cpus()?.[0]?.model || "cpu",
    String(os.cpus()?.length || 4),
    String(Math.round(os.totalmem() / (1024 * 1024 * 1024))),
  ].join("|");
  const hex = crypto.createHash("sha256").update(raw).digest("hex").toUpperCase();
  _cachedHwid = `SMN-PC-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
  return _cachedHwid;
}

export function getMachineMetadata(): { hwid: string; hostname: string; os_label: string } {
  return {
    hwid: computeStrongMachineHwid(),
    hostname: os.hostname() || "workstation",
    os_label: `${os.platform()} ${os.release()} (${os.arch()})`,
  };
}

export function loadEditionBuildConfig(): EditionBuildConfig {
  const candidates = [
    path.join(PROJECT_ROOT, "desktop-edition.json"),
    path.join(PROJECT_ROOT, "dist-server", "desktop-edition.json"),
    path.join(DATA_ROOT, "desktop-edition.json"),
  ];
  let parsed: Partial<EditionBuildConfig> = {};
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
        break;
      }
    } catch {
      // ignore
    }
  }
  const envEd = String(process.env.COUNCIL_EDITION || "").trim().toLowerCase();
  const edition: AppEdition =
    envEd === "client" ? "client" : envEd === "master" ? "master" : parsed.edition === "client" ? "client" : "master";

  return {
    edition,
    ed25519PublicKeyPem: String(process.env.COUNCIL_PUBLIC_KEY_PEM || parsed.ed25519PublicKeyPem || "").trim(),
    remoteLedgerUrl: String(process.env.COUNCIL_REMOTE_LEDGER_URL || parsed.remoteLedgerUrl || "").trim(),
    serverBundleSha256: parsed.serverBundleSha256 || "",
    builtAt: parsed.builtAt || "",
  };
}

export function getActiveAppEdition(): AppEdition {
  return loadEditionBuildConfig().edition;
}

function computePubKeyFingerprint(pubPem: string): string {
  if (!pubPem) return "UNCONFIGURED";
  const h = crypto.createHash("sha256").update(pubPem.trim()).digest("hex").toUpperCase();
  return `ED25519-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`;
}

function ensureMasterKeypair(): MasterKeypairVault {
  if (getActiveAppEdition() !== "master") {
    throw new Error("Master private signing authority is unavailable in Client Edition.");
  }
  const isAsar = PROJECT_ROOT.toLowerCase().includes(".asar");
  const devVaultPath = !isAsar ? path.join(PROJECT_ROOT, ".master_vault", "master_ed25519.json") : "";
  const dataVaultPath = path.join(DATA_DIR, "master_ed25519.json");
  const seedVaultPath = path.join(PROJECT_ROOT, "seed_data", "master_ed25519.json");

  for (const candidate of [devVaultPath, dataVaultPath, seedVaultPath]) {
    if (!candidate) continue;
    try {
      if (fs.existsSync(candidate)) {
        const v = JSON.parse(fs.readFileSync(candidate, "utf-8")) as MasterKeypairVault;
        if (v?.privateKeyPem && v?.publicKeyPem) {
          // Ensure synced into DATA_DIR (and devVaultPath if in dev workspace)
          try {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            if (!fs.existsSync(dataVaultPath)) fs.writeFileSync(dataVaultPath, JSON.stringify(v, null, 2), "utf-8");
            if (devVaultPath && !fs.existsSync(devVaultPath)) {
              fs.mkdirSync(path.dirname(devVaultPath), { recursive: true });
              fs.writeFileSync(devVaultPath, JSON.stringify(v, null, 2), "utf-8");
            }
          } catch {}
          return v;
        }
      }
    } catch {}
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const vault: MasterKeypairVault = {
    algorithm: "ed25519",
    createdAt: new Date().toISOString(),
    publicKeyPem: publicKey,
    privateKeyPem: privateKey,
    fingerprint: computePubKeyFingerprint(publicKey),
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(dataVaultPath, JSON.stringify(vault, null, 2), "utf-8");
  if (devVaultPath) {
    try {
      fs.mkdirSync(path.dirname(devVaultPath), { recursive: true });
      fs.writeFileSync(devVaultPath, JSON.stringify(vault, null, 2), "utf-8");
    } catch {}
  }
  return vault;
}

export function getVerificationPublicKeyPem(): string {
  const cfg = loadEditionBuildConfig();
  if (cfg.ed25519PublicKeyPem) return cfg.ed25519PublicKeyPem;
  if (cfg.edition === "master") {
    return ensureMasterKeypair().publicKeyPem;
  }
  return "";
}

function getMasterRegistryPath(): string {
  if (process.env.COUNCIL_MASTER_REGISTRY_PATH) {
    return path.resolve(process.env.COUNCIL_MASTER_REGISTRY_PATH);
  }
  return path.join(DATA_DIR, "master_licenses_registry.json");
}

function loadMasterRegistry(): MasterRegistryStore {
  const regPath = getMasterRegistryPath();
  try {
    if (fs.existsSync(regPath)) {
      const parsed = JSON.parse(fs.readFileSync(regPath, "utf-8")) as MasterRegistryStore;
      if (parsed && Array.isArray(parsed.users)) return parsed;
    }
  } catch {}
  return {
    updated_at: new Date().toISOString(),
    remote_ledger_url: loadEditionBuildConfig().remoteLedgerUrl || "",
    remote_gist_id: "",
    last_synced_at: null,
    users: [],
  };
}

function saveMasterRegistry(store: MasterRegistryStore): void {
  const regPath = getMasterRegistryPath();
  store.updated_at = new Date().toISOString();
  fs.mkdirSync(path.dirname(regPath), { recursive: true });
  fs.writeFileSync(regPath, JSON.stringify(store, null, 2), "utf-8");
}

function mintSignedCdKey(user: {
  key_id: string;
  id: string;
  user_name: string;
  user_email: string;
  plan_tier: string;
  expires_at: string | null;
  bound_hwid: string | null;
  max_computers: number;
  lock_hwid_in_token?: boolean;
}): string {
  const vault = ensureMasterKeypair();
  const expMs = user.expires_at ? new Date(user.expires_at).getTime() : 0;
  const payload: SignedKeyPayload = {
    v: 1,
    kid: user.key_id,
    uid: user.id,
    name: user.user_name.slice(0, 64),
    email: user.user_email.slice(0, 80),
    tier: user.plan_tier.slice(0, 32),
    iat: Date.now(),
    exp: Number.isFinite(expMs) && expMs > 0 ? expMs : 0,
    hwid: user.lock_hwid_in_token && user.bound_hwid ? user.bound_hwid : "",
    max: Math.max(1, Number(user.max_computers) || 1),
  };
  const payloadB64 = b64UrlEncode(JSON.stringify(payload));
  const sig = crypto.sign(null, Buffer.from(payloadB64, "utf-8"), vault.privateKeyPem);
  return `SMN1-${payloadB64}.${b64UrlEncode(sig)}`;
}

export function verifySignedCdKeyToken(rawKey: string): {
  ok: boolean;
  code?: string;
  error?: string;
  payload?: SignedKeyPayload;
} {
  const trimmed = String(rawKey || "").trim();
  if (!trimmed.startsWith("SMN1-")) {
    return { ok: false, code: "INVALID_FORMAT", error: "Invalid CD-Key format (expected cryptographically signed SMN1-... key)." };
  }
  const body = trimmed.slice(5);
  const dotIdx = body.indexOf(".");
  if (dotIdx <= 0) {
    return { ok: false, code: "MALFORMED_TOKEN", error: "Malformed CD-Key signature segment." };
  }
  const payloadB64 = body.slice(0, dotIdx);
  const sigB64 = body.slice(dotIdx + 1);
  const pubPem = getVerificationPublicKeyPem();
  if (!pubPem) {
    return { ok: false, code: "NO_PUBLIC_KEY", error: "Licensing public key missing from Client build configuration." };
  }

  try {
    const sigBuf = b64UrlDecode(sigB64);
    const verified = crypto.verify(null, Buffer.from(payloadB64, "utf-8"), pubPem, sigBuf);
    if (!verified) {
      return { ok: false, code: "INVALID_SIGNATURE", error: "Cryptographic Ed25519 signature verification failed — forged or tampered CD key." };
    }
    const payload = JSON.parse(b64UrlDecode(payloadB64).toString("utf-8")) as SignedKeyPayload;
    if (!payload || payload.v !== 1 || !payload.kid) {
      return { ok: false, code: "INVALID_PAYLOAD", error: "Invalid CD-Key payload claims." };
    }
    return { ok: true, payload };
  } catch (err: any) {
    return { ok: false, code: "VERIFY_EXCEPTION", error: `CD-Key verification failed: ${err?.message || "corrupt token"}` };
  }
}

function getClientSealPath(): string {
  if (process.env.COUNCIL_CLIENT_SEAL_PATH) {
    return path.resolve(process.env.COUNCIL_CLIENT_SEAL_PATH);
  }
  return path.join(DATA_DIR, "client_license_seal.json");
}

function computeClientSealHmac(data: Omit<ClientLicenseSeal, "seal_hmac">): string {
  const pubPem = getVerificationPublicKeyPem();
  const secret = `${readRawMachineGuid()}::${computeStrongMachineHwid()}::${pubPem}`;
  const canonical = [
    data.cd_key,
    data.key_id,
    data.bound_hwid,
    data.expires_at || "LIFETIME",
    String(data.seen_unlink_count || 0),
    String(data.max_seen_utc_ms || 0),
  ].join("|");
  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

function loadClientSeal(): ClientLicenseSeal | null {
  const p = getClientSealPath();
  try {
    if (!fs.existsSync(p)) return null;
    const parsed = JSON.parse(fs.readFileSync(p, "utf-8")) as ClientLicenseSeal;
    if (!parsed || !parsed.cd_key || !parsed.seal_hmac) return null;
    const { seal_hmac, ...rest } = parsed;
    const expected = computeClientSealHmac(rest);
    if (seal_hmac !== expected) {
      log("🚫 [License Anti-Tamper] Client activation seal HMAC mismatch (copied from another PC or tampered).");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveClientSeal(data: Omit<ClientLicenseSeal, "seal_hmac">): ClientLicenseSeal {
  const full: ClientLicenseSeal = {
    ...data,
    seal_hmac: computeClientSealHmac(data),
  };
  const p = getClientSealPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(full, null, 2), "utf-8");
  return full;
}

async function fetchVerifiedRemoteLedger(urlOverride?: string): Promise<RemoteLedgerPayload | null> {
  const url = String(urlOverride || loadEditionBuildConfig().remoteLedgerUrl || "").trim();
  if (!url) return null;
  if (Date.now() - _cachedRemoteLedger.fetchedAt < 30_000 && _cachedRemoteLedger.data) {
    return _cachedRemoteLedger.data;
  }
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(3500) });
    if (!r.ok) return _cachedRemoteLedger.data;
    const signed = (await r.json()) as SignedRemoteLedger;
    const pubPem = getVerificationPublicKeyPem();
    if (!signed?.payload_b64 || !signed?.sig_b64 || !pubPem) return null;
    const ok = crypto.verify(null, Buffer.from(signed.payload_b64, "utf-8"), pubPem, b64UrlDecode(signed.sig_b64));
    if (!ok) return null;
    const payload = JSON.parse(b64UrlDecode(signed.payload_b64).toString("utf-8")) as RemoteLedgerPayload;
    _cachedRemoteLedger = { fetchedAt: Date.now(), data: payload };
    return payload;
  } catch {
    return _cachedRemoteLedger.data;
  }
}

function findAuthoritativeEntry(kid: string, remoteLedger: RemoteLedgerPayload | null): {
  revoked: boolean;
  exp: number | null;
  bound_hwid: string | null | undefined;
  unlink_count: number;
  found: boolean;
} {
  // Check local Master registry if accessible (e.g. same-host testing or shared authority)
  const regPath = getMasterRegistryPath();
  if (fs.existsSync(regPath)) {
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.key_id === kid);
    if (u) {
      return {
        found: true,
        revoked: Boolean(u.revoked),
        exp: u.expires_at ? new Date(u.expires_at).getTime() : 0,
        bound_hwid: u.bound_hwid,
        unlink_count: Number(u.unlink_count || 0),
      };
    }
  }
  if (remoteLedger?.entries) {
    const e = remoteLedger.entries.find((x) => x.kid === kid);
    if (e) {
      return {
        found: true,
        revoked: Boolean(e.revoked),
        exp: Number(e.exp || 0),
        bound_hwid: e.bound_hwid,
        unlink_count: Number(e.unlink_count || 0),
      };
    }
  }
  return { found: false, revoked: false, exp: null, bound_hwid: undefined, unlink_count: 0 };
}

export interface LicenseEvaluationResult {
  valid: boolean;
  edition: AppEdition;
  license_locked: boolean;
  code: string;
  reason?: string;
  machine_hwid: string;
  machine_hostname: string;
  machine_os: string;
  active_license: {
    key_id: string;
    cd_key_preview: string;
    user_name: string;
    user_email: string;
    plan_tier: string;
    expires_at: string | null;
    remaining_seconds: number | null;
    bound_hwid: string;
  } | null;
}

export async function evaluateCurrentLicenseState(): Promise<LicenseEvaluationResult> {
  const edition = getActiveAppEdition();
  const meta = getMachineMetadata();

  if (edition === "master") {
    return {
      valid: true,
      edition: "master",
      license_locked: false,
      code: "MASTER_EDITION_UNLOCKED",
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: {
        key_id: "MASTER-AUTHORITY",
        cd_key_preview: "MASTER-ADMIN-EDITION",
        user_name: "Master Administrator",
        user_email: "admin@suomynona.council",
        plan_tier: "Master Edition (Unlimited)",
        expires_at: null,
        remaining_seconds: null,
        bound_hwid: meta.hwid,
      },
    };
  }

  const seal = loadClientSeal();
  if (!seal) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: "UNACTIVATED",
      reason: "Enter a valid paid Suomynona Council CD Key to unlock this computer.",
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  // 1. Hardware Lock match against this PC
  if (seal.bound_hwid !== meta.hwid) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: "HWID_MISMATCH",
      reason: `This CD Key is bound to computer ${seal.bound_hwid} (this PC is ${meta.hwid}). Ask the administrator to Unlink PC first.`,
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  // 2. Monotonic Clock Rollback Anti-Tamper Guard (5-minute tolerance for NTP drift)
  const now = Date.now();
  if (now + 5 * 60_000 < seal.max_seen_utc_ms) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: "CLOCK_ROLLBACK_DETECTED",
      reason: "System clock rollback detected! Restore accurate Windows date/time to validate time-limited license.",
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  // 3. Cryptographic Ed25519 Signature Check
  const tok = verifySignedCdKeyToken(seal.cd_key);
  if (!tok.ok || !tok.payload) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: tok.code || "INVALID_TOKEN",
      reason: tok.error || "Invalid CD Key signature.",
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  if (tok.payload.hwid && tok.payload.hwid !== meta.hwid) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: "HWID_MISMATCH",
      reason: `CD Key is cryptographically locked to ${tok.payload.hwid} (this PC is ${meta.hwid}).`,
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  // 4. Authoritative Revocation / Time Update / Unlink Check
  const remoteLedger = await fetchVerifiedRemoteLedger(seal.remote_ledger_url);
  const auth = findAuthoritativeEntry(tok.payload.kid, remoteLedger);
  if (auth.found) {
    if (auth.revoked) {
      return {
        valid: false,
        edition: "client",
        license_locked: true,
        code: "KEY_REVOKED",
        reason: `CD Key ${tok.payload.kid} has been revoked by the Master Administrator.`,
        machine_hwid: meta.hwid,
        machine_hostname: meta.hostname,
        machine_os: meta.os_label,
        active_license: null,
      };
    }
    if (auth.bound_hwid === null && auth.unlink_count > (seal.seen_unlink_count || 0)) {
      // Admin unlinked this key from this PC! Clear seal so it must be re-activated or used on new PC
      try {
        fs.unlinkSync(getClientSealPath());
      } catch {}
      return {
        valid: false,
        edition: "client",
        license_locked: true,
        code: "UNLINKED_BY_ADMIN",
        reason: `Computer binding for ${tok.payload.kid} was unlinked by the Master Administrator. Re-enter your CD Key to bind.`,
        machine_hwid: meta.hwid,
        machine_hostname: meta.hostname,
        machine_os: meta.os_label,
        active_license: null,
      };
    }
    if (auth.bound_hwid && auth.bound_hwid !== meta.hwid) {
      return {
        valid: false,
        edition: "client",
        license_locked: true,
        code: "HWID_MISMATCH",
        reason: `CD Key ${tok.payload.kid} is bound to another computer (${auth.bound_hwid}).`,
        machine_hwid: meta.hwid,
        machine_hostname: meta.hostname,
        machine_os: meta.os_label,
        active_license: null,
      };
    }
  }

  const effectiveExpMs = auth.found && auth.exp !== null ? auth.exp : tok.payload.exp;
  if (effectiveExpMs > 0 && now > effectiveExpMs) {
    return {
      valid: false,
      edition: "client",
      license_locked: true,
      code: "KEY_EXPIRED",
      reason: `CD Key ${tok.payload.kid} expired on ${new Date(effectiveExpMs).toISOString().replace("T", " ").slice(0, 19)} UTC.`,
      machine_hwid: meta.hwid,
      machine_hostname: meta.hostname,
      machine_os: meta.os_label,
      active_license: null,
    };
  }

  // Advance monotonic timestamp occasionally (every >60s)
  if (now - seal.max_seen_utc_ms > 60_000) {
    const { seal_hmac: _old, ...rest } = seal;
    saveClientSeal({
      ...rest,
      expires_at: effectiveExpMs > 0 ? new Date(effectiveExpMs).toISOString() : null,
      max_seen_utc_ms: now,
    });
  }

  const expiresIso = effectiveExpMs > 0 ? new Date(effectiveExpMs).toISOString() : null;
  const remSec = effectiveExpMs > 0 ? Math.max(0, Math.floor((effectiveExpMs - now) / 1000)) : null;

  return {
    valid: true,
    edition: "client",
    license_locked: false,
    code: "VALID",
    machine_hwid: meta.hwid,
    machine_hostname: meta.hostname,
    machine_os: meta.os_label,
    active_license: {
      key_id: tok.payload.kid,
      cd_key_preview: `${seal.cd_key.slice(0, 16)}…${seal.cd_key.slice(-8)}`,
      user_name: tok.payload.name,
      user_email: tok.payload.email,
      plan_tier: tok.payload.tier,
      expires_at: expiresIso,
      remaining_seconds: remSec,
      bound_hwid: meta.hwid,
    },
  };
}

// Synchronous fast cache updated by middleware / activation for zero-overhead per-request checks
let _lastLicenseEvalCache: { ts: number; result: LicenseEvaluationResult | null } = { ts: 0, result: null };

export function invalidateLicenseEvalCache(): void {
  _lastLicenseEvalCache = { ts: 0, result: null };
}

export function createLicenseEnforcementMiddleware() {
  const ALWAYS_ALLOWED_CLIENT_PATHS = new Set([
    "/api/license/status",
    "/api/license/activate",
    "/api/license/deactivate",
    "/api/onboarding/state",
    "/api/brain/state",
  ]);

  const MASTER_ONLY_PREFIXES = [
    "/api/master/",
    "/api/drm/",
    "/api/license/generate",
    "/api/license/reset-hwid",
    "/api/license/revoke",
  ];

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) {
      return next();
    }

    const edition = getActiveAppEdition();
    if (edition === "master") {
      return next();
    }

    if (MASTER_ONLY_PREFIXES.some((pfx) => req.path === pfx || req.path.startsWith(pfx))) {
      return res.status(403).json({
        ok: false,
        edition: "client",
        error: "Forbidden: Master Admin Edition is required for CD-Key issuance and user administration.",
      });
    }

    if (ALWAYS_ALLOWED_CLIENT_PATHS.has(req.path)) {
      return next();
    }

    let state = _lastLicenseEvalCache.result;
    if (!state || Date.now() - _lastLicenseEvalCache.ts > 5_000) {
      state = await evaluateCurrentLicenseState();
      _lastLicenseEvalCache = { ts: Date.now(), result: state };
    }

    if (!state.valid) {
      return res.status(402).json({
        ok: false,
        edition: "client",
        license_locked: true,
        code: state.code,
        machine_hwid: state.machine_hwid,
        error: state.reason || "Valid hardware-bound Suomynona Council CD Key required.",
      });
    }

    return next();
  };
}

function formatDurationLabel(hours: number | null): string {
  if (!hours || hours <= 0) return "Lifetime";
  if (hours < 48) return `${hours}h`;
  const days = Math.round((hours / 24) * 10) / 10;
  return `${days}d`;
}

export function generateMasterUserLicense(params: {
  user_name: string;
  user_email?: string;
  plan_tier?: string;
  amount_paid?: string;
  paid_status?: "paid" | "trial" | "comped" | "refunded";
  duration_hours?: number | null;
  expires_at?: string | null;
  lifetime?: boolean;
  prebind_hwid?: string | null;
  max_computers?: number;
  notes?: string;
}): RegisteredLicenseUser {
  const store = loadMasterRegistry();
  const id = `usr_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const segA = crypto.randomBytes(2).toString("hex").toUpperCase();
  const segB = crypto.randomBytes(2).toString("hex").toUpperCase();
  const segC = crypto.randomBytes(2).toString("hex").toUpperCase();
  const key_id = `SMN-${segA}-${segB}-${segC}`;

  const isLifetime = Boolean(params.lifetime) || (!params.expires_at && (!params.duration_hours || Number(params.duration_hours) <= 0));
  let expiresAtIso: string | null = null;
  let durationLabel = "Lifetime";
  if (!isLifetime) {
    if (params.expires_at) {
      const dt = new Date(params.expires_at);
      if (!Number.isNaN(dt.getTime())) {
        expiresAtIso = dt.toISOString();
        const diffH = Math.max(1, Math.round((dt.getTime() - Date.now()) / 3_600_000));
        durationLabel = formatDurationLabel(diffH);
      }
    } else if (params.duration_hours && Number(params.duration_hours) > 0) {
      const hrs = Number(params.duration_hours);
      expiresAtIso = new Date(Date.now() + hrs * 3_600_000).toISOString();
      durationLabel = formatDurationLabel(hrs);
    }
  }

  const cleanPrebind = String(params.prebind_hwid || "").trim().toUpperCase() || null;
  const userName = String(params.user_name || "Registered Customer").trim();
  const userEmail = String(params.user_email || "").trim();
  const planTier = String(params.plan_tier || (isLifetime ? "Lifetime Studio" : "Paid Seat")).trim();

  const cd_key = mintSignedCdKey({
    key_id,
    id,
    user_name: userName,
    user_email: userEmail,
    plan_tier: planTier,
    expires_at: expiresAtIso,
    bound_hwid: cleanPrebind,
    max_computers: Math.max(1, Number(params.max_computers) || 1),
    lock_hwid_in_token: Boolean(cleanPrebind),
  });

  const rec: RegisteredLicenseUser = {
    id,
    key_id,
    cd_key,
    user_name: userName,
    user_email: userEmail,
    plan_tier: planTier,
    amount_paid: String(params.amount_paid || "$0.00").trim(),
    paid_status: params.paid_status || "paid",
    registered_at: new Date().toISOString(),
    expires_at: expiresAtIso,
    duration_label: durationLabel,
    bound_hwid: cleanPrebind,
    bound_hostname: cleanPrebind ? "Pre-Bound Target PC" : null,
    bound_os: null,
    bound_at: cleanPrebind ? new Date().toISOString() : null,
    unlink_count: 0,
    max_computers: Math.max(1, Number(params.max_computers) || 1),
    revoked: false,
    activations_count: 0,
    last_verified_at: null,
    notes: String(params.notes || "Hardware-bound paid CD key").trim(),
  };

  store.users.unshift(rec);
  saveMasterRegistry(store);
  log(`👑 [Master Authority] Registered paid user "${userName}" & issued Ed25519 CD Key ${key_id} (${durationLabel})`);
  pushLiveConsole(`👑 [Master CD-Key] Issued ${key_id} for ${userName} (${durationLabel}${cleanPrebind ? ` · Bound: ${cleanPrebind}` : " · 1st-PC Auto-Bind"})`, {
    category: "SYSTEM",
    level: "ok",
  });
  return rec;
}

export function registerLicensingRoutes(app: Express): void {
  // ── Shared / Client Activation & Status Endpoints ──
  app.get("/api/license/status", async (_req: Request, res: Response) => {
    const evalState = await evaluateCurrentLicenseState();
    const edition = evalState.edition;
    const pubPem = getVerificationPublicKeyPem();
    const masterUsers = edition === "master" ? loadMasterRegistry().users : undefined;

    // Legacy compatibility mapping for #drm-studio-modal in Master Edition
    const legacyLicenses =
      edition === "master" && masterUsers
        ? masterUsers.map((u) => ({
            key: u.cd_key,
            key_id: u.key_id,
            buyer_name: u.user_name,
            buyer_email: u.user_email,
            bound_hwid: u.bound_hwid,
            bound_at: u.bound_at,
            revoked: u.revoked,
            expires_at: u.expires_at,
          }))
        : [];

    res.json({
      ok: true,
      edition,
      activated: evalState.valid,
      license_locked: evalState.license_locked,
      code: evalState.code,
      reason: evalState.reason || "",
      hwid: evalState.machine_hwid,
      machine_hwid: evalState.machine_hwid,
      machine_hostname: evalState.machine_hostname,
      machine_os: evalState.machine_os,
      active_key: evalState.active_license?.key_id || "",
      active_license: evalState.active_license,
      public_key_fingerprint: computePubKeyFingerprint(pubPem),
      licenses: legacyLicenses,
    });
  });

  app.post("/api/license/activate", async (req: Request, res: Response) => {
    const rawInput = String(req.body?.key || "").trim();
    const remoteLedgerUrl = String(req.body?.remote_ledger_url || loadEditionBuildConfig().remoteLedgerUrl || "").trim();
    const meta = getMachineMetadata();

    if (!rawInput) {
      return res.status(400).json({ ok: false, error: "Please paste your Suomynona Council CD Key (SMN1-...)." });
    }

    if (getActiveAppEdition() === "master" && rawInput.toUpperCase() === "CNG-OWNER-MASTER-KEY-2026") {
      invalidateLicenseEvalCache();
      return res.json({
        ok: true,
        edition: "master",
        activated: true,
        hwid: meta.hwid,
        license: { key: "MASTER-AUTHORITY", buyer_name: "Master Administrator" },
        message: `Master Edition unlocked on ${meta.hwid}.`,
      });
    }

    // Allow looking up full SMN1-... token by short Key ID (SMN-XXXX-XXXX-XXXX) if Master registry is accessible
    let tokenStr = rawInput;
    const regPath = getMasterRegistryPath();
    if (!tokenStr.startsWith("SMN1-") && fs.existsSync(regPath)) {
      const reg = loadMasterRegistry();
      const matchById = reg.users.find((u) => u.key_id.toUpperCase() === rawInput.toUpperCase());
      if (matchById) tokenStr = matchById.cd_key;
    }

    const verified = verifySignedCdKeyToken(tokenStr);
    if (!verified.ok || !verified.payload) {
      log(`🚫 [License Gate] Rejected invalid CD Key on ${meta.hwid}: ${verified.error}`);
      return res.status(403).json({
        ok: false,
        code: verified.code,
        error: verified.error || "Invalid CD Key.",
      });
    }

    const payload = verified.payload;
    if (payload.hwid && payload.hwid !== meta.hwid) {
      return res.status(403).json({
        ok: false,
        code: "HWID_MISMATCH",
        bound_hwid: payload.hwid,
        attempted_hwid: meta.hwid,
        error: `HARDWARE LOCK VIOLATION: Key ${payload.kid} is permanently bound to computer ${payload.hwid} (this PC is ${meta.hwid}).`,
      });
    }

    const remoteLedger = await fetchVerifiedRemoteLedger(remoteLedgerUrl);
    const auth = findAuthoritativeEntry(payload.kid, remoteLedger);
    if (auth.found) {
      if (auth.revoked) {
        return res.status(403).json({
          ok: false,
          code: "KEY_REVOKED",
          error: `CD Key ${payload.kid} has been revoked by the administrator.`,
        });
      }
      if (auth.bound_hwid && auth.bound_hwid !== meta.hwid) {
        return res.status(403).json({
          ok: false,
          code: "HWID_MISMATCH",
          bound_hwid: auth.bound_hwid,
          attempted_hwid: meta.hwid,
          error: `HARDWARE LOCK VIOLATION: Key ${payload.kid} is already bound to computer ${auth.bound_hwid} (this PC is ${meta.hwid}). Ask admin to Unlink PC to transfer.`,
        });
      }
    }

    const effectiveExpMs = auth.found && auth.exp !== null ? auth.exp : payload.exp;
    if (effectiveExpMs > 0 && Date.now() > effectiveExpMs) {
      return res.status(403).json({
        ok: false,
        code: "KEY_EXPIRED",
        error: `CD Key ${payload.kid} expired on ${new Date(effectiveExpMs).toISOString().replace("T", " ").slice(0, 19)} UTC.`,
      });
    }

    // Update Master Registry if accessible locally (records bound computer HWID, hostname, OS, activation count)
    let unlinkCount = auth.found ? auth.unlink_count : 0;
    if (fs.existsSync(regPath)) {
      const store = loadMasterRegistry();
      const rec = store.users.find((u) => u.key_id === payload.kid);
      if (rec) {
        if (rec.bound_hwid && rec.bound_hwid !== meta.hwid) {
          return res.status(403).json({
            ok: false,
            code: "HWID_MISMATCH",
            error: `Key ${payload.kid} is already bound to ${rec.bound_hwid}.`,
          });
        }
        rec.bound_hwid = meta.hwid;
        rec.bound_hostname = meta.hostname;
        rec.bound_os = meta.os_label;
        rec.bound_at = rec.bound_at || new Date().toISOString();
        rec.activations_count = (Number(rec.activations_count) || 0) + 1;
        rec.last_verified_at = new Date().toISOString();
        unlinkCount = Number(rec.unlink_count || 0);
        saveMasterRegistry(store);
      }
    }

    const prevSeal = loadClientSeal();
    const maxSeen = Math.max(Date.now(), prevSeal?.max_seen_utc_ms || 0);
    saveClientSeal({
      cd_key: tokenStr,
      key_id: payload.kid,
      user_name: payload.name,
      user_email: payload.email,
      plan_tier: payload.tier,
      bound_hwid: meta.hwid,
      bound_hostname: meta.hostname,
      bound_os: meta.os_label,
      bound_at: new Date().toISOString(),
      expires_at: effectiveExpMs > 0 ? new Date(effectiveExpMs).toISOString() : null,
      activations_count: (prevSeal?.activations_count || 0) + 1,
      seen_unlink_count: unlinkCount,
      max_seen_utc_ms: maxSeen,
      remote_ledger_url: remoteLedgerUrl || undefined,
    });

    invalidateLicenseEvalCache();
    log(`🔐 [License Activated] Key ${payload.kid} (${payload.name}) verified & bound to ${meta.hwid}`);
    res.json({
      ok: true,
      activated: true,
      hwid: meta.hwid,
      key_id: payload.kid,
      license: {
        key: payload.kid,
        buyer_name: payload.name,
        buyer_email: payload.email,
        plan_tier: payload.tier,
        expires_at: effectiveExpMs > 0 ? new Date(effectiveExpMs).toISOString() : null,
        bound_hwid: meta.hwid,
      },
      message: `CD Key ${payload.kid} verified via Ed25519 signature and hardware-bound to ${meta.hwid}!`,
    });
  });

  app.post("/api/license/deactivate", (_req: Request, res: Response) => {
    try {
      const p = getClientSealPath();
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch {}
    invalidateLicenseEvalCache();
    res.json({ ok: true, activated: false });
  });

  // ── Master-Only Guard Helper ──
  const requireMaster = (_req: Request, res: Response, next: NextFunction) => {
    if (getActiveAppEdition() !== "master") {
      return res.status(403).json({ ok: false, error: "Master Edition required." });
    }
    next();
  };

  // ── Master Edition Administration Endpoints (/api/master/licenses/*) ──
  app.get("/api/master/licenses", requireMaster, (_req: Request, res: Response) => {
    const vault = ensureMasterKeypair();
    const store = loadMasterRegistry();
    const now = Date.now();
    const meta = getMachineMetadata();

    const enriched = store.users.map((u) => {
      const expMs = u.expires_at ? new Date(u.expires_at).getTime() : 0;
      const isExpired = expMs > 0 && now > expMs;
      const remainingSec = expMs > 0 ? Math.max(0, Math.floor((expMs - now) / 1000)) : null;
      return {
        ...u,
        is_expired: isExpired,
        remaining_seconds: remainingSec,
        effective_status: u.revoked ? "revoked" : isExpired ? "expired" : "active",
      };
    });

    const stats = {
      total_users: enriched.length,
      active_keys: enriched.filter((u) => u.effective_status === "active").length,
      bound_pcs: enriched.filter((u) => Boolean(u.bound_hwid)).length,
      time_limited: enriched.filter((u) => Boolean(u.expires_at) && !u.revoked).length,
      expired_keys: enriched.filter((u) => u.is_expired && !u.revoked).length,
      revoked_keys: enriched.filter((u) => u.revoked).length,
    };

    res.json({
      ok: true,
      edition: "master",
      machine_hwid: meta.hwid,
      public_key_fingerprint: vault.fingerprint,
      public_key_pem: vault.publicKeyPem,
      remote_ledger_url: store.remote_ledger_url || "",
      remote_gist_id: store.remote_gist_id || "",
      last_synced_at: store.last_synced_at,
      stats,
      users: enriched,
    });
  });

  app.post("/api/master/licenses/generate", requireMaster, (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const rec = generateMasterUserLicense({
        user_name: b.user_name || b.buyer_name || "Paid User",
        user_email: b.user_email || b.buyer_email || "",
        plan_tier: b.plan_tier || "Monthly Pro",
        amount_paid: b.amount_paid || "$49.00",
        paid_status: b.paid_status || "paid",
        duration_hours: b.duration_hours !== undefined ? Number(b.duration_hours) : undefined,
        expires_at: b.expires_at || null,
        lifetime: Boolean(b.lifetime),
        prebind_hwid: b.prebind_hwid || null,
        max_computers: Number(b.max_computers) || 1,
        notes: b.notes || "",
      });
      invalidateLicenseEvalCache();
      res.json({ ok: true, user: rec, cd_key: rec.cd_key, key_id: rec.key_id });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  app.post("/api/master/licenses/set-time", requireMaster, (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const targetId = String(b.id || b.key_id || b.key || "").trim();
      const mode = String(b.mode || "add_hours").toLowerCase();
      const store = loadMasterRegistry();
      const u = store.users.find((x) => x.id === targetId || x.key_id === targetId || x.cd_key === targetId);
      if (!u) return res.status(404).json({ ok: false, error: "Registered user / CD key not found." });

      if (mode === "lifetime") {
        u.expires_at = null;
        u.duration_label = "Lifetime";
      } else if (mode === "expire_now") {
        u.expires_at = new Date(Date.now() - 1000).toISOString();
        u.duration_label = "Expired";
      } else if (mode === "set_iso" && b.expires_at) {
        const dt = new Date(b.expires_at);
        if (Number.isNaN(dt.getTime())) return res.status(400).json({ ok: false, error: "Invalid expiration date." });
        u.expires_at = dt.toISOString();
        u.duration_label = formatDurationLabel(Math.max(1, Math.round((dt.getTime() - Date.now()) / 3_600_000)));
      } else {
        const addHrs = Number(b.hours || 24);
        const curBase = u.expires_at && new Date(u.expires_at).getTime() > Date.now() ? new Date(u.expires_at).getTime() : Date.now();
        const nextMs = curBase + addHrs * 3_600_000;
        u.expires_at = new Date(nextMs).toISOString();
        u.duration_label = formatDurationLabel(Math.max(1, Math.round((nextMs - Date.now()) / 3_600_000)));
      }

      // Re-mint signed token with updated expiration timestamp
      u.cd_key = mintSignedCdKey({
        key_id: u.key_id,
        id: u.id,
        user_name: u.user_name,
        user_email: u.user_email,
        plan_tier: u.plan_tier,
        expires_at: u.expires_at,
        bound_hwid: u.bound_hwid,
        max_computers: u.max_computers,
        lock_hwid_in_token: false,
      });

      saveMasterRegistry(store);
      invalidateLicenseEvalCache();
      log(`⏱️ [Master Authority] Updated time for ${u.key_id} (${u.user_name}) -> ${u.expires_at || "Lifetime"}`);
      res.json({ ok: true, user: u });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  app.post("/api/master/licenses/unlink-hwid", requireMaster, (req: Request, res: Response) => {
    const targetId = String(req.body?.id || req.body?.key_id || req.body?.key || "").trim();
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.id === targetId || x.key_id === targetId || x.cd_key === targetId);
    if (!u) return res.status(404).json({ ok: false, error: "Registered user / CD key not found." });

    const prevHwid = u.bound_hwid;
    u.bound_hwid = null;
    u.bound_hostname = null;
    u.bound_os = null;
    u.bound_at = null;
    u.unlink_count = (Number(u.unlink_count) || 0) + 1;
    // Re-mint unbound token in case it was previously hard-locked to a specific HWID
    u.cd_key = mintSignedCdKey({
      key_id: u.key_id,
      id: u.id,
      user_name: u.user_name,
      user_email: u.user_email,
      plan_tier: u.plan_tier,
      expires_at: u.expires_at,
      bound_hwid: null,
      max_computers: u.max_computers,
      lock_hwid_in_token: false,
    });
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    log(`🔓 [Master Authority] Unlinked computer ${prevHwid || "(none)"} from CD key ${u.key_id} (${u.user_name})`);
    res.json({ ok: true, user: u, previous_hwid: prevHwid });
  });

  app.post("/api/master/licenses/bind-hwid", requireMaster, (req: Request, res: Response) => {
    const targetId = String(req.body?.id || req.body?.key_id || "").trim();
    const targetHwid = String(req.body?.hwid || "").trim().toUpperCase();
    if (!targetHwid) return res.status(400).json({ ok: false, error: "Provide a valid target HWID (e.g. SMN-PC-XXXX-XXXX-XXXX)." });
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.id === targetId || x.key_id === targetId);
    if (!u) return res.status(404).json({ ok: false, error: "Registered user / CD key not found." });

    u.bound_hwid = targetHwid;
    u.bound_hostname = String(req.body?.hostname || "Admin Bound Computer").trim();
    u.bound_at = new Date().toISOString();
    u.cd_key = mintSignedCdKey({
      key_id: u.key_id,
      id: u.id,
      user_name: u.user_name,
      user_email: u.user_email,
      plan_tier: u.plan_tier,
      expires_at: u.expires_at,
      bound_hwid: targetHwid,
      max_computers: u.max_computers,
      lock_hwid_in_token: true,
    });
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    log(`🔒 [Master Authority] Bound CD key ${u.key_id} (${u.user_name}) to HWID ${targetHwid}`);
    res.json({ ok: true, user: u });
  });

  app.post("/api/master/licenses/revoke", requireMaster, (req: Request, res: Response) => {
    const targetId = String(req.body?.id || req.body?.key_id || req.body?.key || "").trim();
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.id === targetId || x.key_id === targetId || x.cd_key === targetId);
    if (!u) return res.status(404).json({ ok: false, error: "Registered user / CD key not found." });

    u.revoked = req.body?.revoked !== undefined ? Boolean(req.body.revoked) : !u.revoked;
    u.revoked_reason = u.revoked ? String(req.body?.reason || "Revoked by Master Administrator") : undefined;
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    log(`${u.revoked ? "🚫" : "♻️"} [Master Authority] ${u.revoked ? "Revoked" : "Restored"} CD key ${u.key_id} (${u.user_name})`);
    res.json({ ok: true, user: u });
  });

  app.post("/api/master/licenses/update-user", requireMaster, (req: Request, res: Response) => {
    const b = req.body || {};
    const targetId = String(b.id || b.key_id || "").trim();
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.id === targetId || x.key_id === targetId);
    if (!u) return res.status(404).json({ ok: false, error: "User not found." });

    if (b.user_name !== undefined) u.user_name = String(b.user_name).trim() || u.user_name;
    if (b.user_email !== undefined) u.user_email = String(b.user_email).trim();
    if (b.plan_tier !== undefined) u.plan_tier = String(b.plan_tier).trim();
    if (b.amount_paid !== undefined) u.amount_paid = String(b.amount_paid).trim();
    if (b.paid_status !== undefined) u.paid_status = b.paid_status;
    if (b.notes !== undefined) u.notes = String(b.notes).trim();
    saveMasterRegistry(store);
    res.json({ ok: true, user: u });
  });

  app.delete("/api/master/licenses/:id", requireMaster, (req: Request, res: Response) => {
    const targetId = String(req.params.id || "").trim();
    const store = loadMasterRegistry();
    const before = store.users.length;
    store.users = store.users.filter((x) => x.id !== targetId && x.key_id !== targetId);
    if (store.users.length === before) {
      return res.status(404).json({ ok: false, error: "User / CD key not found." });
    }
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    log(`🗑️ [Master Authority] Deleted license record ${targetId}`);
    res.json({ ok: true, remaining: store.users.length });
  });

  app.post("/api/master/licenses/sync-ledger", requireMaster, async (req: Request, res: Response) => {
    try {
      const vault = ensureMasterKeypair();
      const store = loadMasterRegistry();
      const conf = readConf();
      const ghToken = String(req.body?.gh_token || conf.GH_TOKEN || process.env.GH_TOKEN || "").trim();

      const ledgerPayload: RemoteLedgerPayload = {
        ts: Date.now(),
        entries: store.users.map((u) => ({
          kid: u.key_id,
          revoked: Boolean(u.revoked),
          exp: u.expires_at ? new Date(u.expires_at).getTime() : 0,
          bound_hwid: u.bound_hwid,
          unlink_count: Number(u.unlink_count || 0),
        })),
      };
      const payloadB64 = b64UrlEncode(JSON.stringify(ledgerPayload));
      const sigB64 = b64UrlEncode(crypto.sign(null, Buffer.from(payloadB64, "utf-8"), vault.privateKeyPem));
      const signedEnvelope: SignedRemoteLedger = { payload_b64: payloadB64, sig_b64: sigB64 };
      const jsonBody = JSON.stringify(signedEnvelope, null, 2);

      // Always write a local export copy in council_outputs
      const localExportPath = path.join(DATA_ROOT, "council_outputs", "suomynona_license_ledger.signed.json");
      fs.mkdirSync(path.dirname(localExportPath), { recursive: true });
      fs.writeFileSync(localExportPath, jsonBody, "utf-8");

      if (!ghToken) {
        return res.json({
          ok: true,
          synced_cloud: false,
          local_ledger_path: localExportPath,
          message: `Signed Ed25519 ledger exported locally to ${localExportPath}. Configure GH_TOKEN in /host Global Auth to publish live to GitHub Gist.`,
        });
      }

      const gistId = String(req.body?.gist_id || store.remote_gist_id || "").trim();
      const apiUrl = gistId ? `https://api.github.com/gists/${gistId}` : "https://api.github.com/gists";
      const method = gistId ? "PATCH" : "POST";
      const ghRes = await fetch(apiUrl, {
        method,
        headers: {
          Authorization: `token ${ghToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "suomynona-council-master-authority",
        },
        body: JSON.stringify({
          description: "Suomynona Council Ed25519 Signed License Revocation & HWID Ledger",
          public: false,
          files: {
            "suomynona_license_ledger.json": { content: jsonBody },
          },
        }),
      });
      if (!ghRes.ok) {
        return res.status(400).json({ ok: false, error: `GitHub Gist sync returned HTTP ${ghRes.status}.` });
      }
      const ghJson: any = await ghRes.json();
      const rawUrl = ghJson?.files?.["suomynona_license_ledger.json"]?.raw_url?.replace(/\/raw\/[0-9a-f]+\//i, "/raw/") || "";
      store.remote_gist_id = ghJson?.id || gistId;
      if (rawUrl) store.remote_ledger_url = rawUrl;
      store.last_synced_at = new Date().toISOString();
      saveMasterRegistry(store);
      if (rawUrl) saveConf({ LICENSE_LEDGER_URL: rawUrl });

      res.json({
        ok: true,
        synced_cloud: true,
        gist_id: store.remote_gist_id,
        remote_ledger_url: store.remote_ledger_url,
        local_ledger_path: localExportPath,
        message: `Published Ed25519-signed license ledger (${store.users.length} keys) to secret GitHub Gist!`,
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  // Legacy compatibility endpoints used by #drm-studio-modal (Master-gated)
  app.post("/api/license/generate", requireMaster, (req: Request, res: Response) => {
    const rec = generateMasterUserLicense({
      user_name: req.body?.buyer_name || "Commercial Buyer",
      user_email: req.body?.buyer_email || "",
      duration_hours: Number(req.body?.duration_hours) || 0,
      lifetime: !req.body?.duration_hours,
      notes: req.body?.notes || "1-PC Hardware-Locked License",
    });
    res.json({
      ok: true,
      license: {
        key: rec.cd_key,
        key_id: rec.key_id,
        buyer_name: rec.user_name,
        buyer_email: rec.user_email,
        bound_hwid: rec.bound_hwid,
        revoked: rec.revoked,
      },
    });
  });

  app.post("/api/license/reset-hwid", requireMaster, (req: Request, res: Response) => {
    const key = String(req.body?.key || "").trim();
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.cd_key === key || x.key_id === key || x.id === key);
    if (!u) return res.status(404).json({ ok: false, error: "License key not found" });
    u.bound_hwid = null;
    u.bound_hostname = null;
    u.bound_os = null;
    u.bound_at = null;
    u.unlink_count = (Number(u.unlink_count) || 0) + 1;
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    res.json({ ok: true });
  });

  app.post("/api/license/revoke", requireMaster, (req: Request, res: Response) => {
    const key = String(req.body?.key || "").trim();
    const store = loadMasterRegistry();
    const u = store.users.find((x) => x.cd_key === key || x.key_id === key || x.id === key);
    if (!u) return res.status(404).json({ ok: false, error: "License key not found" });
    u.revoked = !u.revoked;
    saveMasterRegistry(store);
    invalidateLicenseEvalCache();
    res.json({ ok: true });
  });
}

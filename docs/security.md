# ◈ Suomynona Council — Anti-Reverse-Engineering, Asymmetric Ed25519 Licensing & Security Architecture

This guide documents the cryptographic licensing architecture, Master vs. Client Edition separation, anti-debugging/anti-tampering layers built into `Suomynona-Council-Client-Portable.exe`, and additional native binary hardening steps you can apply for maximum commercial protection.

---

## 1. Two-Binary Architecture: Master Edition vs. Client Edition

The build pipeline (`npm run dist:both` via `scripts/build-editions.mjs` and `scripts/build-desktop-server.mjs`) compiles two distinct Windows x64 portable executables:

| Feature / Artifact | `Suomynona-Council-Master-Portable.exe` (Your Admin Build) | `Suomynona-Council-Client-Portable.exe` (Customer Build) |
|---|---|---|
| **Ed25519 Private Signing Key** | Present in `.master_vault/master_ed25519.json` & `seed_data/master_ed25519.json` | **Physically absent** (0 bytes of private key material anywhere in `app.asar`) |
| **Ed25519 Public Verification Key** | Embedded in `desktop-edition.json` | Embedded in `desktop-edition.json` (read-only signature verification) |
| **`👑 Users & Keys` Admin Tab** | Enabled (`#view-master-licenses` + `/api/master/licenses/*`) | Removed from DOM; all `/api/master/*` & `/api/drm/*` routes return `HTTP 403` |
| **Hardware-Bound Activation Gate** | Pre-unlocked (`MASTER_EDITION_UNLOCKED`) | Mandatory on startup; blocks `/api/*` with `HTTP 402` until valid `SMN1-...` key is activated |
| **DevTools & Node Inspector** | Enabled (`F12` / `Ctrl+Shift+I`) | Disabled (`devTools: false`, shortcuts blocked, `--inspect` / `NODE_OPTIONS` terminates process) |
| **Bundle Integrity Guard** | Hot-reload allowed from local Git repo | Verifies `serverBundleSha256` of `dist-server/server.cjs` before spawning; blocks external `live-app-runtime` overrides |

---

## 2. Cryptographic Ed25519 CD-Key Format (`SMN1-...`)

Unlike traditional symmetric HMAC or pattern-matched serial keys (where an attacker who extracts the binary can find the shared secret and write a keygen), Suomynona Council uses **asymmetric Ed25519 digital signatures** (`crypto.sign` / `crypto.verify` with RFC 8032 Ed25519):

1. **Token Structure**:
   ```text
   SMN1-<base64url(JSON_Payload)>.<base64url(Ed25519_64Byte_Signature)>
   ```
2. **Signed Claims Payload**:
   - `v`: Schema version (`1`)
   - `kid`: Short Key ID (`SMN-XXXX-XXXX-XXXX`)
   - `uid`: Registered customer ID
   - `name` / `email` / `tier`: Customer metadata
   - `iat`: Issued-at timestamp (epoch ms)
   - `exp`: Expiration timestamp (`0` = Lifetime, `>0` = UTC epoch ms)
   - `hwid`: Optional pre-bound Hardware ID (`SMN-PC-XXXX-XXXX-XXXX`) or `""` for 1st-PC auto-binding
3. **Why a Keygen Cannot Be Written from the Client EXE**:
   - The Client executable only possesses the **Ed25519 Public Key** (`ed25519PublicKeyPem`).
   - Generating a valid signature for a new HWID or altered expiration date mathematically requires the **Ed25519 Private Key**, which never leaves your Master machine (`.master_vault/master_ed25519.json`).

---

## 3. Hardware Fingerprinting (`SMN-PC-XXXX-XXXX-XXXX`) & Anti-Tamper Seal

1. **Hardware Fingerprint Calculation (`computeStrongMachineHwid` in `server/licensing.ts`)**:
   - Queries Windows Registry `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid` combined with OS platform, architecture, CPU model, logical core count, and physical RAM capacity, hashed with SHA-256 into `SMN-PC-XXXX-XXXX-XXXX`.
2. **Machine-Bound Activation Seal (`client_license_seal.json`)**:
   - When a buyer activates their `SMN1-...` CD-Key on their computer, the client writes `client_license_seal.json` protected by an HMAC-SHA256 seal (`seal_hmac`) keyed with the machine's raw `MachineGuid`, `HWID`, and the Ed25519 public key.
   - Copying `client_license_seal.json` to another computer immediately fails both the `seal_hmac` check and the `bound_hwid === meta.hwid` check.
3. **Monotonic Clock-Rollback Trap (`max_seen_utc_ms`)**:
   - The seal records the highest UTC timestamp ever observed (`max_seen_utc_ms`).
   - If a user rolls back their Windows system clock by more than 5 minutes to bypass a time-limited key expiration, `evaluateCurrentLicenseState()` triggers `CLOCK_ROLLBACK_DETECTED` and locks the application until accurate system time is restored.

---

## 4. Managing Users, Time Limits, Unlinking PCs & Remote Revocation

In **Master Edition** (`Suomynona-Council-Master-Portable.exe` or local dev mode), open the **`👑 Users & Keys`** tab on the left navigation rail:

- **Register Paid User & Generate CD Key**: Enter Customer Name, Email, Plan Tier, Paid Amount, Time Limit (`24h`, `7d`, `30d`, `90d`, `365d`, `Lifetime`, or custom hours), and optional Pre-Bind HWID. Click **`🔑 Register User & Generate Signed CD Key`**.
- **Unlink Computer (`🔓 Unlink PC`)**: Clears `bound_hwid` and increments `unlink_count` so a legitimate customer who bought a new computer can activate their key on the new machine (while invalidating the old PC on next ledger check).
- **Bind Computer (`🔒 Bind PC`)**: Hard-locks a CD key to a specific `SMN-PC-XXXX-XXXX-XXXX` Hardware ID and re-mints the signed token with the HWID embedded directly inside the Ed25519-signed payload.
- **Adjust Time (`+24h`, `+7d`, `+30d`, `⏱️ Set Time`, `∞ Lifetime`, `⌛ Expire`)**: Updates the user's expiration timestamp and re-mints the signed token.
- **Revoke / Restore (`🚫 Revoke` / `♻️ Restore`)**: Immediately revokes or restores a user's CD key.
- **Cloud Revocation & HWID Ledger (`☁️ Sync Signed Ledger (Gist)`)**:
  - Signs the entire revocation/expiration/HWID table (`suomynona_license_ledger.json`) with your Master Ed25519 private key and publishes it to a secret GitHub Gist (using your `GH_TOKEN`) as well as `council_outputs/suomynona_license_ledger.signed.json`.
  - Even if a customer is completely offline from your Master PC, any Client build configured with `remoteLedgerUrl` fetches and verifies the Ed25519 signature on the Gist ledger every 30 seconds to enforce remote revocations, unlinks, and time changes.

---

## 5. Additional Steps to Make Commercial Distribution Even Harder to Crack

While asymmetric Ed25519 prevents keygens and the built-in Electron hardening blocks DevTools, `--inspect`, source maps, and unverified bundle swaps, someone with local administrator access to an offline Windows binary can still attempt binary patching of the unpacked `app.asar` or Node runtime. To achieve maximum commercial-grade anti-cracking resistance:

1. **Compile `dist-server/server.cjs` to V8 Bytecode (`bytenode`)**:
   - Convert `dist-server/server.cjs` into native V8 bytecode (`server.jsc`) using `bytenode` aligned with Electron's Node/V8 version so there is zero human-readable JavaScript inside `app.asar`.
2. **Enable Electron Fuses (`@electron/fuses`) on `Suomynona-Council-Client-Portable.exe`**:
   - Flip the official Electron binary fuses before shipping to customers:
     - `RunAsNode: false` (or restrict to internal spawn verification)
     - `EnableNodeOptionsEnvironmentVariable: false`
     - `EnableNodeCliInspectArguments: false`
     - `EnableEmbeddedAsarIntegrityValidation: true`
     - `OnlyLoadAppFromAsar: true`
   - When `EnableEmbeddedAsarIntegrityValidation` and `OnlyLoadAppFromAsar` are fused into the PE header and the `.exe` is Authenticode-signed, Windows and Chromium verify the cryptographic hash of `app.asar` at the C++ binary level before booting JavaScript—modifying even 1 byte inside `app.asar` causes the executable to refuse to launch.
3. **Authenticode Code-Sign the Windows `.exe` (EV / OV Certificate) + Native Packer (VMProtect / Themida)**:
   - Sign `Suomynona-Council-Client-Portable.exe` with a Windows Authenticode certificate so Windows SmartScreen trusts the binary and any hex edit invalidates the PE digital signature.
   - Optionally wrap the outer native binary with **VMProtect** or **Themida** to virtualize the entry stub and detect kernel/user-mode debuggers (`x64dbg`, `IDA Pro`, `Cheat Engine`, `ScyllaHide`).
4. **Move Critical Cloud/Proxy Inference Dispatch Behind Your Server-Side Token Broker**:
   - Any code that runs 100% locally on the user's CPU/GPU can theoretically be emulated by a determined reverse engineer. By validating the user's `SMN1-...` Ed25519 token on your own lightweight Cloudflare Worker / API gateway before proxying premium cloud or Gist tunnel orchestration, a patched binary still cannot access your hosted infrastructure without a non-revoked, unexpired Ed25519-signed token.

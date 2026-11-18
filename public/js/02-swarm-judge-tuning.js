// ── 🐝 SWARM PRE-DEPLOYMENT SETUP WINDOW & 48 GROUPED SPECIALIST AGENTS ──
const BUILTIN_SWARM_GROUP_SPECIALISTS = [
  // ══ GROUP 1: 💻 CODING, APP BUILDING & DEVOPS (12 SPECIALISTS) ══
  {
    id: "cool-fullstack-gui-exe-forge",
    category: "💻 Coding, App Building & DevOps",
    name: "🚀 #22 Full-Stack Web, CLI, Desktop GUI & EXE Builder",
    role: "Builds complete websites, command-line tools, desktop apps, and standalone Windows .exe programs from scratch.",
    sys: "Design, write, self-test, and package complete, zero-placeholder applications (Python, Node.js, HTML/Canvas GUI, CLI tools, and standalone Windows EXE bundles) that pass terminal verification with exit code 0.",
  },
  {
    id: "cool-autonomous-decompiler-architect",
    category: "💻 Coding, App Building & DevOps",
    name: "🧬 #21 Legacy Code & Binary Reverse-Engineering Architect",
    role: "Unscrambles messy, minified, or compiled code back into clean, readable, well-organized source files.",
    sys: "Take any opaque binary format, minified bundle, legacy script, or undocumented API and reconstruct clean, typed, well-documented source code and architecture diagrams.",
  },
  {
    id: "coding-python-automation-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🐍 #39 Python Automation, CLI & Scripting Specialist",
    role: "Writes clean Python scripts, command-line tools, file organizers, and automated data workflows.",
    sys: "Write clean, zero-placeholder Python 3 scripts, CLI tools, async workers, file/JSON/CSV processors, and desktop utilities verified with py_compile and live execution.",
  },
  {
    id: "coding-frontend-ui-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "⚛️ #40 Frontend UI, React & Modern CSS Specialist",
    role: "Designs fast, clean, responsive web pages, dashboards, buttons, and layouts with zero sloppy text overflow.",
    sys: "Build fast, responsive, accessible web interfaces, interactive dashboards, clean CSS Grid/Flexbox layouts with zero text overflow, and smooth keyboard/mouse interactions.",
  },
  {
    id: "coding-backend-api-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "⚙️ #41 Backend API, Node/FastAPI & Server Specialist",
    role: "Builds reliable web servers, login endpoints, REST/GraphQL APIs, and live WebSocket connections.",
    sys: "Engineer production-grade Node.js/Express, FastAPI, Flask, and Go REST/GraphQL/WebSocket backends with validation, authentication, rate limiting, and structured error handling.",
  },
  {
    id: "coding-database-sql-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🗄️ #42 Database Design, SQL Speed & Migration Specialist",
    role: "Sets up clean database tables, speeds up slow searches with indexes, and moves data safely without loss.",
    sys: "Design normalized SQLite, PostgreSQL, MySQL, and NoSQL schemas, write fast indexed queries, eliminate bottlenecks, and build safe migration and seed scripts.",
  },
  {
    id: "coding-systems-rust-cpp-go-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🦀 #43 Systems Programming: Rust, C/C++ & Go Specialist",
    role: "Writes ultra-fast, low-memory compiled programs and high-speed network tools in Rust, C, C++, and Go.",
    sys: "Build high-throughput, memory-safe CLI binaries, concurrent network services, parsers, and low-latency native modules in Rust, C, C++, and Go.",
  },
  {
    id: "coding-shell-powershell-bash-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "💻 #44 Bash, PowerShell & Cross-Platform Shell Specialist",
    role: "Writes one-click Linux Bash and Windows PowerShell/CMD scripts to automate installs, backups, and system tasks.",
    sys: "Write defensive, idempotent Linux Bash, POSIX sh, Windows PowerShell, and CMD automation scripts for installers, batch file tasks, and system administration.",
  },
  {
    id: "coding-debugger-refactor-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🐞 #45 Bug Hunter, Crash Debugger & Code Cleanup Specialist",
    role: "Finds the exact reason broken code crashes or freezes, fixes the bug, and cleans up messy code.",
    sys: "Trace stack traces, silent state bugs, broken imports, and memory leaks to their exact offending line, ship surgical fixes, and refactor messy code into clean modules.",
  },
  {
    id: "coding-qa-test-automation-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🧪 #46 Automated Testing, QA & Edge-Case Verifier",
    role: "Writes automatic tests and throws weird inputs at your app to prove nothing breaks before you launch.",
    sys: "Build comprehensive pytest, unittest, Jest/Vitest, and Playwright test suites covering empty inputs, bad data, network timeouts, and concurrency edge cases.",
  },
  {
    id: "coding-devops-docker-cicd-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🐳 #47 Docker, CI/CD Pipelines & Cloud Deploy Specialist",
    role: "Packages apps into easy Docker containers, sets up automatic GitHub build pipelines, and configures live servers.",
    sys: "Author multi-stage Dockerfiles, docker-compose stacks, GitHub Actions workflows, Nginx/Caddy reverse-proxy configs, and zero-downtime deployment scripts.",
  },
  {
    id: "coding-api-bot-integration-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "🔌 #48 API Integration, Webhooks, Bots & SDK Specialist",
    role: "Connects external services, payment/login APIs, webhooks, and Discord/Telegram/Slack bots together smoothly.",
    sys: "Wire REST/WebSocket SDKs, Discord/Telegram/Slack bots, Stripe/GitHub/HuggingFace webhooks, retry queues, and custom MCP tool servers cleanly.",
  },
  {
    id: "automation-form-workflow-specialist",
    category: "💻 Coding, App Building & DevOps",
    name: "📋 #49 Web Form Automation & Browser Workflow Specialist",
    role: "Automatically fills out multi-step web forms, dropdowns, checkboxes, and file uploads in a real or headless browser.",
    sys: "Build resilient Playwright, Selenium, Puppeteer, and HTTP session scripts that fill multi-step web forms, select dropdowns, upload files, handle CSRF/cookies, and verify submission results.",
  },

  // ══ GROUP 2: ⚔️ WEB, API & INJECTION SECURITY (5 SPECIALISTS) ══
  {
    id: "offsec-web-api-pentester",
    category: "⚔️ Web, API & Injection Security",
    name: "⚔️ #7 Web, GraphQL & REST API Security Tester",
    role: "Tests websites and APIs for broken logins, private data leaks between users, and common hacker holes.",
    sys: "Audit OWASP Top 10 / API Top 10 surfaces including IDOR/BOLA, SSRF, SQLi/NoSQLi, mass assignment, and race conditions. Provide runnable Python/curl verification harnesses and patches.",
  },
  {
    id: "sqli-query-sink-specialist",
    category: "⚔️ Web, API & Injection Security",
    name: "💉 #31 SQL Injection (SQLi) & Database Query Specialist",
    role: "Finds spots where sneaky text typed into forms could trick a database into spilling data, and locks them down.",
    sys: "Trace untrusted input flows into SQL/NoSQL queries, dynamic ORDER BY/WHERE clauses, raw ORM sinks, and second-order storage paths. Build deterministic boundary verification tests and refactor vulnerable queries into strictly parameterized prepared statements.",
  },
  {
    id: "xss-dom-csp-specialist",
    category: "⚔️ Web, API & Injection Security",
    name: "⚡ #32 XSS (Cross-Site Scripting) & Browser Policy Specialist",
    role: "Finds places where malicious scripts could run inside a visitor's browser, and adds safety filters to block them.",
    sys: "Audit DOM sinks (innerHTML, outerHTML, document.write, dangerouslySetInnerHTML), reflected/stored template contexts, and URL protocol handlers. Build sanitizer verification suites and enforce context-aware encoding, Trusted Types, and nonce-based CSP headers.",
  },
  {
    id: "blackhat-sim-evasion-analyst",
    category: "⚔️ Web, API & Injection Security",
    name: "🎭 #5 Firewall (WAF) & Input Filter Bypass Tester",
    role: "Tests if disguised or scrambled text can slip past security filters and firewalls, then strengthens the filters.",
    sys: "Test how WAF rules, input normalizers, parser grammars, and telemetry hooks behave under obfuscated, encoded, or edge-case inputs, and write canonicalization guards.",
  },
  {
    id: "auth-email-username-password-specialist",
    category: "⚔️ Web, API & Injection Security",
    name: "🔐 #50 Email, Username & Password Auth QA Specialist",
    role: "Tests signup, email verification, username rules, and password login security while generating safe test accounts.",
    sys: "Generate realistic QA test accounts, check email MX/SPF/DKIM/DMARC records, test signup/login/password-reset flows on authorized apps, audit username enumeration & rate limits, and enforce Argon2id/bcrypt password hashing.",
  },

  // ══ GROUP 3: 🌐 NETWORK, PORTS, MITM & PROXIES (7 SPECIALISTS) ══
  {
    id: "network-proxy-scraper-csv-specialist",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "🌍 #51 HTTP / SOCKS4 / SOCKS5 Proxy Scraper, Speed Tester & CSV Vault",
    role: "Scrapes free HTTP, SOCKS4, and SOCKS5 proxies, tests live speed & quality, checks country, and saves them to a CSV file.",
    sys: "Scrape public HTTP, SOCKS4, and SOCKS5 proxy feeds, test real socket/protocol handshakes, measure speed in ms, resolve country codes, grade quality, and save verified proxies into proxies_verified.csv.",
  },
  {
    id: "nmap-port-weakness-auditor",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "🌐 #30 Nmap Port, Open Service & Weakness Specialist",
    role: "Uses Nmap to check which network doors (ports) are open, what old software is running, and how to lock them.",
    sys: "Conduct authorized port/service discovery, version banner inspection (-sV), safe NSE diagnostic script analysis, and XML/JSON output parsing to pinpoint exposed ports, outdated daemons, and firewall weaknesses, paired with concrete nftables/iptables hardening rules.",
  },
  {
    id: "offsec-network-port-auditor",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "🌐 #8 Fast Network Topology, Port & SSL/TLS Scanner",
    role: "Maps all devices on a network, checks open ports at high speed, and verifies SSL/HTTPS certificates are safe.",
    sys: "Build high-speed asynchronous port scanners, service banner grabbers, TLS certificate chain inspectors, and routing topology mappers using standard library sockets.",
  },
  {
    id: "mitm-tls-transport-specialist",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "🕵️ #33 Man-in-the-Middle (MitM) & Encrypted Traffic Specialist",
    role: "Checks if someone on the network could eavesdrop on or tamper with traffic in transit, and enforces strong encryption.",
    sys: "Audit HTTP/WebSocket/API clients, reverse proxies, and TLS cipher chains for disabled certificate verification, protocol downgrade paths, missing HSTS/mTLS pinning, and cleartext credential transit, delivering verified transport hardening patches.",
  },
  {
    id: "arp-lan-spoofing-specialist",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "📡 #34 ARP Poisoning & Local Wi-Fi / LAN Spoofing Specialist",
    role: "Detects if a device on local Wi-Fi or LAN is pretending to be the router to intercept traffic, and blocks it.",
    sys: "Analyze local subnet neighbor tables, gratuitous ARP anomalies, and MAC-to-IP binding drift; build passive Python ARP spoofing detectors and generate Dynamic ARP Inspection (DAI), DHCP snooping, and VLAN segmentation configurations.",
  },
  {
    id: "proxy-hunter-validator-specialist",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "🔀 #35 Proxy Hunter, Speed & Anonymity Checker",
    role: "Hunts down working HTTP/SOCKS proxies, tests their speed, and checks if they truly hide your real IP address.",
    sys: "Build fast async Python/Node pipelines that aggregate, validate, and benchmark HTTP/HTTPS/SOCKS4/SOCKS5 proxies for RTT latency, TLS integrity, geo/ASN routing, and header-leak anonymity (Transparent vs Anonymous vs Elite).",
  },
  {
    id: "blackhat-sim-protocol-mutator",
    category: "🌐 Network, Ports, MitM & Proxies",
    name: "⚡ #6 Raw Network Packet & Protocol Stress Tester",
    role: "Sends weird or malformed network packets to servers to make sure unusual traffic cannot crash or confuse them.",
    sys: "Construct custom TCP/UDP/HTTP/TLS frame diagnostic tools and state-transition fuzz harnesses to uncover protocol desynchronization and parsing flaws.",
  },

  // ══ GROUP 4: 🛰️ OSINT, DARK WEB, SCRAPING & SOCIAL RECON (7 SPECIALISTS) ══
  {
    id: "darkweb-onion-osint-specialist",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "🌑 #37 Dark Web, Tor & Leaked Breach Data Specialist",
    role: "Scans dark web indexes, paste sites, and breach lists for leaked public data, passwords, and new breaches safely.",
    sys: "Build defensive SOCKS5h/Tor-compatible threat-intel collectors, breach/paste exposure monitors, and domain/credential leak correlators that extract deduplicated STIX/JSON Indicators of Compromise (IOCs) without exposing local identity.",
  },
  {
    id: "web-crawler-scraper-specialist",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "🕷️ #38 High-Speed Web Crawler & Data Scraper Specialist",
    role: "Automatically visits web pages, extracts prices, tables, links, or articles, and saves clean CSV/JSON spreadsheets.",
    sys: "Engineer resilient Python/Node crawlers and DOM/API scrapers with BFS/sitemap traversal, CSS/XPath/JSON-LD extraction, pagination, polite rate-limit/retry backoff, proxy rotation, and clean JSONL/CSV/SQLite output.",
  },
  {
    id: "osint-domain-asn-cert-scout",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "🛰️ #16 Domain, Subdomain & Hidden Server Recon Scout",
    role: "Finds all public websites, forgotten subdomains, DNS records, and cloud servers belonging to a domain.",
    sys: "Enumerate DNS records, BGP/ASN prefixes, crt.sh certificate logs, WHOIS history, and exposed cloud buckets using runnable Python/shell recon pipelines.",
  },
  {
    id: "osint-breach-secret-leak-hunter",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "🔑 #17 Leaked API Key, Password & Git History Hunter",
    role: "Searches code folders and old Git history for accidentally left-behind passwords, API keys, and private tokens.",
    sys: "Scan git commit histories, environment files, package manifests, and public artifacts for leaked API keys, high-entropy tokens, and dependency confusion risks.",
  },
  {
    id: "osint-cve-threat-feed-correlator",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "📰 #18 Live Security Flaw (CVE) & Patch Tracker",
    role: "Checks your installed software versions against public bug databases to warn you which ones have known security holes.",
    sys: "Cross-reference software versions against NIST NVD 2.0, CISA KEV, and security advisories, producing prioritized risk matrices and verification scripts.",
  },
  {
    id: "socmint-handle-graph-mapper",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "📱 #19 Social Media Username & Online Footprint Mapper",
    role: "Finds where the same username or profile appears across public social sites and spots fake copycat accounts.",
    sys: "Build cross-platform username correlation tools, public profile metadata parsers, link-graph visualizers, and impersonation/phishing surface detectors.",
  },
  {
    id: "socmint-narrative-botnet-detector",
    category: "🛰️ OSINT, Dark Web, Scraping & Social Recon",
    name: "📊 #20 Fake Bot Network & Photo Metadata Investigator",
    role: "Checks hidden camera/location details inside photos and spots groups of fake bot accounts posting together.",
    sys: "Analyze EXIF/media metadata, posting cadence anomalies, coordinated bot networks, and sentiment trends with reproducible Python analytics.",
  },

  // ══ GROUP 5: 💥 EXPLOIT TESTING, METASPLOIT & MALWARE FORENSICS (8 SPECIALISTS) ══
  {
    id: "metasploit-cve-surface-specialist",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🎯 #36 Metasploit Weakness Matcher & Unpatched Bug Specialist",
    role: "Matches discovered software versions against known Metasploit security flaws so you know what to patch first.",
    sys: "Cross-reference discovered service banners, Nmap XML inventories, and software versions against public Metasploit CVE metadata and CISA KEV advisories to identify exploitable patch gaps, verify compensating controls, and generate prioritized remediation plans.",
  },
  {
    id: "exploit-boundary-poc-architect",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "💥 #10 Bug Proof-of-Concept (PoC) & Fix Builder",
    role: "Builds a safe, repeatable mini-test that proves a security bug is real, then writes the code fix to stop it.",
    sys: "Analyze CVEs, code diffs, and state-machine edge cases to build deterministic, self-contained reproduction harnesses and root-cause remediation patches.",
  },
  {
    id: "redhat-exploit-poc-verifier",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "☠️ #28 Live Security Audit & Bug Fix Validator",
    role: "Runs hands-on security checks against your app in a local test environment and proves the fix actually holds.",
    sys: "Build and empirically execute real reconnaissance, socket/protocol auditing, exploit verification harnesses, and hardened remediations with concrete CLI flags and verifiable exit-code assertions.",
  },
  {
    id: "exploit-memory-binary-auditor",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🔬 #11 Compiled Binary & Memory Crash Auditor",
    role: "Inspects compiled C/C++/Rust programs and .exe/Linux binaries for memory crashes and missing safety flags.",
    sys: "Inspect C/C++/Rust/native interfaces, ELF/PE binary headers, integer bounds, buffer lengths, and deserialization routines, writing boundary test harnesses and memory-safe fixes.",
  },
  {
    id: "exploit-race-concurrency-striker",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🏎️ #12 Race-Condition & Double-Spend Timing Tester",
    role: "Fires simultaneous clicks/requests at the exact same millisecond to catch double-charging or timing glitches.",
    sys: "Design parallel async test harnesses that probe lock contention, double-spend windows, and non-atomic file/database state transitions, and implement atomic locking fixes.",
  },
  {
    id: "malware-static-unpacker-analyst",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🦠 #13 Suspicious File & Hidden Script Unpacker",
    role: "Safely unwraps disguised or encoded scripts without running them so you can read what is hidden inside.",
    sys: "Analyze suspicious scripts, encoded payloads, file hashes, import tables, and Shannon entropy. Build automated Python de-obfuscators, AST decoders, and IOC extractors.",
  },
  {
    id: "malware-sandbox-behavior-tracer",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🧪 #14 Safe Malware Sandbox & File-Change Watcher",
    role: "Watches an untrusted program inside a locked box to record every file it touches or internet call it tries.",
    sys: "Monitor process trees, file mutations, persistence hooks, and outbound socket beacons inside isolated sandboxes, generating structured STIX/JSON threat reports.",
  },
  {
    id: "malware-c2-beacon-hunter",
    category: "💥 Exploit Testing, Metasploit & Malware Forensics",
    name: "🕸️ #15 Hidden Hacker Callback (C2) & Secret Traffic Hunter",
    role: "Spots infected machines quietly phoning home to a hacker server in the background and builds blocklists.",
    sys: "Analyze packet captures, JA3/JA4 TLS fingerprints, DNS entropy, and periodic beacon jitter, writing runnable traffic classifiers and firewall blocklists.",
  },

  // ══ GROUP 6: 🎩 SYSTEM HARDENING & CLOUD SECURITY (5 SPECIALISTS) ══
  {
    id: "redhat-kernel-hardener",
    category: "🎩 System Hardening & Cloud Security",
    name: "🎩 #1 Linux Server & Container Security Hardener",
    role: "Locks down Linux servers and Docker containers so even if one app gets hacked, the rest of the machine stays safe.",
    sys: "Audit sysctl parameters, SELinux/AppArmor profiles, seccomp filters, cgroups, and container isolation boundaries. Write complete, runnable hardening scripts and verification checks.",
  },
  {
    id: "redhat-zero-trust-iam",
    category: "🎩 System Hardening & Cloud Security",
    name: "🛡️ #2 Login, OAuth & User Permission Security Checker",
    role: "Checks login tokens, passwords, and user roles so regular users can never sneak into admin-only features.",
    sys: "Inspect authentication flows, session state machines, OAuth2/OIDC, RBAC/ABAC policies, and cryptographic signature verification, providing runnable validation suites and patches.",
  },
  {
    id: "redhat-siem-detection",
    category: "🎩 System Hardening & Cloud Security",
    name: "📡 #3 Security Log Monitor & Intrusion Alert Builder",
    role: "Scans server logs and builds smart tripwire alarms that alert you the moment suspicious activity happens.",
    sys: "Build high-signal YARA rules, Sigma detection rules, eBPF/auditd log parsers, and automated anomaly detection scripts with zero false positives.",
  },
  {
    id: "offsec-cloud-k8s-pentester",
    category: "🎩 System Hardening & Cloud Security",
    name: "☁️ #9 Cloud, Docker & Kubernetes Security Auditor",
    role: "Checks cloud accounts (AWS/GCP), Dockerfiles, and Kubernetes setups for public storage leaks or loose permissions.",
    sys: "Inspect IAM policies, K8s RBAC manifests, container capabilities, metadata endpoints, and secret mounts, delivering automated audit scripts and hardened manifests.",
  },
  {
    id: "blackhat-sim-apt-emulator",
    category: "🎩 System Hardening & Cloud Security",
    name: "🕶️ #4 Hacker Attack-Path Simulator (MITRE ATT&CK)",
    role: "Maps out step-by-step how an attacker could hop from one weak spot to your crown jewels, and plugs each gap.",
    sys: "Model multi-stage adversary TTPs, lateral movement paths, trust-boundary assumptions, and detection gaps, producing complete verification scripts and defensive counter-controls.",
  },

  // ══ GROUP 7: 👑 SWARM BRAINS, CODE MERGERS & SAFETY GUARDS (6 SPECIALISTS) ══
  {
    id: "cool-quantum-chaos-twin-simulator",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "🌐 #23 System Stress-Test, Failover & Chaos Simulator",
    role: "Simulates heavy traffic spikes and random server outages to make sure your system recovers automatically.",
    sys: "Build live load tests and fault simulations of distributed networks, data pipelines, or software clusters under extreme traffic and auto-generate self-healing controllers.",
  },
  {
    id: "swarm-queen-dag-decomposer",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "👑 #24 Swarm Task Splitter & Blueprint Planner",
    role: "Breaks big projects into clear, separate tasks for each AI worker so they never overwrite each other's files.",
    sys: "Decompose any user engineering, full-stack, CLI, or security task into non-overlapping module contracts with explicit file paths and interfaces.",
  },
  {
    id: "ast-compiler-pregate-verifier",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "🛡️ #25 Automatic Syntax & Code Error Checker",
    role: "Tests every generated code file for typos, missing imports, or syntax errors and fixes them before final delivery.",
    sys: "Parse every Python, JS/TS, Bash, and PowerShell file for syntax validity, unresolved imports, and non-zero exit codes, patching defects before packaging.",
  },
  {
    id: "vram-context-oom-router-guard",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "🧠 #26 GPU Memory (VRAM) & Anti-Refusal Traffic Router",
    role: "Watches GPU memory across Hosts A–D so models don't crash, and routes sensitive security tasks to unrestricted models.",
    sys: "Monitor Host A/B/C/D GPU VRAM budgets, context-token limits, and safety-refusal triggers; route subtasks cleanly without OOM crashes.",
  },
  {
    id: "cross-agent-dedup-merge-surgeon",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "🔬 #27 Duplicate Code Remover & Final File Merger",
    role: "Combines files from multiple AI models into one clean project, deleting duplicates and wiring one start button.",
    sys: "Inspect files emitted by multiple parallel models, eliminate duplicate implementations, reconcile signatures, and synthesize clean launch scripts.",
  },
  {
    id: "opsec-sandbox-rollback-sentinel",
    category: "👑 Swarm Brains, Code Mergers & Safety Guards",
    name: "🔒 #29 Private Token Scrubber & File Backup Guard",
    role: "Makes sure your private GitHub, Hugging Face, or Kaggle keys never leak into exported ZIPs or code files.",
    sys: "Audit generated artifacts and shell commands to ensure GH_TOKEN, HF_TOKEN, Kaggle keys, and private Gist credentials are never leaked.",
  },
];

const BUILTIN_MCP_SERVERS_CLIENT = [
  {
    id: "mcp-nuclei-vuln-scanner",
    name: "⚔️ #1 Nuclei & CVE Template Vulnerability Scanner MCP",
    short: "Nuclei CVE Scanner",
    category: "OffSec & PenTesting",
    tools: ["scan_target_templates", "verify_cve_signature", "generate_nuclei_yaml"],
    desc: "Template-based vulnerability scanning, CVE signature verification & Nuclei YAML generation.",
  },
  {
    id: "mcp-nmap-network-recon",
    name: "🌐 #2 Nmap, Socket & TLS Cipher Topology MCP",
    short: "Nmap & TLS Recon",
    category: "OffSec & PenTesting",
    tools: ["tcp_port_sweep", "grab_service_banners", "inspect_tls_chain"],
    desc: "High-speed TCP port sweeps, service banner grabbing & X.509/TLS cipher chain auditing.",
  },
  {
    id: "mcp-shodan-censys-osint",
    name: "🛰️ #3 Shodan, Censys, BGP/ASN & Cert-Transparency OSINT MCP",
    short: "Shodan/Censys/crt.sh",
    category: "OSINT & Digital Recon",
    tools: ["inspect_cert_transparency", "lookup_dns_rdap_asn", "enumerate_attack_surface"],
    desc: "Certificate Transparency (crt.sh), DNS/RDAP/WHOIS & BGP/ASN attack-surface enumeration.",
  },
  {
    id: "mcp-ghidra-radare2-binary",
    name: "🔬 #4 Ghidra / Radare2 / ELF-PE Binary & Memory Safety MCP",
    short: "Ghidra/Radare2 Binary",
    category: "Exploit & Boundary Analysis",
    tools: ["inspect_elf_pe_headers", "check_binary_mitigations", "extract_binary_strings_symbols"],
    desc: "ELF/PE header parsing, NX/PIE/Canary/RELRO mitigation checks & symbol/string extraction.",
  },
  {
    id: "mcp-yara-sigma-forensics",
    name: "🦠 #5 YARA, Sigma & Malware Entropy De-Obfuscation MCP",
    short: "YARA/Sigma & Entropy",
    category: "Malware Forensics & Reverse Eng",
    tools: ["calculate_shannon_entropy", "deobfuscate_payload_strings", "generate_yara_sigma_rules"],
    desc: "Shannon byte entropy calculation, Base64/Hex/XOR payload de-obfuscation & YARA/Sigma synthesis.",
  },
  {
    id: "mcp-mitre-attack-navigator",
    name: "🕶️ #6 MITRE ATT&CK, CISA KEV & Adversary Kill-Chain MCP",
    short: "MITRE ATT&CK & KEV",
    category: "Black-Hat Simulation & OffSec",
    tools: ["map_ttp_technique", "lookup_cisa_kev_catalog", "build_adversary_emulation_matrix"],
    desc: "MITRE ATT&CK TTP mapping, CISA KEV correlation & Red-vs-Blue emulation matrices.",
  },
  {
    id: "mcp-owasp-zap-web-api",
    name: "🕷️ #7 OWASP ZAP, GraphQL & REST API Boundary Fuzzer MCP",
    short: "OWASP ZAP & API Fuzz",
    category: "OffSec & PenTesting",
    tools: ["probe_http_security_headers", "fuzz_api_param_boundaries", "introspect_rest_graphql_schema"],
    desc: "OWASP API Top-10 auditing, BOLA/IDOR boundary fuzzing, HTTP security headers & GraphQL introspection.",
  },
  {
    id: "mcp-trufflehog-gitleaks",
    name: "🔑 #8 TruffleHog & GitLeaks Secret, Token & Supply-Chain MCP",
    short: "TruffleHog & GitLeaks",
    category: "OSINT & Digital Recon",
    tools: ["scan_workspace_secrets", "audit_git_commit_history", "audit_sbom_dependencies"],
    desc: "High-entropy API key/secret scanning, git commit history auditing & SBOM dependency checks.",
  },
  {
    id: "mcp-wireshark-tshark-pcap",
    name: "🕸️ #9 Wireshark / TShark Packet, JA3/JA4 & C2 Beacon Hunter MCP",
    short: "TShark & C2 Hunter",
    category: "Malware Forensics & Reverse Eng",
    tools: ["inspect_active_sockets", "detect_c2_beacon_jitter", "analyze_dns_tunnel_entropy"],
    desc: "Active socket inspection, JA3/JA4 TLS fingerprinting, C2 beacon jitter & DNS tunnel detection.",
  },
  {
    id: "mcp-socmint-sherlock-maigret",
    name: "📱 #10 Sherlock / Maigret Social Media OSINT (SOCMINT) Graph MCP",
    short: "Sherlock SOCMINT Graph",
    category: "Social Media & Footprint OSINT",
    tools: ["correlate_handle_footprint", "extract_media_exif_metadata", "detect_bot_cluster_cadence"],
    desc: "Cross-platform username/handle correlation, EXIF metadata forensics & bot-cluster cadence analysis.",
  },
  {
    id: "mcp-kubernetes-cloud-sec",
    name: "☁️ #11 Trivy, Kubescape & Cloud/Container IAM Auditor MCP",
    short: "Trivy K8s & Cloud IAM",
    category: "OffSec & PenTesting",
    tools: ["audit_container_runtime", "scan_dockerfile_k8s_manifests", "analyze_iam_privilege_paths"],
    desc: "Container capability bitmask auditing, Dockerfile/K8s RBAC scanning & IAM privilege path analysis.",
  },
  {
    id: "mcp-selinux-ebpf-hardener",
    name: "🎩 #12 Red-Hat SELinux, AppArmor, sysctl & eBPF Hardening MCP",
    short: "SELinux/eBPF Hardener",
    category: "Red-Hat & SecOps",
    tools: ["audit_kernel_sysctl", "generate_seccomp_profile", "build_selinux_apparmor_policy"],
    desc: "Live Linux kernel sysctl inspection, seccomp-bpf filter generation & SELinux/AppArmor confinement.",
  },
  {
    id: "mcp-jwt-crypto-auditor",
    name: "🔐 #13 JWT, OAuth2, PKCE & Cryptographic Primitive Auditor MCP",
    short: "JWT & Crypto Auditor",
    category: "Red-Hat & SecOps",
    tools: ["decode_verify_jwt", "audit_crypto_primitives", "generate_zero_trust_token_guard"],
    desc: "JWT alg:none/confusion checks, weak cipher/PRNG detection & EdDSA/OAuth2 PKCE guard generation.",
  },
  {
    id: "mcp-ast-semgrep-sast",
    name: "🛡️ #14 Semgrep & Tree-Sitter AST Static Code Vulnerability MCP",
    short: "Semgrep AST SAST",
    category: "Exploit & Boundary Analysis",
    tools: ["scan_code_sast", "trace_tainted_sinks", "generate_auto_patch_diff"],
    desc: "Static AST taint-sink tracing across TS/JS/Python/C/Go/Shell & automated remediation patch diffs.",
  },
  {
    id: "mcp-playwright-headless-dom",
    name: "🌍 #15 Headless DOM, Endpoint Crawler & CSP/XSS Auditor MCP",
    short: "Playwright DOM Crawler",
    category: "OffSec & PenTesting",
    tools: ["extract_endpoints_from_js", "audit_dom_xss_sinks", "verify_csp_policy"],
    desc: "JavaScript bundle route extraction, DOM XSS sink auditing & Content-Security-Policy verification.",
  },
  {
    id: "mcp-sqlite-postgres-inspector",
    name: "🗄️ #16 SQLite / Postgres Schema, Query & SQLi Parameterization MCP",
    short: "SQL Schema & SQLi Guard",
    category: "Exploit & Boundary Analysis",
    tools: ["inspect_data_stores", "audit_sql_nosql_parameterization", "generate_atomic_transaction_guard"],
    desc: "Database schema inventory, SQL/NoSQL injection auditing & atomic transaction locking guards.",
  },
  {
    id: "mcp-github-gist-devops",
    name: "🐙 #17 GitHub Repos, Gist Cloud Vault & CI/CD Pipeline Auditor MCP",
    short: "GitHub/Gist & CISec",
    category: "OSINT & Digital Recon",
    tools: ["inspect_git_repo_status", "audit_cicd_workflows", "sync_council_gist_state"],
    desc: "Git branch/commit inspection, GitHub Actions workflow security auditing & Gist Cloud Vault sync.",
  },
  {
    id: "mcp-docker-sandbox-runner",
    name: "🐳 #18 Polyglot Sandbox, Concurrency Striker & Syscall Profiler MCP",
    short: "Polyglot Race Sandbox",
    category: "Exploit & Boundary Analysis",
    tools: ["exec_polyglot_snippet", "run_concurrency_race_probe", "profile_process_resources"],
    desc: "Isolated Python/Node/Bash execution, barrier-synchronized TOCTOU race probes & resource profiling.",
  },
  {
    id: "mcp-gpu-cluster-telemetry",
    name: "⚡ #19 Multi-Host GPU Cluster, VRAM & GGUF Quantization Optimizer MCP",
    short: "GPU Cluster & GGUF",
    category: "Swarm Brains, Code Mergers & Safety Guards",
    tools: ["probe_council_host_tunnels", "calculate_swarm_vram_budget", "recommend_gguf_runtime_flags"],
    desc: "Host A/B/C GPU tunnel probing, Swarm KV-cache VRAM budgeting & llama-server/vLLM flag tuning.",
  },
  {
    id: "mcp-app-packager-exe-forge",
    name: "📦 #20 Full-Stack GUI, CLI, Script & Windows EXE Packager Forge MCP",
    short: "GUI/CLI/EXE Packager",
    category: "Coding, App Building & DevOps",
    tools: ["verify_zero_placeholder_code", "list_council_build_outputs", "bundle_standalone_package"],
    desc: "Zero-placeholder code verification, syntax compilation & standalone GUI/CLI/Script/EXE bundling.",
  },
];

function getAllSelectableSwarmAgentsCatalog() {
  const list = BUILTIN_SWARM_GROUP_SPECIALISTS.map((sp) => ({
    id: sp.id,
    name: sp.name,
    role: sp.role,
    category: sp.category || "🎯 Built-in Swarm Specialist Agents",
    sys: sp.sys,
    tools: ["run_command", "read_file", "write_file", "list_dir", "mcp_call", "cve_lookup", "ast_sast_audit"],
    preferred_model: "",
  }));
  const builtInIds = new Set(list.map((s) => s.id));
  const extraCustomAgents = Array.isArray(AGENTS) ? AGENTS.filter((ag) => !builtInIds.has(ag.id)) : [];
  extraCustomAgents.forEach((ag) => {
    list.push({
      id: `custom:${ag.id}`,
      name: `🤖 ${ag.name} [${resolveAgentModelLabel(ag)}]`,
      role: ag.name,
      category: `🤖 Your Custom User Agents`,
      sys: ag.system || ag.sys || ag.prompt || "",
      tools: ag.tools || ["run_command", "read_file", "write_file", "mcp_call"],
      preferred_model: ag.model || "",
    });
  });
  return list;
}

function buildSwarmGroupAgentOptionsHtml(selectedAgentIdsInput = []) {
  const selectedSet = new Set(
    (Array.isArray(selectedAgentIdsInput) ? selectedAgentIdsInput : [selectedAgentIdsInput])
      .filter(Boolean)
      .flatMap((x) => [String(x), String(x).replace(/^custom:/, ""), `custom:${String(x).replace(/^custom:/, "")}`])
  );
  const allCatalog = getAllSelectableSwarmAgentsCatalog();
  const byCat = new Map();
  allCatalog.forEach((sp) => {
    const cat = sp.category || "🎯 Built-in Swarm Specialist Agents";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(sp);
  });
  let html = "";
  for (const [catName, list] of byCat.entries()) {
    html += `<optgroup label="${esc(catName)}">`;
    for (const sp of list) {
      const sel = selectedSet.has(sp.id) ? " selected" : "";
      html += `<option value="${esc(sp.id)}"${sel}>${esc(sp.name)}</option>`;
    }
    html += `</optgroup>`;
  }
  return html;
}

function resolveSwarmGroupAgentSelection(valOrArray, groupIndex = 0) {
  const rawList = (Array.isArray(valOrArray) ? valOrArray : [valOrArray])
    .map((v) => String(v || "").trim())
    .filter(Boolean);
  const triadDefaults = [
    BUILTIN_SWARM_GROUP_SPECIALISTS[(groupIndex * 3) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
    BUILTIN_SWARM_GROUP_SPECIALISTS[(groupIndex * 3 + 1) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
    BUILTIN_SWARM_GROUP_SPECIALISTS[(groupIndex * 3 + 2) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
  ];
  const effectiveIds = [...rawList];
  for (const fallbackId of triadDefaults) {
    if (effectiveIds.length >= 3) break;
    if (!effectiveIds.includes(fallbackId)) effectiveIds.push(fallbackId);
  }
  while (effectiveIds.length < 3) {
    effectiveIds.push(BUILTIN_SWARM_GROUP_SPECIALISTS[effectiveIds.length % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id);
  }

  const resolvedItems = effectiveIds.map((val) => {
    const raw = String(val || "").replace(/^custom:/, "");
    const sp = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === raw);
    if (sp) {
      const recMcps = BUILTIN_MCP_SERVERS_CLIENT.filter((m) =>
        m.category.toLowerCase().includes(sp.category.split(" ")[1]?.toLowerCase() || "offsec")
      ).map((m) => m.id);
      return {
        agent_id: sp.id,
        agent_name: sp.name,
        role_name: sp.role,
        category: sp.category || "Swarm Specialist",
        sys_prompt: sp.sys,
        tools: ["run_command", "read_file", "write_file", "list_dir", "mcp_call", "cve_lookup", "ast_sast_audit"],
        mcp_servers: recMcps.length ? recMcps.slice(0, 4) : ["mcp-nuclei-vuln-scanner", "mcp-docker-sandbox-runner"],
        preferred_model: "",
      };
    }
    const ag = (AGENTS || []).find((a) => a.id === raw);
    if (ag) {
      return {
        agent_id: ag.id,
        agent_name: ag.name,
        role_name: ag.name,
        category: ag.category || "Custom Specialist",
        sys_prompt: ag.system || ag.sys || ag.prompt || "",
        tools: ag.tools || ["run_command", "read_file", "write_file", "mcp_call"],
        mcp_servers: ag.mcp_servers || ["mcp-nuclei-vuln-scanner", "mcp-docker-sandbox-runner"],
        preferred_model: ag.model || "",
      };
    }
    const fallback = BUILTIN_SWARM_GROUP_SPECIALISTS[groupIndex % BUILTIN_SWARM_GROUP_SPECIALISTS.length];
    return {
      agent_id: fallback.id,
      agent_name: fallback.name,
      role_name: fallback.role,
      category: fallback.category || "Swarm Specialist",
      sys_prompt: fallback.sys,
      tools: ["run_command", "read_file", "write_file", "mcp_call"],
      mcp_servers: ["mcp-nuclei-vuln-scanner", "mcp-docker-sandbox-runner"],
      preferred_model: "",
    };
  });

  return {
    agent_id: resolvedItems[0].agent_id,
    agent_ids: resolvedItems.map((i) => i.agent_id),
    agent_name: resolvedItems.map((i) => i.agent_name).join(" + "),
    agent_names: resolvedItems.map((i) => i.agent_name),
    role_name: resolvedItems.map((i) => i.role_name).join(" + "),
    category: Array.from(new Set(resolvedItems.map((i) => i.category))).join(" · "),
    sys_prompt:
      resolvedItems.length === 1
        ? resolvedItems[0].sys_prompt
        : resolvedItems.map((i, idx) => `[Specialist #${idx + 1} — ${i.role_name}]: ${i.sys_prompt}`).join("\n"),
    tools: Array.from(new Set(resolvedItems.flatMap((i) => i.tools))),
    mcp_servers: Array.from(new Set(resolvedItems.flatMap((i) => i.mcp_servers))),
    preferred_model: resolvedItems.find((i) => i.preferred_model)?.preferred_model || "",
  };
}

function openSwarmMultiAgentQuestionsCard(initialPrompt = "") {
  const ans = $("#answers");
  if (!ans) return;
  const currentPrompt =
    initialPrompt ||
    ($("#prompt")?.value || "").trim() ||
    "Audit target architecture, network ports, authentication boundaries, and build a self-testing verification suite";
  ans.innerHTML = "";
  answers = {};
  $("#response-bulk-actions")?.classList.add("hidden");

  const baseModelsHtml = buildAllSelectableModelsOptionsHtml("");
  const queenChain =
    typeof UNRESTRICTED_QUEEN_BOSS_CHAIN !== "undefined" && Array.isArray(UNRESTRICTED_QUEEN_BOSS_CHAIN)
      ? UNRESTRICTED_QUEEN_BOSS_CHAIN
      : [
          { id: "orcarouter/Qwen3.8-27B-Uncensored-GGUF", label: "👑 Qwen 3.8 27B Unrestricted (Primary Queen Boss #1)" },
          { id: "orcarouter/OrcaSAQ-2-Cyber-27B-Uncensored-GGUF", label: "🦈 OrcaSAQ-2 Cyber 27B Unrestricted (Boss #2)" },
          { id: "AlicanKiraz0/Cybersecurity-BaronLLM_Offensive_Security_LLM_Q6_K_GGUF", label: "🛡️ BaronLLM SecOps Q6_K (Boss #3)" },
          { id: "huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated-v2", label: "🧠 DeepSeek R1 14B v2 (Boss #4)" },
          { id: "WhiteRabbitNeo/WhiteRabbitNeo-2.5-Qwen-2.5-Coder-7B", label: "🐇 WhiteRabbitNeo 2.5 Qwen Coder 7B (Boss #5)" },
        ];

  const card = document.createElement("div");
  card.className = "card full-span-card";
  card.id = "inline-swarm-multiagent-setup-card";
  card.style.border = "1px solid rgba(46,230,166,.55)";
  card.style.background = "linear-gradient(180deg, rgba(11,22,36,.98), rgba(8,14,26,.98))";

  card.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
      <h3 style="margin:0;color:var(--ok)">🐝 Swarm Pre-Deployment Setup Window (1–50 Worker Groups Slider · Multi-Select 23 Agents · 20 MCP Servers)</h3>
      <span class="right-badge orca">PRE-DEPLOYMENT WINDOW — DISAPPEARS AUTOMATICALLY WHEN YOU CLICK DEPLOY</span>
    </div>
    <p class="muted" style="margin:0 0 10px;font-size:12px">
      Configure all Swarm parameters before deployment: slide <strong>Worker Groups from 1 to 50</strong>, use the <strong>Multi-Select Dropdown</strong> to assign <strong>1 or multiple Specialist Agents to each specific group</strong>, equip any of the <strong>20 Built-In MCP Servers &amp; 14 Swarm Power Tools</strong>, and click <strong>🚀 Deploy Swarm Now</strong>.
    </p>

    <!-- Top Strategy Selector Bar -->
    <div style="padding:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(46,230,166,0.35);border-radius:8px;margin-bottom:10px">
      <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <label style="font-size:12px;font-weight:700;color:#6ee7b7">
          🎯 Swarm Deployment Mode / Strategy Preset:
        </label>
        <select id="inline-swarm-strategy-mode" class="input slim" style="flex:1;min-width:280px;font-weight:700;color:#e2e8f0">
          <option value="mass_60" selected>🐝 1. Multi-Agent Parallel Worker Swarm (1–50 Groups Slider, Multi-Select Agents &amp; 20 MCP Servers)</option>
          <option value="blitz">⚡ 2. Blitz Parallel File Build &amp; Auto-Run in Live Terminal (No Questions)</option>
          <option value="interactive">🧭 3. Interactive Architect (Ask 3 Setup Questions First, Then Build)</option>
          <option value="red_blue">⚔️ 4. Red-vs-Blue Hardened Build (Adversarial Boundary Audit &amp; Auto-Patch)</option>
          <option value="tdd_heal">🔬 5. Strict Test-Driven Self-Healing Loop (Loops in Terminal Until Exit Code 0)</option>
          <option value="dag_4step">🏗️ 6. 4-Step Queen Boss &amp; Worker Team Builder (Design → Code → Audit → Verify DAG)</option>
        </select>
      </div>
    </div>

    <div id="inline-swarm-multiagent-config-wrap">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px;margin-bottom:10px">
        <!-- Question 1: Total Workers & Any-Size Worker Model -->
        <div style="padding:10px;background:rgba(14,23,44,.85);border:1px solid var(--line);border-radius:8px">
          <label style="display:block;font-size:12px;font-weight:700;color:var(--ok);margin-bottom:4px">
            1️⃣ How Many Workers to Deploy &amp; Which Swarm Model?
          </label>
          <div class="row" style="gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap">
            <span class="muted" style="font-size:11.5px;white-space:nowrap">Workers:</span>
            <input type="number" id="inline-swarm-worker-count" class="input slim" min="1" max="500" value="60" style="width:74px;font-weight:700;color:var(--ok)">
            <button type="button" class="ghost xs" data-sw-preset-workers="20">20</button>
            <button type="button" class="ghost xs" data-sw-preset-workers="50" title="50 Workers (1 per Group at 50 Groups)">50</button>
            <button type="button" class="ghost xs" data-sw-preset-workers="60">60</button>
            <button type="button" class="ghost xs" data-sw-preset-workers="120">120</button>
            <button type="button" class="ghost xs" data-sw-preset-workers="250">250</button>
          </div>
          <label class="muted" style="display:block;font-size:11px;margin-bottom:3px">
            Default Swarm Worker Model (Any Size — 1B to 70B+):
          </label>
          <select id="inline-swarm-base-model" class="input" style="width:100%">
            ${baseModelsHtml}
          </select>
          <div class="row" style="gap:6px;margin-top:8px;align-items:center">
            <span class="muted" style="font-size:11px">RAM Pool (GB):</span>
            <input type="number" id="inline-swarm-ram-gb" class="input slim" min="8" max="2048" value="192" style="width:78px">
            <span id="inline-swarm-ram-summary" class="muted" style="font-size:11px;color:var(--accent2)"></span>
          </div>
        </div>

        <!-- Question 2: Worker Group Count Slider (1–50) + Split Mode + Threads Per Group -->
        <div style="padding:10px;background:rgba(14,23,44,.85);border:1px solid var(--line);border-radius:8px">
          <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:4px">
            <label style="font-size:12px;font-weight:700;color:#7dd3fc">
              2️⃣ Worker Group Count Slider (1–50 Groups):
            </label>
            <span id="inline-swarm-slider-val-badge" class="right-badge" style="background:rgba(56,189,248,0.18);color:#38bdf8;font-weight:700">6 Groups</span>
          </div>
          <!-- 1-50 Worker Group Slider -->
          <div style="padding:6px 8px;background:rgba(8,14,28,.75);border:1px solid rgba(56,189,248,.35);border-radius:6px;margin-bottom:8px">
            <div class="row" style="gap:8px;align-items:center">
              <span class="muted" style="font-size:10.5px;font-weight:700">1</span>
              <input type="range" id="inline-swarm-group-slider" min="1" max="50" step="1" value="6" style="flex:1;accent-color:#38bdf8;cursor:pointer" title="Slide to select 1 to 50 Worker Groups">
              <span class="muted" style="font-size:10.5px;font-weight:700">50</span>
              <input type="number" id="inline-swarm-group-count" class="input slim" min="1" max="50" value="6" style="width:62px;font-weight:700;color:#38bdf8;text-align:center">
            </div>
            <div class="row" style="gap:4px;margin-top:5px;flex-wrap:wrap;justify-content:space-between">
              <span class="muted" style="font-size:10px">Quick Group Presets:</span>
              <div class="row" style="gap:4px;flex-wrap:wrap">
                <button type="button" class="ghost xs" data-sw-preset-groups="1">1</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="6">6</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="12">12</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="20">20</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="23">23</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="35">35</button>
                <button type="button" class="ghost xs" data-sw-preset-groups="50">50</button>
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:6px">
            <div>
              <label class="muted" style="font-size:10.5px;display:block">Split Mode</label>
              <select id="inline-swarm-split-mode" class="input slim" style="width:100%">
                <option value="even_groups" selected>⚖️ Even Across Groups</option>
                <option value="workers_per_group">🔢 Fixed Workers/Grp</option>
              </select>
            </div>
            <div>
              <label class="muted" style="font-size:10.5px;display:block">Workers/Group</label>
              <input type="number" id="inline-swarm-workers-per-group" class="input slim" min="1" max="500" value="10" style="width:100%">
            </div>
            <div>
              <label class="muted" style="font-size:10.5px;display:block;color:var(--ok)">Threads/Group</label>
              <input type="number" id="inline-swarm-threads-per-group" class="input slim" min="1" max="128" value="8" style="width:100%;border-color:rgba(46,230,166,.45)">
            </div>
          </div>
          <div class="row" style="gap:6px;margin-top:8px">
            <select id="inline-swarm-mission-mode" class="input slim" style="flex:1">
              <option value="code_forge" selected>🔨 Parallel Code Forge &amp; Build</option>
              <option value="osint_sweep">🛰️ OSINT, Recon &amp; Social Media Sweep</option>
              <option value="fuzz_stress">💥 Boundary, Exploit &amp; Fuzz Verification</option>
              <option value="security_audit">🎩🕶️ Red-Hat vs Black-Hat OffSec Audit</option>
            </select>
            <select id="inline-swarm-arch" class="input slim" style="flex:1">
              <option value="shared_kv" selected>🧠 Shared KV Memory Bus</option>
              <option value="dedicated_processes">⚡ Dedicated Worker Processes</option>
            </select>
          </div>
        </div>

        <!-- Question 3: Queen Boss ON/OFF Switch & 14 Swarm Power Tools -->
        <div style="padding:10px;background:rgba(14,23,44,.85);border:1px solid var(--line);border-radius:8px">
          <div class="row" style="justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap">
            <label style="font-size:12px;font-weight:700;color:#fcd34d">
              3️⃣ Queen Boss ON/OFF &amp; 14 Swarm Power Tools:
            </label>
            <label class="toggle" style="font-size:11px;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.45);color:#6ee7b7;font-weight:700;cursor:pointer" title="Turn Queen Boss OFF so workers' 3-Agent outputs and delegated code modules are shown directly without hitting a single-boss restriction at the end">
              <input type="checkbox" id="inline-swarm-use-queen-boss">
              👑 Enable Queen Boss Final Synthesis
            </label>
          </div>
          <div id="inline-swarm-queen-status-banner" style="margin-bottom:6px;padding:5px 8px;border-radius:6px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.38);font-size:10.5px;color:#a7f3d0">
            🚫 <strong>Queen Boss is OFF (Recommended):</strong> Workers run through <strong>Agent #1 → Agent #2 → Agent #3</strong> per group and output all 3 stages + combined multi-group code directly without hitting a single Queen Boss model at the end.
          </div>
          <div id="inline-swarm-queen-controls-wrap" style="opacity:0.48;transition:opacity 0.15s">
            <select id="inline-swarm-queen-model" class="input slim" style="width:100%;margin-bottom:6px">
              ${queenChain.map((q) => `<option value="${esc(q.id)}">${esc(q.label || q.name || q.id)}</option>`).join("")}
            </select>
            <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px">
              <label class="toggle" style="font-size:11px;display:flex">
                <input type="checkbox" id="inline-swarm-queen-rotate" checked>
                🔄 Auto-Rotate Queen Boss (when ON)
              </label>
              <div class="row" style="gap:4px">
                <button type="button" class="ghost xs" id="sw-tools-all-btn">All 14 Tools</button>
                <button type="button" class="ghost xs" id="sw-tools-clear-btn">Reset</button>
              </div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;font-size:10.5px;color:#cbd5e1;max-height:115px;overflow-y:auto;padding:4px;background:rgba(8,13,26,.65);border-radius:6px">
            <label class="toggle" title="Live NVD 2.0, crt.sh, DNS &amp; OSINT Sweep"><input type="checkbox" class="sw-power-tool" value="osint_deep_sweep" checked> 🛰️ OSINT Sweep</label>
            <label class="toggle" title="Boundary &amp; Protocol Mutation Fuzzing"><input type="checkbox" class="sw-power-tool" value="parallel_fuzz_audit" checked> 💥 Fuzz Audit</label>
            <label class="toggle" title="Semgrep &amp; Tree-Sitter AST Static Vulnerability Scan"><input type="checkbox" class="sw-power-tool" value="static_vuln_scan" checked> 🛡️ AST VulnScan</label>
            <label class="toggle" title="Live Sandbox Bash/Python/Node Execution"><input type="checkbox" class="sw-power-tool" value="parallel_bash_exec" checked> 💻 LiveShell</label>
            <label class="toggle" title="Automated Remediation Diff &amp; Self-Heal"><input type="checkbox" class="sw-power-tool" value="auto_patch_verify" checked> 🔧 AutoPatch</label>
            <label class="toggle" title="Invoke Any of the 20 Built-In MCP Servers"><input type="checkbox" class="sw-power-tool" value="mcp_call" checked> 🔌 20-MCP Bridge</label>
            <label class="toggle" title="TCP Port, Service Banner &amp; TLS Cipher Chain Probe"><input type="checkbox" class="sw-power-tool" value="port_tls_probe" checked> 🌐 Port/TLS Probe</label>
            <label class="toggle" title="Shannon Byte Entropy, String Unpacker &amp; YARA/Sigma"><input type="checkbox" class="sw-power-tool" value="entropy_yara_scan" checked> 🦠 YARA/Entropy</label>
            <label class="toggle" title="TruffleHog &amp; GitLeaks High-Entropy Secret Scanner"><input type="checkbox" class="sw-power-tool" value="secret_leak_scan" checked> 🔑 SecretScan</label>
            <label class="toggle" title="Sherlock &amp; Maigret Cross-Platform Handle Graph"><input type="checkbox" class="sw-power-tool" value="socmint_graph" checked> 📱 SOCMINT Graph</label>
            <label class="toggle" title="ELF/PE Binary Header &amp; NX/PIE/RELRO Mitigation Audit"><input type="checkbox" class="sw-power-tool" value="binary_elf_audit" checked> 🔬 ELF/PE Binary</label>
            <label class="toggle" title="Barrier-Synchronized Concurrency &amp; TOCTOU Race Striker"><input type="checkbox" class="sw-power-tool" value="race_toctou_striker" checked> 🏎️ Race/TOCTOU</label>
            <label class="toggle" title="Shared KV Blackboard Cross-Group Memory Bus"><input type="checkbox" class="sw-power-tool" value="hive_blackboard" checked> 🧠 Hive Blackboard</label>
            <label class="toggle" title="Standalone CLI / GUI / Script / Windows EXE Bundler"><input type="checkbox" class="sw-power-tool" value="exe_packager" checked> 📦 EXE Forge</label>
          </div>
        </div>
      </div>

      <!-- 20 Built-In MCP Servers Multi-Select Hub for Swarm & Agents -->
      <div style="padding:10px;background:rgba(12,20,38,.94);border:1px solid rgba(56,189,248,.42);border-radius:8px;margin-bottom:10px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">
          <div>
            <strong style="font-size:12.5px;color:#38bdf8">🔌 4️⃣ 20 Built-In MCP Servers Hub (Multi-Select MCP Servers Available to Swarm Groups &amp; Agents)</strong>
            <span id="inline-swarm-mcp-count-badge" class="right-badge" style="margin-left:6px">20 / 20 MCP Servers Active</span>
          </div>
          <div class="row" style="gap:4px;flex-wrap:wrap">
            <button type="button" class="ghost xs" id="sw-mcp-select-all-btn">✅ All 20 MCPs</button>
            <button type="button" class="ghost xs" data-sw-mcp-cat="OffSec">⚔️ OffSec &amp; PenTest MCPs</button>
            <button type="button" class="ghost xs" data-sw-mcp-cat="OSINT">🛰️ OSINT &amp; SOCMINT MCPs</button>
            <button type="button" class="ghost xs" data-sw-mcp-cat="Exploit">💥 Exploit &amp; Malware MCPs</button>
            <button type="button" class="ghost xs" data-sw-mcp-cat="Red-Hat">🎩 Red-Hat &amp; Crypto MCPs</button>
            <button type="button" class="primary xs" id="sw-mcp-live-test-btn" title="Run a live diagnostic call across the selected MCP servers right now">⚡ Test Selected MCP Servers Live</button>
          </div>
        </div>
        <div id="inline-swarm-mcp-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:5px;max-height:145px;overflow-y:auto;padding:4px;background:rgba(7,12,24,.75);border-radius:6px">
          ${BUILTIN_MCP_SERVERS_CLIENT.map(
            (m) => `
            <label class="toggle" style="font-size:11px;padding:4px 6px;background:rgba(16,26,50,.75);border:1px solid rgba(100,116,139,.25);border-radius:5px;display:flex;align-items:center;gap:6px" title="${esc(m.name)} — ${esc(m.desc)} | Tools: ${esc(m.tools.join(", "))}">
              <input type="checkbox" class="sw-mcp-server-cb" value="${esc(m.id)}" data-mcp-cat="${esc(m.category)}" checked>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><strong style="color:#e2e8f0">${esc(m.short)}</strong> <span class="muted" style="font-size:9.5px">(${m.tools.length} tools)</span></span>
            </label>`
          ).join("")}
        </div>
        <div id="inline-swarm-mcp-test-output" class="hidden" style="margin-top:6px;padding:8px;background:rgba(6,10,20,.92);border:1px solid rgba(46,230,166,.4);border-radius:6px;font-family:monospace;font-size:11px;max-height:150px;overflow-y:auto;white-space:pre-wrap;color:#a7f3d0"></div>
      </div>

      <!-- Per-Group Multi-Select Specialist Agent & Swarm Model Assignment Matrix (1–50 Groups) -->
      <div style="padding:10px;background:rgba(10,17,34,.92);border:1px solid rgba(124,92,255,.45);border-radius:8px;margin-bottom:10px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          <div>
            <strong style="font-size:12.5px;color:#c4b5fd">5️⃣ Multi-Select Specialist Agents &amp; Swarm Models Per Group (1–50 Groups · 48 Specialist Agents)</strong>
            <span id="inline-swarm-groups-badge" class="right-badge" style="margin-left:6px">6 Groups · 60 Total Workers</span>
          </div>
          <div class="row" style="gap:5px;flex-wrap:wrap">
            <button type="button" class="ghost xs" data-sw-squad="coding_engineering" title="Assign Python, Frontend, Backend, Database, Debugger &amp; QA Coding Specialists">💻🐍 10 Coding Specialists Squad</button>
            <button type="button" class="ghost xs" id="inline-swarm-preset-all20-btn" title="Set 20 Groups and assign grouped Security, Recon &amp; Coding Specialists">🔥 20-Group Full Roster</button>
            <button type="button" class="ghost xs" id="inline-swarm-preset-50max-btn" title="Slide to 50 Groups and distribute all 48 Specialist Agents across 50 parallel worker groups">🚀 50-Group Max Swarm</button>
            <button type="button" class="ghost xs" data-sw-squad="red_black_offsec" title="Assign Web, Network &amp; System Hardening Security Pairs">⚔️🌐🎩 Security &amp; Network Squad</button>
            <button type="button" class="ghost xs" data-sw-squad="osint_socmint" title="Assign Dark Web, Scraper, Domain &amp; Social Recon Pairs">🛰️🕷️🌑 OSINT, Dark Web &amp; Scraper Squad</button>
            <button type="button" class="ghost xs" data-sw-squad="exploit_malware" title="Assign Metasploit, PoC &amp; Malware Forensics Pairs">💥🎯🦠 Exploit &amp; Malware Squad</button>
            <button type="button" class="ghost xs" data-sw-squad="cool_bonus" title="Assign Full-Stack App Builder, Legacy Code Reconstructor &amp; Stress Simulator">🚀🧬 Full-Stack &amp; Reverse-Eng Squad</button>
            <button type="button" class="ghost xs" id="inline-swarm-diversify-agents-btn">🎲 Cycle All 48 Specialists</button>
          </div>
        </div>

        <!-- Batch Multi-Select Specialist Agent Assigner Bar -->
        <div style="padding:8px;background:rgba(18,28,56,.75);border:1px solid rgba(196,181,253,.28);border-radius:6px;margin-bottom:8px">
          <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
            <span style="font-size:11px;font-weight:700;color:#ddd6fe">🎯 Batch Multi-Select Assigner:</span>
            <span class="muted" style="font-size:10.5px">Click any row's <strong>Multi-Select Agents ▼</strong> dropdown below to check multiple Specialist Agents for that group, or use this quick batch assigner:</span>
            <select id="inline-swarm-batch-target-group" class="input slim" style="width:155px;font-size:11px">
              <option value="all">Apply to ALL Groups</option>
            </select>
            <button type="button" class="ghost xs" id="inline-swarm-pair-2agents-btn" title="Automatically assign 2 complementary Specialist Agents to every group">👥 Assign 2 Complementary Agents / Group</button>
            <button type="button" class="ghost xs" id="inline-swarm-pair-3agents-btn" title="Automatically assign 3 complementary Specialist Agents (Red + Black + OffSec/OSINT) to every group">🛡️⚔️🛰️ Assign 3-Agent Triad / Group</button>
          </div>
        </div>

        <div id="inline-swarm-groups-list" style="display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto;padding-right:4px"></div>
      </div>

      <!-- 🕸️ LIVE VISUAL NETWORK GRAPH (SPECIALIST AGENTS ↔ SWARM MODELS ↔ MCP SERVERS ↔ QUEEN SYNTHESIZER) -->
      <div id="inline-swarm-network-graph-panel" style="margin-top:10px;padding:12px;background:rgba(6,11,24,.94);border:1px solid rgba(56,189,248,.45);border-radius:10px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <strong style="font-size:13px;color:#38bdf8">🕸️ Live Swarm Network Graph &amp; Real-Time Data-Flow Topology</strong>
            <div class="muted" style="font-size:11px">Shows live connections &amp; packet routing: <strong>Mission Orchestrator → Worker Groups (1–50) → Chosen Specialist Agents → Swarm Models &amp; MCP Hubs → Queen Boss Synthesizer</strong>. Click any node to inspect its live routing.</div>
          </div>
          <div class="row" style="gap:6px;flex-wrap:wrap;align-items:center">
            <span id="sw-net-stats-badge" class="badge" style="background:rgba(56,189,248,.16);color:#7dd3fc;border:1px solid rgba(56,189,248,.4);font-size:10.5px">Loading topology…</span>
            <select id="sw-net-layout-mode" class="input slim" style="width:170px;font-size:11px">
              <option value="dag">📐 5-Tier Data-Flow Pipeline</option>
              <option value="radial">🌌 Radial Constellation Hub</option>
            </select>
            <button type="button" class="primary xs" id="sw-net-simulate-flow-btn" title="Simulate a high-speed data packet burst across all Specialist Agent and Swarm Model connections">⚡ Simulate Data-Flow Pulse</button>
          </div>
        </div>
        <div id="sw-net-svg-stage" style="width:100%;min-height:295px;background:radial-gradient(circle at 50% 50%, rgba(16,28,60,.85), rgba(5,9,20,.98));border:1px solid rgba(124,92,255,.32);border-radius:8px;overflow:hidden;position:relative"></div>
        <div id="sw-net-node-inspector" style="margin-top:6px;padding:6px 10px;background:rgba(12,20,42,.88);border:1px solid var(--line);border-radius:6px;font-size:11px;color:#cbd5e1;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <span>💡 <strong>Node Inspector:</strong> Click any Group, Specialist Agent, Swarm Model, MCP Hub, or Queen Boss node in the graph above to inspect its live connections and data-flow bandwidth.</span>
          <span style="font-size:10.5px;color:#6ee7b7">● Live Sync Active</span>
        </div>
      </div>
    </div>

    <div style="margin-bottom:10px">
      <label class="muted" style="font-size:11.5px;display:block;margin-bottom:4px">
        📝 Swarm Mission / Build Goal (synced with main Council prompt box above):
      </label>
      <input id="inline-swarm-prompt-input" class="input" style="width:100%" value="${esc(currentPrompt)}" placeholder="Describe what you want your Swarm to build, audit, recon, or verify…">
    </div>

    <div class="btn-row" style="justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button type="button" class="primary big" id="inline-swarm-launch-btn" style="padding:8px 18px">🚀 Deploy Swarm Now (Auto-Closes Setup Window)</button>
        <button type="button" class="ghost sm" id="inline-swarm-cancel-btn">✕ Cancel &amp; Close Window</button>
      </div>
      <span class="muted" style="font-size:11px">When you click <strong>🚀 Deploy Swarm Now</strong>, this setup window disappears and is replaced by your live Swarm execution &amp; synthesis.</span>
    </div>
  `;

  ans.appendChild(card);

  const strategyModeEl = $("#inline-swarm-strategy-mode");
  const multiAgentConfigWrap = $("#inline-swarm-multiagent-config-wrap");
  const workerCountEl = $("#inline-swarm-worker-count");
  const baseModelEl = $("#inline-swarm-base-model");
  const ramGbEl = $("#inline-swarm-ram-gb");
  const ramSumEl = $("#inline-swarm-ram-summary");
  const splitModeEl = $("#inline-swarm-split-mode");
  const groupSliderEl = $("#inline-swarm-group-slider");
  const groupCountEl = $("#inline-swarm-group-count");
  const sliderValBadgeEl = $("#inline-swarm-slider-val-badge");
  const workersPerGroupEl = $("#inline-swarm-workers-per-group");
  const threadsPerGroupEl = $("#inline-swarm-threads-per-group");
  const groupsListEl = $("#inline-swarm-groups-list");
  const groupsBadgeEl = $("#inline-swarm-groups-badge");
  const batchTargetGroupEl = $("#inline-swarm-batch-target-group");
  const promptInputEl = $("#inline-swarm-prompt-input");

  strategyModeEl?.addEventListener("change", () => {
    const isMass = strategyModeEl.value === "mass_60";
    if (multiAgentConfigWrap) {
      multiAgentConfigWrap.style.opacity = isMass ? "1" : "0.55";
    }
  });

  if (promptInputEl && $("#prompt")) {
    promptInputEl.addEventListener("input", () => {
      $("#prompt").value = promptInputEl.value;
    });
    $("#prompt").addEventListener("input", () => {
      if ($("#inline-swarm-prompt-input")) {
        $("#inline-swarm-prompt-input").value = $("#prompt").value;
      }
    });
  }

  function updateMcpBadgeCount() {
    const checked = card.querySelectorAll(".sw-mcp-server-cb:checked").length;
    const badge = $("#inline-swarm-mcp-count-badge");
    if (badge) badge.textContent = `${checked} / ${BUILTIN_MCP_SERVERS_CLIENT.length} MCP Servers Active`;
  }

  card.querySelectorAll(".sw-mcp-server-cb").forEach((cb) => {
    cb.addEventListener("change", () => {
      updateMcpBadgeCount();
      if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
    });
  });

  $("#sw-mcp-select-all-btn")?.addEventListener("click", () => {
    card.querySelectorAll(".sw-mcp-server-cb").forEach((cb) => {
      cb.checked = true;
    });
    updateMcpBadgeCount();
    if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
  });

  card.querySelectorAll("[data-sw-mcp-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const catSub = (btn.getAttribute("data-sw-mcp-cat") || "").toLowerCase();
      card.querySelectorAll(".sw-mcp-server-cb").forEach((cb) => {
        const c = (cb.getAttribute("data-mcp-cat") || "").toLowerCase();
        cb.checked = c.includes(catSub);
      });
      updateMcpBadgeCount();
      if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
    });
  });

  $("#sw-tools-all-btn")?.addEventListener("click", () => {
    card.querySelectorAll(".sw-power-tool").forEach((cb) => {
      cb.checked = true;
    });
  });
  $("#sw-tools-clear-btn")?.addEventListener("click", () => {
    card.querySelectorAll(".sw-power-tool").forEach((cb, idx) => {
      cb.checked = idx < 6;
    });
  });

  $("#sw-mcp-live-test-btn")?.addEventListener("click", async () => {
    const outBox = $("#inline-swarm-mcp-test-output");
    if (!outBox) return;
    const selectedMcps = [...card.querySelectorAll(".sw-mcp-server-cb:checked")].map((cb) => cb.value);
    if (!selectedMcps.length) {
      status("Select at least 1 MCP server to test!");
      return;
    }
    outBox.classList.remove("hidden");
    outBox.textContent = `⏳ Probing ${selectedMcps.length} selected MCP servers (${selectedMcps.slice(0, 5).join(", ")}${selectedMcps.length > 5 ? "…" : ""})…`;
    try {
      const res = await postJSON("/api/mcp/batch-call", {
        servers: selectedMcps.slice(0, 6),
        target: (promptInputEl?.value || currentPrompt).slice(0, 120),
      });
      if (res?.ok && Array.isArray(res.results)) {
        outBox.textContent = res.results.map((r) => r.output).join("\n\n────────────────────────────────────────\n\n");
        status(`✅ Live tested ${res.results.length} MCP servers!`);
      } else {
        outBox.textContent = `❌ MCP test error: ${res?.error || "Unknown error"}`;
      }
    } catch (e) {
      outBox.textContent = `❌ MCP test error: ${e.message || e}`;
    }
  });

  function getSelectedModelSizeGb() {
    const opt = baseModelEl?.selectedOptions?.[0];
    return Math.max(1, Number(opt?.dataset?.sizeGb) || 4);
  }

  function updateRamSummary() {
    const wCount = Math.max(1, Number(workerCountEl?.value) || 60);
    const sizeGb = getSelectedModelSizeGb();
    const totalRam = Math.max(8, Number(ramGbEl?.value) || 192);
    const estUsed = Math.round((sizeGb + wCount * 0.25) * 10) / 10;
    if (ramSumEl) {
      ramSumEl.textContent = `~${sizeGb}GB model + ${wCount} lanes ≈ ${estUsed}GB / ${totalRam}GB`;
    }
  }

  // Build interactive Multi-Select Specialist Agent dropdown HTML for a group row
  function buildGroupMultiSelectAgentControlHtml(gIdx, selectedIdsInput) {
    const selectedIds = (Array.isArray(selectedIdsInput) ? selectedIdsInput : [selectedIdsInput])
      .map((x) => String(x || "").trim())
      .filter(Boolean);
    const effectiveIds = selectedIds.length
      ? selectedIds
      : [BUILTIN_SWARM_GROUP_SPECIALISTS[gIdx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id];
    const selectedSet = new Set(effectiveIds);
    const allCatalog = getAllSelectableSwarmAgentsCatalog();

    const selectedObjs = effectiveIds
      .map((id) => allCatalog.find((a) => a.id === id || a.id === `custom:${id}` || a.id.replace(/^custom:/, "") === id))
      .filter(Boolean);

    const summaryLabel =
      selectedObjs.length === 0
        ? "Select Specialist Agents…"
        : selectedObjs.length === 1
        ? selectedObjs[0].name
        : `🔥 ${selectedObjs.length} Agents: ${selectedObjs.map((o) => o.name.replace(/^[^\s]+\s+#\d+\s+/, "")).join(" + ")}`;

    const byCat = new Map();
    allCatalog.forEach((sp) => {
      const cat = sp.category || "🎯 Specialist Agents";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(sp);
    });

    let checklistHtml = "";
    for (const [catName, list] of byCat.entries()) {
      checklistHtml += `
        <div style="margin-top:4px;margin-bottom:2px;display:flex;justify-content:space-between;align-items:center;padding:2px 4px;background:rgba(30,41,59,.85);border-radius:4px">
          <strong style="font-size:10px;color:#93c5fd">${esc(catName)}</strong>
          <button type="button" class="ghost xs sw-grp-ms-cat-all" data-cat="${esc(catName)}" style="font-size:9px;padding:1px 5px">+ All</button>
        </div>
      `;
      for (const sp of list) {
        const isChecked = selectedSet.has(sp.id) || selectedSet.has(sp.id.replace(/^custom:/, ""));
        checklistHtml += `
          <label style="display:flex;align-items:center;gap:6px;padding:3px 6px;font-size:11px;cursor:pointer;border-radius:4px;color:${isChecked ? "#6ee7b7" : "#e2e8f0"}" class="sw-grp-ms-item" data-cat="${esc(catName)}" data-agent-lighthouse="${esc(sp.id)}">
            <input type="checkbox" class="sw-grp-ms-cb" value="${esc(sp.id)}" ${isChecked ? "checked" : ""}>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(sp.name)}</span>
          </label>
        `;
      }
    }

    const pillsHtml = selectedObjs
      .map(
        (o) =>
          `<span class="badge" data-agent-lighthouse="${esc(o.id)}" style="font-size:9.5px;padding:1px 6px;background:rgba(46,230,166,.14);border:1px solid rgba(46,230,166,.4);color:#6ee7b7;display:inline-flex;align-items:center;gap:4px;cursor:help">${esc(
            o.name.slice(0, 34)
          )}</span>`
      )
      .join(" ");

    return `
      <div class="sw-grp-multiselect-wrap" data-grp-idx="${gIdx}" style="position:relative">
        <div class="row" style="gap:4px;align-items:center">
          <button type="button" class="input slim sw-grp-ms-toggle-btn" style="flex:1;text-align:left;display:flex;justify-content:space-between;align-items:center;gap:6px;cursor:pointer;overflow:hidden;background:rgba(10,18,36,.95);border-color:rgba(124,92,255,.45)">
            <span class="sw-grp-ms-summary" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600;color:#e2e8f0">${esc(summaryLabel)}</span>
            <span style="font-size:10px;color:#a78bfa;white-space:nowrap">Multi-Select ▼</span>
          </button>
        </div>
        <div class="sw-grp-ms-pills" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:3px">${pillsHtml}</div>
        <!-- Synced native multi-select dropdown for accessibility & direct multi-select -->
        <select multiple class="input slim sw-grp-agent sw-grp-agent-multi hidden" data-grp-idx="${gIdx}" style="width:100%">
          ${buildSwarmGroupAgentOptionsHtml(effectiveIds)}
        </select>
        <!-- Floating Multi-Select Dropdown Menu -->
        <div class="sw-grp-ms-dropdown hidden" style="position:absolute;z-index:80;top:100%;left:0;right:0;min-width:330px;max-height:260px;overflow-y:auto;margin-top:3px;padding:6px;background:rgba(9,14,28,.98);border:1px solid rgba(124,92,255,.75);border-radius:8px;box-shadow:0 12px 28px rgba(0,0,0,.75)">
          <div class="row" style="justify-content:space-between;align-items:center;gap:4px;margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid var(--line)">
            <input type="text" class="input slim sw-grp-ms-search" placeholder="🔍 Search 48 Grouped Specialists…" style="flex:1;font-size:10.5px;padding:3px 6px">
            <button type="button" class="ghost xs sw-grp-ms-clear" style="font-size:9.5px">Reset (1)</button>
            <button type="button" class="primary xs sw-grp-ms-done" style="font-size:9.5px">Done ✓</button>
          </div>
          <div class="sw-grp-ms-list">${checklistHtml}</div>
        </div>
      </div>
    `;
  }

  function wireGroupMultiSelectEvents(containerEl) {
    const allCatalog = getAllSelectableSwarmAgentsCatalog();

    containerEl.querySelectorAll(".sw-grp-multiselect-wrap").forEach((wrap) => {
      const toggleBtn = wrap.querySelector(".sw-grp-ms-toggle-btn");
      const dropdown = wrap.querySelector(".sw-grp-ms-dropdown");
      const summaryEl = wrap.querySelector(".sw-grp-ms-summary");
      const pillsEl = wrap.querySelector(".sw-grp-ms-pills");
      const nativeSelect = wrap.querySelector(".sw-grp-agent-multi");
      const searchInp = wrap.querySelector(".sw-grp-ms-search");
      const doneBtn = wrap.querySelector(".sw-grp-ms-done");
      const clearBtn = wrap.querySelector(".sw-grp-ms-clear");
      const gIdx = Number(wrap.getAttribute("data-grp-idx")) || 0;

      function syncFromCheckboxes() {
        const checkedVals = [...wrap.querySelectorAll(".sw-grp-ms-cb:checked")].map((cb) => cb.value);
        const finalIds = checkedVals.length
          ? checkedVals
          : [BUILTIN_SWARM_GROUP_SPECIALISTS[gIdx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id];

        if (!checkedVals.length) {
          const firstCb = wrap.querySelector(`.sw-grp-ms-cb[value="${CSS.escape(finalIds[0])}"]`);
          if (firstCb) firstCb.checked = true;
        }

        if (nativeSelect) {
          const set = new Set(finalIds);
          [...nativeSelect.options].forEach((opt) => {
            opt.selected = set.has(opt.value);
          });
        }

        const selectedObjs = finalIds
          .map((id) => allCatalog.find((a) => a.id === id || a.id === `custom:${id}` || a.id.replace(/^custom:/, "") === id))
          .filter(Boolean);

        if (summaryEl) {
          summaryEl.textContent =
            selectedObjs.length === 1
              ? selectedObjs[0].name
              : `🔥 ${selectedObjs.length} Agents: ${selectedObjs.map((o) => o.name.replace(/^[^\s]+\s+#\d+\s+/, "")).join(" + ")}`;
        }
        if (pillsEl) {
          pillsEl.innerHTML = selectedObjs
            .map(
              (o) =>
                `<span class="badge" data-agent-lighthouse="${esc(o.id)}" style="font-size:9.5px;padding:1px 6px;background:rgba(46,230,166,.14);border:1px solid rgba(46,230,166,.4);color:#6ee7b7;display:inline-flex;align-items:center;gap:4px;cursor:help">${esc(
                  o.name.slice(0, 34)
                )}</span>`
            )
            .join(" ");
        }
        if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
      }

      toggleBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasHidden = dropdown?.classList.contains("hidden");
        containerEl.querySelectorAll(".sw-grp-ms-dropdown").forEach((d) => d.classList.add("hidden"));
        if (wasHidden) {
          dropdown?.classList.remove("hidden");
          searchInp?.focus();
        }
      });

      doneBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown?.classList.add("hidden");
      });

      clearBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const defId = BUILTIN_SWARM_GROUP_SPECIALISTS[gIdx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id;
        wrap.querySelectorAll(".sw-grp-ms-cb").forEach((cb) => {
          cb.checked = cb.value === defId;
        });
        syncFromCheckboxes();
      });

      wrap.querySelectorAll(".sw-grp-ms-cat-all").forEach((catBtn) => {
        catBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetCat = catBtn.getAttribute("data-cat") || "";
          wrap.querySelectorAll(`.sw-grp-ms-item[data-cat="${CSS.escape(targetCat)}"] .sw-grp-ms-cb`).forEach((cb) => {
            cb.checked = true;
          });
          syncFromCheckboxes();
        });
      });

      wrap.querySelectorAll(".sw-grp-ms-cb").forEach((cb) => {
        cb.addEventListener("change", () => {
          syncFromCheckboxes();
        });
      });

      searchInp?.addEventListener("input", () => {
        const q = (searchInp.value || "").toLowerCase().trim();
        wrap.querySelectorAll(".sw-grp-ms-item").forEach((item) => {
          const txt = (item.textContent || "").toLowerCase();
          item.style.display = !q || txt.includes(q) ? "flex" : "none";
        });
      });
    });
  }

  function renderGroupRows(preserveExisting = true, forcedAgentSets = null) {
    if (!groupsListEl) return;
    let groupCount = Math.max(1, Math.min(50, Number(groupCountEl?.value) || Number(groupSliderEl?.value) || 6));
    let totalWorkers = Math.max(1, Math.min(500, Number(workerCountEl?.value) || 60));
    const splitMode = splitModeEl?.value || "even_groups";
    let wPerGroup = Math.max(1, Math.min(500, Number(workersPerGroupEl?.value) || 10));
    const defaultThreads = Math.max(1, Math.min(128, Number(threadsPerGroupEl?.value) || 8));

    if (splitMode === "workers_per_group") {
      groupCount = Math.max(1, Math.min(50, Math.ceil(totalWorkers / wPerGroup)));
    } else {
      if (totalWorkers < groupCount) {
        totalWorkers = groupCount;
        if (workerCountEl) workerCountEl.value = String(totalWorkers);
      }
      wPerGroup = Math.max(1, Math.ceil(totalWorkers / groupCount));
      if (workersPerGroupEl) workersPerGroupEl.value = String(wPerGroup);
    }

    if (groupCountEl) groupCountEl.value = String(groupCount);
    if (groupSliderEl) groupSliderEl.value = String(groupCount);
    if (sliderValBadgeEl) sliderValBadgeEl.textContent = `${groupCount} Group${groupCount === 1 ? "" : "s"}`;

    if (batchTargetGroupEl) {
      const prevVal = batchTargetGroupEl.value || "all";
      batchTargetGroupEl.innerHTML =
        `<option value="all">Apply to ALL ${groupCount} Groups</option>` +
        Array.from({ length: groupCount }, (_, i) => `<option value="${i}">Only Group #${i + 1}</option>`).join("");
      if ([...batchTargetGroupEl.options].some((o) => o.value === prevVal)) {
        batchTargetGroupEl.value = prevVal;
      }
    }

    const prevSelections = [];
    if (preserveExisting) {
      groupsListEl.querySelectorAll(".inline-swarm-group-row").forEach((row) => {
        const checkedCbs = [...row.querySelectorAll(".sw-grp-ms-cb:checked")].map((cb) => cb.value);
        const selEl = row.querySelector(".sw-grp-agent-multi");
        const selectedOpts = selEl ? [...selEl.selectedOptions].map((o) => o.value) : [];
        const agents = checkedCbs.length ? checkedCbs : selectedOpts;
        prevSelections.push({
          agents,
          model: row.querySelector(".sw-grp-model")?.value || "",
          threads: Number(row.querySelector(".sw-grp-threads")?.value) || defaultThreads,
        });
      });
    }

    const baseSlice = Math.floor(totalWorkers / groupCount);
    const remainder = totalWorkers % groupCount;

    const delegatedFileSlugs = [
      "01_core_engine_bootstrap.py",
      "02_transport_multiplexer.py",
      "03_worker_execution_pipeline.py",
      "04_payload_parser_codec.py",
      "05_offsec_boundary_auditor.py",
      "06_cli_api_verification_suite.py",
      "07_persistence_state_vault.py",
      "08_mcp_tool_bridge_router.py",
    ];

    let cursor = 1;
    let rowsHtml = "";
    for (let g = 0; g < groupCount; g++) {
      const countForThisGroup = Math.max(1, baseSlice + (g < remainder ? 1 : 0));
      const startW = cursor;
      const endW = cursor + Math.max(0, countForThisGroup - 1);
      cursor += countForThisGroup;

      let groupAgentIds = [];
      if (Array.isArray(forcedAgentSets) && forcedAgentSets.length) {
        const pick = forcedAgentSets[g % forcedAgentSets.length];
        groupAgentIds = Array.isArray(pick) ? [...pick] : [pick];
      } else if (prevSelections[g]?.agents?.length) {
        groupAgentIds = [...prevSelections[g].agents];
      } else {
        // Default each group to a 3-Agent Sequential Triad (Agent #1 -> Agent #2 -> Agent #3)
        groupAgentIds = [
          BUILTIN_SWARM_GROUP_SPECIALISTS[(g * 3) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
          BUILTIN_SWARM_GROUP_SPECIALISTS[(g * 3 + 1) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
          BUILTIN_SWARM_GROUP_SPECIALISTS[(g * 3 + 2) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
        ];
      }
      while (groupAgentIds.length < 3) {
        const nextCandidate =
          BUILTIN_SWARM_GROUP_SPECIALISTS[(g * 3 + groupAgentIds.length) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id;
        if (!groupAgentIds.includes(nextCandidate)) groupAgentIds.push(nextCandidate);
        else groupAgentIds.push(BUILTIN_SWARM_GROUP_SPECIALISTS[groupAgentIds.length % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id);
      }

      const prevModelId = prevSelections[g]?.model || "";
      const grpThreads = prevSelections[g]?.threads || defaultThreads;
      const rawSlug = delegatedFileSlugs[g % delegatedFileSlugs.length];
      const delegatedFileLabel = rawSlug.replace(/^\d+_/, `${String(g + 1).padStart(2, "0")}_`);

      rowsHtml += `
        <div class="inline-swarm-group-row" data-grp-idx="${g}" style="display:grid;grid-template-columns:155px 1.6fr 1fr 76px 76px;gap:6px;align-items:start;padding:7px 8px;background:rgba(16,26,52,.78);border:1px solid var(--line);border-radius:6px">
          <div>
            <strong style="font-size:11.5px;color:var(--ok)">Group #${g + 1}</strong>
            <div class="muted sw-grp-range" style="font-size:10px">Workers #${startW}–#${endW}</div>
            <div style="margin-top:3px;font-size:9.5px;color:#38bdf8;font-family:var(--mono);word-break:break-all" title="Upfront Delegated Code Module for Group #${g + 1}">🧩 ${esc(delegatedFileLabel)}</div>
          </div>
          <div>
            <label class="muted" style="font-size:10px;display:block">3-Agent Sequential Chain (Agent #1 → Agent #2 → Agent #3) for Group #${g + 1}</label>
            ${buildGroupMultiSelectAgentControlHtml(g, groupAgentIds)}
          </div>
          <div>
            <label class="muted" style="font-size:10px;display:block">Swarm Model for Group #${g + 1}</label>
            <select class="input slim sw-grp-model" style="width:100%">
              ${buildAllSelectableModelsOptionsHtml(prevModelId, true)}
            </select>
          </div>
          <div>
            <label class="muted" style="font-size:10px;display:block">Workers</label>
            <input type="number" class="input slim sw-grp-workers" min="1" max="500" value="${countForThisGroup}" style="width:100%">
          </div>
          <div>
            <label class="muted" style="font-size:10px;display:block;color:#7dd3fc">Threads</label>
            <input type="number" class="input slim sw-grp-threads" min="1" max="128" value="${grpThreads}" style="width:100%">
          </div>
        </div>
      `;
    }

    groupsListEl.innerHTML = rowsHtml;
    wireGroupMultiSelectEvents(groupsListEl);

    if (groupsBadgeEl) {
      groupsBadgeEl.textContent = `${groupCount} Groups · ${totalWorkers} Total Workers · ${defaultThreads} Threads/Group`;
    }
    updateRamSummary();

    groupsListEl.querySelectorAll(".sw-grp-workers").forEach((inp) => {
      inp.addEventListener("input", () => {
        let cur = 1;
        let sumW = 0;
        groupsListEl.querySelectorAll(".inline-swarm-group-row").forEach((r) => {
          const w = Math.max(1, Number(r.querySelector(".sw-grp-workers")?.value) || 1);
          sumW += w;
          const rng = r.querySelector(".sw-grp-range");
          if (rng) rng.textContent = `Workers #${cur}–#${cur + w - 1}`;
          cur += w;
        });
        if (workerCountEl) workerCountEl.value = String(sumW);
        if (groupsBadgeEl) {
          groupsBadgeEl.textContent = `${groupCount} Groups · ${sumW} Total Workers`;
        }
        updateRamSummary();
        if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
      });
    });
    groupsListEl.querySelectorAll(".sw-grp-model, .sw-grp-threads").forEach((el) => {
      el.addEventListener("change", () => {
        if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
      });
    });
    if (typeof refreshSetupNetworkGraph === "function") refreshSetupNetworkGraph();
  }

  card.querySelectorAll("[data-sw-preset-workers]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (workerCountEl) workerCountEl.value = btn.getAttribute("data-sw-preset-workers") || "60";
      renderGroupRows(true);
    });
  });

  card.querySelectorAll("[data-sw-preset-groups]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gVal = Math.max(1, Math.min(50, Number(btn.getAttribute("data-sw-preset-groups")) || 6));
      if (splitModeEl) splitModeEl.value = "even_groups";
      if (groupCountEl) groupCountEl.value = String(gVal);
      if (groupSliderEl) groupSliderEl.value = String(gVal);
      if (workerCountEl && Number(workerCountEl.value) < gVal) {
        workerCountEl.value = String(Math.max(gVal, 60));
      }
      renderGroupRows(true);
    });
  });

  workerCountEl?.addEventListener("input", () => renderGroupRows(true));
  baseModelEl?.addEventListener("change", updateRamSummary);
  ramGbEl?.addEventListener("input", updateRamSummary);
  splitModeEl?.addEventListener("change", () => renderGroupRows(true));

  // Two-way sync between the 1-50 Group Slider and Group Number input
  groupSliderEl?.addEventListener("input", () => {
    if (splitModeEl) splitModeEl.value = "even_groups";
    if (groupCountEl) groupCountEl.value = groupSliderEl.value;
    renderGroupRows(true);
  });
  groupCountEl?.addEventListener("input", () => {
    if (splitModeEl) splitModeEl.value = "even_groups";
    const clamped = Math.max(1, Math.min(50, Number(groupCountEl.value) || 1));
    if (groupSliderEl) groupSliderEl.value = String(clamped);
    renderGroupRows(true);
  });

  workersPerGroupEl?.addEventListener("input", () => {
    if (splitModeEl) splitModeEl.value = "workers_per_group";
    renderGroupRows(true);
  });
  threadsPerGroupEl?.addEventListener("input", () => {
    const newT = Math.max(1, Number(threadsPerGroupEl.value) || 8);
    groupsListEl?.querySelectorAll(".sw-grp-threads").forEach((tInp) => {
      tInp.value = String(newT);
    });
    renderGroupRows(true);
  });

  $("#inline-swarm-preset-all20-btn")?.addEventListener("click", () => {
    if (splitModeEl) splitModeEl.value = "even_groups";
    if (groupCountEl) groupCountEl.value = "20";
    if (groupSliderEl) groupSliderEl.value = "20";
    if (workerCountEl && Number(workerCountEl.value) < 20) workerCountEl.value = "60";
    renderGroupRows(false, BUILTIN_SWARM_GROUP_SPECIALISTS.slice(0, 20).map((s) => [s.id]));
    status("🔥 Configured 20 Swarm Groups across Coding, Web Security, Network, OSINT, Exploit & System Hardening Specialists!");
  });

  $("#inline-swarm-preset-50max-btn")?.addEventListener("click", () => {
    if (splitModeEl) splitModeEl.value = "even_groups";
    if (groupCountEl) groupCountEl.value = "50";
    if (groupSliderEl) groupSliderEl.value = "50";
    if (workerCountEl && Number(workerCountEl.value) < 100) workerCountEl.value = "100";
    const pairs = Array.from({ length: 50 }, (_, idx) => [
      BUILTIN_SWARM_GROUP_SPECIALISTS[idx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
      BUILTIN_SWARM_GROUP_SPECIALISTS[(idx + 7) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
    ]);
    renderGroupRows(false, pairs);
    status("🚀 Configured 50 Worker Groups (100 Total Workers) across all 48 Specialist Agents!");
  });

  $("#inline-swarm-pair-2agents-btn")?.addEventListener("click", () => {
    const targetGrp = batchTargetGroupEl?.value || "all";
    const currentGroupCount = Math.max(1, Number(groupCountEl?.value) || 6);
    if (targetGrp === "all") {
      const pairs = Array.from({ length: currentGroupCount }, (_, idx) => [
        BUILTIN_SWARM_GROUP_SPECIALISTS[idx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
        BUILTIN_SWARM_GROUP_SPECIALISTS[(idx + 6) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
      ]);
      renderGroupRows(false, pairs);
      status(`👥 Assigned 2 complementary Specialist Agents to all ${currentGroupCount} groups!`);
    } else {
      const gIdx = Number(targetGrp) || 0;
      const row = groupsListEl?.querySelector(`.inline-swarm-group-row[data-grp-idx="${gIdx}"]`);
      if (row) {
        const id1 = BUILTIN_SWARM_GROUP_SPECIALISTS[gIdx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id;
        const id2 = BUILTIN_SWARM_GROUP_SPECIALISTS[(gIdx + 6) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id;
        row.querySelectorAll(".sw-grp-ms-cb").forEach((cb) => {
          cb.checked = cb.value === id1 || cb.value === id2;
        });
        row.querySelector(".sw-grp-ms-cb")?.dispatchEvent(new Event("change"));
        status(`👥 Assigned 2 Specialist Agents to Group #${gIdx + 1}!`);
      }
    }
  });

  $("#inline-swarm-pair-3agents-btn")?.addEventListener("click", () => {
    const targetGrp = batchTargetGroupEl?.value || "all";
    const currentGroupCount = Math.max(1, Number(groupCountEl?.value) || 6);
    if (targetGrp === "all") {
      const triads = Array.from({ length: currentGroupCount }, (_, idx) => [
        BUILTIN_SWARM_GROUP_SPECIALISTS[idx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
        BUILTIN_SWARM_GROUP_SPECIALISTS[(idx + 4) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
        BUILTIN_SWARM_GROUP_SPECIALISTS[(idx + 15) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
      ]);
      renderGroupRows(false, triads);
      status(`🛡️⚔️🛰️ Assigned 3-Agent Specialist Triads across all ${currentGroupCount} groups!`);
    } else {
      const gIdx = Number(targetGrp) || 0;
      const row = groupsListEl?.querySelector(`.inline-swarm-group-row[data-grp-idx="${gIdx}"]`);
      if (row) {
        const ids = new Set([
          BUILTIN_SWARM_GROUP_SPECIALISTS[gIdx % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
          BUILTIN_SWARM_GROUP_SPECIALISTS[(gIdx + 4) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
          BUILTIN_SWARM_GROUP_SPECIALISTS[(gIdx + 15) % BUILTIN_SWARM_GROUP_SPECIALISTS.length].id,
        ]);
        row.querySelectorAll(".sw-grp-ms-cb").forEach((cb) => {
          cb.checked = ids.has(cb.value);
        });
        row.querySelector(".sw-grp-ms-cb")?.dispatchEvent(new Event("change"));
        status(`🛡️⚔️🛰️ Assigned 3-Agent Specialist Triad to Group #${gIdx + 1}!`);
      }
    }
  });

  card.querySelectorAll("[data-sw-squad]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sq = btn.getAttribute("data-sw-squad");
      let sets = [];
      if (sq === "coding_engineering") {
        sets = [
          ["coding-python-automation-specialist", "coding-backend-api-specialist"],
          ["coding-frontend-ui-specialist", "coding-api-bot-integration-specialist"],
          ["coding-database-sql-specialist", "coding-systems-rust-cpp-go-specialist"],
          ["coding-debugger-refactor-specialist", "coding-qa-test-automation-specialist"],
          ["coding-shell-powershell-bash-specialist", "coding-devops-docker-cicd-specialist"],
          ["cool-fullstack-gui-exe-forge", "cross-agent-dedup-merge-surgeon"],
        ];
      } else if (sq === "red_black_offsec") {
        sets = [
          ["nmap-port-weakness-auditor", "offsec-web-api-pentester"],
          ["sqli-query-sink-specialist", "xss-dom-csp-specialist"],
          ["mitm-tls-transport-specialist", "arp-lan-spoofing-specialist"],
          ["redhat-kernel-hardener", "redhat-zero-trust-iam"],
          ["offsec-cloud-k8s-pentester", "redhat-siem-detection"],
          ["blackhat-sim-evasion-analyst", "blackhat-sim-apt-emulator"],
        ];
      } else if (sq === "osint_socmint") {
        sets = [
          ["darkweb-onion-osint-specialist", "osint-breach-secret-leak-hunter"],
          ["web-crawler-scraper-specialist", "proxy-hunter-validator-specialist"],
          ["osint-domain-asn-cert-scout", "socmint-handle-graph-mapper"],
          ["socmint-narrative-botnet-detector", "osint-cve-threat-feed-correlator"],
          ["web-crawler-scraper-specialist", "darkweb-onion-osint-specialist"],
          ["osint-domain-asn-cert-scout", "nmap-port-weakness-auditor"],
        ];
      } else if (sq === "exploit_malware") {
        sets = [
          ["metasploit-cve-surface-specialist", "exploit-boundary-poc-architect"],
          ["exploit-memory-binary-auditor", "malware-sandbox-behavior-tracer"],
          ["exploit-race-concurrency-striker", "malware-c2-beacon-hunter"],
          ["malware-static-unpacker-analyst", "redhat-exploit-poc-verifier"],
          ["metasploit-cve-surface-specialist", "nmap-port-weakness-auditor"],
          ["exploit-boundary-poc-architect", "ast-compiler-pregate-verifier"],
        ];
      } else if (sq === "cool_bonus") {
        sets = [
          ["cool-fullstack-gui-exe-forge", "coding-frontend-ui-specialist"],
          ["cool-autonomous-decompiler-architect", "coding-debugger-refactor-specialist"],
          ["cool-quantum-chaos-twin-simulator", "coding-devops-docker-cicd-specialist"],
          ["cool-fullstack-gui-exe-forge", "coding-backend-api-specialist"],
          ["cool-autonomous-decompiler-architect", "malware-static-unpacker-analyst"],
          ["cool-quantum-chaos-twin-simulator", "exploit-race-concurrency-striker"],
        ];
      }
      renderGroupRows(false, sets);
      status(`✨ Loaded multi-agent squad preset "${btn.textContent.trim()}" across your Swarm groups!`);
    });
  });

  let cycleOffset = 0;
  $("#inline-swarm-diversify-agents-btn")?.addEventListener("click", () => {
    cycleOffset = (cycleOffset + 3) % BUILTIN_SWARM_GROUP_SPECIALISTS.length;
    const rotated = BUILTIN_SWARM_GROUP_SPECIALISTS.slice(cycleOffset).concat(
      BUILTIN_SWARM_GROUP_SPECIALISTS.slice(0, cycleOffset)
    );
    renderGroupRows(false, rotated.map((s) => [s.id]));
    status("🎲 Cycled across all 48 Grouped Specialist Agents!");
  });

  $("#inline-swarm-cancel-btn")?.addEventListener("click", () => {
    card.remove();
  });

  $("#inline-swarm-launch-btn")?.addEventListener("click", async () => {
    const rawGoal = ($("#prompt")?.value || promptInputEl?.value || "").trim() || currentPrompt;
    const goal = rawGoal;
    const strategy = strategyModeEl?.value || "mass_60";

    const baseModelId = baseModelEl?.value || "Llama-3.2-3B-Instruct-abliterated.Q4_K_M.gguf";
    const baseModelLabel = baseModelEl?.selectedOptions?.[0]?.textContent || baseModelId;
    const baseModelSizeGb = getSelectedModelSizeGb();
    const totalRamGb = Math.max(8, Number(ramGbEl?.value) || 192);
    const defaultThreads = Math.max(1, Number(threadsPerGroupEl?.value) || 8);
    const missionMode = $("#inline-swarm-mission-mode")?.value || "code_forge";
    const arch = $("#inline-swarm-arch")?.value || "shared_kv";
    const useQueenBoss = Boolean($("#inline-swarm-use-queen-boss")?.checked);
    const queenBossModel = $("#inline-swarm-queen-model")?.value || "orcarouter/Qwen3.8-27B-Uncensored-GGUF";
    const queenAutoRotate = $("#inline-swarm-queen-rotate") ? $("#inline-swarm-queen-rotate").checked : true;
    const checkedTools = [...card.querySelectorAll(".sw-power-tool:checked")].map((el) => el.value);
    const checkedMcpServers = [...card.querySelectorAll(".sw-mcp-server-cb:checked")].map((el) => el.value);

    const groupRows = [...(groupsListEl?.querySelectorAll(".inline-swarm-group-row") || [])];
    const groupsConfig = groupRows.map((r, idx) => {
      const checkedAgentIds = [...r.querySelectorAll(".sw-grp-ms-cb:checked")].map((cb) => cb.value);
      const multiSelectEl = r.querySelector(".sw-grp-agent-multi");
      const fallbackOpts = multiSelectEl ? [...multiSelectEl.selectedOptions].map((o) => o.value) : [];
      const chosenAgentIds = checkedAgentIds.length ? checkedAgentIds : fallbackOpts;
      const agentInfo = resolveSwarmGroupAgentSelection(chosenAgentIds, idx);

      const overrideModelEl = r.querySelector(".sw-grp-model");
      const overrideModelId = overrideModelEl?.value || "";
      const overrideModelLabel = overrideModelId
        ? overrideModelEl?.selectedOptions?.[0]?.textContent || overrideModelId
        : baseModelLabel;
      const wCount = Math.max(1, Number(r.querySelector(".sw-grp-workers")?.value) || 10);
      const tCount = Math.max(1, Number(r.querySelector(".sw-grp-threads")?.value) || defaultThreads);
      return {
        group_id: idx + 1,
        worker_count: wCount,
        threads: tCount,
        agent_id: agentInfo.agent_id,
        agent_ids: agentInfo.agent_ids,
        agent_name: agentInfo.agent_name,
        agent_names: agentInfo.agent_names,
        role_name: agentInfo.role_name,
        category: agentInfo.category,
        sys_prompt: agentInfo.sys_prompt,
        tools: agentInfo.tools,
        mcp_servers: agentInfo.mcp_servers,
        model_id: overrideModelId || agentInfo.preferred_model || baseModelId,
        model_label: overrideModelLabel,
      };
    });

    const totalWorkers = groupsConfig.reduce((s, g) => s + g.worker_count, 0);

    // Immediately remove the pre-deployment setup card so #answers shows only the live Swarm execution!
    card.remove();

    if (strategy !== "mass_60") {
      await executeSwarmReactionChoice(strategy);
      return;
    }

    await runInlineSwarmMultiAgent(goal, {
      total_ram_gb: totalRamGb,
      model_size_gb: baseModelSizeGb,
      model_id: baseModelId,
      model_label: baseModelLabel,
      worker_count: totalWorkers,
      group_count: groupsConfig.length,
      threads_per_group: defaultThreads,
      groups_config: groupsConfig,
      mission_mode: missionMode,
      architecture: arch,
      tools: checkedTools.length ? checkedTools : undefined,
      mcp_servers: checkedMcpServers.length ? checkedMcpServers : undefined,
      use_queen_boss: useQueenBoss,
      queen_boss_model: queenBossModel,
      queen_auto_rotate: queenAutoRotate,
    });
  });

  function collectLiveSwarmTopologyState(livePhase = "SETUP_READY", activeBatchIdx = -1, completedGroupResults = null) {
    const groupRows = [...(groupsListEl?.querySelectorAll(".inline-swarm-group-row") || [])];
    const baseModelId = baseModelEl?.value || "Llama-3.2-3B-Instruct-abliterated.Q4_K_M.gguf";
    const baseModelLabel = (baseModelEl?.selectedOptions?.[0]?.textContent || baseModelId).replace(/^[🟢☁️🖥⚡📌🔥]\s*/, "").trim();
    const useQueenBoss = Boolean($("#inline-swarm-use-queen-boss")?.checked);
    const queenLabel = useQueenBoss
      ? ($("#inline-swarm-queen-model")?.selectedOptions?.[0]?.textContent || "OrcaCyber Qwen3.8 27B").replace(/^[🟢☁️🖥⚡📌🔥]\s*/, "").trim()
      : "🚫 Queen Boss OFF (Direct Code Assembly)";
    const checkedMcps = [...card.querySelectorAll(".sw-mcp-server-cb:checked")].map((el) => el.value);
    const defaultThreads = Math.max(1, Number(threadsPerGroupEl?.value) || 8);

    const groups = groupRows.map((r, idx) => {
      const checkedAgentIds = [...r.querySelectorAll(".sw-grp-ms-cb:checked")].map((cb) => cb.value);
      const multiSelectEl = r.querySelector(".sw-grp-agent-multi");
      const fallbackOpts = multiSelectEl ? [...multiSelectEl.selectedOptions].map((o) => o.value) : [];
      const chosenAgentIds = checkedAgentIds.length ? checkedAgentIds : fallbackOpts;
      const agentInfo = resolveSwarmGroupAgentSelection(chosenAgentIds, idx);
      const overrideModelEl = r.querySelector(".sw-grp-model");
      const overrideModelId = overrideModelEl?.value || "";
      const overrideModelLabel = overrideModelId
        ? (overrideModelEl?.selectedOptions?.[0]?.textContent || overrideModelId).replace(/^[🟢☁️🖥⚡📌🔥]\s*/, "").trim()
        : baseModelLabel;
      const wCount = Math.max(1, Number(r.querySelector(".sw-grp-workers")?.value) || 10);
      const tCount = Math.max(1, Number(r.querySelector(".sw-grp-threads")?.value) || defaultThreads);
      const completedMatch = Array.isArray(completedGroupResults) ? completedGroupResults[idx] : null;
      return {
        group_index: idx + 1,
        worker_count: wCount,
        threads: tCount,
        agent_ids: agentInfo.agent_ids,
        agent_names: agentInfo.agent_names,
        category: agentInfo.category,
        tools: agentInfo.tools,
        mcp_servers: agentInfo.mcp_servers,
        model_id: overrideModelId || baseModelId,
        model_label: overrideModelLabel,
        status: completedMatch ? "DONE" : activeBatchIdx >= 0 ? (idx <= activeBatchIdx ? "STREAMING" : "QUEUED") : "READY",
        elapsed_ms: completedMatch?.elapsed_ms || null,
        findings: completedMatch?.findings || null,
      };
    });

    const totalWorkers = groups.reduce((s, g) => s + g.worker_count, 0);
    return {
      phase: livePhase,
      layout: $("#sw-net-layout-mode")?.value || "dag",
      total_workers: totalWorkers,
      group_count: groups.length,
      base_model_label: baseModelLabel,
      use_queen_boss: useQueenBoss,
      queen_label: queenLabel,
      mcp_servers: checkedMcps,
      groups,
    };
  }

  function refreshSetupNetworkGraph(burstPulse = false) {
    const stageEl = $("#sw-net-svg-stage");
    const badgeEl = $("#sw-net-stats-badge");
    const inspectorEl = $("#sw-net-node-inspector");
    if (!stageEl) return;
    const topo = collectLiveSwarmTopologyState(burstPulse ? "PULSE_SIMULATION" : "SETUP_READY");
    renderSwarmNetworkGraphIntoStage(stageEl, badgeEl, inspectorEl, topo, burstPulse);
  }

  $("#inline-swarm-use-queen-boss")?.addEventListener("change", () => {
    const enabled = Boolean($("#inline-swarm-use-queen-boss")?.checked);
    const banner = $("#inline-swarm-queen-status-banner");
    const wrap = $("#inline-swarm-queen-controls-wrap");
    if (wrap) wrap.style.opacity = enabled ? "1" : "0.48";
    if (banner) {
      if (enabled) {
        banner.style.background = "rgba(251,191,36,.12)";
        banner.style.borderColor = "rgba(251,191,36,.45)";
        banner.style.color = "#fde68a";
        banner.innerHTML =
          "👑 <strong>Queen Boss is ON:</strong> Each group still shows its full <strong>Agent #1 → Agent #2 → Agent #3</strong> outputs, and then routes the final outputs through the Queen Boss synthesizer.";
      } else {
        banner.style.background = "rgba(16,185,129,.12)";
        banner.style.borderColor = "rgba(16,185,129,.38)";
        banner.style.color = "#a7f3d0";
        banner.innerHTML =
          "🚫 <strong>Queen Boss is OFF (Recommended):</strong> Workers run through <strong>Agent #1 → Agent #2 → Agent #3</strong> per group and output all 3 stages + combined multi-group code directly without hitting a single Queen Boss model at the end.";
      }
    }
    refreshSetupNetworkGraph(false);
  });

  $("#sw-net-layout-mode")?.addEventListener("change", () => refreshSetupNetworkGraph(false));
  $("#sw-net-simulate-flow-btn")?.addEventListener("click", () => {
    refreshSetupNetworkGraph(true);
    status("⚡ Simulating live data-flow packets across all Specialist Agents, Swarm Models & MCP hubs!");
  });
  $("#inline-swarm-queen-model")?.addEventListener("change", () => refreshSetupNetworkGraph(false));
  baseModelEl?.addEventListener("change", () => refreshSetupNetworkGraph(false));

  renderGroupRows(false);
}

// ── Shared Live Visual Swarm Network Graph Renderer (Setup Popup + Live Execution Stream) ──
function getCategoryColorHex(cat) {
  const c = String(cat || "").toLowerCase();
  if (c.includes("red")) return "#f43f5e";
  if (c.includes("black")) return "#a855f7";
  if (c.includes("offsec") || c.includes("pentest")) return "#f97316";
  if (c.includes("osint")) return "#38bdf8";
  if (c.includes("socmint") || c.includes("social")) return "#22d3ee";
  if (c.includes("exploit")) return "#eab308";
  if (c.includes("malware")) return "#ec4899";
  return "#10b981";
}

function renderSwarmNetworkGraphIntoStage(stageEl, badgeEl, inspectorEl, topo, burstMode = false) {
  if (!stageEl || !topo) return;
  const groups = Array.isArray(topo.groups) ? topo.groups : [];
  const totalGroups = groups.length || 1;
  const totalWorkers = topo.total_workers || 60;
  const mcpCount = (topo.mcp_servers || []).length;

  // Deduplicate unique Specialist Agents & unique Swarm Models across all groups
  const agentMap = new Map();
  const modelMap = new Map();
  groups.forEach((g) => {
    const names = Array.isArray(g.agent_names) && g.agent_names.length ? g.agent_names : [g.role_name || `Agent G${g.group_index}`];
    const ids = Array.isArray(g.agent_ids) && g.agent_ids.length ? g.agent_ids : names;
    ids.forEach((aid, idx) => {
      const nm = names[idx] || aid;
      if (!agentMap.has(aid)) {
        agentMap.set(aid, {
          id: aid,
          name: nm.replace(/^[^\w#]+/, "").slice(0, 26),
          fullName: nm,
          category: g.category || "Specialist",
          color: getCategoryColorHex(g.category),
          groups: [],
          models: new Set(),
          mcps: new Set(g.mcp_servers || []),
          status: g.status || "READY",
        });
      }
      const entry = agentMap.get(aid);
      entry.groups.push(g.group_index);
      entry.models.add(g.model_label || topo.base_model_label);
      if (g.status === "STREAMING" || g.status === "DONE") entry.status = g.status;
    });

    const mKey = g.model_label || topo.base_model_label || "Swarm Model";
    if (!modelMap.has(mKey)) {
      modelMap.set(mKey, {
        id: `model_${modelMap.size + 1}`,
        label: mKey.slice(0, 26),
        fullLabel: mKey,
        groups: [],
        agents: new Set(),
        workers: 0,
      });
    }
    const mEntry = modelMap.get(mKey);
    mEntry.groups.push(g.group_index);
    names.forEach((n) => mEntry.agents.add(n));
    mEntry.workers += g.worker_count || 1;
  });

  // Add MCP Cluster Node so data-flow clearly shows Agent <-> MCP Server <-> Model
  if (mcpCount > 0) {
    modelMap.set("__mcp_hub__", {
      id: "mcp_hub_node",
      label: `🔌 ${mcpCount} MCP Servers Hub`,
      fullLabel: `Active MCP Server Hub (${(topo.mcp_servers || []).slice(0, 8).join(", ")}${mcpCount > 8 ? "…" : ""})`,
      groups: groups.map((g) => g.group_index),
      agents: new Set([...agentMap.values()].map((a) => a.fullName)),
      workers: totalWorkers,
      isMcpHub: true,
    });
  }

  const uniqueAgents = [...agentMap.values()];
  const uniqueModels = [...modelMap.values()];
  const totalEdges = groups.length + uniqueAgents.reduce((s, a) => s + a.groups.length + a.models.size, 0) + uniqueModels.length;

  if (badgeEl) {
    const phaseLabel =
      topo.phase === "LIVE_STREAMING"
        ? "⚡ LIVE STREAMING"
        : topo.phase === "COMPLETED"
        ? "✅ COMPLETED"
        : burstMode
        ? "⚡ DATA PULSE"
        : "🟢 LIVE SYNC";
    badgeEl.textContent = `${phaseLabel} · ${totalGroups} Groups · ${uniqueAgents.length} Specialist Agents · ${uniqueModels.length} Model/MCP Nodes · ${totalEdges} Data Links`;
  }

  const W = 920;
  const H = 315;
  const maxVisibleGroups = Math.min(10, groups.length);
  const visibleGroups = groups.slice(0, maxVisibleGroups);
  const maxVisibleAgents = Math.min(10, uniqueAgents.length);
  const visibleAgents = uniqueAgents.slice(0, maxVisibleAgents);
  const maxVisibleModels = Math.min(7, uniqueModels.length);
  const visibleModels = uniqueModels.slice(0, maxVisibleModels);

  const speedDur = topo.phase === "LIVE_STREAMING" || burstMode ? "1.15s" : "2.4s";
  const isRadial = topo.layout === "radial";

  const nodesMeta = new Map();
  let pathsSvg = "";
  let packetsSvg = "";
  let nodesSvg = "";
  let edgeCounter = 0;

  function addCurveAndPacket(x1, y1, x2, y2, color, activeFast) {
    edgeCounter++;
    const pathId = `sw_edge_${edgeCounter}_${Math.floor(Math.random() * 9999)}`;
    const cx1 = x1 + (x2 - x1) * 0.45;
    const cx2 = x1 + (x2 - x1) * 0.55;
    const d = isRadial
      ? `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${((x1 + x2) / 2 + 12).toFixed(1)} ${((y1 + y2) / 2 - 12).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
      : `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${cx1.toFixed(1)} ${y1.toFixed(1)}, ${cx2.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    const op = activeFast ? "0.62" : "0.36";
    pathsSvg += `<path id="${pathId}" d="${d}" fill="none" stroke="${color}" stroke-width="${activeFast ? "1.8" : "1.25"}" stroke-opacity="${op}" stroke-dasharray="${activeFast ? "5 4" : "none"}"/>`;
    if (edgeCounter <= 42) {
      const dur = activeFast ? "1.05s" : speedDur;
      const beginOffset = ((edgeCounter * 0.19) % 1.8).toFixed(2) + "s";
      packetsSvg += `
        <circle r="${activeFast ? "3.3" : "2.5"}" fill="${color}" opacity="0.95">
          <animateMotion dur="${dur}" begin="${beginOffset}" repeatCount="indefinite" path="${d}"/>
        </circle>
      `;
    }
  }

  if (!isRadial) {
    // 5-Tier Left-to-Right Data-Flow DAG
    const orchPos = { x: 68, y: H / 2 };
    const queenPos = { x: 852, y: H / 2 };

    const queenEnabled = Boolean(topo.use_queen_boss);
    nodesMeta.set("node_orch", {
      title: `🎯 Swarm Orchestrator & Code Delegator (${totalWorkers} Workers · ${totalGroups} Groups)`,
      detail: `Delegates ${totalGroups} distinct code pieces across ${totalGroups} groups and routes each group through its 3-Agent sequential pipeline (Agent #1 → Agent #2 → Agent #3).`,
    });
    nodesMeta.set("node_queen", {
      title: queenEnabled
        ? `👑 Queen Boss Synthesizer (${topo.queen_label})`
        : `🧩 Direct Multi-Group Code Assembly (Queen Boss OFF)`,
      detail: queenEnabled
        ? `Receives verified Stage-3 deliverables from all ${totalGroups} groups to produce a single Queen Boss synthesis.`
        : `Queen Boss is OFF: All ${totalGroups} groups output their Stage 1 (After Agent #1), Stage 2 (After Agent #2), and Stage 3 (Final After Agent #3) responses directly with zero single-boss restrictions.`,
    });

    const grpPositions = visibleGroups.map((g, i) => {
      const y = 38 + ((H - 76) * (i + 0.5)) / Math.max(1, visibleGroups.length);
      const nid = `node_grp_${g.group_index}`;
      nodesMeta.set(nid, {
        title: `🐝 Group #${g.group_index} (${g.worker_count} Workers · ${g.threads} Threads)`,
        detail: `3-Agent Pipeline: ${(g.agent_names || []).slice(0, 3).join(" → ")} | Model: ${g.model_label} | Status: ${g.status}${g.elapsed_ms ? ` (${g.elapsed_ms}ms)` : ""}`,
      });
      return { g, x: 235, y, nid };
    });

    const agPositions = visibleAgents.map((a, i) => {
      const y = 36 + ((H - 72) * (i + 0.5)) / Math.max(1, visibleAgents.length);
      const nid = `node_ag_${i}`;
      nodesMeta.set(nid, {
        title: `🤖 Specialist Agent: ${a.fullName}`,
        detail: `Category: ${a.category} | Assigned to Group(s): #${a.groups.join(", #")} | Connected Models: ${[...a.models].join(", ")} | MCP Servers: ${a.mcps.size}`,
      });
      return { a, x: 455, y, nid };
    });

    const modPositions = visibleModels.map((m, i) => {
      const y = 42 + ((H - 84) * (i + 0.5)) / Math.max(1, visibleModels.length);
      const nid = `node_mod_${i}`;
      nodesMeta.set(nid, {
        title: m.isMcpHub ? m.label : `🧠 Swarm Model: ${m.fullLabel}`,
        detail: `Serving ${m.workers} Workers across Group(s) #${m.groups.slice(0, 12).join(", #")} | Connected Specialist Agents: ${m.agents.size}`,
      });
      return { m, x: 675, y, nid };
    });

    // Edges: Orchestrator -> Groups
    grpPositions.forEach((gp) => {
      addCurveAndPacket(orchPos.x + 36, orchPos.y, gp.x - 42, gp.y, "#38bdf8", topo.phase === "LIVE_STREAMING" || burstMode);
    });

    // Edges: Groups -> Specialist Agents
    grpPositions.forEach((gp) => {
      const gAgentIds = new Set(gp.g.agent_ids || []);
      let linked = 0;
      agPositions.forEach((ap) => {
        if (gAgentIds.has(ap.a.id) || ap.a.groups.includes(gp.g.group_index)) {
          linked++;
          addCurveAndPacket(gp.x + 42, gp.y, ap.x - 56, ap.y, ap.a.color, gp.g.status === "STREAMING" || burstMode);
        }
      });
      if (!linked && agPositions.length) {
        const fallbackAp = agPositions[gp.g.group_index % agPositions.length];
        addCurveAndPacket(gp.x + 42, gp.y, fallbackAp.x - 56, fallbackAp.y, fallbackAp.a.color, burstMode);
      }
    });

    // Edges: Specialist Agents -> Swarm Models & MCP Hub
    agPositions.forEach((ap) => {
      modPositions.forEach((mp) => {
        if (mp.m.isMcpHub || ap.a.models.has(mp.m.fullLabel)) {
          addCurveAndPacket(ap.x + 56, ap.y, mp.x - 54, mp.y, mp.m.isMcpHub ? "#22d3ee" : "#a855f7", burstMode || topo.phase === "LIVE_STREAMING");
        }
      });
    });

    // Edges: Swarm Models & MCP Hub -> Final Stage (Direct Code Assembly or Queen Boss)
    modPositions.forEach((mp) => {
      addCurveAndPacket(
        mp.x + 54,
        mp.y,
        queenPos.x - 44,
        queenPos.y,
        queenEnabled ? "#fbbf24" : "#10b981",
        topo.phase === "COMPLETED" || burstMode
      );
    });

    // Column Headers
    nodesSvg += `
      <text x="68" y="18" fill="#7dd3fc" font-size="10" font-weight="700" text-anchor="middle">1. CODE DELEGATOR</text>
      <text x="235" y="18" fill="#6ee7b7" font-size="10" font-weight="700" text-anchor="middle">2. WORKER GROUPS (${totalGroups})</text>
      <text x="455" y="18" fill="#f472b6" font-size="10" font-weight="700" text-anchor="middle">3. 3-AGENT PIPELINE (${uniqueAgents.length})</text>
      <text x="675" y="18" fill="#c084fc" font-size="10" font-weight="700" text-anchor="middle">4. SWARM MODELS &amp; MCP (${uniqueModels.length})</text>
      <text x="852" y="18" fill="${queenEnabled ? "#fbbf24" : "#10b981"}" font-size="10" font-weight="700" text-anchor="middle">${queenEnabled ? "5. QUEEN BOSS (ON)" : "5. DIRECT OUTPUT (NO BOSS)"}</text>
    `;

    // Render Orchestrator Node
    nodesSvg += `
      <g class="sw-net-node" data-nid="node_orch" style="cursor:pointer">
        <rect x="${orchPos.x - 46}" y="${orchPos.y - 26}" width="92" height="52" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="${orchPos.x}" y="${orchPos.y - 6}" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">🎯 Code Split</text>
        <text x="${orchPos.x}" y="${orchPos.y + 9}" fill="#7dd3fc" font-size="9.5" text-anchor="middle">${totalWorkers} Workers</text>
        <text x="${orchPos.x}" y="${orchPos.y + 21}" fill="#94a3b8" font-size="8.5" text-anchor="middle">${totalGroups} Modules</text>
      </g>
    `;

    // Render Group Nodes
    grpPositions.forEach(({ g, x, y, nid }) => {
      const stColor = g.status === "DONE" ? "#10b981" : g.status === "STREAMING" ? "#38bdf8" : "#64748b";
      const multiCount = Math.max(3, (g.agent_ids || []).length);
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 46}" y="${y - 12}" width="92" height="24" rx="6" fill="#0b1528" stroke="${stColor}" stroke-width="1.5"/>
          <text x="${x}" y="${y - 1}" fill="#e2e8f0" font-size="9.5" font-weight="700" text-anchor="middle">🐝 Grp #${g.group_index} (${g.worker_count}w)</text>
          <text x="${x}" y="${y + 9}" fill="#6ee7b7" font-size="8" text-anchor="middle">${multiCount} Agents (1→2→3)</text>
        </g>
      `;
    });

    if (groups.length > maxVisibleGroups) {
      nodesSvg += `<text x="235" y="${H - 6}" fill="#94a3b8" font-size="9.5" text-anchor="middle">+ ${groups.length - maxVisibleGroups} more active groups streaming…</text>`;
    }

    // Render Specialist Agent Nodes
    agPositions.forEach(({ a, x, y, nid }) => {
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 62}" y="${y - 12}" width="124" height="24" rx="6" fill="#111827" stroke="${a.color}" stroke-width="1.6"/>
          <text x="${x}" y="${y - 1}" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">${esc(a.name.slice(0, 21))}</text>
          <text x="${x}" y="${y + 9}" fill="${a.color}" font-size="7.8" text-anchor="middle">Grp #${a.groups.slice(0, 4).join(",#")}${a.groups.length > 4 ? "…" : ""} · ${a.mcps.size} MCP</text>
        </g>
      `;
    });

    // Render Swarm Model & MCP Hub Nodes
    modPositions.forEach(({ m, x, y, nid }) => {
      const stroke = m.isMcpHub ? "#22d3ee" : "#a855f7";
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 58}" y="${y - 13}" width="116" height="26" rx="7" fill="#13162b" stroke="${stroke}" stroke-width="1.6"/>
          <text x="${x}" y="${y - 1}" fill="#f3e8ff" font-size="9" font-weight="700" text-anchor="middle">${esc(m.label.slice(0, 20))}</text>
          <text x="${x}" y="${y + 9}" fill="#c084fc" font-size="8" text-anchor="middle">${m.workers} Workers · ${m.agents.size} Agents</text>
        </g>
      `;
    });

    // Render Final Node (Direct Multi-Group Code Assembly when Queen Boss is OFF, or Queen Boss when ON)
    nodesSvg += `
      <g class="sw-net-node" data-nid="node_queen" style="cursor:pointer">
        <rect x="${queenPos.x - 50}" y="${queenPos.y - 28}" width="100" height="56" rx="10" fill="${queenEnabled ? "#17132a" : "#071f18"}" stroke="${queenEnabled ? "#fbbf24" : "#10b981"}" stroke-width="2"/>
        <text x="${queenPos.x}" y="${queenPos.y - 8}" fill="${queenEnabled ? "#fde68a" : "#6ee7b7"}" font-size="9.5" font-weight="700" text-anchor="middle">${queenEnabled ? "👑 Queen Boss" : "🧩 Direct Output"}</text>
        <text x="${queenPos.x}" y="${queenPos.y + 6}" fill="#f8fafc" font-size="8.2" text-anchor="middle">${queenEnabled ? esc(topo.queen_label.slice(0, 15)) : "🚫 Queen Boss OFF"}</text>
        <text x="${queenPos.x}" y="${queenPos.y + 19}" fill="#6ee7b7" font-size="8" text-anchor="middle">${queenEnabled ? (topo.phase === "COMPLETED" ? "✅ Synthesized" : "⚡ Live Merge") : "All 3 Agents/Grp"}</text>
      </g>
    `;
  } else {
    // Radial Constellation Hub Layout
    const queenEnabled = Boolean(topo.use_queen_boss);
    const cx = W / 2;
    const cy = H / 2 + 4;
    nodesMeta.set("node_queen", {
      title: queenEnabled
        ? `👑 Queen Boss & Swarm Core (${topo.queen_label})`
        : `🧩 Direct Multi-Group 3-Agent Core (Queen Boss OFF)`,
      detail: `Central nexus coordinating ${totalWorkers} parallel workers, ${uniqueAgents.length} Specialist Agents, and ${mcpCount} MCP Servers.`,
    });

    const modPositions = visibleModels.map((m, i) => {
      const ang = (2 * Math.PI * i) / Math.max(1, visibleModels.length) - Math.PI / 2;
      const x = cx + Math.cos(ang) * 95;
      const y = cy + Math.sin(ang) * 72;
      const nid = `node_mod_${i}`;
      nodesMeta.set(nid, {
        title: m.isMcpHub ? m.label : `🧠 Swarm Model: ${m.fullLabel}`,
        detail: `Serving ${m.workers} Workers | Connected Specialist Agents: ${m.agents.size}`,
      });
      addCurveAndPacket(x, y, cx, cy, m.isMcpHub ? "#22d3ee" : "#a855f7", true);
      return { m, x, y, nid };
    });

    const agPositions = visibleAgents.map((a, i) => {
      const ang = (2 * Math.PI * i) / Math.max(1, visibleAgents.length) - Math.PI / 2;
      const x = cx + Math.cos(ang) * 215;
      const y = cy + Math.sin(ang) * 112;
      const nid = `node_ag_${i}`;
      nodesMeta.set(nid, {
        title: `🤖 Specialist Agent: ${a.fullName}`,
        detail: `Category: ${a.category} | Groups: #${a.groups.join(", #")} | Models: ${[...a.models].join(", ")}`,
      });
      const targetMod = modPositions[i % Math.max(1, modPositions.length)];
      if (targetMod) addCurveAndPacket(x, y, targetMod.x, targetMod.y, a.color, true);
      return { a, x, y, nid };
    });

    visibleGroups.forEach((g, i) => {
      const ang = (2 * Math.PI * i) / Math.max(1, visibleGroups.length) - Math.PI / 2;
      const x = cx + Math.cos(ang) * 365;
      const y = cy + Math.sin(ang) * 134;
      const nid = `node_grp_${g.group_index}`;
      nodesMeta.set(nid, {
        title: `🐝 Group #${g.group_index} (${g.worker_count} Workers · ${g.threads} Threads)`,
        detail: `Agents: ${(g.agent_names || []).join(" → ")} | Model: ${g.model_label}`,
      });
      const targetAg = agPositions[i % Math.max(1, agPositions.length)];
      if (targetAg) addCurveAndPacket(x, y, targetAg.x, targetAg.y, "#38bdf8", burstMode);
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 42}" y="${y - 10}" width="84" height="20" rx="5" fill="#0b1528" stroke="#38bdf8" stroke-width="1.4"/>
          <text x="${x}" y="${y + 3}" fill="#e2e8f0" font-size="8.5" font-weight="700" text-anchor="middle">🐝 G#${g.group_index} (${g.worker_count}w)</text>
        </g>
      `;
    });

    agPositions.forEach(({ a, x, y, nid }) => {
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 52}" y="${y - 10}" width="104" height="20" rx="5" fill="#111827" stroke="${a.color}" stroke-width="1.5"/>
          <text x="${x}" y="${y + 3}" fill="#f8fafc" font-size="8.5" font-weight="700" text-anchor="middle">${esc(a.name.slice(0, 17))}</text>
        </g>
      `;
    });

    modPositions.forEach(({ m, x, y, nid }) => {
      nodesSvg += `
        <g class="sw-net-node" data-nid="${nid}" style="cursor:pointer">
          <rect x="${x - 48}" y="${y - 10}" width="96" height="20" rx="5" fill="#13162b" stroke="#c084fc" stroke-width="1.5"/>
          <text x="${x}" y="${y + 3}" fill="#f3e8ff" font-size="8.5" font-weight="700" text-anchor="middle">${esc(m.label.slice(0, 15))}</text>
        </g>
      `;
    });

    nodesSvg += `
      <g class="sw-net-node" data-nid="node_queen" style="cursor:pointer">
        <circle cx="${cx}" cy="${cy}" r="34" fill="${queenEnabled ? "#17132a" : "#071f18"}" stroke="${queenEnabled ? "#fbbf24" : "#10b981"}" stroke-width="2.2"/>
        <text x="${cx}" y="${cy - 4}" fill="${queenEnabled ? "#fde68a" : "#6ee7b7"}" font-size="8.8" font-weight="700" text-anchor="middle">${queenEnabled ? "👑 QUEEN CORE" : "🧩 DIRECT CODE"}</text>
        <text x="${cx}" y="${cy + 9}" fill="#6ee7b7" font-size="8" text-anchor="middle">${totalWorkers}w · ${totalGroups}g</text>
      </g>
    `;
  }

  stageEl.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="100%" height="305" style="display:block;user-select:none">
      <defs>
        <radialGradient id="swNetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#090d1a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#swNetGlow)"/>
      <g>${pathsSvg}</g>
      <g>${packetsSvg}</g>
      <g>${nodesSvg}</g>
    </svg>
  `;

  stageEl.querySelectorAll(".sw-net-node").forEach((nodeEl) => {
    nodeEl.addEventListener("click", () => {
      const nid = nodeEl.getAttribute("data-nid");
      const info = nodesMeta.get(nid);
      if (info && inspectorEl) {
        inspectorEl.innerHTML = `
          <div><strong style="color:#38bdf8">${esc(info.title)}</strong> — <span style="color:#e2e8f0">${esc(info.detail)}</span></div>
          <span class="badge" style="background:rgba(16,185,129,.16);color:#6ee7b7;font-size:10px">✔ Active Route</span>
        `;
      }
    });
  });
}

// ── Shared Renderer for Per-Group 3-Agent Sequential Progression (After Agent #1 -> After Agent #2 -> After Agent #3) + Upfront Code Delegation + Queen Boss ON/OFF ──
function renderSwarmThreeAgentProgressionUI(res, cfg, goal, containerEl, onQueenToggleChange = null) {
  if (!containerEl || !res) return;
  const groupList = res.cluster_groups || res.shard_reports || [];
  const delegationList =
    Array.isArray(res.delegation_manifest) && res.delegation_manifest.length
      ? res.delegation_manifest
      : groupList.map((g, i) => ({
          group_index: g.group_index || i + 1,
          worker_range: g.worker_range || g.shard_range || `#${i + 1}`,
          worker_count: g.worker_count || 1,
          model_label: g.model_used || cfg?.model_label || "Swarm Model",
          file_name: g.delegated_module?.file_name || `0${i + 1}_group_${i + 1}_module.py`,
          piece_title: g.delegated_module?.piece_title || `Piece #${i + 1}: Group #${i + 1} Delegated Code Module`,
          delegated_responsibility:
            g.delegated_module?.delegated_responsibility || "Dedicated code module assigned upfront to this worker group.",
          exported_symbols: g.delegated_module?.exported_symbols || [`run_group_${i + 1}_module()`],
          three_agents: g.three_agents || [],
        }));

  let queenActive = Boolean(res.use_queen_boss);

  const manifestCardsHtml = delegationList
    .map((dm) => {
      const triadNames = Array.isArray(dm.three_agents) && dm.three_agents.length
        ? dm.three_agents.map((a, idx) => `<span class="badge" style="font-size:9.5px;background:rgba(56,189,248,.14);color:#7dd3fc;border:1px solid rgba(56,189,248,.35)">#${idx + 1} ${esc(a.name)}</span>`).join(" <span style='color:#6ee7b7'>→</span> ")
        : `<span class="muted">Agent #1 → Agent #2 → Agent #3</span>`;
      return `
        <div style="padding:8px 10px;border-radius:8px;background:rgba(9,15,30,.92);border:1px solid rgba(56,189,248,.35)">
          <div class="row" style="justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px">
            <strong style="font-size:11.5px;color:#6ee7b7">🐝 Group #${dm.group_index} (Workers ${esc(dm.worker_range)})</strong>
            <code style="font-size:10.5px;color:#38bdf8;background:rgba(56,189,248,.12);padding:1px 6px;border-radius:4px">🧩 ${esc(dm.file_name)}</code>
          </div>
          <div style="font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:3px">${esc(dm.piece_title)}</div>
          <div class="muted" style="font-size:10.5px;margin-bottom:5px">${esc(dm.delegated_responsibility)}</div>
          <div style="font-size:10px;color:#cbd5e1;margin-bottom:4px"><strong>Exports:</strong> <code>${esc((dm.exported_symbols || []).join(", "))}</code></div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">${triadNames}</div>
        </div>
      `;
    })
    .join("");

  const groupsProgressionHtml = groupList
    .map((grp, idx) => {
      const gNum = grp.group_index || idx + 1;
      const mod = grp.delegated_module || delegationList[idx] || {};
      const passes = Array.isArray(grp.agent_passes) && grp.agent_passes.length === 3
        ? grp.agent_passes
        : [
            {
              pass_number: 1,
              slot_label: "After Agent #1 — Before Agent #2",
              stage_title: "Response After Agent #1 (Before Agent #2 Changes It)",
              agent_name: grp.three_agents?.[0]?.name || "Agent #1",
              agent_category: grp.three_agents?.[0]?.category || "Stage 1 Architect",
              elapsed_ms: 140,
              output: grp.after_agent_1 || grp.findings || "",
            },
            {
              pass_number: 2,
              slot_label: "After Agent #2 — Before Agent #3",
              stage_title: "Response After Agent #2 (After Modifying Agent #1 · Before Agent #3 Changes It)",
              agent_name: grp.three_agents?.[1]?.name || "Agent #2",
              agent_category: grp.three_agents?.[1]?.category || "Stage 2 Hardener",
              elapsed_ms: 155,
              output: grp.after_agent_2 || grp.findings || "",
            },
            {
              pass_number: 3,
              slot_label: "After Agent #3 — Final Group Output",
              stage_title: "Response After Agent #3 (Final Group Output After All 3 Agents)",
              agent_name: grp.three_agents?.[2]?.name || "Agent #3",
              agent_category: grp.three_agents?.[2]?.category || "Stage 3 Finisher",
              elapsed_ms: 165,
              output: grp.after_agent_3 || grp.findings || "",
            },
          ];

      const stageStyles = [
        {
          border: "rgba(56,189,248,.55)",
          bg: "rgba(8,18,38,.92)",
          headerBg: "rgba(56,189,248,.15)",
          badgeColor: "#38bdf8",
          icon: "1️⃣ 🧩",
          banner: "OUTPUT AFTER AGENT #1 (What Group Put Out BEFORE Changing Response With Agent #2)",
        },
        {
          border: "rgba(192,132,252,.55)",
          bg: "rgba(19,14,38,.92)",
          headerBg: "rgba(192,132,252,.15)",
          badgeColor: "#c084fc",
          icon: "2️⃣ ⚡",
          banner: "OUTPUT AFTER AGENT #2 (What Group Put Out After Modifying Agent #1 — BEFORE Agent #3)",
        },
        {
          border: "rgba(46,230,166,.6)",
          bg: "rgba(7,24,22,.92)",
          headerBg: "rgba(46,230,166,.16)",
          badgeColor: "#2ee6a6",
          icon: "3️⃣ 🏁",
          banner: "FINAL GROUP OUTPUT AFTER AGENT #3 (Completed Group Code Piece After All 3 Agents)",
        },
      ];

      const stagesHtml = passes
        .map((p, pIdx) => {
          const st = stageStyles[pIdx] || stageStyles[2];
          return `
            <div class="sw-group-agent-stage-box" data-agent-stage="${p.pass_number}" style="border:1px solid ${st.border};background:${st.bg};border-radius:8px;overflow:hidden;margin-bottom:8px">
              <div style="padding:7px 10px;background:${st.headerBg};border-bottom:1px solid ${st.border};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
                <div>
                  <strong style="font-size:12px;color:${st.badgeColor}">${st.icon} Group #${gNum} · Stage ${p.pass_number}/3: ${esc(p.agent_name)}</strong>
                  <div style="font-size:10.5px;color:#e2e8f0;font-weight:600">${esc(st.banner)}</div>
                </div>
                <div class="row" style="gap:6px;align-items:center">
                  <span class="badge" style="font-size:9.5px;background:rgba(15,23,42,.85);color:${st.badgeColor};border:1px solid ${st.border}">${esc(p.agent_category || `Agent #${p.pass_number}`)}</span>
                  <span class="muted" style="font-size:10px">${p.elapsed_ms || 140}ms</span>
                </div>
              </div>
              <div class="md-rendered" style="padding:10px 12px;font-size:12.5px;max-height:420px;overflow-y:auto">${renderMarkdown(p.output || "")}</div>
            </div>
          `;
        })
        .join(
          `<div class="sw-stage-arrow-divider" style="text-align:center;color:#6ee7b7;font-size:11px;font-weight:700;margin:2px 0 6px">⬇️ Passed to Next Specialist Agent in Group #${gNum} ⬇️</div>`
        );

      return `
        <details class="sw-group-3agent-card" data-group-idx="${gNum}" open style="margin-bottom:12px;padding:10px 12px;background:rgba(10,16,32,.95);border:1px solid rgba(124,92,255,.45);border-radius:10px">
          <summary style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-weight:700;color:#e2e8f0">
            <div>
              <span style="color:var(--ok);font-size:13.5px">🐝 Group #${gNum} (Workers ${esc(grp.worker_range || grp.shard_range || `#${gNum}`)})</span>
              <span style="margin-left:8px;font-size:12px;color:#38bdf8">🧩 Delegated Code Piece: <code>${esc(mod.file_name || `0${gNum}_module.py`)}</code> — ${esc(mod.piece_title || "")}</span>
            </div>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              <span class="right-badge" style="font-size:10px;background:rgba(46,230,166,.14);color:#6ee7b7">3 Agents: ${passes.map((p) => `#${p.pass_number} ${esc(p.agent_name.replace(/^[^\w#]+/, "").slice(0, 18))}`).join(" → ")}</span>
              <span class="right-badge" style="font-size:10px">Model: ${esc(grp.model_used || cfg?.model_label || "Swarm")}</span>
            </div>
          </summary>
          <div style="margin-top:10px">
            ${stagesHtml}
          </div>
        </details>
      `;
    })
    .join("");

  const directCombinedMd = res.direct_all_groups_output || res.queen_synthesis || "";
  const bossName =
    typeof res.queen_boss_used === "object"
      ? res.queen_boss_used?.name || cfg?.queen_boss_model || "Queen Boss"
      : res.queen_boss_used || cfg?.queen_boss_model || "Queen Boss";

  containerEl.innerHTML = `
    <div class="sw-3agent-master-wrap">
      <!-- Top Control Bar: Queen Boss ON/OFF Switch + Stage Filter Buttons -->
      <div style="padding:10px 12px;background:rgba(12,22,44,.95);border:1px solid rgba(46,230,166,.45);border-radius:10px;margin-bottom:12px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <strong style="font-size:13px;color:var(--ok)">🔬 Per-Group 3-Agent Sequential Output Inspector &amp; Code Delegation Viewer</strong>
            <div class="muted" style="font-size:11px">Inspect what each group put out <strong>After Agent #1</strong> (before Agent #2), <strong>After Agent #2</strong> (before Agent #3), and <strong>After Agent #3</strong> (final group code piece across all ${groupList.length} groups).</div>
          </div>
          <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
            <label class="toggle" style="padding:5px 10px;border-radius:6px;background:${queenActive ? "rgba(251,191,36,.16)" : "rgba(16,185,129,.16)"};border:1px solid ${queenActive ? "rgba(251,191,36,.5)" : "rgba(16,185,129,.5)"};color:${queenActive ? "#fde68a" : "#6ee7b7"};font-weight:700;font-size:11.5px;cursor:pointer">
              <input type="checkbox" class="sw-live-queen-boss-toggle" ${queenActive ? "checked" : ""}>
              <span class="sw-live-queen-boss-label">${queenActive ? "👑 Queen Boss: ON" : "🚫 Queen Boss: OFF (No Single-Boss Restrictions)"}</span>
            </label>
          </div>
        </div>
        <div class="row" style="gap:6px;flex-wrap:wrap;align-items:center">
          <span class="muted" style="font-size:11px;font-weight:700">View Filter:</span>
          <button type="button" class="primary xs sw-stage-filter-btn" data-filter="all">🔬 All 3 Agent Stages (1 → 2 → 3)</button>
          <button type="button" class="ghost xs sw-stage-filter-btn" data-filter="1">1️⃣ Only Output After Agent #1 (Before Agent #2)</button>
          <button type="button" class="ghost xs sw-stage-filter-btn" data-filter="2">2️⃣ Only Output After Agent #2 (Before Agent #3)</button>
          <button type="button" class="ghost xs sw-stage-filter-btn" data-filter="3">3️⃣ Only Final Output After Agent #3 (All Groups)</button>
          <button type="button" class="ghost xs sw-stage-filter-btn" data-filter="combined">📦 Combined Code From All ${groupList.length} Groups</button>
        </div>
      </div>

      <!-- Upfront Code & Module Delegation Manifest -->
      <div class="sw-delegation-manifest-section" style="padding:10px 12px;background:rgba(8,14,28,.94);border:1px solid rgba(56,189,248,.4);border-radius:10px;margin-bottom:12px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          <strong style="font-size:12.5px;color:#38bdf8">📋 Upfront Code &amp; Module Delegation Across All ${groupList.length} Groups (Assigned Before Execution)</strong>
          <span class="right-badge" style="font-size:10px">${groupList.length} Dedicated Code Modules · 3 Agents Per Group</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:8px">
          ${manifestCardsHtml}
        </div>
      </div>

      <!-- Per-Group 3-Agent Sequential Outputs (Stage 1 -> Stage 2 -> Stage 3) -->
      <div class="sw-all-groups-stages-section">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
          <strong style="font-size:13px;color:#c4b5fd">🐝 Output After Each Agent Across All ${groupList.length} Worker Groups (Agent #1 → Agent #2 → Agent #3)</strong>
          <div class="row" style="gap:6px">
            <button type="button" class="ghost xs sw-expand-all-groups-btn">➕ Expand All Groups</button>
            <button type="button" class="ghost xs sw-collapse-all-groups-btn">➖ Collapse All Groups</button>
          </div>
        </div>
        ${groupsProgressionHtml}
      </div>

      <!-- Direct Combined Output From All Groups (After All 3 Agents — No Queen Boss Needed) -->
      <div class="sw-direct-combined-section" style="padding:12px;background:rgba(7,20,22,.94);border:1px solid rgba(46,230,166,.5);border-radius:10px;margin-top:12px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <strong style="font-size:13.5px;color:var(--ok)">📦 All ${groupList.length} Groups Combined Output &amp; Assembled Code (After All 3 Agents · Queen Boss Bypassed)</strong>
            <div class="muted" style="font-size:11px">Direct assembly of each group's delegated code piece after completing Agent #1 → Agent #2 → Agent #3 with zero single-model censorship.</div>
          </div>
          <span class="right-badge" style="background:rgba(46,230,166,.16);color:#6ee7b7;border:1px solid rgba(46,230,166,.4)">🚫 NO QUEEN BOSS BOTTLENECK</span>
        </div>
        <div class="md-rendered" style="font-size:12.5px">${renderMarkdown(directCombinedMd)}</div>
      </div>

      <!-- Optional Queen Boss Section (Only shown when Queen Boss is toggled ON) -->
      <div class="sw-queen-boss-optional-section ${queenActive ? "" : "hidden"}" style="padding:12px;background:rgba(23,19,42,.94);border:1px solid rgba(251,191,36,.5);border-radius:10px;margin-top:12px">
        <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <strong style="font-size:13.5px;color:#fde68a">👑 Queen Boss Final Synthesis (${esc(bossName)})</strong>
            <div class="muted" style="font-size:11px">Optional single-boss synthesis across all groups. Turn Queen Boss OFF above at any time if you only want direct multi-group outputs.</div>
          </div>
          <span class="right-badge" style="background:rgba(251,191,36,.16);color:#fde68a;border:1px solid rgba(251,191,36,.4)">👑 QUEEN BOSS ON</span>
        </div>
        <div class="sw-queen-boss-optional-body md-rendered" style="font-size:12.5px">${renderMarkdown(res.queen_synthesis || directCombinedMd)}</div>
      </div>

      ${
        res.live_probe_output
          ? `<div style="margin-top:12px;padding:10px 12px;background:#050811;border:1px solid rgba(46,230,166,.35);border-radius:8px">
              <strong style="color:var(--ok);font-size:11.5px">🔌 Live 20-MCP Server Hub &amp; Parallel Sandbox Telemetry:</strong>
              <pre style="margin:6px 0 0;font-family:Consolas,monospace;font-size:11px;white-space:pre-wrap;color:#d6e4ff">${esc(res.live_probe_output)}</pre>
            </div>`
          : ""
      }
    </div>
  `;

  // Wire stage filter buttons
  containerEl.querySelectorAll(".sw-stage-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      containerEl.querySelectorAll(".sw-stage-filter-btn").forEach((b) => {
        b.classList.remove("primary");
        b.classList.add("ghost");
      });
      btn.classList.remove("ghost");
      btn.classList.add("primary");

      const filter = btn.getAttribute("data-filter") || "all";
      const stagesSec = containerEl.querySelector(".sw-all-groups-stages-section");
      const combinedSec = containerEl.querySelector(".sw-direct-combined-section");

      if (filter === "combined") {
        if (stagesSec) stagesSec.style.display = "none";
        if (combinedSec) combinedSec.style.display = "block";
        return;
      }

      if (stagesSec) stagesSec.style.display = "block";
      if (combinedSec) combinedSec.style.display = "block";

      containerEl.querySelectorAll(".sw-group-agent-stage-box").forEach((box) => {
        const stNum = box.getAttribute("data-agent-stage");
        box.style.display = filter === "all" || filter === stNum ? "block" : "none";
      });
      containerEl.querySelectorAll(".sw-stage-arrow-divider").forEach((div) => {
        div.style.display = filter === "all" ? "block" : "none";
      });
    });
  });

  // Wire Expand/Collapse All Groups
  containerEl.querySelector(".sw-expand-all-groups-btn")?.addEventListener("click", () => {
    containerEl.querySelectorAll(".sw-group-3agent-card").forEach((d) => {
      d.open = true;
    });
  });
  containerEl.querySelector(".sw-collapse-all-groups-btn")?.addEventListener("click", () => {
    containerEl.querySelectorAll(".sw-group-3agent-card").forEach((d) => {
      d.open = false;
    });
  });

  // Wire Live Queen Boss ON/OFF Toggle right on the results view
  const queenToggleInput = containerEl.querySelector(".sw-live-queen-boss-toggle");
  const queenToggleLabel = containerEl.querySelector(".sw-live-queen-boss-label");
  const queenOptionalSec = containerEl.querySelector(".sw-queen-boss-optional-section");
  const queenOptionalBody = containerEl.querySelector(".sw-queen-boss-optional-body");

  queenToggleInput?.addEventListener("change", async () => {
    queenActive = Boolean(queenToggleInput.checked);
    res.use_queen_boss = queenActive;
    const lblWrap = queenToggleInput.closest("label");
    if (lblWrap) {
      lblWrap.style.background = queenActive ? "rgba(251,191,36,.16)" : "rgba(16,185,129,.16)";
      lblWrap.style.borderColor = queenActive ? "rgba(251,191,36,.5)" : "rgba(16,185,129,.5)";
      lblWrap.style.color = queenActive ? "#fde68a" : "#6ee7b7";
    }
    if (queenToggleLabel) {
      queenToggleLabel.textContent = queenActive
        ? "👑 Queen Boss: ON"
        : "🚫 Queen Boss: OFF (No Single-Boss Restrictions)";
    }
    if (queenOptionalSec) {
      queenOptionalSec.classList.toggle("hidden", !queenActive);
    }
    if (typeof onQueenToggleChange === "function") {
      onQueenToggleChange(queenActive);
    }
    // If user turned Queen Boss ON after running with it OFF, fetch Queen Boss synthesis on demand if not yet run
    if (queenActive && res.queen_boss_used?.status === "BYPASSED_BY_USER" && queenOptionalBody) {
      queenOptionalBody.innerHTML = `<div class="muted">⏳ Running optional Queen Boss synthesis across all ${groupList.length} groups' Stage-3 outputs…</div>`;
      try {
        const qRes = await postJSON("/api/swarm/mass-60", {
          goal,
          ...(cfg || {}),
          use_queen_boss: true,
        });
        if (qRes?.ok && qRes.queen_synthesis) {
          res.queen_synthesis = qRes.queen_synthesis;
          res.queen_boss_used = qRes.queen_boss_used;
          queenOptionalBody.innerHTML = renderMarkdown(qRes.queen_synthesis);
        }
      } catch (e) {
        queenOptionalBody.innerHTML = renderMarkdown(directCombinedMd);
      }
    }
  });
}

async function runInlineSwarmMultiAgent(goal, cfg) {
  const ans = $("#answers");
  if (!ans) return;
  $("#inline-swarm-multiagent-setup-card")?.remove();
  $("#ask-btn").disabled = true;
  $("#stop-btn").classList.remove("hidden");

  const mcpCount = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers.length : 20;
  const queenEnabled = Boolean(cfg.use_queen_boss);
  const body = mkCard(
    `🐝 Multi-Agent Parallel Swarm (${cfg.worker_count} Workers · ${cfg.group_count} Groups · 3 Agents/Group · Queen Boss: ${queenEnabled ? "ON" : "OFF"})`,
    `Base Model: ${cfg.model_label} · ${cfg.threads_per_group} Threads/Group · ${mcpCount} MCP Servers`,
    null,
    true
  );

  // Create persistent Live Visual Network Graph container above the markdown output inside the execution card
  const parentCard = body.closest(".card");
  const liveGraphWrap = document.createElement("div");
  liveGraphWrap.id = "live-swarm-exec-graph-wrap";
  liveGraphWrap.style.cssText = "margin:8px 0 12px;padding:10px 12px;background:rgba(6,11,24,.94);border:1px solid rgba(56,189,248,.45);border-radius:10px";
  liveGraphWrap.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">
      <div>
        <strong style="font-size:12.5px;color:#38bdf8">🕸️ Live Swarm Execution Network Graph (Code Delegator → Worker Groups → 3-Agent Pipeline → ${queenEnabled ? "Queen Boss" : "Direct Multi-Group Output"})</strong>
        <div id="live-swarm-exec-phase-text" class="muted" style="font-size:11px">⚡ Delegating ${cfg.group_count} code pieces &amp; running Agent #1 → Agent #2 → Agent #3 across ${cfg.worker_count} parallel workers…</div>
      </div>
      <span id="live-swarm-exec-badge" class="badge" style="background:rgba(56,189,248,.16);color:#7dd3fc;border:1px solid rgba(56,189,248,.4);font-size:10.5px">⚡ STREAMING</span>
    </div>
    <div id="live-swarm-exec-svg-stage" style="width:100%;min-height:295px;background:radial-gradient(circle at 50% 50%, rgba(16,28,60,.85), rgba(5,9,20,.98));border:1px solid rgba(124,92,255,.32);border-radius:8px;overflow:hidden"></div>
    <div id="live-swarm-exec-inspector" style="margin-top:6px;padding:5px 10px;background:rgba(12,20,42,.88);border:1px solid var(--line);border-radius:6px;font-size:11px;color:#cbd5e1">
      💡 Click any node above to inspect live group code delegation, 3-Agent pipeline stages, and Swarm Model routing.
    </div>
  `;
  if (parentCard) {
    parentCard.insertBefore(liveGraphWrap, body);
  }

  const liveStageEl = liveGraphWrap.querySelector("#live-swarm-exec-svg-stage");
  const liveBadgeEl = liveGraphWrap.querySelector("#live-swarm-exec-badge");
  const liveInspEl = liveGraphWrap.querySelector("#live-swarm-exec-inspector");
  const livePhaseTxt = liveGraphWrap.querySelector("#live-swarm-exec-phase-text");

  const execGroupsState = (cfg.groups_config || []).map((g, idx) => ({
    group_index: g.group_id || idx + 1,
    worker_count: g.worker_count || 10,
    threads: g.threads || cfg.threads_per_group || 8,
    agent_ids: g.agent_ids || [g.agent_id],
    agent_names: g.agent_names || [g.agent_name || g.role_name],
    category: g.category || "Specialist",
    mcp_servers: g.mcp_servers || cfg.mcp_servers || [],
    model_label: (g.model_label || cfg.model_label || "Swarm Model").replace(/^[🟢☁️🖥⚡📌🔥]\s*/, "").trim(),
    status: "STREAMING",
  }));

  let liveUseQueen = queenEnabled;
  function redrawLiveExecGraph(phaseName) {
    renderSwarmNetworkGraphIntoStage(
      liveStageEl,
      liveBadgeEl,
      liveInspEl,
      {
        phase: phaseName,
        layout: "dag",
        total_workers: cfg.worker_count,
        group_count: cfg.group_count,
        base_model_label: cfg.model_label,
        use_queen_boss: liveUseQueen,
        queen_label: liveUseQueen ? cfg.queen_boss_model || "Queen Boss" : "🚫 Queen Boss OFF",
        mcp_servers: cfg.mcp_servers || [],
        groups: execGroupsState,
      },
      phaseName === "LIVE_STREAMING"
    );
  }

  redrawLiveExecGraph("LIVE_STREAMING");

  let progressStep = 0;
  const progressTimer = setInterval(() => {
    progressStep++;
    const stageNum = ((progressStep - 1) % 3) + 1;
    execGroupsState.forEach((g, idx) => {
      if (idx < progressStep * 2) g.status = "DONE";
      else g.status = "STREAMING";
    });
    if (livePhaseTxt) {
      const doneCnt = execGroupsState.filter((g) => g.status === "DONE").length;
      livePhaseTxt.textContent = `⚡ Running Group Agent Stage #${stageNum}/3 across ${cfg.group_count} groups (${doneCnt}/${cfg.group_count} groups verified · Queen Boss: ${liveUseQueen ? "ON" : "OFF"})…`;
    }
    redrawLiveExecGraph("LIVE_STREAMING");
  }, 900);

  body.textContent = `⏳ Delegating ${cfg.group_count} distinct code modules and running 3 sequential Specialist Agents (Agent #1 → Agent #2 → Agent #3) per group across ${cfg.worker_count} workers (Queen Boss: ${queenEnabled ? "ON" : "OFF"})…`;
  status(`🐝 Running ${cfg.worker_count}-Worker Swarm (${cfg.group_count} groups × 3 Sequential Agents · Queen Boss ${queenEnabled ? "ON" : "OFF"})…`);

  try {
    const res = await postJSON("/api/swarm/mass-60", {
      goal,
      ...cfg,
    });
    clearInterval(progressTimer);
    if (res?.ok) {
      const groupList = res.cluster_groups || res.shard_reports || res.shard_clusters || [];
      execGroupsState.forEach((g, idx) => {
        g.status = "DONE";
        if (groupList[idx]) {
          g.elapsed_ms = groupList[idx].elapsed_ms || 420;
          g.findings = groupList[idx].findings;
        }
      });
      if (livePhaseTxt) {
        livePhaseTxt.textContent = `✅ All ${cfg.worker_count} workers & ${groupList.length} groups finished Agent #1 → Agent #2 → Agent #3! (${liveUseQueen ? "Queen Boss ON" : "Queen Boss OFF — Direct Multi-Group Output"})`;
      }
      redrawLiveExecGraph("COMPLETED");
      if (typeof loadAndRenderAgentTelemetryDashboard === "function") {
        loadAndRenderAgentTelemetryDashboard();
      }

      body.classList.remove("streaming");
      renderSwarmThreeAgentProgressionUI(res, cfg, goal, body, (newQueenState) => {
        liveUseQueen = newQueenState;
        redrawLiveExecGraph("COMPLETED");
      });
      if (res.explorer_run_id && typeof loadExplorerRunsFromServer === "function") {
        loadExplorerRunsFromServer(res.explorer_run_id);
        const jumpBar = document.createElement("div");
        jumpBar.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:10px;padding:8px 11px;border-radius:7px;background:#071326;border:1px solid rgba(46,230,166,0.4)";
        jumpBar.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#a7f3d0">✅ Wrote ${Object.keys(res.written_files || {}).length} non-clashing group module(s) to <code>${esc(res.workspace_dir || "workspace")}</code> &amp; archived per-group folders in Explorer!</span>`;
        const expBtn = document.createElement("button");
        expBtn.type = "button";
        expBtn.className = "primary xs";
        expBtn.textContent = "🗂️ Open in VS Code Explorer (Swap & Inspect)";
        expBtn.onclick = () => {
          document.querySelector('.rail-btn[data-view="file-explorer"]')?.click();
          loadExplorerRunsFromServer(res.explorer_run_id);
        };
        jumpBar.appendChild(expBtn);
        body.appendChild(jumpBar);
      }
      status(`✅ ${res.worker_count}-Worker Swarm complete! Non-clashing files written & archived to VS Code File Explorer.`);
    } else {
      setCardBodyMarkdown(body, `❌ ${res?.error || "Swarm failed"}`, false);
      status(`❌ Swarm failed: ${res?.error || "unknown error"}`);
    }
  } catch (err) {
    clearInterval(progressTimer);
    setCardBodyMarkdown(body, `❌ ${err.message || err}`, false);
    status(`❌ Swarm error: ${err.message || err}`);
  } finally {
    $("#stop-btn").classList.add("hidden");
    $("#ask-btn").disabled = false;
  }
}

async function runSwarmBuild(prompt, answers, idxs) {
  $("#answers").innerHTML = ""; answers = {};
  $("#response-bulk-actions").classList.add("hidden");
  $("#ask-btn").disabled = true; $("#stop-btn").classList.remove("hidden");
  const head = mkCard("🐝 Swarm build + Visual DAG", "planning…");
  head.textContent = "planning…";
  const headCard = head.closest(".card");
  const dagWrap = document.createElement("div");
  dagWrap.className = "swarm-dag-wrap hidden";
  headCard.insertBefore(dagWrap, head.nextSibling);

  function renderSwarmDag(nodes) {
    if (!Array.isArray(nodes) || !nodes.length) return;
    dagWrap.classList.remove("hidden");
    dagWrap.innerHTML = `
      <div class="swarm-dag-title">
        <span>🕸️ Live Swarm Execution DAG (Model Handoffs &amp; Self-Healing Loop)</span>
        <span class="muted">${nodes.filter((n) => n.status === "done").length}/${nodes.length} stages complete</span>
      </div>
      <div class="swarm-dag-nodes">
        ${nodes
          .map((n) => {
            const icon = n.status === "done" ? "🟢" : n.status === "running" ? "⚡" : n.status === "failed" ? "🔴" : "⚪";
            return `<div class="swarm-dag-node ${esc(n.status || "pending")}">
              <div class="swarm-dag-role"><span>${esc(n.role)}</span><span>${icon}</span></div>
              <div class="swarm-dag-model">${esc(n.model || "")}</div>
            </div>`;
          })
          .join("")}
      </div>
    `;
  }

  try {
    const r = await fetch("/api/swarm/build", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, answers, models: idxs }),
    });
    const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const p = line.slice(5).trim();
        if (p === "[DONE]") continue;
        let ev; try { ev = JSON.parse(p); } catch (_) { continue; }
        if (ev.stage === "dag") {
          renderSwarmDag(ev.nodes || []);
        } else if (ev.stage === "planned") {
          head.textContent = "📐 " + (ev.text || "") + " — " + (ev.files || []).join(", ");
          status("🐝 plan ready — writing files…");
        } else if (ev.stage === "writing" || ev.stage === "testing" || ev.stage === "verifying") {
          status("🐝 " + ev.text);
        } else if (ev.stage === "file" || ev.stage === "wrote") {
          const body = mkCard(ev.error ? `❌ ${ev.path}` : `📄 ${ev.path}`,
            ev.error ? "write failed" : `${ev.model} · ${ev.lines} lines`);
          if (ev.content) {
            body._rawText = "```" + (ev.path.split(".").pop() || "") + "\n" + ev.content + "\n```";
            setCardBodyMarkdown(body, body._rawText, false);
          } else {
            body.textContent = ev.error || (`(written to disk — ${ev.lines} lines)` + (ev.repaired ? " · 🔧 self-repaired" : ""));
          }
        } else if (ev.stage === "test" || ev.stage === "tested") {
          const healTag = ev.repaired ? `🔧 self-healed in ${ev.rounds || 1} round(s)` : (ev.ok ? "✅ passed (exit 0)" : "⚠️ check");
          const body = mkCard("🖥 Live Terminal & Self-Heal Smoke Test", healTag);
          const outTxt = ev.terminal_log || (ev.results || []).join("\n") || ev.text || "";
          setCardBodyMarkdown(body, "```bash\n" + outTxt + "\n```", false);
          openLiveTerminalWithOutput(
            `🐝 Swarm Build — ${healTag}`,
            outTxt,
            ev.cwd || "",
            ev.run_cmd || "",
            Boolean(ev.ok)
          );
        } else if (ev.stage === "error") {
          head.textContent = "❌ " + ev.text;
        } else if (ev.stage === "done") {
          const vb = mkCard(ev.ok ? "✅ Swarm verdict" : "⚠️ Swarm verdict", "");
          vb.textContent = ev.verdict || "";
          const sb = mkCard("🐝 Delivery", ev.workspace_dir || ev.dir || "");
          sb.textContent = ev.summary || "";
          const deliveryCard = sb.closest(".card");
          const openBtn = document.createElement("button");
          openBtn.className = "ghost sm";
          openBtn.textContent = "📂 Open swarm files in VS Code";
          openBtn.onclick = async () => {
            const res = await postJSON("/api/workspace/open", { path: ev.workspace_dir || ev.dir });
            status(res.ok ? `opening ${res.path} in VS Code` : (res.error || "could not open VS Code"));
          };
          deliveryCard.querySelector("h3").appendChild(openBtn);
          const councilCliBtn = document.createElement("button");
          councilCliBtn.className = "ghost sm";
          councilCliBtn.style.borderColor = "rgba(46,230,166,.55)";
          councilCliBtn.style.color = "var(--ok)";
          councilCliBtn.textContent = "🛡️ Open in Suomynona Council CLI";
          councilCliBtn.onclick = () => openAppInCouncilCli({
            title: ev.product || "Swarm App",
            dir: ev.workspace_dir || ev.dir || "",
            triggerBtn: councilCliBtn,
          });
          deliveryCard.querySelector("h3").appendChild(councilCliBtn);
          if (ev.html_preview) {
            const launchBtn = document.createElement("button");
            launchBtn.className = "primary sm";
            launchBtn.textContent = "🚀 Launch Built App Now";
            launchBtn.onclick = () => openHtmlPreview(ev.product || "Swarm App", "```html\n" + ev.html_preview + "\n```");
            deliveryCard.querySelector("h3").appendChild(launchBtn);
            openHtmlPreview(ev.product || "Swarm App", "```html\n" + ev.html_preview + "\n```");
          }
          if (ev.explorer_run_id && typeof loadExplorerRunsFromServer === "function") {
            loadExplorerRunsFromServer(ev.explorer_run_id);
            const expTreeBtn = document.createElement("button");
            expTreeBtn.className = "primary sm";
            expTreeBtn.textContent = "🗂️ Open in VS Code Explorer";
            expTreeBtn.onclick = () => {
              document.querySelector('.rail-btn[data-view="file-explorer"]')?.click();
              loadExplorerRunsFromServer(ev.explorer_run_id);
            };
            deliveryCard.querySelector("h3").appendChild(expTreeBtn);
          }
          reloadState();
          window._lastAnswers = { swarm: ev.summary || "" };
          status(ev.ok ? "🐝 build finished — compiled, self-healed & archived to VS Code File Explorer!" : "🐝 build finished — review the terminal output");
        }
      }
    }
  } catch (e) {
    head.textContent = "⚠️ swarm failed: " + e;
  }
  $("#stop-btn").classList.add("hidden"); $("#ask-btn").disabled = false;
}

async function runChiefJudgeEvaluation() {
  let texts = window._lastAnswers;
  if ((!texts || !Object.values(texts).some((t) => t && !t.startsWith("⚠️"))) && window._lastVerdict) {
    texts = { "Current Build / Verdict": window._lastVerdict };
    window._lastAnswers = texts;
  }
  if (!texts || !Object.values(texts).some((t) => t && !t.startsWith("⚠️"))) {
    status("⚠️ Run a prompt in Ask, Plan, Build, Cloud, or Hot Potato first so the Judge has outputs to score!");
    return;
  }
  const jObj = getJudgeBackendObj();
  const wasHotPotato = $("#verdict")?.classList.contains("verdict-hot-potato-highlight") || MODE === "hot_potato";
  const allJudgeBtns = ["#judge-btn", "#post-run-judge-btn", "#verdict-rejudge-btn", "#verdict-judge-bottom-btn"]
    .map((s) => $(s))
    .filter(Boolean);
  allJudgeBtns.forEach((b) => { b.disabled = true; });
  status(`⚖️ Judge (${jObj.name}) evaluating ${Object.keys(texts).length} output(s) on 4-criteria rubric…`);
  try {
    const res = await postJSON("/api/judge", {
      answers: texts,
      judge_idx: getJudgeIdx(),
      prompt: window._lastPrompt || ($("#prompt")?.value || "").trim(),
      mode: MODE,
    });
    const vTitle = wasHotPotato
      ? "🥔⚖️ Hot Potato Build — Chief Judge Evaluated & Merged Verdict"
      : "⚖️ Chief Judge — Scored & Merged Master Verdict";
    showVerdict(vTitle, res.text || res.error, { ...res, is_hot_potato: wasHotPotato });
    if (res.leaderboard) renderLeaderboard(res.leaderboard);
    $("#judge-btn")?.classList.remove("judge-ready-pulse");
    $("#verdict")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    status(`⚖️ Judged by ${res.judge_model || jObj.name} — Winner: ${res.winner || "see scorecard"} (Arena leaderboard updated)`);
  } finally {
    allJudgeBtns.forEach((b) => { b.disabled = false; });
  }
}

$("#judge-btn").onclick = runChiefJudgeEvaluation;
$("#post-run-judge-btn")?.addEventListener("click", runChiefJudgeEvaluation);
$("#verdict-rejudge-btn")?.addEventListener("click", runChiefJudgeEvaluation);
$("#verdict-judge-bottom-btn")?.addEventListener("click", runChiefJudgeEvaluation);
$("#verdict-devops-pkg")?.addEventListener("click", () => {
  if (typeof packageOmegaMergedBuild === "function") packageOmegaMergedBuild("devops_bundle");
});
$("#export-devops-bundle-btn")?.addEventListener("click", () => {
  if (typeof packageOmegaMergedBuild === "function") packageOmegaMergedBuild("devops_bundle");
});

$("#director-btn").onclick = async () => {
  const texts = window._lastAnswers;
  if (!texts) { status("nothing to direct"); return; }
  const jObj = getJudgeBackendObj();
  $("#director-btn").disabled = true;
  status(`🎬 Director (${jObj.name}) analyzing…`);
  const res = await postJSON("/api/director", { answers: texts, judge_idx: getJudgeIdx() });
  showVerdict("🎬 Director — Critique, Follow-ups & Build Brief", res.text || res.error, { judge_model: jObj.name, judge_id: jObj.model });
  $("#director-btn").disabled = false;
};
function showVerdict(title, text, meta = null) {
  window._lastVerdict = text || "";
  const vCard = $("#verdict");
  vCard.classList.remove("hidden");
  const isHp = Boolean(meta?.is_hot_potato || /hot potato/i.test(String(title || "")));
  vCard.classList.toggle("verdict-hot-potato-highlight", isHp);
  const kicker = $("#verdict-highlight-kicker");
  if (kicker) {
    kicker.classList.toggle("hidden", !isHp);
    if (isHp) kicker.textContent = meta?.scorecard?.length ? "🥔⚖️ JUDGED HOT POTATO VERDICT" : "🥔⚡ HOT POTATO VERDICT";
  }
  $("#verdict-title").textContent = title;
  const judgePill = $("#verdict-judge-model-pill");
  if (judgePill) {
    const jObj = getJudgeBackendObj();
    const jName = meta?.judge_model || jObj?.name || "Council Judge";
    const jId = meta?.judge_id || jObj?.model || "";
    judgePill.textContent = `⚖️ Judged by: ${jName}${jId ? ` (${jId})` : ""}`;
  }
  const scEl = $("#verdict-judge-scorecard");
  if (scEl) {
    const scorecard = Array.isArray(meta?.scorecard) ? meta.scorecard : [];
    if (scorecard.length) {
      scEl.classList.remove("hidden");
      scEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px">
          <strong style="font-size:12px;color:#c4b5fd">📊 Multi-Criteria Judge Scorecard — Evaluated by ${esc(meta.judge_model || "Judge")}</strong>
          ${meta.winner ? `<span style="font-size:11.5px;color:#34d399;font-weight:700">🏆 Round Winner: ${esc(meta.winner)}</span>` : ""}
        </div>
        <table class="judge-score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Model / Hop</th>
              <th>Total Score</th>
              <th>Completeness</th>
              <th>Accuracy</th>
              <th>Architecture</th>
              <th>Code / LOC</th>
              <th>Judge Critique</th>
            </tr>
          </thead>
          <tbody>
            ${scorecard.map((row, idx) => `
              <tr>
                <td>${idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}</td>
                <td><strong>${esc(row.model)}</strong></td>
                <td><span class="judge-score-pill">${Number(row.score || 0).toFixed(2)} / 10</span></td>
                <td>${Number(row.completeness || 0).toFixed(1)}</td>
                <td>${Number(row.accuracy || 0).toFixed(1)}</td>
                <td>${Number(row.architecture || 0).toFixed(1)}</td>
                <td class="muted">${row.code_blocks || 0} blk · ${row.lines || 0} loc</td>
                <td class="muted">${esc(row.critique || "Evaluated against prompt requirements")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    } else {
      scEl.classList.add("hidden");
      scEl.innerHTML = "";
    }
  }
  const vb = $("#verdict-body");
  setCardBodyMarkdown(vb, text || "(empty)", false);
}
$("#verdict-speak")?.addEventListener("click", (e) => speak(window._lastVerdict || $("#verdict-body")?.textContent || "", e.currentTarget));
$("#verdict-copy")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText(window._lastVerdict || $("#verdict-body")?.textContent || "");
    btn.textContent = "✅ Copied";
    setTimeout(() => { btn.textContent = "📋 Copy"; }, 1400);
  } catch (_) {}
});
$("#verdict-vscode")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const raw = (window._lastVerdict || $("#verdict-body")?.textContent || "").trim();
  const allAns = window._lastAnswers || {};
  const combined = [raw, ...Object.entries(allAns).map(([k, v]) => `\n\n# --- Source: ${k} ---\n${v}`)].join("\n");
  if (!combined.trim()) {
    status("Nothing in Verdict to send to VS Code yet.");
    return;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const destination = STATE?.settings?.file_output_dir || "council_outputs";
  btn.disabled = true;
  btn.textContent = "💻 Opening VS Code…";
  try {
    const res = await postJSON("/api/workspace/export", {
      folder: `${destination}/verdict_merged_${stamp}`,
      fallback_name: `verdict_${stamp}.md`,
      text: combined,
      open_vscode: true,
    });
    if (res.ok) {
      btn.textContent = "✅ Sent to VS Code";
      status(`💻 Exported ${res.files?.length || 1} merged file(s) to ${res.dir} and opened VS Code!`);
      setTimeout(() => { btn.textContent = "💻 Send to VS Code"; }, 2400);
    } else {
      btn.textContent = "💻 Send to VS Code";
      status(res.error || "Could not export to VS Code");
    }
  } catch (err) {
    btn.textContent = "💻 Send to VS Code";
    status("VS Code export failed: " + (err.message || err));
  } finally {
    btn.disabled = false;
  }
});
$("#verdict-autorun")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const raw = (window._lastVerdict || $("#verdict-body")?.textContent || "").trim();
  const allAns = window._lastAnswers || {};
  if (!raw && !Object.keys(allAns).length) {
    status("Nothing to compile/run yet");
    return;
  }
  btn.disabled = true;
  btn.textContent = "⚡ Compiling & Self-Healing…";
  status("⚡ Writing merged Verdict & Council files, compiling, running, and self-healing up to 4 rounds…");
  openLiveTerminalWithOutput(
    "Verdict Merged Application — Compiling & Self-Healing…",
    "⏳ Combining Verdict synthesis + all Council model files into a finished runnable project…",
    null,
    "",
    true
  );
  try {
    const res = await postJSON("/api/autorun", {
      title: "verdict_merged_app",
      text: raw,
      all_answers: allAns,
      self_heal: true,
      exec_mode: EXEC_MODE,
    });
    openLiveTerminalWithOutput(
      `Verdict Merged App — ${res.repaired ? `Self-Healed in ${res.rounds} Round(s)` : (res.ok ? "Verified & Complete" : "Execution Output")}`,
      res.terminal_log || res.error || "(execution finished)",
      res.cwd || res.dir,
      res.run_cmd || "",
      Boolean(res.ok)
    );
    if (res.html_preview) {
      openHtmlPreview("Verdict Merged App", "```html\n" + res.html_preview + "\n```");
    }
    status(
      res.ok
        ? `✅ Finished application compiled & verified (${res.files?.length || 0} files in ${res.dir})!`
        : (res.error || "Execution finished — check Live Terminal")
    );
  } catch (err) {
    status("Auto-run error: " + (err.message || err));
  } finally {
    btn.disabled = false;
    btn.textContent = "⚡ Compile, Run & Self-Heal";
  }
});
$("#verdict-followup")?.addEventListener("click", () => {
  const raw = (window._lastVerdict || "").trim();
  if (!raw) return;
  const pEl = $("#prompt");
  pEl.value = `Based on the Council Verdict:\n"""\n${raw.slice(0, 2200)}\n"""\n\nNext step / follow-up: `;
  pEl.focus();
  pEl.dispatchEvent(new Event("input"));
  status("loaded verdict into prompt for follow-up");
});

// ── 🏆 Model Arena Leaderboard ──
function renderLeaderboard(lb) {
  const body = $("#leaderboard-body");
  if (!body) return;
  const models = lb?.models || {};
  const entries = Object.entries(models).sort((a, b) => (b[1].avg_score || 0) - (a[1].avg_score || 0) || (b[1].wins || 0) - (a[1].wins || 0));
  if (!entries.length) {
    body.innerHTML = `<div class="muted" style="padding:6px 0">No Judge evaluations recorded yet. Ask the council a question and click <strong>⚖️ Judge</strong> to automatically score and rank your models!</div>`;
    return;
  }
  body.innerHTML = `<table class="leaderboard-table">
    <thead><tr><th>Rank</th><th>Model</th><th>Avg Score</th><th>Wins</th><th>Evaluations</th></tr></thead>
    <tbody>${entries.map(([name, m], idx) => `
      <tr>
        <td>${idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : idx + 1}</td>
        <td><strong>${esc(name)}</strong></td>
        <td><span class="score-badge">${Number(m.avg_score || 0).toFixed(2)} / 10</span></td>
        <td>🏆 ${m.wins || 0}</td>
        <td class="muted">${m.rounds || 0} round(s)</td>
      </tr>
    `).join("")}</tbody>
  </table>`;
}
$("#leaderboard-btn")?.addEventListener("click", async () => {
  const card = $("#leaderboard-card");
  if (!card) return;
  const opening = card.classList.contains("hidden");
  card.classList.toggle("hidden");
  if (opening) {
    const lb = await fetch("/api/leaderboard", { cache: "no-store" }).then((r) => r.json()).catch(() => ({}));
    renderLeaderboard(lb);
  }
});
$("#leaderboard-close")?.addEventListener("click", () => $("#leaderboard-card")?.classList.add("hidden"));
$("#leaderboard-reset")?.addEventListener("click", async () => {
  await fetch("/api/leaderboard", { method: "DELETE" });
  renderLeaderboard({ models: {} });
  status("Arena leaderboard scores reset");
});

// ── ✨ Smart Prompt Enhancer & Anti-Block Reframer + Live 0-Block Verifier ──
$("#enhance-undo-btn")?.addEventListener("click", () => {
  if (!lastPreEnhancePrompt) return;
  $("#prompt").value = lastPreEnhancePrompt;
  $("#prompt").dispatchEvent(new Event("input"));
  $("#enhance-undo-btn").classList.add("hidden");
  status("↶ restored original prompt before enhancement");
});

async function runSmartPromptEnhancer(e) {
  const p = $("#prompt").value.trim();
  if (!p) {
    status("Type a prompt first to enhance & reframe into an anti-block specification");
    $("#prompt")?.focus();
    return;
  }
  const btn = $("#enhance-btn");
  const toolbarBtn = $("#enhance-toolbar-btn");
  const depth = e?.shiftKey
    ? "concise"
    : ($("#enhance-depth-select")?.value || $("#enhance-depth")?.value || "smart_reframe");
  lastPreEnhancePrompt = p;
  if (btn) {
    btn.disabled = true;
    btn.classList.add("spinning");
  }
  if (toolbarBtn) {
    toolbarBtn.disabled = true;
    toolbarBtn.textContent = "⏳ Reframing…";
  }
  status(`✨ Enhancing & reframing prompt (${depth} mode — building structured anti-block specification)…`);
  try {
    const res = await postJSON("/api/enhance", { prompt: p, idx: getJudgeIdx(), depth });
    if (res.ok && res.text) {
      $("#prompt").value = res.text;
      $("#prompt").dispatchEvent(new Event("input"));
      $("#enhance-undo-btn")?.classList.remove("hidden");
      status(`✨ Prompt reframed & enhanced (${p.length} → ${res.text.length} chars via ${res.model || "Smart Enhancer"} · click ↶ to undo)`);
    } else {
      status("enhance failed: " + (res.text || res.error || "no response"));
    }
  } catch (err) {
    status("enhance failed: " + (err.message || String(err)));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("spinning");
    }
    if (toolbarBtn) {
      toolbarBtn.disabled = false;
      toolbarBtn.textContent = "✨ Enhance & Reframe";
    }
  }
}

$("#enhance-btn").onclick = runSmartPromptEnhancer;
$("#enhance-toolbar-btn")?.addEventListener("click", runSmartPromptEnhancer);

$("#verify-no-blocks-btn")?.addEventListener("click", async () => {
  const btn = $("#verify-no-blocks-btn");
  const currentPrompt = ($("#prompt")?.value || "").trim();
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Verifying…";
  }
  const body = mkCard(
    "🔬 Live Anti-Block & Swarm Verification Suite",
    "4-Stage Diagnostic Proof (Sanitizer · Enhancer · Council · Swarm)",
    null,
    true
  );
  body.innerHTML = `<div class="muted">⏳ Running live 4-stage verification across System Prompt Sanitizer, Smart Prompt Enhancer, Council Model Execution, and Swarm Sub-Agent Execution…</div>`;
  status("🔬 Running live 4-stage verification to prove 0 safety blocks…");
  try {
    const res = await postJSON("/api/diagnostics/verify-no-blocks", {
      prompt: currentPrompt || undefined,
    });
    const checks = Array.isArray(res.checks) ? res.checks : [];
    const badgeColor = res.ok ? "#10b981" : "#f59e0b";
    let html = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;padding:8px 12px;border-radius:8px;background:rgba(16,185,129,0.12);border:1px solid ${badgeColor}">
        <div>
          <strong style="color:${badgeColor};font-size:13px">${res.ok ? "✅ ALL 4 STAGES VERIFIED — ZERO SAFETY BLOCKS DETECTED" : "⚠️ PARTIAL DIAGNOSTIC RESULT"}</strong>
          <div class="muted" style="font-size:11.5px;margin-top:2px">Tested Prompt: <code>${esc((res.tested_prompt || "").slice(0, 140))}</code></div>
        </div>
        <button type="button" class="primary sm" id="use-verified-enhanced-prompt-btn">📥 Load Enhanced Spec into Prompt Box</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">
    `;
    for (const c of checks) {
      const okIcon = c.passed ? "✅ PASS" : "❌ FAIL";
      const okCol = c.passed ? "#34d399" : "#f87171";
      html += `
        <div style="background:rgba(10,16,32,0.85);border:1px solid rgba(148,163,184,0.22);border-radius:8px;padding:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px">
            <strong style="font-size:12px;color:#e2e8f0">${esc(c.title)}</strong>
            <span style="font-size:11px;font-weight:700;color:${okCol}">${okIcon}</span>
          </div>
          <div class="muted" style="font-size:11.5px;margin-bottom:6px">${esc(c.detail || "")}</div>
          ${
            c.sample_after
              ? `<div style="font-size:11px;background:#050811;padding:6px 8px;border-radius:6px;font-family:var(--mono);color:#a7f3d0;max-height:110px;overflow:auto"><strong>Sanitized System Prompt:</strong><br>${esc(c.sample_after)}</div>`
              : c.output_preview
              ? `<div style="font-size:11px;background:#050811;padding:6px 8px;border-radius:6px;font-family:var(--mono);color:#cbd5e1;max-height:130px;overflow:auto;white-space:pre-wrap">${esc(c.output_preview)}</div>`
              : ""
          }
        </div>
      `;
    }
    html += `</div>`;
    body.innerHTML = html;
    body.querySelector("#use-verified-enhanced-prompt-btn")?.addEventListener("click", () => {
      if (res.enhanced_prompt && $("#prompt")) {
        lastPreEnhancePrompt = $("#prompt").value;
        $("#prompt").value = res.enhanced_prompt;
        $("#prompt").dispatchEvent(new Event("input"));
        $("#enhance-undo-btn")?.classList.remove("hidden");
        status("✨ Loaded verified anti-block specification into prompt box!");
      }
    });
    status(res.ok ? "✅ All 4 stages verified: 0 safety warnings across Enhancer, Council & Swarm!" : "⚠️ Verification finished — inspect card for details");
  } catch (err) {
    body.innerHTML = `<div style="color:#f87171">⚠️ Verification error: ${esc(err.message || String(err))}</div>`;
    status("Verification error: " + (err.message || String(err)));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "🔬 Verify 0 Blocks";
    }
  }
});

// ── tuning panel ──
function syncTuningButtonReadout() {
  const tempVal = Number($("#t-temp")?.value ?? STATE?.settings?.temperature ?? 0.7).toFixed(2);
  const toppVal = Number($("#t-topp")?.value ?? STATE?.settings?.top_p ?? 0.95).toFixed(2);
  const jtempVal = Number($("#t-jtemp")?.value ?? STATE?.settings?.judge_temperature ?? 0.3).toFixed(2);
  if ($("#o-temp")) $("#o-temp").textContent = tempVal;
  if ($("#o-topp")) $("#o-topp").textContent = toppVal;
  if ($("#o-jtemp")) $("#o-jtemp").textContent = jtempVal;
  const lbl = $("#tuning-btn-label");
  if (lbl) {
    lbl.textContent = `Tuning (T:${tempVal} · Top-P:${toppVal})`;
  }
  updateJudgeModelBadges();
}
$("#tuning-btn").onclick = () => {
  $("#tuning").classList.toggle("hidden");
  syncTuningButtonReadout();
};
$("#composer-active-judge-badge")?.addEventListener("click", () => {
  $("#tuning")?.classList.remove("hidden");
  $("#judge-pick")?.focus();
  syncTuningButtonReadout();
});
function renderTuning() {
  const s = STATE.settings;
  $("#t-temp").value = s.temperature; $("#o-temp").textContent = Number(s.temperature ?? 0.7).toFixed(2);
  $("#t-topp").value = s.top_p; $("#o-topp").textContent = Number(s.top_p ?? 0.95).toFixed(2);
  $("#t-maxtok").value = s.max_tokens;
  $("#t-jtemp").value = s.judge_temperature; $("#o-jtemp").textContent = Number(s.judge_temperature ?? 0.3).toFixed(2);
  $("#tune-model").innerHTML = '<option value="">per-model override…</option>'
    + STATE.backends.map((b) => `<option value="${esc(b.model)}">${esc(b.name)}</option>`).join("");
  syncTuningButtonReadout();
}
function renderFileOutputSetting() {
  const input = $("#file-output-dir");
  if (input && STATE?.settings) input.value = STATE.settings.file_output_dir || "council_outputs";
}
$("#file-output-browse")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const res = await postJSON("/api/browse-output-dir", {});
    if (res.ok) {
      $("#file-output-dir").value = res.path;
      status("folder selected — click Save destination to apply it");
    } else if (!res.cancelled) {
      status(res.error || "could not open folder picker");
    }
  } catch (error) {
    status(`could not open folder picker: ${error.message || error}`);
  } finally {
    button.disabled = false;
  }
});
$("#file-output-save")?.addEventListener("click", async () => {
  const input = $("#file-output-dir");
  try {
    const res = await postJSON("/api/settings", { file_output_dir: input.value });
    if (!res.ok) { status(res.error || "could not save file destination"); return; }
    STATE.settings = res.settings;
    renderFileOutputSetting();
    status(`model files will save under ${STATE.settings.file_output_dir}`);
  } catch (error) {
    status(`could not save file destination: ${error.message || error}`);
  }
});
[["t-temp", "o-temp"], ["t-topp", "o-topp"], ["t-jtemp", "o-jtemp"]].forEach(([i, o]) =>
  $("#" + i).oninput = () => {
    $("#" + o).textContent = Number($("#" + i).value).toFixed(2);
    syncTuningButtonReadout();
  });
$("#tune-save").onclick = async () => {
  const res = await postJSON("/api/settings", {
    temperature: +$("#t-temp").value, top_p: +$("#t-topp").value,
    max_tokens: +$("#t-maxtok").value, judge_temperature: +$("#t-jtemp").value,
  });
  if (res.ok) {
    STATE.settings = res.settings;
    syncTuningButtonReadout();
    status(`generation settings saved (Temp: ${res.settings.temperature}, Top-P: ${res.settings.top_p}, Judge Temp: ${res.settings.judge_temperature})`);
  }
};
$("#tune-model-save").onclick = async () => {
  const mid = $("#tune-model").value;
  if (!mid) { status("pick a model to override"); return; }
  const body = {};
  if ($("#tune-temp").value) body.temperature = +$("#tune-temp").value;
  if ($("#tune-max").value) body.max_tokens = +$("#tune-max").value;
  const res = await postJSON(`/api/tuning/${encodeURIComponent(mid)}`, body);
  status(res.ok ? `override saved for ${mid}` : "override failed");
};
$("#tune-model-clear").onclick = async () => {
  const mid = $("#tune-model").value;
  if (!mid) return;
  await postJSON(`/api/tuning/${encodeURIComponent(mid)}`, {});
  status("override cleared");
};

// ── agents view ──
const TOOL_LIST = [
  "list_dir",
  "read_file",
  "write_file",
  "open_path",
  "run_command",
  "swarm_delegate",
  "mcp_call",
  "cve_lookup",
  "web_search",
  "fetch_url",
  "port_tls_probe",
  "entropy_yara_scan",
  "secret_leak_scan",
  "ast_sast_audit",
  "memory_remember",
  "memory_recall",
  "vision_analyze",
  "restart_app"
];
let _selectedDirAgentId = null;
let _agentDirBindingsDone = false;

function ensureAgentDirectoryModalBindings() {
  if (_agentDirBindingsDone) return;
  _agentDirBindingsDone = true;

  const toggleBtn = $("#agent-directory-toggle-btn");
  const popover = $("#agent-directory-popover");
  const closeBtn = $("#agent-dir-close-btn");
  const searchInput = $("#agent-dir-search");
  const openTelemBtn = $("#agent-open-telemetry-modal-btn");
  const dirOpenTelemBtn = $("#agent-dir-open-telemetry-btn");
  const telemModal = $("#agent-telemetry-modal");
  const telemCloseBtn = $("#agent-telemetry-modal-close-btn");

  if (toggleBtn && popover) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = popover.classList.toggle("hidden");
      toggleBtn.setAttribute("aria-expanded", String(!isHidden));
      if (!isHidden) {
        renderAgents();
        searchInput?.focus();
      }
    });
  }

  closeBtn?.addEventListener("click", () => {
    popover?.classList.add("hidden");
    toggleBtn?.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (e) => {
    if (!popover || popover.classList.contains("hidden")) return;
    if (!popover.contains(e.target) && !toggleBtn?.contains(e.target)) {
      popover.classList.add("hidden");
      toggleBtn?.setAttribute("aria-expanded", "false");
    }
  });

  searchInput?.addEventListener("input", () => {
    renderAgents();
  });

  const openTelemetryModal = () => {
    popover?.classList.add("hidden");
    toggleBtn?.setAttribute("aria-expanded", "false");
    if (telemModal) {
      telemModal.classList.remove("hidden");
      loadAndRenderAgentTelemetryDashboard();
    }
  };

  openTelemBtn?.addEventListener("click", openTelemetryModal);
  dirOpenTelemBtn?.addEventListener("click", openTelemetryModal);
  telemCloseBtn?.addEventListener("click", () => {
    telemModal?.classList.add("hidden");
  });
  telemModal?.addEventListener("click", (e) => {
    if (e.target === telemModal) telemModal.classList.add("hidden");
  });
}

function renderAgentDirectorySideTab(a, isLockedClick = false) {
  const sideTab = $("#agent-dir-side-tab");
  if (!sideTab || !a) return;
  const modelLabel = resolveAgentModelLabel(a);
  const mcpServers = Array.isArray(a.mcp_servers) ? a.mcp_servers : [];
  const toolsList = Array.isArray(a.tools) && a.tools.length ? a.tools.join(", ") : "None";

  sideTab.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;border-bottom:1px solid rgba(46,230,166,.25);padding-bottom:8px">
      <div>
        <div style="font-size:10.5px;color:#2ee6a6;font-weight:800;letter-spacing:.05em;text-transform:uppercase">
          ${isLockedClick ? "◈ AGENT SELECTED — CHOOSE ACTION BELOW" : "◈ AGENT HOVER BRIEFING (CLICK TO LOCK)"}
        </div>
        <h3 style="margin:3px 0 0;font-size:15px;color:#fff">🤖 ${esc(a.name)}</h3>
      </div>
      <span class="right-badge" style="color:#38bdf8">🧠 ${esc(modelLabel)}</span>
    </div>

    <!-- Action Tab: Edit · Run · Delete -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;padding:8px 10px;background:rgba(46,230,166,.08);border:1px solid rgba(46,230,166,.35);border-radius:7px">
      <button type="button" class="primary sm" id="agent-side-run-btn" style="flex:1;font-weight:700">▶ Run in CLI</button>
      <button type="button" class="ghost sm" id="agent-side-edit-cli-btn" style="flex:1;border-color:#38bdf8;color:#7dd3fc;font-weight:700">✎ Edit in CLI Prompt</button>
      <button type="button" class="ghost sm" id="agent-side-edit-form-btn" title="Open visual form editor">📝 Form</button>
      <button type="button" class="ghost sm" id="agent-side-del-btn" style="border-color:rgba(255,107,139,.45);color:#ff6b8b">🗑 Delete</button>
    </div>

    <div style="font-size:12px;line-height:1.55;color:#e2e8f0;background:rgba(15,23,42,.75);border:1px solid rgba(148,163,184,.2);border-radius:6px;padding:10px">
      <div style="font-size:11px;font-weight:700;color:#93c5fd;margin-bottom:4px">What This Specialist Agent Does:</div>
      <div>${esc(a.system || "General purpose autonomous specialist agent.")}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11.5px">
      <div style="padding:6px 8px;background:rgba(15,23,42,.55);border-radius:5px;border:1px solid rgba(148,163,184,.14)">
        <span class="muted">Temperature:</span> <strong>${a.temperature ?? 0.4}</strong> · <span class="muted">Max Rounds:</span> <strong>${a.rounds || 4}</strong>
      </div>
      <div style="padding:6px 8px;background:rgba(15,23,42,.55);border-radius:5px;border:1px solid rgba(148,163,184,.14)">
        <span class="muted">MCP Servers:</span> <strong>${mcpServers.length ? esc(mcpServers.join(", ")) : "All 20 Enabled"}</strong>
      </div>
    </div>

    <div style="font-size:11px;color:#94a3b8">
      <strong style="color:#cbd5e1">Allowed Tools (${a.tools?.length || 0}):</strong> <code>${esc(toolsList)}</code>
    </div>
  `;

  $("#agent-side-run-btn")?.addEventListener("click", () => {
    if ($("#run-agent")) {
      $("#run-agent").value = a.id;
      syncRunAgentModelControls();
    }
    if ($("#agent-active-selection-pill")) {
      $("#agent-active-selection-pill").textContent = `Selected: ${a.name}`;
    }
    $("#agent-directory-popover")?.classList.add("hidden");
    $("#agent-directory-toggle-btn")?.setAttribute("aria-expanded", "false");
    if (window._suomynonaSelectAgentForRunCli) {
      window._suomynonaSelectAgentForRunCli(a);
    } else {
      $("#agent-runner-cli-input")?.focus();
    }
    status(`▶ Loaded "${a.name}" into Run Specialist Agent Task CLI`);
  });

  $("#agent-side-edit-cli-btn")?.addEventListener("click", () => {
    $("#agent-directory-popover")?.classList.add("hidden");
    $("#agent-directory-toggle-btn")?.setAttribute("aria-expanded", "false");
    if (window._suomynonaEditAgentInCli) {
      window._suomynonaEditAgentInCli(a);
    } else {
      editAgent(a.id);
    }
  });

  $("#agent-side-edit-form-btn")?.addEventListener("click", () => {
    $("#agent-directory-popover")?.classList.add("hidden");
    $("#agent-directory-toggle-btn")?.setAttribute("aria-expanded", "false");
    editAgent(a.id);
  });

  $("#agent-side-del-btn")?.addEventListener("click", async () => {
    await fetch("/api/agents/" + a.id, { method: "DELETE" });
    AGENTS = await (await fetch("/api/agents")).json();
    STATE.agents = AGENTS;
    _selectedDirAgentId = AGENTS[0]?.id || null;
    fillAgentPickers();
    renderAgents();
    status(`🗑 Deleted agent "${a.name}"`);
  });
}

function renderAgents() {
  ensureAgentDirectoryModalBindings();
  const countBadge = $("#agent-directory-count-badge");
  if (countBadge) countBadge.textContent = `${AGENTS.length} Specialists`;

  const dirList = $("#agent-dir-list");
  if (dirList) {
    const q = ($("#agent-dir-search")?.value || "").toLowerCase().trim();
    const filtered = AGENTS.filter((a) => {
      if (!q) return true;
      const intel = typeof SPECIALIST_AGENT_LIGHTHOUSE_INTEL === "object" ? SPECIALIST_AGENT_LIGHTHOUSE_INTEL[a.id] : null;
      return `${a.name} ${a.id} ${a.category || ""} ${intel?.what || ""} ${a.system || ""} ${(a.tools || []).join(" ")}`.toLowerCase().includes(q);
    });

    dirList.innerHTML = "";
    if (!_selectedDirAgentId && filtered.length) {
      _selectedDirAgentId = filtered[0].id;
    }

    const groupedDir = new Map();
    filtered.forEach((a) => {
      const spMatch = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === a.id);
      const grpName = spMatch?.category || a.category || "🤖 Custom User Specialists";
      if (!groupedDir.has(grpName)) groupedDir.set(grpName, []);
      groupedDir.get(grpName).push({ agent: a, plainRole: spMatch?.role || "" });
    });

    for (const [grpTitle, entries] of groupedDir.entries()) {
      const hdr = document.createElement("div");
      hdr.style.cssText =
        "margin:8px 0 4px 0;padding:4px 8px;border-radius:6px;background:rgba(15,23,42,0.9);border:1px solid rgba(56,189,248,0.24);display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:700;color:#7dd3fc";
      hdr.innerHTML = `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(grpTitle)}</span><span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#94a3b8;flex-shrink:0">${entries.length}</span>`;
      dirList.appendChild(hdr);

      entries.forEach(({ agent: a, plainRole }) => {
        const modelLabel = resolveAgentModelLabel(a);
        const intel = typeof SPECIALIST_AGENT_LIGHTHOUSE_INTEL === "object" ? SPECIALIST_AGENT_LIGHTHOUSE_INTEL[a.id] : null;
        const summaryLine = plainRole || intel?.what || a.system || "Custom tool-using specialist";
        const item = document.createElement("button");
        item.type = "button";
        item.className = "agent-dir-item" + (a.id === _selectedDirAgentId ? " selected" : "");
        item.style.overflow = "hidden";
        item.style.minWidth = "0";
        item.setAttribute("data-agent-lighthouse", a.id || a.name || "");
        item.innerHTML = `
          <div style="min-width:0;flex:1;overflow:hidden">
            <div style="font-weight:700;font-size:12px;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(a.name)}</div>
            <div class="muted" style="font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(summaryLine)}</div>
          </div>
          <span class="right-badge" style="font-size:10px;flex-shrink:0">${esc(modelLabel.slice(0, 14))}</span>
        `;
        item.addEventListener("mouseenter", () => {
          renderAgentDirectorySideTab(a, a.id === _selectedDirAgentId);
        });
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          _selectedDirAgentId = a.id;
          dirList.querySelectorAll(".agent-dir-item").forEach((el) => el.classList.remove("selected"));
          item.classList.add("selected");
          if ($("#agent-active-selection-pill")) {
            $("#agent-active-selection-pill").textContent = `Selected: ${a.name}`;
          }
          renderAgentDirectorySideTab(a, true);
        });
        dirList.appendChild(item);
      });
    }

    const activeAgent = AGENTS.find((x) => x.id === _selectedDirAgentId) || filtered[0];
    if (activeAgent) {
      renderAgentDirectorySideTab(activeAgent, true);
    }
  }

  fillAgentPickers();
  loadAndRenderAgentTelemetryDashboard();
}

// ── Specialist Agent Historical Telemetry, Tool-Use Efficiency & Auto-Optimizer Dashboard ──
let _agentDashData = null;
let _agentDashFilter = "all";

async function loadAndRenderAgentTelemetryDashboard() {
  const kpiEl = $("#agent-dash-kpi-strip");
  const tableWrap = $("#agent-dash-table-wrap");
  if (!kpiEl || !tableWrap) return;
  try {
    const res = await (await fetch("/api/agents/telemetry")).json();
    if (res?.ok) {
      _agentDashData = res;
      renderAgentTelemetryDashboardView();
    }
  } catch (e) {
    console.warn("Telemetry load warning:", e);
  }
}

function renderAgentTelemetryDashboardView() {
  const kpiEl = $("#agent-dash-kpi-strip");
  const tableWrap = $("#agent-dash-table-wrap");
  if (!kpiEl || !tableWrap || !_agentDashData) return;

  const sum = _agentDashData.summary || {};
  const allItems = Array.isArray(_agentDashData.agents) ? [..._agentDashData.agents] : [];

  kpiEl.innerHTML = `
    <div style="padding:10px 12px;background:rgba(12,20,42,.92);border:1px solid rgba(16,185,129,.38);border-radius:8px">
      <div class="muted" style="font-size:10.5px">✅ Historical Success Rate</div>
      <div style="font-size:20px;font-weight:800;color:#6ee7b7;margin-top:2px">${sum.avg_success_rate ?? 92}%</div>
      <div style="height:5px;background:#1e293b;border-radius:3px;margin-top:5px;overflow:hidden">
        <div style="width:${Math.min(100, sum.avg_success_rate || 92)}%;height:100%;background:linear-gradient(90deg,#10b981,#34d399)"></div>
      </div>
      <div class="muted" style="font-size:10px;margin-top:4px">Across ${sum.total_runs || 0} recorded agent executions</div>
    </div>
    <div style="padding:10px 12px;background:rgba(12,20,42,.92);border:1px solid rgba(56,189,248,.38);border-radius:8px">
      <div class="muted" style="font-size:10.5px">🧰 Tool-Use &amp; MCP Efficiency</div>
      <div style="font-size:20px;font-weight:800;color:#38bdf8;margin-top:2px">${sum.avg_tool_efficiency ?? 91}%</div>
      <div style="height:5px;background:#1e293b;border-radius:3px;margin-top:5px;overflow:hidden">
        <div style="width:${Math.min(100, sum.avg_tool_efficiency || 91)}%;height:100%;background:linear-gradient(90deg,#0284c7,#38bdf8)"></div>
      </div>
      <div class="muted" style="font-size:10px;margin-top:4px">18 Built-in Tools &amp; 20 MCP Servers tracked</div>
    </div>
    <div style="padding:10px 12px;background:rgba(12,20,42,.92);border:1px solid rgba(168,85,247,.38);border-radius:8px">
      <div class="muted" style="font-size:10.5px">⚡ Avg Completion Time</div>
      <div style="font-size:20px;font-weight:800;color:#c084fc;margin-top:2px">${((sum.avg_completion_ms || 2400) / 1000).toFixed(2)}s</div>
      <div class="muted" style="font-size:10px;margin-top:6px">End-to-end tool + MCP + LLM synthesis latency</div>
    </div>
    <div style="padding:10px 12px;background:rgba(12,20,42,.92);border:1px solid ${sum.underperforming_count > 0 ? "rgba(245,158,11,.55)" : "rgba(16,185,129,.4)"};border-radius:8px">
      <div class="muted" style="font-size:10.5px">🩺 Fleet Optimization Status</div>
      <div style="font-size:18px;font-weight:800;color:${sum.underperforming_count > 0 ? "#fbbf24" : "#6ee7b7"};margin-top:2px">
        ${sum.underperforming_count > 0 ? `⚠️ ${sum.underperforming_count} Underperforming` : `🏆 All ${sum.total_agents} Optimal`}
      </div>
      <div class="muted" style="font-size:10px;margin-top:6px">${sum.elite_count || 0} Elite (≥92%) · ${sum.total_agents || 0} Total Agents</div>
    </div>
  `;

  const searchQ = ($("#agent-dash-search")?.value || "").toLowerCase().trim();
  const sortMode = $("#agent-dash-sort")?.value || "underperforming_first";

  const filtered = allItems.filter((item) => {
    if (_agentDashFilter === "underperforming" && !item.is_underperforming) return false;
    if (_agentDashFilter === "elite" && item.health_grade !== "ELITE") return false;
    if (_agentDashFilter === "custom" && !item.is_custom) return false;
    if (_agentDashFilter === "offsec" && !/red|black|offsec|osint|socmint|exploit|malware/i.test(item.category + " " + item.name)) return false;
    if (searchQ) {
      const hay = `${item.name} ${item.category} ${item.model_name} ${(item.issues || []).join(" ")}`.toLowerCase();
      if (!hay.includes(searchQ)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortMode === "underperforming_first") {
      if (a.is_underperforming !== b.is_underperforming) return a.is_underperforming ? -1 : 1;
      return a.composite_score - b.composite_score;
    }
    if (sortMode === "success_desc") return b.success_rate - a.success_rate;
    if (sortMode === "success_asc") return a.success_rate - b.success_rate;
    if (sortMode === "efficiency_desc") return b.tool_efficiency - a.tool_efficiency;
    if (sortMode === "speed_asc") return a.avg_completion_ms - b.avg_completion_ms;
    if (sortMode === "speed_desc") return b.avg_completion_ms - a.avg_completion_ms;
    if (sortMode === "runs_desc") return b.runs_total - a.runs_total;
    return 0;
  });

  if (!filtered.length) {
    tableWrap.innerHTML = `<div class="muted" style="padding:18px;text-align:center">No specialist agents match the current filter. Click <strong>All Agents</strong> above to view the full roster.</div>`;
    return;
  }

  const rowsHtml = filtered
    .map((item) => {
      const sColor = item.success_rate >= 90 ? "#10b981" : item.success_rate >= 80 ? "#38bdf8" : "#f59e0b";
      const eColor = item.tool_efficiency >= 90 ? "#38bdf8" : item.tool_efficiency >= 80 ? "#a78bfa" : "#f43f5e";
      const gradeBadge =
        item.health_grade === "ELITE"
          ? `<span class="badge" style="background:rgba(16,185,129,.18);color:#6ee7b7;border:1px solid rgba(16,185,129,.45);font-size:9.5px">🏆 ELITE (${item.composite_score})</span>`
          : item.is_underperforming
          ? `<span class="badge" style="background:rgba(245,158,11,.18);color:#fbbf24;border:1px solid rgba(245,158,11,.5);font-size:9.5px">⚠️ UNDERPERFORMING (${item.composite_score})</span>`
          : `<span class="badge" style="background:rgba(56,189,248,.15);color:#7dd3fc;border:1px solid rgba(56,189,248,.4);font-size:9.5px">🟢 HEALTHY (${item.composite_score})</span>`;

      const sparkDots = (item.recent_success_flags || [])
        .slice(-8)
        .map((f) => `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${f ? "#10b981" : "#f43f5e"};margin-right:2px" title="${f ? "Success" : "Failed"}"></span>`)
        .join("");

      const diagHtml =
        item.issues && item.issues.length
          ? `<div style="color:#fbbf24;font-size:10.5px;line-height:1.35">⚠️ ${esc(item.issues.slice(0, 2).join(" · "))}</div>
             <div class="muted" style="font-size:10px;margin-top:2px">💡 Fix: ${esc((item.recommendations || [])[0] || "Click ⚡ Optimize")}</div>`
          : `<div style="color:#6ee7b7;font-size:10.5px">✔ Calibrated (${item.tools_count} tools · ${item.mcp_servers_count} MCPs · temp ${item.temperature})</div>
             ${item.optimizations_count > 0 ? `<div class="muted" style="font-size:9.5px">✨ Optimized ${item.optimizations_count}×</div>` : ""}`;

      return `
        <div style="display:grid;grid-template-columns:1.55fr 1fr 1fr 0.9fr 1.45fr auto;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid rgba(148,163,184,.14);background:${item.is_underperforming ? "rgba(245,158,11,.05)" : "transparent"}">
          <div>
            <div class="row" style="gap:6px;align-items:center;flex-wrap:wrap">
              <strong style="font-size:12px;color:#f8fafc">${esc(item.name)}</strong>
              ${gradeBadge}
            </div>
            <div class="muted" style="font-size:10.5px;margin-top:2px">${esc(item.category)} · 🧠 <code style="color:#93c5fd">${esc(item.model_name.slice(0, 32))}</code></div>
          </div>

          <div>
            <div class="row" style="justify-content:space-between;font-size:11px">
              <strong style="color:${sColor}">${item.success_rate}%</strong>
              <span class="muted" style="font-size:10px">${item.runs_success}/${item.runs_total} runs</span>
            </div>
            <div style="height:5px;background:#1e293b;border-radius:3px;margin:3px 0;overflow:hidden">
              <div style="width:${Math.min(100, item.success_rate)}%;height:100%;background:${sColor}"></div>
            </div>
            <div>${sparkDots}</div>
          </div>

          <div>
            <div class="row" style="justify-content:space-between;font-size:11px">
              <strong style="color:${eColor}">${item.tool_efficiency}%</strong>
              <span class="muted" style="font-size:10px">${item.tool_calls_succeeded}/${item.tool_calls_attempted} calls</span>
            </div>
            <div style="height:5px;background:#1e293b;border-radius:3px;margin:3px 0;overflow:hidden">
              <div style="width:${Math.min(100, item.tool_efficiency)}%;height:100%;background:${eColor}"></div>
            </div>
            <div class="muted" style="font-size:9.5px">🔌 ${item.mcp_calls_count} MCP calls · ${item.mcp_servers_count} MCPs</div>
          </div>

          <div>
            <div style="font-size:11.5px;font-weight:700;color:#e2e8f0">⏱ ${(item.avg_completion_ms / 1000).toFixed(2)}s avg</div>
            <div class="muted" style="font-size:10px">P95: ${(item.p95_completion_ms / 1000).toFixed(2)}s</div>
            <div class="muted" style="font-size:9.5px">🔄 ~${item.avg_rounds_used} rounds/run</div>
          </div>

          <div>${diagHtml}</div>

          <div class="row" style="gap:5px;flex-wrap:nowrap">
            <button type="button" class="${item.is_underperforming ? "primary" : "ghost"} xs dash-opt-agent-btn" data-aid="${esc(item.agent_id)}" title="Auto-tune temperature, max rounds, core tools, and MCP servers for ${esc(item.name)}">⚡ Optimize</button>
            <button type="button" class="ghost xs dash-bench-agent-btn" data-aid="${esc(item.agent_id)}" title="Run a live tool + MCP benchmark on ${esc(item.name)} and record real completion time">🧪 Benchmark</button>
            <button type="button" class="ghost xs dash-edit-agent-btn" data-aid="${esc(item.agent_id)}" title="Open Agent Editor">✏️</button>
          </div>
        </div>
      `;
    })
    .join("");

  tableWrap.innerHTML = `
    <div style="display:grid;grid-template-columns:1.55fr 1fr 1fr 0.9fr 1.45fr auto;gap:10px;padding:7px 12px;background:rgba(15,23,42,.95);border-bottom:1px solid var(--line);font-size:10.5px;font-weight:700;color:#93c5fd;position:sticky;top:0;z-index:5">
      <div>SPECIALIST AGENT &amp; MODEL</div>
      <div>HISTORICAL SUCCESS RATE</div>
      <div>TOOL-USE &amp; MCP EFFICIENCY</div>
      <div>COMPLETION TIME</div>
      <div>BOTTLENECK DIAGNOSTICS</div>
      <div>OPTIMIZE / TEST</div>
    </div>
    ${rowsHtml}
  `;

  tableWrap.querySelectorAll(".dash-opt-agent-btn").forEach((btn) => {
    btn.onclick = async () => {
      const aid = btn.getAttribute("data-aid");
      btn.disabled = true;
      btn.textContent = "⏳ Tuning…";
      const res = await postJSON(`/api/agents/${encodeURIComponent(aid)}/optimize`, {});
      btn.disabled = false;
      btn.textContent = "⚡ Optimize";
      if (res?.ok) {
        if (res.agents) {
          AGENTS = res.agents;
          STATE.agents = AGENTS;
        }
        if (res.dashboard) {
          _agentDashData = { ok: true, ...res.dashboard };
        }
        const logBox = $("#agent-dash-opt-log");
        if (logBox) {
          logBox.classList.remove("hidden");
          logBox.innerHTML = `✅ <strong>Auto-Optimized "${esc(res.agent?.name || aid)}":</strong> ${(res.changes || []).map((c) => esc(c)).join(" · ")}`;
        }
        renderAgents();
        status(`⚡ Auto-Optimized "${res.agent?.name || aid}" — temperature, rounds, tools & MCP servers calibrated!`);
      }
    };
  });

  tableWrap.querySelectorAll(".dash-bench-agent-btn").forEach((btn) => {
    btn.onclick = async () => {
      const aid = btn.getAttribute("data-aid");
      btn.disabled = true;
      btn.textContent = "⏳ Probing…";
      const res = await postJSON(`/api/agents/${encodeURIComponent(aid)}/benchmark`, {});
      btn.disabled = false;
      btn.textContent = "🧪 Benchmark";
      if (res?.ok) {
        if (res.dashboard) {
          _agentDashData = { ok: true, ...res.dashboard };
          renderAgentTelemetryDashboardView();
        }
        const logBox = $("#agent-dash-opt-log");
        if (logBox) {
          logBox.classList.remove("hidden");
          logBox.innerHTML = `🧪 <strong>Live Benchmark Verified for "${esc(res.agent_name)}":</strong> Completed in <code>${res.elapsed_ms}ms</code> via MCP <code>${esc(res.mcp_tested)}</code> (<code>${esc(res.tool_tested)}</code>). Metrics updated!`;
        }
        status(`🧪 Benchmark complete for "${res.agent_name}" (${res.elapsed_ms}ms)!`);
      }
    };
  });

  tableWrap.querySelectorAll(".dash-edit-agent-btn").forEach((btn) => {
    btn.onclick = () => {
      const aid = btn.getAttribute("data-aid");
      $("#agent-editor")?.classList.remove("hidden");
      editAgent(aid);
      $("#agent-editor")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  });
}

$("#agent-dash-filter-bar")?.querySelectorAll(".agent-dash-filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    _agentDashFilter = btn.getAttribute("data-filter") || "all";
    $("#agent-dash-filter-bar")?.querySelectorAll(".agent-dash-filter-btn").forEach((b) => {
      b.className = b === btn ? "primary xs agent-dash-filter-btn" : "ghost xs agent-dash-filter-btn";
    });
    renderAgentTelemetryDashboardView();
  });
});

$("#agent-dash-search")?.addEventListener("input", () => renderAgentTelemetryDashboardView());
$("#agent-dash-sort")?.addEventListener("change", () => renderAgentTelemetryDashboardView());
$("#agent-dash-refresh-btn")?.addEventListener("click", () => {
  loadAndRenderAgentTelemetryDashboard();
  status("🔄 Refreshed Specialist Agent telemetry metrics!");
});

$("#agent-dash-optimize-all-btn")?.addEventListener("click", async () => {
  const btn = $("#agent-dash-optimize-all-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Optimizing Fleet…";
  }
  const res = await postJSON("/api/agents/optimize-all", {});
  if (btn) {
    btn.disabled = false;
    btn.textContent = "🚀 Auto-Optimize All Underperforming Agents";
  }
  if (res?.ok) {
    if (res.agents) {
      AGENTS = res.agents;
      STATE.agents = AGENTS;
    }
    if (res.dashboard) {
      _agentDashData = { ok: true, ...res.dashboard };
    }
    const logBox = $("#agent-dash-opt-log");
    if (logBox) {
      logBox.classList.remove("hidden");
      logBox.innerHTML = `🚀 <strong>Batch Fleet Optimization Complete (${res.optimized_count} Agents Calibrated):</strong> ${(res.optimized || []).map((o) => `<code>${esc(o.name)}</code>`).join(", ")} — all set to optimal tool temperature (0.28), 5+ tool rounds, 10+ core tools &amp; category MCP servers!`;
    }
    renderAgents();
    status(`🚀 Auto-Optimized ${res.optimized_count} underperforming specialist agents!`);
  }
});

const TOOL_DESCRIPTIONS = {
  list_dir: "📂 list_dir: Lists all files and folders inside a directory so the agent can see your project structure.",
  read_file: "📄 read_file: Reads the contents of any code, config, or log file so the agent can inspect and analyze it.",
  write_file: "✍️ write_file: Creates or updates code files, scripts, and reports directly on disk.",
  open_path: "🖥 open_path: Opens a generated file or folder directly in VS Code or your system file explorer.",
  run_command: "💻 run_command: Executes real Linux/Bash, Python, Node, curl, or Git commands in the live sandbox terminal.",
  swarm_delegate: "🐝 swarm_delegate: Splits a complex sub-task across multiple Council models in parallel and merges their answers.",
  mcp_call: "🔌 mcp_call: Invokes any of Suomynona Council's 20 Built-In MCP Servers (60 specialized tools across OffSec, PenTesting, OSINT, SOCMINT, Binary Reversing, Malware Forensics, SAST, GPU Cluster & EXE Forge).",
  cve_lookup: "🚨 cve_lookup: Queries live NIST NVD CVE database, CISA Known Exploited Vulnerabilities (KEV), CVSS v3.1 vector, and PoC references.",
  web_search: "🌐 web_search: Performs live DuckDuckGo / multi-source web & OSINT reconnaissance search.",
  fetch_url: "📡 fetch_url: Fetches raw HTTP/HTTPS URLs, security headers, REST JSON APIs, and DOM contents.",
  port_tls_probe: "🔍 port_tls_probe: Performs live TCP port reachability, TLS certificate chain inspection, and service banner fingerprinting.",
  entropy_yara_scan: "🦠 entropy_yara_scan: Computes SHA-256, Shannon entropy, packed section indicators, and suspicious string/IOC heuristics.",
  secret_leak_scan: "🔑 secret_leak_scan: Scans source code and configs for leaked AWS/GitHub/HuggingFace/OpenAI/JWT/Slack tokens and private keys.",
  ast_sast_audit: "🛡️ ast_sast_audit: Runs static AST/regex security auditing across codebases to detect command injection, SQLi, XSS, SSRF, and unsafe deserialization.",
  memory_remember: "🧠 memory_remember: Saves key facts, IOCs, credentials, or architectural notes into Suomynona Council's persistent Brain Vault.",
  memory_recall: "🔎 memory_recall: Searches Suomynona Council's persistent Brain Vault for saved facts, notes, and prior findings.",
  vision_analyze: "👁️ vision_analyze: Analyzes screenshots, architecture diagrams, or binary heatmaps via multimodal vision models.",
  restart_app: "🔄 restart_app: Refreshes Suomynona Council's active model backends and runtime state.",
};

const EXTERNAL_MCP_CATALOG = BUILTIN_MCP_SERVERS_CLIENT.map((s) => ({
  id: s.id,
  name: s.name,
  title: `${s.icon} ${s.title} (${s.category})`,
  cmd: "builtin-mcp",
  args: `${s.id} [${(s.tools || []).join(", ")}]`,
  tools: s.tools || [],
  keywords: new RegExp(
    s.category.toLowerCase().replace(/[^a-z0-9]+/g, "|") + "|" + s.name.replace(/-/g, "|") + "|security|osint|recon|code|audit",
    "i"
  ),
  why: `${s.description} — Sub-tools: ${(s.tools || []).join(", ")}`,
}));

function computeSystemPromptPrediction(currentText) {
  const txt = String(currentText || "");
  const lower = txt.toLowerCase();
  if (!txt.trim()) {
    return "You are an autonomous specialist agent. First inspect the workspace using list_dir and read_file, invoke specialized MCP servers via mcp_call, verify hypotheses in the terminal using run_command, and write clean, tested outputs using write_file.";
  }
  if (/security|pentest|red|cve|vuln|exploit/i.test(lower) && !/run_command/.test(lower)) {
    return " Enumerate attack surfaces with list_dir, read_file, and mcp_call (mcp_nuclei_cve, mcp_semgrep_ast), run live boundary verification checks in the sandbox with run_command, and produce a hardened patch with write_file.";
  }
  if (/swarm|60|parallel|osint|recon/i.test(lower) && !/swarm_delegate/.test(lower)) {
    return " Decompose the mission into parallel tracks using swarm_delegate and mcp_call, cross-verify indicators with run_command, and merge findings into a master report.";
  }
  if (/build|code|python|app|fullstack|developer/i.test(lower) && !/exit code 0/i.test(lower)) {
    return " Write complete, zero-placeholder code using write_file, execute automated smoke tests via run_command, and self-heal any errors until exit code 0 is confirmed.";
  }
  if (!/verify|test/i.test(lower)) {
    return " Always verify your work by running a real check with run_command or mcp_call and summarizing confirmed results clearly.";
  }
  return " Provide concise, verified engineering deliverables backed by live tool and MCP server outputs.";
}

function computeTaskPromptPrediction(currentText) {
  const txt = String(currentText || "");
  const lower = txt.toLowerCase();
  if (!txt.trim()) {
    return "Inspect the files in council_outputs, run a live security & syntax check in the terminal and via mcp_call, and write a clean summary report.";
  }
  if (/scan|audit|security|port|cve/i.test(lower) && !/report/i.test(lower)) {
    return " using mcp_call, cve_lookup, ast_sast_audit, and run_command, then generate a prioritized remediation report and verified patch.";
  }
  if (/build|create|write|python|script/i.test(lower) && !/test/i.test(lower)) {
    return " and save it to council_outputs/, then run it in the terminal with run_command to confirm exit code 0.";
  }
  return " and verify the final output in the live terminal before summarizing.";
}

function updateAgentMcpAndToolAdvisor(sourceText) {
  const text = String(sourceText || $("#ae-system")?.value || $("#run-prompt")?.value || "").trim();
  const advisorBody = $("#ae-mcp-advisor-body");
  const runHint = $("#run-mcp-hint");

  // Recommend built-in tools based on goal keywords
  const recTools = new Set(["read_file", "list_dir", "mcp_call"]);
  if (!text || /run|test|terminal|bash|shell|python|node|scan|port|audit|verify|compile|cve|pentest/i.test(text)) {
    recTools.add("run_command");
  }
  if (!text || /write|build|create|save|patch|fix|report|code|file/i.test(text)) {
    recTools.add("write_file");
  }
  if (/cve|nvd|vuln|exploit|advisory|patch/i.test(text)) {
    recTools.add("cve_lookup");
    recTools.add("ast_sast_audit");
  }
  if (/osint|web|recon|domain|social|socmint|username/i.test(text)) {
    recTools.add("web_search");
    recTools.add("fetch_url");
  }
  if (/malware|binary|elf|pe|yara|entropy|reverse/i.test(text)) {
    recTools.add("entropy_yara_scan");
  }
  if (/secret|token|key|leak|credential/i.test(text)) {
    recTools.add("secret_leak_scan");
  }
  if (/port|tls|ssl|cert|network|nmap/i.test(text)) {
    recTools.add("port_tls_probe");
  }
  if (/swarm|parallel|delegate|multi|team|60|osint|deep/i.test(text)) {
    recTools.add("swarm_delegate");
  }

  // Recommend built-in MCP servers based on goal keywords
  const matchedMcps = EXTERNAL_MCP_CATALOG.filter((m) => m.keywords.test(text));
  const finalMcps = matchedMcps.length ? matchedMcps.slice(0, 6) : EXTERNAL_MCP_CATALOG.slice(0, 6);

  window._latestRecommendedAgentTools = [...recTools];

  if (advisorBody) {
    const toolsHtml = [...recTools]
      .map((t) => `<code style="color:var(--ok);margin-right:6px">✔ ${esc(t)}</code>`)
      .join(" ");
    const mcpHtml = finalMcps
      .map(
        (m) => `
        <div class="row" style="justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;margin-top:5px;background:rgba(7,11,22,.85);border:1px solid rgba(56,189,248,.28);border-radius:8px">
          <div>
            <strong style="color:#38bdf8">${esc(m.title)}</strong>
            <div class="muted" style="font-size:11px">${esc(m.why)}</div>
            <div style="font-size:10.5px;color:#94a3b8">MCP ID: <code>${esc(m.id)}</code> · Tools: <code>${esc((m.tools || []).join(", "))}</code></div>
          </div>
          <button type="button" class="primary xs add-rec-mcp-btn" data-mcp-id="${esc(m.id)}" data-mcp-tool="${esc((m.tools || [])[0] || "")}" style="white-space:nowrap">⚡ Test MCP Live</button>
        </div>`
      )
      .join("");

    advisorBody.innerHTML = `
      <div><strong>🧰 Recommended Built-In Agent Tools (18 Available):</strong> ${toolsHtml}</div>
      <div style="margin-top:6px"><strong>🔌 Recommended Built-In MCP Servers (20 Pre-Installed &amp; Active):</strong></div>
      ${mcpHtml}
    `;

    advisorBody.querySelectorAll(".add-rec-mcp-btn").forEach((btn) => {
      btn.onclick = async () => {
        const serverId = btn.getAttribute("data-mcp-id");
        const toolName = btn.getAttribute("data-mcp-tool");
        btn.disabled = true;
        btn.textContent = "⏳ Running…";
        const res = await postJSON("/api/mcp/call", {
          server_id: serverId,
          tool: toolName,
          args: { target: "/app/applet", query: text || "security audit" }
        });
        btn.disabled = false;
        if (res?.ok) {
          if ($("#ae-mcp")) $("#ae-mcp").checked = true;
          btn.textContent = "✅ Verified Live";
          status(`🔌 MCP "${serverId}" (${toolName}) returned live telemetry!`);
        } else {
          btn.textContent = "⚡ Test MCP Live";
        }
      };
    });
  }

  if (runHint) {
    runHint.innerHTML = `💡 <strong>Advisor for your prompt:</strong> Best built-in tools: ${[...recTools].map((t) => `<code>${esc(t)}</code>`).join(", ")} · Active MCP servers: ${finalMcps.slice(0, 4).map((m) => `<code>${esc(m.id)}</code>`).join(", ")}`;
  }
}

function editAgent(id) {
  const a = AGENTS.find((x) => x.id === id) || {
    id: "",
    name: "",
    model: "",
    model_name: "",
    temperature: 0.4,
    rounds: 4,
    tools: ["list_dir", "read_file", "write_file", "run_command", "swarm_delegate", "mcp_call", "cve_lookup", "web_search"],
    mcp: true,
    mcp_servers: ["mcp_filesystem_ast", "mcp_nuclei_cve", "mcp_semgrep_ast"],
    system: "",
  };
  $("#agent-ed-title").textContent = a.id ? `✏️ Edit Agent: ${a.name}` : "✨ Create a New AI Agent";
  $("#ae-name").value = a.name;
  $("#ae-model").innerHTML = buildAgentModelOptionsHtml(a.model || "");
  $("#ae-model").value = a.model || "";
  $("#ae-temp").value = a.temperature;
  $("#ae-rounds").value = a.rounds;
  $("#ae-system").value = a.system || "";
  const tw = $("#ae-tools");
  tw.innerHTML = "";
  const allTools = Array.from(new Set([...TOOL_LIST, ...(STATE.tools || []).map((t) => t.id || t.name)]));
  allTools.forEach((t) => {
    const desc = TOOL_DESCRIPTIONS[t] || `🔧 ${t}: Specialized agent tool.`;
    const l = document.createElement("label");
    l.className = "toggle ae-tool-pill";
    l.title = desc;
    l.innerHTML = `<input type="checkbox" value="${esc(t)}" ${(a.tools || []).includes(t) ? "checked" : ""}> <span>${esc(t)}</span>`;
    l.addEventListener("mouseenter", () => {
      const info = $("#ae-tool-hover-info");
      if (info) info.innerHTML = `🔍 <strong>What <code>${esc(t)}</code> does:</strong> ${esc(desc)}`;
    });
    tw.appendChild(l);
  });
  $("#ae-mcp").checked = a.mcp !== false;
  updateAgentMcpAndToolAdvisor(a.system || "");
  const predTextEl = $("#ae-prediction-text");
  if (predTextEl) predTextEl.textContent = computeSystemPromptPrediction(a.system || "");

  if ($("#ae-category")) $("#ae-category").value = a.category || "Your Custom Specialists";
  if ($("#ae-role")) $("#ae-role").value = a.role || "";

  $("#ae-save").onclick = async () => {
    const chosenModelVal = $("#ae-model").value;
    const chosenModelText = $("#ae-model").selectedOptions?.[0]?.textContent?.replace(/^[🟢☁️🖥⚡📌]\s*/, "").trim() || chosenModelVal;
    const prof = {
      id: a.id,
      name: $("#ae-name").value.trim() || "🤖 Custom Specialist Agent",
      category: $("#ae-category")?.value || a.category || "Your Custom Specialists",
      role: ($("#ae-role")?.value || "").trim() || ($("#ae-system").value || "").slice(0, 140),
      model: chosenModelVal,
      model_name: chosenModelVal ? chosenModelText : "Auto (first active)",
      temperature: +$("#ae-temp").value,
      rounds: +$("#ae-rounds").value,
      tools: $$("#ae-tools input:checked").map((i) => i.value),
      mcp: $("#ae-mcp").checked,
      mcp_servers: a.mcp_servers || ["mcp_filesystem_ast", "mcp_nuclei_cve", "mcp_semgrep_ast"],
      system: $("#ae-system").value,
    };
    const res = await postJSON("/api/agents", prof);
    if (res.ok) {
      AGENTS = res.agents || (await (await fetch("/api/agents")).json());
      STATE.agents = AGENTS;
      fillAgentPickers();
      if ($("#run-agent") && res.agent?.id) {
        $("#run-agent").value = res.agent.id;
      }
      syncRunAgentModelControls();
      renderAgents();
      $("#agent-editor").classList.add("hidden");
      status(`✅ Saved specialist "${prof.name}" in [${prof.category}] → Model: ${resolveAgentModelLabel(res.agent || prof)}`);
    }
  };
  $("#agent-editor").classList.remove("hidden");
  $("#ae-name")?.focus();
}

$("#agent-new")?.addEventListener("click", () => editAgent(null));
$("#ae-cancel")?.addEventListener("click", () => $("#agent-editor")?.classList.add("hidden"));

// Wire System Prompt Starter Idea Chips, Tab Autocomplete, and Tool Advisor
$$(".ae-idea-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const name = chip.getAttribute("data-idea-name") || "";
    const sys = chip.getAttribute("data-idea-sys") || "";
    const tools = (chip.getAttribute("data-idea-tools") || "").split(",").filter(Boolean);
    if ($("#ae-name") && !$("#ae-name").value.trim()) $("#ae-name").value = name;
    if ($("#ae-system")) {
      $("#ae-system").value = sys;
      $("#ae-system").dispatchEvent(new Event("input"));
    }
    if (tools.length) {
      $$("#ae-tools input[type='checkbox']").forEach((cb) => {
        cb.checked = tools.includes(cb.value);
      });
    }
    status(`💡 Loaded "${name}" system prompt & recommended tools!`);
  });
});

function acceptAePrediction() {
  const box = $("#ae-system");
  const pred = ($("#ae-prediction-text")?.textContent || "").trim();
  if (!box || !pred) return;
  const cur = box.value;
  box.value = cur ? (cur.endsWith(" ") ? cur + pred : cur + " " + pred) : pred;
  box.dispatchEvent(new Event("input"));
  box.focus();
  status("↹ Inserted system prompt prediction!");
}

$("#ae-system")?.addEventListener("input", (e) => {
  const val = e.target.value || "";
  if ($("#ae-prediction-text")) {
    $("#ae-prediction-text").textContent = computeSystemPromptPrediction(val);
  }
  updateAgentMcpAndToolAdvisor(val);
});

$("#ae-system")?.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    acceptAePrediction();
  }
});
$("#ae-prediction-bar")?.addEventListener("click", acceptAePrediction);

$("#ae-apply-rec-tools-btn")?.addEventListener("click", () => {
  const rec = window._latestRecommendedAgentTools || ["read_file", "write_file", "list_dir", "run_command"];
  $$("#ae-tools input[type='checkbox']").forEach((cb) => {
    if (rec.includes(cb.value)) cb.checked = true;
  });
  status(`✓ Checked ${rec.length} recommended tools for your agent!`);
});

// Wire #run-prompt Quick Chips & Tab Autocomplete
$$(".run-prompt-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const p = chip.getAttribute("data-rprompt") || "";
    if ($("#run-prompt")) {
      $("#run-prompt").value = p;
      $("#run-prompt").dispatchEvent(new Event("input"));
      $("#run-prompt").focus();
    }
  });
});

function acceptRunPromptPrediction() {
  const box = $("#run-prompt");
  const pred = ($("#run-prediction-text")?.textContent || "").trim();
  if (!box || !pred) return;
  const cur = box.value;
  box.value = cur ? (cur.endsWith(" ") ? cur + pred : cur + " " + pred) : pred;
  box.dispatchEvent(new Event("input"));
  box.focus();
  status("↹ Inserted agent task prediction!");
}

$("#run-prompt")?.addEventListener("input", (e) => {
  const val = e.target.value || "";
  if ($("#run-prediction-text")) {
    $("#run-prediction-text").textContent = computeTaskPromptPrediction(val);
  }
  updateAgentMcpAndToolAdvisor(val);
});

$("#run-prompt")?.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    acceptRunPromptPrediction();
  }
});
$("#run-prediction-bar")?.addEventListener("click", acceptRunPromptPrediction);
$("#run-agent")?.addEventListener("change", () => {
  syncRunAgentModelControls();
});
$("#run-agent-model")?.addEventListener("change", () => {
  const badge = $("#run-agent-model-badge");
  const selOpt = $("#run-agent-model")?.selectedOptions?.[0]?.textContent || "Auto";
  if (badge) badge.textContent = `🤖 Active Run Model: ${selOpt.replace(/^[🟢☁️🖥⚡📌]\s*/, "")}`;
});
$("#run-save-model-btn")?.addEventListener("click", async () => {
  const aid = $("#run-agent")?.value;
  const ag = AGENTS.find((x) => x.id === aid);
  if (!ag) { status("Select an agent first"); return; }
  const newModel = $("#run-agent-model")?.value || "";
  const chosenModelText = $("#run-agent-model")?.selectedOptions?.[0]?.textContent?.replace(/^[🟢☁️🖥⚡📌]\s*/, "").trim() || newModel;
  const updated = { ...ag, model: newModel, model_name: newModel ? chosenModelText : "Auto (first active)" };
  const res = await postJSON("/api/agents", updated);
  if (res.ok) {
    AGENTS = res.agents || await (await fetch("/api/agents")).json();
    STATE.agents = AGENTS;
    fillAgentPickers();
    $("#run-agent").value = aid;
    syncRunAgentModelControls();
    renderAgents();
    status(`💾 Saved default model [${resolveAgentModelLabel(res.agent || updated)}] to agent "${ag.name}"`);
  }
});

$("#run-btn")?.addEventListener("click", async () => {
  const agentId = $("#run-agent")?.value;
  const prompt = ($("#run-prompt")?.value || "").trim();
  if (!agentId || !prompt) { status("pick an agent + task"); return; }
  const ag = AGENTS.find((x) => x.id === agentId);
  const overrideModel = $("#run-agent-model") ? $("#run-agent-model").value : (ag?.model || "");
  if (ag && overrideModel !== (ag.model || "")) {
    // Also persist the chosen model onto the agent so it stays consistent everywhere
    const chosenText = $("#run-agent-model")?.selectedOptions?.[0]?.textContent?.replace(/^[🟢☁️🖥⚡📌]\s*/, "").trim() || overrideModel;
    const saveRes = await postJSON("/api/agents", { ...ag, model: overrideModel, model_name: overrideModel ? chosenText : "Auto (first active)" });
    if (saveRes?.ok && saveRes.agents) {
      AGENTS = saveRes.agents;
      STATE.agents = AGENTS;
      renderAgents();
      $("#run-agent").value = agentId;
      syncRunAgentModelControls();
    }
  }
  const activeAg = AGENTS.find((x) => x.id === agentId) || ag;
  const expectedModelLabel = resolveAgentModelLabel({ ...activeAg, model: overrideModel });
  $("#run-btn").disabled = true;
  status(`🤖 Running "${activeAg?.name || agentId}" on model [${expectedModelLabel}]…`);
  const out = $("#run-out");
  out.classList.remove("hidden");
  if ($("#run-out-title")) $("#run-out-title").textContent = `🤖 ${activeAg?.name || "Agent"}`;
  if ($("#run-out-model")) $("#run-out-model").textContent = `⏳ Running on: ${expectedModelLabel}`;
  out.querySelector(".body").textContent = `⏳ Executing task on ${expectedModelLabel}…`;
  const res = await postJSON("/api/agent/run", {
    agent_id: agentId,
    prompt,
    model: overrideModel,
  }).catch((e) => ({ ok: false, text: String(e) }));
  const actualModelUsed = res.model_used || expectedModelLabel;
  if ($("#run-out-model")) $("#run-out-model").textContent = `✅ Executed on: ${actualModelUsed}`;
  if ($("#run-agent-model-badge")) $("#run-agent-model-badge").textContent = `🤖 Last Run Model: ${actualModelUsed}`;
  let txt = "";
  (res.steps || []).forEach((s) => { txt += `🔧 ${s.tool}(${JSON.stringify(s.args || {}).slice(0, 80)}) → ${(s.result || "").slice(0, 200)}\n`; });
  if (res.steps?.length) txt += "\n";
  txt += res.text || res.error || "(no output)";
  setCardBodyMarkdown(out.querySelector(".body"), txt, false);
  status(res.ok ? `✅ Agent "${activeAg?.name || agentId}" finished on [${actualModelUsed}]` : "agent failed: " + (res.text || res.error));
  if ($("#run-btn")) $("#run-btn").disabled = false;
  if (typeof loadAndRenderAgentTelemetryDashboard === "function") {
    loadAndRenderAgentTelemetryDashboard();
  }
});

// ── docs ──
$("#doc-input").onchange = () => uploadDocs($("#doc-input").files, "files");
$("#doc-input-dir").onchange = () => uploadDocs($("#doc-input-dir").files, "folder");

// ── 🎙 Smooth Real-Time Voice-to-Text (Web Speech live streaming + Whisper fallback) ──
let rec = null;
let speechRec = null;
let dictating = false;
let dictationBaseText = "";
let dictationFinalized = "";

function stopDictationUI() {
  dictating = false;
  const btn = $("#mic-btn");
  if (btn) {
    btn.textContent = "🎙";
    btn.classList.remove("rec");
  }
}

async function startWhisperFallback() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      stopDictationUI();
      status("🎙 transcribing audio via Whisper…");
      const fd = new FormData();
      fd.append("file", new Blob(chunks, { type: rec.mimeType || "audio/webm" }), "speech.webm");
      try {
        const res = await (await fetch("/api/transcribe", { method: "POST", body: fd })).json();
        if (res.ok && res.text) {
          const pEl = $("#prompt");
          pEl.value += (pEl.value && !pEl.value.endsWith(" ") ? " " : "") + res.text.trim();
          pEl.dispatchEvent(new Event("input"));
          status("🎙 voice transcribed");
        } else {
          status("transcribe failed: " + (res.error || "no speech detected"));
        }
      } catch (err) {
        status("transcribe failed: " + err);
      }
    };
    rec.start();
    dictating = true;
    $("#mic-btn").textContent = "⏹";
    $("#mic-btn").classList.add("rec");
    status("🎙 recording audio — click ⏹ when finished speaking");
  } catch (e) {
    stopDictationUI();
    status("mic access denied: " + e);
  }
}

$("#mic-btn").onclick = async () => {
  if (dictating) {
    dictating = false;
    if (speechRec) {
      try { speechRec.stop(); } catch (_) {}
      speechRec = null;
    }
    if (rec && rec.state === "recording") {
      try { rec.stop(); } catch (_) {}
      return;
    }
    stopDictationUI();
    status("🎙 dictation finished");
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    await startWhisperFallback();
    return;
  }

  try {
    speechRec = new SR();
    speechRec.continuous = true;
    speechRec.interimResults = true;
    speechRec.lang = navigator.language || "en-US";
    const pEl = $("#prompt");
    dictationBaseText = pEl.value ? pEl.value.trimEnd() + " " : "";
    dictationFinalized = "";

    speechRec.onstart = () => {
      dictating = true;
      $("#mic-btn").textContent = "⏹";
      $("#mic-btn").classList.add("rec");
      status("🎙 listening live — speak naturally (words stream into the prompt box)");
    };

    speechRec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          dictationFinalized += transcript.trim() + " ";
        } else {
          interim += transcript;
        }
      }
      pEl.value = (dictationBaseText + dictationFinalized + interim).trimStart();
      pEl.dispatchEvent(new Event("input"));
      pEl.scrollTop = pEl.scrollHeight;
    };

    speechRec.onerror = async (event) => {
      if (event.error === "no-speech") return;
      if (event.error === "network" || event.error === "service-not-allowed" || event.error === "not-allowed") {
        dictating = false;
        try { speechRec.abort(); } catch (_) {}
        speechRec = null;
        if (event.error !== "not-allowed") {
          await startWhisperFallback();
          return;
        }
      }
      stopDictationUI();
      status("🎙 voice error: " + event.error);
    };

    speechRec.onend = () => {
      if (dictating && speechRec) {
        // Auto-restart seamlessly if the user paused briefly during continuous dictation
        try { speechRec.start(); return; } catch (_) {}
      }
      stopDictationUI();
      status("🎙 dictation ready");
    };

    speechRec.start();
  } catch (_) {
    await startWhisperFallback();
  }
};

function getDefaultAcceleratorsForProvider(prov) {
  const p = String(prov || "colab").toLowerCase();
  if (STATE?.accelerator_options?.[p]?.length) return STATE.accelerator_options[p];
  if (p === "runpod") return ["RTX4090-24GB", "RTX5090-32GB", "A40-48GB", "L40S-48GB", "A100-80GB", "H100-80GB", "H200-141GB", "MI300X-192GB"];
  if (p === "vastai") return ["RTX3090-24GB", "RTX4090-24GB", "2xRTX4090-48GB", "4xRTX4090-96GB", "A6000-48GB", "A100-80GB", "H100-80GB"];
  if (p === "lambda") return ["A100-40GB", "A100-80GB", "H100-80GB", "GH200-96GB", "8xH100-640GB"];
  if (p === "modal") return ["T4", "L4", "A10G-24GB", "A100-40GB", "A100-80GB", "H100-80GB"];
  if (p === "cloud_vm") return ["L4-24GB", "A10G-24GB", "V100-32GB", "A100-80GB", "H100-80GB", "g5.2xlarge-A10G-24GB", "g6.2xlarge-L4-24GB", "p4d.24xlarge-A100-320GB", "NC24ads-A100-80GB"];
  if (p === "kaggle") return ["NvidiaTeslaT4", "NvidiaL4", "NvidiaL4X1", "NvidiaA100", "NvidiaH100", "NvidiaRtxPro6000"];
  if (p === "localhost") return ["LocalGPU-16GB", "LocalGPU-24GB", "RTX3090-24GB", "RTX4090-24GB", "RTX5090-32GB", "AppleSilicon-64GB", "SystemRAM-192GB"];
  if (p === "custom") return ["CustomGPU-16GB", "CustomGPU-24GB", "CustomGPU-48GB", "CustomGPU-80GB", "CustomCluster-192GB", "T4", "L4", "A100", "H100", "G4"];
  return ["T4", "L4", "G4", "A100", "H100"];
}

// Helper to collect current on-screen host hardware dropdowns (provider, accelerator, high_memory, custom_url)
function collectHostHardwareConfigsFromDOM() {
  const configs = [];
  $$("#slots [data-host-lineup]").forEach((card) => {
    const hid = card.dataset.hostLineup;
    if (!hid) return;
    const provSel = card.querySelector("[data-host-provider]");
    const accSel = card.querySelector("[data-host-accelerator]");
    const hmInput = card.querySelector("[data-host-high-memory]");
    const urlInput = card.querySelector("[data-host-custom-url]");
    configs.push({
      id: hid,
      provider: provSel ? provSel.value : undefined,
      accelerator: accSel ? accSel.value : undefined,
      high_memory: hmInput ? Boolean(hmInput.checked) : undefined,
      custom_url: urlInput ? urlInput.value.trim() : undefined,
    });
  });
  return configs;
}

// ── start council + cancel ──
$("#start-btn").onclick = async () => {
  const button = $("#start-btn");
  if (!window._hostLineupsFromDOM || !window._lineupFromDOM) {
    status("Runtime lineup is still loading — wait a moment and try again.");
    return;
  }
  button.disabled = true;
  let accepted = false;
  try {
    // Publish the current on-screen lineup and host hardware selections before launching.
    const allocations = window._hostLineupsFromDOM();
    const host_configs = collectHostHardwareConfigsFromDOM();
    const assignedModels = Object.values(allocations).flatMap((lineup) => Object.values(lineup).flat());
    if (!assignedModels.some((id) => !String(id).toLowerCase().includes("embed"))) {
      status("Choose at least one non-embedding model in the lineup");
      return;
    }
    status("Publishing lineup & verifying host hardware…");
    persistHostHardwareToLocalStorage(host_configs);
    const pub = await postJSON("/api/lineup/publish", {
      lineup: window._lineupFromDOM(),
      allocations,
      host_configs,
    });
    if (!pub.ok) { status("lineup publish failed: " + (pub.error || "unknown error")); return; }
    if (Array.isArray(pub.hosts)) {
      STATE.runtime_hosts = pub.hosts;
      STATE.colab_hosts = pub.hosts;
    }
    status(`lineup published (~${pub.total}GB) — starting council…`);
    const res = await postJSON("/api/start", { host_configs });
    if (!res.ok) { status(res.error || "Council start request failed"); return; }
    accepted = true;
    status("start council running");
    pollStartStatus();
  } catch (error) {
    status(`Start Council failed: ${error.message || error}`);
  } finally {
    if (!accepted) button.disabled = false;
  }
};
$("#cancel-btn").onclick = async () => {
  if (window._askAbort) {
    try { window._askAbort.abort(); } catch (_) {}
  }
  if (cliAbort) {
    try { cliAbort.abort(); } catch (_) {}
  }
  await postJSON("/api/start/cancel", {}).catch(() => {});
  status("⏹ Stopped / cancelled active Council operation");
};
let _startTimer = null;
function pollStartStatus() {
  clearInterval(_startTimer);
  let tickInFlight = false;
  const tick = async () => {
    if (tickInFlight) return;
    tickInFlight = true;
    try {
      const s = await (await fetch("/api/start-status")).json();
      let pct = Math.max(0, Math.min(100, Number(s.pct) || 0));
      let label = s.label || "";
      if (s.running && s.label) {
        const hostProgress = [...s.label.matchAll(/(\d+(?:\.\d+)?)%\s*·/g)]
          .map((match) => Number(match[1]))
          .filter(Number.isFinite);
        if (hostProgress.length) {
          const average = hostProgress.reduce((sum, value) => sum + value, 0) / hostProgress.length;
          pct = Math.max(pct, Math.min(88, 70 + average * 0.18));
        }
      }
      if ($("#start-progress")) $("#start-progress").style.width = pct + "%";
      const progressWrap = $(".topstart .progress-wrap") || $(".progress-wrap");
      if (progressWrap) {
        progressWrap.setAttribute("aria-valuenow", pct.toFixed(2));
        progressWrap.classList.toggle("waiting", !!s.running);
        progressWrap.classList.toggle("failed", !!s.error);
      }
      if ($("#start-percent")) $("#start-percent").textContent = pct.toFixed(2) + "%";
      const elapsed = s.running && s.started_at
        ? Math.max(0, Math.floor(Date.now() / 1000 - s.started_at)) : 0;
      const elapsedLabel = elapsed
        ? ` · ${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")} elapsed` : "";
      if ($("#start-label")) $("#start-label").textContent = s.error ? "❌ " + s.error : label + elapsedLabel;

      const startBtn = $("#start-btn");
      const cancelBtn = $("#cancel-btn");
      if (startBtn) {
        startBtn.disabled = !!s.running;
        startBtn.classList.toggle("is-running", !!s.running);
        const lbl = startBtn.querySelector(".rail-label");
        if (lbl) lbl.textContent = s.running ? `${Math.round(pct)}%` : "Play";
      }
      if (cancelBtn) {
        // Keep Stop button permanently visible in the 3-button bottom-left stack (Play -> Stop -> Reset)
        cancelBtn.classList.remove("hidden");
        cancelBtn.classList.toggle("is-active", !!s.running);
      }

      if (s.running) {
        status(`▶ Starting Council (${pct.toFixed(0)}%): ${label || "initializing hosts…"}`);
        try {
          const st = await (await fetch("/api/state", { cache: "no-store" })).json();
          if (st.log && st.log.join("\n") !== $("#activity")?._raw) renderActivity(st.log);
        } catch (_) {}
      } else {
        clearInterval(_startTimer);
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.classList.remove("is-running");
          const lbl = startBtn.querySelector(".rail-label");
          if (lbl) lbl.textContent = "Play";
        }
        if (cancelBtn) {
          cancelBtn.classList.remove("hidden");
          cancelBtn.classList.remove("is-active");
        }
        try { await reloadState(); }
        catch (error) { console.warn("Could not refresh model list after startup", error); }
        if (s.error) {
          status("❌ Startup error: " + s.error);
        } else if (s.loaded) {
          const loadedText = Array.isArray(s.loaded) ? `${s.loaded.length} models (${s.loaded.slice(0, 5).join(", ")}${s.loaded.length > 5 ? "…" : ""})` : `${s.loaded} models`;
          status("council online — " + loadedText);
        }
      }
    } finally {
      tickInFlight = false;
    }
  };
  tick();
  _startTimer = setInterval(tick, 800);
}

// ── lineup ──
// ── saved custom lineups ──
async function renderSavedLineups() {
  const lst = await (await fetch("/api/custom-lineups")).json();
  const sel = $("#saved-lineups");
  sel.innerHTML = lst.length ? lst.map((l) =>
    `<option value="${l.id}">${esc(l.name)}${l.desc ? " — " + esc(l.desc) : ""}</option>`).join("")
    : '<option value="">(none saved yet)</option>';
  window._savedLineups = lst;
}
$("#sl-save").onclick = async () => {
  const name = $("#sl-name").value.trim();
  if (!name) { status("give the lineup a name first"); return; }
  const allocations = window._hostLineupsFromDOM();
  const host_configs = collectHostHardwareConfigsFromDOM();
  persistHostHardwareToLocalStorage(host_configs);
  const res = await postJSON("/api/custom-lineups", {
    name,
    desc: $("#sl-desc").value.trim(),
    host_configs,
    lineup: { lineup: window._lineupFromDOM(), allocations, host_configs },
  });
  if (res.ok) {
    $("#sl-name").value = "";
    $("#sl-desc").value = "";
    await renderSavedLineups();
    status(`lineup "${name}" + Host A/B/C hardware accelerators saved — pick it anytime`);
  } else {
    status("save failed: " + res.error);
  }
};
$("#sl-apply").onclick = async () => {
  const l = (window._savedLineups || []).find((x) => x.id === $("#saved-lineups").value);
  if (!l) { status("nothing selected"); return; }
  if (l.lineup?.allocations) {
    STATE.lineup = l.lineup.lineup || {};
    STATE.host_lineups = l.lineup.allocations;
  } else {
    STATE.lineup = l.lineup;
    STATE.host_lineups = null;
  }
  const savedHw = l.host_configs || l.lineup?.host_configs;
  if (savedHw) {
    persistHostHardwareToLocalStorage(savedHw);
    const pub = await postJSON("/api/lineup/publish", {
      lineup: STATE.lineup,
      allocations: STATE.host_lineups,
      host_configs: savedHw,
    }).catch(() => null);
    if (pub?.hosts) {
      STATE.runtime_hosts = pub.hosts;
      STATE.colab_hosts = pub.hosts;
    }
  }
  renderLineup();
  status(`lineup "${l.name}" applied — 🚀 Start to load it`);
};
$("#sl-delete").onclick = async () => {
  const id = $("#saved-lineups").value;
  if (!id) return;
  await fetch("/api/custom-lineups/" + id, { method: "DELETE" });
  await renderSavedLineups(); status("saved lineup deleted");
};

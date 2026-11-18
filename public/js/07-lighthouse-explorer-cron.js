// ── Semi-Opaque Specialist Agent Lighthouse Hover Popover (Plain-English "For Beginners" Complete Guide) ──
const SPECIALIST_AGENT_LIGHTHOUSE_INTEL = {
  // ══ GROUP 1: CODING, APP BUILDING & DEVOPS (12 SPECIALISTS) ══
  "cool-fullstack-gui-exe-forge": {
    category: "Coding, App Building & DevOps",
    what: "Builds complete, ready-to-use apps from start to finish—whether you want a website, a command-line tool, a desktop window app, or a standalone Windows .exe file you can double-click.",
    tasks: [
      "Writes both the visual screen and the behind-the-scenes server logic with zero unfinished blanks",
      "Tests the app automatically in the terminal to make sure it actually starts and works",
      "Packages the finished project into a downloadable folder, launcher script, or Windows .exe",
    ],
    example: "Build me a complete dark-mode file organizer with a desktop window, a command-line option, and a 1-click Windows .exe build script.",
  },
  "cool-autonomous-decompiler-architect": {
    category: "Coding, App Building & DevOps",
    what: "Takes unreadable, scrambled, compressed, or old mystery code and turns it back into clean, organized, easy-to-read source files with clear comments.",
    tasks: [
      "Unscrambles squished one-line JavaScript/Python bundles into neat, labeled files and folders",
      "Figures out how undocumented apps or hidden APIs talk to each other and writes clean code for them",
      "Draws simple visual flowcharts explaining how the recovered program works step by step",
    ],
    example: "Take this messy 3,000-line compressed script and turn it into clean, readable files with comments explaining every part.",
  },
  "coding-python-automation-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Your go-to Python coder. Writes clean Python scripts that automate boring computer chores, process spreadsheets/JSON files, run background tasks, or build handy command-line tools.",
    tasks: [
      "Automates repetitive file renaming, folder sorting, PDF/CSV cleanup, and scheduled tasks",
      "Builds fast command-line tools with clear `--help` menus and progress bars",
      "Checks and runs every Python script automatically so you never get annoying crash errors",
    ],
    example: "Write a Python script that watches my Downloads folder, sorts files by type into dated folders, and logs duplicates to a CSV.",
  },
  "coding-frontend-ui-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Designs and fixes everything you see and click on a webpage—making dashboards, buttons, menus, and pop-ups look sharp, fit cleanly inside their boxes, and work on any screen size.",
    tasks: [
      "Builds clean React, HTML, and modern CSS interfaces with smooth dark/light themes",
      "Fixes sloppy text cutoffs, overlapping buttons, broken scrollbars, and cramped layouts",
      "Adds responsive menus, search filters, keyboard shortcuts, and live interactive charts",
    ],
    example: "Redesign our dashboard cards so they sit side by side cleanly, fit mobile and desktop screens, and never spill text outside boxes.",
  },
  "coding-backend-api-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Builds the engine room behind websites and apps—creating fast servers that save data, handle user logins, process requests, and stream live updates without crashing.",
    tasks: [
      "Creates Node.js, Python FastAPI/Flask, or Go server routes for saving and loading app data",
      "Sets up secure user sign-in, rate limits (to stop spam), and clean error messages",
      "Adds live WebSocket/streaming channels so pages update instantly without refreshing",
    ],
    example: "Build a fast Node.js or FastAPI backend with user login, file upload routes, rate limiting, and live status updates.",
  },
  "coding-database-sql-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Organizes where and how your app stores information—designing clean database tables, making slow searches run 10x faster, and upgrading databases without losing a single row.",
    tasks: [
      "Designs clean tables for SQLite, PostgreSQL, MySQL, or MongoDB so data never gets tangled",
      "Finds why a search or report is slow and adds smart indexes to make it instant",
      "Writes safe backup, import/export, and upgrade scripts so existing user data stays safe",
    ],
    example: "Design a fast SQLite/Postgres database for 100,000 product listings with instant search indexes and a safe CSV importer.",
  },
  "coding-systems-rust-cpp-go-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Writes heavy-duty, ultra-fast native programs in Rust, C, C++, and Go when Python or JavaScript isn't fast enough—ideal for high-speed scanners, game/media tools, and tiny single-file binaries.",
    tasks: [
      "Builds lightning-fast compiled command-line tools that use almost zero RAM",
      "Runs thousands of network or file tasks in parallel across all your CPU cores",
      "Compiles standalone native executables with safety checks so memory leaks don't happen",
    ],
    example: "Write a super-fast Go or Rust command-line tool that hashes and compares 50,000 files across folders in under two seconds.",
  },
  "coding-shell-powershell-bash-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Writes one-click terminal scripts for Linux/Mac (`bash`) and Windows (`PowerShell` & `CMD`) that install software, configure servers, back up folders, and manage running programs.",
    tasks: [
      "Creates automatic 1-click setup and installer scripts for Windows, Linux, or Colab",
      "Automates backups, log cleanup, firewall rules, and auto-restarting crashed services",
      "Adds safety checks so a script stops cleanly instead of deleting the wrong folder",
    ],
    example: "Write both a Windows PowerShell script and a Linux Bash script that install dependencies, start our server, and auto-restart it on crash.",
  },
  "coding-debugger-refactor-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Your code detective and mechanic. Reads cryptic red error messages, hunts down the exact line causing a crash, freeze, or broken button, fixes it, and tidies up messy code.",
    tasks: [
      "Translates confusing error logs into plain English and pinpoints the exact broken file and line",
      "Fixes crashes, missing imports, infinite loops, and features that silently stop working",
      "Cleans up duplicated, hard-to-read spaghetti code without breaking working features",
    ],
    example: "Find out why our app throws a ReferenceError on startup and why the save button isn't saving, fix both bugs, and verify it runs.",
  },
  "coding-qa-test-automation-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Acts like a ruthless quality inspector—writing automatic tests that click every button, hit every API route, and type weird edge-case inputs to catch bugs before users see them.",
    tasks: [
      "Writes automated test suites (pytest, Jest, Playwright) that verify your whole app in seconds",
      "Tests blank forms, huge files, emojis, bad passwords, and slow internet drops",
      "Gives you a simple pass/fail checklist proving every requested feature genuinely works",
    ],
    example: "Write an automated test script that checks signup, login, saving custom presets, and error handling, and run it live.",
  },
  "coding-devops-docker-cicd-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Packs your app into a neat shipping container (Docker) so it runs identically on any computer or cloud server without 'it worked on my machine' headaches, plus sets up auto-builds.",
    tasks: [
      "Writes clean `Dockerfile` and `docker-compose.yml` files so your whole app starts in 1 command",
      "Sets up GitHub Actions to automatically test and build your code on every save",
      "Configures Nginx/Caddy web servers, HTTPS certificates, and environment variables safely",
    ],
    example: "Create a 1-command Docker Compose setup + GitHub Actions build workflow for our web app and database.",
  },
  "coding-api-bot-integration-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Connects different apps and services together—wiring up Discord/Telegram/Slack bots, Stripe payments, GitHub/Hugging Face APIs, webhooks, and custom AI tools.",
    tasks: [
      "Builds interactive Discord, Telegram, or Slack bots with slash commands and alerts",
      "Connects third-party REST APIs, OAuth logins, and incoming webhooks with automatic retries",
      "Creates custom MCP tool plugins so your AI agents can talk to any external service",
    ],
    example: "Build a Discord/Telegram alert bot + webhook receiver that posts a formatted summary whenever a scan or build finishes.",
  },

  // ══ GROUP 2: WEB, API & INJECTION SECURITY (4 SPECIALISTS) ══
  "offsec-web-api-pentester": {
    category: "Web, API & Injection Security",
    what: "Tests websites and backend APIs the way a ethical hacker does—checking if User A can peek at User B's private data, bypass login screens, or abuse hidden API endpoints.",
    tasks: [
      "Checks every web route to see if changing an ID number leaks another user's account data",
      "Tests forms, file uploads, and API endpoints for common security holes (OWASP Top 10)",
      "Writes a safe test script proving the flaw plus the exact code patch to lock it shut",
    ],
    example: "Test all `/api/*` routes in our web app for broken permissions or private data leaks, show what failed, and fix the routes.",
  },
  "sqli-query-sink-specialist": {
    category: "Web, API & Injection Security",
    what: "Checks every search bar, login box, and URL parameter to see if typing tricky database characters (`' OR 1=1`) could trick your database into dumping private records—and locks every query down.",
    tasks: [
      "Scans your code for unsafe database queries built by gluing raw user text together",
      "Runs safe test inputs to check if SQL or NoSQL queries misbehave or leak database errors",
      "Rewrites vulnerable database calls into locked parameterized queries so user text can never run as commands",
    ],
    example: "Scan our database code for SQL injection weak spots, prove which queries are unsafe, and rewrite them safely.",
  },
  "xss-dom-csp-specialist": {
    category: "Web, API & Injection Security",
    what: "Finds places where someone could sneak hidden JavaScript into a comment, profile name, or link so it runs inside other visitors' browsers (XSS)—and installs browser shields to stop it.",
    tasks: [
      "Finds unsafe HTML rendering spots (`innerHTML`) where untrusted text gets injected into the page",
      "Cleans and escapes user-submitted text so browsers display it safely instead of running it as code",
      "Sets up a Content-Security-Policy (CSP) browser header that blocks unauthorized scripts automatically",
    ],
    example: "Check our frontend for Cross-Site Scripting (XSS) holes in user inputs, sanitize unsafe HTML spots, and add a CSP header.",
  },
  "blackhat-sim-evasion-analyst": {
    category: "Web, API & Injection Security",
    what: "Tests whether sneaky, scrambled, or weirdly formatted text (like double-encoded links or lookalike letters) can slip past your app's security filters or firewall.",
    tasks: [
      "Throws disguised, encoded, and weird character tricks at your input validators and WAF rules",
      "Spots mismatches where your firewall sees safe text but your backend server sees an attack",
      "Upgrades your input cleaner so it unscrambles text first before checking if it is safe",
    ],
    example: "Test if encoded or disguised text can sneak past our input filter, and upgrade the filter so nothing slips through.",
  },

  // ══ GROUP 3: NETWORK, PORTS, MITM & PROXIES (6 SPECIALISTS) ══
  "nmap-port-weakness-auditor": {
    category: "Network, Ports, MitM & Proxies",
    what: "Uses Nmap like checking every door and window on a building—finding which network ports are wide open, what software versions are answering, which ones have known weaknesses, and how to close unnecessary doors.",
    tasks: [
      "Scans authorized targets with Nmap to list every open port and the exact program running behind it",
      "Runs safe Nmap diagnostic checks to flag outdated services, weak encryption, or default logins",
      "Turns messy Nmap scan data into a plain-English weakness report plus ready-to-run firewall rules",
    ],
    example: "Scan my local server with Nmap to see which ports and services are exposed, explain any weaknesses found, and give me firewall lockdown rules.",
  },
  "offsec-network-port-auditor": {
    category: "Network, Ports, MitM & Proxies",
    what: "Builds super-fast custom network scanners that map out live devices, check thousands of ports in seconds, and inspect HTTPS/SSL security certificates for expiration or weak encryption.",
    tasks: [
      "Sweeps local or lab networks quickly to discover active hosts and open TCP/UDP ports",
      "Checks SSL/TLS certificates to warn about expired certs, weak ciphers, or misconfigured HTTPS",
      "Exports a clean map of everything running on your network in JSON or HTML",
    ],
    example: "Build a fast Python network scanner that checks ports 1–1024 on my lab subnet and grades each server's HTTPS certificate.",
  },
  "mitm-tls-transport-specialist": {
    category: "Network, Ports, MitM & Proxies",
    what: "Checks if someone sitting between your app and the server (like on public Wi-Fi or a bad router) could secretly read or alter passwords and data in transit—and forces end-to-end encryption.",
    tasks: [
      "Finds dangerous code settings that turn off SSL certificate checks or allow unencrypted `http://` links",
      "Tests whether connections can be tricked into downgrading from secure HTTPS to plain text",
      "Enforces strict HTTPS/WSS encryption, HSTS headers, and certificate verification everywhere",
    ],
    example: "Check all network calls in our app for Man-in-the-Middle eavesdropping risks and lock everything to verified HTTPS/TLS.",
  },
  "arp-lan-spoofing-specialist": {
    category: "Network, Ports, MitM & Proxies",
    what: "Watches local Wi-Fi and office LAN networks for 'ARP poisoning'—where a sneaky device on the same Wi-Fi pretends to be the Wi-Fi router so everyone's internet traffic flows through them first.",
    tasks: [
      "Checks your computer's local network table to see if two devices claim the router's identity",
      "Builds a lightweight background watcher that alerts you the instant someone tries Wi-Fi/LAN spoofing",
      "Generates router and switch settings (ARP inspection & network isolation) to block LAN spoofing cold",
    ],
    example: "Build a local Wi-Fi/LAN monitor script that alerts me immediately if another device tries ARP spoofing our router.",
  },
  "proxy-hunter-validator-specialist": {
    category: "Network, Ports, MitM & Proxies",
    what: "Hunts down HTTP, HTTPS, SOCKS4, and SOCKS5 proxies from public sources or your own lists, tests hundreds at once to throw out dead/slow ones, and checks if they truly hide your real IP.",
    tasks: [
      "Gathers and tests hundreds of proxies in parallel to measure exact speed (ping) and uptime",
      "Separates truly anonymous ('Elite') proxies from leaky ones that still reveal your real IP address",
      "Checks that bad proxies aren't tampering with traffic and saves a clean list of fast working proxies",
    ],
    example: "Hunt down and test working HTTP and SOCKS5 proxies, filter out slow or IP-leaking ones, and save the fastest anonymous list.",
  },
  "blackhat-sim-protocol-mutator": {
    category: "Network, Ports, MitM & Proxies",
    what: "Stress-tests servers by sending intentionally broken, half-finished, or weirdly sized network packets to make sure strange internet traffic can never crash or freeze your server.",
    tasks: [
      "Sends malformed HTTP, WebSocket, and raw TCP test packets to a local server to see how it reacts",
      "Catches 'request smuggling' bugs where front-end proxies and back-end servers disagree on packet sizes",
      "Verifies your server drops bad packets cleanly instead of hanging or running out of memory",
    ],
    example: "Send malformed HTTP and WebSocket test frames at localhost:3000 to make sure weird traffic doesn't crash or hang the server.",
  },

  // ══ GROUP 4: OSINT, DARK WEB, SCRAPING & SOCIAL RECON (7 SPECIALISTS) ══
  "darkweb-onion-osint-specialist": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Scans dark web search indexes, hacker paste boards, and public breach trackers for leaked emails, passwords, company data, and brand-new data breaches—while keeping your real IP hidden.",
    tasks: [
      "Searches dark web (.onion) indexes and paste dumps safely through Tor/proxy privacy routing",
      "Checks if your email addresses, domain names, or API keys showed up in recent data breaches",
      "Collects and cleans up leaked breach findings into a simple, easy-to-read alert report",
    ],
    example: "Scan dark web indexes and public breach feeds for leaked data or new breaches mentioning our domain, and summarize what was exposed.",
  },
  "web-crawler-scraper-specialist": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Automatically browses websites across hundreds of pages, pulls out the exact info you want (prices, emails, articles, tables, product lists), and saves everything into a clean spreadsheet or database.",
    tasks: [
      "Follows links, sitemaps, and 'Next Page' buttons automatically without getting stuck in loops",
      "Extracts clean titles, prices, tables, images, and hidden JSON data from messy web pages",
      "Supports polite speed limits, proxy rotation, and instant export to CSV, Excel-ready JSON, or SQLite",
    ],
    example: "Build a fast web scraper that crawls all pages of a directory site, extracts names, links, and prices, and saves a clean CSV.",
  },
  "osint-domain-asn-cert-scout": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Looks up everything publicly visible on the internet about a website or company—finding hidden subdomains (`dev.example.com`), hosting providers, DNS records, and forgotten cloud storage.",
    tasks: [
      "Finds every subdomain ever registered for a website using public SSL certificate logs",
      "Looks up who hosts the servers, email DNS settings, and domain registration history",
      "Spots forgotten subdomains pointing to deleted cloud accounts before someone else claims them",
    ],
    example: "Find all public subdomains, DNS records, and hosting servers connected to our domain without needing any paid API keys.",
  },
  "osint-breach-secret-leak-hunter": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Digs through code folders, `.env` files, build bundles, and old Git save history to catch passwords, API keys, or cloud tokens that someone accidentally left in the code—even months ago.",
    tasks: [
      "Scans both current files and deleted Git commit history for forgotten API keys and passwords",
      "Checks `package.json` and Python requirements for risky or fake lookalike package names",
      "Sets up automatic save-checks so nobody can accidentally upload a secret key to GitHub again",
    ],
    example: "Scan our entire project and old Git history for any accidentally saved API keys, tokens, or passwords.",
  },
  "osint-cve-threat-feed-correlator": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Reads the list of software libraries and server versions you use and checks live government and security bug feeds to warn you which ones hackers are actively attacking right now.",
    tasks: [
      "Checks your `package.json`, `requirements.txt`, or server versions against official CVE bug lists",
      "Highlights top-priority bugs that are actively being exploited in the real world right now",
      "Gives you the exact update commands to upgrade vulnerable packages safely",
    ],
    example: "Check all packages in our project against live security bug databases and tell me which ones urgently need updating.",
  },
  "socmint-handle-graph-mapper": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Searches a username, handle, or brand name across dozens of public social media and developer sites to map out a public online footprint and spot fake impersonator accounts.",
    tasks: [
      "Checks where the same username appears across GitHub, Reddit, X, forums, and coding sites",
      "Connects public bio links, public emails, and profile details into an easy visual map",
      "Finds lookalike copycat accounts pretending to be your brand or team members",
    ],
    example: "Check where a username appears across 25 public tech and social platforms and flag any lookalike impersonator handles.",
  },
  "socmint-narrative-botnet-detector": {
    category: "OSINT, Dark Web, Scraping & Social Recon",
    what: "Inspects hidden details inside uploaded photos/PDFs (like camera type, date, GPS location, or editing app) and analyzes social posts to spot fake bot networks posting in sync.",
    tasks: [
      "Reads—or strips out—hidden EXIF camera, software, and GPS location tags inside images and PDFs",
      "Detects unnatural bursts of accounts posting the exact same message at the exact same second",
      "Generates clear charts and reports showing real activity vs. automated bot clusters",
    ],
    example: "Check a folder of images for hidden GPS/camera metadata and build a script to strip all private metadata cleanly.",
  },

  // ══ GROUP 5: EXPLOIT TESTING, METASPLOIT & MALWARE FORENSICS (8 SPECIALISTS) ══
  "metasploit-cve-surface-specialist": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Takes the software versions running on a server (like from an Nmap scan) and checks if public Metasploit attack modules already exist for them—so you know which unpatched bugs are dangerous right now.",
    tasks: [
      "Cross-checks open ports and software versions against known Metasploit bug advisories",
      "Ranks security weaknesses from 'fix immediately' down to 'low risk' based on real-world danger",
      "Writes step-by-step patching and firewall lockdown instructions for every exposed service",
    ],
    example: "Match our server's open service versions against known Metasploit CVE bugs and rank what we need to patch first.",
  },
  "exploit-boundary-poc-architect": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Takes a reported security bug and builds a safe, harmless local test script ('Proof of Concept') that proves whether your code is actually vulnerable—then writes the patch and proves it's fixed.",
    tasks: [
      "Turns confusing bug reports into a simple 1-click test script that says VULNERABLE or SAFE",
      "Pinpoints the exact line of code where bad file paths, oversized numbers, or bad data break things",
      "Applies the fix and re-runs the test automatically to prove the hole is 100% closed",
    ],
    example: "Build a safe local test script to check if our ZIP uploader allows files to escape the upload folder, then fix the bug.",
  },
  "redhat-exploit-poc-verifier": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Doesn't just guess about security bugs on paper—actually runs live security checks against your local project in the terminal to verify what's truly vulnerable and confirm patches work.",
    tasks: [
      "Runs live terminal tests against local logins, open ports, and APIs instead of guessing",
      "Pairs every security finding with a working code fix tested right in the sandbox",
      "Produces clear before-and-after proof logs showing the issue was fixed",
    ],
    example: "Run a live local security check on our app, verify which bugs are real, patch them, and re-test until everything passes.",
  },
  "exploit-memory-binary-auditor": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Checks compiled programs (`.exe` files, Linux binaries, and C/C++/Rust code) for memory crashes, buffer overflows, and missing built-in compiler safety shields.",
    tasks: [
      "Inspects compiled `.exe` and Linux binary files to see if modern crash protections are turned on",
      "Scans C, C++, and Rust code for memory mistakes where oversized input could crash the program",
      "Recompiles with memory-safety detectors to catch and fix hidden crashes cleanly",
    ],
    example: "Inspect our compiled binary and C++ source files for memory crash risks or missing safety flags, and fix them.",
  },
  "exploit-race-concurrency-striker": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Tests what happens if someone clicks 'Buy' or 'Redeem Coupon' 50 times in the exact same millisecond—catching timing bugs where someone could withdraw twice or corrupt saved files.",
    tasks: [
      "Fires dozens of simultaneous requests at the exact same instant at balance, coupon, or save routes",
      "Catches file-saving collisions where two tasks overwrite each other mid-save",
      "Adds proper database locks so requests line up safely one at a time",
    ],
    example: "Send 50 simultaneous requests at our credit-redeem endpoint to see if a coupon can be used twice, then lock it down.",
  },
  "malware-static-unpacker-analyst": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Examines suspicious or heavily scrambled scripts and files WITHOUT running them—peeling back layers of encoding (like Base64) to show you any hidden web links, IPs, or commands inside.",
    tasks: [
      "Unwraps scrambled PowerShell, JavaScript, or Python scripts safely without ever executing them",
      "Pulls out hidden URLs, IP addresses, and file names tucked inside encoded text",
      "Explains in plain English what a mysterious script was actually trying to do",
    ],
    example: "Safely decode this scrambled PowerShell/JavaScript file without running it and tell me in plain English what it does.",
  },
  "malware-sandbox-behavior-tracer": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Runs an untrusted script inside a locked, isolated test cage while recording every single file it tries to read, change, or create and every internet address it tries to contact.",
    tasks: [
      "Monitors a program step-by-step inside an isolated box with internet access blocked",
      "Flags sneaky behavior like trying to auto-start on boot or read password files",
      "Gives you a clean timeline of everything the file did from start to finish",
    ],
    example: "Run this unknown Python script inside an isolated monitor with network access blocked and list every file it tries to touch.",
  },
  "malware-c2-beacon-hunter": {
    category: "Exploit Testing, Metasploit & Malware Forensics",
    what: "Reviews network connection logs to spot infected computers secretly 'checking in' with a hacker's command server every few minutes or sneaking stolen data out through weird DNS lookups.",
    tasks: [
      "Spots suspicious background apps making rhythmic, hidden internet callbacks on a timer",
      "Detects sneaky data leaks disguised inside strange, extra-long website lookup (DNS) requests",
      "Creates instant firewall blocklists to cut off suspicious background connections",
    ],
    example: "Analyze our connection and DNS logs to see if any background process is making suspicious periodic callbacks, and write firewall block rules.",
  },

  // ══ GROUP 6: SYSTEM HARDENING & CLOUD SECURITY (5 SPECIALISTS) ══
  "redhat-kernel-hardener": {
    category: "System Hardening & Cloud Security",
    what: "Acts like a master locksmith for Linux servers and Docker containers—turning off risky system permissions so even if one app has a bug, an intruder stays trapped and can't take over the whole computer.",
    tasks: [
      "Locks down Docker containers so they don't run with unrestricted 'root' admin superpowers",
      "Tunes Linux system security settings to block common network and memory tricks",
      "Writes safe lockdown scripts with an undo/restore option in case you ever want to revert",
    ],
    example: "Lock down our Dockerfile and Linux server settings so the app runs safely with minimum permissions instead of full root access.",
  },
  "redhat-zero-trust-iam": {
    category: "System Hardening & Cloud Security",
    what: "Inspects how your app handles user logins, session cookies, OAuth ('Sign in with Google/GitHub'), and admin permissions—making sure nobody can forge a login token or sneak into admin screens.",
    tasks: [
      "Tests login tokens (JWTs) and cookies to ensure attackers cannot fake or extend expired logins",
      "Verifies regular users are strictly blocked from admin-only buttons and backend routes",
      "Fixes weak password/token handling with modern, tamper-proof login checks",
    ],
    example: "Check our login tokens and admin routes to make sure a normal logged-in user can never fake admin access.",
  },
  "redhat-siem-detection": {
    category: "System Hardening & Cloud Security",
    what: "Builds smart security cameras and tripwire alarms for your servers—reading messy system and web logs to alert you right away if someone tries brute-force logins or suspicious commands.",
    tasks: [
      "Writes detection rules (YARA & Sigma) that catch known hacker tools and suspicious files",
      "Scans web server and Linux login logs to spot password-guessing bursts or weird shell commands",
      "Tunes alerts carefully so you only get warned about real threats, not harmless everyday noise",
    ],
    example: "Write a log watcher script that reads our server logs and alerts us whenever someone triggers 10 failed logins or suspicious URLs.",
  },
  "offsec-cloud-k8s-pentester": {
    category: "System Hardening & Cloud Security",
    what: "Checks cloud accounts (AWS, Google Cloud, Azure), Docker setups, and Kubernetes clusters for accidental public file buckets, overly broad cloud keys, or containers that can escape onto the host.",
    tasks: [
      "Scans Kubernetes and Docker config files for dangerous settings that expose the host machine",
      "Audits cloud permissions to make sure one leaked cloud key doesn't grant full account control",
      "Rewrites cloud and container config files with safe, locked-down settings",
    ],
    example: "Check our Docker and Kubernetes YAML files for risky permissions or exposed secrets, and generate safe versions.",
  },
  "blackhat-sim-apt-emulator": {
    category: "System Hardening & Cloud Security",
    what: "Thinks like a persistent hacker planning a multi-step break-in—mapping how someone could start at a small outer flaw and hop step-by-step toward your database, then showing you where to put roadblocks.",
    tasks: [
      "Maps out realistic multi-step attack paths across your web app, servers, and cloud keys",
      "Shows which single weak link would let an intruder jump from one service to another",
      "Gives you simple choke-point fixes that break the entire attack chain early",
    ],
    example: "Review our app architecture, map how an attacker could move from our public web server to internal data, and tell us where to add walls.",
  },

  // ══ GROUP 7: SWARM BRAINS, CODE MERGERS & SAFETY GUARDS (6 SPECIALISTS) ══
  "cool-quantum-chaos-twin-simulator": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "Runs safe 'what-if' disaster drills on your software—simulating huge traffic spikes, slow internet, or a server suddenly dying—and writes automatic recovery code so your app stays online.",
    tasks: [
      "Simulates thousands of users, random network drops, or dead GPU tunnels to see what breaks first",
      "Measures exact slowdown points and failure rates before real customers ever hit them",
      "Writes automatic retry, backup-server failover, and overload protection code",
    ],
    example: "Simulate what happens to our 4-host GPU setup if 2 hosts suddenly disconnect mid-job, and write automatic failover routing.",
  },
  "swarm-queen-dag-decomposer": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "The project manager of the AI Swarm. Takes your big prompt and slices it into neat, separate to-do assignments for each AI worker so nobody steps on each other's toes or writes duplicate files.",
    tasks: [
      "Splits large app or security jobs into clear separate parts (Frontend, Backend, Database, Tests)",
      "Agrees on exact file names and how parts connect before any worker starts typing code",
      "Prevents two AI models from wasting time writing the exact same file twice",
    ],
    example: "Split a full-stack web scraper + dashboard build across 4 parallel AI hosts so every file snaps together cleanly.",
  },
  "ast-compiler-pregate-verifier": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "An automatic proofreader for code. Before any AI-written file is accepted, it runs real syntax and compiler checks to catch typos, cut-off lines, or fake libraries—and forces an instant fix.",
    tasks: [
      "Checks every Python, JavaScript/TypeScript, Bash, and PowerShell file for syntax errors automatically",
      "Catches cut-off code or made-up package imports before they break your merged project",
      "Sends any broken file right back for automatic repair up to 3 times until it compiles clean",
    ],
    example: "Check all generated project files for syntax or import errors and auto-fix anything broken before packaging.",
  },
  "vram-context-oom-router-guard": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "Traffic cop for your GPUs and models. Watches how much video memory (VRAM) Hosts A–D have left so they don't crash, and sends sensitive security prompts straight to unrestricted models that won't refuse.",
    tasks: [
      "Keeps GPU memory usage in the safe zone by automatically picking lighter model compression when needed",
      "Reroutes tasks instantly away from offline or slow Colab/Kaggle tunnels to healthy hosts",
      "Sends red-team and security prompts to abliterated/unrestricted models so you don't get lectured",
    ],
    example: "Balance our active models across Hosts A–D so no GPU runs out of memory and route security prompts to unrestricted models.",
  },
  "cross-agent-dedup-merge-surgeon": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "Takes all the separate files created by different AI models, throws out duplicates, combines the best parts of each, and wires up one clean `package.json` / `requirements.txt` and start command.",
    tasks: [
      "Merges code from multiple AI agents into one neat, organized project folder",
      "Fixes mismatched function names or settings when two models named things slightly differently",
      "Creates the final 1-click run script so the merged package launches immediately",
    ],
    example: "Merge the files from all 4 agents into one clean project folder with zero duplicate files and a working start command.",
  },
  "opsec-sandbox-rollback-sentinel": {
    category: "Swarm Brains, Code Mergers & Safety Guards",
    what: "Your privacy and safety bodyguard. Scans outgoing files and ZIP downloads to make sure your personal GitHub, Hugging Face, or Kaggle keys never get accidentally bundled inside, and protects system folders.",
    tasks: [
      "Automatically scrubs private `GH_TOKEN`, `HF_TOKEN`, and API keys out of generated code and ZIPs",
      "Blocks wild terminal commands from touching files outside your project workspace",
      "Keeps clean file backups so a bad code merge can always be undone cleanly",
    ],
    example: "Check all merged files before creating the downloadable ZIP to guarantee none of my private API tokens are inside.",
  },
  "automation-form-workflow-specialist": {
    category: "Coding, App Building & DevOps",
    what: "Your automatic web-form filler and browser robot. Writes scripts that open web pages, type into text boxes, pick dropdown menus, check boxes, upload files, click Submit, and verify everything worked without you lifting a finger.",
    tasks: [
      "Automatically fills single-page or multi-step web forms, checkout flows, and onboarding wizards using Playwright, Selenium, or fast HTTP requests",
      "Handles annoying form hurdles like login cookies, hidden CSRF tokens, dynamic popups, and file upload buttons",
      "Saves confirmation receipts, status codes, or screenshots so you know every form submission succeeded",
    ],
    example: "Build a Python Playwright script that reads rows from a CSV file, fills out our multi-step registration form, uploads a sample PDF, and logs every confirmation message.",
  },
  "auth-email-username-password-specialist": {
    category: "Web, API & Injection Security",
    what: "Your signup, email, username, and password security & QA tester. Generates realistic test accounts for your apps, checks if email domains can actually receive mail, and tests login/reset forms to make sure passwords are stored safely and hackers are rate-limited.",
    tasks: [
      "Creates clean batches of synthetic QA test emails, usernames, and strong passwords for testing signup and login flows",
      "Checks email domain health (MX, SPF, DKIM, DMARC) so verification and password-reset emails don't land in spam",
      "Audits login and password-reset pages on your apps for username leaks, weak password rules, missing rate-limits, and upgrades hashing to Argon2id/bcrypt",
    ],
    example: "Audit our signup, email verification, and password login endpoints—generate 10 test accounts, verify rate-limiting blocks rapid retries, and upgrade password storage to Argon2id.",
  },
  "network-proxy-scraper-csv-specialist": {
    category: "Network, Ports, MitM & Proxies",
    what: "Your automatic proxy hunter, speed tester, and CSV spreadsheet builder. Searches public lists for free HTTP, SOCKS4, and SOCKS5 proxies, tests each one live to see if it actually connects and how fast it responds, looks up what country it is in, grades its quality, and saves the winners into a clean CSV file for later use.",
    tasks: [
      "Gathers HTTP, SOCKS4, and SOCKS5 proxies from multiple live public proxy directories automatically",
      "Tests real socket handshakes, measures exact speed in milliseconds, checks the Country code, and grades Quality (Elite, Fast, Good, or Slow)",
      "Saves all verified proxies into `proxies_verified.csv` with Country, Protocol, IP:Port, Speed, and Quality columns ready to download or plug into any scraper",
    ],
    example: "Scrape live HTTP, SOCKS4, and SOCKS5 proxies, test their speed and quality, look up each proxy's country, and save all working proxies into proxies_verified.csv.",
  },
};

function resolveSpecialistAgentIntel(rawKey) {
  const key = String(rawKey || "").trim();
  if (!key) return null;
  const cleanId = key.replace(/^custom:/i, "").trim();

  // 1. Direct ID match in rich intel DB
  if (SPECIALIST_AGENT_LIGHTHOUSE_INTEL[cleanId]) {
    const base = SPECIALIST_AGENT_LIGHTHOUSE_INTEL[cleanId];
    const catalogObj =
      (Array.isArray(AGENTS) && AGENTS.find((a) => a.id === cleanId)) ||
      BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === cleanId);
    return {
      title: catalogObj?.name || cleanId,
      category: base.category,
      temp: catalogObj?.temperature ?? 0.3,
      toolsCount: Array.isArray(catalogObj?.tools) ? catalogObj.tools.length : 5,
      what: base.what,
      tasks: base.tasks,
      example: base.example,
    };
  }

  // 2. Match by displayed Agent Name or partial ID (e.g. when bound on Host A/B/C/D as `hc.assigned_agent`)
  const keyLower = cleanId.toLowerCase();
  const matchedAgent =
    (Array.isArray(AGENTS) &&
      AGENTS.find(
        (a) =>
          String(a.id || "").toLowerCase() === keyLower ||
          String(a.name || "").toLowerCase() === keyLower ||
          keyLower.includes(String(a.id || "___").toLowerCase())
      )) ||
    BUILTIN_SWARM_GROUP_SPECIALISTS.find(
      (s) =>
        String(s.id || "").toLowerCase() === keyLower ||
        String(s.name || "").toLowerCase() === keyLower
    );

  if (matchedAgent && SPECIALIST_AGENT_LIGHTHOUSE_INTEL[matchedAgent.id]) {
    const base = SPECIALIST_AGENT_LIGHTHOUSE_INTEL[matchedAgent.id];
    return {
      title: matchedAgent.name || key,
      category: base.category || matchedAgent.category || "Specialist Agent",
      temp: matchedAgent.temperature ?? 0.3,
      toolsCount: Array.isArray(matchedAgent.tools) ? matchedAgent.tools.length : 5,
      what: base.what,
      tasks: base.tasks,
      example: base.example,
    };
  }

  // 3. Dynamic synthesis for Custom User-Created Agents (created in Agent Forge)
  if (matchedAgent) {
    const sysTxt = String(matchedAgent.system || matchedAgent.sys || matchedAgent.role || "").trim();
    const toolsList = Array.isArray(matchedAgent.tools) && matchedAgent.tools.length
      ? matchedAgent.tools
      : ["run_command", "read_file", "write_file", "mcp_call"];
    return {
      title: matchedAgent.name || key,
      category: matchedAgent.category || "Custom Specialist Agent",
      temp: matchedAgent.temperature ?? 0.35,
      toolsCount: toolsList.length,
      what: sysTxt || "Custom autonomous tool-using specialist configured to execute shell, file, and MCP workflows on its assigned host.",
      tasks: [
        `Executes multi-round tool calls (${toolsList.slice(0, 4).join(", ")})`,
        "Runs autonomously when bound to a Host Lighthouse or Swarm Worker Group",
        "Feeds verified code & command outputs directly into the Grouped File Hub",
      ],
      example: `Run "${(matchedAgent.name || key).replace(/^[^\w#]+/, "")}" against your current workspace prompt and verify output with live terminal execution.`,
    };
  }

  return null;
}

function initSpecialistAgentLighthouseHoverPopover() {
  if (document.getElementById("agent-lighthouse-popover")) return;

  const pop = document.createElement("div");
  pop.id = "agent-lighthouse-popover";
  pop.className = "agent-lighthouse-popover";
  pop.setAttribute("role", "tooltip");
  pop.setAttribute("aria-hidden", "true");
  document.body.appendChild(pop);

  let activeAnchor = null;
  let showTimer = null;

  const hidePopover = () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    activeAnchor = null;
    pop.classList.remove("is-visible");
    pop.setAttribute("aria-hidden", "true");
  };

  const positionPopoverNear = (anchorEl) => {
    if (!anchorEl || !anchorEl.isConnected) {
      hidePopover();
      return;
    }
    const rect = anchorEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      hidePopover();
      return;
    }

    const pad = 12;
    const popW = pop.offsetWidth || 352;
    const popH = pop.offsetHeight || 235;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer placing to the right of the hovered item so vertical lists remain completely unobstructed;
    // flip to the left if near the right edge, or place above/below if narrow viewport.
    let left = rect.right + pad;
    let top = rect.top - 6;

    if (left + popW > vw - pad) {
      if (rect.left - popW - pad >= pad) {
        left = rect.left - popW - pad;
      } else {
        left = Math.max(pad, Math.min(vw - popW - pad, rect.left));
        top = rect.top - popH - 10 >= pad ? rect.top - popH - 10 : Math.min(vh - popH - pad, rect.bottom + 10);
      }
    }

    if (top + popH > vh - pad) {
      top = Math.max(pad, vh - popH - pad);
    }
    if (top < pad) {
      top = pad;
    }

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
  };

  const showPopoverFor = (anchorEl, rawKey) => {
    const intel = resolveSpecialistAgentIntel(rawKey);
    if (!intel) {
      hidePopover();
      return;
    }

    // Prevent native browser title tooltip from overlapping our frosted-glass Lighthouse
    if (anchorEl.hasAttribute("title")) {
      anchorEl.setAttribute("data-lh-saved-title", anchorEl.getAttribute("title") || "");
      anchorEl.removeAttribute("title");
    }

    const cleanCat = String(intel.category || "Specialist Agent").replace(/^[^\w#]+/, "").trim();
    pop.innerHTML = `
      <div class="agent-lh-kicker tabular-nums">
        <span>Plain-English Guide</span>
        <span aria-hidden="true">·</span>
        <span>${esc(cleanCat)}</span>
        <span aria-hidden="true">·</span>
        <span>${intel.toolsCount} Tools</span>
      </div>
      <h4 class="agent-lh-title">${esc(intel.title)}</h4>
      <p class="agent-lh-desc">${esc(intel.what)}</p>
      <div class="agent-lh-sec-lbl">Everything It Handles For You</div>
      <ul class="agent-lh-tasks-list">
        ${(intel.tasks || []).map((t) => `<li>${esc(t)}</li>`).join("")}
      </ul>
      <div class="agent-lh-example-box">
        <div class="agent-lh-example-lbl">Simple Example Request</div>
        <p class="agent-lh-example-txt">"${esc(intel.example)}"</p>
      </div>
    `;

    positionPopoverNear(anchorEl);
    pop.classList.add("is-visible");
    pop.setAttribute("aria-hidden", "false");
  };

  document.addEventListener("mouseover", (e) => {
    const target = e.target?.closest?.("[data-agent-lighthouse], #agent-pick, #run-agent");
    if (!target) {
      if (activeAnchor) hidePopover();
      return;
    }
    if (target === activeAnchor) return;

    let agentKey = target.getAttribute("data-agent-lighthouse") || "";
    if (!agentKey && (target.id === "agent-pick" || target.id === "run-agent")) {
      agentKey = target.value || "";
    }
    if (!agentKey) {
      hidePopover();
      return;
    }

    activeAnchor = target;
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      if (activeAnchor === target) {
        showPopoverFor(target, agentKey);
      }
    }, 85);
  });

  document.addEventListener("mouseout", (e) => {
    if (!activeAnchor) return;
    const related = e.relatedTarget;
    if (related && activeAnchor.contains(related)) return;
    hidePopover();
  });

  // Dismiss cleanly on scroll, click, or Escape so it never lingers over modals
  window.addEventListener("scroll", hidePopover, true);
  document.addEventListener("mousedown", () => {
    setTimeout(hidePopover, 60);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePopover();
  });
}

// Initialize Next-Gen panels, Section CLIs, HF Bucket Startup Auto-Sync, 19 Compact Boosters, and Studio Workspace Controls on startup
setTimeout(() => {
  initStudioWorkspaceControls();
  initOmegaMultiAgentWorkspace();
  initPromptEnhancementStackControls();
  initAutonomousSwarmMissionRunner();
  initTabbedHostSetupConfigurator();
  initLiveHostHeartbeatMonitor();
  initGlobalStickyFooterTerminal();
  initClosableStudioPanels();
  initSpecialistAgentLighthouseHoverPopover();
  initSmartAutoBindSpecialistRouter();
  initCustomSpecialistOneSentenceWizard();
  initProxyCsvVaultModal();
  initSectionClis();
  initCliPopupSystem();
  initSlashConfigPopupSystem();
  initLiveBackgroundConsole();
  initProjectModuleProgressBar();
  loadClusterSuperchargerState();
  runStartupHfBucketAutoSyncIfEnabled();
  loadDistilledSkillsList();
  syncA2aStealthProfileUI();
  initDefaultBrainConsole();
  syncSlotCapabilitiesStatus();
  initAllDirectTerminals();
  loadGuardianTerminal();
  initAdjustableRamSwarmStudio();
  syncRamSwarmModelsAndSetup();
  updateAgentMcpAndToolAdvisor("");
  checkAndOpenFirstTimeSetup(false);
}, 350);

// ════════════════════════════════════════════════════════════════════════════
// v=81 UPGRADES:
// 1. [TODO #1] Smart Auto-Bind Specialist Router (routes prompts to top 2–3 of 51 specialists)
// 2. [TODO #4] 1-Sentence Plain-English Custom Specialist Wizard
// 3. [#51] Live HTTP / SOCKS4 / SOCKS5 Proxy Scraper, Speed Tester & CSV Vault Modal
// ════════════════════════════════════════════════════════════════════════════

function routePromptToBestSpecialists(rawPrompt = "") {
  const p = String(rawPrompt || "").toLowerCase();
  if (!p.trim()) return [];

  const rules = [
    { rx: /proxy|socks4|socks5|proxies|ip.?port.*csv/, id: "network-proxy-scraper-csv-specialist", shortTag: "🌍#51 ProxyCSV" },
    { rx: /\bform\b|autofill|playwright|selenium|dropdown|checkbox|checkout/, id: "automation-form-workflow-specialist", shortTag: "📋#49 FormBot" },
    { rx: /\bemail\b|username|password|signup|sign-up|login|spf|dkim|argon2|bcrypt/, id: "auth-email-username-password-specialist", shortTag: "🔐#50 AuthQA" },
    { rx: /dark\s*web|\.onion|tor\b|breach|leaked/, id: "darkweb-onion-osint-specialist", shortTag: "🌑#37 DarkWeb" },
    { rx: /scrape|crawler|crawl|spider|beautifulsoup/, id: "web-crawler-scraper-specialist", shortTag: "🕷️#38 Scraper" },
    { rx: /\bnmap\b|open\s*port|port\s*scan/, id: "nmap-port-weakness-auditor", shortTag: "🌐#30 Nmap" },
    { rx: /sql\s*injection|\bsqli\b/, id: "sqli-query-sink-specialist", shortTag: "💉#31 SQLi" },
    { rx: /\bxss\b|cross-site\s*script|csp\b/, id: "xss-dom-csp-specialist", shortTag: "⚡#32 XSS" },
    { rx: /mitm|man-in-the-middle|tls|ssl/, id: "mitm-tls-transport-specialist", shortTag: "🕵️#33 MitM" },
    { rx: /\barp\b|lan\s*spoof/, id: "arp-lan-spoofing-specialist", shortTag: "📡#34 ARP" },
    { rx: /metasploit|msfconsole/, id: "metasploit-framework-auditor", shortTag: "💥#36 Metasploit" },
    { rx: /react|frontend|css|tailwind|dashboard|ui\b|layout|button/, id: "coding-frontend-ui-specialist", shortTag: "🎨#40 UI" },
    { rx: /api|express|fastapi|endpoint|backend|websocket|server/, id: "coding-backend-api-specialist", shortTag: "⚙️#41 Backend" },
    { rx: /postgres|sqlite|mysql|database|schema|\bsql\b/, id: "coding-database-sql-specialist", shortTag: "🗄️#42 SQL" },
    { rx: /rust|c\+\+|golang|\bgo\b|binary/, id: "coding-systems-rust-cpp-go-specialist", shortTag: "🦀#43 Systems" },
    { rx: /docker|ci\/cd|github\s*action|deploy|kubernetes/, id: "coding-devops-docker-cicd-specialist", shortTag: "🐳#47 DevOps" },
    { rx: /powershell|bash|shell\s*script|\.ps1|\.sh\b/, id: "coding-shell-powershell-bash-specialist", shortTag: "💻#44 Shell" },
    { rx: /bug|crash|error|fix|refactor|broken/, id: "coding-debugger-refactor-specialist", shortTag: "🐞#45 Debugger" },
    { rx: /\btest\b|pytest|jest|qa\b|unit\s*test/, id: "coding-qa-test-automation-specialist", shortTag: "🧪#46 QA" },
    { rx: /webhook|discord|telegram|slack|bot\b|stripe/, id: "coding-api-bot-integration-specialist", shortTag: "🔌#48 Bot/API" },
    { rx: /python|script|cli|exe|automate/, id: "coding-python-automation-specialist", shortTag: "🐍#39 Python" },
  ];

  const hits = [];
  for (const r of rules) {
    if (r.rx.test(p)) {
      const sp = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === r.id);
      if (sp && !hits.some((h) => h.id === sp.id)) {
        hits.push({ ...sp, shortTag: r.shortTag });
      }
      if (hits.length >= 3) break;
    }
  }
  if (!hits.length) {
    const defPy = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === "coding-python-automation-specialist");
    const defQa = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === "coding-qa-test-automation-specialist");
    if (defPy) hits.push({ ...defPy, shortTag: "🐍#39 Python" });
    if (defQa) hits.push({ ...defQa, shortTag: "🧪#46 QA" });
  }
  return hits;
}

function initSmartAutoBindSpecialistRouter() {
  const pEl = $("#prompt");
  const toggleEl = $("#smart-autobind-toggle");
  const badgeEl = $("#smart-autobind-badge");
  if (!pEl || !badgeEl) return;

  const refreshBadge = () => {
    if (toggleEl && !toggleEl.checked) {
      badgeEl.textContent = "Off";
      return;
    }
    const val = (pEl.value || "").trim();
    if (!val) {
      badgeEl.textContent = "Ready";
      return;
    }
    const picks = routePromptToBestSpecialists(val);
    badgeEl.textContent = picks.slice(0, 2).map((x) => x.shortTag).join(" + ") || "Ready";
  };

  pEl.addEventListener("input", refreshBadge);
  toggleEl?.addEventListener("change", refreshBadge);
}

function initCustomSpecialistOneSentenceWizard() {
  const btn = $("#ae-magic-build-btn");
  const inp = $("#ae-magic-sentence");
  if (!btn || !inp) return;

  btn.addEventListener("click", () => {
    const raw = (inp.value || "").trim();
    if (!raw) {
      status("⚠️ Type one simple plain-English sentence describing what your new specialist should do!");
      inp.focus();
      return;
    }
    const low = raw.toLowerCase();
    let icon = "🤖";
    let cat = "Coding, App Building & DevOps";
    let tools = ["list_dir", "read_file", "write_file", "run_command", "mcp_call"];

    if (/proxy|socks|nmap|port|mitm|arp|network/.test(low)) {
      icon = "🌐";
      cat = "Network, Ports, MitM & Proxies";
      tools.push("port_tls_probe", "fetch_url", "gather_test_proxies_csv");
    } else if (/sql|xss|login|email|password|username|api.*sec|auth/.test(low)) {
      icon = "🔐";
      cat = "Web, API & Injection Security";
      tools.push("ast_sast_audit", "fetch_url");
    } else if (/dark\s*web|scrape|crawl|osint|breach|social/.test(low)) {
      icon = "🛰️";
      cat = "OSINT, Dark Web, Scraping & Social Recon";
      tools.push("web_search", "fetch_url");
    } else if (/exploit|malware|metasploit|binary|crash/.test(low)) {
      icon = "💥";
      cat = "Exploit Testing, Metasploit & Malware Forensics";
      tools.push("entropy_yara_scan", "ast_sast_audit");
    } else if (/form|browser|ui|python|app|docker|code/.test(low)) {
      icon = "📋";
      cat = "Coding, App Building & DevOps";
      tools.push("fetch_url");
    }

    const words = raw
      .replace(/[^a-zA-Z0-9\s/-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !/^(that|this|with|from|into|automatically|should|will|make|build|for|and|the)$/i.test(w))
      .slice(0, 4)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    const genName = `${icon} ${words.join(" ") || "Custom"} Specialist`;

    if ($("#ae-name")) $("#ae-name").value = genName;
    if ($("#ae-category")) $("#ae-category").value = cat;
    if ($("#ae-role")) $("#ae-role").value = raw.endsWith(".") ? raw : `${raw}.`;
    if ($("#ae-temp")) $("#ae-temp").value = "0.25";
    if ($("#ae-rounds")) $("#ae-rounds").value = "6";
    if ($("#ae-system")) {
      $("#ae-system").value =
        `You are "${genName}" (${cat}).\n` +
        `Plain-English Mission: ${raw}\n` +
        `Execution Rules:\n` +
        `1. Inspect workspace files and environment using list_dir, read_file, and run_command.\n` +
        `2. Write complete, production-ready code with zero placeholders using write_file.\n` +
        `3. Test your output live in the terminal and summarize results clearly in plain, beginner-friendly English.`;
      $("#ae-system").dispatchEvent(new Event("input"));
    }
    $$("#ae-tools input[type='checkbox']").forEach((cb) => {
      cb.checked = tools.includes(cb.value);
    });
    status(`🪄 Auto-built "${genName}" in [${cat}] — click '💾 Save Specialist Agent' to add it to your roster!`);
  });
}

function renderProxyCsvRows(rows = []) {
  const tbody = $("#proxy-csv-tbody");
  if (!tbody) return;
  if (!Array.isArray(rows) || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#64748b;padding:18px">No verified proxies in CSV yet — click "⚡ Scrape, Test Quality &amp; Save CSV Now".</td></tr>`;
    return;
  }
  tbody.innerHTML = rows
    .map((r) => {
      const qColor =
        r.quality === "Elite"
          ? "#2ee6a6"
          : r.quality === "Fast"
          ? "#38bdf8"
          : r.quality === "Good"
          ? "#fbbf24"
          : "#94a3b8";
      return `
        <tr>
          <td><strong style="color:#f8fafc">🏳️ ${esc(r.country || "US")}</strong></td>
          <td><span style="padding:1px 6px;border-radius:4px;background:rgba(56,189,248,.16);color:#7dd3fc;font-weight:700">${esc(r.protocol)}</span></td>
          <td style="color:#e2e8f0">${esc(r.ip_port)}</td>
          <td class="tabular-nums" style="color:#a7f3d0">${Number(r.speed_ms || 0)} ms</td>
          <td><strong style="color:${qColor}">${esc(r.quality)} (${Number(r.quality_score || 0)}/100)</strong></td>
          <td style="color:#64748b;font-size:10.5px">${esc(String(r.checked_at || "").replace("T", " ").slice(0, 19))}</td>
        </tr>
      `;
    })
    .join("");
}

async function openProxyCsvVaultModal(autoLoadExisting = true) {
  const modal = $("#proxy-csv-vault-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  if (autoLoadExisting) {
    try {
      const d = await (await fetch("/api/proxies/csv")).json();
      if (d?.exists && Array.isArray(d.rows) && d.rows.length) {
        renderProxyCsvRows(d.rows);
        const st = $("#proxy-csv-status-bar");
        if (st) st.textContent = `📂 Loaded ${d.rows.length} stored proxies from ${d.csvPath}`;
      }
    } catch (_) {}
  }
}

function initProxyCsvVaultModal() {
  // Also add a quick launch button into #more-tools-drawer if not already present
  const toolsWrap = document.querySelector("#more-tools-drawer .more-tools-scroll-wrap");
  if (toolsWrap && !document.getElementById("drawer-proxy-csv-btn")) {
    const b = document.createElement("button");
    b.id = "drawer-proxy-csv-btn";
    b.type = "button";
    b.className = "primary xs";
    b.textContent = "🌍 Proxy Scraper & CSV Vault (#51)";
    b.addEventListener("click", () => openProxyCsvVaultModal(true));
    toolsWrap.prepend(b);
  }

  $("#open-proxy-csv-vault-btn")?.addEventListener("click", () => openProxyCsvVaultModal(true));
  $("#proxy-csv-vault-close")?.addEventListener("click", () => $("#proxy-csv-vault-modal")?.classList.add("hidden"));
  $("#proxy-csv-vault-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "proxy-csv-vault-modal") $("#proxy-csv-vault-modal")?.classList.add("hidden");
  });

  // [TODO #1] Live Round-Robin Elite Proxy Rotator & Dead-Socket Pruner
  $("#proxy-rotate-next-btn")?.addEventListener("click", async () => {
    const st = $("#proxy-csv-status-bar");
    const res = await getJSON("/api/proxies/next?quality=Fast");
    if (res?.ok && res.proxy) {
      const p = res.proxy;
      if (st) {
        st.textContent = `🔄 Active Rotated Proxy [${res.index + 1}/${res.poolSize}]: ${p.protocol}://${p.ip_port} (${p.country} · ${p.speed_ms}ms · ${p.quality})`;
      }
      navigator.clipboard?.writeText(`${p.protocol.toLowerCase()}://${p.ip_port}`).catch(() => {});
      status(`🔄 Rotated to ${p.protocol}://${p.ip_port} (${p.country} · ${p.speed_ms}ms) & copied to clipboard!`);
    } else if (st) {
      st.textContent = `⚠️ ${res?.error || "Scrape proxies first before rotating"}`;
    }
  });

  $("#proxy-prune-dead-btn")?.addEventListener("click", async () => {
    const btn = $("#proxy-prune-dead-btn");
    const st = $("#proxy-csv-status-bar");
    if (btn) btn.disabled = true;
    if (st) st.textContent = "🧹 Re-testing stored CSV sockets and pruning dead/timed-out nodes…";
    try {
      const res = await postJSON("/api/proxies/prune", {});
      if (res?.ok) {
        renderProxyCsvRows(res.rows || []);
        if (st) {
          st.textContent = `✅ Pruned ${res.removedCount} dead node(s) · Kept ${res.keptCount} live verified proxies in proxies_verified.csv`;
        }
      } else if (st) {
        st.textContent = `⚠️ ${res?.error || "Prune failed"}`;
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  $("#proxy-scrape-test-run-btn")?.addEventListener("click", async () => {
    const runBtn = $("#proxy-scrape-test-run-btn");
    const st = $("#proxy-csv-status-bar");
    const protos = [];
    if ($("#proxy-proto-http")?.checked) protos.push("http");
    if ($("#proxy-proto-socks4")?.checked) protos.push("socks4");
    if ($("#proxy-proto-socks5")?.checked) protos.push("socks5");
    if (!protos.length) {
      if (st) st.textContent = "⚠️ Check at least one protocol (HTTP, SOCKS4, or SOCKS5)!";
      return;
    }
    const limitPer = Number($("#proxy-limit-select")?.value) || 20;
    const onlyWorking = $("#proxy-only-working")?.checked !== false;
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = "⏳ Scraping & Testing Live Handshakes…";
    }
    if (st) st.textContent = `⏳ Scraping live ${protos.join(" / ").toUpperCase()} feeds, testing socket handshakes, resolving countries, and writing CSV…`;
    try {
      const res = await postJSON("/api/proxies/gather-test-csv", {
        protocols: protos,
        limit_per_protocol: limitPer,
        only_working: onlyWorking,
        filename: "proxies_verified.csv",
      });
      if (res?.ok) {
        renderProxyCsvRows(res.rows || []);
        if (st) {
          st.textContent = `✅ Scraped ${res.totalScraped} candidates · Tested ${res.totalTested} live sockets · Saved ${res.savedCount} proxies to ${res.csvPath}`;
        }
        status(`🌍 Proxy Specialist #51 saved ${res.savedCount} verified proxies (Country, IP:Port, Speed, Quality) to proxies_verified.csv!`);
      } else {
        if (st) st.textContent = `❌ Error: ${res?.error || "Proxy scrape failed"}`;
      }
    } catch (err) {
      if (st) st.textContent = `❌ Exception: ${err.message || err}`;
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "⚡ Scrape, Test Quality & Save CSV Now";
      }
    }
  });
}

// ════════════════════════════════════════════════════════════════════════════
// v=82 UPGRADES:
// 1. Model Capability Lighthouse Hover Popover (for all 108+ Models across UI)
// 2. Dedicated Multi-Prompt & Per-Model Organized File Explorer (#view-file-explorer)
//    with Real Python + Official PyPI pip, Go 1.22, & Genuine Windows PE32+ x64 .EXE Builder
// 3. [TODO #2] Specialist #49 Form Inspector & Automation Runner Sandbox
// 4. [TODO #3] Specialist #50 Live DNS MX/SPF/DKIM/DMARC & NIST Password Hygiene Scanner
// 5. [TODO #4] 3-Judge Blind Rubric Contest Mode (#rubric-judge-btn)
// 6. [TODO #5] Scheduled Swarm Pipelines & Background Cron Jobs (#cron-schedules-modal)
// ════════════════════════════════════════════════════════════════════════════

window.resolveModelLighthouseIntel = function (rawKey) {
  const key = String(rawKey || "").trim();
  if (!key) return null;
  const low = key.toLowerCase();

  // Look up catalog metadata if available
  const catEntry = Object.values(STATE?.catalog || {}).find(
    (c) => String(c.id || "").toLowerCase() === low || String(c.hf || "").toLowerCase() === low || String(c.name || "").toLowerCase() === low
  );
  const hostEntry = (HOST_TREE_UI_STATE?.models || []).find(
    (m) => String(m.id || "").toLowerCase() === low || String(m.label || "").toLowerCase() === low
  );

  const title = hostEntry?.label || catEntry?.name || key.replace(/^\[Host\s+[A-Z0-9]+\]\s*/i, "");
  const vramGb = hostEntry?.vram_gb || catEntry?.gb || (low.includes("70b") || low.includes("72b") ? 44 : low.includes("32b") || low.includes("34b") ? 20 : low.includes("14b") ? 10 : 6);
  const quant = hostEntry?.quantization || "Q4_K_M";
  const isUnc = /ablit|uncensor|unrestrict|dolphin|whiterabbit|baron|orca|deephat|redhat|qwensploit|tiger|hermes/i.test(low) || Boolean(catEntry?.unc);
  const specs = `${quant} · ~${vramGb}GB VRAM${isUnc ? " · 🔓 Zero-Refusal" : ""}`;

  if (/whiterabbit|baron|qwensploit|deephat|redhat|cyber|lily|pentest|offsec/i.test(low)) {
    return {
      title,
      category: "Cybersecurity & Red-Team",
      specs,
      what: "Fine-tuned specifically for offensive/defensive security auditing, network protocol inspection, CVE triage, Nmap/Metasploit workflows, and secure code remediation without safety-filter refusals.",
      tasks: [
        "Audits APIs, SQL queries, authentication flows, and network port surfaces for exploitable flaws",
        "Writes clean Python/Go security scanners, firewall lockdown rules, and local verification scripts",
        "Explains attack chains and patches side-by-side without lecturing",
      ],
      example: "Audit our Express API routes for auth bypasses and SQLi, write a safe verification test, and patch every vulnerable handler.",
    };
  }

  if (/qwen.*coder|codestral|deepseek.*coder|starcoder|codellama|seed[-_]?coder/i.test(low)) {
    return {
      title,
      category: "Polyglot Software & Systems Coding",
      specs,
      what: "Elite multi-file code generation model trained heavily on full-stack repositories, Python, Go, Rust, TypeScript, C++, Bash, and SQL—built for writing complete, compilable files with minimal hallucinations.",
      tasks: [
        "Generates multi-file web apps, Python automation tools, and native Go/Rust CLIs ready to compile",
        "Refactors large codebases, fixes compiler/TypeScript errors, and writes unit + Playwright QA suites",
        "Excels as the primary Builder in Build Mode or Merger in the 3-Model Crucible",
      ],
      example: "Build a concurrent Go + Python CLI utility with full CLI flags, automated tests, and Windows x64 .exe packaging.",
    };
  }

  if (/deepseek[-_ ]?r1|qwq|math|phi[-_ ]?4|reasoning/i.test(low)) {
    return {
      title,
      category: "Deep Chain-of-Thought & Architecture",
      specs,
      what: "Excels at multi-step logical deduction, complex system architecture planning, algorithm optimization, mathematical proofs, and hunting subtle concurrency or logic bugs.",
      tasks: [
        "Breaks ambiguous requirements into rock-solid multi-module engineering plans (/plan mode)",
        "Spots race conditions, edge-case math errors, and architectural bottlenecks other models miss",
        "Ideal as Chief Judge or 3-Judge Rubric evaluator for scoring competing code outputs",
      ],
      example: "Design a fault-tolerant distributed task queue in Go and prove how it avoids deadlocks and duplicate execution.",
    };
  }

  if (/vision|vl\b|gemma[-_ ]?[34]|pixtral|llava|ocr/i.test(low)) {
    return {
      title,
      category: "Multimodal Vision, UI & Code",
      specs,
      what: "Strong visual-and-text generalist that excels at reading UI screenshots, fixing CSS/layout bugs, extracting structured data from diagrams/OCR, and writing clean frontend + Python code.",
      tasks: [
        "Translates attached UI screenshots or wireframes into responsive HTML/CSS/React layouts",
        "Extracts clean JSON/CSV tables from messy documents, forms, and screenshots",
        "Fast, low-latency responder for interactive Ask and Frontend Build tasks",
      ],
      example: "Inspect my attached dashboard screenshot, fix all text clipping and grid alignment issues, and output clean CSS.",
    };
  }

  if (/dolphin|hermes|tiger|rocinante|stheno|magnum|orca/i.test(low) || isUnc) {
    return {
      title,
      category: "Unrestricted Generalist & Tool Calling",
      specs,
      what: "Uncensored instruction-following and tool-calling powerhouse—follows direct technical, red-team, scraping, and automation instructions obediently without preachy refusals.",
      tasks: [
        "Executes multi-round Specialist Agent tool calls (shell, file read/write, scraper, DNS probes)",
        "Handles raw prompt reframing, edge-case security research, and direct automation workflows",
        "Great fast worker for parallel Swarm missions and Hot Potato relays",
      ],
      example: "Write a multi-threaded Python scraper with SOCKS5 proxy rotation and automatic CSV export.",
    };
  }

  return {
    title,
    category: /llama|mistral|qwen|deepseek/i.test(low) ? "High-Speed Instruction & Code" : "Custom / Vault Model",
    specs,
    what: "Versatile high-throughput language and coding model suited for fast multi-model Council consensus, backend/frontend code generation, API integration, and automated debugging.",
    tasks: [
      "Produces clean Python, JavaScript/TypeScript, Go, and shell scripts in Ask & Build modes",
      "Participates in parallel Council comparisons, 3-Round Debates, and Hot Potato relays",
      "Low-latency worker for Swarm task decomposition and code review",
    ],
    example: "Write a clean REST API client with retry backoff, structured logging, and automated tests.",
  };
};

// ── Antigravity IDE Agent-First Explorer, Myers/LCS Inline Diff Review, Artifacts & @Mention Side Panel (#view-file-explorer) ──
let _explorerRuns = [];
let _explorerActiveWorkspace = { outputDir: "", updatedAt: "", files: [] };
let _activeExplorerRunId = null;
let _explorerCheckedKeys = new Set(); // format: `${runId}::${modelIdx}::file::${fileIdx}` or `${runId}::${modelIdx}::response`
let _activeInspectedRef = null; // { source: 'run'|'workspace'|'disk'|'artifact', runId, modelIdx, type: 'file'|'response'|'artifact', fileIdx, path, modelName, runLabel, content }
let _vscExpandedNodes = new Set(["ws-root"]);
let _vscOpenTabs = []; // Array of { tabKey, title, ref }

// Antigravity IDE Workbench State
let _agLayoutMode = "swe"; // 'swe' | 'kw'
let _agSurfaceMode = "editor"; // 'editor' | 'manager'
let _agCanvasMode = "code"; // 'code' | 'diff' | 'preview'
let _agDiffStyle = "unified"; // 'unified' | 'split'
let _agAgentPanelOpen = true;
let _agIncludeActiveFileInAgent = true;
let _agSectionVis = { modified: true, artifacts: true, "active-ws": true, runs: true, disk: true };
let _agCollapsedSecs = new Set(["disk"]);
let _agDiskFiles = [];
let _agDiskArtifacts = [];
let _agDiskContentCache = new Map();
let _agDirtyBuffers = new Map(); // tabKey -> edited string
let _agSavedBuffers = new Map(); // tabKey -> baseline saved string
let _agAgentMentions = []; // Array<{ key, path, source, content, modelName }>
let _agAgentThread = []; // Array<{ id, role: 'user'|'agent', title, ts, text, files, runId, modelIdx }>
let _agHunkScrollCursor = 0;

try {
  const savedLayout = localStorage.getItem("ag_ide_layout");
  if (savedLayout === "kw" || savedLayout === "swe") _agLayoutMode = savedLayout;
  const savedSecs = JSON.parse(localStorage.getItem("ag_ide_sections") || "null");
  if (savedSecs && typeof savedSecs === "object") {
    _agSectionVis = { ..._agSectionVis, ...savedSecs };
  }
} catch {}

function getAgRefTabKey(ref) {
  if (!ref) return "";
  if (ref.source === "workspace") return `ws::${ref.path}`;
  if (ref.source === "disk") return `disk::${ref.path}`;
  if (ref.source === "artifact") return `art::${ref.id || ref.path}`;
  return `${ref.runId}::${ref.modelIdx}::${ref.type}::${ref.fileIdx ?? "resp"}`;
}

// ── Real LCS / Myers-Equivalent Line-by-Line Diff Engine with Contextual Hunks ──
function computeAntigravityLineDiff(oldStr = "", newStr = "") {
  const oldLines = String(oldStr ?? "").replace(/\r\n/g, "\n").split("\n");
  const newLines = String(newStr ?? "").replace(/\r\n/g, "\n").split("\n");
  if (oldStr === "" && newStr === "") {
    return { added: 0, removed: 0, ops: [], hunks: [], identical: true };
  }
  if (oldStr === newStr) {
    return {
      added: 0,
      removed: 0,
      ops: oldLines.map((line, i) => ({ type: "ctx", line, oldNo: i + 1, newNo: i + 1 })),
      hunks: [],
      identical: true,
    };
  }

  let start = 0;
  while (start < oldLines.length && start < newLines.length && oldLines[start] === newLines[start]) {
    start++;
  }
  let oldEnd = oldLines.length - 1;
  let newEnd = newLines.length - 1;
  while (oldEnd >= start && newEnd >= start && oldLines[oldEnd] === newLines[newEnd]) {
    oldEnd--;
    newEnd--;
  }

  const midOld = oldLines.slice(start, oldEnd + 1);
  const midNew = newLines.slice(start, newEnd + 1);
  const midOps = [];

  if (midOld.length * midNew.length <= 1_400_000) {
    const n = midOld.length;
    const m = midNew.length;
    const width = m + 1;
    const dp = new Int32Array((n + 1) * width);
    for (let i = n - 1; i >= 0; i--) {
      const oLine = midOld[i];
      for (let j = m - 1; j >= 0; j--) {
        if (oLine === midNew[j]) {
          dp[i * width + j] = dp[(i + 1) * width + (j + 1)] + 1;
        } else {
          const a = dp[(i + 1) * width + j];
          const b = dp[i * width + (j + 1)];
          dp[i * width + j] = a >= b ? a : b;
        }
      }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (midOld[i] === midNew[j]) {
        midOps.push({ type: "ctx", line: midOld[i] });
        i++;
        j++;
      } else if (dp[(i + 1) * width + j] >= dp[i * width + (j + 1)]) {
        midOps.push({ type: "del", line: midOld[i] });
        i++;
      } else {
        midOps.push({ type: "add", line: midNew[j] });
        j++;
      }
    }
    while (i < n) midOps.push({ type: "del", line: midOld[i++] });
    while (j < m) midOps.push({ type: "add", line: midNew[j++] });
  } else {
    // Bounded windowed matcher for massive files (>1200 changed lines)
    let i = 0;
    let j = 0;
    while (i < midOld.length || j < midNew.length) {
      if (i < midOld.length && j < midNew.length && midOld[i] === midNew[j]) {
        midOps.push({ type: "ctx", line: midOld[i] });
        i++;
        j++;
      } else {
        let foundO = -1;
        let foundN = -1;
        for (let look = 1; look <= 14; look++) {
          if (j + look < midNew.length && i < midOld.length && midOld[i] === midNew[j + look]) {
            foundN = j + look;
            break;
          }
          if (i + look < midOld.length && j < midNew.length && midOld[i + look] === midNew[j]) {
            foundO = i + look;
            break;
          }
        }
        if (foundN !== -1) {
          while (j < foundN) midOps.push({ type: "add", line: midNew[j++] });
        } else if (foundO !== -1) {
          while (i < foundO) midOps.push({ type: "del", line: midOld[i++] });
        } else {
          if (i < midOld.length) midOps.push({ type: "del", line: midOld[i++] });
          if (j < midNew.length) midOps.push({ type: "add", line: midNew[j++] });
        }
      }
    }
  }

  const ops = [];
  let oCursor = 1;
  let nCursor = 1;
  for (let k = 0; k < start; k++) {
    ops.push({ type: "ctx", line: oldLines[k], oldNo: oCursor++, newNo: nCursor++ });
  }
  let added = 0;
  let removed = 0;
  for (const op of midOps) {
    if (op.type === "ctx") {
      ops.push({ type: "ctx", line: op.line, oldNo: oCursor++, newNo: nCursor++ });
    } else if (op.type === "del") {
      if (!(oldStr === "" && oldLines.length === 1 && oldLines[0] === "")) {
        removed++;
        ops.push({ type: "del", line: op.line, oldNo: oCursor++, newNo: null });
      }
    } else {
      added++;
      ops.push({ type: "add", line: op.line, oldNo: null, newNo: nCursor++ });
    }
  }
  for (let k = oldEnd + 1; k < oldLines.length; k++) {
    ops.push({ type: "ctx", line: oldLines[k], oldNo: oCursor++, newNo: nCursor++ });
  }

  // Group into unified hunks with 3 lines of surrounding context
  const CONTEXT = 3;
  const changeIndices = [];
  ops.forEach((op, idx) => {
    if (op.type !== "ctx") changeIndices.push(idx);
  });
  const hunks = [];
  if (changeIndices.length) {
    let hStart = Math.max(0, changeIndices[0] - CONTEXT);
    let hEnd = Math.min(ops.length - 1, changeIndices[0] + CONTEXT);
    for (let c = 1; c < changeIndices.length; c++) {
      const nextStart = Math.max(0, changeIndices[c] - CONTEXT);
      const nextEnd = Math.min(ops.length - 1, changeIndices[c] + CONTEXT);
      if (nextStart <= hEnd + 1) {
        hEnd = Math.max(hEnd, nextEnd);
      } else {
        hunks.push({ startIdx: hStart, endIdx: hEnd, rows: ops.slice(hStart, hEnd + 1) });
        hStart = nextStart;
        hEnd = nextEnd;
      }
    }
    hunks.push({ startIdx: hStart, endIdx: hEnd, rows: ops.slice(hStart, hEnd + 1) });
  }

  return { added, removed, ops, hunks, identical: added === 0 && removed === 0 };
}

function renderSimpleMarkdownForArtifact(md = "") {
  const lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inCode = false;
  let codeLang = "";
  let codeBuf = [];
  let inList = false;

  const inlineFmt = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  for (const raw of lines) {
    if (raw.trim().startsWith("```")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (!inCode) {
        inCode = true;
        codeLang = raw.trim().slice(3).trim();
        codeBuf = [];
      } else {
        html += `<pre data-lang="${esc(codeLang)}">${esc(codeBuf.join("\n"))}</pre>`;
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }
    if (/^###\s+/.test(raw)) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3>${inlineFmt(raw.replace(/^###\s+/, ""))}</h3>`;
    } else if (/^##\s+/.test(raw)) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2>${inlineFmt(raw.replace(/^##\s+/, ""))}</h2>`;
    } else if (/^#\s+/.test(raw)) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h1>${inlineFmt(raw.replace(/^#\s+/, ""))}</h1>`;
    } else if (/^\s*[-*]\s+/.test(raw)) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inlineFmt(raw.replace(/^\s*[-*]\s+/, ""))}</li>`;
    } else if (!raw.trim()) {
      if (inList) { html += "</ul>"; inList = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${inlineFmt(raw)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  if (inCode) html += `<pre>${esc(codeBuf.join("\n"))}</pre>`;
  return html || `<p class="muted">Empty artifact document.</p>`;
}

function extractFilesFromMarkdownForExplorer(mdText = "") {
  const files = [];
  const src = String(mdText || "");

  const markerRx = /^(?:===\s*FILE:\s*(.+?)\s*===|#{2,4}\s*(?:FILE:\s*)?`?([a-zA-Z0-9_./-]+\.[a-zA-Z0-9]{1,8})`?)\s*$/gm;
  const hits = [];
  let mm;
  while ((mm = markerRx.exec(src)) !== null) {
    const p = String(mm[1] || mm[2] || "").trim().replace(/^['"`*]+|['"`*:]+$/g, "").replace(/^\.\//, "").replace(/^\/+/, "");
    if (p && /\.[a-zA-Z0-9]{1,8}$/.test(p)) {
      hits.push({ path: p, headerStart: mm.index, bodyStart: mm.index + mm[0].length });
    }
  }
  const seenPaths = new Set();
  for (let i = 0; i < hits.length; i++) {
    const cur = hits[i];
    const nextStart = i + 1 < hits.length ? hits[i + 1].headerStart : src.length;
    const rawSlice = src.slice(cur.bodyStart, nextStart).trim();
    if (!rawSlice) continue;
    const fenced = rawSlice.match(/```[a-zA-Z0-9_+.:=-]*[^\n]*\r?\n([\s\S]*?)\r?\n```/);
    const content = fenced
      ? fenced[1].trim() + "\n"
      : rawSlice.replace(/^```[a-zA-Z0-9_+-]*\s*\r?\n/, "").replace(/\r?\n```\s*$/, "").trim() + "\n";
    if (content.trim() && !seenPaths.has(cur.path)) {
      seenPaths.add(cur.path);
      const ext = cur.path.split(".").pop() || "txt";
      files.push({ path: cur.path, language: ext, content, size: content.length });
    }
  }

  const fenceRx = /```([a-zA-Z0-9_+.-]*)(?:[: \t]+([^\n`]+))?\n([\s\S]*?)```/g;
  let match;
  let autoIdx = 1;
  while ((match = fenceRx.exec(src)) !== null) {
    const rawLang = (match[1] || "txt").trim();
    const langParts = rawLang.split(":");
    const lang = (langParts[0] || "txt").toLowerCase();
    const headerHint = (langParts.slice(1).join(":") || match[2] || "").trim();
    const content = match[3] || "";
    if (!content.trim() || ["text", "plaintext", "output", "console", "stdout"].includes(lang)) continue;

    let chosenPath = "";
    const cleanHint = headerHint.replace(/^(?:file|path|filename)\s*[:=]\s*/i, "").replace(/^['"`]+|['"`]+$/g, "").trim();
    if (cleanHint && /[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+/.test(cleanHint)) {
      chosenPath = cleanHint.split(/\s+/)[0];
    }
    if (!chosenPath) {
      const firstLine = content.split("\n")[0] || "";
      const mComment = firstLine.match(/^(?:#|\/\/|--|\/\*+|<!--)\s*(?:file(?:name)?|path)?\s*[:=-]?\s*([a-zA-Z0-9_./-]+\.[a-zA-Z0-9]{1,8})/i);
      if (mComment) chosenPath = mComment[1];
    }
    if (!chosenPath) {
      const preSlice = src.slice(Math.max(0, match.index - 180), match.index);
      const mPre = preSlice.match(/[`*]([a-zA-Z0-9_./-]+\.[a-zA-Z0-9]{1,8})[`*]\s*:?\s*$/m);
      if (mPre) chosenPath = mPre[1];
    }
    if (!chosenPath && files.length === 0) {
      const extMap = {
        python: "py", py: "py", go: "go", golang: "go", javascript: "js", js: "js",
        typescript: "ts", ts: "ts", bash: "sh", sh: "sh", shell: "sh", powershell: "ps1",
        pwsh: "ps1", html: "html", css: "css", json: "json", sql: "sql", rust: "rs", cpp: "cpp", c: "c", yaml: "yaml", md: "md",
      };
      const ext = extMap[lang] || "txt";
      chosenPath = ext === "go" ? (autoIdx === 1 ? "main.go" : `module_${autoIdx}.go`)
        : ext === "py" ? (autoIdx === 1 ? "main.py" : `script_${autoIdx}.py`)
        : `snippet_${autoIdx}.${ext}`;
      autoIdx += 1;
    }
    const cleanFinal = chosenPath.replace(/^\/+/, "").replace(/^\.\//, "");
    if (cleanFinal && !seenPaths.has(cleanFinal)) {
      seenPaths.add(cleanFinal);
      files.push({
        path: cleanFinal,
        language: lang || "txt",
        content,
        size: content.length,
      });
    }
  }
  return files;
}

function getFileIconByExt(filePath = "") {
  const ext = String(filePath.split(".").pop() || "").toLowerCase();
  if (ext === "py") return "🐍";
  if (ext === "ts" || ext === "tsx") return "🟦";
  if (ext === "js" || ext === "mjs" || ext === "jsx") return "🟨";
  if (ext === "go") return "🐹";
  if (ext === "rs") return "🦀";
  if (ext === "html") return "🌐";
  if (ext === "css") return "🎨";
  if (ext === "json" || ext === "yaml" || ext === "yml") return "⚙️";
  if (ext === "sh" || ext === "ps1") return "🐚";
  if (ext === "sql") return "🗄️";
  if (ext === "md") return "📝";
  return "📄";
}

function buildNestedFolderTree(fileEntries = []) {
  const root = { dirs: {}, files: [] };
  fileEntries.forEach((entry) => {
    const clean = String(entry.path || "file.txt").replace(/^\/+/, "");
    const segs = clean.split("/").filter(Boolean);
    let cursor = root;
    for (let i = 0; i < segs.length - 1; i++) {
      const dirName = segs[i];
      if (!cursor.dirs[dirName]) cursor.dirs[dirName] = { name: dirName, dirs: {}, files: [] };
      cursor = cursor.dirs[dirName];
    }
    cursor.files.push({ ...entry, leafName: segs[segs.length - 1] || clean });
  });
  return root;
}

window.recordPromptRunToFileExplorer = async function (answersMap = {}, promptText = "", mode = "ask") {
  try {
    const entries = Object.entries(answersMap || {});
    if (!entries.length && !window._lastVerdict) return;

    const modelsPayload = [];
    for (const [k, ansObj] of entries) {
      const rawText = typeof ansObj === "string" ? ansObj : String(ansObj?.text || ansObj?.raw || ansObj?.content || "");
      if (!rawText.trim()) continue;
      const backendObj = STATE?.backends?.find((b) => String(b.i) === String(k));
      const modelName =
        ansObj?.name ||
        ansObj?.model ||
        backendObj?.name ||
        (isNaN(Number(k)) ? String(k) : `Model #${k}`);
      const hostId = backendObj?.host_id ? `Host ${String(backendObj.host_id).toUpperCase()}` : backendObj?.provider || "Council";
      const parsedFiles = extractFilesFromMarkdownForExplorer(rawText);
      modelsPayload.push({
        modelId: backendObj?.model || String(k),
        modelName,
        host: hostId,
        responseText: rawText,
        files: parsedFiles,
      });
    }

    if (window._lastVerdict && String(window._lastVerdict).trim()) {
      modelsPayload.push({
        modelId: "verdict-synthesis",
        modelName: "⚖️ Verdict / Hot Potato Synthesis",
        host: "Judge",
        responseText: String(window._lastVerdict),
        files: extractFilesFromMarkdownForExplorer(String(window._lastVerdict)),
      });
    }

    if (!modelsPayload.length) return;
    const saved = await postJSON("/api/explorer/runs", {
      prompt: promptText || window._lastPrompt || "Workspace Prompt Run",
      mode,
      models: modelsPayload,
    });
    if (saved?.ok && saved.run) {
      await loadExplorerRunsFromServer(saved.run.id);
    }
  } catch (err) {
    pushClientLiveConsole("ERROR", `File Explorer archive error: ${err.message || err}`, "error");
  }
};

async function loadAgDiskTreeAndArtifacts() {
  const res = await getJSON("/api/explorer/disk-tree");
  if (res?.ok) {
    _agDiskFiles = Array.isArray(res.diskFiles) ? res.diskFiles : [];
    _agDiskArtifacts = Array.isArray(res.artifacts) ? res.artifacts : [];
    renderAgDiskTree();
    renderAgArtifactsSection();
  }
}

async function loadExplorerRunsFromServer(preferRunId = null) {
  const res = await getJSON("/api/explorer/runs");
  if (res?.ok && Array.isArray(res.runs)) {
    _explorerRuns = res.runs;
    if (res.workspace && Array.isArray(res.workspace.files)) {
      _explorerActiveWorkspace = res.workspace;
    }
    if (preferRunId) {
      _activeExplorerRunId = preferRunId;
      _vscExpandedNodes.add(`run::${preferRunId}`);
    } else if (!_activeExplorerRunId || !_explorerRuns.some((r) => r.id === _activeExplorerRunId)) {
      _activeExplorerRunId = _explorerRuns[0]?.id || null;
      if (_activeExplorerRunId) _vscExpandedNodes.add(`run::${_activeExplorerRunId}`);
    }
    const actRun = _explorerRuns.find((r) => r.id === _activeExplorerRunId);
    if (actRun && Array.isArray(actRun.models)) {
      actRun.models.forEach((_, mIdx) => {
        const mk = `model::${actRun.id}::${mIdx}`;
        if (!_vscExpandedNodes.has(`_seen_${mk}`)) {
          _vscExpandedNodes.add(`_seen_${mk}`);
          _vscExpandedNodes.add(mk);
        }
      });
    }
    const badge = $("#topbar-explorer-badge");
    if (badge) {
      const totalFilesAll = _explorerRuns.reduce((s, r) => s + Number(r.totalFiles || 0), 0);
      badge.textContent = `${_explorerRuns.length}R/${totalFilesAll}F`;
      badge.classList.remove("hidden");
    }
    renderAllAntigravityExplorerZones();
  }
}

function renderAllAntigravityExplorerZones() {
  applyAgLayoutAndSectionState();
  renderVscActiveWorkspaceTree();
  renderExplorerModelsBucketsPane();
  renderAgModifiedSection();
  renderAgArtifactsSection();
  renderAgDiskTree();
  renderAgContextChips();
  updateExplorerPinButtonLabel();
  updateAgDiffReviewState();
  if (_agSurfaceMode === "manager") {
    renderAgManagerSurface();
  }
}

function applyAgLayoutAndSectionState() {
  const root = $("#view-file-explorer");
  if (!root) return;
  root.setAttribute("data-ag-layout", _agLayoutMode);
  root.setAttribute("data-ag-surface", _agSurfaceMode);
  if (_agAgentPanelOpen) root.removeAttribute("data-ag-agent-closed");
  else root.setAttribute("data-ag-agent-closed", "1");

  $("#ag-layout-swe-btn")?.classList.toggle("is-active", _agLayoutMode === "swe");
  $("#ag-layout-kw-btn")?.classList.toggle("is-active", _agLayoutMode === "kw");
  $("#ag-surface-editor-btn")?.classList.toggle("is-active", _agSurfaceMode === "editor");
  $("#ag-surface-manager-btn")?.classList.toggle("is-active", _agSurfaceMode === "manager");
  $("#ag-toggle-agent-pane-btn")?.classList.toggle("is-on", _agAgentPanelOpen);

  $("#ag-editor-surface")?.classList.toggle("hidden", _agSurfaceMode !== "editor");
  $("#ag-manager-surface")?.classList.toggle("hidden", _agSurfaceMode !== "manager");

  // Canvas mode visibility
  $("#ag-mode-code-btn")?.classList.toggle("is-active", _agCanvasMode === "code");
  $("#ag-mode-diff-btn")?.classList.toggle("is-active", _agCanvasMode === "diff");
  $("#ag-mode-preview-btn")?.classList.toggle("is-active", _agCanvasMode === "preview");
  $("#ag-code-pane")?.classList.toggle("hidden", _agCanvasMode !== "code");
  $("#ag-diff-pane")?.classList.toggle("hidden", _agCanvasMode !== "diff");
  $("#ag-preview-pane")?.classList.toggle("hidden", _agCanvasMode !== "preview");

  // Sidebar section customizer & collapse state
  Object.entries(_agSectionVis).forEach(([secKey, vis]) => {
    const secEl = document.querySelector(`[data-ag-sec="${secKey}"]`);
    if (secEl) secEl.classList.toggle("hidden", !vis);
    const cb = document.querySelector(`[data-ag-sec-toggle="${secKey}"]`);
    if (cb) cb.checked = Boolean(vis);
  });

  ["modified", "artifacts", "active-ws", "runs", "disk"].forEach((secKey) => {
    const secEl = document.querySelector(`[data-ag-sec="${secKey}"]`);
    if (!secEl) return;
    const bodyEl = secEl.querySelector(".ag-sec-body");
    const chevEl = secEl.querySelector(".ag-sec-chev");
    const isCollapsed = _agCollapsedSecs.has(secKey);
    if (bodyEl) bodyEl.classList.toggle("hidden", isCollapsed);
    if (chevEl) chevEl.textContent = isCollapsed ? "▸" : "▾";
  });
}

function setAgCanvasMode(nextMode) {
  _agCanvasMode = nextMode;
  applyAgLayoutAndSectionState();
  if (nextMode === "diff") renderAgDiffCanvas();
  else if (nextMode === "preview") renderAgPreviewCanvas();
  else syncEditorLineGutter();
}

function syncEditorLineGutter() {
  const ed = $("#explorer-inspector-editor");
  const gut = $("#ag-line-gutter");
  if (!ed || !gut) return;
  const lineCount = Math.max(1, String(ed.value || "").split("\n").length);
  const nums = [];
  for (let i = 1; i <= lineCount; i++) nums.push(i);
  gut.textContent = nums.join("\n");
  gut.scrollTop = ed.scrollTop;

  // Update cursor Ln / Col readout
  const pos = ed.selectionStart || 0;
  const upToCursor = String(ed.value || "").slice(0, pos);
  const segs = upToCursor.split("\n");
  const ln = segs.length;
  const col = (segs[segs.length - 1] || "").length + 1;
  const curEl = $("#ag-cursor-telemetry");
  if (curEl) curEl.textContent = `Ln ${ln}, Col ${col}`;
}

function getBaselineComparisonForActiveRef() {
  if (!_activeInspectedRef) return { hasDiff: false, baseText: "", candidateText: "", originLabel: "", baseLabel: "Active Build" };
  const edVal = $("#explorer-inspector-editor")?.value ?? "";
  const tKey = getAgRefTabKey(_activeInspectedRef);
  const isDirty = _agDirtyBuffers.has(tKey);

  if (_activeInspectedRef.source === "workspace") {
    const wf = (_explorerActiveWorkspace.files || []).find((f) => f.path === _activeInspectedRef.path);
    if (isDirty) {
      return {
        hasDiff: edVal !== (wf?.content || ""),
        baseText: wf?.content || "",
        candidateText: edVal,
        originLabel: "Unsaved Editor Buffer vs Active Merged Build",
        baseLabel: "Saved Active Build",
      };
    }
    if (wf?.history?.length) {
      return {
        hasDiff: wf.content !== wf.history[0].content,
        baseText: wf.history[0].content || "",
        candidateText: wf.content || "",
        originLabel: `Swapped from ${wf.fromModelName} vs prior (${wf.history[0].fromModelName})`,
        baseLabel: `Prior (${wf.history[0].fromModelName})`,
      };
    }
    return { hasDiff: false, baseText: wf?.content || "", candidateText: edVal, originLabel: "Active Build Baseline", baseLabel: "Active Build" };
  }

  if (_activeInspectedRef.source === "run" && _activeInspectedRef.type === "file") {
    const wf = (_explorerActiveWorkspace.files || []).find((f) => f.path === _activeInspectedRef.path);
    const baseText = wf ? wf.content || "" : "";
    return {
      hasDiff: !wf || baseText !== edVal,
      baseText,
      candidateText: edVal,
      originLabel: wf
        ? `Candidate (${_activeInspectedRef.modelName || "Agent"}) vs Active Build (${wf.fromModelName})`
        : `New File from ${_activeInspectedRef.modelName || "Agent"} (Not yet in Active Build)`,
      baseLabel: wf ? `Active Build (${wf.fromModelName})` : "Empty (New File)",
    };
  }

  if (_activeInspectedRef.source === "disk") {
    const savedDisk = _agSavedBuffers.get(tKey) ?? edVal;
    return {
      hasDiff: edVal !== savedDisk,
      baseText: savedDisk,
      candidateText: edVal,
      originLabel: "Modified Disk Buffer (Accept stages copy into Active Merged Build)",
      baseLabel: "Project Disk",
    };
  }

  return { hasDiff: false, baseText: edVal, candidateText: edVal, originLabel: "Artifact", baseLabel: "Baseline" };
}

function updateAgDiffReviewState() {
  const bar = $("#ag-diff-review-bar");
  const badge = $("#ag-diff-tab-badge");
  const statsEl = $("#ag-diff-stats-label");
  const origEl = $("#ag-diff-origin-label");
  if (!bar) return;

  const cmp = getBaselineComparisonForActiveRef();
  if (!cmp.hasDiff) {
    bar.classList.add("hidden");
    if (badge) badge.textContent = "";
    if (_agCanvasMode === "diff") renderAgDiffCanvas();
    return;
  }

  const diff = computeAntigravityLineDiff(cmp.baseText, cmp.candidateText);
  if (diff.identical) {
    bar.classList.add("hidden");
    if (badge) badge.textContent = "";
    return;
  }

  bar.classList.remove("hidden");
  if (badge) badge.textContent = `+${diff.added} −${diff.removed}`;
  if (statsEl) statsEl.textContent = `+${diff.added} −${diff.removed} lines`;
  if (origEl) origEl.textContent = cmp.originLabel;

  if (_agCanvasMode === "diff") {
    renderAgDiffCanvas(diff, cmp);
  }
}

function renderAgDiffCanvas(precomputedDiff = null, precomputedCmp = null) {
  const wrap = $("#ag-diff-table-wrap");
  if (!wrap) return;
  const cmp = precomputedCmp || getBaselineComparisonForActiveRef();
  const diff = precomputedDiff || computeAntigravityLineDiff(cmp.baseText, cmp.candidateText);

  $("#ag-diff-unified-btn")?.classList.toggle("is-active", _agDiffStyle === "unified");
  $("#ag-diff-split-btn")?.classList.toggle("is-active", _agDiffStyle === "split");

  if (diff.identical || !diff.hunks.length) {
    wrap.innerHTML = `<div style="padding:20px;color:#94a3b8">✓ Zero line differences between current buffer and ${esc(cmp.baseLabel)}.</div>`;
    return;
  }

  if (_agDiffStyle === "split") {
    let html = "";
    diff.hunks.forEach((hunk, hIdx) => {
      html += `
        <div class="ag-hunk-hdr" data-ag-hunk-idx="${hIdx}">
          <span>Hunk #${hIdx + 1} · ${esc(cmp.baseLabel)} ↔ Candidate</span>
          <div style="display:inline-flex;gap:5px">
            <button type="button" class="ag-hdr-act accept" data-ag-apply-hunk="${hIdx}">Accept Hunk</button>
            <button type="button" class="ag-hdr-act reject" data-ag-discard-hunk="${hIdx}">Discard Hunk</button>
          </div>
        </div>
      `;
      let r = 0;
      while (r < hunk.rows.length) {
        const row = hunk.rows[r];
        if (row.type === "ctx") {
          html += `
            <div class="ag-diff-split-grid">
              <div class="ag-diff-split-cell"><span class="ag-diff-ln tabular-nums">${row.oldNo ?? ""}</span><span class="ag-diff-sig"> </span><span class="ag-diff-code">${esc(row.line)}</span></div>
              <div class="ag-diff-split-cell"><span class="ag-diff-ln tabular-nums">${row.newNo ?? ""}</span><span class="ag-diff-sig"> </span><span class="ag-diff-code">${esc(row.line)}</span></div>
            </div>`;
          r++;
        } else {
          const dels = [];
          const adds = [];
          while (r < hunk.rows.length && hunk.rows[r].type === "del") dels.push(hunk.rows[r++]);
          while (r < hunk.rows.length && hunk.rows[r].type === "add") adds.push(hunk.rows[r++]);
          const maxLen = Math.max(dels.length, adds.length);
          for (let k = 0; k < maxLen; k++) {
            const d = dels[k];
            const a = adds[k];
            html += `
              <div class="ag-diff-split-grid">
                ${d ? `<div class="ag-diff-split-cell del"><span class="ag-diff-ln tabular-nums">${d.oldNo ?? ""}</span><span class="ag-diff-sig">−</span><span class="ag-diff-code">${esc(d.line)}</span></div>` : `<div class="ag-diff-split-cell empty"><span class="ag-diff-ln"></span><span class="ag-diff-sig"></span><span class="ag-diff-code"></span></div>`}
                ${a ? `<div class="ag-diff-split-cell add"><span class="ag-diff-ln tabular-nums">${a.newNo ?? ""}</span><span class="ag-diff-sig">+</span><span class="ag-diff-code">${esc(a.line)}</span></div>` : `<div class="ag-diff-split-cell empty"><span class="ag-diff-ln"></span><span class="ag-diff-sig"></span><span class="ag-diff-code"></span></div>`}
              </div>`;
          }
        }
      }
    });
    wrap.innerHTML = html;
  } else {
    wrap.innerHTML = diff.hunks
      .map((hunk, hIdx) => {
        const firstOld = hunk.rows.find((x) => x.oldNo != null)?.oldNo || 1;
        const firstNew = hunk.rows.find((x) => x.newNo != null)?.newNo || 1;
        const rowsHtml = hunk.rows
          .map((row) => {
            const sig = row.type === "add" ? "+" : row.type === "del" ? "−" : " ";
            return `
              <div class="ag-diff-row ${row.type}">
                <span class="ag-diff-ln tabular-nums">${row.oldNo ?? ""}</span>
                <span class="ag-diff-ln tabular-nums">${row.newNo ?? ""}</span>
                <span class="ag-diff-sig">${sig}</span>
                <span class="ag-diff-code">${esc(row.line)}</span>
              </div>`;
          })
          .join("");
        return `
          <div class="ag-hunk-hdr" data-ag-hunk-idx="${hIdx}">
            <span>@@ -${firstOld} +${firstNew} @@ · Hunk ${hIdx + 1}/${diff.hunks.length}</span>
            <div style="display:inline-flex;gap:5px">
              <button type="button" class="ag-hdr-act accept" data-ag-apply-hunk="${hIdx}" title="Stage this hunk into Active Merged Build">Accept Hunk</button>
              <button type="button" class="ag-hdr-act reject" data-ag-discard-hunk="${hIdx}" title="Revert this hunk back to baseline lines">Discard Hunk</button>
            </div>
          </div>
          ${rowsHtml}
        `;
      })
      .join("");
  }

  // Surgical per-hunk Accept / Discard handlers
  wrap.querySelectorAll("[data-ag-discard-hunk]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hIdx = Number(btn.getAttribute("data-ag-discard-hunk"));
      const hunk = diff.hunks[hIdx];
      if (!hunk) return;
      // Rebuild candidate text keeping baseline lines inside [hunk.startIdx..hunk.endIdx] and candidate lines outside
      const rebuilt = [];
      diff.ops.forEach((op, idx) => {
        const inside = idx >= hunk.startIdx && idx <= hunk.endIdx;
        if (inside) {
          if (op.type === "ctx" || op.type === "del") rebuilt.push(op.line);
        } else {
          if (op.type === "ctx" || op.type === "add") rebuilt.push(op.line);
        }
      });
      const nextText = rebuilt.join("\n");
      const ed = $("#explorer-inspector-editor");
      if (ed) ed.value = nextText;
      const tKey = getAgRefTabKey(_activeInspectedRef);
      _agDirtyBuffers.set(tKey, nextText);
      syncEditorLineGutter();
      updateAgDiffReviewState();
      renderAgModifiedSection();
      status(`↺ Discarded Hunk #${hIdx + 1} in '${_activeInspectedRef?.path || "buffer"}'.`);
    });
  });

  wrap.querySelectorAll("[data-ag-apply-hunk]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const hIdx = Number(btn.getAttribute("data-ag-apply-hunk"));
      const hunk = diff.hunks[hIdx];
      if (!hunk || !_activeInspectedRef) return;
      // Apply ONLY this hunk onto baseline, then persist to Active Merged Build!
      const mergedLines = [];
      diff.ops.forEach((op, idx) => {
        const inside = idx >= hunk.startIdx && idx <= hunk.endIdx;
        if (inside) {
          if (op.type === "ctx" || op.type === "add") mergedLines.push(op.line);
        } else {
          if (op.type === "ctx" || op.type === "del") mergedLines.push(op.line);
        }
      });
      await swapFilesIntoActiveWorkspace([
        {
          path: _activeInspectedRef.path || "main.py",
          content: mergedLines.join("\n"),
          language: (_activeInspectedRef.path || "txt").split(".").pop() || "txt",
          fromRunId: _activeInspectedRef.runId || "hunk_accept",
          fromRunLabel: "Hunk Accepted in Antigravity Diff",
          fromModelName: _activeInspectedRef.modelName || "Agent Hunk",
          fromHost: "Antigravity",
        },
      ]);
      updateAgDiffReviewState();
      status(`✓ Accepted Hunk #${hIdx + 1} into Active Merged Build!`);
    });
  });
}

function renderAgPreviewCanvas() {
  const mdEl = $("#ag-markdown-preview");
  const frame = $("#ag-html-preview-frame");
  if (!mdEl || !frame) return;

  const pathStr = String(_activeInspectedRef?.path || "").toLowerCase();
  const rawVal = $("#explorer-inspector-editor")?.value || "";

  if (pathStr.endsWith(".html") || pathStr.endsWith(".htm") || /^\s*<!doctype html/i.test(rawVal)) {
    mdEl.classList.add("hidden");
    frame.classList.remove("hidden");
    // Inline sibling CSS/JS from Active Merged Build so multi-file HTML previews work live!
    let enrichedHtml = rawVal;
    for (const wf of _explorerActiveWorkspace.files || []) {
      if (wf.path.endsWith(".css")) {
        const fname = wf.path.split("/").pop();
        enrichedHtml = enrichedHtml.replace(
          new RegExp(`<link[^>]+href=["'][^"']*${fname.replace(".", "\\.")}["'][^>]*>`, "i"),
          `<style>\n${wf.content}\n</style>`
        );
      } else if (wf.path.endsWith(".js")) {
        const fname = wf.path.split("/").pop();
        enrichedHtml = enrichedHtml.replace(
          new RegExp(`<script[^>]+src=["'][^"']*${fname.replace(".", "\\.")}["'][^>]*>\\s*<\\/script>`, "i"),
          `<script>\n${wf.content}\n</script>`
        );
      }
    }
    frame.srcdoc = enrichedHtml;
  } else {
    frame.classList.add("hidden");
    mdEl.classList.remove("hidden");
    if (pathStr.endsWith(".md") || _activeInspectedRef?.type === "response" || _activeInspectedRef?.source === "artifact") {
      mdEl.innerHTML = renderSimpleMarkdownForArtifact(rawVal);
    } else {
      mdEl.innerHTML = `<h3>${esc(_activeInspectedRef?.path || "Source Preview")}</h3><pre>${esc(rawVal)}</pre>`;
    }
  }
}

// ── Section 1: Modified Files & Pending Agent Edits ──
function collectPendingAgentModifiedItems() {
  const items = [];
  const wsMap = new Map((_explorerActiveWorkspace.files || []).map((f) => [f.path, f]));

  // 1. Dirty unsaved editor buffers
  for (const [tKey, dirtyVal] of _agDirtyBuffers.entries()) {
    const savedVal = _agSavedBuffers.get(tKey) ?? "";
    if (dirtyVal !== savedVal) {
      const tab = _vscOpenTabs.find((t) => t.tabKey === tKey);
      if (tab?.ref) {
        const d = computeAntigravityLineDiff(savedVal, dirtyVal);
        items.push({
          status: "U",
          css: "unsaved",
          path: tab.ref.path || "buffer.txt",
          sub: `Unsaved · +${d.added} −${d.removed}`,
          ref: tab.ref,
        });
      }
    }
  }

  // 2. Candidate edits from the currently active Run's models compared against Active Build
  const activeRun = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0];
  if (activeRun) {
    (activeRun.models || []).forEach((m, mIdx) => {
      (m.files || []).forEach((f, fIdx) => {
        const existing = wsMap.get(f.path);
        const isAlreadyExact = existing && existing.content === f.content;
        if (!isAlreadyExact) {
          const d = computeAntigravityLineDiff(existing ? existing.content : "", f.content || "");
          items.push({
            status: existing ? "M" : "A",
            css: existing ? "mod" : "add",
            path: f.path,
            sub: `${m.modelName} · +${d.added} −${d.removed}`,
            ref: {
              source: "run",
              runId: activeRun.id,
              modelIdx: mIdx,
              type: "file",
              fileIdx: fIdx,
              path: f.path,
              modelName: m.modelName,
            },
          });
        }
      });
    });
  }

  // 3. Revertible swapped files in Active Workspace
  for (const wf of _explorerActiveWorkspace.files || []) {
    if (Array.isArray(wf.history) && wf.history.length > 0) {
      items.push({
        status: "S",
        css: "swap",
        path: wf.path,
        sub: `Swapped (${wf.fromModelName})`,
        ref: { source: "workspace", path: wf.path },
      });
    }
  }

  return items.slice(0, 28);
}

function renderAgModifiedSection() {
  const listEl = $("#ag-modified-list");
  const cntEl = $("#ag-modified-count");
  if (!listEl) return;
  const items = collectPendingAgentModifiedItems();
  if (cntEl) cntEl.textContent = String(items.length);

  if (!items.length) {
    listEl.innerHTML = `<div class="muted" style="padding:6px 10px;font-size:11px">Clean — no pending agent diffs or unsaved edits.</div>`;
    return;
  }

  listEl.innerHTML = items
    .map(
      (it, idx) => `
      <div class="vsc-row vsc-row-file" data-ag-mod-idx="${idx}" title="${esc(it.path)} (${esc(it.sub)})">
        <span class="ag-stat-code ${it.css}">${it.status}</span>
        <span class="vsc-row-label">${esc(it.path.split("/").pop())}</span>
        <span class="vsc-provenance-chip tabular-nums">${esc(it.sub)}</span>
      </div>
    `
    )
    .join("");

  listEl.querySelectorAll("[data-ag-mod-idx]").forEach((row) => {
    row.addEventListener("click", () => {
      const it = items[Number(row.getAttribute("data-ag-mod-idx"))];
      if (!it) return;
      openFileInVscInspector(it.ref);
      setAgCanvasMode("diff");
    });
  });
}

// ── Section 2: Structured Antigravity Artifacts Hub ──
function collectAntigravityArtifacts() {
  const list = [];

  // 1. Disk Artifacts (.aistudio/artifacts plans & specs)
  for (const da of _agDiskArtifacts) {
    list.push({
      id: da.id,
      title: da.title,
      kind: da.kind,
      path: da.path,
      diskPath: da.path,
      source: "disk-artifact",
    });
  }

  // 2. HTML Web Previews & Markdown Specs in Active Merged Build
  for (const wf of _explorerActiveWorkspace.files || []) {
    if (/\.(md|html|htm)$/i.test(wf.path)) {
      list.push({
        id: `ws_art::${wf.path}`,
        title: wf.path,
        kind: wf.path.endsWith(".html") ? "Live Web App" : "Build Doc",
        path: wf.path,
        content: wf.content,
        wsRef: { source: "workspace", path: wf.path },
      });
    }
  }

  // 3. Verdict Syntheses & Agent Responses from Active/Pinned Runs
  const runsForArt = _explorerRuns.slice(0, 6);
  for (const r of runsForArt) {
    (r.models || []).forEach((m, mIdx) => {
      if (String(m.responseText || "").trim()) {
        list.push({
          id: `run_resp::${r.id}::${mIdx}`,
          title: `${m.modelName} Spec`,
          kind: m.host === "Judge" ? "Verdict Plan" : "Agent Synthesis",
          path: `${(m.modelName || "agent").replace(/[^a-z0-9_-]+/gi, "_")}.md`,
          runRef: {
            source: "run",
            runId: r.id,
            modelIdx: mIdx,
            type: "response",
            path: `${(m.modelName || "agent").replace(/[^a-z0-9_-]+/gi, "_")}_response.md`,
            modelName: m.modelName,
          },
        });
      }
      (m.files || []).forEach((f, fIdx) => {
        if (/\.html?$/i.test(f.path)) {
          list.push({
            id: `run_html::${r.id}::${mIdx}::${fIdx}`,
            title: `${f.path} (${m.modelName})`,
            kind: "Web Preview",
            path: f.path,
            runRef: {
              source: "run",
              runId: r.id,
              modelIdx: mIdx,
              type: "file",
              fileIdx: fIdx,
              path: f.path,
              modelName: m.modelName,
            },
          });
        }
      });
    });
  }

  return list.slice(0, 24);
}

function renderAgArtifactsSection() {
  const listEl = $("#ag-artifacts-list");
  const cntEl = $("#ag-artifacts-count");
  if (!listEl) return;
  const arts = collectAntigravityArtifacts();
  if (cntEl) cntEl.textContent = String(arts.length);

  if (!arts.length) {
    listEl.innerHTML = `<div class="muted" style="padding:6px 10px;font-size:11px">No plans or HTML previews yet.</div>`;
    return;
  }

  listEl.innerHTML = arts
    .map(
      (a, idx) => `
      <div class="vsc-row vsc-row-file" data-ag-art-idx="${idx}" title="${esc(a.title)} · ${esc(a.kind)}">
        <span class="vsc-chevron">${a.kind.includes("Web") ? "🌐" : "📑"}</span>
        <span class="vsc-row-label">${esc(a.title)}</span>
        <span class="vsc-provenance-chip">${esc(a.kind)}</span>
      </div>
    `
    )
    .join("");

  listEl.querySelectorAll("[data-ag-art-idx]").forEach((row) => {
    row.addEventListener("click", async () => {
      const a = arts[Number(row.getAttribute("data-ag-art-idx"))];
      if (!a) return;
      if (a.source === "disk-artifact" && a.diskPath) {
        await openDiskFileInInspector(a.diskPath, true);
      } else if (a.wsRef) {
        openFileInVscInspector(a.wsRef);
        setAgCanvasMode("preview");
      } else if (a.runRef) {
        openFileInVscInspector(a.runRef);
        setAgCanvasMode("preview");
      }
    });
  });
}

// ── Section 5: Real Workspace Project Disk Browser ──
async function openDiskFileInInspector(relPath, openInPreview = false) {
  let content = _agDiskContentCache.get(relPath);
  if (content === undefined) {
    const res = await getJSON(`/api/explorer/disk-file?path=${encodeURIComponent(relPath)}`);
    if (!res?.ok) {
      status(`⚠️ Could not read disk file '${relPath}': ${res?.error || "Not found"}`);
      return;
    }
    content = res.content || "";
    _agDiskContentCache.set(relPath, content);
  }
  openFileInVscInspector({
    source: "disk",
    type: "file",
    path: relPath,
    modelName: "Project Disk",
    content,
  });
  if (openInPreview) setAgCanvasMode("preview");
}

function renderAgDiskTree() {
  const treeEl = $("#ag-disk-tree");
  const cntEl = $("#ag-disk-count");
  if (!treeEl) return;
  const q = ($("#explorer-history-search")?.value || "").trim().toLowerCase();
  const files = q ? _agDiskFiles.filter((f) => f.path.toLowerCase().includes(q)) : _agDiskFiles;
  if (cntEl) cntEl.textContent = String(_agDiskFiles.length);

  if (!files.length) {
    treeEl.innerHTML = `<div class="muted" style="padding:6px 10px;font-size:11px">No matching project disk files.</div>`;
    return;
  }

  const nested = buildNestedFolderTree(files);
  const renderNode = (node, prefix = "") => {
    let html = "";
    for (const dirName of Object.keys(node.dirs).sort()) {
      const sub = prefix ? `${prefix}/${dirName}` : dirName;
      const dKey = `diskdir::${sub}`;
      const isOpen = q ? true : _vscExpandedNodes.has(dKey);
      html += `
        <div class="vsc-row vsc-row-dir" data-ag-toggle-diskdir="${esc(dKey)}">
          <span class="vsc-chevron">${isOpen ? "▾" : "▸"}</span>
          <span class="vsc-row-label">📁 ${esc(dirName)}</span>
        </div>
        ${isOpen ? `<div class="vsc-node-children">${renderNode(node.dirs[dirName], sub)}</div>` : ""}
      `;
    }
    for (const f of node.files) {
      const isSel = _activeInspectedRef?.source === "disk" && _activeInspectedRef?.path === f.path;
      html += `
        <div class="vsc-row vsc-row-file ${isSel ? "is-selected" : ""}" data-ag-open-disk="${esc(f.path)}">
          <span class="vsc-chevron"></span>
          <span class="vsc-row-label" title="${esc(f.path)} (${Math.max(1, Math.round((f.size || 0) / 1024))}KB)">${getFileIconByExt(f.path)} ${esc(f.leafName)}</span>
          <button type="button" class="vsc-mini-btn" data-ag-mention-disk="${esc(f.path)}" title="Attach @${esc(f.path)} to Agent Panel">＠</button>
        </div>
      `;
    }
    return html;
  };

  treeEl.innerHTML = renderNode(nested, "");

  treeEl.querySelectorAll("[data-ag-toggle-diskdir]").forEach((row) => {
    row.addEventListener("click", () => {
      const dk = row.getAttribute("data-ag-toggle-diskdir");
      if (_vscExpandedNodes.has(dk)) _vscExpandedNodes.delete(dk);
      else _vscExpandedNodes.add(dk);
      renderAgDiskTree();
    });
  });

  treeEl.querySelectorAll("[data-ag-open-disk]").forEach((row) => {
    row.addEventListener("click", async (e) => {
      if (e.target.closest("button")) return;
      const fp = row.getAttribute("data-ag-open-disk");
      await openDiskFileInInspector(fp, false);
      renderAgDiskTree();
    });
  });

  treeEl.querySelectorAll("[data-ag-mention-disk]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const fp = btn.getAttribute("data-ag-mention-disk");
      const res = await getJSON(`/api/explorer/disk-file?path=${encodeURIComponent(fp)}`);
      if (res?.ok) {
        addFileToAgAgentMentions({ key: `disk::${fp}`, path: fp, source: "Project Disk", content: res.content || "", modelName: "Disk" });
      }
    });
  });
}

// ── Parallel Agent Manager Matrix Surface ──
function renderAgManagerSurface() {
  const grid = $("#ag-manager-cards-grid");
  const sum = $("#ag-manager-summary");
  if (!grid) return;

  const activeRun = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0];
  const pinnedOthers = _explorerRuns.filter((r) => r.pinned && r.id !== activeRun?.id);
  const runsToShow = [activeRun, ...pinnedOthers].filter(Boolean);

  if (!runsToShow.length) {
    grid.innerHTML = `<div class="ag-agent-empty"><strong>No Agent Runs Recorded Yet</strong><p>Execute a prompt in Workspace or run a Specialist in the Agent Side Panel to populate parallel agent cards.</p></div>`;
    return;
  }

  const wsMap = new Map((_explorerActiveWorkspace.files || []).map((f) => [f.path, f]));
  const cards = [];

  for (const run of runsToShow) {
    (run.models || []).forEach((m, mIdx) => {
      const files = m.files || [];
      let totalAdd = 0;
      let totalDel = 0;
      files.forEach((f) => {
        const base = wsMap.get(f.path)?.content || "";
        const d = computeAntigravityLineDiff(base, f.content || "");
        totalAdd += d.added;
        totalDel += d.removed;
      });
      cards.push({ run, m, mIdx, files, totalAdd, totalDel });
    });
  }

  if (sum) {
    sum.textContent = `Showing ${cards.length} parallel agent/model root(s) across ${runsToShow.length} run(s) · Active Merged Build holds ${(_explorerActiveWorkspace.files || []).length} file(s).`;
  }

  grid.innerHTML = cards
    .map(
      (c, cIdx) => `
      <div class="ag-mgr-card">
        <div class="ag-mgr-card-top">
          <div>
            <div class="ag-mgr-model">${esc(c.m.modelName || "Agent")}</div>
            <div class="ag-mgr-host">${esc(c.m.host || "Council")} · ${esc((c.run.label || c.run.prompt || "Run").slice(0, 42))}</div>
          </div>
          <span class="ag-sec-count tabular-nums" style="color:#6ee7b7">+${c.totalAdd} −${c.totalDel}</span>
        </div>
        <div class="ag-mgr-files">
          ${
            c.files.length
              ? c.files
                  .map(
                    (f, fIdx) => `
                <div class="ag-mgr-file-row">
                  <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${getFileIconByExt(f.path)} ${esc(f.path)}</span>
                  <div style="display:inline-flex;gap:4px;flex-shrink:0">
                    <button type="button" class="vsc-mini-btn diff-btn" data-ag-mgr-diff="${esc(c.run.id)}::${c.mIdx}::${fIdx}">Diff</button>
                    <button type="button" class="vsc-mini-btn" data-ag-mgr-swap="${esc(c.run.id)}::${c.mIdx}::${fIdx}">Accept</button>
                  </div>
                </div>`
                  )
                  .join("")
              : `<div class="muted" style="font-size:11px">Response synthesis only (${Math.max(1, Math.round(String(c.m.responseText || "").length / 1024))}KB)</div>`
          }
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-top:auto;padding-top:4px">
          <button type="button" class="ghost xs ag-nowrap" data-ag-mgr-spec="${esc(c.run.id)}::${c.mIdx}">Read Synthesis</button>
          ${
            c.files.length
              ? `<button type="button" class="primary xs ag-nowrap" data-ag-mgr-accept-all="${cIdx}">Accept All (${c.files.length})</button>`
              : ""
          }
        </div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll("[data-ag-mgr-diff]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [rId, mStr, fStr] = btn.getAttribute("data-ag-mgr-diff").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[Number(mStr)];
      const f = m?.files?.[Number(fStr)];
      if (!f || !m || !run) return;
      _agSurfaceMode = "editor";
      openFileInVscInspector({ source: "run", runId: run.id, modelIdx: Number(mStr), type: "file", fileIdx: Number(fStr), path: f.path, modelName: m.modelName });
      setAgCanvasMode("diff");
    });
  });

  grid.querySelectorAll("[data-ag-mgr-swap]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const [rId, mStr, fStr] = btn.getAttribute("data-ag-mgr-swap").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[Number(mStr)];
      const f = m?.files?.[Number(fStr)];
      if (!f || !m || !run) return;
      await swapFilesIntoActiveWorkspace([
        { path: f.path, content: f.content, language: f.language || "txt", fromRunId: run.id, fromRunLabel: (run.label || run.prompt || "Run").slice(0, 60), fromModelName: m.modelName, fromHost: m.host || "Council" },
      ]);
      renderAgManagerSurface();
    });
  });

  grid.querySelectorAll("[data-ag-mgr-spec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [rId, mStr] = btn.getAttribute("data-ag-mgr-spec").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[Number(mStr)];
      if (!m || !run) return;
      _agSurfaceMode = "editor";
      openFileInVscInspector({ source: "run", runId: run.id, modelIdx: Number(mStr), type: "response", path: `${m.modelName}_response.md`, modelName: m.modelName });
      setAgCanvasMode("preview");
    });
  });

  grid.querySelectorAll("[data-ag-mgr-accept-all]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const c = cards[Number(btn.getAttribute("data-ag-mgr-accept-all"))];
      if (!c || !c.files.length) return;
      await swapFilesIntoActiveWorkspace(
        c.files.map((f) => ({
          path: f.path,
          content: f.content,
          language: f.language || "txt",
          fromRunId: c.run.id,
          fromRunLabel: (c.run.label || c.run.prompt || "Run").slice(0, 60),
          fromModelName: c.m.modelName,
          fromHost: c.m.host || "Council",
        }))
      );
      renderAgManagerSurface();
    });
  });
}

// ── Right Agent Side Panel (@Mentions, /Commands, Context Chips & Thread) ──
function addFileToAgAgentMentions(item) {
  if (!item || !item.path) return;
  const k = item.key || `${item.source}::${item.path}`;
  if (!_agAgentMentions.some((m) => m.key === k)) {
    _agAgentMentions.push({
      key: k,
      path: item.path,
      source: item.source || "Explorer",
      content: item.content || "",
      modelName: item.modelName || "Workspace",
    });
  }
  if (!_agAgentPanelOpen) {
    _agAgentPanelOpen = true;
    applyAgLayoutAndSectionState();
  }
  renderAgContextChips();
}

function renderAgContextChips() {
  const box = $("#ag-context-chips");
  const cntEl = $("#ag-agent-context-count");
  if (!box) return;

  let html = "";
  let totalCtx = _agAgentMentions.length;

  if (_activeInspectedRef?.path) {
    if (_agIncludeActiveFileInAgent) totalCtx += 1;
    html += `
      <span class="ag-ctx-chip" style="${_agIncludeActiveFileInAgent ? "" : "opacity:0.45"}" title="Automatically include currently open editor file in Agent context">
        <span>@${esc(_activeInspectedRef.path.split("/").pop())}</span>
        <button type="button" data-ag-toggle-active-ctx="1" title="Toggle active file context">${_agIncludeActiveFileInAgent ? "✓" : "+"}</button>
      </span>
    `;
  }

  html += _agAgentMentions
    .map(
      (m, idx) => `
      <span class="ag-ctx-chip" title="@${esc(m.path)} (${esc(m.modelName)})">
        <span>@${esc(m.path.split("/").pop())}</span>
        <button type="button" data-ag-rm-mention="${idx}" title="Remove from context">✕</button>
      </span>
    `
    )
    .join("");

  box.innerHTML = html || `<span class="muted" style="font-size:10.5px">No files attached — type @ below</span>`;
  if (cntEl) cntEl.textContent = `${totalCtx} ctx`;

  box.querySelector("[data-ag-toggle-active-ctx]")?.addEventListener("click", () => {
    _agIncludeActiveFileInAgent = !_agIncludeActiveFileInAgent;
    renderAgContextChips();
  });

  box.querySelectorAll("[data-ag-rm-mention]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-ag-rm-mention"));
      _agAgentMentions.splice(idx, 1);
      renderAgContextChips();
    });
  });
}

function getAllMentionableFilesCatalog() {
  const catalog = [];
  const seen = new Set();

  for (const wf of _explorerActiveWorkspace.files || []) {
    const k = `ws::${wf.path}`;
    seen.add(k);
    catalog.push({ key: k, path: wf.path, badge: "Active Build", content: wf.content || "", modelName: wf.fromModelName || "Active Build" });
  }

  for (const r of _explorerRuns.slice(0, 8)) {
    for (const m of r.models || []) {
      for (const f of m.files || []) {
        const k = `run::${r.id}::${m.modelName}::${f.path}`;
        if (seen.has(k)) continue;
        seen.add(k);
        catalog.push({ key: k, path: f.path, badge: m.modelName, content: f.content || "", modelName: m.modelName });
      }
    }
  }

  for (const df of _agDiskFiles.slice(0, 80)) {
    const k = `disk::${df.path}`;
    if (seen.has(k)) continue;
    catalog.push({ key: k, path: df.path, badge: "Project Disk", diskOnly: true, modelName: "Project Disk" });
  }

  return catalog;
}

const AG_SLASH_COMMANDS = [
  { cmd: "/merge", spec: "cross-agent-dedup-merge-surgeon", goal: "Reconcile all attached @files into unified, deduplicated, production-ready modules with zero missing imports." },
  { cmd: "/diff", spec: "cross-agent-dedup-merge-surgeon", goal: "Audit differences across the attached @files, identify regressions or edge-case bugs, and emit the cleanest patched file versions." },
  { cmd: "/refactor", spec: "architecture-lead", goal: "Refactor the attached @files for clean modular architecture, strict typing, and zero dead code while preserving all public interfaces." },
  { cmd: "/tests", spec: "qa-verification-engineer", goal: "Write comprehensive runnable unit and integration test files covering edge cases for the attached @files." },
  { cmd: "/plan", spec: "architecture-lead", goal: "Produce a structured implementation_plan.md artifact plus concrete file scaffolds for the attached context." },
  { cmd: "/fix", spec: "security-redteam-auditor", goal: "Diagnose runtime, security, or compiler defects in the attached @files and emit complete fixed files." },
];

function renderAgAgentThread() {
  const wrap = $("#ag-agent-thread");
  if (!wrap) return;
  if (!_agAgentThread.length) return;

  wrap.innerHTML = _agAgentThread
    .map(
      (msg, idx) => `
      <div class="ag-thread-msg ${msg.role}">
        <div class="ag-thread-meta">
          <strong>${esc(msg.title)}</strong>
          <span class="tabular-nums">${esc(msg.ts)}</span>
        </div>
        <div class="ag-thread-body">${esc(msg.text.slice(0, 1800))}${msg.text.length > 1800 ? "\n… [Full output saved in Explorer Run]" : ""}</div>
        ${
          Array.isArray(msg.files) && msg.files.length
            ? `<div style="display:flex;flex-direction:column;gap:4px;padding-top:4px;border-top:1px solid rgba(148,163,184,0.14)">
                ${msg.files
                  .map(
                    (f, fIdx) => `
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;font-family:'JetBrains Mono',monospace;font-size:10.5px">
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${getFileIconByExt(f.path)} ${esc(f.path)}</span>
                    <div style="display:inline-flex;gap:4px">
                      <button type="button" class="vsc-mini-btn diff-btn" data-ag-thread-diff="${idx}::${fIdx}">Diff</button>
                      <button type="button" class="vsc-mini-btn" data-ag-thread-accept="${idx}::${fIdx}">Accept</button>
                    </div>
                  </div>`
                  )
                  .join("")}
                <button type="button" class="ag-hdr-act accept" data-ag-thread-accept-all="${idx}" style="align-self:flex-end;margin-top:3px">Accept All (${msg.files.length})</button>
              </div>`
            : ""
        }
      </div>
    `
    )
    .join("");

  wrap.scrollTop = wrap.scrollHeight;

  wrap.querySelectorAll("[data-ag-thread-diff]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [mIdxStr, fIdxStr] = btn.getAttribute("data-ag-thread-diff").split("::");
      const msg = _agAgentThread[Number(mIdxStr)];
      const f = msg?.files?.[Number(fIdxStr)];
      if (!f) return;
      if (msg.runId) {
        const run = _explorerRuns.find((r) => r.id === msg.runId);
        if (run?.models?.[0]) {
          openFileInVscInspector({ source: "run", runId: run.id, modelIdx: 0, type: "file", fileIdx: Number(fIdxStr), path: f.path, modelName: msg.title });
          setAgCanvasMode("diff");
          return;
        }
      }
    });
  });

  wrap.querySelectorAll("[data-ag-thread-accept]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const [mIdxStr, fIdxStr] = btn.getAttribute("data-ag-thread-accept").split("::");
      const msg = _agAgentThread[Number(mIdxStr)];
      const f = msg?.files?.[Number(fIdxStr)];
      if (!f) return;
      await swapFilesIntoActiveWorkspace([
        { path: f.path, content: f.content, language: f.language || "txt", fromRunId: msg.runId || "agent_panel", fromRunLabel: "Agent Side Panel", fromModelName: msg.title, fromHost: "Swarm" },
      ]);
    });
  });

  wrap.querySelectorAll("[data-ag-thread-accept-all]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const msg = _agAgentThread[Number(btn.getAttribute("data-ag-thread-accept-all"))];
      if (!msg?.files?.length) return;
      await swapFilesIntoActiveWorkspace(
        msg.files.map((f) => ({
          path: f.path,
          content: f.content,
          language: f.language || "txt",
          fromRunId: msg.runId || "agent_panel",
          fromRunLabel: "Agent Side Panel",
          fromModelName: msg.title,
          fromHost: "Swarm",
        }))
      );
    });
  });
}

function updateExplorerCheckedCounter() {
  const el = $("#explorer-checked-counter");
  if (el) el.textContent = `${_explorerCheckedKeys.size} checked`;
  const srcPill = $("#explorer-build-source-pill");
  if (srcPill) {
    const wsCnt = (_explorerActiveWorkspace.files || []).length;
    if (_explorerCheckedKeys.size > 0) {
      srcPill.textContent = `Checked: ${_explorerCheckedKeys.size} · Active Build: ${wsCnt} file(s)`;
    } else if (wsCnt > 0) {
      srcPill.textContent = `Active Merged Build: ${wsCnt} file(s) staged`;
    } else {
      srcPill.textContent = `Target: Auto (Active Merged Build → Checked → Open File)`;
    }
  }
}

function updateExplorerPinButtonLabel() {
  const btn = $("#explorer-pin-active-run-btn");
  if (!btn) return;
  const run = _explorerRuns.find((r) => r.id === _activeExplorerRunId);
  if (run?.pinned) {
    btn.textContent = "📌 Pinned";
    btn.style.background = "rgba(245,158,11,0.2)";
  } else {
    btn.textContent = "📌 Pin Run";
    btn.style.background = "";
  }
}

function openFileInVscInspector(ref) {
  if (!ref) return;
  _activeInspectedRef = ref;
  const tabKey = getAgRefTabKey(ref);
  const shortTitle =
    ref.source === "workspace"
      ? `📦 ${ref.path.split("/").pop()}`
      : ref.source === "disk"
      ? `🖴 ${ref.path.split("/").pop()}`
      : ref.type === "response"
      ? `📑 ${(ref.modelName || "Model").slice(0, 16)}`
      : `${getFileIconByExt(ref.path)} ${ref.path.split("/").pop()}`;

  if (!_vscOpenTabs.some((t) => t.tabKey === tabKey)) {
    _vscOpenTabs.push({ tabKey, title: shortTitle, ref });
    if (_vscOpenTabs.length > 9) _vscOpenTabs.shift();
  }

  let savedContent = "";
  let breadcrumb = "";
  let provText = "";

  if (ref.source === "workspace") {
    const wf = (_explorerActiveWorkspace.files || []).find((f) => f.path === ref.path);
    savedContent = wf?.content || "";
    breadcrumb = `Active Merged Build / ${ref.path}`;
    const histCount = (wf?.history || []).length;
    provText = wf
      ? `Origin: ${wf.fromModelName} · ${wf.fromRunLabel || wf.fromRunId}${histCount ? ` · ${histCount} revert snapshot(s)` : ""}`
      : "Active Merged Build";
  } else if (ref.source === "disk") {
    savedContent = ref.content ?? _agDiskContentCache.get(ref.path) ?? "";
    breadcrumb = `Project Disk / ${ref.path}`;
    provText = `Live Workspace Filesystem · Click [Swap Into Build] to stage a writable copy into Active Merged Build`;
  } else {
    const run = _explorerRuns.find((r) => r.id === ref.runId);
    const mod = run?.models?.[ref.modelIdx];
    const runTitle = run?.label || (run?.prompt || "Run").slice(0, 42);
    if (ref.type === "file") {
      const f = mod?.files?.[ref.fileIdx];
      savedContent = f?.content || "";
      breadcrumb = `${runTitle} / ${mod?.modelName || "Model"} / ${f?.path || ref.path}`;
      provText = `${run?.pinned ? "Pinned Run" : "Saved Run"} · Host: ${mod?.host || "Council"}`;
    } else {
      savedContent = mod?.responseText || "";
      breadcrumb = `${runTitle} / ${mod?.modelName || "Model"} / Synthesis.md`;
      provText = `Agent Markdown Artifact · ${savedContent.length} chars`;
    }
  }

  _agSavedBuffers.set(tabKey, savedContent);
  const effectiveContent = _agDirtyBuffers.has(tabKey) ? _agDirtyBuffers.get(tabKey) : savedContent;

  if ($("#explorer-inspector-title")) $("#explorer-inspector-title").textContent = breadcrumb;
  if ($("#explorer-inspector-provenance")) $("#explorer-inspector-provenance").textContent = provText;
  if ($("#explorer-inspector-editor")) $("#explorer-inspector-editor").value = effectiveContent;

  syncEditorLineGutter();
  renderVscOpenTabsBar(tabKey);
  renderAgContextChips();
  updateAgDiffReviewState();
  if (_agCanvasMode === "preview") renderAgPreviewCanvas();
}

function renderVscOpenTabsBar(activeTabKey = "") {
  const bar = $("#vsc-open-tabs-bar");
  if (!bar) return;
  if (!_vscOpenTabs.length) {
    bar.innerHTML = `<div class="vsc-tab-empty">No file open — select a file, diff, or artifact from the Explorer</div>`;
    return;
  }
  bar.innerHTML = _vscOpenTabs
    .map((t) => {
      const dirtyDot = _agDirtyBuffers.has(t.tabKey) && _agDirtyBuffers.get(t.tabKey) !== _agSavedBuffers.get(t.tabKey) ? " ●" : "";
      return `
      <div class="vsc-tab-item ${t.tabKey === activeTabKey ? "is-active" : ""}" data-vsc-tab="${esc(t.tabKey)}">
        <span>${esc(t.title)}${dirtyDot}</span>
        <span data-vsc-close-tab="${esc(t.tabKey)}" style="color:#94a3b8;font-size:10px;padding:0 2px" title="Close tab">✕</span>
      </div>
    `;
    })
    .join("");

  bar.querySelectorAll("[data-vsc-tab]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-vsc-close-tab]")) return;
      const k = el.getAttribute("data-vsc-tab");
      const found = _vscOpenTabs.find((x) => x.tabKey === k);
      if (found) {
        openFileInVscInspector(found.ref);
        renderVscActiveWorkspaceTree();
        renderExplorerModelsBucketsPane();
      }
    });
  });

  bar.querySelectorAll("[data-vsc-close-tab]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const k = btn.getAttribute("data-vsc-close-tab");
      _vscOpenTabs = _vscOpenTabs.filter((x) => x.tabKey !== k);
      _agDirtyBuffers.delete(k);
      if (_vscOpenTabs.length) {
        openFileInVscInspector(_vscOpenTabs[_vscOpenTabs.length - 1].ref);
      } else {
        _activeInspectedRef = null;
        renderVscOpenTabsBar("");
        updateAgDiffReviewState();
      }
    });
  });
}

async function swapFilesIntoActiveWorkspace(filesToSwap = [], replaceAll = false) {
  if (!filesToSwap.length) return;
  const res = await postJSON("/api/explorer/workspace/swap", {
    replaceAll,
    files: filesToSwap,
  });
  if (res?.ok && res.workspace) {
    _explorerActiveWorkspace = res.workspace;
    // Clear any dirty flags for workspace files just saved
    for (const p of res.swapped || []) {
      _agDirtyBuffers.delete(`ws::${p}`);
    }
    renderAllAntigravityExplorerZones();
    updateExplorerCheckedCounter();
    status(`⇄ Accepted ${(res.swapped || []).length} file(s) (${(res.swapped || []).join(", ")}) into Active Merged Build.`);
  }
}

function renderVscActiveWorkspaceTree() {
  const treeEl = $("#vsc-active-workspace-tree");
  const countEl = $("#vsc-active-ws-count");
  if (!treeEl) return;
  const wsFiles = Array.isArray(_explorerActiveWorkspace.files) ? _explorerActiveWorkspace.files : [];
  if (countEl) countEl.textContent = `${wsFiles.length} file${wsFiles.length === 1 ? "" : "s"}`;

  if (!wsFiles.length) {
    treeEl.innerHTML = `<div class="muted" style="padding:7px 10px;font-size:11px">Empty — click <strong>Swap</strong>, <strong>Accept File</strong>, or <strong>＋ New File</strong> to assemble your Active Merged Build.</div>`;
    return;
  }

  const nested = buildNestedFolderTree(wsFiles);
  const renderWsNode = (node, prefixPath = "") => {
    let html = "";
    for (const dirName of Object.keys(node.dirs).sort()) {
      const subPath = prefixPath ? `${prefixPath}/${dirName}` : dirName;
      const nodeKey = `wsdir::${subPath}`;
      const isOpen = !_vscExpandedNodes.has(`closed::${nodeKey}`);
      html += `
        <div class="vsc-row vsc-row-dir" data-vsc-toggle-wsdir="${esc(nodeKey)}">
          <span class="vsc-chevron">${isOpen ? "▾" : "▸"}</span>
          <span class="vsc-row-label">📁 ${esc(dirName)}</span>
        </div>
        ${isOpen ? `<div class="vsc-node-children">${renderWsNode(node.dirs[dirName], subPath)}</div>` : ""}
      `;
    }
    for (const f of node.files) {
      const isSel = _activeInspectedRef?.source === "workspace" && _activeInspectedRef?.path === f.path;
      const hasPrev = Array.isArray(f.history) && f.history.length > 0;
      html += `
        <div class="vsc-row vsc-row-file ${isSel ? "is-selected" : ""}" data-vsc-open-wsfile="${esc(f.path)}">
          <span class="vsc-chevron"></span>
          <span class="vsc-row-label" title="${esc(f.path)} · ${esc(f.fromModelName)}">${getFileIconByExt(f.path)} ${esc(f.leafName)}</span>
          <span class="vsc-provenance-chip" title="${esc(f.fromRunLabel)} · ${esc(f.fromModelName)}">${esc(f.fromModelName)}</span>
          <button type="button" class="vsc-mini-btn" data-ag-rename-wsfile="${esc(f.path)}" title="Rename file path">✎</button>
          ${hasPrev ? `<button type="button" class="vsc-mini-btn" data-vsc-revert-wsfile="${esc(f.path)}" title="Revert to previous version (${esc(f.history[0].fromModelName)})">↺</button>` : ""}
          <button type="button" class="vsc-mini-btn danger" data-vsc-rm-wsfile="${esc(f.path)}" title="Remove from Active Build">✕</button>
        </div>
      `;
    }
    return html;
  };

  treeEl.innerHTML = renderWsNode(nested, "");

  treeEl.querySelectorAll("[data-vsc-toggle-wsdir]").forEach((row) => {
    row.addEventListener("click", () => {
      const k = `closed::${row.getAttribute("data-vsc-toggle-wsdir")}`;
      if (_vscExpandedNodes.has(k)) _vscExpandedNodes.delete(k);
      else _vscExpandedNodes.add(k);
      renderVscActiveWorkspaceTree();
    });
  });

  treeEl.querySelectorAll("[data-vsc-open-wsfile]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      const fp = row.getAttribute("data-vsc-open-wsfile");
      openFileInVscInspector({ source: "workspace", path: fp });
      renderVscActiveWorkspaceTree();
      renderExplorerModelsBucketsPane();
    });
  });

  treeEl.querySelectorAll("[data-ag-rename-wsfile]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const oldPath = btn.getAttribute("data-ag-rename-wsfile");
      const row = btn.closest(".vsc-row-file");
      if (!row || !oldPath) return;
      row.innerHTML = `
        <input type="text" class="input slim ag-mono-input" data-ag-rename-input="${esc(oldPath)}" value="${esc(oldPath)}" style="flex:1;height:22px !important">
        <button type="button" class="vsc-mini-btn" data-ag-rename-save="1">✓</button>
        <button type="button" class="vsc-mini-btn danger" data-ag-rename-cancel="1">✕</button>
      `;
      const inp = row.querySelector("input");
      inp?.focus();
      inp?.select();
      const commitRename = async () => {
        const nextP = (inp?.value || "").trim();
        if (!nextP || nextP === oldPath) {
          renderVscActiveWorkspaceTree();
          return;
        }
        const res = await postJSON("/api/explorer/workspace/rename", { oldPath, newPath: nextP });
        if (res?.ok && res.workspace) {
          _explorerActiveWorkspace = res.workspace;
          if (_activeInspectedRef?.source === "workspace" && _activeInspectedRef.path === oldPath) {
            openFileInVscInspector({ source: "workspace", path: res.renamedTo || nextP });
          }
          renderAllAntigravityExplorerZones();
          status(`✎ Renamed '${oldPath}' → '${res.renamedTo || nextP}'.`);
        } else {
          status(`⚠️ Rename failed: ${res?.error || "Invalid path"}`);
          renderVscActiveWorkspaceTree();
        }
      };
      row.querySelector("[data-ag-rename-save]")?.addEventListener("click", (ev) => { ev.stopPropagation(); commitRename(); });
      row.querySelector("[data-ag-rename-cancel]")?.addEventListener("click", (ev) => { ev.stopPropagation(); renderVscActiveWorkspaceTree(); });
      inp?.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") commitRename();
        else if (ev.key === "Escape") renderVscActiveWorkspaceTree();
      });
    });
  });

  treeEl.querySelectorAll("[data-vsc-revert-wsfile]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const fp = btn.getAttribute("data-vsc-revert-wsfile");
      const res = await postJSON("/api/explorer/workspace/revert", { path: fp });
      if (res?.ok && res.workspace) {
        _explorerActiveWorkspace = res.workspace;
        if (_activeInspectedRef?.source === "workspace" && _activeInspectedRef.path === fp) {
          openFileInVscInspector({ source: "workspace", path: fp });
        }
        renderAllAntigravityExplorerZones();
        status(`↺ Reverted '${fp}' to its previous version.`);
      }
    });
  });

  treeEl.querySelectorAll("[data-vsc-rm-wsfile]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const fp = btn.getAttribute("data-vsc-rm-wsfile");
      const res = await postJSON(`/api/explorer/workspace/file?path=${encodeURIComponent(fp)}`, { path: fp }, "DELETE");
      if (res?.ok && res.workspace) {
        _explorerActiveWorkspace = res.workspace;
        renderAllAntigravityExplorerZones();
        updateExplorerCheckedCounter();
      }
    });
  });
}

function renderExplorerHistoryPane() {
  renderExplorerModelsBucketsPane();
}

function renderExplorerModelsBucketsPane() {
  const wrap = $("#explorer-models-buckets");
  const sub = $("#explorer-active-prompt-sub");
  if (!wrap) return;

  const q = ($("#explorer-history-search")?.value || "").trim().toLowerCase().replace(/^@/, "");
  const filteredRuns = q
    ? _explorerRuns.filter((r) => {
        const hay = [
          r.prompt,
          r.label,
          r.mode,
          ...(r.models || []).flatMap((m) => [m.modelName, ...(m.files || []).map((f) => f.path)]),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : _explorerRuns;

  const pinnedCnt = _explorerRuns.filter((r) => r.pinned).length;
  if (sub) {
    sub.textContent = `${_explorerRuns.length} run${_explorerRuns.length === 1 ? "" : "s"}${pinnedCnt ? ` · ${pinnedCnt} 📌` : ""}`;
  }

  if (!filteredRuns.length) {
    wrap.innerHTML = `<div class="muted" style="padding:10px;font-size:11px">No saved runs match. Run any prompt in Workspace or dispatch an Agent on the right.</div>`;
    updateExplorerCheckedCounter();
    return;
  }

  const wsPathsMap = new Map((_explorerActiveWorkspace.files || []).map((f) => [f.path, f]));

  const renderModelSubtree = (run, m, mIdx, folderNode, prefix = "") => {
    let html = "";
    for (const dirName of Object.keys(folderNode.dirs).sort()) {
      const subPath = prefix ? `${prefix}/${dirName}` : dirName;
      const dirKey = `dir::${run.id}::${mIdx}::${subPath}`;
      const isDirOpen = !_vscExpandedNodes.has(`closed::${dirKey}`);
      html += `
        <div class="vsc-row vsc-row-dir" role="treeitem" aria-expanded="${isDirOpen}" data-vsc-toggle-dir="${esc(dirKey)}">
          <span class="vsc-chevron">${isDirOpen ? "▾" : "▸"}</span>
          <span class="vsc-row-label">📁 ${esc(dirName)}</span>
        </div>
        ${isDirOpen ? `<div class="vsc-node-children" role="group">${renderModelSubtree(run, m, mIdx, folderNode.dirs[dirName], subPath)}</div>` : ""}
      `;
    }

    for (const f of folderNode.files) {
      const fKey = `${run.id}::${mIdx}::file::${f.fileIdx}`;
      const isChecked = _explorerCheckedKeys.has(fKey);
      const isSelected =
        _activeInspectedRef?.source === "run" &&
        _activeInspectedRef?.runId === run.id &&
        _activeInspectedRef?.modelIdx === mIdx &&
        _activeInspectedRef?.type === "file" &&
        _activeInspectedRef?.fileIdx === f.fileIdx;

      const existingInWs = wsPathsMap.get(f.path);
      const isExactActive = existingInWs && existingInWs.content === f.content;
      const hasDiffVsWs = existingInWs && !isExactActive;

      html += `
        <div class="vsc-row vsc-row-file ${isSelected ? "is-selected" : ""}" role="treeitem" data-exp-inspect-file="${esc(run.id)}::${mIdx}::${f.fileIdx}">
          <input type="checkbox" data-exp-check-key="${esc(fKey)}" ${isChecked ? "checked" : ""}>
          <span class="vsc-row-label" title="${esc(f.path)} (${f.size || String(f.content || "").length}B)">${getFileIconByExt(f.path)} ${esc(f.leafName)}</span>
          ${hasDiffVsWs ? `<button type="button" class="vsc-mini-btn diff-btn" data-ag-open-diff="${esc(run.id)}::${mIdx}::${f.fileIdx}" title="View inline Myers diff vs Active Merged Build">Diff</button>` : ""}
          ${
            isExactActive
              ? `<span class="vsc-provenance-chip" style="color:#34d399">✓ Active</span>`
              : `<button type="button" class="vsc-mini-btn" data-vsc-swap-single="${esc(run.id)}::${mIdx}::${f.fileIdx}" title="${hasDiffVsWs ? `Replace '${esc(f.path)}' in Active Merged Build` : `Accept '${esc(f.path)}' into Active Merged Build`}">${hasDiffVsWs ? "Replace" : "Swap"}</button>`
          }
        </div>
      `;
    }
    return html;
  };

  wrap.innerHTML = filteredRuns
    .map((run, rIdx) => {
      const runNodeKey = `run::${run.id}`;
      const isRunOpen = q ? true : _vscExpandedNodes.has(runNodeKey) || (rIdx === 0 && _explorerRuns.length > 0 && run.id === _activeExplorerRunId);
      const isSelectedRun = run.id === _activeExplorerRunId;
      const runTitle = run.label || run.prompt || "Untitled Run";
      const totalFilesInRun = (run.models || []).reduce((acc, m) => acc + ((m.files || []).length || 0), 0);
      const tsShort = String(run.createdAt || "").replace("T", " ").slice(5, 16);

      const modelsTreeHtml = isRunOpen
        ? `<div class="vsc-node-children" role="group">
            ${(run.models || [])
              .map((m, mIdx) => {
                const modKey = `model::${run.id}::${mIdx}`;
                const isModOpen = q ? true : _vscExpandedNodes.has(modKey);
                const filesWithIdx = (m.files || []).map((f, fIdx) => ({ ...f, fileIdx: fIdx }));
                const nestedTree = buildNestedFolderTree(filesWithIdx);
                const respKey = `${run.id}::${mIdx}::response`;
                const isRespChecked = _explorerCheckedKeys.has(respKey);
                const isRespSelected =
                  _activeInspectedRef?.source === "run" &&
                  _activeInspectedRef?.runId === run.id &&
                  _activeInspectedRef?.modelIdx === mIdx &&
                  _activeInspectedRef?.type === "response";

                return `
                  <div class="vsc-row vsc-row-model" role="treeitem" aria-expanded="${isModOpen}" data-vsc-toggle-model="${esc(modKey)}">
                    <span class="vsc-chevron">${isModOpen ? "▾" : "▸"}</span>
                    <span class="vsc-row-label" title="${esc(m.modelName)} · ${esc(m.host || "Council")}">${esc(m.modelName || `Agent #${mIdx + 1}`)} <span style="color:#64748b;font-weight:400">(${filesWithIdx.length})</span></span>
                    ${
                      filesWithIdx.length > 0
                        ? `<button type="button" class="vsc-mini-btn" data-vsc-swap-model="${esc(run.id)}::${mIdx}" title="Accept all ${filesWithIdx.length} file(s) from this agent into Active Build">All</button>`
                        : ""
                    }
                  </div>
                  ${
                    isModOpen
                      ? `<div class="vsc-node-children" role="group">
                          ${renderModelSubtree(run, m, mIdx, nestedTree, "")}
                          <div class="vsc-row vsc-row-file ${isRespSelected ? "is-selected" : ""}" role="treeitem" data-exp-inspect-resp="${esc(run.id)}::${mIdx}">
                            <input type="checkbox" data-exp-check-key="${esc(respKey)}" ${isRespChecked ? "checked" : ""}>
                            <span class="vsc-row-label" style="color:#94a3b8">📑 _synthesis.md (${Math.max(1, Math.round(String(m.responseText || "").length / 1024))}KB)</span>
                          </div>
                        </div>`
                      : ""
                  }
                `;
              })
              .join("")}
          </div>`
        : "";

      return `
        <div class="vsc-row vsc-row-run ${run.pinned ? "is-pinned" : ""} ${isSelectedRun ? "is-selected" : ""}" role="treeitem" aria-expanded="${isRunOpen}" data-vsc-toggle-run="${esc(run.id)}">
          <span class="vsc-chevron">${isRunOpen ? "▾" : "▸"}</span>
          <span class="vsc-row-label" title="[${esc(String(run.mode || "ask").toUpperCase())}] ${esc(runTitle)} (${esc(tsShort)})">
            ${run.pinned ? "📌 " : ""}<span style="color:#38bdf8">${esc(String(run.mode || "run").toUpperCase())}</span> · ${esc(runTitle)}
          </span>
          <span class="tabular-nums" style="font-size:10px;color:#6ee7b7">${totalFilesInRun}F</span>
          <button type="button" class="vsc-mini-btn ${run.pinned ? "pin-on" : ""}" data-vsc-pin-run="${esc(run.id)}" title="${run.pinned ? "Unpin Run" : "Pin Run in Memory"}">📌</button>
          <button type="button" class="vsc-mini-btn danger" data-vsc-del-run="${esc(run.id)}" title="Delete Run">✕</button>
        </div>
        ${modelsTreeHtml}
      `;
    })
    .join("");

  wrap.querySelectorAll("[data-vsc-toggle-run]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      const rId = row.getAttribute("data-vsc-toggle-run");
      _activeExplorerRunId = rId;
      const rk = `run::${rId}`;
      if (_vscExpandedNodes.has(rk)) _vscExpandedNodes.delete(rk);
      else {
        _vscExpandedNodes.add(rk);
        const rObj = _explorerRuns.find((x) => x.id === rId);
        (rObj?.models || []).forEach((_, mi) => _vscExpandedNodes.add(`model::${rId}::${mi}`));
      }
      updateExplorerPinButtonLabel();
      renderExplorerModelsBucketsPane();
      renderAgModifiedSection();
    });
  });

  wrap.querySelectorAll("[data-vsc-pin-run]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const rId = btn.getAttribute("data-vsc-pin-run");
      const target = _explorerRuns.find((r) => r.id === rId);
      if (!target) return;
      const nextPinned = !target.pinned;
      const res = await postJSON(`/api/explorer/runs/${encodeURIComponent(rId)}`, { pinned: nextPinned }, "PATCH");
      if (res?.ok && Array.isArray(res.runs)) {
        _explorerRuns = res.runs;
        updateExplorerPinButtonLabel();
        renderExplorerModelsBucketsPane();
        status(nextPinned ? "📌 Pinned run in memory." : "Unpinned run.");
      }
    });
  });

  wrap.querySelectorAll("[data-vsc-del-run]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const rId = btn.getAttribute("data-vsc-del-run");
      const res = await postJSON(`/api/explorer/runs/${encodeURIComponent(rId)}`, {}, "DELETE");
      if (res?.ok && Array.isArray(res.runs)) {
        _explorerRuns = res.runs;
        if (_activeExplorerRunId === rId) _activeExplorerRunId = _explorerRuns[0]?.id || null;
        renderAllAntigravityExplorerZones();
      }
    });
  });

  wrap.querySelectorAll("[data-vsc-toggle-model]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const mk = row.getAttribute("data-vsc-toggle-model");
      if (_vscExpandedNodes.has(mk)) _vscExpandedNodes.delete(mk);
      else _vscExpandedNodes.add(mk);
      renderExplorerModelsBucketsPane();
    });
  });

  wrap.querySelectorAll("[data-vsc-toggle-dir]").forEach((row) => {
    row.addEventListener("click", () => {
      const dk = `closed::${row.getAttribute("data-vsc-toggle-dir")}`;
      if (_vscExpandedNodes.has(dk)) _vscExpandedNodes.delete(dk);
      else _vscExpandedNodes.add(dk);
      renderExplorerModelsBucketsPane();
    });
  });

  wrap.querySelectorAll("[data-exp-check-key]").forEach((cb) => {
    cb.addEventListener("click", (e) => e.stopPropagation());
    cb.addEventListener("change", (e) => {
      const k = e.target.getAttribute("data-exp-check-key");
      if (!k) return;
      if (e.target.checked) _explorerCheckedKeys.add(k);
      else _explorerCheckedKeys.delete(k);
      updateExplorerCheckedCounter();
    });
  });

  wrap.querySelectorAll("[data-ag-open-diff]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const [rId, mStr, fStr] = String(btn.getAttribute("data-ag-open-diff") || "").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[Number(mStr)];
      const f = m?.files?.[Number(fStr)];
      if (!f || !m || !run) return;
      openFileInVscInspector({ source: "run", runId: run.id, modelIdx: Number(mStr), type: "file", fileIdx: Number(fStr), path: f.path, modelName: m.modelName });
      setAgCanvasMode("diff");
    });
  });

  wrap.querySelectorAll("[data-vsc-swap-single]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const [rId, mStr, fStr] = String(btn.getAttribute("data-vsc-swap-single") || "").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const mod = run?.models?.[Number(mStr)];
      const f = mod?.files?.[Number(fStr)];
      if (!f || !mod || !run) return;
      await swapFilesIntoActiveWorkspace([
        {
          path: f.path,
          content: f.content,
          language: f.language || "txt",
          fromRunId: run.id,
          fromRunLabel: (run.label || run.prompt || "Run").slice(0, 60),
          fromModelName: mod.modelName,
          fromHost: mod.host || "Council",
        },
      ]);
    });
  });

  wrap.querySelectorAll("[data-vsc-swap-model]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const [rId, mStr] = String(btn.getAttribute("data-vsc-swap-model") || "").split("::");
      const run = _explorerRuns.find((r) => r.id === rId);
      const mod = run?.models?.[Number(mStr)];
      if (!mod || !run || !(mod.files || []).length) return;
      const batch = mod.files.map((f) => ({
        path: f.path,
        content: f.content,
        language: f.language || "txt",
        fromRunId: run.id,
        fromRunLabel: (run.label || run.prompt || "Run").slice(0, 60),
        fromModelName: mod.modelName,
        fromHost: mod.host || "Council",
      }));
      await swapFilesIntoActiveWorkspace(batch);
    });
  });

  wrap.querySelectorAll("[data-exp-inspect-file]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      const [rId, mStr, fStr] = String(row.getAttribute("data-exp-inspect-file") || "").split("::");
      const mIdx = Number(mStr);
      const fIdx = Number(fStr);
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[mIdx];
      const f = m?.files?.[fIdx];
      if (!f || !m || !run) return;
      _activeExplorerRunId = run.id;
      updateExplorerPinButtonLabel();
      openFileInVscInspector({
        source: "run",
        runId: run.id,
        modelIdx: mIdx,
        type: "file",
        fileIdx: fIdx,
        path: f.path,
        modelName: m.modelName,
      });
      if (_agCanvasMode === "preview" && !/\.(md|html|htm)$/i.test(f.path)) {
        setAgCanvasMode("code");
      }
      renderVscActiveWorkspaceTree();
      renderExplorerModelsBucketsPane();
    });
  });

  wrap.querySelectorAll("[data-exp-inspect-resp]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("input")) return;
      const [rId, mStr] = String(row.getAttribute("data-exp-inspect-resp") || "").split("::");
      const mIdx = Number(mStr);
      const run = _explorerRuns.find((r) => r.id === rId);
      const m = run?.models?.[mIdx];
      if (!m || !run) return;
      _activeExplorerRunId = run.id;
      updateExplorerPinButtonLabel();
      openFileInVscInspector({
        source: "run",
        runId: run.id,
        modelIdx: mIdx,
        type: "response",
        path: `${(m.modelName || "model").replace(/[^a-z0-9_-]+/gi, "_")}_response.md`,
        modelName: m.modelName,
      });
      if (_agLayoutMode === "kw") setAgCanvasMode("preview");
      renderVscActiveWorkspaceTree();
      renderExplorerModelsBucketsPane();
    });
  });

  if (!_activeInspectedRef && filteredRuns[0]?.models?.[0]) {
    const r0 = filteredRuns[0];
    const m0 = r0.models[0];
    if (m0.files?.[0]) {
      openFileInVscInspector({
        source: "run",
        runId: r0.id,
        modelIdx: 0,
        type: "file",
        fileIdx: 0,
        path: m0.files[0].path,
        modelName: m0.modelName,
      });
    }
  }

  updateExplorerCheckedCounter();
}

function collectCheckedExplorerPayload(preferActiveWorkspace = false) {
  const wsFiles = Array.isArray(_explorerActiveWorkspace.files) ? _explorerActiveWorkspace.files : [];
  if (preferActiveWorkspace && wsFiles.length > 0) {
    return {
      files: wsFiles.map((f) => ({ path: f.path, language: f.language, content: f.content, modelName: f.fromModelName })),
      responses: [],
      run: { prompt: "active_merged_workspace" },
    };
  }

  const files = [];
  const responses = [];
  let primaryRun = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0] || null;

  for (const key of _explorerCheckedKeys) {
    const parts = key.split("::");
    const run = _explorerRuns.find((r) => r.id === parts[0]);
    if (!run) continue;
    primaryRun = run;
    const mIdx = Number(parts[1]);
    const m = run.models?.[mIdx];
    if (!m) continue;
    if (parts[2] === "response") {
      responses.push({ modelName: m.modelName, text: m.responseText || "" });
      extractFilesFromMarkdownForExplorer(m.responseText || "").forEach((ef) =>
        files.push({ ...ef, modelName: m.modelName, fromRunId: run.id, fromRunLabel: (run.label || run.prompt || "").slice(0, 60), fromHost: m.host || "Council" })
      );
    } else if (parts[2] === "file") {
      const fIdx = Number(parts[3]);
      const f = m.files?.[fIdx];
      if (f) {
        files.push({
          path: f.path,
          language: f.language,
          content: f.content,
          modelName: m.modelName,
          fromRunId: run.id,
          fromRunLabel: (run.label || run.prompt || "").slice(0, 60),
          fromHost: m.host || "Council",
        });
      }
    }
  }

  if (!files.length && !responses.length && wsFiles.length > 0) {
    return {
      files: wsFiles.map((f) => ({ path: f.path, language: f.language, content: f.content, modelName: f.fromModelName })),
      responses: [],
      run: primaryRun || { prompt: "active_merged_workspace" },
    };
  }

  if (!files.length && !responses.length && _activeInspectedRef) {
    const edVal = $("#explorer-inspector-editor")?.value || "";
    if (edVal.trim()) {
      files.push({ path: _activeInspectedRef.path || "main.py", content: edVal, modelName: _activeInspectedRef.modelName || "Inspector" });
    }
  }
  return { files, responses, run: primaryRun };
}

function downloadBase64Artifact(b64, filename, mime = "application/octet-stream") {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1500);
}

function initDedicatedFileExplorerView() {
  const populateSpecialistSelect = () => {
    const sel = $("#explorer-specialist-pick");
    if (!sel) return;
    sel.innerHTML =
      `<option value="cross-agent-dedup-merge-surgeon">👑 #28 Cross-Model Code Merger & Dedup Surgeon</option>` +
      BUILTIN_SWARM_GROUP_SPECIALISTS.map((s) => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
  };
  populateSpecialistSelect();

  getJSON("/api/toolchains/status")
    .then((st) => {
      const pill = $("#explorer-toolchains-pill");
      if (pill && st?.ok) {
        pill.textContent = `${st.python_version || "Python 3.10"} (${st.real_pypi_pip ? "PyPI pip" : "pip"}) · ${st.go_version || "Go 1.22"} · Windows x64 PE32+`;
      }
    })
    .catch(() => {});

  window.refreshFileExplorerView = () => {
    populateSpecialistSelect();
    loadExplorerRunsFromServer(_activeExplorerRunId);
    loadAgDiskTreeAndArtifacts();
  };

  // Layout Switcher: Software Engineering vs Knowledge Work
  document.querySelectorAll("[data-ag-set-layout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      _agLayoutMode = btn.getAttribute("data-ag-set-layout") || "swe";
      try { localStorage.setItem("ag_ide_layout", _agLayoutMode); } catch {}
      if (_agLayoutMode === "kw" && _activeInspectedRef && (/\.(md|html|htm)$/i.test(_activeInspectedRef.path || "") || _activeInspectedRef.type === "response")) {
        _agCanvasMode = "preview";
      }
      applyAgLayoutAndSectionState();
      if (_agCanvasMode === "preview") renderAgPreviewCanvas();
      status(_agLayoutMode === "kw" ? "📑 Switched to Antigravity Knowledge Work layout (Artifacts & Plans focused)." : "⚙️ Switched to Antigravity Software Engineering layout.");
    });
  });

  // Surface Switcher: Editor View vs Agent Manager Matrix
  document.querySelectorAll("[data-ag-set-surface]").forEach((btn) => {
    btn.addEventListener("click", () => {
      _agSurfaceMode = btn.getAttribute("data-ag-set-surface") || "editor";
      applyAgLayoutAndSectionState();
      if (_agSurfaceMode === "manager") renderAgManagerSurface();
    });
  });

  $("#ag-manager-back-editor-btn")?.addEventListener("click", () => {
    _agSurfaceMode = "editor";
    applyAgLayoutAndSectionState();
  });

  $("#ag-manager-accept-best-btn")?.addEventListener("click", async () => {
    const run = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0];
    if (!run) return;
    const batch = [];
    const seen = new Set();
    for (const m of run.models || []) {
      for (const f of m.files || []) {
        if (!seen.has(f.path)) {
          seen.add(f.path);
          batch.push({ path: f.path, content: f.content, language: f.language || "txt", fromRunId: run.id, fromRunLabel: (run.label || run.prompt || "Run").slice(0, 60), fromModelName: m.modelName, fromHost: m.host || "Council" });
        }
      }
    }
    if (batch.length) {
      await swapFilesIntoActiveWorkspace(batch);
      renderAgManagerSurface();
    }
  });

  // Canvas Mode Tabs (Code | Inline Diff | Artifact Preview)
  document.querySelectorAll("[data-ag-canvas-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setAgCanvasMode(btn.getAttribute("data-ag-canvas-mode") || "code");
    });
  });

  // Diff Style (Unified vs Split) & Prev/Next Hunk Navigation
  document.querySelectorAll("[data-ag-diff-style]").forEach((btn) => {
    btn.addEventListener("click", () => {
      _agDiffStyle = btn.getAttribute("data-ag-diff-style") || "unified";
      renderAgDiffCanvas();
    });
  });

  const jumpDiffHunk = (delta) => {
    if (_agCanvasMode !== "diff") setAgCanvasMode("diff");
    const hdrs = Array.from(document.querySelectorAll("#ag-diff-table-wrap .ag-hunk-hdr"));
    if (!hdrs.length) return;
    _agHunkScrollCursor = (_agHunkScrollCursor + delta + hdrs.length) % hdrs.length;
    hdrs[_agHunkScrollCursor]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $("#ag-diff-prev-btn")?.addEventListener("click", () => jumpDiffHunk(-1));
  $("#ag-diff-next-btn")?.addEventListener("click", () => jumpDiffHunk(1));

  // Floating Review Bar: Accept File & Reject / Revert
  $("#ag-diff-accept-btn")?.addEventListener("click", async () => {
    if (!_activeInspectedRef) return;
    const edVal = $("#explorer-inspector-editor")?.value || "";
    const run = _explorerRuns.find((r) => r.id === _activeInspectedRef.runId);
    await swapFilesIntoActiveWorkspace([
      {
        path: _activeInspectedRef.path || "main.py",
        content: edVal,
        language: (_activeInspectedRef.path || "txt").split(".").pop() || "txt",
        fromRunId: _activeInspectedRef.runId || "accepted_diff",
        fromRunLabel: (run?.label || run?.prompt || "Antigravity Diff Review").slice(0, 60),
        fromModelName: _activeInspectedRef.modelName || "Accepted Edit",
        fromHost: "Antigravity",
      },
    ]);
    const tKey = getAgRefTabKey(_activeInspectedRef);
    _agDirtyBuffers.delete(tKey);
    openFileInVscInspector({ source: "workspace", path: _activeInspectedRef.path || "main.py" });
  });

  $("#ag-diff-reject-btn")?.addEventListener("click", async () => {
    if (!_activeInspectedRef) return;
    const tKey = getAgRefTabKey(_activeInspectedRef);
    if (_agDirtyBuffers.has(tKey)) {
      _agDirtyBuffers.delete(tKey);
      openFileInVscInspector(_activeInspectedRef);
      renderAgModifiedSection();
      status(`✕ Discarded unsaved buffer edits on '${_activeInspectedRef.path}'.`);
      return;
    }
    if (_activeInspectedRef.source === "workspace") {
      const res = await postJSON("/api/explorer/workspace/revert", { path: _activeInspectedRef.path });
      if (res?.ok && res.workspace) {
        _explorerActiveWorkspace = res.workspace;
        openFileInVscInspector({ source: "workspace", path: _activeInspectedRef.path });
        renderAllAntigravityExplorerZones();
        status(`↺ Reverted '${_activeInspectedRef.path}' to previous version.`);
      }
    } else {
      setAgCanvasMode("code");
    }
  });

  // Sidebar Section Accept All / Revert All
  $("#ag-accept-all-mod-btn")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const items = collectPendingAgentModifiedItems();
    const batch = [];
    const seen = new Set();
    for (const it of items) {
      if (it.status === "S" || seen.has(it.path)) continue;
      seen.add(it.path);
      let content = "";
      const tKey = getAgRefTabKey(it.ref);
      if (_agDirtyBuffers.has(tKey)) {
        content = _agDirtyBuffers.get(tKey);
      } else if (it.ref.source === "run") {
        const r = _explorerRuns.find((x) => x.id === it.ref.runId);
        content = r?.models?.[it.ref.modelIdx]?.files?.[it.ref.fileIdx]?.content || "";
      }
      if (content) {
        batch.push({
          path: it.path,
          content,
          language: it.path.split(".").pop() || "txt",
          fromRunId: it.ref.runId || "accept_all",
          fromRunLabel: "Accepted All Pending Edits",
          fromModelName: it.ref.modelName || "Agent",
          fromHost: "Antigravity",
        });
      }
    }
    if (!batch.length) {
      status("No pending candidate or unsaved edits to accept.");
      return;
    }
    _agDirtyBuffers.clear();
    await swapFilesIntoActiveWorkspace(batch);
  });

  $("#ag-reject-all-mod-btn")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (_agDirtyBuffers.size > 0) {
      _agDirtyBuffers.clear();
      if (_activeInspectedRef) openFileInVscInspector(_activeInspectedRef);
      renderAllAntigravityExplorerZones();
      status("✕ Discarded all unsaved editor buffer modifications.");
      return;
    }
    const revTarget = (_explorerActiveWorkspace.files || []).find((f) => f.history?.length > 0);
    if (revTarget) {
      const res = await postJSON("/api/explorer/workspace/revert", { path: revTarget.path });
      if (res?.ok && res.workspace) {
        _explorerActiveWorkspace = res.workspace;
        renderAllAntigravityExplorerZones();
        status(`↺ Reverted '${revTarget.path}'.`);
      }
    }
  });

  // Customize Sidebar Sections Popover & Collapsible Section Headers
  $("#ag-customize-sections-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("#ag-sections-popover")?.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#ag-sections-popover") && !e.target.closest("#ag-customize-sections-btn")) {
      $("#ag-sections-popover")?.classList.add("hidden");
    }
  });
  document.querySelectorAll("[data-ag-sec-toggle]").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const k = e.target.getAttribute("data-ag-sec-toggle");
      if (!k) return;
      _agSectionVis[k] = Boolean(e.target.checked);
      try { localStorage.setItem("ag_ide_sections", JSON.stringify(_agSectionVis)); } catch {}
      applyAgLayoutAndSectionState();
    });
  });

  document.querySelectorAll("[data-ag-collapse-sec]").forEach((hdr) => {
    hdr.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const k = hdr.getAttribute("data-ag-collapse-sec");
      if (!k) return;
      if (_agCollapsedSecs.has(k)) {
        _agCollapsedSecs.delete(k);
        if (k === "disk" && !_agDiskFiles.length) loadAgDiskTreeAndArtifacts();
      } else {
        _agCollapsedSecs.add(k);
      }
      applyAgLayoutAndSectionState();
    });
  });

  $("#ag-refresh-disk-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    _agDiskContentCache.clear();
    loadAgDiskTreeAndArtifacts();
    status("↻ Refreshed Project Disk tree and Artifacts.");
  });

  // Inline + New File Creator
  const openNewFileBar = (e) => {
    if (e) e.stopPropagation();
    const bar = $("#ag-new-file-bar");
    bar?.classList.remove("hidden");
    $("#ag-new-file-input")?.focus();
  };
  $("#ag-new-file-toggle-btn")?.addEventListener("click", openNewFileBar);
  $("#ag-ws-quick-new-btn")?.addEventListener("click", openNewFileBar);
  $("#ag-new-file-cancel-btn")?.addEventListener("click", () => $("#ag-new-file-bar")?.classList.add("hidden"));

  const createNewWorkspaceFile = async () => {
    const inp = $("#ag-new-file-input");
    const rawPath = (inp?.value || "").trim().replace(/^\/+/, "");
    if (!rawPath) return;
    const ext = rawPath.split(".").pop()?.toLowerCase() || "txt";
    const starter =
      ext === "py" ? `#!/usr/bin/env python3\n"""${rawPath}"""\n\ndef main() -> None:\n    print("Ready")\n\nif __name__ == "__main__":\n    main()\n`
      : ext === "go" ? `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Ready")\n}\n`
      : ext === "html" ? `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>${rawPath}</title>\n</head>\n<body>\n  <h1>${rawPath}</h1>\n</body>\n</html>\n`
      : ext === "md" ? `# ${rawPath}\n\n`
      : `// ${rawPath}\n`;
    await swapFilesIntoActiveWorkspace([
      { path: rawPath, content: starter, language: ext, fromRunId: "new_file", fromRunLabel: "Created in Antigravity Explorer", fromModelName: "User", fromHost: "Local" },
    ]);
    if (inp) inp.value = "";
    $("#ag-new-file-bar")?.classList.add("hidden");
    openFileInVscInspector({ source: "workspace", path: rawPath });
    setAgCanvasMode("code");
    $("#explorer-inspector-editor")?.focus();
  };
  $("#ag-new-file-create-btn")?.addEventListener("click", createNewWorkspaceFile);
  $("#ag-new-file-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") createNewWorkspaceFile();
    else if (e.key === "Escape") $("#ag-new-file-bar")?.classList.add("hidden");
  });

  // Right Agent Side Panel Toggle & Mention Current File
  const toggleAgentPane = () => {
    _agAgentPanelOpen = !_agAgentPanelOpen;
    applyAgLayoutAndSectionState();
  };
  $("#ag-toggle-agent-pane-btn")?.addEventListener("click", toggleAgentPane);
  $("#ag-close-agent-pane-btn")?.addEventListener("click", toggleAgentPane);

  $("#ag-mention-current-btn")?.addEventListener("click", () => {
    if (!_activeInspectedRef) return;
    const edVal = $("#explorer-inspector-editor")?.value || "";
    addFileToAgAgentMentions({
      key: getAgRefTabKey(_activeInspectedRef),
      path: _activeInspectedRef.path || "active_file",
      source: _activeInspectedRef.source || "Editor",
      content: edVal,
      modelName: _activeInspectedRef.modelName || "Editor",
    });
    $("#explorer-swarm-goal-input")?.focus();
  });

  const attachCheckedToAgentContext = () => {
    const { files } = collectCheckedExplorerPayload(false);
    if (!files.length) {
      status("Check 1+ files in the Explorer tree first, or type @ in the composer.");
      return;
    }
    files.forEach((f) =>
      addFileToAgAgentMentions({
        key: `checked::${f.fromRunId || "ws"}::${f.path}`,
        path: f.path,
        source: f.modelName || "Checked",
        content: f.content || "",
        modelName: f.modelName || "Checked",
      })
    );
    status(`＋ Attached ${files.length} file(s) to Agent Side Panel context.`);
  };
  $("#ag-attach-checked-btn")?.addEventListener("click", attachCheckedToAgentContext);
  $("#ag-composer-add-checked-btn")?.addEventListener("click", attachCheckedToAgentContext);

  // @ File Autocomplete & / Slash Command Popups in Agent Composer
  const composerEl = $("#explorer-swarm-goal-input");
  const atMenu = $("#ag-at-mention-menu");
  const slashMenu = $("#ag-slash-cmd-menu");

  const openAtMenu = (filterStr = "") => {
    if (!atMenu) return;
    slashMenu?.classList.add("hidden");
    const q = filterStr.toLowerCase();
    const matches = getAllMentionableFilesCatalog()
      .filter((item) => !q || item.path.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q))
      .slice(0, 12);
    if (!matches.length) {
      atMenu.classList.add("hidden");
      return;
    }
    atMenu.innerHTML = matches
      .map(
        (m, idx) => `
        <div class="ag-popup-item ${idx === 0 ? "is-active" : ""}" data-ag-pick-at="${idx}">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${getFileIconByExt(m.path)} @${esc(m.path)}</span>
          <span style="color:#64748b;font-size:10px;flex-shrink:0">${esc(m.badge)}</span>
        </div>
      `
      )
      .join("");
    atMenu.classList.remove("hidden");
    atMenu.querySelectorAll("[data-ag-pick-at]").forEach((row) => {
      row.addEventListener("click", async () => {
        const picked = matches[Number(row.getAttribute("data-ag-pick-at"))];
        if (!picked) return;
        let fileContent = picked.content || "";
        if (picked.diskOnly) {
          const rDisk = await getJSON(`/api/explorer/disk-file?path=${encodeURIComponent(picked.path)}`);
          if (rDisk?.ok) fileContent = rDisk.content || "";
        }
        addFileToAgAgentMentions({ key: picked.key, path: picked.path, source: picked.badge, content: fileContent, modelName: picked.modelName });
        if (composerEl) {
          composerEl.value = composerEl.value.replace(/@[a-zA-Z0-9_./-]*$/, `@${picked.path} `);
          composerEl.focus();
        }
        atMenu.classList.add("hidden");
      });
    });
  };

  const openSlashMenu = (filterStr = "") => {
    if (!slashMenu) return;
    atMenu?.classList.add("hidden");
    const q = filterStr.toLowerCase();
    const matches = AG_SLASH_COMMANDS.filter((c) => !q || c.cmd.includes(q));
    if (!matches.length) {
      slashMenu.classList.add("hidden");
      return;
    }
    slashMenu.innerHTML = matches
      .map(
        (c, idx) => `
        <div class="ag-popup-item ${idx === 0 ? "is-active" : ""}" data-ag-pick-slash="${idx}">
          <strong style="color:#38bdf8">${esc(c.cmd)}</strong>
          <span style="color:#94a3b8;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.goal.slice(0, 48))}…</span>
        </div>
      `
      )
      .join("");
    slashMenu.classList.remove("hidden");
    slashMenu.querySelectorAll("[data-ag-pick-slash]").forEach((row) => {
      row.addEventListener("click", () => {
        const picked = matches[Number(row.getAttribute("data-ag-pick-slash"))];
        if (!picked) return;
        const sel = $("#explorer-specialist-pick");
        if (sel && Array.from(sel.options).some((o) => o.value === picked.spec)) {
          sel.value = picked.spec;
        }
        if (composerEl) {
          composerEl.value = picked.goal + " ";
          composerEl.focus();
        }
        slashMenu.classList.add("hidden");
      });
    });
  };

  composerEl?.addEventListener("input", () => {
    const val = composerEl.value || "";
    const caret = composerEl.selectionStart || val.length;
    const before = val.slice(0, caret);
    const atMatch = before.match(/(?:^|\s)@([a-zA-Z0-9_./-]*)$/);
    const slashMatch = before.match(/(?:^|\s)(\/[a-zA-Z0-9_-]*)$/);
    if (atMatch) openAtMenu(atMatch[1] || "");
    else if (slashMatch) openSlashMenu(slashMatch[1] || "");
    else {
      atMenu?.classList.add("hidden");
      slashMenu?.classList.add("hidden");
    }
  });

  composerEl?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      atMenu?.classList.add("hidden");
      slashMenu?.classList.add("hidden");
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      $("#explorer-run-specialist-btn")?.click();
    }
  });

  $("#ag-trigger-at-btn")?.addEventListener("click", () => {
    if (composerEl) {
      composerEl.value = (composerEl.value ? composerEl.value.trimEnd() + " @" : "@");
      composerEl.focus();
    }
    openAtMenu("");
  });

  $("#ag-trigger-slash-btn")?.addEventListener("click", () => {
    openSlashMenu("");
    composerEl?.focus();
  });

  // Editor Gutter Sync, Tab Indentation, Dirty Tracking & Ctrl/Cmd+S Save
  const edEl = $("#explorer-inspector-editor");
  edEl?.addEventListener("scroll", () => {
    const gut = $("#ag-line-gutter");
    if (gut) gut.scrollTop = edEl.scrollTop;
  });
  edEl?.addEventListener("click", syncEditorLineGutter);
  edEl?.addEventListener("keyup", syncEditorLineGutter);
  edEl?.addEventListener("input", () => {
    if (_activeInspectedRef) {
      const tKey = getAgRefTabKey(_activeInspectedRef);
      const val = edEl.value;
      if (val === _agSavedBuffers.get(tKey)) _agDirtyBuffers.delete(tKey);
      else _agDirtyBuffers.set(tKey, val);
      renderVscOpenTabsBar(tKey);
      renderAgModifiedSection();
      updateAgDiffReviewState();
    }
    syncEditorLineGutter();
  });
  edEl?.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = edEl.selectionStart;
      const end = edEl.selectionEnd;
      edEl.value = edEl.value.slice(0, start) + "  " + edEl.value.slice(end);
      edEl.selectionStart = edEl.selectionEnd = start + 2;
      edEl.dispatchEvent(new Event("input"));
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      $("#explorer-save-file-edit-btn")?.click();
    }
  });

  // W3C ARIA Treeview Keyboard Navigation on #explorer-models-buckets
  const treeRoot = $("#explorer-models-buckets");
  treeRoot?.addEventListener("keydown", (e) => {
    const rows = Array.from(treeRoot.querySelectorAll(".vsc-row"));
    if (!rows.length) return;
    let curIdx = rows.findIndex((r) => r.classList.contains("is-selected") || r === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = rows[Math.min(rows.length - 1, curIdx + 1)] || rows[0];
      next.setAttribute("tabindex", "-1");
      next.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = rows[Math.max(0, curIdx - 1)] || rows[0];
      prev.setAttribute("tabindex", "-1");
      prev.focus();
    } else if (e.key === "Enter" && curIdx >= 0) {
      e.preventDefault();
      rows[curIdx].click();
    } else if (e.key === "ArrowRight" && curIdx >= 0) {
      if (rows[curIdx].getAttribute("aria-expanded") === "false") {
        e.preventDefault();
        rows[curIdx].click();
      }
    } else if (e.key === "ArrowLeft" && curIdx >= 0) {
      if (rows[curIdx].getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        rows[curIdx].click();
      }
    }
  });

  // Collapsible Terminal Drawer Toggle
  $("#ag-toggle-terminal-btn")?.addEventListener("click", () => {
    const dr = $("#ag-terminal-drawer");
    if (!dr) return;
    const collapsed = dr.classList.toggle("is-collapsed");
    const btn = $("#ag-toggle-terminal-btn");
    if (btn) btn.textContent = collapsed ? "▸" : "▾";
  });

  // Legacy & Shared Button Wiring
  $("#tools-open-file-explorer-btn")?.addEventListener("click", () => {
    document.querySelector('.rail-btn[data-view="file-explorer"]')?.click();
  });

  $("#explorer-back-workspace-btn")?.addEventListener("click", () => {
    document.querySelector('.rail-btn[data-view="council"]')?.click();
  });

  $("#explorer-history-search")?.addEventListener("input", () => {
    renderExplorerModelsBucketsPane();
    renderAgDiskTree();
  });

  $("#explorer-expand-all-btn")?.addEventListener("click", () => {
    for (const k of Array.from(_vscExpandedNodes)) {
      if (k.startsWith("closed::")) _vscExpandedNodes.delete(k);
    }
    _explorerRuns.forEach((r) => {
      _vscExpandedNodes.add(`run::${r.id}`);
      (r.models || []).forEach((_, mi) => _vscExpandedNodes.add(`model::${r.id}::${mi}`));
    });
    renderVscActiveWorkspaceTree();
    renderExplorerModelsBucketsPane();
  });

  $("#explorer-collapse-all-btn")?.addEventListener("click", () => {
    _vscExpandedNodes.clear();
    renderVscActiveWorkspaceTree();
    renderExplorerModelsBucketsPane();
  });

  $("#explorer-pin-active-run-btn")?.addEventListener("click", async () => {
    const run = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0];
    if (!run) return;
    const res = await postJSON(`/api/explorer/runs/${encodeURIComponent(run.id)}`, { pinned: !run.pinned }, "PATCH");
    if (res?.ok && Array.isArray(res.runs)) {
      _explorerRuns = res.runs;
      updateExplorerPinButtonLabel();
      renderExplorerModelsBucketsPane();
      status(!run.pinned ? `📌 Pinned "${(run.prompt || "").slice(0, 40)}" in Explorer memory.` : "Unpinned run.");
    }
  });

  $("#explorer-stage-checked-btn")?.addEventListener("click", async () => {
    const { files } = collectCheckedExplorerPayload(false);
    if (!files.length) {
      status("Check 1+ files across any agent/run first, or click Swap next to any file.");
      return;
    }
    await swapFilesIntoActiveWorkspace(
      files.map((f) => ({
        path: f.path,
        content: f.content,
        language: f.language || "txt",
        fromRunId: f.fromRunId || _activeExplorerRunId || "run",
        fromRunLabel: f.fromRunLabel || "Checked Selection",
        fromModelName: f.modelName || "Model",
        fromHost: f.fromHost || "Council",
      }))
    );
  });

  $("#explorer-swap-current-btn")?.addEventListener("click", async () => {
    if (!_activeInspectedRef) {
      status("Select a file in the Antigravity Explorer sidebar first.");
      return;
    }
    const edVal = $("#explorer-inspector-editor")?.value || "";
    const run = _explorerRuns.find((r) => r.id === _activeInspectedRef.runId);
    await swapFilesIntoActiveWorkspace([
      {
        path: _activeInspectedRef.path || "main.py",
        content: edVal,
        language: (_activeInspectedRef.path || "txt").split(".").pop() || "txt",
        fromRunId: _activeInspectedRef.runId || "editor",
        fromRunLabel: (run?.label || run?.prompt || "Editor").slice(0, 60),
        fromModelName: _activeInspectedRef.modelName || "Editor",
        fromHost: "Council",
      },
    ]);
  });

  $("#vsc-clear-active-ws-btn")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const res = await postJSON("/api/explorer/workspace/file?path=*", { path: "*" }, "DELETE");
    if (res?.ok && res.workspace) {
      _explorerActiveWorkspace = res.workspace;
      renderAllAntigravityExplorerZones();
      updateExplorerCheckedCounter();
      status("Cleared Active Merged Build staging workspace.");
    }
  });

  $("#explorer-sync-latest-btn")?.addEventListener("click", async () => {
    if (window._lastAnswers && Object.keys(window._lastAnswers).length) {
      await window.recordPromptRunToFileExplorer(window._lastAnswers, window._lastPrompt || "Synced Workspace Run", MODE);
      status("Synced latest Workspace run into Antigravity Explorer.");
    } else {
      await loadExplorerRunsFromServer();
      await loadAgDiskTreeAndArtifacts();
      status("Refreshed Antigravity Explorer runs and artifacts.");
    }
  });

  $("#explorer-select-all-files-btn")?.addEventListener("click", () => {
    const activeRun = _explorerRuns.find((r) => r.id === _activeExplorerRunId) || _explorerRuns[0];
    if (!activeRun) return;
    (activeRun.models || []).forEach((m, mIdx) => {
      if ((m.files || []).length) {
        m.files.forEach((_, fIdx) => _explorerCheckedKeys.add(`${activeRun.id}::${mIdx}::file::${fIdx}`));
      } else {
        _explorerCheckedKeys.add(`${activeRun.id}::${mIdx}::response`);
      }
    });
    renderExplorerModelsBucketsPane();
  });

  $("#explorer-unselect-all-btn")?.addEventListener("click", () => {
    _explorerCheckedKeys.clear();
    renderExplorerModelsBucketsPane();
  });

  $("#explorer-clear-history-btn")?.addEventListener("click", async () => {
    const res = await postJSON("/api/explorer/runs", {}, "DELETE");
    _explorerRuns = Array.isArray(res?.runs) ? res.runs : [];
    _activeExplorerRunId = _explorerRuns[0]?.id || null;
    _explorerCheckedKeys.clear();
    renderAllAntigravityExplorerZones();
    status(`Cleared unpinned runs (${_explorerRuns.length} pinned run(s) preserved).`);
  });

  $("#explorer-save-file-edit-btn")?.addEventListener("click", async () => {
    if (!_activeInspectedRef) return;
    const newVal = $("#explorer-inspector-editor")?.value || "";
    const tKey = getAgRefTabKey(_activeInspectedRef);
    _agDirtyBuffers.delete(tKey);
    _agSavedBuffers.set(tKey, newVal);

    if (_activeInspectedRef.source === "workspace" || _activeInspectedRef.source === "disk") {
      await swapFilesIntoActiveWorkspace([
        {
          path: _activeInspectedRef.path,
          content: newVal,
          language: (_activeInspectedRef.path || "txt").split(".").pop() || "txt",
          fromRunId: "manual_edit",
          fromRunLabel: "Saved in Antigravity Editor",
          fromModelName: "User Edit",
        },
      ]);
      status(`Saved '${_activeInspectedRef.path}' into Active Merged Build.`);
      return;
    }
    const activeRun = _explorerRuns.find((r) => r.id === _activeInspectedRef.runId);
    const m = activeRun?.models?.[_activeInspectedRef.modelIdx];
    if (!m) return;
    if (_activeInspectedRef.type === "file" && m.files?.[_activeInspectedRef.fileIdx]) {
      m.files[_activeInspectedRef.fileIdx].content = newVal;
      m.files[_activeInspectedRef.fileIdx].size = newVal.length;
      await postJSON(
        `/api/explorer/runs/${encodeURIComponent(activeRun.id)}`,
        { modelIdx: _activeInspectedRef.modelIdx, fileIdx: _activeInspectedRef.fileIdx, content: newVal },
        "PATCH"
      );
    } else {
      m.responseText = newVal;
      await postJSON(
        `/api/explorer/runs/${encodeURIComponent(activeRun.id)}`,
        { modelIdx: _activeInspectedRef.modelIdx, responseText: newVal },
        "PATCH"
      );
    }
    renderVscOpenTabsBar(tKey);
    renderAgModifiedSection();
    updateAgDiffReviewState();
    status(`Persisted edits to '${_activeInspectedRef.path}' in Run Memory.`);
  });

  $("#explorer-download-single-btn")?.addEventListener("click", () => {
    const content = $("#explorer-inspector-editor")?.value || "";
    if (!content) return;
    const fname = (_activeInspectedRef?.path || "model_output.txt").split("/").pop();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    a.click();
  });

  $("#explorer-run-active-ws-btn")?.addEventListener("click", async () => {
    const outEl = $("#explorer-action-output");
    $("#ag-terminal-drawer")?.classList.remove("is-collapsed");
    const wsFiles = Array.isArray(_explorerActiveWorkspace.files) ? _explorerActiveWorkspace.files : [];
    if (!wsFiles.length) {
      if (outEl) outEl.textContent = "Active Merged Build is empty — click Swap or Accept File on 1+ files first.";
      return;
    }
    if (outEl) outEl.textContent = `⏳ Compiling & executing Active Merged Build (${wsFiles.length} file(s))…`;
    const res = await postJSON("/api/explorer/compile", {
      title: "active_merged_build",
      format: "run",
      selected_files: wsFiles.map((f) => ({ path: f.path, language: f.language, content: f.content, modelName: f.fromModelName })),
    });
    if (outEl) {
      outEl.textContent = res?.ok
        ? `✅ ACTIVE MERGED BUILD EXECUTION (${res.buildDir || _explorerActiveWorkspace.outputDir}):\n\n${res.output || "(Exit 0)"}`
        : `❌ Active Build Error:\n${res?.error || res?.output || "Unknown error"}`;
    }
  });

  $("#explorer-open-vscode-btn")?.addEventListener("click", async () => {
    const dir = _explorerActiveWorkspace.outputDir || "council_outputs/active_merged_workspace";
    const res = await postJSON("/api/workspace/open", { path: dir });
    const outEl = $("#explorer-action-output");
    $("#ag-terminal-drawer")?.classList.remove("is-collapsed");
    if (outEl) {
      outEl.textContent = res?.ok
        ? `💻 Staged in Workspace Directory: ${res.path || dir}\nFiles on disk: ${(_explorerActiveWorkspace.files || []).map((f) => f.path).join(", ") || "(none yet)"}`
        : `⚠️ ${res?.error || "Stage files into Active Merged Build first."}`;
    }
  });

  $("#explorer-compile-run-btn")?.addEventListener("click", async () => {
    const outEl = $("#explorer-action-output");
    $("#ag-terminal-drawer")?.classList.remove("is-collapsed");
    const { files, run } = collectCheckedExplorerPayload(false);
    if (!files.length) {
      if (outEl) outEl.textContent = "Check 1+ files or stage files into Active Merged Build first.";
      return;
    }
    if (outEl) outEl.textContent = `⏳ Writing ${files.length} file(s) to sandbox and executing with Python / Go / Node…`;
    const res = await postJSON("/api/explorer/compile", {
      title: run?.prompt || "explorer_run",
      format: "run",
      selected_files: files,
    });
    if (outEl) {
      outEl.textContent = res?.ok
        ? `✅ LIVE EXECUTION OUTPUT (${res.buildDir || "sandbox"}):\n\n${res.output || "(Exit 0 — no stdout)"}`
        : `❌ Compile/Run Error:\n${res?.error || res?.output || "Unknown error"}`;
    }
  });

  $("#explorer-build-win-exe-btn")?.addEventListener("click", async () => {
    const outEl = $("#explorer-action-output");
    const btn = $("#explorer-build-win-exe-btn");
    $("#ag-terminal-drawer")?.classList.remove("is-collapsed");
    const useActive = _explorerCheckedKeys.size === 0 && (_explorerActiveWorkspace.files || []).length > 0;
    const { files, run } = collectCheckedExplorerPayload(useActive);
    if (!files.length) {
      if (outEl) outEl.textContent = "Stage files into Active Merged Build or check 1+ files to compile a Windows x64 .exe.";
      return;
    }
    if (btn) btn.disabled = true;
    if (outEl) outEl.textContent = `⏳ Cross-compiling ${files.length} file(s) with Go 1.22 (GOOS=windows GOARCH=amd64) into a Windows x64 PE32+ .exe…`;
    try {
      const res = await postJSON("/api/explorer/compile", {
        title: (run?.prompt || "suomynona_merged_app").slice(0, 28),
        format: "exe",
        selected_files: files,
      });
      if (res?.ok && res.exe_base64) {
        downloadBase64Artifact(res.exe_base64, res.download_name || "suomynona_app.exe", "application/vnd.microsoft.portable-executable");
        if (outEl) {
          outEl.textContent =
            `✅ BUILT & DOWNLOADED WINDOWS x64 PE32+ EXECUTABLE\n` +
            `• File     : ${res.download_name} (${Math.round((res.size_bytes || 0) / 1024)} KB)\n` +
            `• Header   : MZ (0x4D5A) + PE\\0\\0 Machine 0x8664 (AMD64 Native Binary)\n` +
            `• Saved At : ${res.exe_path}\n\n${res.output || ""}`;
        }
        status(`Downloaded Windows x64 PE32+ binary: ${res.download_name}`);
      } else if (outEl) {
        outEl.textContent = `❌ Windows .EXE Build Failed:\n${res?.error || "Compiler error"}`;
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  $("#explorer-send-crucible-btn")?.addEventListener("click", async () => {
    const useActive = _explorerCheckedKeys.size === 0 && (_explorerActiveWorkspace.files || []).length > 0;
    const { files, responses, run } = collectCheckedExplorerPayload(useActive);
    if (!files.length && !responses.length) {
      if ($("#explorer-action-output")) $("#explorer-action-output").textContent = "Check 1+ files or stage files in Active Merged Build first.";
      return;
    }
    const syntheticAnswers = {};
    files.forEach((f, idx) => {
      const key = `${f.modelName || "Model"}_${idx + 1}`;
      syntheticAnswers[key] = { name: key, text: `=== FILE: ${f.path} ===\n\`\`\`${f.language || "py"}\n${f.content}\n\`\`\`` };
    });
    responses.forEach((r, idx) => {
      syntheticAnswers[`${r.modelName}_resp_${idx}`] = { name: r.modelName, text: r.text };
    });
    window._lastAnswers = syntheticAnswers;
    window._lastPrompt = run?.prompt || "Crucible Merge from Antigravity Explorer";
    renderOmegaMultiAgentFilesHub(syntheticAnswers, window._lastPrompt);
    document.querySelector('.rail-btn[data-view="council"]')?.click();
    $("#omega-agent-files-hub")?.classList.remove("hidden");
    $("#omega-agent-files-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
    status(`⚔️ Loaded ${files.length} file(s) into the 3-Model Circular Merge Crucible.`);
  });

  // Antigravity Right Agent Side Panel Dispatch (combines @mentions + @ActiveFile + Checked files)
  $("#explorer-run-specialist-btn")?.addEventListener("click", async () => {
    const outEl = $("#explorer-action-output");
    const btn = $("#explorer-run-specialist-btn");
    const useActive = _explorerCheckedKeys.size === 0 && _agAgentMentions.length === 0 && (_explorerActiveWorkspace.files || []).length > 0;
    const { files: baseFiles, responses, run } = collectCheckedExplorerPayload(useActive);

    const combinedFiles = [...baseFiles];
    const seenKeys = new Set(combinedFiles.map((f) => `${f.modelName}::${f.path}`));

    if (_agIncludeActiveFileInAgent && _activeInspectedRef?.path) {
      const edVal = $("#explorer-inspector-editor")?.value || "";
      const ak = `${_activeInspectedRef.modelName || "Active"}::${_activeInspectedRef.path}`;
      if (edVal.trim() && !seenKeys.has(ak)) {
        seenKeys.add(ak);
        combinedFiles.unshift({
          path: _activeInspectedRef.path,
          language: _activeInspectedRef.path.split(".").pop() || "txt",
          content: edVal,
          modelName: _activeInspectedRef.modelName || "Active Editor",
        });
      }
    }

    for (const m of _agAgentMentions) {
      const mk = `${m.modelName}::${m.path}`;
      if (!seenKeys.has(mk) && m.content) {
        seenKeys.add(mk);
        combinedFiles.push({
          path: m.path,
          language: m.path.split(".").pop() || "txt",
          content: m.content,
          modelName: m.modelName || "Mention",
        });
      }
    }

    if (!combinedFiles.length && !responses.length) {
      status("Open or @mention at least one file (or check files in the tree) before running the Agent.");
      return;
    }

    const specId = $("#explorer-specialist-pick")?.value || "cross-agent-dedup-merge-surgeon";
    const specObj = BUILTIN_SWARM_GROUP_SPECIALISTS.find((s) => s.id === specId);
    const agentTitle = specObj?.name || "Merger Surgeon";
    const goal =
      ($("#explorer-swarm-goal-input")?.value || "").trim() ||
      "Reconcile attached @files, eliminate bugs or import mismatches, and emit complete ready-to-run files.";

    const nowClock = new Date().toTimeString().slice(0, 8);
    _agAgentThread.push({
      id: `u_${Date.now()}`,
      role: "user",
      title: `You (${combinedFiles.length} file ctx)`,
      ts: nowClock,
      text: goal,
      files: [],
    });
    renderAgAgentThread();

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Running…";
    }
    if (outEl) outEl.textContent = `🐝 Dispatching ${combinedFiles.length} context file(s) to ${agentTitle}…`;

    try {
      const res = await postJSON("/api/explorer/swarm-review", {
        run_id: _activeExplorerRunId,
        specialist_id: specId,
        specialist_name: agentTitle,
        goal,
        original_prompt: run?.prompt || goal,
        selected_files: combinedFiles,
        selected_responses: responses,
      });
      if (res?.ok) {
        const extractedFiles = res.bucket?.files || extractFilesFromMarkdownForExplorer(res.review || "");
        _agAgentThread.push({
          id: `a_${Date.now()}`,
          role: "agent",
          title: agentTitle,
          ts: new Date().toTimeString().slice(0, 8),
          text: res.review || "(Completed)",
          files: extractedFiles,
          runId: res.new_run?.id || _activeExplorerRunId,
        });
        renderAgAgentThread();
        if (outEl) outEl.textContent = `✅ ${agentTitle} Output:\n\n${res.review || ""}`;
        if ($("#explorer-swarm-goal-input")) $("#explorer-swarm-goal-input").value = "";
        if (res.new_run?.id) {
          await loadExplorerRunsFromServer(res.new_run.id);
        }
        status(`✓ ${agentTitle} emitted ${extractedFiles.length} file(s) — click Diff or Accept in the Agent Panel!`);
      } else {
        _agAgentThread.push({
          id: `e_${Date.now()}`,
          role: "agent",
          title: "Agent Error",
          ts: new Date().toTimeString().slice(0, 8),
          text: res?.error || "Request failed",
          files: [],
        });
        renderAgAgentThread();
        if (outEl) outEl.textContent = `❌ Agent Error: ${res?.error || "Failed"}`;
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Run Agent ⏎";
      }
    }
  });

  loadExplorerRunsFromServer();
  loadAgDiskTreeAndArtifacts();
}

// ── [TODO #2, #3, #4, #5] Form Sandbox (#49), DNS/Auth Scanner (#50), 3-Judge Rubric, & Cron Schedules ──
function initV82TodoSandboxesAndRubric() {
  // 1. [TODO #2] Specialist #49 Form Automation Sandbox Modal
  const formModal = $("#form-sandbox-modal");
  $("#open-form-sandbox-btn")?.addEventListener("click", () => formModal?.classList.remove("hidden"));
  $("#form-sandbox-close")?.addEventListener("click", () => formModal?.classList.add("hidden"));
  formModal?.addEventListener("click", (e) => {
    if (e.target === formModal) formModal.classList.add("hidden");
  });

  $("#form-sandbox-inspect-btn")?.addEventListener("click", async () => {
    const url = ($("#form-sandbox-url")?.value || "").trim();
    const out = $("#form-sandbox-output");
    if (!url) return;
    if (out) out.textContent = `🔍 Fetching & parsing HTML <form> fields from ${url}…`;
    const res = await postJSON("/api/forms/inspect", { url });
    if (res?.ok) {
      if (res.sampleMap && Object.keys(res.sampleMap).length && $("#form-sandbox-json-map")) {
        $("#form-sandbox-json-map").value = JSON.stringify(res.sampleMap, null, 2);
      }
      if (res.forms?.[0]?.method && $("#form-sandbox-method")) {
        $("#form-sandbox-method").value = res.forms[0].method.toUpperCase() === "GET" ? "GET" : "POST";
      }
      if (out) {
        out.textContent = `✅ Detected ${(res.forms || []).length} form(s) & ${Object.keys(res.sampleMap || {}).length} input field(s) on ${res.finalAction || url}.\nJSON field map populated above — edit values if needed and click "⚡ Generate & Run Automation".`;
      }
    } else if (out) {
      out.textContent = `⚠️ Inspect error: ${res?.error || "Unable to fetch target URL"}`;
    }
  });

  $("#form-sandbox-run-btn")?.addEventListener("click", async () => {
    const url = ($("#form-sandbox-url")?.value || "").trim();
    const method = $("#form-sandbox-method")?.value || "POST";
    const useProxy = Boolean($("#form-sandbox-use-proxy")?.checked);
    const out = $("#form-sandbox-output");
    let fieldMap = {};
    try {
      fieldMap = JSON.parse($("#form-sandbox-json-map")?.value || "{}");
    } catch (e) {
      if (out) out.textContent = `⚠️ Invalid JSON in field map: ${e.message}`;
      return;
    }
    if (out) out.textContent = `⚡ Generating Playwright + Python HTTP workflow script & running live dry-run against ${url}…`;
    const res = await postJSON("/api/forms/generate-run", { url, method, fields: fieldMap, bind_verified_proxy: useProxy });
    if (res?.ok) {
      if (out) {
        out.textContent =
          `✅ Status: HTTP ${res.http_status || 200} · Bound Proxy: ${res.bound_proxy || "Direct"}\n` +
          `📁 Saved Playwright + Python scripts into 🗂️ File Explorer!\n\n` +
          `── Response Preview ──\n${(res.response_preview || "").slice(0, 700)}\n\n` +
          `── Generated Playwright Script ──\n${res.playwright_script || ""}`;
      }
      await loadExplorerRunsFromServer(res.explorer_run_id || null);
      status("📋 Form Sandbox (#49) executed & archived automation scripts into 🗂️ File Explorer!");
    } else if (out) {
      out.textContent = `❌ Form Sandbox Error: ${res?.error || "Failed"}`;
    }
  });

  // 2. [TODO #3] Specialist #50 Live Email DNS (MX/SPF/DKIM/DMARC) & Password Hygiene Scanner
  const authModal = $("#auth-scanner-modal");
  let _lastAuthAuditMd = "";
  $("#open-auth-scanner-btn")?.addEventListener("click", () => authModal?.classList.remove("hidden"));
  $("#auth-scanner-close")?.addEventListener("click", () => authModal?.classList.add("hidden"));
  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) authModal.classList.add("hidden");
  });

  $("#auth-scan-run-btn")?.addEventListener("click", async () => {
    const domain = ($("#auth-scan-domain")?.value || "").trim();
    const password = $("#auth-scan-password")?.value || "";
    const hash = ($("#auth-scan-hash")?.value || "").trim();
    const out = $("#auth-scan-output");
    if (out) out.textContent = `🔬 Querying live DNS resolvers (MX, SPF, DMARC, DKIM) for "${domain}" & running NIST SP 800-63B / OWASP hash audit…`;
    const res = await postJSON("/api/auth-qa/audit", { domain, sample_password: password, sample_hash: hash });
    if (res?.ok) {
      _lastAuthAuditMd = res.markdown_report || JSON.stringify(res, null, 2);
      if (out) out.textContent = _lastAuthAuditMd;
      status(`🔐 Completed live DNS & Auth hygiene audit for ${res.domain || domain} (Score: ${res.overall_score ?? 100}/100)`);
    } else if (out) {
      out.textContent = `❌ Audit error: ${res?.error || "Failed"}`;
    }
  });

  $("#auth-scanner-download-btn")?.addEventListener("click", () => {
    if (!_lastAuthAuditMd) return;
    const blob = new Blob([_lastAuthAuditMd], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "email_dns_auth_audit.md";
    a.click();
  });

  // 3. [TODO #4] 3-Judge Blind Rubric Contest Mode (#rubric-judge-btn)
  $("#rubric-judge-btn")?.addEventListener("click", async () => {
    const btn = $("#rubric-judge-btn");
    const ansEntries = Object.entries(window._lastAnswers || answers || {})
      .map(([k, v]) => ({
        name: v?.name || STATE?.backends?.find((b) => String(b.i) === String(k))?.name || `Model ${k}`,
        text: typeof v === "string" ? v : String(v?.text || ""),
      }))
      .filter((x) => x.text.trim());

    if (window._lastVerdict && !ansEntries.length) {
      ansEntries.push({ name: "Hot Potato / Council Output", text: String(window._lastVerdict) });
    }
    if (!ansEntries.length) {
      status("⚠️ Run a prompt (Ask, Plan, Build, Cloud, or Hot Potato) first so the 3 Blind Judges have candidate outputs to score!");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "⚖️ Scoring 3-Judge Rubric…";
    }
    status("⚖️ Running 3-Judge Blind Rubric Contest (Security · Performance · Spec-Compliance 0–100)…");
    try {
      const res = await postJSON("/api/judge/rubric", {
        prompt: window._lastPrompt || ($("#prompt")?.value || "").trim(),
        candidates: ansEntries,
      });
      if (res?.ok) {
        const verdictCard = $("#verdict");
        const verdictBody = $("#verdict-body") || verdictCard;
        if (verdictCard) verdictCard.classList.remove("hidden");
        const rowsHtml = (res.scoreboard || [])
          .map(
            (s, i) => `
              <tr style="${i === 0 ? "background:rgba(46,230,166,.12);font-weight:700" : ""}">
                <td style="padding:6px 8px">${i === 0 ? "🏆 " : `#${i + 1} `}${esc(s.candidate_name)} <span style="color:#64748b;font-size:10px">(${esc(s.blind_id)})</span></td>
                <td class="tabular-nums" style="padding:6px 8px;color:#38bdf8">${s.security}/100</td>
                <td class="tabular-nums" style="padding:6px 8px;color:#c084fc">${s.performance}/100</td>
                <td class="tabular-nums" style="padding:6px 8px;color:#fbbf24">${s.spec_compliance}/100</td>
                <td class="tabular-nums" style="padding:6px 8px;color:#2ee6a6;font-weight:800">${s.total_avg}/100</td>
              </tr>`
          )
          .join("");
        if (verdictBody) {
          verdictBody.innerHTML = `
            <div style="padding:10px 12px;border-radius:8px;background:rgba(8,15,30,.92);border:1px solid rgba(56,189,248,.4);margin-bottom:10px">
              <div style="font-size:13px;font-weight:800;color:#2ee6a6;margin-bottom:6px">🏆 3-Judge Blind Rubric Winner: ${esc(res.winner?.candidate_name || "Top Candidate")} (${res.winner?.total_avg || 0}/100)</div>
              <table style="width:100%;border-collapse:collapse;font-size:11.5px;text-align:left">
                <thead>
                  <tr style="border-bottom:1px solid rgba(148,163,184,.25);color:#94a3b8">
                    <th style="padding:5px 8px">Blind Candidate</th>
                    <th style="padding:5px 8px">🛡 Security</th>
                    <th style="padding:5px 8px">⚡ Performance</th>
                    <th style="padding:5px 8px">📐 Spec-Compliance</th>
                    <th style="padding:5px 8px">Total Avg</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
              <pre style="margin:8px 0 0;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:11px;color:#cbd5e1">${esc(res.synthesis || "")}</pre>
            </div>
          `;
        }
        verdictCard?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        status(`🏆 3-Judge Blind Rubric crowned "${res.winner?.candidate_name}" (${res.winner?.total_avg}/100)!`);
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "⚖️ 3-Judge Rubric";
      }
    }
  });

  // 4. [TODO #5] Scheduled Swarm Pipelines / Recurring Cron Jobs (#cron-schedules-modal)
  const cronModal = $("#cron-schedules-modal");
  const renderSchedulesList = async () => {
    const listEl = $("#cron-jobs-list");
    if (!listEl) return;
    const res = await getJSON("/api/schedules");
    const jobs = res?.schedules || [];
    if (!jobs.length) {
      listEl.innerHTML = `<div class="muted" style="padding:14px;text-align:center;font-size:12px">No recurring jobs scheduled yet — add a Proxy CSV Refresh, Domain DNS Watchdog, or Autonomous Swarm Prompt above.</div>`;
      return;
    }
    listEl.innerHTML = jobs
      .map(
        (j) => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:9px 12px;border-radius:8px;background:rgba(10,18,36,.92);border:1px solid rgba(148,163,184,.24)">
            <div style="flex:1;min-width:220px">
              <strong style="color:#f8fafc;font-size:12.5px">${esc(j.name)}</strong>
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;padding:1px 6px;border-radius:4px;background:rgba(251,191,36,.16);color:#fde68a;margin-left:6px">Every ${j.interval_minutes}m · ${esc(j.kind)}</span>
              <div class="muted tabular-nums" style="font-size:11px;margin-top:3px">Target: <code>${esc(j.target || "default")}</code> · Runs: ${j.run_count || 0} · Last: ${esc(j.last_status || "Pending")}</div>
            </div>
            <div class="row" style="gap:6px">
              <button type="button" class="primary xs" data-cron-run-now="${esc(j.id)}">▶ Run Now</button>
              <button type="button" class="ghost xs" data-cron-toggle="${esc(j.id)}">${j.enabled ? "⏸ Pause" : "▶ Enable"}</button>
              <button type="button" class="ghost xs" style="color:#ff6b8b" data-cron-del="${esc(j.id)}">✕</button>
            </div>
          </div>
        `
      )
      .join("");

    listEl.querySelectorAll("[data-cron-run-now]").forEach((b) =>
      b.addEventListener("click", async () => {
        b.disabled = true;
        b.textContent = "⏳…";
        await postJSON(`/api/schedules/${b.getAttribute("data-cron-run-now")}/run-now`, {});
        await renderSchedulesList();
      })
    );
    listEl.querySelectorAll("[data-cron-toggle]").forEach((b) =>
      b.addEventListener("click", async () => {
        await postJSON(`/api/schedules/${b.getAttribute("data-cron-toggle")}/toggle`, {});
        await renderSchedulesList();
      })
    );
    listEl.querySelectorAll("[data-cron-del]").forEach((b) =>
      b.addEventListener("click", async () => {
        await postJSON(`/api/schedules/${b.getAttribute("data-cron-del")}`, {}, "DELETE");
        await renderSchedulesList();
      })
    );
  };

  $("#open-cron-schedules-btn")?.addEventListener("click", () => {
    cronModal?.classList.remove("hidden");
    renderSchedulesList();
  });
  $("#cron-schedules-close")?.addEventListener("click", () => cronModal?.classList.add("hidden"));
  cronModal?.addEventListener("click", (e) => {
    if (e.target === cronModal) cronModal.classList.add("hidden");
  });

  $("#cron-add-btn")?.addEventListener("click", async () => {
    const name = ($("#cron-new-name")?.value || "").trim() || "Scheduled Pipeline";
    const kind = $("#cron-new-kind")?.value || "proxy_refresh";
    const target = ($("#cron-new-target")?.value || "").trim();
    const mins = Math.max(1, Number($("#cron-new-mins")?.value) || 30);
    const res = await postJSON("/api/schedules", { name, kind, target, interval_minutes: mins });
    if (res?.ok) {
      if ($("#cron-new-name")) $("#cron-new-name").value = "";
      await renderSchedulesList();
      status(`⏱️ Scheduled "${name}" every ${mins} minute(s)!`);
    }
  });
}



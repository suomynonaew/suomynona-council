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
  if (typeof syncRamSwarmModelsAndSetup === "function") syncRamSwarmModelsAndSetup();
  updateAgentMcpAndToolAdvisor("");
  if (typeof initV82TodoSandboxesAndRubric === "function") initV82TodoSandboxesAndRubric();
  if (typeof initDedicatedFileExplorerView === "function") initDedicatedFileExplorerView();
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

// Explorer state & controller now live in public/js/09-antigravity-explorer.js.

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

// Antigravity Explorer Workbench moved to public/js/09-antigravity-explorer.js

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



// One set of facts for the whole site: the page (index.html) and the résumé (resume.html) both read it.
// Every number here comes from the linked project's own README, tests or published write-up.
window.SITE = {
  name: "Arshd Rashid Wani",
  short: "Arshd Wani",
  role: "Software engineer · backend & AI evaluation",
  status: "Open to full-time software engineering roles",
  email: ["arshdwani159", "gmail.com"], // joined in app.js so simple scrapers skip it
  links: {
    github: "https://github.com/arshdwani",
    linkedin: "https://www.linkedin.com/in/arshd-rashid-wani-658a47394",
    site: "https://arshdwani.github.io/portfolio/",
  },
  resume: "Arshd-Rashid-Wani-Resume.pdf",

  summary:
    "Software engineer with experience in backend development, cloud and database systems, LLM evaluation and AI " +
    "benchmarking. At Handshake AI, I write hard, realistic terminal tasks that frontier coding agents are graded on. " +
    "Before that, I built cloud and database backend services and REST APIs at Oracle.",

  featured: [
    {
      id: "agent-benchmarks",
      kind: "Benchmark tasks",
      year: "2026",
      title: "Coding-agent benchmark tasks",
      what: "Hard, realistic Linux-terminal tasks that frontier coding agents are graded on. Each one ships a Docker environment, a reference solution and pytest checks that don't care how the agent got there.",
      role: "Task author, Handshake AI Fellowship",
      result: "One of my tasks went unsolved in 5 of 5 frontier-model attempts. Every task has to pass a CI difficulty check against a frontier model.",
      chart: { type: "attempts", n: 5, solved: 0 },
      stack: ["Docker", "Python", "pytest", "Bash", "GitHub Actions"],
      links: [],
      note: "Private benchmark",
    },
    {
      id: "offer-or-bait",
      kind: "Browser tool",
      year: "2026",
      title: "Offer or Bait?",
      what: "Paste a recruiter email, text or DM. It highlights the lines a scammer would write, explains each one and gives you a safe reply. Nothing leaves your browser.",
      role: "Designed, built and tested it",
      result: "Tested on real messages. v1 missed 25 of 48 scam emails sent to students and flagged 16 of 128 real job postings. v2: 3 missed, 0 false alarms.",
      chart: {
        type: "beforeAfter",
        rows: [
          { label: "Scams missed", total: 48, before: 25, after: 3 },
          { label: "False alarms", total: 128, before: 16, after: 0 },
        ],
      },
      stack: ["JavaScript", "17 rules", "Node tests", "CSP: no network"],
      links: [
        { label: "Live", href: "https://arshdwani.github.io/offer-or-bait/" },
        { label: "Code", href: "https://github.com/arshdwani/offer-or-bait" },
      ],
    },
    {
      id: "is-it-hard",
      kind: "Simulator",
      year: "2026",
      title: "Is It Actually Hard?",
      what: "A benchmark gate simulator for anyone testing AI agents: set how many runs you pay for, then see what a few failures can really prove about a task.",
      role: "Designed and built it",
      result: "A clean 0 for 5 still allows a 45% solve rate. Showing a task is under 10% takes 29 straight failures. Exact binomial maths, unit-tested.",
      chart: { type: "curve", marks: [5, 29] },
      stack: ["JavaScript", "Binomial maths", "Unit tests"],
      links: [
        { label: "Live", href: "https://arshdwani.github.io/is-it-hard/" },
        { label: "Code", href: "https://github.com/arshdwani/is-it-hard" },
      ],
    },
    {
      id: "dynamo",
      kind: "macOS app · open source",
      year: "2026",
      title: "Dynamo",
      what: "Battery care for Apple Silicon Macs: a hard charge limit, calibration, heat protection, battery health and live power flow, right in the menu bar.",
      role: "Built it and maintain the releases",
      result: "A SwiftUI app plus a small root daemon that drives the Mac's SMC charging controls. The charging rules are one pure function, tested without a real battery.",
      chart: { type: "battery", limit: 80 },
      stack: ["Swift", "SwiftUI", "launchd", "Homebrew tap"],
      links: [
        { label: "Code", href: "https://github.com/arshdwani/Dynamo" },
      ],
      check: "release",
    },
    {
      id: "asked-before",
      kind: "Browser tool",
      year: "2026",
      title: "Asked Before",
      what: "Job forms ask the same things in different words. Paste one and your saved answers come back fitted to this job, with slips flagged, like another company's name left in.",
      role: "Designed, built and tested it",
      result: "On real application forms, 13 of 62 auto-fills were wrong. Turning those errors into rules cut it to 4 of 58 on forms it hadn't seen.",
      chart: {
        type: "beforeAfter",
        rows: [{ label: "Wrong fills", total: 62, before: 13, after: 4, afterTotal: 58 }],
        pct: true,
      },
      stack: ["JavaScript", "22 Node tests", "Real-form scoring"],
      links: [
        { label: "Live", href: "https://arshdwani.github.io/asked-before/" },
        { label: "Code", href: "https://github.com/arshdwani/asked-before" },
      ],
    },
    {
      id: "ipl-200-era",
      kind: "Data story",
      year: "2026",
      title: "The 200 Era",
      what: "Did the IPL's 2023 Impact Player rule cause its scoring boom? An interactive dashboard of all 295,557 deliveries since 2008, with a control group.",
      role: "Cleaned the data, built the dashboard",
      result: "The median first innings hit 201 in 2026; no season before 2023 topped 174. Against four leagues without the rule, the IPL sped up 2.5 times as much.",
      chart: {
        type: "spark",
        from: 2008,
        split: 2023,
        values: [163.5, 149, 169, 159, 160, 159, 161.5, 167, 162.5, 165, 174, 170, 167, 157.5, 169.5, 182, 186, 196, 201],
      },
      stack: ["Python", "pandas", "SVG charts", "Cricsheet data"],
      links: [
        { label: "Live", href: "https://arshdwani.github.io/ipl-200-era/" },
        { label: "Code", href: "https://github.com/arshdwani/ipl-200-era" },
      ],
    },
  ],

  more: [
    { title: "LeakLens", kind: "Eval tool", what: "Checks a benchmark for test-set leaks with fingerprints, shared word spans and embeddings, scored on planted leaks.", href: "https://leaklens.brainytern5.chatgpt.site/" },
    { title: "Counterexample Studio", kind: "Eval tool", what: "Runs AI-written code against reference implementations and shrinks each failing input to a small, reproducible case.", href: "https://counterexample-studio.brainytern5.chatgpt.site/" },
    { title: "PIDGIN", kind: "Multiplayer game", what: "2 to 8 friends invent a language from 12 symbols, in real time, with reconnects and nine interface languages.", href: "https://pidgin.onrender.com/" },
    { title: "Comet Court", kind: "Multiplayer game", what: "Place a gravity well, secretly pull or push, and watch one synchronized comet decide the round.", href: "https://comet-court.brainytern5.chatgpt.site/" },
    { title: "Frankenfriends", kind: "Multiplayer game", what: "Two to four friends each steer one part of the same creature to deliver a cake.", href: "https://frankenfriends.brainytern5.chatgpt.site/" },
    { title: "Due Point", kind: "Prototype", what: "A weather forecast for your deadlines: move a block of work and the sky clears.", href: "https://thorn-learn-69708852.figma.site/" },
    { title: "Ask the Kitchen", kind: "Prototype", what: "An allergy card a waiter answers in Japanese, so you get a verdict in English.", href: "https://ice-photo-06677345.figma.site/" },
    { title: "Curbmates", kind: "Prototype", what: "New international students landing at Boston Logan share one ride to campus.", href: "https://dwell-false-24906781.figma.site/" },
    { title: "Calling card", kind: "Website", what: "A two-sided flip card that reads its own commit history from GitHub.", href: "https://arshdwani.github.io/" },
    { title: "ELI5 Anywhere", kind: "Chrome extension", what: "Highlight any text, right-click, get a plain explanation, a summary and an example.", href: "https://github.com/arshdwani/eli5-chrome-extension" },
  ],

  experience: [
    {
      when: "Jul 2026 – now",
      org: "Handshake AI",
      title: "AI Fellow",
      points: [
        "Coding-agent task design (now): design and evaluate hard coding-agent tasks and automated verification workflows.",
        "Terminal benchmark authoring (Sep–Oct): author tasks that must pass a reference solve, test validity, rubric review and a frontier-model difficulty check.",
        "Agent benchmark engineering (Jul–Sep): built tasks end to end and tuned difficulty with pass@k; read agent logs for reward hacking and closed the loopholes.",
        "Multilingual evaluation (Oct): evaluated Hindi/English assistant models against live app state and reviewed other fellows' work.",
      ],
    },
    {
      when: "Feb – May 2026",
      org: "Independent",
      title: "AI trainer and evaluator, part-time",
      points: ["Trained and evaluated AI model responses."],
    },
    {
      when: "Previously",
      org: "Oracle",
      title: "Backend engineering",
      points: ["Built cloud and database backend services and REST APIs."],
    },
  ],

  education: [
    { when: "2024 – now", title: "Master's, Computer Science", org: "National University College" },
    { when: "", title: "B.Tech, Computer Science & Engineering", org: "NIT Srinagar" },
  ],

  skills: [
    { group: "Languages", items: ["Python", "Java", "C++", "Go", "TypeScript", "JavaScript", "SQL", "Swift", "Rust", "Bash"] },
    { group: "Backend & infra", items: ["REST", "gRPC", "PostgreSQL", "Oracle", "MySQL", "Docker", "Kubernetes", "Linux", "GCP", "GitHub Actions"] },
    { group: "AI evaluation", items: ["Benchmark design", "pass@k tuning", "LLM evaluation", "Rubric scoring", "RAG", "PyTorch", "pandas"] },
  ],

  languages: ["English", "Hindi", "Urdu"],

  // What the live check in the hero pings. "cors" hosts let the page read the status code;
  // the others only tell us the server answered.
  checks: [
    { name: "offer-or-bait", url: "https://arshdwani.github.io/offer-or-bait/", mode: "cors" },
    { name: "is-it-hard", url: "https://arshdwani.github.io/is-it-hard/", mode: "cors" },
    { name: "asked-before", url: "https://arshdwani.github.io/asked-before/", mode: "cors" },
    { name: "ipl-200-era", url: "https://arshdwani.github.io/ipl-200-era/", mode: "cors" },
    { name: "dynamo", repo: "arshdwani/Dynamo", mode: "release" },
    { name: "leaklens", url: "https://leaklens.brainytern5.chatgpt.site/", mode: "no-cors" },
    { name: "counterexample", url: "https://counterexample-studio.brainytern5.chatgpt.site/", mode: "no-cors" },
    { name: "pidgin", url: "https://pidgin.onrender.com/", mode: "no-cors", slow: true },
    { name: "comet-court", url: "https://comet-court.brainytern5.chatgpt.site/", mode: "no-cors" },
    { name: "frankenfriends", url: "https://frankenfriends.brainytern5.chatgpt.site/", mode: "no-cors" },
    { name: "due-point", url: "https://thorn-learn-69708852.figma.site/", mode: "no-cors" },
    { name: "ask-the-kitchen", url: "https://ice-photo-06677345.figma.site/", mode: "no-cors" },
    { name: "curbmates", url: "https://dwell-false-24906781.figma.site/", mode: "no-cors" },
    { name: "calling-card", url: "https://arshdwani.github.io/", mode: "cors" },
  ],
};

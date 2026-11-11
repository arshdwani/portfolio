// Renders the page from data.js, draws each project's result chart, runs the live check, and wires up contact.
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const EMAIL = S.email.join("@");
  const params = new URLSearchParams(location.search);

  /* ---------- Charts: small SVGs drawn from each project's real numbers ---------- */
  const charts = {
    attempts({ n, solved }, W) {
      const gap = 40, r = 14, y = 22;
      let s = "";
      for (let i = 0; i < n; i++) {
        const cx = 16 + i * gap;
        const ok = i < solved;
        s += `<circle class="ring ${ok ? "" : "ring-fail"}" cx="${cx}" cy="${y}" r="${r}"/>`;
        s += ok ? `<path class="x" d="M${cx - 6} ${y}l4 4 8-8"/>` : `<path class="x" d="M${cx - 5} ${y - 5}l10 10M${cx + 5} ${y - 5}l-10 10"/>`;
      }
      const tx = 16 + n * gap + 4;
      s += `<text class="t-fail" x="${tx}" y="${y + 2}" font-size="22" dominant-baseline="middle" style="font-family:var(--serif)">${solved} / ${n}</text>`;
      s += `<text x="${tx}" y="${y + 24}" font-size="10.5">solved</text>`;
      s += `<text x="2" y="${y + 36}" font-size="10.5">frontier-model attempts on one task</text>`;
      return svg(W, 66, s, `${solved} of ${n} frontier-model attempts solved the task`);
    },
    beforeAfter({ rows, pct }, W) {
      const rowH = 60, barX = 56, numW = pct ? 124 : 70, barW = Math.max(80, Math.min(360, W - barX - numW - 10)), h = rows.length * rowH - 6;
      let s = "";
      rows.forEach((r, i) => {
        const y0 = i * rowH;
        const aT = r.afterTotal || r.total;
        const tags = r.tags || (pct ? ["before", "after"] : ["v1", "v2"]);
        s += `<text class="t-ink" x="0" y="${y0 + 10}" font-size="12">${esc(r.label)}</text>`;
        [[tags[0], r.before, r.total, "b-fail", "t-fail"], [tags[1], r.after, aT, "b-pass", "t-pass"]].forEach(([tag, v, tot, cls, tcls], j) => {
          const y = y0 + 20 + j * 18;
          const w = Math.max(v === 0 ? 0 : 3, (v / tot) * barW);
          s += `<text x="0" y="${y + 9}" font-size="11">${tag}</text>`;
          s += `<rect class="track" x="${barX}" y="${y}" width="${barW}" height="12" rx="3"/>`;
          if (w) s += `<rect class="${cls}" x="${barX}" y="${y}" width="${w.toFixed(1)}" height="12" rx="3"/>`;
          const label = pct ? `${v} / ${tot} · ${Math.round((v / tot) * 100)}%` : `${v} / ${tot}`;
          s += `<text class="${tcls}" x="${barX + barW + 10}" y="${y + 10}" font-size="12" font-weight="600">${label}</text>`;
        });
      });
      return svg(W, h, s, rows.map((r) => `${r.label}: ${r.before} of ${r.total} before, ${r.after} of ${r.afterTotal || r.total} after`).join(". "));
    },
    curve({ marks }, W) {
      // Highest solve rate still consistent (95%) with n straight failures: 1 - 0.05^(1/n).
      const ub = (n) => 1 - Math.pow(0.05, 1 / n);
      const N = 40, x0 = 30, x1 = W - 4, y0 = 96, y1 = 8;
      const X = (n) => x0 + ((n - 1) / (N - 1)) * (x1 - x0);
      const Y = (p) => y0 - p * (y0 - y1);
      let d = "", a = `M${X(1)} ${y0}`;
      for (let n = 1; n <= N; n++) { const p = `${X(n).toFixed(1)} ${Y(ub(n)).toFixed(1)}`; d += (n === 1 ? "M" : "L") + p; a += "L" + p; }
      a += `L${X(N)} ${y0}Z`;
      let s = `<path class="area" d="${a}" opacity=".55"/>`;
      s += `<line class="grid" x1="${x0}" x2="${x1}" y1="${Y(0.1)}" y2="${Y(0.1)}"/>`;
      s += `<text x="${x1}" y="${Y(0.1) - 5}" font-size="10" text-anchor="end">10%</text>`;
      s += `<line class="axis" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"/>`;
      s += `<path class="curve" d="${d}"/>`;
      s += `<text x="${x0 - 6}" y="${Y(1) + 4}" font-size="10" text-anchor="end">100%</text>`;
      s += `<text x="${x0 - 6}" y="${y0 + 3}" font-size="10" text-anchor="end">0</text>`;
      const [m1, m2] = marks;
      const p1 = ub(m1), p2 = ub(m2);
      s += `<circle class="mark-fail" cx="${X(m1)}" cy="${Y(p1)}" r="4.5"/>`;
      s += `<text class="t-fail" x="${X(m1) + 9}" y="${Y(p1) - 4}" font-size="12" font-weight="600">0 for ${m1}: up to ${Math.round(p1 * 100)}%</text>`;
      s += `<circle class="mark-pass" cx="${X(m2)}" cy="${Y(p2)}" r="4.5"/>`;
      s += `<text class="t-pass" x="${X(m2)}" y="${Y(p2) - 12}" font-size="12" font-weight="600" text-anchor="middle">0 for ${m2}: under 10%</text>`;
      s += `<text x="${x0}" y="${y0 + 16}" font-size="10">1</text><text x="${x1}" y="${y0 + 16}" font-size="10" text-anchor="end">${N} straight failures</text>`;
      return svg(W, 116, s, `Solve rate still possible after straight failures: ${Math.round(p1 * 100)}% after ${m1}, under 10% after ${m2}`);
    },
    spark({ from, split, values }, W) {
      const x0 = 8, x1 = W - 36, y0 = 92, y1 = 12, lo = 140, hi = 210;
      const X = (i) => x0 + (i / (values.length - 1)) * (x1 - x0);
      const Y = (v) => y0 - ((v - lo) / (hi - lo)) * (y0 - y1);
      const si = split - from;
      const pts = values.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`);
      const preMax = Math.max(...values.slice(0, si));
      let s = `<line class="grid" x1="${x0}" x2="${x1}" y1="${Y(preMax)}" y2="${Y(preMax)}"/>`;
      s += `<text x="${x0}" y="${Y(preMax) - 5}" font-size="10">best before the rule: ${preMax}</text>`;
      s += `<line class="axis" x1="${X(si - 0.5)}" x2="${X(si - 0.5)}" y1="${y1 - 4}" y2="${y0}" stroke-dasharray="3 3"/>`;
      s += `<text x="${X(si - 0.5) - 5}" y="${y0 - 2}" font-size="10" text-anchor="end">${split} rule →</text>`;
      s += `<path class="line-pre" d="M${pts.slice(0, si).join("L")}"/>`;
      s += `<path class="line-post" d="M${pts.slice(si - 1).join("L")}"/>`;
      const last = values.length - 1;
      s += `<circle class="mark-pass" cx="${X(last)}" cy="${Y(values[last])}" r="4"/>`;
      s += `<text class="t-pass" x="${X(last) + 8}" y="${Y(values[last]) + 4}" font-size="12" font-weight="600">${values[last]}</text>`;
      s += `<text x="${x0}" y="${y0 + 16}" font-size="10">${from}</text><text x="${X(last)}" y="${y0 + 16}" font-size="10" text-anchor="middle">${from + last}</text>`;
      s += `<text x="${(x0 + x1) / 2}" y="${y0 + 16}" font-size="10" text-anchor="middle">median first innings</text>`;
      return svg(W, 112, s, `Median first-innings score by season, ${from} to ${from + last}: highest before ${split} was ${preMax}, ${values[last]} in ${from + last}`);
    },
    battery({ limit }, W) {
      const x = 2, y = 8, w = Math.min(300, W - 24), h = 46, inner = w - 10;
      const fw = (inner * limit) / 100;
      let s = `<rect class="batt" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>`;
      s += `<rect class="batt-cap" x="${x + w + 3}" y="${y + 15}" width="6" height="16" rx="2"/>`;
      s += `<rect class="batt-rest" x="${x + 5}" y="${y + 5}" width="${inner}" height="${h - 10}" rx="5"/>`;
      s += `<rect class="batt-fill" x="${x + 5}" y="${y + 5}" width="${fw}" height="${h - 10}" rx="5"/>`;
      s += `<line class="limit" x1="${x + 5 + fw}" x2="${x + 5 + fw}" y1="${y - 6}" y2="${y + h + 6}"/>`;
      s += `<text x="${x + 18}" y="${y + h / 2 + 5}" font-size="15" fill="#fff" style="fill:var(--card);font-family:var(--serif)">held at ${limit}%</text>`;
      s += `<text class="t-ink" x="${x + 5 + fw + 6}" y="${y + h + 16}" font-size="10.5">charge limit</text>`;
      s += `<text x="${x}" y="${y + h + 16}" font-size="10.5">20–100%, set in the menu bar</text>`;
      return svg(W, 76, s, `Battery held at a ${limit}% charge limit`);
    },
  };
  function svg(w, h, inner, label) {
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  }

  /* ---------- Render sections ---------- */
  const check = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.2" fill="currentColor"/><path d="M4.6 8.2l2.2 2.2 4.6-4.8" stroke="var(--card)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  $("#cards").innerHTML = S.featured.map((p) => `
    <article class="card" id="${p.id}">
      <div class="card-top">
        <span class="kind">${esc(p.kind)}</span>
        <span class="card-links">${p.links.length
          ? p.links.map((l) => `<a class="chip-link" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("")
          : `<span class="chip-note">${esc(p.note || "")}</span>`}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="what">${esc(p.what)}</p>
      <p class="role"><b>My role:</b> ${esc(p.role)}</p>
      <div class="receipt">
        <p class="receipt-label">${check} Result</p>
        <div class="chart-host" data-chart="${p.id}"></div>
        <p class="result">${esc(p.result)}</p>
        <ul class="stack">${p.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  // Charts are drawn at their real pixel width, so text stays the same size on a phone and a laptop.
  const byId = Object.fromEntries(S.featured.map((p) => [p.id, p]));
  function drawCharts() {
    document.querySelectorAll(".chart-host").forEach((host) => {
      const w = Math.round(host.clientWidth);
      if (!w || host.dataset.w === String(w)) return;
      host.dataset.w = w;
      const p = byId[host.dataset.chart];
      host.innerHTML = charts[p.chart.type](p.chart, w);
    });
  }
  drawCharts();
  let rz;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(drawCharts, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawCharts);

  $("#more").innerHTML = S.more.map((m, i) => `
    <li><a href="${m.href}" target="_blank" rel="noopener">
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <span class="t">${esc(m.title)}</span>
      <span class="w">${esc(m.what)}</span>
      <span class="k">${esc(m.kind)}</span>
      <span class="arr" aria-hidden="true">↗</span>
    </a></li>`).join("");

  $("#exp").innerHTML = S.experience.map((j) => `
    <div class="job">
      <p class="when">${esc(j.when)}</p>
      <div>
        <h3>${esc(j.org)} <span>· ${esc(j.title)}</span></h3>
        <ul>${j.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
      </div>
    </div>`).join("");

  $("#edu").innerHTML = S.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.org)}${e.when ? " · " + esc(e.when) : ""}</span></li>`).join("");
  $("#skills").innerHTML = S.skills.map((g) => `<dt>${esc(g.group)}</dt><dd>${g.items.map((t) => `<span>${esc(t)}</span>`).join("")}</dd>`).join("");

  const counts = { projects: S.featured.length + S.more.length, checks: S.checks.length };
  document.querySelectorAll("[data-count]").forEach((el) => { el.textContent = counts[el.dataset.count]; });

  /* ---------- Email, copy, compose ---------- */
  document.querySelectorAll("[data-mail]").forEach((a) => { a.href = "mailto:" + EMAIL; });
  document.querySelectorAll("[data-mail-text]").forEach((a) => { a.textContent = EMAIL; });

  const toast = $("#toast");
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  $("#copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(EMAIL); say("Address copied: " + EMAIL); }
    catch (e) { say(EMAIL); }
  });

  const form = $("#compose"), hint = $("#compose-hint");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), msg = form.message.value.trim(), topic = form.topic.value;
    form.name.setAttribute("aria-invalid", String(!name));
    form.message.setAttribute("aria-invalid", String(!msg));
    if (!name || !msg) {
      hint.textContent = !name ? "Add your name so I know who's writing." : "Add a line or two of message.";
      hint.classList.add("err");
      (!name ? form.name : form.message).focus();
      return;
    }
    hint.classList.remove("err");
    const subject = `${topic}: from ${name} (via your site)`;
    const body = `${msg}\n\n${name}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    hint.textContent = "Your email app should open with this filled in. If it didn't, copy the address and paste your message.";
  });

  /* ---------- Theme ---------- */
  const root = document.documentElement, themeBtn = $("#theme");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const label = () => themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  label();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    label();
  });

  const top = $(".top");
  const onScroll = () => top.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Live check ---------- */
  const out = $("#runner"), rerun = $("#rerun");
  const NAME_W = Math.max(...S.checks.map((c) => c.name.length)) + 2;
  const fmtMs = (ms) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  let running = false;

  function lineHTML(c, state, a = "", b = "") {
    const mark = { wait: `<span class="dim">·</span>`, ok: `<span class="ok">✓</span>`, bad: `<span class="bad">✗</span>`, slow: `<span class="wait">…</span>` }[state];
    const name = `<span class="name">${c.name.padEnd(NAME_W)}</span>`;
    const col = state === "ok" ? "ok" : state === "bad" ? "bad" : state === "slow" ? "wait" : "dim";
    return `  ${mark} ${name}<span class="${col}">${a.padEnd(6)}</span><span class="dim">${b}</span>`;
  }

  function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
  }

  async function probe(c, el) {
    const t0 = performance.now();
    const limit = c.slow ? 45000 : 12000;
    let slowTimer;
    if (c.slow) slowTimer = setTimeout(() => { el.innerHTML = lineHTML(c, "slow", "wake", "free server waking up…"); }, 2500);
    try {
      if (c.mode === "release") {
        const r = await withTimeout(fetch(`https://api.github.com/repos/${c.repo}/releases/latest`, { cache: "no-store" }), limit);
        if (!r.ok) throw new Error("api " + r.status);
        const j = await r.json();
        el.innerHTML = lineHTML(c, "ok", j.tag_name, `released ${fmtDate(j.published_at)}`);
        return true;
      }
      const url = c.url + (c.url.includes("?") ? "&" : "?") + "check=" + Date.now();
      const r = await withTimeout(fetch(url, { mode: c.mode, cache: "no-store", redirect: "follow" }), limit);
      const ms = performance.now() - t0;
      if (c.mode === "cors" && !r.ok) { el.innerHTML = lineHTML(c, "bad", String(r.status), fmtMs(ms)); return false; }
      el.innerHTML = lineHTML(c, "ok", c.mode === "cors" ? String(r.status) : "up", fmtMs(ms));
      return true;
    } catch (err) {
      if (c.mode === "release") {
        // GitHub's API allows 60 calls an hour per visitor; if that's used up, just check the repo page answers.
        try {
          await withTimeout(fetch(`https://github.com/${c.repo}`, { mode: "no-cors", cache: "no-store" }), limit);
          el.innerHTML = lineHTML(c, "ok", "repo", fmtMs(performance.now() - t0));
          return true;
        } catch (e) {}
      }
      el.innerHTML = lineHTML(c, "bad", "down", err.message === "timeout" ? `no answer in ${limit / 1000} s` : "unreachable");
      return false;
    } finally {
      clearTimeout(slowTimer);
    }
  }

  async function runChecks() {
    if (running) return;
    running = true;
    rerun.disabled = true;
    const t0 = performance.now();
    out.innerHTML = `<span class="prompt">$</span> check --live arshdwani\n`;
    const els = S.checks.map((c) => {
      const el = document.createElement("span");
      el.className = "line";
      el.innerHTML = lineHTML(c, "wait", "", "");
      out.appendChild(el);
      return el;
    });
    const sum = document.createElement("span");
    sum.className = "line";
    sum.innerHTML = `\n<span class="dim">  running ${S.checks.length} checks…</span>`;
    out.appendChild(sum);
    const results = await Promise.all(S.checks.map((c, i) => probe(c, els[i])));
    const passed = results.filter(Boolean).length, failed = results.length - passed;
    const at = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    sum.innerHTML = `\n  <span class="sum ${failed ? "bad" : "ok"}">${passed} passing</span>` +
      (failed ? `<span class="bad">, ${failed} failing</span>` : "") +
      `<span class="dim">  ·  ${fmtMs(performance.now() - t0)}  ·  checked ${at}</span>`;
    running = false;
    rerun.disabled = false;
  }

  rerun.addEventListener("click", runChecks);
  addEventListener("keydown", (e) => {
    if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) runChecks();
  });
  if (params.get("checks") !== "off") runChecks();
})();

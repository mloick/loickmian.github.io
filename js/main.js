import { UI, SECTORS, WORLDS, LINKS } from "./content.js";

const WEB3FORMS_KEY = "98a5ced1-d2fd-4c80-ba9a-78023c1d476b";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

let lang = store.get("lang", (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en");
const t = () => UI[lang];
let galaxy = null, current = -1, tour = false, activeLink = null;
const seen = new Set(store.get("seen", []));

/* ================= text effects ================= */
const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>[]{}=+*";
function decodeTo(el, text, dur = 700) {
  if (reduce) { el.textContent = text; return; }
  const start = performance.now();
  const step = now => {
    const k = Math.min(1, (now - start) / dur); let out = "";
    for (let i = 0; i < text.length; i++) { const c = text[i]; out += (c === " " || i / text.length < k) ? c : GL[(Math.random() * GL.length) | 0]; }
    el.textContent = out; if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const redacted = s => esc(s).replace(/\[\[(.*?)\]\]/g, (_, w) => `<span class="redact" title="Redacted">${"█".repeat(w.length)}</span>`);

/* ================= audio (off by default) ================= */
const audio = {
  ctx: null, on: false, pad: null,
  init() {
    if (this.ctx) return; const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    this.ctx = new C(); const ctx = this.ctx;
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination); this.master = master;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.connect(master);
    [55, 82.4, 110.3, 164.8].forEach((f, i) => { const o = ctx.createOscillator(); o.type = i % 2 ? "sawtooth" : "triangle"; o.frequency.value = f; o.detune.value = (i - 1.5) * 6; const g = ctx.createGain(); g.gain.value = .05; o.connect(g); g.connect(lp); o.start(); });
    const lfo = ctx.createOscillator(); lfo.frequency.value = .07; const lg = ctx.createGain(); lg.gain.value = 380; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  },
  toggle() {
    this.init(); if (!this.ctx) return; this.on = !this.on; this.ctx.resume();
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(this.on ? .5 : 0, this.ctx.currentTime + .8);
    $("#soundState").textContent = this.on ? "ON" : "OFF"; $("#soundBtn").setAttribute("aria-pressed", String(this.on));
  },
  whoosh(len = 1.2) {
    if (!this.on || !this.ctx) return; const ctx = this.ctx, n = ctx.sampleRate * len, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.5);
    const s = ctx.createBufferSource(); s.buffer = buf; const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 3;
    f.frequency.setValueAtTime(300, ctx.currentTime); f.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + len * .6);
    const g = ctx.createGain(); g.gain.value = .5; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start();
  },
  blip(freq = 880) {
    if (!this.on || !this.ctx) return; const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq; g.gain.setValueAtTime(.12, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .18);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .2);
  }
};

/* ================= logos ================= */
const logoCache = {};
async function logoURL(file, color) {
  if (!file) return null;
  if (!file.endsWith(".svg") || !color) return "assets/logos/" + file;
  const key = file + color; if (logoCache[key]) return logoCache[key];
  try {
    const txt = await (await fetch("assets/logos/" + file)).text();
    const colored = txt.replace("<svg ", `<svg fill="${color}" `);
    return (logoCache[key] = URL.createObjectURL(new Blob([colored], { type: "image/svg+xml" })));
  } catch (e) { return "assets/logos/" + file; }
}
function insigniaHTML(w) { const n = w.mark.length; return `<span class="insignia" style="--c:${w.color};font-size:${n > 8 ? 9 : n > 5 ? 11 : n > 3 ? 13 : 16}px">${esc(w.mark)}</span>`; }
async function logoHTML(w, cls = "") {
  const url = await logoURL(w.logo, w.logoColor);
  return url ? `<img src="${url}" alt="${esc(w[lang].name)} logo" class="${cls}">` : insigniaHTML(w);
}
// Canvas used for the 3D hologram above each world.
async function logoCanvas(w) {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256; const g = cv.getContext("2d");
  g.clearRect(0, 0, 512, 256);
  const url = await logoURL(w.logo, w.logoColor || (w.logo && w.logo.endsWith(".svg") ? null : null));
  if (url) {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    try { await img.decode(); } catch (e) { return null; }
    const iw = img.naturalWidth || 240, ih = img.naturalHeight || 240, s = Math.min(380 / iw, 200 / ih);
    const dw = iw * s, dh = ih * s;
    g.shadowColor = w.color; g.shadowBlur = 24;
    g.drawImage(img, (512 - dw) / 2, (256 - dh) / 2, dw, dh);
    return cv;
  }
  try { await document.fonts.load('700 64px "Chakra Petch"'); } catch (e) {}
  // insignia: hexagon frame + mark
  g.strokeStyle = w.color; g.lineWidth = 6; g.shadowColor = w.color; g.shadowBlur = 20;
  g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6, x = 256 + Math.cos(a) * 118 * 1.7, y = 128 + Math.sin(a) * 118 * .95; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.stroke();
  g.fillStyle = "#ffffff"; g.textAlign = "center"; g.textBaseline = "middle";
  const fs = w.mark.length > 8 ? 46 : w.mark.length > 4 ? 64 : 92; g.font = `700 ${fs}px "Chakra Petch", sans-serif`;
  g.fillText(w.mark, 256, 132);
  return cv;
}

/* ================= i18n ================= */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { const v = t()[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  $("#arrivalKicker").textContent = `${WORLDS.length} ${t().worlds} · ${SECTORS.length} sectors`.replace("sectors", lang === "fr" ? "secteurs" : "sectors");
  $("#nextBtn").textContent = t().next + " →";
  renderPlan(); renderLinks(); renderLabels(); buildBrief();
  if (current >= 0 && !$("#panel").hidden) renderPanel(current, false);
  if (activeLink) showStory();
}
$$("[data-lang]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); audio.blip(1200); }));

/* ================= intro ================= */
function bootLines() {
  const el = $("#boot"); if (reduce) return;
  const lines = ["> link: cotonou 6.37N → paris 48.86N ...... ok", "> loading missions [15] ..................... ok", "> warp drive ................................ ready"];
  let i = 0, j = 0;
  const tick = () => { if (i >= lines.length) return; j++; el.textContent = lines.slice(0, i).join("\n") + (i ? "\n" : "") + lines[i].slice(0, j); if (j >= lines[i].length) { i++; j = 0; setTimeout(tick, 160); } else setTimeout(tick, 12); };
  setTimeout(tick, 300);
}
let holdT0 = 0, holdRaf = 0, launched = false;
const RING = 439.8;
function holdFrame(now) {
  const p = Math.min(1, (now - holdT0) / 1500);
  $("#launchRing").style.strokeDashoffset = RING * (1 - p);
  const n = 3 - Math.floor(p * 3); $("#launchLabel").innerHTML = `<span class="count">${Math.max(1, n)}</span>`;
  if (p >= 1) return launch();
  holdRaf = requestAnimationFrame(holdFrame);
}
function holdStart(e) { if (launched) return; e && e.preventDefault(); audio.init(); $("#launchBtn").classList.add("holding"); holdT0 = performance.now(); holdRaf = requestAnimationFrame(holdFrame); }
function holdEnd() {
  if (launched) return; cancelAnimationFrame(holdRaf); $("#launchBtn").classList.remove("holding");
  $("#launchRing").style.strokeDashoffset = RING; $("#launchLabel").textContent = t().hold;
}
const lb = $("#launchBtn");
lb.addEventListener("pointerdown", holdStart);
["pointerup", "pointerleave", "pointercancel"].forEach(ev => lb.addEventListener(ev, holdEnd));
lb.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch(); } });
lb.addEventListener("contextmenu", e => e.preventDefault());

function launch() {
  if (launched) return; launched = true; cancelAnimationFrame(holdRaf);
  const f = $("#flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  audio.whoosh(2.2);
  $("#intro").classList.add("leave"); setTimeout(() => $("#intro").hidden = true, 800);
  if (!galaxy) return showBrief(true);
  galaxy.intro(() => { showHUD(); $("#arrival").hidden = false; store.set("launched", true); });
}
function showHUD() { $("#hud").hidden = false; $("#telemetry").hidden = false; if (innerWidth > 1100) $("#plan").hidden = false; }

/* ================= flight plan ================= */
function renderPlan() {
  $("#planList").innerHTML = SECTORS.map(s => `<div class="sector"><span>${esc(s[lang])}</span>${WORLDS.map((w, i) => w.sector === s.id ? `<button data-go="${i}" style="--c:${w.color}" class="${seen.has(w.id) ? "seen" : ""}" ${i === current ? 'aria-current="true"' : ""}><i></i>${esc(w[lang].name.split(" · ")[0])}</button>` : "").join("")}</div>`).join("");
  $$("#planList [data-go]").forEach(b => b.addEventListener("click", () => { go(+b.dataset.go); if (innerWidth <= 1100) $("#plan").classList.remove("open"), $("#plan").hidden = true; }));
}
$("#planBtn").addEventListener("click", () => { const p = $("#plan"); const open = p.hidden; p.hidden = !open; p.classList.toggle("open", open); });

/* ================= labels ================= */
let labelEls = [];
function renderLabels() {
  const box = $("#labels"); box.innerHTML = "";
  labelEls = WORLDS.map((w, i) => {
    const b = document.createElement("button"); b.className = "wlabel"; b.innerHTML = `${esc(w[lang].name.split(" · ")[0])}<small>${esc(w[lang].role.split(" · ")[0])}</small>`;
    b.addEventListener("click", () => go(i)); box.appendChild(b); return b;
  });
}
function placeLabels() {
  if (!galaxy || $("#hud").hidden) { $("#labels").style.display = "none"; return; }
  $("#labels").style.display = "";
  const mobileFocus = innerWidth <= 760 && current >= 0 && !$("#panel").hidden;
  const placed = [];
  const order = WORLDS.map((_, i) => i).sort((a, b) => (b === current) - (a === current) || b - a);
  const proj = WORLDS.map((_, i) => galaxy.project(i));
  order.forEach(i => {
    const el = labelEls[i], p = proj[i];
    let show = p.visible && p.x > -50 && p.x < innerWidth + 50 && p.y > 40 && p.y < innerHeight && !(mobileFocus && i !== current);
    if (show) { const box = { x: p.x - 60, y: p.y, w: 120, h: 30 }; if (placed.some(b => Math.abs(b.x - box.x) < box.w && Math.abs(b.y - box.y) < box.h)) show = false; else placed.push(box); }
    el.style.display = show ? "" : "none";
    if (show) { el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, 0)`; el.style.opacity = current >= 0 && i !== current ? (p.dist < 120 ? .55 : .3) : 1; }
    el.classList.toggle("on", i === current);
    el.classList.toggle("lit", !!activeLink && activeLink.worlds.includes(WORLDS[i].id));
    el.classList.toggle("dim", !!activeLink && !activeLink.worlds.includes(WORLDS[i].id));
  });
  const w = current >= 0 ? WORLDS[current] : null;
  $("#telemetry").innerHTML = w
    ? `target <b>${esc(w[lang].name)}</b><br>${esc(w[lang].place)} · ${lang === "fr" ? "escale" : "stop"} ${current + 1}/${WORLDS.length}`
    : `${lang === "fr" ? "vue" : "view"} <b>galaxy</b><br>${WORLDS.length} ${t().worlds} · ${seen.size} ${lang === "fr" ? "visités" : "charted"}`;
}

/* ================= world panel ================= */
async function renderPanel(i, animate = true) {
  const w = WORLDS[i], c = w[lang], st = t().status[w.status];
  const sector = SECTORS.find(s => s.id === w.sector)[lang];
  const linksHere = LINKS.filter(l => l.worlds.includes(w.id));
  const logo = await logoHTML(w);
  const word = w.wordmark ? `<img class="wordmark" src="assets/logos/${w.wordmark}" alt="${esc(c.name)}">` : "";
  const body = `
    <div class="phead"><div class="plogo">${logo}</div><div class="pmeta"><span class="chip ${w.status}"><span class="dot"></span>${esc(st)}</span><span class="mono">${esc(sector)}</span></div></div>
    <h2 class="ptitle" id="ptitle">${esc(c.name)}</h2>
    <p class="prole">${esc(c.role)}</p>
    <span class="pwhen">${redacted(c.period)} · ${esc(c.place)}</span>
    ${word}
    <p class="plede">${esc(c.lede)}</p>
    ${c.cipher ? `<span class="mono">${esc(t().decodeHint)}</span><ul class="cipher">${c.cipher.map((l, k) => `<li tabindex="0" data-k="${k}">${esc(l.replace(/\[\[|\]\]/g, "").replace(/\S/g, () => GL[(Math.random() * GL.length) | 0]))}</li>`).join("")}</ul>`
      : `<span class="mono">${esc(t().log)}</span><ul class="plog">${c.log.map(l => `<li>${esc(l)}</li>`).join("")}</ul>`}
    ${w.gallery ? `<div class="gallery">${w.gallery.map(g => `<img src="${g}" alt="SimuFlow screenshot" loading="lazy">`).join("")}</div>` : ""}
    ${w.links ? `<div class="plinks">${w.links.map((l, k) => `<a class="btn small ${k ? "" : "primary"}" href="${l.href}" target="_blank" rel="noopener">${esc(l[lang])} ↗</a>`).join("")}</div>` : ""}
    ${w.stack ? `<div class="stack">${w.stack.map(s => `<img src="assets/logos/${s}.svg" alt="${s}" title="${s}">`).join("")}</div>` : ""}
    <p class="pproves">${esc(c.proves)}</p>
    ${linksHere.length ? `<span class="mono">${esc(t().partOf)}</span><div class="tags">${linksHere.map(l => `<button class="tag" data-link="${l.id}">${esc(l[lang].name)}</button>`).join("")}</div>` : ""}`;
  $("#pbody").innerHTML = body; $("#pbody").scrollTop = 0;
  if (animate) { decodeTo($("#ptitle"), c.name, 650); const p = $("#panel"); p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap"); }
  $("#stopN").textContent = `${t().stop} ${i + 1} ${t().of} ${WORLDS.length}`;
  $("#prevBtn").disabled = i === 0;
  $("#nextBtn").textContent = i === WORLDS.length - 1 ? (t().contact + " →") : (t().next + " →");
  $$("#pbody [data-link]").forEach(b => b.addEventListener("click", () => setLink(b.dataset.link)));
  if (c.cipher) $$("#pbody .cipher li").forEach(li => {
    const go = () => { if (li.classList.contains("done")) return; li.classList.add("done"); const src = c.cipher[+li.dataset.k]; const plain = src.replace(/\[\[(.*?)\]\]/g, (_, x) => "\u0001".repeat(x.length)); audio.blip(660);
      const start = performance.now(); const step = now => { const k = Math.min(1, (now - start) / 600); let out = ""; for (let q = 0; q < plain.length; q++) { const ch = plain[q]; out += ch === "\u0001" ? ch : (ch === " " || q / plain.length < k) ? ch : GL[(Math.random() * GL.length) | 0]; }
        li.innerHTML = esc(out).replace(/\u0001+/g, m => `<span class="redact">${"█".repeat(m.length)}</span>`); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
    li.addEventListener("click", go); li.addEventListener("pointerenter", go); li.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  });
}
function go(i) {
  if (i < 0 || i >= WORLDS.length) return;
  $("#arrival").hidden = true; $("#linksPanel").hidden = true;
  const first = $("#panel").hidden;
  current = i; seen.add(WORLDS[i].id); store.set("seen", [...seen]);
  audio.whoosh(1.1);
  if (galaxy) galaxy.focus(i);
  renderPanel(i, true); $("#panel").hidden = false;
  if (first) $("#pclose").focus({ preventScroll: true });
  renderPlan();
  history.replaceState(null, "", "#w-" + WORLDS[i].id);
}
function closePanel() { $("#panel").hidden = true; current = -1; tour = false; if (galaxy) galaxy.overview(); renderPlan(); history.replaceState(null, "", "#galaxy"); }
$("#pclose").addEventListener("click", closePanel);
$("#nextBtn").addEventListener("click", () => current >= WORLDS.length - 1 ? (location.hash = "contact") : go(current + 1));
$("#prevBtn").addEventListener("click", () => go(current - 1));
$("#tourBtn").addEventListener("click", () => { tour = true; go(0); });
$("#freeBtn").addEventListener("click", () => { $("#arrival").hidden = true; });
$("#brand").addEventListener("click", () => { setLink(null); closePanel(); });
$("#soundBtn").addEventListener("click", () => audio.toggle());

/* ================= skill links ================= */
function renderLinks() {
  $("#linksList").innerHTML = LINKS.map(l => `<button class="lbtn" data-l="${l.id}" aria-pressed="${activeLink && activeLink.id === l.id}">${esc(l[lang].name)}</button>`).join("");
  $$("#linksList [data-l]").forEach(b => b.addEventListener("click", () => setLink(b.dataset.l)));
}
function showStory() {
  const l = activeLink, s = $("#linkStory");
  s.innerHTML = `<span class="mono">${esc(t().links)} · ${l.worlds.length} ${t().worlds}</span><h4>${esc(l[lang].name)}</h4><p>${esc(l[lang].text)}</p><div class="tags">${l.worlds.map(id => { const i = WORLDS.findIndex(w => w.id === id); return `<button class="tag" data-go="${i}">${esc(WORLDS[i][lang].name.split(" · ")[0])}</button>`; }).join("")}<button class="tag" data-clear>${esc(t().clear)}</button></div>`;
  s.hidden = false;
  $$("#linkStory [data-go]").forEach(b => b.addEventListener("click", () => { $("#linkStory").hidden = true; go(+b.dataset.go); }));
  $("#linkStory [data-clear]").addEventListener("click", () => setLink(null));
}
function setLink(id) {
  const l = LINKS.find(x => x.id === id);
  activeLink = (!l || (activeLink && activeLink.id === id)) ? null : l;
  if (galaxy) galaxy.showLink(activeLink ? activeLink.worlds : null);
  renderLinks();
  if (activeLink) { $("#panel").hidden = true; current = -1; if (galaxy) galaxy.overview(); showStory(); audio.blip(520); if (innerWidth <= 760) $("#linksPanel").hidden = true; }
  else $("#linkStory").hidden = true;
}
$("#linksBtn").addEventListener("click", () => { const p = $("#linksPanel"); p.hidden = !p.hidden; if (!p.hidden) { $("#panel").hidden = true; $("#arrival").hidden = true; } });

/* ================= brief ================= */
async function buildBrief() {
  const T = t(), byId = id => WORLDS.find(w => w.id === id);
  const row = async (id, text) => { const w = byId(id), c = w[lang]; return `<div class="xp"><div class="xl">${await logoHTML(w)}</div><span class="when">${redacted(c.period)}</span><div><h3>${esc(c.role)} <span>· ${esc(c.name)}</span></h3><p>${esc(text || c.lede)}</p></div></div>`; };
  const xp = await Promise.all(["konica", "optimall", "dreamxr", "impact", "socar"].map(id => row(id)));
  const build = await Promise.all(["simuflow", "lbt", "workshop"].map(id => row(id)));
  const field = await Promise.all(["intermarche", "alyce", "fiveguys"].map(id => row(id)));
  const skills = lang === "fr"
    ? ["Gestion de projet", "Scrum & Kanban", "ITSM / ITIL", "Modélisation de workflows (draw.io, BPMN)", "Conduite du changement", "Jira · ClickUp · Notion", "Prototypage", "React · TypeScript · Python · SQL", "IA générative", "Français (natif)", "Anglais (pro)"]
    : ["Project management", "Scrum & Kanban", "ITSM / ITIL", "Workflow modelling (draw.io, BPMN)", "Change management", "Jira · ClickUp · Notion", "Prototyping", "React · TypeScript · Python · SQL", "Generative AI", "French (native)", "English (professional)"];
  const edu = byId("academy")[lang].log;
  $("#briefBody").innerHTML = `
    <div class="ov-top"><span class="mono">// ${esc(T.briefTitle)}</span><div class="crow"><div class="lang" role="group" aria-label="Language"><button data-lang2="en" aria-pressed="${lang === "en"}">EN</button><button data-lang2="fr" aria-pressed="${lang === "fr"}">FR</button></div><a class="btn small" href="#galaxy">${esc(T.explore)}</a></div></div>
    <p id="webglNote" class="mono" hidden>${esc(T.webgl)}</p>
    <header class="bhead"><h1>Loick Mian</h1><p class="role">${esc(T.briefRole)}</p><p>${esc(T.briefIntro)}</p>
      <div class="crow"><code>loickmian@gmail.com</code><button class="btn small copy-email">${esc(T.copy)}</button><a class="btn small" href="https://www.linkedin.com/in/loick-mian-843382281" target="_blank" rel="noopener">LinkedIn</a><a class="btn small gold" href="${T.resumeHref}" target="_blank" rel="noopener">${esc(T.resume)}</a><a class="btn small" href="#contact">${esc(T.contact)}</a></div></header>
    <div class="bsec"><h2>${esc(T.secXp)}</h2>${xp.join("")}</div>
    <div class="bsec"><h2>${esc(T.secBuild)}</h2>${build.join("")}</div>
    <div class="bsec"><h2>${esc(T.secField)}</h2>${field.join("")}</div>
    <div class="bsec"><h2>${esc(T.secSkills)}</h2><div class="skills">${skills.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>
    <div class="bsec"><h2>${esc(T.secEdu)}</h2><ul class="plog">${edu.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
  $$("[data-lang2]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang2; store.set("lang", lang); applyLang(); }));
  bindCopy();
}
function showBrief(noGL) { $("#brief").hidden = false; $("#brief").scrollTop = 0; if (noGL) { const n = $("#webglNote"); if (n) n.hidden = false; } }

/* ================= contact & newsletter ================= */
async function send(payload, out, okText) {
  out.className = "formmsg"; out.textContent = t().sending;
  if (!WEB3FORMS_KEY) { out.textContent = t().notReady; return false; }
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, from_name: "Portfolio · Mission Control", ...payload }) });
    const j = await r.json(); if (!j.success) throw new Error(j.message);
    out.className = "formmsg ok"; out.textContent = okText; audio.blip(990); return true;
  } catch (e) { out.className = "formmsg err"; out.textContent = t().failed; return false; }
}
$("#cform").addEventListener("submit", async e => {
  e.preventDefault(); const f = e.target;
  if (f.botcheck.checked) return;
  if (!f.reportValidity()) return;
  const ok = await send({ subject: `New message from ${f.name.value} (portfolio)`, name: f.name.value, email: f.email.value, message: f.message.value, newsletter: f.newsletter.checked ? "yes" : "no", language: lang }, $("#cMsgOut"), t().sent);
  if (ok) f.reset();
});
$("#nform").addEventListener("submit", async e => {
  e.preventDefault(); const f = e.target; if (!f.reportValidity()) return;
  const ok = await send({ subject: "New newsletter subscriber (portfolio)", email: $("#nEmail").value, message: `Newsletter signup: ${$("#nEmail").value} (${lang})` }, $("#nMsgOut"), t().subscribed);
  if (ok) f.reset();
});
function bindCopy() {
  $$(".copy-email").forEach(b => { if (b.dataset.bound) return; b.dataset.bound = 1; b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("loickmian@gmail.com"); b.textContent = t().copied; } catch (e) { const c = b.parentElement.querySelector("code") || document.querySelector(".crow code"); const r = document.createRange(); r.selectNodeContents(c); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    setTimeout(() => b.textContent = t().copy, 2000); }); });
}

/* ================= routing ================= */
function route() {
  const h = location.hash.slice(1);
  $("#brief").hidden = h !== "brief";
  $("#contact").hidden = h !== "contact";
  if (h === "brief") { showBrief(!galaxy); return; }
  if (h === "contact") { $("#contactKicker").textContent = current === WORLDS.length - 1 || tour ? "// " + t().end : "// Contact"; return; }
  if (h === "galaxy" || h.startsWith("w-")) {
    if (!launched) { launched = true; $("#intro").hidden = true; if (galaxy) galaxy.skipIntro(); showHUD(); }
    if (h.startsWith("w-")) { const i = WORLDS.findIndex(w => "w-" + w.id === h); if (i >= 0 && i !== current) go(i); }
  }
}
addEventListener("hashchange", route);
addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "Escape") { if (!$("#brief").hidden || !$("#contact").hidden) location.hash = launched ? "galaxy" : ""; else if (!$("#panel").hidden) closePanel(); else if (activeLink) setLink(null); }
  if (!$("#panel").hidden && current >= 0) { if (e.key === "ArrowRight") $("#nextBtn").click(); if (e.key === "ArrowLeft" && current > 0) go(current - 1); }
});
addEventListener("pointermove", e => galaxy && galaxy.setMouse(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
$("#gl").addEventListener("click", e => { if (!galaxy || $("#hud").hidden) return; const i = galaxy.pick(e.clientX, e.clientY); if (i >= 0) go(i); });
addEventListener("resize", () => galaxy && galaxy.resize());

/* ================= boot ================= */
async function boot() {
  applyLang(); bindCopy(); bootLines();
  try {
    const { createGalaxy } = await import("./scene.js");
    galaxy = createGalaxy($("#gl"), WORLDS, { reduce, maxDt: location.search.includes("test") ? .5 : .05, logoCanvas, onFrame: placeLabels, onWarp: () => { const f = $("#flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); } });
  } catch (e) { console.error(e); galaxy = null; }
  if (location.hash) route();
}
boot();

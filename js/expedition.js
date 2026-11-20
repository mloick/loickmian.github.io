// "The Expedition": a scroll story about a project manager who builds.
// Shared career data comes from content.js; copy that only this page uses lives in X below.
import { UI, WORLDS, LINKS } from "./content.js";

const WEB3FORMS_KEY = "98a5ced1-d2fd-4c80-ba9a-78023c1d476b";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const redacted = s => esc(s).replace(/\[\[(.*?)\]\]/g, (_, w) => `<span class="redact" title="Redacted">${"█".repeat(w.length)}</span>`);
const store = { get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const byId = id => WORLDS.find(w => w.id === id);

let lang = store.get("lang", (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en");
if (/[?&]lang=(en|fr)/.test(location.search)) lang = location.search.match(/lang=(en|fr)/)[1];

/* ================= copy ================= */
const X = {
  en: {
    navAbout: "About", navExp: "Expedition", navHelm: "The helm", navLab: "Builds", navContact: "Contact",
    resume: "Résumé", welcome: "Welcome to my universe",
    heroTitle: "From an idea to <em>the real thing.</em>",
    heroLead: "I'm Loick Mian, Digital Project Manager & Builder. I start from the business problem, bring in the tech and AI that solve it, and lead the team until people actually use the result.",
    begin: "Begin the tour", briefBtn: "30-second brief",
    fact1: "Open to permanent roles · Oct 2027", fact2: "Paris area · French & English",
    bubble: ["Welcome aboard! I'm Loick, and I'll be your guide today.", "I'll show you where I've been, what I'm building now, and where I'm heading.", "Fun fact: I designed and built this site myself.", "Ready? Scroll down, the tour starts here."],
    navMethod: "Method",
    methodKicker: "How I work",
    methodTitle: "Business problem in, <em>working solution out.</em>",
    methodSub: "I don't just execute a task list. I look for the problem behind the request, the value for the business, and the tech or AI that can solve it. Then I lead it all the way to adoption.",
    triad: [
      { k: "biz", n: "Business", q: "What problem are we solving, and what is it worth?", p: "Every project starts with a cost, a delay or a frustration. I frame it, measure it and agree on what success looks like.", ex: "LBT · SOCAR · Opti-Mall" },
      { k: "tech", n: "Tech", q: "What's the simplest system that solves it?", p: "With a computer science degree, I can talk to developers, write specs they trust and build the first prototype myself.", ex: "SimuFlow · IMPACT PLUS IT · Konica Minolta" },
      { k: "ai", n: "AI", q: "Where does AI save real time?", p: "I use AI every day to go from an idea to a working prototype in hours, and I put it in products where it removes manual work.", ex: "Claude Code · text recognition in SimuFlow" },
      { k: "core", n: "Solutions people use", q: "The overlap is where I work.", p: "A tool only counts if people adopt it. That's why training, feedback and change management are part of every plan I write.", ex: "85% adoption at IMPACT PLUS" }
    ],
    pipeline: [["Understand", "Go on the ground, listen, map how work really happens."], ["Frame", "Turn it into a business case, a scope and success metrics."], ["Design", "Pick the tech and AI that fit. Write specs people can build from."], ["Prototype", "Show a working version early. Test it with real users."], ["Deliver", "Roll out, train, measure, and keep improving."]],
    endLine: "That's my world so far. Shall we build the next part together?",
    letsBuild: "Let's build", letsLink: "Let's link",
    guide: { basecamp: "This is where it all started.", command: "My first projects as a PM.", mission: "This is where I am today.", frontier: "And this is where I'm heading." },
    caseL: ["Problem", "What I did", "Result"],
    cases: {
      socar: ["A brand whose marketing lived almost entirely offline.", "Rolled out social, search and email campaigns and improved the online catalogue.", "+35% engagement."],
      impact: ["Case files moved on paper and through scattered tools.", "Mapped the processes, wrote the specs, digitised them and trained 30+ people.", "+60% case processing speed, 85% adoption."],
      dreamxr: ["Three teams (dev, 3D/UX, QA) working at different speeds.", "Set up Scrum with Jira and ClickUp, the rituals and the reporting.", "−20% sprint blockers. Room to take on several markets and projects."],
      optimall: ["A retail business that ran 100% on paper, with constant trips to sites.", "Wrote a digitisation roadmap and rolled out a shared Notion workspace to run projects remotely.", "~100% of processes digitised in weeks. ~50% fewer site trips."],
      konica: ["ITSM workflows are hard to validate on a static diagram.", "Model them with business teams, run validation sessions, and built a simulator to replay each case.", "Workflows checked before configuration. The simulator became SimuFlow."],
      simuflow: ["Workflows are designed on paper and break once they are live.", "Built a product that imports any diagram, finds the flaws and replays every case.", "Live on iOS, Android and web. Target: cut workflow set-up time by half or more."],
      lbt: ["In Benin, it's hard to find a tech seller you can trust.", "Brand, positioning, and a five-phase launch plan from market study to pilot offer.", "A brand built on trust: authenticity and after-sales care first. Coming soon."]
    },
    aboutKicker: "Meet your guide",
    aboutTitle: "A project manager <em>who builds.</em>",
    aboutLede: "I studied computer science at EPITECH in Benin, moved to Paris, and now run ITSM projects as an apprentice at Konica Minolta while I finish my master's at YNOV.",
    aboutLog: ["I write the specs, and I can usually ship the first working prototype myself.", "I've led digital projects in consulting, XR, retail and energy, in Benin and in France.", "I've also worked checkouts, kitchens and phone lines. Those jobs taught me more about pressure and customers than any course did.", "On the side, I'm building a product, a brand, and something I can't tell you about yet."],
    aboutCard: "Born and raised in Cotonou. Based in the Paris area since 2025.",
    principles: [["Start from the field", "Before any tool, I watch how people really work. Supermarket floors and phone lines taught me that."], ["Show, don't tell", "A working prototype ends more debates than a slide deck. So I build one early."], ["Bring people along", "A project only succeeds if people adopt it. Training and feedback are in the plan from day one."]],
    statsKicker: "The expedition in numbers",
    stats: [["+", "60", "%", "faster case processing after digitising internal processes", "IMPACT PLUS"], ["~", "100", "%", "of processes digitised, in a few weeks", "Opti-Mall"], ["−", "50", "%", "site trips, thanks to remote project management", "Opti-Mall"], ["", "85", "%", "adoption of the new tools, 30+ colleagues trained", "IMPACT PLUS"], ["−", "20", "%", "sprint blockers, 3 teams in one Scrum rhythm", "DreamXR"], ["+", "35", "%", "engagement after a digital marketing rollout", "SOCAR Benin"], ["", "1", "", "product shipped solo, on iOS, Android and web", "SimuFlow"], ["÷", "2", "", "workflow set-up time: the goal SimuFlow is built for", "Target"]],
    expKicker: "The expedition · 2021 → today",
    expTitle: "Every stop gave me <em>a new skill.</em>",
    expSub: "Four phases, like any project: build the base, take the first commands, run the current mission, open new frontiers.",
    roadmap: "Roadmap", rmStatus: "Status: <b>on track</b>. Next milestone: a permanent role, October 2027.",
    phases: [
      { id: "basecamp", k: "Phase 01 · 2021 – 2026", t: "Basecamp", p: "Computer science first, then real jobs alongside it. Checkouts, kitchens and phone lines: where I learned pressure, customers and rigour." },
      { id: "command", k: "Phase 02 · 2022 – 2025", t: "First commands", p: "My first project roles, in marketing, consulting, XR and retail. Each one handed me a bigger piece of the plan." },
      { id: "mission", k: "Phase 03 · 2026 – today", t: "Current mission", p: "Project manager on the rollout of an IT service management platform, inside a global group." },
      { id: "frontier", k: "Phase 04 · now → 2027", t: "New frontiers", p: "What I build on my own: a product, a brand, and a signal I can't fully decode for you yet." }
    ],
    fieldTitle: "Field rotations", log: "Mission log", proves: "What it taught me",
    status: { live: "Live", building: "Ongoing", soon: "Coming soon", classified: "Classified", done: "Done", current: "Now" },
    decode: "Tap a line to decrypt it.",
    kpis: { socar: ["+35% engagement"], impact: ["5+ projects", "30+ people trained", "85% adoption"], dreamxr: ["3 teams", "−20% sprint blockers", "Scrum"], optimall: ["Paper → Notion", "Team trained"], konica: ["ITSM / ITIL", "draw.io workflows", "FR · EN"], simuflow: ["v1.0 live", "iOS · Android · Web"] },
    helmKicker: "The helm · how I steer a project",
    helmTitle: "Six skills <em>at the helm.</em>",
    spoke: "Spoke", seen: "Where I used it", toolkit: "Toolkit & methods",
    contactKicker: "Next destination",
    contactTitle: "Your team <em>could be next.</em>",
    contactSub: "A permanent role from October 2027, a project, a question, or just a hello. Your message lands straight in my inbox.",
    formTitle: "Send a message", direct: "Direct line", footNote: "Designed and built by me, with AI as a co-pilot."
  },
  fr: {
    navAbout: "Qui je suis", navExp: "L'expédition", navHelm: "La barre", navLab: "Projets", navContact: "Contact",
    resume: "CV", welcome: "Bienvenue dans mon univers",
    heroTitle: "De l'idée à <em>la réalisation.</em>",
    heroLead: "Moi, c'est Loick Mian, chef de projet digital & builder. Je pars du problème business, j'apporte la tech et l'IA qui le résolvent, et je mène l'équipe jusqu'à ce que les gens utilisent vraiment le résultat.",
    begin: "Commencer la visite", briefBtn: "Briefing 30 secondes",
    fact1: "Disponible en CDI · oct. 2027", fact2: "Île-de-France · français & anglais",
    bubble: ["Bienvenue à bord ! Moi c'est Loick, je serai ton guide.", "Je vais te montrer d'où je viens, ce que je construis, et où je vais.", "Petit secret : j'ai conçu et codé ce site moi-même.", "Prêt ? Descends, la visite commence ici."],
    navMethod: "Méthode",
    methodKicker: "Ma façon de travailler",
    methodTitle: "Un problème business en entrée, <em>une solution qui marche en sortie.</em>",
    methodSub: "Je ne me contente pas d'exécuter une liste de tâches. Je cherche le problème derrière la demande, la valeur pour le business, et la tech ou l'IA qui peut le résoudre. Puis je mène le tout jusqu'à l'adoption.",
    triad: [
      { k: "biz", n: "Business", q: "Quel problème on résout, et combien il coûte ?", p: "Chaque projet part d'un coût, d'un délai ou d'une frustration. Je le cadre, je le mesure et on se met d'accord sur ce qu'est la réussite.", ex: "LBT · SOCAR · Opti-Mall" },
      { k: "tech", n: "Tech", q: "Quel est le système le plus simple qui le résout ?", p: "Avec ma formation en informatique, je parle aux développeurs, j'écris des specs fiables et je construis moi-même le premier prototype.", ex: "SimuFlow · IT chez IMPACT PLUS · Konica Minolta" },
      { k: "ai", n: "IA", q: "Où l'IA fait-elle gagner du vrai temps ?", p: "J'utilise l'IA chaque jour pour passer d'une idée à un prototype en quelques heures, et je l'intègre aux produits là où elle supprime du travail manuel.", ex: "Claude Code · reconnaissance de texte dans SimuFlow" },
      { k: "core", n: "Des solutions utilisées", q: "C'est à l'intersection que je travaille.", p: "Un outil ne compte que si les gens l'adoptent. C'est pour ça que formation, retours et conduite du changement font partie de chaque plan que j'écris.", ex: "85 % d'adoption chez IMPACT PLUS" }
    ],
    pipeline: [["Comprendre", "Aller sur le terrain, écouter, cartographier le travail réel."], ["Cadrer", "En faire un business case, un périmètre et des indicateurs de réussite."], ["Concevoir", "Choisir la tech et l'IA adaptées. Écrire des specs exploitables."], ["Prototyper", "Montrer tôt une version qui marche. La tester avec de vrais utilisateurs."], ["Livrer", "Déployer, former, mesurer, et continuer d'améliorer."]],
    endLine: "Voilà mon univers jusqu'ici. On construit la suite ensemble ?",
    letsBuild: "Construisons", letsLink: "Connectons-nous",
    guide: { basecamp: "C'est ici que tout a commencé.", command: "Mes premiers projets en tant que chef de projet.", mission: "C'est là que je suis aujourd'hui.", frontier: "Et voici où je vais." },
    caseL: ["Le problème", "Ce que j'ai fait", "Le résultat"],
    cases: {
      socar: ["Une marque dont le marketing vivait presque entièrement hors ligne.", "Déploiement de campagnes réseaux sociaux, SEA et e-mailing, catalogue en ligne optimisé.", "+35 % d'engagement."],
      impact: ["Des dossiers qui circulaient sur papier et dans des outils éparpillés.", "Cartographie des process, specs, numérisation et formation de 30+ personnes.", "Traitement des dossiers 60 % plus rapide, 85 % d'adoption."],
      dreamxr: ["Trois équipes (dev, 3D/UX, QA) qui avançaient à des rythmes différents.", "Mise en place de Scrum avec Jira et ClickUp, des rituels et du reporting.", "−20 % de blocages de sprint. De quoi absorber plusieurs marchés et projets."],
      optimall: ["Une entreprise de commerce 100 % papier, avec des déplacements sur site en permanence.", "Feuille de route de digitalisation et espace Notion partagé pour piloter les projets à distance.", "Près de 100 % des process numérisés en quelques semaines. Environ 50 % de déplacements en moins."],
      konica: ["Des workflows ITSM difficiles à valider sur un schéma figé.", "Je les modélise avec les métiers, j'anime les validations, et j'ai construit un simulateur pour rejouer chaque cas.", "Des workflows vérifiés avant paramétrage. Le simulateur est devenu SimuFlow."],
      simuflow: ["Les workflows sont conçus sur papier et cassent une fois en production.", "Un produit qui importe n'importe quel schéma, trouve les failles et rejoue chaque cas.", "En ligne sur iOS, Android et web. Objectif : diviser par deux, voire plus, le temps de mise en place d'un workflow."],
      lbt: ["Au Bénin, difficile de trouver un vendeur tech de confiance.", "Marque, positionnement et plan de lancement en cinq phases, de l'étude de marché à l'offre pilote.", "Une marque fondée sur la confiance : authenticité et SAV d'abord. Bientôt."]
    },
    aboutKicker: "Voici ton guide",
    aboutTitle: "Un chef de projet <em>qui construit.</em>",
    aboutLede: "J'ai étudié l'informatique à EPITECH au Bénin, je suis venu à Paris, et je pilote aujourd'hui des projets ITSM en alternance chez Konica Minolta pendant mon mastère à YNOV.",
    aboutLog: ["J'écris les specs, et je sais en général livrer moi-même le premier prototype qui marche.", "J'ai mené des projets digitaux dans le conseil, la XR, le commerce et l'énergie, au Bénin et en France.", "J'ai aussi tenu des caisses, des cuisines et des lignes téléphoniques. Ces jobs m'ont plus appris sur la pression et le client que n'importe quel cours.", "À côté, je construis un produit, une marque, et un projet dont je ne peux pas encore parler."],
    aboutCard: "Né et grandi à Cotonou. En Île-de-France depuis 2025.",
    principles: [["Partir du terrain", "Avant tout outil, j'observe comment les gens travaillent vraiment. Les rayons et les lignes téléphoniques me l'ont appris."], ["Montrer plutôt qu'expliquer", "Un prototype qui marche clôt plus de débats qu'un PowerPoint. Alors j'en construis un tôt."], ["Embarquer les gens", "Un projet ne réussit que si les gens l'adoptent. Formation et retours sont dans le plan dès le premier jour."]],
    statsKicker: "L'expédition en chiffres",
    stats: [["+", "60", "%", "de vitesse de traitement des dossiers après numérisation des process", "IMPACT PLUS"], ["~", "100", "%", "des process numérisés, en quelques semaines", "Opti-Mall"], ["−", "50", "%", "de déplacements sur site grâce au pilotage à distance", "Opti-Mall"], ["", "85", "%", "d'adoption des nouveaux outils, 30+ collaborateurs formés", "IMPACT PLUS"], ["−", "20", "%", "de blocages de sprint, 3 équipes au même rythme Scrum", "DreamXR"], ["+", "35", "%", "d'engagement après un plan marketing digital", "SOCAR Bénin"], ["", "1", "", "produit livré en solo, sur iOS, Android et web", "SimuFlow"], ["÷", "2", "", "le temps de mise en place d'un workflow : l'objectif de SimuFlow", "Objectif"]],
    expKicker: "L'expédition · 2021 → aujourd'hui",
    expTitle: "Chaque escale m'a donné <em>une compétence.</em>",
    expSub: "Quatre phases, comme dans tout projet : poser la base, prendre les premiers commandements, mener la mission en cours, ouvrir de nouvelles frontières.",
    roadmap: "Feuille de route", rmStatus: "Statut : <b>dans les temps</b>. Prochain jalon : un CDI, octobre 2027.",
    phases: [
      { id: "basecamp", k: "Phase 01 · 2021 – 2026", t: "Le camp de base", p: "L'informatique d'abord, puis de vrais jobs à côté. Caisses, cuisines et lignes téléphoniques : là où j'ai appris la pression, le client et la rigueur." },
      { id: "command", k: "Phase 02 · 2022 – 2025", t: "Premiers commandements", p: "Mes premiers postes en mode projet, dans le marketing, le conseil, la XR et le commerce. À chaque fois, une plus grande part du plan." },
      { id: "mission", k: "Phase 03 · 2026 – aujourd'hui", t: "La mission en cours", p: "Chef de projet sur le déploiement d'une plateforme de gestion des services IT, au sein d'un groupe international." },
      { id: "frontier", k: "Phase 04 · maintenant → 2027", t: "Nouvelles frontières", p: "Ce que je construis par moi-même : un produit, une marque, et un signal que je ne peux pas encore entièrement décoder pour toi." }
    ],
    fieldTitle: "Rotations terrain", log: "Journal de mission", proves: "Ce que j'en retiens",
    status: { live: "En ligne", building: "En cours", soon: "Bientôt", classified: "Classifié", done: "Terminé", current: "Aujourd'hui" },
    decode: "Touche une ligne pour la déchiffrer.",
    kpis: { socar: ["+35 % d'engagement"], impact: ["5+ projets", "30+ personnes formées", "85 % d'adoption"], dreamxr: ["3 équipes", "−20 % de blocages", "Scrum"], optimall: ["Papier → Notion", "Équipe formée"], konica: ["ITSM / ITIL", "Workflows draw.io", "FR · EN"], simuflow: ["v1.0 en ligne", "iOS · Android · Web"] },
    helmKicker: "La barre · comment je pilote un projet",
    helmTitle: "Six compétences <em>à la barre.</em>",
    spoke: "Poignée", seen: "Où je m'en suis servi", toolkit: "Outils & méthodes",
    contactKicker: "Prochaine destination",
    contactTitle: "Ton équipe <em>pourrait être la suivante.</em>",
    contactSub: "Un CDI à partir d'octobre 2027, un projet, une question ou juste un bonjour. Ton message arrive directement dans ma boîte mail.",
    formTitle: "Envoyer un message", direct: "Ligne directe", footNote: "Conçu et codé par moi, avec l'IA comme copilote."
  }
};
const PHASE_WORLDS = { basecamp: ["academy"], command: ["socar", "impact", "dreamxr", "optimall"], mission: ["konica"], frontier: ["simuflow", "lbt", "workshop", "keepit"] };
const FIELD = ["kungfu", "superu", "alyce", "fiveguys", "intermarche"];
const FEATURE = ["konica", "simuflow"];
const RM = { basecamp: [2021, 2026.6], command: [2022.6, 2025.9], mission: [2026.7, 2027.8], frontier: [2026.8, 2027.8] };
const TILE = { impact: { bg: "#1f65ad" }, alyce: { bg: "#0b2438" }, dreamxr: { bg: "#152e56" }, optimall: { bg: "#ffffff" }, intermarche: { bg: "#e30613", mask: true }, simuflow: { bg: "#ffffff" }, lbt: { bg: "#0d0f1a" } };
const TOOLS = [["Jira", "jira"], ["ClickUp", "clickup"], ["Notion", "notion"], ["Figma", "figma"], ["draw.io · BPMN"], ["Scrum · Kanban"], ["ITIL"], ["React", "react"], ["TypeScript", "typescript"], ["Supabase", "supabase"], ["Expo", "expo"], ["Claude", "claude"]];
const t = () => ({ ...UI[lang], ...X[lang] });

/* ================= the explorer (that's me) ================= */
function explorerSVG(p, mini) {
  const flag = mini ? "" : `
    <line x1="38" y1="26" x2="38" y2="224" stroke="#cfd6e6" stroke-width="3" stroke-linecap="round"/>
    <g class="ex-flag" style="transform-origin:38px 30px"><path d="M37 28 H-12 L-3 42 L-12 56 H37 Z" fill="#f2c46d"/><text x="12" y="47" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="600" font-size="13" fill="#1d1406">LM</text></g>`;
  return `<defs>
      <linearGradient id="${p}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1236"/><stop offset=".62" stop-color="#2a2d6b"/><stop offset=".63" stop-color="#f2c46d"/><stop offset="1" stop-color="#e48a5c"/></linearGradient>
      <linearGradient id="${p}s" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d0e2"/></linearGradient>
    </defs>
    ${flag}
    <rect x="50" y="84" width="60" height="72" rx="13" fill="#9aa4bf"/>
    <rect x="58" y="158" width="19" height="50" rx="9" fill="url(#${p}s)"/><rect x="83" y="158" width="19" height="50" rx="9" fill="url(#${p}s)"/>
    <rect x="53" y="200" width="27" height="17" rx="7" fill="#5d6888"/><rect x="80" y="200" width="27" height="17" rx="7" fill="#5d6888"/>
    <rect x="52" y="88" width="56" height="84" rx="22" fill="url(#${p}s)"/>
    <rect x="53" y="150" width="54" height="8" fill="#c3cbdd"/>
    <rect x="65" y="110" width="30" height="22" rx="5" fill="#26305a"/>
    <circle cx="72" cy="121" r="2.6" fill="#8cc8ff" class="ex-light"/><circle cx="80" cy="121" r="2.6" fill="#f2c46d"/><circle cx="88" cy="121" r="2.6" fill="#5be3a1" class="ex-light"/>
    <line x1="55" y1="100" x2="42" y2="146" stroke="#e6eaf3" stroke-width="16" stroke-linecap="round"/><circle cx="41" cy="150" r="8.5" fill="#5d6888"/>
    <rect x="60" y="85" width="40" height="9" rx="4.5" fill="#c3cbdd"/>
    <line x1="102" y1="38" x2="110" y2="18" stroke="#c3cbdd" stroke-width="2.5"/><circle cx="110" cy="17" r="3.5" fill="#f2c46d"/>
    <circle cx="80" cy="58" r="32" fill="url(#${p}s)" stroke="#c3cbdd" stroke-width="1.5"/>
    <rect x="56" y="41" width="48" height="36" rx="17" fill="url(#${p}v)"/>
    <ellipse cx="68" cy="51" rx="7" ry="3" fill="#fff" class="ex-glint" transform="rotate(-24 68 51)"/>
    <g class="ex-arm-wave" style="transform-origin:104px 100px"><line x1="105" y1="100" x2="126" y2="66" stroke="#e6eaf3" stroke-width="16" stroke-linecap="round"/><circle cx="128" cy="62" r="8.5" fill="#5d6888"/></g>`;
}

/* ================= logo tiles ================= */
function tile(w) {
  const c = TILE[w.id] || {};
  if (w.logo && c.mask) return `<div class="tile" style="background:${c.bg}"><i class="mask" style="-webkit-mask-image:url(assets/logos/${w.logo});mask-image:url(assets/logos/${w.logo})"></i></div>`;
  if (w.logo) return `<div class="tile" style="background:${c.bg || "#fff"}"><img src="assets/logos/${w.logo}" alt="${esc(w.en.name)} logo" loading="lazy"></div>`;
  const m = w.mark.length > 8 ? w.mark.replace(" ", "<br>") : esc(w.mark);
  return `<div class="tile mark" style="--tc:${w.color};font-size:${w.mark.length > 8 ? 9 : w.mark.length > 3 ? 12 : 16}px" aria-hidden="true">${m}</div>`;
}

/* ================= rendering ================= */
function card(id, kind = "") {
  const w = byId(id), c = w[lang], T = t();
  const kp = (T.kpis[id] || []).map(k => `<span class="kpi">${esc(k)}</span>`).join("");
  const isKeep = !!c.cipher;
  const body = isKeep
    ? `<ul class="cipher">${c.cipher.map((l, i) => `<li data-line="${i}" tabindex="0">${"▒".repeat(Math.min(44, l.length))}</li>`).join("")}</ul><p class="hint">${esc(T.decode)}</p>`
    : `${T.cases[id] ? `<div class="case">${T.cases[id].map((v, i) => `<div class="cs${i}"><b>${esc(T.caseL[i])}</b><p>${esc(v)}</p></div>`).join("")}</div>` : kp ? `<div class="kpis">${kp}</div>` : ""}
       <details${kind === "feature" ? " open" : ""}><summary>${esc(T.log)}</summary><ul>${c.log.map(l => `<li>${esc(l)}</li>`).join("")}</ul></details>`;
  const extra = [
    w.wordmark ? `<img class="lbt-word" src="assets/logos/${w.wordmark}" alt="LBT, la boutique tech">` : "",
    w.links ? `<div class="mlinks">${w.links.map(l => `<a class="btn sm" href="${l.href}" target="_blank" rel="noopener">${esc(l[lang])} ↗</a>`).join("")}</div>` : "",
    w.gallery ? `<div class="gallery">${w.gallery.map(g => `<img src="${g}" alt="SimuFlow screen" loading="lazy">`).join("")}</div>` : "",
    w.stack ? `<div class="stack">${w.stack.map(s => `<span><img src="assets/logos/${s}.svg" alt="" style="filter:invert(1);opacity:.8">${s}</span>`).join("")}</div>` : ""
  ].join("");
  return `<article class="mile ${kind} reveal" id="m-${id}" data-id="${id}">
    <div class="mile-top">${tile(w)}<div class="mile-id"><span class="meta">${redacted(c.period)} · ${esc(c.place)}</span><h4>${esc(c.name)}</h4><p class="role">${esc(c.role)}</p></div><span class="badge ${w.status}">${esc(T.status[w.status])}</span></div>
    <p class="lede">${esc(c.lede)}</p>${body}${extra}
    ${kind === "small" ? "" : `<p class="proves"><b>${esc(T.proves)}</b>${esc(c.proves)}</p>`}
  </article>`;
}

function render() {
  const T = t();
  document.documentElement.lang = lang;
  $$("[data-t]").forEach(el => { const v = T[el.dataset.t]; if (typeof v === "string") el.textContent = v; });
  $$("[data-t-html]").forEach(el => { el.innerHTML = T[el.dataset.tHtml]; });
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  $("#cvBtn").href = T.resumeHref;
  $("#aboutLog").innerHTML = T.aboutLog.map(l => `<li>${esc(l)}</li>`).join("");
  $("#principles").innerHTML = T.principles.map((p, i) => `<div class="pr reveal"><span class="n">0${i + 1}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>`).join("");
  $("#stats").innerHTML = T.stats.map(s => `<div class="stat reveal"><b>${s[0] ? `<small>${s[0]}</small>` : ""}<span class="n" data-n="${s[1]}">${s[1]}</span><sup>${s[2]}</sup></b><span>${esc(s[3])}</span><em>${esc(s[4])}</em></div>`).join("");
  // method: business × tech × AI
  $("#triad").innerHTML = `<svg viewBox="0 0 360 330" role="img" aria-label="Business, Tech and AI overlap">
      <circle class="tc biz" data-k="biz" cx="180" cy="112" r="92"/><circle class="tc tech" data-k="tech" cx="122" cy="212" r="92"/><circle class="tc ai" data-k="ai" cx="238" cy="212" r="92"/>
      <circle class="tc core" data-k="core" cx="180" cy="180" r="30"/>
      <text x="180" y="62" class="tl">${esc(T.triad[0].n)}</text><text x="88" y="250" class="tl">${esc(T.triad[1].n)}</text><text x="272" y="250" class="tl">${esc(T.triad[2].n)}</text>
      <text x="180" y="184" class="tl core-t">LM</text></svg>`;
  $("#pipeline").innerHTML = T.pipeline.map((p, i) => `<li class="reveal" style="transition-delay:${i * 90}ms"><span class="pn">0${i + 1}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></li>`).join("");
  showTriad(triadK);
  // roadmap
  const span = [2021, 2027.8], pct = v => ((v - span[0]) / (span[1] - span[0])) * 100;
  $("#roadmap").innerHTML = `<h4>${esc(T.roadmap)}</h4>${T.phases.map(p => { const [a, b] = RM[p.id]; return `<button class="rm-item" data-go="${p.id}"><span class="t">${esc(p.t)}<small>${p.k.split("·")[0].trim().replace("Phase ", "P")}</small></span><span class="rm-bar"><i style="left:${pct(a)}%;width:${pct(b) - pct(a)}%"></i></span></button>`; }).join("")}
    <div class="rm-axis"><span>2021</span><span>2023</span><span>2025</span><span>2027</span></div><p class="rm-status">${T.rmStatus}</p>`;
  // phases
  $("#phases").innerHTML = T.phases.map(p => {
    const main = PHASE_WORLDS[p.id].map(id => card(id, FEATURE.includes(id) ? "feature" : "")).join("");
    const field = p.id === "basecamp" ? `<p class="mono small" style="margin:30px 0 14px">${esc(T.fieldTitle)}</p><div class="miles grid">${FIELD.map(id => card(id, "small")).join("")}</div>` : "";
    return `<div class="phase" id="ph-${p.id}" data-phase="${p.id}"><div class="phase-head reveal"><span class="mono">${esc(p.k)}</span><h3>${esc(p.t)}</h3><p>${esc(p.p)}</p></div><div class="miles">${main}</div>${field}</div>`;
  }).join("");
  // helm
  $("#skillTabs").innerHTML = LINKS.map((l, i) => `<button role="tab" data-skill="${i}" aria-selected="${i === skill}">${esc(l[lang].name)}</button>`).join("");
  $("#tools").innerHTML = TOOLS.map(([n, ic]) => `<span>${ic ? `<img src="assets/logos/${ic}.svg" alt="">` : ""}${esc(n)}</span>`).join("");
  showSkill(skill, true);
  bindDynamic();
  observeReveals();
}

/* ================= helm (ship's wheel) ================= */
let skill = 0, turned = 0, userTouchedHelm = false;
function buildWheel() {
  const spokes = LINKS.map((l, i) => {
    const a = i * 60 * Math.PI / 180, x = Math.sin(a), y = -Math.cos(a);
    return `<g class="spoke" data-skill="${i}">
      <line x1="${x * 30}" y1="${y * 30}" x2="${x * 124}" y2="${y * 124}" stroke="#2c3768" stroke-width="9" stroke-linecap="round"/>
      <circle class="hd" cx="${x * 138}" cy="${y * 138}" r="18"/>
      <text class="num" x="${x * 138}" y="${y * 138 + 4.5}" text-anchor="middle" style="transform-box:fill-box;transform-origin:center">0${i + 1}</text></g>`;
  }).join("");
  const ticks = Array.from({ length: 36 }, (_, i) => { const a = i * 10 * Math.PI / 180; return `<line x1="${Math.sin(a) * 100}" y1="${-Math.cos(a) * 100}" x2="${Math.sin(a) * 106}" y2="${-Math.cos(a) * 106}" stroke="rgba(242,196,109,.35)" stroke-width="1"/>`; }).join("");
  $("#wheel").innerHTML = `<g class="rot" id="wheelRot">
      <circle r="112" fill="none" stroke="#2c3768" stroke-width="14"/><circle r="112" fill="none" stroke="rgba(242,196,109,.5)" stroke-width="1"/>
      <circle r="94" fill="none" stroke="rgba(190,205,255,.12)" stroke-width="1"/>${ticks}${spokes}
      <circle r="34" fill="#0d1330" stroke="#f2c46d" stroke-width="1.5"/>
      <text id="hubTxt" y="5" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="14" font-weight="600" fill="#f2c46d" style="transform-box:fill-box;transform-origin:center">LM</text></g>`;
  $$("#wheel .spoke").forEach(g => g.addEventListener("click", () => { userTouchedHelm = true; showSkill(+g.dataset.skill); }));
}
function showSkill(i, silent) {
  const prev = skill; skill = i;
  let d = ((i - prev) % 6 + 6) % 6; if (d > 3) d -= 6; turned += d;
  const rot = -turned * 60;
  $("#wheelRot").style.transform = `rotate(${rot}deg)`;
  $$("#wheel .num, #hubTxt").forEach(n => n.style.transform = `rotate(${-rot}deg)`);
  $$("#wheel .spoke").forEach(g => g.classList.toggle("on", +g.dataset.skill === i));
  $$("#skillTabs button").forEach(b => b.setAttribute("aria-selected", +b.dataset.skill === i));
  const L = LINKS[i], c = L[lang], T = t();
  const sc = $("#skillCard");
  sc.innerHTML = `<span class="mono">${esc(T.spoke)} 0${i + 1} / 06</span><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p>
    <p class="mono small" style="margin:22px 0 0">${esc(T.seen)}</p>
    <div class="where">${L.worlds.map(id => { const w = byId(id); return `<a href="#m-${id}" data-open="${id}">${tile(w)}${esc(w[lang].name.split(" · ")[0])}</a>`; }).join("")}</div>`;
  if (!silent) { sc.classList.remove("swap"); void sc.offsetWidth; sc.classList.add("swap"); }
  $$("#skillCard [data-open]").forEach(a => a.addEventListener("click", () => { const d = $(`#m-${a.dataset.open} details`); if (d) d.open = true; }));
}
setInterval(() => { if (!userTouchedHelm && !reduce && document.visibilityState === "visible" && inView($("#helm"))) showSkill((skill + 1) % 6); }, 5200);
const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight * .7 && r.bottom > innerHeight * .3; };

/* ================= interactions ================= */
function bindDynamic() {
  $$("#skillTabs button").forEach(b => b.addEventListener("click", () => { userTouchedHelm = true; showSkill(+b.dataset.skill); }));
  $$(".rm-item").forEach(b => b.addEventListener("click", () => $(`#ph-${b.dataset.go}`).scrollIntoView({ behavior: reduce ? "auto" : "smooth" })));
  $$(".cipher li").forEach(li => {
    const open = () => { if (li.classList.contains("open")) return; const line = byId("keepit")[lang].cipher[+li.dataset.line]; li.classList.add("open"); scramble(li, line); };
    li.addEventListener("click", open); li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  bindCopy();
}
function scramble(el, text) {
  const plain = text.replace(/\[\[(.*?)\]\]/g, "$1"), G = "▒░▓<>/\\#%&*+=";
  if (reduce) { el.innerHTML = redacted(text); return; }
  const t0 = performance.now(), dur = 900;
  const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = [...plain].map((c, i) => c === " " || i / plain.length < k ? c : G[(Math.random() * G.length) | 0]).join(""); if (k < 1) requestAnimationFrame(step); else el.innerHTML = redacted(text); };
  requestAnimationFrame(step);
}
let io;
function observeReveals() {
  if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); if (e.target.classList.contains("stat")) countUp(e.target.querySelector("b")); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}
function countUp(b) {
  const el = b.querySelector(".n"), n = +el.dataset.n; if (reduce || n < 3) return;
  const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 1200), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(n * e); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
}
let triadK = "core", triadTouched = false;
function showTriad(k) {
  triadK = k; const d = t().triad.find(x => x.k === k);
  $$("#triad .tc").forEach(c => c.classList.toggle("on", c.dataset.k === k));
  $("#triadInfo").innerHTML = `<div class="ti ${k}"><span class="mono">${esc(d.n)}</span><h3>${esc(d.q)}</h3><p>${esc(d.p)}</p><p class="ex">${esc(d.ex)}</p></div>
    <div class="ti-tabs">${t().triad.map(x => `<button data-tk="${x.k}" aria-pressed="${x.k === k}">${esc(x.n)}</button>`).join("")}</div>`;
  $$("[data-tk]").forEach(b => b.addEventListener("click", () => { triadTouched = true; showTriad(b.dataset.tk); }));
}
document.addEventListener("click", e => { const c = e.target.closest && e.target.closest("#triad .tc"); if (c) { triadTouched = true; showTriad(c.dataset.k); } });
document.addEventListener("mouseover", e => { const c = e.target.closest && e.target.closest("#triad .tc"); if (c && matchMedia("(hover:hover)").matches) { triadTouched = true; if (triadK !== c.dataset.k) showTriad(c.dataset.k); } });
setInterval(() => { if (!triadTouched && !reduce && inView($("#method"))) { const ks = ["biz", "tech", "ai", "core"]; showTriad(ks[(ks.indexOf(triadK) + 1) % 4]); } }, 4200);

/* hero speech bubble: the explorer introduces himself */
let bubbleI = 0, typing;
function say(i) {
  const lines = t().bubble, txt = lines[i % lines.length], el = $("#bubbleText"), b = $("#bubble");
  clearInterval(typing); b.classList.add("on"); b.classList.remove("done");
  if (reduce) { el.textContent = txt; b.classList.add("done"); return; }
  let k = 0; el.textContent = "";
  typing = setInterval(() => { el.textContent = txt.slice(0, ++k); if (k >= txt.length) { clearInterval(typing); b.classList.add("done"); } }, 28);
}
$("#explorer").innerHTML = explorerSVG("h");
$("#walker svg").innerHTML = explorerSVG("w", true);
$("#endExplorer").innerHTML = explorerSVG("e");
$("#explorer").addEventListener("click", () => say(++bubbleI));
setTimeout(() => say(0), 1100);

/* scroll: progress bar, walker on the trail, active phase, nav highlight */
function onScroll() {
  const h = document.documentElement, p = h.scrollTop / Math.max(1, h.scrollHeight - innerHeight);
  $("#progBar").style.width = (p * 100).toFixed(2) + "%";
  const tr = $("#trail").getBoundingClientRect(), mid = innerHeight * .45;
  const k = Math.max(0, Math.min(1, (mid - tr.top) / tr.height));
  $("#trailFill").style.height = (k * 100) + "%";
  $("#walker").style.top = (k * 100) + "%";
  let cur = null;
  $$(".phase").forEach(ph => { const r = ph.getBoundingClientRect(); if (r.top < mid) cur = ph.dataset.phase; });
  $$(".rm-item").forEach(b => b.classList.toggle("on", b.dataset.go === cur));
  const wb = $("#wbubble");
  if (cur && wb.dataset.p !== cur) { wb.dataset.p = cur; wb.textContent = t().guide[cur]; wb.classList.remove("on"); void wb.offsetWidth; wb.classList.add("on"); clearTimeout(wb._t); wb._t = setTimeout(() => wb.classList.remove("on"), 3200); }
  if (!cur) { wb.classList.remove("on"); wb.dataset.p = ""; }
  let sec = null;
  ["about", "method", "expedition", "helm", "contact"].forEach(id => { const r = $("#" + id).getBoundingClientRect(); if (r.top < innerHeight * .4) sec = id; });
  if (sec === "expedition" && cur === "frontier") sec = "ph-frontier";
  $$(".nav .links a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + sec));
  sky.scroll = h.scrollTop;
}
addEventListener("scroll", onScroll, { passive: true });

/* ================= starfield (calm, no glow) ================= */
const sky = { scroll: 0 };
(function starfield() {
  const cv = $("#sky"), g = cv.getContext("2d");
  let W, H, stars = [], shoot = null, last = 0;
  const resize = () => {
    const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(W * H / 2600);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 3, z: Math.random() ** 2, tw: Math.random() * 6.28, s: .25 + Math.random() * .9 }));
  };
  const draw = now => {
    g.clearRect(0, 0, W, H);
    const grd = g.createRadialGradient(W * .82, H * .05, 0, W * .82, H * .05, Math.max(W, H) * .7);
    grd.addColorStop(0, "rgba(90,80,170,.18)"); grd.addColorStop(1, "rgba(5,8,21,0)"); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    const grd2 = g.createRadialGradient(W * .05, H * .7, 0, W * .05, H * .7, Math.max(W, H) * .6);
    grd2.addColorStop(0, "rgba(40,100,170,.12)"); grd2.addColorStop(1, "rgba(5,8,21,0)"); g.fillStyle = grd2; g.fillRect(0, 0, W, H);
    for (const s of stars) {
      const sp = .08 + s.z * .35, y = ((s.y - sky.scroll * sp) % (H * 3) + H * 3) % (H * 3);
      if (y > H) continue;
      const a = (.35 + s.z * .65) * (reduce ? 1 : .75 + .25 * Math.sin(now * .001 * s.s + s.tw));
      g.fillStyle = `rgba(230,236,255,${a})`;
      const r = .4 + s.z * 1.1; g.fillRect(s.x, y, r, r);
    }
    if (!reduce) {
      if (!shoot && now - last > 7000 && Math.random() < .01) { shoot = { x: Math.random() * W * .7 + W * .2, y: Math.random() * H * .4, t: 0 }; last = now; }
      if (shoot) {
        shoot.t += 1; const L = 120, k = shoot.t / 50, x = shoot.x - k * 360, y = shoot.y + k * 140;
        const gr = g.createLinearGradient(x, y, x + L, y - L * .39); gr.addColorStop(0, `rgba(255,255,255,${.7 * (1 - k)})`); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.strokeStyle = gr; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L, y - L * .39); g.stroke();
        if (k >= 1) shoot = null;
      }
      requestAnimationFrame(draw);
    }
  };
  addEventListener("resize", () => { resize(); if (reduce) draw(0); });
  resize(); requestAnimationFrame(draw);
  if (reduce) addEventListener("scroll", () => requestAnimationFrame(draw), { passive: true });
})();

/* ================= 30-second brief ================= */
function buildBrief() {
  const T = t();
  const row = id => { const w = byId(id), c = w[lang]; return `<div class="xp">${tile(w)}<span class="when">${redacted(c.period)}</span><div><h3>${esc(c.role)} <span>· ${esc(c.name)}</span></h3><p>${esc(c.lede)}</p></div></div>`; };
  const skills = lang === "fr"
    ? ["Gestion de projet", "Scrum & Kanban", "ITSM / ITIL", "Modélisation de workflows (draw.io, BPMN)", "Conduite du changement", "Jira · ClickUp · Notion", "Prototypage", "React · TypeScript · Python · SQL", "IA générative", "Français (natif)", "Anglais (pro)"]
    : ["Project management", "Scrum & Kanban", "ITSM / ITIL", "Workflow modelling (draw.io, BPMN)", "Change management", "Jira · ClickUp · Notion", "Prototyping", "React · TypeScript · Python · SQL", "Generative AI", "French (native)", "English (professional)"];
  $("#briefBody").innerHTML = `
    <div class="ov-top"><span class="mono small">${esc(T.briefTitle)}</span><button class="btn sm" id="briefClose">${esc(T.close)} ✕</button></div>
    <header class="bhead"><h1>Loick Mian</h1><p class="role">${esc(T.briefRole)}</p><p>${esc(T.briefIntro)}</p>
      <div class="row wrapr"><a class="btn gold sm" href="${T.resumeHref}" target="_blank" rel="noopener">${esc(T.resume)}</a><button class="btn sm copy-email">${esc(T.copy)}</button><a class="btn sm" href="https://www.linkedin.com/in/loick-mian-843382281" target="_blank" rel="noopener">LinkedIn</a><a class="btn sm" href="#contact" data-closebrief>${esc(T.contact)}</a></div></header>
    <div class="bsec"><h2>${esc(T.secXp)}</h2>${["konica", "optimall", "dreamxr", "impact", "socar"].map(row).join("")}</div>
    <div class="bsec"><h2>${esc(T.secBuild)}</h2>${["simuflow", "lbt", "workshop"].map(row).join("")}</div>
    <div class="bsec"><h2>${esc(T.secField)}</h2>${["intermarche", "alyce", "fiveguys"].map(row).join("")}</div>
    <div class="bsec"><h2>${esc(T.secSkills)}</h2><div class="chips">${skills.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>
    <div class="bsec"><h2>${esc(T.secEdu)}</h2><ul class="log">${byId("academy")[lang].log.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
  $("#briefClose").addEventListener("click", closeBrief);
  $$("[data-closebrief]").forEach(a => a.addEventListener("click", closeBrief));
  bindCopy();
}
function openBrief() { buildBrief(); $("#brief").hidden = false; $("#brief").scrollTop = 0; document.body.style.overflow = "hidden"; $("#briefClose").focus(); }
function closeBrief() { $("#brief").hidden = true; document.body.style.overflow = ""; }
$("#briefBtn").addEventListener("click", openBrief);
addEventListener("keydown", e => { if (e.key === "Escape" && !$("#brief").hidden) closeBrief(); });
if (location.hash === "#brief") openBrief();

/* ================= contact & newsletter (Web3Forms) ================= */
async function send(payload, out, okText) {
  out.className = "formmsg"; out.textContent = t().sending;
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, from_name: "Portfolio · The Expedition", ...payload }) });
    const j = await r.json(); if (!j.success) throw new Error(j.message);
    out.className = "formmsg ok"; out.textContent = okText; return true;
  } catch (e) { out.className = "formmsg err"; out.textContent = t().failed; return false; }
}
$("#cform").addEventListener("submit", async e => {
  e.preventDefault(); const f = e.target;
  if (f.botcheck.checked || !f.reportValidity()) return;
  if (await send({ subject: `New message from ${f.name.value} (portfolio)`, name: f.name.value, email: f.email.value, message: f.message.value, newsletter: f.newsletter.checked ? "yes" : "no", language: lang }, $("#cOut"), t().sent)) f.reset();
});
$("#nform").addEventListener("submit", async e => {
  e.preventDefault(); const f = e.target; if (!f.reportValidity()) return;
  if (await send({ subject: "New newsletter subscriber (portfolio)", email: $("#nEmail").value, message: `Newsletter signup: ${$("#nEmail").value} (${lang})` }, $("#nOut"), t().subscribed)) f.reset();
});
function bindCopy() {
  $$(".copy-email").forEach(b => { if (b.dataset.bound) return; b.dataset.bound = 1; b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("loickmian@gmail.com"); b.textContent = t().copied; } catch (e) { b.textContent = "loickmian@gmail.com"; }
    setTimeout(() => b.textContent = t().copy, 2200); }); });
}

/* ================= language ================= */
$$("[data-lang]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); render(); if (!$("#brief").hidden) buildBrief(); say(bubbleI); onScroll(); }));

buildWheel();
render();
onScroll();

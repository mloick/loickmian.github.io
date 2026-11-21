// Loick Mian's portfolio: I introduce myself, you board the ship, then you explore my universe.
// Career data lives in content.js (WORLDS, LINKS). Interface copy lives in X below, written natively in EN and FR.
import { WORLDS, LINKS } from "./content.js";

const WEB3FORMS_KEY = "98a5ced1-d2fd-4c80-ba9a-78023c1d476b";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const redacted = s => esc(s).replace(/\[\[(.*?)\]\]/g, (_, w) => `<span class="redact" title="Redacted">${"█".repeat(w.length)}</span>`);
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const byId = id => WORLDS.find(w => w.id === id);
const idx = id => WORLDS.findIndex(w => w.id === id);

let lang = store.get("lang", (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en");
const qLang = location.search.match(/lang=(en|fr)/); if (qLang) lang = qLang[1];
let galaxy = null, current = -1, tour = false, activeLink = null, launched = false, tab = "explore";
const seen = new Set(store.get("seen", []));

/* ================= copy ================= */
const X = {
  en: {
    resume: "Résumé", welcome: "Welcome to my universe",
    heroTitle: "From an idea to <em>the real thing.</em>",
    heroLead: "I'm Loick Mian, Digital Project Manager & Builder. My job is to solve real problems with solutions people actually use: a clearer process, a tool, an app, an AI workflow. From the first sketch to adoption.",
    board: "Board", boardTitle: "Board the ship", boardHint: "Hold the button. I'll show you around.",
    briefLink: "In a hurry? The 30-second brief",
    bubble: ["Hi, I'm Loick. Welcome to my universe!", "I'll be your guide. Hop in the ship when you're ready.", "Fun fact: I designed and built this whole site.", "Hold the yellow button and we're off.", "Click on me to learn more about me."],
    boarding: "Buckle up!",
    tExplore: "Explore", tAbout: "About", tMethod: "Method", tSkills: "Skills", tImpact: "Impact", tContact: "Contact",
    flightPlan: "Flight plan", home: "Home", backHome: "Back to the home screen", meetMe: "Click me to learn more about me",
    side: { studies: "Student job · alongside my studies", msc: "Student job · alongside my MSc year 1 at YNOV" }, sideGroup: "Student jobs, alongside my studies",
    kpiTitle: "In numbers", goal: "Goal", seeMission: "See the mission",
    triadEy: "Where I work", triadTitle: "Business × Tech × AI. My role sits where they meet.",
    triad: [
      { k: "biz", n: "Business", q: "What's really at stake?", p: "A delay, a cost, a team running out of steam. I frame the need with the people who live it, and we agree on what success looks like.", ex: "Opti-Mall · SOCAR · LBT" },
      { k: "tech", n: "Tech", q: "What's the simplest solution that works?", p: "With a software development background, I write specs developers trust, and I can build the first version myself: web, mobile, back end.", ex: "SimuFlow · IMPACT PLUS · Konica Minolta" },
      { k: "ai", n: "AI", q: "Where does AI remove real work?", p: "I use AI like an engineer: coding agents run with clear specs, curated context, small iterations, review and tests. And I build it into products where it saves time.", ex: "Claude Code · on-device text recognition in SimuFlow" },
      { k: "core", n: "Solutions people use", q: "The overlap is where I work.", p: "A tool only counts once people adopt it. Training, feedback and change management are part of every plan I write.", ex: "85% adoption at IMPACT PLUS" }
    ],
    arrivalKicker: "15 stops · 4 phases", arrivalTitle: "Welcome aboard. Here's my universe.",
    arrivalText: "Each world is a job, a mission or something I built. The guided tour goes from where I started to what I'm building now. The tabs above stay open to you at any time.",
    tour: "Start the guided tour", free: "Explore freely",
    phases: { basecamp: ["Basecamp", "2021 – 2026"], command: ["First commands", "2022 – 2025"], mission: ["Current mission", "2026 – today"], frontier: ["New frontiers", "Now → 2027"] },
    guide: { basecamp: "Where it all started: my studies, with student jobs alongside.", command: "My first projects as a project manager.", mission: "This is where I am today.", frontier: "And this is what I'm building next." },
    guideIdle: "Click a world, drag to turn the galaxy, scroll to zoom. Or let me take you on the tour.",
    next: "Next stop", stop: "Stop", of: "of", end: "That's the tour. Shall we talk?",
    caseL: ["Problem", "What I did", "Result"], log: "The details", skillsHere: "Skills at work here", clear: "Clear",
    status: { done: "Completed", current: "Current role", live: "Live", building: "Ongoing", founder: "Founder", classified: "Classified" },
    decodeHint: "Tap each line to decrypt it.",
    // about
    aboutEy: "About", aboutTitle: "Meet your guide.",
    aboutLede: "I studied software development at EPITECH in Benin, moved to Paris for my MSc at YNOV, and I'm now a work-study ITSM project manager at Konica Minolta.",
    aboutLog: ["I write the specs, and I can build the first working version myself.", "I've led digital projects in consulting, XR, retail and energy, in Benin and in France.", "I've also worked checkouts, kitchens and phone lines. Those jobs taught me more about pressure and customers than any course.", "Alongside, I founded a brand, I ship my own product, and I'm working on something I can't tell you about yet."],
    aboutCard: "Born and raised in Cotonou. Now based in the Paris area.",
    roleBox: "My role: solve problems with solutions people actually use.", roleSub: "Sometimes that's a cleaner process. Sometimes a tool, an app or an AI workflow. Always something the team adopts.",
    principles: [["Start from the field", "Before choosing any tool, I watch how people really work. Supermarket floors and call centres taught me that."], ["Show, don't tell", "A working prototype settles more debates than a slide deck. So I build one early."], ["Bring people along", "A project only succeeds if people make it theirs. Training and feedback are in the plan from day one."]],
    // method
    methodEy: "Method", methodTitle: "How I take an idea all the way to delivery.",
    methodSub: "I don't just tick off a task list. I look for the real problem behind the request, pick the simplest solution that works, and stay until people use it.",
    pillars: [
      { c: "#67e8f9", k: "The field", h: "Understand the real problem", p: "I go where the work happens, listen, and map how things really run before choosing any tool.", ex: "Opti-Mall · Konica Minolta · ALYCE" },
      { c: "#93c5fd", k: "Tech", h: "Build the right solution", p: "With a software development background, I write specs developers trust, and I can build the first version myself: web, mobile, back end.", ex: "SimuFlow · IMPACT PLUS · EPITECH" },
      { c: "#a5b4fc", k: "AI", h: "Use AI like an engineer", p: "Not just a chatbot. I run coding agents with clear specs, curated context, small iterations, review and tests, and I put AI into products where it removes manual work.", ex: "Claude Code · on-device text recognition in SimuFlow" }
    ],
    pipeline: [["Understand", "Go on the ground, listen, map how the work really happens."], ["Frame", "Set the scope, the priorities and the success metrics."], ["Design", "Pick the right tech and AI, write specs people can build from."], ["Prototype", "Show a working version early and test it with real users."], ["Deliver", "Roll out, train, measure, then improve."]],
    // skills
    skillsEy: "Skills", skillsTitle: "Six skills at the helm. The full toolbox below.",
    spoke: "Skill", usedAt: "Where I used it", light: "Light it up in the galaxy",
    matrix: [
      ["#67e8f9", "Project & product", ["Project management", "Scrum & Kanban", "PSPO (Product Owner)", "Roadmaps & planning", "Functional specifications", "Risk & stakeholder management", "Change management & training", "Jira · ClickUp · Notion"]],
      ["#93c5fd", "ITSM & process", ["ITIL practices", "Incident, request & change management", "Workflow modelling (draw.io, BPMN 2.0)", "SLA / OLA", "Process documentation", "Level 2/3 support"]],
      ["#6fe3a8", "Software development", ["HTML · CSS · JavaScript", "TypeScript", "React · React Native · Expo", "Flutter", "Python · Django", "SQL & databases", "Supabase", "REST APIs", "Git"]],
      ["#a5b4fc", "AI engineering", ["Agentic coding (Claude Code)", "Prompt & context engineering", "Spec-driven development with AI", "AI-assisted prototyping", "AI inside products (on-device OCR)"]],
      ["#ff8f6b", "Design & tools", ["Figma", "Wireframes & prototypes", "Product demos"]],
      ["#eef1f8", "Languages", ["French (native)", "English (professional)"]]
    ],
    // impact
    impactEy: "Impact", impactTitle: "Results, in numbers.",
    stats: [["+", "60", "%", "faster case processing after digitising internal processes", "IMPACT PLUS", "impact"], ["~", "100", "%", "of processes digitised, in a few weeks", "Opti-Mall", "optimall"], ["−", "50", "%", "site trips, thanks to remote project management", "Opti-Mall", "optimall"], ["", "85", "%", "adoption of the new tools, 30+ colleagues trained", "IMPACT PLUS", "impact"], ["−", "20", "%", "sprint blockers, 3 teams in one rhythm", "DreamXR", "dreamxr"], ["+", "35", "%", "engagement after the digital marketing rollout", "SOCAR Benin", "socar"], ["", "1", "", "product shipped solo, on iOS, Android and web", "SimuFlow", "simuflow"], ["÷", "2", "", "workflow set-up time: the goal SimuFlow is built for", "Goal", "simuflow"]],
    roadmap: "Roadmap", rmStatus: "Status: <b>on track</b>. Next milestone: a permanent role from October 2027.",
    // contact
    contactEy: "Contact", contactTitle: "Your team could be the next stop.",
    contactSub: "A permanent role from October 2027, a project, a question, or just a hello. Your message lands straight in my inbox.",
    letsBuild: "Let's build", letsLink: "Let's link", formTitle: "Send a message",
    name: "Name", email: "Email", message: "Message", optin: "Also send me the newsletter (a short email when I launch something).",
    send: "Send", sending: "Sending…", sent: "Message received. I'll get back to you soon.", failed: "Sending failed. Write to me directly at loickmian@gmail.com.",
    newsTitle: "Newsletter", newsText: "One short email when I launch something: SimuFlow, LBT, new builds. No spam.", subscribe: "Subscribe", subscribed: "You're on the list.",
    direct: "Direct line", copy: "Copy email", copied: "Copied",
    endLine: "That's my universe so far. Shall we build the next part together?",
    // brief
    briefTitle: "The 30-second brief", briefRole: "Digital Project Manager & Builder · AI & Innovation",
    briefIntro: "Project manager with a software development background. I take projects from framing to adoption, and I can build the prototype myself. ITSM project manager (work-study) at Konica Minolta, MSc student at YNOV Campus Paris, builder of SimuFlow, founder of LBT. Open to permanent roles from October 2027.",
    secXp: "Experience", secBuild: "Builder & founder", secField: "Student jobs, alongside my studies", secSkills: "Key skills", secEdu: "Education & certifications", explore: "Explore the universe",
    briefSkills: ["Project management", "Scrum & Kanban · PSPO", "ITSM / ITIL", "Workflow modelling (draw.io, BPMN)", "Change management", "HTML · CSS · JavaScript · TypeScript", "React · React Native · Flutter", "Python · Django · SQL · Supabase", "AI engineering (Claude Code)", "French (native)", "English (professional)"],
    resumeHref: "assets/cv/Loick_MIAN_Resume_EN.pdf", webgl: "Your browser can't display the 3D universe, so here is the brief."
  },
  fr: {
    resume: "CV", welcome: "Bienvenue dans mon univers",
    heroTitle: "De l'idée à <em>la réalisation.</em>",
    heroLead: "Je suis Loick Mian, chef de projet digital et builder. Mon métier : résoudre de vrais problèmes avec des solutions que les gens utilisent vraiment. Un processus plus clair, un outil, une application, un workflow IA. Du premier croquis jusqu'à l'adoption.",
    board: "Embarquer", boardTitle: "Montez à bord", boardHint: "Maintenez le bouton, je vous fais visiter.",
    briefLink: "Pressé ? Le résumé en 30 secondes",
    bubble: ["Bonjour, moi c'est Loick. Bienvenue dans mon univers !", "Je serai votre guide. Montez à bord quand vous êtes prêt.", "Petit secret : j'ai conçu et codé ce site de A à Z.", "Maintenez le bouton jaune, et c'est parti.", "Cliquez sur moi pour en savoir plus."],
    boarding: "Attachez vos ceintures !",
    tExplore: "Explorer", tAbout: "Profil", tMethod: "Méthode", tSkills: "Compétences", tImpact: "Impact", tContact: "Contact",
    flightPlan: "Plan de vol", home: "Accueil", backHome: "Retour à l'accueil", meetMe: "Cliquez sur moi pour en savoir plus",
    side: { studies: "Job étudiant · en parallèle de mes études", msc: "Job étudiant · en parallèle de mon M1 à YNOV" }, sideGroup: "Jobs étudiants, en parallèle des études",
    kpiTitle: "En chiffres", goal: "Objectif", seeMission: "Voir la mission",
    triadEy: "Mon terrain de jeu", triadTitle: "Business × Tech × IA. Mon rôle se situe à l'intersection.",
    triad: [
      { k: "biz", n: "Business", q: "Quel est le vrai enjeu ?", p: "Un délai, un coût, une équipe qui s'essouffle. Je cadre le besoin avec ceux qui le vivent, et on définit ensemble ce qu'est la réussite.", ex: "Opti-Mall · SOCAR · LBT" },
      { k: "tech", n: "Tech", q: "Quelle est la solution la plus simple qui fonctionne ?", p: "Avec ma formation de développeur, j'écris des specs fiables pour les équipes techniques, et je sais construire la première version moi-même : web, mobile, back-end.", ex: "SimuFlow · IMPACT PLUS · Konica Minolta" },
      { k: "ai", n: "IA", q: "Où l'IA supprime-t-elle du vrai travail ?", p: "J'utilise l'IA en ingénieur : des agents de code pilotés avec des specs claires, un contexte maîtrisé, de petites itérations, de la relecture et des tests. Et je l'intègre aux produits là où elle fait gagner du temps.", ex: "Claude Code · reconnaissance de texte embarquée dans SimuFlow" },
      { k: "core", n: "Des solutions utilisées", q: "C'est à l'intersection que je travaille.", p: "Un outil ne compte que si les gens l'adoptent. Formation, retours et conduite du changement font partie de chaque plan que j'écris.", ex: "85 % d'adoption chez IMPACT PLUS" }
    ],
    arrivalKicker: "15 escales · 4 phases", arrivalTitle: "Bienvenue à bord. Voici mon univers.",
    arrivalText: "Chaque monde est un poste, une mission ou un projet que j'ai construit. La visite guidée part de mes débuts et va jusqu'à ce que je construis aujourd'hui. Les onglets en haut restent accessibles à tout moment.",
    tour: "Lancer la visite guidée", free: "Explorer librement",
    phases: { basecamp: ["Camp de base", "2021 – 2026"], command: ["Premières missions", "2022 – 2025"], mission: ["Mission en cours", "2026 – auj."], frontier: ["Nouveaux horizons", "Auj. → 2027"] },
    guide: { basecamp: "Tout a commencé ici : mes études, avec des jobs étudiants en parallèle.", command: "Mes premiers projets en tant que chef de projet.", mission: "Voici où j'en suis aujourd'hui.", frontier: "Et voici ce que je construis pour la suite." },
    guideIdle: "Cliquez sur un monde, faites glisser pour tourner la galaxie, molette pour zoomer. Ou laissez-moi vous faire la visite.",
    next: "Escale suivante", stop: "Escale", of: "sur", end: "Fin de la visite. On en parle ?",
    caseL: ["Le problème", "Ce que j'ai fait", "Le résultat"], log: "Le détail", skillsHere: "Compétences mobilisées", clear: "Effacer",
    status: { done: "Terminé", current: "Poste actuel", live: "En ligne", building: "En continu", founder: "Fondateur", classified: "Confidentiel" },
    decodeHint: "Touchez chaque ligne pour la déchiffrer.",
    aboutEy: "Profil", aboutTitle: "Votre guide, en quelques mots.",
    aboutLede: "Formé au développement logiciel à EPITECH au Bénin, je suis arrivé à Paris pour mon mastère à YNOV. Aujourd'hui, je suis chef de projet ITSM en alternance chez Konica Minolta.",
    aboutLog: ["J'écris les spécifications, et je sais construire moi-même la première version qui fonctionne.", "J'ai mené des projets digitaux dans le conseil, la XR, le retail et l'énergie, au Bénin comme en France.", "J'ai aussi tenu des caisses, des cuisines et des lignes téléphoniques. Ces jobs m'en ont appris plus sur la pression et le client que bien des cours.", "En parallèle, j'ai fondé une marque, je développe mon propre produit, et je prépare un projet dont je ne peux pas encore parler."],
    aboutCard: "Né et grandi à Cotonou. Installé en Île-de-France.",
    roleBox: "Mon rôle : résoudre des problèmes avec des solutions que les gens utilisent vraiment.", roleSub: "Parfois un processus plus clair, parfois un outil, une application ou un workflow IA. Toujours quelque chose que l'équipe adopte.",
    principles: [["Partir du terrain", "Avant de choisir un outil, j'observe comment les gens travaillent vraiment. Les rayons de supermarché et les centres d'appels me l'ont appris."], ["Montrer plutôt que convaincre", "Un prototype qui fonctionne tranche plus de débats qu'un PowerPoint. Alors j'en construis un tôt."], ["Embarquer les équipes", "Un projet ne réussit que si les gens se l'approprient. La formation et les retours font partie du plan dès le départ."]],
    methodEy: "Méthode", methodTitle: "Comment je mène une idée jusqu'à sa réalisation.",
    methodSub: "Je ne me contente pas d'exécuter une liste de tâches. Je cherche le vrai problème derrière la demande, je choisis la solution la plus simple qui fonctionne, et je reste jusqu'à ce qu'elle soit utilisée.",
    pillars: [
      { c: "#67e8f9", k: "Le terrain", h: "Comprendre le vrai problème", p: "Je vais là où le travail se fait, j'écoute et je cartographie le fonctionnement réel avant de choisir le moindre outil.", ex: "Opti-Mall · Konica Minolta · ALYCE" },
      { c: "#93c5fd", k: "La tech", h: "Construire la bonne solution", p: "Avec ma formation de développeur, j'écris des specs fiables pour les équipes techniques, et je sais construire la première version moi-même : web, mobile, back-end.", ex: "SimuFlow · IMPACT PLUS · EPITECH" },
      { c: "#a5b4fc", k: "L'IA", h: "Utiliser l'IA en ingénieur", p: "Pas seulement un chatbot. Je pilote des agents de code avec des specs claires, un contexte maîtrisé, de petites itérations, de la relecture et des tests, et j'intègre l'IA dans les produits là où elle supprime du travail manuel.", ex: "Claude Code · reconnaissance de texte embarquée dans SimuFlow" }
    ],
    pipeline: [["Comprendre", "Aller sur le terrain, écouter, cartographier le travail réel."], ["Cadrer", "Fixer le périmètre, les priorités et les indicateurs de réussite."], ["Concevoir", "Choisir la tech et l'IA adaptées, rédiger des specs exploitables."], ["Prototyper", "Montrer vite une version qui marche, la tester avec de vrais utilisateurs."], ["Livrer", "Déployer, former, mesurer, puis améliorer."]],
    skillsEy: "Compétences", skillsTitle: "Six compétences à la barre. Et la boîte à outils complète.",
    spoke: "Compétence", usedAt: "Où je l'ai mise en pratique", light: "La voir dans la galaxie",
    matrix: [
      ["#67e8f9", "Gestion de projet & produit", ["Gestion de projet", "Scrum & Kanban", "PSPO (Product Owner)", "Roadmap & planification", "Spécifications fonctionnelles", "Gestion des risques et des parties prenantes", "Conduite du changement & formation", "Jira · ClickUp · Notion"]],
      ["#93c5fd", "ITSM & processus", ["Pratiques ITIL", "Gestion des incidents, demandes et changements", "Modélisation de workflows (draw.io, BPMN 2.0)", "SLA / OLA", "Documentation des processus", "Support N2/N3"]],
      ["#6fe3a8", "Développement logiciel", ["HTML · CSS · JavaScript", "TypeScript", "React · React Native · Expo", "Flutter", "Python · Django", "SQL & bases de données", "Supabase", "API REST", "Git"]],
      ["#a5b4fc", "Ingénierie IA", ["Développement agentique (Claude Code)", "Prompt & context engineering", "Développement piloté par les specs avec l'IA", "Prototypage assisté par IA", "IA intégrée aux produits (OCR embarqué)"]],
      ["#ff8f6b", "Design & outils", ["Figma", "Maquettes & prototypes", "Démos produit"]],
      ["#eef1f8", "Langues", ["Français (langue maternelle)", "Anglais (professionnel)"]]
    ],
    impactEy: "Impact", impactTitle: "Des résultats, chiffrés.",
    stats: [["+", "60", "%", "de rapidité dans le traitement des dossiers, après numérisation des processus", "IMPACT PLUS", "impact"], ["~", "100", "%", "des processus numérisés, en quelques semaines", "Opti-Mall", "optimall"], ["−", "50", "%", "de déplacements sur site grâce au pilotage à distance", "Opti-Mall", "optimall"], ["", "85", "%", "d'adoption des nouveaux outils, plus de 30 collaborateurs formés", "IMPACT PLUS", "impact"], ["−", "20", "%", "de blocages de sprint, 3 équipes au même rythme", "DreamXR", "dreamxr"], ["+", "35", "%", "d'engagement après le déploiement du plan marketing digital", "SOCAR Bénin", "socar"], ["", "1", "", "produit livré en solo, sur iOS, Android et web", "SimuFlow", "simuflow"], ["÷", "2", "", "le temps de mise en place d'un workflow : l'objectif de SimuFlow", "Objectif", "simuflow"]],
    roadmap: "Feuille de route", rmStatus: "Statut : <b>dans les temps</b>. Prochain jalon : un CDI à partir d'octobre 2027.",
    contactEy: "Contact", contactTitle: "Et si votre équipe était la prochaine escale ?",
    contactSub: "Un CDI à partir d'octobre 2027, un projet, une question ou simplement un bonjour : votre message arrive directement dans ma boîte mail.",
    letsBuild: "Construisons ensemble", letsLink: "Échangeons sur LinkedIn", formTitle: "Envoyer un message",
    name: "Nom", email: "E-mail", message: "Message", optin: "Recevoir aussi la newsletter (un e-mail court quand je lance quelque chose).",
    send: "Envoyer", sending: "Envoi…", sent: "Message reçu, je vous réponds rapidement.", failed: "L'envoi a échoué. Écrivez-moi directement à loickmian@gmail.com.",
    newsTitle: "Newsletter", newsText: "Un e-mail court quand je lance quelque chose : SimuFlow, LBT, nouveaux projets. Pas de spam.", subscribe: "M'inscrire", subscribed: "C'est noté, vous êtes inscrit.",
    direct: "En direct", copy: "Copier l'e-mail", copied: "Copié",
    endLine: "Voilà mon univers jusqu'ici. On construit la suite ensemble ?",
    briefTitle: "Le résumé en 30 secondes", briefRole: "Chef de projet digital & builder · IA & innovation",
    briefIntro: "Chef de projet avec une formation de développeur. Je mène un projet du cadrage jusqu'à l'adoption, et je sais construire le prototype moi-même. Chef de projet ITSM en alternance chez Konica Minolta, en mastère à YNOV Campus Paris, créateur de SimuFlow, fondateur de LBT. Disponible en CDI à partir d'octobre 2027.",
    secXp: "Expériences", secBuild: "Projets & entrepreneuriat", secField: "Jobs étudiants, en parallèle des études", secSkills: "Compétences clés", secEdu: "Formation & certifications", explore: "Explorer l'univers",
    briefSkills: ["Gestion de projet", "Scrum & Kanban · PSPO", "ITSM / ITIL", "Modélisation de workflows (draw.io, BPMN)", "Conduite du changement", "HTML · CSS · JavaScript · TypeScript", "React · React Native · Flutter", "Python · Django · SQL · Supabase", "Ingénierie IA (Claude Code)", "Français (langue maternelle)", "Anglais (professionnel)"],
    resumeHref: "assets/cv/Loick_MIAN_CV_FR.pdf", webgl: "Votre navigateur ne peut pas afficher l'univers 3D, voici donc le résumé."
  }
};
const t = () => X[lang];
const PHASES = ["basecamp", "command", "mission", "frontier"];
const RM = { basecamp: [2021, 2026.6], command: [2022.6, 2025.9], mission: [2026.7, 2027.8], frontier: [2026.8, 2027.8] };

/* ================= drawings: me, and the ship ================= */
function astroSVG(p, flag = true) {
  return `<defs><linearGradient id="${p}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1236"/><stop offset=".62" stop-color="#2a2d6b"/><stop offset=".63" stop-color="#67e8f9"/><stop offset="1" stop-color="#0891b2"/></linearGradient>
    <linearGradient id="${p}s" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c9d0e2"/></linearGradient></defs>
    ${flag ? `<line x1="38" y1="26" x2="38" y2="224" stroke="#cfd6e6" stroke-width="3" stroke-linecap="round"/><g class="ex-flag" style="transform-origin:38px 30px"><path d="M37 28 H-12 L-3 42 L-12 56 H37 Z" fill="#67e8f9"/><text x="12" y="47" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-size="14" fill="#04202a">LM</text></g>` : ""}
    <rect x="50" y="84" width="60" height="72" rx="13" fill="#9aa4bf"/>
    <rect x="58" y="158" width="19" height="50" rx="9" fill="url(#${p}s)"/><rect x="83" y="158" width="19" height="50" rx="9" fill="url(#${p}s)"/>
    <rect x="53" y="200" width="27" height="17" rx="7" fill="#5d6888"/><rect x="80" y="200" width="27" height="17" rx="7" fill="#5d6888"/>
    <rect x="52" y="88" width="56" height="84" rx="22" fill="url(#${p}s)"/><rect x="53" y="150" width="54" height="8" fill="#c3cbdd"/>
    <rect x="65" y="110" width="30" height="22" rx="5" fill="#26305a"/>
    <circle cx="72" cy="121" r="2.6" fill="#93c5fd" class="ex-light"/><circle cx="80" cy="121" r="2.6" fill="#67e8f9"/><circle cx="88" cy="121" r="2.6" fill="#6fe3a8" class="ex-light"/>
    <line x1="55" y1="100" x2="42" y2="146" stroke="#e6eaf3" stroke-width="16" stroke-linecap="round"/><circle cx="41" cy="150" r="8.5" fill="#5d6888"/>
    <rect x="60" y="85" width="40" height="9" rx="4.5" fill="#c3cbdd"/>
    <line x1="102" y1="38" x2="110" y2="18" stroke="#c3cbdd" stroke-width="2.5"/><circle class="ex-antenna" cx="110" cy="17" r="3.5" fill="#67e8f9"/>
    <circle cx="80" cy="58" r="32" fill="url(#${p}s)" stroke="#c3cbdd" stroke-width="1.5"/>
    <rect x="56" y="41" width="48" height="36" rx="17" fill="url(#${p}v)"/>
    <ellipse class="ex-glint" cx="68" cy="51" rx="7" ry="3" fill="#fff" opacity=".55" transform="rotate(-24 68 51)"/>
    <g class="ex-arm-wave"><line x1="105" y1="100" x2="126" y2="66" stroke="#e6eaf3" stroke-width="16" stroke-linecap="round"/><circle cx="128" cy="62" r="8.5" fill="#5d6888"/></g>`;
}
function shuttleSVG() {
  return `<defs><linearGradient id="shb" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c3cbdd"/></linearGradient>
    <linearGradient id="shf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecfeff"/><stop offset=".4" stop-color="#67e8f9"/><stop offset="1" stop-color="#e4572e" stop-opacity="0"/></linearGradient></defs>
    <path class="flame" d="M44 176 Q60 250 76 176 Z" fill="url(#shf)"/>
    <path d="M28 150 L8 186 L30 180 Z" fill="#67e8f9"/><path d="M92 150 L112 186 L90 180 Z" fill="#67e8f9"/>
    <path d="M60 8 C 92 40, 96 110, 90 178 L30 178 C 24 110, 28 40, 60 8 Z" fill="url(#shb)"/>
    <path d="M60 8 C 72 20, 80 34, 84 48 L36 48 C 40 34, 48 20, 60 8 Z" fill="#26305a"/>
    <circle cx="60" cy="86" r="15" fill="#26305a" stroke="#c3cbdd" stroke-width="3"/><circle cx="60" cy="86" r="9" fill="#93c5fd" opacity=".6"/>
    <rect x="44" y="120" width="32" height="40" rx="6" fill="none" stroke="#c3cbdd" stroke-width="2"/>
    <text x="60" y="146" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-size="12" fill="#26305a">LM</text>
    <rect x="34" y="176" width="52" height="8" rx="3" fill="#5d6888"/>`;
}

/* ================= logos ================= */
function tile(w) {
  if (w.logo && w.mask) return `<span class="tile" style="background:${w.tile}"><i class="mask" style="-webkit-mask-image:url(assets/logos/${w.logo});mask-image:url(assets/logos/${w.logo})"></i></span>`;
  if (w.logo) return `<span class="tile" style="background:${w.tile || "#fff"}"><img src="assets/logos/${w.logo}" alt="${esc(w.en.name)} logo" loading="lazy"></span>`;
  const m = w.mark.length > 8 ? w.mark.replace(" ", "<br>") : esc(w.mark);
  return `<span class="tile mark" style="--tc:${w.color};font-size:${w.mark.length > 8 ? 9 : w.mark.length > 3 ? 12 : 16}px" aria-hidden="true">${m}</span>`;
}
const logoCache = {};
async function logoURL(w) {
  if (!w.logo) return null;
  if (!w.mask) return "assets/logos/" + w.logo;
  if (logoCache[w.id]) return logoCache[w.id];
  try { const txt = await (await fetch("assets/logos/" + w.logo)).text(); return (logoCache[w.id] = URL.createObjectURL(new Blob([txt.replace("<svg ", `<svg fill="#ffffff" `)], { type: "image/svg+xml" }))); }
  catch (e) { return "assets/logos/" + w.logo; }
}
// A clean, readable sign above each world in 3D (no glow).
async function logoCanvas(w) {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256; const g = cv.getContext("2d");
  const rr = (x, y, ww, hh, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + ww, y, x + ww, y + hh, r); g.arcTo(x + ww, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + ww, y, r); g.closePath(); };
  const W = 400, H = 200, X0 = 56, Y0 = 28;
  rr(X0, Y0, W, H, 34); g.fillStyle = w.logo ? (w.tile || "#ffffff") : "#121a36"; g.fill();
  g.lineWidth = 4; g.strokeStyle = "rgba(255,255,255,.35)"; g.stroke();
  const url = await logoURL(w);
  if (url) {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    try { await img.decode(); } catch (e) { return cv; }
    const iw = img.naturalWidth || 240, ih = img.naturalHeight || 240, s = Math.min((W - 60) / iw, (H - 50) / ih);
    g.drawImage(img, X0 + (W - iw * s) / 2, Y0 + (H - ih * s) / 2, iw * s, ih * s);
    return cv;
  }
  try { await document.fonts.load('800 64px "Archivo"'); } catch (e) {}
  g.fillStyle = w.color; g.textAlign = "center"; g.textBaseline = "middle";
  const fs = w.mark.length > 8 ? 44 : w.mark.length > 4 ? 64 : 92; g.font = `800 ${fs}px Archivo, Arial, sans-serif`;
  g.fillText(w.mark, 256, 130);
  return cv;
}

/* ================= i18n ================= */
function applyLang() {
  const T = t();
  document.documentElement.lang = lang;
  $$("[data-t]").forEach(el => { const v = T[el.dataset.t]; if (typeof v === "string") el.textContent = v; });
  $$("[data-t-html]").forEach(el => { el.innerHTML = T[el.dataset.tHtml]; });
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  $$(".cv").forEach(a => a.href = T.resumeHref);
  ["#astro", "#guideAstro"].forEach(s => $(s).setAttribute("aria-label", T.meetMe));
  $("#nextBtn").textContent = T.next + " →";
  renderPlan(); renderLabels();
  if (current >= 0 && !$("#panel").hidden) renderPanel(current, false);
  if (activeLink) showStory();
  if (!$("#sheet").hidden) openTab(tab, true);
  if (!$("#brief").hidden) buildBrief();
  if (!launched) say(bubbleI);
}
$$("[data-lang]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); }));

/* ================= welcome: I introduce myself ================= */
let bubbleI = 0, typing;
function say(i, txt) {
  const el = $("#bubbleText"); txt = txt || t().bubble[i % t().bubble.length];
  el.dataset.txt = txt;
  clearInterval(typing);
  if (reduce) { el.textContent = txt; return; }
  let k = 0; el.textContent = "";
  typing = setInterval(() => { el.textContent = txt.slice(0, ++k); if (k >= txt.length) clearInterval(typing); }, 24);
}
$("#astro").innerHTML = astroSVG("a");
$("#shuttle").innerHTML = shuttleSVG();
$("#guideAstro").innerHTML = astroSVG("g", false);
function meetMe(el) { if (!el.dataset.hb) { el.dataset.hb = 1; el.addEventListener("animationend", e => { if (e.animationName === "hop") el.classList.remove("hop"); }); } el.classList.remove("hop"); void el.getBoundingClientRect(); el.classList.add("hop"); setTimeout(() => location.hash = "about", reduce ? 0 : 380); }
$("#astro").addEventListener("click", () => meetMe($("#astro")));
$("#astro").addEventListener("pointerenter", () => { if (!launched && $("#bubbleText").dataset.txt !== t().meetMe) say(0, t().meetMe); });
$("#astro").setAttribute("role", "button"); $("#astro").setAttribute("tabindex", "0");
$("#astro").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); meetMe($("#astro")); } });
$("#guideAstro").addEventListener("click", () => meetMe($("#guideAstro")));
$("#guideAstro").addEventListener("pointerenter", () => { if ($("#gbubble").textContent !== t().meetMe || !$("#gbubble").classList.contains("on")) guideSay(t().meetMe); });
$("#guideAstro").setAttribute("role", "button"); $("#guideAstro").setAttribute("tabindex", "0");
$("#guideAstro").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); meetMe($("#guideAstro")); } });
setInterval(() => { if (!launched && document.visibilityState === "visible" && $("#sheet").hidden && $("#brief").hidden) say(++bubbleI); }, 6500);

const RING = 351.9; let holdT0 = 0, holdRaf = 0;
function holdFrame(now) {
  const p = Math.min(1, (now - holdT0) / 1300);
  $("#launchRing").style.strokeDashoffset = RING * (1 - p);
  $("#launchLabel").innerHTML = `<span class="count">${Math.max(1, 3 - Math.floor(p * 3))}</span>`;
  if (p >= 1) return launch();
  holdRaf = requestAnimationFrame(holdFrame);
}
function holdStart(e) { if (launched) return; e.preventDefault(); $("#launchBtn").classList.add("holding"); holdT0 = performance.now(); holdRaf = requestAnimationFrame(holdFrame); }
function holdEnd() { if (launched) return; cancelAnimationFrame(holdRaf); $("#launchBtn").classList.remove("holding"); $("#launchRing").style.strokeDashoffset = RING; $("#launchLabel").textContent = t().board; }
const lb = $("#launchBtn");
lb.addEventListener("pointerdown", holdStart);
["pointerup", "pointerleave", "pointercancel"].forEach(ev => lb.addEventListener(ev, holdEnd));
lb.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch(); } });
lb.addEventListener("contextmenu", e => e.preventDefault());

function flash() { const f = $("#flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); }
function launch() {
  if (launched) return; launched = true; cancelAnimationFrame(holdRaf);
  $("#launchLabel").textContent = "✓";
  say(0, t().boarding);
  const pad = $(".pad"), wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  (async () => {
    pad.classList.add("boarding"); await wait(750);
    pad.classList.add("rumble"); await wait(450);
    pad.classList.add("liftoff"); $("#welcome").classList.add("leave"); await wait(900);
    document.body.classList.remove("welcome"); $("#welcome").hidden = true;
    if (!galaxy) { location.hash = "brief"; return; }
    flash();
    galaxy.intro(() => { showHUD(); $("#arrival").hidden = false; guideSay(t().guideIdle); });
  })();
}
function backHome() {
  ["#sheet", "#brief", "#panel", "#linkStory", "#arrival", "#hud", "#plan", "#planBtn", "#guide"].forEach(s => $(s).hidden = true);
  document.body.classList.remove("sheet-open", "panel-open", "plan-open"); $("#plan").classList.remove("open");
  if (activeLink) { activeLink = null; if (galaxy) galaxy.showLink(null); }
  current = -1; tour = false; launched = false; $("#labels").style.display = "none";
  const pad = $(".pad"); pad.classList.remove("boarding", "rumble", "liftoff");
  $("#welcome").classList.remove("leave"); $("#welcome").hidden = false; document.body.classList.add("welcome");
  holdEnd(); if (galaxy) galaxy.welcome();
  history.replaceState(null, "", location.pathname + location.search);
  bubbleI = 0; say(0); $("#launchBtn").focus({ preventScroll: true });
}
function showHUD() { $("#hud").hidden = false; $("#guide").hidden = false; $("#labels").style.display = ""; if (innerWidth > 1100 && store.get("planOpen", true)) $("#plan").hidden = false; else $("#planBtn").hidden = false; setTabUI("explore"); }
function skipWelcome() { launched = true; document.body.classList.remove("welcome"); $("#welcome").hidden = true; if (galaxy) galaxy.skipIntro(); showHUD(); }

/* ================= guide (mini me, in the corner) ================= */
let guideT;
function guideSay(txt) { const b = $("#gbubble"); b.textContent = txt; b.classList.remove("on"); void b.offsetWidth; b.classList.add("on"); clearTimeout(guideT); guideT = setTimeout(() => b.classList.remove("on"), 5200); }

/* ================= flight plan (by phase) ================= */
function renderPlan() {
  const span = [2021, 2027.8], pct = v => ((v - span[0]) / (span[1] - span[0])) * 100, cur = current >= 0 ? WORLDS[current].phase : null;
  const btn = (w, i) => `<button data-go="${i}" style="--c:${w.color}" class="${seen.has(w.id) ? "seen" : ""}" ${i === current ? 'aria-current="true"' : ""}><i></i>${esc(w[lang].name.split(" · ")[0])}</button>`;
  $("#planList").innerHTML = `<div class="plan-head"><b>${esc(t().flightPlan)}</b><button class="x" id="planClose" aria-label="${esc(t().clear)}">✕</button></div>` + PHASES.map(ph => { const [n, k] = t().phases[ph], [a, b] = RM[ph];
    const main = WORLDS.map((w, i) => w.phase === ph && !w.side ? btn(w, i) : "").join(""), side = WORLDS.map((w, i) => w.phase === ph && w.side ? btn(w, i) : "").join("");
    return `<div class="phase${ph === cur ? " on" : ""}"><h4>${esc(n)}<small>${esc(k)}</small></h4><div class="pbar"><i style="left:${pct(a)}%;width:${pct(b) - pct(a)}%"></i></div>${main}${side ? `<div class="side-group"><span>${esc(t().sideGroup)}</span>${side}</div>` : ""}</div>`; }).join("");
  $$("#planList [data-go]").forEach(b => b.addEventListener("click", () => { go(+b.dataset.go); if (innerWidth <= 1100) closePlan(); }));
  $("#planClose").addEventListener("click", () => { closePlan(); if (innerWidth > 1100) store.set("planOpen", false); });
}
function closePlan() { $("#plan").classList.remove("open"); $("#plan").hidden = true; document.body.classList.remove("plan-open"); if (!$("#hud").hidden) $("#planBtn").hidden = false; }
function openPlan() { const p = $("#plan"); p.hidden = false; p.classList.add("open"); document.body.classList.add("plan-open"); $("#planBtn").hidden = true; if (innerWidth > 1100) store.set("planOpen", true); }
$("#planBtn").addEventListener("click", () => $("#plan").hidden ? openPlan() : closePlan());

/* ================= labels over the 3D worlds ================= */
let labelEls = [];
function renderLabels() {
  const box = $("#labels"); box.innerHTML = "";
  labelEls = WORLDS.map((w, i) => { const b = document.createElement("button"); b.className = "wlabel"; b.innerHTML = `${esc(w[lang].name.split(" · ")[0])}<small>${esc(w[lang].role.split(" · ")[0])}</small>`; b.addEventListener("click", () => go(i)); box.appendChild(b); return b; });
}
function placeLabels() {
  if (!galaxy || $("#hud").hidden || !$("#sheet").hidden) { $("#labels").style.display = "none"; return; }
  $("#labels").style.display = "";
  const mobileFocus = innerWidth <= 760 && current >= 0 && !$("#panel").hidden, placed = [];
  const covers = ["#plan", "#panel", "#arrival", "#linkStory"].map(s => $(s)).filter(e => !e.hidden).map(e => e.getBoundingClientRect()).filter(r => r.width);
  const order = WORLDS.map((_, i) => i).sort((a, b) => (b === current) - (a === current) || b - a);
  order.forEach(i => {
    const el = labelEls[i], p = galaxy.project(i);
    let show = p.visible && p.x > -50 && p.x < innerWidth + 50 && p.y > 70 && p.y < innerHeight && !(mobileFocus && i !== current);
    if (show && covers.some(r => p.x > r.left - 70 && p.x < r.right + 70 && p.y > r.top - 40 && p.y < r.bottom)) show = false;
    if (show) { const bx = { x: p.x - 60, y: p.y }; if (placed.some(b => Math.abs(b.x - bx.x) < 120 && Math.abs(b.y - bx.y) < 34)) show = false; else placed.push(bx); }
    el.style.display = show ? "" : "none";
    if (show) { el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, 0)`; el.style.opacity = current >= 0 && i !== current ? .45 : 1; }
    el.classList.toggle("on", i === current);
    el.classList.toggle("lit", !!activeLink && activeLink.worlds.includes(WORLDS[i].id));
    el.classList.toggle("dim", !!activeLink && !activeLink.worlds.includes(WORLDS[i].id));
  });
}

/* ================= world panel ================= */
function renderPanel(i, animate = true) {
  const w = WORLDS[i], c = w[lang], T = t();
  const linksHere = LINKS.filter(l => l.worlds.includes(w.id));
  $("#pbody").innerHTML = `
    <div class="phead">${tile(w)}<div class="pmeta"><span class="chip ${w.status}">${esc(T.status[w.status])}</span><span class="mono">${esc(T.phases[w.phase][0])}</span></div></div>
    <h2 class="ptitle">${esc(c.name)}</h2><p class="prole">${esc(c.role)}</p>
    <span class="pwhen">${redacted(c.period)} · ${esc(c.place)}</span>
    ${w.side ? `<p class="sidejob"><i>∥</i>${esc(T.side[w.side])}</p>` : ""}
    ${w.wordmark ? `<img class="wordmark" src="assets/logos/${w.wordmark}" alt="LBT, la boutique tech">` : ""}
    <p class="plede">${esc(c.lede)}</p>
    ${w.kpi ? `<div class="kpis" aria-label="${esc(T.kpiTitle)}">${w.kpi.map(k => `<div class="kpi${k[5] ? " goal" : ""}"><b>${k[0] ? `<small>${k[0]}</small>` : ""}<span class="n" data-n="${k[1]}">${k[1]}</span><sup>${k[2]}</sup></b><span>${esc(lang === "fr" ? k[4] : k[3])}</span>${k[5] ? `<em>${esc(T.goal)}</em>` : ""}</div>`).join("")}</div>` : ""}
    ${c.case ? `<div class="case">${c.case.map((v, k) => `<div class="cs${k}"><b>${esc(T.caseL[k])}</b><p>${esc(v)}</p></div>`).join("")}</div>` : ""}
    ${c.cipher ? `<span class="mono">${esc(T.decodeHint)}</span><ul class="cipher">${c.cipher.map((l, k) => `<li tabindex="0" data-k="${k}">${"▒".repeat(Math.min(40, l.length))}</li>`).join("")}</ul>`
      : `<details class="log"${c.case ? "" : " open"}><summary>${esc(T.log)}</summary><ul class="plog">${c.log.map(l => `<li>${esc(l)}</li>`).join("")}</ul></details>`}
    ${w.gallery ? `<div class="gallery">${w.gallery.map(g => `<img src="${g}" alt="SimuFlow screen" loading="lazy">`).join("")}</div>` : ""}
    ${w.links ? `<div class="plinks">${w.links.map((l, k) => `<a class="btn sm ${k ? "" : "primary"}" href="${l.href}" target="_blank" rel="noopener">${esc(l[lang])} ↗</a>`).join("")}</div>` : ""}
    ${w.stack ? `<div class="stack">${w.stack.map(s => `<span><img src="assets/logos/${s}.svg" alt="">${s}</span>`).join("")}</div>` : ""}
    <p class="lesson">${esc(c.proves)}</p>
    ${linksHere.length ? `<span class="mono">${esc(T.skillsHere)}</span><div class="tags">${linksHere.map(l => `<button class="tag" data-link="${l.id}">${esc(l[lang].name)}</button>`).join("")}</div>` : ""}`;
  $("#pbody").scrollTop = 0;
  if (animate) { const p = $("#panel"); p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap"); $$("#pbody .kpi .n").forEach(countUp); }
  $("#stopN").textContent = `${T.stop} ${i + 1} ${T.of} ${WORLDS.length}`;
  $("#prevBtn").disabled = i === 0;
  $("#nextBtn").textContent = i === WORLDS.length - 1 ? `${T.tContact} →` : `${T.next} →`;
  $$("#pbody [data-link]").forEach(b => b.addEventListener("click", () => setLink(b.dataset.link)));
  if (c.cipher) $$("#pbody .cipher li").forEach(li => {
    const open = () => { if (li.classList.contains("done")) return; li.classList.add("done"); const src = c.cipher[+li.dataset.k], plain = src.replace(/\[\[(.*?)\]\]/g, "$1"), G = "▒░▓#%&*+=";
      if (reduce) { li.innerHTML = redacted(src); return; }
      const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 700); li.textContent = [...plain].map((ch, q) => ch === " " || q / plain.length < k ? ch : G[(Math.random() * G.length) | 0]).join(""); if (k < 1) requestAnimationFrame(step); else li.innerHTML = redacted(src); }; requestAnimationFrame(step); };
    li.addEventListener("click", open); li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}
function go(i) {
  if (i < 0 || i >= WORLDS.length) return;
  if (!$("#sheet").hidden) closeSheet(true);
  $("#arrival").hidden = true; $("#linkStory").hidden = true;
  const prevPhase = current >= 0 ? WORLDS[current].phase : null;
  current = i; seen.add(WORLDS[i].id); store.set("seen", [...seen]);
  if (galaxy) galaxy.focus(i);
  renderPanel(i, true); $("#panel").hidden = false; document.body.classList.add("panel-open");
  renderPlan();
  const ph = WORLDS[i].phase;
  if (ph !== prevPhase) guideSay(t().guide[ph]);
  history.replaceState(null, "", "#w-" + WORLDS[i].id);
}
function closePanel() { $("#panel").hidden = true; document.body.classList.remove("panel-open"); current = -1; tour = false; if (galaxy) galaxy.overview(); renderPlan(); history.replaceState(null, "", "#explore"); }
$("#pclose").addEventListener("click", closePanel);
$("#nextBtn").addEventListener("click", () => current >= WORLDS.length - 1 ? (location.hash = "contact") : go(current + 1));
$("#prevBtn").addEventListener("click", () => go(current - 1));
$("#tourBtn").addEventListener("click", () => { tour = true; go(0); });
$("#freeBtn").addEventListener("click", () => { $("#arrival").hidden = true; guideSay(t().guideIdle); });
$("#home").addEventListener("click", backHome); $("#homeBtn").addEventListener("click", backHome);

/* ================= skill links lit in the galaxy ================= */
function showStory() {
  const l = activeLink, s = $("#linkStory");
  s.innerHTML = `<button class="x" data-clear aria-label="${esc(t().clear)}">✕</button><span class="mono">${l.worlds.length} ${lang === "fr" ? "mondes reliés" : "linked worlds"}</span><h4>${esc(l[lang].name)}</h4><p>${esc(l[lang].text)}</p><div class="tags">${l.worlds.map(id => `<button class="tag" data-go="${idx(id)}">${esc(byId(id)[lang].name.split(" · ")[0])}</button>`).join("")}</div>`;
  s.hidden = false;
  $$("#linkStory [data-go]").forEach(b => b.addEventListener("click", () => { $("#linkStory").hidden = true; go(+b.dataset.go); }));
  $("#linkStory [data-clear]").addEventListener("click", () => setLink(null));
}
function setLink(id) {
  const l = LINKS.find(x => x.id === id);
  activeLink = (!l || (activeLink && activeLink.id === id)) ? null : l;
  if (galaxy) galaxy.showLink(activeLink ? activeLink.worlds : null);
  if (activeLink) { $("#panel").hidden = true; document.body.classList.remove("panel-open"); current = -1; if (galaxy) galaxy.overview(); $("#arrival").hidden = true; showStory(); }
  else $("#linkStory").hidden = true;
}

/* ================= tabs (sheets over the galaxy) ================= */
function setTabUI(name) { tab = name; $$("#tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.tab === name)); $$("#tabs a").forEach(a => { if (a.dataset.tab === name) a.setAttribute("aria-current", "page"); }); }
function eyebrow(n, label) { return `<p class="eyebrow"><b>0${n}</b>${esc(label)}</p>`; }
const SHEETS = {
  about() { const T = t(); return `${eyebrow(1, T.aboutEy)}<h2>${esc(T.aboutTitle)}</h2>
    <div class="grid2"><div class="card">
      <svg class="route-map" viewBox="0 0 360 220" aria-hidden="true"><defs><linearGradient id="arcG" x1="0" x2="1"><stop offset="0" stop-color="#67e8f9"/><stop offset="1" stop-color="#93c5fd"/></linearGradient></defs>
        <path id="arcPath" d="M60 176 C 120 30, 250 20, 300 60" fill="none" stroke="url(#arcG)" stroke-width="2" stroke-dasharray="4 6"/>
        <circle cx="60" cy="176" r="6" fill="#67e8f9"/><circle cx="300" cy="60" r="6" fill="#93c5fd"/>
        <circle r="4" fill="#fff"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#arcPath"/></animateMotion></circle>
        <text x="60" y="204" text-anchor="middle">COTONOU</text><text x="300" y="36" text-anchor="middle">PARIS</text></svg>
      <div class="coords"><span>6.37°N 2.43°E</span><span>→</span><span>48.86°N 2.35°E</span></div><p>${esc(T.aboutCard)}</p></div>
      <div><p class="big">${esc(T.aboutLede)}</p><ul class="blist">${T.aboutLog.map(l => `<li>${esc(l)}</li>`).join("")}</ul></div></div>
    <div class="role-box"><p>${esc(T.roleBox)}</p><span>${esc(T.roleSub)}</span></div>
    <div class="three">${T.principles.map((p, i) => `<div class="card"><span class="n">0${i + 1}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>`).join("")}</div>`; },
  method() { const T = t(); return `${eyebrow(2, T.methodEy)}<h2>${esc(T.methodTitle)}</h2><p class="sub">${esc(T.methodSub)}</p>
    <p class="mono triad-k">${esc(T.triadTitle)}</p>
    <div class="triad-wrap"><div class="triad" id="triad">${triadSVG()}</div><div id="triadInfo"></div></div>
    <ol class="pipeline">${T.pipeline.map((p, i) => `<li><span class="pn">${i + 1}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></li>`).join("")}</ol>`; },
  skills() { const T = t(); return `${eyebrow(3, T.skillsEy)}<h2>${esc(T.skillsTitle)}</h2>
    <div class="helm-grid"><div class="wheel-box"><svg class="wheel" id="wheel" viewBox="-160 -160 320 320" role="img" aria-label="Skills wheel"></svg><div class="pointer"></div></div>
      <div><div class="skill-tabs" role="tablist">${LINKS.map((l, i) => `<button role="tab" data-skill="${i}" aria-selected="${i === skill}">${esc(l[lang].name)}</button>`).join("")}</div><div class="card skill-card" id="skillCard"></div></div></div>
    <div class="matrix">${T.matrix.map(([c, n, items]) => `<div class="card" style="--c:${c}"><h3><i></i>${esc(n)}</h3><div class="chips">${items.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>`).join("")}</div>`; },
  impact() { const T = t(), span = [2021, 2027.8], pct = v => ((v - span[0]) / (span[1] - span[0])) * 100; return `${eyebrow(4, T.impactEy)}<h2>${esc(T.impactTitle)}</h2>
    <div class="stat-grid">${T.stats.map(s => `<button class="stat" data-go="${s[5]}"><b>${s[0] ? `<small>${s[0]}</small>` : ""}<span class="n" data-n="${s[1]}" style="display:inline;margin:0;font:inherit;color:inherit">${s[1]}</span><sup>${s[2]}</sup></b><span>${esc(s[3])}</span><em>${esc(s[4])} <i>${esc(T.seeMission)} →</i></em></button>`).join("")}</div>
    <div class="card roadmap"><h3>${esc(T.roadmap)}</h3><div class="rm" style="margin-top:14px">${PHASES.map(ph => { const [a, b] = RM[ph]; return `<span>${esc(T.phases[ph][0])}</span><div class="bar"><i style="left:${pct(a)}%;width:${pct(b) - pct(a)}%"></i></div>`; }).join("")}</div>
      <div class="rm-axis"><span>2021</span><span>2023</span><span>2025</span><span>2027</span></div><p class="rm-status">${T.rmStatus}</p></div>`; },
  contact() { const T = t(); return `<div class="contact-head"><div>${eyebrow(5, T.contactEy)}<h2>${esc(T.contactTitle)}</h2><p class="sub">${esc(T.contactSub)}</p>
      <div class="row" style="margin-top:22px"><button class="btn primary" id="toForm">${esc(T.letsBuild)}</button><a class="btn" href="https://www.linkedin.com/in/loick-mian-843382281" target="_blank" rel="noopener">${esc(T.letsLink)} ↗</a></div></div>
      <div class="endguide" aria-hidden="true"><div class="bubble on">${esc(T.endLine)}</div><svg class="astro" viewBox="0 0 160 230">${astroSVG("e")}</svg></div></div>
    <div class="contact-grid"><form class="card cform" id="cform" novalidate><h3>${esc(T.formTitle)}</h3>
        <div class="field"><label for="cName">${esc(T.name)}</label><input id="cName" name="name" autocomplete="name" required></div>
        <div class="field"><label for="cEmail">${esc(T.email)}</label><input id="cEmail" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="cMsg">${esc(T.message)}</label><textarea id="cMsg" name="message" required></textarea></div>
        <label class="check"><input type="checkbox" name="newsletter"><span>${esc(T.optin)}</span></label>
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn gold" type="submit">${esc(T.send)}</button><p class="formmsg" id="cOut" role="status"></p></form>
      <div class="cside"><form class="card" id="nform" novalidate><h3>${esc(T.newsTitle)}</h3><p>${esc(T.newsText)}</p><div class="nrow"><input id="nEmail" type="email" autocomplete="email" required aria-label="${esc(T.email)}" placeholder="you@company.com"><button class="btn gold" type="submit">${esc(T.subscribe)}</button></div><p class="formmsg" id="nOut" role="status"></p></form>
        <div class="card direct"><span class="mono">${esc(T.direct)}</span><code>loickmian@gmail.com</code><div class="row"><button class="btn sm copy-email">${esc(T.copy)}</button><a class="btn sm" href="https://www.linkedin.com/in/loick-mian-843382281" target="_blank" rel="noopener">LinkedIn</a><a class="btn sm" href="https://github.com/mloick" target="_blank" rel="noopener">GitHub</a></div></div></div></div>`; }
};
/* business × tech × AI: three circles, my role in the middle */
function triadSVG() { const T = t(); return `<svg viewBox="0 0 360 330" role="img" aria-label="${esc(T.triad.map(x => x.n).join(" × "))}">
  <circle class="tc biz" data-k="biz" cx="180" cy="112" r="92"/><circle class="tc tech" data-k="tech" cx="122" cy="212" r="92"/><circle class="tc ai" data-k="ai" cx="238" cy="212" r="92"/>
  <circle class="tc core" data-k="core" cx="180" cy="180" r="30"/>
  <text x="180" y="60" class="tl">${esc(T.triad[0].n)}</text><text x="86" y="252" class="tl">${esc(T.triad[1].n)}</text><text x="274" y="252" class="tl">${esc(T.triad[2].n)}</text>
  <text x="180" y="185" class="tl core-t">LM</text></svg>`; }
let triadK = "core", triadTouched = false;
function showTriad(k) {
  if (!$("#triadInfo")) return; triadK = k; const T = t(), d = T.triad.find(x => x.k === k);
  $$("#triad .tc").forEach(c => c.classList.toggle("on", c.dataset.k === k));
  $("#triadInfo").innerHTML = `<div class="ti ${k}"><span class="mono">${esc(d.n)}</span><h3>${esc(d.q)}</h3><p>${esc(d.p)}</p><p class="ex">${esc(d.ex)}</p></div>
    <div class="ti-tabs">${T.triad.map(x => `<button data-tk="${x.k}" aria-pressed="${x.k === k}">${esc(x.n)}</button>`).join("")}</div>`;
  $$("#triadInfo [data-tk]").forEach(b => b.addEventListener("click", () => { triadTouched = true; showTriad(b.dataset.tk); }));
}
setInterval(() => { if (!triadTouched && !reduce && tab === "method" && !$("#sheet").hidden) { const ks = ["biz", "tech", "ai", "core"]; showTriad(ks[(ks.indexOf(triadK) + 1) % 4]); } }, 4200);
function openTab(name, silent) {
  if (name === "explore" || !SHEETS[name]) { closeSheet(); return; }
  $("#arrival").hidden = true;
  $("#sheetBody").innerHTML = SHEETS[name]();
  $("#sheet").hidden = false; document.body.classList.add("sheet-open");
  if (!silent) $("#sheet .sheet-in").scrollTop = 0;
  setTabUI(name);
  if (name === "skills") { buildWheel(); showSkill(skill, true); $$("#sheetBody [data-skill]").forEach(b => b.addEventListener("click", () => { helmTouched = true; showSkill(+b.dataset.skill); })); }
  if (name === "impact") { $$("#sheetBody .stat .n").forEach(countUp); $$("#sheetBody .stat[data-go]").forEach(b => b.addEventListener("click", () => { if (!launched) skipWelcome(); go(idx(b.dataset.go)); })); }
  if (name === "method") { showTriad(triadK); $$("#triad .tc").forEach(c => { c.addEventListener("click", () => { triadTouched = true; showTriad(c.dataset.k); }); c.addEventListener("mouseenter", () => { if (matchMedia("(hover:hover)").matches) { triadTouched = true; showTriad(c.dataset.k); } }); }); }
  if (name === "contact") bindForms();
  bindCopy();
}
function closeSheet(keepHash) { $("#sheet").hidden = true; document.body.classList.remove("sheet-open"); setTabUI("explore");
  if (!launched) { history.replaceState(null, "", location.pathname + location.search); return; }
  if (!keepHash && location.hash && !location.hash.startsWith("#w-") && location.hash !== "#explore") history.replaceState(null, "", "#explore"); }
$("#sheetClose").addEventListener("click", () => { closeSheet(); });
function countUp(el) {
  const n = +el.dataset.n; if (reduce || n < 3) return;
  const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

/* the helm: six skills on a ship's wheel */
let skill = 0, turned = 0, helmTouched = false;
function buildWheel() {
  const spokes = LINKS.map((l, i) => { const a = i * Math.PI / 3, x = Math.sin(a), y = -Math.cos(a);
    return `<g class="spoke" data-skill="${i}"><line x1="${x * 30}" y1="${y * 30}" x2="${x * 124}" y2="${y * 124}" stroke="#2c3768" stroke-width="9" stroke-linecap="round"/><circle class="hd" cx="${x * 138}" cy="${y * 138}" r="18"/><text class="num" x="${x * 138}" y="${y * 138 + 4.5}" text-anchor="middle" style="transform-box:fill-box;transform-origin:center">0${i + 1}</text></g>`; }).join("");
  const ticks = Array.from({ length: 36 }, (_, i) => { const a = i * Math.PI / 18; return `<line x1="${Math.sin(a) * 100}" y1="${-Math.cos(a) * 100}" x2="${Math.sin(a) * 106}" y2="${-Math.cos(a) * 106}" stroke="rgba(103,232,249,.35)"/>`; }).join("");
  $("#wheel").innerHTML = `<g class="rot" id="wheelRot" style="transform:rotate(${-turned * 60}deg)"><circle r="112" fill="none" stroke="#2c3768" stroke-width="14"/><circle r="112" fill="none" stroke="rgba(103,232,249,.5)"/>${ticks}${spokes}<circle r="34" fill="#0d1330" stroke="#67e8f9" stroke-width="1.5"/><text id="hubTxt" y="5" text-anchor="middle" font-family="Archivo,Arial" font-size="15" font-weight="800" fill="#67e8f9" style="transform-box:fill-box;transform-origin:center">LM</text></g>`;
  $$("#wheel .spoke").forEach(g => g.addEventListener("click", () => { helmTouched = true; showSkill(+g.dataset.skill); }));
}
function showSkill(i, silent) {
  if (!$("#wheel")) return;
  let d = ((i - skill) % 6 + 6) % 6; if (d > 3) d -= 6; turned += d; skill = i;
  const rot = -turned * 60;
  $("#wheelRot").style.transform = `rotate(${rot}deg)`;
  $$("#wheel .num, #hubTxt").forEach(n => n.style.transform = `rotate(${-rot}deg)`);
  $$("#wheel .spoke").forEach(g => g.classList.toggle("on", +g.dataset.skill === i));
  $$("#sheetBody [role=tab]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.skill === i)));
  const L = LINKS[i], T = t();
  $("#skillCard").innerHTML = `<span class="mono">${esc(T.spoke)} 0${i + 1} / 06</span><h3>${esc(L[lang].name)}</h3><p>${esc(L[lang].text)}</p>
    <p class="mono" style="margin-top:18px">${esc(T.usedAt)}</p><div class="where">${L.worlds.map(id => `<button data-go="${idx(id)}">${tile(byId(id))}${esc(byId(id)[lang].name.split(" · ")[0])}</button>`).join("")}</div>
    <button class="btn sm gold" style="margin-top:18px" id="lightBtn">${esc(T.light)} ✦</button>`;
  $$("#skillCard [data-go]").forEach(b => b.addEventListener("click", () => go(+b.dataset.go)));
  $("#lightBtn").addEventListener("click", () => { closeSheet(); setLink(L.id); });
  if (!silent) { const c = $("#skillCard"); c.style.animation = "none"; void c.offsetWidth; c.style.animation = "swap .45s"; }
}
setInterval(() => { if (!helmTouched && !reduce && tab === "skills" && !$("#sheet").hidden) showSkill((skill + 1) % 6); }, 5000);

/* ================= 30-second brief ================= */
function buildBrief() {
  const T = t();
  const row = id => { const w = byId(id), c = w[lang]; return `<div class="xp">${tile(w)}<span class="when">${redacted(c.period)}</span><div><h4>${esc(c.role)} <span>· ${esc(c.name)}</span></h4><p>${esc(c.case ? c.case[2] : c.lede)}</p></div></div>`; };
  $("#briefBody").innerHTML = `<p class="eyebrow"><b>30s</b>${esc(T.briefTitle)}</p>
    <p class="mono" id="webglNote" hidden style="margin-bottom:14px">${esc(T.webgl)}</p>
    <header class="bhead"><h2>Loick Mian</h2><p class="role">${esc(T.briefRole)}</p><p>${esc(T.briefIntro)}</p>
      <div class="row" style="margin-top:16px"><a class="btn gold sm" href="${T.resumeHref}" target="_blank" rel="noopener">${esc(T.resume)} (PDF)</a><button class="btn sm copy-email">${esc(T.copy)}</button><a class="btn sm" href="https://www.linkedin.com/in/loick-mian-843382281" target="_blank" rel="noopener">LinkedIn</a><a class="btn sm" href="#contact">${esc(T.tContact)}</a>${launched ? "" : `<a class="btn sm primary" href="#explore">${esc(T.explore)}</a>`}</div></header>
    <div class="bsec"><h3>${esc(T.secXp)}</h3>${["konica", "optimall", "dreamxr", "impact", "socar"].map(row).join("")}</div>
    <div class="bsec"><h3>${esc(T.secBuild)}</h3>${["simuflow", "lbt", "workshop"].map(row).join("")}</div>
    <div class="bsec"><h3>${esc(T.secField)}</h3>${["intermarche", "alyce", "fiveguys"].map(row).join("")}</div>
    <div class="bsec"><h3>${esc(T.secSkills)}</h3><div class="chips">${T.briefSkills.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>
    <div class="bsec"><h3>${esc(T.secEdu)}</h3><ul class="blist">${byId("academy")[lang].log.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
  bindCopy();
}
$("#briefClose").addEventListener("click", () => { $("#brief").hidden = true; document.body.classList.remove("brief-open"); history.replaceState(null, "", launched ? "#explore" : location.pathname + location.search); });

/* ================= contact & newsletter (Web3Forms) ================= */
async function send(payload, out, okText) {
  out.className = "formmsg"; out.textContent = t().sending;
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, from_name: "Portfolio · Loick Mian", ...payload }) });
    const j = await r.json(); if (!j.success) throw new Error(j.message);
    out.className = "formmsg ok"; out.textContent = okText; return true;
  } catch (e) { out.className = "formmsg err"; out.textContent = t().failed; return false; }
}
function bindForms() {
  $("#toForm").addEventListener("click", () => { $("#cName").focus(); $("#cform").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); });
  $("#cform").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target; if (f.botcheck.checked || !f.reportValidity()) return;
    if (await send({ subject: `New message from ${f.name.value} (portfolio)`, name: f.name.value, email: f.email.value, message: f.message.value, newsletter: f.newsletter.checked ? "yes" : "no", language: lang }, $("#cOut"), t().sent)) f.reset();
  });
  $("#nform").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target; if (!f.reportValidity()) return;
    if (await send({ subject: "New newsletter subscriber (portfolio)", email: $("#nEmail").value, message: `Newsletter signup: ${$("#nEmail").value} (${lang})` }, $("#nOut"), t().subscribed)) f.reset();
  });
}
function bindCopy() {
  $$(".copy-email").forEach(b => { if (b.dataset.bound) return; b.dataset.bound = 1; b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("loickmian@gmail.com"); b.textContent = t().copied; } catch (e) { b.textContent = "loickmian@gmail.com"; }
    setTimeout(() => b.textContent = t().copy, 2200); }); });
}

/* ================= routing ================= */
function route() {
  const h = location.hash.slice(1);
  if (h === "brief") { buildBrief(); if (!$("#sheet").hidden) closeSheet(true); document.body.classList.add("brief-open"); $("#brief").hidden = false; $("#brief .sheet-in").scrollTop = 0; if (!galaxy) $("#webglNote").hidden = false; return; }
  $("#brief").hidden = true; document.body.classList.remove("brief-open");
  if (!h) return;
  if (SHEETS[h]) return openTab(h);
  if (!launched) skipWelcome();
  if (h === "explore") return closeSheet(true);
  if (h.startsWith("w-")) { const i = WORLDS.findIndex(w => "w-" + w.id === h); if (i >= 0 && i !== current) go(i); }
}
addEventListener("hashchange", route);
addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "Escape") { if (!$("#brief").hidden) $("#briefClose").click(); else if (!$("#sheet").hidden) closeSheet(); else if (!$("#panel").hidden) closePanel(); else if (activeLink) setLink(null); }
  if (!$("#panel").hidden && $("#sheet").hidden && current >= 0) { if (e.key === "ArrowRight") $("#nextBtn").click(); if (e.key === "ArrowLeft" && current > 0) go(current - 1); }
});
addEventListener("pointermove", e => galaxy && galaxy.setMouse(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
$("#gl").addEventListener("click", e => { if (!galaxy || $("#hud").hidden || !$("#sheet").hidden || galaxy.dragged()) return; const i = galaxy.pick(e.clientX, e.clientY); if (i >= 0) go(i); });
addEventListener("resize", () => galaxy && galaxy.resize());
/* a faint star trail behind the cursor */
if (!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  let lastT = 0, n = 0;
  addEventListener("pointermove", e => {
    const now = performance.now(); if (now - lastT < 34) return; lastT = now;
    const d = document.createElement("i"); d.className = "trail" + (++n % 3 ? "" : " b");
    d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px";
    d.addEventListener("animationend", () => d.parentNode && d.parentNode.removeChild(d)); document.body.appendChild(d);
  }, { passive: true });
}

/* ================= boot ================= */
async function boot() {
  document.body.classList.add("welcome");
  applyLang(); say(0);
  try {
    const { createGalaxy } = await import("./scene.js");
    galaxy = createGalaxy($("#gl"), WORLDS, { reduce, calm: true, maxDt: location.search.includes("test") ? .5 : .05, logoCanvas, onFrame: placeLabels, onWarp: flash });
  } catch (e) { console.error(e); galaxy = null; }
  if (location.hash) route();
}
boot();

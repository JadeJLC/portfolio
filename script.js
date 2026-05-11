// 1. Initialize Lucide icons
lucide.createIcons();

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("open");
}

// --- Persistence Keys ---
const LANG_STORAGE_KEY = "userLang";
const DOMAIN_STORAGE_KEY = "userDomain";

// --- Functions to get and set values ---

/** Reads a value from localStorage */
function getPreference(key, defaultValue) {
  const value = localStorage.getItem(key);
  return value !== null ? value : defaultValue;
}

/** Writes a value to localStorage */
function setPreference(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Reads a specific URL parameter.
 * @param {string} name - The name of the parameter (e.g., 'lang').
 * @returns {string|null} The value of the parameter or null if not found.
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// --- TRANSLATION DATA ---
// Contains all translatable strings. Dynamic titles and intros are prefixed with their section.
const translations = {
  en: {
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_contact: "Contact",

    domain_dev: "Developer",
    domain_trad: "Translator",
    domain_write: "Writer",

    about_hi: "Hi, I'm",
    cta_intouch: "Get in touch",
    cta_cv: "View Resume",
    cta_email: "Send Me An Email",
    contact_title: "Ready to collaborate?",
    contact_intro:
      "I'm always open to new opportunities and exciting projects. Let's build something amazing together.",

    // ------ Link Titles
    link_wip: "Work in Progress",
    link_github: "View on GitHub",
    link_website: "Access the site",
    link_demo: "Watch Video Demo",
    link_manager: "Project Manager : %s",
    link_nda: "Client and game name NDA protected",

    // ------ About
    dev_about_subtitle:
      "I build accessible, engaging and effective websites and apps as a <span class='accent-text-bold'>Full-Stack Developer.</span>",
    dev_about_description:
      "Specialized in Go, HTML, CSS and Javascript and always eager to discover and learn new technologies, I can make ideas come to life through functional and user-friendly projects.",
    trad_about_subtitle:
      "I make your stories, worlds and interfaces accessible to new audiences as a <span class='accent-text-bold'>Localization specialist.</span>",
    trad_about_description:
      "Specialized in video games and literary fiction, I make your characters shine just as bright in French as they do in original English, with tone, context and even puns.",
    write_about_subtitle:
      "I build worlds, characters and stories for you to immerse yourself into as a <span class='accent-text-bold'>Fantasy writer.</span>",
    write_about_description:
      "Let me take you on a journey through a new fantasy world, carefully crafted and full of emotions and characters that you will love, hate or love to hate.",

    // ------ Compétences et descriptions
    skills_title_dev: "Tech Skills",
    skills_intro_dev:
      "A selection of the tools and technologies I use to build scalable, high-performance websites and applications.",
    skills_title_translator: "Localization Expertise & Tools",
    skills_intro_translator:
      "Specialized software and linguistic skills that allow me to localize complex interactive experiences.",
    skills_title_writer: "Creative Skills",
    skills_intro_writer:
      "All the skills and tools that I use to offer immersive and lively experiences.",

    // ------- Noms des compétences
    skill_loca: "Localization",
    skill_game: "Game knowledge",
    skill_lingui: "Linguistics",
    skill_research: "Research",
    skill_write: "Writing & linguistics",
    skill_review: "Review",

    // ------ Projets
    projects_title_dev: "Featured Projects",
    projects_intro_dev:
      "Highlights of my work showcasing my technical skills and design choices.",
    projects_title_translator: "Localization Projects",
    projects_intro_translator:
      "Examples of projects I have worked on as a freelance translator, in video games and other media.",
    projects_title_writer: "Published books",
    projects_intro_writer: "Discover my universes, stories and characters.",

    // ------ Description des projets
    // Dev
    project_inda_description:
      "Role-Playing forum designed on the <em>Forumactif</em> platform, with an <b>Invision</b> framework. <br> The main forum structure is part of the platform, I personalized it with HTML, CSS and a few scripts to give it a more personal and lively feel for my players.",
    project_inda_exams_description:
      'Related to my role-playing forum Indarë, a puzzle-game for "Exams" so that the player characters can finish their studies in a fun, engaging way. Include puzzles and small story-driven adventures. Only available in French, but most puzzle are self explanatory. Start the game, chose a character, get dressed, leave the room and try some exams. Suggested for easy understanding : physics, chemistry, maths.',
    project_dea_description:
      "Role-Playing forum designed on the <em>Forumactif</em> platform, with a <b>phpBB3</b> framework. <br> The main forum structure is part of the platform, I personalized it with HTML, CSS and a few scripts based on my graphisc designer's spring-themed design.",
    project_wam_description:
      "Role-Playing forum designed on the <em>Forumactif</em> platform, with a <b>phpBB2</b> framework. <br> The main forum structure is part of the platform, I personalized it with HTML, CSS and a few scripts to give it an old movie vibe, sepia tones and a responsive interface.",
    project_timetable_description:
      "Small Go server opening a localhost website to generate a timetable. Enter your workable hours, the total number of hours you have to work, and the program will distribute them evenly between your work days.",
    project_hamster_description:
      "A javascript web app inspired by Tamagotchis and pet care games. Take care of a pixel-art hamster and keep it alive as long as possible.<br> Needs include food, water, sleep, physical activity, cleanliness and fun, and impact eachother.",
    project_invaders_description:
      "A javascript game inspired by Space Invaders. An annoying coworker has joined your team. They claim every success on their work and every failure on you. Finish projects without letting him sabotage them and get the recognition you and your other coworkers deserve for your work.",

    // Traduction
    project_afop_description:
      "Translation and localization of 60k words of scripts, dialogue and menus for the open-world RPG Avatar: Frontiers of Pandora (Ubisoft). I was part of a six-person localization and review team. <br> We also translated game lore and found original French names for new plants and creatures.",
    project_jrpg_description:
      "Full translation and localization of a J-RPG, roughly 300k words of dialogue, quest descriptions, creative names (skills, creatures, places) and interface. The game was a sequel to several others, meaning consistency was a very important part of my job on the project.",
    project_bamb_description:
      "As part of an internship in Sweden, I worked with FirstAndTen on their game Bamblup: Motion To Win. My role involved writing the lore, dialogues and interface in English then translating them into French. I was also part of the brainstorming on new ideas for game element.",
    project_rod_description:
      "Current translation project on a J-RPG. Being very familiar with the game series, I shared a lot of my information for the Term Base and translation memory to facilitate advancement in the project. Currently, our team has translated and reviewed roughly 200k words.",
    project_mchef_description:
      "MTPE subtitles for 4 episodes of MasterChef on Amazon Prime. Most of the job included correcting mistranslations and missing context, as well as making the French version more idiomatic.",
    project_lnest_description:
      "MTPE subtitles for the film LoveNest on Disney+. The job involved correcting character names, translating song lyrics and avoiding multiple repetitions of common words, as well as making the French version more fluid.",
    project_dbtk_description:
      "MTPE subtitles for the film Don't bother to Knock on Disney+. Most of the job involved fixing mistakes in places and character names, ensuring a fluid and consistent French version and avoiding weird-sounding associations of words and sentences.",
    project_blizz_description:
      "Subtitles of a promotional video interview for an HearthStone extension. Other jobs for the same client and same project manager included several out-of-game elements, like update overview and announcements.",

    // Ecriture
    project_ljdt_description:
      "Les Joyaux des Titans is currently not available in English. Interested in translation rights? Send me and email! <center><a href='mailto:jade.colanges@live.fr' class='footer-social-icon' aria-label='Email'>... @ ...</a></center><style>#LJDT-book {display:none}</style>",
    project_ledt_description:
      "L'Éveil des Titans is currently not available in English. Interested in translation rights? Send me and email! <center><a href='mailto:jade.colanges@live.fr' class='footer-social-icon' aria-label='Email'>... @ ...</a></center><style>#LEDT-book {display:none}</style>",

    // ------ Tags
    tag_server: "Server conception",
    tag_crea: "Creativity",
    tag_search: "Research",
    tag_team: "Teamwork",
    tag_expert: "Game knowledge",
    tag_sub: "Subtitling",
  },
  fr: {
    // ------ Barre de navigation
    nav_about: "À Propos",
    nav_skills: "Compétences",
    nav_projects: "Projets",
    nav_contact: "Contact",

    domain_dev: "Développeuse",
    domain_trad: "Traductrice",
    domain_write: "Autrice",

    about_hi: "Bienvenue, je suis",
    cta_intouch: "Me contacter",
    cta_cv: "Voir mon CV",
    cta_email: "M'envoyer un Email",
    contact_title: "Envie de travailler ensemble ?",
    contact_intro:
      "Je suis toujours ouverte à de nouvelles opportunités et de nouveaux projets. Travaillons ensemble !",

    // ------ Link Titles
    link_wip: "Projet en cours",
    link_github: "Voir sur GitHub",
    link_website: "Accéder au site",
    link_demo: "Voir la démo vidéo",
    link_manager: "Chef de projet : %s",
    link_nda: "Nom du jeu et client sous accord de confidentialité",

    // ------ About
    dev_about_subtitle:
      "Je crée des applications et des sites webs accessibles, engageants et performants en tant que <span class='accent-text-bold'>Développeuse Full-Stack.</span>",
    dev_about_description:
      "Spécialisée en Go, HTML, CSS et Javascript, et toujours prête à découvrir de nouvelles technologies, je peux donner vie à vos idées dans des projets fonctionnels et ergonomiques.",
    trad_about_subtitle:
      "Je rends vos histoires, vos mondes et vos interfaces accessibles à une nouvelle audience en tant que <span class='accent-text-bold'>Traductrice.</span>",
    trad_about_description:
      "Spécialisée dans les jeux vidéo et dans la littérature de fiction, je permets à vos personnages de briller autant en français que dans leur anglais originel, que ce soit dans le ton, le contexte et même les jeux de mots.",
    write_about_subtitle:
      "Je crée des mondes, des personnages et des histoires pour vous transporter en tant qu'<span class='accent-text-bold'>Autrice de fantasy.</span>",
    write_about_description:
      "Laissez-moi vous emmener dans un nouveau monde, construit avec soin et empli d'émotions et de personnages que vous allez aimer, détester, ou adorer détester.",

    // ------ Compétences et descriptions
    skills_title_dev: "Compétences tech",
    skills_intro_dev:
      "Les outils et les technologies que j'utilise pour construire des applications et des sites webs performants et adaptables.",
    skills_title_translator: "Outils et compétences de traduction",
    skills_intro_translator:
      "Les programmes et les compétences que j'utilise dans la traduction d'univers narratifs complexes.",
    skills_title_writer: "Compétences créatives",
    skills_intro_writer:
      "Les compétences que j'utilise pour offrir des expériences immersives et pleines de vie.",

    // ------- Noms des compétences
    skill_loca: "Traduction",
    skill_game: "Expertise vidéoludique",
    skill_lingui: "Linguistique",
    skill_research: "Recherche",
    skill_write: "Écriture & linguistique",
    skill_review: "Relecture",

    // ------ Projets
    projects_title_dev: "Mes projets",
    projects_intro_dev:
      "Projets illustrant mes compétences techniques et mes designs.",
    projects_title_translator: "Projets de traduction",
    projects_intro_translator:
      "Exemples de projets rendus dans le cadre de mon activité de traductrice indépendante, dans le milieu audiovisuel.",
    projects_title_writer: "Livres publiés",
    projects_intro_writer:
      "Découvrez mes univers, mes histoires et mes personnages.",

    // ------ Description des projets
    //  Dev
    project_inda_description:
      "Forum de jeu de rôle conçu sur la plateforme <em>Forumactif</em>, version <b>Invision</b>. <br> La structure principale du forum est fournie par la plateforme, je l'ai personnalisée avec du HTML, du CSS et quelques scripts afin de lui donner une ambiance personnalisée et plus vivante pour mes joueurs.",
    project_inda_exams_description:
      'Lié à mon forum de jeu de rôle Indarë, un jeu de puzzle pour les "Examens" des personnages, pour qu\'ils terminent leur année de façon ludique et intéressante. Inclus des puzzles et des mini-aventures interactives. Uniquement en français. Choisissez un personnage, un uniforme, quittez votre chambre et commencez une épreuve.',
    project_dea_description:
      "Forum de jeu de rôle conçu sur la plateforme <em>Forumactif</em>, version <b>phpBB3</b>. <br> La structure principale du forum est fournie par la plateforme, je l'ai personnalisée avec du HTML, du CSS et quelques scripts selon les maquettes de mon graphiste pour un thème printanier.",
    project_wam_description:
      "Forum de jeu de rôle conçu sur la plateforme <em>Forumactif</em>, version <b>phpBB2</b>. <br> La structure principale du forum est fournie par la plateforme, je l'ai personnalisée avec du HTML, du CSS et quelques scripts pour lui donner une ambiance de vieux film, des tons sepia et une interface responsive.",
    project_timetable_description:
      "Petit serveur Go qui ouvre un site web local pour générer un emploi du temps. Entrez vos horaires de disponibilité, le nombre total d'heures à effectuer dans la semaine, et le programme les placera équitablement entre vos jours de travail.",
    project_hamster_description:
      "Appli web en javascript inspirée des Tamagotchis et des jeux de soin d'animaux. Occupez-vous d'un hamster en pixel art et gardez-le en vie aussi longtemps que possible.<br> Ses besoins comprennent la nourriture, l'eau, le sommeil, l'activité physique, la propreté et l'amusement, et s'impactent les uns les autres.",
    project_invaders_description:
      "Jeu javascript inspiré par Space Invaders. Un nouveau collègue désagréable rejoint votre équipe. Il s'attribue le mérite de vos succès et vous tient responsable des échecs. Achevez vos projets professionnels sans le laisser gâcher vos efforts, et faites en sorte que vous et vos autres collègues obteniez la reconnaissance que mérite votre travail.",

    // Traduction
    project_afop_description:
      "Traduction et localisation de 60k mots de doublages, dialogues et menus du RPG en monde ouvert Avatar&nbsp;: Frontiers of Pandora (Ubisoft). Je faisais partie d'une équipe de six traducteurs et relecteurs. <br> Nous avons également traduit le lore du jeu et les noms des plantes et créatures inventés.",
    project_jrpg_description:
      "Traduction et localisation complète d'un J-RPG&nbsp;: environ 300k mots de dialogues, descriptions de quêtes, noms inventés (compétences, créatures, lieux) et interfaces. Le jeu étant la suite de plusieurs autres, le maintien de la cohérence était une partie importante de mon travail sur ce projet.",
    project_bamb_description:
      "Lors d'un stage en Suède, j'ai travaillé chez FirstAndTen sur leur jeu Bamblup: Motion To Win. Mon rôle consistait à écrire le lore, les dialogues et les texte de l'interface en anglais avant des les traduire. Je participais aussi aux sessions brainstorming pour trouver de nouvelles idées de gameplay.",
    project_rod_description:
      "Projet de traduction d'un J-RPG en cours. Connaissant bien la série du jeu, j'ai partagé la plupart de mes connaissances pour remplir le lexique et la mémoire de traduction et ainsi faciliter l'avancement du projet. L'équipe du projet a actuellement traduit et relu environ 200k mots.",
    project_mchef_description:
      "Sous-titrage en MTPE de 4 épisodes de MasterChef pour Amazon Prime (161 minutes). Le travail consistait majoritairement à corriger des erreurs de traduction et de contextualisation, ainsi qu'à rendre la version française plus idiomatique.",
    project_lnest_description:
      "Sous-titrage en MTPE du film LoveNest pour Disney+ (85 minutes). La correction en MTPE impliquait de corriger des noms de personnages, de traduire correctement des paroles de chanson et d'éviter les répétitions multiples sur certains termes, en plus de rendre le français plus naturel.",
    project_dbtk_description:
      "Sous-titrage en MTPE du film Don't bother to Knock pour Disney+ (72 minutes). Le travail consistait majoritairement à corriger des erreurs dans des noms de lieux et de personnages, d'assurer une version française cohérente et fluide et d'éviter des tournures de phrases étranges.",
    project_blizz_description:
      "Sous-titrage d'une interview vidéo promotionnelle pour une extension de HearthStone. Pour le même client et avec le même chef de projet, j'ai également travaillé sur d'autres projets \"Out of Game\", comme des notes de mise à jour et des annonces.",

    // Ecriture
    project_ljdt_description:
      "<b>Les Secrets de May'zur - T1</b><br><br> Dix ans d'entraînement, d'observation, de préparation. Durant toutes ces années, Karel a convoité les joyaux des Titans, des gemmes précieuses conservées au palais royal censées lui fournir l'argent nécessaire pour sortir de la rue. Il lui suffit de les vendre et il pourra enfin changer de vie. C'était le projet de toute son existence.<br><br>Mais les souhaits ne se réalisent pas toujours comme prévu.",
    project_ledt_description:
      " <b>Les Secrets de May'zur - T2</b><br><br>La cité souterraine de Zephdon n'a laissé personne indemne. Kinn'yah se débat entre angoisses et mauvais souvenirs tandis que Karel est envahi de nouvelles questions. Partagé entre des pouvoirs de plus en plus difficiles à contrôler et des sentiments impossibles à envisager, il prend la route du Sud au côté de la princesse.<br><br>L'avenir est fait de sacrifices, encore faut-il pouvoir y consentir...",

    // ------ Tags
    tag_server: "Conception de serveur",
    tag_crea: "Créativité",
    tag_search: "Recherche",
    tag_team: "Travail d'équipe",
    tag_expert: "Expertise jeux",
    tag_sub: "Sous-titrage",
  },
};

// 1. Check URL parameters
const urlLang = getUrlParameter("lang");
const urlDomain = getUrlParameter("domain");

// 2. Determine initial state: URL > localStorage > Default
let currentLang = urlLang || getPreference(LANG_STORAGE_KEY, "en");
let currentDomain = urlDomain || getPreference(DOMAIN_STORAGE_KEY, "dev");

// 2. DOM Ready Functionality
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const domainSelector = document.getElementById("domain-selector");
  const domainButtons = domainSelector.querySelectorAll(".domain-btn");
  const domainContentWrappers = document.querySelectorAll(".domain-content");
  const cvButton = document.getElementById("bouton-cv");
  const langSelector = document.getElementById("language-selector");
  const langButtons = langSelector.querySelectorAll(".lang-btn");

  /**
   * Updates all visible text elements on the page based on the current language.
   */
  function setLanguage(langCode) {
    currentLang = langCode;
    setPreference(LANG_STORAGE_KEY, langCode);
    const langDict = translations[langCode];

    // 1. Update active language button state
    langButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-lang") === langCode) {
        btn.classList.add("active");
      }
    });

    // 2. Translate all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const text = langDict[key] || "";

      // Use innerHTML for text that contains span/bold tags (like the subtitles)
      if (key.includes("_subtitle") || key.includes("_description")) {
        element.innerHTML = text;
      } else {
        // Use textContent for plain text (navigation, buttons)
        element.textContent = text;
      }
    });

    // 3. Update link titles (handling both simple and parameterized titles)
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      // Read the entire attribute value (e.g., "link_project_lead|Alex Smith")
      const fullKey = element.getAttribute("data-i18n-title");

      // Split the value by the pipe character (|)
      const parts = fullKey.split("|");
      const key = parts[0]; // The translation key (e.g., "link_project_lead")
      const param = parts[1]; // The optional parameter (e.g., "Alex Smith")

      const basePhrase = langDict[key];

      if (basePhrase) {
        let finalTitle = basePhrase;

        if (param) {
          // If a parameter exists, replace the placeholder
          finalTitle = basePhrase.replace("%s", param);
        }
        // Note: If no parameter exists, finalTitle remains basePhrase (handling simple titles)

        element.setAttribute("title", finalTitle);
      }
    });

    // 4. Re-run domain switch to apply translated titles/intros immediately
    // This ensures dynamic text is updated if the language changes while a domain is active.
    switchDomain(currentDomain, false); // Pass false to skip button update
  }

  /**
   * Handles switching the active domain content and updating dynamic titles.
   * @param {string} domainId - The ID of the domain to switch to ('dev', 'translator', or 'writer').
   * @param {boolean} [updateButtons=true] - Whether to update the domain buttons' active state.
   */
  function switchDomain(domainId, updateButtons = true) {
    currentDomain = domainId;
    setPreference(DOMAIN_STORAGE_KEY, domainId);

    // 1. Update the body attribute for CSS visibility control
    body.setAttribute("data-active-domain", domainId);

    // 2. Update button active state
    if (updateButtons) {
      domainButtons.forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-domain-id") === domainId) {
          btn.classList.add("active");
        }
      });
    }

    // 3. Update content wrappers visibility
    domainContentWrappers.forEach((wrapper) => {
      wrapper.classList.remove("domain-active");
      if (wrapper.getAttribute("data-domain-id") === domainId) {
        wrapper.classList.add("domain-active");
      }
    });

    // 4. Update Section Titles and Intros using the current language
    const langDict = translations[currentLang];

    document.getElementById("skills-title").textContent =
      langDict[`skills_title_${domainId}`];
    document.getElementById("skills-intro").textContent =
      langDict[`skills_intro_${domainId}`];
    document.getElementById("projects-title").textContent =
      langDict[`projects_title_${domainId}`];
    document.getElementById("projects-intro").textContent =
      langDict[`projects_intro_${domainId}`];

    if (cvButton) {
      if (domainId === "writer") {
        cvButton.style.display = "none";
      } else {
        // Revert to default display (empty string clears the inline style)
        cvButton.style.display = "";
      }
    }
  }

  // 5. Add event listeners

  // Language Buttons Listener
  langButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const lang = event.target.getAttribute("data-lang");
      if (lang) {
        setLanguage(lang);
      }
    });
  });

  // Domain Buttons Listener
  domainButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const domainId = event.target.getAttribute("data-domain-id");
      if (domainId) {
        switchDomain(domainId);
      }
    });
  });

  // 6. Initial Setup: Set default language and domain on load
  if (urlLang) setPreference(LANG_STORAGE_KEY, urlLang);
  if (urlDomain) setPreference(DOMAIN_STORAGE_KEY, urlDomain);

  setLanguage(currentLang);
  body.setAttribute("data-active-domain", currentDomain);
  switchDomain(currentDomain);
});

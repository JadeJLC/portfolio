import {
  rotateText,
  calculateLevel,
  pageStatus,
  translationCache,
  domainCache,
  startImageRotation,
  getIcon,
  equalizeProjectCards,
} from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

let language;
let domain;

/**
 * Lancement de la page et des fonctions d'affichage (langue, domaine, etc)
 */
function init() {
  language = getUrlParameter("lang") || sessionStorage.getItem("lang") || "fr";
  domain =
    getUrlParameter("domain") || sessionStorage.getItem("domain") || "dev";

  switchLanguage(language);
  switchDomain(domain);

  rotateText();
  setInterval(rotateText, 3000);
}

/**
 * Récupère les informations de la page dans l'url (langue et domaine)
 * @param {String} name Nom du paramètre à récupérer dans l'url
 * @returns
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Création des events listeners pour tous les boutons
 */
document.addEventListener("click", (event) => {
  const menuOpenBtn = event.target.closest(".main-menu");
  if (menuOpenBtn) {
    menuOpenBtn.classList.toggle("open");
  }

  const englishSwitchBtn = event.target.closest("#english");
  if (englishSwitchBtn) {
    switchLanguage("en");
  }

  const frenchSwitchBtn = event.target.closest("#french");
  if (frenchSwitchBtn) {
    switchLanguage("fr");
  }

  const devSwitchBtn = event.target.closest("#dev");
  if (devSwitchBtn) {
    switchDomain("dev");
  }

  const tradSwitchBtn = event.target.closest("#trad");
  if (tradSwitchBtn) {
    switchDomain("trad");
  }

  const writeSwitchBtn = event.target.closest("#writer");
  if (writeSwitchBtn) {
    switchDomain("writer");
  }

  const bookActionBtn = event.target.closest(".multi-link");
  if (bookActionBtn) {
    bookActionBtn.classList.toggle("open");
  }
});

document.addEventListener("mouseover", (event) => {
  const node = event.target.closest(".skill-node");
  if (!node) return;
  const type = node.dataset.type;
  document
    .querySelectorAll(`.galaxy-links line[data-type="${type}"]`)
    .forEach((line) => line.classList.add("active"));
});

document.addEventListener("mouseout", (event) => {
  const node = event.target.closest(".skill-node");
  if (!node) return;
  document
    .querySelectorAll(".galaxy-links line.active")
    .forEach((line) => line.classList.remove("active"));
});

/**
 * Gère le changement de domaine en récupérant les données nécessaires
 * Dans les fichiers json associés
 * @param {String} domain Le domaine sélectionné
 */
async function switchDomain(dom) {
  if (dom == "dev" || dom == "trad" || dom == "writer") {
    domain = dom;
  }
  const tabs = document.querySelectorAll(".tabs button");

  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  document.getElementById(domain).classList.add("active");
  sessionStorage.setItem("domain", domain);

  try {
    if (!translationCache[language]) {
      const response = await fetch(`locales/${language}.json`);
      translationCache[language] = await response.json();
    }

    const projectKey = `${domain}_projects`;
    const projectData = translationCache[language][projectKey];

    const skillsKey = `${domain}_skills`;
    const skillData = translationCache[language][skillsKey];

    const galaxy = document.querySelector(".skill-galaxy");
    galaxy.classList.add("hidden");

    const domainBlock = document.querySelector(".domain-block");
    console.log(domainBlock);
    domainBlock.classList.add("faded");
    console.log(domainBlock);

    setTimeout(() => {
      fillProjectsData(projectData, domain);
      fillSkillGalaxy(
        skillData,
        domain,
        translationCache[language].sheet.skill_title,
      );
      equalizeProjectCards();
      lucide.createIcons();
      domainBlock.classList.remove("faded");
      console.log(domainBlock);
      galaxy.classList.remove("hidden");
    }, 200);
  } catch (error) {
    console.error("Failed to load domain data:", error);
    document.body.classList.remove("faded");
  }
}

/**
 * Gère le changement de langue de la page en récupérant les données nécessaires
 * Dans les fichiers json associés
 * @param {String} language "fr" ou "en" en fonction du bouton
 */
async function switchLanguage(lang) {
  if (lang == "fr" || lang == "en") {
    language = lang;
  }
  sessionStorage.setItem("lang", language);
  if (language == "fr") {
    document.getElementById("french")?.classList.add("active");
    document.getElementById("english")?.classList.remove("active");
  } else {
    document.getElementById("french")?.classList.remove("active");
    document.getElementById("english")?.classList.add("active");
  }

  document.body.classList.add("faded");

  const selectedText = language === "fr" ? "• Sélectionné" : "• Selected";
  document.documentElement.style.setProperty(
    "--tab-selected-text",
    `"${selectedText}"`,
  );

  try {
    if (!translationCache[language]) {
      const response = await fetch(`locales/${language}.json`);
      translationCache[language] = await response.json();
    }

    const data = translationCache[language];

    setTimeout(() => {
      fillHeaderData(data.header);
      fillSheetData(data, language);
      createTabs(data);
      switchDomain(domain);

      lucide.createIcons();
      document.body.classList.remove("faded");
    }, 200);
  } catch (error) {
    console.error("Failed to load translation data:", error);
    document.body.classList.remove("faded");
  }
}

/**
 * Remplissage des données du header en fonction de la langue choisie dans l'url, le sessionStorage ou l'appel de switchLanguage
 * @param {string} language
 */
function fillHeaderData(headerData) {
  document.querySelector("header h1 span").textContent = headerData.intro;
  const contactLinks = [...document.querySelectorAll(".contact-info button")];

  contactLinks.map((button) => {
    button.innerHTML = headerData.email;
  });

  ["#github", "#linkedin"].forEach((id) => {
    const el = document.querySelector(id);
    if (el) el.alt = el.title = headerData[id.replace("#", "")];
  });

  ["skills", "bio", "contact", "projects"].forEach((key) => {
    const el = document.querySelector(`.main-menu #menu_${key}`);
    if (el) el.innerHTML = `<a href="#${key}">${headerData[`menu_${key}`]}</a>`;
  });
}

function fillSheetData(data, language) {
  const sheetBloc = document.querySelector(".top-zone");

  if (!sheetBloc) {
    console.error("Failed to load sheet data:", error);
    return;
  }

  sheetBloc.querySelector(".title").textContent = data.sheet.title;

  // Age & spec
  const age = calculateLevel(new Date(1994, 7, 16));
  sheetBloc.querySelector(".level").textContent = `${data.sheet.level} ${age}`;
  sheetBloc.querySelector(".spec").textContent = data.sheet.spec;

  // Carrousel
  sheetBloc.querySelector(".ways").textContent =
    data.sheet.three + `${language == "fr" ? " de" : ""}`;

  const wrap = sheetBloc.querySelector(".rotation");
  wrap.innerHTML = "";

  const phrases = Object.values(data.rotations);
  if (phrases.length > 0) {
    const firstSpan = document.createElement("span");
    firstSpan.className = "rotator-word";
    firstSpan.textContent = phrases[0];
    wrap.appendChild(firstSpan);
  }

  pageStatus.currentIndex = 0;

  document.querySelector(".main-quote p").textContent = data.sheet.quote;
}

function createTabs(data) {
  const devTab = document.querySelector("#dev");
  const tradTab = document.querySelector("#trad");
  const writeTab = document.querySelector("#writer");

  fillTabData(devTab, data.tab_dev);
  fillTabData(tradTab, data.tab_trad);
  fillTabData(writeTab, data.tab_writer);
}

function fillTabData(tab, data) {
  tab.querySelector(".tab-title").textContent = data.title;
  tab.querySelector(".name").textContent = data.name;
  tab.querySelector(".subtitle").textContent = data.subtitle;
  tab.querySelector("footer").textContent = data.footer;
  const downloadLink = tab.querySelector(".download-link");

  if (downloadLink && data.cv) downloadLink.href = data.cv;
}

function fillProjectsData(projectList, domain) {
  const projectZone = document.querySelector(".project-zone");
  projectZone.classList.remove("trad", "dev", "writer");
  projectZone.classList.add(domain);

  projectZone.innerHTML = ` <h2>${language == "fr" ? "Projets" : "Projects"}</h2>`;
  projectList = projectList.reverse();

  projectList.forEach((project) => {
    const htmlBloc = createProjectElement(project);
    projectZone.appendChild(htmlBloc);
  });

  startImageRotation(3);
}

function createProjectElement(project) {
  const container = document.createElement("article");
  container.id = project.id;
  container.classList.add("project-element");
  container.innerHTML = `
  ${
    project.screenshots.length > 0
      ? `<div class="rotating-images">
          ${project.screenshots
            .map((screenshot, index) => {
              return `<img src="${screenshot}" class="slide-img" style="z-index: ${project.screenshots.length - index};" />`;
            })
            .join("")}
        </div>`
      : `<div class="empty-image"></div>`
  }

  <h2>${project.name}</h2>
  
  <div class="project-link">
 ${project.links
   .map((link) => {
     if (link.hover) {
       return `<div title="${link.title}" class="multi-link ${link.title.includes("avis") ? "review" : "buy"}">
       ${link.hover}
       ${getIcon(link.title)}
       </div>`;
     } else {
       return `<a title="${link.title}" 
     ${link.href ? `href="${link.href}"` : ""}>
     ${link.hover ? link.hover : ""}
      ${getIcon(link.title)}
    </a>`;
     }
   })
   .join("")}
  </div>
  <div class="project-skills">${project.tech_skills
    .map((skill) => {
      return `<span>${skill}</span>`;
    })
    .join("")}
  </div>
  <main>${project.description}</main>
  <div class="project-tags">${project.tags
    .map((tag) => {
      return `<span>${tag}</span>`;
    })
    .join("")}
  </div>
   `;

  return container;
}

function fillSkillGalaxy(skills, data, title) {
  const svg = document.querySelector(".galaxy-links");
  const nodesZone = document.querySelector(".galaxy-nodes");
  svg.innerHTML = "";
  nodesZone.innerHTML = "";

  document.querySelector(".skill-galaxy h2").textContent = title;

  const center = document.querySelector(".galaxy-center");

  switch (domain) {
    case "dev":
      center.innerHTML = `<i data-lucide="code"></i>`;
      break;
    case "trad":
      center.innerHTML = `<i data-lucide="languages"></i>`;
      break;
    case "writer":
      center.innerHTML = `<i data-lucide="book-open-text"></i>`;
      break;
  }

  // Lignes : contour reliant les compétences d'un même type, dans l'ordre
  // de leur angle autour du centre (comme une constellation)
  const byType = {};
  skills.forEach((s) => (byType[s.type] ??= []).push(s));

  Object.values(byType).forEach((group) => {
    if (group.length < 2) return; // rien à relier pour un groupe isolé

    const sorted = [...group].sort((a, b) => {
      const angleA = Math.atan2(a.position.y - 50, a.position.x - 50);
      const angleB = Math.atan2(b.position.y - 50, b.position.x - 50);
      return angleA - angleB;
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", sorted[i].position.x);
      line.setAttribute("y1", sorted[i].position.y);
      line.setAttribute("x2", sorted[i + 1].position.x);
      line.setAttribute("y2", sorted[i + 1].position.y);
      line.dataset.type = sorted[i].type;
      svg.appendChild(line);
    }

    if (sorted.length >= 3) {
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const closingLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      closingLine.setAttribute("x1", last.position.x);
      closingLine.setAttribute("y1", last.position.y);
      closingLine.setAttribute("x2", first.position.x);
      closingLine.setAttribute("y2", first.position.y);
      closingLine.dataset.type = first.type;
      svg.appendChild(closingLine);
    }
  });

  // Nodes
  skills.forEach((skill) => {
    const node = document.createElement("div");
    node.className = "skill-node";
    node.classList.add(skill.type);
    node.dataset.type = skill.type;
    node.style.left = `${skill.position.x}%`;
    node.style.top = `${skill.position.y}%`;
    node.innerHTML = `<span class="skill-name">${skill.name}</span><span class="skill-type">${skill.type}</span>`;
    nodesZone.appendChild(node);
  });
}

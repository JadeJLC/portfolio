init();

import { FRENCH_HEADER, ENGLISH_HEADER } from "./header.js";

function init() {
  const language =
    getUrlParameter("lang") || sessionStorage.getItem("lang") || "fr";
  const domain =
    getUrlParameter("domain") || sessionStorage.getItem("domain") || "dev";

  switchLanguage(language);
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

document.addEventListener("click", (event) => {
  const menuOpenBtn = event.target.closest(".main-menu");
  if (menuOpenBtn) {
    menuOpenBtn.classList.toggle("open");
  }

  const englishSwitchBtn = event.target.closest("#english");
  if (englishSwitchBtn) {
    englishSwitchBtn.classList.add("active");
    switchLanguage("en");
  }

  const frenchSwitchBtn = event.target.closest("#french");
  if (frenchSwitchBtn) {
    frenchSwitchBtn.classList.add("active");
    switchLanguage("fr");
  }
});

function switchLanguage(language) {
  sessionStorage.setItem("lang", language);
  fillHeaderData(language);

  lucide.createIcons();
}

/**
 * Remplissage des données du header en fonction de la langue choisie dans l'url, le sessionStorage ou l'appel de switchLanguage
 * @param {string} language
 */
function fillHeaderData(language) {
  const data = language == "fr" ? FRENCH_HEADER : ENGLISH_HEADER;

  if (language == "fr") {
    document.getElementById("french")?.classList.add("active");
    document.getElementById("english")?.classList.remove("active");
  } else {
    document.getElementById("french")?.classList.remove("active");
    document.getElementById("english")?.classList.add("active");
  }

  const intro = document.querySelector("header h1 span");
  const email = document.querySelector(".contact-info button");
  const github = document.querySelector("#github");
  const linkedin = document.querySelector("#linkedin");
  const menu = document.querySelector(".main-menu");

  intro.textContent = data.intro;
  email.innerHTML = data.email;
  github.alt = github.title = data.github;
  linkedin.alt = linkedin.title = data.linkedin;

  menu.querySelector("#menu_skills").textContent = data.menu_skills;
  menu.querySelector("#menu_bio").textContent = data.menu_bio;
  menu.querySelector("#menu_contact").textContent = data.menu_contact;
  menu.querySelector("#menu_projects").textContent = data.menu_projects;
}

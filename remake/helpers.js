const pageStatus = {
  currentIndex: 0,
};

const translationCache = {};
const domainCache = {};

function rotateText() {
  const wrap = document.querySelector(".rotation");
  if (!wrap) return;

  const currentLang = sessionStorage.getItem("lang") || "fr";
  const currentData = translationCache[currentLang];
  if (!currentData || !currentData.rotations) return;

  const phrases = Object.values(currentData.rotations);
  if (phrases.length <= 1) return;

  const activeWord = wrap.querySelector(".rotator-word:first-child");
  if (!activeWord) return;

  pageStatus.currentIndex = (pageStatus.currentIndex + 1) % phrases.length;
  const nextPhraseText = phrases[pageStatus.currentIndex];

  const nextWord = document.createElement("span");
  nextWord.className = "rotator-word";
  nextWord.textContent = nextPhraseText;

  // Place the new element in front so it dictates the active width layout
  wrap.insertBefore(nextWord, activeWord);

  // Mark the old element to sink back into a blurry artifact state
  activeWord.classList.add("is-exiting");

  // Wipe it out completely once it's entirely hidden out of view
  setTimeout(() => {
    activeWord.remove();
  }, 600);

  if (currentLang === "fr") {
    const title = document.querySelector(".top-zone .ways");
    if (/^[aeiouyàéèùœ]/i.test(nextPhraseText[0])) {
      title.textContent = `${currentData.sheet.three} d'`;
    } else {
      title.textContent = `${currentData.sheet.three} de `;
    }
  }
}

/**
 * Calcule le niveau dans une compétence / général (âge)
 * @param {Date} startDate Date à partir de calculer le "niveau"
 * @returns {int}
 */
function calculateLevel(startDate) {
  const today = new Date();

  let level = today.getFullYear() - startDate.getFullYear();
  const monthDifference = today.getMonth() - startDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < startDate.getDate())
  ) {
    level--;
  }

  return level;
}

function startImageRotation(intervalSeconds = 3) {
  const containers = document.querySelectorAll(".rotating-images");

  containers.forEach((container) => {
    const images = container.querySelectorAll(".slide-img");
    let currentIndex = 0;

    setInterval(() => {
      if (images.length <= 1) return;

      if (currentIndex < images.length - 1) {
        images[currentIndex].classList.add("slide-out");
        currentIndex++;
      } else {
        images.forEach((img) => img.classList.remove("slide-out"));
        currentIndex = 0;
      }
    }, intervalSeconds * 1000);
  });
}

function getIcon(title) {
  const match = ICON_MAP.find((entry) =>
    entry.keywords.some((kw) => title.includes(kw)),
  );
  return match ? match.icon : DEFAULT_ICON;
}

/**
 * Fait en sorte que toutes les cartes projet visibles (.project-element)
 * fassent la même hauteur : celle de la plus grande d'entre elles.
 */
function equalizeProjectCards() {
  const cards = document.querySelectorAll(".project-element");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.height = "auto";
  });

  let maxHeight = 0;
  cards.forEach((card) => {
    maxHeight = Math.max(maxHeight, card.offsetHeight);
  });

  cards.forEach((card) => {
    card.style.height = `${maxHeight}px`;
  });
}

const DEFAULT_ICON = '<i data-lucide="external-link"></i>';

const ICON_MAP = [
  {
    keywords: ["Github"],
    icon: '<svg width="24" height="24"><use href="sprite.svg#icon-github" /></svg>',
  },
  {
    keywords: ["Bande annonce", "Trailer"],
    icon: '<i data-lucide="play"></i>',
  },
  { keywords: ["Jouer"], icon: '<i data-lucide="gamepad-2"></i>' },
  {
    keywords: ["NDA", "confidentialité"],
    icon: '<i data-lucide="venetian-mask"></i>',
  },
  { keywords: ["Manager", "Chef"], icon: '<i data-lucide="user-star"></i>' },
  { keywords: ["Client"], icon: '<i data-lucide="handshake"></i>' },
  {
    keywords: ["en cours", "in progress"],
    icon: '<i data-lucide="loader-circle"></i>',
  },
  {
    keywords: ["avis"],
    icon: '<i data-lucide="library"></i>',
  },
  {
    keywords: ["Acheter"],
    icon: '<i data-lucide="shopping-cart"></i>',
  },
  {
    keywords: ["Contact"],
    icon: '<i data-lucide="mail"></i>',
  },
];

export {
  rotateText,
  calculateLevel,
  pageStatus,
  translationCache,
  domainCache,
  startImageRotation,
  getIcon,
  equalizeProjectCards,
};

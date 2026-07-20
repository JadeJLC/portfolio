const pageStatus = {
  currentIndex: 0,
};

const translationCache = {};

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

export { rotateText, calculateLevel, pageStatus, translationCache };

/**
 * generate-positions.js
 *
 * Ajoute une position { x, y } (en %) à chaque compétence de en.json et fr.json,
 * pour les clés dev_skills / trad_skills / writer_skills.
 *
 * - Les positions sont calculées une seule fois par compétence (basées sur
 *   l'index dans le tableau, pas sur le nom traduit) et sont donc IDENTIQUES
 *   dans en.json et fr.json.
 * - Si une compétence a déjà une position, elle n'est jamais recalculée :
 *   tu peux relancer le script à volonté après avoir ajouté une compétence,
 *   seules les nouvelles entrées seront positionnées.
 * - Anti-collision simple : distance minimale entre compétences, et distance
 *   minimale au centre (pour ne pas chevaucher le cercle central).
 */

const fs = require("fs");
const path = require("path");

const EN_PATH = path.join(__dirname, "locales/en.json");
const FR_PATH = path.join(__dirname, "locales/fr.json");

const SKILL_KEYS = ["dev_skills", "trad_skills", "writer_skills"];

const CONFIG = {
  centerExclusion: 15,
  minDist: 12,
  maxRadius: 48,
  maxTries: 500,
};

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/**
 * Génère une position aléatoire valide (hors zone centrale, pas trop proche
 * des positions déjà prises), avec un nombre limité d'essais.
 */
function generatePosition(existingPositions) {
  for (let tries = 0; tries < CONFIG.maxTries; tries++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius =
      CONFIG.centerExclusion +
      Math.random() * (CONFIG.maxRadius - CONFIG.centerExclusion);

    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    const tooClose = existingPositions.some(
      (p) => Math.hypot(p.x - x, p.y - y) < CONFIG.minDist,
    );

    if (!tooClose) {
      return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
    }
  }

  // Si on n'a pas trouvé de spot "propre" après maxTries, on place quand même
  // la compétence (mieux vaut un léger chevauchement qu'une compétence absente).
  console.warn(
    "Pas de position sans collision trouvée, placement approximatif utilisé.",
  );
  const angle = Math.random() * 2 * Math.PI;
  const radius =
    CONFIG.centerExclusion +
    Math.random() * (CONFIG.maxRadius - CONFIG.centerExclusion);
  return {
    x: Math.round((50 + radius * Math.cos(angle)) * 100) / 100,
    y: Math.round((50 + radius * Math.sin(angle)) * 100) / 100,
  };
}

function processSkillList(enList, frList, label) {
  if (enList.length !== frList.length) {
    console.warn(
      `${label} : en.json (${enList.length}) et fr.json (${frList.length}) n'ont pas le même nombre de compétences. ` +
        `Vérifie que les deux listes sont synchronisées avant de continuer.`,
    );
  }

  // On garde trace des positions déjà utilisées dans CE groupe pour l'anti-collision.
  const existingPositions = enList
    .filter((skill) => skill.position)
    .map((skill) => skill.position);

  let added = 0;

  enList.forEach((enSkill, index) => {
    if (enSkill.position) return; // déjà positionnée, on ne touche à rien

    const pos = generatePosition(existingPositions);
    existingPositions.push(pos);

    enSkill.position = pos;
    added++;

    // On applique la même position à l'entrée fr correspondante (même index).
    const frSkill = frList[index];
    if (frSkill) {
      frSkill.position = pos;
    } else {
      console.warn(
        `${label} : pas d'équivalent fr.json à l'index ${index} ("${enSkill.name}").`,
      );
    }
  });

  console.log(`${label} : ${added} nouvelle(s) position(s) générée(s).`);
}

function main() {
  const enData = loadJson(EN_PATH);
  const frData = loadJson(FR_PATH);

  SKILL_KEYS.forEach((key) => {
    if (!enData[key] || !frData[key]) {
      console.warn(`Clé "${key}" absente de en.json ou fr.json, ignorée.`);
      return;
    }
    processSkillList(enData[key], frData[key], key);
  });

  saveJson(EN_PATH, enData);
  saveJson(FR_PATH, frData);

  console.log("en.json et fr.json mis à jour.");
}

main();

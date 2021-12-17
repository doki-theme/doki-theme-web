import {isSysDark} from "./system.js";
import {hasSecondaryBG} from "./themes/background.js";
import {backgroundTypes} from "./states.js";

/*Selects a waifu at random*/
function getRandomThemeId(themes) {
  themes = Object.keys(themes);
  let randNum = getRandomNumber(0, themes.length);
  return themes[randNum];
}

/*Select a random waifu theme, keeping the current system theme color in mind*/
function getRandomThemeComps(systemTheme, systemChoice, themes) {
  let chosenThemeId;
  let chosenRandom;
  let isCorrectSystemTheme = false; // End loop when correct theme is found
  let isDarkSystemTheme = isSysDark(systemTheme, systemChoice);
  while (!isCorrectSystemTheme) {
    chosenThemeId = getRandomThemeId(themes);
    chosenRandom = themes[chosenThemeId];
    if (systemTheme === 'default' || !systemTheme) {
      isCorrectSystemTheme = true;
    } else {
      isCorrectSystemTheme = isDarkSystemTheme === chosenRandom.dark;
    }
  }
  return [chosenThemeId, chosenRandom];
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
/*Select a background type at random (primary/secondary)*/
function randomBackgroundType(currentTheme) {
  if (!hasSecondaryBG(currentTheme)) {
    return backgroundTypes.PRIMARY;
  }
  let bgChoice = getRandomNumber(0, 2);
  return bgChoice ? backgroundTypes.SECONDARY : backgroundTypes.PRIMARY;
}

export {getRandomThemeId, getRandomThemeComps, getRandomNumber, randomBackgroundType};
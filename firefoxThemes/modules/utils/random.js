/*Selects a waifu at random*/
function getRandomThemeId(themes) {
  themes = Object.keys(themes);
  let randNum = getRandomNumber(0, themes.length);
  return themes[randNum];
}

/*Select a random waifu theme, keeping the current system theme color in mind*/
function getRandomThemeComps(systemTheme, systemOption, themes) {
  let chosenThemeId;
  let chosenRandom;
  let isCorrectSystemTheme = false; // End loop when correct theme is found
  const isDarkSystemTheme = systemTheme === 'dark';// 'dark' or 'light'
  while (!isCorrectSystemTheme) {
    chosenThemeId = getRandomThemeId(themes);
    chosenRandom = themes[chosenThemeId];
    if (systemOption) {
      isCorrectSystemTheme = isDarkSystemTheme === chosenRandom.dark;
    } else {
      isCorrectSystemTheme = true;
    }
  }
  return [chosenThemeId, chosenRandom];
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export {getRandomThemeId, getRandomThemeComps};
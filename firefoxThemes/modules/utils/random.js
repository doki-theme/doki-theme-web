/*Selects a waifu at random*/
function getRandomThemeId(themes) {
  themes = Object.keys(themes);
  let randNum = getRandomNumber(0, themes.length);
  return themes[randNum];
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export {getRandomThemeId};
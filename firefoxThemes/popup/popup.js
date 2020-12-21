/*Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function setTheme(e) {
  browser.storage.local.get("themes")
    .then((storage) => {
      let chosenThemeId = e.target.value;

      if (chosenThemeId === "random") {
        chosenThemeId = getRandomTheme(storage.themes.themes);
      }
      browser.runtime.sendMessage({themeId: chosenThemeId});
    });

}

/*Selects a waifu at random*/
function getRandomTheme(themes) {
  themes = Object.keys(themes);
  let randNum = getRandomNumber(0, themes.length);
  return themes[randNum].information.id;
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*Setup Waifu Choices for the popup menu
* Also categorizes each theme based on their type (original/dark/light)*/
function initChoice() {
  browser.storage.local.get("themes")
    .then((storage) => {
      const themes = Object.values(storage.themes.themes);
      const darkGroup = document.querySelector("optgroup[label='Dark Variant']");
      const lightGroup = document.querySelector("optgroup[label='Light Variant']");
      themes.forEach(theme => {
        const opt = document.createElement("option");
        const themeInformation = theme.definition.information;
        opt.setAttribute("value", themeInformation.id);
        const txtNode = document.createTextNode(theme.name);
        opt.append(txtNode);
        if (themeInformation.dark) {
          darkGroup.append(opt);
        } else {
          lightGroup.append(opt);
        }
      })
    });
}

initChoice();
/*---Event Listeners---*/
document.querySelector("select")
  .addEventListener("change", setTheme, true);

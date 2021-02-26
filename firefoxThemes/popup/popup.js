/*Global Variables*/
const selectTag = document.querySelector("select");
const backgroundSwitch = document.querySelector("#backgroundType");
const showSearchSwitch = document.querySelector("#hideSearch");
const darkModeSwitch = document.querySelector("#darkMode");

//Enum for the different Mixed option states
const mixedStates = {
  NONE: 0,
  INITIAL: 1
};

const backgroundTypes = {
  PRIMARY: 0,
  SECONDARY: 1
};

/*Set color of popup menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return
  const {colors} = chosenTheme.definition
  const styles = `
.popup-header {
  background-color: ${colors.headerColor};
  color: ${colors.infoForeground};
}

* {
 color: ${colors.lineNumberColor};
}

.slider {
  background-color: ${colors.selectionInactive};
}

.slider:before {
  background-color: ${colors.accentColor};
}

.popup-body {
  background-color: ${colors.baseBackground};
}

input:checked + .slider {
  background-color: ${colors.accentColor}44;
}

input:focus + .slider {
  box-shadow: 0 0 1px ${colors.accentColor}44;

        `
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet)
}

const setBackground = async () => {
  await browser.storage.local.set({
    backgroundType: backgroundSwitch.checked ? backgroundTypes.SECONDARY : backgroundTypes.PRIMARY
  });

  const {currentThemeId} = await browser.storage.local.get(["currentThemeId"])
  browser.runtime.sendMessage({currentThemeId});
}

const setHideWidget = async () => {
  await browser.storage.local.set({
    showWidget: showSearchSwitch.checked
  });

  const {currentThemeId} = await browser.storage.local.get(["currentThemeId"])
  browser.runtime.sendMessage({currentThemeId});
}

const setDarkMode = async () => {
  await browser.storage.local.set({
    darkMode: darkModeSwitch.checked
  });

  const {currentThemeId, waifuThemes} = await browser.storage.local.get(["currentThemeId", "waifuThemes"]);

  const currentTheme = waifuThemes.themes[currentThemeId];

  if(currentTheme) {
    const newTheme = Object.values(waifuThemes.themes)
      .find(dokiTheme =>
        dokiTheme.displayName === currentTheme.displayName &&
      dokiTheme.id !== currentThemeId) || currentTheme
    const newThemeId = newTheme.id;
    setCss(newTheme);
    await browser.storage.local.set({currentThemeId: newThemeId})
    browser.runtime.sendMessage({currentThemeId: newThemeId});
  }
}

/*EVENT: Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function setTheme(e) {
  browser.storage.local.get([ "darkMode", "waifuThemes"])
    .then((storage) => {
      const chosenThemeName = e.target.value;
      const currentMix = chosenThemeName === "mixed" ? mixedStates.INITIAL : mixedStates.NONE;
      let chosenThemeId;
      if (currentMix === mixedStates.NONE) {
        if (chosenThemeName === "random") {
          chosenThemeId = getRandomTheme(storage.waifuThemes.themes);
        }
        const themes = Object.values(storage.waifuThemes.themes)
          .filter(dokiTheme => dokiTheme.displayName === chosenThemeName)

        const theme = themes.find(dokiTheme =>
          dokiTheme.dark === storage.darkMode)

        darkModeSwitch.disabled = themes.length < 2;

        const usableTheme = theme || themes[0]
        darkModeSwitch.checked = usableTheme.dark

        if (usableTheme) {
          setCss(usableTheme);
          chosenThemeId = usableTheme.id
        }
      }
      browser.runtime.sendMessage({currentThemeId: chosenThemeId || 'mixed', mixState: currentMix});
    });
}

/*Selects a waifu at random*/
function getRandomTheme(themes) {
  themes = Object.keys(themes);
  const randNum = getRandomNumber(0, themes.length);
  return themes[randNum];
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*Setup Waifu Choices for the popup menu
* Also categorizes each theme based on their type (dark/light)*/
function initChoice() {
  browser.storage.local.get([
    "waifuThemes",
    "currentThemeId",
    "mixedTabs",
    "backgroundType",
    'showWidget',
    "darkMode"
  ])
    .then((storage) => {
      backgroundSwitch.checked = !!storage.backgroundType;
      darkModeSwitch.checked = storage.darkMode;
      showSearchSwitch.checked = storage.showWidget === undefined || storage.showWidget;
      const themesGroupedByName = Object.values(storage.waifuThemes.themes)
        .reduce((accum, dokiTheme) => ({
          ...accum,
          [dokiTheme.displayName]: [
            ...(accum[dokiTheme.displayName] || []),
            dokiTheme
          ]
        }), {});
      const themes = Object.keys(themesGroupedByName)
        .sort((a, b) => a.localeCompare(b));
      const waifuGroup = document.querySelector("#waifus");
      themes.forEach(themeName => {
        const themeOption = document.createElement("option");
        themeOption.setAttribute("value", themeName);
        themeOption.id = themeName
        const txtNode = document.createTextNode(themeName);
        themeOption.append(txtNode);
        waifuGroup.append(themeOption);
      });
      /*Set the theme of the popup menu based on current tab color*/
      browser.tabs.query({active: true})
        .then((tabs) => {
          const activeTab = tabs[0];
          const themes = storage.waifuThemes.themes;
          if (activeTab && storage.mixedTabs) {
            const tabThemeId = storage.mixedTabs.get(activeTab.id);
            setCss(themes[tabThemeId]);
            selectTag.options.selectedIndex =
              selectTag.options.namedItem(tabThemeId).index;
          } else if (activeTab) {
            setCss(themes[storage.currentThemeId]);
          }
        })
    });
}

initChoice();
/*---Event Listeners---*/
selectTag.addEventListener("change", setTheme, true);
backgroundSwitch.addEventListener("change", setBackground, true);
showSearchSwitch.addEventListener("change", setHideWidget, true);
darkModeSwitch.addEventListener("change", setDarkMode, true);

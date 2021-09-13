/*Global Variables*/
const selectTag = document.querySelector("select");
const backgroundSwitch = document.querySelector("#backgroundType");
const showSearchSwitch = document.querySelector("#hideSearch");
const darkModeSwitch = document.querySelector("#darkMode");
const dokiHeart = document.querySelector("#doki_heart");
const root = document.querySelector(":root");


//Enum for the different Mixed option states
const mixedStates = {
  NONE: 0,
  INITIAL: 1,
  RESET:2
};

const backgroundTypes = {
  PRIMARY: 0,
  SECONDARY: 1
};

/*Set color of popup menu based on theme*/
function setCSS(chosenTheme) {
  if (!chosenTheme) return;
  themeDokiLogo(chosenTheme);
  const {colors} = chosenTheme.definition;
  root.style.setProperty('--switch-shadow-color',colors.accentColor);
  root.style.setProperty('--doki-shadow', colors.accentColor);
  root.style.setProperty('--info-foreground-color',colors.infoForeground);
  root.style.setProperty('--header-color',colors.headerColor);
  root.style.setProperty('--line-number-color',colors.lineNumberColor);
  root.style.setProperty('--selection-inactive-color',colors.selectionInactive);
  root.style.setProperty('--primary-accent-color',colors.accentColor);
  root.style.setProperty('--secondary-accent-color',colors.accentColorTransparent);
  root.style.setProperty('--button-color',colors.buttonColor);
  root.style.setProperty('--button-font-color',colors.buttonFont);
  root.style.setProperty('--base-background-color',colors.baseBackground);
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

/*Stores info to set dark mode switch accordingly*/
async function setDarkMode(shouldDisable) {
  await browser.storage.local.set({
    darkMode: {
      isDarkNow: darkModeSwitch.checked,
      shouldDisable
    }
  });
}

/*Stores whether or not the current theme has a secondary theme*/
function setHasSecondary(currentTheme) {
  const hasSecondaryMode = currentTheme && !!currentTheme.backgrounds.secondary;
  backgroundSwitch.disabled = !hasSecondaryMode;
  browser.storage.local.set({hasSecondaryMode});
}

/*Set the theme to the opposite type. (Light vs Dark)
* Ex: If current theme is light, go to dark and vice versa*/
const setOpposingTheme = async () => {
  const {currentThemeId, waifuThemes} = await browser.storage.local.get(["currentThemeId", "waifuThemes"]);

  const currentTheme = waifuThemes.themes[currentThemeId];

  if (currentTheme) {
    const newTheme = Object.values(waifuThemes.themes)
      .find(dokiTheme =>
        (dokiTheme.displayName === currentTheme.displayName ||
          dokiTheme.name === currentTheme.name) &&
        dokiTheme.id !== currentThemeId) || currentTheme;
    const newThemeId = newTheme.id;
    setCSS(newTheme);
    await browser.storage.local.set({currentThemeId: newThemeId});
    browser.runtime.sendMessage({currentThemeId: newThemeId});
  }
}

function themeDokiLogo(currentTheme) {
  const searchOptions = {width: 75, height: 75};
  const searchSVG = buildSVG(currentTheme, searchOptions)
  svgToPng(searchSVG, searchOptions, (imgData) => {
    dokiHeart.src = imgData
  });
}

/*EVENT: Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function setTheme(e) {
  browser.storage.local.get(["darkMode", "waifuThemes","mixedTabs"])
    .then((storage) => {
      const chosenThemeName = e.target.value;
      const currentMix = getMixState(chosenThemeName,storage.mixedTabs);
      let chosenThemeId;
      if (currentMix === mixedStates.NONE) {
        let themes;
        if (chosenThemeName === "random") {
          chosenThemeId = getRandomTheme(storage.waifuThemes.themes);
          const chosenRandom = storage.waifuThemes.themes[chosenThemeId];
          themes = Object.values(storage.waifuThemes.themes)
            .filter(dokiTheme => (
              (dokiTheme.name === chosenRandom.name
                || dokiTheme.displayName === chosenRandom.displayName)
              && dokiTheme.group === chosenRandom.group
            ));
        }else{
          themes = Object.values(storage.waifuThemes.themes);
        }

        const isDark = (storage.darkMode) && storage.darkMode.isDarkNow;
        const theme = themes.find(dokiTheme =>
          dokiTheme.dark === isDark);

        const disableDarkSwitch = themes.length < 2;
        darkModeSwitch.disabled = disableDarkSwitch;
        setDarkMode(disableDarkSwitch);

        if (chosenThemeName !== 'random') {
          const usableTheme = theme || themes[0];
          darkModeSwitch.checked = !!usableTheme.dark;

          if (usableTheme) {
            setCSS(usableTheme);
            chosenThemeId = usableTheme.id;
          }
        }else{
          if(chosenThemeId){
            setCSS(storage.waifuThemes.themes[chosenThemeId]);
          }
          selectTag.value = 'none';
        }
      }
      setHasSecondary(storage.waifuThemes.themes[chosenThemeId]);
      browser.runtime.sendMessage({currentThemeId: chosenThemeId || 'mixed', mixState: currentMix});
    });
}
function getMixState(name,mixTabs){
  if(name === "mixed" && mixTabs){
    return mixedStates.RESET;
  }else if(name === "mixed"){
    return mixedStates.INITIAL;
  }
  return mixedStates.NONE;
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

/*Navigate to options page*/
function optionsPage() {
  browser.runtime.openOptionsPage();
}

/*Initializes checkbox switches*/
function prepareSwitches(storage) {
  backgroundSwitch.checked = !!storage.backgroundType;
  backgroundSwitch.disabled = !(!!storage.hasSecondaryMode);
  if (storage.darkMode !== undefined) {
    darkModeSwitch.checked = !!storage.darkMode.isDarkNow
    darkModeSwitch.disabled = !!storage.darkMode.shouldDisable;
  } else {
    darkModeSwitch.checked = false;
    darkModeSwitch.disabled = true;
  }
  showSearchSwitch.checked = storage.showWidget === undefined || storage.showWidget;
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
    "darkMode",
    "hasSecondaryMode"
  ])
    .then((storage) => {
      prepareSwitches(storage);
      const themesGroupedByName = Object.values(storage.waifuThemes.themes)
        .reduce((accum, dokiTheme) => {
          const displayName = dokiTheme.displayName;
          const themeByDisplayName = accum[displayName];
          const hasConflicts = !!themeByDisplayName &&
            themeByDisplayName[0].group !== dokiTheme.group;
          const themeKey = hasConflicts ? dokiTheme.name : dokiTheme.displayName;

          // update existing collisions
          if (hasConflicts) {
            delete accum[displayName]
            accum[themeByDisplayName[0].name] = themeByDisplayName;
          }

          return {
            ...accum,
            [themeKey]: [
              ...(accum[themeKey] || []),
              dokiTheme
            ]
          };
        }, {});
      const themes = Object.keys(themesGroupedByName)
        .sort((a, b) => a.localeCompare(b));
      const waifuGroup = document.querySelector("#waifus");
      themes.forEach(themeName => {
        const themeOption = document.createElement("option");
        themeOption.setAttribute("value", themeName);
        themeOption.id = themeName;
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
            let currentTheme = themes[tabThemeId];
            setCSS(currentTheme);
            selectTag.options.selectedIndex =
              selectTag.options.namedItem(currentTheme.displayName).index;
          } else if (activeTab) {
            setCSS(themes[storage.currentThemeId]);
          }
        })
    });
}

initChoice();
/*---Event Listeners---*/
selectTag.addEventListener("change", setTheme, true);
backgroundSwitch.addEventListener("change", setBackground, true);
showSearchSwitch.addEventListener("change", setHideWidget, true);
darkModeSwitch.addEventListener("change", setOpposingTheme, true);
dokiHeart.addEventListener('click', optionsPage, true);

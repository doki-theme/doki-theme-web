// Themed logo stuffs

function shadeHexColor(color, percent) {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

const buildSVG = (dokiTheme, {width, height}) =>
  `<svg width="${width}" height="${height}" version="1.1" viewBox="0 0 52.915 52.915" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <path fill="${dokiTheme.definition.colors.accentColor}" d="m49.495 13.229c1.7198 2.9788 1.7198 23.48 0 26.457-1.7198 2.9784-19.475 13.229-22.914 13.229-3.4396 0-21.195-10.251-22.914-13.229-1.7198-2.9788-1.7198-23.48 0-26.457 1.7198-2.9788 19.475-13.229 22.914-13.229 3.4396 0 21.195 10.251 22.914 13.229z" stroke-width=".1124" style="paint-order:stroke fill markers"/>
  <path fill="${shadeHexColor(dokiTheme.definition.colors.accentColor, -0.1)}" d="m43.44 8.4075c0.03488 0.09687 0.07029 0.19354 0.10286 0.29137 0.665 0.62065-5.8164 29.196-40.611 23.868-0.16135-0.48752-0.31207-0.96732-0.45799-1.4438 0.16964 4.0491 0.56546 7.4762 1.1929 8.563 1.7194 2.9785 19.475 13.229 22.914 13.229 3.4389 0 21.195-10.251 22.914-13.229 1.7198-2.9775 1.7198-23.479 0-26.458-0.5794-1.0037-2.9959-2.8372-6.0557-4.8217z" stroke-width=".1124" style="paint-order:stroke fill markers"/>
  <path fill="none" stroke="${dokiTheme.definition.colors.iconContrastColor || '#fff'}" d="m26.786 19.341c0.78035-0.42869 3.4115-2.163 7.2558-3.0409 8.8633-2.024 12.27 7.7485 7.0439 15.118-4.6692 5.3617-9.5156 7.8247-14.3 10.997-4.7838-3.1724-9.63-5.6355-14.3-10.997-5.2264-7.3687-1.8194-17.141 7.0439-15.118 3.8443 0.87785 6.4754 2.6122 7.2558 3.0409" stroke-dasharray="9.75870597, 4.87935299, 2.43967649, 4.87935299" stroke-linecap="round" stroke-miterlimit="6" stroke-width="2.4396" style="paint-order:stroke fill markers"/>
  <path fill="${dokiTheme.definition.colors.accentColor}" d="m36.389 16.03c-0.73241-0.0059-1.5153 0.08021-2.3462 0.26994-3.8445 0.87789-6.4758 2.6125-7.256 3.0412h-4.68e-4c-0.78043-0.42872-3.4117-2.1633-7.256-3.0412-8.8633-2.0229-12.27 7.7493-7.0439 15.118 4.67 5.3617 9.5165 7.8246 14.3 10.997 4.7843-3.1725 9.6306-5.6353 14.3-10.997 4.7362-6.6786 2.3824-15.331-4.6976-15.388z" stroke-width=".11241" style="paint-order:stroke fill markers"/>
  <path fill="${shadeHexColor(dokiTheme.definition.colors.accentColor, -0.1)}" d="m40.514 17.321c-3.7651 6.6533-11.568 14.871-26.43 15.814 4.1721 4.2098 8.4613 6.4686 12.702 9.2806 4.7843-3.1725 9.6306-5.6353 14.3-10.997 3.6403-5.1332 3.0907-11.431-0.57249-14.097z" stroke-width=".2383" style="paint-order:stroke fill markers"/>
</svg>`


const svgUrlToPng = (svgUrl, options, callback) => {
  const svgImage = document.createElement('img');
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    callback(imgData);
    try {
      document.body.removeChild(svgImage)
    } catch (e) {
    }
  };
  svgImage.src = svgUrl;
};

const getSvgUrl = svg =>
  URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));

const svgToPng = (svg, options, callback) => {
  const url = getSvgUrl(svg);
  svgUrlToPng(url, options, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
};


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
  INITIAL: 1
};

const backgroundTypes = {
  PRIMARY: 0,
  SECONDARY: 1
};

/*Set color of popup menu based on theme*/
function setCSS(chosenTheme) {
  if (!chosenTheme) return;
  themeDokiLogo(chosenTheme);
  const {colors, information} = chosenTheme.definition;
  root.style.setProperty('--switch-shadow-color',information.dark ? 'white' : 'black');
  root.style.setProperty('--doki-shadow',information.dark ? '11px #fff' : '11px #000');
  root.style.setProperty('--info-foreground-color',colors.infoForeground);
  root.style.setProperty('--header-color',colors.headerColor);
  root.style.setProperty('--line-number-color',colors.lineNumberColor);
  root.style.setProperty('--selection-inactive-color',colors.selectionInactive);
  root.style.setProperty('--primary-accent-color',colors.accentColor);
  root.style.setProperty('--secondary-accent-color',colors.accentColor+'44');
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
    dokiHeartIcon.src = imgData
  });
}

/*EVENT: Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function setTheme(e) {
  browser.storage.local.get(["darkMode", "waifuThemes"])
    .then((storage) => {
      const chosenThemeName = e.target.value;
      const currentMix = chosenThemeName === "mixed" ? mixedStates.INITIAL : mixedStates.NONE;
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
          themes = Object.values(storage.waifuThemes.themes)
            .filter(dokiTheme => (
              dokiTheme.displayName === chosenThemeName ||
              dokiTheme.name === chosenThemeName
            ));
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
          setCSS(storage.waifuThemes.themes[chosenThemeId]);
          selectTag.value = 'none';
        }
      }
      setHasSecondary(storage.waifuThemes.themes[chosenThemeId]);
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
  showSearchSwitch.checked = !!storage.showWidget;
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
            setCSS(themes[tabThemeId]);
            selectTag.options.selectedIndex =
              selectTag.options.namedItem(tabThemeId).index;
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

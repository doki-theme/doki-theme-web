import {dokiThemeDefinitions} from "./DokiThemeDefinitions.js";
import {mixedStates, systemStates} from "./modules/utils/states.js";
import {setupMixedUpdate, mixTabCleanup} from "./modules/modes/mix.js";
import {normalUpdate} from "./modules/modes/normal.js";
import {updateOptions} from "./modules/contentConfig.js";
import {getRandomThemeComps} from "./modules/utils/random.js";
import {reloadTabs} from "./modules/utils/browser.js";
import {systemListener} from "./modules/modes/system/system.js";
/*---Classes---*/
let systemObserver;

/*Class Goal: Holds theme data about all waifus*/
class WaifuThemes {
  constructor() {
    this.initThemes();
  }

  /*Initialize Waifu Themes*/
  initThemes() {
    this.themes =
      Object.entries(dokiThemeDefinitions).reduce((accum, [themeId, dokiTheme]) => ({
        ...accum,
        [themeId]: new Theme(
          dokiTheme.information.displayName,
          dokiTheme.information.backgrounds,
          dokiTheme.information.jsonPath,
          dokiTheme,
        )
      }), {})
  }
}

/*Location to retrieve resources for each waifu theme*/
class Theme {
  constructor(name, backgrounds, json, themeDefinition) {
    this.name = name;//Name of theme
    this.backgrounds = backgrounds;//Relative links to each theme's backgrounds
    this.json = json;//Relative link to browser theme file
    this.definition = themeDefinition;
    Object.assign(this, themeDefinition.information)
    this.page = "/waifus/index.html";
  }
}

/*Initialize Local Storage & custom new tab page*/
async function startStorage() {
  const storage = await browser.storage.local.get(["currentThemeId", "loadOnStart", "textSelection", "scrollbar",
    "mixedTabs", "systemTheme", "systemThemeChoice"]);
  const initStorage = {
    waifuThemes: new WaifuThemes(),
  };
  //Retrieve all themes if none exists in local storage
  browser.storage.local.set(initStorage);
  //Load browser theme
  if (storage.mixedTabs) {
    let themeId = storage.currentThemeId;
    if (!themeId) {
      const [randomId, _] = getRandomThemeComps(storage.systemTheme, storage.systemThemeChoice, initStorage.waifuThemes.themes);
      themeId = randomId;
    }
    updateTabs({mixState: mixedStates.RESET, currentThemeId: themeId});
  } else if (storage.currentThemeId) {
    let themeId = storage.currentThemeId;
    if (!themeId) {
      const [randomId, _] = getRandomThemeComps(storage.systemTheme, storage.systemThemeChoice, initStorage.waifuThemes.themes);
      themeId = randomId;
    }
    updateTabs({currentThemeId: themeId});
  }
  if (storage.loadOnStart) {
    //When the browser first opens, redirect to custom new tab page
    browser.tabs.update({loadReplace: true, url: "waifus/index.html"});
  }
  // Register all styles from option page
  updateOptions({optionName: "textSelection", optionValue: !!!storage.textSelection});
  updateOptions({optionName: "scrollbar", optionValue: !!!storage.scrollbar});
  // Register to follow system color theme
  if (storage.systemTheme === systemStates.SYSTEM || storage.systemTheme === systemStates.DRUTHERS) {
    updateSystemListener({addObserver:true});
    browser.browserSettings.overrideContentColorScheme.set({value: "system"});
  } else {
    browser.browserSettings.overrideContentColorScheme.set({value: "browser"});
  }

}
/*Update the system observer to listen to system color theme changes*/
function updateSystemListener(msg) {
  if (msg.addObserver) {
    if (!systemObserver) {
      systemObserver = setInterval(() => systemListener(updateTheme), 500);
    }
  } else {
    if (systemObserver) {
      clearInterval(systemObserver);
      systemObserver = undefined;
    }
  }
}

/*Update all new tabs with new waifu theme*/
function updateTabs(msg) {
  switch (msg.mixState) {
    case mixedStates.INITIAL:
      setupMixedUpdate(msg);
      break;
    case mixedStates.RESET:
      mixTabCleanup();
      setupMixedUpdate(msg);
      break;
    default:
      mixTabCleanup();
      normalUpdate(msg);
      break;
  }
}

/*MESSAGE: Update all theme components*/
function updateTheme(msg) {
  if (!msg.resourceMSG) return;
  if (msg.isSystemRelated) {
    updateSystemListener(msg);
  } else if (msg.applyWidget) {
    reloadTabs({title: 'New Tab'});
  } else if (msg.optionName && (msg.optionValue || msg.optionValue === '')) {
    updateOptions(msg);
  } else {
    updateTabs(msg);
    for (const optionName of ['textSelection', 'scrollbar']) {
      updateOptions({optionName});
    }
  }
}


//Initialize Storage
startStorage();

/*---EventListeners---*/
browser.runtime.onMessage.addListener(updateTheme);


import {dokiThemeDefinitions} from "./DokiThemeDefinitions.js";
import {mixedStates} from "./modules/utils/states.js";
import {setupMixedUpdate, mixTabCleanup} from "./modules/modes/mix.js";
import {normalUpdate} from "./modules/modes/normal.js";
import {updateOptions} from "./modules/contentConfig.js";

/*---CLASSES---*/

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
    this.backgrounds = backgrounds;//Relative links to each themes backgrounds
    this.json = json;//Relative link to browser theme file
    this.definition = themeDefinition;
    Object.assign(this, themeDefinition.information)
    this.page = "/waifus/index.html";
  }
}

/*Initialize Local Storage & custom new tab page*/
async function startStorage() {
  const storage = await browser.storage.local.get(["currentThemeId", "loadOnStart", "textSelection", "scrollbar","mixedTabs"]);
  const initStorage = {
    waifuThemes: new WaifuThemes(),
  };
  //Retrieve all themes if none exists in local storage
  browser.storage.local.set(initStorage);
  //Load browser theme
  if (storage.mixedTabs){
    const tab = await browser.tabs.getCurrent();
    loadTheme(initStorage.waifuThemes.themes, storage.mixedTabs.get(tab.id));
  }else if (storage.currentThemeId) {
    loadTheme(initStorage.waifuThemes.themes, storage.currentThemeId);
  }
  if (storage.loadOnStart) {
    //When the browser first opens, redirect to custom new tab page
    browser.tabs.update({loadReplace: true, url: "waifus/index.html"});
  }
  // Register all styles from option page
  updateOptions({optionName: "textSelection", optionValue: !!!storage.textSelection});
  updateOptions({optionName: "scrollbar", optionValue: !!!storage.scrollbar});
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

/*Update all theme components*/
function updateTheme(msg) {
  if (!msg.optionName) {
    updateTabs(msg);
    for (const optionName of ['textSelection', 'scrollbar']) {
      updateOptions({optionName});
    }
  } else {
    updateOptions(msg);
  }
}

//Initialize Storage
startStorage();
/*---EventListeners---*/
browser.runtime.onMessage.addListener(updateTheme);
import {getRandomThemeId} from "../utils/random.js";
import {loadTheme} from "../utils/themes/browser.js";

/*Separate the New Tab pages from the other types of pages*/
function separateTabs(tabs) {
  let newTabs = [];
  let otherTabs = [];
  for (const tab of tabs) {
    if (tab.title === "New Tab") {
      newTabs.push(tab);
    } else {
      otherTabs.push(tab);
    }
  }
  return [newTabs, otherTabs];
}

/*Add all tabs that are not a new tab into the mix collection*/
function addOtherTabsToMix(tabs, mixList, themes) {
  if (tabs.length > 0) {
    for (const tab of tabs) {
      mixList.set(tab.id, getRandomThemeId(themes));
    }
  }
  return mixList;
}

/*Closes all but the last tab*/
function keepLastTab(tabs) {
  const lastTabs = tabs[tabs.length - 1];
  if (tabs.length > 1) {
    const newTabTotal = tabs.length - 1;
    for (let i = 0; i < newTabTotal; i++) {
      browser.tabs.remove(tabs[i].id);
    }
  }
  return lastTabs;
}
/*Remove themes that did not make it to the mixedTab list.
* This is primarily used to mitigate speedy tab creations*/
async function purgeGlitchedTabs(newTab){
  const {mixedTabs} = await browser.storage.local.get(["mixedTabs"]);
  const tabs = await browser.tabs.query({});
  const glitchyTabs = tabs.filter(tab => !(!!mixedTabs.get(tab.id)) && tab.id !== newTab.id);
  const glitchyTabIDs = glitchyTabs.map(tab => tab.id);
  browser.tabs.remove(glitchyTabIDs);
}
/*EVENT: When a new tab is created add a random theme to it*/
function MixTabCreated(tab) {
  if (tab.title === "New Tab") {
    browser.storage.local.get("waifuThemes")
      .then((storage) => {
        const chosenThemeId = getRandomThemeId(storage.waifuThemes.themes);
        MixedUpdate(tab, chosenThemeId, storage.waifuThemes.themes);
      });
  }
}

/*EVENT: Set the theme for the current active tab*/
function MixTabActivated(activeInfo) {
  browser.storage.local.get(["waifuThemes"])
    .then((storage) => {
      const currentThemeId = mixList.get(activeInfo.tabId);
      if (currentThemeId) {
        loadTheme(storage.waifuThemes.themes, currentThemeId);
        browser.storage.local.set({currentThemeId});
      }
    });
}
//Maintain a local list of all mixed tabs
let mixList = new Map();
/*EVENT: When a tab is closed delete the saved data for it*/
function MixTabClosed(tabId) {
  mixList.delete(tabId);
  browser.storage.local.set({mixedTabs: mixList});
}

/*Updates the new tab with a new waifu theme*/
function MixedUpdate(tab, themeId, themes) {
  mixList.set(tab.id, themeId);//Adds the created tab to the list of mixed tabs
  browser.storage.local.set({currentThemeId: themeId, mixedTabs: mixList});
  //Load browser theme
  loadTheme(themes, themeId);
  //Purge glitchy tabs
  setTimeout(()=>{
    purgeGlitchedTabs(tab);
  },3000);
}

/*Cleans up all things relating to the Mixed tab option*/
function mixTabCleanup() {
  browser.storage.local.get("mixedTabs")
    .then((storage) => {
      //Removes all listeners
      if (browser.tabs.onCreated.hasListener(MixTabCreated)) {
        browser.tabs.onCreated.removeListener(MixTabCreated);
        browser.tabs.onActivated.removeListener(MixTabActivated);
        browser.tabs.onRemoved.removeListener(MixTabClosed);
      }
      if (storage.mixedTabs) {
        browser.storage.local.set({mixedTabs: undefined});
      }
    });
}

/*Initialize the Mixed feature*/
function setupMixedUpdate(msg) {
  browser.tabs.query({})
    .then((tabs) => {
      browser.storage.local.get(["waifuThemes", "mixedTabs"])
        .then((storage) => {
          if (!storage.mixedTabs) {
            storage.mixedTabs = new Map();//Create a new mixed tab list
            mixList = new Map();
          }
          //Activate event listeners
          browser.tabs.onCreated.addListener(MixTabCreated);//When a tab is created
          browser.tabs.onActivated.addListener(MixTabActivated);//When the active tab has been switched
          browser.tabs.onRemoved.addListener(MixTabClosed);//When a tab has been closed
          if (tabs.length > 0) {
            const themes = storage.waifuThemes.themes;
            let currentThemeId = msg.currentThemeId;
            const [newTabs, otherTabs] = separateTabs(tabs);
            storage.mixedTabs = addOtherTabsToMix(otherTabs, storage.mixedTabs, themes);
            //If any New Tabs exists
            if (newTabs.length) {
              const lastTab = keepLastTab(newTabs);//Closes all New Tab tabs except the last
              storage.mixedTabs.set(lastTab.id, currentThemeId);//Add a default theme to the mixed tab list
              browser.storage.local.set({currentThemeId, mixedTabs: storage.mixedTabs});
              browser.tabs.update(lastTab.id, {
                loadReplace: true,
                url: themes[currentThemeId].page
              });
            } else {
              browser.storage.local.set({currentThemeId, mixedTabs: storage.mixedTabs});
            }
            mixList = storage.mixedTabs;
            //Initialize first (and only) new tab with the default theme
            loadTheme(themes, currentThemeId);
          }
        });
    });
}

export {setupMixedUpdate, mixTabCleanup};
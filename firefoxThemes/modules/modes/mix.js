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
  browser.storage.local.get(["waifuThemes", "mixedTabs"])
    .then((storage) => {
      const currentThemeId = storage.mixedTabs.get(activeInfo.tabId);
      if (currentThemeId) {
        loadTheme(storage.waifuThemes.themes, currentThemeId);
      }
    });
}

/*EVENT: When a tab is closed delete the saved data for it*/
function MixTabClosed(tabId) {
  browser.storage.local.get()
    .then((storage) => {
      storage.mixedTabs.delete(tabId);
      browser.storage.local.set({mixedTabs: storage.mixedTabs});
    });
}

/*Updates the new tab with a new waifu theme*/
function MixedUpdate(tab, themeId, themes) {
  browser.storage.local.get(["mixedTabs"])
    .then((storage) => {
      storage.mixedTabs.set(tab.id, themeId);//Adds the created tab to the list of mixed tabs
      browser.storage.local.set({currentThemeId: themeId, mixedTabs: storage.mixedTabs});
      //Update the tab with theme
      browser.tabs.update(tab.id, {
        loadReplace: true,
        url: themes[themeId].page
      });
      //Load browser theme
      loadTheme(themes, themeId);
    });
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
            //Initialize first (and only) new tab with the default theme
            loadTheme(themes, currentThemeId);
          }
        });
    });
}

export {setupMixedUpdate, mixTabCleanup};
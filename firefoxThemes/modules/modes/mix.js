import {getRandomThemeId} from "../utils/random.js";
import {loadTheme} from "../utils/themes/browser.js";
/*Global Variables*/
let mixedList = undefined;//Maintain a local list of all mixed tabs
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

/*Add all tabs that are not a new tab into the mix mixedQueue*/
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

/*EVENT: Set the theme for the current active tab*/
function MixTabActivated(activeInfo) {
  browser.storage.local.get(["waifuThemes"])
    .then((storage) => {
      //Check if mixed mode is still active.
      //This check is when searchbar is toggled during mix mode which disables it
      if (!mixedList) {
        mixTabCleanup();
        return;
      }
      const currentThemeId = mixedList.get(activeInfo.tabId);
      if (currentThemeId) {
        loadTheme(storage.waifuThemes.themes, currentThemeId);
        browser.storage.local.set({currentThemeId});
      }
    });
}

/*EVENT: When a tab is closed delete the saved data for it*/
function MixTabClosed(tabId) {
  //Check if mixed mode is still active.
  //This check is when searchbar is toggled during mix mode which disables it
  if (!mixedList) {
    mixTabCleanup();
    return;
  }
  mixedList.delete(tabId);
  browser.storage.local.set({mixedTabs: mixedList});
}

/*Cleans up all things relating to the Mixed tab option*/
function mixTabCleanup() {
  browser.storage.local.get("mixedTabs")
    .then((storage) => {
      //Removes all listeners
      if (browser.tabs.onCreated.hasListener(MixTabActivated)) {
        browser.tabs.onActivated.removeListener(MixTabActivated);
        browser.tabs.onRemoved.removeListener(MixTabClosed);
      }
      if (storage.mixedTabs) {
        browser.storage.local.set({mixedTabs: undefined});
        mixedList = undefined;
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
            mixedList = new Map();
          }
          //Activate event listeners
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
            mixedList = storage.mixedTabs;
            //Initialize first (and only) new tab with the default theme
            loadTheme(themes, currentThemeId);
          }
        });
    });
}

/*MESSAGE: Send a message to the page to apply theme*/
function pageResponse(msg) {
  if (!msg.mixMSG) return;
  browser.storage.local.get(["currentThemeId", "waifuThemes", "backgroundType", "showWidget"]).then(storage => {
    if (!mixedList) {
      browser.tabs.sendMessage(msg.pageTab.id, {
        pageMSG: true,
        waifuThemes: storage.waifuThemes,
        currentThemeId: storage.currentThemeId,
        backgroundType: storage.backgroundType,
        showWidget: storage.showWidget,
      });
    } else {
      if (!mixedList.has(msg.pageTab.id)) {
        mixedList.set(msg.pageTab.id, getRandomThemeId(storage.waifuThemes.themes));
        browser.storage.local.set({mixedTabs: mixedList});
      }
      browser.tabs.sendMessage(msg.pageTab.id, {
        pageMSG: true,
        waifuThemes: storage.waifuThemes,
        currentThemeId: storage.currentThemeId,
        backgroundType: storage.backgroundType,
        showWidget: storage.showWidget,
        mixedTabs: mixedList,
        pageTab: msg.pageTab
      });
      loadTheme(storage.waifuThemes.themes, mixedList.get(msg.pageTab.id));
    }
  });
}

export {setupMixedUpdate, mixTabCleanup};
browser.runtime.onMessage.addListener(pageResponse);
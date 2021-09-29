import {buildSVG, svgToPng} from "../modules/utils/themes/logo.js";
import {getCurrentTheme} from "../modules/utils/themes/browser.js";
import {applyTheme} from "./waifu.js";
import {applyTabListeners} from "./tab.js";

function setThemedFavicon(currentTheme) {
  const faviconOptions = {width: 32, height: 32};
  const faviconSVG = buildSVG(currentTheme, faviconOptions);
  svgToPng(faviconSVG, faviconOptions, (imgData) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = imgData;
  });
}

async function startTheming() {
  const storage = await browser.storage.local.get(["currentThemeId","waifuThemes","mixedTabs","backgroundType","showWidget"]);
  storage.currentTheme = await getCurrentTheme(storage.waifuThemes.themes,storage.currentThemeId,storage.mixedTabs);
  applyTheme(storage);
  applyTabListeners(storage);
  setThemedFavicon(storage.currentTheme);
  if(storage.mixedTabs){
    //Makes sure the mixedTab list has the same amount of tabs as the amount currently opened tabs
    const tabs = await browser.tabs.query({});
    const tabIDs = tabs.map(tab=>tab.id);

    for(const key of storage.mixedTabs.keys()){
      if(!tabIDs.includes(key)){
        storage.mixedTabs.delete(key);
      }
    }
    browser.storage.local.set({mixedTabs:storage.mixedTabs});
  }
}

startTheming();
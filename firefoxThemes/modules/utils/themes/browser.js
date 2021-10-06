import {themeExtensionIconInToolBar} from "./logo.js";
import {getRandomThemeId} from "../random.js";


/*Set the browser theme for chosen waifu*/
async function loadTheme(themes, themeId) {
  const dokiTheme = themes[themeId];
  themeExtensionIconInToolBar(dokiTheme);
  const themePath = dokiTheme.json;
  const res = await fetch(themePath);
  const themeJSON = await res.json();
  browser.theme.update(themeJSON);
}
/*Retrieve the appropriate theme*/
async function getCurrentTheme(themes,themeId,mixedTabs){
  if(mixedTabs){
    const tab = await browser.tabs.getCurrent();
    themeId = mixedTabs.get(tab.id);
    if(!themeId){
      themeId = getRandomThemeId(themes);
      mixedTabs.set(tab.id,themeId);
      browser.storage.local.set({mixedTabs});
      loadTheme(themes,themeId);
    }
  }
  return themes[themeId];
}

export {loadTheme,getCurrentTheme};
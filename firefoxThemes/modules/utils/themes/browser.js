import {themeExtensionIconInToolBar} from "./logo.js";


/*Set the browser theme for chosen waifu*/
async function loadTheme(themes, themeId) {
  const dokiTheme = themes[themeId];
  themeExtensionIconInToolBar(dokiTheme);
  const themePath = dokiTheme.json;
  const res = await fetch(themePath);
  const themeJSON = await res.json();
  browser.theme.update(themeJSON);
}

export {loadTheme};
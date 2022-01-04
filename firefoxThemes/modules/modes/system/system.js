import {systemStates} from "../../utils/states.js";
/*Listen for change in the system theme color*/
function systemListener(callback) {
  browser.storage.local.get(["systemTheme", "systemThemeChoice", "currentThemeId", "druthersThemes"])
    .then(storage => {
      if (storage.systemTheme === systemStates.DEVICE || storage.systemTheme === systemStates.DRUTHERS) {
        setSystemTheme(storage.systemTheme);
        if (storage.systemTheme !== systemStates.DRUTHERS) {
          return;
        }
        const druthersDarkThemeID = storage.druthersThemes.get(systemStates.DARK);
        const druthersLightThemeID = storage.druthersThemes.get(systemStates.LIGHT);
        if (storage.systemThemeChoice === systemStates.DARK && storage.currentThemeId !== druthersDarkThemeID) {
          callback({
            resourceMSG: true,
            currentThemeId: druthersDarkThemeID
          });
        } else if (storage.systemThemeChoice === systemStates.LIGHT && storage.currentThemeId !== druthersLightThemeID) {
          callback({
            resourceMSG: true,
            currentThemeId:druthersLightThemeID
          });
        }
      }
    });
}

/*Set the current system theme color (dark or light)
* Needs 'prefers-color-theme set to div#sys to work!'*/
function setSystemTheme(systemTheme, domEl = "div#sys") {
  if (systemTheme === systemStates.DEVICE || systemTheme === systemStates.DRUTHERS) {
    const element = document.querySelector(domEl);
    const cssVar = '--system-color-theme';
    const systemThemeName = getComputedStyle(element).getPropertyValue(cssVar);
    browser.storage.local.set({systemThemeChoice: systemThemeName});
  }
}

/*Check if system settings is light or dark*/
function isSysDark(systemTheme, systemChoice) {
  let isDark;
  if (systemTheme === systemStates.DEVICE || systemTheme === systemStates.DRUTHERS) {
    isDark = systemChoice === systemStates.DARK;// 'dark' or 'light'
  } else {
    isDark = systemTheme === systemStates.DARK;// 'dark' or 'light'
  }
  return isDark;
}

/*Check if system settings is all mode*/
function isSysDefault(systemTheme) {
  return !systemTheme || systemTheme === systemStates.ALL;
}

/*Checks if any specific system theme is set*/
function isSpecificSysTheme(systemTheme) {
  const isDark = systemTheme === systemStates.DARK;
  const isLight = systemTheme === systemStates.LIGHT;
  const isSysTheme = systemTheme === systemStates.DEVICE;
  const isDruthers = systemTheme === systemStates.DRUTHERS;
  return isSysTheme || isDruthers || isDark || isLight;
}

export {isSysDark, isSpecificSysTheme, isSysDefault, systemListener};
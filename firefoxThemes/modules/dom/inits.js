//Place functions that needs to activate right away here!

/*Set the current system theme color (dark or light)
* Needs 'prefers-color-theme set to div#sys to work!'*/
function setSystemTheme(systemTheme) {
  if (systemTheme === 'system') {
    const element = document.querySelector("div#sys");
    const cssVar = '--system-color-theme';
    const systemThemeName = getComputedStyle(element).getPropertyValue(cssVar);
    browser.storage.local.set({systemThemeChoice: systemThemeName});
  }
}

export {setSystemTheme};
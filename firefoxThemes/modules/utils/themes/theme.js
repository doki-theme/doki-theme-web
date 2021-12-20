/*Get theme ID by name
* Returns: the opposite theme color if dark/light is not found*/
function getThemeIDByName(themeName, isDark, waifuThemes) {
  const theme = getThemeByName(themeName, isDark, waifuThemes);
  return theme.id;
}

/*Get theme by name.
* Returns: the opposite theme color if dark/light is not found*/
function getThemeByName(themeName, isDark, waifuThemes) {
  let themes = Object.values(waifuThemes)
    .filter(dokiTheme => (
      dokiTheme.displayName === themeName ||
      dokiTheme.name === themeName
    ));
  let theme = themes.find(dokiTheme => dokiTheme.dark === isDark);
  if (!theme) {
    theme = themes.find(dokiTheme => dokiTheme.dark === !isDark);
  }
  return theme;
}

/*Retrieve theme by ID or mixed tab*/
function getThemeById(themes, themeId, mixedTabs, tab) {
  if (mixedTabs) {
    themeId = mixedTabs.get(tab.id);
  }
  return themes[themeId];
}

export {getThemeIDByName, getThemeById, getThemeByName};
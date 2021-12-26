//Place functions that needs to activate right away here!
import {isSpecificSysTheme, isSysDark, isSysDefault} from "../modes/system/system.js";

function populateSelect(selectEl, systemTheme, systemThemeChoice, waifuThemes) {
  let filteredThemes = {};
  const isDark = isSysDark(systemTheme, systemThemeChoice);
  for (const [key, value] of Object.entries(waifuThemes)) {
    if (isDark === value.dark && isSpecificSysTheme(systemTheme) || isSysDefault(systemTheme)) {
      filteredThemes[key] = value;
    }
  }
  const themesGroupedByName = Object.values(filteredThemes)
    .reduce((accum, dokiTheme) => {
      const displayName = dokiTheme.displayName;
      const themeByDisplayName = accum[displayName];
      const hasConflicts = !!themeByDisplayName &&
        themeByDisplayName[0].group !== dokiTheme.group;
      const themeKey = hasConflicts ? dokiTheme.name :
        dokiTheme.displayName;

      // update existing collisions
      if (hasConflicts) {
        delete accum[displayName]
        accum[themeByDisplayName[0].name] = themeByDisplayName;
      }

      return {
        ...accum,
        [themeKey]: [
          ...(accum[themeKey] || []),
          dokiTheme
        ]
      };
    }, {});
  const themes = Object.keys(themesGroupedByName)
    .sort((a, b) => a.localeCompare(b));
  const waifuGroup = document.querySelector(selectEl);
  themes.forEach(themeName => {
    const themeOption = document.createElement("option");
    themeOption.setAttribute("value", themeName);
    themeOption.id = themeName;
    const txtNode = document.createTextNode(themeName);
    themeOption.append(txtNode);
    waifuGroup.append(themeOption);
  });
}


export {populateSelect};
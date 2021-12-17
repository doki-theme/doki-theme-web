/*Check if current theme has a secondary background*/
function hasSecondaryBG(currentTheme) {
  return currentTheme && !!currentTheme.backgrounds.secondary;
}

export {hasSecondaryBG};
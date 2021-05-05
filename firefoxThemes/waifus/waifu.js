/*Get background position */
function getAnchoring(theme) {
  if (theme.definition.overrides && theme.definition.overrides.theme &&
    theme.definition.overrides.theme.properties &&
    theme.definition.overrides.theme.properties.ntp_background_alignment) {
    return theme.definition.overrides.theme.properties.ntp_background_alignment;
  }
  return "center";
}

function getSecondaryAnchoring(theme) {
  if (
    theme.definition.overrides &&
    theme.definition.overrides.theme &&
    theme.definition.overrides.theme.properties &&
    theme.definition.overrides.theme.properties.ntp_background_alignment_secondary) {
    return theme.definition.overrides.theme.properties.ntp_background_alignment_secondary;
  }
  return getAnchoring(theme);
}

/*Adds Waifu to custom New Tab Page*/
function addWaifu(storage) {
  const themes = storage.waifuThemes.themes;
  //Retrieve path to the image file
  const currentTheme = themes[storage.currentThemeId];

  const primaryBackgroundRelativeUrl = currentTheme.backgrounds.primary;
  const isPrimaryBackground = !storage.backgroundType;
  const backgroundImageUrl = isPrimaryBackground ? primaryBackgroundRelativeUrl :
    currentTheme.backgrounds.secondary || primaryBackgroundRelativeUrl

  const waifuImageURL = currentTheme ? `url(${browser.runtime.getURL(backgroundImageUrl)})` : "";
  const anchoring = isPrimaryBackground ? getAnchoring(currentTheme) : getSecondaryAnchoring(currentTheme);
  const style = document.createTextNode("body:before {\n" +
    "\tcontent: \"\";\n" +
    "\tz-index: -1;\n" +
    "\tposition: fixed;\n" +
    "\ttop: 0;\n" +
    "\tleft: 0;\n" +
    `\tbackground: #f9a no-repeat ${waifuImageURL} ${anchoring};\n` +
    "\tbackground-size: cover;\n" +
    "\twidth: 100vw;\n" +
    "\theight: 100vh;\n" +
    "}");
  const styleTag = document.createElement("style");
  styleTag.append(style);//Add CSS styles to <style>
  document.head.append(styleTag);
}

/*Apply Theme */
function applyTheme() {
  browser.storage.local.get(["waifuThemes", "currentThemeId", "backgroundType"])
    .then((storage) => {
      if (Object.keys(storage.waifuThemes.themes).includes(storage.currentThemeId)) {
        addWaifu(storage);
      }
    });
}

applyTheme();

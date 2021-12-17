/*Get background position */
import {randomBackgroundType} from "../modules/utils/random.js";

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

/*Prepares the Waifu to be displayed on webpage*/
function getWaifu(storage) {
  //Retrieve path to the image file
  const currentTheme = storage.currentTheme;

  const primaryBackgroundRelativeUrl = currentTheme.backgrounds.primary;
  let isPrimaryBackground;
  if (storage.mixedTabs){
    isPrimaryBackground = !randomBackgroundType(currentTheme);
  }else{
    isPrimaryBackground = !storage.backgroundType;
  }
  const backgroundImageUrl = isPrimaryBackground ? primaryBackgroundRelativeUrl :
    currentTheme.backgrounds.secondary || primaryBackgroundRelativeUrl

  const waifuImageURL = currentTheme ? `url(${browser.runtime.getURL(backgroundImageUrl)})` : "";
  const anchoring = isPrimaryBackground ? getAnchoring(currentTheme) : getSecondaryAnchoring(currentTheme);
  return document.createTextNode("body:before {\n" +
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

}

/*Load Doki Theme to webpage*/
function loadDokiTheme(storage) {
  const styleTag = document.createElement("style");
  styleTag.append(getWaifu(storage));//Add CSS styles to <style>
  document.head.append(styleTag);
}

/*Apply Theme */
function applyTheme(storage) {
    if (Object.keys(storage.waifuThemes.themes).includes(storage.currentThemeId)) {
      loadDokiTheme(storage);
    }
}
export {applyTheme};
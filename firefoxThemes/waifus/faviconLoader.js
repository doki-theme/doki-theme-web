import {buildSVG, svgToPng} from "../modules/utils/themes/logo.js";

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

function applyFaviconTheme() {
  browser.storage.local.get(["currentThemeId", "waifuThemes"]).then((storage) => {
    const currentTheme = storage.waifuThemes.themes[storage.currentThemeId] ||
      storage.waifuThemes.themes["19b65ec8-133c-4655-a77b-13623d8e97d3"];
    setThemedFavicon(currentTheme);
  });
}

applyFaviconTheme();
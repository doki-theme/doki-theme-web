import {buildSVG, svgToPng} from "../modules/utils/themes/logo.js";
import {getCurrentTheme} from "../modules/utils/themes/browser.js";
import {applyTheme} from "./waifu.js";
import {applyTabListeners} from "./tab.js";

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

/*Apply All Themes except toolbar themes*/
function startTheming(msg) {
  if (!msg.pageMSG) return;
  msg.currentTheme = getCurrentTheme(msg.waifuThemes.themes, msg.currentThemeId, msg.mixedTabs, msg.pageTab);
  applyTheme(msg);
  applyTabListeners(msg);
  setThemedFavicon(msg.currentTheme);
}

/*MESSAGE: Alerts background script that page is fully loaded and ready to apply theme*/
async function sendMessage() {
  const tab = await browser.tabs.getCurrent();
  browser.runtime.sendMessage({mixMSG: true, pageTab: tab});
}

browser.runtime.onMessage.addListener(startTheming);
sendMessage();
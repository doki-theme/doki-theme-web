import { DokiTheme } from "../common/DokiTheme";
import { svgToPng } from "./svgTools";

export function themeExtensionIconInToolBar(dokiTheme: DokiTheme) {
  const extensionIconOptions = { width: 74, height: 74, useCanvasData: true };
  svgToPng(dokiTheme, extensionIconOptions).then((imageData) =>
    chrome.browserAction.setIcon({
      imageData,
    })
  );
}

function getAnchoring(theme) {
  if (theme.definition.overrides && theme.definition.overrides.theme &&
    theme.definition.overrides.theme.properties &&
    theme.definition.overrides.theme.properties.ntp_background_alignment) {
    return theme.definition.overrides.theme.properties.ntp_background_alignment;
  }
  return "center";
}

/*Adds Waifu to custom New Tab Page*/
function addWaifu() {
  browser.storage.local.get(["themes", "currentThemeId"])
    .then((storage) => {
      const themes = storage.themes.themes;
      const currentTheme = themes[storage.currentThemeId];
      return {
        waifuImageURL: browser.runtime.getURL(`${currentTheme.image}`),
        theme: currentTheme
      }
    })
    .then(({waifuImageURL, theme}) => {
      const anchoring = getAnchoring(theme);
      console.log(anchoring)
      const style = document.createTextNode("body:before {\n" +
        "\tcontent: \"\";\n" +
        "\tz-index: -1;\n" +
        "\tposition: fixed;\n" +
        "\ttop: 0;\n" +
        "\tleft: 0;\n" +
        `\tbackground: #f9a no-repeat url(${waifuImageURL});\n` +
        `\tbackground-position: ${anchoring};\n` +
        "\tbackground-size: cover;\n" +
        "\twidth: 100vw;\n" +
        "\theight: 100vh;\n" +
        "}");
      let styleTag = document.createElement("style");
      styleTag.append(style);//Add CSS styles to <style>
      document.head.append(styleTag);
    });

}

/*Removes Waifu from custom New Tab Page*/
function removeWaifu(updateInfo) {
  if (!updateInfo.theme.colors) {
    let styleTag = document.querySelector("style");
    styleTag.parentElement.removeChild(styleTag);//Removes <style> from <head>
  }
}

/*---Event Listeners---*/
browser.theme.onUpdated.addListener(removeWaifu);
addWaifu();

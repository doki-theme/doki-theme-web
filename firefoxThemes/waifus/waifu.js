/*Adds Waifu to custom New Tab Page*/
function addWaifu() {
  browser.storage.local.get(["themes", "waifu"])
    .then((storage) => {
      const themes = storage.themes.themes;
      return browser.runtime.getURL(`${themes[storage.waifu].image}`);
    })
    .then((waifuImageURL) => {
      const style = document.createTextNode("body:before {\n" +
        "\tcontent: \"\";\n" +
        "\tz-index: -1;\n" +
        "\tposition: fixed;\n" +
        "\ttop: 0;\n" +
        "\tleft: 0;\n" +
        `\tbackground: #f9a no-repeat url(${waifuImageURL}) center;\n` +
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

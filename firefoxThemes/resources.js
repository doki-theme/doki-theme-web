/*Location to retrieve resources for each waifu theme*/
class WaifuThemes {
  constructor() {
    this.initThemes();
  }

  /*Initialize Waifu Themes*/
  initThemes() {
    this.themes =
      // "waifus/darkness/light/darkness_light.png", "waifus/darkness/light/theme.json"
      Object.entries(dokiThemeDefinitions).reduce((accum, [themeId, dokiTheme]) => ({
        ...accum,
        [themeId]: new Theme(
          dokiTheme.information.displayName,
          dokiTheme.information.imagePath,
          dokiTheme.information.jsonPath,
          dokiTheme.information.dark,
        )
      }), {})

  }

  /*Retrieve browser theme for Waifu*/
  getJSON(themeId) {
    return this.themes[themeId].json;
  }

  getPage(themeId) {
    return this.themes[themeId].page;
  }

  /*Determine if waifu exists*/
  exists(themeId) {
    return Object.keys(this.themes).includes(themeId);
  }
}

class Theme {
  constructor(name, image, json, isDark) {
    this.name = name;//Name of theme
    this.image = image;//Relative link to waifu image file
    this.json = json;//Relative link to browser theme file
    this.isDark = isDark
    this.page = "/waifus/index.html";
  }
}

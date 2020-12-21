/*Location to retrieve resources for each waifu theme*/
class WaifuThemes {
  constructor() {
    this.initThemes();
  }

  /*Initialize Waifu Themes*/
  initThemes() {
    this.themes =
      Object.entries(dokiThemeDefinitions).reduce((accum, [themeId, dokiTheme]) => ({
        ...accum,
        [themeId]: new Theme(
          dokiTheme.information.displayName,
          dokiTheme.information.imagePath,
          dokiTheme.information.jsonPath,
          dokiTheme,
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
  constructor(name, image, json, themeDefinition) {
    this.name = name;//Name of theme
    this.image = image;//Relative link to waifu image file
    this.json = json;//Relative link to browser theme file
    this.definition = themeDefinition;
    this.page = "/waifus/index.html";
  }
}

/*Location to retrieve resources for each waifu theme*/
class WaifuThemes{
    constructor(){
        this.initThemes();
    }
    /*Initialize Waifu Themes*/
    initThemes(){
        this.themes = {
			aquaDark: new Theme("/waifus/aqua/dark/theme.json","/waifus/aqua/dark/index.html"),
			asunaLight: new Theme("/waifus/asuna/light/theme.json","/waifus/asuna/light/index.html"),
            ishtarDark: new Theme("/waifus/ishtar/dark/theme.json","/waifus/ishtar/dark/index.html"),
            ishtarLight: new Theme("/waifus/ishtar/light/theme.json","/waifus/ishtar/light/index.html")
        }
    }
    /*Retrieve the custom Waifu Tab page resource*/
    getPage(waifu){
        return this.themes[waifu].page;
    }
    /*Retrieve browser theme for Waifu*/
    getJSON(waifu){
        return this.themes[waifu].json;
    }
    /*Determine if waifu exists*/
    exists(waifu){
        return Object.keys(this.themes).includes(waifu);
    }
}
class Theme {
    constructor(json,page){
        this.json = json;
        this.page = page;
    }
}

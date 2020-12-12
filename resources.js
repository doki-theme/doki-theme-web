/*Location to retrieve resources for each waifu theme*/
class WaifuThemes{
    constructor(){
        this.initThemes();
    }
    /*Initialize Waifu Themes*/
    initThemes(){
        this.themes = {
            ishtarDark: new Theme("/waifus/ishtar/dark/theme.json","/waifus/ishtar/dark/index.html"),
            ishtarLight: new Theme("","")
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

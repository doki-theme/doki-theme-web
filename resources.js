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
			beatrice: new Theme("/waifus/beatrice/theme.json","/waifus/beatrice/index.html"),
			darknessDark: new Theme("/waifus/darkness/dark/theme.json","/waifus/darkness/dark/index.html"),
            darknessLight: new Theme("waifus/darkness/light/theme.json","/waifus/darkness/light/index.html"),
			emiliaDark: new Theme("/waifus/emilia/dark/theme.json","/waifus/emilia/dark/index.html"),
			emiliaLight: new Theme("/waifus/emilia/light/theme.json","/waifus/emilia/light/index.html"),
			hatsuneMiku:new Theme("/waifus/hatsune-miku/theme.json","waifus/hatsune-miku/index.html"),
			ishtarDark: new Theme("/waifus/ishtar/dark/theme.json","/waifus/ishtar/dark/index.html"),
            ishtarLight: new Theme("/waifus/ishtar/light/theme.json","/waifus/ishtar/light/index.html"),
			kannaDark: new Theme("/waifus/kanna/dark/theme.json","/waifus/kanna/dark/index.html"),
			konataLight: new Theme("/waifus/konata/light/theme.json","/waifus/konata/light/index.html"),
			megumin: new Theme("/waifus/megumin/theme.json","/waifus/megumin/index.html"),
			miodaIbukiDark: new Theme("/waifus/mioda-ibuki/dark/theme.json","/waifus/mioda-ibuki/dark/index.html"),
			miodaIbukiLight: new Theme("/waifus/mioda-ibuki/light/theme.json","/waifus/mioda-ibuki/light/index.html"),
			misatoKatsuragi: new Theme("/waifus/misato-katsuragi/theme.json","/waifus/misato-katsuragi/index.html"),
			monikaDark: new Theme("/waifus/monika/dark/theme.json","/waifus/monika/dark/index.html"),
			monikaLight: new Theme("/waifus/monika/light/theme.json","/waifus/monika/light/index.html"),
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

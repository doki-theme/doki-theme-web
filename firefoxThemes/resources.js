/*Location to retrieve resources for each waifu theme*/
class WaifuThemes{
    constructor(){
        this.initThemes();
    }
    /*Initialize Waifu Themes*/
    initThemes(){
        this.themes = {
			aquaDark: new Theme("Aqua","/waifus/aqua/dark/theme.json","/waifus/aqua/dark/index.html"),
			asunaLight: new Theme("Asuna","/waifus/asuna/light/theme.json","/waifus/asuna/light/index.html"),
			beatrice: new Theme("Beatrice","/waifus/beatrice/theme.json","/waifus/beatrice/index.html"),
			darknessDark: new Theme("Darkness","/waifus/darkness/dark/theme.json","/waifus/darkness/dark/index.html"),
            darknessLight: new Theme("Darkness","/waifus/darkness/light/theme.json","/waifus/darkness/light/index.html"),
			emiliaDark: new Theme("Emilia","/waifus/emilia/dark/theme.json","/waifus/emilia/dark/index.html"),
			emiliaLight: new Theme("Emilia","/waifus/emilia/light/theme.json","/waifus/emilia/light/index.html"),
			hatsuneMiku:new Theme("Hatsune Miku","/waifus/hatsune-miku/theme.json","waifus/hatsune-miku/index.html"),
			ishtarDark: new Theme("Ishtar","/waifus/ishtar/dark/theme.json","/waifus/ishtar/dark/index.html"),
            ishtarLight: new Theme("Ishtar","/waifus/ishtar/light/theme.json","/waifus/ishtar/light/index.html"),
			kannaDark: new Theme("Kanna","/waifus/kanna/dark/theme.json","/waifus/kanna/dark/index.html"),
			konataLight: new Theme("Konata","/waifus/konata/light/theme.json","/waifus/konata/light/index.html"),
			megumin: new Theme("Megumin","/waifus/megumin/theme.json","/waifus/megumin/index.html"),
			miodaIbukiDark: new Theme("Mioda Ibuki","/waifus/mioda-ibuki/dark/theme.json","/waifus/mioda-ibuki/dark/index.html"),
			miodaIbukiLight: new Theme("Mioda Ibuki","/waifus/mioda-ibuki/light/theme.json","/waifus/mioda-ibuki/light/index.html"),
			misatoKatsuragi: new Theme("Misato Katsuragi","/waifus/misato-katsuragi/theme.json","/waifus/misato-katsuragi/index.html"),
			monikaDark: new Theme("Monika","/waifus/monika/dark/theme.json","/waifus/monika/dark/index.html"),
			monikaLight: new Theme("Monika","/waifus/monika/light/theme.json","/waifus/monika/light/index.html"),
			natsukiHappyDark: new Theme("Natsuki-Happy","/waifus/natsuki/dark/theme.json","/waifus/natsuki/dark/happy/index.html"),
			natsukiSadDark: new Theme("Natsuki-Sad","/waifus/natsuki/dark/theme.json","/waifus/natsuki/dark/sad/index.html"),
			natsukiHappyLight: new Theme("Natsuki-Happy","/waifus/natsuki/light/theme.json","/waifus/natsuki/light/happy/index.html"),
			natsukiSadLight: new Theme("Natsuki-Sad","/waifus/natsuki/light/theme.json","/waifus/natsuki/light/sad/index.html"),
			ram: new Theme("Ram","/waifus/ram/theme.json","/waifus/ram/index.html"),
			rem: new Theme("Rem","/waifus/rem/theme.json","/waifus/rem/index.html"),
			rias: new Theme("Rias","/waifus/rias/theme.json","/waifus/rias/index.html"),
			roryMercury: new Theme("Rory Mercury","/waifus/rory-mercury/theme.json","/waifus/rory-mercury/index.html"),
			ryuko: new Theme("Ryuko","/waifus/ryuko/theme.json","/waifus/ryuko/index.html"),
			satsuki: new Theme("Satsuki","/waifus/satsuki/theme.json","/waifus/satsuki/index.html"),
			sayoriDark: new Theme("Sayori","/waifus/sayori/dark/theme.json","/waifus/sayori/dark/index.html"),
			sayoriLight: new Theme("Sayori","/waifus/sayori/light/theme.json","/waifus/sayori/light/index.html"),
			tohsakaRin: new Theme("Tohsaka Rin","/waifus/tohsaka-rin/theme.json","/waifus/tohsaka-rin/index.html"),
			yuriDark: new Theme("Yuri","/waifus/yuri/dark/theme.json","/waifus/yuri/dark/index.html"),
			yuriLight: new Theme("Yuri","/waifus/yuri/light/theme.json","/waifus/yuri/light/index.html"),
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
    constructor(name,json,page){
    	this.name = name;
        this.json = json;
        this.page = page;
    }
}
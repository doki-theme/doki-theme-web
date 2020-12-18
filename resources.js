/*Location to retrieve resources for each waifu theme*/
class WaifuThemes{
    constructor(){
        this.initThemes();
    }
    /*Initialize Waifu Themes*/
    initThemes(){
        this.themes = {
			aquaDark: new Theme("Aqua","waifus/aqua/aqua.png","waifus/aqua/theme.json"),
			asunaLight: new Theme("Asuna","waifus/asuna/asuna.png","waifus/asuna/theme.json"),
			beatrice: new Theme("Beatrice","waifus/beatrice/beatrice.png","waifus/beatrice/theme.json"),
			darknessDark: new Theme("Darkness","waifus/darkness/dark/darkness_dark.png","waifus/darkness/dark/theme.json"),
            darknessLight: new Theme("Darkness","waifus/darkness/light/darkness_light.png","waifus/darkness/light/theme.json"),
			emiliaDark: new Theme("Emilia","waifus/emilia/dark/emilia_dark.png","waifus/emilia/dark/theme.json"),
			emiliaLight: new Theme("Emilia","waifus/emilia/light/emilia_light.png","waifus/emilia/light/theme.json"),
			hatsuneMiku:new Theme("Hatsune Miku","waifus/hatsune-miku/miku.png","waifus/hatsune-miku/theme.json"),
			ishtarDark: new Theme("Ishtar","waifus/ishtar/dark/ishtar_dark.png","waifus/ishtar/dark/theme.json"),
            ishtarLight: new Theme("Ishtar","waifus/ishtar/light/ishtar_light.png","waifus/ishtar/light/theme.json"),
			kanna: new Theme("Kanna","waifus/kanna/kanna.png","waifus/kanna/theme.json"),
			konata: new Theme("Konata","waifus/konata/konata.png","waifus/konata/theme.json"),
			megumin: new Theme("Megumin","waifus/megumin/megumin.png","waifus/megumin/theme.json"),
			miodaIbukiDark: new Theme("Mioda Ibuki","waifus/mioda-ibuki/dark/ibuki_dark.png","waifus/mioda-ibuki/dark/theme.json"),
			miodaIbukiLight: new Theme("Mioda Ibuki","waifus/mioda-ibuki/light/ibuki_light.png","waifus/mioda-ibuki/light/theme.json"),
			misatoKatsuragi: new Theme("Misato Katsuragi","waifus/misato-katsuragi/misato.png","waifus/misato-katsuragi/theme.json"),
			monikaDark: new Theme("Monika","waifus/monika/dark/monika_dark.png","waifus/monika/dark/theme.json"),
			monikaLight: new Theme("Monika","waifus/monika/light/monika_light.png","waifus/monika/light/theme.json"),
			natsukiHappyDark: new Theme("Natsuki-Happy","waifus/natsuki/dark/natsuki_happy_dark.png","waifus/natsuki/dark/theme.json"),
			natsukiSadDark: new Theme("Natsuki-Sad","waifus/natsuki/dark/natsuki_sad_dark.png","waifus/natsuki/dark/theme.json"),
			natsukiHappyLight: new Theme("Natsuki-Happy","waifus/natsuki/light/natsuki_happy_light.png","waifus/natsuki/light/theme.json"),
			natsukiSadLight: new Theme("Natsuki-Sad","waifus/natsuki/light/natsuki_sad_light.png","waifus/natsuki/light/theme.json"),
			ram: new Theme("Ram","waifus/ram/ram.png","waifus/ram/theme.json"),
			rem: new Theme("Rem","waifus/rem/rem.png","waifus/rem/theme.json"),
			rias: new Theme("Rias","waifus/rias/rias.png","waifus/rias/theme.json"),
			roryMercury: new Theme("Rory Mercury","waifus/rory-mercury/rory.png","waifus/rory-mercury/theme.json"),
			ryuko: new Theme("Ryuko","waifus/ryuko/ryuko.png","waifus/ryuko/theme.json"),
			satsuki: new Theme("Satsuki","waifus/satsuki/satsuki.png","waifus/satsuki/theme.json"),
			sayoriDark: new Theme("Sayori","waifus/sayori/dark/sayori_dark.png","waifus/sayori/dark/theme.json"),
			sayoriLight: new Theme("Sayori","waifus/sayori/light/sayori_light.png","waifus/sayori/light/theme.json"),
			tohsakaRin: new Theme("Tohsaka Rin","waifus/tohsaka-rin/rin.png","waifus/tohsaka-rin/theme.json"),
			yuriDark: new Theme("Yuri","waifus/yuri/dark/yuri_dark.png","waifus/yuri/dark/theme.json"),
			yuriLight: new Theme("Yuri","waifus/yuri/light/yuri_light.png","waifus/yuri/light/theme.json"),
        }
    }
    /*Retrieve browser theme for Waifu*/
    getJSON(waifu){
        return this.themes[waifu].json;
    }
    getImage(waifu){
    	return this.themes[waifu].image;
	}
	getPage(waifu){
    	return this.themes[waifu].page;
	}
    /*Determine if waifu exists*/
    exists(waifu){
        return Object.keys(this.themes).includes(waifu);
    }
}
class Theme {
    constructor(name,image,json){
    	this.name = name;//Name of theme
		this.image = image;//Relative link to waifu image file
        this.json = json;//Relative link to browser theme file
		this.page = "/waifus/index.html";
    }
}
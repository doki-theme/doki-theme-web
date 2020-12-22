/*---CLASSES---*/
/*Class Goal: Holds theme data about all waifus*/
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
			monikaDarkJoy: new Theme("Monika (Joy)","waifus/monika/dark/monika_dark_joy.png","waifus/monika/dark/theme.json"),
			monikaLightJoy: new Theme("Monika (Joy)","waifus/monika/light/monika_light_joy.png","waifus/monika/light/theme.json"),
			natsukiDark: new Theme("Natsuki","waifus/natsuki/dark/natsuki_dark.png","waifus/natsuki/dark/theme.json"),
			natsukiLight: new Theme("Natsuki","waifus/natsuki/light/natsuki_light.png","waifus/natsuki/light/theme.json"),
			natsukiDarkJoy: new Theme("Natsuki (Joy)","waifus/natsuki/dark/natsuki_dark_joy.png","waifus/natsuki/dark/theme.json"),
			natsukiLightJoy: new Theme("Natsuki (Joy)","waifus/natsuki/light/natsuki_light_joy.png","waifus/natsuki/light/theme.json"),
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
}
/*Class Goal: Holds data about a theme*/
class Theme {
    constructor(name,image,json,page = "/waifus/index.html"){
    	this.name = name;//Name of theme
		this.image = image;//Relative link to waifu image file
        this.json = json;//Relative link to browser theme file
		this.page = page;//Relative link to custom new tab page
    }
}
/*---FUNCTIONS---*/
/*Initialize Local Storage & custom new tab page*/
function initPage(){
	browser.storage.local.get("waifu")
		.then((storage)=>{
			const initStorage = {
				waifuThemes: new WaifuThemes()
			};
			//Retrieve all themes if none exists in local storage
			browser.storage.local.set(initStorage);
			console.log("Waifu: "+storage.waifu);
			//Load browser theme
			if(storage.waifu){
				loadTheme(initStorage.waifuThemes.themes,storage.waifu);
			}
			//When the browser first opens, redirect to custom new tab page
			browser.tabs.update({loadReplace:true,url:"waifus/index.html"});
		});
}
/*Update all new tabs with new waifu theme*/
function updateTabs(msg){
	browser.tabs.query({title: "New Tab"})
		.then((newTabs)=>{
			browser.storage.local.get(["waifuThemes","waifu"])
				.then((storage)=>{
					const themes = storage.waifuThemes.themes;
					//Store chosen waifu in storage
					browser.storage.local.set({waifu: msg.waifu});

					if(newTabs.length > 0 && Object.keys(themes).includes(msg.waifu)){
						// Update each new tab with the Waifu Tab
						for(let tab of newTabs){
							browser.tabs.update(tab.id,{
								loadReplace: true,
								url:themes[msg.waifu].page
							});
						}
						loadTheme(themes,msg.waifu);
					}else if(!Object.keys(themes).includes(msg.waifu)){
						//Removes the previous waifu's theme from all New Tabs if the currently selected waifu
						// does not have a theme.
						for(let tab of newTabs){
							browser.tabs.update(
								tab.id,
								{
									loadReplace: true,
									url:"waifus/index.html"
								}
							);
						}
						browser.storage.local.set({waifu:undefined});
						browser.theme.reset();
					}else{
						loadTheme(themes,msg.waifu);
					}
				});
		});
}
/*Set the browser theme for chosen waifu*/
async function loadTheme(themes,waifu){
	const json = themes[waifu].json;
	fetch(json)
		.then((res)=>{
			return res.json();
		})
		.then((theme)=>{
			browser.theme.update(theme);
		});
}
//Initialize Storage
initPage();
/*---EventListeners---*/
browser.runtime.onMessage.addListener(updateTabs);

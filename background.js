/// Local Storage to hold global variables
let storage = {
	waifu: "",
	prevWaifu:"",
	themes:new WaifuThemes()
};
/*Sets the waifu browser theme*/
function setTheme(json){
	fetch(json)
		.then((res)=>{
			return res.json();
		})
		.then((theme)=>{
			browser.theme.update(theme);
		});
}
/*Creates the 'Waifu Tab Page'*/
function setPage(tabID,page){
	browser.tabs.update(
		tabID,
		{
			active:true,
			loadReplace:true,
			url:page
		}
	);
}
/*Begins creation of the custom themed 'Waifu Tab Page'*/
function themePageSetup(tabID,page,json,setNewTab){
	if(setNewTab){
		setPage(tabID,page);
	}
	setTheme(json);
}
/*Activates a theme based on the chosen waifu.*/
function activateTheme(tabID,setNewTab = true){
	if(storage.themes.exists(storage.waifu)){
		themePageSetup(tabID,storage.themes.getPage(storage.waifu),storage.themes.getJSON(storage.waifu),setNewTab);
	}else{
		browser.theme.reset();
	}
}
/*Replaces the original 'New Tab' pages with a custom themed one (Waifu Tab)*/
function newTabPage(tab){
	const pagesToEffect = tab.url.includes("about:privatebrowsing")
	||tab.url.includes("about:home")
	||tab.url.includes("about:newtab");
	if(pagesToEffect){
		activateTheme(tab.id);
	}
}
/*Update theme immediately after selecting a waifu*/
function liveUpdateTheme(){
	browser.tabs.query({active:true})
		.then((tabs)=>{
			activateTheme(tabs[0].id,false);
			storage.prevWaifu = storage.waifu;
		});
}
/*Replace all Firefox's New Tabs with a Waifu Tab*/
function setThemeForAllNewTabs(){
	browser.tabs.query({})
		.then((tabs)=>{
			const newTabs = tabs.filter(tab =>
				tab.url.includes("about:privatebrowsing")
				||tab.url.includes("about:home")
				||tab.url.includes("about:newtab")
				||tab.url.includes(browser.runtime.getURL("waifus"))
			);
			if(newTabs.length > 0 && storage.themes.exists(storage.waifu)){
				// Update each new tab with the Waifu Tab
				for(let tab of newTabs){
					browser.tabs.update(tab.id,{
						loadReplace: true,
						url:storage.themes.getPage(storage.waifu)
					});
				}
			}else if(!storage.themes.exists(storage.waifu)){
				//Close all New Tabs
				for(let tab of newTabs){
					browser.tabs.remove(tab.id);
				}
			}
		});
}
/*Receives the chosen waifu from the popup menu.
* Set the theme based on the chosen waifu.*/
function getWaifu(msg){
	storage.waifu = msg.waifu;
	if(storage.prevWaifu !== storage.waifu){
		liveUpdateTheme();
		setThemeForAllNewTabs();
	}
}
/*---Event Listeners---*/
browser.runtime.onMessage.addListener(getWaifu);
browser.tabs.onCreated.addListener(newTabPage);

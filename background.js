/// Local Storage to hold global variables
let storage = {
	waifu: ""
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
/*Creates the 'Waifu Page'*/
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
/*Begins creation of the custom themed 'Waifu Page'*/
function themePageSetup(tabID,page,json,setNewTab){
	if(setNewTab){
		setPage(tabID,page);
	}
	setTheme(json);
}
/*Activates a theme based on the chosen waifu.*/
function activateTheme(tabID,setNewTab = true){
	switch(storage.waifu) {
		case "Ishtar-Light":
			themePageSetup(tabID,"/waifus/ishtar/dark/index.html","/waifus/ishtar/dark/theme.json",setNewTab);
			break;
		case "Ishtar-Dark":
			break;
		default:
			browser.theme.reset();
			break;
	}
}
/*Replaces the original 'New Tab' pages with a custom themed one (Waifu Page)*/
function newTabPage(tab){
	const pagesToEffect = tab.url.includes("about:privatebrowsing")
	||tab.url.includes("about:home")
	||tab.url.includes("about:newtab");
	if(pagesToEffect){
		activateTheme(tab.id);
	}
}
/*Receives the chosen waifu from the popup menu.
* Set the theme based on the chosen waifu.*/
function getWaifu(msg){
	storage.waifu = msg.waifu;
	browser.tabs.query({active:true})
		.then((tabs)=>{
			activateTheme(tabs[0].id,false);
		});
}
/*---Event Listeners---*/
browser.runtime.onMessage.addListener(getWaifu);
browser.tabs.onCreated.addListener(newTabPage);

let storage = {
	waifu: ""
}
function setTheme(json){
	fetch(json)
		.then((res)=>{
			return res.json();
		})
		.then((theme)=>{
			browser.theme.update(theme);
		});
	console.log("Theme set!");
}
function setPage(tabID,page){
	browser.tabs.update(
		tabID,
		{
			active:true,
			url:page
		}
	);
}
function activateTheme(tabID){
	console.log("Activate theme!");
	console.log(`waifu: ${storage.waifu}`);
	switch(storage.waifu) {
		case "Ishtar-Light":
			setPage(tabID,"/waifus/ishtar/dark/index.html");
			setTheme("/waifus/ishtar/dark/theme.json");
			break;
		case "Ishtar-Dark":
			break;
		default:
			console.log("RESET!!");
			browser.theme.reset();
			break;
	}
}
function newTabPage(tab){
	const pagesToEffect = tab.url.includes("about:privatebrowsing")
	||tab.url.includes("about:home")
	||tab.url.includes("about:newtab");
	if(pagesToEffect){
		activateTheme(tab.id);
	}
}
function getWaifu(msg){
	storage.waifu = msg.waifu;
}
browser.runtime.onMessage.addListener(getWaifu);
browser.tabs.onCreated.addListener(newTabPage);

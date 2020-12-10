let waifu = "";
function newTabPage(tab){
	if(tab.url.includes("about:privatebrowsing")
	||tab.url.includes("about:home")
	||tab.url.includes("about:newtab")){
		browser.tabs.update(
			tab.id,
			{
				active:true,
				url:"/waifus/index.html"
			}
		);
		browser.tabs.sendMessage(
			tab.id,
			{waifu:waifu}
		);
		console.log("Background: new Tab");
	}
}
function getWaifu(message){
	if(waifu !== message.waifu){
		waifu = message.waifu;
		console.log("Background: New Waifu");
	}
	
}
browser.runtime.onMessage.addListener(getWaifu);
browser.tabs.onCreated.addListener(newTabPage);
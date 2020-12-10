function chooseWaifu(e){
	const waifuChoice = e.target.value;
	browser.runtime.sendMessage({waifu:waifuChoice});
	console.log("Popup: Waifu Chosen!");
}
document.querySelector("select").addEventListener("change",chooseWaifu,true);
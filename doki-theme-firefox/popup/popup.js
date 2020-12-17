/*Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function chooseWaifu(e){
	const waifuChoice = e.target.value;
	browser.runtime.sendMessage({waifu:waifuChoice});
}
/*---Event Listeners---*/
document.querySelector("select").addEventListener("change",chooseWaifu,true);
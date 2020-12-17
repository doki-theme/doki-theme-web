/*Retrieve the selected waifu.
Afterwards, send the chosen waifu to the background script.*/
function chooseWaifu(e){
	browser.storage.local.get("themes")
		.then((storage)=>{
			let waifuChoice = e.target.value;

			if(waifuChoice === "random"){
				waifuChoice = getRandomTheme(storage.themes.themes);
			}
			browser.runtime.sendMessage({waifu:waifuChoice});
		});

}
/*Selects a waifu at random*/
function getRandomTheme(themes){
	themes = Object.keys(themes);
	let randNum = getRandomNumber(0,themes.length);
	return themes[randNum];
}
/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min,max){
	return Math.floor(Math.random() * (max - min) ) + min;
}
/*Setup Waifu Choices for the popup menu
* Also categorizes each theme based on their type (original/dark/light)*/
function initChoice(){
	browser.storage.local.get("themes")
		.then((storage)=>{
			const themes = storage.themes.themes;
			const originalGroup = document.querySelector("optgroup[label='Original']");
			const darkGroup = document.querySelector("optgroup[label='Dark']");
			const lightGroup = document.querySelector("optgroup[label='Light']");
			for(const theme in themes){
				let opt = document.createElement("option");
				opt.setAttribute("value",theme);
				const txtNode = document.createTextNode(themes[theme].name);
				opt.append(txtNode);
				if(themes[theme].json.includes("/dark/")){
					darkGroup.append(opt);
				}else if(themes[theme].json.includes("/light/")){
					lightGroup.append(opt);
				}else{
					originalGroup.append(opt);
				}
			}
		});
}
initChoice();
/*---Event Listeners---*/
document.querySelector("select").addEventListener("change",chooseWaifu,true);
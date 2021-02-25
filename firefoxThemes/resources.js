/*Globals*/
//Enum for the different Mixed option states
const mixedStates = {
    NONE:0,
    INITIAL:1
};
/*---CLASSES---*/
/*Class Goal: Holds theme data about all waifus*/
class WaifuThemes {
    constructor() {
        this.initThemes();
    }
    /*Initialize Waifu Themes*/
    initThemes() {
        this.themes =
            Object.entries(dokiThemeDefinitions).reduce((accum, [themeId, dokiTheme]) => ({
                ...accum,
                [themeId]: new Theme(
                    dokiTheme.information.displayName,
                    dokiTheme.information.backgrounds,
                    dokiTheme.information.jsonPath,
                    dokiTheme,
                )
            }), {})
    }
}
/*Location to retrieve resources for each waifu theme*/
class Theme {
    constructor(name, backgrounds, json, themeDefinition) {
        this.name = name;//Name of theme
        this.backgrounds = backgrounds;//Relative links to each themes backgrounds
        this.json = json;//Relative link to browser theme file
        this.definition = themeDefinition;
        this.page = "/waifus/index.html";
    }
}
/*---FUNCTIONS---*/
/*Initialize Local Storage & custom new tab page*/
function startStorage() {
    browser.storage.local.get("currentThemeId")
        .then((storage) => {
            const initStorage = {
                waifuThemes: new WaifuThemes()
            };
            //Retrieve all themes if none exists in local storage
            browser.storage.local.set(initStorage);
            //Load browser theme
            if (storage.currentThemeId) {
                loadTheme(initStorage.waifuThemes.themes, storage.currentThemeId);
            }
            //When the browser first opens, redirect to custom new tab page
            browser.tabs.update({loadReplace: true, url: "waifus/index.html"});
        });
}
/*Update all new tabs with new waifu theme*/
function updateTabs(msg) {
    switch (msg.mixState){
        case mixedStates.INITIAL:
            SetupMixedUpdate();
            break;
        default:
            MixTabCleanup();
            NormalUpdate(msg);
            break;
    }
}
/*Initialize the Mixed feature*/
function SetupMixedUpdate(){
    browser.tabs.query({})
        .then((tabs)=>{
            browser.storage.local.get(["waifuThemes","mixedTabs"])
                .then((storage)=>{
                    if(!storage.mixedTabs){
                        storage.mixedTabs = new Map();//Create a new mixed tab list
                    }
                    //Activate event listeners
                    browser.tabs.onCreated.addListener(MixTabCreated);//When a tab is created
                    browser.tabs.onActivated.addListener(MixTabActivated);//When the active tab has been switched
                    browser.tabs.onRemoved.addListener(MixTabClosed);//When a tab has been closed
                    if(tabs.length > 0){
                        const themes = storage.waifuThemes.themes;
                        let currentThemeId = getRandomTheme(themes);
                        const [newTabs,otherTabs] = separateTabs(tabs);
                        storage.mixedTabs = addOtherTabsToMix(otherTabs,storage.mixedTabs,themes);
                        const lastTab = keepLastTab(newTabs);//Closes all New Tab tabs except the last
                        storage.mixedTabs.set(lastTab.id,currentThemeId);//Add a default theme to the mixed tab list
                        browser.storage.local.set({currentThemeId:currentThemeId,mixedTabs:storage.mixedTabs});
                        //Initialize each tab with the default waifu
                        browser.tabs.update(lastTab.id, {
                            loadReplace: true,
                            url: themes[currentThemeId].page
                        });
                        loadTheme(themes,currentThemeId);
                    }

                });
        });
}
/*Separate the New Tab pages from the other types of pages*/
function separateTabs(tabs){
    let newTabs = [];
    let otherTabs = [];
    for(const tab of tabs){
        if(tab.title === "New Tab"){
            newTabs.push(tab);
        }else{
            otherTabs.push(tab);
        }
    }
    return [newTabs,otherTabs];
}
/*Add all tabs that are not a new tab into the mix collection*/
function addOtherTabsToMix(tabs,mixList,themes){
    if(tabs.length > 0){
        for(const tab of tabs){
            mixList.set(tab.id,getRandomTheme(themes));
        }
    }
    return mixList;
}
/*Closes all but the last tab*/
function keepLastTab(tabs){
    const lastTabs = tabs[tabs.length - 1];
    if(tabs.length > 1){
        const newTabTotal = tabs.length - 1;
        for(let i=0;i <newTabTotal;i++){
            browser.tabs.remove(tabs[i].id);
        }
    }
    return lastTabs;
}
/*EVENT: When a new tab is created add a random theme to it*/
function MixTabCreated(tab){
    if(tab.title === "New Tab"){
        browser.storage.local.get("waifuThemes")
            .then((storage) => {
                const chosenThemeId = getRandomTheme(storage.waifuThemes.themes);
                MixedUpdate(tab,chosenThemeId,storage.waifuThemes.themes);
            });
    }
}
/*EVENT: Set the theme for the current active tab*/
function MixTabActivated(activeInfo){
    browser.storage.local.get(["waifuThemes","mixedTabs"])
        .then((storage)=>{
            const currentThemeId = storage.mixedTabs.get(activeInfo.tabId);
            if(currentThemeId){
                loadTheme(storage.waifuThemes.themes,currentThemeId);
            }
        });
}
/*EVENT: When a tab is closed delete the saved data for it*/
function MixTabClosed(tabId,removeInfo){
    browser.storage.local.get()
        .then((storage)=>{
            storage.mixedTabs.delete(tabId);
            browser.storage.local.set({mixedTabs:storage.mixedTabs});
        });
}
/*Updates the new tab with a new waifu theme*/
function MixedUpdate(tab,themeId,themes){
    browser.storage.local.get()
        .then((storage)=>{
            storage.mixedTabs.set(tab.id,themeId);//Adds the created tab to the list of mixed tabs
            browser.storage.local.set({currentThemeId:themeId,mixedTabs:storage.mixedTabs});
            //Update the tab with theme
            browser.tabs.update(tab.id, {
                loadReplace: true,
                url: themes[themeId].page
            });
            //Load browser theme
            loadTheme(themes,themeId);
        });
}
/*Cleans up all things relating to the Mixed tab option*/
async function MixTabCleanup(){
    browser.storage.local.get("mixedTabs")
        .then((storage)=>{
            //Removes all listeners
            if(browser.tabs.onCreated.hasListener(MixTabCreated)){
                browser.tabs.onCreated.removeListener(MixTabCreated);
                browser.tabs.onActivated.removeListener(MixTabActivated);
                browser.tabs.onRemoved.removeListener(MixTabClosed);
            }
            if(storage.mixedTabs){
                browser.storage.local.set({mixedTabs:undefined});
            }
        });

}
/*Update the tabs with a selected theme*/
function NormalUpdate(msg){
    browser.tabs.query({title: "New Tab"})
        .then((newTabs) => {
            browser.storage.local.get(["waifuThemes", "currentThemeId"])
                .then((storage) => {
                    const themes = storage.waifuThemes.themes;
                    //Store chosen waifu in storage
                    browser.storage.local.set({currentThemeId: msg.currentThemeId});

                    if (newTabs.length > 0 && Object.keys(themes).includes(msg.currentThemeId)) {
                        // Update each new tab with the Waifu Tab
                        for (let tab of newTabs) {
                            browser.tabs.update(tab.id, {
                                loadReplace: true,
                                url: themes[msg.currentThemeId].page
                            });
                        }
                        loadTheme(themes, msg.currentThemeId);
                    } else if (!Object.keys(themes).includes(msg.currentThemeId)) {
                        //Removes the previous waifu's theme from all New Tabs if the currently selected waifu
                        // does not have a theme.
                        for (let tab of newTabs) {
                            browser.tabs.update(
                                tab.id,
                                {
                                    loadReplace: true,
                                    url: "waifus/index.html"
                                }
                            );
                        }
                        browser.storage.local.set({currentThemeId: undefined});
                        browser.theme.reset();
                    } else {
                        loadTheme(themes, msg.currentThemeId);
                    }
                });
        });
}
/*Set the browser theme for chosen waifu*/
async function loadTheme(themes, themeId) {
    const json = themes[themeId].json;
    fetch(json)
        .then((res) => {
            return res.json();
        })
        .then((theme) => {
            browser.theme.update(theme);
        });
}

/*Selects a waifu at random*/
function getRandomTheme(themes) {
    themes = Object.keys(themes);
    let randNum = getRandomNumber(0, themes.length);
    return themes[randNum];
}

/*Retrieves a random number from min(inclusive) to max(exclusive)*/
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//Initialize Storage
startStorage();
/*---EventListeners---*/
browser.runtime.onMessage.addListener(updateTabs);

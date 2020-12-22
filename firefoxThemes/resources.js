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
                    dokiTheme.information.imagePath,
                    dokiTheme.information.jsonPath,
                    dokiTheme,
                )
            }), {})
    }
}
/*Location to retrieve resources for each waifu theme*/
class Theme {
    constructor(name, image, json, themeDefinition) {
        this.name = name;//Name of theme
        this.image = image;//Relative link to waifu image file
        this.json = json;//Relative link to browser theme file
        this.definition = themeDefinition;
        this.page = "/waifus/index.html";
    }
}
/*---FUNCTIONS---*/
/*Initialize Local Storage & custom new tab page*/
function initStorage() {
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

//Initialize Storage
initStorage();
/*---EventListeners---*/
browser.runtime.onMessage.addListener(updateTabs);

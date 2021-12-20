import {loadTheme} from "../utils/themes/browser.js";

/*Update the tabs with a selected theme*/
function normalUpdate(msg) {
  browser.tabs.query({title: "New Tab"})
    .then((newTabs) => {
      browser.storage.local.get(["waifuThemes"])
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

export {normalUpdate};
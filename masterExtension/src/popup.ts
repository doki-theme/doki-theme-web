import DokiThemeDefinitions from "./DokiThemeDefinitions";

document.addEventListener("DOMContentLoaded", () => {
  const currentThemeSelect = document.getElementById("current-theme") as HTMLSelectElement;
  if (currentThemeSelect) {
    Object.values(DokiThemeDefinitions)
      .forEach(themeDef => {
        const option = document.createElement("option");
        option.text = themeDef.information.name
        option.value = themeDef.information.id
        currentThemeSelect.add(option)
      });
    chrome.storage.local.get(['currentTheme'], ({currentTheme}) => {
      if (currentTheme) {
        // @ts-ignore
        currentThemeSelect.value = DokiThemeDefinitions[currentTheme].information.id
      }
    });
    currentThemeSelect.onchange = () => {
      // @ts-ignore
      const selectedTheme = DokiThemeDefinitions[currentThemeSelect.value];
      chrome.storage.local.set({currentTheme: currentThemeSelect.value}, () => {
        chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
          chrome.tabs.sendMessage(id || 69, {
            colors: selectedTheme.colors
          });
        });
      });
    }
  }
});

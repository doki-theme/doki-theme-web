import DokiThemeDefinitions from "./DokiThemeDefinitions";

chrome.runtime.onInstalled.addListener(() => {
  const currentTheme = '696de7c1-3a8e-4445-83ee-3eb7e9dca47f';
  chrome.storage.sync.set({currentTheme}, () => {
    console.log(`The theme is ${DokiThemeDefinitions[currentTheme].information.name}`);
  });
});

chrome.tabs.onUpdated.addListener(((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get((storage) => {
      const currentTheme = storage['currentTheme'];
      if (currentTheme && DokiThemeDefinitions[currentTheme]) {
        const dokiTheme = DokiThemeDefinitions[currentTheme];
        chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
          console.log(`Sending theme message ${dokiTheme.information.name}`);
          chrome.tabs.sendMessage(id || 69, {
            colors: dokiTheme.colors
          });
        });
      }
    });
  }
}));

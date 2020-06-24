chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({color: '#3aa757'}, () => {
    console.log('The color is green.');
  });
});

chrome.tabs.onUpdated.addListener(((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const color = 'aoeu'
    chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
      console.log(`Sending color message`);
      chrome.tabs.sendMessage(id || 69, {color})
    })
  }
}));

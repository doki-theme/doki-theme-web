/*Navigate to options page*/
function optionsPage() {
  browser.runtime.openOptionsPage();
}

/*Reload all tabs based on filter*/
async function reloadTabs(obj) {
  const tabs = await browser.tabs.query(obj);
  for await(const tab of tabs) {
    browser.tabs.reload(tab.id);
  }
}

export {optionsPage,reloadTabs};
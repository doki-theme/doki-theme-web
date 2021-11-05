import {reloadTabs} from "./utils/browser.js";
/*Registered Content Script Options*/
const registerOpt = {};

/*Apply styles configured by the options page*/
function updateOptions(element) {
  if (element.optionValue !== undefined) {
    browser.storage.local.set({[element.optionName]: !!element.optionValue});
    registerTheme(element.optionName, element.optionValue);
  } else {
    browser.storage.local.set({[element.optionName]: true});
    registerTheme(element.optionName, false);
    registerTheme(element.optionName, true);
  }
  /*Update pages with new theme*/
  reloadTabs({url: '*://*/*'});
  /*Refreshes options page to apply theme*/
  reloadTabs({title: 'Add-ons Manager'});
}

/*Registers a style*/
function registerTheme(name, shouldSet) {
  const applyName = name + 'Register';
  if (shouldSet) {
    registerContentScripts(name, applyName);
  } else {
    unregisterContentScripts(name, applyName);
  }
}

/*Register content script. (Register option theme)*/
async function registerContentScripts(name, propName) {
  const js = getContentScripts(name);
  registerOpt[propName] = await browser.contentScripts.register({
    js,
    matches: ['<all_urls>'],
  });

}

/*Unregister content scripts*/
function unregisterContentScripts(name, applyName) {
  if (registerOpt[applyName]) {
    registerOpt[applyName].unregister();
    registerOpt[applyName] = undefined;
  }
}

/*Get the paths to content scripts*/
function getContentScripts(name) {
  const scripts = [];
  const baseURL = './content_scripts/';
  switch (name) {
    case "scrollbar":
      scripts.push('scrollbar.js');
      break;
    case "textSelection":
      scripts.push('textSelect.js');
      break;
    default:
      break;
  }
  return scripts.map(script => {
    return {file: `${baseURL}${script}`};
  });
}

export {updateOptions};

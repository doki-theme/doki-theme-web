import {clickListener, multiClickListener} from "../modules/dom/listeners.js";
import {setSystemTheme} from "../modules/dom/inits.js";
/*DOM Elements*/
const loadOnStartCheckbox = document.querySelector("#loadOnStart");
const textSelectionCheckbox = document.querySelector("#textSelection");
const scrollbarCheckbox = document.querySelector("#scrollbar");
const systemThemeRadios = document.querySelectorAll("section#theme div span[role='radio']");
const root = document.querySelector(':root');

/*Set color of options menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return;
  const {colors} = chosenTheme.definition;
  root.style.setProperty('--checkbox-color', colors.accentColor);
  root.style.setProperty('--foreground-color', colors.foregroundColor);
  root.style.setProperty('--checkbox-border-color', colors.baseIconColor);
  root.style.setProperty('--header-color', colors.headerColor);
  root.style.setProperty('--checkmark-color', colors.classNameColor);
}

async function initContent() {
  const storage = await browser.storage.local.get(['systemTheme', 'loadOnStart', 'textSelection', 'scrollbar', 'waifuThemes', 'currentThemeId', 'mixedTabs'])
  initBox(loadOnStartCheckbox, !!storage.loadOnStart);
  initBox(textSelectionCheckbox, !!storage.textSelection);
  initBox(scrollbarCheckbox, !!storage.scrollbar);
  initSystemTheme(systemThemeRadios, storage.systemTheme);
  let themeId = storage.currentThemeId;
  if (storage.mixedTabs) {
    const tab = await browser.tabs.getCurrent();
    themeId = storage.mixedTabs.get(tab.id);
  }
  setCss(storage.waifuThemes.themes[themeId]);
}

/*EVENT: Alter the checkbox & apply content script option*/
const onChangeCheckEvents = async (e) => {
  changeCheckedState(e);
  await browser.runtime.sendMessage({
    resourceMSG: true,
    optionName: e.target.id,
    optionValue: e.target.className
  });
};

/*EVENT: Change the current state of the system theme radio group*/
const onChangeSystemTheme = (e) => {
  for (const el of systemThemeRadios) {
    initBox(el, el.id === e.target.id);
  }
  let isSystem = e.target.id === 'system';
  if (isSystem) {
    browser.browserSettings.overrideContentColorScheme.set({value: "system"});
  } else {
    browser.browserSettings.overrideContentColorScheme.set({value: "browser"});
  }
  browser.storage.local.set({systemTheme: e.target.id});
}

/*Initialize checkbox state*/
function initBox(el, state) {
  el.className = state ? 'checked' : '';
}

/*Initialize system theme radio group*/
function initSystemTheme(els, systemTheme) {
  setSystemTheme(systemTheme);
  /*If no system theme radio is selected choose 'default' as selected*/
  if (!systemTheme) {
    browser.storage.local.set({systemTheme:'default'});
    systemTheme = 'default';
  }

  for (const el of els) {
    initBox(el, el.id === systemTheme);
  }

}

/*Checks the boxes of an element to its opposite status*/
function changeCheckedState(e) {
  const el = e.target;
  initBox(el, !!!el.className);
}


initContent();
clickListener(loadOnStartCheckbox, onChangeCheckEvents);
clickListener(textSelectionCheckbox, onChangeCheckEvents);
clickListener(scrollbarCheckbox, onChangeCheckEvents);
multiClickListener(systemThemeRadios, onChangeSystemTheme);

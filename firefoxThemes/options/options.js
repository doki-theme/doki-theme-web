/*DOM Elements*/
const loadOnStartCheckbox = document.querySelector("#loadOnStart");
const textSelectionCheckbox = document.querySelector("#textSelection");
const scrollbarCheckbox = document.querySelector("#scrollbar");
const systemThemeCheckbox = document.querySelector("#systemThemeOpt");
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
  const storage = await browser.storage.local.get(['systemThemeOpt', 'loadOnStart', 'textSelection', 'scrollbar', 'waifuThemes', 'currentThemeId', 'mixedTabs'])
  initCheckbox(loadOnStartCheckbox, !!storage.loadOnStart);
  initCheckbox(textSelectionCheckbox, !!storage.textSelection);
  initCheckbox(scrollbarCheckbox, !!storage.scrollbar);
  initCheckbox(systemThemeCheckbox, !!storage.systemThemeOpt);
  let themeId = storage.currentThemeId;
  if (storage.mixedTabs) {
    const tab = await browser.tabs.getCurrent();
    themeId = storage.mixedTabs.get(tab.id);
  }
  setCss(storage.waifuThemes.themes[themeId]);
}

/*EVENT: Alter the checkbox & apply content script option*/
const onChangeCheckEvents = async (e) => {
  changeCheckboxState(e);
  await browser.runtime.sendMessage({
    resourceMSG: true,
    optionName: e.target.id,
    optionValue: e.target.className
  });
};
/*EVENT: Alter the checkbox & save its current state*/
const onChangeSystemTheme = (e) => {
  changeCheckboxState(e);
  let isChecked = !!e.target.className;
  if (isChecked) {
    browser.browserSettings.overrideContentColorScheme.set({value: "system"});
  } else {
    browser.browserSettings.overrideContentColorScheme.set({value: "browser"});
  }
  browser.storage.local.set({[e.target.id]: isChecked});
}

/*Initialize checkbox state*/
function initCheckbox(el, state) {
  el.className = state ? 'checked' : '';
}

/*Changes checkbox state*/
function changeCheckboxState(e) {
  const el = e.target;
  el.className = el.className !== 'checked' ? "checked" : '';
}

initContent();
loadOnStartCheckbox.addEventListener('click', onChangeCheckEvents, true);
textSelectionCheckbox.addEventListener('click', onChangeCheckEvents, true);
scrollbarCheckbox.addEventListener('click', onChangeCheckEvents, true);
systemThemeCheckbox.addEventListener('click', onChangeSystemTheme, true);

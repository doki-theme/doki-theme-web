/*DOM Elements*/
const loadOnStartCheckbox = document.querySelector("input[name=loadOnStart]");
const textSelectionCheckbox = document.querySelector("input[name=textSelection]");
const scrollbarCheckbox = document.querySelector("input[name=scrollbar]");
const root = document.querySelector(':root');
/*Set color of options menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return
  const {colors} = chosenTheme.definition
  root.style.setProperty('--header-color',colors.headerColor);
  root.style.setProperty('--foreground-color',colors.foregroundColor);
  root.style.setProperty('--base-background-color',colors.baseBackground);
  root.style.setProperty('--accent-color',colors.accentColor+'44');
}

function initContent() {
  browser.storage.local.get(['loadOnStart', 'textSelection', 'scrollbar', 'waifuThemes', 'currentThemeId'])
    .then((storage) => {
      loadOnStartCheckbox.checked = !!storage.loadOnStart;
      textSelectionCheckbox.checked = !!storage.textSelection;
      scrollbarCheckbox.checked = !!storage.scrollbar;
      setCss(storage.waifuThemes.themes[storage.currentThemeId])
    });
}

const onChangeCheckEvents = async (e) => {
  await browser.runtime.sendMessage({
    optionName: e.target.name,
    optionValue: e.target.checked
  });
};

initContent();
loadOnStartCheckbox.addEventListener('change', onChangeCheckEvents, true);
textSelectionCheckbox.addEventListener('change', onChangeCheckEvents, true);
scrollbarCheckbox.addEventListener('change', onChangeCheckEvents, true);

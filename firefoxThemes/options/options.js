const loadOnStartCheckbox = document.querySelector("input[name=loadOnStart]");
const textSelectionCheckbox = document.querySelector("input[name=textSelection]");
const scrollbarCheckbox = document.querySelector("input[name=scrollbar]");

/*Set color of options menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return
  const {colors} = chosenTheme.definition
  const styles = `
body, html {
  background-color: ${colors.headerColor};
  color: ${colors.foregroundColor};
}

* {
  background-color: ${colors.baseBackground};
 color: ${colors.foregroundColor};
}

input:checked {
  background-color: ${colors.accentColor}44;
}

label[for="loadOnStart"]
{
  color:${colors.foregroundColor};
}
        `
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet)
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

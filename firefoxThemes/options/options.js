const loadOnStartCheckbox = document.querySelector("#loadOnStart");

/*Set color of options menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return
  const { colors } = chosenTheme.definition
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

browser.storage.local.get(['loadOnStart', 'waifuThemes', 'currentThemeId'])
  .then((storage) => {
    loadOnStartCheckbox.checked = !!storage.loadOnStart;
    setCss(storage.waifuThemes.themes[storage.currentThemeId])
  });

const onLoadSwitchChange = async () => {
  await browser.storage.local.set({
    loadOnStart: loadOnStartCheckbox.checked,
  })
};

loadOnStartCheckbox.addEventListener('change', onLoadSwitchChange, true)

/*Disable/Enable druthers selection boxes*/
import {systemStates} from "../../utils/states.js";
import {populateSelect} from "../../dom/inits.js";
import {getThemeIDByName} from "../../utils/themes/theme.js";
/*Display the necessary druthers components*/
function displayDruthers(systemTheme, druthersSection) {
  const showDruthers = systemTheme === systemStates.DRUTHERS;
  druthersSection.style.display = showDruthers ? 'initial' : 'none';
}

/*EVENT: Change light theme during druthers system mode*/
function onChangeDruthersLight(e) {
  setDruthers(systemStates.LIGHT, e.target.value, false);
}

/*EVENT: Change dark theme during druthers system mode*/
function onChangeDruthersDark(e) {
  setDruthers(systemStates.DARK, e.target.value, true);
}

/*Set druthers theme choice*/
function setDruthers(scheme, value, isDark) {
  browser.storage.local.get(['druthersThemes', 'waifuThemes']).then(storage => {
    storage.druthersThemes.set(scheme, getThemeIDByName(value, isDark, storage.waifuThemes.themes));
    browser.storage.local.set({druthersThemes: storage.druthersThemes});
  });
}

/*Populate Druthers selection boxes*/
function populateDruthersOpts(druthersThemes, lightSelect, darkSelect, systemTheme, systemChoice, themes) {
  populateSelect("#druthersLightOpt", systemStates.LIGHT, systemChoice, themes);
  populateSelect("#druthersDarkOpt", systemStates.DARK, systemChoice, themes);
  const lightOpts = lightSelect.options;
  const darkOpts = darkSelect.options;
  if (druthersThemes) {
    let selectedOptId = druthersThemes.get(systemStates.LIGHT);
    if (selectedOptId) {
      for (const optEl of lightOpts) {
        optEl.selected = optEl.value === themes[selectedOptId].name
          || optEl.value === themes[selectedOptId].displayName;
      }
    }
    selectedOptId = druthersThemes.get(systemStates.DARK);
    if (selectedOptId) {
      for (const optEl of darkOpts) {
        optEl.selected = optEl.value === themes[selectedOptId].name
          || optEl.value === themes[selectedOptId].displayName;
      }
    }
  }
}

/*Initialize druthers choices*/
function initDruthers(druthersThemes, lightSelect, darkSelect, themes) {
  if (!druthersThemes) {
    druthersThemes = new Map();
    const lightThemeID = getThemeIDByName(lightSelect.options[0].value, false, themes);
    druthersThemes.set(systemStates.LIGHT, lightThemeID);
    const darkThemeID = getThemeIDByName(darkSelect.options[0].value, true, themes);
    druthersThemes.set(systemStates.DARK, darkThemeID);
    browser.storage.local.set({druthersThemes});
  }
}



export {
  initDruthers,
  displayDruthers,
  onChangeDruthersLight,
  onChangeDruthersDark,
  populateDruthersOpts
};
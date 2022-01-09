import {clickListener, multiClickListener, changeListener} from "../modules/dom/listeners.js";
import {backgroundTypes, systemStates} from "../modules/utils/states.js";
import {
  initDruthers,
  displayDruthers,
  onClickDruthersLight,
  onClickDruthersDark,
  populateDruthersOpts
} from "../modules/modes/system/druthers.js";
import {hasSecondaryBG} from "../modules/utils/themes/background.js";
import {getThemeByName} from "../modules/utils/themes/theme.js";

/*DOM Elements*/
const loadOnStartCheckbox = document.querySelector("#loadOnStart");
const textSelectionCheckbox = document.querySelector("#textSelection");
const scrollbarCheckbox = document.querySelector("#scrollbar");
const systemThemeRadios = document.querySelectorAll("section#theme div span[role='radio']");
const druthersSection = document.querySelector("section#druthersOpts");
const druthersLightSelectBox = document.querySelector("#druthersLightOpt");
const druthersDarkSelectBox = document.querySelector("#druthersDarkOpt");
const druthersLightBGCheckbox = document.querySelector("#lightSecondBG span");
const druthersLightBGSection = document.querySelector("#lightSecondBG");
const druthersLightBtn = document.querySelector("#druthersLightBtn");
const druthersDarkBGCheckbox = document.querySelector("#darkSecondBG span");
const druthersDarkBGSection = document.querySelector("#darkSecondBG");
const druthersDarkBtn = document.querySelector("#druthersDarkBtn");
const root = document.querySelector(':root');

/*Set color of options menu based on theme*/
function setCss(chosenTheme) {
  if (!chosenTheme) return;
  const {colors} = chosenTheme.definition;
  root.style.setProperty('--checkbox-color', colors.accentColor);
  root.style.setProperty('--link-color', colors.editorAccentColor);
  root.style.setProperty('--link-hover', colors.accentColor);
  root.style.setProperty('--foreground-color', colors.foregroundColor);
  root.style.setProperty('--checkbox-border-color', colors.baseIconColor);
  root.style.setProperty('--header-color', colors.headerColor);
  root.style.setProperty('--checkmark-color', colors.classNameColor);
  root.style.setProperty('--button-color', colors.buttonColor);
  root.style.setProperty('--button-font-color', colors.buttonFont);
}

async function initContent() {
  const storage = await browser.storage.local.get(['druthersBGs', 'druthersThemes', 'systemTheme', 'systemThemeChoice', 'loadOnStart', 'textSelection', 'scrollbar', 'waifuThemes', 'currentThemeId', 'mixedTabs'])
  initBox(loadOnStartCheckbox, !!storage.loadOnStart);
  initBox(textSelectionCheckbox, !!storage.textSelection);
  initBox(scrollbarCheckbox, !!storage.scrollbar);
  initSystemTheme(systemThemeRadios, storage.systemTheme);
  populateDruthersOpts(storage.druthersThemes, druthersLightSelectBox, druthersDarkSelectBox, storage.systemTheme, storage.systemThemeChoice, storage.waifuThemes.themes);
  initDruthers(storage.druthersThemes, druthersLightSelectBox, druthersDarkSelectBox, storage.waifuThemes.themes);
  initDruthersBG(storage.druthersBGs, storage.systemTheme, storage.druthersThemes, storage.waifuThemes.themes);
  let themeId = storage.currentThemeId;
  if (storage.mixedTabs) {
    const tab = await browser.tabs.getCurrent();
    themeId = storage.mixedTabs.get(tab.id);
  }
  setCss(storage.waifuThemes.themes[themeId]);
}

/*EVENT: Alter the checkbox & apply content script option*/
const onClickCheckEvents = async (e) => {
  changeCheckedState(e);
  await browser.runtime.sendMessage({
    resourceMSG: true,
    optionName: e.target.id,
    optionValue: e.target.className
  });
};

/*Initialize system theme radio group*/
function initSystemTheme(els, systemTheme) {
  /*If no system theme radio is selected choose 'all' as selected*/
  if (!systemTheme) {
    browser.storage.local.set({systemTheme: systemStates.ALL});
    systemTheme = systemStates.ALL;
  }

  for (const el of els) {
    initBox(el, el.id === systemTheme);
  }

  displayDruthers(systemTheme, druthersSection);
}

/*Initialize secondary background checkboxes for druthers mode*/
function initDruthersBG(druthersBGs, systemTheme, druthersThemes, themes) {
  if (systemTheme !== systemStates.DRUTHERS) {
    return;
  }

  const lightTheme = druthersThemes ? themes[druthersThemes.get(systemStates.LIGHT)] : false;
  const darkTheme = druthersThemes ? themes[druthersThemes.get(systemStates.DARK)] : false;

  updateDruthersBGVisibility(lightTheme, druthersLightBGSection);
  updateDruthersBGVisibility(darkTheme, druthersDarkBGSection);
  initBox(druthersLightBGCheckbox, druthersBGs.get(systemStates.LIGHT));
  initBox(druthersDarkBGCheckbox, druthersBGs.get(systemStates.DARK));
}

/*Update visibility of a druthers secondary checkbox if provided theme supports it*/
function updateDruthersBGVisibility(theme, checkbox) {
  checkbox.style.visibility = hasSecondaryBG(theme) ? 'visible' : 'collapse';
}

/*EVENT: Changes visibility of secondary checkbox for druthers based on chosen theme*/
function onChangeDruthersSecondBGCheckBox(e) {
  browser.storage.local.get(["waifuThemes"]).then(storage => {
    const isDark = e.target.dataset.theme === 'dark'; //Element MUST have `data-theme` attribute
    const theme = getThemeByName(e.target.value, isDark, storage.waifuThemes.themes);
    const checkboxSection = isDark ? druthersDarkBGSection : druthersLightBGSection;
    updateDruthersBGVisibility(theme, checkboxSection);
  });
}

/*Initialize checkbox state*/
function initBox(el, state) {
  el.className = state ? 'checked' : '';
}

const browserSettingsPermission = {
  permissions: ["browserSettings"]
};

function applySystemThemeChanges(userClickEvent,
                                 wasSystemSelected) {
  browser.storage.local.get(["waifuThemes", "systemThemeChoice", "druthersThemes", "druthersBGs"])
    .then(storage => {
      for (const el of systemThemeRadios) {
        initBox(el, el.id === userClickEvent.target.id);
      }
      if (wasSystemSelected) {
        browser.browserSettings.overrideContentColorScheme.set({value: "system"});
      } else if (browser.browserSettings) {
        browser.browserSettings.overrideContentColorScheme.set({value: "browser"});
      }
      // Show/Hide Druthers select options
      displayDruthers(userClickEvent.target.id, druthersSection);
      browser.runtime.sendMessage({
        resourceMSG: true,
        isSystemRelated: true,
        addObserver: wasSystemSelected
      });
      if (!storage.druthersBGs) {
        storage.druthersBGs = new Map();
        storage.druthersBGs.set(systemStates.LIGHT, backgroundTypes.PRIMARY);
        storage.druthersBGs.set(systemStates.DARK, backgroundTypes.PRIMARY);
      }
      browser.storage.local.set({systemTheme: userClickEvent.target.id, druthersBGs: storage.druthersBGs});
    });
}

/*EVENT: Change the current state of the system theme radio group*/
const onClickSystemTheme = (e) => {
  const wasSystemSelected = e.target.id === systemStates.DEVICE
    || e.target.id === systemStates.DRUTHERS;
  if (wasSystemSelected) {
    return browser.permissions.request(browserSettingsPermission)
      .then((grantedPermission) => {
        if (grantedPermission) {
          applySystemThemeChanges(e, wasSystemSelected);
        }
      })
  }
  applySystemThemeChanges(e, wasSystemSelected);
}

/*Change to a secondary background in druthers*/
function druthersChangeBG(checkbox, sysThemeType) {
  browser.storage.local.get(["druthersThemes", "druthersBGs", "waifuThemes"])
    .then(storage => {
      const backgroundType = checkbox.className ? backgroundTypes.SECONDARY : backgroundTypes.PRIMARY;
      storage.druthersBGs.set(sysThemeType, backgroundType);
      initDruthersBG(storage.druthersBGs, systemStates.DRUTHERS, storage.druthersThemes, storage.waifuThemes.themes);
      browser.storage.local.set({backgroundType, druthersBGs: storage.druthersBGs});
      browser.runtime.sendMessage({
        resourceMSG: true,
        currentThemeId: storage.druthersThemes.get(sysThemeType),
        noOptPageRefresh: true
      });
    });
}

/*Checks the boxes of an element to its opposite status*/
function changeCheckedState(e) {
  const el = e.target;
  initBox(el, !!!el.className);
}

initContent();
clickListener(loadOnStartCheckbox, onClickCheckEvents);
clickListener(textSelectionCheckbox, onClickCheckEvents);
clickListener(scrollbarCheckbox, onClickCheckEvents);
multiClickListener(systemThemeRadios, onClickSystemTheme);
clickListener(druthersLightBtn, () => {
  onClickDruthersLight(druthersLightSelectBox);
  druthersChangeBG(druthersLightBGCheckbox,systemStates.LIGHT);
});
clickListener(druthersDarkBtn, () => {
  onClickDruthersDark(druthersDarkSelectBox);
  druthersChangeBG(druthersDarkBGCheckbox,systemStates.DARK);
});

changeListener(druthersLightSelectBox, onChangeDruthersSecondBGCheckBox);
changeListener(druthersDarkSelectBox, onChangeDruthersSecondBGCheckBox);
clickListener(druthersDarkBGCheckbox, changeCheckedState);
clickListener(druthersLightBGCheckbox, changeCheckedState);

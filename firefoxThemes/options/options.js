import {clickListener, multiClickListener} from "../modules/dom/listeners.js";
import {backgroundTypes, systemStates} from "../modules/utils/states.js";
import {
  initDruthers,
  displayDruthers,
  onChangeDruthersLight,
  onChangeDruthersDark,
  populateDruthersOpts
} from "../modules/modes/system/druthers.js";
import {hasSecondaryBG} from "../modules/utils/themes/background.js";

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
const onChangeCheckEvents = async (e) => {
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

  const lightTheme = themes[druthersThemes.get(systemStates.LIGHT)];
  const darkTheme = themes[druthersThemes.get(systemStates.DARK)];

  druthersLightBGSection.style.visibility = hasSecondaryBG(lightTheme) ? 'visible' : 'collapse';
  druthersDarkBGSection.style.visibility = hasSecondaryBG(darkTheme) ? 'visible' : 'collapse';
  initBox(druthersLightBGCheckbox, druthersBGs.get(systemStates.LIGHT));
  initBox(druthersDarkBGCheckbox, druthersBGs.get(systemStates.DARK));
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
const onChangeSystemTheme = (e) => {
  const wasSystemSelected = e.target.id === systemStates.DEVICE
    || e.target.id === systemStates.DRUTHERS;
  if(wasSystemSelected) {
    return browser.permissions.request(browserSettingsPermission)
      .then((grantedPermission) => {
        if(grantedPermission) {
          applySystemThemeChanges(e, wasSystemSelected);
        }
      })
  }

  applySystemThemeChanges(e, wasSystemSelected);
}

/*Change to a secondary light theme background*/
function onChangeDruthersLightBG(e) {
  onChangeDruthersBG(e, systemStates.LIGHT);
}

/*Change to a secondary dark theme background*/
function onChangeDruthersDarkBG(e) {
  onChangeDruthersBG(e, systemStates.DARK);
}

/*Change to a secondary background*/
function onChangeDruthersBG(e, sysThemeType) {
  browser.storage.local.get(["druthersThemes", "druthersBGs", "druthersThemes", "waifuThemes"])
    .then(storage => {
      e.target.className = !e.target.className ? 'checked' : '';
    const backgroundType = e.target.className ? backgroundTypes.SECONDARY : backgroundTypes.PRIMARY;
    storage.druthersBGs.set(sysThemeType, backgroundType);
    initDruthersBG(storage.druthersBGs, systemStates.DRUTHERS, storage.druthersThemes, storage.waifuThemes.themes);
    browser.storage.local.set({backgroundType, druthersBGs: storage.druthersBGs});
    browser.runtime.sendMessage({
      resourceMSG: true,
      currentThemeId: storage.druthersThemes.get(sysThemeType)
    });
  });
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
clickListener(druthersLightBtn, () => {
  onChangeDruthersLight(druthersLightSelectBox)
});
clickListener(druthersDarkBtn, ()=>{
  onChangeDruthersDark(druthersDarkSelectBox);
});

clickListener(druthersDarkBGCheckbox, onChangeDruthersDarkBG);
clickListener(druthersLightBGCheckbox, onChangeDruthersLightBG);

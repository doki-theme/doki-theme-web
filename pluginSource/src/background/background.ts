import { ThemeManager } from "./themeManager";
import {
  getCurrentThemeManager,
  getThemeManager,
} from "./getCurrentThemeManager";
import { ModeSetEventPayload, PluginEvent, PluginEventTypes } from "../Events";
import { pluginSettings } from "../Storage";
import { migrateLegacyPreferencesIfNecessary } from "./LegacyMigration";

let currentThemeManager: ThemeManager;

async function setMode(payload: ModeSetEventPayload) {
  currentThemeManager.relieveOfDuty();
  const newManager = getThemeManager(payload.mode);
  await newManager.assumeCommand();
  await pluginSettings.set({ currentMode: payload.mode });
  currentThemeManager = newManager;
}

const handleMessages = (message: PluginEvent<any>) => {
  if (message.type === PluginEventTypes.MODE_SET) {
    setMode(message.payload as ModeSetEventPayload);
  }
};

const initializePlugin = async () => {
  await migrateLegacyPreferencesIfNecessary();
  currentThemeManager = await getCurrentThemeManager();
  await currentThemeManager.initializeChrome();
  chrome.runtime.onMessage.addListener(handleMessages);
};

initializePlugin().then(() => {
  console.log("Plugin Initialized!");
});

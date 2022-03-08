import { PluginLocalStorage, PluginMode, pluginSettings } from "../Storage";

function wasSystemSelected(legacyOptions: { [p: string]: any }) {
  return (
    legacyOptions.systemTheme === "device" ||
    legacyOptions.systemTheme === "druthers"
  );
}

function deriveMode(legacyOptions: { [p: string]: any }): PluginMode {
  if (legacyOptions.mixedTabs) {
    return PluginMode.MIXED;
  } else if (wasSystemSelected(legacyOptions)) {
    return PluginMode.DEVICE_MATCH;
  } else {
    return PluginMode.SINGLE;
  }
}

export async function migrateLegacyPreferencesIfNecessary(): Promise<void> {
  const options = await pluginSettings.getAll();
  if (!options.hasMigrated) {
    const legacyOptions = await chrome.storage.local.get([
      "currentThemeId",
      "loadOnStart",
      "textSelection",
      "scrollbar",
      "mixedTabs",
      "systemTheme",
      "systemThemeChoice",
    ]);

    const mode: PluginMode = deriveMode(legacyOptions);
    const migratedOptions: Partial<PluginLocalStorage> = {
      currentMode: mode,
      hasMigrated: true,
    };

    if (
      (mode === PluginMode.SINGLE || mode === PluginMode.DEVICE_MATCH) &&
      !!legacyOptions.currentThemeId
    ) {
      migratedOptions.currentTheme = legacyOptions.currentThemeId;
    }

    await pluginSettings.set(migratedOptions);
  }
}

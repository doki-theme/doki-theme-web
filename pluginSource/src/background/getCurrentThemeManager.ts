import { PluginMode, pluginSettings } from "../Storage";
import { SingleThemeManager } from "./singleThemeManager";
import { ThemeManager } from "./themeManager";

export function getThemeManager(currentMode: PluginMode) {
  switch (currentMode) {
    default:
      return new SingleThemeManager();
  }
}

export async function getCurrentThemeManager(): Promise<ThemeManager> {
  const { currentMode } = await pluginSettings.getAll();
  return getThemeManager(currentMode);
}

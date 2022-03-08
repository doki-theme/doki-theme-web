import { PluginMode, pluginSettings } from "../Storage";
import { DeviceThemeManager } from "./deviceThemeManager";
import { MixedThemeManager } from "./mixedThemeManager";
import { SingleThemeManager } from "./singleThemeManager";
import { ThemeManager } from "./themeManager";

export function getThemeManager(currentMode: PluginMode) {
  switch (currentMode) {
    case PluginMode.DEVICE_MATCH:
      return new DeviceThemeManager();
    case PluginMode.MIXED:
      return new MixedThemeManager();
    case PluginMode.SINGLE:
    default:
      return new SingleThemeManager();
  }
}

export async function getCurrentThemeManager(): Promise<ThemeManager> {
  const { currentMode } = await pluginSettings.getAll();
  return getThemeManager(currentMode);
}

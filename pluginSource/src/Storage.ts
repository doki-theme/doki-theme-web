import {
  ContentType,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
} from "./common/DokiTheme";
import { ThemePools } from "./Events";

export interface Options {
  [key: string]: string | number | boolean;
}

export enum PluginMode {
  SINGLE = "single",
  MIXED = "mixed",
  DEVICE_MATCH = "device match",
}

export interface PluginLocalStorage extends Options {
  currentMode: PluginMode;
  currentTheme: string;
  currentContentType: ContentType;
  darkThemeId: string;
  darkContentType: ContentType;
  lightThemeId: string;
  lightContentType: ContentType;
  showWidget: boolean;
  themePool: ThemePools;
  injectSelection: boolean;
  injectScrollbars: boolean;
  hasMigrated: boolean;
}

class LocalOptions<T extends Options> {
  constructor(protected readonly options: { defaults: T }) {}

  async getAll(): Promise<T> {
    const captainKeyes = Object.keys(this.options.defaults);
    const storedOptions = await browser.storage.local.get(captainKeyes);

    const fromEntries = Object.fromEntries(
      captainKeyes.map((key) => {
        const option = storedOptions[key];
        return [
          key,
          option === undefined ? this.options.defaults[key] : option,
        ];
      })
    );
    return fromEntries as T;
  }

  async set(newOption: Partial<T>): Promise<void> {
    await browser.storage.local.set(newOption);
  }
}

export const pluginSettings = new LocalOptions<PluginLocalStorage>({
  defaults: {
    currentMode: PluginMode.SINGLE,
    currentTheme: DEFAULT_DARK_THEME_ID,
    currentContentType: ContentType.PRIMARY,
    darkThemeId: DEFAULT_DARK_THEME_ID,
    darkContentType: ContentType.PRIMARY,
    lightThemeId: DEFAULT_LIGHT_THEME_ID,
    lightContentType: ContentType.PRIMARY,
    showWidget: true,
    themePool: ThemePools.DEFAULT,
    injectSelection: false,
    injectScrollbars: false,
    hasMigrated: false,
  },
});

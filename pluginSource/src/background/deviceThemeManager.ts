import {
  DeviceMatchSettingsChangedEventPayload,
  PluginEvent,
  PluginEventTypes,
  ThemeSetEventPayload,
} from "../Events";
import { pluginSettings } from "../Storage";
import { SingleThemeManager, ThemeStuff } from "./singleThemeManager";

const mediaQuery = "(prefers-color-scheme: dark)";

export class DeviceThemeManager extends SingleThemeManager {
  private darkThemeStuff: ThemeStuff = {
    themeId: undefined,
    content: undefined,
  };
  private lightThemeStuff: ThemeStuff = {
    themeId: undefined,
    content: undefined,
  };

  async initialize(): Promise<void> {
    await super.initialize();
    const { darkContentType, darkThemeId, lightContentType, lightThemeId } =
      await pluginSettings.getAll();
    this.darkThemeStuff = {
      content: darkContentType,
      themeId: darkThemeId,
    };
    this.lightThemeStuff = {
      content: lightContentType,
      themeId: lightThemeId,
    };
    DeviceThemeManager.attemptToModifyBrowserSettings();
  }

  private static attemptToModifyBrowserSettings() {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      browser.browserSettings.overrideContentColorScheme.set({
        value: "system",
      });
    } catch (e) {
      console.log("failed to set browser settings", e);
    }
  }

  private handleMediaChange(event: any) {
    this.dispatchNewThemeSet();
  }

  async getCurrentThemeId(): Promise<string> {
    return this.getCurrentThemeAndContentType().themeId!;
  }

  private dispatchNewThemeSet() {
    const { themeId, content } = this.getCurrentThemeAndContentType();
    const themeSetMessage: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: themeId!,
        content: content!,
      },
    };
    this.handleContentScriptMessage(themeSetMessage);
  }

  protected getCurrentThemeAndContentType(): ThemeStuff {
    if (DeviceThemeManager.isDark()) {
      return this.darkThemeStuff;
    }

    return this.lightThemeStuff;
  }

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.DEVICE_MATCH_SETTINGS_CHANGED) {
      await this.consumeNewSettings(message);
    } else if (message.type === PluginEventTypes.BROWSER_SETTINGS_GRANTED) {
      DeviceThemeManager.attemptToModifyBrowserSettings();
    } else {
      await super.handleMessage(message);
    }
  }

  private async consumeNewSettings(message: PluginEvent<any>) {
    const newSettings: DeviceMatchSettingsChangedEventPayload = message.payload;
    const darkThemeId = newSettings.dark.themeId;
    const darkContentType = newSettings.dark.content;
    this.darkThemeStuff = {
      themeId: darkThemeId,
      content: darkContentType,
    };
    const lightThemeId = newSettings.light.themeId;
    const lightContentType = newSettings.light.content;
    this.lightThemeStuff = {
      themeId: lightThemeId,
      content: lightContentType,
    };
    await pluginSettings.set({
      darkThemeId,
      darkContentType,
      lightThemeId,
      lightContentType,
    });
    this.dispatchNewThemeSet();
  }

  public static isDark() {
    return window.matchMedia(mediaQuery).matches;
  }

  private mediaChangeListener = this.handleMediaChange.bind(this);

  connect() {
    super.connect();
    window
      .matchMedia(mediaQuery)
      .addEventListener("change", this.mediaChangeListener);
  }

  disconnect() {
    super.disconnect();
    window
      .matchMedia(mediaQuery)
      .removeEventListener("change", this.mediaChangeListener);
  }
}

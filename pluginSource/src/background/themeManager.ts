import {DEFAULT_DOKI_THEME, DokiTheme, DokiThemes} from "../common/DokiTheme";
import {pluginSettings} from "../Storage";
import {CurrentThemeSetEventPayload, PluginEvent, PluginEventTypes, ThemeSetEventPayload,} from "../Events";

export abstract class ThemeManager {
  abstract handleMessage(message: any): Promise<void>;

  abstract getCurrentThemeId(): Promise<string>;

  async initializeTheme(): Promise<void> {
    try {
      const currentTheme = await this.getCurrentThemeId();
      await this.applyBrowserTheme(
        DokiThemes[currentTheme] || DEFAULT_DOKI_THEME
      );
    } catch (e) {
      console.error("unable to initialize theme", e);
    }
  }

  abstract getThemeForTab(tabId: number): ThemeSetEventPayload;

  protected async tellAllTabsTheirNewTheme(): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({title: "New Tab"});
      await Promise.all(
        tabs.map((tab) => {
          const tabId = tab.id!;
          const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
            type: PluginEventTypes.THEME_SET,
            payload: this.getThemeForTab(tabId),
          };
          return chrome.tabs.sendMessage(tabId, themeSetEvent)
        })
      );
    } catch (e) {
      console.error("unable to set theme", e);
    }
  }

  async initializeChrome() {
    await this.assumeCommand();
  }

  async assumeCommand() {
    await this.initialize();
    await this.initializeTheme();
    await this.tellAllTabsTheirNewTheme();
  }

  async applyBrowserTheme(dokiTheme: DokiTheme) {
    await pluginSettings.set({currentTheme: dokiTheme.themeId});
    await this.dispatchCurrentThemeSet(dokiTheme);
  }

  private async dispatchCurrentThemeSet(dokiTheme: DokiTheme) {
    const currentThemeSetEvent: PluginEvent<CurrentThemeSetEventPayload> = {
      type: PluginEventTypes.CURRENT_THEME_UPDATED,
      payload: {
        themeDefinition: dokiTheme.dokiDefinition,
      },
    };
    try {
      await chrome.runtime.sendMessage(currentThemeSetEvent);
    } catch (e) {
      console.warn("Unable to send current theme set message", e);
    }
    const tabs = await chrome.tabs.query({});
    tabs.forEach((tab) =>
      chrome.tabs
        .sendMessage(tab.id!, currentThemeSetEvent)
    )
  }

  async initialize() {
    this.connect();
  }

  private _messageListener = this.handleContentScriptMessage.bind(this);

  connect() {
    chrome.runtime.onMessage.addListener(this._messageListener);
  }

  async handleContentScriptMessage(event: PluginEvent<any>) {
    if (event.type === PluginEventTypes.THEME_SET) {
      const payload = event.payload as ThemeSetEventPayload;
      await this.applyBrowserTheme(DokiThemes[payload.themeId]);
      await pluginSettings.set({currentContentType: payload.content});
    } else if (event.type === PluginEventTypes.CONTENT_SCRIPT_INJECTED) {
      const {currentTheme} = await pluginSettings.getAll();
      await this.dispatchCurrentThemeSet(DokiThemes[currentTheme]);
    }
    await this.handleMessage(event);
  }

  protected disconnect() {
    chrome.runtime.onMessage.removeListener(this._messageListener);
  }

  relieveOfDuty() {
    this.disconnect();
  }
}

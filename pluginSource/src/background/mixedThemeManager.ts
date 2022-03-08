import { ThemeManager } from "./themeManager";
import { FireFoxDokiTheme } from "../common/DokiThemeProvider";
import {
  MixedModeSettingsChangedPayload,
  PluginEvent,
  PluginEventTypes,
  TabAttachedEventPayload,
  ThemePools,
  ThemeSetEventPayload,
} from "../Events";
import { chooseRandomTheme } from "../common/ThemeTools";
import { pluginSettings } from "../Storage";
import { DokiTheme } from "../common/DokiTheme";
import { DeviceThemeManager } from "./deviceThemeManager";
import { CollectAndDebounce } from "./collectAndDebounce";

export class MixedThemeManager extends ThemeManager {
  private tabToTheme: { [tabId: string]: FireFoxDokiTheme } = {};

  async handleMessage(message: PluginEvent<any>): Promise<void> {
    if (message.type === PluginEventTypes.TAB_ATTACHED) {
      await this.tellTabToSetItsThemePls(message);
    } else if (message.type === PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED) {
      const settingChangedPayload: MixedModeSettingsChangedPayload =
        message.payload;
      this.currentThemePool = settingChangedPayload.themePool;
      await pluginSettings.set({ themePool: this.currentThemePool });
    }
  }

  private async tellTabToSetItsThemePls(message: PluginEvent<any>) {
    const tabAttachedPayload: TabAttachedEventPayload = message.payload;
    const tabId = tabAttachedPayload.tabId;
    await this.tellTabItsTheme(tabId);
  }

  private async tellTabItsTheme(tabId: number) {
    const associatedTheme = this.getAssociatedTheme(tabId);
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: associatedTheme.themeId,
        content: associatedTheme.activeContent,
      },
    };
    try {
      await browser.tabs.sendMessage(tabId, themeSetEvent);
    } catch (e) {
      console.warn(
        `Unable to tell tab ${tabId} it's theme ${associatedTheme.themeId}`,
        e
      );
    }
  }

  private getAssociatedTheme(tabId: number): FireFoxDokiTheme {
    const rememberedTheme = this.tabToTheme[tabId];
    if (!rememberedTheme) {
      const newlyAssociatedTheme = this.createAndAssociateThemeWithTab(tabId); // todo: could infinitely recurse because this is called on an event.....
      this.tellTabItsTheme(tabId);
      return newlyAssociatedTheme;
    } else {
      return rememberedTheme;
    }
  }

  async handleTabCreation({ id }: any): Promise<void> {
    this.createAndAssociateThemeWithTab(id);
  }

  private createAndAssociateThemeWithTab(tabId: number): FireFoxDokiTheme {
    const { dokiTheme, contentType } = chooseRandomTheme(
      this.isInCurrentPool.bind(this)
    );
    this.tabToTheme[tabId] = new FireFoxDokiTheme(dokiTheme, contentType);
    return this.tabToTheme[tabId];
  }

  private debouncedSetTheme = CollectAndDebounce((tabIds: number[]) => {
    const lastActiveTab = tabIds[tabIds.length - 1];
    const dokiTheme = this.getAssociatedTheme(lastActiveTab);
    this.applyBrowserTheme(dokiTheme);
  }, 100);

  async handleTabActivation({ tabId }: any): Promise<void> {
    this.debouncedSetTheme(tabId);
  }

  async handleTabRemoval({ tabId }: any): Promise<void> {
    delete this.tabToTheme[tabId];
  }

  private currentThemePool: ThemePools = ThemePools.DEFAULT;

  async initialize() {
    await super.initialize();
    try {
      const { themePool } = await pluginSettings.getAll();
      this.currentThemePool = themePool;
    } catch (e) {
      console.warn("Unable to initialize mixed theme settings", e);
    }
  }

  private _tabCreationListener = this.handleTabCreation.bind(this);
  private tabActivationListener = this.handleTabActivation.bind(this);
  private tabRemovalListener = this.handleTabRemoval.bind(this);

  connect() {
    super.connect();
    browser.tabs.onActivated.addListener(this.tabActivationListener);
    browser.tabs.onRemoved.addListener(this.tabRemovalListener);
    browser.tabs.onCreated.addListener(this._tabCreationListener);
  }

  disconnect() {
    super.disconnect();
    browser.tabs.onActivated.removeListener(this.tabActivationListener);
    browser.tabs.onRemoved.removeListener(this.tabRemovalListener);
    browser.tabs.onCreated.removeListener(this._tabCreationListener);
  }

  private isInCurrentPool(dokiTheme: DokiTheme): boolean {
    switch (this.currentThemePool) {
      case ThemePools.MATCH_DEVICE:
        return DeviceThemeManager.isDark() === dokiTheme.dark;
      case ThemePools.LIGHT:
        return !dokiTheme.dark;
      case ThemePools.DARK:
        return dokiTheme.dark;
      case ThemePools.DEFAULT:
      default:
        return true;
    }
  }

  getThemeForTab(tabId: number): ThemeSetEventPayload {
    const theme = this.getAssociatedTheme(tabId);
    return {
      themeId: theme.dokiTheme.themeId,
      content: theme.activeContent,
    };
  }

  async getCurrentThemeId(): Promise<string> {
    const [currentTab] = await browser.tabs.query({
      currentWindow: true,
      active: true,
    });
    const tabId = currentTab?.id || -69420;
    const currentTheme = await this.getAssociatedTheme(tabId);
    return currentTheme.dokiTheme.themeId;
  }
}

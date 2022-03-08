import { PluginFeatures } from "./common/FeatureProvider";
import { ContentType, DokiThemeDefinition } from "./common/DokiTheme";
import { PluginMode } from "./Storage";

export enum PluginEventTypes {
  THEME_SET,
  FEATURE_SET,
  MODE_SET,
  TAB_ATTACHED,
  MIXED_MODE_SETTINGS_CHANGED,
  DEVICE_MATCH_SETTINGS_CHANGED,
  CURRENT_THEME_UPDATED,
  CONTENT_SCRIPT_INJECTED,
  BROWSER_SETTINGS_GRANTED,
}

export interface PluginEvent<T> {
  type: PluginEventTypes;
  payload: T;
}

export interface ThemeSetEventPayload {
  themeId: string;
  content: ContentType;
}

export interface CurrentThemeSetEventPayload {
  themeDefinition: DokiThemeDefinition;
}

export interface FeatureSetEventPayload {
  features: PluginFeatures;
}

export interface ModeSetEventPayload {
  mode: PluginMode;
}

export interface TabAttachedEventPayload {
  tabId: number;
}

export enum ThemePools {
  DEFAULT,
  LIGHT,
  DARK,
  MATCH_DEVICE,
}

export interface MixedModeSettingsChangedPayload {
  themePool: ThemePools;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContentScriptInjectedPayload {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BrowserSettingsGrantedPayload {}

export interface DeviceMatchSettingsChangedEventPayload {
  dark: ThemeSetEventPayload;
  light: ThemeSetEventPayload;
}

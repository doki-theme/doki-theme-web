import {ContentScriptInjectedPayload, CurrentThemeSetEventPayload, PluginEvent, PluginEventTypes,} from "../Events";
import {DokiThemeDefinition} from "../common/DokiTheme";
import {PluginLocalStorage, pluginSettings} from "../Storage";

export abstract class ContentInjector {
  protected constructor(
    private readonly styleId: string,
    private readonly isEnabled: (storage: PluginLocalStorage) => boolean,
  ) {
  }

  initialize() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    const injectedEvent: PluginEvent<ContentScriptInjectedPayload> = {
      type: PluginEventTypes.CONTENT_SCRIPT_INJECTED,
      payload: {},
    };
    chrome.runtime.sendMessage(injectedEvent);
  }

  private handleMessage(message: PluginEvent<any>) {
    if (message.type === PluginEventTypes.CURRENT_THEME_UPDATED) {
      this.injectContent(message);
    }
  }

  private async injectContent(message: PluginEvent<CurrentThemeSetEventPayload>) {
    const settings = await pluginSettings.getAll();
    if (this.isEnabled(settings)) {
      this.injectScript(message);
    }
  }

  private injectScript(message: PluginEvent<CurrentThemeSetEventPayload>) {
    const style = this.createStyles(message.payload.themeDefinition);
    const styleText = document.createTextNode(style);
    const styleTag = document.createElement("style");
    styleTag.id = this.styleId;
    styleTag.append(styleText);
    document.head.append(styleTag);
  }

  protected abstract createStyles(dokiTheme: DokiThemeDefinition): string;
}

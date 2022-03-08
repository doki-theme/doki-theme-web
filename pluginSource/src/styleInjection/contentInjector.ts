import {
  ContentScriptInjectedPayload,
  CurrentThemeSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";
import { DokiThemeDefinition } from "../common/DokiTheme";

export abstract class ContentInjector {
  constructor(private readonly styleId: string) {}

  initialize() {
    browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
    const injectedEvent: PluginEvent<ContentScriptInjectedPayload> = {
      type: PluginEventTypes.CONTENT_SCRIPT_INJECTED,
      payload: {},
    };
    browser.runtime.sendMessage(injectedEvent);
  }

  private handleMessage(message: PluginEvent<any>) {
    if (message.type === PluginEventTypes.CURRENT_THEME_UPDATED) {
      this.injectContent(message);
    }
  }

  private injectContent(message: PluginEvent<CurrentThemeSetEventPayload>) {
    const style = this.createStyles(message.payload.themeDefinition);
    const previousStyle = document.head.querySelector(
      `style[id='${this.styleId}']`
    );
    if (previousStyle) {
      document.head.removeChild(previousStyle);
    }
    const styleText = document.createTextNode(style);
    const styleTag = document.createElement("style");
    styleTag.id = this.styleId;
    styleTag.append(styleText);
    document.head.append(styleTag);
  }

  protected abstract createStyles(dokiTheme: DokiThemeDefinition): string;
}

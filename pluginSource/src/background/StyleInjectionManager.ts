import {
  FeatureSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";
import { pluginSettings } from "../Storage";
import RegisteredContentScript = browser.contentScripts.RegisteredContentScript;

async function reloadTabs(obj: any) {
  const tabs: chrome.tabs.Tab[] = await chrome.tabs.query(obj);
  await Promise.all(tabs.map((tab) => chrome.tabs.reload(tab.id!)));
}

export class StyleInjectionManager {
  private savedScripts: { [key: string]: RegisteredContentScript } = {};

  private async handleMessage(event: PluginEvent<any>) {
    if (event.type === PluginEventTypes.FEATURE_SET) {
      await this.updateFeatureSet(event);
    }
  }

  private async updateFeatureSet(event: PluginEvent<any>) {
    const featureSet: FeatureSetEventPayload = event.payload;

    if (featureSet.features.injectSelection) {
      await this.injectSelectionScript();
    } else {
      await this.ejectSelectionScript();
    }

    if (featureSet.features.injectScrollbars) {
      await this.injectScrollbarScript();
    } else {
      await this.ejectScrollbarScript();
    }

    await reloadTabs({ url: "*://*/*" });
  }

  private async ejectSelectionScript() {
    await this.ejectScript(this.selectionContentKey);
  }
  private async ejectScrollbarScript() {
    await this.ejectScript(this.scrollBarContentKey);
  }

  private async ejectScript(contentKey: string) {
    await this.savedScripts[contentKey]?.unregister();
  }

  private selectionContentKey = "selection";
  private async injectSelectionScript() {
    await this.injectScript(
      this.selectionContentKey,
      "js/selectionStyleInjection.js"
    );
  }
  private scrollBarContentKey = "scrollbar";
  private async injectScrollbarScript() {
    await this.injectScript(
      this.scrollBarContentKey,
      "js/scrollbarStyleInjection.js"
    );
  }

  private async injectScript(contentKey: string, script: string) {
    if (this.savedScripts[contentKey]) {
      try {
        await this.savedScripts[contentKey].unregister();
      } catch (e) {
        console.warn("unable to unregister style", e);
      }
      delete this.savedScripts[contentKey];
    }

    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
      await chrome.scripting.executeScript({
        files: [script],
        target: {tabId: tab.id!!}
      });
    } catch (e) {
      console.error("unable to set style injections", e);
    }
  }

  async initialize() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

    const { injectScrollbars, injectSelection } = await pluginSettings.getAll();
    if (injectSelection) {
      await this.injectSelectionScript();
    }

    if (injectScrollbars) {
      await this.injectScrollbarScript();
    }
  }
}

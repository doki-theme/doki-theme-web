import {
  PluginEvent,
  PluginEventTypes,
} from "../Events";

async function reloadTabs(obj: any) {
  const tabs: chrome.tabs.Tab[] = await chrome.tabs.query(obj);
  await Promise.all(tabs.map((tab) => chrome.tabs.reload(tab.id!)));
}

export class StyleInjectionManager {

  private static async handleMessage(event: PluginEvent<any>) {
    if (event.type === PluginEventTypes.FEATURE_SET) {
      await StyleInjectionManager.updateFeatureSet(event);
    }
  }

  private static async updateFeatureSet(event: PluginEvent<any>) {
    await reloadTabs({ url: "*://*/*" });
  }


  async initialize() {
    chrome.runtime.onMessage.addListener(StyleInjectionManager.handleMessage.bind(this));
  }
}

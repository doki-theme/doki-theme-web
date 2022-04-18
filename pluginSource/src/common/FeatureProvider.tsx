import React, {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import { pluginSettings } from "../Storage";
import {
  FeatureSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../Events";

export interface PluginFeatures {
  showWidget: boolean;
  injectScrollbars: boolean;
  injectSelection: boolean;
}

export interface PluginFeatureContext {
  setFeatures: (context: PluginFeatures) => void;
  isInitialized: boolean;
  features: PluginFeatures;
}

export const defaultFeatures: PluginFeatures = {
  showWidget: true,
  injectSelection: false,
  injectScrollbars: false,
};

export const FeatureContext = React.createContext<PluginFeatureContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFeatures: (context: PluginFeatures) => {},
  isInitialized: false,
  features: defaultFeatures,
});

const FeatureProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [features, setFeatures] = useState<PluginFeatures>(defaultFeatures);
  const setTheme = (context: PluginFeatures) => {
    const featureSetEvent: PluginEvent<FeatureSetEventPayload> = {
      type: PluginEventTypes.FEATURE_SET,
      payload: {
        features: context,
      },
    };
    setFeatures(context);
    pluginSettings.set({
      showWidget: context.showWidget,
      injectSelection: context.injectSelection,
      injectScrollbars: context.injectScrollbars,
    });
    chrome.runtime.sendMessage(featureSetEvent);
  };

  useEffect(() => {
    pluginSettings.getAll().then((setting) => {
      setFeatures({
        showWidget: setting.showWidget,
        injectScrollbars: setting.injectScrollbars,
        injectSelection: setting.injectSelection,
      });
      setInitialized(true);
    });
  }, []);

  const featureContext = useMemo<PluginFeatureContext>(
    () => ({
      setFeatures: setTheme,
      isInitialized: initialized,
      features,
    }),
    [initialized, features]
  );

  return (
    <FeatureContext.Provider value={featureContext}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureProvider;

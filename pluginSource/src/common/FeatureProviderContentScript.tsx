import React, {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import { pluginSettings } from "../Storage";
import { FeatureSetEventPayload, PluginEventTypes } from "../Events";

export interface PluginFeatures {
  showWidget: boolean;
}

export interface PluginFeatureContext {
  setFeatures: (context: PluginFeatures) => void;
  isInitialized: boolean;
  features: PluginFeatures;
}

export const defaultFeatures = {
  showWidget: true,
};

export const FeatureContextContentScript =
  React.createContext<PluginFeatureContext>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setFeatures: () => {},
    isInitialized: false,
    features: defaultFeatures,
  });

const FeatureProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [features, setFeatures] = useState<PluginFeatures>(defaultFeatures);
  const setTheme = (context: PluginFeatures) => {
    // no-op
  };

  useEffect(() => {
    pluginSettings.getAll().then((setting) => {
      setFeatures({
        showWidget: setting.showWidget,
      });
      setInitialized(true);

      const featureSetListener = (message: any) => {
        if (message.type === PluginEventTypes.FEATURE_SET) {
          const payload: FeatureSetEventPayload = message.payload;
          setFeatures(payload.features);
        }
      };
      chrome.runtime.onMessage.addListener(featureSetListener);
      return () => {
        chrome.runtime.onMessage.removeListener(featureSetListener);
      };
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
    <FeatureContextContentScript.Provider value={featureContext}>
      {children}
    </FeatureContextContentScript.Provider>
  );
};

export default FeatureProvider;

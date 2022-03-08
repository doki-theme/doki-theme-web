import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ContentType,
  DEFAULT_DOKI_THEME,
  DEFAULT_DARK_THEME_ID,
  DokiThemes,
} from "./DokiTheme";
import { PluginEvent, PluginEventTypes, ThemeSetEventPayload } from "../Events";
import { DokiThemeContext, FireFoxDokiTheme } from "./DokiThemeProvider";
import { notifyTabAttached } from "../tab/TabBackgroundListener";

export const ThemeContextContentScript = React.createContext<DokiThemeContext>({
  theme: new FireFoxDokiTheme(DEFAULT_DOKI_THEME, ContentType.PRIMARY),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
  isInitialized: false,
});

const DokiThemeProviderContentScript: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_DARK_THEME_ID);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<ContentType>(
    ContentType.PRIMARY
  );
  const setTheme = () => {
    // no-op
  };

  useEffect(() => {
    const themeSetListener = (message: PluginEvent<any>) => {
      if (message.type === PluginEventTypes.THEME_SET) {
        const payload: ThemeSetEventPayload = message.payload;
        setThemeId(payload.themeId);
        setCurrentContent(payload.content);
        setInitialized(true);
      }
    };
    browser.runtime.onMessage.addListener(themeSetListener);
    notifyTabAttached();
    return () => {
      browser.runtime.onMessage.removeListener(themeSetListener);
    };
  }, []);

  const themeContext = useMemo<DokiThemeContext>(
    () => ({
      setTheme,
      theme: new FireFoxDokiTheme(DokiThemes[themeId], currentContent),
      isInitialized: initialized,
    }),
    [themeId, initialized, currentContent]
  );

  return (
    <ThemeContextContentScript.Provider value={themeContext}>
      {children}
    </ThemeContextContentScript.Provider>
  );
};

export default DokiThemeProviderContentScript;

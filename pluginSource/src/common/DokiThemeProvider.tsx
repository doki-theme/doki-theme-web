import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ContentType,
  DEFAULT_DOKI_THEME,
  DEFAULT_DARK_THEME_ID,
  DokiTheme,
  DokiThemes,
} from "./DokiTheme";
import { pluginSettings } from "../Storage";
import {
  CurrentThemeSetEventPayload,
  PluginEvent,
  PluginEventTypes,
  ThemeSetEventPayload,
} from "../Events";
import { Sticker } from "doki-build-source";

export class FireFoxDokiTheme extends DokiTheme {
  constructor(
    readonly dokiTheme: DokiTheme,
    readonly activeContent: ContentType
  ) {
    super(dokiTheme.dokiDefinition);
  }

  public get content(): Sticker {
    return this.activeContent === ContentType.SECONDARY
      ? this.secondaryContent
      : this.defaultContent;
  }
}

export interface ThemeContext {
  selectedTheme: DokiTheme;
  contentType: ContentType;
}

export interface DokiThemeContext {
  theme: FireFoxDokiTheme;
  setTheme: (context: ThemeContext) => void;
  isInitialized: boolean;
}

export const ThemeContext = React.createContext<DokiThemeContext>({
  theme: new FireFoxDokiTheme(DEFAULT_DOKI_THEME, ContentType.PRIMARY),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: (context: ThemeContext) => {},
  isInitialized: false,
});

const DokiThemeProvider: FC = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(DEFAULT_DARK_THEME_ID);
  const [currentContent, setCurrentContent] = useState<ContentType>(
    ContentType.PRIMARY
  );
  const [initialized, setInitialized] = useState<boolean>(false);
  const setTheme = (context: ThemeContext) => {
    const nextTheme = context.selectedTheme.themeId;
    setThemeId(nextTheme);
    const themeSetEvent: PluginEvent<ThemeSetEventPayload> = {
      type: PluginEventTypes.THEME_SET,
      payload: {
        themeId: nextTheme,
        content: context.contentType,
      },
    };
    setCurrentContent(context.contentType);
    browser.runtime.sendMessage(themeSetEvent);
  };

  useEffect(() => {
    pluginSettings.getAll().then((settings) => {
      const currentTheme = settings.currentTheme;
      if (currentTheme) {
        setThemeId(currentTheme);
      }
      const activeContent = settings.currentContentType;
      if (activeContent) {
        setCurrentContent(activeContent);
      }
      setInitialized(true);

      const themeSetListener = (message: PluginEvent<any>) => {
        if (message.type === PluginEventTypes.CURRENT_THEME_UPDATED) {
          const payload: CurrentThemeSetEventPayload = message.payload;
          setThemeId(payload.themeDefinition.information.id);
        }
      };
      browser.runtime.onMessage.addListener(themeSetListener);
      return () => {
        browser.runtime.onMessage.removeListener(themeSetListener);
      };
    });
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
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default DokiThemeProvider;

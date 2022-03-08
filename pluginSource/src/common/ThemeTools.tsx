import React, { FC, useEffect } from "react";
import { ContentType, DokiTheme, DokiThemes } from "./DokiTheme";
import sample from "lodash/sample";

export const ThemeStuff: FC<{ theme: DokiTheme }> = ({ theme }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-background",
      theme.colors.baseBackground
    );
    document.documentElement.style.setProperty(
      "--highlight-color",
      theme.colors.highlightColor
    );
    document.documentElement.style.setProperty(
      "--accent-color",
      theme.colors.accentColor
    );
    document.documentElement.style.setProperty(
      "--base-icon-color",
      theme.colors.baseIconColor
    );
  }, [theme]);
  return <></>;
};

export function chooseRandomTheme(
  themePredicate: (dokiTheme: DokiTheme) => boolean = () => true
): {
  dokiTheme: DokiTheme;
  contentType: ContentType;
} {
  const dokiTheme = sample(Object.values(DokiThemes).filter(themePredicate))!;
  const contentType = dokiTheme.hasSecondaryContent
    ? sample([ContentType.SECONDARY, ContentType.PRIMARY])!
    : ContentType.PRIMARY;
  return {
    dokiTheme,
    contentType,
  };
}

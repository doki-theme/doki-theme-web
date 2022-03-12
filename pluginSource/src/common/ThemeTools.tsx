import React, { FC, useEffect } from "react";
import { DokiTheme} from "./DokiTheme";

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

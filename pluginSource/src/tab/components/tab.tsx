import React, { useEffect } from "react";
import { ThemeContextContentScript } from "../../common/DokiThemeProviderContentScript";
import { ThemeStuff } from "../../common/ThemeTools";
import SearchWidget from "./SearchWidget";
import { FeatureContextContentScript } from "../../common/FeatureProviderContentScript";

const Tab = () => {
  return (
    <ThemeContextContentScript.Consumer>
      {({ theme, isInitialized }) => {
        if (!isInitialized) return <></>;
        return (
          <FeatureContextContentScript.Consumer>
            {({ features, isInitialized }) => (
              <>
                <ThemeStuff theme={theme}></ThemeStuff>
                <div
                  style={{
                    color: theme.colors.foregroundColor,
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: theme.content.anchor,
                    backgroundImage: `url(${browser.runtime.getURL(
                      "backgrounds/" + theme.content.name
                    )})`,
                  }}
                >
                  {isInitialized && features.showWidget && (
                    <SearchWidget theme={theme} />
                  )}
                </div>
              </>
            )}
          </FeatureContextContentScript.Consumer>
        );
      }}
    </ThemeContextContentScript.Consumer>
  );
};

export default Tab;

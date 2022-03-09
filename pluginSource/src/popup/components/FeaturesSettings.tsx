import React from "react";
import {ThemeContext} from "../../common/DokiThemeProvider";
import {FeatureContext} from "../../common/FeatureProvider";
import ThemedSwitch from "./ThemedSwitch";

const FeaturesSettings = () => {
  return (
    <ThemeContext.Consumer>
      {({theme}) => (
        <FeatureContext.Consumer>
          {({features, setFeatures}) => {
            const handleWidgetChange = (isSet: boolean) => {
              setFeatures({
                ...features,
                showWidget: isSet,
              });
            };
            return (
              <div style={{display: "block", flexDirection: "column"}}>
                <label style={{display: "block", marginBottom: "1rem"}}>
                  <span style={{color: theme.colors.infoForeground}}>
                    Show Search Widget
                  </span>
                  <br style={{marginBottom: "0.5rem"}}/>
                  <ThemedSwitch
                    onChange={handleWidgetChange}
                    checked={features.showWidget}
                  />
                </label>
              </div>
            );
          }}
        </FeatureContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
};

export default FeaturesSettings;

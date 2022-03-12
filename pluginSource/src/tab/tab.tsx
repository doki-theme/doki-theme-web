import * as React from "react";
import * as ReactDOM from "react-dom";
import Tab from "./components/tab";
import DokiThemeProviderContentScript from "../common/DokiThemeProviderContentScript";
import FeatureProviderContentScripts from "../common/FeatureProviderContentScript";
import { attachBackgroundListener } from "./TabBackgroundListener";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    attachBackgroundListener();
    ReactDOM.render(
      <DokiThemeProviderContentScript>
        <FeatureProviderContentScripts>
          <Tab />
        </FeatureProviderContentScripts>
      </DokiThemeProviderContentScript>,
      document.getElementById("tab")
    );
  },
  false
);

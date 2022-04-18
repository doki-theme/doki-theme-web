import * as React from "react";
import { createRoot } from "react-dom/client";
import Tab from "./components/tab";
import DokiThemeProviderContentScript from "../common/DokiThemeProviderContentScript";
import FeatureProviderContentScripts from "../common/FeatureProviderContentScript";
import { attachBackgroundListener } from "./TabBackgroundListener";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    attachBackgroundListener();
    const container = document.getElementById("tab");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(container!);
    root.render(
      <DokiThemeProviderContentScript>
        <FeatureProviderContentScripts>
          <Tab />
        </FeatureProviderContentScripts>
      </DokiThemeProviderContentScript>
    );

  },
  false
);

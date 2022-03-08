import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./components/popup";
import DokiThemeProvider from "../common/DokiThemeProvider";
import FeatureProvider from "../common/FeatureProvider";
import "react-tabs/style/react-tabs.css";

chrome.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <DokiThemeProvider>
      <FeatureProvider>
        <Popup />
      </FeatureProvider>
    </DokiThemeProvider>,
    document.getElementById("popup")
  );
});

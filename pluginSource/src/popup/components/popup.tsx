import React, {useEffect, useState} from "react";
import {ThemeContext} from "../../common/DokiThemeProvider";
import {ThemeStuff} from "../../common/ThemeTools";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "./popup.css";
import FeaturesSettings from "./FeaturesSettings";
import DokiIcon from "../../common/DokiIcon";

const Popup = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setInitialized(true);
  }, []);
  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        const colors = theme.colors;
        return (
          <div
            style={{
              backgroundColor: colors.baseBackground,
              color: colors.foregroundColor,
              padding: "1rem",
              minHeight: "500px",
              minWidth: "250px",
            }}
          >
            <ThemeStuff theme={theme}></ThemeStuff>
            {initialized ? (
              <>
                <header
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h1 style={{margin: "0 0 1rem 0", flexGrow: 1}}>
                    Doki Theme
                  </h1>
                  <DokiIcon width={32} height={32} theme={theme}/>
                </header>
                <Tabs>
                  <TabList className="doki-tabs__tab-list">
                    <Tab selectedClassName="doki-tabs__tab--selected">
                      Plugin Features
                    </Tab>
                  </TabList>
                  <TabPanel>
                    <FeaturesSettings/>
                  </TabPanel>
                </Tabs>
              </>
            ) : (
              <></>
            )}
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default Popup;

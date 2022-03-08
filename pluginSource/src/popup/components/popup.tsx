import React, { useEffect, useState } from "react";
import { ThemeContext } from "../../common/DokiThemeProvider";
import ThemedSelect from "./ThemedSelect";
import { PluginMode, pluginSettings } from "../../Storage";
import { OptionSwitch } from "./optionSwitch";
import { ThemeStuff } from "../../common/ThemeTools";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "./popup.css";
import {
  ModeSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../../Events";
import FeaturesSettings from "./FeaturesSettings";
import DokiIcon from "../../common/DokiIcon";

const options: { value: PluginMode; label: string }[] = [
  { value: PluginMode.SINGLE, label: "Individual" },
  { value: PluginMode.DEVICE_MATCH, label: "Device Match" },
  { value: PluginMode.MIXED, label: "Mixed" },
];

const Popup = () => {
  const [currentMode, setCurrentMode] = useState<PluginMode>(options[0].value);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    pluginSettings.getAll().then(({ currentMode }) => {
      setCurrentMode(currentMode);
      setInitialized(true);
    });
  }, []);
  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const colors = theme.colors;
        const handleModeChange = (thing: any) => {
          setCurrentMode(thing!.value);
          const modeSetEvent: PluginEvent<ModeSetEventPayload> = {
            type: PluginEventTypes.MODE_SET,
            payload: {
              mode: thing!.value,
            },
          };
          chrome.runtime.sendMessage(modeSetEvent);
        };
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
                  <h1 style={{ margin: "0 0 1rem 0", flexGrow: 1 }}>
                    Doki Theme
                  </h1>
                  <DokiIcon width={32} height={32} theme={theme} />
                </header>
                <Tabs>
                  <TabList className="doki-tabs__tab-list">
                    <Tab selectedClassName="doki-tabs__tab--selected">
                      Theme Settings
                    </Tab>
                    <Tab selectedClassName="doki-tabs__tab--selected">
                      Plugin Features
                    </Tab>
                  </TabList>
                  <TabPanel>
                    <label>
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "1.25",
                        }}
                      >
                        Plugin Mode
                      </span>
                      <br style={{ marginBottom: "0.5rem" }} />
                      <ThemedSelect
                        options={options}
                        onChange={handleModeChange}
                        defaultValue={
                          options.find(
                            (option) => option.value === currentMode
                          )!
                        }
                      />
                    </label>
                    <hr
                      style={{
                        marginTop: "1rem",
                        borderColor: colors.infoForeground,
                        borderStyle: "dotted",
                      }}
                    />
                    <OptionSwitch pluginMode={currentMode} />
                  </TabPanel>
                  <TabPanel>
                    <FeaturesSettings />
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

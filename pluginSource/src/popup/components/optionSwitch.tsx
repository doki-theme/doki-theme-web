import React, { FC } from "react";
import { PluginMode } from "../../Storage";
import SingleModeSettings from "./singleModeSettings";
import MixedModeSettings from "./mixedModeSettings";
import DeviceMatchSettings from "./deviceMatchSettings";

export const OptionSwitch: FC<{ pluginMode: PluginMode }> = ({
  pluginMode,
}) => {
  switch (pluginMode) {
    case PluginMode.DEVICE_MATCH:
      return <DeviceMatchSettings />;
    case PluginMode.MIXED:
      return <MixedModeSettings />;
    case PluginMode.SINGLE:
    default:
      return <SingleModeSettings />;
  }
};

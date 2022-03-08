import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  MixedModeSettingsChangedPayload,
  PluginEvent,
  PluginEventTypes,
  ThemePools,
} from "../../Events";
import DokiButton from "../../common/DokiButton";
import { pluginSettings } from "../../Storage";
import DokiRadioButton from "./DokiRadioButton";

interface FormValues {
  themePool: ThemePools;
}

const MixedModeSettings = () => {
  const [initialValues, setInitialValues] = useState<FormValues | undefined>();

  useEffect(() => {
    pluginSettings.getAll().then((settings) => {
      setInitialValues({
        themePool: settings.themePool,
      });
    });
  }, []);

  const dispatchMixedModeSettingsChanges = (formValues: FormValues) => {
    const mixedModesSettingsChanged: PluginEvent<MixedModeSettingsChangedPayload> =
      {
        type: PluginEventTypes.MIXED_MODE_SETTINGS_CHANGED,
        payload: {
          themePool: formValues.themePool,
        },
      };
    chrome.runtime.sendMessage(mixedModesSettingsChanged);
  };

  if (!initialValues) {
    return <></>;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          dispatchMixedModeSettingsChanges(values);

          formikHelpers.resetForm({
            values: values,
          });
        }}
      >
        {({ handleSubmit, isSubmitting, dirty, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <>
              <h3 style={{ marginTop: "1rem" }} id="themePoolGroup">
                Theme Pool
              </h3>
              <div
                role="group"
                aria-labelledby="themePoolGroup"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1rem",
                }}
              >
                <DokiRadioButton
                  type="radio"
                  name="themePool"
                  value={ThemePools.DEFAULT}
                  onChange={() => {
                    setFieldValue("themePool", ThemePools.DEFAULT);
                  }}
                >
                  All Themes
                </DokiRadioButton>
                <DokiRadioButton
                  type="radio"
                  name="themePool"
                  value={ThemePools.DARK}
                  onChange={() => {
                    setFieldValue("themePool", ThemePools.DARK);
                  }}
                >
                  Dark Only
                </DokiRadioButton>
                <DokiRadioButton
                  type="radio"
                  name="themePool"
                  value={ThemePools.LIGHT}
                  onChange={() => {
                    setFieldValue("themePool", ThemePools.LIGHT);
                  }}
                >
                  Light Only
                </DokiRadioButton>
                <DokiRadioButton
                  type="radio"
                  name="themePool"
                  value={ThemePools.MATCH_DEVICE}
                  onChange={() => {
                    setFieldValue("themePool", ThemePools.MATCH_DEVICE);
                  }}
                >
                  Match Device
                </DokiRadioButton>
              </div>
              <DokiButton type="submit" disabled={isSubmitting || !dirty}>
                Apply
              </DokiButton>
            </>
          </form>
        )}
      </Formik>
    </>
  );
};

export default MixedModeSettings;

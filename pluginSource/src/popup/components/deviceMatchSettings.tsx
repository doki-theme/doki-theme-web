import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserSettingsGrantedPayload,
  DeviceMatchSettingsChangedEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../../Events";
import { Formik } from "formik";
import { createCharacterThemes } from "./Characters";
import DokiThemeDefinitions from "../../DokiThemeDefinitions";
import {
  CharacterTheme,
  ContentType,
  DokiTheme,
  DokiThemeDefinition,
} from "../../common/DokiTheme";
import DokiThemeComponent, { CharacterOption } from "./DokiThemeComponent";
import { pluginSettings } from "../../Storage";
import DokiButton from "../../common/DokiButton";
import OptionalPermission = browser._manifest.OptionalPermission;

type ThemeOption = {
  character: CharacterTheme;
  contentType: ContentType;
  selectedTheme: DokiTheme;
};

interface FormValues {
  dark: ThemeOption;
  light: ThemeOption;
}

const permissions: OptionalPermission[] = ["browserSettings"];
const browserSettingsPermissions = {
  permissions,
};

function createDeviceOption(
  dokiDefs: DokiThemeDefinition[]
): CharacterOption[] {
  const lightCharacterOptions = createCharacterThemes(dokiDefs).map(
    (characterTheme) => ({
      value: characterTheme,
      label: characterTheme.name,
    })
  );
  lightCharacterOptions.sort((a, b) => a.label.localeCompare(b.label));
  return lightCharacterOptions;
}

const DeviceMatchSettings = () => {
  const {
    darkCharacterOptions,
    lightCharacterOptions,
  }: {
    darkCharacterOptions: CharacterOption[];
    lightCharacterOptions: CharacterOption[];
  } = useMemo(() => {
    const lightCharacterOptions = createDeviceOption(
      Object.values(DokiThemeDefinitions).filter((def) => !def.information.dark)
    );
    const darkCharacterOptions = createDeviceOption(
      Object.values(DokiThemeDefinitions).filter((def) => def.information.dark)
    );
    return {
      lightCharacterOptions,
      darkCharacterOptions,
    };
  }, []);

  const [darkOption, setDarkOption] = useState<ThemeOption>({
    character: darkCharacterOptions[0]!.value,
    contentType: ContentType.PRIMARY,
    selectedTheme: darkCharacterOptions[0]!.value.themes[0],
  });
  const [lightOption, setLightOption] = useState<ThemeOption>({
    character: lightCharacterOptions[0]!.value,
    contentType: ContentType.PRIMARY,
    selectedTheme: lightCharacterOptions[0]!.value.themes[0],
  });

  const initialValues: FormValues = {
    dark: darkOption,
    light: lightOption,
  };

  const dispatchDeviceMatchSettingsChanges = (formValues: FormValues) => {
    const deviceMatchSettingsChanged: PluginEvent<DeviceMatchSettingsChangedEventPayload> =
      {
        type: PluginEventTypes.DEVICE_MATCH_SETTINGS_CHANGED,
        payload: {
          dark: {
            themeId: formValues.dark.selectedTheme.themeId,
            content: formValues.dark.contentType,
          },
          light: {
            themeId: formValues.light.selectedTheme.themeId,
            content: formValues.light.contentType,
          },
        },
      };
    browser.runtime.sendMessage(deviceMatchSettingsChanged);
  };

  const [initialized, setInitialized] = useState(false);
  const [hasSettingsPermission, setHasSettingsPermissions] = useState(false);

  useEffect(() => {
    const permissionPromise = browser.permissions
      .contains(browserSettingsPermissions)
      .then((granted) => {
        setHasSettingsPermissions(granted);
      });
    const settingsPromise = pluginSettings.getAll().then((settings) => {
      const darkThemeId = settings.darkThemeId;
      const darkContentType = settings.darkContentType;
      const darkCharacter = darkCharacterOptions.find((character) =>
        character.value.themes.some((theme) => theme.themeId === darkThemeId)
      )!;
      setDarkOption({
        character: darkCharacter.value,
        contentType: darkContentType,
        selectedTheme: darkCharacter.value.themes.find(
          (theme) => theme.themeId === darkThemeId
        )!,
      });

      const lightThemeId = settings.lightThemeId;
      const lightContentType = settings.lightContentType;
      const lightCharacter = lightCharacterOptions.find((character) =>
        character.value.themes.some((theme) => theme.themeId === lightThemeId)
      )!;
      setLightOption({
        character: lightCharacter.value,
        contentType: lightContentType,
        selectedTheme: lightCharacter.value.themes.find(
          (theme) => theme.themeId === lightThemeId
        )!,
      });
    });

    Promise.all([permissionPromise, settingsPromise]).then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return <></>;
  }

  const grantPermission = () => {
    browser.permissions.request(browserSettingsPermissions).then((granted) => {
      setHasSettingsPermissions(granted);
      if (granted) {
        const event: PluginEvent<BrowserSettingsGrantedPayload> = {
          payload: {},
          type: PluginEventTypes.BROWSER_SETTINGS_GRANTED,
        };
        browser.runtime.sendMessage(event);
      }
    });
  };

  if (initialized && !hasSettingsPermission) {
    return (
      <div>
        <p>
          The Doki Theme needs your permission to <br />
          modify your browser settings to <br />
          match the "System" setting for this feature to work.
        </p>
        <DokiButton onClick={grantPermission}>Allow Access</DokiButton>
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          dispatchDeviceMatchSettingsChanges(values);
          formikHelpers.resetForm({
            values: values,
          });
        }}
      >
        {({ values, handleSubmit, isSubmitting, dirty, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ marginTop: "1rem" }}>
              <h3>Light Theme</h3>
              <DokiThemeComponent
                values={values}
                options={lightCharacterOptions}
                prefix={"light"}
                setFieldValue={setFieldValue}
              />
              <hr style={{ margin: "2.5rem 0", border: "none" }} />

              <h3>Dark Theme</h3>
              <DokiThemeComponent
                values={values}
                options={darkCharacterOptions}
                prefix={"dark"}
                setFieldValue={setFieldValue}
              />

              <DokiButton
                style={{ marginTop: "1rem" }}
                type="submit"
                disabled={isSubmitting || !dirty}
              >
                Apply
              </DokiButton>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default DeviceMatchSettings;

import React, { FC } from "react";
import ThemedSelect from "./ThemedSelect";
import { CharacterTheme, ContentType, DokiTheme } from "../../common/DokiTheme";
import { ThemeContext } from "../../common/DokiThemeProvider";
import DokiRadioButton from "./DokiRadioButton";

function createThemeVariantName(theme: DokiTheme) {
  const trimmedVariant = theme.name
    .replace(theme.displayName, "")
    .replace(":", "")
    .trim();
  return trimmedVariant || (theme.dark ? "Dark" : "Light");
}

function getThemeSelector(
  values: any,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  prefix: string,
  theme: DokiTheme
) {
  const options = values[prefix].character.themes.map((theme: DokiTheme) => ({
    value: theme,
    label: createThemeVariantName(theme),
  }));
  return (
    <div style={{ marginTop: "1rem" }}>
      <label>
        <span style={{ color: theme.colors.infoForeground }}>
          Theme Variant
        </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSelect
          options={options}
          value={{
            value: values[prefix].selectedTheme,
            label: createThemeVariantName(values[prefix].selectedTheme),
          }}
          onChange={(selectedCharacter) =>
            setFieldValue(`${prefix}.selectedTheme`, selectedCharacter!.value)
          }
        />
      </label>
    </div>
  );
}

export type CharacterOption = { label: string; value: CharacterTheme };

interface Props {
  values: any;
  setFieldValue: any;
  prefix: string;
  options: CharacterOption[];
}

const DokiThemeComponent: FC<Props> = ({
  values,
  setFieldValue,
  prefix,
  options,
}) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <div>
          <label>
            <span style={{ color: theme.colors.infoForeground }}>
              Choose a character
            </span>{" "}
            <br style={{ marginBottom: "0.5rem" }} />
            <ThemedSelect
              options={options}
              value={{
                label: values[prefix].character.name,
                value: values[prefix].character,
              }}
              onChange={(selectedCharacter) => {
                const characterValue = selectedCharacter!.value;
                setFieldValue(
                  `${prefix}.selectedTheme`,
                  characterValue.themes[0]
                );
                return setFieldValue(`${prefix}.character`, characterValue);
              }}
            />
          </label>

          {values[prefix].character.hasMultipleThemes &&
            getThemeSelector(values, setFieldValue, prefix, theme)}

          {values[prefix].character.hasSecondaryContent && (
            <>
              <div style={{ margin: "1rem 0 0.5rem 0" }} id="contentTypeGroup">
                <span style={{ color: theme.colors.infoForeground }}>
                  Content Type
                </span>
                <br style={{ marginBottom: "0.5rem" }} />
                <div role="group" aria-labelledby="contentTypeGroup">
                  <DokiRadioButton
                    type="radio"
                    name={`${prefix}.contentType`}
                    value={ContentType.PRIMARY}
                    onChange={() => {
                      setFieldValue(
                        `${prefix}.contentType`,
                        ContentType.PRIMARY
                      );
                    }}
                  >
                    Primary
                  </DokiRadioButton>
                  <DokiRadioButton
                    type="radio"
                    name={`${prefix}.contentType`}
                    value={ContentType.SECONDARY}
                    onChange={() => {
                      setFieldValue(
                        `${prefix}.contentType`,
                        ContentType.SECONDARY
                      );
                    }}
                  >
                    Secondary
                  </DokiRadioButton>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default DokiThemeComponent;

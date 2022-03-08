import React from "react";
import { ThemeContext } from "../../common/DokiThemeProvider";
import Select, { GroupBase } from "react-select";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";

function ThemedSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: StateManagerProps<Option, IsMulti, Group>) {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const colors = theme.colors;
        return (
          <Select
            {...props}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: colors.editorAccentColor,
                neutral50: colors.infoForeground,
                neutral10: colors.borderColor,
                neutral80: colors.foregroundColorEditor,
              },
            })}
            styles={{
              control: (styles) => ({
                ...styles,
                backgroundColor: colors.buttonColor,
                borderColor: colors.borderColor,
                color: "red",
                ":hover": {
                  ...styles[":hover"],
                  borderColor: colors.editorAccentColor + "99",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor:
                  state.isFocused || state.isSelected
                    ? colors.selectionBackground
                    : provided.backgroundColor,
                borderBottom: `1px dotted ${colors.infoForeground}`,
                color:
                  state.isFocused || state.isSelected
                    ? colors.selectionForeground
                    : colors.foregroundColorEditor,
                ":hover": {
                  ...provided[":hover"],
                  backgroundColor: colors.selectionBackground,
                  color: colors.selectionForeground,
                },
                ":active": {
                  ...provided[":active"],
                  backgroundColor: colors.selectionBackground,
                  color: colors.selectionForeground,
                },
              }),
              menu: (styles) => ({
                ...styles,
                backgroundColor: colors.lightEditorColor,
                borderColor: colors.borderColor,
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                backgroundColor: colors.baseIconColor,
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: colors.baseIconColor,
                borderColor: colors.borderColor,
              }),
            }}
          />
        );
      }}
    </ThemeContext.Consumer>
  );
}

export default ThemedSelect;

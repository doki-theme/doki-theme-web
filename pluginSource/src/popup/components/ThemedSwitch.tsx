import React, { FC } from "react";
import Switch, { ReactSwitchProps } from "react-switch";
import { ThemeContext } from "../../common/DokiThemeProvider";

type htmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type excludedHTMLInputProps =
  | "onFocus"
  | "onBlur"
  | "onKeyUp"
  | "onChange"
  | "ref"
  | keyof ReactSwitchProps;
type allowedHTMLinputProps = Omit<htmlInputProps, excludedHTMLInputProps>;
const ThemedSwitch: FC<ReactSwitchProps & allowedHTMLinputProps> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Switch
          {...props}
          uncheckedIcon={false}
          checkedIcon={false}
          offColor={theme.colors.disabledColor}
          onColor={theme.colors.accentColor}
          onHandleColor={theme.colors.buttonColor}
          offHandleColor={theme.colors.buttonColor}
          activeBoxShadow={`0 0 2px 3px ${theme.colors.accentColor}`}
        />
      )}
    </ThemeContext.Consumer>
  );
};

export default ThemedSwitch;

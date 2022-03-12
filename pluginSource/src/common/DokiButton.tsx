import React, { CSSProperties, FC } from "react";
import { FireFoxDokiTheme, ThemeContext } from "./DokiThemeProvider";

interface Props {
  variant?: "primary" | "default";
}

const DokiButton: FC<
  Props &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = (props) => {
  function createStyles(theme: FireFoxDokiTheme): CSSProperties {
    const colors = theme.colors;
    return props.variant === "primary"
      ? {
          backgroundColor: colors.selectionBackground,
          color: colors.selectionForeground,
        }
      : {
          backgroundColor: colors.buttonColor,
          color: colors.buttonFont,
        };
  }
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <>
          <button
            {...props}
            style={{
              ...props.style,
              padding: "0.5rem 1rem",
              border: `solid ${theme.colors.borderColor} 1px`,
              borderRadius: 0,
              fontWeight: 500,
              cursor: "pointer",
              ...(props.disabled
                ? { opacity: 0.5, cursor: "not-allowed" }
                : {}),
              ...createStyles(theme),
            }}
          >
            {props.children}
          </button>
        </>
      )}
    </ThemeContext.Consumer>
  );
};

export default DokiButton;

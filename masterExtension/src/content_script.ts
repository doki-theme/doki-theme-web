chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const {colors} = msg;
  if (colors) {
    const styles = `
      ::-moz-selection { background: ${colors.selectionBackground}; color: ${colors.selectionForeground}; }
      ::selection { background: ${colors.selectionBackground}; color: ${colors.selectionForeground}; }

      *::-webkit-scrollbar {
        width: 0.5em;
      }

      *::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.00);
      }

      *::-webkit-scrollbar-thumb {
        background-color: ${colors.accentColor};
     } 
        `
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css"
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet)
  }
});


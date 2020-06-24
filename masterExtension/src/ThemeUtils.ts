import DokiThemeDefinitions from "./DokiThemeDefinitions";

const styleId = "doki-css";

export const registerOptions = (onchange?: (newTheme: any) => void) => {
  const currentThemeSelect = document.getElementById("current-theme") as HTMLSelectElement;
  if (currentThemeSelect) {
    Object.values(DokiThemeDefinitions)
      .forEach(themeDef => {
        const option = document.createElement("option");
        option.text = themeDef.information.name
        option.value = themeDef.information.id
        currentThemeSelect.add(option)
      });
    chrome.storage.sync.get(['currentTheme'], ({currentTheme}) => {
      if (currentTheme) {
        // @ts-ignore
        const currentThemeDefinition = DokiThemeDefinitions[currentTheme];
        currentThemeSelect.value = currentThemeDefinition.information.id
        stylePopup(currentThemeDefinition.colors)
        if(onchange) {
          onchange(currentThemeDefinition)
        }
      }
    });
    currentThemeSelect.onchange = () => {
      // @ts-ignore
      const selectedTheme = DokiThemeDefinitions[currentThemeSelect.value];
      stylePopup(selectedTheme.colors)
      if(onchange){
        onchange(selectedTheme)
      }
      chrome.storage.sync.set({currentTheme: currentThemeSelect.value}, () => {
        chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
          chrome.tabs.sendMessage(id || 69, {
            colors: selectedTheme.colors
          });
        });
      });
    }
  }
}

const stylePopup = (colors: any) => {

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
     
     body {
       padding: 0.5rem;
       text-align: center;
       background-color: ${colors.baseBackground};
       color: ${colors.foregroundColor};
     }
     
     select {
       border: ${colors.accentColor} solid 1px;
       color: ${colors.buttonFont};
       background-color: ${colors.buttonColor};
     }
     select:focus {
      border-color: ${colors.accentColor};
      outline: none;
    }
    a, a:visited {
    text-decoration: none;
    color: ${colors.accentColor};
    }
        `;
  const previousStyle = document.getElementById(styleId);
  if(previousStyle && previousStyle.parentNode) {
    previousStyle.parentNode.removeChild(previousStyle)
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = styleId
  styleSheet.type = "text/css"
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet)
}

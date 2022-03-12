import { ContentInjector } from "./contentInjector";
import { DokiThemeDefinition } from "../common/DokiTheme";
import {PluginLocalStorage} from "../Storage";

class SelectionStyleInjection extends ContentInjector {
  constructor() {
    super("doki_themed_selection", (storage: PluginLocalStorage) => storage.injectSelection);
  }

  createStyles(dokiTheme: DokiThemeDefinition): string {
    const { selectionBackground, selectionForeground, accentColor } =
      dokiTheme.colors;
    return `:root{
  caret-color: ${accentColor} !important; 
}
::selection{
  color: ${selectionForeground} !important;
  background-color: ${selectionBackground} !important;
}`;
  }
}

const selectionStyleInjector = new SelectionStyleInjection();

selectionStyleInjector.initialize();

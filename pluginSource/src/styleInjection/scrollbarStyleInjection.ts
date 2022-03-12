import { ContentInjector } from "./contentInjector";
import { DokiThemeDefinition } from "../common/DokiTheme";
import {PluginLocalStorage} from "../Storage";

class ScrollbarStyleInjection extends ContentInjector {
  constructor() {
    super("doki_themed_scrollbar",
      (storage: PluginLocalStorage) => storage.injectScrollbars);
  }

  createStyles(dokiTheme: DokiThemeDefinition): string {
    const accentColor = dokiTheme.colors.accentColor;
    return `*::-webkit-scrollbar {
        width: 0.5em;
      }
      *::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.00);
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${accentColor};
     } 
`;
  }
}

const scrollBarInjector = new ScrollbarStyleInjection();

scrollBarInjector.initialize();

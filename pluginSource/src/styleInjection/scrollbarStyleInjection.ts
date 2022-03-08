import { ContentInjector } from "./contentInjector";
import { DokiThemeDefinition } from "../common/DokiTheme";

class ScrollbarStyleInjection extends ContentInjector {
  constructor() {
    super("doki_themed_scrollbar");
  }

  createStyles(dokiTheme: DokiThemeDefinition): string {
    const accentColor = dokiTheme.colors.accentColor;
    return `:root{
  scrollbar-color: ${accentColor} rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;
}`;
  }
}

const scrollBarInjector = new ScrollbarStyleInjection();

scrollBarInjector.initialize();

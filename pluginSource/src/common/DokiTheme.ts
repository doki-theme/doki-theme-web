import DokiThemeDefinitions from "../DokiThemeDefinitions";
import {MasterDokiThemeDefinition, Sticker} from "doki-build-source";

export interface Colors {
  caretRow: string;
  lineNumberColor: string;
  infoForeground: string;
  baseIconColor: string;
  contrastColor: string;
  nonProjectFileScopeColor: string;
  secondaryBackground: string;
  selectionForeground: string;
  headerColor: string;
  baseBackground: string;
  borderColor: string;
  buttonColor: string;
  selectionInactive: string;
  identifierHighlight: string;
  selectionBackground: string;
  searchBackground: string;
  searchForeground: string;
  buttonFont: string;
  foregroundColor: string;
  startColor: string;
  highlightColor: string;
  disabledColor: string;
  accentColorTransparent: string;
  accentColorLessTransparent: string;
  accentColorMoreTransparent: string;
  accentColor: string;
  accentContrastColor?: string;
  stopColor: string;
  testScopeColor: string;
  popupMask: string;
  codeBlock: string;
  textEditorBackground: string;
  foldedTextBackground: string;
  comments: string;
  unusedColor: string;
  constantColor: string;
  classNameColor: string;
  htmlTagColor: string;
  stringColor: string;
  keyColor: string;
  keywordColor: string;
  "diff.deleted": string;
  "diff.conflict": string;
  "diff.inserted": string;
  "diff.modified": string;
  lightEditorColor: string;
  breakpointColor: string;
  breakpointActiveColor: string;
  fileBlue: string;
  fileGray: string;
  fileRose: string;
  fileOrange: string;
  fileViolet: string;
  fileYellow: string;
  fileRed: string;
  filePurple: string;
  editorAccentColor: string;
  foregroundColorEditor: string;

  [key: string]: string | undefined;
}

export interface DokiThemeDefinition {
  information: Omit<MasterDokiThemeDefinition,
    "colors" | "overrides" | "ui" | "icons">;
  colors: Colors;
}

export enum ContentType {
  PRIMARY,
  SECONDARY,
}

export class CharacterTheme {
  private dokiThemes: DokiTheme[];

  constructor(private readonly dokiDefinitions: DokiThemeDefinition[]) {
    this.dokiThemes = dokiDefinitions.map((dokiDef) => new DokiTheme(dokiDef));
  }

  public get name(): string {
    return this.dokiDefinitions
      .map((def) => def.information.conflictName || def.information.displayName)
      .find(Boolean)!;
  }

  public get hasSecondaryContent(): boolean {
    return !!this.dokiDefinitions
      .map((def) => def.information.stickers.secondary)
      .find(Boolean);
  }

  public get hasMultipleThemes(): boolean {
    return this.dokiDefinitions.length > 1;
  }

  public get themes(): DokiTheme[] {
    return this.dokiThemes;
  }
}

// RYUKO DARK
export const DEFAULT_DARK_THEME_ID = CURRENT_THEME_ID || "19b65ec8-133c-4655-a77b-13623d8e97d3";
// RYUKO LIGHT
export const DEFAULT_LIGHT_THEME_ID = "3fbd90c3-859d-4618-8e31-90461ac7a556";

export class DokiTheme {
  equals(other: any): unknown {
    return other instanceof DokiTheme && other.themeId === this.themeId;
  }

  constructor(readonly dokiDefinition: DokiThemeDefinition) {
  }

  public get themeId(): string {
    return this.dokiDefinition.information.id;
  }

  public get name(): string {
    return this.dokiDefinition.information.name;
  }

  public get displayName(): string {
    return this.dokiDefinition.information.displayName;
  }

  public get dark(): boolean {
    return this.dokiDefinition.information.dark;
  }

  public get colors(): Colors {
    return this.dokiDefinition.colors;
  }

  public get hasSecondaryContent(): boolean {
    return !!this.dokiDefinition.information.stickers.secondary;
  }

  protected get defaultContent(): Sticker {
    return this.dokiDefinition.information.stickers.default;
  }

  protected get secondaryContent(): Sticker {
    return (
      this.dokiDefinition.information.stickers.secondary || this.defaultContent
    );
  }
}

export const DEFAULT_DOKI_THEME = new DokiTheme(
// @ts-ignore
  DokiThemeDefinitions[CURRENT_THEME_ID || DEFAULT_DARK_THEME_ID]
);

export const DokiThemes = Object.fromEntries(
  Object.entries(DokiThemeDefinitions).map(([key, value]) => [
    key,
    new DokiTheme(value),
  ])
);

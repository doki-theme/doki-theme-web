import { CharacterTheme, DokiThemeDefinition } from "../../common/DokiTheme";
import DokiThemeDefinitions from "../../DokiThemeDefinitions";

const values = Object.values(DokiThemeDefinitions);

export function createCharacterThemes(dokiDefs: DokiThemeDefinition[]) {
  return Object.values(
    dokiDefs.reduce((accum, dokiDefinition: DokiThemeDefinition) => {
      const characterId = dokiDefinition.information.characterId;
      if (!accum[characterId]) {
        accum[characterId] = [];
      }

      accum[characterId].push(dokiDefinition);
      return accum;
    }, {} as { [key: string]: DokiThemeDefinition[] })
  ).map((dokiDefs) => new CharacterTheme(dokiDefs));
}

export const characterThemes: CharacterTheme[] = createCharacterThemes(values);

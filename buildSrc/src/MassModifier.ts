import { readJson, walkDir } from "doki-build-source";
import path from "path";
import fs from "fs";

console.log(path.resolve('.'));

walkDir(path.resolve('.','assets','themes'))
  .then((files) => files.filter((file) => file.endsWith("chrome.definition.json"))
  )
  .then((dokiFileDefinitionPaths) => {
    return {
      dokiFileDefinitionPaths,
    };
  })
  .then((templatesAndDefinitions) => {
    const { dokiFileDefinitionPaths } = templatesAndDefinitions;
    return dokiFileDefinitionPaths.map((dokiFileDefinitionPath) => ({
      dokiFileDefinitionPath,
      dokiThemeDefinition: readJson<any>(
        dokiFileDefinitionPath
      ),
    }));
  })
  .then((defs) => {

    defs.forEach(({
      dokiFileDefinitionPath,
      dokiThemeDefinition,
    })=>{
      delete dokiThemeDefinition.overrides?.theme?.properties?.['ntp_background_alignment'];
      delete dokiThemeDefinition.overrides?.theme?.properties?.['ntp_background_alignment_secondary'];
      // fs.writeFileSync(
      //   dokiFileDefinitionPath,
      //   JSON.stringify(
      //     dokiThemeDefinition, null, 2
      //   )
      // )
    });

  });

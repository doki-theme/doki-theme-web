// @ts-ignore
import {DokiThemeDefinitions, MasterDokiThemeDefinition, StringDictonary} from './types';

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..');

const fs = require('fs');

const masterThemeDefinitionDirectoryPath =
  path.resolve(repoDirectory, 'masterThemes');

function walkDir(dir: string): Promise<string[]> {
  const values: Promise<string[]>[] = fs.readdirSync(dir)
    .map((file: string) => {
      const dirPath: string = path.join(dir, file);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        return walkDir(dirPath);
      } else {
        return Promise.resolve([path.join(dir, file)]);
      }
    });
  return Promise.all(values)
    .then((scannedDirectories) => scannedDirectories
      .reduce((accum, files) => accum.concat(files), []));
}

const LAF_TYPE = 'laf';
const SYNTAX_TYPE = 'syntax';
const NAMED_COLOR_TYPE = 'colorz';

function getTemplateType(templatePath: string) {
  if (templatePath.endsWith('laf.template.json')) {
    return LAF_TYPE;
  } else if (templatePath.endsWith('syntax.template.json')) {
    return SYNTAX_TYPE;
  } else if (templatePath.endsWith('colors.template.json')) {
    return NAMED_COLOR_TYPE;
  }
  return undefined;
}


function resolveTemplate<T, R>(
  childTemplate: T,
  templateNameToTemplate: StringDictonary<T>,
  attributeResolver: (t: T) => R,
  parentResolver: (t: T) => string,
): R {
  if (!parentResolver(childTemplate)) {
    return attributeResolver(childTemplate);
  } else {
    const parent = templateNameToTemplate[parentResolver(childTemplate)];
    const resolvedParent = resolveTemplate(
      parent,
      templateNameToTemplate,
      attributeResolver,
      parentResolver
    );
    return {
      ...resolvedParent,
      ...attributeResolver(childTemplate)
    };
  }
}


function resolveColor(
  color: string,
  namedColors: StringDictonary<string>
): string {
  const startingTemplateIndex = color.indexOf('&');
  if (startingTemplateIndex > -1) {
    const lastDelimeterIndex = color.lastIndexOf('&');
    const namedColor =
      color.substring(startingTemplateIndex + 1, lastDelimeterIndex);
    const namedColorValue = namedColors[namedColor];
    if (!namedColorValue) {
      throw new Error(`Named color: '${namedColor}' is not present!`);
    }

    // todo: check for cyclic references
    if (color === namedColorValue) {
      throw new Error(`Very Cheeky, you set ${namedColor} to resolve to itself 😒`);
    }

    const resolvedNamedColor = resolveColor(namedColorValue, namedColors);
    if (!resolvedNamedColor) {
      throw new Error(`Cannot find named color '${namedColor}'.`);
    }
    return resolvedNamedColor + color.substring(lastDelimeterIndex + 1) || '';
  }

  return color;
}

function applyNamedColors(
  objectWithNamedColors: StringDictonary<string>,
  namedColors: StringDictonary<string>,
): StringDictonary<string> {
  return Object.keys(objectWithNamedColors)
    .map(key => {
      const color = objectWithNamedColors[key];
      const resolvedColor = resolveColor(
        color,
        namedColors
      );
      return {
        key,
        value: resolvedColor
      };
    }).reduce((accum: StringDictonary<string>, kv) => {
      accum[kv.key] = kv.value;
      return accum;
    }, {});
}

function buildLAFColors(
  dokiThemeTemplateJson: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const lafTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  const lafTemplate =
    (dokiThemeTemplateJson.dark ?
      lafTemplates.dark : lafTemplates.light);

  const resolvedColorTemplate =
    resolveTemplate(
      lafTemplate, lafTemplates,
      template => template.colors,
      template => template.extends
    );

  const resolvedNameColors = resolveNamedColors(
    dokiTemplateDefinitions,
    dokiThemeTemplateJson
  );

  // do not really need to resolve, as there are no
  // &someName& colors, but what ever.
  const resolvedColors =
    applyNamedColors(resolvedColorTemplate, resolvedNameColors);
  return {
    ...resolvedColors,
    ...resolvedColorTemplate,
    ...resolvedNameColors,
  };
}

function resolveNamedColors(
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeTemplateJson: MasterDokiThemeDefinition
) {
  const colorTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  return resolveTemplate(
    dokiThemeTemplateJson,
    colorTemplates,
    template => template.colors,
    // @ts-ignore
    template => template.extends ||
      template.dark !== undefined && (dokiThemeTemplateJson.dark ?
        'dark' : 'light'));
}

function buildHyperTheme(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  return {
    colors: buildLAFColors(
      dokiThemeDefinition,
      dokiTemplateDefinitions
    ),
  };
}

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  try {
    return {
      path: dokiFileDefinitionPath,
      definition: dokiThemeDefinition,
      theme: buildHyperTheme(
        dokiThemeDefinition,
        dokiTemplateDefinitions
      )
    };
  } catch (e) {
    throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`);
  }
}

const readJson = <T>(jsonPath: string): T =>
  JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

type TemplateTypes = StringDictonary<StringDictonary<string>>;

const isTemplate = (filePath: string): boolean =>
  !!getTemplateType(filePath);

const readTemplates = (templatePaths: string[]): TemplateTypes => {
  return templatePaths
    .filter(isTemplate)
    .map(templatePath => {
      return {
        type: getTemplateType(templatePath)!!,
        template: readJson<any>(templatePath)
      };
    })
    .reduce((accum: TemplateTypes, templateRepresentation) => {
      accum[templateRepresentation.type][templateRepresentation.template.name] =
        templateRepresentation.template;
      return accum;
    }, {
      [SYNTAX_TYPE]: {},
      [LAF_TYPE]: {},
      [NAMED_COLOR_TYPE]: {},
    });
};


function resolveStickerPath(
  themeDefinitonPath: string,
  sticker: string,
) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitonPath, '..'),
    sticker
  );
  return stickerPath.substr(masterThemeDefinitionDirectoryPath.length + '/definitions'.length);
}

const getStickers = (
  dokiDefinition: MasterDokiThemeDefinition,
  dokiTheme: any
) => {
  const secondary =
    dokiDefinition.stickers.secondary || dokiDefinition.stickers.normal;
  return {
    default: {
      path: resolveStickerPath(dokiTheme.path, dokiDefinition.stickers.default),
      name: dokiDefinition.stickers.default,
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(dokiTheme.path, secondary),
          name: secondary,
        },
      }
      : {}),
  };
};


const omit = require('lodash/omit');

console.log('Preparing to generate themes.');
walkDir(path.resolve(masterThemeDefinitionDirectoryPath, 'templates'))
  .then(readTemplates)
  .then(dokiTemplateDefinitions => {
    return walkDir(path.resolve(masterThemeDefinitionDirectoryPath, 'definitions'))
      .then(files => files.filter(file => file.endsWith('master.definition.json')))
      .then(dokiFileDefinitionPaths => {
        return {
          dokiTemplateDefinitions,
          dokiFileDefinitionPaths
        };
      });
  })
  .then(templatesAndDefinitions => {
    const {
      dokiTemplateDefinitions,
      dokiFileDefinitionPaths
    } = templatesAndDefinitions;
    return dokiFileDefinitionPaths
      .map(dokiFileDefinitionPath => ({
        dokiFileDefinitionPath,
        dokiThemeDefinition: readJson<MasterDokiThemeDefinition>(dokiFileDefinitionPath),
      }))
      .filter(pathAndDefinition =>
        (pathAndDefinition.dokiThemeDefinition.product === 'ultimate' &&
          process.env.PRODUCT === 'ultimate') ||
        pathAndDefinition.dokiThemeDefinition.product !== 'ultimate'
      )
      .map(({
              dokiFileDefinitionPath,
              dokiThemeDefinition,
            }) =>
        createDokiTheme(
          dokiFileDefinitionPath,
          dokiThemeDefinition,
          dokiTemplateDefinitions
        )
      );
  }).then(dokiThemes => {
  // write things for extension
  const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
    const dokiDefinition = dokiTheme.definition;
    return {
      information: omit(dokiDefinition, [
        'colors',
        'overrides',
        'ui',
        'icons'
      ]),
      colors: dokiTheme.theme.colors,
      stickers: getStickers(dokiDefinition, dokiTheme)
    };
  }).reduce((accum: StringDictonary<any>, definition) => {
    accum[definition.information.id] = definition;
    return accum;
  }, {});
  const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions, null, 2);
  fs.writeFileSync(
    path.resolve(repoDirectory, 'src', 'DokiThemeDefinitions.ts'),
    `export default ${finalDokiDefinitions};`);
})
  .then(() => {
    console.log('Theme Generation Complete!');
  });

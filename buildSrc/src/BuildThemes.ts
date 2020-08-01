// @ts-ignore
import {
  ChromeDokiThemeDefinition,
  DokiThemeDefinitions,
  ManifestTemplate,
  MasterDokiThemeDefinition,
  StringDictonary
} from './types';

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..', '..');

const generatedThemesDirectory = path.resolve(repoDirectory, 'chromeThemes');

const edgeGeneratedThemesDirectory = path.resolve(repoDirectory, 'edgeThemes');

const hiResGeneratedThemesDirectory = path.resolve(repoDirectory, 'chromeThemes_2560x1440');

const fs = require('fs');

const masterThemeDefinitionDirectoryPath =
  path.resolve(repoDirectory, 'masterThemes');

const chromeTemplateDefinitionDirectoryPath = path.resolve(
  repoDirectory,
  "buildAssets",
  "templates"
);

const templateDirectoryPath = path.resolve(
  repoDirectory,
  "themes",
  "templates"
);

const chromeDefinitionDirectoryPath = path.resolve(
  repoDirectory,
  "buildAssets",
  "themes",
  "definitions"
);


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
    const lastDelimiterIndex = color.lastIndexOf('&');
    const namedColor =
      color.substring(startingTemplateIndex + 1, lastDelimiterIndex);
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
    return resolvedNamedColor + color.substring(lastDelimiterIndex + 1) || '';
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

function constructNamedColorTemplate(
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

const toPairs = require('lodash/toPairs');

export interface StringDictionary<T> {
  [key: string]: T;
}

export const dictionaryReducer = <T>(
  accum: StringDictionary<T>,
  [key, value]: [string, T],
) => {
  accum[key] = value;
  return accum;
};


function replaceValues<T, R>(itemToReplace: T, valueConstructor: (key: string, value: string) => R): T {
  return toPairs(itemToReplace)
    .map(([key, value]: [string, string]) => ([key, valueConstructor(key, value)]))
    .reduce(dictionaryReducer, {});
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl([r, g, b]: [number, number, number]) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h || 0;
    h /= 6;
  }

  return [h, 1, l];
}

function hexToRGB(s: string | [number, number, number]): [number, number, number] {
  if (typeof s === 'string') {
    const hex = parseInt(s.substr(1), 16)
    return [
      (hex & 0xFF0000) >> 16,
      (hex & 0xFF00) >> 8,
      (hex & 0xFF)
    ]
  }
  return s;

}

function buildChromeThemeManifest(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
  manifestTemplate: ManifestTemplate,
): ManifestTemplate {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  )
  const manifestTheme = manifestTemplate.theme;
  const colorsOverride = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  return {
    ...manifestTemplate,
    name: `Doki Theme: ${dokiThemeDefinition.name}`,
    description: `A ${dokiThemeDefinition.dark ? 'dark' : 'light'} theme modeled after ${dokiThemeDefinition.displayName} from ${dokiThemeDefinition.group}`,
    theme: {
      ...manifestTheme,
      images: replaceValues(
        manifestTheme.images,
        (_, value) => value || `images/${
          dokiThemeDefinition.stickers.secondary ||
          dokiThemeDefinition.stickers.default
        }`
      ),
      colors: replaceValues(
        manifestTheme.colors,
        (key: string, color: string) => hexToRGB(resolveColor(
          colorsOverride[key] || color,
          namedColors
        ))
      ),
      tints: replaceValues(
        manifestTheme.tints,
        (_, color: string) => {
          const s = resolveColor(color, namedColors);
          return rgbToHsl(hexToRGB(s));
        }
      ),
      properties: {
        ...manifestTheme.properties,
        ntp_background_alignment: dokiThemeChromeDefinition.overrides.theme &&
          dokiThemeChromeDefinition.overrides.theme.properties &&
          dokiThemeChromeDefinition.overrides.theme.properties.ntp_background_alignment ||
          manifestTheme.properties.ntp_background_alignment
      }
    }
  };
}

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
  manifestTemplate: ManifestTemplate
) {
  try {
    return {
      path: dokiFileDefinitionPath,
      definition: dokiThemeDefinition,
      manifest: buildChromeThemeManifest(
        dokiThemeDefinition,
        dokiTemplateDefinitions,
        dokiThemeChromeDefinition,
        manifestTemplate
      ),
      theme: {}
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
  themeDefinitionPath: string,
  sticker: string,
) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitionPath, '..'),
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

const jimp = require('jimp');
const ncp = require('ncp').ncp;
const omit = require('lodash/omit');

console.log('Preparing to generate themes.');

function buildInactiveTabImage(theme: ChromeDokiTheme, backgroundDirectory: string): Promise<void> {
  const colors = theme.definition.colors;
  const highlightColor = jimp.cssColorToHex(colors.baseBackground)
  return new Promise<void>(((resolve, reject) => {
    // @ts-ignore
    new jimp(300, 120, (err, image) => {
      for (let i = 0; i < 33; i++) {
        for (let j = 0; j < 300; j++) {
          image.setPixelColor(highlightColor, j, i);
        }
      }

      image.rgba(true)
      image.write(path.resolve(backgroundDirectory, 'tab_inactive.png'), (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    });
  }));
}

function buildActiveTabImage(tabHeight: number, highlightColor: number, accentColor: number, backgroundDirectory: string) {
  return new Promise(((resolve, reject) => {
    // @ts-ignore
    new jimp(300, 120, (err, image) => {
      for (let i = 0; i < tabHeight; i++) {
        for (let j = 0; j < 300; j++) {
          image.setPixelColor(highlightColor, j, i);
        }
      }
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 300; j++) {
          image.setPixelColor(accentColor, j, i + tabHeight);
        }
      }

      image.rgba(true)
      image.write(path.resolve(backgroundDirectory, 'tab_highlight.png'), (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    });
  }));
}

type ChromeDokiTheme = { path: string; manifest: ManifestTemplate; definition: MasterDokiThemeDefinition; theme: {} }

function buildThemeDirectoryStruct(
  theme: ChromeDokiTheme,
  tabHeight: number,
  backgroundDirectory: string,
  themeDirectory: string,
  manifestDecorator: (manifest: ManifestTemplate) => ManifestTemplate = m => m
): Promise<void> {

  fs.mkdirSync(backgroundDirectory, {recursive: true});
  //write manifest
  fs.writeFileSync(
    path.resolve(themeDirectory, 'manifest.json'),
    JSON.stringify(manifestDecorator(theme.manifest), null, 2)
  );

  const colors = theme.definition.colors;
  const highlightColor = jimp.cssColorToHex(colors.highlightColor)
  const accentColor = jimp.cssColorToHex(colors.accentColor)
  return buildActiveTabImage(
    tabHeight,
    highlightColor,
    accentColor,
    backgroundDirectory
  )
    .then(() => buildInactiveTabImage(theme, backgroundDirectory))
}

function getBackgroundDirectory(themeDirectory: string) {
  return path.resolve(themeDirectory, 'images');
}

function overrideVersion(masterExtensionPackageJson: string, masterVersion: any) {
  fs.writeFileSync(
    masterExtensionPackageJson,
    JSON.stringify({
      ...JSON.parse(fs.readFileSync(masterExtensionPackageJson, {encoding: 'utf-8'})),
      version: masterVersion.version,
    }, null, 2)
  )
}


function preBuild(): Promise<void> {
  // write versions
  const masterVersion = JSON.parse(fs.readFileSync(path.resolve(repoDirectory, 'package.json'), {encoding: 'utf-8'}));
  const themeManifestTemplate = path.resolve(chromeTemplateDefinitionDirectoryPath, 'manifest.template.json');
  overrideVersion(themeManifestTemplate, masterVersion)
  const masterExtensionPackageJson = path.resolve(repoDirectory, 'masterExtension', 'package.json');
  overrideVersion(masterExtensionPackageJson, masterVersion);
  const masterExtensionManifest = path.resolve(repoDirectory, 'masterExtension', 'public', 'manifest.json');
  overrideVersion(masterExtensionManifest, masterVersion)
  return Promise.resolve()
}

preBuild()
  .then(() => walkDir(chromeDefinitionDirectoryPath))
  .then((files) =>
    files.filter((file) => file.endsWith("chrome.definition.json"))
  )
  .then((dokiThemeChromeDefinitionPaths) => {
    return {
      dokiThemeChromeDefinitions: dokiThemeChromeDefinitionPaths
        .map((dokiThemeChromeDefinitionPath) =>
          readJson<ChromeDokiThemeDefinition>(dokiThemeChromeDefinitionPath)
        )
        .reduce(
          (accum: StringDictonary<ChromeDokiThemeDefinition>, def) => {
            accum[def.id] = def;
            return accum;
          },
          {}
        ),
    };
  }).then(({dokiThemeChromeDefinitions}) =>
  walkDir(path.resolve(masterThemeDefinitionDirectoryPath, 'templates'))
    .then(readTemplates)
    .then(dokiTemplateDefinitions => {
      return walkDir(path.resolve(masterThemeDefinitionDirectoryPath, 'definitions'))
        .then(files => files.filter(file => file.endsWith('master.definition.json')))
        .then(dokiFileDefinitionPaths => {
          return {
            dokiThemeChromeDefinitions,
            dokiTemplateDefinitions,
            dokiFileDefinitionPaths
          };
        });
    }))
  .then(templatesAndDefinitions => {
    const {
      dokiTemplateDefinitions,
      dokiThemeChromeDefinitions,
      dokiFileDefinitionPaths
    } = templatesAndDefinitions;
    const manifestTemplate = readJson<ManifestTemplate>(path.resolve(chromeTemplateDefinitionDirectoryPath, 'manifest.template.json'))
    return dokiFileDefinitionPaths
      .map(dokiFileDefinitionPath => {
        const dokiThemeDefinition = readJson<MasterDokiThemeDefinition>(dokiFileDefinitionPath);
        const dokiThemeChromeDefinition =
          dokiThemeChromeDefinitions[dokiThemeDefinition.id];
        if (!dokiThemeChromeDefinition) {
          throw new Error(
            `${dokiThemeDefinition.displayName}'s theme does not have a Chrome Definition!!`
          );
        }
        return ({
          dokiFileDefinitionPath,
          dokiThemeDefinition,
          dokiThemeChromeDefinition,
          manifestTemplate,
        });
      })
      .filter(pathAndDefinition =>
        (pathAndDefinition.dokiThemeDefinition.product === 'ultimate' &&
          process.env.PRODUCT === 'ultimate') ||
        pathAndDefinition.dokiThemeDefinition.product !== 'ultimate'
      )
      .map(({
              dokiFileDefinitionPath,
              dokiThemeDefinition,
              dokiThemeChromeDefinition,
              manifestTemplate
            }) =>
        createDokiTheme(
          dokiFileDefinitionPath,
          dokiThemeDefinition,
          dokiTemplateDefinitions,
          dokiThemeChromeDefinition,
          manifestTemplate,
        )
      );
  }).then(dokiThemes => {
  // write things for extension
  return dokiThemes.reduce((accum, theme: ChromeDokiTheme) =>
    accum.then(() => {
      const tabHeight = 31;
      const stickers = getStickers(theme.definition, theme);
      const themeDirectoryName = `${theme.definition.name}'s Theme`;
      const themeDirectory = path.resolve(
        generatedThemesDirectory,
        themeDirectoryName
      );
      const backgroundDirectory = getBackgroundDirectory(themeDirectory);

      const edgeThemeDirectory = path.resolve(
        edgeGeneratedThemesDirectory,
        themeDirectoryName
      )
      return buildThemeDirectoryStruct(
        theme,
        tabHeight,
        backgroundDirectory,
        themeDirectory,
      )
        .then(() => buildThemeDirectoryStruct(
          theme,
          tabHeight - 2,
          getBackgroundDirectory(edgeThemeDirectory),
          edgeThemeDirectory,
          manifest => ({
            ...manifest,
            theme: {
              ...manifest.theme,
              images: omit(
                manifest.theme.images,
                ['theme_ntp_background', 'theme_ntp_background_incognito']
              )
            }
          })
        ))
        .then(() => {
          // copy asset to directory
          const storageShedPath = path.resolve(repoDirectory, '..', 'storage-shed', 'doki', 'backgrounds', 'chrome')
          const highResTheme = [
            path.resolve(storageShedPath, 'hi-res', stickers.secondary && stickers.secondary.name || 'not_real'),
            path.resolve(storageShedPath, 'hi-res', stickers.default.name),
          ].filter(hiResWaifu => fs.existsSync(hiResWaifu))[0];
          if (highResTheme) {
            const highResThemeDirectory = path.resolve(hiResGeneratedThemesDirectory, themeDirectoryName);
            return (fs.existsSync(highResThemeDirectory) ?
                walkDir(highResThemeDirectory)
                  .then(items => items.forEach(item => fs.unlinkSync(item))) : Promise.resolve())
              .then(() => new Promise((resolve, reject) => {
                  ncp(themeDirectory, highResThemeDirectory, {
                    clobber: false,
                  }, (err: Error[] | null) => {
                    if (err) {
                      console.log(err)
                      reject(err)
                    } else {
                      const highResBackgroundDirectory = path.resolve(highResThemeDirectory, 'images');
                      const highResFile = path.resolve(highResBackgroundDirectory, path.basename(highResTheme));
                      fs.copyFileSync(
                        highResTheme,
                        highResFile
                      )
                      resolve()
                    }
                  })
                })
              )
          } else {
            return Promise.resolve()
          }
        }).then(() => {
          const backgroundName =
            stickers.secondary &&
            stickers.secondary.name ||
            stickers.default.name;
          const chromeLowRes = path.resolve(repoDirectory, '..', 'storage-shed', 'doki', 'backgrounds', 'chrome',
            backgroundName);
          const src = fs.existsSync(chromeLowRes) ?
            chromeLowRes : path.resolve(repoDirectory, '..', 'doki-theme-assets', 'backgrounds', backgroundName);
          fs.copyFileSync(
            src,
            path.resolve(backgroundDirectory, backgroundName)
          )
        });
    }), Promise.resolve())
    .then(() => {
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
          colors: dokiDefinition.colors,
        };
      }).reduce((accum: StringDictonary<any>, definition) => {
        accum[definition.information.id] = definition;
        return accum;
      }, {});

      const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
      fs.writeFileSync(
        path.resolve(repoDirectory, 'masterExtension', 'src', 'DokiThemeDefinitions.ts'),
        `export default ${finalDokiDefinitions};`);
    });
})
  .then(() => {
    console.log('Theme Generation Complete!');
  });

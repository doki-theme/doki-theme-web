import {
  BaseAppDokiThemeDefinition,
  constructNamedColorTemplate,
  dictionaryReducer,
  DokiThemeDefinitions,
  evaluateTemplates,
  MasterDokiThemeDefinition,
  readJson,
  resolveColor,
  resolvePaths,
  resolveStickerPath,
  rgbToHsl,
  StringDictionary,
  toRGBArray,
  walkDir
} from 'doki-build-source';
import {FireFoxTheme, ManifestTemplate,} from './types';

type ChromeDokiThemeDefinition = BaseAppDokiThemeDefinition;

const path = require('path');

const {
  repoDirectory,
  appTemplatesDirectoryPath,
} = resolvePaths(__dirname)

const generatedThemesDirectory = path.resolve(repoDirectory, 'chromeThemes');

const edgeGeneratedThemesDirectory = path.resolve(repoDirectory, 'edgeThemes');

const fireFoxGeneratedThemesDirectory = path.resolve(repoDirectory, 'firefoxThemes');

const hiResGeneratedThemesDirectory = path.resolve(repoDirectory, 'chromeThemes_2560x1440');

const fs = require('fs');
const toPairs = require('lodash/toPairs');

function replaceValues<T, R>(itemToReplace: T, valueConstructor: (key: string, value: string) => R): T {
  return toPairs(itemToReplace)
    .map(([key, value]: [string, string]) => ([key, valueConstructor(key, value)]))
    .reduce(dictionaryReducer, {});
}

function buildColors(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
): StringDictionary<string> {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  )
  const themeOverrides = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  const colorsOverride: StringDictionary<string> = {
    ...namedColors,
    ...themeOverrides,
    ...dokiThemeChromeDefinition.colors,
    editorAccentColor: dokiThemeDefinition.overrides?.editorScheme?.colors.accentColor ||
      dokiThemeDefinition.colors.accentColor
  }
  return Object.entries<string>(colorsOverride).reduce(
    (accum, [colorName, colorValue]) => ({
      ...accum,
      [colorName]: resolveColor(colorValue, namedColors),
    }),
    {}
  );
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
  const themeOverrides = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  const colorsOverride: StringDictionary<string> = {
    ...themeOverrides,
    ...dokiThemeChromeDefinition.colors
  }
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
        (key: string, color: string) => toRGBArray(resolveColor(
          colorsOverride[key] || color,
          namedColors
        ))
      ),
      tints: replaceValues(
        manifestTheme.tints,
        (_, color: string) => {
          const s = resolveColor(color, namedColors);
          return rgbToHsl(toRGBArray(s));
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

function buildFireFoxTheme(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
  manifestTemplate: FireFoxTheme,
): FireFoxTheme {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  )
  const colorsOverride = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  return {
    ...manifestTemplate,
    colors: replaceValues(
      manifestTemplate.colors,
      (key: string, color: string) => toRGBArray(resolveColor(
        colorsOverride[key] || color,
        namedColors
      ))
    ),
  };
}

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
  manifestTemplate: ManifestTemplate,
  fireFoxTemplate: FireFoxTheme
) {
  try {
    return {
      path: dokiFileDefinitionPath,
      definition: {
        ...dokiThemeDefinition,
        colors: buildColors(dokiThemeDefinition, dokiTemplateDefinitions, dokiThemeChromeDefinition)
      },
      manifest: buildChromeThemeManifest(
        dokiThemeDefinition,
        dokiTemplateDefinitions,
        dokiThemeChromeDefinition,
        manifestTemplate
      ),
      fireFoxTheme: buildFireFoxTheme(
        dokiThemeDefinition,
        dokiTemplateDefinitions,
        dokiThemeChromeDefinition,
        fireFoxTemplate
      ),
      theme: {},
      chromeDefinition: dokiThemeChromeDefinition,
    };
  } catch (e) {
    throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`);
  }
}

const getStickers = (
  dokiDefinition: MasterDokiThemeDefinition,
  dokiTheme: any
) => {
  const secondary =
    dokiDefinition.stickers.secondary || dokiDefinition.stickers.normal;
  return {
    default: {
      path: resolveStickerPath(
        dokiTheme.path,
        dokiDefinition.stickers.default,
        __dirname
      ),
      name: dokiDefinition.stickers.default,
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(
            dokiTheme.path,
            secondary,
            __dirname
          ),
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

function buildActiveTabImage(
  tabHeight: number,
  highlightColor: number,
  accentColor: number,
  backgroundDirectory: string
) {
  return new Promise<void>(((resolve, reject) => {
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

type ChromeDokiTheme = {
  path: string;
  manifest: ManifestTemplate;
  definition: MasterDokiThemeDefinition;
  theme: {};
  fireFoxTheme: FireFoxTheme;
}

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

function buildFireFoxDirectoryStruct(
  theme: ChromeDokiTheme,
  backgroundDirectory: string,
  themeDirectory: string,
): Promise<void> {

  fs.mkdirSync(backgroundDirectory, {recursive: true});
  //write theme file
  fs.writeFileSync(
    path.resolve(themeDirectory, 'theme.json'),
    JSON.stringify(theme.fireFoxTheme, null, 2)
  );

  return Promise.resolve()
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
  const themeManifestTemplate = path.resolve(appTemplatesDirectoryPath, 'manifest.template.json');
  overrideVersion(themeManifestTemplate, masterVersion)
  const masterExtensionPackageJson = path.resolve(repoDirectory, 'masterExtension', 'package.json');
  overrideVersion(masterExtensionPackageJson, masterVersion);
  const masterExtensionManifest = path.resolve(repoDirectory, 'masterExtension', 'public', 'manifest.json');
  overrideVersion(masterExtensionManifest, masterVersion)
  return Promise.resolve()
}

function getFireFoxThemeAssetDirectory(theme: MasterDokiThemeDefinition) {
  return getName(theme).replace(/ /g, '_');
}

const FIRE_FOX_EXTENSION_ASSET_DIRECTORY = 'waifus';

type Sticker = { path: string; name: string };

function getDefaultSticker(stickers: { default: Sticker, secondary?: Sticker }) {
  return stickers.secondary || stickers.default
}

// Begin theme construction

const isBuildDefs = process.argv[2] === "defs"

preBuild()
  .then(() => {
    const fireFoxTemplate = readJson<FireFoxTheme>(path.resolve(appTemplatesDirectoryPath, 'firefox.theme.template.json'))
    const manifestTemplate = readJson<ManifestTemplate>(path.resolve(appTemplatesDirectoryPath, 'manifest.template.json'))
    return evaluateTemplates(
      {
        appName: 'chrome',
        currentWorkingDirectory: __dirname,
      },
      ((
          dokiFileDefinitionPath,
          dokiThemeDefinition,
          _,
          dokiThemeAppDefinition,
          dokiTemplateDefinitions,
        ) =>
          createDokiTheme(
            dokiFileDefinitionPath,
            dokiThemeDefinition,
            dokiTemplateDefinitions,
            dokiThemeAppDefinition,
            manifestTemplate,
            fireFoxTemplate,
          )
      )
    )
  }).then(dokiThemes => {
  // write things for extension
  return dokiThemes.reduce((accum, theme: ChromeDokiTheme) =>
    accum.then(() => {
      const tabHeight = 31;
      const stickers = getStickers(theme.definition, theme);
      const themeDirectoryName = `${getName(theme.definition)}'s Theme`;
      const themeDirectory = path.resolve(
        generatedThemesDirectory,
        themeDirectoryName
      );
      const backgroundDirectory = getBackgroundDirectory(themeDirectory);

      const edgeThemeDirectory = path.resolve(
        edgeGeneratedThemesDirectory,
        themeDirectoryName
      )

      const firefoxThemeDirectory = path.resolve(
        fireFoxGeneratedThemesDirectory,
        FIRE_FOX_EXTENSION_ASSET_DIRECTORY,
        getFireFoxThemeAssetDirectory(theme.definition)
      )

      // build chrome directories
      return buildThemeDirectoryStruct(
        theme,
        tabHeight,
        backgroundDirectory,
        themeDirectory,
      )

        // build edge directories
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

        // build firefox
        .then(() => buildFireFoxDirectoryStruct(
          theme,
          getBackgroundDirectory(firefoxThemeDirectory),
          firefoxThemeDirectory
        ))

        .then(() => !isBuildDefs ? Promise.resolve() : Promise.reject("Shouldn't copy assets"))

        .then(() => {
          // copy asset to directory
          const storageShedPath = path.resolve(repoDirectory, '..', 'storage-shed', 'doki', 'backgrounds', 'chrome')
          const highResThemes = [
            path.resolve(storageShedPath, 'hi-res', stickers.secondary && stickers.secondary.name || 'not_real'),
            path.resolve(storageShedPath, 'hi-res', stickers.default.name),
          ].filter(hiResWaifu => fs.existsSync(hiResWaifu));
          const highResTheme = highResThemes[0];
          if (highResTheme) {
            const highResThemeDirectory = path.resolve(hiResGeneratedThemesDirectory, themeDirectoryName);
            return (fs.existsSync(highResThemeDirectory) ?
              walkDir(highResThemeDirectory)
                .then(items => items.forEach(item => fs.unlinkSync(item))) : Promise.resolve())
              .then(() => new Promise<void>((resolve, reject) => {
                  ncp(themeDirectory, highResThemeDirectory, {
                    clobber: false,
                  }, (err: Error[] | null) => {
                    if (err) {
                      console.log(err)
                      reject(err)
                    } else {
                      // copy high res image to chrome
                      const highResChromeBackgroundDirectory = path.resolve(highResThemeDirectory, 'images');
                      const highResFile = path.resolve(highResChromeBackgroundDirectory, path.basename(highResTheme));
                      fs.copyFileSync(
                        highResTheme,
                        highResFile
                      )

                      // copy high res image to firefox
                      const highResFireFoxBackgroundDirectory = path.resolve(firefoxThemeDirectory, 'images');
                      highResThemes
                        .filter(themeAssetPath => themeAssetPath.indexOf("kanna_dark.png") < 0) // filter out duplicate Kanna Primary background
                        .forEach(hiResTheme => {
                          const highResFireFox = path.resolve(highResFireFoxBackgroundDirectory, path.basename(hiResTheme));
                          fs.copyFileSync(
                            hiResTheme,
                            highResFireFox
                          )
                        });

                      resolve()
                    }
                  })
                })
              )
          } else {
            return Promise.resolve()
          }
        })

        .then(() => {
          const backgroundName = getDefaultSticker(stickers).name;
          const chromeLowRes = path.resolve(repoDirectory, '..', 'storage-shed', 'doki', 'backgrounds', 'chrome',
            backgroundName);
          const src = fs.existsSync(chromeLowRes) ?
            chromeLowRes : path.resolve(repoDirectory, '..', 'doki-theme-assets', 'backgrounds', backgroundName);
          fs.copyFileSync(
            src,
            path.resolve(backgroundDirectory, backgroundName)
          )

          // back fill any firefox images that don't have
          // high res.
          const bkNames = Object.values(stickers)
            .map(sticker => sticker.name)
          bkNames
            .filter(bkName => bkName.indexOf("kanna_dark.png") < 0) // filter out duplicate Kanna Primary
            .forEach(bkName => {
              const chromeLowerRes = path.resolve(repoDirectory, '..', 'storage-shed', 'doki', 'backgrounds', 'chrome',
                bkName);
              const lowResFallback = fs.existsSync(chromeLowerRes) ?
                chromeLowerRes : path.resolve(repoDirectory, '..', 'doki-theme-assets', 'backgrounds', bkName);

              const lowResFirefoxPath = path.resolve(
                getBackgroundDirectory(firefoxThemeDirectory),
                bkName
              )
              if (!fs.existsSync(lowResFirefoxPath)) {
                fs.copyFileSync(lowResFallback, lowResFirefoxPath)
              }
            })
        })
        .catch(() => {
          // skipping asset copies
        });
    }), Promise.resolve())


    .then(() => {
      // write things for firefox extension
      const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
        const dokiDefinition = dokiTheme.definition;
        const relativeFireFoxAssetPath = `${FIRE_FOX_EXTENSION_ASSET_DIRECTORY}/${
          getFireFoxThemeAssetDirectory(dokiDefinition)
        }`
        const backgrounds = getBackgrounds(
          dokiDefinition,
          dokiTheme,
          relativeFireFoxAssetPath
        );
        return {
          information: {
            ...omit(dokiDefinition, [
              'colors',
              'overrides',
              'ui',
              'icons'
            ]),
            backgrounds,
            jsonPath: `${relativeFireFoxAssetPath}/theme.json`,
          },
          colors: dokiDefinition.colors,
          overrides: dokiTheme.chromeDefinition.overrides
        };
      }).reduce((accum: StringDictionary<any>, definition) => {
        accum[definition.information.id] = definition;
        return accum;
      }, {});

      const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions,);
      fs.writeFileSync(
        path.resolve(repoDirectory, 'firefoxThemes', 'DokiThemeDefinitions.js'),
        `export const dokiThemeDefinitions = ${finalDokiDefinitions};`);
    })

    .then(() => {
      // write things for master extension
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
      }).reduce((accum: StringDictionary<any>, definition) => {
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

function getBackgrounds(dokiDefinition: { colors: StringDictionary<string>; id: string; name: string; displayName: string; dark: boolean; author: string; group: string; overrides?: any | undefined; product?: "community" | "ultimate" | undefined; stickers: any; editorScheme?: any | undefined; }, dokiTheme: { path: string; definition: { colors: StringDictionary<string>; id: string; name: string; displayName: string; dark: boolean; author: string; group: string; overrides?: any | undefined; product?: "community" | "ultimate" | undefined; stickers: any; editorScheme?: any | undefined; }; manifest: ManifestTemplate; fireFoxTheme: FireFoxTheme; theme: {}; chromeDefinition: BaseAppDokiThemeDefinition; }, relativeFireFoxAssetPath: string) {
  const stickers = getStickers(dokiDefinition, dokiTheme);

  if (isKanna(dokiDefinition)) {
    return {
      // retain secondary image because that is what the chrome themes use.
      // because both of Kanna's backgrounds are the same. Only the sticker is different.
      primary: `${relativeFireFoxAssetPath}/images/${stickers.secondary!!.name}`,
    }
  }


  return {
    primary: `${relativeFireFoxAssetPath}/images/${stickers.default.name}`,
    ...(stickers.secondary ? {
      secondary: `${relativeFireFoxAssetPath}/images/${stickers.secondary.name}`
    } : {})
  };
}

function getName(dokiDefinition: MasterDokiThemeDefinition) {
  return dokiDefinition.name.replace(':', '');
}

function isKanna(dokiDefinition: { colors: StringDictionary<string>; id: string; name: string; displayName: string; dark: boolean; author: string; group: string; overrides?: any | undefined; product?: "community" | "ultimate" | undefined; stickers: any; editorScheme?: any | undefined; }): boolean {
  return dokiDefinition.id === "b93ab4ea-ff96-4459-8fa2-0caae5bc7116"
}

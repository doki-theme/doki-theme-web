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
import {ManifestTemplate,} from './types';
import {svgToPng} from "./svgTools";
import Jimp from "jimp";

type ChromeDokiThemeDefinition = BaseAppDokiThemeDefinition;

const path = require('path');

const NEW_TAB_EXTENSION_DIR = 'newTab';
const THEME_EXTENSION_DIR = 'theme';

const {
  repoDirectory,
  appTemplatesDirectoryPath,
} = resolvePaths(__dirname)

const generatedThemesDirectory = path.resolve(repoDirectory, 'chromeThemes');

const edgeGeneratedThemesDirectory = path.resolve(repoDirectory, 'edgeThemes');

const pluginSourceThemesDirectory = path.resolve(repoDirectory, 'pluginSource', 'dist');

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
          dokiThemeDefinition.stickers.secondary?.name ||
          dokiThemeDefinition.stickers.default?.name
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

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: ChromeDokiThemeDefinition,
  manifestTemplate: ManifestTemplate,
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
): { default: { path: string; name: string }, secondary?: { path: string, name: string } } => {
  const secondary =
    dokiDefinition.stickers.secondary;
  return {
    default: {
      path: resolveStickerPath(
        dokiTheme.path,
        dokiDefinition.stickers.default.name,
        __dirname
      ),
      name: dokiDefinition.stickers.default.name,
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(
            dokiTheme.path,
            secondary?.name,
            __dirname
          ),
          name: secondary?.name,
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
}

function resizeImage(img: Jimp, size: number): Promise<Buffer> {
  return img.resize(size, size)
    .getBufferAsync('image/png')
}

async function smolifyImage(
  svgImage: Buffer,
  sizes: number[],
): Promise<Buffer[]> {
  return new Promise((res, rej) => {
    jimp.read(svgImage, (err: Error | null, img: Jimp) => {
        if (err) {
          rej(err)
        } else {
          sizes.reduce((accum, size) => accum.then(buffs => {
            return resizeImage(img, size)
              .then(smolImg => {
                buffs.push(smolImg);
                return buffs
              });
          }), Promise.resolve([] as Buffer[]))
            .then(stuff => res(stuff))
        }
      }
    )
  })
}

async function buildThemedSVGs(theme: ChromeDokiTheme, themeDirectory: string): Promise<void> {
  const svgPng = await svgToPng(theme.definition, {height: 96, width: 96})
  fs.writeFileSync(path.join(themeDirectory, NEW_TAB_EXTENSION_DIR, 'icons', 'doki-theme-logo@96.png'), svgPng)
  const sizes = [64, 48, 32, 16];
  const newStuff = await smolifyImage(svgPng, sizes);
  newStuff.forEach((binary, index) => {
    fs.writeFileSync(path.join(themeDirectory, NEW_TAB_EXTENSION_DIR, 'icons', `doki-theme-logo@${sizes[index]}.png`), binary)
  })
}

function buildThemeDirectoryStruct(
  theme: ChromeDokiTheme,
  tabHeight: number,
  imageDirectory: string,
  backgroundDirectory: string,
  themeDirectory: string,
  pluginFiles: string[],
  manifestDecorator: (manifest: ManifestTemplate) => ManifestTemplate = m => m,
  newTabManifestDecorator: (manifest: ManifestTemplate) => ManifestTemplate = m => m,
): Promise<void> {
  fs.rmdirSync(themeDirectory, {recursive: true});

  fs.mkdirSync(imageDirectory, {recursive: true});
  fs.mkdirSync(backgroundDirectory, {recursive: true});

  pluginFiles.forEach(
    pluginFile => {
      const destinationFile =
        path.join(
          themeDirectory,
          NEW_TAB_EXTENSION_DIR,
          pluginFile.substring(pluginSourceThemesDirectory.length)
        )
      fs.mkdirSync(destinationFile.substring(0, destinationFile.lastIndexOf(path.sep)), {recursive: true})
      fs.copyFileSync(pluginFile, destinationFile,)
      if (destinationFile.endsWith('.js')) {
        fs.writeFileSync(
          destinationFile,
          `const CURRENT_THEME_ID="${theme.definition.id}";` +
          fs.readFileSync(destinationFile),
        )
      } else if (destinationFile.endsWith('manifest.json')) {
        fs.writeFileSync(
          destinationFile,
          JSON.stringify(newTabManifestDecorator(JSON.parse(fs.readFileSync(destinationFile))), null, 2),
        )
      }
    }
  )

  //write manifest
  fs.writeFileSync(
    path.resolve(themeDirectory, THEME_EXTENSION_DIR, 'manifest.json'),
    JSON.stringify(manifestDecorator(theme.manifest), null, 2)
  );

  const colors = theme.definition.colors;
  const highlightColor = jimp.cssColorToHex(colors.highlightColor)
  const accentColor = jimp.cssColorToHex(colors.accentColor)
  return buildActiveTabImage(
    tabHeight,
    highlightColor,
    accentColor,
    imageDirectory
  )
    .then(() => buildInactiveTabImage(theme, imageDirectory))

    .then(() => buildThemedSVGs(theme, themeDirectory))
}

function getImageDirectory(themeDirectory: string) {
  return path.resolve(themeDirectory, THEME_EXTENSION_DIR, 'images');
}

function getBackgroundDirectory(themeDirectory: string) {
  return path.resolve(themeDirectory, NEW_TAB_EXTENSION_DIR, 'backgrounds');
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
  const pluginSourcePackageJson = path.resolve(repoDirectory, 'pluginSource', 'package.json');
  overrideVersion(pluginSourcePackageJson, masterVersion);
  const pluginSourceManifest = path.resolve(repoDirectory, 'pluginSource', 'public', 'manifest.json');
  overrideVersion(pluginSourceManifest, masterVersion)
  return Promise.resolve()
}

// Begin theme construction
const isBuildDefs = process.argv[2] === "defs"

preBuild()
  .then(() => {
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
          )
      )
    )
  }).then(async dokiThemes => {
  const pluginFiles: string[] = await walkDir(pluginSourceThemesDirectory);

  // write things for extension
  return dokiThemes.reduce((accum, theme: ChromeDokiTheme) =>
    accum.then(() => {
      const tabHeight = 31;
      const stickers = getStickers(theme.definition, theme);
      const themeDirectoryName = `${getName(theme.definition)}'s Extensions`;
      const themeDirectory = path.resolve(
        generatedThemesDirectory,
        themeDirectoryName
      );
      const imageDirectory = getImageDirectory(themeDirectory);
      const backgroundDirectory = getBackgroundDirectory(themeDirectory);

      const edgeThemeDirectory = path.resolve(
        edgeGeneratedThemesDirectory,
        themeDirectoryName
      )

      // build chrome directories
      const manifestDecorator = (manifest: any) => ({
        ...manifest,
        theme: {
          ...manifest.theme,
          images: omit(
            manifest.theme.images,
            ['theme_ntp_background', 'theme_ntp_background_incognito']
          )
        }
      });
      const edgeBackgroundDirectory = getBackgroundDirectory(edgeThemeDirectory);
      return buildThemeDirectoryStruct(
        theme,
        tabHeight,
        imageDirectory,
        backgroundDirectory,
        themeDirectory,
        pluginFiles,
        manifestDecorator,
        manifest => ({
          ...manifest,
          name: `Doki Theme for Chrome: ${theme.definition.name}`
        })
      )

        // build edge directories
        .then(() => buildThemeDirectoryStruct(
          theme,
          tabHeight - 2,
          getImageDirectory(edgeThemeDirectory),
          edgeBackgroundDirectory,
          edgeThemeDirectory,
          pluginFiles,
          manifestDecorator,
          manifest => ({
            ...manifest,
            name: `Doki Theme for Edge: ${theme.definition.name}`
          })
        ))

        .then(() => !isBuildDefs ? Promise.resolve() : Promise.reject("Shouldn't copy assets"))

        .then(() => {
          // copy asset to directory
          const assetRepPath = path.resolve(repoDirectory, '..', 'doki-theme-assets', 'backgrounds', 'wallpapers')
          const backgroundName = stickers.secondary?.name || stickers.default.name;
          const src = path.resolve(assetRepPath, backgroundName);
          fs.copyFileSync(
            src,
            path.resolve(backgroundDirectory, backgroundName)
          ),
            fs.copyFileSync(
              src,
              path.resolve(edgeBackgroundDirectory, backgroundName)
            )
        })
        .catch(() => {
          // skipping asset copies
        });
    }), Promise.resolve())


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
        path.resolve(repoDirectory, 'pluginSource', 'src', 'DokiThemeDefinitions.ts'),
        `export default ${finalDokiDefinitions};`);
    });
})
  .then(() => {
    console.log('Theme Generation Complete!');
  });

function getName(dokiDefinition: MasterDokiThemeDefinition) {
  return dokiDefinition.name.replace(':', '');
}

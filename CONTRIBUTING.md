# Doki Dev Setup

## Prerequisites

- [Yarn Package Manager](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- `ts-node` installed globally (run `yarn global add ts-node`)


## First time setup

1. At the root of this repository, run `./devSetup.sh` to get:
    - The current Master Themes
    - Install dependencies in the `buildSrc` directory
    
# Concepts

## Build Process

The `buildSrc` directory contains all the things necessary to build out the theme definitions for all products

**Running Build**

in the `buildSrc` directory run

```shell
yarn buildDefinitions
```

This will:

- build out the `firefox` and `chrome` manifest templates (located in the `buildAssets` directory).
- Create the tab images for the chrome themes
- Build the `DokiThemeDefinitions.ts` for both the `masterExtension` and Firefox extension.

## Making Modifications

Sometimes a particular theme has something that is just a bit off.
Thankfully there is a way to fix small one off issues.

In the `buildAssets/themes/definitions` directory lives all the chrome definitions.
These are used to override the defaults provided by the `masterThemes`

Here is an example that overrides:

- The background placement
- Seach bar text color

```json
{
  "id": "35422aa4-1396-4e76-8ec6-c5560884df22",
  "overrides": {
    "theme": {
        "colors": {
          "omnibox_text": "&accentColorDarker&"
        },
      "properties": {
        "ntp_background_alignment": "right"
      }
    }
  },
  "laf": {},
  "syntax": {},
  "colors": {}
}
```

Once changes are made you can run the command below inside the `buildSrc` directory.

```shell
yarn buildDefinitions
```


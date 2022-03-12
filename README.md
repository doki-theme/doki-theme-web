# Doki Theme Web
| Google Chrome                                            | Microsoft Edge                                      | Mozilla Firefox                                                   |
|----------------------------------------------------------|-----------------------------------------------------|-------------------------------------------------------------------|
| ![Megumin Chrome](./screenshots/backgrounds/megumin.png) | ![Rem Edge](./screenshots/backgrounds/rem_edge.png) | ![Aqua FireFox](./screenshots/backgrounds/firefox_background.png) |

# Table of Contents

**Note**: Doki Theme for Firefox [has been moved to another repository](https://github.com/doki-theme/doki-theme-firefox).

- [Feature Set](#feature-set)
  - [Master Extension](#master-extension)
  - [Firefox Features](#firefox-features)
    - [General Settings](#firefox-general-settings)
    - [Theme Settings](#firefox-theme-settings)
      - [Match Device Option](#match-device-option)
      - [Druthers Option](#druthers-option)
      - [Light Only Option](#light-only-option)
      - [Dark Only Option](#dark-only-option)
      - [All Option](#all-option)
- [Installation](#installation)
  - [Demonstration Overview](#demonstration-overview)
  - [Google Chrome](#google-chrome)
  - [Microsoft Edge](#microsoft-edge)
  - [Mozilla Firefox](#mozilla-firefox)
- [Possible Issues](#possible-issues)
  - [Light Theme Tab Text](#light-theme-tab-text)
- [Contributions and Issues](#contributions-and-issues)

    
# Feature Set
## Master Extension

Want to enhance your browsing experience? Then this plugin is for you! This extension will modify 
the CSS of every webpage you visit to match your current theme choices.

Things that are currently changed:
- Selection foreground/background
- Scrollbars

# Installation
## Demonstration Overview
![Theme Usage](./screenshots/chrome_usage.gif)

> This process demonstrates local installation. 
> You should be able to install these themes from the Chrome store soon!

## Demo Steps
1. Install Emilia Dark's theme.
1. Use the Master Extension popup to change how CSS is altered github.
1. See that scroll bar and selection colors are now themed.
1. Install Rem's theme.
1. Use the Master Extension options to change how CSS is altered.
1. Demonstrate that old css alteration is still present.
1. Refresh
1. Observe that updated css alterations are now present.

## Google Chrome
Ideally, this plugin should be distributed by the **Chrome web store**.
Until then, you'll have to do a local installation.

### Steps
1. Clone this repository
1. Open Chrome
1. Open the Extension Management page by navigating to chrome://extensions.
    - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
1. Enable Developer Mode by clicking the toggle switch next to Developer mode.
1. Click the LOAD UNPACKED button and select the extension directory.
    ![Load unpacked](https://developer.chrome.com/static/images/get_started/load_extension.png)
1. Navigate to the cloned repository
    1. To install a theme, go to `chromeThemes` and just select the theme directory you want and `open` or confirm.
    1. To install the master extension, go to `masterExtension` and just select the `installable_extension` directory and `open` or confirm.
1. Enjoy!

## Microsoft Edge
Ideally, this plugin should be distributed by the **Microsoft Edge Add-on store**.
Until then, you'll have to do a local installation.

### Prerequisites
- Edge v83.0.471.0 or above [consider downloading the canary/dev version](https://www.microsoftedgeinsider.com/en-us/download)

### Steps
1. Clone this repository
1. Open Edge
1. Open the Extension Management page by navigating to edge://extensions.
    - The Extension Management page can also be opened by clicking on the Edge menu, hovering over More Tools then selecting Extensions.
1. Enable Developer Mode by clicking the toggle switch next to Developer mode (1).
1. Click the LOAD UNPACKED button and select the extension directory (2).
![Load unpacked](./screenshots/edge_install.png)
1. Navigate to the cloned repository
    1. To install a theme, go to `edgeThemes` and just select the theme directory you want and `open` or confirm.
    1. To install the master extension, go to `masterExtension` and just select the `installable_extension` directory and `open` or confirm.
1. Navigate to a new empty tab in the browser.
1. Select the settings in the upper right-hand corner.
1. Choose `Custom` layout.
1. Choose `Your own image` and upload your chosen background.
    - You can find background images in the `chromeThemes` directory [here is Rem's 1920x1080.](https://github.com/doki-theme/doki-theme-web/blob/master/chromeThemes/Rem's%20Theme/images/rem.png)
![Setting Background](./screenshots/edge_background.gif)
1. Enjoy!

### Configuration

You can configure the extension by opening the popup menu & clicking:
- The Doki Theme logo located at the top.

**OR**
- The`Show Settings` link located at the bottom.


# Contributions and Issues

Got Contributions, fun ideas, or issues? Keep in mind, the Chromium platform has a fairly 
limited feature set, however, I'll do my best to accommodate. [Submit an issue](https://github.com/doki-theme/doki-theme-web/issues/new).  

Not your thing or something bothering you? Feel free to submit [your feedback](https://github.com/doki-theme/doki-theme-web/issues/new).

**Help make these extensions better!**

## Dev Setup
Please see the [contributing](./CONTRIBUTING.md) file for development concepts and setup.

## Enjoying the plugin and want more people to use it?
Great! I am glad you like it!

Be sure to share it with others who also may enjoy it as well!

---
<div align="center">
    <img src="https://doki.assets.unthrottled.io/misc/logo.svg" ></img>
</div>

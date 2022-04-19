Changelog
---

# 78.0-2.1.0 [Better Brave Support]

- Added themes that are better suited to the Brave Browser in the `braveThemes` directory

# 78.0-2.0.1 [Non-Functional Updates]

- Upgraded plugins to use React v18.


# 78.0-2.0.0 [The Boys]

I'm trying to bring in a bit of inclusion.

**4 New Dark Themes!**

- I can already hear you now, "Rimiru Tempest, from 'That Time I Got Reincarnated as a Slime', is not a boy. They are the best genderless slime, get your facts correct." Yeah well....shut up.
- Next, is one of the S ranked heroes in the 'One Punch Man' universe, Genos.
- After that, is the smug smile of Yukihira Soma from Shokugeki no Soma. 
- Lastly, I am going to be honest, I haven't seen Haikyu. I just wanted a Indigo & Orange based theme. So here is Hinata Shoyo.

![v78 Bois](https://doki.assets.unthrottled.io/misc/v78_bois.png)

# v74.2-2.0.0 [Synapse break. Vanishment, this world!]

**4 New Dark Themes!**

- Decimate errors in the code alongside the Wicked Lord Shingan. Let your inner fantasies go rampant with Rikka Takanashi from: "Love, Chuunibyou, and Other Delusions".
- It is comfy time! Don't let feature requests stress you out, because you can now code with Nadeshiko from Yuru Camp.
- A Certain Scientific RailGun go: bzzzzzzt. Zap bugs out of existence with the electromaster Mikoto Misaka.
- Raccoon + Tanuki = one really cute cinnamon bun. Enjoy your time coding with Raphtalia from: "Rising of the Shield Hero."

![v74 Girls](https://doki.assets.unthrottled.io/misc/v74_girls.png)

### Other Stuff

- Moved the Firefox extension [from doki-theme-web](https://github.com/doki-theme/doki-theme-web) to [doki-theme-firefox](https://github.com/doki-theme/doki-theme-firefox).
- Removed the `masterExtension` in favor of a `theme` and `newTab` theme specific extension for both Edge & Chrome.
- Any maintainer now has the ability successfully run a build, no private dependencies now.
- Updated extension to use centrally defined asset anchoring data.

# 18.1.0 [Opt-In FireFox Features]

- Changed all settings to be opt-in to conform to the Mozilla Add-On policy.
- Added documentation of the rest of the FireFox features.
- Added a link to said documentation in the settings menu.
- Added a link to show the Options Page in the popup.
- Fixes *Options page* refreshing after selecting an option in the *General* category.
- Fixes *Options page* refreshing after (un)checking the secondary background checkbox in 
  `druthers`.
- Fixes secondary background checkbox visibility when selecting a theme from a dropdown menu in 
  `druthers`.

# 18.0.0 [Device Theme Sync]

The Doki Theme for FireFox can now synchronize with your device theme settings.

Never want to see light mode ever again? No problem! The *Options page* now allows you to choose 
between `light`, `dark`, `device`, `druthers`, or `all` *(all themes)*. So take your time and 
browse.

### Match Device
`device` will load themes based on your current device theme settings *(either light or dark)*.
In other words, your device settings determines what characters are present in the popup menu.

### Druthers
`druthers` is similar to `device` except the character chosen for the light theme and the 
character chosen for the dark theme will alternate depending on your current device settings.

For clarity, if I choose *Asuna* for the **light theme** & *Hatsune Miku* for the **dark theme**.
If the device setting is **currently dark**, then the **dark** *Hatsune Miku theme* will show. If the device 
setting is *light*, then the **light** *Asuna* theme will show.

### Dark Only
`dark` will only load dark themes. The popup menu will only load dark themes. This is for all you 
dark theme lovers out there!

### Light Only
`light` will only load  light themes. The popup menu will only load light themes. This is for all 
you light theme lovers out there!

### All
`all` is the default settings of Doki Theme. All themes will be present in the popup menu.

## Other Changes
- **Secondary backgrounds** are now candidates to be randomly selected when using the `random` & 
  `mixed` 
  modes.

# 17.0.0 [Holiday Release]

**3 New Dark Themes!**
 
- Celebrate Christmas with Chocola from the NekoPara Series!
_I lied about Shigure being the last addition from NekoPara._

- The 4th of July now just got even better, now that you can code with Essex from Azur Lane.
If you prefer a more canon experience, Essex's theme also has **secondary content** with the Eagle Union branding.

- Even though I missed this year's Halloween, I've got something to look forward to in 2022.
Yotsuba, from The Quintessential Quintuplets, isn't 2spooky4me.


![v22 Girls](https://doki.assets.unthrottled.io/misc/v22_girls.png)

#### Other Stuff

- Moved Tohsaka Rin's wallpaper over to the right.

# 16.0.1 [Firefox: Fix Options]
- Fix theme breaking when enabling/disabling textbox selection/scrollbar options.
- Remove edges from search bar

# 16.0.0 [Jahy-sama will not be discouraged!]

**1 New Theme!**

Featuring the Dark World's Second in Command: Jahy!

![v21 Girl](https://doki.assets.unthrottled.io/misc/v21_girl.png)

# 15.0.3 [Firefox: Theming Bug Fixes]
- Fixes incorrect toolbar theme in *mixed mode* when rapidly creating tabs.([#77](https://github.com/doki-theme/doki-theme-web/issues/77))
- Fixes incorrect toolbar theme in *mixed mode* when toggling search widget.([#77](https://github.com/doki-theme/doki-theme-web/issues/77))

# 15.0.2 [Firefox History Sidebar Theming]

- Themes the Firefox's history sidebar ([#75](https://github.com/doki-theme/doki-theme-web/issues/75))

# 15.0.1 [Firefox: Theming Bug Fixes]
- Fix tabs not being randomized when creating tabs rapidly in mixed mode.
- Fixes text selection & scrollbar not loading appropriately with their individual tab in mixed mode.
- Fixes text selection & scrollbar not loading appropriately with their individual tab in mixed mode.
- Appropriate theme for *options page* for each tab loads correctly in mixed mode.
- Fixes initialization of a theme, when closing and reopening a browser.
- Mitigates favicon & other theming components to stay themed in mixed mode.
- Fixes search bar widget toggling in *Mixed Mode* reverting all tabs back to using a single theme.

# 15.0.0 [Only for Onii-chan] 

**3 New Themes!**

Last addition from the NekoPara Series:

- Minaduki Shigure (Light Theme)

From the dumpster fire of a series, "EroManga Sensei":

- Izumi Sagiri (Dark Theme)

From the smaller burning trash heap, "OreImo (My little sister cannot be this cute)":

- Kousaka Kirino (Dark Theme)

Anime is trash...._and so am I_.

![v20 Girls](https://doki.assets.unthrottled.io/misc/v20_girls.png)

# 14.0.0 [KillLaKill Alt. Themes]

## 2 New Themes!

- Ryuko Light
- Satsuki Dark

**Other Stuff**

- Updated Ryuko's dark background art.
- Updated Satsuki's light background art.

![v19 Girls](https://doki.assets.unthrottled.io/misc/v19_girls.png)

# 13.2.0 [Marketplace Conformance]

- Updated plugin to conform to the Firefox addon rules and guidelines when using registered trademarks.
- *Browser action* button now changes logo color based on currently selected theme.

# 13.1.0 [Scrollbars & Text Selection]

- Scrollbar, text selection, & caret are now themed! [#59](https://github.com/doki-theme/doki-theme-web/issues/59)
- Fix `Random` mode
- Add shortcut to *options page* by clicking on **Doki Heart** beat
- Update styles in *popup menu*
- Fix switches in *popup menu* not disabling properly for both secondary and dark
- Fixes *popup menu* not changing to appropriate theme color when selected
- Custom checkboxes in *options page*
- *Options page* now changes with current Doki Theme


# 13.0.0 [NekoPara OneeSan Vol.]

## 4 New Themes!!

- Maple (Light/Dark)
- Cinnamon (Dark)
- Azuki (Dark)

![v18 Girls](https://doki.assets.unthrottled.io/misc/v18_girls.png)


# 12.2.0 [Firefox new tab on start]

- Adds an `Options` menu in the extension configuration.
- Allows user to choose if a new empty tab should be opened on startup. Fixes [#51](https://github.com/doki-theme/doki-theme-web/issues/51)

# 12.1.0 [2560x1440 Emilia Light]

- Added the higher res Emilia Light Chrome theme.

# 12.0.0 [NekoPara Release]

## 3 New Themes!!

- Chocola (Dark)
- Vanilla (Dark)
- Coconut (Dark)

![v17 Girls](https://doki.assets.unthrottled.io/misc/v17_girls.png)

# 11.0.1 [FireFox Updates]

- Updated the default option foreground color.

# 11.0.0 [Hanekawa, Shima Rin, Nagatoro, Yumeko, & Yuno]

## 5 New Themes

From the Monogatari series:

- Hanekawa Tsubasa (Dark)

From the Yuru Camp series:

- Shima Rin (Dark)

From the Don't Toy With Me, Miss Nagatoro series:

- Hayase Nagatoro (Dark)

From the Kakegurui Series:

- Jabami Yumeko (Dark)

From the Future Diary Series

- Gasai Yuno (Dark)

![v16 Girls](https://doki.assets.unthrottled.io/misc/v16_girls.png)


# 10.0.0 [Nino, Nakano Miku, Gray, Miia, & Tohru]

## 5 New Themes

From the Quintessential Quintuplets series:

- Nakano Nino (Dark)
- Nakano Miku (Dark)

From the Lord El-Melloi II Case Files series:

- Gray (Dark)

From the Daily Life with a Monster girl series:

- Miia (Dark)

Addition to Miss Kobayashi's Dragon Maid:

- Tohru (Light)

## Other stuff

- Added a secondary background for [Hatsune Miku](https://github.com/doki-theme/doki-master-theme/issues/62)!
- Master extension selection menu is now sorted.

![v15 Girls](https://doki.assets.unthrottled.io/misc/v15_girls.png)


# 9.0.1 
## Firefox: Small Cosmetic Changes

- Removes extra *Rias* folder.
- Changes ordering of switches
- Reduces size of switches
- Adds small changes to dropdown menu on idle state
- Changes animation from *bouncing* to *heartbeat*
- Brightens switch labels
- Switch labels are now themed

# 9.0.0 [Astolfo, Maika, Rias, & Rei]

## 4 New Themes

From the Fate series:

- Astolfo (Dark)

From the Highschool DxD series:

- Rias: Onyx (a darker theme)
  - 2 Backgrounds:
    - A Cute One
    - A Cultured One

From the Blend S series:

- Sakuranomiya Maika (Dark)

From the Neon Genesis Evangelion series:

- Ayanami Rei (Dark)

![v14 Girls](https://doki.assets.unthrottled.io/misc/v14_girls.png)

# 8.2.0

## FireFox

- Added the ability to choose between light/dark mode from the current Waifu you chose.

# 8.1.0

## FireFox

- Added support for [Primary and Secondary Backgrounds](https://github.com/doki-theme/doki-theme-web/issues/21)
- Added the ability to show/hide the new tab search widget.

# 8.0.0

## 4 New Themes

From the Darling in the Franxx series:

- Zero Two (Dark/light)

From the Rascal does not dream of bunny girl senpai series:

- Sakurajima Mai (Dark/light)

![v13 Girls](https://doki.assets.unthrottled.io/misc/v13_girls.png)

# 7.0.2 [Firefox: Popup Menu fix]

- Popup menu can now change colors on pages other than _New Tab_ pages in **mix mode**
- Adds animations to popup menu

# 7.0.1 [Rename Repository]

- Updated links to reflect new repository name.

# 7.0.0 [New Themes & Firefox Update]

## 5 New Themes!

Love Live! series:

- Sonoda Umi (Dark)

From the OreGairu series:

- Yukinoshita Yukino (Dark)

Addition to Re:Zero series:

- Echidna (Dark)

From the Steins Gate series:

- Makise Kurisu (Dark)

Addition to the Sword Art Online series:

- Yuuki Asuna (Dark)

![v12 Girls](http://doki.assets.unthrottled.io/misc/v12_girls.png)

## Other Stuff

### Updates

- Konata's theme is now a bit darker to aid in usability.
- Updated Asuna's light background image.

### Firefox changes
- Smoother Firefox theme loading experience!
- The popup menu is now smaller. A small change, but a bigger difference.
- A new feature has been added to the mix. When enabled, this feature displays a random doki theme everytime a new tab is created. Each tab has its own theme attach to them and are completely independent of each other.

### Miscellaneous
- "Last Name First Name"'d Misato.
- Added definition only build step
- Added contributing documentation

# 6.0.0 [Firefox Support]

- You can now get the full Doki Theme experience in Mozilla Firefox!

# 5.0.0 [Fate, Gate, Konosuba]

## 5 New Themes!

Girls from the Fate series:

- Ishtar (Light/Dark)
- Tohsaka Rin (Dark)

From the Gate series:

- Rory Mercury (Dark)

Last addition to the Konosuba series:

- Aqua (Dark)

![v11 Girls](http://doki.assets.unthrottled.io/misc/v11_girls.png)

# 4.0.0 [Kanna Kamui]

- Added Miss Kobayashi's Dragon Maid's `Kanna` as a dark theme!

![The New Girl](https://doki.assets.unthrottled.io/misc/v10_girl.png?version=1)

# 3.0.0 [Misato Katsuragi]

- Added Neon Genesis Evangelion's `Misato Katsuragi` as a dark theme!
- Actually adding all 2560x1440 background images rather than some of them.

![The New Woman](https://doki.assets.unthrottled.io/misc/v9_girl.png?version=1)

# 2.0.0 [Full Edge Support]

- While it is not automatic, you can get the full Doki Theme experience in Microsoft Edge now!

## 1.1.0 [High Resolution]

- Added themes with 2560x1440 background images.
    - Those themes are available in the `chromeThemes_2560x1440` directory.
    - Not every Doki-Theme had a high resolution wallpaper. If your favorite is not present, please submit an issue.

## 1.0.0 [Initial release!]

All 24 Themes are available in the `chromeThemes` directory.

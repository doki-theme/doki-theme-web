export interface FireFoxTheme {
  "images" : {
    "theme_ntp_background" : string,
    "theme_ntp_background_incognito" : string
  },
  "colors": {
    "bookmark_text": string,
    "button_background": string,
    "control_background": string,
    "frame": string,
    "frame_inactive": string,
    "frame_incognito": string,
    "frame_incognito_inactive": string,
    "ntp_background": string,
    "ntp_header": string,
    "ntp_link": string,
    "ntp_link_underline": string,
    "ntp_section": string,
    "ntp_section_link": string,
    "ntp_section_link_underline": string,
    "ntp_section_text": string,
    "ntp_text": string,
    "tab_background_text": string,
    "tab_text": string,
    "toolbar": string,
  }
}

export interface ManifestTemplate {
  "name": string,
  "version": string,
  "description": string,
  "theme": {
    "images" : {
      "theme_ntp_background" : string,
      "theme_ntp_background_incognito" : string
    },
    "colors": {
      "bookmark_text": string,
      "button_background": string,
      "control_background": string,
      "frame": string,
      "frame_inactive": string,
      "frame_incognito": string,
      "frame_incognito_inactive": string,
      "ntp_background": string,
      "ntp_header": string,
      "ntp_link": string,
      "ntp_link_underline": string,
      "ntp_section": string,
      "ntp_section_link": string,
      "ntp_section_link_underline": string,
      "ntp_section_text": string,
      "ntp_text": string,
      "tab_background_text": string,
      "tab_text": string,
      "toolbar": string,
    },
    "tints": {
      "buttons": string,
      "frame": string,
      "frame_inactive": string,
      "frame_incognito": string,
      "frame_incognito_inactive": string,
      "background_tab": string
    },
    "properties" : {
      "ntp_background_alignment" : string
    }
  },
  "manifest_version": 2
}

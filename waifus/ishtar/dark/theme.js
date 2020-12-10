const theme = {
	"images": {
		"theme_frame": "frame.svg"
	},
	"colors": {
		"bookmark_text": [
			204,
			204,
			204
		],
		"button_background_hover": [
			61,
			51,
			50
		],
		"icons": [
			245,
			196,
			67
		],
		"icons_attention": [
			245,
			196,
			67
		],
		"ntp_background": [
			15,
			13,
			14
		],
		"ntp_text": [
			204,
			204,
			204
		],
		"popup": [
			53,
			52,
			52
		],
		"popup_text": [
			255,
			255,
			255
		],
		"sidebar": [
			53,
			52,
			52
		],
		"sidebar_border": [
			245,
			196,
			67
		],
		"sidebar_text": [
			255,
			255,
			255
		],
		"tab_line": [
			245,
			196,
			67
		],
		"tab_background_text": [
			204,
			204,
			204
		],
		"toolbar_field": [
			10,
			10,
			6
		],
		"toolbar_field_focus": [
			61,
			51,
			50
		],
		"toolbar_field_text": [
			245,
			196,
			67
		],
		"toolbar": [
			17,
			15,
			16
		],
		"toolbar_top_separator": [
			245,
			196,
			67
		],
		"toolbar_vertical_separator": [
			204,
			204,
			204
		]
	}
};
async function setTheme(){
	browser.theme.update(theme);
	console.log("Theme set!");
}
setTheme();






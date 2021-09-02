async function getColorDefinition(){
  const storage = await browser.storage.local.get(["waifuThemes", "currentThemeId"]);
  const themes = storage.waifuThemes.themes;

  const currentTheme = themes[storage.currentThemeId];

  const {colors} = currentTheme.definition;

  return colors;
}

async function applyScrollbar(){
  const {accentColor} = await getColorDefinition();
  const style = `:root{
  scrollbar-color: ${accentColor} rgba(0, 0, 0, 0);
  scrollbar-width: thin;
}`;
  const styleText = document.createTextNode(style);
  const styleTag = document.createElement('style');
  styleTag.id = 'doki_scrollbar';
  styleTag.append(styleText);
  document.head.append(styleTag);
}

applyScrollbar();
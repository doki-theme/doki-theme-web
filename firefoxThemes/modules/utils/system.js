/*Check if system settings is light or dark*/
function isSysDark(systemTheme, systemChoice) {
  let isDark;
  if (systemTheme === 'system') {
    isDark = systemChoice === 'dark';// 'dark' or 'light'
  } else {
    isDark = systemTheme === 'dark';// 'dark' or 'light'
  }
  return isDark;
}

/*Checks if any specific system theme is set*/
function isSpecificSysTheme(systemTheme) {
  const isDark = systemTheme === 'dark';
  const isLight = systemTheme === 'light';
  const isSysTheme = systemTheme === 'system';
  return isSysTheme || isDark || isLight;
}

export {isSysDark, isSpecificSysTheme};
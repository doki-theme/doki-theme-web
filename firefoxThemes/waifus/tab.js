let query = "";//the search query
/*Record the keywords to search for.
* These keywords will be delegated to the default search engine.*/
function searchQuery(e) {
  query = e.target.value;
}

/*Submit searches by pressing the search button*/
function confirmSearch() {
  browser.tabs.getCurrent()
    .then((tab) => {
      browser.search.search({
        query,
        tabId: tab.id
      });
    });

}

/*Submit searches by pressing the 'Enter' key*/
function keyConfirm(e) {
  if (e.key === "Enter") {
    confirmSearch();
  }
}

function setThemedFavicon(currentTheme) {
  const faviconOptions = {width: 32, height: 32};
  const faviconSVG = buildSVG(currentTheme, faviconOptions);
  svgToPng(faviconSVG, faviconOptions, (imgData) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = imgData;
  });
}

function setThemedSearchInputIcon(currentTheme) {
  const searchOptions = {width: 24, height: 24};
  const searchSVG = buildSVG(currentTheme, searchOptions)
  svgToPng(searchSVG, searchOptions, (imgData) => {
    const pngImage = document.createElement('img');
    pngImage.src = imgData;
    const style = `input { background: white url(${pngImage.src}) 12px center no-repeat; }`
    const styleTag = document.createElement("style");
    styleTag.append(style);
    document.head.append(styleTag);
  });
}

function setThemedAboutIcon(currentTheme) {
  const aboutOptions = {width: 96, height: 96};
  const aboutSVG = buildSVG(currentTheme, aboutOptions)
  svgToPng(aboutSVG, aboutOptions, (imgData) => {
    const logo = document.querySelector("div[class='logo']")
    const pngImage = document.createElement('img');
    logo.appendChild(pngImage);
    pngImage.src = imgData;
  });
}

function applyTabListeners() {
  browser.storage.local.get(["showWidget", "waifuThemes", "currentThemeId"])
    .then((storage) => {
      const currentTheme = storage.waifuThemes.themes[storage.currentThemeId] ||
        storage.waifuThemes.themes["19b65ec8-133c-4655-a77b-13623d8e97d3"]; // Ryuko Dark
      const root = document.querySelector(':root');
      root.style.setProperty('--accent-color', currentTheme.definition.colors.accentColor);
      root.style.setProperty('--base-background-color', currentTheme.definition.colors.baseBackground);

      if (storage.showWidget === undefined || storage.showWidget) {
        document.querySelector("body").innerHTML =
          `
    <main>
    <div class="logo-and-wordmark">
        <div class="logo"></div>
        <div class="wordmark">Doki Theme</div>
    </div>
    <div class="search-inner-wrapper">
        <input aria-controls="searchSuggestionTable" aria-expanded="false" aria-label="Search the web"
               maxlength="256"
               placeholder="Search the web" title="Search the web" type="search" autofocus/>
        <button class="search-button" aria-label="Search" title="Search"></button>
    </div>
</main>
`;
        // set themed icons
        setThemedSearchInputIcon(currentTheme);
        setThemedAboutIcon(currentTheme);

        /*---Event Listeners---*/
        const input = document.querySelector("input[type='search']");
        input.addEventListener("input", searchQuery, true);
        input.addEventListener("keydown", keyConfirm, true);

        const searchButton = document.querySelector(".search-button");
        searchButton.addEventListener("click", confirmSearch, false);
      }
      setThemedFavicon(currentTheme);
    });
}
applyTabListeners();

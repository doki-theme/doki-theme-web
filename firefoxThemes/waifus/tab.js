function shadeHexColor(color, percent) {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

const buildSVG = (dokiTheme, {width, height}) =>
  `<svg width="${width}" height="${height}" version="1.1" viewBox="0 0 52.915 52.915" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <path fill="${dokiTheme.definition.colors.accentColor}" d="m49.495 13.229c1.7198 2.9788 1.7198 23.48 0 26.457-1.7198 2.9784-19.475 13.229-22.914 13.229-3.4396 0-21.195-10.251-22.914-13.229-1.7198-2.9788-1.7198-23.48 0-26.457 1.7198-2.9788 19.475-13.229 22.914-13.229 3.4396 0 21.195 10.251 22.914 13.229z" stroke-width=".1124" style="paint-order:stroke fill markers"/>
  <path fill="${shadeHexColor(dokiTheme.definition.colors.accentColor, -0.1)}" d="m43.44 8.4075c0.03488 0.09687 0.07029 0.19354 0.10286 0.29137 0.665 0.62065-5.8164 29.196-40.611 23.868-0.16135-0.48752-0.31207-0.96732-0.45799-1.4438 0.16964 4.0491 0.56546 7.4762 1.1929 8.563 1.7194 2.9785 19.475 13.229 22.914 13.229 3.4389 0 21.195-10.251 22.914-13.229 1.7198-2.9775 1.7198-23.479 0-26.458-0.5794-1.0037-2.9959-2.8372-6.0557-4.8217z" stroke-width=".1124" style="paint-order:stroke fill markers"/>
  <path stroke="${dokiTheme.definition.colors.iconContrastColor || '#fff'}" d="m26.786 19.341c0.78035-0.42869 3.4115-2.163 7.2558-3.0409 8.8633-2.024 12.27 7.7485 7.0439 15.118-4.6692 5.3617-9.5156 7.8247-14.3 10.997-4.7838-3.1724-9.63-5.6355-14.3-10.997-5.2264-7.3687-1.8194-17.141 7.0439-15.118 3.8443 0.87785 6.4754 2.6122 7.2558 3.0409" stroke-dasharray="9.75870597, 4.87935299, 2.43967649, 4.87935299" stroke-linecap="round" stroke-miterlimit="6" stroke-width="2.4396" style="paint-order:stroke fill markers"/>
  <path fill="${dokiTheme.definition.colors.accentColor}" d="m36.389 16.03c-0.73241-0.0059-1.5153 0.08021-2.3462 0.26994-3.8445 0.87789-6.4758 2.6125-7.256 3.0412h-4.68e-4c-0.78043-0.42872-3.4117-2.1633-7.256-3.0412-8.8633-2.0229-12.27 7.7493-7.0439 15.118 4.67 5.3617 9.5165 7.8246 14.3 10.997 4.7843-3.1725 9.6306-5.6353 14.3-10.997 4.7362-6.6786 2.3824-15.331-4.6976-15.388z" stroke-width=".11241" style="paint-order:stroke fill markers"/>
  <path fill="${shadeHexColor(dokiTheme.definition.colors.accentColor, -0.1)}" d="m40.514 17.321c-3.7651 6.6533-11.568 14.871-26.43 15.814 4.1721 4.2098 8.4613 6.4686 12.702 9.2806 4.7843-3.1725 9.6306-5.6353 14.3-10.997 3.6403-5.1332 3.0907-11.431-0.57249-14.097z" stroke-width=".2383" style="paint-order:stroke fill markers"/>
</svg>`


const svgUrlToPng = (svgUrl, options, callback) => {
  const svgImage = document.createElement('img');
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    callback(imgData);
    try {
      document.body.removeChild(svgImage)
    } catch (e) {
    }
  };
  svgImage.src = svgUrl;
};

const getSvgUrl = svg =>
  URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));

const svgToPng = (svg, options, callback) => {
  const url = getSvgUrl(svg);
  svgUrlToPng(url, options, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
};


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
        query: query,
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

function setFavicon(currentTheme) {
  const faviconOptions = {width: 32, height: 32};
  const faviconSVG = buildSVG(currentTheme, faviconOptions)
  svgToPng(faviconSVG, faviconOptions, (imgData) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = imgData;
  });
}

function setSearchIcon(currentTheme) {
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

function setAboutIcon(currentTheme) {
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
        storage.waifuThemes.themes["19b65ec8-133c-4655-a77b-13623d8e97d3"];
      const root = document.querySelector(':root');
      root.style.setProperty('--accent-color', currentTheme.definition.colors.accentColor);
      root.style.setProperty('--base-background-color', currentTheme.definition.colors.baseBackground);

      if (storage.showWidget === undefined || storage.showWidget) {
        document.querySelector("body").innerHTML =
          `
    <main>
    <div class="logo-and-wordmark">
        <div class="logo"></div>
        <div class="wordmark">Doki Theme for Firefox</div>
    </div>
    <div class="search-inner-wrapper">
        <input aria-controls="searchSuggestionTable" aria-expanded="false" aria-label="Search the Web"
               maxlength="256"
               placeholder="Search the Web" title="Search the Web" type="search" autofocus/>
        <button class="search-button" aria-label="Search" title="Search"></button>
    </div>
</main>
`
        // set themed icons
        setFavicon(currentTheme);
        setSearchIcon(currentTheme);
        setAboutIcon(currentTheme);

        /*---Event Listeners---*/
        const input = document.querySelector("input[type='search']");
        input.addEventListener("input", searchQuery, true);
        input.addEventListener("keydown", keyConfirm, true);

        const searchButton = document.querySelector(".search-button");
        searchButton.addEventListener("click", confirmSearch, false);
      } else {
        setFavicon(currentTheme);
      }
    });
}

applyTabListeners()

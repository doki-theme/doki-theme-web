import React, {useEffect, useRef, useState} from "react";
import {DokiTheme} from "../../common/DokiTheme";
import {svgToPng} from "../../background/svgTools";

function setThemedSearchInputIcon(currentTheme: DokiTheme) {
  const searchOptions = {width: 24, height: 24};
  svgToPng(currentTheme, searchOptions).then((imgData) => {
    const pngImage = document.createElement("img");
    pngImage.src = imgData;
    const style = `input { background: white url(${pngImage.src}) 12px center no-repeat; }`;
    const styleTag = document.createElement("style");
    styleTag.append(style);
    document.head.append(styleTag);
  });
}

function setThemedAboutIcon(currentTheme: DokiTheme) {
  const aboutOptions = {width: 96, height: 96};
  svgToPng(currentTheme, aboutOptions).then((imgData) => {
    const logo = document.querySelector("div[class='logo']");
    logo?.childNodes?.forEach((node) => {
      logo.removeChild(node);
    });
    const pngImage = document.createElement("img");
    logo!.appendChild(pngImage);
    pngImage.src = imgData;
  });
}

const SearchWidget = ({theme}: { theme: DokiTheme }) => {
  const logoElement = useRef(null);
  useEffect(() => {
    if (logoElement) {
      setThemedAboutIcon(theme);
    }
  }, [theme, logoElement]);

  const searchElement = useRef(null);
  useEffect(() => {
    if (searchElement) {
      setThemedSearchInputIcon(theme);
    }
  }, [theme, searchElement]);

  const [query, setQuery] = useState("");

  const conductSearch = () => {
    chrome.search.query({
      text: query,
      disposition: "CURRENT_TAB",
    }, () => {
    });
  };

  const confirmSearch = () => {
    return chrome.permissions
      .request({
        permissions: ["search"],
      }, (searchGranted) => {
        if (searchGranted) {
          conductSearch();
        }
      });
  };

  return (
    <main>
      <div className="logo-and-wordmark">
        <div ref={logoElement} className="logo"></div>
        <div className="wordmark">Doki Theme</div>
      </div>
      <div className="search-inner-wrapper">
        <input
          aria-controls="searchSuggestionTable"
          aria-expanded="false"
          aria-label="Search the web"
          maxLength={256}
          ref={searchElement}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              confirmSearch();
            }
          }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web"
          title="Search the web"
          type="search"
          autoFocus
        />
        <button
          className="search-button"
          onClick={confirmSearch}
          aria-label="Search"
          title="Search"
        ></button>
      </div>
    </main>
  );
};

export default SearchWidget;

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

function applyTabListeners() {
  browser.storage.local.get(["showWidget"])
    .then((storage) => {
      if (storage.showWidget === undefined || storage.showWidget) {
        document.querySelector("body").innerHTML =
          `
    <main>
    <div class="logo-and-wordmark">
        <div class="logo"></div>
        <div class="wordmark"></div>
    </div>
    <div class="search-inner-wrapper">
        <input aria-controls="searchSuggestionTable" aria-expanded="false" aria-label="Search the Web"
               maxlength="256"
               placeholder="Search the Web" title="Search the Web" type="search" autofocus/>
        <button class="search-button" aria-label="Search" title="Search"></button>
    </div>
</main>
`
        /*---Event Listeners---*/
        const input = document.querySelector("input[type='search']");
        input.addEventListener("input", searchQuery, true);
        input.addEventListener("keydown", keyConfirm, true);

        const searchButton = document.querySelector(".search-button");
        searchButton.addEventListener("click", confirmSearch, false);

      }
    });
}

applyTabListeners()

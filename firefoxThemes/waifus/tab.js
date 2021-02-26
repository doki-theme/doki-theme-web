let query = "";//the search query
/*Record the keywords to search for.
* These keywords will be delegated to the default search engine.*/
function searchQuery(e){
    query = e.target.value;
}
/*Submit searches by pressing the search button*/
function confirmSearch(){
    browser.tabs.getCurrent()
        .then((tab)=>{
            browser.search.search({
                query:query,
                tabId:tab.id
            });
        });

}
/*Submit searches by pressing the 'Enter' key*/
function keyConfirm(e){
    if(e.key === "Enter"){
        confirmSearch();
    }
}
// todo: fix these
/*---Event Listeners---*/
const input = document.querySelector("input[type='search']");
if(input) {
  input.addEventListener("input",searchQuery,true);
  input.addEventListener("keydown",keyConfirm,true);
}

const searchButton = document.querySelector(".search-button");
if(searchButton){
  searchButton.addEventListener("click",confirmSearch,false);
}

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
/*---Event Listeners---*/
document.querySelector("input[type='search']").addEventListener("input",searchQuery,true);
document.querySelector("input[type='search']").addEventListener("keydown",keyConfirm,true);
document.querySelector(".search-button").addEventListener("click",confirmSearch,false);
/*Adds Waifu to custom New Tab Page*/
function addWaifu(storage){
    const themes = storage.waifuThemes.themes;
    //Retrieve path to the image file
    const waifuImageURL =  storage.waifu ? `url(${browser.runtime.getURL(themes[storage.waifu].image)})`: "";
    const style = document.createTextNode("body:before {\n" +
        "\tcontent: \"\";\n" +
        "\tz-index: -1;\n" +
        "\tposition: fixed;\n" +
        "\ttop: 0;\n" +
        "\tleft: 0;\n" +
        `\tbackground: #f9a no-repeat ${waifuImageURL} center;\n` +
        "\tbackground-size: cover;\n" +
        "\twidth: 100vw;\n" +
        "\theight: 100vh;\n" +
        "}");
    let styleTag = document.createElement("style");
    styleTag.append(style);//Add CSS styles to <style>
    document.head.append(styleTag);
}
/*Apply Theme */
function applyTheme(){
    browser.storage.local.get(["waifuThemes","waifu"])
        .then((storage)=>{
            if(storage.waifu){
                addWaifu(storage);
            }
        });
}
applyTheme();
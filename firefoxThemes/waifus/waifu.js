/*Get background position */
function getAnchoring(theme) {
    if (theme.definition.overrides && theme.definition.overrides.theme &&
    theme.definition.overrides.theme.properties &&
    theme.definition.overrides.theme.properties.ntp_background_alignment) {
        return theme.definition.overrides.theme.properties.ntp_background_alignment;
    }
    return "center";
}
/*Adds Waifu to custom New Tab Page*/
async function addWaifu(storage){
    const themes = storage.waifuThemes.themes;
    //Retrieve path to the image file
    const currentTheme = themes[storage.currentThemeId];
    const waifuImageURL =  currentTheme ? `url(${browser.runtime.getURL(currentTheme.image)})`: "";
    const anchoring = getAnchoring(currentTheme);
    const style = document.createTextNode("body:before {\n" +
        "\tcontent: \"\";\n" +
        "\tz-index: -1;\n" +
        "\tposition: fixed;\n" +
        "\ttop: 0;\n" +
        "\tleft: 0;\n" +
        `\tbackground: #f9a no-repeat ${waifuImageURL} ${anchoring};\n` +
        "\tbackground-size: cover;\n" +
        "\twidth: 100vw;\n" +
        "\theight: 100vh;\n" +
        "}");
    let styleTag = document.createElement("style");
    styleTag.append(style);//Add CSS styles to <style>
    document.head.append(styleTag);
}
/*Apply Theme */
async function applyTheme(){
    browser.storage.local.get(["waifuThemes","currentThemeId"])
        .then((storage)=>{
            if(Object.keys(storage.waifuThemes.themes).includes(storage.currentThemeId)){
                addWaifu(storage);
            }
        });
}
applyTheme();

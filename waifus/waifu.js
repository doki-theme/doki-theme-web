/*Adds Waifu to custom New Tab Page*/
function addWaifu(){
    const waifu =
        document.querySelector("style").getAttribute("data-waifu");//Get Waifu
    const style = document.createTextNode("body:before {\n" +
        "\tcontent: \"\";\n" +
        "\tz-index: -1;\n" +
        "\tposition: fixed;\n" +
        "\ttop: 0;\n" +
        "\tleft: 0;\n" +
        `\tbackground: #f9a no-repeat url(${waifu}) center;\n` +
        "\tbackground-size: cover;\n" +
        "\twidth: 100vw;\n" +
        "\theight: 100vh;\n" +
        "}");

    const styleTag = document.querySelector("style");
    styleTag.append(style);//Add CSS styles to <style>
}
/*Removes Waifu from custom New Tab Page*/
function removeWaifu(updateInfo){
    if (!updateInfo.theme.colors) {
        let styleTag = document.querySelector("style");
        styleTag.parentElement.removeChild(styleTag);//Removes <style> from <head>
    }
}
/*---Event Lsiteners---*/
browser.theme.onUpdated.addListener(removeWaifu);
addWaifu();
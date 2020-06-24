document.addEventListener("DOMContentLoaded", () => {
  const changeColor = document.getElementById('changeColor');
  if(changeColor){
    chrome.storage.sync.get('color', function (data) {
      changeColor.style.backgroundColor = data.color;
      changeColor.setAttribute('value', data.color);
    });

    changeColor.onclick = (element) => {
      // @ts-ignore
      const color = element.target.value;
      chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
        console.log(`Sending color message ${color}`);
        chrome.tabs.sendMessage(id || 69, {color})
      })
    }
  }
});

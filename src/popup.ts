document.addEventListener("DOMContentLoaded", () => {
  const changeColor = document.getElementById('changeColor');

  chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
  });

    changeColor.onclick = (element) => {
      // @ts-ignore
      const color = element.target.value;
      chrome.tabs.query({currentWindow: true, active: true}, ([{id}]) => {
        chrome.tabs.sendMessage(id, {color},response => {})
      })
    };
});

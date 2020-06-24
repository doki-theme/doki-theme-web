chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.color) {
    const styles = `
      ::-moz-selection { background: #a73035; color: #E2CB14; }
      ::selection { background: #a73035; color: #E2CB14; }

      *::-webkit-scrollbar {
        width: 0.5em;
      }

      *::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.00);
      }

      *::-webkit-scrollbar-thumb {
        background-color: #a73035;
     } 
        `
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css"
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet)

    sendResponse(`Change color to ${msg.color}`);
  } else {
    sendResponse('Color message is none.');
  }
});


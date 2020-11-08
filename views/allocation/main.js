(function () {
  vscode.postMessage({
    type: "onLoad",
  });

  function updateAllocations(state) {
    let htmlContent = "";
    state.entries.forEach((entry) => {
      htmlContent += `<li class="timers-item">${formatDate(
        new Date(entry)
      )}<li>`;
    });

    document.getElementById("timers").innerHTML = htmlContent;
  }

  function updateState(newState) {
    updateAllocations(newState);
  }

  function formatDate(date) {
    if (!date) {
      return "";
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    debug("msg", message);
    switch (message.type) {
      case "updateState": {
        updateState(message.payload);
        break;
      }
    }
  });
})();

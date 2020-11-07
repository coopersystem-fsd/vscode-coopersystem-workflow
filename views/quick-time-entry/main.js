// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // Init state
  vscode.setState({
    hours: '',
    issue: '',
    message: '',
  });

  function updateState(newState) {
    vscode.setState(newState);
    updateInputs(newState);
  }

  function updateInputs(newState) {
    debug('updateInputs', newState);

    for (let key in newState) {
      document.getElementById(key).value = newState[key];
    }
  }

  document.querySelectorAll('input').forEach((el) => {
    el.addEventListener('change', (event) => {
      const element = event.target;

      vscode.setState({ ...vscode.getState(), [element.id]: element.value });
      vscode.postMessage({ type: 'state', payload: vscode.getState() });
    });
  });

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    debug('msg', message);
    switch (message.type) {
      case 'updateState': {
        updateState(message.payload);
        break;
      }
    }
  });
})();

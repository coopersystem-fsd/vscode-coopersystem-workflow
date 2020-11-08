window.vscode = acquireVsCodeApi();

function debug(msg, data) {
  vscode.postMessage({
    type: "debug",
    payload: {
      label: msg,
      data: data,
    },
  });
}

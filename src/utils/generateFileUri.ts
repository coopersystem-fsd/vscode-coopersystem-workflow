import * as vscode from "vscode";

export default function (
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  ...pathSegments: string[]
) {
  return webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, ...pathSegments)
  );
}

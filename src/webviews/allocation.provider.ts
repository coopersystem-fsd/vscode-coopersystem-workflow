import * as vscode from 'vscode';
import getNonce from '../utils/nonce';
import generateFileUri from '../utils/generateFileUri';

export class AllocationProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'coopersystem-workflow-allocation';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    this._view.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._view.webview.html = this._getHtmlforWebView(this._view.webview);

    this._view.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'debug': {
          console.log(data.payload.label, data.payload.data);
          break;
        }
      }
    });
  }

  private _getHtmlforWebView(webview: vscode.Webview) {
    const styleResetUri = generateFileUri(webview, this._extensionUri, 'media', 'reset.css');
    const styleVSCodeUri = generateFileUri(webview, this._extensionUri, 'media', 'vscode.css');
    const scriptCommonUri = generateFileUri(webview, this._extensionUri, 'media', 'common.js');

    const scriptUri = generateFileUri(webview, this._extensionUri, 'views', 'allocation', 'main.js');
    const styleMainUri = generateFileUri(webview, this._extensionUri, 'views', 'allocation', 'main.css');

    const nonce = getNonce();

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link href="${styleResetUri}" rel="stylesheet">
            <link href="${styleVSCodeUri}" rel="stylesheet">
            <link href="${styleMainUri}" rel="stylesheet">
        </head>
        <body>
            <ul id="timers">
              <!-- dinamic loading -->
            </ul>
            <div>
              <strong>Worked time: </strong>
              <span id="worked-time"></span>
            </div>

            <script nonce="${nonce}" src="${scriptCommonUri}"></script>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
  }
}

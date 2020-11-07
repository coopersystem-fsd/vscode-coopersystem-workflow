import * as vscode from 'vscode';
import getNonce from '../utils/nonce';
import generateFileUri from '../utils/generateFileUri';

export class AllocationProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = '';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
  }

  private _getHtmlforWebView(webview: vscode.Webview) {
    const styleResetUri = generateFileUri(webview, this._extensionUri, 'media', 'reset.css');
    const styleVSCodeUri = generateFileUri(webview, this._extensionUri, 'media', 'vscode.css');

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

            <title>Cat Colors</title>
        </head>
        <body>
            <div class="issue-time-inputs">
            <div class="mr5">
                <label for="issue">Issue</label>
                <input id="issue" type="text">
            </div>
            <div>
                <label for="hours">Time</label>
                <input id="hours" type="text">
            </div>
            </div>
            <div class="mtop5">
                <label for="message">Time Message</label>
                <input id="message" class="input" type="text">
            </div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
  }
}

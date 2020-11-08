import * as vscode from "vscode";

import CoopersystemWorkflow from "@coopersystem-fsd/workflow-sdk/dist/workflow";

import { TimeEntry } from "../api";
import generateFileUri from "../utils/generateFileUri";
import getLastCommitMessage from "../utils/getLastCommitMessage";
import getNonce from "../utils/nonce";

export class QuickTimeEntryProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "coopersystem-workflow-quick-time-entry";

  private readonly _initialState: TimeEntry = {
    issue: "",
    hours: "",
    message: "",
  };

  private _state: TimeEntry = { ...this._initialState };

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _cooperWorkflow: CoopersystemWorkflow
  ) {}

  public clearState() {
    this._updateState(this._initialState);
  }

  private _updateState(state: Partial<TimeEntry>) {
    this._state = {
      ...this._state,
      ...state,
    };

    this._reloadViewState();
  }

  private _reloadViewState() {
    this._view?.webview.postMessage({
      type: "updateState",
      payload: this._state,
    });
  }

  private _fetchLastCommitMessage() {
    getLastCommitMessage().then(
      (message) => this._updateState({ message }),
      (reason) => console.log(`Error: ${reason}`)
    );
  }

  private _fetchIssueWorkedHours() {
    this._cooperWorkflow.getLastIssueInExecutionWorkedHours().then(
      (hours) => {
        this._updateState({
          hours: hours.toFixed(2),
        });
      },
      (reason) => {
        vscode.window.showErrorMessage(
          `Failed getting data from allocation manager. ${reason}`
        );
      }
    );
  }

  private _fetchLastIssueInExecution() {
    this._cooperWorkflow.getLastIssueInExecution().then((issue) => {
      if (issue) {
        this._updateState({
          issue: issue.id.toString(),
        });
      }
    });
  }

  public _fetchData() {
    this._fetchLastCommitMessage();
    this._fetchIssueWorkedHours();
    this._fetchLastIssueInExecution();
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "state": {
          this._state = data.payload;
          break;
        }
        case "debug": {
          console.log(data.payload.label, data.payload.data);
          break;
        }
        case "onLoad": {
          this._fetchData();
          break;
        }
      }
    });
  }

  public getTimeEntry(): TimeEntry {
    return this._state;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = generateFileUri(
      webview,
      this._extensionUri,
      "media",
      "reset.css"
    );
    const styleVSCodeUri = generateFileUri(
      webview,
      this._extensionUri,
      "media",
      "vscode.css"
    );
    const scriptCommonUri = generateFileUri(
      webview,
      this._extensionUri,
      "media",
      "common.js"
    );

    const scriptUri = generateFileUri(
      webview,
      this._extensionUri,
      "views",
      "quick-time-entry",
      "main.js"
    );
    const styleMainUri = generateFileUri(
      webview,
      this._extensionUri,
      "views",
      "quick-time-entry",
      "main.css"
    );

    // Use a nonce to only allow a specific script to be run.
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
        <div class="issue-time-inputs">
          <div class="issue-time-inputs-item" class="mr5">
            <label for="issue">Issue</label>
            <input id="issue" type="text">
          </div>
          <div class="issue-time-inputs-item">
            <label for="hours">Time</label>
            <input id="hours" type="text">
          </div>
        </div>
        <div class="message-input">
          <label for="message">Message</label>
          <input id="message" class="input" type="text">
        </div>

        <script nonce="${nonce}" src="${scriptCommonUri}"></script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

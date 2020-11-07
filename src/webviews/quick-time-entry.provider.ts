import * as vscode from 'vscode';

import { RedmineClient } from '@smartinsf/redmine-client';

import { CoopersystemWorkflowConfig, TimeEntry } from '../api';
import generateFileUri from '../utils/generateFileUri';
import getNonce from '../utils/nonce';

// Create an instance passing your Redmine host and the username and password credentials
// Only Basic authentication is supported for now

enum IssueStatus {
  pause = 10,
  finished = 11,
  homolog = 5,
  executing = 3,
}

export class QuickTimeEntryProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'coopersystem-workflow-quick-time-entry';

  private _state: TimeEntry = {
    issue: '',
    hours: '',
    message: '',
  };

  private _view?: vscode.WebviewView;

  private _redmineClient: RedmineClient;

  constructor(private readonly _extensionUri: vscode.Uri) {
    const config = vscode.workspace.getConfiguration('coopersystem', this._extensionUri) as CoopersystemWorkflowConfig;

    this._redmineClient = new RedmineClient('http://redmine.coopersystem.com.br', config.ldap);
  }

  private _updateState(state: Partial<TimeEntry>) {
    this._state = {
      ...this._state,
      ...state,
    };
    this._view?.webview.postMessage({
      type: 'updateState',
      payload: this._state,
    });
  }

  private _fetchLastCommitMessage() {
    // TODO: Fetch last commit
    setTimeout(() => {
      this._updateState({
        message: 'Add new styles to home page',
      });
    }, 1000);
  }

  private _fetchIssueWorkedHours() {
    // TODO: Fetch it
    setTimeout(() => {
      this._updateState({
        hours: '3.2',
      });
    }, 1200);
  }

  private _fetchLastIssueInExecution() {
    this._redmineClient
      .issues()
      .list({
        assignedToId: 'me',
        statusId: IssueStatus.executing,
        sort: 'updated_on:desc',
        limit: 1,
      })
      .then((response) => {
        const [lastIssue] = response.issues;
        if (lastIssue) {
          this._updateState({
            issue: lastIssue.id.toString(),
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

    this._fetchData();

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      console.log('Data', data);

      switch (data.type) {
        case 'state': {
          this._state = data.payload;
          break;
        }
        case 'debug': {
          console.log(data.payload.label, data.payload.data);
          break;
        }
      }
    });
  }

  public getTimeEntry(): TimeEntry {
    return this._state;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = generateFileUri(webview, this._extensionUri, 'media', 'reset.css');
    const styleVSCodeUri = generateFileUri(webview, this._extensionUri, 'media', 'vscode.css');

    const scriptUri = generateFileUri(webview, this._extensionUri, 'views', 'quick-time-entry', 'main.js');
    const styleMainUri = generateFileUri(webview, this._extensionUri, 'views', 'quick-time-entry', 'main.css');

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

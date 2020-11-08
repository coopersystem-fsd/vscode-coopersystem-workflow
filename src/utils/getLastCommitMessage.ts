import * as execa from "execa";
import * as vscode from "vscode";

import parseGitCommits from "./parseGitCommits";

const COMMIT_FORMAT = "%H%n%aN%n%aE%n%at%n%ct%n%P%n%B";

export default async function () {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length > 1) {
    return Promise.reject(
      "Cannot determine the commit message because has more the one workspace folder"
    );
  }

  const workspaceFolder = workspaceFolders[0];

  const { stdout } = await execa.command(
    `git log -1 --format=${COMMIT_FORMAT} -z --`,
    {
      cwd: workspaceFolder.uri.fsPath,
    }
  );

  const [lastCommit] = parseGitCommits(stdout);
  if (!lastCommit) {
    return vscode.window.showErrorMessage(
      "Failed to get last commit message: bad commit format"
    );
  }

  // Assumes the first line as the message
  const [message] = lastCommit.message.split("\n");

  return message;
}

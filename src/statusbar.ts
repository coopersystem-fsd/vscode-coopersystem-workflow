import * as vscode from "vscode";

export function updateStatusBarItem(
  myStatusBarItem: vscode.StatusBarItem
): void {
  myStatusBarItem.text = `$(clock) 00:00`;
  myStatusBarItem.show();
}

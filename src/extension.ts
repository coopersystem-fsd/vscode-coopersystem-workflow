import { GitExtension } from './api/git';
import * as vscode from 'vscode';
import createTimeEntry from './commands/create-time-entry';

import { QuickTimeEntryProvider } from './webviews/quick-time-entry.provider';
import { AllocationProvider } from './webviews/allocation.provider';

export function activate(context: vscode.ExtensionContext) {
  const quickTimeEntryProvider = new QuickTimeEntryProvider(context.extensionUri);
  const allocationProvider = new AllocationProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(QuickTimeEntryProvider.viewType, quickTimeEntryProvider),
    vscode.window.registerWebviewViewProvider(AllocationProvider.viewType, allocationProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coopersystemWorkflow.createTimeEntry', () => {
      const timeEntry = quickTimeEntryProvider.getTimeEntry();

      createTimeEntry(timeEntry).then(() => {
        vscode.window.showInformationMessage(`Time entry for issue #${timeEntry.issue} created with success!`);
        quickTimeEntryProvider.clearState();
      });
    })
  );
}

export function deactivate() {}

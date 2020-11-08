import * as vscode from "vscode";

import { CoopersystemWorkflowFactory } from "@coopersystem-fsd/workflow-sdk";

import { CoopersystemWorkflowConfig } from "./api";
import { AllocationProvider } from "./webviews/allocation.provider";
import { QuickTimeEntryProvider } from "./webviews/quick-time-entry.provider";

import { updateStatusBarItem } from "./statusbar";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration(
    "coopersystem",
    context.extensionUri
  ) as CoopersystemWorkflowConfig;
  const cooperWorkflow = CoopersystemWorkflowFactory[config.userType](
    config.ldap
  );

  const quickTimeEntryProvider = new QuickTimeEntryProvider(
    context.extensionUri,
    cooperWorkflow
  );
  const allocationProvider = new AllocationProvider(context, cooperWorkflow);

  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      QuickTimeEntryProvider.viewType,
      quickTimeEntryProvider
    ),
    vscode.window.registerWebviewViewProvider(
      AllocationProvider.viewType,
      allocationProvider
    ),
    myStatusBarItem
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "coopersystemWorkflow.createTimeEntry",
      () => {
        const { issue, hours, message } = quickTimeEntryProvider.getTimeEntry();

        cooperWorkflow.createTimeEntry(+issue, +hours, message).then(
          () => {
            vscode.window.showInformationMessage(
              `Time entry for issue #${issue} has been created succesfully!`
            );
            quickTimeEntryProvider.clearState();
          },
          (reason) => {
            vscode.window.showErrorMessage(
              `Failed to create time entry for #${issue}! ${reason}`
            );
          }
        );
      }
    )
  );

  updateStatusBarItem(
    myStatusBarItem,
    context.globalState.get(AllocationProvider.viewType)
  );
}

export function deactivate() {}

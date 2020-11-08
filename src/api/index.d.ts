import { WorkspaceConfiguration } from "vscode";

export interface TimeEntry {
  hours: string;
  issue: string;
  message: string;
}

export enum UserType {
  coworker = "coWorker",
  intern = "intern",
}

export interface CoopersystemWorkflowConfig extends WorkspaceConfiguration {
  ldap: {
    username: string;
    password: string;
  };
  userType: UserType;
}

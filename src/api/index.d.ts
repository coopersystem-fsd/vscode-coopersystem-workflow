import { WorkspaceConfiguration } from 'vscode';

export interface TimeEntry {
  hours: string;
  issue: string;
  message: string;
}

export interface CoopersystemWorkflowConfig extends WorkspaceConfiguration {
  ldap: {
    username: string;
    password: string;
  };
}

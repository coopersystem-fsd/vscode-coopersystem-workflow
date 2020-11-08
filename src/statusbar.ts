import * as vscode from "vscode";
import { AllocationState } from "./api";

function convertDateToHours(date: Date) {
  return date.getHours() + date.getMinutes() / 60;
}

function getWorkedHoursToday(entries: Date[]) : number {
  if(entries.length === 0) {
    return 0;
  }
  const isOdd = entries.length % 2 > 0;
  if(isOdd) {
    entries.push(new Date(Date.now()));
  }
  return entries.reduce((prev, next) => Math.abs(prev - convertDateToHours(next)), 0);
}

function convertHoursToMilliseconds(hours: number) {
  return hours * (60 * 60 * 1000);
}

function msToTime(duration: number) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let strHours = hours < 10 ? "0" + hours : hours;
  let strMinutes = minutes < 10 ? "0" + minutes : minutes;

  return strHours + ":" + strMinutes;
}
     
let timer: any = null;

function updateTime(timestamp: number, myStatusBarItem: vscode.StatusBarItem) {
  const formattedTime = msToTime(timestamp);
  myStatusBarItem.text = `$(clock) ${formattedTime}`;
  myStatusBarItem.show();
}

export function updateStatusBarItem(
  myStatusBarItem: vscode.StatusBarItem,
  allocationState: AllocationState
): void {
  clearInterval(timer);
  const workedHours = getWorkedHoursToday(allocationState.entries.map((dateString) => new Date(dateString)));

  let timestamp = convertHoursToMilliseconds(workedHours)

  updateTime(timestamp, myStatusBarItem);

  timer = setInterval(() => {
    timestamp += 60000;
    updateTime(timestamp, myStatusBarItem);
  }, 60000);

}

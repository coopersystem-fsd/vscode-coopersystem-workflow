import * as vscode from "vscode";
/*
function getWorkedTime(state: any) {
  let time = 0;
  if (!state[FIRST_CHECKIN]) {
    return 0;
  }
  if (
    !state[FIRST_CHECKOUT] &&
    !state[SECOND_CHECKIN] &&
    !state[SECOND_CHECKOUT]
  ) {
    const difference = calculateDifferenceInMillis(
      state[FIRST_CHECKIN],
      getCurrentDate()
    );
    return msToTime(difference);
  }
  if (!state[SECOND_CHECKIN] && !state[SECOND_CHECKOUT]) {
    const difference = calculateDifferenceInMillis(
      state[FIRST_CHECKIN],
      state[FIRST_CHECKOUT]
    );
    return msToTime(difference);
  }
  if (!state[SECOND_CHECKOUT]) {
    const firstDifference = calculateDifferenceInMillis(
      state[FIRST_CHECKIN],
      state[FIRST_CHECKOUT]
    );
    const secondDifference = calculateDifferenceInMillis(
      state[SECOND_CHECKIN],
      getCurrentDate()
    );
    return msToTime(firstDifference + secondDifference);
  }
  const firstDifference = calculateDifferenceInMillis(
    state[FIRST_CHECKIN],
    state[FIRST_CHECKOUT]
  );
  const secondDifference = calculateDifferenceInMillis(
    state[SECOND_CHECKIN],
    state[SECOND_CHECKOUT]
  );
  return msToTime(firstDifference + secondDifference);
}
*/

function calculateDifferenceInMillis(dateA: Date, dateB: Date) {
  let start_date = Math.min(dateA.getTime(), dateB.getTime());
  let end_date = Math.max(dateA.getTime(), dateB.getTime());
  let difference = end_date - start_date;
  return difference;
}

function formatDate(date: Date) {
  if (!date) {
    return "";
  }
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let strHours = hours < 10 ? "0" + hours : hours;
  let strMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${strHours}:${strMinutes}`;
}

function msToTime(duration: number) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let strHours = hours < 10 ? "0" + hours : hours;
  let strMinutes = minutes < 10 ? "0" + minutes : minutes;
  let strSeconds = seconds < 10 ? "0" + seconds : seconds;

  return strHours + ":" + strMinutes + ":" + strSeconds;
}

function getCurrentDate() {
  return new Date();
}

export function updateStatusBarItem(
  myStatusBarItem: vscode.StatusBarItem,
  allocationState: any
): void {
  console.log("allocationState", allocationState);
  myStatusBarItem.text = `$(clock) 00:00`;
  myStatusBarItem.show();
}

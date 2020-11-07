import { TimeEntry } from '../api';

export default (timeEntry: TimeEntry) => {
  return new Promise((resolve) => {
    console.log('TODO: Create time entry', timeEntry);
    resolve(true);
  });
};

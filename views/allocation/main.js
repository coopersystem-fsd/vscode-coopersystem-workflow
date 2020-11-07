(function () {

  const FIRST_CHECKIN = '1st_checkin';
  const FIRST_CHECKOUT = '1st_checkout';
  const SECOND_CHECKIN = '2nd_checkin';
  const SECOND_CHECKOUT = '2nd_checkout';

  const mockedState = {
    [FIRST_CHECKIN]:  new Date('2020-10-07T08:00:00'),
    [FIRST_CHECKOUT]: new Date('2020-10-07T10:00:00'),
    [SECOND_CHECKIN]: new Date('2020-10-07T12:00:00'),
    [SECOND_CHECKOUT]: '',
  }


  function updateAllocations(state) {
    let htmlContent = '';
    htmlContent += `<li class="timers-item">${formatDate(state[FIRST_CHECKIN])}<li>`;
    htmlContent += `<li class="timers-item">${formatDate(state[FIRST_CHECKOUT])}<li>`;
    htmlContent += `<li class="timers-item">${formatDate(state[SECOND_CHECKIN])}<li>`;
    htmlContent += `<li class="timers-item">${formatDate(state[SECOND_CHECKOUT])}<li>`;
    document.getElementById('timers').innerHTML = htmlContent;
  }

  function updateWorkedTimeField(state) {
    let element = document.getElementById('worked-time');
    element.innerHTML = getWorkedTime(state);;
  }

  function getCurrentDate() {
    return new Date();
  }

  function getWorkedTime(state) {
    let time = 0;
    if(!state[FIRST_CHECKIN]) {
      return 0;
    }
    if(!state[FIRST_CHECKOUT] && !state[SECOND_CHECKIN] && !state[SECOND_CHECKOUT]) {
      const difference = calculateDifferenceInMillis(state[FIRST_CHECKIN], getCurrentDate());
      return msToTime(difference);
    }
    if(!state[SECOND_CHECKIN] && !state[SECOND_CHECKOUT]) {
      const difference = calculateDifferenceInMillis(state[FIRST_CHECKIN], state[FIRST_CHECKOUT]);
      return msToTime(difference);
    }
    if(!state[SECOND_CHECKOUT]) {
      const firstDifference = calculateDifferenceInMillis(state[FIRST_CHECKIN], state[FIRST_CHECKOUT]);
      const secondDifference = calculateDifferenceInMillis(state[SECOND_CHECKIN], getCurrentDate());
      return msToTime(firstDifference + secondDifference);
    }
    const firstDifference = calculateDifferenceInMillis(state[FIRST_CHECKIN], state[FIRST_CHECKOUT]);
    const secondDifference = calculateDifferenceInMillis(state[SECOND_CHECKIN], state[SECOND_CHECKOUT]);
    return msToTime(firstDifference + secondDifference);
  }

  function calculateDifferenceInMillis(dateA, dateB) {
    let start_date = Math.min(dateA.getTime(), dateB.getTime());
    let end_date = Math.max(dateA.getTime(), dateB.getTime());
    let difference = end_date - start_date;
    return difference;
  }

  function formatDate(date) {
    if(!date) {
      return '';
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    return `${hours}:${minutes}`;
  }

  function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }

  setInterval(() => {
    updateAllocations(mockedState);
    updateWorkedTimeField(mockedState);
  }, 1000);
})();

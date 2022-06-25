'use strict';

const time = {
  msec: 0,
  sec: 0,
  min: 0,
};

const maxTime = {
  msec: 1000,
  sec: 60,
  min: 60,
};

const addStr = (mainStr, secondStr) => secondStr + mainStr;

const timeFormatter = (secs, mins) => {
  const arr = [secs, mins];
  for (const [index, elem] of arr.entries()) {
    if (elem < 10) arr[index] = addStr(elem, '0');
  }
  roomData.currTime = arr.join(':');
  timer.innerHTML = `Time: ${roomData.currTime}`;
};

const countTime = (coll, maxTime, frameTime) => {
  coll.msec += frameTime;
  if (coll.msec >= maxTime.msec) {
    coll.msec -= maxTime.msec;
    coll.sec++;
  }
  if (coll.sec === maxTime.sec) {
    coll.sec -= maxTime.sec;
    coll.min++;
  }
  timeFormatter(coll.sec, coll.min);
};

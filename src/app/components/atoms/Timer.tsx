import React from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({ duration }: { duration: number }) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + duration); // 10 minutes timer

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.warn("onExpire called"),
  });
  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export default MyTimer;

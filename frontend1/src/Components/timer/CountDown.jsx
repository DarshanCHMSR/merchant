import React, { useState, useEffect } from 'react';

const CountDown = ({ initialMinutes = 0, initialSeconds = 0 }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let countdownInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0 && seconds === 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [minutes, seconds]);

  return (
    <div>
      <p className='text text-center text-primary'>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default CountDown;

import React, { useEffect, useState } from "react";
import "./index.css";

interface ClockDisplayProps {
  Time: Date;
}

function Clock(): JSX.Element {
  const interval = 1000;
  const [curTime, setCurTime] = useState(new Date());

  useEffect(() => {
    const interval_id = setInterval(() => {
      setCurTime(new Date());
    }, interval);
    return () => { clearInterval(interval_id); };
  }, []);

  return <ClockDisplay Time={curTime} />;
}

function ClockDisplay(props: ClockDisplayProps): JSX.Element {
  return (
    <div>
      {props.Time.getFullYear()}. {props.Time.getMonth() + 1}. {props.Time.getDate()}
      <div className="ClockDisplay">
        <div className="TextBox">{props.Time.getHours()}</div> :{" "}
        <div className="TextBox">{props.Time.getMinutes()}</div> :{" "}
        <div className="TextBox">{props.Time.getSeconds()}</div>
      </div>
    </div>
  );
}

export { Clock };

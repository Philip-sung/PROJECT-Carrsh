import React from "react";
import { observer } from "mobx-react-lite";
import { timeStoreObj } from "../../store/timeStore";
import "./index.css";

interface TimeBlockProps {
  store: typeof timeStoreObj;
  hour: number;
}

function TimeBar(): JSX.Element {
  return (
    <div className="TimeBar">
      {[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(hour => (
        <TimeBlock key={hour} store={timeStoreObj} hour={hour} />
      ))}
    </div>
  );
}

const TimeBlock = observer(({ store, hour }: TimeBlockProps) => {
  let selected = false;

  function selectTime() {
    console.log(`[SYSTEM]Selected Time : ${hour} `);
    if (store.isStartTimeSelected === false) {
      store.SetStartTimeInSelectedDate(hour);
      store.SetEndTimeInSelectedDate(hour);
      console.log(`[SYSTEM]Starting Time Set to : ${store.selectedStartTime}`);
      store.SetIsStartTimeSelected();
      store.SetIsEndTimeNotSelected();
    } else if (store.isEndTimeSelected === false) {
      store.SetEndTimeInSelectedDate(hour);
      console.log(`[SYSTEM]Ending Time Set to : ${store.selectedEndTime}`);
      store.SetIsEndTimeSelected();
      store.SetIsStartTimeNotSelected();
      if (store.selectedStartTime > store.selectedEndTime) {
        alert("Invalid Time");
        store.SetStartTimeInSelectedDate(0);
        store.SetEndTimeInSelectedDate(24);
        store.SetIsStartTimeNotSelected();
        store.SetIsEndTimeNotSelected();
      }
    }
  }

  if (store.isStartTimeSelected || store.isEndTimeSelected) {
    if (
      store.selectedTime.getDate() * 100 + hour >= store.selectedStartTime.getDate() * 100 + store.selectedStartTime.getHours() &&
      store.selectedTime.getDate() * 100 + hour <= store.selectedEndTime.getDate() * 100 + store.selectedEndTime.getHours()
    ) {
      selected = true;
    }
  } else {
    selected = false;
  }

  return (
    <div className={selected ? "TimeBlockSelected" : "TimeBlock"} onClick={selectTime}>{hour}</div>
  );
});

export { TimeBar };

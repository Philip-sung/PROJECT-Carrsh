import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import "./index.css";
import { timeStoreObj } from "../../store/timeStore";

interface CalanderProps {
  className?: string;
  store?: typeof timeStoreObj;
}

interface EachWeekProps {
  start: number;
  week: number;
  dayNum: number;
  year: number;
  month: number;
}

interface EachDayProps {
  day: number;
  dayNum: number;
  weekday: number;
  year: number;
  month: number;
}

interface CurTimeStoreProps {
  store: typeof timeStoreObj;
  children: React.ReactNode;
  year: number;
  month: number;
  date: number;
}

function CurrentCalander(props: CalanderProps): JSX.Element {
  let curTime = new Date();
  const [explore, setExplore] = useState(0);
  curTime.setHours(0, 0, 0, 0);
  curTime.setMonth(curTime.getMonth() + explore, 0);

  const curYear = curTime.getFullYear();
  const curMonth = curTime.getMonth() + 1;
  const curFirstDate = new Date(curYear, curMonth, 1);
  const curLastDate = new Date(curYear, curMonth + 1, 0);
  const dayNum = curLastDate.getDate();
  const firstWeekDay = curFirstDate.getDay();

  return (
    <div className={props.className}>
      <div className="CalanderHeader">
        <button className="ExploreMonth" onClick={() => { setExplore(explore - 1); }}></button>
        <div className="Year">{curYear} . {curMonth + 1}</div>
        <button className="ExploreMonth" onClick={() => { setExplore(explore + 1); }}></button>
      </div>
      <div className="Month">
        <WeekdayNames />
        <EachWeek start={firstWeekDay} week={1} dayNum={dayNum} year={curYear} month={curMonth + 1} />
        <EachWeek start={firstWeekDay} week={2} dayNum={dayNum} year={curYear} month={curMonth + 1} />
        <EachWeek start={firstWeekDay} week={3} dayNum={dayNum} year={curYear} month={curMonth + 1} />
        <EachWeek start={firstWeekDay} week={4} dayNum={dayNum} year={curYear} month={curMonth + 1} />
        <EachWeek start={firstWeekDay} week={5} dayNum={dayNum} year={curYear} month={curMonth + 1} />
        <EachWeek start={firstWeekDay} week={6} dayNum={dayNum} year={curYear} month={curMonth + 1} />
      </div>
    </div>
  );
}

function EachWeek(props: EachWeekProps): JSX.Element {
  let i = 1;
  if (props.start === 0) { i = -6; } else { i = 1; }

  let firstSunday = i + (7 - props.start) + (props.week - 1) * 7;
  return (
    <div className="Week">
      <div><EachDay day={firstSunday - 6} dayNum={props.dayNum} weekday={1} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday - 5} dayNum={props.dayNum} weekday={2} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday - 4} dayNum={props.dayNum} weekday={3} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday - 3} dayNum={props.dayNum} weekday={4} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday - 2} dayNum={props.dayNum} weekday={5} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday - 1} dayNum={props.dayNum} weekday={6} year={props.year} month={props.month} /></div>
      <div><EachDay day={firstSunday} dayNum={props.dayNum} weekday={0} year={props.year} month={props.month} /></div>
    </div>
  );
}

function EachDay(props: EachDayProps): JSX.Element {
  if (props.day > 0 && props.day <= props.dayNum) {
    return (
      <div className={`EachDay ${props.weekday === 6 ? "Sat" : props.weekday === 0 ? "Sun" : ""}`}>
        <CurTimeStore store={timeStoreObj} year={props.year} month={props.month} date={props.day}>{props.day}</CurTimeStore>
      </div>
    );
  } else {
    return (
      <div className="EachDay">
        <div className="NumBox">-</div>
      </div>
    );
  }
}

function WeekdayNames(): JSX.Element {
  return (
    <div className="Week WeekDay">
      <div className="EachDay">{ReturnWeekdayText(1)}</div>
      <div className="EachDay">{ReturnWeekdayText(2)}</div>
      <div className="EachDay">{ReturnWeekdayText(3)}</div>
      <div className="EachDay">{ReturnWeekdayText(4)}</div>
      <div className="EachDay">{ReturnWeekdayText(5)}</div>
      <div className="EachDay Sat">{ReturnWeekdayText(6)}</div>
      <div className="EachDay Sun">{ReturnWeekdayText(0)}</div>
    </div>
  );
}

function ReturnWeekdayText(num: number): string {
  const weekdays: Record<number, string> = { 0: "\uc77c", 1: "\uc6d4", 2: "\ud654", 3: "\uc218", 4: "\ubaa9", 5: "\uae08", 6: "\ud1a0" };
  return weekdays[num] || "";
}

const CurTimeStore = observer(({ store, children, year, month, date }: CurTimeStoreProps) => {
  const selectTime = () => {
    store.SetIsDateNotSelected();
    store.SetTime(year, month, date, 0, 0, 0);
    store.SetIsDateSelected();
    console.log(`[SYSTEM]Selected Date : ${store.selectedTime}`);
    store.SetDayMarker(date);
  };

  return (
    <div className={date === store.dayMarker ? "NumBoxHighlighted" : "NumBox"} onClick={selectTime}>{children}</div>
  );
});

export { CurrentCalander };

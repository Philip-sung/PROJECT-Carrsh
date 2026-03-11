import { makeObservable, action, observable } from "mobx";

class TimeStore {
  selectedTime: Date = new Date();
  selectedStartTime: Date = new Date();
  selectedEndTime: Date = new Date();
  isDateSelected: boolean = false;
  isStartTimeSelected: boolean = false;
  isEndTimeSelected: boolean = false;
  dayMarker: number = 0;

  constructor() {
    makeObservable(this, {
      selectedTime: observable,
      selectedStartTime: observable,
      selectedEndTime: observable,
      isDateSelected: observable,
      isStartTimeSelected: observable,
      isEndTimeSelected: observable,
      dayMarker: observable,
      SetTime: action,
      SetYear: action,
      SetMonth: action,
      SetDay: action,
      SetHours: action,
      SetMinutes: action,
      SetIsDateSelected: action,
      SetIsDateNotSelected: action,
      SetIsStartTimeSelected: action,
      SetIsStartTimeNotSelected: action,
      SetIsEndTimeSelected: action,
      SetIsEndTimeNotSelected: action,
      SetStartTimeInSelectedDate: action,
      SetEndTimeInSelectedDate: action,
      SetDayMarker: action,
      Initialize: action,
      GetCurrentTimeString: action,
    });
  }

  SetTime(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number
  ): void {
    this.selectedTime.setFullYear(year);
    this.selectedTime.setMonth(month - 1);
    this.selectedTime.setDate(date);
    this.selectedTime.setHours(hours);
    this.selectedTime.setMinutes(minutes);
    this.selectedTime.setSeconds(seconds);
  }

  SetYear(year: number): void {
    this.selectedTime.setFullYear(year);
  }

  SetMonth(month: number): void {
    this.selectedTime.setMonth(month - 1);
  }

  SetDay(day: number): void {
    this.selectedTime.setDate(day);
  }

  SetDate(date: number): void {
    this.selectedTime.setDate(date);
  }

  SetHours(hours: number): void {
    this.selectedTime.setHours(hours);
  }

  SetMinutes(minutes: number): void {
    this.selectedTime.setMinutes(minutes);
  }

  SetIsDateSelected(): void {
    this.isDateSelected = true;
  }

  SetIsDateNotSelected(): void {
    this.isDateSelected = false;
  }

  SetIsStartTimeSelected(): void {
    this.isStartTimeSelected = true;
  }

  SetIsStartTimeNotSelected(): void {
    this.isStartTimeSelected = false;
  }

  SetIsEndTimeSelected(): void {
    this.isEndTimeSelected = true;
  }

  SetIsEndTimeNotSelected(): void {
    this.isEndTimeSelected = false;
  }

  SetStartTimeInSelectedDate(hours: number): void {
    this.selectedStartTime = new Date(this.selectedTime.getTime());
    this.selectedStartTime.setHours(hours);
  }

  SetEndTimeInSelectedDate(hours: number): void {
    this.selectedEndTime = new Date(this.selectedTime.getTime());
    this.selectedEndTime.setHours(hours);
  }

  SetDayMarker(date: number): void {
    this.dayMarker = date;
  }

  Initialize(): void {
    this.isDateSelected = false;
    this.isEndTimeSelected = false;
    this.isStartTimeSelected = false;
    this.selectedTime = new Date();
    this.selectedStartTime = new Date();
    this.selectedEndTime = new Date();
  }

  GetCurrentTimeString(): string {
    const curTime = new Date();
    const Days = ["Sn", "Mn", "Tu", "Wd", "Th", "Fr", "St"];
    const curDay = Days[curTime.getDay()].toString();
    const timeString = `${curTime.getFullYear().toString().padStart(2, "0")}.${(curTime.getMonth() + 1).toString().padStart(2, "0")}.${curTime.getDate().toString().padStart(2, "0")} ${curDay} ${curTime.getHours().toString().padStart(2, "0")}:${curTime.getMinutes().toString().padStart(2, "0")}`;

    return timeString;
  }
}

const timeStoreObj = new TimeStore();

export { timeStoreObj };

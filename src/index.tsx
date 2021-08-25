import * as React from 'react';
import Calendar from "./Calendar";
import './index.scss';

type AppParamaterProps = {
  selectDateType: string,
  disableDates: string,
  disableCertainDates: Array<object>,
  duelSlotDates: Array<object>,
  singleSlotDates: Array<object>,
  onSelect: (date: Date) => Date,
  slotInfo: boolean,
  showDateInputField: boolean,
  showArrow: boolean,
  showSelectMonthArrow: boolean,
  showSelectYearArrow: boolean,
  showDatelabel: boolean,
  templateClr: string,
  minDate: string,
  maxDate: string,
  disableDays: Array<string>,
  defaultValue: any,
};

const App = ({
  selectDateType,
  disableDates,
  disableCertainDates,
  duelSlotDates,
  singleSlotDates,
  onSelect,
  slotInfo,
  showDateInputField,
  showArrow,
  showSelectMonthArrow,
  showSelectYearArrow,
  showDatelabel,
  templateClr,
  minDate,
  maxDate,
  disableDays,
  defaultValue
}: AppParamaterProps) => {
  return (
    <Calendar
      selectDateType={selectDateType}
      disableDates={disableDates}
      disableCertainDates={disableCertainDates}
      duelSlotDates={duelSlotDates}
      singleSlotDates={singleSlotDates}
      onSelect={(date: Date) => onSelect && onSelect(date)}
      slotInfo={slotInfo}
      showDateInputField={showDateInputField}
      showArrow={showArrow}
      showSelectMonthArrow={showSelectMonthArrow}
      showSelectYearArrow={showSelectYearArrow}
      showDatelabel={showDatelabel}
      templateClr={templateClr}
      minDate={minDate}
      maxDate={maxDate}
      disableDays={disableDays}
      defaultValue={defaultValue}
    />
  )
}

export default App



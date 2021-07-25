import React from "react";
import Calendar from "./Calendar/calendar";

/**
 * @returns {boolean} return props defined calendar
 */
function CallComponent() {
  // const singleSlotDates = [
  //   { date: "2021-07-03", avaliableSlot: 7 },
  //   { date: "2021-07-05", avaliableSlot: 1 },
  //   { date: "2021-07-15", avaliableSlot: 7 },
  //   { date: "2021-07-07", avaliableSlot: 10 },
  //   { date: "2021-07-01", avaliableSlot: 8 },
  //   { date: "2021-07-04", avaliableSlot: 10 },
  //   { date: "2021-07-10", avaliableSlot: 5 },
  //   { date: "2021-07-13", avaliableSlot: 4 },
  //   { date: "2021-07-14", avaliableSlot: 22 },
  //   { date: "2021-07-17", avaliableSlot: 50 },
  //   { date: "2021-07-20", avaliableSlot: 44 },
  //   { date: "2021-07-22", avaliableSlot: 9 },
  //   { date: "2021-07-24", avaliableSlot: 66 },
  //   { date: "2021-07-25", avaliableSlot: 3 },
  //   { date: "2021-07-28", avaliableSlot: 32 },
  // ];

  const duelSlotDates = [
    { date: "2021-07-02", totalSlot: "30", avaliableSlot: "4" },
    { date: "2021-07-10", totalSlot: "30", avaliableSlot: "5" },
    { date: "2021-07-05", totalSlot: "280", avaliableSlot: "160" },
    { date: "2021-07-07", totalSlot: "30", avaliableSlot: "14" },
    { date: "2021-07-08", totalSlot: "5", avaliableSlot: "3" },
    { date: "2021-07-11", totalSlot: "50", avaliableSlot: "23" },
    { date: "2021-07-13", totalSlot: "44", avaliableSlot: "44" },
    { date: "2020-07-12", totalSlot: "50", avaliableSlot: "24" },
    { date: "2021-7-14", totalSlot: "50", avaliableSlot: "0" },
    { date: "2021-07-15", totalSlot: "50", avaliableSlot: "17" },
    { date: new Date(), totalSlot: "50", avaliableSlot: "30" },
    { date: "2021-07-21", totalSlot: "80", avaliableSlot: "30" },
    { date: "2021-07-23", totalSlot: "80", avaliableSlot: "44" },
    { date: "2021-07-26", totalSlot: "30", avaliableSlot: "22" },
    { date: "2021-07-28", totalSlot: "30", avaliableSlot: "30" },
    { date: "2021-07-03", totalSlot: "30", avaliableSlot: "25" },
  ];

  const disableCertainDates = [new Date(), "2021-06-07", "2021-07-8", "2021-07-15"];

  return (
    <>
      <Calendar
        // duelSlotDates={duelSlotDates}
        // singleSlotDates={singleSlotDates}
        // selectDateType="single"
        // disableDates="past"
        // disableCertainDates={disableCertainDates}
        onSelect={(data) => console.log(data, "data")}
        // slotInfo={true}
        // showDateInputField={false}
        // showArrow={false}
        // showSelectMonthArrow={true}
        // showSelectYearArrow={true}
        // showDatelabel={true}
        // templateClr="blue"
      />
    </>
  );
}

export default CallComponent;

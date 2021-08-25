import { formatDay } from "../cldDisable";
/**
 * @param {object} date contain date
 * @param {number} addupDay to plus one date
 * @returns {string} returns date
 */
const addDays = (date: string, addupDay = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() + addupDay);
  return result;
};

/**
 * @param {object} start contain startdate
 * @param {object} end contain enddate
 * @param {object} range contain the date
 * @returns {string} returns dateRange
 */
export const dateRange:any = (start: any, end: any, range = []) => {
  if (new Date(formatDay(start)) > new Date(formatDay(end))) return range;
  const next = addDays(start, 1);
  return dateRange(next, end, [...range, start]);
};

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
 export function getDaysInMonth(month: number, year:  number) {
  var date = new Date(year, month, 1);
  var monthIndays = [];
  while (date.getMonth() === month) {
    monthIndays.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return monthIndays;
}
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
const dateRange:any = (start: any, end: any, range = []) => {
  if (new Date(formatDay(start)) > new Date(formatDay(end))) return range;
  const next = addDays(start, 1);
  return dateRange(next, end, [...range, start]);
};

export default dateRange;

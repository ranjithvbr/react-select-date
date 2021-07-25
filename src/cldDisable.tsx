const currentDate = new Date();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * @param {string} renderDate contain a date
 * @param {string} disableState contain a disable-state past || future
 * @returns {string} disable date
 */
export function getDisableDate(renderDate: string | number | Date, disableState: string) {
  let disableRange;
  if (disableState === "past") {
    const subractOneDay = new Date(renderDate);
    subractOneDay.setDate(subractOneDay.getDate() + 1);
    disableRange = subractOneDay < new Date() && "cld_disableDate";
  } else if (disableState === "future") {
    disableRange = renderDate >= new Date() && "cld_disableDate";
  }
  return disableRange;
}

/**
 * @param {string} disableState contain a disable-state past || future
 * @param {string} month contain a month value
 * @param {string} year contain a year value
 * @returns {boolean} for disable arrow
 */
export function getDisableDateForArrow(disableState: string, month: number, year: number) {
  let disableArrow;
  if (disableState === "past") {
    disableArrow = !!(currentDate.getMonth() >= month - 1 && currentDate.getFullYear() >= year);
  } else if (disableState === "future") {
    disableArrow = !!(currentDate.getMonth() <= month - 1 && currentDate.getFullYear() <= year);
  }
  return disableArrow;
}

/**
 * @param {string} disableState contain a disable-state past || future
 * @returns {string} disable year
 */
export function getDisableYear(disableState: string) {
  let disableYear;
  if (disableState === "past") {
    disableYear = {
      startYearOption: currentDate.getFullYear(),
      endYearOption: 2100,
    };
  } else if (disableState === "future") {
    disableYear = {
      startYearOption: 1921,
      endYearOption: currentDate.getFullYear(),
    };
  }
  return disableYear;
}

/**
 * @param {string} date contain date
 * @param {boolean} format contain boolean value
 * @returns {string} returns a formated date
 */
export function formatDay(date: Date, format = false) {
  if (date) {
    const addZeroToMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const addZeroToDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    if (format) {
      return `${months[Number(addZeroToMonth) - 1]} ${addZeroToDate},${date.getFullYear()}`;
    }
    const dateIdFromCld = `${date.getFullYear()}-${addZeroToMonth}-${addZeroToDate}`;

    return dateIdFromCld;
  }
  return "";
}

/**
 * @param {string} disableState contain a disable-state past || future
 * @returns {object} set the start date and end date in field
 */
export function getDisableDateForField(disableState: string) {
  let disablefield;
  if (disableState === "past") {
    disablefield = {
      minDate: formatDay(new Date()),
      maxDate: "2100-12-31",
    };
  } else if (disableState === "future") {
    disablefield = {
      minDate: "1921-01-01",
      maxDate: formatDay(new Date()),
    };
  }
  return disablefield;
}

/**
 * @param {string} renderDate contain a date
 * @param {string} disableCertainDate contain a disable-state past || future
 * @returns {string} disable date
 */
export function getDisableCertainDate(renderDate: Date, disableCertainDate: any[]) {
  let disableCerDate;
  disableCertainDate.forEach((dt: string | number | Date) => {
    const formatDt = new Date(dt);
    if (
      formatDt.getDate() === renderDate.getDate() &&
      formatDt.getMonth() === renderDate.getMonth() &&
      formatDt.getFullYear() === renderDate.getFullYear()
    ) {
      disableCerDate = "cld_disableDate";
    }
  });
  return disableCerDate;
}

/**
 * @param {string} disableCertainDate contain a disable-state past || future
 * @param {string} dateTypeId contain a render date
 * @param {string} rangeStartDate contain a date
 * @param {string} rangeEndDate contain a date
 * @returns {string} disable date
 */
export function getDisableWhenRange(disableCertainDate: any[], dateTypeId: string | number | Date, rangeStartDate: string | number, rangeEndDate: string | number) {
  const disableCertainDateFormat: string[] = [];

  disableCertainDate.forEach((dt: string | number | Date) => {
    disableCertainDateFormat.push(formatDay(new Date(dt)));
  });
  let disableWhenRange;
  if (
    dateTypeId > rangeStartDate &&
    dateTypeId < rangeEndDate &&
    disableCertainDateFormat.includes(formatDay(new Date(dateTypeId)))
  ) {
    disableWhenRange = "cld_disablebgColor";
  }
  return disableWhenRange;
}

/**
 * @param {string} date date object 
 * @returns date object with current time
 */
export function setCurrentTime(date: string | number | Date){
  const changeTime = new Date(date)
  const now = new Date()
  changeTime.setHours(now.getHours())
  changeTime.setMinutes(now.getMinutes())
  changeTime.setSeconds(now.getSeconds())
  changeTime.setMilliseconds(now.getMilliseconds())
  return changeTime;
}

/**
 * @param {Number} num number
 * @returns number if length 1 returns with zero
 */
export function addZero(num: string | number) {
  return num > 9 ? num : "0" + num
}

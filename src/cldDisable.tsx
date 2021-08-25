const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days: any = {sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6};
const daysArr = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * @param {Number} num number
 * @returns number if length 1 returns with zero
 */
 export function addZero(num: string | number) {
  return num > 9 ? num : "0" + num
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
 * @param {Date} minDate contain a date
 * @param {Date} renderDate contain a date
 * @returns {boolean} for disable date
 */
 export function setMinDate(minDate:Date, renderDate: Date) {
  let minimumDate = renderDate < new Date(minDate) && "cld_disableDate";
  return minimumDate;
}

/**
 * @param {Date} maxDate contain a date
 * @param {Date} renderDate contain a date
 * @returns {boolean} for disable date
 */
 export function setMaxDate(maxDate:Date, renderDate: Date) {
  let maximamDate = renderDate > new Date(maxDate) && "cld_disableDate";
  return maximamDate;
}

/**
 * @param {Array} contain disable days
 * @return {boolean} disable the day
 */

 export function getDisableDays(day: any, renderDate: string) {
  let dayDisable = day.some((dy: string)=>{
    return days[dy] === new Date(renderDate).getDay();
  })
  return dayDisable && "cld_disableDate";
 }

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
    disableRange = setCurrentTime(renderDate) > new Date() && "cld_disableDate";
  }
  return disableRange;
}

/**
 * @param {string} disableState contain a disable-state past || future
 * @param {string} minDate contain a min date
 * @returns {string} disable year
 */
export function getDisableYear(disableState: string, minDate: string, maxDate: string) {
  if(disableState === "past"){
    if(minDate && maxDate){
      return {
        startYearOption: new Date(minDate) < new Date() ? new Date().getFullYear() :  new Date(minDate).getFullYear(),
        endYearOption: new Date(maxDate).getFullYear()
      }
    }

    if(minDate && new Date(minDate) > new Date()){
      return {
        startYearOption: new Date(minDate).getFullYear(),
        endYearOption: 2100
      }
    }
    if(maxDate && new Date(maxDate) > new Date()){
      return{
        startYearOption: new Date().getFullYear(),
        endYearOption: new Date(maxDate).getFullYear()
      }
    }
    return{
      startYearOption: new Date().getFullYear(),
      endYearOption: 2100
    }
  }else if(disableState === "future"){
    if(minDate && maxDate){
      return {
        startYearOption: new Date(minDate).getFullYear(),
        endYearOption: new Date(maxDate) > new Date() ? new Date().getFullYear() :  new Date(maxDate).getFullYear()
      }
    }

    if(minDate && new Date(minDate) < new Date()){
      return {
        startYearOption: new Date(minDate).getFullYear(),
        endYearOption: new Date().getFullYear()
      }
    }
    if(maxDate && new Date(maxDate) < new Date()){
      return{
        startYearOption: 1921,
        endYearOption: new Date(maxDate).getFullYear()
      }
    }

    return{
      startYearOption: 1921,
      endYearOption: new Date().getFullYear()
    }
  }

  if(minDate && maxDate){
    return {
      startYearOption: new Date(minDate).getFullYear(),
      endYearOption: new Date(maxDate).getFullYear()
    }
  }
  
  if(minDate && !disableState){
    return {
      startYearOption: new Date(minDate).getFullYear(),
      endYearOption: 2100
    }
  }
  
  if(maxDate && !disableState){
    return {
      startYearOption: 1921,
      endYearOption: new Date(maxDate).getFullYear()
    }
  }
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
export function getDisableWhenRange(disableCertainDate: any[],disableDays: any[], dateTypeId: string | number | Date, rangeStartDate: string | number, rangeEndDate: string | number,getDayArr: any, startAndendDate: any) {
  const disableCertainDateFormat: string[] = [];
  disableCertainDate.forEach((dt: string | number | Date) => {
    disableCertainDateFormat.push(formatDay(new Date(dt)));
  });

  if(disableCertainDateFormat.length && disableCertainDateFormat.includes(formatDay(new Date(startAndendDate.startDate))) && formatDay(new Date(startAndendDate.startDate)) === formatDay(new Date(dateTypeId))){
    return "startDateDisablebg"
  }

  if(disableCertainDateFormat.length && disableCertainDateFormat.includes(formatDay(new Date(startAndendDate.endDate))) && formatDay(new Date(startAndendDate.endDate)) === formatDay(new Date(dateTypeId))){
    return "endDateDisablebg"
  }

  if (
    dateTypeId > rangeStartDate &&
    dateTypeId < rangeEndDate &&
    disableCertainDateFormat.includes(formatDay(new Date(dateTypeId)))
  ) {
    return "cld_disablebgColor";
  }

  const disableCertainDayFormat: string[] = [];
  getDayArr?.forEach((dy: Date)=>{
    if(disableDays.includes(daysArr[(dy.getDay())])){
      disableCertainDayFormat.push(formatDay(new Date(dy)));
    } 
  })

  if(disableCertainDayFormat.length && disableCertainDayFormat.includes(formatDay(new Date(startAndendDate.startDate))) && formatDay(new Date(startAndendDate.startDate)) === formatDay(new Date(dateTypeId))){
    return "startDateDisablebg"
  }

  if(disableCertainDayFormat.length && disableCertainDayFormat.includes(formatDay(new Date(startAndendDate.endDate))) && formatDay(new Date(startAndendDate.endDate)) === formatDay(new Date(dateTypeId))){
    return "endDateDisablebg"
  }

  if (
    dateTypeId > rangeStartDate &&
    dateTypeId < rangeEndDate &&
    disableCertainDayFormat.includes(formatDay(new Date(dateTypeId)))
  ) {
    return "cld_disablebgColor";
  }
}

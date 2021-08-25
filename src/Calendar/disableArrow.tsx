const currentDate = new Date();

/**
 * @param {string} minDate contain a start date
 * @param {number} dynYear contain a year
 * @param {number} dynMonth contain a month
 * @returns {boolean} disable arrow
 */
const disableArrowWhenMinDate = (minDate: string, dynYear: number, dynMonth: number, disableState: string) => {
    if(minDate){
      let minNewDate = disableState === "past" && minDate && new Date(minDate) < new Date() ? new Date() : new Date(minDate);
      return minNewDate.getFullYear() === dynYear && (minNewDate.getMonth() + 1) === dynMonth
    }
    return;
  }

/**
 * @param {string} disableState contain a disable-state past || future
 * @param {any} disableArrow contain a boolean
 * @param {string} dynYear contain a year
 * @param {string} dynMonth contain a month
 * @returns {boolean} disable arrow
 */
export function disableLeftArrow(disableState: string, disableArrow: any, dynYear: number, dynMonth: number, minDate: string){
    return (disableState === "past" && !minDate && disableArrow) || (dynYear === 1921 && dynMonth === 1) || disableArrowWhenMinDate(minDate, dynYear, dynMonth, disableState)
}

/**
 * @param {string} maxDate contain a start date
 * @param {number} dynYear contain a year
 * @param {number} dynMonth contain a month
 * @returns {boolean} disable arrow
 */
 const disableArrowWhenMaxDate = (maxDate: string, dynYear: number, dynMonth: number, disableState: string) => {
    if(maxDate){
      const maxNewDate = disableState === "future" && maxDate && new Date(maxDate) > new Date() ? new Date() : new Date(maxDate);
      return maxNewDate.getFullYear() === dynYear && (maxNewDate.getMonth() + 1) === dynMonth
    }
    return;
  }

/**
 * @param {string} disableState contain a disable-state past || future
 * @param {any} disableArrow contain a boolean
 * @param {string} dynYear contain a year
 * @param {string} dynMonth contain a month
 * @returns {boolean} disable arrow
 */
export function disableRightArrow(disableState: string, disableArrow: any, dynYear: number, dynMonth: number, maxDate: string){
    return (disableState === "future" && !maxDate && disableArrow) || (dynYear === 2100 && dynMonth === 12) || disableArrowWhenMaxDate(maxDate, dynYear, dynMonth, disableState)
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

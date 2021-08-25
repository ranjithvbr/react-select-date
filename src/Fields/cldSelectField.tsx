import * as React from 'react'
import "./cldSelectField.scss";

type monthParameterProps = {
  disableState: string,
  dynMonth: number,
  dynYear: number,
  handleChangeSelect: (data: any)=> void,
  showSelectMonthArrow: boolean,
  minDate: any,
  maxDate: string,
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentDate = new Date();

/**
 * @param {*} props all props
 * @returns {object} returns a select field(Month)
 */
export function SelectMonthField({ disableState, dynMonth, dynYear, handleChangeSelect, showSelectMonthArrow, minDate, maxDate } : monthParameterProps) {
  /**
   * @param {number} index contain id
   * @returns {boolean} returns a boolean value
   */
  const disableMonthFunc = (index: number) => {
    if(disableState === "past"){
      if(minDate && maxDate){
        let dateSetPast = new Date(minDate) < new Date() ? new Date() : new Date(minDate);
        return (dateSetPast.getFullYear() === dynYear && dateSetPast.getMonth() > index) || (new Date(maxDate).getFullYear() === dynYear && new Date(maxDate).getMonth() < index);
      }
      if(minDate && new Date(minDate) > new Date()){
        return new Date(minDate).getFullYear() === dynYear && new Date(minDate).getMonth() > index;
      }
      if(maxDate){
        return (currentDate.getFullYear() === dynYear && currentDate.getMonth() > index) || (new Date(maxDate).getFullYear() === dynYear && new Date(maxDate).getMonth() < index);
      }
      return currentDate.getFullYear() === dynYear && currentDate.getMonth() > index;
    }else if(disableState === "future"){
      if(minDate && maxDate){
        let dateSet = new Date(maxDate) > new Date() ? new Date() : new Date(maxDate);
        return (new Date(minDate).getFullYear() === dynYear && new Date(minDate).getMonth() > index) || (dateSet.getFullYear() === dynYear && dateSet.getMonth() < index);
      }
      if(minDate && new Date(minDate) < new Date()){
        return (new Date(minDate).getFullYear() === dynYear && new Date(minDate).getMonth() > index) || (currentDate.getFullYear() === dynYear && currentDate.getMonth() < index);
      }

      if(maxDate && new Date(maxDate) < new Date()){
        return new Date(maxDate).getFullYear() === dynYear && new Date(maxDate).getMonth() < index
      }
      return currentDate.getFullYear() === dynYear && currentDate.getMonth() < index;
    }
    if(minDate && maxDate){
      return (new Date(minDate).getFullYear() === dynYear && new Date(minDate).getMonth() > index) || (new Date(maxDate).getFullYear() === dynYear && new Date(maxDate).getMonth() < index);
    }
    if(minDate && !disableState){
      return new Date(minDate).getFullYear() === dynYear && new Date(minDate).getMonth() > index;
    }
    if(maxDate && !disableState){
      return new Date(maxDate).getFullYear() === dynYear && new Date(maxDate).getMonth() < index;
    }
    return;
  };

  return (
    <select
      disabled={showSelectMonthArrow}
      className={`${showSelectMonthArrow && "cld_disableArrow"}`}
      id="selectMonth"
      value={dynMonth - 1}
      onChange={(e) => handleChangeSelect(e)}
    >
      {months.map((data, index) => {
        return (
          <option disabled={disableMonthFunc(index)} key={data} value={index}>
            {data}
          </option>
        );
      })}
    </select>
  );
}

type yearParameterProps = {
  dynYear: number,
  startAndendYearOptions: any,
  handleChangeSelect: (data: any)=> void,
  showSelectYearArrow: boolean,
};

/**
 * @param {*} props all props
 * @returns {object} returns a select field(Month)
 */
export function SelectYearField({ dynYear, startAndendYearOptions, handleChangeSelect, showSelectYearArrow }: yearParameterProps) {
  /**
   *
   * @returns {Array} returns no. of year values
   */
  const yearOptions = () => {
    const yearoption = [];
    const { startYearOption, endYearOption } = startAndendYearOptions;
    for (let n = startYearOption; n <= endYearOption; n += 1) {
      yearoption.push(n);
    }
    return yearoption;
  };
  return (
    <select
      disabled={showSelectYearArrow}
      className={`${showSelectYearArrow && "cld_disableArrow"}`}
      id="selectYear"
      value={dynYear}
      onChange={(e) => handleChangeSelect(e)}
    >
      {yearOptions().map((data) => {
        return (
          <option key={data} value={data}>
            {data}
          </option>
        );
      })}
    </select>
  );
}

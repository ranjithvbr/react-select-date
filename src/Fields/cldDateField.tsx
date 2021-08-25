import * as React from "react";
import { useEffect, useState, useMemo } from 'react';
import { getDisableDateForField, formatDay } from "../cldDisable";
import "./cldDateField.scss";

const days: any = {sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6};
type parameterFieldProps = {
  disableState: string,
  selectType: string,
  selectedDateFromCld: any,
  selectedDate: (data: object) => void,
  disableCertainDate: any,
  showDatelabel: boolean,
  templateClr: string,
  propsMinDate: string,
  propsMaxDate: string,
  disableDay: any,
  daysInMonth: any,
}

/**
 * @param {*} props all props
 * @returns {React.ReactElement} returns a date-input field
 */
function CldDateField({
  disableState,
  selectType,
  selectedDateFromCld,
  selectedDate,
  disableCertainDate,
  showDatelabel,
  templateClr,
  propsMinDate,
  propsMaxDate,
  disableDay,
  daysInMonth,
}: parameterFieldProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [errMsgStart, setErrMsgStart] = useState<string | undefined>();
  const [errMsgEnd, setErrMsgEnd] = useState<string | undefined>();
  const [windowDimensions, setWindowDimensions] = useState<any>(window.innerWidth);
  const [selectedDateFromField, setSelectedDateFromField] = useState({
    startDateFromField: "",
    endDateFromField: "",
  });
  const [minAndmaxDate, setminAndmaxDate] = useState<any>({
    minDate: "1921-01-01",
    maxDate: "2100-12-31",
  });
  const templateOutline = useMemo(() => {
    return templateClr === "blue" ? "cld_blueOutline" : "cld_greenOutline";
  }, [templateClr]);

  function handleResize() {
    setWindowDimensions(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrMsgStart("");
      setErrMsgEnd("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [errMsgStart, errMsgEnd]);

  useEffect(() => {
    if (disableState === "past" || disableState === "future") {
      setminAndmaxDate(getDisableDateForField(disableState));
    }
  }, [disableState]);

  useEffect(() => {
    if(propsMinDate || propsMaxDate || disableState){
      setminAndmaxDate({
        minDate: disableState === "past" && propsMinDate && new Date(propsMinDate) < new Date() ? formatDay(new Date()) : formatDay(new Date(propsMinDate)),
        maxDate: disableState === "future" && propsMaxDate && new Date(propsMaxDate) > new Date() ? formatDay(new Date()) : formatDay(new Date(propsMaxDate)),
      });
      return;
    }

  }, [minAndmaxDate.maxDate, propsMinDate, propsMaxDate, disableState])

  useEffect(() => {
    if (selectType === "range") {
      const { startDate, endDate } = selectedDateFromCld;
      setStartDate(formatDay(startDate));
      setEndDate(formatDay(endDate));
      setSelectedDateFromField({
        startDateFromField: formatDay(startDate),
        endDateFromField: formatDay(endDate),
      });
    } else {
      const dateFromCld = selectedDateFromCld;
      if (dateFromCld) {
        setStartDate(formatDay(dateFromCld));
      }
    }
  }, [selectType, selectedDateFromCld]);

  /**
   * @param {object} e contain selected start date
   */
  const handleStartDate = (e: any) => {
    setStartDate(e.target.value);
  };

  /**
   * @param {object} e contain selected end date
   */
  const handleEndDate = (e: any) => {
    setEndDate(e.target.value);
  };

  /**
   * @param {string} date contain date
   * @returns {boolean} return boolean
   */
  const handleDisableDateField = (date: string) => {
    const disableField = disableCertainDate.find((dt: string) => formatDay(new Date(dt)) === formatDay(new Date(date)));
    return disableField;
  };

  /**
   * @param {string} date contain date
   * @returns {boolean} return boolean
   */
    const handleDisableDaycolumn = (date: string) => {
      const findDisableDay = daysInMonth?.find((dy: Date)=>new Date(date).getDay() === days[disableDay[dy.getDay()]?.toLowerCase()])
      return findDisableDay
    };

  /**
   * @param {*} e contain selected start date
   */
  const startSetError = (e: any) => {
    if (e.code === "Space") {
      e.preventDefault();
    }
    if ((e.code === "Enter" && startDate) || (e._reactName === "onBlur" && startDate)) {
      const { minDate, maxDate } = minAndmaxDate;
      if (new Date(startDate) > new Date(maxDate)) {
        setErrMsgStart(`Date must be ${formatDay(new Date(maxDate), true)} or earlier`);
      } else if (new Date(startDate) < new Date(minDate)) {
        setErrMsgStart(`Date must be ${formatDay(new Date(minDate), true)} or later`);
      } else if (new Date(startDate) >= new Date(endDate)) {
        setErrMsgStart("start Date should be lower than end Date");
        // setStartDate(selectedDateFromField.startDateFromField)
      } else if (handleDisableDateField(startDate) || handleDisableDaycolumn(startDate)) {
        setErrMsgStart("Date must not be disabled date");
      } else {
        setSelectedDateFromField((prevState) => ({
          ...prevState,
          startDateFromField: startDate,
        }));
        selectedDate({
          startDateFromField: startDate,
          endDateFromField: selectedDateFromField.endDateFromField,
          from: "startDateSelect",
        });
      }
    } else if (e.key === "Enter" && !startDate) {
      setErrMsgStart("Please enter a valid Date");
    }
  };

  /**
   *
   * @param {*} e contain selected end date
   */
  const endSetError = (e: any) => {
    if (e.code === "Space") {
      e.preventDefault();
    }
    if ((e.code === "Enter" && endDate) || (e._reactName === "onBlur" && endDate)) {
      const { minDate, maxDate } = minAndmaxDate;
      if (new Date(endDate) > new Date(maxDate)) {
        setErrMsgEnd(`Date must be ${formatDay(new Date(maxDate), true)} or earlier`);
      } else if (new Date(endDate) < new Date(minDate)) {
        setErrMsgEnd(`Date must be ${formatDay(new Date(minDate), true)} or later`);
      } else if (new Date(startDate) >= new Date(endDate)) {
        setErrMsgEnd("End Date should be greater than start Date");
        // setEndDate(selectedDateFromField.endDateFromField)
      } else if (!startDate) {
        setStartDate(endDate);
        setEndDate("");
        setSelectedDateFromField((prevState) => ({
          ...prevState,
          startDateFromField: endDate,
        }));
        selectedDate({
          startDateFromField: endDate,
          endDateFromField: selectedDateFromField.endDateFromField,
          from: "startDateSelect",
        });
      } else if (handleDisableDateField(endDate) || handleDisableDaycolumn(endDate)) {
        setErrMsgEnd("Date must not be disabled date");
      } else {
        setSelectedDateFromField({
          startDateFromField: selectedDateFromField.startDateFromField,
          endDateFromField: endDate,
        });

        selectedDate({
          startDateFromField: selectedDateFromField.startDateFromField,
          endDateFromField: endDate,
          from: "endDateSelect",
        });
      }
    } else if (e.key === "Enter" && !endDate) {
      setErrMsgEnd("Please enter a valid Date");
    }
  };

  return (
    <div>
      <div className={`${selectType === "range" ? "cld_fieldContainer" : "cld_startDateFieldOnly"}`}>
        <div>
          {showDatelabel && <label htmlFor="start_Cld_Field">Start Date</label>}
          <input
            type="date"
            id="start_Cld_Field"
            value={startDate}
            onChange={(e) => handleStartDate(e)}
            onKeyDown={(e) => startSetError(e)}
            onBlur={startSetError}
            min={minAndmaxDate.minDate}
            max={minAndmaxDate.maxDate}
            className={templateOutline}
            disabled={windowDimensions <= 612}
          />
        </div>
        {selectType === "range" && (
          <div>
            {showDatelabel && <label htmlFor="end_Cld_Field">End Date</label>}
            <input
              type="date"
              id="end_Cld_Field"
              value={endDate}
              onChange={(e) => handleEndDate(e)}
              onKeyDown={(e) => endSetError(e)}
              onBlur={endSetError}
              min={minAndmaxDate.minDate}
              max={minAndmaxDate.maxDate}
              className={templateOutline}
              disabled={windowDimensions <= 612}
            />
          </div>
        )}
      </div>
      <div className={`${selectType === "range" ? "cld_errmsgContainer" : "cld_startaerrmsg"}`}>
        <div className={`cld_errmsg ${errMsgStart && "hidecld_errmsg"}`}>{errMsgStart}</div>
        {selectType === "range" && <div className={`cld_errmsg ${errMsgEnd && "hidecld_errmsg"}`}>{errMsgEnd}</div>}
      </div>
    </div>
  );
}

export default CldDateField;

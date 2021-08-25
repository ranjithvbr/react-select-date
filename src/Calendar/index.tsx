import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from 'react';
import CldDateField from "../Fields/cldDateField";
import {
  getDisableDate,
  getDisableYear,
  getDisableCertainDate,
  getDisableWhenRange,
  formatDay,
  setCurrentTime,
  addZero,
  setMinDate,
  setMaxDate,
  getDisableDays,
} from "../cldDisable";
import { disableLeftArrow, disableRightArrow, getDisableDateForArrow } from "./disableArrow";
import { SelectMonthField, SelectYearField } from "../Fields/cldSelectField";
import {dateRange, getDaysInMonth} from "./dateRange";
import "./calendar.scss";
import Legends from "../Legends/legends";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * @param {*} props all the props needed for customize the calendar
 * @returns {React.ReactElement} returns a calendar with single, multiple and range with slots options
 */
function Calendar({
  selectDateType,
  disableDates,
  disableCertainDates,
  duelSlotDates,
  singleSlotDates,
  onSelect,
  slotInfo = true,
  showDateInputField = true,
  showArrow = true,
  showSelectMonthArrow,
  showSelectYearArrow,
  showDatelabel,
  templateClr,
  minDate,
  maxDate,
  defaultValue = {},
  disableDays,
}: any) {

  const disableState = useMemo(() => {
    return disableDates || "";
  }, [disableDates]);

  const selectType = useMemo(() => {
    return selectDateType || "single";
  }, [selectDateType]);

  const disableCertainDate = useMemo(() => {
    return disableCertainDates || [];
  }, [disableCertainDates]);

  const singleSlots = useMemo(() => {
    return singleSlotDates || [];
  }, [singleSlotDates]);

  const duelSlots = useMemo(() => {
    return duelSlotDates || [];
  }, [duelSlotDates]);

  const disableDay = useMemo(() => {
    return disableDays?.map((l: string)=>l.toLowerCase()) || []
  }, [disableDays])

  const [getDate, setGetDate] = useState<any>();
  const [getStartDay, setGetStartDay] = useState<any>();
  const [calenderDates, setCalenderDates] = useState<Array<object>>([]);
  const [dynMonth, setDynMonth] = useState<any>();
  const [dynYear, setDynYear] = useState<any>();
  const [baseId, setBaseId] = useState<Array<string>>([]);
  const [rangeId, setRangeId] = useState<Array<string>>([]);
  const [inRange, setInRange] = useState<any>();
  const [slotsDate, setSlotsDate] = useState<Array<string>>([]);
  const [disableArrow, setDisableArrow] = useState<boolean | null>();
  const [daysInMonth, setDaysInMonth] = useState<Date[]>();
  const [startDate, setStartDate] = useState<any>("");
  const [multipleDate, setMultipleDate] = useState<any>([]);
  const [startAndendDate, setStartAndendDate] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [startAndendYearOptions, setstartAndendYearOptions] = useState<any>({
    startYearOption: 1921,
    endYearOption: 2100,
  });

  const handleDisableArrow = useCallback(() => {
    setDisableArrow(getDisableDateForArrow(disableState, dynMonth, dynYear));
    if(disableDay?.length > 0){
      setDaysInMonth(getDaysInMonth(dynMonth - 1, dynYear));
    }
  }, [disableDay, disableState, dynMonth, dynYear]);

  useEffect(() => {
    handleDisableArrow();
  }, [handleDisableArrow]);

  useEffect(() => {
    let currentdate
    if (minDate && new Date(minDate) > new Date()) {
      currentdate = new Date(minDate);
    }else if (minDate && maxDate && new Date(minDate) < new Date() && new Date(maxDate) < new Date()) {
      currentdate = new Date(minDate);
    }else if (maxDate && new Date(maxDate) < new Date()) {
      currentdate = new Date(new Date(maxDate));
    }else{
      currentdate = new Date();
    }
    const findDaysInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, 0).getDate();
    const findStartDayInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1).getDay();
    setGetDate(findDaysInMonth);
    setGetStartDay(findStartDayInMonth)
    setDynMonth(currentdate.getMonth() + 1)
    setDynYear(currentdate.getFullYear())
  }, [minDate, maxDate]);

  useEffect(() => {
    if (disableState === "past" || disableState === "future" || minDate || maxDate) {
      setstartAndendYearOptions(getDisableYear(disableState, minDate, maxDate));
    }
  }, [disableState, minDate, maxDate]);

  useEffect(() => {
    const slotDateArr: Array<string> = [];
    const slotState = (singleSlots.length > 0 && singleSlots) || (duelSlots.length > 0 && duelSlots) || [];
    slotState.forEach((slDt: any) => {
      slotDateArr.push(formatDay(new Date(slDt.date)));
    });
    setSlotsDate(slotDateArr);
  }, [duelSlots, singleSlots]);

  const defaultDependency = JSON.stringify(defaultValue)
  useEffect(()=>{
    if(selectDateType === "range" && (defaultValue && defaultValue.startDate && defaultValue.endDate)){
      const defaultRange = dateRange(new Date(defaultValue.startDate), new Date(defaultValue.endDate));
      const defaultAllRangeDate = defaultRange.map((date: Date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`);
      setRangeId(defaultAllRangeDate);
      setStartAndendDate({
        startDate: setCurrentTime(new Date(defaultValue.startDate)),
        endDate: setCurrentTime(new Date(defaultValue.endDate))
      });
      return
    }

   if(selectDateType === "multiple" && defaultValue && defaultValue.length > 0){
    let setDefaultDate: Array<string> = []
    let getInitailActualDate: Array<Date> = []
    defaultValue?.forEach((initialDate: any)=>{
      let initialNewDate  = new Date(initialDate)
       setDefaultDate.push(`${addZero(initialNewDate.getDate())}${addZero(initialNewDate.getMonth() + 1)}${initialNewDate.getFullYear()}`);
      getInitailActualDate.push(initialNewDate)
    })
      const multipleDefaultDate = setDefaultDate
      setMultipleDate(getInitailActualDate)
      setBaseId(multipleDefaultDate)
      return
    }

    if(defaultValue && defaultValue.date){
      let singleDefaultDate =  new Date(defaultValue.date)
      let singleDefaultId = `${addZero(singleDefaultDate.getDate())}${addZero(singleDefaultDate.getMonth() + 1)}${singleDefaultDate.getFullYear()}`
      setStartDate(singleDefaultDate)
      setBaseId([singleDefaultId])
      return
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectDateType, defaultDependency])

  const rangeCalculater = useCallback(
    (id) => {
      const idDate = new Date(id);
      if (rangeId.length === 0) {
        const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
        setRangeId([convertID]);
        setStartAndendDate((prevState: any) => ({
          ...prevState,
          startDate: setCurrentTime(idDate),
        }));
        setInRange(null);
      } else if (rangeId.length === 1 && formatDay(idDate) !== formatDay(startAndendDate.startDate)) {
        let getStartDate;
        let getEndDate;
        const findGreater = new Date(startAndendDate.startDate) < idDate;
        if (findGreater) {
          getStartDate = startAndendDate.startDate;
          getEndDate = idDate;
        } else {
          getStartDate = idDate;
          getEndDate = startAndendDate.startDate;
        }
        const range = dateRange(new Date(getStartDate), new Date(getEndDate));
        const allRangeDate = range.map((date: Date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`);

        setRangeId(allRangeDate);
        setInRange(null);
        if (findGreater) {
          setStartAndendDate({
            startDate: startAndendDate.startDate,
            endDate: setCurrentTime(idDate),
          });
        } else {
          setStartAndendDate({
            startDate: setCurrentTime(idDate),
            endDate: startAndendDate.startDate,
          });
        }
      } else {
        const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
        setRangeId([convertID]);
        setStartAndendDate({
          startDate: setCurrentTime(idDate),
        });
      }
    },
    [rangeId, startAndendDate],
  );

  useEffect(() => {
    if(onSelect instanceof Function)
    if (selectType === "multiple") {
      onSelect(multipleDate);
    } else if (selectType === "range") {
      onSelect(startAndendDate);
    } else {
      startDate && onSelect(startDate);
    }
  }, [startDate, multipleDate, startAndendDate, onSelect, selectType]);

  const highLight = useCallback(
    (id, actualDateId) => {
      switch (selectType) {
        case "single":
          setBaseId([id]);
          setStartDate(setCurrentTime(actualDateId));
          break;
        case "multiple":
          if (!baseId.includes(id)) {
            setBaseId((oldArray) => [...oldArray, id]);
            setMultipleDate((oldArray: string) => [...oldArray , setCurrentTime(actualDateId)]);
          } else {
            const findedId = baseId.findIndex((li) => li === id);
            const removedSelect = baseId.filter((_i, index) => findedId !== index);
            const removedActualDateId = multipleDate.filter((_i: any, index: number) => findedId !== index);
            setBaseId(removedSelect);
            setMultipleDate(removedActualDateId);
          }
          break;
        case "range":
          rangeCalculater(id);
          break;
        default:
      }
    },
    [baseId, multipleDate, rangeCalculater, selectType],
  );
  /**
   * @param {object} event mouseHover data-info
   */
  const handleMouseEnter = (event: any) => {
    setInRange(event.target.dataset.info);
  };

  const handleRenderDate = useCallback(() => {
    const noOfDate = [];
    let templateHighLightbg;
    let templateRangeHighLightbg;
    let templateBorder;
    let templateCurrentDay;
    if (templateClr === "blue") {
      templateHighLightbg = "cld_blueHighlight";
      templateRangeHighLightbg = "cld_inrangeBlue cld_inrangeIndexBlue";
      templateBorder = "cld_cellBlueActive";
      templateCurrentDay = "cld_currentDayBlue";
    } else {
      templateHighLightbg = "cld_greenHighlight";
      templateRangeHighLightbg = "cld_inrangeGreen cld_inrangeIndexGreen";
      templateBorder = "cld_cellGreenActive";
      templateCurrentDay = "cld_currentDayGreen";
    }

    for (let i = 1; i <= getDate + getStartDay; i += 1) {
      if (i <= getStartDay) {
        noOfDate.push(<td />);
      } else {
        const dateId = `${addZero(i - getStartDay)}${addZero(dynMonth)}${dynYear}`;
        const dateTypeId = `${dynYear}-${addZero(dynMonth)}-${addZero(i - getStartDay)}`;

        // range classname for start,between and end
        let rangeHightLight;
        if (rangeId[0] === dateId) {
          rangeHightLight = `${templateHighLightbg} cld_highlightFirstNum`;
        } else if (rangeId[rangeId.length - 1] === dateId) {
          rangeHightLight = `${templateHighLightbg} cld_highlightLastNum`;
        } else if (rangeId.includes(dateId)) {
          rangeHightLight = `${templateHighLightbg} cld_highlightNum`;
        }
        // firstOrder change className
        const rangeStartDate = startAndendDate.startDate && startAndendDate.startDate;
        const rangeEndDate = startAndendDate.endDate && startAndendDate.endDate;
        if (rangeId.length === 1 && inRange && rangeStartDate.getDate() > Number(inRange)) {
          rangeHightLight = rangeId[0] === dateId && `${templateHighLightbg} cld_highlightLastNum`;
        }
        // classname for range, single and multiple
        let highLightNum;
        if (selectType === "range") {
          highLightNum = rangeHightLight;
        } else if (baseId.includes(dateId)) {
          highLightNum = `${templateHighLightbg} cld_highlightNumCircle`;
        }
        // startDate and endDate between ranges
        let inRangeCondition;
        if (rangeId.length === 1 && inRange) {
          if (dynYear === rangeStartDate.getFullYear() && dynMonth === rangeStartDate.getMonth() + 1) {
            inRangeCondition =
              (Number(inRange) >= i - getStartDay &&
                rangeStartDate.getDate() < i - getStartDay &&
                `${templateRangeHighLightbg} cld_inrangeLastIndex`) ||
              (Number(inRange) <= i - getStartDay &&
                rangeStartDate.getDate() > i - getStartDay &&
                `${templateRangeHighLightbg} cld_inrangeFirstIndex`);
          } else if (rangeStartDate < new Date(`${dynYear}-${dynMonth}-${Number(inRange)}`)) {
            inRangeCondition = Number(inRange) >= i - getStartDay && `${templateRangeHighLightbg} cld_inrangeLastIndex`;
          } else {
            inRangeCondition =
              Number(inRange) <= i - getStartDay && `${templateRangeHighLightbg} cld_inrangeFirstIndex`;
          }
        }
        const disableDate =
          (disableState &&
            !(minDate && disableDates === "past") &&
            !(maxDate && disableDates === "future") &&
            getDisableDate(new Date(dateTypeId), disableState)) ||
          (minDate &&
            setMinDate(
              minDate && disableDates === "past" && new Date(minDate) < new Date() ? new Date() : new Date(minDate),
              new Date(dateTypeId),
            )) ||
          (maxDate &&
            setMaxDate(
              maxDate && disableDates === "future" && new Date(maxDate) > new Date() ? new Date() : new Date(maxDate),
              new Date(dateTypeId),
            ));

        const showDisableWhenRange =
          rangeId.length > 1 && (disableCertainDate.length > 0 || disableDay.length > 0) && 
          getDisableWhenRange(disableCertainDate,disableDay, new Date(dateTypeId), rangeStartDate, rangeEndDate, daysInMonth, startAndendDate);

        const disableSpecificDate =
          disableCertainDate.length > 0 && getDisableCertainDate(new Date(dateTypeId), disableCertainDate);

        // disableDay
        const disableDayState = disableDay?.length > 0 && getDisableDays(disableDay, dateTypeId)

        // dualSlots || singleSlots
        const slotsState = duelSlots.length > 0 || singleSlots.length > 0;

        let slotClass;
        if (slotsState) {
          if (selectType === "range") {
            if (singleSlots.length > 0) {
              slotClass = "cld_cellAvailableMg";
            } else {
              slotClass = "cld_cellHoverMg";
            }
          } else {
            slotClass = singleSlots.length > 0 ? "cld_cellHoverMgbtSingle" : "cld_cellHoverMgbt";
          }
        } 

        let disableDateRangeClass;
        if (disableDate) {
          disableDateRangeClass = disableDate;
        } else if (disableSpecificDate) {
          disableDateRangeClass = disableSpecificDate;
        } 
        else if(disableDayState){
          disableDateRangeClass = disableDayState;
        }
        else {
          disableDateRangeClass = `${highLightNum} ${selectType !== "range" && !slotsState && "cld_cellSingleMultiple"
            } ${rangeId.length !== 1 && `${templateBorder} cld_cellActive`} ${inRangeCondition}`;
        }
        // slot
        const slotIndex: any =
          slotsState && duelSlots.length > 0
            ? duelSlots[slotsDate.indexOf(formatDay(new Date(dateTypeId)))]
            : singleSlots[slotsDate.indexOf(formatDay(new Date(dateTypeId)))];

        // currentDay
        const currentDayClass =
          formatDay(new Date(dateTypeId)) === formatDay(new Date()) && `${templateCurrentDay} cld_currentDay`;
        // merge all classname
        const tdClass = `${slotClass} ${showDisableWhenRange} ${currentDayClass} ${disableDateRangeClass} cld_cellHover`;
        // remove false and undefined in classname
        const tdStyles = tdClass.trim().split("false ").join("").split("undefined ").join("");

        noOfDate.push(
          <td
            onMouseEnter={(!disableDate || !disableSpecificDate || !disableDayState) && rangeId.length === 1 ? handleMouseEnter : undefined}
            data-info={i - getStartDay}
            onClick={
              disableDate || disableSpecificDate || disableDayState
                ? undefined
                : () => highLight(selectType === "range" ? dateTypeId : dateId, dateTypeId)
            }
            aria-hidden="true"
          >
            <div>
              {slotsState && (
                <span data-info={i - getStartDay} className="cld_slots cld_availableSlots">
                  {slotIndex ? slotIndex.avaliableSlot : 0}
                </span>
              )}
              <div data-info={i - getStartDay} className={tdStyles}>
                {i - getStartDay}
              </div>
              {duelSlots.length > 0 && (
                <span data-info={i - getStartDay} className="cld_slots cld_totalSlots">
                  {slotIndex ? slotIndex.totalSlot : 0}
                </span>
              )}
            </div>
          </td>,
        );
      }
    }

    const trDate = [];
    for (let j = 0; j < noOfDate.length; j += 1) {
      let count = 0 + j;
      if (j % 7 === 0) {
        trDate.push(
          <tr key={count}>
            {noOfDate[count + 0] || <td key={count + 0} />}
            {noOfDate[count + 1] || <td key={count + 1} />}
            {noOfDate[count + 2] || <td key={count + 2} />}
            {noOfDate[count + 3] || <td key={count + 3} />}
            {noOfDate[count + 4] || <td key={count + 4} />}
            {noOfDate[count + 5] || <td key={count + 5} />}
            {noOfDate[count + 6] || <td key={count + 6} />}
          </tr>,
        );
        count += 1;
      }
    }
    setCalenderDates(trDate);
  }, [
     templateClr,
     getDate,
     getStartDay,
     dynMonth,
     dynYear,
     rangeId,
     startAndendDate,
     inRange,
     selectType,
     baseId,
     disableState,
     minDate,
     disableDates,
     maxDate,
     disableCertainDate,
     disableDay,
     daysInMonth,
     duelSlots,
     singleSlots,
     slotsDate,
     highLight
    ]);

  useEffect(() => {
    handleRenderDate();
  }, [handleRenderDate, dynMonth, dynYear, baseId, rangeId, inRange]);

  /**
   * Action type for decrease the month and year
   */
  const handleLeft = () => {
    handleDisableArrow();
    setGetDate(new Date(dynYear, dynMonth - 1, 0).getDate());
    setGetStartDay(new Date(dynYear, dynMonth - 2, 1).getDay());
    if (dynMonth === 1) {
      setDynYear(dynYear - 1);
      setDynMonth(12);
    } else {
      setDynMonth(dynMonth - 1);
    }
  };

  /**
   * Action type for increase the month and year
   */
  const handleRight = () => {
    handleDisableArrow();
    setGetDate(new Date(dynYear, dynMonth + 1, 0).getDate());
    setGetStartDay(new Date(dynYear, dynMonth, 1).getDay());
    if (dynMonth === 12) {
      setDynYear(dynYear + 1);
      setDynMonth(1);
    } else {
      setDynMonth(dynMonth + 1);
    }
  };

  /**
   * Action type for select the specific month
   *
   * @param {object} e contain selected option value
   */
  const handleSelectMonth = (e: any) => {
    setDynMonth(Number(e.target.value) + 1);
    setGetDate(new Date(dynYear, Number(e.target.value) + 1, 0).getDate());
    setGetStartDay(new Date(dynYear, Number(e.target.value), 1).getDay());
  };

  /**
   * Action type for select the specific year
   *
   * @param {object} e contain selected option value
   */
  const handleSelectYear = (e: any) => {
    setDynYear(Number(e.target.value));
    setGetDate(new Date(e.target.value, dynMonth, 0).getDate());
    setGetStartDay(new Date(e.target.value, dynMonth - 1, 1).getDay());
  };

  /**
   * Action type for select the specific year
   *
   * @param {object} id contain selected date
   */
  const rangeCalculaterFromField = (id: any) => {
    if (id.startDateFromField && id.endDateFromField) {
      const getStartDate = id.startDateFromField;
      const getEndDate = id.endDateFromField;

      const range = dateRange(new Date(getStartDate), new Date(getEndDate));
      const allRangeDate = range.map((date: Date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`);

      setRangeId(allRangeDate);
      setStartAndendDate({
        startDate: setCurrentTime(id.startDateFromField),
        endDate: setCurrentTime(id.endDateFromField),
      });
    } else {
      const idDate = new Date(id.startDateFromField || id.endDateFromField);
      const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
      setRangeId([convertID]);
      setStartAndendDate((prevState: any) => ({
        ...prevState,
        startDate: setCurrentTime(id.startDateFromField) || setCurrentTime(id.endDateFromField),
      }));
    }

    if (id.from) {
      const refreshDate =
        id.from === "startDateSelect" ? new Date(id.startDateFromField) : new Date(id.endDateFromField);
      setDynMonth(refreshDate.getMonth() + 1);
      setGetDate(new Date(refreshDate.getFullYear(), refreshDate.getMonth() + 1, 0).getDate());
      setGetStartDay(new Date(refreshDate.getFullYear(), refreshDate.getMonth(), 1).getDay());
      setDynYear(refreshDate.getFullYear());
    }
  };

  /**
   * Return the selected date range from date-input field
   *
   * @param {object} da contain selected option value
   */
  const setFieldValue = (da: any) => {
    if (selectType !== "range") {
      const selDt = new Date(da.startDateFromField);
      const fieldFindDaysInMonth = new Date(selDt.getFullYear(), selDt.getMonth() + 1, 0).getDate();
      const fieldFindStartDayInMonth = new Date(selDt.getFullYear(), selDt.getMonth(), 1).getDay();
      const dateIdFromFiled = `${addZero(selDt.getDate())}${addZero(selDt.getMonth() + 1)}${selDt.getFullYear()}`;
      const actualDateFromFiled = `${selDt.getFullYear()}-${selDt.getMonth() + 1}-${selDt.getDate()}`;

      setDynYear(selDt.getFullYear());
      setDynMonth(selDt.getMonth() + 1);
      setGetDate(fieldFindDaysInMonth);
      setGetStartDay(fieldFindStartDayInMonth);

      switch (selectType) {
        case "single":
          setBaseId([dateIdFromFiled]);
          setStartDate(setCurrentTime(actualDateFromFiled));
          break;
        case "multiple":
          if (!baseId.includes(dateIdFromFiled)) {
            setBaseId((oldArray) => [...oldArray, dateIdFromFiled]);
            setMultipleDate((oldArray: string) => [...oldArray, setCurrentTime(actualDateFromFiled)]);
          }
          break;
        default:
      }
    } else {
      rangeCalculaterFromField(da);
    }
  };

  /**
   *@returns {string} seletedDate from calendar single || multiple || range
   */
  const selectedDateFromCldFunc = () => {
    let selDate;
    if (selectType === "single") {
      selDate = startDate;
    } else if (selectType === "multiple") {
      selDate = multipleDate ? multipleDate[multipleDate.length - 1] : "";
    } else {
      selDate = startAndendDate;
    }
    return selDate;
  };

  return (
    <>
    {calenderDates?.length > 0 &&
    <div
      className={`${
        duelSlots.length > 0 ? "cld_slotWidth" : singleSlots.length > 0 ? "cld_avlSlotWidth" : "cld_noslotWidth"
      } cld_container`}
    >
      <div>
        {showDateInputField && (
          <CldDateField
            selectedDate={(da: object) => setFieldValue(da)}
            selectType={selectType}
            selectedDateFromCld={selectedDateFromCldFunc()}
            disableState={disableState}
            propsMinDate={minDate}
            propsMaxDate={maxDate}
            disableCertainDate={disableCertainDate}
            disableDay={disableDay}
            daysInMonth={daysInMonth}
            showDatelabel={showDatelabel}
            templateClr={templateClr}
          />
        )}
        <div className={`${showArrow ? "cld_btnAlign" : "cld_monthYearAlign"}`}>
          {showArrow && (
            <button
              disabled={disableLeftArrow(disableState, disableArrow, dynYear, dynMonth, minDate)}
              onClick={() => handleLeft()}
              type="button"
            >
              ◀
            </button>
          )}
          <div className="cld_showDays">
            <SelectMonthField
              disableState={disableState}
              dynMonth={dynMonth}
              dynYear={dynYear}
              handleChangeSelect={(e: any) => handleSelectMonth(e)}
              showSelectMonthArrow={showSelectMonthArrow}
              minDate={minDate}
              maxDate={maxDate}
            />
            <SelectYearField
              startAndendYearOptions={startAndendYearOptions}
              dynYear={dynYear}
              handleChangeSelect={(e: any) => handleSelectYear(e)}
              showSelectYearArrow={showSelectYearArrow}
            />
          </div>
          {showArrow && (
            <button
              // disabled={(disableState === "future" && disableArrow) || (dynYear === 2100 && dynMonth === 12)}
              disabled={disableRightArrow(disableState, disableArrow, dynYear, dynMonth, maxDate)}
              onClick={() => handleRight()}
              type="button"
            >
              ▶
            </button>
          )}
        </div>
      </div>
      <table onMouseLeave={rangeId.length === 1 ? () => setInRange(null) : undefined}>
        <thead>
          <tr>
            {days.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{calenderDates}</tbody>
      </table>
      {slotInfo && (
        <Legends
          templateClr={templateClr}
          singleSlotState={singleSlots.length > 0}
          duelSlotState={duelSlots.length > 0}
        />
      )}
    </div>}
    </>
  );
}

export default Calendar;

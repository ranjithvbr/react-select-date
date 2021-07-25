import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from 'react';
import CldDateField from "../Fields/cldDateField";
import {
  getDisableDate,
  getDisableDateForArrow,
  getDisableYear,
  getDisableCertainDate,
  getDisableWhenRange,
  formatDay,
  setCurrentTime,
  addZero,
} from "../cldDisable";
import { SelectMonthField, SelectYearField } from "../Fields/cldSelectField";
import dateRange from "./dateRange";
import "./calendar.scss";
import Legends from "../Legends/legends";

type paramaterProps = {
  selectDateType: string,
  disableDates: string,
  disableCertainDates: Array<object>,
  duelSlotDates: Array<object>,
  singleSlotDates: Array<object>,
  onSelect: any,
  slotInfo: boolean,
  showDateInputField: boolean,
  showArrow: boolean,
  showSelectMonthArrow: boolean,
  showSelectYearArrow: boolean,
  showDatelabel: boolean,
  templateClr: string,
};

const currentdate = new Date();
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
}: paramaterProps | any) {
  const findDaysInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, 0).getDate();
  const findStartDayInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1).getDay();
  const disableState = disableDates || "";

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

  const [getDate, setGetDate] = useState(findDaysInMonth);
  const [getStartDay, setGetStartDay] = useState(findStartDayInMonth);
  const [calenderDates, setCalenderDates] = useState<Array<object>>();
  const [dynMonth, setDynMonth] = useState(currentdate.getMonth() + 1);
  const [dynYear, setDynYear] = useState(currentdate.getFullYear());
  const [baseId, setBaseId] = useState<Array<string>>([]);
  const [rangeId, setRangeId] = useState<Array<string>>([]);
  const [inRange, setInRange] = useState<any>();
  const [slotsDate, setSlotsDate] = useState<Array<string>>([]);
  const [disableArrow, setDisableArrow] = useState<boolean | null>();
  const [startDate, setStartDate] = useState<any>("");
  const [multipleDate, setMultipleDate] = useState<any>();
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
  }, [disableState, dynMonth, dynYear]);

  useEffect(() => {
    handleDisableArrow();
  }, [handleDisableArrow]);

  useEffect(() => {
    if (disableState === "past" || disableState === "future") {
      setstartAndendYearOptions(getDisableYear(disableState));
    }
  }, [disableState]);

  useEffect(() => {
    const slotDateArr: Array<string> = [];
    const slotState = (singleSlots.length > 0 && singleSlots) || (duelSlots.length > 0 && duelSlots) || [];
    slotState.forEach((slDt: any) => {
      slotDateArr.push(formatDay(new Date(slDt.date)));
    });
    setSlotsDate(slotDateArr);
  }, [duelSlots, singleSlots]);

  const rangeCalculater = useCallback(
    (id) => {
      const idDate = new Date(id);
      if (rangeId.length === 0) {
        const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
        setRangeId([convertID]);
        setStartAndendDate((prevState: string) => ({
          ...(prevState as any),
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
    if (selectType === "multiple") {
      onSelect && onSelect(multipleDate);
    } else if (selectType === "range") {
      onSelect && onSelect(startAndendDate);
    } else {
      onSelect && onSelect(startDate);
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
            setMultipleDate((oldArray: string) => [...(oldArray as any), setCurrentTime(actualDateId)]);
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
        if (rangeId.length === 1 && rangeStartDate.getDate() > Number(inRange)) {
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
        if (rangeId.length === 1) {
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
        // disableDate
        const disableDate = disableState && getDisableDate(new Date(dateTypeId), disableState);

        const showDisableWhenRange =
          rangeId.length > 1 &&
          getDisableWhenRange(disableCertainDate, new Date(dateTypeId), rangeStartDate, rangeEndDate);

        const disableSpecificDate =
          disableCertainDate.length > 0 && getDisableCertainDate(new Date(dateTypeId), disableCertainDate);
        // dualSlots || singleSlots
        const slotsState = duelSlots.length > 0 || singleSlots.length > 0;
        const slotClass = slotsState && (selectType === "range" ? (singleSlots.length > 0 ? "cld_cellAvailableMg" : "cld_cellHoverMg") : "cld_cellHoverMgbt");

        let disableDateRangeClass;
        if (disableDate) {
          disableDateRangeClass = disableDate;
        } else if (disableSpecificDate) {
          disableDateRangeClass = disableSpecificDate;
        } else {
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
          formatDay(new Date(dateTypeId)) === formatDay(currentdate) && `${templateCurrentDay} cld_currentDay`;
        // merge all classname
        const tdClass = `${slotClass} ${showDisableWhenRange} ${currentDayClass} ${disableDateRangeClass} cld_cellHover`;
        // remove false and undefined in classname
        const tdStyles = tdClass.trim().split("false ").join("").split("undefined ").join("");

        noOfDate.push(
          <td
            onMouseEnter={(!disableDate || !disableSpecificDate) && rangeId.length === 1 ? handleMouseEnter : undefined}
            data-info={i - getStartDay}
            onClick={
              disableDate || disableSpecificDate
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
    disableCertainDate,
    duelSlots,
    singleSlots,
    slotsDate,
    highLight,
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
      setStartAndendDate((prevState: string) => ({
        ...(prevState as any),
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
            setMultipleDate((oldArray: string) => [...(oldArray as any), setCurrentTime(actualDateFromFiled)]);
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

  // console.log(rangeId, startDate, multipleDate, startAndendDate, dynYear, dynMonth, "actualDate");
  return (
    <div
      className={`${duelSlots.length > 0 ? "cld_slotWidth" : singleSlots.length > 0 ? "cld_avlSlotWidth" : "cld_noslotWidth"
        } cld_container`}
    >
      <div>
        {showDateInputField && (
          <CldDateField
            selectedDate={(da: object) => setFieldValue(da)}
            selectType={selectType}
            selectedDateFromCld={selectedDateFromCldFunc()}
            disableState={disableState}
            disableCertainDate={disableCertainDate}
            showDatelabel={showDatelabel}
            templateClr={templateClr}
          />
        )}
        <div className={`${showArrow ? "cld_btnAlign" : "cld_monthYearAlign"}`}>
          {showArrow && (
            <button
              disabled={(disableState === "past" && disableArrow) || (dynYear === 1921 && dynMonth === 1)}
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
              disabled={(disableState === "future" && disableArrow) || (dynYear === 2100 && dynMonth === 12)}
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
    </div>
  );
}

export default Calendar;

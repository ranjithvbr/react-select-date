# react-select-date
A React Calendar that consists of between single-date, multiple-date, range and slots booking features.Purely date calculated from JavaScript Date Object.

Live Demo: ---Work in progress---

#### Range and Multiple select
![](https://user-images.githubusercontent.com/37235948/125201244-d6fa6e00-e28b-11eb-9761-4f0760ad357b.png)

#### Single and Duel slots
![](https://user-images.githubusercontent.com/37235948/125206652-0027f800-e2a6-11eb-9fb5-2a7b219e9a5a.png)

# Getting Started

### Installation

Run `npm i react-select-date`

## Usage

### `SingelDate`
```javascript
import Calendar from "react-select-date";

function MyComponent() {
  return (
      <Calendar 
        onSelect={(date) => console.log(date)}
      />
  );
}

export default MyComponent;

```

### `DateRange`
```javascript
import Calendar from "react-select-date";

function MyComponent() {
  return (
      <Calendar 
        onSelect={(date) => console.log(date)}
        selectDateType="range"
        // select-date color
        templateClr="blue"
      />
  );
}

export default MyComponent;

```

### `Multiple With DuelSlots`
```javascript
import Calendar from "react-select-date";

function MyComponent() {
  const duelSlotDates = [
      { date: "2021-07-02", totalSlot: "30", avaliableSlot: "4" },
      { date: "2021-07-10", totalSlot: "30", avaliableSlot: "5" },
      { date: new Date(), totalSlot: "280", avaliableSlot: "160" },
      { date: "2021-07-07", totalSlot: "30", avaliableSlot: "14" },
    ]
  return (
      <Calendar
        onSelect={(date) => console.log(date)}
        selectDateType="multiple"
        duelSlotDates={duelSlotDates}
      />
  );
}

export default MyComponent;

```
### Options

Property                             | type       | Default Value    | Description
-------------------------------------|------------|------------------|-----------------------------------------------------------------
selectDateType                       | String    | single           | defines the selection type of single,multiple or range
onSelect                             | Func      |                  | callback function for returns the selected date
singleSlotDates                      | *Object[] | []               | defines the avilable slots
duelSlotDates                        | *Object[] | []               | defines the avilable and total slots
templateClr                          | String    | green            | defines the selecte date color(green or blue)
disableCertainDates                  | *Object[] | []               | disables the specific dates
disableDates                         | String    |                  | disables the past or future dates
disableDays                          | *Object[] | []               | disables the day
minDate                              | String/Date Object     |                  | defines minimum date. Disabled earlier dates 
maxDate                              | String/Date Object     |                  | defines maximam date. Disabled later dates 
slotInfo                             | Boolean   | true             | show/hide visibility of slotInfo
showDatelabel                        | Boolean   | false            | show/hide visibility of label for date input
showDateInputField                   | Boolean   | true             | show/hide visibility of date input
showSelectMonthArrow                 | Boolean   | false            | whether month select field can be editable and visibility of arrow
showSelectYearArrow                  | Boolean   | false            | whether year select field can be editable and visibility of arrow 
showArrow                            | Boolean   | true             | show/hide visibility of left arrow and right arrow

### Default value
Property                             | type       | Example          | Description
-------------------------------------|------------|------------------|-----------------------------------------------------------------
defaultValue(Single)                 | Object     | { date: "2021-9-9" } | defines the default value for single select
defaultValue(Multiple)               | Array      | [ "2021-8-15", "2021-08-01", new Date() ] | defines the default value for multiple select
defaultValue(Range)                  | Object     | { startDate: "2021-8-15", endDate: "2021-8-20" } | defines the default value for range select

### About Calendar
This Calendar was developed using Hooks and Javascript date object without any dependencies. The calendar has options where users can choose between single-date, multiple-date, range and slots booking features.


#### Single-Date Select
The single-date selection is a fully controlled component that allows users to select a single date from the calendar table. The user can select the date from `date-input` after entering the valid date. On click of the Enter button inside the respective field or when focus is moved, it will trigger the selectDate Func. The `date-input` field will throw an error message if the date is not valid.The `slotInfo` props shows the colors of selected-Date and disabled-Date.

#### Multiple-Date Select
The multiple Date selection is a fully controlled component that allows users to select multiple dates. The functionality is same as single-date to select the dates.

#### DateRange
The dateRange is a fully controlled component that allows users to select a date range. The user can select the date range from either the `date-input` field or the calendar table. Selected dates can be controlled using `onSelect` props. The DateRange also manages internal state for partial dates that are manually entered(Although onSelect will not trigger until a date has been filled completely. In that case, `date-input` field will throw an error message if the date is not valid).

#### Slots
Slots booking is a fully controlled component that allows users to view the avilable and total slots. In slots booking, the user can change the type of selection through `selectDateType` props. The user can display only avilable slots by sending singleSlotDates value, In order to view avilable slots and total slots the user needs to send duelSlotDates value(It should be noted that user cannot send both the `singleSlotDates` and `duelSlotDates` at the same time).

```javascript
// example slots values
singleSlotDates = {[ { date: "2021-07-03", avaliableSlot: "7" } ]}
duelSlotDates = {[ { date: "2021-07-02", totalSlot: "30", avaliableSlot: "4" } ]}
```
### Overriding styles
Feel free to override the styles, can customize the calendar styles as you expect.
```css
// Few Example:

// to change the disable number style
.cld_container .cld_disableDate{
  color: red;
}

// to change the selected date style
// if using templateClr = blue replace the "cld_greenHighlight" classname to "cld_blueHighlight"
.cld_container .cld_greenHighlight{
   background-color: #ff8100; 
}

// to change the selected disable date style
.cld_container .cld_disablebgColor{
   color: #ffffff;
   background: #ff9595;
}

// to change the calender background style
#root .cld_container{
  background-color: #fafad2;
}
```

### Author
- Ranjith - ranjithvbr@gmail.com

### License
  MIT

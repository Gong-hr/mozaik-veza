import React, {Component}  from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import {store} from "../index"
import {updateFilterDateFrom, updateFilterDateTo} from "../actions"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { formatDate, parseDate } from 'react-day-picker/moment'
import * as Lang from "../lang"

const WEEKDAYS_SHORT = {
    hr: Lang.DAYS,
};
const MONTHS = {
    hr: Lang.MONTHS,
};

const WEEKDAYS_LONG = {
    hr: Lang.DAYS,
};

const FIRST_DAY_OF_WEEK = {
    hr: 1,
};
// Translate aria-labels
const LABELS = {
    hr: { nextMonth: Lang.NEXT, previousMonth: Lang.PREVIOUS }
};

const currentYear = new Date().getFullYear();
//const fromMonth = new Date(currentYear, 0, 1, 0, 0);
//const toMonth = new Date(1900, 11, 31, 23, 59);
const toMonth = new Date(currentYear +1, 11, 31, 23, 59);
const fromMonth = new Date(1900, 0, 1, 23, 59);

function YearMonthForm(props) {
    const { date, onChange, onClose } = props;
    const months = MONTHS["hr"];
    const years = [];

    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = (e) => {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div style={{display: "table-caption"}}>
        <form className="DayPicker-Caption">
            <select name="month" onChange={handleChange} value={date.getMonth()}>
                {months.map((month: string, index: number) => <option key={month} value={index}>{month}</option>)}
            </select>
            <select name="year" onChange={handleChange} value={date.getFullYear()}>
                {years.map((year: number) => (
                    <option key={`year${year}`} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
            <button onClick={handleClose} className={"DayPicker-CloseButton"}>
                <FontAwesomeIcon icon={"times"}/>
            </button>
        </div>
    );
}

export default class DayPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monthFrom: "",
            monthTo: "",
            fromUndefined: false,
            toUndefined: false
        };
        this.from = React.createRef();
        this.to = React.createRef();
    }

    handleFromYearMonthChange = (month) => {
        this.setState({ monthFrom: month });
    };

    handleToYearMonthChange = (month) => {
        this.setState({ monthTo: month });

    };

    formatDate(e) {
        return e.toLocaleDateString("de-DE")
    }

    handleCloseFrom = () => {
        const calendarNode = this.from.current;
        calendarNode.hideDayPicker();
    };
    handleCloseTo = () => {
        const calendarNode = this.to;
        calendarNode.hideDayPicker();
    };

    handleFromChange(e) {
        if(e !== undefined) {
            this.setState({
                fromUndefined: false
            });
            store.dispatch(updateFilterDateFrom(e));
            this.props.setParentState(e, null);
        }
        else {
            //store.dispatch(updateFilterDateFrom(null));
            this.setState({
                fromUndefined: true
            });
            this.props.setParentState(undefined, null);
        }
    }
    handleToChange(e) {
        if(e !== undefined) {
            this.setState({
                toUndefined: false
            });
            store.dispatch(updateFilterDateTo(e));
            this.props.setParentState(null, e);
        }
        else {
            this.setState({
                toUndefined: true
            });
            //store.dispatch(updateFilterDateTo(null));
            this.props.setParentState(null, undefined);
        }
    }

    render() {
        let from2 = "";
        let to2 = "";
        const { from, to } = this.props.ownProps;
        if(from !== undefined && from !== null && from !== "") from2 = new Date(from);
        if(to !== undefined && to !== null && to !== "") to2 = new Date(to);
        const modifiers = { start: from2, end: to2 };
        let datePickerClasses = "DayPickers";
        if(this.from.current !== null && this.from.current.state !== undefined && this.from.current.state.typedValue !== "" && this.state.fromUndefined) {
            datePickerClasses += " falseInputFrom";
        }
        else {
            //fromGood = true;
            //console.log("dobar from");
        }
        if(this.to.state !== undefined && this.to.state !== null && this.to.state.typedValue !== "" && this.state.toUndefined) {
            datePickerClasses += " falseInputTo";
        }
        else {
            //toGood = true;
            //console.log("dobar to");
        }
        return (
            <div className={datePickerClasses}>
                <DayPickerInput  ref={this.from}
                    dayPickerProps={{
                        month: this.state.monthFrom !== "" ? this.state.monthFrom : from2,
                        fromMonth,
                        toMonth,
                        captionElement: <YearMonthForm onChange={this.handleFromYearMonthChange} onClose={this.handleCloseFrom}/>,
                        months: MONTHS["hr"],
                        weekdaysLong: WEEKDAYS_LONG["hr"],
                        weekdaysShort: WEEKDAYS_SHORT["hr"],
                        firstDayOfWeek: FIRST_DAY_OF_WEEK["hr"],
                        labels: LABELS["hr"],
                        selectedDays: [from2, { from2, to2 }],
                        disabledDays: { after: to2 },
                        //toMonth: to2,
                        modifiers,
                        fixedWeeks: true,
                    }}
                     inputProps={{readOnly: false}}
                     value={from2}
                     onDayChange={this.handleFromChange.bind(this)}
                     format="D.M.YYYY."
                     placeholder={Lang.FROM}
                    //formatDate={this.formatDate}
                     formatDate={formatDate}
                     parseDate={parseDate}
                />
                <DayPickerInput
                    dayPickerProps={{
                        month: this.state.monthTo !== "" ? this.state.monthTo : to2,
                        //fromMonth,
                        toMonth,
                        captionElement: <YearMonthForm onChange={this.handleToYearMonthChange} onClose={this.handleCloseTo} />,
                        selectedDays: [from2, { from2, to2 }],
                        disabledDays: { before: from2 },
                        modifiers,
                        //month: from2,
                        fromMonth: from2 !== "" ? from2 : fromMonth,
                        months: MONTHS["hr"],
                        weekdaysLong: WEEKDAYS_LONG["hr"],
                        weekdaysShort: WEEKDAYS_SHORT["hr"],
                        firstDayOfWeek: FIRST_DAY_OF_WEEK["hr"],
                        labels: LABELS["hr"],
                        fixedWeeks: true
                    }}
                    inputProps={{readOnly: false}}
                    value={to2}
                    ref={e => (this.to = e)}
                    onDayChange={this.handleToChange.bind(this)}
                    format="D.M.YYYY."
                    placeholder={Lang.TO}
                    //formatDate={this.formatDate}
                    formatDate={formatDate}
                    parseDate={parseDate}
                />
            </div>
        );
    }
}

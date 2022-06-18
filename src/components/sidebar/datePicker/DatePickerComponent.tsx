import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const processSelectedDate = (date: Date) => {
        setSelectedDate(date);
        console.log(date);
    }

    return (
        <div>
            <DatePicker 
                selected={selectedDate} 
                onChange={(date: Date) => processSelectedDate(date)} 
                dateFormat="dd/MM/yyyy"
                filterDate={ (date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
                isClearable
                showYearDropdown
                scrollableMonthYearDropdown
                />
        </div>
    );


}

export default DatePickerComponent;
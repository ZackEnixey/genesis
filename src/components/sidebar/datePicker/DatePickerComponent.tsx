import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../../../context";

const DatePickerComponent = () => {
    const { selectedDateFromDatePicker, setSelectedDateFromDatePicker } = useContext(BoardContext); 
 
    const processselectedDateFromDatePicker = (date: Date) => {
        setSelectedDateFromDatePicker(date);
    }

    return (
        <div>
            <DatePicker 
                selected={selectedDateFromDatePicker} 
                onChange={(date: Date) => processselectedDateFromDatePicker(date)} 
                dateFormat="dd/MM/yyyy"
                isClearable
                showYearDropdown
                scrollableMonthYearDropdown
                />
        </div>
    );


}

export default DatePickerComponent;
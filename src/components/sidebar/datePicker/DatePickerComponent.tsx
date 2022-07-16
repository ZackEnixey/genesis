import { useContext } from "react";
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import 'moment/locale/zh-cn';

import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../../../context";

const DatePickerComponent = () => {
    const { setSelectedDateFromDatePicker } = useContext(BoardContext); 

    const processselectedDateFromDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        if(!dateString) return;

        const selectedDateTypeDate: Date = new Date(dateString);
        setSelectedDateFromDatePicker(selectedDateTypeDate);
    }

    return (
        <div className="date_picker_wrapper" style={{position: "relative"}}>
            <div className="large_title"> PICK GREGORIAN DATE: </div>
            <DatePicker 
                style={{width: "100%"}} 
                name="gregorian_date" 
                onChange={processselectedDateFromDatePicker} 
            />
        </div>
    );


}

export default DatePickerComponent;
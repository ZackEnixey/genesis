import { useContext } from "react";
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../../../context";

const DatePickerComponent = () => {
    const { selectedDateFromDatePicker, setSelectedDateFromDatePicker } = useContext(BoardContext); 
 
    const processselectedDateFromDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        if(!dateString) return;

        const selectedDateTypeDate: Date = new Date(dateString);
        setSelectedDateFromDatePicker(selectedDateTypeDate);
    }

    return (
        <div className="date_picker_wrapper" style={{position: "relative"}}>
            <div> PICK GREGORIAN DATE: </div>
            <DatePicker name="gregorian_date" onChange={processselectedDateFromDatePicker} />
        </div>
    );


}

export default DatePickerComponent;
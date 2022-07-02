import { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../../../context";

const DatePickerComponent = () => {
    const { selectedDateFromDatePicker, setSelectedDateFromDatePicker } = useContext(BoardContext); 
 
    const processselectedDateFromDatePicker = (date: Date) => {
        console.log(date);
        setSelectedDateFromDatePicker(date);
    }

    return (
        <div className="date_picker_wrapper" style={{position: "relative", top: "30px"}}>
            <div> PICK GREGORIAN DATE: </div>
            <DatePicker 
                selected={selectedDateFromDatePicker} 
                onChange={(date: Date) => processselectedDateFromDatePicker(date)} 
                dateFormat="dd/MM/yyyy"
                isClearable
                showYearDropdown
                yearDropdownItemNumber={500}
                scrollableYearDropdown
                scrollableMonthYearDropdown
                />
        </div>
    );


}

export default DatePickerComponent;
import { useContext } from "react";
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import 'moment/locale/en-gb';
import 'moment/locale/fr';
import 'moment/locale/he';
import 'moment/locale/sr';
import localGB from 'antd/es/date-picker/locale/en_GB';
import localFR from 'antd/es/date-picker/locale/fr_FR';
import localHE from 'antd/es/date-picker/locale/he_IL';
import localSR from 'antd/es/date-picker/locale/sr_RS';

import "react-datepicker/dist/react-datepicker.css";
import { BoardContext } from "../../../context";
import { useTranslation } from "react-i18next";

const DatePickerComponent = () => {
    const { setSelectedDateFromDatePicker, setToggleSidebar, setTransitionTime } = useContext(BoardContext); 
    const { i18n } = useTranslation();

    const localLanguageDic: any = {
        "en": localGB,
        "fr": localFR,
        "he": localHE,
        "sr": localSR,
    }

    const processselectedDateFromDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        if(!dateString) return;

        const selectedDateTypeDate: Date = new Date(dateString);
        setTransitionTime("1s");
        setSelectedDateFromDatePicker(selectedDateTypeDate);
        setToggleSidebar(false);
    }

    return (
        <div className="date_picker_wrapper" style={{position: "relative"}}>
            <DatePicker 
                locale={localLanguageDic[i18n.language]}
                style={{width: "100%"}} 
                name="gregorian_date" 
                onChange={processselectedDateFromDatePicker} 
            />
        </div>
    );


}

export default DatePickerComponent;
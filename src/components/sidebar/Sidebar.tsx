import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";

type TCalendarType = "Gregorian" | "Hebrew";

const Sidebar = () => {
    const { setToggleSidebar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const { t } = useTranslation();
    const [calendarType, setCalendarType] = useState<TCalendarType>("Gregorian");
    
    const sidebarWrapperDic = {
        "BIG": "",
        "MEDIUM": "sidebar_wrapper_medium display_flex_center",
        "SMALL": "sidebar_wrapper_small display_flex_h_center_v_top"
    }

    const sidebarHolderDic = {
        "BIG": "sidebar_wrapper_big",
        "MEDIUM": "sidebar_wrapper_holder_medium",
        "SMALL": "sidebar_wrapper_holder_small"
    }

    const sidebarHeader = () => {
        return (
            <div className="sidebar_header">
                <div className={`sidebar_header_button ${calendarType === "Gregorian" && "active"} `} onClick={() => setCalendarType("Gregorian")}> {t("gregorianText")} </div>
                <div className={`sidebar_header_button ${calendarType === "Hebrew" && "active"} `} onClick={() => setCalendarType("Hebrew")}> {t("hebrewText")} </div>
            </div>
        )
    }

    const renderGregorianCalendar = () => {
        return (
            <div>
                <div className="large_title margin_top_space"> {t("pickGregorianDateText")}: </div>
                <DatePickerComponent />
            </div>
        )
    }

    const renderHebrewCalendar = () => {
        return (
            <div>
                <div className="large_title margin_top_space"> {t("pickHebrewDateText")}: </div>
                <HebrewDateInput2 />
            </div>
        )
    }
    
    const calendarTypeDic = {
        "Gregorian": renderGregorianCalendar(),
        "Hebrew": renderHebrewCalendar()
    }

    const closePopUpButton = () => {
        if (isHorizontal !== "BIG")
        return <div onClick={() => setToggleSidebar(false)} className="close_sidebar cursor_pointer"> {t("closeText")} </div>
    }

    return (
        <div className={sidebarWrapperDic[isHorizontal]}>
            <div className={sidebarHolderDic[isHorizontal]}>
                {sidebarHeader()}
                {calendarTypeDic[calendarType]}
                {closePopUpButton()} 
            </div>
        </div>
    )
}

export default Sidebar;
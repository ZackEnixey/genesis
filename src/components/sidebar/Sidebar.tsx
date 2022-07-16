import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";

const Sidebar = () => {
    const { setToggleSidebar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const { t } = useTranslation();

    const closePopUpButton = () => {
        return <div onClick={() => setToggleSidebar(false)} className="close_sidebar hover_effect cursor_pointer"> {t("closeText")} </div>
    }
    
    if (isHorizontal === PositionEnum.BIG) 
        return (
            <div className="sidebar_wrapper_big">
                <div className="large_title margin_top_space"> {t("pickGregorianDateText")}: </div>
                <DatePickerComponent />
                <div className="large_title margin_top_space"> {t("pickHebrewDateText")}: </div>
                <HebrewDateInput2 />
            </div>
        )

    if (isHorizontal === PositionEnum.MEDIUM) 
        return (
            <div className="sidebar_wrapper_medium display_flex_center">
                <div className="sidebar_wrapper_holder_medium">
                    <div className="large_title margin_top_space"> {t("pickGregorianDateText")}: </div>
                    <DatePickerComponent />
                    <div className="large_title margin_top_space"> {t("pickHebrewDateText")}: </div>
                    <HebrewDateInput2 />
                     {closePopUpButton()}
                </div>
            </div>
        )

    return (
        <div className="sidebar_wrapper_small display_flex_h_center_v_top">
            <div className="sidebar_wrapper_holder_small">
                <div className="large_title margin_top_space"> {t("pickGregorianDateText")}: </div>
                <DatePickerComponent />
                <div className="large_title margin_top_space"> {t("pickHebrewDateText")}: </div>
                <HebrewDateInput2 />
                {closePopUpButton()} 
            </div>
        </div>
    )
}

export default Sidebar;
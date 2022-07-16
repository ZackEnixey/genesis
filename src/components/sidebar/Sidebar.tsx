import { useContext } from "react";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";

const Sidebar = () => {
    const { setToggleSidebar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();

    const sidebarWrapperStyleDic = {
        "BIG": "sidebar_wrapper_big",
        "MEDIUM": "sidebar_wrapper_medium",
        "SMALL": "sidebar_wrapper_small"
    }
    
    if (isHorizontal === PositionEnum.BIG) 
        return (
            <div className={sidebarWrapperStyleDic[isHorizontal]}>
                <DatePickerComponent />
                <HebrewDateInput2 />
            </div>
        )

    return (
        <div className={sidebarWrapperStyleDic[isHorizontal]}>
            <DatePickerComponent />
            <HebrewDateInput2 />
            <div onClick={() => setToggleSidebar(false)} className="close_sidebar hover_effect cursor_pointer"> CLOSE </div> 
        </div>
    )
}

export default Sidebar;
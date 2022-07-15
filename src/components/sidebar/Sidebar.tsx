import useUiUxPosition from "../customHooks/useUiUxPosition";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";

const Sidebar = () => {
    const isHorizontal = useUiUxPosition();

    const sidebarWrapperStyleDic = {
        "BIG": "sidebar_wrapper_big",
        "MEDIUM": "sidebar_wrapper_medium",
        "SMALL": "sidebar_wrapper_small"
    }
    
    return (
        <div className={sidebarWrapperStyleDic[isHorizontal]}>
            <DatePickerComponent />
            <HebrewDateInput2 />
        </div>
    )
}

export default Sidebar;
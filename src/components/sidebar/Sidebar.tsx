import { useContext } from "react";

import { TestContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import AdjustEarthToSunAngle from "./AdjustEarthToSunAngle";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";

const Sidebar = () => {
    const isHorizontal = useUiUxPosition();
    const sidebarWrapperStyle = isHorizontal ? "sidebar_wrapper font_size" : "sidebar_wrapper_narrow font_size";
    const sidebarStyle = isHorizontal ? "sidebar_wide_screen" : "sidebar_narrow_screen";
    
    return (
        <div className={sidebarWrapperStyle}>
            <div className={sidebarStyle}> 

                <AdjustEarthToSunAngle />

                <DatePickerComponent />
                
                <HebrewDateInput2 />
                
            </div>
        </div>
    )
}

export default Sidebar;
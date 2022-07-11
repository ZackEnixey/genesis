import { useContext } from "react";

import { TestContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import AdjustEarthToSunAngle from "./AdjustEarthToSunAngle";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput from "./hebrewDateInput/HebrewDateInput";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";
import TestComponent from "./TestComponent";

const Sidebar = () => {
    const { isTestMode } = useContext(TestContext);
    const isHorizontal = useUiUxPosition();
    const sidebarWrapperStyle = isHorizontal ? "sidebar_wrapper screen_font_style" : "sidebar_wrapper_narrow screen_font_style_narrow";
    const sidebarStyle = isHorizontal ? "sidebar_wide_screen" : "sidebar_narrow_screen";
    
    return (
        <div className={sidebarWrapperStyle}>
            <div className={sidebarStyle}> 

                <AdjustEarthToSunAngle />

                <DatePickerComponent />
                
                <HebrewDateInput2 />

                {/* <HebrewDateInput /> */}
                
                {isTestMode && <TestComponent />}
                
            </div>
        </div>
    )
}

export default Sidebar;
import { useContext } from "react";

import { TestContext } from "../../context";
import AdjustEarthToSunAngle from "./AdjustEarthToSunAngle";
import DatePickerComponent from "./datePicker/DatePickerComponent";
import HebrewDateInput from "./hebrewDateInput/HebrewDateInput";
import HebrewDateInput2 from "./hebrewDateInput/HebrewDateInput2";
import TestComponent from "./TestComponent";

const Sidebar = () => {
    const { isTestMode } = useContext(TestContext);
    
    return (
        <div className="sidebar_wrapper">
            <div style={{position: "absolute"}}> 

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
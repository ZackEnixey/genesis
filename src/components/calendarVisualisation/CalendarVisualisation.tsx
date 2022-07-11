import { useContext } from "react";
import hebrewMonths from "../../assets/hebrewMonths.png";
import seasonsAndMonths from "../../assets/seasonsAndMonths.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import checkIsLeapYear from "./checkIsLeapYear";

const CalendarVisualisation = () => {
    const { simulationNumberOfDays, initialNewMoonDate } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const calendarVisualisationImgStyle = isHorizontal ? "calendar_visualisation_img" : "calendar_visualisation_img_narrow";
    const numberOfDaysInAdar2: number = 29;
    const lunarErrorPerDayInDegrees: number = 0.02925555555;
    const numberOfLeapYersTillThisDate: number = checkIsLeapYear(simulationNumberOfDays, initialNewMoonDate).numberOfLeapYearsSince1940; // + 1 so we would avoid it to be 0;
    
    let leapYearShift: number = numberOfDaysInAdar2 * numberOfLeapYersTillThisDate;    

    const error: number = 24;

    const hebrewMonthErrorShift: number = lunarErrorPerDayInDegrees*simulationNumberOfDays + leapYearShift + error;
    return (
        <div className="calendar_visualisation_wrapper">
            <div style={{position: "absolute", top: 0, left: "200px", color: "white"}}> {checkIsLeapYear(simulationNumberOfDays, initialNewMoonDate).numberOfLeapYearsSince1940}  </div> 
            <img style={{transform: `rotate(${-hebrewMonthErrorShift}deg)`}} src={hebrewMonths} alt="english" className={calendarVisualisationImgStyle} />
            <img src={seasonsAndMonths} alt="english" className={calendarVisualisationImgStyle} />
        </div>
    )
}

export default CalendarVisualisation;
import { useContext } from "react";
import hebrewMonths from "../../assets/hebrewMonths.png";
import seasonsAndMonths from "../../assets/seasonsAndMonths.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import checkIsLeapYear from "./checkIsLeapYear";

const CalendarVisualisation = () => {
    const isHorizontal = useUiUxPosition();
    const { simulationNumberOfDays, initialNewMoonDate } = useContext(BoardContext);
    const numberOfDaysInAdar2: number = 29;
    const lunarErrorPerDayInDegrees: number = 0.02925555555;
    const numberOfLeapYersTillThisDate: number = checkIsLeapYear(simulationNumberOfDays, initialNewMoonDate).numberOfLeapYearsSince1940; // + 1 so we would avoid it to be 0;
    
    let leapYearShift: number = numberOfDaysInAdar2 * numberOfLeapYersTillThisDate;    

    const error: number = 24;

    const hebrewMonthErrorShift: number = lunarErrorPerDayInDegrees*simulationNumberOfDays + leapYearShift + error;

    const calendarSizeDic = {
        "BIG": "calendar_visualisation_img",
        "MEDIUM": "calendar_visualisation_img",
        "SMALL": "calendar_visualisation_img_small"
    }

    return (
        <div className="calendar_visualisation_wrapper">
            <img style={{transform: `rotate(${-hebrewMonthErrorShift}deg)`, transition: "2s"}} src={hebrewMonths} alt="english" className={calendarSizeDic[isHorizontal]} />
            <img src={seasonsAndMonths} alt="english" className={calendarSizeDic[isHorizontal]} />
        </div>
    )
}

export default CalendarVisualisation;
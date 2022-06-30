import { useContext } from "react";
import hebrewMonths from "../../assets/hebrewMonths.png";
import seasonsAndMonths from "../../assets/seasonsAndMonths.png";
import { BoardContext } from "../../context";

const CalendarVisualisation = () => {
    const { simulationNumberOfDays, theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun } = useContext(BoardContext);

    const numberOfDaysAbs: number = Math.abs(simulationNumberOfDays) * theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun; // from 0 to 360
    const numberOfDegreesInCircle: number = 360;
    const yearNumber: number = numberOfDaysAbs / numberOfDegreesInCircle;
    const leapYear: number = 4;
    const isLeapYear: boolean = Math.floor(yearNumber) % leapYear === 0;
    const numberOfDaysInAdar2: number = 29;
    const lunarErrorPerDayInDegrees: number = 0.03055555555;
    const numberOfLeapYersTillThisDate: number = Math.floor(yearNumber/4) + 1; // + 1 so we would avoid it to be 0;
    
    console.log({numberOfLeapYersTillThisDate});
    let leapYearShift: number =numberOfDaysInAdar2 * numberOfLeapYersTillThisDate;
    console.log( {lunarErrorPerDayInDegrees, simulationNumberOfDays, leapYearShift} );


    const hebrewMonthErrorShift: number = lunarErrorPerDayInDegrees*simulationNumberOfDays + leapYearShift;
    return (
        <div className="calendar_visualisation_wrapper">
            <div style={{position: "absolute", top: 0, left: "200px", color: "white"}}> year: {yearNumber}, {hebrewMonthErrorShift} = {lunarErrorPerDayInDegrees}*{simulationNumberOfDays}+{leapYearShift} </div> 
            <img style={{transform: `rotate(${-0}deg)`}} src={hebrewMonths} alt="english" className="calendar_visualisation_img" />
            <img src={seasonsAndMonths} alt="english" className="calendar_visualisation_img" />
        </div>
    )
}

export default CalendarVisualisation;
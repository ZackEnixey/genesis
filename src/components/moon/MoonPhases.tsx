import { useContext } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import { convertGeorginaDateToHebrewDate, dateToUtcStringCounterFromInitialDay } from "./helper";
import SelectedDate from "./SelectedDate";

const MoonPhases = () => {
    const { simulationNumberOfDays, initialNewMoonDate, synodicPeriodNumberOfDays } = useContext(BoardContext);
    
    const numberOfSynodicPeriod: number = Math.abs(simulationNumberOfDays) / synodicPeriodNumberOfDays;
    const progressOfTheMoonMovementInSynodicPeriodInPercentage: number = numberOfSynodicPeriod - Math.floor(numberOfSynodicPeriod);
    const progressOfTheMoonMovementInSynodicPeriodInDays: number = synodicPeriodNumberOfDays * progressOfTheMoonMovementInSynodicPeriodInPercentage;

    const value: number = progressOfTheMoonMovementInSynodicPeriodInDays;

    const renderMoon = () => {
        let currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays, initialNewMoonDate))
        let ordinalNumberInHebrewMonth: number = Number(new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric'}).format(currentGeorgianDate));
        console.log("value:" + ordinalNumberInHebrewMonth);

        // the young moon 1
        if (ordinalNumberInHebrewMonth === 1) {
            let angle: number = 0;

            return (
                <div className="moon">
                    <div className="left_hide" ></div>
                    <div className="disc" style={{transform: `rotateY(${angle}deg)`}}></div>
                </div>
            )
        }

        // the period between the young moon and 1st quarter 2 3 4 5 6 7
        if (ordinalNumberInHebrewMonth > 1 && ordinalNumberInHebrewMonth <= 8) {
            let angle: number = 12.5*(ordinalNumberInHebrewMonth-1);
            if (ordinalNumberInHebrewMonth === 2) angle = 12.5*1.2;      
            // if (ordinalNumberInHebrewMonth === 8) angle = 12.5;       
            return (
                <div className="moon">
                    <div className="left_hide" ></div>
                    {ordinalNumberInHebrewMonth !== 8 && <div className="disc" style={{transform: `rotateY(${angle}deg)`}}></div>}
                </div>
            )
        }

        // the period betwee 1st quarter and the full moon 8 9 10 11 12 13 14 15
        if (ordinalNumberInHebrewMonth > 8 && ordinalNumberInHebrewMonth <= 15)
            return (
                <div className="moon">
                    <div className="disc2" style={{transform: `rotateY(${80 - 12.5 * (ordinalNumberInHebrewMonth-9)}deg)`}}></div>
                </div>
            )


        if (ordinalNumberInHebrewMonth > 15 && ordinalNumberInHebrewMonth <= 22) {
            return (
                <div className="moon">
                    <div className="disc3" style={{transform: `rotateY(${12.5 * (ordinalNumberInHebrewMonth-16)}deg)`}}></div>
                </div>
            )
        }
             
        if (ordinalNumberInHebrewMonth > 22 && ordinalNumberInHebrewMonth <= 30) {

            let angle: number = 90 - 12.5*(ordinalNumberInHebrewMonth-23);
            if (ordinalNumberInHebrewMonth === 29 ) angle = 90 - 12.5*(30-23)
            if (angle > 85 && angle < 110) angle = 90;
            return (
                <div className="moon">
                    <div className="right_hide"></div>
                    <div className="disc4" style={{transform: `rotateY(${angle}deg)`}}></div>
                </div>
            )
        }
    }

    return (
        <div className="moon_phases_wrapper">
            <SelectedDate />
            {renderMoon()}
        </div>
    )
}

export default MoonPhases;
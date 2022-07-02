import { useContext } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import SelectedDate from "./SelectedDate";

const MoonPhases = () => {
    const { simulationNumberOfDays, synodicPeriodNumberOfDays } = useContext(BoardContext);
    
    const numberOfSynodicPeriod: number = Math.abs(simulationNumberOfDays) / synodicPeriodNumberOfDays;
    const progressOfTheMoonMovementInSynodicPeriodInPercentage: number = numberOfSynodicPeriod - Math.floor(numberOfSynodicPeriod);
    const progressOfTheMoonMovementInSynodicPeriodInDays: number = synodicPeriodNumberOfDays * progressOfTheMoonMovementInSynodicPeriodInPercentage;

    const value: number = progressOfTheMoonMovementInSynodicPeriodInDays;

    const renderMoon = () => {

        if (value > 0 && value <= 8) {
            let angle: number = 12.5*value;
            if (angle > 85 && angle < 110) angle = 90;
            return (
                <div className="moon">
                    <div className="left_hide" ></div>
                    <div className="disc" style={{transform: `rotateY(${angle}deg)`}}></div>
                </div>
            )
        }

        if (value > 8 && value <= 15)
            return (
                <div className="moon">
                    <div className="disc2" style={{transform: `rotateY(${80 - 12.5 * (value-8)}deg)`}}></div>
                </div>
            )

        if (value > 15 && value <= 22)
            return (
                <div className="moon">
                    <div className="disc3" style={{transform: `rotateY(${12.5 * (value-15)}deg)`}}></div>
                </div>
            )
             
        if (value > 22 && value <= 30) {
            let angle: number = 90 - 12.5*(value-23);
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
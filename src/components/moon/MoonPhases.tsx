import { useContext, useEffect, useState } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import SelectedDate from "./SelectedDate";

const MoonPhases = () => {
    const { 
        simulationNumberOfDays, 
        synodicPeriodNumberOfDays
    } = useContext(BoardContext);
    
    const numberOfSynodicPeriod: number = Math.abs(simulationNumberOfDays) / synodicPeriodNumberOfDays;
    const progressOfTheMoonMovementInSynodicPeriodInPercentage: number = numberOfSynodicPeriod - Math.floor(numberOfSynodicPeriod);
    const progressOfTheMoonMovementInSynodicPeriodInDays: number = synodicPeriodNumberOfDays * progressOfTheMoonMovementInSynodicPeriodInPercentage;

    const value: number = progressOfTheMoonMovementInSynodicPeriodInDays;

    const shadowAcordingTosimulationNumberOfDays = () => {
        if (value < 1    ) return {transform: "translateX(0vh)"}; // 1
        if (value >= 1 && value <  2 ) return {transform: "translateX(-2vh)"}; // 1
        if (value >= 2 && value <  3 ) return {transform: "translateX(-4vh)"}; // 2
        if (value >= 3 && value <  4 ) return {transform: "translateX(-6vh)"}; // 3
        if (value >= 4 && value <  5 ) return {transform: "translateX(-8vh)"}; // 4
       
        if (value >= 5 && value <  6 ) return {transform: "translateX(-10vh)"}; // 5
        if (value >= 6 && value <  7 ) return {transform: "translateX(-12vh)"}; // 6
        if (value >= 7 && value <  8 ) return {transform: "translateX(-13vh)"}; // 7
        if (value >= 8 && value <  9 ) return {transform: "translateX(-14vh)"}; // 8
        if (value >= 9 && value <  10 ) return {transform: "translateX(-16vh)"}; // 9
        
        if (value >= 10 && value <  11 ) return {transform: "translateX(-18vh)"}; // 10
        if (value >= 11 && value <  12 ) return {transform: "translateX(-20vh)"}; // 11
        if (value >= 12 && value <  13 ) return {transform: "translateX(-22vh)"}; // 12
        if (value >= 13 && value <  14 ) return {transform: "translateX(-23vh)"}; // 13
        if (value >= 14 && value <  15 ) return {transform: "translateX(24vh)"}; // 14
        
        if (value >= 15 && value <  16 ) return {transform: "translateX(23vh)"}; // 15
        if (value >= 16 && value <  17 ) return {transform: "translateX(22vh)"}; // 16 
        if (value >= 17 && value <  18 ) return {transform: "translateX(20vh)"}; // 17
        if (value >= 18 && value <  19 ) return {transform: "translateX(18vh)"}; // 18
        if (value >= 19 && value <  20 ) return {transform: "translateX(16vh)"}; // 19
        
        if (value >= 20 && value < 21   ) return {transform: "translateX(14vh)"}; // 20
        if (value >= 21 && value < 22   ) return {transform: "translateX(12vh)"}; // 21 
        if (value >= 22 && value < 23   ) return {transform: "translateX(10vh)"}; // 22
        if (value >= 23 && value < 24   ) return {transform: "translateX(8vh)"}; // 23
        if (value >= 24 && value < 25   ) return {transform: "translateX(6vh)"}; // 24
        
        if (value >= 25 && value < 26  ) return {transform: "translateX(4vh)"}; // 25
        if (value >= 26 && value < 27  ) return {transform: "translateX(2vh)"}; // 26
        if (value >= 27 && value < 28  ) return {transform: "translateX(1vh)"}; // 27
        if (value >= 28 && value < 29  ) return {transform: "translateX(0.5vh)"}; // 28
        if (value >= 29 && value < 30  ) return {transform: "translateX(0vh)"}; // 29

        return {transform: "translateX(0vh)"};
    }


    return (
        <div className="moon_phases_wrapper">
            <SelectedDate />
            <div className="current_synodic_day"> {value} </div>
            <div className="vertical_rooler"></div>
            <img className="moon_picture" src={moonImg} alt="moon"  /> 
            <div className="moon_shadow_wrapper">
                {/* <div className="moon_shadow"></div> */}
                <div className="square" style={shadowAcordingTosimulationNumberOfDays()} ></div>
            </div>
        </div>
    )
}

export default MoonPhases;
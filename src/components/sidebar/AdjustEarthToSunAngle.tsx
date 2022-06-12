import { useContext, useEffect, useRef, useState } from "react";
import { BoardContext } from "../../context";
import text from "../language/checkLanguageInput";

const AdjustEarthToSunAngle = () => {
    const {
        dayNumber,
        setDayNumber,
        language,
        earthAngleToSun, 
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);
    
    
    const transferInputValueToEarthToSunDegrees = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredValue: number = parseInt(event.target.value) || 0;
        setDayNumber(enteredValue);
        setEarthAngleToSun(enteredValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return (
        <div className="adjust_earth_to_sun_angle_wrapper">
            {text("setTheAngleOfTheEarth", language)}:
            <input 
                type="number" 
                name="clicks" 
                value={dayNumber} 
                onChange={ (event: React.ChangeEvent<HTMLInputElement>) => transferInputValueToEarthToSunDegrees(event) } 
                style={{width: "100px", height: "50px", fontSize: "30px"}}
            /> 
            <div> {text("earthAngleTowardsTheSun", language)} : {earthAngleToSun} {text("deg", language)} </div>
        </div>
    )
}

export default AdjustEarthToSunAngle;
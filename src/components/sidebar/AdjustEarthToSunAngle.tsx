import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";

const AdjustEarthToSunAngle = () => {
    const {
        dayNumber,
        setDayNumber,
        earthAngleToSun, 
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);
    const { t } = useTranslation();    
    
    const transferInputValueToEarthToSunDegrees = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredValue: number = parseInt(event.target.value) || 0;
        setDayNumber(enteredValue);
        setEarthAngleToSun(enteredValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return (
        <div className="adjust_earth_to_sun_angle_wrapper">
            {t("setTheAngleOfTheEarth")}:
            <input 
                type="number" 
                name="clicks" 
                value={dayNumber} 
                onChange={ (event: React.ChangeEvent<HTMLInputElement>) => transferInputValueToEarthToSunDegrees(event) } 
                style={{width: "100px", height: "50px", fontSize: "30px"}}
            /> 
            <div> {t("earthAngleTowardsTheSun")} : {earthAngleToSun} {t("deg")} </div>
        </div>
    )
}

export default AdjustEarthToSunAngle;
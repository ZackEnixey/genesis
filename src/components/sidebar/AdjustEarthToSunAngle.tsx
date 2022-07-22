import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const AdjustEarthToSunAngle = () => {
    const {
        simulationNumberOfDays,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun,
        setTransitionTime
    } = useContext(BoardContext);  
    const isHorizontal = useUiUxPosition();
    const { t } = useTranslation();

    const increment = (numberOfDays: number) => {
        console.log(Math.abs(numberOfDays));
        setTransitionTime(transitionTimeDic[ Math.abs(numberOfDays) ]);
        const newValue: number = simulationNumberOfDays.value - numberOfDays
        setSimulationNumberOfDays({value: newValue, direction: "increase", shiftType: shiftTypeDic[numberOfDays]});
        setEarthAngleToSun(newValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    const decrement = (numberOfDays: number) => {
        console.log(Math.abs(numberOfDays));
        setTransitionTime(transitionTimeDic[ Math.abs(numberOfDays) ]);
        const newValue: number = simulationNumberOfDays.value + numberOfDays
        setSimulationNumberOfDays({value: newValue, direction: "decrease", shiftType: shiftTypeDic[numberOfDays]});
        setEarthAngleToSun(newValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    const shiftTypeDic: any = {
        1: "day",
        30: "month",
        365: "year"
    }

    const transitionTimeDic: any = {
        1: "1s",
        30: "3s",
        365: "5s"
    }

    const buttonStyleDic: any= {
        "BIG": "increment_button cursor_pointer",
        "MEDIUM": "increment_button_medium cursor_pointer",
        "SMALL": "increment_button_small cursor_pointer"
    }

    const buttonPositionStyleDic: any= {
        "BIG": "adjust_earth_to_sun_angle_wrapper",
        "MEDIUM": "adjust_earth_to_sun_angle_wrapper_medium",
        "SMALL": "adjust_earth_to_sun_angle_wrapper_small"
    }

    return (
        <div className={buttonPositionStyleDic[isHorizontal]}>
            
            <div className="button_holder">
                <button className={buttonStyleDic[isHorizontal]} onClick={() => decrement(1)}>  - </button>
                <div> {t("dayText")} </div>
                <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(1)}>  + </button>
            </div>
            
            <div className="button_holder">
                <button className={buttonStyleDic[isHorizontal]} onClick={() => decrement(30)}> - </button>
                <div> {t('monthText')} </div>
                <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(30)}> + </button>
            </div>
            
            <div className="button_holder">
                <button className={buttonStyleDic[isHorizontal]} onClick={() => decrement(365)}> - </button>
                <div> {t('yearText')} </div>
                <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(365)}> + </button>
            </div>
        
        </div>
    )
}

export default AdjustEarthToSunAngle;
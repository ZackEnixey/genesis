import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const AdjustEarthToSunAngle = () => {
    const {
        simulationNumberOfDays,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);  
    const isHorizontal = useUiUxPosition();
    const { t } = useTranslation();

    const increment = (numberOfDays: number) => {
        const newValue: number = simulationNumberOfDays + numberOfDays
        setSimulationNumberOfDays(newValue);
        setEarthAngleToSun(newValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    const buttonStyleDic: any= {
        "BIG": "increment_button",
        "MEDIUM": "increment_button_medium",
        "SMALL": "increment_button_small"
    }

    const buttonPositionStyleDic: any= {
        "BIG": "adjust_earth_to_sun_angle_wrapper",
        "MEDIUM": "adjust_earth_to_sun_angle_wrapper_medium",
        "SMALL": "adjust_earth_to_sun_angle_wrapper_small"
    }

    return (
        <div className={buttonPositionStyleDic[isHorizontal]}>
            <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(-1)}>  +{t("dayText")}  </button>
            <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(-30)}> +{t('monthText')} </button>
            <button className={buttonStyleDic[isHorizontal]} onClick={() => increment(-360)}> +{t('yearText')}  </button>
        </div>
    )
}

export default AdjustEarthToSunAngle;
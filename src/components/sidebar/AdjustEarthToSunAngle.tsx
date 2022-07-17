import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";

const AdjustEarthToSunAngle = () => {
    const {
        simulationNumberOfDays,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);  
    const { t } = useTranslation();
    
    // const transferInputValueToEarthToSunDegrees = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const enteredValue: number = parseInt(event.target.value) || 0;
    //     setSimulationNumberOfDays(enteredValue);
    //     setEarthAngleToSun(enteredValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    // }

    const increment = (numberOfDays: number) => {
        const newValue: number = simulationNumberOfDays + numberOfDays
        setSimulationNumberOfDays(newValue);
        setEarthAngleToSun(newValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return (
        <div className="adjust_earth_to_sun_angle_wrapper">
                <button className="increment_button" onClick={() => increment(-1)}>  + {t("dayText")}  </button>
                <button className="increment_button" onClick={() => increment(-30)}> + {t('monthText')} </button>
                <button className="increment_button" onClick={() => increment(-360)}> + {t('yearText')}  </button>
                {/* <div className="increment_wrapper">
                    <input 
                        type="number" 
                        name="clicks" 
                        value={simulationNumberOfDays} 
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => transferInputValueToEarthToSunDegrees(event) } 
                        className="input_incrementer"
                    /> 
                    <div className="hiding_patch"></div>
                </div> */}
        </div>
    )
}

export default AdjustEarthToSunAngle;
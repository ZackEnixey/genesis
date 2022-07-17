import { useContext } from "react";
import { BoardContext } from "../../context";

const AdjustEarthToSunAngle = () => {
    const {
        simulationNumberOfDays,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);  
   
    
    const transferInputValueToEarthToSunDegrees = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredValue: number = parseInt(event.target.value) || 0;
        setSimulationNumberOfDays(enteredValue);
        setEarthAngleToSun(enteredValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return (
        <div className="adjust_earth_to_sun_angle_wrapper">
            <div className="increment_wrapper">
                <input 
                    type="number" 
                    name="clicks" 
                    value={simulationNumberOfDays} 
                    onChange={ (event: React.ChangeEvent<HTMLInputElement>) => transferInputValueToEarthToSunDegrees(event) } 
                    className="input_incrementer"
                /> 
                <div className="hiding_patch"></div>
            </div>
        </div>
    )
}

export default AdjustEarthToSunAngle;
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

    const increment = (numberOfDays: number) => {
        const newValue: number = simulationNumberOfDays + numberOfDays
        setSimulationNumberOfDays(newValue);
        setEarthAngleToSun(newValue*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return (
        <div className="adjust_earth_to_sun_angle_wrapper">
                <button className="increment_button" onClick={() => increment(-1)}> + day </button>
                <button className="increment_button" onClick={() => increment(-30)}> + month </button>
                <button className="increment_button" onClick={() => increment(-360)}> + year </button>
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
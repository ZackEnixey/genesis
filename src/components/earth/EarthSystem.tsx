import { useContext } from "react";
import { Moon } from "..";

import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import EarthRotatingAnimation from "./EarthRotatingAnimation";

const EarthSystem = () => {
    const { 
        earthTrajectoryWidth, 
        earthTrajectoryHeight, 
        earthAngleToSun
    } = useContext(BoardContext);

    const isHorizontal = useUiUxPosition();
    
    let radius : string = "40";
    const theNumberOfDegreesInOneHalfOfCircle: number = 180;
    const angleInRadians = earthAngleToSun*Math.PI/theNumberOfDegreesInOneHalfOfCircle;

    const sineSquare = Math.sin(angleInRadians)*Math.sin(angleInRadians);
    const cosineSquare = Math.cos(angleInRadians)*Math.cos(angleInRadians);
    const equation_numerator = earthTrajectoryWidth*earthTrajectoryHeight;
    const equation_denominator = Math.sqrt(earthTrajectoryWidth * earthTrajectoryWidth * sineSquare + earthTrajectoryHeight * earthTrajectoryHeight * cosineSquare );
    radius = isHorizontal === PositionEnum.SMALL ? "60vw" : Math.round(equation_numerator/equation_denominator)+"vh";

    const error: number = -35;
            
    return(
        <div className="earth_to_sun_circle_diameter" style={{transform: `rotate(${earthAngleToSun - error}deg)`, width: `${radius}`}} >
            <div className="wrapper_demo_xx" style={{transform: `rotate(-${earthAngleToSun - error}deg)`}} >
                <EarthRotatingAnimation />
            </div>
            <div className="earth_night_side"></div>
            <Moon />
        </div>
    )
}

export default EarthSystem;
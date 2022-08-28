import { useContext } from "react";
import { Moon } from "..";

import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import EarthRotatingAnimation from "./EarthRotatingAnimation";

const EarthSystem = () => {
    const { 
        earthAngleToSun,
        transitionTime
    } = useContext(BoardContext);

    const isHorizontal = useUiUxPosition();
    
    let radius : string = "40";
    radius = isHorizontal === PositionEnum.SMALL ? "68vw" : "68vh";

    const error: number = -35;
            
    const earthStyleDic = {
        "BIG": "earth_night_side_big",
        "MEDIUM": "earth_night_side_big",
        "SMALL": "earth_night_side_small"
    }

    return(
        <div className="earth_to_sun_circle_diameter" style={{transform: `rotate(${earthAngleToSun - error}deg)`, transition: transitionTime, width: `${radius}`}} >
            <div className="wrapper_demo_xx" style={{transform: `rotate(-${earthAngleToSun - error}deg)`, transition: transitionTime}} >
                <EarthRotatingAnimation />
            </div>
            <div className={earthStyleDic[isHorizontal]}></div>
            <Moon />
        </div>
    )
}

export default EarthSystem;
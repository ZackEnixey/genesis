import { useContext } from "react";
import sunImg from "../../assets/sunImg.png";
import { BoardContext } from "../../context";
import { EarthSystem }  from "..";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import { PositionEnum } from "../../types";

const SolarSystem = () => {
    const isHorizontal = useUiUxPosition();
    const { earthTrajectoryWidth, earthTrajectoryHeight, transitionTime } = useContext(BoardContext);
    const smallHeight: string = "60vw";
    const smallWidth: string = "60vw";
    const height: string = isHorizontal === PositionEnum.SMALL ? smallHeight: earthTrajectoryHeight+"vh";
    const width: string = isHorizontal === PositionEnum.SMALL ? smallWidth : earthTrajectoryWidth+"vh";
    
    const sunSizeDic = {
        "BIG": "sun_image_big",
        "MEDIUM": "sun_image_big",
        "SMALL": "sun_image_small"
    }

    return (
        <div className="solar_system_wrapper_test">
            <img className={sunSizeDic[isHorizontal]} src={sunImg} alt="sun" />
            <div className="solar_system_wrapper_test">
                <div className="elipse_wrapper">
                    <div className="earth_trajectory_surface" style={{height: `${height}`, width: `${width}`, transition: transitionTime}} ></div>
                    <EarthSystem />
                </div>
            </div>
            
        </div>
    )
}

export default SolarSystem;
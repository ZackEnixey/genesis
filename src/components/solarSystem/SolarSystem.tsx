import { useContext } from "react";
import sunImg from "../../assets/sunImg.png";
import { BoardContext } from "../../context";
import { EarthSystem }  from "..";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const SolarSystem = () => {
    const { earthTrajectoryWidth, earthTrajectoryHeight } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const dimentions: any = isHorizontal ? {height: `${earthTrajectoryHeight}vh`, width: `${earthTrajectoryWidth}vh`} : {height: `${70}vw`, width: `${70}vw`}
    const sunImageStyle: any = isHorizontal ? "sun_image" : "sun_image_narrow";

    return (
        <div className="solar_system_wrapper_test">
            <img className={sunImageStyle} src={sunImg} alt="sun" />
            <div className="solar_system_wrapper_test">
            <div className="elipse_wrapper">
                <div className="earth_trajectory_surface" style={dimentions} ></div>
                <EarthSystem />
            </div>
        </div>
            
        </div>
    )
}

export default SolarSystem;
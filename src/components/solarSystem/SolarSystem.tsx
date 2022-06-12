import { useContext } from "react";
import sunImg from "../../assets/sunImg.png";
import { BoardContext } from "../../context";
import { EarthSystem }  from "..";

const SolarSystem = () => {
    const { earthTrajectoryWidth, earthTrajectoryHeight } = useContext(BoardContext);

    return (
        <div className="solar_system_wrapper_test">
            <img className="sun_image" src={sunImg} alt="sun" />
            <div className="solar_system_wrapper_test">
            <div className="elipse_wrapper">
                <div className="earth_trajectory_surface" style={{height: `${earthTrajectoryHeight}vh`, width: `${earthTrajectoryWidth}vh`}} ></div>
                <EarthSystem />
            </div>
        </div>
            
        </div>
    )
}

export default SolarSystem;
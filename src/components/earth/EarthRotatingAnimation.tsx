import { useContext } from "react";
import earthImg from "../../assets/earthImg.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const EarthRotatingAnimation = () => {
    const { simulationNumberOfDays, transitionTime } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const style = { 
        transform: `rotate(${simulationNumberOfDays.value*360}deg)`, 
        transition: transitionTime 
    }
    
    const earthStyleDic = {
        "BIG": "earth_image_big",
        "MEDIUM": "earth_image_big",
        "SMALL": "earth_image_small"
    }

    return (
        <div className="earth_image_holder">
            <div className="ease_out" style={style}>
                <img className={earthStyleDic[isHorizontal]}  src={earthImg} alt="user_avatar" />
            </div>
        </div>
    )
}

export default EarthRotatingAnimation;
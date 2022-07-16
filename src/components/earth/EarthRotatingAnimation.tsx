import earthImg from "../../assets/earthImg.png";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const EarthRotatingAnimation = () => {
    const isHorizontal = useUiUxPosition();
    
    const earthStyleDic = {
        "BIG": "earth_image_big",
        "MEDIUM": "earth_image_big",
        "SMALL": "earth_image_small"
    }

    return (
        <div className="earth_image_holder">
            <img className={earthStyleDic[isHorizontal]} src={earthImg} alt="user_avatar" />
        </div>
    )
}

export default EarthRotatingAnimation;
import { FC, useEffect } from "react";
import earthImg from "../../assets/earthImg.png";

interface IEarthRotatingAnimation {
    angleInDegrees: number;
}

const EarthRotatingAnimation: FC<IEarthRotatingAnimation> = ({angleInDegrees}) => {

    return (
        <div className="earth_image_holder">
            <img className="earth_image" src={earthImg} alt="user_avatar" />
        </div>
    )
}

export default EarthRotatingAnimation;
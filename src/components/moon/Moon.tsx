import { useContext } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const Moon = () => {
    const { simulationNumberOfDays, theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes} = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const angleCorrection: number = 135;
    const theMoonShiftDeegreesAccordintToTheNumberOfDays: number = simulationNumberOfDays * theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes + angleCorrection;

    const moonWrapperDimenstionDic = {
        "BIG": "moon_wrapper moon_wrapper_size_big",
        "MEDIUM": "moon_wrapper moon_wrapper_size_big",
        "SMALL": "moon_wrapper moon_wrapper_size_small"
    }

    return (
        <div className={moonWrapperDimenstionDic[isHorizontal]} style={{transform: `rotate(${theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}} >
            <img className="moon_picture" src={moonImg} alt="moon" style={{transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}}  />  
            <img className="moon_picture" src={moonImg} alt="moon" style={{transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}}  />  
            <div className="moon_shadow" style={{transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays-30}deg)`}} >  </div>
        </div>
    )
}

export default Moon;
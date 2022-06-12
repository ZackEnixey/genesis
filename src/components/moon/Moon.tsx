import { useContext } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";

const Moon = () => {
    const { dayNumber, theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth} = useContext(BoardContext);
    const angleCorrection: number = 135;
    const theMoonShiftDeegreesAccordintToTheNumberOfDays: number = dayNumber * theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth + angleCorrection;

    return (
        <div className="moon_wrapper" style={{transform: `rotate(${theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}} >
            <img className="moon_picture" src={moonImg} alt="moon" style={{transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}}  />  
            <div className="moon_shadow" style={{transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays-50}deg)`}} >  </div>
        </div>
    )
}

export default Moon;
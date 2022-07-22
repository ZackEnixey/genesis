import { useContext, useEffect, useRef, useState } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import { dateToUtcStringCounterFromInitialDay } from "./helper";

const Moon = () => {
    const { simulationNumberOfDays, initialNewMoonDate, theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes, setTransitionTime, transitionTime } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const angleCorrection: number = 135;
    const [numberOfOrbits, setNumberOfOrbits] = useState<number>(0);
    // const theMoonShiftDeegreesAccordintToTheNumberOfDays: number = simulationNumberOfDays * theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes + angleCorrection;
    let currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays.value, initialNewMoonDate))
    let ordinalNumberInHebrewMonth: number = Number(new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric'}).format(currentGeorgianDate));
    const base = useRef(0)

    if (simulationNumberOfDays.direction === "increase" && ordinalNumberInHebrewMonth === 1) {
        base.current = base.current + 360;
    }

    if (simulationNumberOfDays.direction === "decrease" && (ordinalNumberInHebrewMonth === 29 || ordinalNumberInHebrewMonth === 30)) {
        base.current = base.current - 360;
    }

    if(simulationNumberOfDays.shiftType === "month" && simulationNumberOfDays.direction === "increase") {
        base.current = base.current + 360;
    }  

    if(simulationNumberOfDays.shiftType === "month" && simulationNumberOfDays.direction === "decrease") {
        base.current = base.current - 360;
    } 

    if(simulationNumberOfDays.shiftType === "year" && simulationNumberOfDays.direction === "increase") {
        base.current = base.current + 360*12;
    }  

    if(simulationNumberOfDays.shiftType === "year" && simulationNumberOfDays.direction === "decrease") {
        base.current = base.current - 360*12;
    }  

    const moonAngleTowardsTheEarthDic: any= {
        1: 0,
        2: 12,
        3: 24,
        4: 37,
        5: 49,
        6: 61,
        7: 73,
        8: 85,
        9: 98,
        10: 110,
        11: 122,
        12: 134,
        13: 146,
        14: 158,
        15: 180,
        16: 195,
        17: 207,
        18: 219,
        19: 231,
        20: 244,
        21: 256,
        22: 268,
        23: 280,
        24: 293,
        25: 305,
        26: 317,
        27: 329,
        28: 341,
        29: 353,
        30: 357
    }

    if (moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] === 1 || moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] === 30) setTransitionTime("0s");

    const theMoonShiftDeegreesAccordintToTheNumberOfDays: number = - base.current - moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] + angleCorrection;
    console.log(theMoonShiftDeegreesAccordintToTheNumberOfDays);

    const moonWrapperDimenstionDic = {
        "BIG": "moon_wrapper moon_wrapper_size_big",
        "MEDIUM": "moon_wrapper moon_wrapper_size_big",
        "SMALL": "moon_wrapper moon_wrapper_size_small"
    }

    return (
        <div className={moonWrapperDimenstionDic[isHorizontal]} style={{transition: transitionTime, transform: `rotate(${theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}} >
            <img className="moon_picture" src={moonImg} alt="moon" style={{transition: transitionTime, transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}}  />  
            <img className="moon_picture" src={moonImg} alt="moon" style={{transition: transitionTime, transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays}deg)`}}  />  
            <div className="moon_shadow" style={{transition: transitionTime, transform: `rotate(${-theMoonShiftDeegreesAccordintToTheNumberOfDays-30}deg)`}} >  </div>
        </div>
    )
}

export default Moon;
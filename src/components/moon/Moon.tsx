import { useContext, useRef } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import { dateToUtcStringCounterFromInitialDay } from "./helper";

const Moon = () => {
    const { initialNewMoonDate, simulationNumberOfDays, transitionTime } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const angleCorrection: number = 135;

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

    if (moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] === 1 || moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] === 30) {
        alert("stop")
    }

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




/*

import { useContext, useRef } from "react";
import moonImg from "../../assets/moonImg.png";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import { dateToUtcStringCounterFromInitialDay } from "./helper";
import checkIsLeapYear from "../calendarVisualisation/checkIsLeapYear";

const Moon = () => {
    const { initialNewMoonDate, simulationNumberOfDays, transitionTime } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const angleCorrection: number = 135;
    let sumMonths: number = 0;

    const initialHebrewYear: number = Number(new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(initialNewMoonDate));
    const currentGregorianDate = dateToUtcStringCounterFromInitialDay(simulationNumberOfDays.value, initialNewMoonDate);
    const currentHebrewYear: number = Number(new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date(currentGregorianDate)));
    const numberOfYearsSinceInitialDate: number = currentHebrewYear - initialHebrewYear;
    const nomberOf19YearCiclus: number = Math.floor(numberOfYearsSinceInitialDate/19);
    const remainingYears: number = numberOfYearsSinceInitialDate - nomberOf19YearCiclus*19;

    const sumOfMonthsTillCertainYearInTheCycleDic: any= {
        1: 12,
        2: 24,
        3: 37,
        4: 49,
        5: 61,
        6: 74,
        7: 86,
        8: 99,
        9: 111,
        10: 123,
        11: 136,
        12: 148,
        13: 160,
        14: 173,
        15: 185,
        16: 197,
        17: 210,
        18: 222,
        19: 235
    }

    const lessThan19years = (): number => {
        const numberOfLeapYearsIn19years: number = 7;
        const numberOfMonthsInRegularYear: number = 12;
        const numberOfMonthsInLeapYear: number = 13;
        const numberofMonths: number = (nomberOf19YearCiclus*19-numberOfLeapYearsIn19years)*numberOfMonthsInRegularYear + numberOfLeapYearsIn19years*19*numberOfMonthsInLeapYear;
        return sumOfMonthsTillCertainYearInTheCycleDic[remainingYears] + numberofMonths;
    }

    if (numberOfYearsSinceInitialDate <= 19) sumMonths = sumOfMonthsTillCertainYearInTheCycleDic[remainingYears];
    if (numberOfYearsSinceInitialDate > 19) sumMonths = lessThan19years();

    const hebrewMonthsToNumbersDic: any = {
        "תשרי": 1,  //12
        "חשוון": 2,
        "כסלו": 3,
        "טבת": 4,
        "שבט": 5,
        "אדר": 6,
        "ניסן": 7,
        "אייר": 8,
        "סיוון": 9,
        "תמוז": 10,
        "אב": 11,
        "אלול": 12,
    }

    const leapYearhebrewMonthsToNumbersDic: any = {
        "תשרי": 1,  //12
        "חשוון": 2,
        "כסלו": 3,
        "טבת": 4,
        "שבט": 5,
        "אדר": 6,
        "אדר א׳": 6,
        "אדר ב׳": 7,
        "ניסן": 8,
        "אייר": 9,
        "סיוון": 10,
        "תמוז": 11,
        "אב": 12,
        "אלול": 13,
    }

    const hebrewMonthNumberDic = ()  => {
        if (checkIsLeapYear(simulationNumberOfDays.value, initialNewMoonDate)) 
            return leapYearhebrewMonthsToNumbersDic[currentHebrewMonthNumber];
        return hebrewMonthsToNumbersDic[currentHebrewMonthNumber];
    }

    const currentHebrewMonthNumber: string = new Intl.DateTimeFormat('he-u-ca-hebrew', {month:'numeric'}).format(new Date(currentGregorianDate));
    sumMonths += sumMonths + hebrewMonthNumberDic();

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

    let currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays.value, initialNewMoonDate))
    let ordinalNumberInHebrewMonth: number = Number(new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric'}).format(currentGeorgianDate));
    const base = useRef(0);

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

    const theMoonShift: number = - sumMonths*360 - moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth] + angleCorrection;
    console.log(moonAngleTowardsTheEarthDic[ordinalNumberInHebrewMonth], sumMonths, theMoonShift);

    const moonWrapperDimenstionDic = {
        "BIG": "moon_wrapper moon_wrapper_size_big",
        "MEDIUM": "moon_wrapper moon_wrapper_size_big",
        "SMALL": "moon_wrapper moon_wrapper_size_small"
    }

    return (
        <div className={moonWrapperDimenstionDic[isHorizontal]} style={{transition: transitionTime, transform: `rotate(${theMoonShift}deg)`}} >
            <img className="moon_picture" src={moonImg} alt="moon" style={{transition: transitionTime, transform: `rotate(${-theMoonShift}deg)`}}  />  
            <img className="moon_picture" src={moonImg} alt="moon" style={{transition: transitionTime, transform: `rotate(${-theMoonShift}deg)`}}  />  
            <div className="moon_shadow" style={{transition: transitionTime, transform: `rotate(${-theMoonShift-30}deg)`}} >  </div>
        </div>
    )
}

export default Moon;

*/
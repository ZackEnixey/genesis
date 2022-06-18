import React, { FC, createContext, useState } from "react";

interface ICoordinates {
    x: number,
    y: number
}

interface IBoardContext {
    dayNumber: number;

    setDayNumber(dayNumber: number): void;
    coordinates: ICoordinates;
    setCoordinates(coordinates: ICoordinates): void;
    earthAngleToSun: number, 
    setEarthAngleToSun(earthAngleToSun: number): void;

    language: string; 
    setLanguage(Language: string): void;

    earthTrajectoryWidth: number; 
    setEarthTrajectoryWidth(earthTrajectoryWidth: number): void;
    earthTrajectoryHeight: number; 
    setEarthTrajectoryHeight(earthTrajectoryHeight: number): void;

    initialNewMoonDate: Date;

    sideralPeriodNumberOfDays: number;
    synodicPeriodNumberOfDays: number;

    theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun: number;
    theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth: number;
    theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes: number;

    selectedDateFromDatePicker: Date; 
    setSelectedDateFromDatePicker(selectedDateFromDatePicker: Date): void;

    numberOfDaysBetweenTwoDates: number;
    setNumberOfDaysBetweenTwoDates(numberOfDaysBetweenTwoDates: number): void;
};

const BoardContext = createContext({} as IBoardContext);

interface BoardContextProps {
    children: React.ReactNode;
};

const BoardContextProvider: FC<BoardContextProps> = (props) => {
    const [dayNumber, setDayNumber] = useState<number>(0);

    const [coordinates, setCoordinates] = useState<ICoordinates>({ x: 0, y:0 });
    const [earthAngleToSun, setEarthAngleToSun] = useState<number>(360);
    
    const [language, setLanguage] = useState<string>("en");
    
    const [earthTrajectoryWidth, setEarthTrajectoryWidth] = useState<number>(60);
    const [earthTrajectoryHeight, setEarthTrajectoryHeight] = useState<number>(60);

    const initialNewMoonDate: Date = new Date("June 29, 2022 04:52:00");

    const sideralPeriodNumberOfDays: number = 27.3215278
    const synodicPeriodNumberOfDays: number = 29.53058770576;

    // Degrees per Day
    const theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun: number = 0.98562628336;  // 360 degrees / 365.25 days
    const theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth: number = 13.1764227;    // 360 degrees / 27days 7 hours 43min = 360 degrees / 27.3215278 days
    const theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes: number = 12.1907495911; // 360 degrees / 29.53058770576 days
    
    const [selectedDateFromDatePicker, setSelectedDateFromDatePicker] = useState<Date>(new Date());
    const [numberOfDaysBetweenTwoDates, setNumberOfDaysBetweenTwoDates] = useState<number>(0);
    
    const providerValue = {
        dayNumber,
        setDayNumber,
        coordinates, 
        setCoordinates,
        earthAngleToSun, 
        setEarthAngleToSun,
        language, 
        setLanguage,
        earthTrajectoryWidth,
        setEarthTrajectoryWidth,
        earthTrajectoryHeight,
        setEarthTrajectoryHeight,
        initialNewMoonDate,
        sideralPeriodNumberOfDays,
        synodicPeriodNumberOfDays,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun,
        theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth,
        theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes,
        selectedDateFromDatePicker, 
        setSelectedDateFromDatePicker,
        numberOfDaysBetweenTwoDates,
        setNumberOfDaysBetweenTwoDates
    };

    return (
        <BoardContext.Provider value={providerValue}>
            {props.children}
        </BoardContext.Provider>
    );
};

export { BoardContext, BoardContextProvider };
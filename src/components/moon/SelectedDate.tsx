import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../context";

const SelectedDate = () => {
    const { 
        simulationNumberOfDays, 
        initialNewMoonDate, 
        selectedDateFromDatePicker,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun,
        isGeorgianCallendar
    } = useContext(BoardContext);
    const [currentDate, setCurrentDate] = useState<string>("Wed, 13 July 2022 07:15:00 GMT");
    const [currentHebrewDate, setCurrentHebrewDate] = useState<string>("Tue Feb 11 2020 20:47:28 GMT+0100 (Central European Standard Time)");

    useEffect( () => {
        addDaysToInitialDate(simulationNumberOfDays)
    }, [simulationNumberOfDays])

    useEffect( () => {
        updateOnTimePickedFromDatePicker();
        calculateNumberOfDaysBetweenTwoDates();
    }, [selectedDateFromDatePicker]);

    const updateOnTimePickedFromDatePicker = () => {
        
        setCurrentDate(dateToUtcString());
    }

    const addDaysToInitialDate = (additionalDays: number) => {
        setCurrentDate( dateToUtcStringCounterFromInitialDay(additionalDays) );
    }

    const dateToUtcString = () : string => {
        let hebrewDate: string = new Intl.DateTimeFormat('he-u-ca-hebrew',{weekday: 'long', year:'numeric', month:'numeric', day:'numeric'}).format(selectedDateFromDatePicker)
        var result = new Date(selectedDateFromDatePicker);
        let georgianDate: any = result.setDate(result.getDate());
        console.log({hebrewDate, result}, typeof georgianDate);
        return georgianDate;
    }

    const dateToUtcStringCounterFromInitialDay = (additionalDays: number) : string => {
        var result = new Date(initialNewMoonDate);
        result.setDate(result.getDate() + Math.abs(additionalDays));
        return result.toUTCString()
    }

    const calculateNumberOfDaysBetweenTwoDates = () => {
        const date1: Date = new Date(initialNewMoonDate);
        const date2: Date = new Date(selectedDateFromDatePicker);

        const difference = date1.getTime() - date2.getTime();

        var numberOfDaysBetweenTwoDates = Math.ceil(difference / (1000 * 3600 * 24)) - 1;
        setSimulationNumberOfDays(numberOfDaysBetweenTwoDates);
        setEarthAngleToSun(numberOfDaysBetweenTwoDates*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    console.log("**  ", selectedDateFromDatePicker);
    console.log("--  ", new Intl.DateTimeFormat('en-u-ca-hebrew',{dateStyle:"full"}).format(selectedDateFromDatePicker));
    console.log("&&  ", new Intl.DateTimeFormat('he-u-ca-hebrew',{weekday: 'long', year:'numeric', month:'numeric', day:'numeric'}).format(selectedDateFromDatePicker));

    const georginaDate = () => {
        return <div className="current_date"> {currentDate} </div>;
    }

    const hebrewDate = () => {
        return <div className="current_date">  as fasdf asd{currentDate} </div>;
    }

    return isGeorgianCallendar ? georginaDate() : hebrewDate();
} 

export default SelectedDate;
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../context";
import { convertGeorginaDateToHebrewDate, dateToUtcStringCounterFromInitialDay, getNumberOfDaysBetweenTwoDates } from "./helper/index";

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
    const [currentHebrewDate, setCurrentHebrewDate] = useState<string>("Wed, 13 July 2022 07:15:00 GMT");

    useEffect( () => {
        addDaysToInitialDate();
    }, [simulationNumberOfDays]);

    const addDaysToInitialDate = () => {
        setCurrentDate( dateToUtcStringCounterFromInitialDay(simulationNumberOfDays, initialNewMoonDate) );
        let currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays, initialNewMoonDate));
        setCurrentHebrewDate( convertGeorginaDateToHebrewDate(currentGeorgianDate) );
    }

    useEffect( () => {
        updateTimePickedFromDatePicker();
        setValuesAccordingToDate();
    }, [selectedDateFromDatePicker]);

    const updateTimePickedFromDatePicker = () => {
        setCurrentDate(dateToUtcString());
    }

    const dateToUtcString = () : string => {
        var result = new Date(selectedDateFromDatePicker);
        let georgianDate: any = result.setDate(result.getDate());
        return georgianDate;
    }

    const setValuesAccordingToDate = () => {
        setSimulationNumberOfDays(getNumberOfDaysBetweenTwoDates(initialNewMoonDate, selectedDateFromDatePicker));
        setEarthAngleToSun(getNumberOfDaysBetweenTwoDates(initialNewMoonDate, selectedDateFromDatePicker)*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    const formatedDate = () => {
        const theDate = new Date(currentDate);
        return theDate.toDateString();
    }


    const georginaDate = () => {
        return <div className="current_date"> {formatedDate()} </div>;
    }

    const hebrewDate = () => {
        return <div className="current_date_hebrew"> {currentHebrewDate} </div>;
    }


    return (
        <div>
            {hebrewDate()}
            {georginaDate()}
        </div>
    )
} 

export default SelectedDate;
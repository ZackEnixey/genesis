import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import { convertGeorginaDateToHebrewDate, dateToUtcStringCounterFromInitialDay, getNumberOfDaysBetweenTwoDates } from "./helper/index";

const SelectedDate = () => {
    const { 
        simulationNumberOfDays, 
        initialNewMoonDate, 
        selectedDateFromDatePicker,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun,
    } = useContext(BoardContext);
    const [currentDate, setCurrentDate] = useState<string>("Wed, 13 July 2022 07:15:00 GMT");
    const [currentHebrewDate, setCurrentHebrewDate] = useState<string>("Wed, 13 July 2022 07:15:00 GMT");

    useEffect( () => {
        addDaysToInitialDate();
    }, [simulationNumberOfDays]);

    const addDaysToInitialDate = () => {
        setCurrentDate( dateToUtcStringCounterFromInitialDay(simulationNumberOfDays.value, initialNewMoonDate) );
        let currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays.value, initialNewMoonDate));
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
        setSimulationNumberOfDays({value: getNumberOfDaysBetweenTwoDates(initialNewMoonDate, selectedDateFromDatePicker), direction: "increase", shiftType: "day"});
        setEarthAngleToSun(getNumberOfDaysBetweenTwoDates(initialNewMoonDate, selectedDateFromDatePicker)*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    const formatedDate = () => {
        const theDate = new Date(currentDate);
        return theDate.toDateString().split(' ').slice(1).join(' ');
    }

    const georginaDate = () => {
        return <div className="current_date"> {formatedDate()} </div>;
    }

    const hebrewDate = () => {
        return <div className="current_date_hebrew"> {currentHebrewDate} </div>;
    }


    return (
        <div className="selected_date_wrapper">
            {georginaDate()}
            {hebrewDate()}
        </div>
    )
} 

export default SelectedDate;
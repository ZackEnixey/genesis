import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../context";

const SelectedDate = () => {
    const { 
        simulationNumberOfDays, 
        initialNewMoonDate, 
        selectedDateFromDatePicker,
        setSimulationNumberOfDays,
        setEarthAngleToSun,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun
    } = useContext(BoardContext);
    const [currentDate, setCurrentDate] = useState<string>("Mon, 11 March 2022 07:15:00 GMT");

    useEffect( () => {
        addDaysToInitialDate(simulationNumberOfDays.value)
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
        var result = new Date(selectedDateFromDatePicker);
        result.setDate(result.getDate());
        return result.toUTCString()
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
        setSimulationNumberOfDays({value: numberOfDaysBetweenTwoDates, direction: "increase", shiftType: "day"});
        setEarthAngleToSun(numberOfDaysBetweenTwoDates*theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun);
    }

    return <div className="current_date"> {currentDate} </div>
} 

export default SelectedDate;
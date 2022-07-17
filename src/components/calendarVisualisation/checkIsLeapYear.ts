import { dateToUtcStringCounterFromInitialDay } from "../moon/helper";

const checkIsLeapYear = (simulationNumberOfDays: number, initialNewMoonDate: Date) => {

    const currentGeorgianDate = new Date(dateToUtcStringCounterFromInitialDay(simulationNumberOfDays+65, initialNewMoonDate));
    const georgianFullYear: number = currentGeorgianDate.getFullYear();
    const hebrewFullYearStr: string = new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date(georgianFullYear.toString()));
    const hebrewFullYearNum: number = Number(hebrewFullYearStr);
    const remainderFullYear: number = hebrewFullYearNum % 19;
    const numberOfLeapYearsSince1940: number = Math.floor( Math.abs(5700 - hebrewFullYearNum) / 19) * 7;

    if ( remainderFullYear === 2 ) 
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940}

        if ( remainderFullYear === 3 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+1}
    
    if ( remainderFullYear === 4 )
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+1}

    if ( remainderFullYear === 5 )
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+1}
        
        if ( remainderFullYear === 6 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+2}
    
    if ( remainderFullYear === 7 )
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+2}

        if ( remainderFullYear === 8 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+3}

    if ( remainderFullYear === 9 )
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+3}

    if ( remainderFullYear === 10 )
        return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+3}

        if ( remainderFullYear === 11 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+4}
        
    if ( remainderFullYear === 12 )
        return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+4}

    if ( remainderFullYear === 13 )
        return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+4}
        
        if ( remainderFullYear === 14 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+5}
            
    if ( remainderFullYear === 15 )
        return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+5}

    if ( remainderFullYear === 16 )
        return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+5}

        if ( remainderFullYear === 17 )
            return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+6}

    if ( remainderFullYear === 18 )
        return {isLeap: true, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940+6}
            
    return {isLeap: false, numberOfLeapYearsSince1940: numberOfLeapYearsSince1940}
}

export default checkIsLeapYear;
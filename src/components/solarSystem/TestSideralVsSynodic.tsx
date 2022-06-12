import { useContext } from "react";
import { BoardContext } from "../../context";

const TestSideralVsSynodic = () => {
    const { 
        sideralPeriodNumberOfDays, 
        synodicPeriodNumberOfDays, 
        theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth,
        theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes 
    } = useContext(BoardContext);
    const days: number[] = Array.from(Array(600).keys());

    const sideral = (day: number) => {
        const value: number = (theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth*day)%360;
        const isNewMoonCondition: boolean = value >= (360-theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth) && value < (360+theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth);
        if (isNewMoonCondition)
            return <div style={{width: "200px", color: "red"}}>{theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth*day}</div>;
        return <div style={{width: "200px"}}>{theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth*day}</div>;
    }

    const synodic = (day: number) => {
        const value: number = (theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes*day)%360;
        const isNewMoonCondition: boolean = value >= (360-theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes) && value < (360+theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes);
        if (isNewMoonCondition)
            return <div style={{width: "200px", color: "red"}}>{theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes*day}</div>;
        return <div style={{width: "200px"}}>{theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes*day}</div>;
    }

    return (
        <div className="" style={{overflow: "scroll", position: "absolute", right: 10, top: 0, textAlign: "left", color: "white", height: "800px", width: "500px"}}>
            
            ............. sideral: {sideralPeriodNumberOfDays} ............... synodic: {synodicPeriodNumberOfDays}
            {days.map( (day: number) => {
                return (
                    <div key={day} style={{ display: "flex", color: `${day%2 ? "white" : "yellow"}` }}>
                        <div style={{width: "50px"}}>{day}</div> 
                        {sideral(day)} 
                        {synodic(day)}
                        <br></br>
                    </div>
                )
            })}
        </div>
    )

}

export default TestSideralVsSynodic;
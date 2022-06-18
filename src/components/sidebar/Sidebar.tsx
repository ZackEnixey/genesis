import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext, TestContext } from "../../context";
import AdjustEarthToSunAngle from "./AdjustEarthToSunAngle";
import DatePickerComponent from "./datePicker/DatePickerComponent";

const Sidebar = () => {
    const {
        dayNumber,
        earthTrajectoryWidth, 
        setEarthTrajectoryWidth, 
        earthTrajectoryHeight, 
        setEarthTrajectoryHeight,
        sideralPeriodNumberOfDays,
        synodicPeriodNumberOfDays,
        theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun,
        theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth,
        theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes
    } = useContext(BoardContext);
    const { isTestMode } = useContext(TestContext);
    const { t } = useTranslation();

    const theMoonShiftDeegreesAccordintToTheNumberOfDays: number = dayNumber * theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth

    return (
        <div className="sidebar_wrapper">
            <div style={{position: "absolute"}}> 

                <AdjustEarthToSunAngle />

                <DatePickerComponent />
                
                {isTestMode && <div>
                    {`===========================`}
                    
                    <div style={{width: "300px"}}>
                        {t("setTheWidthOfEarthTrajectory")}: 
                        <input 
                            id="typeinp" 
                            type="range" 
                            min="20" max="70" 
                            value={earthTrajectoryWidth} 
                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {setEarthTrajectoryWidth(parseInt(event.target.value))}} 
                            step="1"
                        />
                        {earthTrajectoryWidth} vh
                    </div>
                    
                    <div style={{width: "300px"}}>
                        {t("setTheHeightOfEarthTrajectory")}: 
                        <input 
                            id="typeinp" 
                            type="range" 
                            min="20" max="70" 
                            value={earthTrajectoryHeight} 
                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {setEarthTrajectoryHeight(parseInt(event.target.value))}} 
                            step="1"
                        />
                        {earthTrajectoryHeight} vh
                    </div>
                    <p> The Earth moves each day for: {theNumberOfDegreesTheEarthMovesEachDayComparedToTheSun} degrees</p> 
                    
                    <div>
                        <b> SIDERAL PERIOD: </b> 
                        <div> The time that takes for the Moon to rotate 360 degrees: <b>{sideralPeriodNumberOfDays}</b> days</div>
                        <div> The Moon moves each day for: <b>{theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth}</b> degrees</div> 
                        <div> Current SIDERAL Moon-to-Earth angle: <b>{theMoonShiftDeegreesAccordintToTheNumberOfDays}</b> </div>
                    </div> 

                    <p> sideral circle: {Math.abs(dayNumber*theNumberOfDegreesTheMoonMovesEachDayComparedToTheEarth)} </p>
                    <p> synodic circle: {Math.abs(dayNumber*theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes)} </p>
                    
                    <div>
                        <b> SYNODIC PERIOD: </b> 
                        <div> The time that takes for the Moon to come to the sam phase: <b>{synodicPeriodNumberOfDays}</b> days</div> 
                        <div> The angle that the Moon moves each day according to our eyes watching from the Earth: <b>{theNumberOfDegreesTheMoonMovesEachDayAccordingToOurEyes}</b> degrees </div>
                        <div> Current SYNODIC Moon-Shadow angle: <b>{theMoonShiftDeegreesAccordintToTheNumberOfDays}</b> </div>
                    </div> 
                </div>}
                
            </div>
        </div>
    )
}

export default Sidebar;
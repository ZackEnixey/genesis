import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, CalendarVisualisation, PopUpSidebar } from "../";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import AdjustEarthToSunAngle from "../sidebar/AdjustEarthToSunAngle";
import Virtual from "../virtual/Virtual";

const Board = () => {
    const { toggleSidebar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();

    const sidebarWrapperStyleDic = {
        "BIG": "",
        "MEDIUM": "solar_system_medium_position",
        "SMALL": "solar_system_small_position"
    }

    if (window.location.href.includes("virtual")) {
        return (
            <div className="virtual">
                <Virtual />
            </div>
        )
    }

    if (isHorizontal === PositionEnum.SMALL) 
        return (
            <div className="board_wrapper">  
                <div className="purple_filter"></div>
                <div className={`solar_system_and_calendar_wrapper_small ${sidebarWrapperStyleDic[isHorizontal]} `}>
                    <CalendarVisualisation />
                    <SolarSystem />
                </div>
                <Language />
                <PopUpSidebar />
                <MoonPhases />
                <AdjustEarthToSunAngle />         
                {toggleSidebar && <Sidebar />}
            </div>
        )

    if (isHorizontal === PositionEnum.MEDIUM) 
        return (
            <div className="board_wrapper">  
                <div className="purple_filter"></div>
                <div className={`solar_system_and_calendar_wrapper ${sidebarWrapperStyleDic[isHorizontal]} `}>
                    <CalendarVisualisation />
                    <SolarSystem />
                </div>
                <Language />
                <PopUpSidebar />
                <MoonPhases />
                <AdjustEarthToSunAngle />         
                {toggleSidebar && <Sidebar />}
            </div>
        )

    return (
        <div className="board_wrapper">  
            <div className="purple_filter"></div>
            <div className={`solar_system_and_calendar_wrapper ${sidebarWrapperStyleDic[isHorizontal]} `}>
                <CalendarVisualisation />
                <SolarSystem />
            </div>
            <Language />
            <Sidebar />
            <MoonPhases />
            <AdjustEarthToSunAngle />         
        </div>
    )
}

export default Board;
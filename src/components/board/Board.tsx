import { useContext, useState } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, CalendarVisualisation, PopUpSidebar } from "../";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import AdjustEarthToSunAngle from "../sidebar/AdjustEarthToSunAngle";
import DVS from "../virtual/DVS";
import Infinite from "../virtual/Infinite";
import Virtual from "../virtual/Virtual";
import VirtualTiny from "../virtual/VirtualTiny";

const Board = () => {
    const { toggleSidebar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const virtual = true

    const sidebarWrapperStyleDic = {
        "BIG": "",
        "MEDIUM": "solar_system_medium_position",
        "SMALL": "solar_system_small_position"
    }

    if (false) {
        return (
            <div className="virtual">
                <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}}> virtual</button>
                    <Virtual />
                    <Infinite />
                    <DVS />
                    <VirtualTiny />
            </div>
        )
    }

    if (isHorizontal === PositionEnum.SMALL) 
        return (
            <div className="board_wrapper">  
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}}> virtual</button>
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
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}}> virtual</button>
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
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}}> virtual</button>
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
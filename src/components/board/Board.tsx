import { SolarSystem, Sidebar, MoonPhases, Language, DownloadPDF, CalendarVisualisation } from "../";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import AdjustEarthToSunAngle from "../sidebar/AdjustEarthToSunAngle";

const Board = () => {
    const isHorizontal = useUiUxPosition();

    const sidebarWrapperStyleDic = {
        "BIG": "sidebar_wrapper_big",
        "MEDIUM": "sidebar_wrapper_medium",
        "SMALL": "sidebar_wrapper_small"
    }

    return (
        <div className="board_wrapper">  
            <div className="purple_filter"></div>
            <div className="solar_system_and_calendar_wrapper">
                <CalendarVisualisation />
                <SolarSystem />
            </div>
            <Language />
            <Sidebar />
            <MoonPhases />
            <DownloadPDF />
            <AdjustEarthToSunAngle />         
        </div>
    )
}

export default Board;
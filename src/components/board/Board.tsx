import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, DownloadPDF, CalendarVisualisation } from "../";
import { BoardContext, TestContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import ScreenPositioning from "./ScreenPositioning";

const Board = () => {
    const { isGeorgianCallendar, setIsGeorgianCallendar } = useContext(BoardContext);
    const { isTestMode, setIsTestMode } = useContext(TestContext);
    const isHorizontal = useUiUxPosition();
    const solarSystemPositionStyle: any = isHorizontal ? {position: "relative"} : {position: "absolute", top: 0};
    const textModeText: string = isTestMode ? "hide test mode" : "show test mode";

    return (
        <div className="board_wrapper">       
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}} onClick={() => setIsTestMode(!isTestMode)}> {textModeText} </button>      
            <div style={solarSystemPositionStyle}>
                <CalendarVisualisation />
                <SolarSystem />
            </div>
            <Sidebar />
            <Language />
            <MoonPhases />
            <DownloadPDF />
            <ScreenPositioning />
        </div>
    )
}

export default Board;
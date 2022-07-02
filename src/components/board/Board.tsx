import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, DownloadPDF, CalendarVisualisation } from "../";
import { BoardContext, TestContext } from "../../context";

const Board = () => {
    const { isGeorgianCallendar, setIsGeorgianCallendar } = useContext(BoardContext);
    const { isTestMode, setIsTestMode } = useContext(TestContext);
    const textModeText: string = isTestMode ? "hide test mode" : "show test mode";

    return (
        <div className="board_wrapper">       
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}} onClick={() => setIsTestMode(!isTestMode)}> {textModeText} </button>      
            <CalendarVisualisation />
            <SolarSystem />
            <Sidebar />
            <Language />
            <MoonPhases />
            <DownloadPDF />
        </div>
    )
}

export default Board;
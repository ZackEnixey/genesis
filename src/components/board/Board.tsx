import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, DownloadPDF, CalendarVisualisation } from "../";
import { BoardContext, TestContext } from "../../context";
import TestSideralVsSynodic from "../solarSystem/TestSideralVsSynodic";

const Board = () => {
    const { isGeorgianCallendar, setIsGeorgianCallendar } = useContext(BoardContext);
    const { isTestMode, setIsTestMode } = useContext(TestContext);
    const textModeText: string = isTestMode ? "hide test mode" : "show test mode";
    const georgianOrHebrewCallendarText: string = isGeorgianCallendar ? "Show Hebrew Callendar" : "Show Georgian Callendar";

    return (
        <div className="board_wrapper">       
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}} onClick={() => setIsTestMode(!isTestMode)}> {textModeText} </button>      
            <button style={{position: "absolute", top: "20px", left: 0, zIndex: 2}} onClick={() => setIsGeorgianCallendar(!isGeorgianCallendar)}> {georgianOrHebrewCallendarText} </button>      
            <CalendarVisualisation />
            <SolarSystem />
            <Sidebar />
            <TestSideralVsSynodic />
            <Language />
            <MoonPhases />
            <DownloadPDF />
        </div>
    )
}

export default Board;
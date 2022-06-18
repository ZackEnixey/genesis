import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language } from "../";
import { TestContext } from "../../context";
import TestSideralVsSynodic from "../solarSystem/TestSideralVsSynodic";

const Board = () => {
    const { isTestMode, setIsTestMode } = useContext(TestContext);
    const textModeText: string = isTestMode ? "hide test mode" : "show test mode";

    return (
        <div className="board_wrapper">       
            <button style={{position: "absolute", top: 0, left: 0, zIndex: 2}} onClick={() => setIsTestMode(!isTestMode)}> {textModeText} </button>      
            <SolarSystem />
            <Sidebar />
            <TestSideralVsSynodic />
            <Language />
            <MoonPhases />
        </div>
    )
}

export default Board;
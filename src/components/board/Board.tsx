import { SolarSystem, Sidebar, Language, MoonPhases } from "../";
import TestSideralVsSynodic from "../solarSystem/TestSideralVsSynodic";

const Board = () => {

    return (
        <div className="board_wrapper"> 
            
            <SolarSystem />
            <Sidebar />
            {/* <TestSideralVsSynodic /> */}
            <Language />
            <MoonPhases />
        </div>
    )
}

export default Board;
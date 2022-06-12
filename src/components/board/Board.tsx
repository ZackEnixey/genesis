import { SolarSystem, Sidebar, Language, MoonPhases } from "../";

const Board = () => {

    return (
        <div className="board_wrapper"> 
            <SolarSystem />
            <Sidebar />
            <Language />
            <MoonPhases />
        </div>
    )
}

export default Board;
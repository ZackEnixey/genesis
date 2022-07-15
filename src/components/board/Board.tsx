import { useContext } from "react";
import { SolarSystem, Sidebar, MoonPhases, Language, DownloadPDF, CalendarVisualisation } from "../";
import { BoardContext, TestContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";
import ScreenPositioning from "./ScreenPositioning";

const Board = () => {
    const { isGeorgianCallendar, setIsGeorgianCallendar } = useContext(BoardContext);
    const isHorizontal = useUiUxPosition();
    const solarSystemPositionStyle: any = isHorizontal ? {position: "relative"} : {position: "absolute", top: 0};

    return (
        <div className="board_wrapper">           
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
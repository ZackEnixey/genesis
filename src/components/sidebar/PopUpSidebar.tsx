import { useContext } from "react";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const PopUpSidebar = () => {
    const isHorizontal = useUiUxPosition();
    const {setToggleSidebar} = useContext(BoardContext);
    const enterYourDateText: string = "Enter your date";
    const enterYourDateTextSmall: string = "Date";

    if (isHorizontal === PositionEnum.SMALL)
        return (
            <div className="popup_sidebar_wrapper width_small" onClick={() => setToggleSidebar(true)}>
                {enterYourDateTextSmall}
            </div>
        )

    return (
        <div className="popup_sidebar_wrapper width_big" onClick={() => setToggleSidebar(true)}>
           {enterYourDateText}
        </div>
    )
}

export default PopUpSidebar;

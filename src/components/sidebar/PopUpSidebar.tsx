import { useContext } from "react";
import { BoardContext } from "../../context";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const PopUpSidebar = () => {
    const isHorizontal = useUiUxPosition();
    const {setToggleSidebar} = useContext(BoardContext);

    const buttonPositionDic = {
        "BIG": "popup_sidebar_wrapper",
        "MEDIUM": "popup_sidebar_wrapper",
        "SMALL": "popup_sidebar_wrapper_small"
    }

    return (
        <div className={buttonPositionDic[isHorizontal]} onClick={() => setToggleSidebar(true)}>
            enter your date
        </div>
    )
}

export default PopUpSidebar;

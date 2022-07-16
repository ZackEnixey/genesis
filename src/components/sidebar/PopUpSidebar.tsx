import { useContext } from "react";
import { BoardContext } from "../../context";

const PopUpSidebar = () => {
    const {setToggleSidebar} = useContext(BoardContext);

    return (
        <div className="popup_sidebar_wrapper" onClick={() => setToggleSidebar(true)}>
            enter your date
        </div>
    )
}

export default PopUpSidebar;

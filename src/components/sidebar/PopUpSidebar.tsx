import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BoardContext } from "../../context";
import { PositionEnum } from "../../types";
import useUiUxPosition from "../customHooks/useUiUxPosition";

const PopUpSidebar = () => {
    const isHorizontal = useUiUxPosition();
    const {setToggleSidebar} = useContext(BoardContext);
    const { t } = useTranslation();

    if (isHorizontal === PositionEnum.SMALL)
        return (
            <div className="popup_sidebar_wrapper width_small" onClick={() => setToggleSidebar(true)}>
                {t("enterYourDateText")}
            </div>
        )

    return (
        <div className="popup_sidebar_wrapper width_big" onClick={() => setToggleSidebar(true)}>
           {t("dateText")}
        </div>
    )
}

export default PopUpSidebar;

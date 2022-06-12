import { useContext } from "react";
import { BoardContext } from "../../context";
import text from "./checkLanguageInput";

import america from "../../assets/flags/america.png";
import france from "../../assets/flags/france.png";
import israel from "../../assets/flags/israel.png";
import serbia from "../../assets/flags/serbia.png";

import en from "../../languages/English.json";
import fr from "../../languages/French.json";
import he from "../../languages/Hebrew.json";
import sr from "../../languages/Serbian.json";

const Language = () => {
    const { language, setLanguage } = useContext(BoardContext);

    return (
        <div className="language_wrapper"> 
            <div> {text("selectTheLannguageYouLike", language)} </div>
            <div className="language_item" onClick={() => setLanguage("en")}>
                <img src={america} alt="english" className="language_flag" />
                En. {text("english", language)}
            </div>
            <div className="language_item" onClick={() => setLanguage("fr")}>
                <img src={france} alt="english" className="language_flag" />
                Fr. {text("french", language)}
            </div>
            <div className="language_item" onClick={() => setLanguage("he")}>
                <img src={israel} alt="english" className="language_flag" />
                He. {text("hebrew", language)}
            </div>
            <div className="language_item" onClick={() => setLanguage("sr")}>
                <img src={serbia} alt="english" className="language_flag" />
                Sr. {text("serbian", language)}
            </div>
        </div>
    )
}

export default Language;
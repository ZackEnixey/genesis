import { useState } from "react";
import { useTranslation } from "react-i18next";
import languages from "../../assets/languages.png";

import america from "../../assets/flags/america.png";
import france from "../../assets/flags/france.png";
import israel from "../../assets/flags/israel.png";
import serbia from "../../assets/flags/serbia.png";


const Language = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const { t, i18n } = useTranslation();

    const setLanguage = (selectedLanguageAbbrevation: string) => {
        i18n.changeLanguage(selectedLanguageAbbrevation);
    }

    if (!toggle)
        return <img onClick={() => setToggle(true)} className="language_button hover_effect" src={languages} alt="languages" />

    return (
        <div className="language_wrapper" > 
            <div className="cursor_pointer" onClick={() => setToggle(false)} > {t("closeText")} </div>
            <div> {t("selectTheLannguageYouLike")} </div>

            <div className="language_item" onClick={() => setLanguage("en")}>
                <img src={america} alt="english" className="language_flag" />
                En. {t("english")}
            </div>
            <div className="language_item" onClick={() => setLanguage("fr")}>
                <img src={france} alt="english" className="language_flag" />
                Fr. {t("french")}
            </div>
            <div className="language_item" onClick={() => setLanguage("he")}>
                <img src={israel} alt="english" className="language_flag" />
                He. {t("hebrew")}
            </div>
            <div className="language_item" onClick={() => setLanguage("sr")}>
                <img src={serbia} alt="english" className="language_flag" />
                Sr. {t("serbian")}
            </div>
        </div>
    )
}

export default Language;
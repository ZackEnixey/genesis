import { useRef } from "react";
import { Select } from 'antd';
import { useTranslation } from "react-i18next";

import america from "../../assets/flags/america.png";
import france from "../../assets/flags/france.png";
import israel from "../../assets/flags/israel.png";
import serbia from "../../assets/flags/serbia.png";
import useUiUxPosition from "../customHooks/useUiUxPosition";


const Language = () => {
    const { t, i18n } = useTranslation();
    const wrapperRef = useRef(null);
    const isHorizontal = useUiUxPosition();
    const { Option } = Select;

    const setLanguage = (selectedLanguageAbbrevation: string) => {
        i18n.changeLanguage(selectedLanguageAbbrevation);
    }


    const handleChange = (value: string) => {
        setLanguage(value);
        console.log(value);
    };

    const selectWidthDic = {
        "BIG": "200px",
        "MEDIUM": "200px",
        "SMALL": "85px",
    }
          
    return (
        <div ref={wrapperRef} className="language_wrapper" > 
            <Select defaultValue="en" style={{ width: selectWidthDic[isHorizontal] }} onChange={handleChange}>
                <Option value="en" label="en">
                    <img src={america} alt="english" className="language_flag" />
                    {t("english")}
                </Option>
                <Option value="fr" label="fr">
                    <img src={france} alt="english" className="language_flag" />
                    {t("french")}
                </Option>
                <Option value="he" label="he">
                    <img src={israel} alt="english" className="language_flag" />
                    {t("hebrew")}
                </Option>
                <Option value="sr" label="sr">
                    <img src={serbia} alt="english" className="language_flag" />
                    {t("serbian")}
                </Option>
            </Select>
        </div>
    )
}

export default Language;
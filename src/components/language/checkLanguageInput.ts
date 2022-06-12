import en from "../../languages/English.json";
import fr from "../../languages/French.json";
import he from "../../languages/Hebrew.json";
import sr from "../../languages/Serbian.json";

const text = (input: string, language: string) : string => {
    const languageDic: any = {
        "en": en,
        "fr": fr,
        "he": he,
        "sr": sr
    }
    let language_placeholder: any = languageDic[language];
    return language_placeholder[input] || "missing_text";
}

export default text;
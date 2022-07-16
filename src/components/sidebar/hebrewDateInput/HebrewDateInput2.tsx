import axios from "axios";
import { useContext } from "react";
import { 
    Button,
    Form,
    Input,
    Select,
   } from "antd";
import { BoardContext } from "../../../context";
import { useTranslation } from "react-i18next";
import useUiUxPosition from "../../customHooks/useUiUxPosition";

const HebrewDateInput2 = () => {
    const { setSelectedDateFromDatePicker, setToggleSidebar } = useContext(BoardContext); 
    const isHorizontal = useUiUxPosition();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    
    const convertDate = () => {
        setToggleSidebar(false)

        const yearNumber: string = form.getFieldValue("hebrewYear");
        const monthName: string = form.getFieldValue("hebrewMonth");
        const dayNumber: string = form.getFieldValue("hebrewDay");
        const hebrewToGregorianUrlLink: string = "https://www.hebcal.com/converter?cfg=json&hy="+yearNumber+"&hm="+monthName+"&hd="+dayNumber+"&h2g=1&strict=1";

        console.log(hebrewToGregorianUrlLink);

        axios.get(hebrewToGregorianUrlLink).then((response: any) => {
            let data = response.data;
            console.log(data);
            let gregorianDate = new Date(data.gy + " " + data.gm + " " + data.gd);
            console.log(gregorianDate);
            setSelectedDateFromDatePicker(gregorianDate);
          });

    }

    const enterDayNumber = () => {
        return (
            <Form.Item name="hebrewDay" label={<label style={{ color: "white" }}> {t("dayText")} </label>} >
                <Select>
                    <Select.Option value="1"> {t("1Text")} </Select.Option>
                    <Select.Option value="2"> {t("2Text")} </Select.Option>
                    <Select.Option value="3"> {t("3Text")} </Select.Option>
                    <Select.Option value="4"> {t("4Text")} </Select.Option>
                    <Select.Option value="5"> {t("5Text")}    </Select.Option>
                    <Select.Option value="6"> {t("6Text")}   </Select.Option>
                    <Select.Option value="7"> {t("7Text")} </Select.Option>
                    <Select.Option value="8"> {t("8Text")} </Select.Option>
                    <Select.Option value="9">  {t("9Text")}  </Select.Option>
                    <Select.Option value="10"> {t("10Text")}  </Select.Option>
                    <Select.Option value="11"> {t("11Text")} </Select.Option>
                    <Select.Option value="12"> {t("12Text")}  </Select.Option>
                    <Select.Option value="13"> {t("13Text")} </Select.Option>
                    <Select.Option value="14"> {t("14Text")} </Select.Option>
                    <Select.Option value="15"> {t("15Text")} </Select.Option>
                    <Select.Option value="16"> {t("16Text")} </Select.Option>
                    <Select.Option value="17"> {t("17Text")} </Select.Option>
                    <Select.Option value="18"> {t("18Text")} </Select.Option>
                    <Select.Option value="19"> {t("19Text")} </Select.Option>
                    <Select.Option value="20"> {t("20Text")} </Select.Option>
                    <Select.Option value="21"> {t("21Text")} </Select.Option>
                    <Select.Option value="22"> {t("22Text")} </Select.Option>
                    <Select.Option value="23"> {t("23Text")} </Select.Option>
                    <Select.Option value="24"> {t("24Text")} </Select.Option>
                    <Select.Option value="25"> {t("25Text")} </Select.Option>
                    <Select.Option value="26"> {t("26Text")} </Select.Option>
                    <Select.Option value="27"> {t("27Text")} </Select.Option>
                    <Select.Option value="28"> {t("28Text")} </Select.Option>
                    <Select.Option value="29"> {t("29Text")} </Select.Option>
                    <Select.Option value="30"> {t("30Text")} </Select.Option>
                </Select>
            </Form.Item>


        )
    }

    const enterMonthWord = () => {
        return (
            <Form.Item name="hebrewMonth" label={<label style={{ color: "white" }}> {t("monthText")} </label>} >
                <Select>
                    <Select.Option value="Nisan"> {t("NisanText")} </Select.Option>
                    <Select.Option value="Iyyar"> {t("IyyarText")} </Select.Option>
                    <Select.Option value="Sivan"> {t("SivanText")} </Select.Option>
                    <Select.Option value="Tamuz"> {t("TamuzText")} </Select.Option>
                    <Select.Option value="Av">    {t("AvText")}    </Select.Option>
                    <Select.Option value="Elul">  {t("ElulText")}   </Select.Option>
                    <Select.Option value="Tishrei"> {t("TishreiText")} </Select.Option>
                    <Select.Option value="Cheshvan"> {t("CheshvanText")} </Select.Option>
                    <Select.Option value="Kislev">  {t("KislevText")}  </Select.Option>
                    <Select.Option value="Tevet"> {t("TevetText")}  </Select.Option>
                    <Select.Option value="Shvat"> {t("ShvatText")} </Select.Option>
                    <Select.Option value="Adar">  {t("AdarText")}  </Select.Option>
                    <Select.Option value="Adar1"> {t("Adar1Text")} </Select.Option>
                    <Select.Option value="Adar2"> {t("Adar2Text")} </Select.Option>
                </Select>
            </Form.Item>
        )
    }

    const enterYearNumber = () => {
        return (
            <Form.Item name="hebrewYear" label={<label style={{ color: "white" }}> {t("yearText")} </label>} >
                <Input 
                    type="number"
                    min={1} 
                    max={100000}
                />
            </Form.Item>
        )
    }

    const fieldsStyle = {
        "BIG": "hebrew_date_input_wrapper inputs_big",
        "MEDIUM": "hebrew_date_input_wrapper inputs_medium",
        "SMALL": "hebrew_date_input_wrapper inputs_small"
    }

    return (
        <div className={fieldsStyle[isHorizontal]}>
            <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 16}}
                layout="horizontal"
                form={form}
            >
                {enterDayNumber()}
                {enterMonthWord()}
                {enterYearNumber()}

                <Form.Item style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <Button style={{margin: "auto"}} onClick={() => convertDate()}> {t("submitText")} </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

export default HebrewDateInput2;
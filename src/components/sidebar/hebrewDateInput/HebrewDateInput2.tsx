import axios from "axios";
import { useContext } from "react";
import { 
    Button,
    Form,
    Input,
    Select,
   } from "antd";
import { BoardContext } from "../../../context";

const HebrewDateInput2 = () => {
    const { setSelectedDateFromDatePicker, setToggleSidebar } = useContext(BoardContext); 
    const [form] = Form.useForm();
    
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
            <Form.Item name="hebrewDay" label="day" >
                <Input
                    type="number" 
                    min={1}
                    max={31}
                />
            </Form.Item>
        )
    }

    const enterMonthWord = () => {
        return (
            <Form.Item name="hebrewMonth" label="Month">
                <Select>
                    <Select.Option value="Nisan"> Nisan </Select.Option>
                    <Select.Option value="Iyyar"> Iyyar </Select.Option>
                    <Select.Option value="Sivan"> Sivan </Select.Option>
                    <Select.Option value="Tamuz"> Tamuz </Select.Option>
                    <Select.Option value="Av">    Av    </Select.Option>
                    <Select.Option value="Elul">  Elul   </Select.Option>
                    <Select.Option value="Tishrei"> Tishrei </Select.Option>
                    <Select.Option value="Cheshvan"> Cheshvan </Select.Option>
                    <Select.Option value="Kislev">  Kislev  </Select.Option>
                    <Select.Option value="Tevet"> Tevet  </Select.Option>
                    <Select.Option value="Shvat"> Shvat </Select.Option>
                    <Select.Option value="Adar">  Adar  </Select.Option>
                    <Select.Option value="Adar1"> Adar1 </Select.Option>
                    <Select.Option value="Adar2"> Adar2 </Select.Option>
                </Select>
            </Form.Item>
        )
    }

    const enterYearNumber = () => {
        return (
            <Form.Item name="hebrewYear" label="Year">
                <Input 
                    type="number"
                    min={1} 
                    max={100000}
                />
            </Form.Item>
        )
    }

    return (
        <div className="hebrew_date_input_wrapper">
            <div className="large_title"> PICK HEBREW DATE: </div>
            <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 16}}
                layout="horizontal"
                form={form}
            >
                {enterDayNumber()}
                {enterMonthWord()}
                {enterYearNumber()}

                <Form.Item label=" ">
                    <Button onClick={() => convertDate()}> Submit </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

export default HebrewDateInput2;